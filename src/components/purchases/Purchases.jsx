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
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Check, Clear } from '@mui/icons-material';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';


// make report
const generatePdfReport = (buy) => {
  const doc = new jsPDF();

  doc.setFontSize(22);
  doc.setTextColor(40, 40, 40);
  doc.text('Purchase Report', 105, 20, { align: 'center' });

  // معلومات عامة عن الطلب
  autoTable(doc, {
    startY: 30,
    theme: 'grid',
    headStyles: { fillColor: [22, 160, 133], halign: 'center' },
    bodyStyles: { halign: 'left' },
    head: [['Field', 'Details']],
    body: [
      ['Customer', buy.customer],
      ['Country', buy.country],
      ['City', buy.city],
      ['Phone', buy.phone],
      ['Delivered', buy.delivered ? 'Yes' : 'No'],
      ['Provider', buy.provider_email || buy.delivery_provider || '-'],
      ['Purchase Date', new Date(buy.purchase_date).toLocaleString()],
    ],
  });

  // جدول المنتجات
  doc.addPage();
  doc.setFontSize(18);
  doc.text('Products', 105, 20, { align: 'center' });

  const productRows = buy.products?.map((prod) => [
    prod.product_name,
    prod.quantity,
    `${(Number(prod.final_price) || 0).toFixed(2)} USD`,
    `${((Number(prod.final_price) || 0) * (Number(prod.quantity) || 0)).toFixed(2)} USD`
  ]) || [];
  

  autoTable(doc, {
    startY: 30,
    theme: 'striped',
    headStyles: { fillColor: [100, 100, 255], halign: 'center' },
    bodyStyles: { halign: 'center' },
    head: [['Product Name', 'Quantity', 'Unit Price', 'Total']],
    body: productRows,
  });

  // توقيع وتاريخ
  doc.setFontSize(10);
  doc.setTextColor(150);
  const date = new Date().toLocaleString();
  doc.text(`Generated on: ${date}`, 105, doc.internal.pageSize.height - 20, {
    align: 'center',
  });

  doc.setFontSize(14);
  doc.setTextColor(54, 69, 79);
  doc.text('SONY CORPORATION', 105, doc.internal.pageSize.height - 10, {
    align: 'center',
  });

  doc.save(`delivery_report_${buy.id}.pdf`);
};




const Purchases = () => {

    const [purchase, setPurchase] = useState([]);
    const [deliveryProviders, setDeliveryProviders] = useState([]);
    const [selectedPurchaseId, setSelectedPurchaseId] = useState(null);
    const [selectedProvider, setSelectedProvider] = useState('');

    const [openModal, setOpenModal] = useState(false);
    const [selectedPurchase, setSelectedPurchase] = useState(null);

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
            console.log(response.data)
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
  return true;
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
              <TableCell><strong>Country</strong></TableCell>
              <TableCell><strong>City</strong></TableCell>
              <TableCell><strong>Phone</strong></TableCell>
              <TableCell><strong>delivered</strong></TableCell>
              <TableCell><strong>declined</strong></TableCell>
              <TableCell><strong>Purchase Date</strong></TableCell>
              <TableCell><strong>Provider</strong></TableCell>    
              <TableCell><strong>Assign/Update Delivery</strong></TableCell>
              <TableCell><strong>Details</strong></TableCell>
              <TableCell><strong>Report</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPurchases.map((buy) => (
              <TableRow key={buy.id}>
                <TableCell>{buy.customer}</TableCell>
                <TableCell>{buy.country}</TableCell>
                <TableCell>{buy.city}</TableCell>
                <TableCell>{buy.phone}</TableCell>
                <TableCell>
                    {buy.delivered ? <Check color="success" /> : <Clear color="error" />}
                </TableCell>
                <TableCell>
                    {buy.declined ? <Check color="success" /> : <Clear color="error" />}
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
                    <TableCell>
                      <Button variant="outlined" size="small" onClick={() => {
                        setSelectedPurchase(buy);
                        setOpenModal(true);
                      }}>
                        Details
                      </Button>
                    </TableCell>
                    <TableCell>
                      {buy.delivered && (
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => generatePdfReport(buy)}
                        >
                          Generate PDF
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Purchase Details</DialogTitle>
        <DialogContent dividers>
          {selectedPurchase ? (
            <>
              <Typography variant="subtitle1"><strong>Customer:</strong> {selectedPurchase.customer}</Typography>
              <Typography variant="subtitle1"><strong>Country:</strong> {selectedPurchase.country}</Typography>
              <Typography variant="subtitle1"><strong>City:</strong> {selectedPurchase.city}</Typography>
              <Typography variant="subtitle1"><strong>Phone:</strong> {selectedPurchase.phone}</Typography>
              <Typography variant="subtitle1"><strong>Date:</strong> {new Date(selectedPurchase.purchase_date).toLocaleString()}</Typography>

              <Box mt={2}>
                <Typography variant="h6">Products</Typography>
                {selectedPurchase.products.map((prod, index) => (
                  <Box key={index} display="flex" alignItems="center" gap={2} my={1}>
                    <img
                      src={`${prod.product_image}`}
                      alt={prod.product_name}
                      style={{ width: 50, height: 50, objectFit: "cover", borderRadius: 8 }}
                    />
                    <Box>
                      <Typography><strong>{prod.product_name}</strong></Typography>
                      <Typography variant="body2">Quantity: {prod.quantity}</Typography>
                      <Typography variant="body2">Price: {((Number(prod.final_price) || 0) * (Number(prod.quantity) || 0)).toFixed(2)}</Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </>
          ) : (
            <Typography>Loading...</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default Purchases