const Blog = require('../models/Blogs');
const getNextSequence = require('../utils/getNextSequence');

// Safe file URL extraction (ImageKit or Multer)
const getFileUrl = (fileArr) => {
  if (!fileArr || !Array.isArray(fileArr) || fileArr.length === 0) return null;
  const f = fileArr[0];
  return f.url || f.path || f.location || null;
};

// Normalize arrays (same helper as doctorController)
const normalizeArray = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed;
    } catch (_) {
      // fallback to comma-split
    }
    return value.split(',').map((s) => s.trim()).filter(Boolean);
  }
  return [];
};

// Validate and normalize blog input
const validateAndNormalizeBlog = async (blog, isUpdate = false) => {
  const errors = [];
  let normalizedBlog = { ...blog };

  // Required fields only for create
  if (!isUpdate) {
    if (!normalizedBlog.title) errors.push('title is required');
  }

  normalizedBlog.tags = normalizeArray(normalizedBlog.tags);

  if (normalizedBlog.dateOfPost) {
    const date = new Date(normalizedBlog.dateOfPost);
    if (isNaN(date.valueOf())) {
      errors.push('dateOfPost must be a valid date');
    } else {
      normalizedBlog.dateOfPost = date;
    }
  }

  return { normalizedBlog, errors };
};

// Build filter from query for search
const buildBlogFilter = (query) => {
  const filter = {};
  const regexMatchFields = ['category', 'authorName', 'tags'];

  for (const key in query) {
    const value = query[key];
    if (!value) continue;

    if (key === 'blogID') {
      filter[key] = Number(value);
    } else if (regexMatchFields.includes(key)) {
      if (key === 'tags') {
        filter[key] = { $elemMatch: { $regex: value, $options: 'i' } };
      } else {
        filter[key] = { $regex: value, $options: 'i' };
      }
    } else {
      filter[key] = { $regex: value, $options: 'i' };
    }
  }
  return filter;
};

// GET /blogs
exports.getBlogs = async (req, res) => {
  try {
    const filter = buildBlogFilter(req.query);
    const blogs = await Blog.find(filter).sort({ dateOfPost: -1 });

    if (blogs.length === 0) {
      return res.status(404).json({ success: false, message: 'No blogs found matching the criteria.', data: [] });
    }

    if (req.query.blogID) {
      res.json({ success: true, message: 'Blog retrieved successfully', data: blogs[0] });
    } else {
      res.json({ success: true, message: 'Blogs retrieved successfully', count: blogs.length, data: blogs });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// POST /blogs
exports.addBlog = async (req, res) => {
  try {
    let payload = req.body;
    if (!payload || typeof payload !== 'object') {
      return res.status(400).json({ success: false, error: 'Invalid request body' });
    }

    const { normalizedBlog, errors } = await validateAndNormalizeBlog(payload);
    if (errors.length > 0) {
      return res.status(400).json({ success: false, error: 'Validation failed', details: errors });
    }

    if (!normalizedBlog.blogID) {
      normalizedBlog.blogID = await getNextSequence('blogID');
    }

    // Handle file uploads
    if (req.files && req.files.postThumbnail) {
      normalizedBlog.postThumbnail = getFileUrl(req.files.postThumbnail);
    }

    if (req.files && req.files.postBanner) {
      normalizedBlog.postBanner = getFileUrl(req.files.postBanner);
    }

    const saved = await new Blog(normalizedBlog).save();

    res.status(201).json({ success: true, message: 'Blog created successfully', data: saved });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// PUT /blogs/:blogID
exports.updateBlog = async (req, res) => {
  try {
    const blogID = req.query.blogID;
    if (!blogID) {
      return res.status(400).json({ success: false, error: 'blogID is required in query parameter' });
    }

    let updateData = { ...req.body };
    if (typeof updateData === 'string') {
      try {
        updateData = JSON.parse(updateData);
      } catch (e) {
        return res.status(400).json({ success: false, error: 'Invalid JSON in body' });
      }
    }

    delete updateData._id;
    delete updateData.blogID;

    const { normalizedBlog, errors } = await validateAndNormalizeBlog(updateData, true);
    if (errors.length > 0) {
      return res.status(400).json({ success: false, error: 'Validation failed', details: errors });
    }

    // Handle file uploads
    if (req.files && req.files.postThumbnail) {
      normalizedBlog.postThumbnail = getFileUrl(req.files.postThumbnail);
    }

    if (req.files && req.files.postBanner) {
      normalizedBlog.postBanner = getFileUrl(req.files.postBanner);
    }

    const filter = { blogID: Number(blogID) };
    const result = await Blog.updateOne(filter, { $set: normalizedBlog });

    if (result.matchedCount === 0) {
      return res.status(404).json({ success: false, message: 'No blog found to update' });
    }

    const updatedBlog = await Blog.findOne(filter);

    res.json({ success: true, message: 'Blog updated successfully', data: updatedBlog });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// DELETE /blogs
exports.deleteBlogs = async (req, res) => {
  try {
    let filter = {};
    if (req.params.ids) {
      const ids = req.params.ids.split(',').map((id) => Number(id.trim())).filter((id) => !isNaN(id));
      filter = { blogID: { $in: ids } };
    } else if (req.query.blogID) {
      filter = { blogID: Number(req.query.blogID) };
    } else if (req.body.filter) {
      filter = req.body.filter;
    } else {
      return res.status(400).json({ success: false, error: 'No filter provided.' });
    }

    const toDelete = await Blog.find(filter);
    if (toDelete.length === 0) {
      return res.status(404).json({ success: false, message: 'No blogs found' });
    }

    const result = await Blog.deleteMany(filter);

    res.json({
      success: true,
      message: result.deletedCount === 1 ? 'Blog deleted successfully' : 'Blogs deleted successfully',
      deletedCount: result.deletedCount,
      data: toDelete,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
