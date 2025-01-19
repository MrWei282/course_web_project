import React from 'react';
import { Box, Typography } from '@mui/material';
import { ErrorOutline } from '@mui/icons-material';

const InfoBox = ({ text }) => {
  return (
    <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', backgroundColor: 'primary.darker', color: 'primary.contrastText', p: 2, gap: 2, borderRadius: 3 }}>
      <ErrorOutline fontSize='large'/>
      <Typography fontWeight='bold'>
        {text}
      </Typography>
    </Box>
  )
};

export default InfoBox;
