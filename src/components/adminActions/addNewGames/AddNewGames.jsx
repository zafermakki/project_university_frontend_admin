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

const AddNewGames = () => {

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [ReleaseDate, setReleaseDate] = useState('');
    const [quantity, setQuantity] = useState('');
    const [price, setPrice] = useState('');
    const [gameType, setGameType] = useState('');
    const [image, setImage] = useState('');
    const [video, setVideo] = useState('');

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('release_date', ReleaseDate);
        formData.append('quantity', quantity);
        formData.append('price', price);
        formData.append('game_type', gameType);
        formData.append('video_url', video);
        if (image) {
            formData.append('image_path', image);
        }
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/products/allnewgames/', formData, {
                headers: {
                    Authorization: `Token ${token}`
                }
            });
            console.log('succeess', response.data);
        } catch (error) {
            if (error.response) {
                console.log("Error data:", error.response.data);
            } else {
                console.log("Error", error)
            }
        }
    }

  return (
    <Container sx={{marginTop: 4}}>
          <Typography variant="h4" align="center" gutterBottom>
                Add New Games
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
                    label="ReleaseDate"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={ReleaseDate}
                    onChange={(e) => setReleaseDate(e.target.value)}
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
                <FormControl fullWidth margin="normal">
                    <InputLabel id="games-type-label">games Type</InputLabel>
                        <Select
                            labelId="games-type-label"
                            value={gameType}
                            label="Games Type"
                            onChange={(e) => setGameType(e.target.value)}
                        >
                            {gameTypes.map((type) => (
                            <MenuItem key={type.id} value={type.id}>
                                {type.name}
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

export default AddNewGames