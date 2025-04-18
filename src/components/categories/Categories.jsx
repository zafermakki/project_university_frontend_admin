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

const Categories = () => {

  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://127.0.0.1:8000/api/products/allcategories/", {
          headers: { Authorization: `Token ${token}`},
        });
        setCategories(response.data);
      } catch (error) {
        console.log("error", error);
      }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://127.0.0.1:8000/api/products/allcategories/${id}/`, {
        headers: {
          Authorization: `Token ${token}`
        },
      });
      setCategories(categories.filter((category) => category.id !== id));
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
          Categories
        </Typography>
        <Button 
          variant="contained" 
          color="primary"
          onClick={() => navigate("/AddCategory")}
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
              <TableCell><strong>Image</strong></TableCell>
              <TableCell><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell>{category.name}</TableCell>
                <TableCell>{category.description}</TableCell>
                <TableCell>
                  <img
                    src={`${category.image_path}`} 
                    alt={category.name}
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
                    onClick={() => navigate(`/EditCategory/${category.id}`)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    startIcon={<Delete />}
                    sx={{marginRight: "8px",margin:"2px",width:"110px"}}
                    onClick={() => handleDelete(category.id)}
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

export default Categories