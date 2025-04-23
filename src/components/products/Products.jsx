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
  Box,
  TextField 
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';

const Products = () => {

    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
      const token = localStorage.getItem("token");

      const delayDebounce = setTimeout(() => {
          const url = searchQuery
              ? `http://127.0.0.1:8000/api/products/all/search/?q=${searchQuery}`
              : "http://127.0.0.1:8000/api/products/allproducts/";

          axios.get(url, {
              headers: { Authorization: `Token ${token}` }
          })
          .then((response) => {
              setProducts(response.data);
          })
          .catch((error) => {
              console.log("Search error:", error);
          });
      }, 500); // تأخير 0.5 ثانية

      return () => clearTimeout(delayDebounce); // تنظيف التايمر
  }, [searchQuery]);

    useEffect(() => {
        fetchProdcuts();
    }, []);

    const fetchProdcuts = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get("http://127.0.0.1:8000/api/products/allproducts/", {
                headers: { Authorization: `Token ${token}` },
            });
            setProducts(response.data);
        } catch (error) {
            console.log("error", error);
        }
    }

    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`http://127.0.0.1:8000/api/products/allproducts/${id}/`, {
                headers: {
                    Authorization: `Token ${token}`
                },
            });
            setProducts(products.filter((product) => product.id !== id));
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
    <Container maxWidth={false} sx={{paddingX: 0}}>
        <Box display="flex" justifyContent="space-between" alignItems="center" my={2} px={2}>
            <Typography variant="h4" gutterBottom>
                Products
            </Typography>
            <Box display="flex" alignItems="center" gap={2}>
            <TextField
                label="Search by name"
                variant="outlined"
                size="small"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button 
                  variant="contained" 
                  color="primary"
                  onClick={() => navigate("/AddProduct")}
              >
                  Add
              </Button>
            </Box>
      </Box>
      <Box sx={{ overflowX: "auto", px: 2 }}>
      <TableContainer component={Paper} sx={{minWidth:1500}}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>Sub Category</strong></TableCell>
              <TableCell><strong>Category</strong></TableCell>
              <TableCell><strong>Release Date</strong></TableCell>
              <TableCell><strong>Game Type</strong></TableCell>
              <TableCell><strong>Description</strong></TableCell>
              <TableCell><strong>Price</strong></TableCell>
              <TableCell><strong>Discount Percentage</strong></TableCell>
              <TableCell><strong>Final Price</strong></TableCell>
              <TableCell><strong>Average Rating</strong></TableCell>
              <TableCell><strong>quantity</strong></TableCell>
              <TableCell><strong>Image</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.sub_category_detail?.name}</TableCell>
                <TableCell>{product.sub_category_detail?.parent_category_name}</TableCell>
                <TableCell>{product.release_date}</TableCell>
                <TableCell>{product.games_type}</TableCell>
                <TableCell>{product.description}</TableCell>
                <TableCell>{product.price}</TableCell>
                <TableCell>{product.discount_percentage}</TableCell>
                <TableCell>{product.final_price}</TableCell>
                <TableCell>{product.average_rating}</TableCell>
                <TableCell>{product.quantity}</TableCell>
                <TableCell>
                  <img
                    src={`${product.image_path}`} 
                    alt={product.name}
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
                    onClick={() => navigate(`/EditProduct/${product.id}`)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    startIcon={<Delete />}
                    sx={{marginRight: "8px",margin:"2px",width:"110px"}}
                    onClick={() => handleDelete(product.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      </Box>
    </Container>
  )
}

export default Products