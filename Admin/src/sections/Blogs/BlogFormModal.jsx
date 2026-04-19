import React, { useState, useEffect } from 'react';
import {
    Dialog, DialogTitle, DialogContent, Button, Box, Typography,
    IconButton, Fade, CircularProgress, TextField, Grid
} from '@mui/material';
import { useSnackbar } from 'notistack';
import CloseOutlined from '@ant-design/icons/CloseOutlined';
import ArrowRightOutlined from '@ant-design/icons/ArrowRightOutlined';

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

const BlogFormModal = ({ open, onClose, onSubmit, editData }) => {
    const isEdit = Boolean(editData);
    const [submitting, setSubmitting] = useState(false);
    const { enqueueSnackbar } = useSnackbar();

    const [form, setForm] = useState({
        title: '',
        url: '',
        category: '',
        blogContent: '',
        metaKeywords: '',
        metaDescription: '',
        tags: '',
        authorName: ''
    });

    // Pre-fill form when editing
    useEffect(() => {
        if (editData) {
            let tagsStr = '';
            try {
                let parsed = editData.tags || '[]';
                // Recursively parse in case of double-encoded strings from DB
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
                
                // Clean up any residual JSON characters if strongly corrupted
                tagsStr = tagsStr.replace(/[\[\]"'\\]/g, '').split(',').map(t => t.trim()).filter(Boolean).join(', ');
            } catch {
                tagsStr = (typeof editData.tags === 'string' ? editData.tags : '').replace(/[\[\]"'\\]/g, '').split(',').map(t => t.trim()).filter(Boolean).join(', ');
            }

            setForm({
                title: editData.title || '',
                url: editData.url || '',
                category: editData.category || '',
                blogContent: editData.blogContent || '',
                metaKeywords: editData.metaKeywords || '',
                metaDescription: editData.metaDescription || '',
                tags: tagsStr,
                authorName: editData.authorName || ''
            });
        } else {
            setForm({
                title: '',
                url: '',
                category: '',
                blogContent: '',
                metaKeywords: '',
                metaDescription: '',
                tags: '',
                authorName: ''
            });
        }
    }, [editData, open]);

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.title.trim() || !form.blogContent.trim()) {
            enqueueSnackbar('Title and Content are required.', { variant: 'warning' });
            return;
        }
        setSubmitting(true);

        const tagsArray = form.tags
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean);

        const payload = {
            ...form,
            tags: tagsArray // Send array raw, API expects array and stringifies internally
        };

        try {
            await onSubmit(payload, editData?.blogID);
            enqueueSnackbar(
                isEdit ? 'Blog updated successfully!' : 'Blog created successfully!',
                { variant: 'success' }
            );
            onClose();
        } catch (error) {
            const msg = error?.response?.data?.message || error?.message || 'Something went wrong.';
            enqueueSnackbar(msg, { variant: 'error' });
        } finally {
            setSubmitting(false);
        }
    };

    const handleClose = () => {
        if (submitting) return;
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
            TransitionComponent={Fade}
            TransitionProps={{ timeout: 400 }}
            slotProps={{
                paper: {
                    sx: {
                        borderRadius: '20px',
                        overflow: 'hidden',
                        boxShadow: '0 24px 80px rgba(0,0,0,0.15)',
                        background: 'linear-gradient(180deg, #ffffff 0%, #fdfaf6 100%)'
                    }
                },
                backdrop: {
                    sx: {
                        backgroundColor: 'rgba(0,0,0,0.4)',
                        backdropFilter: 'blur(6px)'
                    }
                }
            }}
        >
            {/* Close Button */}
            <IconButton
                aria-label="close"
                onClick={handleClose}
                disabled={submitting}
                sx={{
                    position: 'absolute', right: 16, top: 16, color: '#8B4513', zIndex: 1,
                    bgcolor: 'rgba(139, 69, 19, 0.08)',
                    '&:hover': { bgcolor: 'rgba(139, 69, 19, 0.16)' }
                }}
            >
                <CloseOutlined />
            </IconButton>

            {/* Header */}
            <DialogTitle component="div" sx={{ textAlign: 'center', pt: 4, pb: 0 }}>
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#1a1a1a', fontSize: '1.6rem', letterSpacing: '-0.02em' }}>
                    {isEdit ? 'Edit Blog' : 'Create New Blog'}
                </Typography>
                <Typography variant="body2" sx={{ color: '#666', mt: 1.5, fontSize: '0.9rem', maxWidth: 400, mx: 'auto' }}>
                    {isEdit ? 'Update the blog details below.' : 'Fill in the details to publish a new blog post.'}
                </Typography>
            </DialogTitle>

            {/* Form */}
            <DialogContent sx={{ px: { xs: 2.5, sm: 4 }, pt: 3, pb: 4 }}>
                <form onSubmit={handleSubmit} noValidate>
                    <Grid container spacing={2.5} sx={{ mt: 0.5 }}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField fullWidth name="title" label="Title *" value={form.title} onChange={handleChange} disabled={submitting} sx={inputSx} />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField fullWidth name="url" label="URL Slug" placeholder="/blogs/my-post" value={form.url} onChange={handleChange} disabled={submitting} sx={inputSx} />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField fullWidth name="category" label="Category" value={form.category} onChange={handleChange} disabled={submitting} sx={inputSx} />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField fullWidth name="authorName" label="Author Name" value={form.authorName} onChange={handleChange} disabled={submitting} sx={inputSx} />
                        </Grid>
                        <Grid size={12}>
                            <TextField fullWidth multiline rows={4} name="blogContent" label="Blog Content *" value={form.blogContent} onChange={handleChange} disabled={submitting} sx={inputSx} />
                        </Grid>
                        <Grid size={12}>
                            <TextField fullWidth name="tags" label="Tags" placeholder="fitness, health, lifestyle" value={form.tags} onChange={handleChange} disabled={submitting} helperText="Comma-separated tags" sx={inputSx} />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField fullWidth name="metaKeywords" label="Meta Keywords" value={form.metaKeywords} onChange={handleChange} disabled={submitting} sx={inputSx} />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField fullWidth name="metaDescription" label="Meta Description" value={form.metaDescription} onChange={handleChange} disabled={submitting} sx={inputSx} />
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
            </DialogContent>
        </Dialog>
    );
};

export default BlogFormModal;
