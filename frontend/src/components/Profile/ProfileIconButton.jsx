import React from 'react';

import { IconButton } from '@mui/material';

const ProfileIconButton = ({ onClick, icon, p = 0 }) => {
  return (
    <IconButton onClick={onClick} sx={{ p, ':hover': { color: 'text.primary' } }}>
      {icon}
    </IconButton>
  );
}

export default ProfileIconButton;
