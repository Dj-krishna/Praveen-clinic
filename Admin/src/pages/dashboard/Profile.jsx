import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useSnackbar } from 'notistack';

// material-ui
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';

// icons
import ArrowLeftOutlined from '@ant-design/icons/ArrowLeftOutlined';
import UserOutlined from '@ant-design/icons/UserOutlined';
import MailOutlined from '@ant-design/icons/MailOutlined';
import PhoneOutlined from '@ant-design/icons/PhoneOutlined';
import SafetyCertificateOutlined from '@ant-design/icons/SafetyCertificateOutlined';
import EditOutlined from '@ant-design/icons/EditOutlined';
import SaveOutlined from '@ant-design/icons/SaveOutlined';
import CloseOutlined from '@ant-design/icons/CloseOutlined';

// project imports
import Avatar from 'components/@extended/Avatar';
import { AuthContext } from '../../contexts/AuthContext';
import avatar1 from 'assets/images/users/avatar-1.png';

// Shared input styling to match the project theme
const inputSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    backgroundColor: '#faf8f5',
    '& fieldset': { borderColor: '#e8e0d8' },
    '&:hover fieldset': { borderColor: '#8B4513' },
    '&.Mui-focused fieldset': { borderColor: '#8B4513', borderWidth: '2px' }
  },
  '& .MuiInputLabel-root.Mui-focused': { color: '#8B4513' }
};

// ==============================|| PROFILE PAGE ||============================== //

export default function ProfilePage() {
  const navigate = useNavigate();
  const { state, dispatch } = useContext(AuthContext);
  const user = state?.user || {};
  const { enqueueSnackbar } = useSnackbar();

  const [isEditing, setIsEditing] = useState(false);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      userName: user.userName || '',
      email: user.email || '',
      mobile: user.mobile || ''
    },
    validationSchema: Yup.object({
      userName: Yup.string().required('Username is required'),
      email: Yup.string().email('Invalid email address').required('Email is required'),
      mobile: Yup.string().required('Mobile number is required')
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const response = await axios.put('https://drpraveenreddyortho.com/api/users/update', {
          userID: user.userID,
          userName: values.userName,
          mobile: values.mobile,
          email: values.email
        });

        if (response.data && response.data.status === 200) {
          const updatedUser = response.data.data;
          // Ensure we keep the token in local storage and context
          localStorage.setItem('authUser', JSON.stringify(updatedUser));
          dispatch({ type: 'LOGIN', payload: { user: updatedUser, token: state.token } });

          enqueueSnackbar(response.data.message || 'Profile updated successfully', { variant: 'success' });
          setIsEditing(false);
        } else {
          enqueueSnackbar(response.data.message || 'Failed to update profile', { variant: 'error' });
        }
      } catch (error) {
        enqueueSnackbar(error.response?.data?.message || 'Error updating profile', { variant: 'error' });
      } finally {
        setSubmitting(false);
      }
    }
  });

  const profileFields = [
    {
      icon: <UserOutlined style={{ fontSize: 20 }} />,
      label: 'Username',
      value: user.userName || 'N/A'
    },
    {
      icon: <MailOutlined style={{ fontSize: 20 }} />,
      label: 'Email Address',
      value: user.email || 'N/A'
    },
    {
      icon: <PhoneOutlined style={{ fontSize: 20 }} />,
      label: 'Mobile Number',
      value: user.mobile ? `${user.countryCode || ''} ${user.mobile}` : 'N/A'
    },
    {
      icon: <SafetyCertificateOutlined style={{ fontSize: 20 }} />,
      label: 'User Role',
      value: user.userRole || 'N/A',
      isChip: true
    }
  ];

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', minHeight: '80vh' }}>
      <Box sx={{ maxWidth: 800, width: '100%', py: { xs: 0, sm: 0 } }}>
        {/* Back Button */}
        <Button
          startIcon={<ArrowLeftOutlined />}
          onClick={() => navigate('/dashboard')}
          sx={{
            mb: 0,
            color: '#8B4513',
            fontWeight: 600,
            textTransform: 'none',
            fontSize: '0.9rem',
            '&:hover': {
              backgroundColor: 'rgba(139, 69, 19, 0.08)'
            }
          }}
        >
          Back to Dashboard
        </Button>

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
          {/* Header with Avatar */}
          <Box
            sx={{
              background: 'linear-gradient(135deg, #8B4513 0%, #A0522D 50%, #6B3410 100%)',
              py: 3,
              px: { xs: 2.5, sm: 4 },
              display: 'flex',
              alignItems: 'center',
              gap: 2.5
            }}
          >
            <Avatar
              alt={user.userName || 'User'}
              src={avatar1}
              sx={{
                width: 80,
                height: 80,
                flexShrink: 0,
                border: '4px solid rgba(255,255,255,0.3)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
              }}
            />
            <Box>
              <Typography
                variant="h4"
                sx={{
                  color: '#fff',
                  fontWeight: 800,
                  fontSize: '1.4rem',
                  letterSpacing: '-0.02em'
                }}
              >
                {user.userName || 'User'}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: 'rgba(255,255,255,0.75)',
                  mt: 0.5,
                  fontSize: '0.9rem'
                }}
              >
                {user.email || ''}
              </Typography>
            </Box>
          </Box>

          {/* Profile Details / Edit Form */}
          <Box sx={{ px: { xs: 2.5, sm: 4 }, py: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography
                variant="subtitle2"
                sx={{
                  color: '#8B4513',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em'
                }}
              >
                Account Information
              </Typography>
              {!isEditing ? (
                <Button
                  startIcon={<EditOutlined />}
                  size="small"
                  onClick={() => setIsEditing(true)}
                  sx={{
                    color: '#8B4513',
                    textTransform: 'none',
                    fontWeight: 600,
                    backgroundColor: 'rgba(139, 69, 19, 0.08)',
                    '&:hover': { backgroundColor: 'rgba(139, 69, 19, 0.15)' },
                    borderRadius: '8px',
                    px: 2
                  }}
                >
                  Edit Profile
                </Button>
              ) : (
                <Button
                  startIcon={<CloseOutlined />}
                  size="small"
                  onClick={() => {
                    setIsEditing(false);
                    formik.resetForm();
                  }}
                  color="error"
                  sx={{
                    textTransform: 'none',
                    fontWeight: 600,
                    backgroundColor: 'rgba(211, 47, 47, 0.08)',
                    '&:hover': { backgroundColor: 'rgba(211, 47, 47, 0.15)' },
                    borderRadius: '8px',
                    px: 2
                  }}
                >
                  Cancel Edit
                </Button>
              )}
            </Box>

            {isEditing ? (
              // Edit Form
              <form onSubmit={formik.handleSubmit} noValidate>
                <Grid container spacing={2.5}>
                  <Grid size={12}>
                    <TextField
                      fullWidth
                      id="userName"
                      name="userName"
                      label="Username"
                      value={formik.values.userName}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.userName && Boolean(formik.errors.userName)}
                      helperText={formik.touched.userName && formik.errors.userName}
                      disabled={formik.isSubmitting}
                      sx={inputSx}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      id="email"
                      name="email"
                      label="Email Address"
                      type="email"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.email && Boolean(formik.errors.email)}
                      helperText={formik.touched.email && formik.errors.email}
                      disabled={formik.isSubmitting}
                      sx={inputSx}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      id="mobile"
                      name="mobile"
                      label="Mobile Number"
                      value={formik.values.mobile}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.mobile && Boolean(formik.errors.mobile)}
                      helperText={formik.touched.mobile && formik.errors.mobile}
                      disabled={formik.isSubmitting}
                      sx={inputSx}
                      onInput={(e) => {
                        e.target.value = e.target.value.replace(/[^0-9]/g, '').slice(0, 10);
                      }}
                    />
                  </Grid>
                  <Grid size={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                      <Button
                        type="submit"
                        variant="contained"
                        disabled={formik.isSubmitting}
                        startIcon={formik.isSubmitting ? <CircularProgress size={20} color="inherit" /> : <SaveOutlined />}
                        sx={{
                          px: 3,
                          py: 1.2,
                          borderRadius: '10px',
                          fontWeight: 700,
                          textTransform: 'none',
                          fontSize: '0.9rem',
                          background: 'linear-gradient(135deg, #8B4513 0%, #A0522D 50%, #8B4513 100%)',
                          backgroundSize: '200% 200%',
                          transition: 'all 0.3s ease',
                          '&:hover': { backgroundPosition: '100% 0' }
                        }}
                      >
                        {formik.isSubmitting ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </form>
            ) : (
              // Read-only Details
              <>
                {profileFields.map((field, index) => (
                  <Box key={field.label}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        py: 2,
                        gap: 2
                      }}
                    >
                      {/* Icon */}
                      <Box
                        sx={{
                          width: 44,
                          height: 44,
                          borderRadius: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: 'rgba(139, 69, 19, 0.06)',
                          color: '#8B4513',
                          flexShrink: 0
                        }}
                      >
                        {field.icon}
                      </Box>

                      {/* Label & Value */}
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                          variant="caption"
                          sx={{
                            color: '#999',
                            fontSize: '0.75rem',
                            fontWeight: 500,
                            display: 'block',
                            mb: 0.25
                          }}
                        >
                          {field.label}
                        </Typography>
                        {field.isChip ? (
                          <Chip
                            label={field.value}
                            size="small"
                            sx={{
                              height: 26,
                              fontSize: '0.8rem',
                              fontWeight: 600,
                              backgroundColor: 'rgba(139, 69, 19, 0.08)',
                              color: '#8B4513',
                              borderRadius: '8px'
                            }}
                          />
                        ) : (
                          <Typography
                            variant="body1"
                            sx={{
                              fontWeight: 600,
                              color: '#1a1a1a',
                              fontSize: '0.95rem',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {field.value}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                    {index < profileFields.length - 1 && (
                      <Divider sx={{ borderColor: '#f0ebe4' }} />
                    )}
                  </Box>
                ))}
              </>
            )}
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
