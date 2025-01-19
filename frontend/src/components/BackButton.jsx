import React from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@mui/material';

const BackButton = () => {
  const navigate = useNavigate();
  return (
    <Button size='small' label="back button" variant="contained" onClick={() => navigate(-1)} >
      Back
    </Button>
  );
}

export default BackButton;
