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
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from "@mui/material";
import { Check, Clear } from '@mui/icons-material';


const Purchases = () => {

    const [purchase, setPurchase] = useState([]);
    const [deliveryProviders, setDeliveryProviders] = useState([]);
    const [selectedPurchaseId, setSelectedPurchaseId] = useState(null);
    const [selectedProvider, setSelectedProvider] = useState('');

    const [filterStatus, setFilterStatus] = useState('all');

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

    const handleAssignClick = async (purchaseId) => {
      setSelectedPurchaseId(purchaseId);
      setSelectedProvider('');
      try {
          const token = localStorage.getItem("token");
          const response = await axios.get("http://127.0.0.1:8000/api/auth/delivery-providers/", {
              headers: { Authorization: `Token ${token}` },
          });
          setDeliveryProviders(response.data);
          console.log(response.data)
      } catch (error) {
          console.error("Failed to fetch delivery providers", error);
      }
  };

  const handleSaveAssignment = async () => {
    if (!selectedProvider || !selectedPurchaseId) return;
    try {
        const token = localStorage.getItem("token");
        await axios.post(
            "http://127.0.0.1:8000/api/cart/assign-delivery/",
            { purchase: selectedPurchaseId, delivery_provider: selectedProvider },
            { headers: { Authorization: `Token ${token}` } }
        );
        // refresh list to show updated delivered status or any changes
        fetchPurchases();
        // reset selection
        setSelectedPurchaseId(null);
        setSelectedProvider('');
    } catch (error) {
        console.error("Failed to assign delivery", error);
    }
};

const handleUpdateAssignment = async (purchaseId) => {
  if (!selectedProvider) return;
  try {
    const token = localStorage.getItem("token");
    await axios.patch(
      `http://127.0.0.1:8000/api/cart/delivery-assignment/${purchaseId}/update/`,
      { delivery_provider: selectedProvider },
      { headers: { Authorization: `Token ${token}` } }
    );
    fetchPurchases();
    setSelectedPurchaseId(null);
    setSelectedProvider('');
  } catch (error) {
    console.error("Failed to update delivery provider", error);
  }
};

const filteredPurchases = purchase.filter((buy) => {
  if (filterStatus === 'delivered') return buy.delivered === true;
  if (filterStatus === 'undelivered') return buy.delivered === false;
  return true; // show all
});

  return (
    <Container maxWidth={false} sx={{ px: 0 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" my={2}>
        <Typography variant="h4" gutterBottom>
            Purchases
        </Typography>
      </Box>
      <Box display="flex" gap={2} my={2}>
        <Button variant="contained" onClick={() => setFilterStatus('delivered')}>
            delivered
        </Button>
        <Button variant="contained" onClick={() => setFilterStatus('undelivered')}>
            Not delivered
        </Button>
        <Button variant="outlined" onClick={() => setFilterStatus('all')}>
            All
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ width: '100%' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Customer</strong></TableCell>
              <TableCell><strong>Product</strong></TableCell>
              <TableCell><strong>Quantity</strong></TableCell>
              <TableCell><strong>Country</strong></TableCell>
              <TableCell><strong>City</strong></TableCell>
              <TableCell><strong>Phone</strong></TableCell>
              <TableCell><strong>delivered</strong></TableCell>
              <TableCell><strong>Purchase Date</strong></TableCell>
              <TableCell><strong>Provider</strong></TableCell>    
              <TableCell><strong>Assign/Update Delivery</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPurchases.map((buy) => (
              <TableRow key={buy.id}>
                <TableCell>{buy.customer}</TableCell>
                <TableCell>{buy.product}</TableCell>
                <TableCell>{buy.quantity}</TableCell>
                <TableCell>{buy.country}</TableCell>
                <TableCell>{buy.city}</TableCell>
                <TableCell>{buy.phone}</TableCell>
                <TableCell>
                    {buy.delivered ? <Check color="success" /> : <Clear color="error" />}
                </TableCell>
                <TableCell>{new Date(buy.purchase_date).toLocaleString()}</TableCell>
                <TableCell>
                      {buy.provider_email || buy.delivery_provider || <em>—</em>}
                 </TableCell>
                    <TableCell>
                      {selectedPurchaseId === buy.id ? (
                        <Box display="flex" alignItems="center">
                          <FormControl size="small">
                            <InputLabel id="provider-label">Provider</InputLabel>
                            <Select
                              labelId="provider-label"
                              value={selectedProvider}
                              label="Provider"
                              onChange={(e) => setSelectedProvider(e.target.value)}
                            >
                              {deliveryProviders.map((prov) => (
                                <MenuItem key={prov.id} value={prov.id}>
                                    <Box display="flex" flexDirection="column">
                                      <Typography variant="body2" fontWeight="bold">{prov.email}</Typography>
                                      <Typography variant="caption" color="text.secondary">
                                        🌍 {prov.country} - 🏙️ {prov.city}
                                      </Typography>
                                    </Box>
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                          <Button
                        variant="contained"
                        size="small"
                        onClick={buy.delivery_provider ? () => handleUpdateAssignment(buy.id) : handleSaveAssignment}
                        sx={{ ml: 1 }}
                      >
                        {buy.delivery_provider ? "Update" : "Save"}
                      </Button>
                    </Box>
                  ) : (
                    !buy.delivered && (
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleAssignClick(buy.id)}
                      >
                        Assign
                      </Button>
                        )
                      )}
                    </TableCell>
                  </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  )
}

export default Purchases