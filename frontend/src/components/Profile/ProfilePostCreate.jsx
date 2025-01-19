import React from 'react';

import { Box, Modal, Fade, Backdrop, Button, TextField } from '@mui/material';
import Title from 'components/Title';
import CloseIcon from '@mui/icons-material/Close';
import ProfileIconButton from './ProfileIconButton';
import axios from 'axios';
import AuthContext from 'AuthContext';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  boxShadow: 12,
  p: 4,
  borderRadius: 1,
};

const defaultErrors = {
  name: '',
  text: ''
}

const ProfilePostCreate = ({ open, handleClose, fetchPosts }) => {
  const [errors, setErrors] = React.useState(defaultErrors);
  const { token } = React.useContext(AuthContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    if (data.get('name') === '') {
      setErrors({ ...defaultErrors, name: 'Please enter a name' });
      return;
    } else if (data.get('text') === '') {
      setErrors({ ...defaultErrors, text: 'Please enter post text' });
      return;
    }

    axios.post('/profile_owner_post', {
      token,
      content: data.get('text'),
      date: new Date(),
      title: data.get('name')
    })
      .then(() => {
        setErrors(defaultErrors);
        handleClose();
        fetchPosts();
      })
      .catch(() => {
        setErrors(defaultErrors);
        handleClose();
      })
  }

  return (
    <Modal
      aria-label="create post modal"
      open={open}
      onClose={handleClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 100,
        },
      }}
    >
      <Fade in={open}>
        <Box sx={style}>
          <Title end={<ProfileIconButton onClick={handleClose} icon={<CloseIcon />}/>}>
            Create Post
          </Title>
          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField label="Name" name="name" error={errors.name !== ''} helperText={errors.name} />
            <TextField label="Enter post contents here..." name="text" error={errors.text !== ''} helperText={errors.text} multiline rows={2}/>
            <Button type="submit" variant="contained">Submit</Button>
          </Box>
        </Box>
      </Fade>
    </Modal>
  )
};

export default ProfilePostCreate;
