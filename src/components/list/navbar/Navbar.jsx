import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Swal from 'sweetalert2';
import axios from 'axios'; 
import { useNavigate } from "react-router-dom"

const Navbar = () => {

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

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
        <AppBar position="static" sx={{ boxShadow: 'none' }}>
            <Toolbar>
                <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    sx={{ mr: 2 }}
                >
                    <div>
                            <MenuIcon 
                                    id="basic-button"
                                    aria-controls={open ? 'basic-menu' : undefined}
                                    aria-haspopup="true"
                                    aria-expanded={open ? 'true' : undefined}
                                    onClick={handleClick}
                            />
                        <Menu
                            id="basic-menu"
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            MenuListProps={{
                            'aria-labelledby': 'basic-button',
                            }}
                        >
                            <MenuItem onClick={() => navigate('/Categories')}>Categories</MenuItem>
                            <MenuItem onClick={() => navigate('/AddSubCategories')}>Sub Categories</MenuItem>
                            <MenuItem onClick={handleClose}>Products</MenuItem>
                        </Menu>
                    </div>
                </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        ADMIN PANEL
                    </Typography>
                <Button color="inherit" onClick={handleLogout}>Logout</Button>
            </Toolbar>
        </AppBar>
    </Box>
  )
}

export default Navbar

