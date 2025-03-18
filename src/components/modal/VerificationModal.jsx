import React, { useState } from 'react';
import { Modal, Box, Typography, TextField, Button } from '@mui/material';
import axios from 'axios';

const VerificationModal = ({ open, onClose }) => {
    const [verificationCode, setVerificationCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const email = localStorage.getItem('email');

    const handleVerificationSubmit = async () => {
        setLoading(true);
        setErrorMessage('');
        setSuccessMessage('');

        try{
            const response = await  axios.post('http://127.0.0.1:8000/api/auth/make-reset/',{
                email,
                code: verificationCode,
            });
            setSuccessMessage(response.data.message);
            localStorage.removeItem('email')
            setTimeout(() => {
                onClose();
            }, 2000);
        } catch (error) {
            if (error.response) {
                setErrorMessage(error.response.data.message);
            } else {
                setErrorMessage('error again');
            }
        } finally {
            setLoading(false);
        }
    };


    return (
        <Modal open={open} onClose={onClose}>
        <Box
            sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            backgroundColor:"#1e3c72",
            boxShadow: 24,
            p: 4,
            }}
        >
            <Typography variant="h6" component="h2">
            Verification
            </Typography>
            {errorMessage && (
            <Typography variant="body2" color="error" sx={{ mb: 2 }}>
                {errorMessage}
            </Typography>
            )}
            {successMessage && (
            <Typography variant="body2" color="success" sx={{ mb: 2 }}>
                {successMessage}
            </Typography>
            )}
            <TextField
            label="Verification Code"
            fullWidth
            margin="normal"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            disabled={loading}
            />
            <Button
            variant="contained"
            fullWidth
            sx={{ mt: 2,backgroundColor:"#2196f3",color:"#fff"  }}
            onClick={handleVerificationSubmit}
            >
            {loading ? 'Verifying...' : 'Verify'}
            </Button>
        </Box>
        </Modal>
    );
};

export default VerificationModal;