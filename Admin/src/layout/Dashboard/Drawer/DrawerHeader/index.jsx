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
        <Typography 
          variant="h3" 
          sx={{ 
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #1e88e5 0%, #1565c0 100%)',
            color: 'white',
            px: 2,
            py: 0.75,
            borderRadius: 2,
            display: 'inline-block'
          }}
        >
          Praveen's Clinic
        </Typography>
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
