import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import {
    Card,
    CardContent,
    Typography,
    Grid,
    Button,
    CircularProgress,
    Box,
    Chip,
    Alert, Select, MenuItem
} from "@mui/material";
import { styled } from "@mui/system";
import { Business, Factory, CurrencyExchange, TrendingUp } from "@mui/icons-material";

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

export default function BusinessPage() {
    const navigate = useNavigate();
    const [businesses, setBusinesses] = useState([]);
    const [filteredBusinesses, setFilteredBusinesses] = useState([]);
    const [businessType, setBusinessType] = useState('all');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    useEffect(() => {
        if(businessType === 'all'){
            setFilteredBusinesses(businesses)
        }
        if(businessType === 'physical'){
            setFilteredBusinesses(businesses.filter(businesse => businesse.business_type === 'PHYSICAL'))
        }
        if(businessType === 'virtual'){
            setFilteredBusinesses(businesses.filter(businesse => businesse.business_type === 'VIRTUAL'))
        }
    }, [businessType, setBusinessType, businesses])
    useEffect(() => {
        const fetchBusinesses = async () => {
            try {
                const response = await axios.get("/business?page=1&per_page=100", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    },
                });

                if (response.data && Array.isArray(response.data.data)) {
                    const validatedBusinesses = response.data.data.map(business => ({
                        id: business.id || "",
                        name: business.name || "Без названия",
                        description: business.description || "",
                        business_type: business.business_type === "PHYSICAL"
                            ? "PHYSICAL"
                            : "VIRTUAL",
                        initial_investment: Number(business.initial_investment) || 0,
                        operational_costs: Number(business.operational_costs) || 0,
                        break_even_months: Number(business.break_even_months) || null,
                    }));
                    setBusinesses(validatedBusinesses);
                } else {
                    throw new Error("Некорректный формат данных от сервера");
                }
            } catch (err) {
                console.error("Ошибка загрузки:", err);
                setError(err.response?.data?.message
                    || err.message
                    || "Ошибка при загрузке данных");
                if (err.response?.status === 401) navigate("/auth");
            } finally {
                setLoading(false);
            }
        };

        fetchBusinesses();
    }, [navigate]);

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('ru-RU').format(value) + ' ₽';
    };

    const formatMonths = (value) => {
        return value ? `${value} мес.` : "N/A";
    };

    if (loading) {
        return (
            <Box sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "200px"
            }}>
                <CircularProgress size={60} />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{
                p: 3,
                maxWidth: 600,
                mx: "auto",
                textAlign: "center"
            }}>
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
                <Button
                    variant="outlined"
                    onClick={() => window.location.reload()}
                >
                    Попробовать снова
                </Button>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 4,
                flexWrap: "wrap",
                gap: 2
            }}>
                <Button
                    variant="contained"
                    startIcon={<Business />}
                    onClick={() => navigate("/business/create")}
                    sx={{ flexShrink: 0 }}
                >
                    Создать бизнес
                </Button>
                <Select value={businessType} onChange={(e) => setBusinessType(e.target.value)}>
                    <MenuItem value={'all'}>Все</MenuItem>
                    <MenuItem value={'physical'}>Физичиские</MenuItem>
                    <MenuItem value={'virtual'}>Виртуальные</MenuItem>
                </Select>
            </Box>

            <Grid container spacing={3}>
                {filteredBusinesses.map((business) => {
                    const isPhysical = business.business_type === "PHYSICAL";

                    return (
                        <Grid item xs={12} sm={6} md={4} key={business.id}>
                            <StyledCard>
                                <CardContent>
                                    <Box sx={{ mb: 2 }}>
                                        <Typography
                                            variant="h6"
                                            fontWeight={600}
                                            sx={{ mb: 1 }}
                                        >
                                            {business.name}
                                        </Typography>
                                        <Chip
                                            label={isPhysical ? "Физический" : "Виртуальный"}
                                            color={isPhysical ? "primary" : "secondary"}
                                            size="small"
                                            sx={{
                                                borderRadius: 1,
                                                fontSize: '0.75rem',
                                                height: 24,
                                                '& .MuiChip-label': {
                                                    px: 1.5
                                                }
                                            }}
                                        />
                                    </Box>

                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{
                                            mb: 3,
                                            minHeight: 72
                                        }}
                                    >
                                        {business.description || "Описание отсутствует"}
                                    </Typography>

                                    <StatItem
                                        icon={<CurrencyExchange sx={{ color: "primary.main" }} />}
                                        title="Инвестиции"
                                        value={formatCurrency(business.initial_investment)}
                                        color="primary"
                                    />

                                    <StatItem
                                        icon={<TrendingUp sx={{ color: "error.main" }} />}
                                        title="Месячные расходы"
                                        value={formatCurrency(business.operational_costs)}
                                        color="error"
                                    />

                                    <StatItem
                                        icon={<Factory sx={{ color: "success.main" }} />}
                                        title="Окупаемость"
                                        value={formatMonths(business.break_even_months)}
                                        color="success"
                                    />

                                    <Box sx={{
                                        display: 'flex',
                                        gap: 2,
                                        mt: 2
                                    }}>
                                        <Button
                                            fullWidth
                                            variant="outlined"
                                            onClick={() => navigate(`/business/${business.id}`)}
                                            sx={{ flex: 1 }}
                                        >
                                            Подробнее
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            onClick={() => navigate(
                                                `/business/${business.id}/settings/create`
                                            )}
                                            sx={{
                                                minWidth: 140,
                                                flexShrink: 0
                                            }}
                                        >
                                            Настройки
                                        </Button>
                                    </Box>
                                </CardContent>
                            </StyledCard>
                        </Grid>
                    );
                })}
            </Grid>
        </Box>
    );
}