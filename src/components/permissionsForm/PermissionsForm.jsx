import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FormControl, InputLabel, Select, MenuItem, Button, Typography } from '@mui/material';

const PermissionsForm = ({ userId }) => {
    const [permissions, setPermissions] = useState([]);
    const [selectedPermissions, setSelectedPermissions] = useState([]);

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
        <form onSubmit={handleSubmit}>
            <Typography variant="h6" gutterBottom>
                  Update of Permissions
            </Typography>

            <FormControl fullWidth>
                <InputLabel>choose Permissions</InputLabel>
                <Select
                    multiple
                    value={selectedPermissions}
                    onChange={(e) => setSelectedPermissions(e.target.value)}
                    renderValue={(selected) => selected.join(', ')}
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
                sx={{ marginTop: 2 }}
            >
                 Update Permissions
            </Button>
        </form>
    );
};

export default PermissionsForm;
