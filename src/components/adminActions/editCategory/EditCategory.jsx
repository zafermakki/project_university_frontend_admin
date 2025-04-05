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

const EditCategory = () => {
  const { id } = useParams(); 
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imagePath, setImagePath] = useState(null); // للمسار القديم
  const [imageFile, setImageFile] = useState(null); // للصورة الجديدة

  useEffect(() => {
    const fetchCategory = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/products/allcategories/${id}/`, {
          headers: { Authorization: `Token ${token}` }
        });
        setName(response.data.name);
        setDescription(response.data.description);
        setImagePath(response.data.image_path); // مسار الصورة القديمة
      } catch (error) {
        console.error("error when get data:", error);
      }
    };
    fetchCategory();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
  
    if (imageFile) {
      formData.append('image_path', imageFile);
    }
  
    try {
      const response = await axios.patch(
        `http://127.0.0.1:8000/api/products/allcategories/${id}/`,
        formData,
        {
          headers: {
            Authorization: `Token ${token}`,
            'Content-Type': 'multipart/form-data',
          }
        }
      );
      console.log(response.data);
    } catch (error) {
      if (error.response) {
        console.error(error.response.data);
      } else {
        console.error(error);
      }
    }
  };
  
  

  return (
    <Container sx={{ marginTop: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Edit Category 
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
            label="Description"
            variant="outlined"
            fullWidth
            margin="normal"
            multiline
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
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
  );
};

export default EditCategory;
