import React from 'react';
import axios from 'axios';

import { useNavigate } from 'react-router-dom';
import { TextField, Box, Typography, Container, InputAdornment, IconButton, Autocomplete, Button, Divider, Link } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

import config from 'config.json';
import Logo from 'components/Logo';

const defaultErrors = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  role: ''
};

const Signup = ({ setAuth }) => {
  const navigate = useNavigate();
  const [errors, setErrors] = React.useState(defaultErrors);
  const [showPassword, setShowPassword] = React.useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    if (data.get('password') !== data.get('confirm-password')) {
      setErrors({ ...defaultErrors, password: 'Please confirm your password' });
      return;
    } else if (data.get('role') === '') {
      setErrors({ ...defaultErrors, role: 'Please select a role' });
      return;
    }

    axios.post('/register', {
      email: data.get('email'),
      password: data.get('password'),
      firstname: data.get('firstName'),
      lastname: data.get('lastName'),
      role: data.get('role').toLowerCase(),
    })
      .then(res => {
        setAuth(res.data.token, res.data.user_id);
        navigate('/dashboard');
      })
      .catch(error => {
        const errorMessage = error.response.data.message;
        const errorMessageLower = errorMessage.toLowerCase();
        if (errorMessageLower.includes('email')) {
          setErrors({ ...defaultErrors, email: errorMessage });
        } else if (errorMessageLower.includes('password')) {
          setErrors({ ...defaultErrors, password: errorMessage });
        } else if (errorMessageLower.includes('name')) {
          setErrors({ ...defaultErrors, firstName: errorMessage, lastName: errorMessage });
        }
      })
  };

  return (
    <Container maxWidth="xs" sx={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <Logo variant={'h4'} />
      <Box sx={{ boxShadow: 3, bgcolor: 'white', p: 3 }}>
        <Typography variant="h5" sx={{ textAlign: 'center', fontWeight: 'bold', mb: 2 }}>
          Sign up
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField label="First Name" name="firstName" error={errors.firstName !== ''} helperText={errors.firstName} />
            <TextField label="Last Name" name="lastName" error={errors.lastName !== ''} helperText={errors.lastName} />
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
          <Autocomplete name="roles" options={config.roles}
            renderInput={(params) =>
              <TextField {...params} name="role" error={errors.role !== ''} helperText={errors.role} label="Role" />
            }/>
          <Button type="submit" variant="contained">Sign up</Button>

          <Divider>or</Divider>

          <Typography sx={{ textAlign: 'center' }}>
            Already have an account?&nbsp;
            <Link to="/login" aria-label="log in">Log in</Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}

export default Signup;
