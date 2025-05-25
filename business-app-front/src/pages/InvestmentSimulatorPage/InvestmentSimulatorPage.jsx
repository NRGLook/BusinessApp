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
import WalletOutlinedIcon from '@mui/icons-material/WalletOutlined';
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
const ALL_STOCK_SYMBOLS = [
    'AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA', 'NVDA', 'JPM', 'V', 'JNJ', 'PG',
    'BABA', 'TCEHY', 'FB', 'NFLX', 'ADBE', 'CRM', 'PYPL', 'INTC', 'CSCO', 'KO',
];
const ALL_CRYPTO_SYMBOLS = [
    'BTC', 'ETH', 'LTC', 'DOGE', 'XRP', 'ADA', 'SOL', 'DOT', 'AVAX', 'SHIB',
    'TRX', 'BNB', 'USDT', 'USDC', 'BUSD', 'MATIC', 'LINK', 'XLM', 'EOS', 'XTZ',
];

const initialData = {
    investment: 100000 + Math.random() * 500000,
    duration: Math.floor(Math.random() * MONTHS) + 1,
    assetType: ASSET_TYPES[Math.floor(Math.random() * ASSET_TYPES.length)],
    currency: CURRENCIES[Math.floor(Math.random() * CURRENCIES.length)],
    propertyIndex: Math.floor(Math.random() * PROPERTY_PRICES.length),
    stockSymbol: ALL_STOCK_SYMBOLS[Math.floor(Math.random() * ALL_STOCK_SYMBOLS.length)],
    cryptoSymbol: ALL_CRYPTO_SYMBOLS[Math.floor(Math.random() * ALL_CRYPTO_SYMBOLS.length)],
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
                    borderColor: 'rgb(75, 192, 192)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    tension: 0.4,
                    fill: true,
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
            <Typography
                variant="h4"
                sx={{ mb: 3, fontWeight: 700, display: 'flex', alignItems: 'center' }}
            >
                <ShowChartIcon sx={{ mr: 1 }} /> Динамичный Симулятор Инвестиций
            </Typography>

            <Grid container spacing={4} sx={{ mb: 4, alignItems: 'center' }}>
                {/* Row for Investment and Asset Type */}
                <Grid item xs={12}>
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={9}>
                            <Tooltip
                                title="Введите сумму начальной инвестиции в рублях"
                                enterTouchDelay={50}
                                leaveTouchDelay={3000}
                                arrow
                                PopperProps={{
                                    modifiers: [
                                        {
                                            name: 'preventOverflow',
                                            options: {
                                                boundary: 'viewport',
                                            },
                                        },
                                    ],
                                }}
                            >
                                <TextField
                                    fullWidth
                                    label="Начальная Инвестиция (₽)"
                                    type="number"
                                    value={parseFloat(investment).toFixed(2)}
                                    onChange={(e) => setInvestment(Math.max(0, parseFloat(e.target.value)))}
                                    InputProps={{ startAdornment: <WalletOutlinedIcon sx={{ mr: 1 }} /> }}
                                />
                            </Tooltip>
                        </Grid>
                        <Grid item xs={12}>
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                                <Typography>
                                    Длительность: {duration} мес.
                                    <Tooltip title="Выберите длительность инвестирования (в месяцах)" arrow>
                                        <InfoOutlinedIcon sx={{ ml: 1, fontSize: 18 }} />
                                    </Tooltip>
                                </Typography>
                            </Box>
                            <Slider
                                value={duration}
                                onChange={(_, val) => setDuration(val)}
                                step={1}
                                min={1}
                                max={MONTHS}
                                marks
                                valueLabelDisplay="auto"
                            />
                        </Grid>
                    </Grid>
                </Grid>

                {/* Asset Type and dependent inputs */}
                <Grid item xs={12} md={3}>
                    <Tooltip title="Выберите тип актива">
                        <FormControl fullWidth>
                            <InputLabel id="asset-type-label">Тип Активов</InputLabel>
                            <Select
                                labelId="asset-type-label"
                                value={assetType}
                                label="Тип Активов"
                                onChange={(e) => setAssetType(e.target.value)}
                            >
                                {ASSET_TYPES.map((type) => (
                                    <MenuItem key={type} value={type}>
                                        {type.charAt(0).toUpperCase() + type.slice(1)}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Tooltip>
                </Grid>

                {assetType === 'currency' && (
                    <Grid item xs={12} md={3}>
                        <Tooltip title="Выберите валюту инвестиций">
                            <FormControl fullWidth>
                                <InputLabel id="currency-label">Валюта</InputLabel>
                                <Select
                                    labelId="currency-label"
                                    value={currency}
                                    label="Валюта"
                                    onChange={(e) => setCurrency(e.target.value)}
                                >
                                    {CURRENCIES.map((curr) => (
                                        <MenuItem key={curr} value={curr}>
                                            {curr}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Tooltip>
                    </Grid>
                )}

                {assetType === 'property' && (
                    <Grid item xs={12} md={3}>
                        <Tooltip title="Выберите объект недвижимости">
                            <FormControl fullWidth>
                                <InputLabel id="property-label">Объект Недвижимости</InputLabel>
                                <Select
                                    labelId="property-label"
                                    value={propertyIndex}
                                    label="Объект Недвижимости"
                                    onChange={(e) => setPropertyIndex(parseInt(e.target.value, 10))}
                                >
                                    {PROPERTY_PRICES.map((price, i) => (
                                        <MenuItem key={i} value={i}>
                                            Дом #{i + 1} — {formatCurrency(price)}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Tooltip>
                    </Grid>
                )}

                {assetType === 'stock' && (
                    <Grid item xs={12} md={3}>
                        <Tooltip title="Выберите акцию">
                            <FormControl fullWidth>
                                <InputLabel id="stock-label">Акция</InputLabel>
                                <Select
                                    labelId="stock-label"
                                    value={stockSymbol}
                                    label="Акция"
                                    onChange={(e) => setStockSymbol(e.target.value)}
                                >
                                    {ALL_STOCK_SYMBOLS.map((symbol) => (
                                        <MenuItem key={symbol} value={symbol}>
                                            {symbol}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Tooltip>
                    </Grid>
                )}

                {assetType === 'crypto' && (
                    <Grid item xs={12} md={3}>
                        <Tooltip title="Выберите криптовалюту">
                            <FormControl fullWidth>
                                <InputLabel id="crypto-label">Криптовалюта</InputLabel>
                                <Select
                                    labelId="crypto-label"
                                    value={cryptoSymbol}
                                    label="Криптовалюта"
                                    onChange={(e) => setCryptoSymbol(e.target.value)}
                                >
                                    {ALL_CRYPTO_SYMBOLS.map((symbol) => (
                                        <MenuItem key={symbol} value={symbol}>
                                            {symbol}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Tooltip>
                    </Grid>
                )}
            </Grid>

            <Box
                sx={{
                    mb: 3,
                    p: 2,
                    border: '1px solid #ddd',
                    borderRadius: 2,
                    backgroundColor: '#f9f9f9',
                }}
            >
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    Сводка Инвестиций
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="subtitle2" color="text.secondary">Начальная сумма</Typography>
                        <Typography variant="h6">{formatCurrency(investment)}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="subtitle2" color="text.secondary">Конечная сумма</Typography>
                        <Typography variant="h6">{formatCurrency(parseFloat(incomeData[incomeData.length - 1] || 0))}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="subtitle2" color="text.secondary">Общий доход</Typography>
                        <Typography variant="h6">
                            {formatCurrency(parseFloat((incomeData[incomeData.length - 1] - investment) || 0))}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="subtitle2" color="text.secondary">Доходность (%)</Typography>
                        <Typography variant="h6">
                            {incomeData.length > 1
                                ? ((incomeData[incomeData.length - 1] - investment) / investment * 100).toFixed(2) + '%'
                                : '—'}
                        </Typography>
                    </Grid>
                </Grid>
            </Box>

            <Divider sx={{ mb: 3 }} />

            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Настройки Отображения Графиков
                <Tooltip title="Выберите, какие данные отображать на графиках" placement="right" arrow>
                    <InfoOutlinedIcon sx={{ ml: 1, fontSize: 20, verticalAlign: 'middle' }} />
                </Tooltip>
            </Typography>

            <Grid container spacing={2} sx={{ mb: 4 }}>
                {charts.map(({ label, checked, setChecked }) => (
                    <Grid item xs={12} sm={6} md={3} key={label}>
                        <FormControlLabel
                            control={<Checkbox checked={checked} onChange={() => setChecked(!checked)} />}
                            label={label}
                        />
                    </Grid>
                ))}
            </Grid>

            <Divider sx={{ mb: 3 }} />

            <Box sx={{ overflowX: 'auto', pb: 2 }}>
                {charts.map(({ show, chart }, idx) =>
                    show ? (
                        <Box
                            key={idx}
                            sx={{
                                minWidth: '900px',
                                height: 400,
                                mb: 4,
                                pr: 2
                            }}
                        >
                            {chart}
                        </Box>
                    ) : null
                )}
            </Box>

        </Box>
    );
}
