import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// material-ui
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';

// icons
import ArrowRightOutlined from '@ant-design/icons/ArrowRightOutlined';
import ArrowLeftOutlined from '@ant-design/icons/ArrowLeftOutlined';

// project imports
import { createAppointment } from '../../api/services';

const validationSchema = Yup.object({
  fullName: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be at most 50 characters')
    .matches(/^[a-zA-Z\s.]+$/, 'Name can only contain letters, spaces, and dots')
    .required('Full Name is required'),
  mobile: Yup.string()
    .matches(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian phone number')
    .required('Phone Number is required'),
  gender: Yup.string()
    .oneOf(['Male', 'Female', 'Other'], 'Please select a valid gender')
    .required('Gender is required'),
  age: Yup.number()
    .typeError('Age must be a number')
    .min(1, 'Age must be at least 1')
    .max(120, 'Age must be at most 120')
    .integer('Age must be a whole number')
    .required('Age is required'),
  date: Yup.date()
    .min(new Date(new Date().setHours(0, 0, 0, 0)), 'Date cannot be in the past')
    .required('Date is required'),
  email: Yup.string()
    .email('Enter a valid email address')
});

const inputSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    backgroundColor: '#f9f5f0',
    '& fieldset': {
      borderColor: '#e8e0d8'
    },
    '&:hover fieldset': {
      borderColor: '#8B4513'
    },
    '&.Mui-focused fieldset': {
      borderColor: '#8B4513',
      borderWidth: '2px'
    }
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: '#8B4513'
  }
};

const selectSx = {
  borderRadius: '12px',
  backgroundColor: '#f9f5f0',
  '& fieldset': {
    borderColor: '#e8e0d8'
  },
  '&:hover fieldset': {
    borderColor: '#8B4513'
  },
  '&.Mui-focused fieldset': {
    borderColor: '#8B4513',
    borderWidth: '2px'
  }
};

export default function AddAppointmentPage() {
  const [submitting, setSubmitting] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      fullName: '',
      mobile: '',
      gender: '',
      age: '',
      date: '',
      email: ''
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      setSubmitting(true);

      try {
        // Build the request payload matching the API shape
        const payload = {
          fullName: values.fullName,
          mobile: values.mobile,
          countryCode: '+91',
          gender: values.gender,
          age: Number(values.age),
          dateOfBirth: '',
          email: values.email || '',
          doctorID: 1,
          appointmentDate: `${values.date} 10:00:00`
        };

        await axios.post(createAppointment, payload, {
          headers: { 'Content-Type': 'application/json' }
        });

        enqueueSnackbar('Appointment booked successfully!', { variant: 'success' });
        resetForm();
        // Navigate back to dashboard after successful booking
        navigate('/dashboard');
      } catch (error) {
        const errorMsg =
          error?.response?.data?.message ||
          error?.message ||
          'Failed to book appointment. Please try again.';
        enqueueSnackbar(errorMsg, { variant: 'error' });
      } finally {
        setSubmitting(false);
      }
    }
  });

  return (
    <Box sx={{ maxWidth: 720, mx: 'auto', py: { xs: 0, sm: 0 } }}>
      {/* Top Header Row */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, px: 0.5 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            color: '#1a1a1a',
            fontSize: '1.6rem',
            letterSpacing: '-0.02em'
          }}
        >
          Book An Appointment
        </Typography>
        <Button
          startIcon={<ArrowLeftOutlined />}
          onClick={() => navigate('/dashboard')}
          sx={{
            color: '#8B4513',
            fontWeight: 600,
            textTransform: 'none',
            fontSize: '0.9rem',
            '&:hover': {
              backgroundColor: 'rgba(139, 69, 19, 0.08)'
            }
          }}
        >
          Back to Appointments
        </Button>
      </Box>

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
        {/* Form */}
        <Box sx={{ px: { xs: 2.5, sm: 4 }, pt: 3, pb: 4 }}>
          <form onSubmit={formik.handleSubmit} noValidate>
            <Grid container spacing={2.5} sx={{ mt: 0.5 }}>
              {/* Full Name */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  id="fullName"
                  name="fullName"
                  label="Full Name"
                  required
                  placeholder="Enter full name"
                  value={formik.values.fullName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.fullName && Boolean(formik.errors.fullName)}
                  helperText={formik.touched.fullName && formik.errors.fullName}
                  disabled={submitting}
                  sx={inputSx}
                />
              </Grid>

              {/* Phone Number */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  id="mobile"
                  name="mobile"
                  label="Phone Number"
                  required
                  placeholder="Enter phone number"
                  value={formik.values.mobile}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.mobile && Boolean(formik.errors.mobile)}
                  helperText={formik.touched.mobile && formik.errors.mobile}
                  disabled={submitting}
                  sx={inputSx}
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/[^0-9]/g, '').slice(0, 10);
                  }}
                />
              </Grid>

              {/* Gender */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl
                  fullWidth
                  error={formik.touched.gender && Boolean(formik.errors.gender)}
                  required
                  disabled={submitting}
                >
                  <InputLabel
                    id="gender-label"
                    sx={{
                      '&.Mui-focused': {
                        color: '#8B4513'
                      }
                    }}
                  >
                    Select Gender
                  </InputLabel>
                  <Select
                    labelId="gender-label"
                    id="gender"
                    name="gender"
                    value={formik.values.gender}
                    label="Select Gender"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    sx={selectSx}
                  >
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </Select>
                  {formik.touched.gender && formik.errors.gender && (
                    <FormHelperText>{formik.errors.gender}</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              {/* Age */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  id="age"
                  name="age"
                  label="Age"
                  required
                  type="number"
                  placeholder="Enter age"
                  value={formik.values.age}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.age && Boolean(formik.errors.age)}
                  helperText={formik.touched.age && formik.errors.age}
                  disabled={submitting}
                  InputProps={{
                    inputProps: { min: 1, max: 120 }
                  }}
                  sx={inputSx}
                />
              </Grid>

              {/* Date */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  id="date"
                  name="date"
                  label="Appointment Date"
                  required
                  type="date"
                  value={formik.values.date}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.date && Boolean(formik.errors.date)}
                  helperText={formik.touched.date && formik.errors.date}
                  disabled={submitting}
                  InputLabelProps={{
                    shrink: true
                  }}
                  inputProps={{
                    min: new Date().toISOString().split('T')[0]
                  }}
                  sx={inputSx}
                />
              </Grid>

              {/* Email */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  id="email"
                  name="email"
                  label="Email Address"
                  placeholder="Enter email address"
                  type="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                  disabled={submitting}
                  sx={inputSx}
                />
              </Grid>

              {/* Submit Button */}
              <Grid size={12}>
                <Box sx={{ mt: 1 }}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={submitting}
                    endIcon={
                      submitting ? (
                        <CircularProgress size={20} sx={{ color: '#fff' }} />
                      ) : (
                        <ArrowRightOutlined />
                      )
                    }
                    sx={{
                      py: 1.6,
                      borderRadius: '14px',
                      fontSize: '1rem',
                      fontWeight: 700,
                      textTransform: 'none',
                      letterSpacing: '0.02em',
                      background: 'linear-gradient(135deg, #8B4513 0%, #A0522D 50%, #8B4513 100%)',
                      backgroundSize: '200% 200%',
                      boxShadow: '0 6px 20px rgba(139, 69, 19, 0.35)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        backgroundPosition: '100% 0',
                        boxShadow: '0 8px 28px rgba(139, 69, 19, 0.45)',
                        transform: 'translateY(-1px)'
                      },
                      '&:active': {
                        transform: 'translateY(0px)'
                      },
                      '&.Mui-disabled': {
                        background: 'linear-gradient(135deg, #8B4513 0%, #A0522D 50%, #8B4513 100%)',
                        opacity: 0.7,
                        color: '#fff'
                      }
                    }}
                  >
                    {submitting ? 'Booking Appointment...' : 'Complete Your Appointment Now'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Paper>
    </Box>
  );
}
