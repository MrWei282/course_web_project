import React from 'react';

import { AppBar, Toolbar } from '@mui/material';

import NavLg from './NavLg';
import NavSm from './NavSm';
import axios from 'axios';
import AuthContext from 'AuthContext';

const pages = [
  {
    name: 'Dashboard',
    link: '/dashboard'
  },
  {
    name: 'Courses',
    link: '/courses',
  },
  {
    name: 'Points',
    link: '/points/home',
  },
];

const defaultMenuPages = [
  {
    name: 'Sign out',
    link: '/logout'
  },
];

export default function Navbar ({ page = '' }) {
  const { userId } = React.useContext(AuthContext);
  const [user, setUser] = React.useState({ user_firstname: '', user_lastname: '', pfp: null });
  const [menuPages, setMenuPages] = React.useState([...defaultMenuPages]);

  React.useEffect(() => {
    if (userId) {
      setMenuPages([{
        name: 'Profile',
        link: `/user/${userId}`,
      }, ...defaultMenuPages]);
    }

    axios.get('/user_info', {
      params: {
        user_id: userId
      }
    })
      .then(res => setUser(res.data))
      .catch((err) => console.log(err))
  }, [])

  return (
    <AppBar position="static">
        <Toolbar>
          <NavLg username={`${user.user_firstname} ${user.user_lastname}`} pfp={user.user_avatar} page={page} pages={pages} menuPages={menuPages} sx={{ width: 1, display: { xs: 'none', md: 'flex' }, alignItems: 'center', px: 2 }} aria-hidden={{ xs: true, md: false }} />
          <NavSm username={`${user.user_firstname} ${user.user_lastname}`} pfp={user.user_avatar} pages={pages} menuPages={menuPages} sx={{ width: 1, display: { xs: 'flex', md: 'none' }, alignItems: 'center', justifyContent: 'space-between' }} aria-hidden={{ xs: false, md: true }} />
        </Toolbar>
    </AppBar>
  );
}
