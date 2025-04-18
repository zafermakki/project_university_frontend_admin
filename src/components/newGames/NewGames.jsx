import React, {useEffect, useState} from 'react';
import axios from "axios";
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  Box
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';

const NewGames = () => {

    const [newGames, setNewGames] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchNewGames();
    }, []);

    const fetchNewGames = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get("http://127.0.0.1:8000/api/products/allnewgames/", {
                headers: {Authorization: `Token ${token}`},
            });
            setNewGames(response.data);
        } catch (error) {
            console.log("error", error);
        }
    }

    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.delete(`http://127.0.0.1:8000/api/products/allnewgames/${id}/`, {
                headers: {
                    Authorization: `Token ${token}`
                },
            });
            setNewGames(newGames.filter((game) => game.id !== id));
        } catch (error) {
            console.log("error", error);
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
                text: "Something went wrong while deleting.",
              });
            }
        }
    }

  return (
    <Container>
      <Box display="flex" justifyContent="space-between" alignItems="center" my={2}>
        <Typography variant="h4" gutterBottom>
          New Games
        </Typography>
        <Button 
          variant="contained" 
          color="primary"
          onClick={() => navigate("/AddNewGames")}
        >
           Add
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>Description</strong></TableCell>
              <TableCell><strong>Release Date</strong></TableCell>
              <TableCell><strong>Quantity</strong></TableCell>
              <TableCell><strong>Price</strong></TableCell> 
              <TableCell><strong>Game Type</strong></TableCell> 
              <TableCell><strong>Image</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {newGames.map((game) => (
              <TableRow key={game.id}>
                <TableCell>{game.name}</TableCell>
                <TableCell>{game.description}</TableCell>
                <TableCell>{game.release_date}</TableCell>
                <TableCell>{game.quantity}</TableCell>
                <TableCell>{game.price}</TableCell>
                <TableCell>{game.game_type_name}</TableCell>
                <TableCell>
                  <img
                    src={`${game.image_path}`} 
                    alt={game.name}
                    width="80"
                    height="80"
                    style={{ borderRadius: "8px" }}
                  />
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<Edit />}
                    sx={{ marginRight: "8px",margin:"2px",width:"110px" }}
                    onClick={() => navigate(`/EditNewGames/${game.id}`)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    startIcon={<Delete />}
                    sx={{marginRight: "8px",margin:"2px",width:"110px"}}
                    onClick={() => handleDelete(game.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  )
}

export default NewGames