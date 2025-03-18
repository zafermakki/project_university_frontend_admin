import React, { useState, useRef } from 'react';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import { Box, TextField, Button, Typography, Paper } from '@mui/material';
import Swal from "sweetalert2";
import { useNavigate, useLocation } from 'react-router-dom';

const VerifyEmail = () => {
  const location = useLocation();
  const [code, setCode] = useState(new Array(6).fill(''));
  const email = location.state?.email;
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  const handleChange = (index, value) => {
    if (value.length <= 1) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);
      // الانتقال تلقائيًا إلى الحقل التالي إذا كان الحرف غير فارغ
      if (value && index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && code[index] === '') {
      if (index > 0) {
        inputRefs.current[index - 1].focus();
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const verificationCode = code.join('');

    try {
      const response = await fetch('http://127.0.0.1:8000/api/auth/resend-verifycodeview/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code: verificationCode }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(data.message);
        setError('');
        navigate('/');
        Swal.fire({
          position: "bottom-end",
          icon: "success",
          title: "Your account has been created",
          showConfirmButton: false,
          timer: 4500,
          customClass: {
            container: 'custom-swal-container',
            popup: 'custom-swal-popup',
            header: 'custom-swal-header',
            title: 'custom-swal-title',
            content: 'custom-swal-content',
            actions: 'custom-swal-actions',
            confirmButton: 'custom-swal-confirm-button',
          }
        });
      } else {
        setError(data.message);
        setSuccess('');
      }
    } catch (err) {
      console.error(err);
      setError('حدث خطأ أثناء التحقق من الرمز.');
    }
  };

  const handleResendVerification = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/auth/resend-verification/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setSuccess(data.message);
        setError('');
      } else {
        setError(data.message);
        setSuccess('');
      }
    } catch (err) {
      console.error(err);
      setError('حدث خطأ أثناء إعادة إرسال رمز التحقق.');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(to right, #1e3c72, #2a5298)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Paper elevation={10} sx={{ p: 4, width: '100%', maxWidth: 500, textAlign: 'center' }}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          VERIFY EMAIL
        </Typography>
        <SportsEsportsIcon sx={{ width: 80, height: 80, mb: 1 }} />
        <Typography variant="body1" sx={{ mb: 3 }}>
          Enter the code that was sent to your email
        </Typography>
        <form onSubmit={handleSubmit}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              gap: 2,
              mb: 2,
            }}
          >
            {code.map((value, index) => (
              <TextField
                key={index}
                value={code[index]}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                inputProps={{
                  maxLength: 1,
                  style: {
                    textAlign: 'center',
                    fontSize: '24px',
                    width: '40px',
                    height: '40px',
                  }
                }}
                inputRef={(el) => (inputRefs.current[index] = el)}
                variant="outlined"
              />
            ))}
          </Box>
          {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}
          {success && (
            <Typography color="success.main" sx={{ mb: 2 }}>
              {success}
            </Typography>
          )}
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button variant="contained" color="primary" type="submit">
              Verify Code
            </Button>
            <Button variant="outlined" color="primary" onClick={handleResendVerification}>
              Resend Code
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default VerifyEmail;
