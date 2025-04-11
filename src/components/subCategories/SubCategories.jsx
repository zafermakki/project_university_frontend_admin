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

const SubCategories = () => {

    const [subCategories, setSubCategories] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get("http://127.0.0.1:8000/api/products/allsubcategories/", {
                headers: { Authorization: `Token ${token}` },
            });
            setSubCategories(response.data);
        } catch (error) {
            console.log("error", error);
        }
    };

    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`http://127.0.0.1:8000/api/products/allsubcategories/${id}`,{
                headers: {
                    Authorization: `Token ${token}`
                },
            });
            setSubCategories(subCategories.filter((subCategory) => subCategory.id !== id));
        } catch (error) {
            console.log("error", error);
        }
    }

  return (
    <Container>
    <Box display="flex" justifyContent="space-between" alignItems="center" my={2}>
        <Typography variant="h4" gutterBottom>
            Sub Categories
        </Typography>
        <Button
            variant="contained" 
            color="primary"
            onClick={() => navigate('/AddSubCategories')}
        >
            Add
        </Button>
    </Box>
    <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell><strong>Name</strong></TableCell>
                        <TableCell><strong>parent_category</strong></TableCell>
                        <TableCell><strong>Image</strong></TableCell>
                        <TableCell><strong>Actions</strong></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                {subCategories.map((subcategory) => (
                    <TableRow key={subcategory.id}>
                        <TableCell>{subcategory.name}</TableCell>
                        <TableCell>{subcategory.parent_category_name}</TableCell>
                        <TableCell>
                        <img
                            src={`${subcategory.image_path}`} 
                            alt={subcategory.name}
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
                            onClick={() => navigate(`/EditSubCategory/${subcategory.id}`)}
                        >
                            Edit
                        </Button>
                        <Button
                            variant="contained"
                            color="error"
                            startIcon={<Delete />}
                            sx={{marginRight: "8px",margin:"2px",width:"110px"}}
                            onClick={() => handleDelete(subcategory.id)}
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

export default SubCategories