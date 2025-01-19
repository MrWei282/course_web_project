import React from 'react';
import axios from 'axios';

import { useNavigate } from 'react-router-dom';
import { TextField, Box, Typography, Container, InputAdornment, IconButton, Button, Divider, Link } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

import Logo from 'components/Logo';

const defaultErrors = {
  email: '',
  password: '',
};

const Login = ({ setAuth }) => {
  const navigate = useNavigate();
  const [errors, setErrors] = React.useState(defaultErrors);
  const [showPassword, setShowPassword] = React.useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    axios.post('/login', {
      email: data.get('email'),
      password: data.get('password'),
    })
      .then(res => {
        setAuth(res.data.token, res.data.user_id);
        navigate('/dashboard');
      })
      .catch(error => setErrors({
        email: error.response.data.message,
        password: error.response.data.message
      }));
  };

  return (
    <Container maxWidth="xs" sx={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <Logo variant="h4" />
      <Box sx={{ boxShadow: 3, bgcolor: 'white', p: 3 }} >
        <Typography variant="h5" sx={{ textAlign: 'center', fontWeight: 'bold', mb: 2 }}>
          Log in
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField label="Email Address" name="email" error={errors.email !== ''} helperText={errors.email} />
          <TextField label="Password" name="password" error={errors.password !== ''} helperText={errors.password} type={showPassword ? 'text' : 'password'}
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
          <Button type="submit" variant="contained">Log In</Button>
          <Divider>or</Divider>
          <Typography sx={{ textAlign: 'center' }}>
            Don&apos;t have an account?&nbsp;
            <Link to="/signup" aria-label="sign up">Sign Up</Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}

export default Login;
