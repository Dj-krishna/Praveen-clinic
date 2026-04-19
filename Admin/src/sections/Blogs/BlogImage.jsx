import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import FileImageOutlined from '@ant-design/icons/FileImageOutlined';

const BlogImage = ({ src, alt }) => {
    const [hasError, setHasError] = React.useState(false);

    // Reset error state when src changes
    React.useEffect(() => {
        setHasError(false);
    }, [src]);

    if (!src || hasError) {
        return (
            <Box
                sx={{
                    height: 150,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: '#f5f0eb',
                    color: '#b8a99a',
                    gap: 1
                }}
            >
                <FileImageOutlined style={{ fontSize: 36, opacity: 0.6 }} />
                <Typography variant="caption" sx={{ color: '#b8a99a', fontWeight: 500 }}>
                    No Image Available
                </Typography>
            </Box>
        );
    }

    return (
        <Box
            component="img"
            src={src}
            alt={alt}
            onError={() => setHasError(true)}
            sx={{
                width: '100%',
                height: 150,
                objectFit: 'cover',
                display: 'block'
            }}
        />
    );
};

export default BlogImage;
