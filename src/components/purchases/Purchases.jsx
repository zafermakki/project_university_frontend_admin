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

const Purchases = () => {

    const [purchase, setPurchase] = useState([]);

    useEffect(() => {
        fetchPurchases();
    }, []);

    const fetchPurchases = async () => {
        try {
            const token =  localStorage.getItem("token");
            const response = await axios.get("http://127.0.0.1:8000/api/cart/table-purchases/", {
                headers: {Authorization: `Token ${token}`},
            });
            setPurchase(response.data);
        } catch (error) {
            console.log("error", error);
        }
    }

  return (
    <Container>
      <Box display="flex" justifyContent="space-between" alignItems="center" my={2}>
        <Typography variant="h4" gutterBottom>
            Purchases
        </Typography>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Customer</strong></TableCell>
              <TableCell><strong>Product</strong></TableCell>
              <TableCell><strong>Quantity</strong></TableCell>
              <TableCell><strong>Purchase Date</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {purchase.map((buy) => (
              <TableRow key={buy.id}>
                <TableCell>{buy.customer}</TableCell>
                <TableCell>{buy.product}</TableCell>
                <TableCell>{buy.quantity}</TableCell>
                <TableCell>{new Date(buy.purchase_date).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  )
}

export default Purchases