import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import axios from 'axios';

// material-ui
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Chip from '@mui/material/Chip';
import FormHelperText from '@mui/material/FormHelperText';
import OutlinedInput from '@mui/material/OutlinedInput';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';

// icons
import ArrowRightOutlined from '@ant-design/icons/ArrowRightOutlined';
import ArrowLeftOutlined from '@ant-design/icons/ArrowLeftOutlined';
import CloudUploadOutlined from '@ant-design/icons/CloudUploadOutlined';
import DeleteOutlined from '@ant-design/icons/DeleteOutlined';
import IconButton from '@mui/material/IconButton';

// project imports
import { blogsURL, createBlog } from '../../api/services';

// Rich text editor
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

// Quill toolbar configuration
const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [
      "bold",
      "italic",
      "underline",
      "strike",
      "blockquote",
      "code-block",
      "link",
      "image",
      "video",
      "formula",
      "clean",
      "code",
      "script",
    ],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["link", "image"],
    ["clean"],
  ],
};

const quillFormats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "list",
  "bullet",
  "link",
  "image",
  "video",
  "code-block",
  "blockquote",
  "formula",
  "code",
  "script",
  "indent",
];

// Validation schema
const validationSchema = Yup.object({
  title: Yup.string()
    .min(3, 'Title must be at least 3 characters')
    .max(200, 'Title must be at most 200 characters')
    .required('Title is required'),
  url: Yup.string()
    .max(300, 'URL slug must be at most 300 characters')
    .matches(/^(\/[a-zA-Z0-9-]*)*$/, 'URL slug must start with / and contain only letters, numbers, and hyphens'),
  category: Yup.array()
    .of(Yup.string())
    .min(1, 'Please select at least one category'),
  blogContent: Yup.string()
    .min(10, 'Content must be at least 10 characters')
    .required('Blog content is required'),
  metaKeywords: Yup.string()
    .max(300, 'Meta keywords must be at most 300 characters'),
  metaDescription: Yup.string()
    .max(500, 'Meta description must be at most 500 characters'),
  tags: Yup.string()
    .max(300, 'Tags must be at most 300 characters'),
  authorName: Yup.string()
    .max(100, 'Author name must be at most 100 characters')
    .matches(/^[a-zA-Z\s.']*$/, 'Author name can only contain letters, spaces, apostrophes, and dots')
});

// Shared input styling to match the project theme
const inputSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    backgroundColor: '#f9f5f0',
    '& fieldset': { borderColor: '#e8e0d8' },
    '&:hover fieldset': { borderColor: '#8B4513' },
    '&.Mui-focused fieldset': { borderColor: '#8B4513', borderWidth: '2px' }
  },
  '& .MuiInputLabel-root.Mui-focused': { color: '#8B4513' }
};

const categoriesData = [
  "Robotic Total Knee Replacement",
  "Robotic Partial knee replacement",
  "Robotic HIP Replacement",
  "Total Knee Replacement",
  "Partial knee Replacement",
  "Total Hip Replacement",
  "Shoulder and Elbow Replacement",
  "Complex Trauma surgery",
  "Pediatric Trauma Surgery",
  "Revision Trauma (Surgery)",
  "Nonunion surgery",
  "Malunion Surgeries",
  "Arthroscopic ACL Reconstruction",
  "Arthroscopic PCL Reconstruction",
  "Arthroscopic Meniscal Repair",
  "Arthroscopic Rotator Cuff Repair",
  "Arthroscopic Bankart Repair",
  "General Orthopaedics",
  "Osteoporosis",
  "Rheumatoid Arthritis",
  "Physiotherapy & Rehab",
  "General",
  "Others"
];

export default function BlogFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const { enqueueSnackbar } = useSnackbar();

  const isEdit = Boolean(id);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);

  // Image file states
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);
  // Existing image URLs (for edit mode)
  const [existingThumbnail, setExistingThumbnail] = useState(null);
  const [existingBanner, setExistingBanner] = useState(null);

  const formik = useFormik({
    initialValues: {
      title: '',
      url: '',
      category: [],
      blogContent: '',
      metaKeywords: '',
      metaDescription: '',
      tags: '',
      authorName: ''
    },
    validationSchema,
    onSubmit: async (values) => {
      setSubmitting(true);

      const tagsArray = values.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      // Build FormData for multipart upload
      const formData = new FormData();
      formData.append('title', values.title);
      formData.append('url', values.url);
      formData.append('category', values.category.join(', '));
      formData.append('blogContent', values.blogContent);
      formData.append('metaKeywords', values.metaKeywords);
      formData.append('metaDescription', values.metaDescription);
      formData.append('tags', tagsArray.join(','));
      formData.append('authorName', values.authorName);

      if (thumbnailFile) {
        formData.append('postThumbnail', thumbnailFile);
      }
      if (bannerFile) {
        formData.append('postBanner', bannerFile);
      }

      try {
        if (isEdit) {
          // API requires _method=PUT with POST for multipart
          formData.append('_method', 'PUT');
          await axios.post(`${blogsURL}?id=${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
        } else {
          await axios.post(createBlog, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
        }
        enqueueSnackbar(
          isEdit ? 'Blog updated successfully!' : 'Blog created successfully!',
          { variant: 'success' }
        );
        navigate('/blogs');
      } catch (error) {
        const msg = error?.response?.data?.message || error?.message || 'Something went wrong.';
        enqueueSnackbar(msg, { variant: 'error' });
      } finally {
        setSubmitting(false);
      }
    }
  });

  // Load blog data for editing
  useEffect(() => {
    if (isEdit) {
      const blogFromState = location.state?.blog;
      if (blogFromState) {
        populateForm(blogFromState);
      } else {
        fetchBlogById(id);
      }
    }
  }, [id]);

  const fetchBlogById = async (blogId) => {
    setLoading(true);
    try {
      const response = await axios.get(`${blogsURL}?id=${blogId}`);
      const blog = response.data?.data;
      if (blog) {
        populateForm(Array.isArray(blog) ? blog[0] : blog);
      } else {
        enqueueSnackbar('Blog not found.', { variant: 'error' });
        navigate('/blogs');
      }
    } catch (error) {
      enqueueSnackbar('Failed to load blog data.', { variant: 'error' });
      navigate('/blogs');
    } finally {
      setLoading(false);
    }
  };

  const populateForm = (editData) => {
    let tagsStr = '';
    try {
      let parsed = editData.tags || '[]';
      while (typeof parsed === 'string') {
        const next = JSON.parse(parsed);
        if (typeof next === 'string' && next === parsed) break;
        parsed = next;
      }
      if (Array.isArray(parsed)) {
        tagsStr = parsed.flat(Infinity).join(', ');
      } else if (typeof parsed === 'string') {
        tagsStr = parsed;
      }
      tagsStr = tagsStr.replace(/[\[\]"'\\]/g, '').split(',').map(t => t.trim()).filter(Boolean).join(', ');
    } catch {
      tagsStr = (typeof editData.tags === 'string' ? editData.tags : '')
        .replace(/[\[\]"'\\]/g, '').split(',').map(t => t.trim()).filter(Boolean).join(', ');
    }

    formik.setValues({
      title: editData.title || '',
      url: editData.url || '',
      category: editData.category
        ? (typeof editData.category === 'string'
          ? editData.category.split(',').map(c => c.trim()).filter(Boolean)
          : editData.category)
        : [],
      blogContent: editData.blogContent || '',
      metaKeywords: editData.metaKeywords || '',
      metaDescription: editData.metaDescription || '',
      tags: tagsStr,
      authorName: editData.authorName || ''
    });

    // Set existing image URLs for preview
    const baseUrl = 'https://aliceblue-grasshopper-530447.hostingersite.com';
    if (editData.postThumbnail) {
      const thumbUrl = editData.postThumbnail.startsWith('http') ? editData.postThumbnail : `${baseUrl}/api/${editData.postThumbnail}`;
      setExistingThumbnail(thumbUrl);
    }
    if (editData.postBanner) {
      const bannerUrl = editData.postBanner.startsWith('http') ? editData.postBanner : `${baseUrl}/api/${editData.postBanner}`;
      setExistingBanner(bannerUrl);
    }
  };

  // Handle file selection
  const handleFileChange = (type, file) => {
    if (!file) return;
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      enqueueSnackbar('Please select a valid image file (JPEG, PNG, WebP, GIF)', { variant: 'warning' });
      return;
    }
    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      enqueueSnackbar('Image must be less than 5MB', { variant: 'warning' });
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    if (type === 'thumbnail') {
      setThumbnailFile(file);
      setThumbnailPreview(previewUrl);
      setExistingThumbnail(null);
    } else {
      setBannerFile(file);
      setBannerPreview(previewUrl);
      setExistingBanner(null);
    }
  };

  const removeImage = (type) => {
    if (type === 'thumbnail') {
      setThumbnailFile(null);
      setThumbnailPreview(null);
      setExistingThumbnail(null);
    } else {
      setBannerFile(null);
      setBannerPreview(null);
      setExistingBanner(null);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress sx={{ color: '#8B4513' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 720, mx: 'auto', py: { xs: 0, sm: 0 } }}>
      {/* Top Header Row */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, px: 0.5 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            color: '#1a1a1a',
            fontSize: '1.6rem',
            letterSpacing: '-0.02em'
          }}
        >
          {isEdit ? 'Edit Blog' : 'Create New Blog'}
        </Typography>
        <Button
          startIcon={<ArrowLeftOutlined />}
          onClick={() => navigate('/blogs')}
          sx={{
            color: '#8B4513',
            fontWeight: 600,
            textTransform: 'none',
            fontSize: '0.9rem',
            '&:hover': {
              backgroundColor: 'rgba(139, 69, 19, 0.08)'
            }
          }}
        >
          Back to Blogs
        </Button>
      </Box>

      <Paper
        elevation={0}
        sx={{
          borderRadius: '20px',
          overflow: 'hidden',
          boxShadow: '0 4px 40px rgba(0,0,0,0.08)',
          background: 'linear-gradient(180deg, #ffffff 0%, #fdfaf6 100%)',
          border: '1px solid #f0ebe4'
        }}
      >
        {/* Form */}
        <Box sx={{ px: { xs: 2.5, sm: 4 }, pt: 3, pb: 4 }}>
          <form onSubmit={formik.handleSubmit} noValidate>
            <Grid container spacing={2.5} sx={{ mt: 0.5 }}>
              {/* Title */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  id="title"
                  name="title"
                  label="Title"
                  required
                  placeholder="Enter blog title"
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.title && Boolean(formik.errors.title)}
                  helperText={formik.touched.title && formik.errors.title}
                  disabled={submitting}
                  sx={inputSx}
                />
              </Grid>

              {/* URL Slug */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  id="url"
                  name="url"
                  label="URL Slug"
                  placeholder="/blogs/my-post"
                  value={formik.values.url}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.url && Boolean(formik.errors.url)}
                  helperText={formik.touched.url && formik.errors.url}
                  disabled={submitting}
                  sx={inputSx}
                />
              </Grid>

              {/* Category (Multi-select) */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl
                  fullWidth
                  error={formik.touched.category && Boolean(formik.errors.category)}
                  disabled={submitting}
                >
                  <InputLabel
                    id="category-label"
                    sx={{ '&.Mui-focused': { color: '#8B4513' } }}
                  >
                    Category
                  </InputLabel>
                  <Select
                    labelId="category-label"
                    id="category"
                    name="category"
                    multiple
                    value={Array.isArray(formik.values.category) ? formik.values.category : []}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    input={<OutlinedInput label="Category" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value} size="small" sx={{ height: 24, fontSize: '0.75rem' }} />
                        ))}
                      </Box>
                    )}
                    MenuProps={{
                      PaperProps: {
                        style: { maxHeight: 300 }
                      }
                    }}
                    sx={{
                      borderRadius: '12px',
                      backgroundColor: '#f9f5f0',
                      '& fieldset': { borderColor: '#e8e0d8' },
                      '&:hover fieldset': { borderColor: '#8B4513' },
                      '&.Mui-focused fieldset': { borderColor: '#8B4513', borderWidth: '2px' }
                    }}
                  >
                    {categoriesData.map((cat) => {
                      const isSelected = (Array.isArray(formik.values.category) ? formik.values.category : []).includes(cat);
                      return (
                        <MenuItem
                          key={cat}
                          value={cat}
                          sx={{
                            py: 0.75,
                            px: 1.5,
                            borderRadius: '8px',
                            mx: 0.5,
                            mb: 0.25,
                            backgroundColor: isSelected ? 'rgba(139, 69, 19, 0.08)' : 'transparent',
                            '&:hover': {
                              backgroundColor: isSelected ? 'rgba(139, 69, 19, 0.15)' : 'rgba(0,0,0,0.04)'
                            }
                          }}
                        >
                          <Checkbox
                            checked={isSelected}
                            size="small"
                            sx={{
                              color: '#c4a882',
                              '&.Mui-checked': { color: '#8B4513' },
                              mr: 1
                            }}
                          />
                          <ListItemText
                            primary={cat}
                            primaryTypographyProps={{
                              fontWeight: isSelected ? 700 : 400,
                              fontSize: '0.875rem',
                              color: isSelected ? '#8B4513' : 'text.primary'
                            }}
                          />
                        </MenuItem>
                      );
                    })}
                  </Select>
                  {formik.touched.category && formik.errors.category && (
                    <FormHelperText>{formik.errors.category}</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              {/* Author Name */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  id="authorName"
                  name="authorName"
                  label="Author Name"
                  placeholder="Enter author name"
                  value={formik.values.authorName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.authorName && Boolean(formik.errors.authorName)}
                  helperText={formik.touched.authorName && formik.errors.authorName}
                  disabled={submitting}
                  sx={inputSx}
                />
              </Grid>

              {/* Blog Content (Rich Text Editor) */}
              <Grid size={12}>
                <Typography
                  variant="body2"
                  sx={{
                    mb: 1,
                    fontWeight: 600,
                    color: formik.touched.blogContent && formik.errors.blogContent ? '#d32f2f' : '#666',
                    fontSize: '0.875rem'
                  }}
                >
                  Blog Content *
                </Typography>
                <Box
                  sx={{
                    '& .quill': {
                      borderRadius: '12px',
                      overflow: 'hidden',
                      backgroundColor: '#f9f5f0',
                      border: formik.touched.blogContent && formik.errors.blogContent
                        ? '2px solid #d32f2f'
                        : '1px solid #e8e0d8',
                      transition: 'border-color 0.2s ease',
                      '&:hover': {
                        borderColor: formik.touched.blogContent && formik.errors.blogContent ? '#d32f2f' : '#8B4513'
                      },
                      '&:focus-within': {
                        borderColor: '#8B4513',
                        borderWidth: '2px'
                      }
                    },
                    '& .ql-toolbar': {
                      borderTop: 'none',
                      borderLeft: 'none',
                      borderRight: 'none',
                      borderBottom: '1px solid #e8e0d8',
                      backgroundColor: '#fdfaf6'
                    },
                    '& .ql-container': {
                      border: 'none',
                      minHeight: 200,
                      fontSize: '0.95rem',
                      fontFamily: 'inherit'
                    },
                    '& .ql-editor': {
                      minHeight: 200,
                      padding: '12px 16px'
                    },
                    '& .ql-editor.ql-blank::before': {
                      color: '#a89585',
                      fontStyle: 'normal'
                    }
                  }}
                >
                  <ReactQuill
                    theme="snow"
                    value={formik.values.blogContent}
                    onChange={(content) => formik.setFieldValue('blogContent', content)}
                    onBlur={() => formik.setFieldTouched('blogContent', true)}
                    modules={quillModules}
                    formats={quillFormats}
                    placeholder="Write your blog content here..."
                    readOnly={submitting}
                  />
                </Box>
                {formik.touched.blogContent && formik.errors.blogContent && (
                  <Typography variant="caption" sx={{ color: '#d32f2f', mt: 0.5, ml: 1.75, display: 'block' }}>
                    {formik.errors.blogContent}
                  </Typography>
                )}
              </Grid>

              {/* Tags */}
              <Grid size={12}>
                <TextField
                  fullWidth
                  id="tags"
                  name="tags"
                  label="Tags"
                  placeholder="fitness, health, lifestyle"
                  value={formik.values.tags}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.tags && Boolean(formik.errors.tags)}
                  helperText={(formik.touched.tags && formik.errors.tags) || 'Comma-separated tags'}
                  disabled={submitting}
                  sx={inputSx}
                />
              </Grid>

              {/* Meta Keywords */}
              <Grid size={{ xs: 12, sm: 12 }}>
                <TextField
                  fullWidth
                  id="metaKeywords"
                  name="metaKeywords"
                  label="Meta Keywords"
                  placeholder="SEO keywords"
                  value={formik.values.metaKeywords}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.metaKeywords && Boolean(formik.errors.metaKeywords)}
                  helperText={formik.touched.metaKeywords && formik.errors.metaKeywords}
                  disabled={submitting}
                  sx={inputSx}
                />
              </Grid>

              {/* Meta Description */}
              <Grid size={{ xs: 12, sm: 12 }}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  id="metaDescription"
                  name="metaDescription"
                  label="Meta Description"
                  placeholder="SEO description"
                  value={formik.values.metaDescription}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.metaDescription && Boolean(formik.errors.metaDescription)}
                  helperText={formik.touched.metaDescription && formik.errors.metaDescription}
                  disabled={submitting}
                  sx={inputSx}
                />
              </Grid>

              {/* Image Uploads */}
              {/* <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 600, color: '#666', fontSize: '0.875rem' }}>
                  Post Thumbnail
                </Typography>
                {(thumbnailPreview || existingThumbnail) ? (
                  <Box sx={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e8e0d8' }}>
                    <Box
                      component="img"
                      src={thumbnailPreview || existingThumbnail}
                      alt="Thumbnail preview"
                      sx={{ width: '100%', height: 160, objectFit: 'cover', display: 'block' }}
                    />
                    <IconButton
                      size="small"
                      onClick={() => removeImage('thumbnail')}
                      disabled={submitting}
                      sx={{
                        position: 'absolute', top: 8, right: 8,
                        bgcolor: 'rgba(255,255,255,0.9)', color: 'error.main',
                        '&:hover': { bgcolor: 'error.main', color: '#fff' }
                      }}
                    >
                      <DeleteOutlined />
                    </IconButton>
                  </Box>
                ) : (
                  <Button
                    component="label"
                    fullWidth
                    variant="outlined"
                    startIcon={<CloudUploadOutlined />}
                    disabled={submitting}
                    sx={{
                      py: 4, borderRadius: '12px', borderStyle: 'dashed', borderColor: '#e8e0d8',
                      color: '#8B4513', backgroundColor: '#fdfaf6', textTransform: 'none', fontWeight: 600,
                      '&:hover': { borderColor: '#8B4513', backgroundColor: '#f9f5f0' }
                    }}
                  >
                    Upload Thumbnail
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={(e) => handleFileChange('thumbnail', e.target.files[0])}
                    />
                  </Button>
                )}
                <Typography variant="caption" sx={{ color: '#999', mt: 0.5, display: 'block' }}>
                  Recommended: 400×300px, max 5MB
                </Typography>
              </Grid> */}

              <Grid size={{ xs: 12, sm: 12 }}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 600, color: '#666', fontSize: '0.875rem' }}>
                  Post Banner
                </Typography>
                {(bannerPreview || existingBanner) ? (
                  <Box sx={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e8e0d8' }}>
                    <Box
                      component="img"
                      src={bannerPreview || existingBanner}
                      alt="Banner preview"
                      sx={{ width: '100%', height: 160, objectFit: 'cover', display: 'block' }}
                    />
                    <IconButton
                      size="small"
                      onClick={() => removeImage('banner')}
                      disabled={submitting}
                      sx={{
                        position: 'absolute', top: 8, right: 8,
                        bgcolor: 'rgba(255,255,255,0.9)', color: 'error.main',
                        '&:hover': { bgcolor: 'error.main', color: '#fff' }
                      }}
                    >
                      <DeleteOutlined />
                    </IconButton>
                  </Box>
                ) : (
                  <Button
                    component="label"
                    fullWidth
                    variant="outlined"
                    startIcon={<CloudUploadOutlined />}
                    disabled={submitting}
                    sx={{
                      py: 4, borderRadius: '12px', borderStyle: 'dashed', borderColor: '#e8e0d8',
                      color: '#8B4513', backgroundColor: '#fdfaf6', textTransform: 'none', fontWeight: 600,
                      '&:hover': { borderColor: '#8B4513', backgroundColor: '#f9f5f0' }
                    }}
                  >
                    Upload Banner
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={(e) => handleFileChange('banner', e.target.files[0])}
                    />
                  </Button>
                )}
                <Typography variant="caption" sx={{ color: '#999', mt: 0.5, display: 'block' }}>
                  Recommended: 1200×600px, max 5MB
                </Typography>
              </Grid>

              {/* Submit */}
              <Grid size={12}>
                <Box sx={{ mt: 1 }}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={submitting}
                    endIcon={submitting ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : <ArrowRightOutlined />}
                    sx={{
                      py: 1.6, borderRadius: '14px', fontSize: '1rem', fontWeight: 700, textTransform: 'none',
                      letterSpacing: '0.02em',
                      background: 'linear-gradient(135deg, #8B4513 0%, #A0522D 50%, #8B4513 100%)',
                      backgroundSize: '200% 200%',
                      boxShadow: '0 6px 20px rgba(139, 69, 19, 0.35)',
                      transition: 'all 0.3s ease',
                      '&:hover': { backgroundPosition: '100% 0', boxShadow: '0 8px 28px rgba(139, 69, 19, 0.45)', transform: 'translateY(-1px)' },
                      '&:active': { transform: 'translateY(0px)' },
                      '&.Mui-disabled': { background: 'linear-gradient(135deg, #8B4513 0%, #A0522D 50%, #8B4513 100%)', opacity: 0.7, color: '#fff' }
                    }}
                  >
                    {submitting ? (isEdit ? 'Updating...' : 'Publishing...') : (isEdit ? 'Update Blog' : 'Publish Blog')}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Paper>
    </Box>
  );
}
