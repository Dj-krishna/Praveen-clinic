import PropTypes from 'prop-types';

// material-ui
import { Typography, Box } from '@mui/material';

// project imports
import DrawerHeaderStyled from './DrawerHeaderStyled';

// ==============================|| DRAWER HEADER ||============================== //

export default function DrawerHeader({ open }) {
  return (
    <DrawerHeaderStyled
      open={open}
      sx={{
        minHeight: '60px',
        width: 'initial',
        paddingTop: '8px',
        paddingBottom: '8px',
        paddingLeft: open ? '24px' : 0
      }}
    >
      {open ? (
        <img
          src="https://drpraveenreddyp.com/assets/img/logo/dr-praveen-reddy-logo.png"
          alt="Praveen's Clinic"
          style={{
            height: '60px',
            width: 'auto',
            objectFit: 'contain'
          }}
        />
      ) : (
        <Box
          sx={{
            width: 35,
            height: 35,
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #1e88e5 0%, #1565c0 100%)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            fontSize: '1.2rem'
          }}
        >
          PC
        </Box>
      )}
    </DrawerHeaderStyled>
  );
}

DrawerHeader.propTypes = { open: PropTypes.bool };
