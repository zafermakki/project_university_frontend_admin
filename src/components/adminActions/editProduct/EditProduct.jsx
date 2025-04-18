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

const EditProduct = () => {

  const { id } = useParams();
  const [name, setName] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [releaseDate, setReleaseDate] = useState('');
  const [gameType, setGameType] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [discountPercentage, setDiscountPercentage] = useState('');
  const [video, setVideo] = useState('');
  const [quantity, setQuantity] = useState(''); 
  const [imageFile, setImageFile] = useState(null);
  const [imagePath, setImagePath] = useState(null); // old image

  const [subCategories, setSubCategories] = useState([]);
  const [gameTypes, setGameTypes] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/products/allproducts/${id}/`,{
          headers: {
            Authorization: `Token ${token}`
          }
        });
        setName(response.data.name);
        setSubCategory(response.data.sub_category);
        setReleaseDate(response.data.release_date);
        setGameType(response.data.games_type || '');
        setDescription(response.data.description);
        setPrice(response.data.price);
        setDiscountPercentage(response.data.discount_percentage);
        setImagePath(response.data.image_path);
        setVideo(response.data.video_url);
        setQuantity(response.data.quantity);
        
      }
      catch (error) {
        console.log("error when get data:", error);
      }
    };
    fetchProduct();
  }, [id]);

  useEffect(() => {
    const fetchGameTypes = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://127.0.0.1:8000/api/products/games-types/', {
          headers: {Authorization: `Token ${token}`}
        });
        setGameTypes(response.data);
        console.log("Game types:", response.data);
      } catch (error) {
          console.log("Failed to fetch", error);
      }
    };
    fetchGameTypes();
  }, []);

  useEffect(() => {
    const fetchSubCategories = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://127.0.0.1:8000/api/products/allsubcategories/', {
          headers: {Authorization: `Token ${token}`}
        });
        setSubCategories(response.data);
      } catch (error) {
        console.log("Failed to fetch", error);
      }
    };
    fetchSubCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append('name', name);
      formData.append('sub_category', subCategory);
      formData.append('release_date', releaseDate);
      formData.append('games_type', gameType);
      formData.append('description', description);
      formData.append('price', price);
      formData.append('discount_percentage', discountPercentage);
      formData.append('video_url', video);
      formData.append('quantity', quantity);
      if (imageFile) {
        formData.append('image_path', imageFile);
      } 
      try {
        const response = await axios.patch(`http://127.0.0.1:8000/api/products/allproducts/${id}/`, formData, {
          headers: {
            Authorization: `Token ${token}`,
            'Content-Type': 'multipart/form-data',
          }
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
              Edit Product
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
                    <InputLabel id="sub_category-label">Sub Category</InputLabel>
                    <Select
                    labelId="sub_category-label"
                    value={subCategory || ''}
                    label="Sub Category"
                    onChange={(e) => setSubCategory(e.target.value)}
                    >
                    {subCategories.map((cat) => (
                        <MenuItem key={cat.id} value={cat.id}>
                        {cat.name}
                        </MenuItem>
                    ))}
                    </Select>
                </FormControl>
                <TextField
                    label="releaseDate"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={releaseDate}
                    onChange={(e) => setReleaseDate(e.target.value)}
                    required
                />
                <FormControl fullWidth margin="normal">
                    <InputLabel id="game_Type-label">Game Type</InputLabel>
                    <Select
                        labelId="game_Type-label"
                        value={gameType}
                        onChange={(e) => setGameType(e.target.value)}
                        label="Game Type"
                      >
                        {gameTypes.map((type) => (
                          <MenuItem key={type.value} value={type.value}>
                            {type.label}
                          </MenuItem>
                        ))}
                      </Select>
                </FormControl>
                <TextField
                    label="description"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />
                <TextField
                    label="price"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                />
                <TextField
                    label="discountPercentage"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={discountPercentage}
                    onChange={(e) => setDiscountPercentage(e.target.value)}
                    required
                />
                <TextField
                    label="video"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={video}
                    onChange={(e) => setVideo(e.target.value)}
                    required
                />
                <TextField
                    label="quantity"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    required
                />
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

export default EditProduct