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
    },
    {
        id: 3,
        title: "Mental Health Awareness",
        description: "Breaking the stigma: why mental health is just as important as physical health in today's fast-paced world.",
        date: "November 05, 2023",
        image: "https://images.unsplash.com/photo-1527137342181-19aab11a8ee1?auto=format&fit=crop&q=80&w=800",
        category: "Mental Health"
    }
];

const Blogs = () => {
    return (
        <Box component="section" sx={{ py: 3, bgcolor: 'grey.50' }} id="blogs">
            <Container maxWidth="lg">
                <Box>
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
                                sx={{
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    transition: 'transform 0.3s ease-in-out',
                                    '&:hover': {
                                        transform: 'translateY(-8px)'
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
                                <CardActions sx={{ px: 2, pb: 2, flexDirection: 'column', alignItems: 'flex-start' }}>
                                    <Typography variant="caption" color="text.disabled" sx={{ mb: 1, px: 1 }}>
                                        {blog.date}
                                    </Typography>
                                    <Button
                                        size="small"
                                        color="primary"
                                        sx={{ fontWeight: 'bold', textTransform: 'none' }}
                                    >
                                        Read Full Article &rarr;
                                    </Button>
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
