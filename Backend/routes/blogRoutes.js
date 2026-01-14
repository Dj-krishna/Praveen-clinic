const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const { blogFilesMiddleware } = require('../middlewares/blog-files');

// ---------------- GET ----------------
router.get('/', blogController.getBlogs);

// ---------------- POST ----------------
router.post('/', blogFilesMiddleware, blogController.addBlog);

// ---------------- PUT ----------------
router.put('/', blogFilesMiddleware, blogController.updateBlog);

// ---------------- DELETE ----------------
router.delete('/bulk/:ids', blogController.deleteBlogs);
router.delete('/', blogController.deleteBlogs);

module.exports = router;
