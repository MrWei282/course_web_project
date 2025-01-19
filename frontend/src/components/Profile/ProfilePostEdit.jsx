import React from 'react';

import { Box, Button, TextField } from '@mui/material';
import Title from 'components/Title';
import CloseIcon from '@mui/icons-material/Close';
import ProfileIconButton from './ProfileIconButton';
import ModalInterface from 'components/ModalInterface';

const ProfilePostEdit = ({ open, handleClose, handleSubmit, errors }) => {
  return (
    <ModalInterface
      open={open}
      handleClose={handleClose}
      aria-label="edit post modal"
    >
      <Title end={<ProfileIconButton onClick={handleClose} icon={<CloseIcon />}/>}>
        Edit Post
      </Title>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField label="Text" name="text" error={errors.text !== ''} helperText={errors.text} />
        <Button type="submit" variant="contained">Save</Button>
      </Box>
    </ModalInterface>
  )
};

export default ProfilePostEdit;
