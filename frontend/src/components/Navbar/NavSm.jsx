import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, IconButton, Typography, Menu, MenuItem, Divider } from '@mui/material';
import { AccountCircle as AccountCircleIcon, Menu as MenuIcon } from '@mui/icons-material';
import Logo from '../Logo';

const NavSm = ({ pages, pfp, menuPages, ...restProps }) => {
  const navigate = useNavigate();

  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [anchorElNav, setAnchorElNav] = React.useState(null);

  return (
    <Box {...restProps}>
      <IconButton size="large" onClick={(e) => setAnchorElNav(e.currentTarget)}>
        <MenuIcon aria-label='menu icon' sx={{ color: 'white' }} fontSize='large' />
      </IconButton>

      <Logo aria-label='bigbrain logo' variant="h5" onClick={() => navigate('/dashboard')} sx={{ cursor: 'pointer' }}/>

      <IconButton onClick={(e) => setAnchorElUser(e.currentTarget)}>
        {pfp === null
          ? <AccountCircleIcon sx={{ color: 'text.primary' }} fontSize='large'/>
          : <Box component='img' src={pfp} height='35px' width='35px'/>
        }
      </IconButton>

      <Menu
        anchorEl={anchorElNav}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        open={Boolean(anchorElNav)}
        onClose={() => setAnchorElNav(null)}
      >
        {pages.map((page, idx) => (
          <MenuItem aria-label="page links menu" key={idx} onClick={() => setAnchorElNav(null)}>
            <Typography onClick={() => navigate(page.link)}>
              {page.name}
            </Typography>
          </MenuItem>
        ))}
      </Menu>

      <Menu
        anchorEl={anchorElUser}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={Boolean(anchorElUser)}
        onClose={() => setAnchorElUser(null)}
      >
        {menuPages.map((page, idx) =>
          <Box key={idx}>
            {(idx + 1 === menuPages.length &&
              <Divider />
            )}
            <MenuItem onClick={() => setAnchorElUser(null)}>
              <Typography onClick={() => navigate(page.link)}>{page.name}</Typography>
            </MenuItem>
          </Box>
        )}
      </Menu>
    </Box>
  )
}

export default NavSm;
