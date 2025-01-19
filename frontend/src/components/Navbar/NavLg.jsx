import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, IconButton, Typography, Menu, MenuItem, Button, Divider } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Logo from '../Logo';

const NavLg = ({ username, pfp, page, pages, menuPages, ...restProps }) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);

  return (
    <Box {...restProps}>
      <Box aria-label='pages-links' sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Logo variant="h6" aria-label='bigbrain logo' />
        {pages.map((currPage, idx) => (
          <Button key={idx} onClick={() => navigate(currPage.link)} aria-label={currPage.name} sx={{
            color: `${currPage.name.toLowerCase() === page ? 'primary.darker' : 'white'}`,
            fontWeight: 'bold',
            backgroundColor: `${currPage.name.toLowerCase() === page ? 'primary.light' : 'primary.main'}`,
            borderBottom: `${currPage.name.toLowerCase() === page ? '4px solid' : '0px solid'}`,
            borderBottomColor: 'primary.darker',
            '&:hover': {
              backgroundColor: 'primary.light',
              color: 'primary.darker'
            },
          }}>
            {currPage.name}
          </Button>
        ))}
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
        <Typography fontWeight='bold'>
          {username}
        </Typography>

        <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ p: 0 }}>
          {pfp === null
            ? <AccountCircleIcon sx={{ color: 'text.primary' }} fontSize='large'/>
            : <Box component='img' src={pfp} height='35px' width='35px'/>
          }
        </IconButton>
      </Box>

      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        {menuPages.map((page, idx) =>
          <Box key={idx}>
            {(idx + 1 === menuPages.length &&
              <Divider />
            )}
            <MenuItem onClick={() => setAnchorEl(null)}>
              <Typography onClick={() => navigate(page.link)}>{page.name}</Typography>
            </MenuItem>
          </Box>
        )}
      </Menu>
    </Box>
  )
}

export default NavLg;
