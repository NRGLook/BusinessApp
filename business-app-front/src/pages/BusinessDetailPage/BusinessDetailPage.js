import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import {
    Box,
    Typography,
    CircularProgress,
    Alert,
    Card,
    CardContent,
    Chip,
    Button,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";

export default function BusinessDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [business, setBusiness] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchBusiness = async () => {
            try {
                const response = await axios.get(`/business/${id}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                });

                setBusiness(response.data);
            } catch (err) {
                console.error("Ошибка при получении деталей бизнеса:", err);
                setError(err.response?.data?.detail || "Ошибка загрузки деталей");
                if (err.response?.status === 401) navigate("/auth");
            } finally {
                setLoading(false);
            }
        };

        fetchBusiness();
    }, [id, navigate]);

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="error">{error}</Alert>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Button
                variant="outlined"
                startIcon={<ArrowBack />}
                onClick={() => navigate(-1)}
                sx={{ mb: 3 }}
            >
                Назад
            </Button>

            <Card>
                <CardContent>
                    <Typography variant="h4" fontWeight={700} gutterBottom>
                        {business.name}
                    </Typography>

                    <Chip
                        label={business.business_type === "PHYSICAL" ? "Физический" : "Виртуальный"}
                        color={business.business_type === "PHYSICAL" ? "primary" : "secondary"}
                        sx={{ mb: 2 }}
                    />

                    <Typography variant="subtitle1" sx={{ mt: 2 }}>
                        <strong>Описание:</strong> {business.description || "Описание отсутствует"}
                    </Typography>

                    <Typography sx={{ mt: 2 }}>
                        <strong>Инвестиции:</strong> {business.initial_investment} ₽
                    </Typography>

                    <Typography>
                        <strong>Месячные расходы:</strong> {business.operational_costs} ₽
                    </Typography>

                    <Typography>
                        <strong>Окупаемость:</strong> {business.break_even_months || "N/A"} мес.
                    </Typography>

                    <Typography sx={{ mt: 2 }}>
                        <strong>Владелец:</strong> {business.owner_name || "Неизвестно"}
                    </Typography>
                </CardContent>
            </Card>
        </Box>
    );
}
