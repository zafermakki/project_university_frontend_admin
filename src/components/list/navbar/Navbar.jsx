import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Swal from 'sweetalert2';
import axios from 'axios'; 
import { useNavigate } from "react-router-dom"

const Navbar = () => {

    const navigate = useNavigate();
    

    const handleLogout = async () => {
        Swal.fire({
            title: 'Are you sure?',
        text: "Do you want to log out?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#2196f3',
        cancelButtonColor: '#d33',
        background:"#000422",
        color:"#fff",
        confirmButtonText: 'Yes, log out!',
        cancelButtonText: 'Cancel'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const token = localStorage.getItem('token');

                    const respnose = await axios.post(
                        'http://127.0.0.1:8000/api/auth/logout/',
                        {},
                        {
                            headers: {
                                Authorization: `Token ${token}`,
                            },
                        }
                    );
                    localStorage.removeItem('token');
                    navigate('/');
                } catch (err) {
                    Swal.fire('Error!', err.response?.data?.error || 'An error occurred', 'error');
                }
            }
        });
    };

  return (
    <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
            <Toolbar>
                <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    sx={{ mr: 2 }}
                >
                    <MenuIcon />
                </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        News
                    </Typography>
                <Button color="inherit" onClick={handleLogout}>Logout</Button>
            </Toolbar>
        </AppBar>
    </Box>
  )
}

export default Navbar

