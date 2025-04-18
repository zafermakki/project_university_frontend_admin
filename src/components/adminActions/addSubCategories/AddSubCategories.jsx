import React, {useState,useEffect} from 'react';
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
import Swal from 'sweetalert2';

const AddSubCategories = () => {

    const [name, setName] = useState('');
    const [parentCategory, setParentCategory] = useState('');
    const [image, setImage] = useState(null);

    const [parentCategories, setParentCategories] = useState([]);

    
    useEffect(() => {
        const fetchParentCategories = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://127.0.0.1:8000/api/products/allcategories/',{
                    headers: {Authorization: `Token ${token}`}
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
        const token = localStorage.getItem('token');
        const formData = new FormData();
        formData.append('name', name);
        formData.append('parent_category', parentCategory);
        if (image) {
            formData.append('image_path', image);
        }
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/products/allsubcategories/', formData, {
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
      <Container sx={{marginTop: 4}}>
          <Typography variant="h4" align="center" gutterBottom>
                Add New SubCategory
          </Typography>
          <Paper sx={{padding: 3, maxWidth: 600, margin: '0 auto'}}>
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
                <FormControl fullWidth margin="normal" required>
                <InputLabel id="parent-category-label">Parent Category</InputLabel>
                <Select
                    labelId="parent-category-label"
                    value={parentCategory}
                    label="Parent Category"
                    onChange={(e) => setParentCategory(e.target.value)}
                >
                    {parentCategories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                        {category.name}
                    </MenuItem>
                    ))}
                </Select>
                </FormControl>
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

export default AddSubCategories