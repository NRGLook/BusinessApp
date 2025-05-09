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
    Grow,
    Divider,
    Collapse,
    IconButton,
    useTheme,
    Avatar,
} from "@mui/material";
import { ArrowBack, ExpandMore, Settings, Business, Email } from "@mui/icons-material";
import { motion } from "framer-motion";
import { styled } from "@mui/material/styles";
import { Grid, Paper } from "@mui/material";

const StyledCard = styled(Card)(({ theme }) => ({
    background: `linear-gradient(145deg, ${theme.palette.background.paper} 0%, ${theme.palette.action.hover} 100%)`,
    transition: "transform 0.3s, box-shadow 0.3s",
    "&:hover": {
        transform: "translateY(-5px)",
        boxShadow: theme.shadows[8],
    },
}));

const ExpandableSection = styled(Paper)(({ theme }) => ({
    margin: theme.spacing(1),
    padding: theme.spacing(2),
    cursor: "pointer",
    transition: "all 0.3s",
    "&:hover": {
        backgroundColor: theme.palette.action.hover,
    },
}));

export default function BusinessDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [business, setBusiness] = useState(null);
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);
    const [settingsLoading, setSettingsLoading] = useState(false);
    const [error, setError] = useState("");
    const [settingsError, setSettingsError] = useState("");
    const [expanded, setExpanded] = useState(false);
    const [ownerEmail, setOwnerEmail] = useState('');
    const [emailLoading, setEmailLoading] = useState(false);
    const [emailError, setEmailError] = useState('');
    const theme = useTheme();

    useEffect(() => {
        const fetchBusiness = async () => {
            try {
                const response = await axios.get(`/business/${id}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                });
                setBusiness(response.data);
            } catch (err) {
                console.error("Ошибка при получении бизнеса:", err);
                setError(err.response?.data?.detail || "Ошибка загрузки данных бизнеса");
                if (err.response?.status === 401) navigate("/auth");
            } finally {
                setLoading(false);
            }
        };

        fetchBusiness();
    }, [id, navigate]);

    useEffect(() => {
        if (!business?.owner_id) return;

        const fetchOwnerEmail = async () => {
            setEmailLoading(true);
            try {
                const response = await axios.get(`/user/email/${business.owner_id}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
                });
                setOwnerEmail(response.data.email);
            } catch (err) {
                console.error("Ошибка при получении email:", err);
                setEmailError("Не удалось загрузить email владельца");
            } finally {
                setEmailLoading(false);
            }
        };

        fetchOwnerEmail();
    }, [business?.owner_id]);

    useEffect(() => {
        if (!business) return;

        const fetchSettings = async () => {
            setSettingsLoading(true);
            const type = business.business_type;
            const endpoint =
                type === "PHYSICAL"
                    ? `/business/${id}/physical-settings`
                    : `/business/${id}/virtual-settings`;

            try {
                const response = await axios.get(endpoint, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                });
                setSettings(response.data);
            } catch (err) {
                console.error("Ошибка при получении настроек:", err);
                setSettingsError("Ошибка загрузки настроек бизнеса");
            } finally {
                setSettingsLoading(false);
            }
        };

        fetchSettings();
    }, [business, id]);

    const renderSettings = () => {
        const translateKey = (key) => {
            const translations = {
                location: "Местоположение",
                size: "Площадь",
                size_sq_meters: "Площадь в метрах квадратных",
                average_salary: "Средняя зарплата",
                rent_cost: "Стоимость аренды",
                equipment_maintenance_cost: "Стоимость обслуживания оборудования",
                tax_rate: "Налоговая ставка",
                utilities_cost: "Коммунальные расходы",
                marketing_budget: "Бюджет на маркетинг",
                employee_count: "Количество сотрудников",
                electricity_cost: "Стоимость электричества",
                hardware_cost: "Стоимость оборудования",
                hashrate: "Хешрейт (общая вычислительная мощность сети криптовалюты)",
                mining_difficulty: "Сложность майнинга (добычи)",
                pool_fees: "Сборы за пользование",
                crypto_price: "Цена криптовалюты",
                risk_multiplier: "Множитель риска",
                initial_capital: "Начальный капитал",
                risk_level: "Уровень риска",
                portfolio: "Портфолио",
                equipment: "Оборудование",
                production_capacity: "Производственная мощность",
                investment_portfolio: "Инвестиционный портфель",
                stock_assets: "Активы в акциях",
                real_estate: "Недвижимость",
                monthly_production: "Месячное производство",
                energy_consumption: "Потребление энергии",
            };
            return translations[key] || key.replace(/_/g, " ");
        };

        const formatValue = (key, value) => {
            if (typeof value === "object") return value;

            if (['size', 'area', 'production_capacity'].includes(key)) {
                return `${new Intl.NumberFormat('ru-RU').format(value)} кв. м`;
            }

            if (key.includes('investment') || key.includes('assets') || key.includes('cost')) {
                return `${new Intl.NumberFormat('ru-RU').format(value)} ₽`;
            }

            return String(value);
        };

        if (settingsLoading) return <CircularProgress size={24} sx={{ mt: 2 }} />;
        if (settingsError) return <Alert severity="error">{settingsError}</Alert>;
        if (!settings) return null;

        const visibleEntries = Object.entries(settings).filter(
            ([key]) => !["id", "business_id", "created_at", "updated_at"].includes(key)
        );

        return (
            <Box mt={4}>
                <Box display="flex" alignItems="center" mb={2}>
                    <Settings sx={{ mr: 1, color: theme.palette.text.secondary }} />
                    <Typography variant="h5" gutterBottom>
                        Конфигурация бизнеса
                    </Typography>
                </Box>

                <Grid container spacing={2}>
                    {visibleEntries.map(([key, value], index) => (
                        <Grid item xs={12} sm={6} lg={4} key={key}>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <ExpandableSection elevation={3}>
                                    <Box display="flex" alignItems="center">
                                        <Avatar
                                            sx={{
                                                bgcolor: theme.palette.primary.main,
                                                width: 32,
                                                height: 32,
                                                mr: 2,
                                            }}
                                        >
                                            <Business fontSize="small" />
                                        </Avatar>
                                        <Box flexGrow={1}>
                                            <Typography
                                                variant="subtitle1"
                                                color="text.primary"
                                                fontWeight={500}
                                            >
                                                {translateKey(key)}
                                            </Typography>
                                            <Collapse in={expanded}>
                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                    mt={1}
                                                >
                                                    {typeof value === "object" ? (
                                                        <pre
                                                            style={{
                                                                margin: 0,
                                                                whiteSpace: "pre-wrap",
                                                                fontFamily: theme.typography.fontFamily,
                                                            }}
                                                        >
                                                            {JSON.stringify(value, null, 2)}
                                                        </pre>
                                                    ) : (
                                                        formatValue(key, value)
                                                    )}
                                                </Typography>
                                            </Collapse>
                                        </Box>
                                        <IconButton
                                            size="small"
                                            onClick={() => setExpanded(!expanded)}
                                        >
                                            <ExpandMore
                                                sx={{
                                                    transform: expanded ? "rotate(180deg)" : "none",
                                                    transition: "transform 0.3s",
                                                }}
                                            />
                                        </IconButton>
                                    </Box>
                                </ExpandableSection>
                            </motion.div>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        );
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('ru-RU').format(value) + ' ₽';
    };

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

    if (!business) return null;

    return (
        <Grow in timeout={500}>
            <Box sx={{ p: 3, maxWidth: 1200, margin: "0 auto" }}>
                <Button
                    variant="outlined"
                    startIcon={<ArrowBack />}
                    onClick={() => navigate(-1)}
                    sx={{
                        mb: 3,
                        "&:hover": { backgroundColor: theme.palette.action.hover },
                    }}
                    component={motion.div}
                    whileHover={{ scale: 1.05 }}
                >
                    Назад
                </Button>

                <StyledCard
                    component={motion.div}
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    <CardContent>
                        <Box display="flex" alignItems="center" mb={2}>
                            <Avatar
                                sx={{
                                    bgcolor:
                                        business.business_type === "PHYSICAL"
                                            ? theme.palette.primary.main
                                            : theme.palette.secondary.main,
                                    width: 56,
                                    height: 56,
                                    mr: 3,
                                }}
                            >
                                <Business sx={{ fontSize: 32 }} />
                            </Avatar>
                            <Box>
                                <Typography
                                    variant="h3"
                                    fontWeight={700}
                                    gutterBottom
                                    sx={{ textTransform: "uppercase" }}
                                >
                                    {business.name}
                                </Typography>
                                <Chip
                                    label={
                                        business.business_type === "PHYSICAL"
                                            ? "Физический бизнес"
                                            : "Виртуальный бизнес"
                                    }
                                    color={
                                        business.business_type === "PHYSICAL" ? "primary" : "secondary"
                                    }
                                    sx={{ borderRadius: 1, fontWeight: 600 }}
                                />
                            </Box>
                        </Box>

                        <Divider sx={{ my: 3 }} />

                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <Paper elevation={0} sx={{ p: 2, bgcolor: "background.default" }}>
                                    <Typography variant="h6" gutterBottom>
                                        Финансовый обзор
                                    </Typography>
                                    <Box display="flex" justifyContent="space-between" mb={1}>
                                        <Typography>Начальные инвестиции:</Typography>
                                        <Typography fontWeight={600}>
                                            {formatCurrency(business.initial_investment)}
                                        </Typography>
                                    </Box>
                                    <Box display="flex" justifyContent="space-between" mb={1}>
                                        <Typography>Операционные расходы:</Typography>
                                        <Typography fontWeight={600}>
                                            {formatCurrency(business.operational_costs)}
                                        </Typography>
                                    </Box>
                                    <Box display="flex" justifyContent="space-between">
                                        <Typography>Окупаемость:</Typography>
                                        <Typography fontWeight={600} color="success.main">
                                            {business.break_even_months || "Н/Д"} месяцев
                                        </Typography>
                                    </Box>
                                </Paper>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Paper elevation={0} sx={{ p: 2, bgcolor: "background.default" }}>
                                    <Typography variant="h6" gutterBottom>
                                        Информация о владельце
                                    </Typography>
                                    <Box display="flex" alignItems="center">
                                        <Avatar sx={{ mr: 2, bgcolor: theme.palette.info.main }}>
                                            {ownerEmail ? ownerEmail[0].toUpperCase() : "?"}
                                        </Avatar>
                                        <Box>
                                            {emailLoading ? (
                                                <CircularProgress size={20} />
                                            ) : emailError ? (
                                                <Typography variant="body2" color="error">
                                                    {emailError}
                                                </Typography>
                                            ) : ownerEmail ? (
                                                <>
                                                    <Typography fontWeight={500}>
                                                        {ownerEmail.split('@')[0]}
                                                    </Typography>
                                                    <Typography
                                                        variant="body2"
                                                        color="text.secondary"
                                                        sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}
                                                    >
                                                        <Email sx={{ fontSize: 16, mr: 1 }} />
                                                        <a
                                                            href={`mailto:${ownerEmail}`}
                                                            style={{ color: 'inherit', textDecoration: 'none' }}
                                                        >
                                                            {ownerEmail}
                                                        </a>
                                                    </Typography>
                                                </>
                                            ) : (
                                                <Typography color="text.secondary">
                                                    Информация недоступна
                                                </Typography>
                                            )}
                                        </Box>
                                    </Box>
                                </Paper>
                            </Grid>
                        </Grid>

                        {renderSettings()}
                    </CardContent>
                </StyledCard>
            </Box>
        </Grow>
    );
}