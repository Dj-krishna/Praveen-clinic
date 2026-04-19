import { useEffect, useMemo, useState } from 'react';

// material-ui
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';

// project imports
import MainCard from 'components/MainCard';
import OrdersTable from 'sections/dashboard/default/OrdersTable';
import AddAppointmentModal from 'sections/dashboard/default/AddAppointmentModal';

// assets
import PlusOutlined from '@ant-design/icons/PlusOutlined';
import SearchOutlined from '@ant-design/icons/SearchOutlined';
import axios from 'axios';
import { appointmentURL, createAppointment } from '../../api/services';

// ==============================|| DASHBOARD - DEFAULT ||============================== //

export default function DashboardDefault() {
  const [modalOpen, setModalOpen] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  // Fetch all appointments from API
  const fetchAppointments = async () => {
    const response = await axios(appointmentURL);
    const data = await response.data.data;
    setAppointments(data);
  };

  // POST new appointment and refresh the list
  const handleAppointmentSubmit = async (payload) => {
    await axios.post(createAppointment, payload, {
      headers: { 'Content-Type': 'application/json' }
    });
    // Refresh appointments list after successful creation
    await fetchAppointments();
  };

  useEffect(() => {
    fetchAppointments();
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

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      <Grid size={{ xs: 12, md: 12, lg: 12 }}>
        <Grid container sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <Grid>
            <Typography variant="h4">Recent Appointments</Typography>
          </Grid>
          <Grid sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'success.main' }}>Total Appointments: <span style={{ fontWeight: 'bold', color: 'black' }}>{totalCount}</span></Typography><span>|</span>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'error.main' }}>Cancelled Appointments: <span style={{ fontWeight: 'bold', color: 'black' }}>{cancelledCount}</span></Typography>
            <span>|</span>
            <Button
              variant="contained"
              startIcon={<PlusOutlined />}
              onClick={handleOpenModal}
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
          </Grid>
        </Grid>

        {/* Search Bar */}
        <Box sx={{ mt: 2 }}>
          <TextField
            id="appointment-search"
            fullWidth
            placeholder="Search by patient name, doctor, ID, phone, date, or status..."
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
                py: 1.4,
                fontSize: '0.9rem',
                '&::placeholder': {
                  color: '#a89585',
                  opacity: 1
                }
              }
            }}
          />
          {searchQuery && (
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
          )}
        </Box>

        <MainCard sx={{ mt: 2 }} content={false}>
          <OrdersTable appointmentsData={filteredAppointments} />
        </MainCard>
      </Grid>

      {/* Add Appointment Modal */}
      <AddAppointmentModal
        open={modalOpen}
        onClose={handleCloseModal}
        onSubmit={handleAppointmentSubmit}
      />
    </Grid>
  );
}
