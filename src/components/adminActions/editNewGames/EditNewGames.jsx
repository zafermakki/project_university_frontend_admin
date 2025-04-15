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


const EditNewGames = () => {

  const { id } = useParams();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [releaseDate, setReleaseDate] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [gameType, setGameType] = useState('');
  const [video, setVideo] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePath, setImagePath] = useState(null);

  const [gameTypes, setGameTypes] = useState([]);

  useEffect(() => {
    const fetchGameTypes = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://127.0.0.1:8000/api/products/gametypes/', {
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
    const fetchNewGame = async () => {
      const token = localStorage.getItem("token");
      try{
        const response = await axios.get(`http://127.0.0.1:8000/api/products/allnewgames/${id}/`,{
          headers: {
            Authorization: `Token ${token}`
          }
        });
        setName(response.data.name);
        setDescription(response.data.description);
        setReleaseDate(response.data.release_date);
        setQuantity(response.data.quantity);
        setPrice(response.data.price);
        setGameType(response.data.game_type);
        setVideo(response.data.video_url);
        setImagePath(response.data.image_path)
      } catch (error) {
        console.log("error when get data:", error);
      }
    };
    fetchNewGame();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('release_date', releaseDate);
      formData.append('quantity', quantity);
      formData.append('price', price);
      formData.append('game_type', gameType);
      formData.append('video_url', video);
      if (imageFile) {
        formData.append('image_path', imageFile);
      } 
      try {
        const response = await axios.patch(`http://127.0.0.1:8000/api/products/allnewgames/${id}/`, formData, {
          headers: {
            Authorization: `Token ${token}`,
            'Content-Type': 'multipart/form-data',
          }
        });
      } catch (error) {
        if (error.response) {
          console.log(error.response.data);
        } else {
          console.log(error);
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
                    <InputLabel id="game_type-label">Game Type</InputLabel>
                    <Select
                    labelId="game_type-label"
                    value={gameType || ''}
                    label="Game Type"
                    onChange={(e) => setGameType(e.target.value)}
                    >
                    {gameTypes.map((cat) => (
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

export default EditNewGames