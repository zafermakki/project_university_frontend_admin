import React, { useState } from 'react';
import { 
  Button, 
  TextField, 
  IconButton, 
  InputAdornment, 
  Container, 
  Card, 
  CardContent, 
  Typography, 
  Box 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import LoginIcon from '@mui/icons-material/Login';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import PasswordResetModal from '../modal/PasswordResetModal';
import VerificationModal from '../modal/VerificationModal';
import axios from 'axios';

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [openPasswordModal, setOpenPasswordModal] = useState(false);
  const [openVerificationModal, setOpenVerificationModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword(prev => !prev);
  const handleMouseDownPassword = (event) => event.preventDefault();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/auth/login/', { email, password });
      localStorage.setItem('token', response.data.token);
      setTimeout(() => {
        localStorage.setItem('user_id', response.data.user_id);
        console.log(response.data);
      }, 1000);
      navigate('/list');
    } catch (err) {
      setError(err.response?.data?.error || 'حدث خطأ ما');
    }
  };

  const handlePasswordReset = () => setOpenPasswordModal(true);

  return (
    <>
      <Container 
        maxWidth="sm"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)'
        }}
      >
        <Card sx={{ minWidth: 300, width: '100%', boxShadow: 3, borderRadius: 2 }}>
          <CardContent>
            <Typography 
              variant="h4" 
              align="center" 
              gutterBottom 
              sx={{ color: '#1e3c72', fontWeight: 'bold' }}
            >
              Admin Portal
            </Typography>
            <Box 
              component="form" 
              onSubmit={handleLogin} 
              sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}
            >
              <TextField
                label="Email"
                variant="filled"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
              />
              <TextField
                label="Password"
                variant="filled"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
              {error && (
                <Typography variant="body2" color="error" align="center">
                  {error}
                </Typography>
              )}
              <Button 
                variant="contained" 
                type="submit" 
                fullWidth 
                startIcon={<LoginIcon />}
                sx={{ backgroundColor: '#1e3c72', color: '#fff', py: 1.5 }}
              >
                 Login
              </Button>
              <Typography variant="body2" align="center">
                   forget password?{' '}
                <Box 
                  component="span" 
                  sx={{ color: '#2a5298', textDecoration: 'underline', cursor: 'pointer' }}
                  onClick={handlePasswordReset}
                >
                   Reset
                </Box>
              </Typography>
              <Button 
                variant="outlined" 
                fullWidth 
                sx={{ mt: 1 }} 
                onClick={() => navigate('/createaccount')}
              >
                 Create Account
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
      <PasswordResetModal
        open={openPasswordModal}
        onClose={() => setOpenPasswordModal(false)}
        onVerificationOpen={() => setOpenVerificationModal(true)}
      />
      <VerificationModal
        open={openVerificationModal}
        onClose={() => setOpenVerificationModal(false)}
      />
    </>
  );
};

export default Login;
