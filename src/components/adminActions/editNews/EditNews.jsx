import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography
} from '@mui/material';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';

const EditNews = () => {

  const {id} = useParams();
  const [name, setName] = useState('');
  const [explanation, setExplanation] = useState('');
  const [imagePath, setIamgePath] = useState(null);
  const [iamgeFile, setImageFile] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/allnews/${id}/`, {
          headers: {Authorization: `Token ${token}`}
        });
        setName(response.data.name);
        setExplanation(response.data.explanation);
        setIamgePath(response.data.image);
      } catch (error) {
        console.log("error when get data:", error);
      }
    };
    fetchNews();
  }, [id]);   

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append('name', name);
    formData.append('explanation', explanation);

    if (iamgeFile) {
      formData.append('image', iamgeFile);
    }
    try {
      const response = await axios.patch(
        `http://127.0.0.1:8000/api/allnews/${id}/`,
        formData,
        {
          headers: {
            Authorization: `Token ${token}`,
            'Content-Type': 'multipart/form-data',
          }
        }
      );
      console.log(response.data);
      Swal.fire({
        icon: 'success',
        title: "operation is sucessful",
        text: "the edit was successful",
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
  }

  return (
    <Container sx={{ marginTop: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Edit News 
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
          />

          {/* عرض الصورة الحالية */}
          {imagePath && (
            <div style={{ marginTop: 10 }}>
              <Typography variant="body2">file of image:</Typography>
              <img
                src={`${imagePath}`}
                alt="Category"
                style={{ width: 120, height: 120, borderRadius: 8 }}
              />
            </div>
          )}

          <Button
            variant="contained"
            component="label"
            sx={{ marginTop: 2 }}
          >
             download new image 
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => setImageFile(e.target.files[0])}
            />
          </Button>

          <Button
            variant="contained"
            color="primary"
            type="submit"
            sx={{ marginTop: 2, marginLeft: 2 }}
          >
            save 
          </Button>
        </form>
      </Paper>
    </Container>
  )
}

export default EditNews