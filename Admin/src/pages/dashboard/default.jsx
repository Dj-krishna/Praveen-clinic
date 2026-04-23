import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

// project imports
import MainCard from 'components/MainCard';
import OrdersTable from 'sections/dashboard/default/OrdersTable';

// assets
import PlusOutlined from '@ant-design/icons/PlusOutlined';
import SearchOutlined from '@ant-design/icons/SearchOutlined';
import axios from 'axios';
import { appointmentURL } from '../../api/services';

// ==============================|| DASHBOARD - DEFAULT ||============================== //

export default function DashboardDefault() {
  const [appointments, setAppointments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));   // < 600px
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));   // < 900px

  // Fetch all appointments from API
  const fetchAppointments = async () => {
    const response = await axios(appointmentURL);
    const data = await response.data.data;
    setAppointments(data);
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // Callback for OrdersTable to notify parent when a status is updated
  const handleStatusChange = useCallback((appointmentId, newStatusString) => {
    setAppointments((prev) =>
      prev.map((a) =>
        a.appointmentID === appointmentId
          ? { ...a, appointmentStatus: newStatusString }
          : a
      )
    );
  }, []);

  // Filter appointments based on search query
  const filteredAppointments = useMemo(() => {
    if (!searchQuery.trim()) return appointments;

    const query = searchQuery.toLowerCase().trim();

    return appointments.filter((item) => {
      const fullName = (item.fullName || '').toLowerCase();
      const doctorName = (item.doctorName || '').toLowerCase();
      const appointmentId = String(item.appointmentID || '').toLowerCase();
      const appointmentDate = (item.appointmentDate || '').toLowerCase();
      const status = (item.appointmentStatus || '').toLowerCase();
      const phone = (item.phoneNumber || '').toLowerCase();

      return (
        fullName.includes(query) ||
        doctorName.includes(query) ||
        appointmentId.includes(query) ||
        appointmentDate.includes(query) ||
        status.includes(query) ||
        phone.includes(query)
      );
    });
  }, [appointments, searchQuery]);

  // Dynamic counts
  const totalCount = appointments.length;
  const cancelledCount = appointments.filter(
    (a) => (a.appointmentStatus || '').toLowerCase() === 'cancelled'
  ).length;
  const completedCount = appointments.filter(
    (a) => (a.appointmentStatus || '').toLowerCase() === 'completed'
  ).length;
  const scheduledCount = appointments.filter(
    (a) => (a.appointmentStatus || '').toLowerCase() === 'scheduled'
  ).length;
  const bookedCount = appointments.filter(
    (a) => (a.appointmentStatus).toLowerCase() === ''
  ).length;

  // Status badge data for cleaner rendering
  const statusBadges = [
    { label: 'Total', count: totalCount, color: '' },
    { label: 'Cancelled', count: cancelledCount, color: 'error' },
    { label: 'Completed', count: completedCount, color: 'success' },
    { label: 'Scheduled', count: scheduledCount, color: 'warning' },
    { label: 'Booked', count: bookedCount, color: 'info' }
  ];

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      <Grid size={{ xs: 12, md: 12, lg: 12 }}>

        {/* ===== Header: Title + Button ===== */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: isMobile ? 'stretch' : 'center',
            justifyContent: 'space-between',
            gap: isMobile ? 1.5 : 1
          }}
        >
          <Typography variant="h4">Appointments</Typography>

          <Button
            variant="contained"
            startIcon={<PlusOutlined />}
            onClick={() => navigate('/add-appointment')}
            fullWidth={isMobile}
            sx={{
              borderRadius: '10px',
              textTransform: 'none',
              fontWeight: 700,
              fontSize: '0.85rem',
              px: 2.5,
              py: 1,
              background: 'linear-gradient(135deg, #8B4513 0%, #A0522D 100%)',
              boxShadow: '0 4px 14px rgba(139, 69, 19, 0.3)',
              transition: 'all 0.25s ease',
              '&:hover': {
                boxShadow: '0 6px 20px rgba(139, 69, 19, 0.45)',
                transform: 'translateY(-1px)',
                background: 'linear-gradient(135deg, #7a3c10 0%, #8B4513 100%)'
              },
              '&:active': {
                transform: 'translateY(0px)'
              }
            }}
          >
            Add Appointment
          </Button>
        </Box>

        {/* ===== Status Badges + Search Bar (single row) ===== */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: isMobile ? 'stretch' : 'center',
            gap: 1.5,
            mt: 2
          }}
        >
          {/* Badges */}
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 0.75,
              flexShrink: 0
            }}
          >
            {statusBadges.map((badge) => (
              <Chip
                key={badge.label}
                label={`${badge.label}: ${badge.count}`}
                color={badge.color}
                variant="outlined"
                size={isMobile ? 'small' : 'medium'}
                sx={{
                  fontWeight: 600,
                  fontSize: isMobile ? '0.7rem' : '0.8rem',
                  borderWidth: 1.5,
                  '& .MuiChip-label': {
                    px: isMobile ? 1 : 1.5
                  }
                }}
              />
            ))}
          </Box>

          {/* Search */}
          <TextField
            id="appointment-search"
            fullWidth
            placeholder={
              isMobile
                ? 'Search appointments...'
                : 'Search by patient name, doctor, ID, phone, date, or status...'
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchOutlined style={{ fontSize: 18, color: '#8B4513' }} />
                </InputAdornment>
              )
            }}
            sx={{
              flexGrow: 1,
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                backgroundColor: '#fdfaf6',
                transition: 'all 0.3s ease',
                '& fieldset': {
                  borderColor: '#e8e0d8'
                },
                '&:hover fieldset': {
                  borderColor: '#8B4513'
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#8B4513',
                  borderWidth: '2px'
                },
                '&.Mui-focused': {
                  backgroundColor: '#fff',
                  boxShadow: '0 4px 16px rgba(139, 69, 19, 0.1)'
                }
              },
              '& .MuiInputBase-input': {
                py: isMobile ? 1 : 1.4,
                fontSize: isMobile ? '0.8rem' : '0.9rem',
                '&::placeholder': {
                  color: '#a89585',
                  opacity: 1
                }
              }
            }}
          />
          {/* {searchQuery && (
            <Typography
              variant="body2"
              sx={{
                mt: 1,
                ml: 0.5,
                color: '#8B4513',
                fontWeight: 500,
                fontSize: '0.8rem'
              }}
            >
              Showing {filteredAppointments.length} of {totalCount} appointments
            </Typography>
          )} */}
        </Box>

        {/* ===== Appointments Table ===== */}
        <MainCard sx={{ mt: 2, overflow: 'hidden' }} content={false}>
          <OrdersTable appointmentsData={filteredAppointments} onStatusChange={handleStatusChange} />
        </MainCard>
      </Grid>


    </Grid>
  );
}

