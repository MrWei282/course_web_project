import React from 'react';
import { useNavigate } from 'react-router-dom';

import { Typography } from '@mui/material';

const Logo = ({ variant, redirect = true }) => {
  const navigate = useNavigate();
  return (
    <Typography variant={variant} aria-label="bigbrain logo" sx={{ cursor: `${redirect ? 'pointer' : 'default'}` }} fontWeight='bold' textAlign='center' fontFamily='monospace' letterSpacing='.1rem' onClick={() => {
      if (redirect) {
        navigate('/dashboard');
      }
    }}>
      GitGud
    </Typography>
  );
}

export default Logo;
