import React, { useState, useMemo, useEffect } from 'react';
import {
    Box,
    Typography,
    TextField,
    Slider,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Paper,
    Snackbar,
    Alert,
    Grid,
    FormControlLabel,
    Checkbox,
    Divider,
    Tooltip,
} from '@mui/material';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip as ChartTooltip,
    Legend,
} from 'chart.js';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import WalletIcon from '@mui/icons-material/Wallet';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ChartTooltip, Legend);

const MONTHS = 36;
const PROPERTY_PRICES = [
    5000000 + Math.random() * 2000000,
    10000000 + Math.random() * 5000000,
    15000000 + Math.random() * 8000000,
];
const CURRENCY_RATES = {
    USD: 75.0 + Math.random() * 5,
    EUR: 82.0 + Math.random() * 5,
    CNY: 10.0 + Math.random() * 1,
};
const ASSET_TYPES = ['currency', 'property', 'stock', 'crypto'];
const CURRENCIES = Object.keys(CURRENCY_RATES);
const STOCK_SYMBOLS = ['AAPL', 'GOOGL', 'TSLA', 'AMZN'];
const CRYPTO_SYMBOLS = ['BTC', 'ETH', 'LTC', 'DOGE'];

const initialData = {
    investment: 100000 + Math.random() * 500000,
    duration: Math.floor(Math.random() * MONTHS) + 1,
    assetType: ASSET_TYPES[Math.floor(Math.random() * ASSET_TYPES.length)],
    currency: CURRENCIES[Math.floor(Math.random() * CURRENCIES.length)],
    propertyIndex: Math.floor(Math.random() * PROPERTY_PRICES.length),
    stockSymbol: STOCK_SYMBOLS[Math.floor(Math.random() * STOCK_SYMBOLS.length)],
    cryptoSymbol: CRYPTO_SYMBOLS[Math.floor(Math.random() * CRYPTO_SYMBOLS.length)],
};

const getRandomMonthlyChange = (baseRate) => {
    const volatility = 0.01 + Math.random() * 0.03;
    const direction = Math.random() > 0.5 ? 1 : -1;
    const randomFactor = Math.random() * 0.02 - 0.01;
    return baseRate + direction * volatility * Math.random() + randomFactor;
};

const getBaseReturnRate = (assetType) => {
    switch (assetType) {
        case 'currency':
            return 0.002 + Math.random() * 0.004;
        case 'property':
            return 0.003 + Math.random() * 0.008;
        case 'stock':
            return 0.005 + Math.random() * 0.015;
        case 'crypto':
            return -0.005 + Math.random() * 0.03;
        default:
            return 0.004 + Math.random() * 0.01;
    }
};

const formatCurrency = (amount, currency = 'RUB') =>
    new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);

export default function InvestmentSimulatorPage() {
    const [investment, setInvestment] = useState(initialData.investment);
    const [duration, setDuration] = useState(initialData.duration);
    const [assetType, setAssetType] = useState(initialData.assetType);
    const [currency, setCurrency] = useState(initialData.currency);
    const [propertyIndex, setPropertyIndex] = useState(initialData.propertyIndex);
    const [stockSymbol, setStockSymbol] = useState(initialData.stockSymbol);
    const [cryptoSymbol, setCryptoSymbol] = useState(initialData.cryptoSymbol);

    const [showIncome, setShowIncome] = useState(true);
    const [showVolatility, setShowVolatility] = useState(true);
    const [showSentiment, setShowSentiment] = useState(true);
    const [showEvents, setShowEvents] = useState(true);
    const [showGrowth, setShowGrowth] = useState(true);

    const [incomeData, setIncomeData] = useState([]);
    const [volatilityData, setVolatilityData] = useState([]);
    const [sentimentData, setSentimentData] = useState([]);
    const [randomEventData, setRandomEventData] = useState([]);

    useEffect(() => {
        const calculateIncome = () => {
            const baseRate = getBaseReturnRate(assetType);
            let balance = investment;
            const incomes = [balance];
            const volatilities = [0];
            const sentiments = [0.5];
            const events = [null];

            for (let month = 1; month <= duration; month++) {
                const monthlyChange = getRandomMonthlyChange(baseRate);
                balance += balance * monthlyChange;
                incomes.push(balance);
                volatilities.push(Math.abs(monthlyChange - baseRate) * 100 + Math.random() * 2);
                sentiments.push(Math.min(1, Math.max(0, sentiments[sentiments.length - 1] + (Math.random() * 0.2 - 0.1))));
                events.push(Math.random() < 0.04 ? (Math.random() * 0.05 - 0.025) * balance : 0);
            }

            setIncomeData(incomes.map((b) => b.toFixed(2)));
            setVolatilityData(volatilities.slice(1).map((v) => v.toFixed(2)));
            setSentimentData(sentiments.slice(1).map((s) => parseFloat(s).toFixed(2)));
            setRandomEventData(events.slice(1).map((e) => e.toFixed(2)));
        };

        calculateIncome();
    }, [investment, duration, assetType, currency, propertyIndex, stockSymbol, cryptoSymbol]);

    const chartOptions = useMemo(() => ({
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
            y: {
                ticks: {
                    callback: (value) => formatCurrency(value, assetType === 'currency' ? currency : 'RUB'),
                },
            },
            x: { title: { display: true, text: 'Месяц' } },
        },
    }), [assetType, currency]);

    const charts = [
        {
            label: 'Показать Динамику Стоимости',
            checked: showIncome,
            setChecked: setShowIncome,
            show: showIncome,
            chart: <Line data={{
                labels: Array.from({ length: duration }, (_, i) => `Месяц ${i + 1}`),
                datasets: [{
                    label: `Стоимость (${assetType === 'currency' ? currency : '₽'})`,
                    data: incomeData,
                    borderColor: 'rgb(75, 192, 192)', backgroundColor: 'rgba(75, 192, 192, 0.2)', tension: 0.4, fill: true,
                }],
            }} options={chartOptions} />
        },
        {
            label: 'Показать Волатильность',
            checked: showVolatility,
            setChecked: setShowVolatility,
            show: showVolatility,
            chart: <Line data={{
                labels: Array.from({ length: duration }, (_, i) => `Месяц ${i + 1}`),
                datasets: [{
                    label: 'Волатильность (%)',
                    data: volatilityData,
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                    tension: 0.4,
                }],
            }} options={{
                ...chartOptions,
                scales: {
                    ...chartOptions.scales,
                    y: {
                        title: {
                            display: true,
                            text: 'Изменение (%)',
                        },
                    },
                },
            }} />
        },
        {
            label: 'Показать Рыночный Сентимент',
            checked: showSentiment,
            setChecked: setShowSentiment,
            show: showSentiment,
            chart: <Line data={{
                labels: Array.from({ length: duration }, (_, i) => `Месяц ${i + 1}`),
                datasets: [{
                    label: 'Рыночный Сентимент',
                    data: sentimentData,
                    borderColor: 'rgb(54, 162, 235)',
                    backgroundColor: 'rgba(54, 162, 235, 0.5)',
                    tension: 0.4,
                }],
            }} options={{
                ...chartOptions,
                scales: {
                    ...chartOptions.scales,
                    y: {
                        min: 0,
                        max: 1,
                        title: {
                            display: true,
                            text: 'Индекс (0-1)',
                        },
                    },
                },
            }} />
        },
        {
            label: 'Показать Случайные События',
            checked: showEvents,
            setChecked: setShowEvents,
            show: showEvents,
            chart: <Line data={{
                labels: Array.from({ length: duration }, (_, i) => `Месяц ${i + 1}`),
                datasets: [{
                    label: 'Случайные События',
                    data: randomEventData,
                    borderColor: 'rgb(255, 206, 86)',
                    backgroundColor: 'rgba(255, 206, 86, 0.5)',
                    tension: 0.4,
                }],
            }} options={{
                ...chartOptions,
                scales: {
                    ...chartOptions.scales,
                    y: {
                        title: {
                            display: true,
                            text: 'Рубли (₽)',
                        },
                    },
                },
            }} />
        },
        {
            label: 'Показать Общий Рост',
            checked: showGrowth,
            setChecked: setShowGrowth,
            show: showGrowth,
            chart: <Line data={{
                labels: Array.from({ length: duration }, (_, i) => `Месяц ${i + 1}`),
                datasets: [{
                    label: 'Рост Инвестиций (%)',
                    data: incomeData.map((v, i) => i === 0 ? 0 : ((v - incomeData[0]) / incomeData[0] * 100).toFixed(2)),
                    borderColor: 'rgb(153, 102, 255)',
                    backgroundColor: 'rgba(153, 102, 255, 0.4)',
                    tension: 0.4,
                }],
            }} options={{
                ...chartOptions,
                scales: {
                    ...chartOptions.scales,
                    y: {
                        title: {
                            display: true,
                            text: 'Рост (%)',
                        },
                    },
                },
            }} />
        }
    ];

    return (
        <Box sx={{ flexGrow: 1, p: 3 }}>
            <Typography variant="h4" sx={{ mb: 3, fontWeight: 700, display: 'flex', alignItems: 'center' }}>
                <ShowChartIcon sx={{ mr: 1 }} /> Супер Динамичный Симулятор Инвестиций
            </Typography>

            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={3}>
                    <TextField
                        fullWidth
                        label="Начальная Инвестиция (₽)"
                        type="number"
                        value={parseFloat(investment).toFixed(2)}
                        onChange={(e) => setInvestment(Math.max(0, parseFloat(e.target.value)))}
                        InputProps={{ startAdornment: <WalletIcon color="action" /> }}
                    />
                </Grid>
                <Grid item xs={12} md={3}>
                    <FormControl fullWidth>
                        <InputLabel id="asset-type-label">Тип Актива</InputLabel>
                        <Select labelId="asset-type-label" value={assetType} onChange={(e) => setAssetType(e.target.value)}>
                            {ASSET_TYPES.map((type) => (
                                <MenuItem key={type} value={type}>{type.toUpperCase()}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} md={3}>
                    <FormControl fullWidth disabled={assetType !== 'currency'}>
                        <InputLabel id="currency-label">Валюта</InputLabel>
                        <Select labelId="currency-label" value={currency} onChange={(e) => setCurrency(e.target.value)}>
                            {CURRENCIES.map((c) => (
                                <MenuItem key={c} value={c}>{c}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} md={3}>
                    <Typography gutterBottom>Срок (мес.): {duration}</Typography>
                    <Slider min={1} max={MONTHS} value={duration} onChange={(_, val) => setDuration(val)} valueLabelDisplay="auto" />
                </Grid>
            </Grid>

            <Paper sx={{ p: 3, mb: 4, backgroundColor: '#f1f8e9' }}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    <InfoOutlinedIcon color="primary" sx={{ mr: 1 }} /> Итоговый Прогноз
                </Typography>
                <Typography variant="h5" color="success.main" fontWeight={700}>
                    {formatCurrency(parseFloat(incomeData[incomeData.length - 1] || 0), currency)}
                </Typography>
            </Paper>

            <Grid container spacing={3}>
                {charts.map(({ label, checked, setChecked, show, chart }, index) => (
                    <Grid key={index} item xs={12}>
                        <Paper sx={{ p: 2 }}>
                            <FormControlLabel
                                control={<Checkbox checked={checked} onChange={(e) => setChecked(e.target.checked)} />}
                                label={label}
                            />
                            {show && <Box sx={{ height: 350 }}>{chart}</Box>}
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}