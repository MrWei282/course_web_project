import React from 'react';
import axios from 'axios';

import { Navigate } from 'react-router-dom';
import { Typography } from '@mui/material';
import AuthContext from 'AuthContext';

const Logout = ({ setToken, setUserId }) => {
  const [loggedOut, setLoggedOut] = React.useState(false);
  const { token } = React.useContext(AuthContext);

  React.useEffect(() => {
    axios.post('/logout', {
      token,
    })
      .then(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user_id');
        localStorage.removeItem('courses');
        setToken(null);
        setUserId(null);
        setLoggedOut(true);
      })
      .catch(() => setLoggedOut(true))
  }, []);

  return (
    loggedOut
      ? <Navigate to="/login" />
      : <Typography>Logging out...</Typography>
  );
}

export default Logout;
