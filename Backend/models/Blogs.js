const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  blogID: { type: Number, required: true, unique: true },
  title: { type: String },
  url: { type: String },
  category: { type: String },
  blogContent: { type: String },
  postThumbnail: { type: String, default: null },
  postBanner: { type: String },
  metaKeywords: { type: String },
  metaDescription: { type: String },
  tags: [{ type: String }],
  authorName: { type: String },
  dateOfPost: { type: Date, default: Date.now }
}, {
  versionKey: false
});

module.exports = mongoose.model('Blog', blogSchema);
