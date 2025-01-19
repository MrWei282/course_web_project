import React from 'react';

import { Box, Link, Typography } from '@mui/material';
import ProfilePicture from './ProfilePicture';

const ProfileCommentMessage = ({ userId, name, date, message, nameEnd = <></>, messageBottom = <></> }) => {
  return (
    <Box sx={{ display: 'flex', my: 2, gap: 1, width: 1 }}>
      <ProfilePicture userId={userId} size='large' />
      <Box width={1}>
        <Box sx={{ mb: 1, border: 1, borderColor: 'primary.light', backgroundColor: 'primary.light', p: 1, borderRadius: 1, borderTopLeftRadius: 0 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1 }}>
              <Link to={`/user/${userId}`}>
                {name}
              </Link>
              <Typography fontSize='small' color='text.secondary'>
                {date}
              </Typography>
            </Box>
            {nameEnd}
          </Box>
          <Typography>
            {message}
          </Typography>
        </Box>
        {messageBottom}
      </Box>
    </Box>
  );
}

export default ProfileCommentMessage;
