import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FormControl, InputLabel, Select, MenuItem, Button, Typography,CircularProgress,Box,List,ListItem,ListItemText,Paper } from '@mui/material';

const PermissionsForm = ({ userId }) => {
    const [permissions, setPermissions] = useState([]);
    const [selectedPermissions, setSelectedPermissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userPermissions, setUserPermissions] = useState([]);

    // جلب قائمة الصلاحيات من الـ API
    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/auth/users/permissions/',{
            headers: {
                Authorization: `Token ${localStorage.getItem('token')}`
            }
        })
            .then((response) => setPermissions(response.data))
            .catch((error) => console.error('خطأ في جلب الصلاحيات:', error));
    }, []);

    useEffect(() => {
        axios.get(`http://127.0.0.1:8000/api/auth/user/${userId}/permissions/`, {
            headers: { Authorization: `Token ${localStorage.getItem('token')}` }
        })
        .then((response) => {
            setUserPermissions(response.data.permissions);
            setSelectedPermissions(response.data.permissions.map(perm => perm.id));
            setLoading(false);
        })
        .catch((error) => {
            setLoading(false);
        })
    }, [userId]);

    // تحديث صلاحيات المستخدم
    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log('البيانات المُرسلة:', selectedPermissions);

        try {
            await axios.put(`http://127.0.0.1:8000/api/auth/users/${userId}/permissions/`, {
            permissions: selectedPermissions,
        }, {
            headers: {
                Authorization: `Token ${localStorage.getItem('token')}`,
            }
        });

            alert('تم تحديث الصلاحيات بنجاح!');
        } catch (error) {
            console.error('حدث خطأ أثناء تحديث الصلاحيات:', error);
            alert('حدث خطأ أثناء تحديث الصلاحيات.');
        }
    };

    return (
        <Paper sx={{ p: 3, maxWidth: 500, mx: "auto", mt: 3 }}>
        <Typography variant="h6" gutterBottom>
            Update User Permissions
        </Typography>

        {loading ? (
            <Box display="flex" justifyContent="center" my={2}>
                <CircularProgress />
            </Box>
        ) : (
            <>
                {/* Display current permissions */}
                <Typography variant="subtitle1" gutterBottom>
                    Current Permissions:
                </Typography>
                <List dense>
                    {userPermissions.length > 0 ? (
                        userPermissions.map((perm) => (
                            <ListItem key={perm.id}>
                                <ListItemText primary={perm.name} />
                            </ListItem>
                        ))
                    ) : (
                        <Typography variant="body2" color="textSecondary">
                            No permissions assigned to this user.
                        </Typography>
                    )}
                </List>

                {/* Update permissions */}
                <form onSubmit={handleSubmit}>
                    <FormControl fullWidth sx={{ mt: 2 }}>
                        <InputLabel>Select Permissions</InputLabel>
                        <Select
                            multiple
                            value={selectedPermissions}
                            onChange={(e) => setSelectedPermissions(e.target.value)}
                            renderValue={(selected) =>
                                permissions
                                    .filter((perm) => selected.includes(perm.id))
                                    .map((perm) => perm.name)
                                    .join(", ")
                            }
                        >
                            {permissions.map((perm) => (
                                <MenuItem key={perm.id} value={perm.id}>
                                    {perm.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ mt: 3 }}
                    >
                        Update Permissions
                    </Button>
                </form>
            </>
        )}
    </Paper>
    );
};

export default PermissionsForm;
