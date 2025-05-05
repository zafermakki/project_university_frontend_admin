import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Card, CardContent, Typography, Box, CircularProgress, Divider } from '@mui/material';
import { AccountCircle, Email, CalendarToday, Login, CheckCircle, HighlightOff } from '@mui/icons-material';
import PermissionsForm from '../permissionsForm/PermissionsForm'; // ✅ استيراد مكون الصلاحيات

const UserDetails = () => {
    const { id } = useParams();
    const [userDetails, setUserDetails] = useState(null);
    const [isCurrentUserSuperuser, setIsCurrentUserSuperuser] = useState(false);


    useEffect(() => {
        axios.get(`http://127.0.0.1:8000/api/auth/user/${id}/`, {
            headers: {
                Authorization: `Token ${localStorage.getItem('token')}`,
            }
        })
        .then(response => setUserDetails(response.data))
        .catch(error => console.error('Error fetching user details:', error));
    }, [id]);

    useEffect(() => {
        axios.get(`http://127.0.0.1:8000/api/auth/user/`, {
            headers: {Authorization: `Token ${localStorage.getItem('token')}`},
        })
        .then(response => setIsCurrentUserSuperuser(response.data.is_superuser))
        .catch(error => console.error('Error fetching logged-in user details:', error));
    }, [])

    if (!userDetails) return <CircularProgress color="primary" sx={{ display: 'block', margin: '50px auto' }} />;

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 4 }}>
            <Card sx={{ width: 400, padding: 3, boxShadow: 3 }}>
                <Typography variant="h5" gutterBottom align="center">
                     User Details
                </Typography>
                <Divider sx={{ marginBottom: 2 }} />
                <CardContent>
                    <Box display="flex" alignItems="center" mb={1}>
                        <AccountCircle sx={{ mr: 1 }} />
                        <Typography><strong>Username:</strong> {userDetails.username}</Typography>
                    </Box>

                    <Box display="flex" alignItems="center" mb={1}>
                        <Email sx={{ mr: 1 }} />
                        <Typography><strong>Email:</strong> {userDetails.email}</Typography>
                    </Box>

                    <Box display="flex" alignItems="center" mb={1}>
                        {userDetails.is_client ? <CheckCircle color="success" /> : <HighlightOff color="error" />}
                        <Typography sx={{ ml: 1 }}><strong>Client:</strong> {userDetails.is_client ? 'Yes' : 'No'}</Typography>
                    </Box>

                    <Box display="flex" alignItems="center" mb={1}>
                        {userDetails.is_active ? <CheckCircle color="success" /> : <HighlightOff color="error" />}
                        <Typography sx={{ ml: 1 }}><strong>is active:</strong> {userDetails.is_active ? 'Yes' : 'No'}</Typography>
                    </Box>

                    <Box display="flex" alignItems="center" mb={1}>
                        <CalendarToday sx={{ mr: 1 }} />
                        <Typography><strong>Registration date:</strong> {new Date(userDetails.date_joined).toLocaleDateString()}</Typography>
                    </Box>

                    <Box display="flex" alignItems="center" mb={1}>
                        <Login sx={{ mr: 1 }} />
                        <Typography><strong>Last Login:</strong> {userDetails.last_login ? new Date(userDetails.last_login).toLocaleString() : 'لم يتم تسجيل الدخول بعد'}</Typography>
                    </Box>

                    {/* ✅ نموذج تحديث الصلاحيات */}
                    {isCurrentUserSuperuser && !userDetails.is_client && !userDetails.is_superuser && !userDetails.is_delivery_provider &&(
                        <>
                            <Divider sx={{ marginY: 2 }} />
                            <PermissionsForm userId={id} />
                        </>
                    )}
                </CardContent>
            </Card>
        </Box>
    );
};

export default UserDetails;
