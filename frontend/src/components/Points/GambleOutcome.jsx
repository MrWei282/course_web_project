import React from 'react';

import Title from 'components/Title';
import CloseIcon from '@mui/icons-material/Close';
import ModalInterface from 'components/ModalInterface';
import ProfileIconButton from 'components/Profile/ProfileIconButton';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import { Box, Typography } from '@mui/material';

const GambleOutcome = ({ open, handleClose, outcome }) => {
  return (
    <ModalInterface
      open={open}
      handleClose={handleClose}
      aria-label="gamble outcome modal"
    >
      <Title end={<ProfileIconButton onClick={handleClose} icon={<CloseIcon />}/>}>
        Your Result!
      </Title>

      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {outcome
          ? <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
              <CheckIcon sx={{ fontSize: 100, color: 'success.main' }} />
              <Typography>Points will be added to your balance for this course.</Typography>
            </Box>
          : <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
              <ClearIcon sx={{ fontSize: 100, color: 'error.main' }}/>
              <Typography>Better luck next time!</Typography>
            </Box>
        }
      </Box>
    </ModalInterface>
  )
};

export default GambleOutcome;
