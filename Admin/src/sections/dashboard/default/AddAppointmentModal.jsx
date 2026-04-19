import PropTypes from 'prop-types';
import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';

// material-ui
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Fade from '@mui/material/Fade';
import CircularProgress from '@mui/material/CircularProgress';

// icons
import CloseOutlined from '@ant-design/icons/CloseOutlined';
import ArrowRightOutlined from '@ant-design/icons/ArrowRightOutlined';

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

export default function AddAppointmentModal({ open, onClose, onSubmit }) {
  const [submitting, setSubmitting] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

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

        if (onSubmit) {
          await onSubmit(payload);
        }

        enqueueSnackbar('Appointment booked successfully!', { variant: 'success' });
        resetForm();
        onClose();
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

  const handleClose = () => {
    if (submitting) return;
    formik.resetForm();
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
          position: 'absolute',
          right: 16,
          top: 16,
          color: '#8B4513',
          zIndex: 1,
          bgcolor: 'rgba(139, 69, 19, 0.08)',
          '&:hover': {
            bgcolor: 'rgba(139, 69, 19, 0.16)'
          }
        }}
      >
        <CloseOutlined />
      </IconButton>

      {/* Header */}
      <DialogTitle
        sx={{
          textAlign: 'center',
          pt: 4,
          pb: 0
        }}
      >
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
        <Typography
          variant="body2"
          sx={{
            color: '#666',
            mt: 1.5,
            fontSize: '0.9rem',
            lineHeight: 1.6,
            maxWidth: 400,
            mx: 'auto'
          }}
        >
          Scheduling consultation is first step toward achieving your health and wellness goals with the best support
        </Typography>
      </DialogTitle>

      {/* Form */}
      <DialogContent sx={{ px: { xs: 2.5, sm: 4 }, pt: 3, pb: 4 }}>

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
      </DialogContent>
    </Dialog>
  );
}

AddAppointmentModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func
};
