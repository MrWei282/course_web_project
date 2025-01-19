import React from 'react';

import { TextField, Box, InputAdornment, IconButton, Button } from '@mui/material';
import Title from 'components/Title';
import CloseIcon from '@mui/icons-material/Close';
import ProfileIconButton from './ProfileIconButton';
import ModalInterface from 'components/ModalInterface';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import axios from 'axios';
import AuthContext from 'AuthContext';

const defaultErrors = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
};

const ProfileEdit = ({ open, handleClose }) => {
  const [errors, setErrors] = React.useState(defaultErrors);
  const [showPassword, setShowPassword] = React.useState(false);
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  const { token } = React.useContext(AuthContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    if (data.get('firstName') === '' && data.get('lastName') !== '') {
      setErrors({ ...defaultErrors, firstName: 'Please enter a first name' });
      return;
    } else if (data.get('firstName') !== '' && data.get('lastName') === '') {
      setErrors({ ...defaultErrors, lastName: 'Please enter a last name' });
      return;
    } else if (data.get('email') !== '' && !emailRegex.test(data.get('email'))) {
      setErrors({ ...defaultErrors, email: 'Please enter valid email' });
      return;
    } else if (data.get('password') !== data.get('confirm-password')) {
      setErrors({ ...defaultErrors, password: 'Please enter matching passwords' });
      return;
    }

    if (data.get('firstName') !== '' && data.get('lastName') !== '') {
      axios.put('/update_user_name', {
        token,
        first_name: data.get('firstName'),
        last_name: data.get('lastName')
      })
    }

    if (data.get('email') !== '') {
      axios.put('/update_user_email', {
        token,
        email: data.get('email')
      })
    }

    if (data.get('password') !== '') {
      axios.put('/update_user_password', {
        token,
        password: data.get('password')
      })
    }

    setErrors({ ...defaultErrors });
    handleClose();
  }

  return (
    <ModalInterface
      open={open}
      handleClose={handleClose}
      aria-label="edit profile modal"
    >
      <Title end={<ProfileIconButton onClick={handleClose} icon={<CloseIcon />}/>}>
        Edit Profile
      </Title>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField label="First Name" name="firstName" error={errors.firstName !== ''} helperText={errors.firstName}/>
          <TextField label="Last Name" name="lastName" error={errors.lastName !== ''} helperText={errors.lastName}/>
        </Box>
        <TextField label="Email Address" name="email" error={errors.email !== ''} helperText={errors.email} />
        <TextField label="Password" name="password" error={errors.password !== ''} type={showPassword ? 'text' : 'password'}
            InputProps={{
              endAdornment:
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword((show) => !show) }
                    onMouseDown={(e) => e.preventDefault()} >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>,
            }}
          />
          <TextField label="Confirm Password" name="confirm-password" error={errors.password !== ''} helperText={errors.password} type={showPassword ? 'text' : 'password'} />
        <Button type="submit" variant="contained">Save</Button>
      </Box>
    </ModalInterface>
  )
};

export default ProfileEdit;
