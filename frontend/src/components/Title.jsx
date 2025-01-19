import React from 'react';

import { Box, Divider, Typography } from '@mui/material';

const Title = ({ children, start, end, divider = true }) => {
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {start}
          <Typography variant={'h6'} aria-label={children} fontWeight='bold' >
            {children}
          </Typography>
        </Box>
        {end}
      </Box>
      {divider
        ? <Divider sx={{ my: 2 }} />
        : <></>
      }
    </Box>
  );
}

export default Title;
