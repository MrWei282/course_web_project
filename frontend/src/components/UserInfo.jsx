import React from 'react';
import axios from 'axios';

import { Box, Link } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const UserInfo = ({ userId = '', icon = true }) => {
  const [user, setUser] = React.useState({
    user_firstname: '',
    user_lastname: ''
  });

  React.useEffect(() => {
    if (userId !== '') {
      axios.get('/user_info', {
        params: {
          user_id: userId
        }
      })
        .then(res => setUser(res.data))
        .catch(() => setUser({
          user_firstname: 'Not found',
          user_lastname: ''
        }))
    }
  }, [userId])

  return (
    <Link onClick={e => e.stopPropagation()} to={`/user/${userId}`} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
      {icon &&
        (user.user_avatar === null
          ? <AccountCircleIcon sx={{ color: 'text.primary' }} />
          : <Box component='img' src={user.user_avatar} height='24px' width='24px'/>
        )
      }
      {user.user_firstname} {user.user_lastname}
    </Link>
  );
}

export default UserInfo;
