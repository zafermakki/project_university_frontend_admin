import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  MenuItem,
  Select,
  InputLabel,
  FormControl
} from '@mui/material';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';

const EditSubCategory = () => {

    const { id } = useParams();
    const [name, setName] = useState('');
    const [parentCategory, setParentCategory] = useState(null);
    const [parentCategories, setParentCategories] = useState([]);
    const [imagePath, setImagePath] = useState(null);
    const [imageFile, setImageFile] = useState(null);

    useEffect(() => {
        const fetchCategory = async () => {
            const token = localStorage.getItem("token");
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/products/allsubcategories/${id}/`, {
                    headers: {
                        Authorization: `Token ${token}`
                    }
                });
                setName(response.data.name);
                setParentCategory(response.data.parent_category_id);
                setImagePath(response.data.image_path);
            } catch (error) {
                console.log("error when get data:", error);
            }
        };
        fetchCategory();
    }, [id]);

    useEffect(() => {
        const fetchParentCategories = async () => {
          try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://127.0.0.1:8000/api/products/allcategories/', {
              headers: { Authorization: `Token ${token}` }
            });
            setParentCategories(response.data);
          } catch (error) {
            console.log("Failed to fetch", error);
          }
        };
        fetchParentCategories();
      }, []);

    const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append('name', name);
    formData.append('parent_category', parentCategory);
    if (imageFile) {
        formData.append('image_path', imageFile);
    }
    try {
        const response = await axios.patch(`http://127.0.0.1:8000/api/products/allsubcategories/${id}/`,formData,
            {
                headers: {
                    Authorization: `Token ${token}`,
                    'Content-Type': 'multipart/form-data',
                }    
            }
        );
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
    };

  return (
      <Container sx={{marginTop: 4}}>
          <Typography variant="h4" align="center" gutterBottom>
              Edit SubCategory
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
               <FormControl fullWidth margin="normal">
                    <InputLabel id="parent-category-label">Parent Category</InputLabel>
                    <Select
                    labelId="parent-category-label"
                    value={parentCategory || ''}
                    label="Parent Category"
                    onChange={(e) => setParentCategory(e.target.value)}
                    >
                    {parentCategories.map((cat) => (
                        <MenuItem key={cat.id} value={cat.id}>
                        {cat.name}
                        </MenuItem>
                    ))}
                    </Select>
                </FormControl>
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

export default EditSubCategory