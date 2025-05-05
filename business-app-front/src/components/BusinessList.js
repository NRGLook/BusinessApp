import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Box,
    Typography,
    List,
    ListItem,
    ListItemText,
    CircularProgress,
    Alert,
    Paper,
    Chip
} from "@mui/material";

const BusinessList = () => {
    const [businesses, setBusinesses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBusinesses = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:8000/business");

                if (response.data.code === "200" && Array.isArray(response.data.data)) {
                    setBusinesses(response.data.data);
                } else {
                    throw new Error(response.data.message || "Invalid data format");
                }
            } catch (err) {
                setError(err.message || "Failed to fetch businesses");
                console.error("API Error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchBusinesses();
    }, []);

    const formatDate = (dateString) => {
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Date(dateString).toLocaleDateString('ru-RU', options);
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" mt={4}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box mt={2}>
                <Alert severity="error">{error}</Alert>
            </Box>
        );
    }

    return (
        <Paper elevation={3} sx={{ padding: 3, margin: 2 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Список бизнесов
            </Typography>
            {businesses.length === 0 ? (
                <Typography>Бизнесы не найдены</Typography>
            ) : (
                <List>
                    {businesses.map((business) => (
                        <ListItem key={business.id} divider>
                            <ListItemText
                                primary={
                                    <Box display="flex" alignItems="center" gap={1}>
                                        {business.name}
                                        <Chip
                                            label={business.business_type === 'PHYSICAL' ? 'Физический' : 'Виртуальный'}
                                            size="small"
                                            color={business.business_type === 'PHYSICAL' ? 'primary' : 'secondary'}
                                        />
                                    </Box>
                                }
                                secondary={
                                    <>
                                        <Typography variant="body2" color="text.secondary">
                                            {business.description}
                                        </Typography>
                                        <Typography variant="caption" color="text.disabled" component="div">
                                            Создан: {formatDate(business.created_at)}
                                        </Typography>
                                        <Typography variant="caption" color="text.disabled" component="div">
                                            Обновлён: {formatDate(business.updated_at)}
                                        </Typography>
                                    </>
                                }
                            />
                        </ListItem>
                    ))}
                </List>
            )}
        </Paper>
    );
};

export default BusinessList;