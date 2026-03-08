import React from 'react';
import { Box, Container, Typography, Grid, Card, CardMedia, CardContent, CardActions, Button } from '@mui/material';

const blogs = [
    {
        id: 1,
        title: "Advancements in Modern Surgery",
        description: "Explore how our latest robotic-assisted technologies are improving patient outcomes and recovery times.",
        date: "November 15, 2023",
        image: "https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=800",
        category: "Technology"
    },
    {
        id: 2,
        title: "Understanding Heart Health",
        description: "Our leading cardiologists share essential tips for maintaining a healthy heart through diet and exercise.",
        date: "November 10, 2023",
        image: "https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?auto=format&fit=crop&q=80&w=800",
        category: "Wellness"
    }
];

const Blogs = () => {
    return (
        <Box component="section" sx={{ py: 3, bgcolor: 'grey.50' }} id="blogs">
            <Container maxWidth="lg">
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h3" component="h2" sx={{ fontWeight: 800, color: 'text.primary', mb: 2 }}>
                        Latest Medical News & Blogs
                    </Typography>
                    <Typography variant="h6" color="text.secondary">
                        Insights and updates from our healthcare professionals.
                    </Typography>
                </Box>

                <Grid container spacing={4}>
                    {blogs.map((blog) => (
                        <Grid key={blog.id} size={{ xs: 12, sm: 6, md: 6 }}>
                            <Card
                                elevation={0}
                                sx={{
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    borderRadius: 3, // Roughly 12px depending on theme
                                    border: '1px solid',
                                    borderColor: 'grey.200',
                                    overflow: 'hidden',
                                    transition: 'all 0.3s ease-in-out',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: '0 8px 16px rgba(0,0,0,0.08)'
                                    }
                                }}
                            >
                                <CardMedia
                                    component="img"
                                    height="150"
                                    image={blog.image}
                                    alt={blog.title}
                                />
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 600, mb: 1 }}>
                                        {blog.category}
                                    </Typography>
                                    <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                                        {blog.title}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{
                                            display: '-webkit-box',
                                            WebkitLineClamp: 3,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden'
                                        }}
                                    >
                                        {blog.description}
                                    </Typography>
                                </CardContent>
                                <CardActions sx={{ px: 2, pb: 2, pt: 0, flexDirection: 'column', alignItems: 'flex-start' }}>
                                    <Typography variant="caption" color="text.disabled" sx={{ mb: 2, px: 1 }}>
                                        {blog.date}
                                    </Typography>
                                    <Box sx={{ width: '100%', px: 1 }}>
                                        <Button
                                            disableElevation
                                            variant="outlined"
                                            color="primary"
                                            fullWidth
                                            sx={{ 
                                                fontWeight: 'bold', 
                                                textTransform: 'none',
                                                borderRadius: 2,
                                                '&:hover': {
                                                    backgroundColor: 'primary.main',
                                                    color: 'white'
                                                }
                                            }}
                                        >
                                            Read Full Article
                                        </Button>
                                    </Box>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
};

export default Blogs;
