import PropTypes from 'prop-types';

// material-ui
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
// project imports
import AuthCard from './AuthCard';

// ==============================|| AUTHENTICATION - WRAPPER ||============================== //

export default function AuthWrapper({ children }) {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(135deg, #ffffff 0%, #1565c0 100%)',
      }}
    >
      <Stack sx={{ minHeight: '100vh', justifyContent: 'center' }}>
        <Box size={12}>
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            sx={{ minHeight: { xs: 'calc(100vh - 210px)', sm: 'calc(100vh - 134px)', md: 'calc(100vh - 132px)' } }}
          >
            <Grid>
              <AuthCard>{children}</AuthCard>
            </Grid>
          </Grid>
        </Box>
        <Box sx={{ p: 3, pt: 0, textAlign: 'center' }} size={12}>
          <Typography variant="subtitle2" color="white" sx={{ opacity: 0.8 }}>
            © {new Date().getFullYear()} Praveen's Clinic. All rights reserved.
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
}

AuthWrapper.propTypes = { children: PropTypes.node };
