import React from 'react';

import { Box } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import axios from 'axios';

const sizes = {
  large: {
    fontSize: 'large',
    px: '35px'
  },
  medium: {
    fontSize: 'medium',
    px: '24px'
  },
}

const ProfilePicture = ({ userId, size = 'medium' }) => {
  const [pfp, setPfp] = React.useState(null);

  React.useEffect(() => {
    axios.get('/user_info', {
      params: {
        user_id: userId
      }
    })
      .then(res => setPfp(res.data.user_avatar))
      .catch(() => {})
  }, [])

  return (
    pfp === null
      ? <AccountCircleIcon fontSize={sizes[size].fontSize}/>
      : <Box component='img' src={pfp} height={sizes[size].px} width={sizes[size].px} />
  );
}

export default ProfilePicture;
