import {styled} from "@mui/system";
import {
    Alert,
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Grid,
    Typography,
    useTheme
} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "../../api/axios";
import { motion } from "framer-motion";
import { CurrencyExchange, Factory, TrendingUp} from "@mui/icons-material";

const StyledCard = styled(Card)(({theme}) => ({
    borderRadius: 16,
    transition: "transform 0.3s, box-shadow 0.3s",
    "&:hover": {
        transform: "translateY(-5px)",
        boxShadow: theme.shadows[8],
    },
}));

const baseImageUrl = 'data:image/jpeg;base64,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'
const StatItem = ({icon, title, value, color}) => (
    <Box sx={{display: "flex", alignItems: "center", gap: 2, mb: 2}}>
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

export default function SuccessfullBusinesses() {
    const theme = useTheme();
    const navigate = useNavigate();
    const [businesses, setBusinesses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchBusinesses = async () => {
            try {
                const response = await axios.get("/business/all/?page=1&per_page=100", {
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
                <CircularProgress size={60}/>
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
                <Alert severity="error" sx={{mb: 2}}>
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
            {/* Плашка с посылом */}
            <Box sx={{ mb: 4 }}>
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    <Box
                        sx={{
                            minHeight: "200px",
                            background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,                            position: "relative",
                            display: "flex",
                            marginTop: '-30px',
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#fff",
                            textAlign: "center",
                            px: 3,
                            borderRadius: "8px",
                            boxShadow: "0 6px 15px rgba(0,0,0,0.2)",
                        }}
                    >
                        <motion.div
                            style={{ maxWidth: 900, padding: "20px 0" }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1 }}
                        >
                            <Typography
                                variant="h4"
                                sx={{
                                    fontWeight: 700,
                                    textShadow: "0 3px 12px rgba(0,0,0,0.4)",
                                    fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
                                }}
                            >
                                Будьте среди успешных
                            </Typography>
                            <Typography
                                variant="h6"
                                sx={{ fontWeight: 400, mt: 2 }}
                            >
                                Приобретите курс по успешному бизнесу, что бы в будущем увидеть свой бищнес здесь!
                            </Typography>
                            <Box sx={{ mt: 3 }}>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    size="large"
                                    sx={{ fontWeight: 600 }}
                                    onClick={() => navigate('/subscriptionInfo')}
                                >
                                    Подробнее
                                </Button>
                            </Box>
                        </motion.div>
                    </Box>
                </motion.div>
            </Box>

            {/* Блок с успешными бизнесами */}
            <Grid container spacing={3}>
                {/* Ваши бизнесы тут */}
                {businesses.map((business) => {
                    const isPhysical = business.business_type === "PHYSICAL";
                    return (
                        <Grid item xs={12} sm={6} md={4} key={business.id}>
                            <StyledCard sx={{ width: '100%', maxHeight: '280px', maxWidth: '470px' }}>
                                <CardContent>
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                width: 150, // фиксированная ширина для левой части
                                                flexShrink: 0
                                            }}
                                        >
                                            <Avatar
                                                src={business.imageUrl ?? baseImageUrl}
                                                alt={business.name}
                                                sx={{
                                                    width: 100,
                                                    height: 100,
                                                    borderRadius: '50%',
                                                    bgcolor: 'grey.200',
                                                    mb: 2
                                                }}
                                            />
                                            <Typography variant="h6" fontWeight={600} align="center" sx={{ mb: 1 }}>
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
                                                    mb: 2,
                                                    '& .MuiChip-label': { px: 1.5 }
                                                }}
                                            />
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                                align="center"
                                                sx={{ mb: 2 }}
                                            >
                                                {business.description || "Описание отсутствует"}
                                            </Typography>
                                        </Box>

                                        {/* Правая часть: финансы и кнопки */}
                                        <Box sx={{ flex: 1 }}>
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

                                            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
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
                                                    onClick={() => navigate(`/business/${business.id}/settings/create`)}
                                                    sx={{ minWidth: 140, flexShrink: 0 }}
                                                >
                                                    Настройки
                                                </Button>
                                            </Box>
                                        </Box>
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