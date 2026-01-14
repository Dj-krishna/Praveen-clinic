import { useState } from 'react';

// material-ui
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';

// project imports
import MainCard from 'components/MainCard';
import OrdersTable from 'sections/dashboard/default/OrdersTable';

// assets
import EllipsisOutlined from '@ant-design/icons/EllipsisOutlined';

// ==============================|| DASHBOARD - DEFAULT ||============================== //

export default function DashboardDefault() {
  const [orderMenuAnchor, setOrderMenuAnchor] = useState(null);

  const handleOrderMenuClick = (event) => {
    setOrderMenuAnchor(event.currentTarget);
  };
  const handleOrderMenuClose = () => {
    setOrderMenuAnchor(null);
  };

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      <Grid size={{ xs: 12, md: 12, lg: 12 }}>
        <Grid container sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <Grid>
            <Typography variant="h4">Recent Appointments</Typography>
          </Grid>
          <Grid sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'success.main' }}>Total Appointments: <span style={{ fontWeight: 'bold', color: 'black' }}>10</span></Typography><span>|</span>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'error.main' }}>Cancelled Appointments: <span style={{ fontWeight: 'bold', color: 'black' }}>10</span></Typography>
          </Grid>
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <OrdersTable />
        </MainCard>
      </Grid>
    </Grid>
  );
}
