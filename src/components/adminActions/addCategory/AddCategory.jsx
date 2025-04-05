import React, { useState } from 'react';
import axios from 'axios';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography
} from '@mui/material';

const AddCategory = () => {

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        if (image) {
            formData.append('image_path', image);
        }
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/products/allcategories/', formData,{
                headers: {
                    Authorization: `Token ${token}`
                }
            });
            console.log('success', response.data);
        } catch (error) {
            if (error.response) {
              console.log("Error data:", error.response.data);
            } else {
              console.log("Error", error);
            }
          }
    };

  return (
    <Container sx={{ marginTop: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Add New Category  
      </Typography>
      <Paper sx={{ padding: 3, maxWidth: 600, margin: '0 auto' }}>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            margin="normal"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <TextField
            label="description"
            variant="outlined"
            fullWidth
            margin="normal"
            multiline
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Button
            variant="contained"
            component="label"
            sx={{ marginTop: 2 }}
          >
             Download Iamge
            <input
              type="file"
              hidden
              onChange={(e) => setImage(e.target.files[0])}
            />
          </Button>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            sx={{ marginTop: 2, marginLeft: 2 }}
          >
             Add 
          </Button>
        </form>
      </Paper>
    </Container>
  )
}

export default AddCategory