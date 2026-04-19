import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Grid, Button } from '@mui/material';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { blogsURL, createBlog, deleteBlog, baseURL } from '../../api/services';

import PlusOutlined from '@ant-design/icons/PlusOutlined';

import BlogFormModal from './BlogFormModal';
import DeleteConfirmDialog from './DeleteConfirmDialog';
import BlogCard from './BlogCard';

const Blogs = () => {
    const [blogs, setBlogs] = useState([]);
    const { enqueueSnackbar } = useSnackbar();

    // Modal states
    const [formModalOpen, setFormModalOpen] = useState(false);
    const [editData, setEditData] = useState(null);

    // Delete dialog states
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [blogToDelete, setBlogToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const fetchBlogs = async () => {
        const response = await axios(blogsURL);
        const data = await response.data.data;
        setBlogs(data);
    };

    useEffect(() => {
        fetchBlogs();
    }, []);

    // Build full image URL from relative path
    const getImageUrl = (path) => {
        if (!path) return null;
        if (path.startsWith('http')) return path;
        return `${baseURL}/${path}`;
    };

    // Format date string to readable format
    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Parse tags JSON string safely
    const parseTags = (tagsStr) => {
        try {
            return JSON.parse(tagsStr || '[]');
        } catch {
            return [];
        }
    };

    // ---- CREATE / EDIT ----
    const handleOpenCreate = () => {
        setEditData(null);
        setFormModalOpen(true);
    };

    const handleOpenEdit = (blog) => {
        setEditData(blog);
        setFormModalOpen(true);
    };

    const handleCloseFormModal = () => {
        setFormModalOpen(false);
        setEditData(null);
    };

    const handleFormSubmit = async (payload, blogID) => {
        if (blogID) {
            // Edit (PUT)
            await axios.put(`${blogsURL}?id=${blogID}`, payload, {
                headers: { 'Content-Type': 'application/json' }
            });
        } else {
            // Create (POST)
            await axios.post(createBlog, payload, {
                headers: { 'Content-Type': 'application/json' }
            });
        }
        await fetchBlogs();
    };

    // ---- DELETE ----
    const handleOpenDelete = (blog) => {
        setBlogToDelete(blog);
        setDeleteDialogOpen(true);
    };

    const handleCloseDelete = () => {
        if (deleting) return;
        setDeleteDialogOpen(false);
        setBlogToDelete(null);
    };

    const handleConfirmDelete = async () => {
        if (!blogToDelete) return;
        setDeleting(true);
        try {
            await axios.delete(`${deleteBlog}?id=${blogToDelete.blogID}`);
            enqueueSnackbar('Blog deleted successfully!', { variant: 'success' });
            await fetchBlogs();
        } catch (error) {
            const msg = error?.response?.data?.message || error?.message || 'Failed to delete blog.';
            enqueueSnackbar(msg, { variant: 'error' });
        } finally {
            setDeleting(false);
            setDeleteDialogOpen(false);
            setBlogToDelete(null);
        }
    };

    return (
        <Box component="section" sx={{ py: 3, bgcolor: 'grey.50' }} id="blogs">
            <Container maxWidth="lg">
                {/* Header + Create Button */}
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'stretch', sm: 'center' }, justifyContent: 'space-between', mb: 4, gap: 2 }}>
                    <Box>
                        <Typography variant="h3" component="h2" sx={{ fontWeight: 800, color: 'text.primary', mb: 0.5 }}>
                            Latest Medical News & Blogs
                        </Typography>
                        <Typography variant="h6" color="text.secondary">
                            Insights and updates from our healthcare professionals.
                        </Typography>
                    </Box>
                    <Button
                        variant="contained"
                        startIcon={<PlusOutlined />}
                        onClick={handleOpenCreate}
                        sx={{
                            borderRadius: '10px', textTransform: 'none', fontWeight: 700, fontSize: '0.85rem',
                            px: 2.5, py: 1, flexShrink: 0, alignSelf: { xs: 'stretch', sm: 'center' },
                            background: 'linear-gradient(135deg, #8B4513 0%, #A0522D 100%)',
                            boxShadow: '0 4px 14px rgba(139, 69, 19, 0.3)',
                            transition: 'all 0.25s ease',
                            '&:hover': {
                                boxShadow: '0 6px 20px rgba(139, 69, 19, 0.45)',
                                transform: 'translateY(-1px)',
                                background: 'linear-gradient(135deg, #7a3c10 0%, #8B4513 100%)'
                            },
                            '&:active': { transform: 'translateY(0px)' }
                        }}
                    >
                        Create Blog
                    </Button>
                </Box>

                {/* Blog Cards Grid */}
                <Grid container spacing={4}>
                    {blogs.map((blog) => (
                        <BlogCard
                            key={blog.blogID}
                            blog={blog}
                            getImageUrl={getImageUrl}
                            formatDate={formatDate}
                            parseTags={parseTags}
                            handleOpenEdit={handleOpenEdit}
                            handleOpenDelete={handleOpenDelete}
                        />
                    ))}
                </Grid>
            </Container>

            {/* Create / Edit Modal */}
            <BlogFormModal
                open={formModalOpen}
                onClose={handleCloseFormModal}
                onSubmit={handleFormSubmit}
                editData={editData}
            />

            {/* Delete Confirmation Dialog */}
            <DeleteConfirmDialog
                open={deleteDialogOpen}
                onClose={handleCloseDelete}
                onConfirm={handleConfirmDelete}
                blogTitle={blogToDelete?.title || ''}
                deleting={deleting}
            />
        </Box>
    );
};

export default Blogs;
