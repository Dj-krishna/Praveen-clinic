import React from 'react';
import { Card, CardContent, CardActions, Typography, Box, Chip, IconButton, Tooltip, Grid } from '@mui/material';
import BlogImage from './BlogImage';
import EditOutlined from '@ant-design/icons/EditOutlined';
import DeleteOutlined from '@ant-design/icons/DeleteOutlined';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.bubble.css';

const BlogCard = ({ blog, getImageUrl, formatDate, parseTags, handleOpenEdit, handleOpenDelete }) => {
    return (
        <Grid size={{ xs: 12, sm: 6, md: 6 }}>
            <Card
                elevation={0}
                sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 3,
                    border: '1px solid',
                    borderColor: 'grey.200',
                    overflow: 'hidden',
                    transition: 'all 0.3s ease-in-out',
                    position: 'relative',
                    '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 16px rgba(0,0,0,0.08)'
                    },
                    '&:hover .blog-action-icons': {
                        opacity: 1
                    }
                }}
            >
                {/* Edit / Delete icon buttons – visible on hover */}
                <Box
                    className="blog-action-icons"
                    sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        display: 'flex',
                        gap: 0.5,
                        zIndex: 2,
                        opacity: { xs: 1, md: 0 },
                        transition: 'opacity 0.25s ease'
                    }}
                >
                    <Tooltip title="Edit">
                        <IconButton
                            size="small"
                            onClick={() => handleOpenEdit(blog)}
                            sx={{
                                bgcolor: 'rgba(255,255,255,0.9)',
                                backdropFilter: 'blur(4px)',
                                color: '#8B4513',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                                '&:hover': { bgcolor: '#8B4513', color: '#fff' }
                            }}
                        >
                            <EditOutlined />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                        <IconButton
                            size="small"
                            onClick={() => handleOpenDelete(blog)}
                            sx={{
                                bgcolor: 'rgba(255,255,255,0.9)',
                                backdropFilter: 'blur(4px)',
                                color: 'error.main',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                                '&:hover': { bgcolor: 'error.main', color: '#fff' }
                            }}
                        >
                            <DeleteOutlined />
                        </IconButton>
                    </Tooltip>
                </Box>

                <BlogImage
                    src={getImageUrl(blog.postThumbnail || blog.postBanner)}
                    alt={blog.title}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 600, mb: 1 }}>
                        {blog.category}
                    </Typography>
                    <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                        {blog.title}
                    </Typography>
                    {/* <Box
                        sx={{
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            mb: 1.5,
                            '& .ql-editor': {
                                padding: 0,
                                fontSize: '0.875rem',
                                lineHeight: 1.6,
                                color: 'text.secondary'
                            },
                            '& .ql-editor img': { display: 'none' }
                        }}
                    >
                        <ReactQuill
                            value={blog.blogContent || ''}
                            readOnly
                            theme="bubble"
                            modules={{ toolbar: false }}
                        />
                    </Box> */}

                    {/* Tags */}
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {parseTags(blog.tags).map((tag) => (
                            <Chip
                                key={tag}
                                label={tag}
                                size="small"
                                variant="outlined"
                                sx={{ fontSize: '0.7rem', height: 22 }}
                            />
                        ))}
                    </Box>
                </CardContent>
                <CardActions sx={{ px: 2, pb: 2, pt: 0, flexDirection: 'column', alignItems: 'flex-start' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', px: 1, mb: 2 }}>
                        <Typography variant="caption" color="text.disabled">
                            {formatDate(blog.dateOfPost)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                            {blog.authorName}
                        </Typography>
                    </Box>
                </CardActions>
            </Card>
        </Grid>
    );
};

export default BlogCard;
