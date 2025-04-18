import React, { useState } from 'react';
import axios from 'axios';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography
} from '@mui/material';
import Swal from 'sweetalert2';

const AddNews = () => {

  const [name, setName] = useState('');
  const [explanation, setExplanation] = useState('');
  const [image, setImage] = useState(null);
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append('name', name);
    formData.append('explanation', explanation);
    if (image) {
      formData.append('image', image);
    }
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/allnews/', formData, {
        headers: {
          Authorization: `Token ${token}`
        }
      });
      console.log('success', response.data);
      Swal.fire({
        icon: 'success',
        title: "the operation was successful",
        background:"#000422",
        confirmButtonColor: '#2196f3',
        color:"#fff",
      });
    } catch (error) {
      if (error.response && error.response.status === 403) {
        Swal.fire({
          icon: 'error',
          title: "Permission Denied",
          text: "You don't have this permission!!",
          background:"#000422",
          confirmButtonColor: '#2196f3',
          color:"#fff",
        });
      } else {
        Swal.fire({
              icon: 'error',
              title: "Error",
              text: "Something went wrong.",
              background:"#000422",
              confirmButtonColor: '#2196f3',
              color:"#fff",
        });
      }
    }
  };

  return (
    <Container sx={{ marginTop: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Add News
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
            label="explanation"
            variant="outlined"
            fullWidth
            margin="normal"
            multiline
            rows={3}
            value={explanation}
            onChange={(e) => setExplanation(e.target.value)}
            required
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

export default AddNews