import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box,IconButton,TextField } from '@mui/material';
import { Check, Clear, Delete as DeleteIcon } from '@mui/icons-material';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const TableAdmin = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    const token = localStorage.getItem('token');

    const handleUserDetails = (userId) => {
        navigate(`/details/${userId}`)
    }

    const fetchUsers = async (search = '') => {
        const url = search
            ? `http://127.0.0.1:8000/api/auth/users/search/?q=${search}`
            : `http://127.0.0.1:8000/api/auth/users/`;

        try {
            const response = await axios.get(url, {
                headers: { Authorization: `Token ${token}` }
            });
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [token]);

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        fetchUsers(value);
    };

    const handlePermissionChange = (userId, field, value) => {
        axios.patch(`http://127.0.0.1:8000/api/auth/users/${userId}/update/`, {
            [field]: value
        }, {
            headers: { Authorization: `Token ${token}` }
        })
        .then(() => {
            Swal.fire({
                title: 'Success',
                text: 'Success to change',
                icon: 'success',
                confirmButtonColor: '#3085d6',
                background:"#000422",
                color:"#fff",
              });
            setUsers(users.map(user => 
                user.id === userId ? { ...user, [field]: value } : user
            ));
        })
        .catch(() => {
            Swal.fire({
                title: 'Error when you tried to change for user',
                text: 'Something went wrong!',
                icon: 'error',
                confirmButtonColor: '#3085d6',
                background:"#000422",
                color:"#fff",
              });
        });
    };

    const handleDeleteUser = (userId) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "you will not be bale to back down from this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            background:"#000422",
            color:"#fff",
            cancelButtonColor: '#d33',
            confirmButtonText: 'Delete!'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`http://127.0.0.1:8000/api/auth/delete_user/${userId}/`, {
                    headers: { Authorization: `Token ${token}`},
                })
                .then(() => {
                    Swal.fire({
                        title: 'User was deleted',
                        text: 'Deleted!',
                        icon: 'success',
                        confirmButtonColor: '#3085d6',
                        background:"#000422",
                        color:"#fff",
                      });
                    setUsers(users.filter(user => user.id !== userId));
                })
                .catch(error => {
                    Swal.fire({
                        title: 'Error when you tried to delete user',
                        text: 'Something went wrong!',
                        icon: 'error',
                        confirmButtonColor: '#3085d6',
                        background:"#000422",
                        color:"#fff",
                      });
                });
            }
        });
    };

    const showClients = () => setFilter('clients');
    const showAllExceptClients = () => setFilter('admins');

    const filteredUsers = users.filter(user => {
        if (filter === 'clients') return user.is_client;
        if (filter === 'admins') return !user.is_client;
        return true;
    });

    return (
        <Box p={3}>
            <Typography variant="h5" gutterBottom align="center">
                Users
            </Typography>

            <Box display="flex" justifyContent="center" gap={2} mb={2}>
                <button onClick={showClients} style={{ padding: '8px 16px', backgroundColor: '#1976d2', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                        Clients
                </button>
                <button onClick={showAllExceptClients} style={{ padding: '8px 16px', backgroundColor: '#4caf50', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                        Admins
                </button>
            </Box>
            <Box mb={2} display="flex" justifyContent="center">
                <TextField
                    label="Search..."
                    variant="outlined"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    sx={{ width: '50%' }}
                />
            </Box>
                <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2 }}>
                <Table>
                    <TableHead sx={{ backgroundColor: '#1976d2' }}>
                        <TableRow>
                            <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Name</TableCell>
                            <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Email</TableCell>
                            <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Admin</TableCell>
                            <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>SuperAdmin</TableCell>
                            <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Client</TableCell>
                            <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Active</TableCell>
                            <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Delete</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredUsers.map(user => (
                            <TableRow key={user.id} hover>
                                <TableCell>{user.username}</TableCell>
                                <TableCell 
                                    onClick={() => handleUserDetails(user.id)} 
                                    style={{ cursor: 'pointer', color: '#1976d2', textDecoration: 'underline' }}
                                >
                                    {user.email}
                                </TableCell>
                                <TableCell
                                    onClick={() => handlePermissionChange(user.id, 'is_staff', !user.is_staff)}
                                    style={{ cursor: 'pointer'}}
                                    
                                >
                                    {user.is_staff ? <Check color="success" /> : <Clear color="error" />}
                                </TableCell>
                                <TableCell 
                                    onClick={() => handlePermissionChange(user.id, 'is_superuser', !user.is_superuser)}
                                    style={{ cursor: 'pointer'}}
                                    >
                                    {user.is_superuser ? <Check color="success" /> : <Clear color="error" />}
                                </TableCell>
                                <TableCell >
                                    {user.is_client ? <Check color="success" /> : <Clear color="error" />}
                                </TableCell>
                                <TableCell
                                    onClick={() => handlePermissionChange(user.id, 'is_active', !user.is_active)}
                                    style={{ cursor: 'pointer'}}
                                 
                                 >
                                    {user.is_active ? <Check color="success" /> : <Clear color="error" />}
                                </TableCell>
                                <TableCell>
                                    <IconButton
                                        onClick={() => handleDeleteUser(user.id)}
                                        aria-label="delete"
                                    >
                                        <DeleteIcon color="error" />
                                    </IconButton>
                                    </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}

export default TableAdmin;
