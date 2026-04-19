import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Fade from '@mui/material/Fade';
import CircularProgress from '@mui/material/CircularProgress';
import DeleteOutlined from '@ant-design/icons/DeleteOutlined';

const DeleteConfirmDialog = ({ open, onClose, onConfirm, blogTitle, deleting }) => (
    <Dialog
        open={open}
        onClose={onClose}
        maxWidth="xs"
        fullWidth
        TransitionComponent={Fade}
        slotProps={{
            paper: {
                sx: {
                    borderRadius: '16px',
                    boxShadow: '0 16px 48px rgba(0,0,0,0.15)',
                    p: 1
                }
            },
            backdrop: {
                sx: { backgroundColor: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(4px)' }
            }
        }}
    >
        <DialogTitle sx={{ fontWeight: 700, fontSize: '1.15rem', pb: 0.5 }}>
            Delete Blog
        </DialogTitle>
        <DialogContent>
            <Typography variant="body2" color="text.secondary">
                Are you sure you want to delete <strong>"{blogTitle}"</strong>? This action cannot be undone.
            </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
            <Button onClick={onClose} disabled={deleting} sx={{ textTransform: 'none', fontWeight: 600 }}>
                Cancel
            </Button>
            <Button
                onClick={onConfirm}
                disabled={deleting}
                variant="contained"
                color="error"
                startIcon={deleting ? <CircularProgress size={16} color="inherit" /> : <DeleteOutlined />}
                sx={{ textTransform: 'none', fontWeight: 600, borderRadius: '10px' }}
            >
                {deleting ? 'Deleting...' : 'Delete'}
            </Button>
        </DialogActions>
    </Dialog>
);

export default DeleteConfirmDialog;
