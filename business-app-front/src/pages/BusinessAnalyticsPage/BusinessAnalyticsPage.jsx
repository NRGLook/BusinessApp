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
    MenuItem,
    Select,
    FormControl,
    InputLabel,
} from "@mui/material";
import {
    LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer,
    BarChart, Bar, Legend, PieChart, Pie, Cell,
} from "recharts";
import { ArrowBack, Download } from "@mui/icons-material";
import { motion } from "framer-motion";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Papa from "papaparse";
import dayjs from "dayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

dayjs.extend(require('dayjs/plugin/customParseFormat'));

const COLORS = ['#8884d8', '#82ca9d', '#ffc658'];

export default function BusinessAnalyticsPage() {
    const { id } = useParams();
    const theme = useTheme();
    const navigate = useNavigate();

    const [business, setBusiness] = useState(null);
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [exportType, setExportType] = useState("pdf");
    const [startMonth, setStartMonth] = useState(dayjs().startOf("year"));
    const [endMonth, setEndMonth] = useState(dayjs().endOf("year"));
    const [showHints, setShowHints] = useState(true);

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

        const revenue = business.revenue || 200000;
        const costs = business.operational_costs || 100000;
        const investment = business.investment_amount || 1000000;

        return Array.from({ length: 12 }, (_, i) => {
            const monthDate = dayjs().startOf("year").add(i, "month");
            if (monthDate.isBefore(startMonth) || monthDate.isAfter(endMonth)) return null;

            const multiplier = 1 + i * 0.02;
            const monthlyRevenue = parseFloat((revenue * multiplier).toFixed(4));
            const monthlyCosts = parseFloat((costs * multiplier).toFixed(4));
            const monthlyProfit = parseFloat((monthlyRevenue - monthlyCosts).toFixed(4));

            return {
                month: `${monthDate.format("MMM YYYY")}`,
                revenue: monthlyRevenue,
                costs: monthlyCosts,
                profit: monthlyProfit,
                roi: parseFloat(((monthlyProfit * (i + 1)) / investment * 100).toFixed(4)),
                clients: business.avg_clients_per_month
                    ? parseFloat((business.avg_clients_per_month * (1 + i * 0.01)).toFixed(4))
                    : undefined,
            };
        }).filter(Boolean);
    };

    const data = generateAnalyticsData();

    const handleExport = async () => {
        const container = document.getElementById("analytics-export-container");
        if (!container) return;

        if (exportType === "pdf") {
            const canvas = await html2canvas(container);
            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF();
            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
            pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
            pdf.save("analytics.pdf");
        } else if (exportType === "csv") {
            const csv = Papa.unparse({
                fields: ["month", "revenue", "costs", "profit", "roi", "clients"],
                data: data.map(item => [
                    item.month,
                    item.revenue,
                    item.costs,
                    item.profit,
                    item.roi,
                    item.clients ?? "",
                ]),
            });
            const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.setAttribute("download", "analytics.csv");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    if (loading) {
        return <Box mt={4} display="flex" justifyContent="center"><CircularProgress /></Box>;
    }

    if (error || !business || !settings) {
        return <Alert severity="error" sx={{ mt: 3 }}>{error || "Нет данных"}</Alert>;
    }

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box p={3}>
                <Box display="flex" alignItems="center" mb={3} justifyContent="space-between">
                    <Button
                        variant="outlined"
                        startIcon={<ArrowBack />}
                        onClick={() => navigate(-1)}
                        component={motion.div}
                        whileHover={{ scale: 1.05 }}
                    >
                        Назад
                    </Button>

                    <Box display="flex" alignItems="center" gap={2}>
                        <FormControl size="small">
                            <InputLabel>Формат</InputLabel>
                            <Select value={exportType} onChange={e => setExportType(e.target.value)} label="Формат">
                                <MenuItem value="pdf">PDF</MenuItem>
                                <MenuItem value="csv">CSV</MenuItem>
                            </Select>
                        </FormControl>
                        <Button
                            variant="contained"
                            startIcon={<Download />}
                            onClick={handleExport}
                            component={motion.div}
                            whileHover={{ scale: 1.05 }}
                        >
                            Скачать
                        </Button>
                    </Box>
                </Box>

                <Box display="flex" gap={2} mb={2}>
                    <DatePicker label="Начало" value={startMonth} onChange={setStartMonth} views={["year", "month"]} />
                    <DatePicker label="Конец" value={endMonth} onChange={setEndMonth} views={["year", "month"]} />
                </Box>

                {showHints && (
                    <Alert severity="info" onClose={() => setShowHints(false)} sx={{ mb: 2 }}>
                        Вы можете выбрать диапазон месяцев и экспортировать графики в PDF или CSV. Наведите курсор на графики, чтобы получить больше информации.
                    </Alert>
                )}

                <Box id="analytics-export-container">
                    <Typography variant="h4" gutterBottom>
                        Аналитика: {business.name}
                    </Typography>

                    <ChartBlock title="Динамика прибыли и доходов" data={data}>
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

                    <ChartBlock title="Выручка и расходы (по месяцам)" data={data}>
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

                    <ChartBlock title="Финансовое распределение за 12 мес. (Пирог)" data={data}>
                        <PieChart>
                            <Pie
                                dataKey="value"
                                data={[
                                    { name: "Выручка", value: data[data.length - 1]?.revenue },
                                    { name: "Расходы", value: data[data.length - 1]?.costs },
                                    { name: "Прибыль", value: data[data.length - 1]?.profit },
                                ]}
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                label
                            >
                                {COLORS.map((color, index) => (
                                    <Cell key={index} fill={color} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ChartBlock>

                    <ChartBlock title="Окупаемость инвестиций (ROI)" data={data}>
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis unit="%" />
                            <Tooltip />
                            <Line type="monotone" dataKey="roi" stroke="#ff9800" />
                        </LineChart>
                    </ChartBlock>

                    {data[0]?.clients && (
                        <ChartBlock title="Рост числа клиентов" data={data}>
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
            </Box>
        </LocalizationProvider>
    );
}

function ChartBlock({ title, children }) {
    return (
        <Paper sx={{ p: 2, my: 2 }} component={motion.div} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <Typography variant="h6" gutterBottom>
                {title}
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
                {children}
            </ResponsiveContainer>
        </Paper>
    );
}
