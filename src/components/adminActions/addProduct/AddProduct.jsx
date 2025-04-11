import React, { useState,useEffect } from 'react';
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

const AddProduct = () => {

    const [name, setName] = useState('');
    const [subCategory, setSubCategory] = useState('');
    const [releaseDate, setReleaseDate] = useState('');
    const [gameType, setGameType] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [discountPercentage, setDiscountPercentage] = useState('');
    const [image, setImage] = useState(null);
    const [video, setVideo] = useState('');
    const [quantity, setQuantity] = useState(''); 

    const [subCategories, setSubCategories] = useState([]);

    const [gameTypes, setGameTypes] = useState([]);

    useEffect(() => {
      const fetchGameTypes = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get('http://127.0.0.1:8000/api/products/games-types/', {
            headers: {Authorization: `Token ${token}`}
          });
          setGameTypes(response.data);
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
        const token = localStorage.getItem('token');
        const formData = new FormData();
        formData.append('name',name);
        formData.append('sub_category',subCategory)
        formData.append('release_date',releaseDate)
        formData.append('games_type',gameType)
        formData.append('description',description)
        formData.append('price',price)
        formData.append('discount_percentage',discountPercentage)
        formData.append('video_url',video)
        formData.append('quantity',quantity)
        if (image) {
            formData.append('image_path', image);
        }
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/products/allproducts/',formData, {
                headers: {
                    Authorization: `Token ${token}`
                }
            });
            console.log("success", response.data);
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
        Add New Product  
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
          <FormControl fullWidth margin="normal" required>
                  <InputLabel id="sub_category-label">Parent Category</InputLabel>
                  <Select
                        labelId="sub_category-label"
                        value={subCategory}
                        label="Sub Category"
                        onChange={(e) => setSubCategory(e.target.value)}
                    >
                        {subCategories.map((sub) => (
                        <MenuItem key={sub.id} value={sub.id}>
                            {sub.name}
                        </MenuItem>
                        ))}
                  </Select>
          </FormControl>
          <TextField
            label="release_date"
            variant="outlined"
            fullWidth
            margin="normal"
            value={releaseDate}
            onChange={(e) => setReleaseDate(e.target.value)}
            required
          />
          <FormControl fullWidth margin="normal" >
            <InputLabel id="game-type-label">Game Type</InputLabel>
            <Select
              labelId="game-type-label"
              value={gameType}
              label="Game Type"
              onChange={(e) => setGameType(e.target.value)}
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
            label="discount_percentage"
            variant="outlined"
            fullWidth
            margin="normal"
            value={discountPercentage}
            onChange={(e) => setDiscountPercentage(e.target.value)}
            required
          />
          <TextField
            label="video_url"
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
            multiline
            rows={3}
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
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

export default AddProduct