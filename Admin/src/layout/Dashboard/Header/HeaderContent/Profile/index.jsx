import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import ButtonBase from '@mui/material/ButtonBase';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';

// project imports
import Avatar from 'components/@extended/Avatar';
import IconButton from 'components/@extended/IconButton';
import { AuthContext } from 'contexts/AuthContext';

// assets
import LogoutOutlined from '@ant-design/icons/LogoutOutlined';
import avatar1 from 'assets/images/users/avatar-1.png';

// ==============================|| HEADER CONTENT - PROFILE ||============================== //

export default function Profile() {
  const navigate = useNavigate();
  const { dispatch } = useContext(AuthContext);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    dispatch({ type: 'LOGOUT' });
    navigate('/login');
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 'auto', display: 'flex', alignItems: 'center', gap: 0.5 }}>
      <Tooltip title="Profile" disableInteractive>
        <ButtonBase
          sx={(theme) => ({
            p: 0.25,
            borderRadius: 1,
            '&:focus-visible': { outline: `2px solid ${theme.vars.palette.secondary.dark}`, outlineOffset: 2 }
          })}
          aria-label="view profile"
          onClick={() => navigate('/profile')}
        >
          <Avatar alt="profile user" src={avatar1} size="sm" sx={{ '&:hover': { outline: '1px solid', outlineColor: 'primary.main' } }} />
        </ButtonBase>
      </Tooltip>
      <Tooltip title="Logout" disableInteractive>
        <IconButton
          size="large"
          sx={{ color: 'text.primary' }}
          onClick={handleLogout}
        >
          <LogoutOutlined />
        </IconButton>
      </Tooltip>
    </Box>
  );
}
