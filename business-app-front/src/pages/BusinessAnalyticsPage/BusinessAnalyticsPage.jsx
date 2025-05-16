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
    BarChart, Bar, Legend, PieChart, Pie, Cell, RadarChart, PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar
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
    const [configData, setConfigData] = useState([]);
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [exportType, setExportType] = useState("pdf");
    const [seasonalityInPercent, setSeasonalityInPercent] = useState("1");
    const [randomFactorInPercent, setRandomFactorInPercent] = useState("1");
    const [investmentsInPercent, setInvestmentsInPercent] = useState("1");
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
                if(err.status === 401) {
                    navigate("/auth");
                }
                setError("Ошибка загрузки данных");
            } finally {
                setLoading(false);
            }
        };
        const fetchConfigurationData = async () => {
            try {
                const response = await axios.get(`/business/${id}/physical-settings`);
                setConfigData(response.data);
            } catch (err) {
                if(err.status === 401) {
                    navigate("/auth");
                }
                setError("Ошибка загрузки данных");
            } finally {
                setLoading(false);
            }
        };

        fetchBusinessData();
        fetchConfigurationData();
    }, [id]);
    const locationFactors = {
        moscow: { taxRate: 0.20, marketing: 3.0, utilities: 4.0 },
        spb: { taxRate: 0.18, marketing: 2.5, utilities: 3.5 },
        kazan: { taxRate: 0.16, marketing: 2.0, utilities: 3.0 },
        default: { taxRate: 0.15, marketing: 1.5, utilities: 2.5 }
    };
    const generateFinanceBarChartData = (configData) => {
        const locationKey = (configData?.location || "").toLowerCase();
        const location = locationFactors[locationKey] || locationFactors.default;

        const employeeCount = parseInt(configData.employee_count || 0, 10);
        const size = parseFloat(configData.size_sq_meters || 0);

        const baseSalary = 2.0;
        const salaryMultiplier = 1 + (employeeCount / 100);
        const averageSalary = parseFloat((baseSalary * salaryMultiplier).toFixed(2));
        const totalSalary = parseFloat((averageSalary * employeeCount).toFixed(2));

        const marketing = parseFloat((location.marketing * (1 + size / 100)).toFixed(2));
        const utilities = parseFloat((location.utilities * (size / 50)).toFixed(2));
        const rent = parseFloat((2.0 * (size / 50)).toFixed(2));
        const maintenance = 2.0;

        const totalCosts = rent + maintenance + utilities + marketing + totalSalary;

        // Функция для вычисления процента от общих расходов
        const toPercent = (value) => parseFloat(((value / totalCosts) * 100).toFixed(2));

        return [
            { category: 'Аренда', value: toPercent(rent) },
            { category: 'Обслуживание', value: toPercent(maintenance) },
            { category: 'Коммунальные', value: toPercent(utilities) },
            { category: 'Маркетинг', value: toPercent(marketing) },
            { category: 'Зарплаты', value: toPercent(totalSalary) }
        ];
    };

    const generateAnalyticsData = () => {
        if (!business || !settings) return [];

        const revenueBase = parseFloat(business.expected_revenue) || 100000;
        const costsBase = (parseFloat(business.operational_costs) || 50000) * 1.2;
        const investmentBase = parseFloat(business.initial_investment) || 500000;

        const seasonalityFactor = 1 + (parseFloat(seasonalityInPercent) || 0) / 100;       // e.g. 20 → 1.2
        const randomFactorRange = (parseFloat(randomFactorInPercent) || 0) / 100;          // 20 → 0.2
        const investmentMultiplier = 1 + (parseFloat(investmentsInPercent) || 0) / 100;    // 20 → 1.2

        const investment = investmentBase * investmentMultiplier;
        let accumulatedProfit = 0;

        return Array.from({ length: 12 }, (_, i) => {
            const monthDate = dayjs().startOf("year").add(i, "month");
            if (monthDate.isBefore(startMonth) || monthDate.isAfter(endMonth)) return null;

            // --- FACTORS ---
            const seasonality = 1 + 0.15 * Math.sin((i / 12) * 2 * Math.PI); // плавная волна
            const randomNoise = 1 + (Math.random() * 2 * randomFactorRange - randomFactorRange);
            const baseGrowth = 1 + i * 0.03; // рост 3% в месяц
            const multiplier = seasonality * seasonalityFactor * randomNoise * baseGrowth;

            // --- METRICS ---
            const monthlyRevenue = parseFloat((revenueBase * multiplier).toFixed(2));
            const monthlyCosts = parseFloat((costsBase * (0.9 + Math.random() * 0.2)).toFixed(2));
            const monthlyProfit = parseFloat((monthlyRevenue - monthlyCosts).toFixed(2));
            accumulatedProfit += monthlyProfit;

            let clients;
            if (business.avg_clients_per_month) {
                clients = parseFloat(
                    (
                        business.avg_clients_per_month *
                        multiplier *
                        (0.9 + Math.random() * 0.2)
                    ).toFixed(2)
                );
            }

            const roi = parseFloat(((accumulatedProfit / investment) * 100).toFixed(2));

            return {
                month: monthDate.format("MMM YYYY"),
                revenue: monthlyRevenue,
                costs: monthlyCosts,
                profit: monthlyProfit,
                roi,
                clients,
            };
        }).filter(Boolean);
    };


    const data = generateAnalyticsData();
    const configuration = generateFinanceBarChartData(configData);
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
                data: data.map((item) => {
                    return [
                        item.month,
                        item.revenue,
                        item.costs,
                        item.profit,
                        item.roi,
                        item.clients ?? "",
                    ]
                }),
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
                    <FormControl>
                        <InputLabel id="seasonality-label">Сезонность</InputLabel>
                        <Select
                            labelId="seasonality-label"
                            value={seasonalityInPercent}
                            onChange={e => setSeasonalityInPercent(e.target.value)}
                            label="Сезонность"
                        >
                            <MenuItem value="1">Текущая</MenuItem>
                            <MenuItem value="10">10%</MenuItem>
                            <MenuItem value="20">20%</MenuItem>
                            <MenuItem value="30">30%</MenuItem>
                            <MenuItem value="40">40%</MenuItem>
                            <MenuItem value="50">50%</MenuItem>
                        </Select>
                        <small style={{paddingTop : '4px'}}>Влияние сезонных колебаний на данные</small>
                    </FormControl>

                    {/* Селект рандомного фактора */}
                    <FormControl>
                        <InputLabel id="random-label">Флуктуации</InputLabel>
                        <Select
                            labelId="random-label"
                            value={randomFactorInPercent}
                            onChange={e => setRandomFactorInPercent(e.target.value)}
                            label="Флуктуации"
                        >
                            <MenuItem value="1">Текущая</MenuItem>
                            <MenuItem value="10">10%</MenuItem>
                            <MenuItem value="20">20%</MenuItem>
                            <MenuItem value="30">30%</MenuItem>
                            <MenuItem value="40">40%</MenuItem>
                            <MenuItem value="50">50%</MenuItem>
                        </Select>
                        <small  style={{paddingTop : '4px'}}>Процент случайных колебаний (риски и аномалии)</small>
                    </FormControl>

                    {/* Селект влияния инвестиций */}
                    <FormControl>
                        <InputLabel id="investment-label">Инвестиции</InputLabel>
                        <Select
                            labelId="investment-label"
                            value={investmentsInPercent}
                            onChange={e => setInvestmentsInPercent(e.target.value)}
                            label="Инвестиции"
                        >
                            <MenuItem value="1">Текущая</MenuItem>
                            <MenuItem value="10">10%</MenuItem>
                            <MenuItem value="20">20%</MenuItem>
                            <MenuItem value="30">30%</MenuItem>
                            <MenuItem value="40">40%</MenuItem>
                            <MenuItem value="50">50%</MenuItem>
                        </Select>
                        <small  style={{paddingTop : '4px'}}>Изменение объема инвестиций и их влияния на ROI</small>
                    </FormControl>
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

                            {/* Левая ось (по умолчанию): profit и costs */}
                            <YAxis
                                yAxisId="left"
                                tickFormatter={(value) => new Intl.NumberFormat('ru-RU').format(value)}
                            />

                            {/* Правая ось: revenue */}
                            <YAxis
                                yAxisId="right"
                                orientation="right"
                                tickFormatter={(value) => new Intl.NumberFormat('ru-RU').format(value)}
                            />

                            <Tooltip
                                formatter={(value) => new Intl.NumberFormat('ru-RU').format(value)}
                            />
                            <Legend />

                            <Line
                                yAxisId="left"
                                type="monotone"
                                dataKey="profit"
                                stroke="#4caf50"
                                name="Прибыль"
                            />
                            <Line
                                yAxisId="right"
                                type="monotone"
                                dataKey="revenue"
                                stroke="#2196f3"
                                name="Выручка"
                            />
                            <Line
                                yAxisId="left"
                                type="monotone"
                                dataKey="costs"
                                stroke="#f44336"
                                name="Расходы"
                            />
                        </LineChart>
                    </ChartBlock>
                    <ChartBlock title="Распределение расходов по категориям (%)">
                        <BarChart
                            data={configuration}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                            barCategoryGap={30}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="category" />
                            <YAxis tickFormatter={(value) => `${value}%`} /> {/* <-- отображение процентов */}
                            <Tooltip
                                formatter={(value) => `${value}%`}
                                cursor={{ fill: 'rgba(33, 150, 243, 0.1)' }}
                                contentStyle={{ borderRadius: '12px' }}
                            />
                            <Bar
                                dataKey="value"
                                radius={[8, 8, 0, 0]}
                                isAnimationActive={true}
                                animationDuration={1200}
                            >
                                <Cell fill="#ff9800" /> {/* Аренда */}
                                <Cell fill="#4caf50" /> {/* Обслуживание */}
                                <Cell fill="#03a9f4" /> {/* Коммунальные */}
                                <Cell fill="#e91e63" /> {/* Маркетинг */}
                                <Cell fill="#9c27b0" /> {/* Зарплаты */}
                                <Cell fill="#f44336" /> {/* Всего */}
                            </Bar>
                        </BarChart>
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

                    <ChartBlock title="Финансовое распределение за 12 мес. (Пирог)">
                        <PieChart>
                            <Pie
                                dataKey="value"
                                data={[
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
                    <ChartBlock title="Сравнение показателей по месяцам">
                        <RadarChart outerRadius={90} width={730} height={250} data={data}>
                            <PolarGrid />
                            <PolarAngleAxis dataKey="month" />
                            <PolarRadiusAxis angle={30} domain={[0, 100]} />
                            <Radar name="ROI" dataKey="roi" stroke="#ff9800" fill="#ff9800" fillOpacity={0.6} />
                            <Radar name="Clients" dataKey="clients" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                            <Tooltip />
                        </RadarChart>
                    </ChartBlock>
                </Box>
            </Box>
        </LocalizationProvider>
    );
}

function ChartBlock({title, children}) {
    return (
        <Paper sx={{p: 2, my: 2}} component={motion.div} initial={{opacity: 0}} animate={{opacity: 1}}
               transition={{duration: 0.5}}>
            <Typography variant="h6" gutterBottom>
                {title}
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
                {children}
            </ResponsiveContainer>
        </Paper>
    );
}
