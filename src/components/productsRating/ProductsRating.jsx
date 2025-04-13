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

const ProductsRating = () => {

    const [rating, setRating] = useState([]);

    useEffect(() => {
        fetchRatingProducts();
    }, [])
    
    const fetchRatingProducts = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get("http://127.0.0.1:8000/api/products/rating/", {
                headers: {Authorization: `Token ${token}`},
            });
            setRating(response.data);
        } catch (error) {
            console.log("error", error);
        }
    };

  return (
<Container>
      <Box display="flex" justifyContent="space-between" alignItems="center" my={2}>
        <Typography variant="h4" gutterBottom>
            Products Rating
        </Typography>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Product</strong></TableCell>
              <TableCell><strong>User</strong></TableCell>
              <TableCell><strong>Rating</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rating.map((rate) => (
              <TableRow key={rate.id}>
                <TableCell>{rate.product}</TableCell>
                <TableCell>{rate.user}</TableCell>
                <TableCell>{rate.rating}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  )
}

export default ProductsRating