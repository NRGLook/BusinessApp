import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import {
    Box,
    CircularProgress,
    Typography,
    Alert,
    Paper,
    Button,
    useTheme,
} from "@mui/material";
import {
    LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer,
    BarChart, Bar, Legend, PieChart, Pie, Cell,
} from "recharts";
import { ArrowBack } from "@mui/icons-material";
import { motion } from "framer-motion";

const COLORS = ['#8884d8', '#82ca9d', '#ffc658'];

export default function BusinessAnalyticsPage() {
    const { id } = useParams();
    const theme = useTheme();
    const navigate = useNavigate();

    const [business, setBusiness] = useState(null);
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchBusinessData = async () => {
            try {
                const response = await axios.get(`/business/${id}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                });
                setBusiness(response.data);

                const type = response.data.business_type;
                const endpoint =
                    type === "PHYSICAL"
                        ? `/business/${id}/physical-settings`
                        : `/business/${id}/virtual-settings`;

                const settingsResponse = await axios.get(endpoint, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                });
                setSettings(settingsResponse.data);
            } catch (err) {
                console.error(err);
                setError("Ошибка загрузки данных");
            } finally {
                setLoading(false);
            }
        };

        fetchBusinessData();
    }, [id]);

    const generateAnalyticsData = () => {
        if (!business || !settings) return [];

        const revenue = business.revenue || 200_000; // fallback
        const costs = business.operational_costs || 100_000;
        const investment = business.investment_amount || 1_000_000;

        return Array.from({ length: 12 }, (_, i) => {
            const multiplier = 1 + i * 0.02;
            const monthlyRevenue = revenue * multiplier;
            const monthlyCosts = costs * multiplier;
            const monthlyProfit = monthlyRevenue - monthlyCosts;

            return {
                month: `${i + 1} мес.`,
                revenue: monthlyRevenue,
                costs: monthlyCosts,
                profit: monthlyProfit,
                roi: ((monthlyProfit * (i + 1)) / investment) * 100,
                clients: business.avg_clients_per_month
                    ? business.avg_clients_per_month * (1 + i * 0.01)
                    : undefined,
            };
        });
    };

    const data = generateAnalyticsData();

    if (loading) {
        return <Box mt={4} display="flex" justifyContent="center"><CircularProgress /></Box>;
    }

    if (error || !business || !settings) {
        return <Alert severity="error" sx={{ mt: 3 }}>{error || "Нет данных"}</Alert>;
    }

    return (
        <Box p={3}>
            {/* Назад */}
            <Box display="flex" alignItems="center" mb={3}>
                <Button
                    variant="outlined"
                    startIcon={<ArrowBack />}
                    onClick={() => navigate(-1)}
                    sx={{ "&:hover": { backgroundColor: theme.palette.action.hover } }}
                    component={motion.div}
                    whileHover={{ scale: 1.05 }}
                >
                    Назад
                </Button>
            </Box>

            <Typography variant="h4" gutterBottom>
                Аналитика: {business.name}
            </Typography>

            {/* Прибыль */}
            <ChartBlock title="Динамика прибыли и доходов">
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="profit" stroke="#4caf50" />
                    <Line type="monotone" dataKey="revenue" stroke="#2196f3" />
                    <Line type="monotone" dataKey="costs" stroke="#f44336" />
                </LineChart>
            </ChartBlock>

            {/* Столбцы */}
            <ChartBlock title="Выручка и расходы (по месяцам)">
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="revenue" fill={theme.palette.primary.main} />
                    <Bar dataKey="costs" fill={theme.palette.error.main} />
                </BarChart>
            </ChartBlock>

            {/* Pie */}
            <ChartBlock title="Финансовое распределение за 12 мес. (Пирог)">
                <PieChart>
                    <Pie
                        data={[
                            { name: "Выручка", value: data[11]?.revenue },
                            { name: "Расходы", value: data[11]?.costs },
                            { name: "Прибыль", value: data[11]?.profit },
                        ]}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label
                        dataKey="value"
                    >
                        {COLORS.map((color, index) => (
                            <Cell key={index} fill={color} />
                        ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
            </ChartBlock>

            {/* ROI */}
            <ChartBlock title="Окупаемость инвестиций (ROI)">
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis unit="%" />
                    <Tooltip />
                    <Line type="monotone" dataKey="roi" stroke="#ff9800" />
                </LineChart>
            </ChartBlock>

            {/* Клиенты */}
            {data[0]?.clients && (
                <ChartBlock title="Рост числа клиентов">
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="clients" stroke="#673ab7" />
                    </LineChart>
                </ChartBlock>
            )}
        </Box>
    );
}

function ChartBlock({ title, children }) {
    return (
        <Paper sx={{ p: 2, my: 2 }}>
            <Typography variant="h6" gutterBottom>
                {title}
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
                {children}
            </ResponsiveContainer>
        </Paper>
    );
}
