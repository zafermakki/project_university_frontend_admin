import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box } from '@mui/material';
import { Check, Clear } from '@mui/icons-material';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const TableAdmin = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [filter, setFilter] = useState('all');
    const token = localStorage.getItem('token');

    const handleUserDetails = (userId) => {
        navigate(`/details/${userId}`)
    }

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/auth/users/', {
            headers: { Authorization: `Token ${token}` }
        })
        .then(response => setUsers(response.data))
        .catch(error => console.error('Error fetching users:', error));
    }, []);

    const handlePermissionChange = (userId, field, value) => {
        axios.patch(`http://127.0.0.1:8000/api/auth/users/${userId}/update/`, {
            [field]: value
        }, {
            headers: { Authorization: `Token ${token}` }
        })
        .then(() => {
            Swal.fire('تم التحديث!', 'تم تعديل الصلاحيات بنجاح.', 'success');
            setUsers(users.map(user => 
                user.id === userId ? { ...user, [field]: value } : user
            ));
        })
        .catch(() => {
            Swal.fire('خطأ!', 'حدث خطأ أثناء التحديث.', 'error');
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
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}

export default TableAdmin;
