import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import {
    Card, CardContent, Typography, Grid, Button,
    CircularProgress, Box, Chip, Alert
} from "@mui/material";
import { styled } from "@mui/system";
import {
    Factory, CurrencyExchange, TrendingUp
} from "@mui/icons-material";

const StyledCard = styled(Card)(({ theme }) => ({
    borderRadius: 16,
    transition: "transform 0.3s, box-shadow 0.3s",
    "&:hover": {
        transform: "translateY(-5px)",
        boxShadow: theme.shadows[8],
    },
}));

const StatItem = ({ icon, title, value, color }) => (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
        <Box sx={{
            bgcolor: `${color}.light`,
            p: 1.5,
            borderRadius: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
        }}>
            {icon}
        </Box>
        <Box>
            <Typography variant="subtitle2" color="text.secondary">{title}</Typography>
            <Typography variant="h6" fontWeight={600}>{value}</Typography>
        </Box>
    </Box>
);

export default function VirtualBusinessPage() {
    const navigate = useNavigate();
    const [businesses, setBusinesses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchBusinesses = async () => {
            try {
                const response = await axios.get("/business?business_type=VIRTUAL", {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                });

                setBusinesses(response.data?.data || []);
            } catch (err) {
                console.error("Ошибка загрузки:", err);
                setError(err.response?.data?.message || "Ошибка при загрузке данных");
                if (err.response?.status === 401) navigate("/auth");
            } finally {
                setLoading(false);
            }
        };

        fetchBusinesses();
    }, [navigate]);

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
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
            <Typography variant="h4" fontWeight={700} mb={4}>
                Виртуальные Бизнесы
            </Typography>

            <Grid container spacing={3}>
                {businesses.map((business) => (
                    <Grid item xs={12} sm={6} md={4} key={business.id}>
                        <StyledCard>
                            <CardContent>
                                <Box sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    mb: 2
                                }}>
                                    <Typography variant="h6" fontWeight={600}>
                                        {business.name}
                                    </Typography>
                                    <Chip
                                        label="Виртуальный"
                                        color="secondary"
                                        size="small"
                                    />
                                </Box>

                                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                    {business.description || "Описание отсутствует"}
                                </Typography>

                                <StatItem
                                    icon={<CurrencyExchange sx={{ color: "primary.main" }} />}
                                    title="Инвестиции"
                                    value={`${business.initial_investment} ₽`}
                                    color="primary"
                                />

                                <StatItem
                                    icon={<TrendingUp sx={{ color: "error.main" }} />}
                                    title="Месячные расходы"
                                    value={`${business.operational_costs} ₽`}
                                    color="error"
                                />

                                <StatItem
                                    icon={<Factory sx={{ color: "success.main" }} />}
                                    title="Окупаемость"
                                    value={`${business.break_even_months || "N/A"} мес.`}
                                    color="success"
                                />

                                <Button
                                    fullWidth
                                    variant="outlined"
                                    sx={{ mt: 2 }}
                                    onClick={() => navigate(`/business/${business.id}`)}
                                >
                                    Подробнее
                                </Button>
                            </CardContent>
                        </StyledCard>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}
