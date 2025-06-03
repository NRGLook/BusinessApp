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
    Button,
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

const ECONOMIC_SCENARIOS = [
    { value: 'bull', label: '📈 Бычий рынок', baseReturnMultiplier: 1.2, volatilityMultiplier: 0.8 },
    { value: 'bear', label: '📉 Медвежий рынок', baseReturnMultiplier: 0.8, volatilityMultiplier: 1.5 },
    { value: 'stagnation', label: '⚖️ Стагнация', baseReturnMultiplier: 1.0, volatilityMultiplier: 1.0 },
    { value: 'crisis', label: '⚡ Кризис', baseReturnMultiplier: 0.5, volatilityMultiplier: 2.0 },
];

const HISTORICAL_DATA = {
    '2008': { // Пример эмуляции кризисного года
        currency: (month) => -0.01 + Math.random() * 0.02,
        stock: (month) => -0.02 + Math.random() * 0.05,
        crypto: (month) => -0.05 + Math.random() * 0.1,
        property: (month) => -0.005 + Math.random() * 0.01,
    },
    '2020': { // Пример эмуляции года с пандемией и последующим ростом
        currency: (month) => (month < 3 ? -0.005 + Math.random() * 0.01 : 0.005 + Math.random() * 0.015),
        stock: (month) => (month < 3 ? -0.03 + Math.random() * 0.07 : 0.01 + Math.random() * 0.03),
        crypto: (month) => 0.02 + Math.random() * 0.08,
        property: (month) => 0.001 + Math.random() * 0.005,
    },
    '2022': { // Пример эмуляции года с высокой инфляцией и нестабильностью
        currency: (month) => 0.01 + Math.random() * 0.03,
        stock: (month) => -0.01 + Math.random() * 0.04,
        crypto: (month) => -0.03 + Math.random() * 0.07,
        property: (month) => 0.008 + Math.random() * 0.02,
    },
};

const HISTORICAL_PERIODS = [ // <---- ПЕРЕМЕСТИЛИ СЮДА
    { value: '', label: 'Нет' },
    { value: '2008', label: '2008' },
    { value: '2020', label: '2020' },
    { value: '2022', label: '2022' },
];

const GEOGRAPHIC_REGIONS = [
    { value: 'default', label: 'Мир' },
    { value: 'us', label: 'США', currency: 'USD' },
    { value: 'eu', label: 'Европа', currency: 'EUR' },
    { value: 'cn', label: 'Китай', currency: 'CNY' },
    { value: 'ru', label: 'Россия', currency: 'RUB' },
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

const getRandomMonthlyChange = (baseRate, volatilityFactor) => {
    const volatility = (0.01 + Math.random() * 0.03) * volatilityFactor;
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
    const [economicScenario, setEconomicScenario] = useState('stagnation');
    const [historicalPeriod, setHistoricalPeriod] = useState('');
    const [geographicRegion, setGeographicRegion] = useState('default');
    const [monthlyContribution, setMonthlyContribution] = useState(0);
    const [isMonthlyContributionEnabled, setIsMonthlyContributionEnabled] = useState(false);

    const [showIncome, setShowIncome] = useState(true);
    const [showVolatility, setShowVolatility] = useState(true);
    const [showSentiment, setShowSentiment] = useState(true);
    const [showEvents, setShowEvents] = useState(true);
    const [showGrowth, setShowGrowth] = useState(true);

    const [incomeData, setIncomeData] = useState([]);
    const [volatilityData, setVolatilityData] = useState([]);
    const [sentimentData, setSentimentData] = useState([]);
    const [randomEventData, setRandomEventData] = useState([]);
    const [monthlyChangeData, setMonthlyChangeData] = useState([]);
    const [showMonthlyChange, setShowMonthlyChange] = useState(false);
    const currentRegionData = useMemo(() => {
        return GEOGRAPHIC_REGIONS.find(region => region.value === geographicRegion) || { currency: 'RUB' };
    }, [geographicRegion]);

    useEffect(() => {
        const calculateIncome = () => {
            const scenario = ECONOMIC_SCENARIOS.find(s => s.value === economicScenario);
            const baseReturnMultiplier = scenario?.baseReturnMultiplier || 1.0;
            const volatilityMultiplier = scenario?.volatilityMultiplier || 1.0;
            let baseRate = getBaseReturnRate(assetType) * baseReturnMultiplier;
            let balance = investment;
            const incomes = [balance];
            const volatilities = [0];
            const sentiments = [0.5];
            const events = [null];

            for (let month = 1; month <= duration; month++) {
                let monthlyChange;
                if (historicalPeriod && HISTORICAL_DATA[historicalPeriod] && HISTORICAL_DATA[historicalPeriod][assetType]) {
                    monthlyChange = HISTORICAL_DATA[historicalPeriod][assetType](month);
                } else {
                    monthlyChange = getRandomMonthlyChange(baseRate, volatilityMultiplier);
                }

                balance += balance * monthlyChange;
                if (isMonthlyContributionEnabled) {
                    balance += monthlyContribution;
                }
                incomes.push(balance);
                volatilities.push(Math.abs(monthlyChange - baseRate) * 100 + Math.random() * 2);
                sentiments.push(Math.min(1, Math.max(0, sentiments[sentiments.length - 1] + (Math.random() * 0.2 - 0.1))));
                events.push(Math.random() < 0.04 ? (Math.random() * 0.05 - 0.025) * balance : 0);
            }

            setIncomeData(incomes.map((b) => b.toFixed(2)));
            setVolatilityData(volatilities.slice(1).map((v) => v.toFixed(2)));
            setSentimentData(sentiments.slice(1).map((s) => parseFloat(s).toFixed(2)));
            setRandomEventData(events.slice(1).map((e) => e.toFixed(2)));

            const monthlyChanges = [];
            for (let i = 1; i < incomes.length; i++) {
                monthlyChanges.push(((incomes[i] - incomes[i - 1]) / incomes[i - 1] * 100).toFixed(2));
            }
            setMonthlyChangeData(monthlyChanges);

            setIncomeData(incomes.map((b) => b.toFixed(2)));
            setVolatilityData(volatilities.slice(1).map((v) => v.toFixed(2)));
            setSentimentData(sentiments.slice(1).map((s) => parseFloat(s).toFixed(2)));
            setRandomEventData(events.slice(1).map((e) => e.toFixed(2)));
        };

        calculateIncome();
    }, [
        investment,
        duration,
        assetType,
        currency,
        propertyIndex,
        stockSymbol,
        cryptoSymbol,
        economicScenario,
        historicalPeriod,
        geographicRegion,
        monthlyContribution,
        isMonthlyContributionEnabled,
    ]);

    const chartOptions = useMemo(() => ({
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
            y: {
                ticks: {
                    callback: (value) => formatCurrency(value, assetType === 'currency' ? currency : currentRegionData.currency),
                },
            },
            x: { title: { display: true, text: 'Месяц' } },
        },
    }), [assetType, currency, currentRegionData.currency]);

    const charts = [
        {
            label: 'Показать Динамику Стоимости',
            checked: showIncome,
            setChecked: setShowIncome,
            show: showIncome,
            chart: <Line data={{
                labels: Array.from({ length: duration }, (_, i) => `Месяц ${i + 1}`),
                datasets: [{
                    label: `Стоимость (${assetType === 'currency' ? currency : currentRegionData.currency})`,
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
                    data: incomeData.map((v, i) => i === 0 ? 0 : ((v - investment - (isMonthlyContributionEnabled ? monthlyContribution * i : 0)) / investment * 100).toFixed(2)),
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
        },
        {
            label: 'Показать Ежемесячный Прирост/Убыток',
            checked: showMonthlyChange,
            setChecked: setShowMonthlyChange,
            show: showMonthlyChange,
            chart: <Line data={{
                labels: Array.from({ length: duration }, (_, i) => `Месяц ${i + 1}`),
                datasets: [{
                    label: 'Прирост/Убыток (%)',
                    data: monthlyChangeData,
                    borderColor: 'rgb(255, 159, 64)',
                    backgroundColor: 'rgba(255, 159, 64, 0.5)',
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

            <Grid container spacing={3} sx={{ mb: 4, alignItems: 'center' }}>
                <Grid item xs={12} md={4}>
                    <Tooltip
                        title="Введите сумму начальной инвестиции в выбранной валюте"
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
                            label={`Начальная Инвестиция (${currentRegionData.currency})`}
                            type="number"
                            value={parseFloat(investment).toFixed(2)}
                            onChange={(e) => setInvestment(Math.max(0, parseFloat(e.target.value)))}
                            InputProps={{ startAdornment: <WalletOutlinedIcon sx={{ mr: 1 }} /> }}
                        />
                    </Tooltip>
                </Grid>

                <Grid item xs={12} md={4}>
                    <FormControl fullWidth>
                        <InputLabel id="economic-scenario-label">Экономический Сценарий</InputLabel>
                        <Select
                            labelId="economic-scenario-label"
                            value={economicScenario}
                            label="Экономический Сценарий"
                            onChange={(e) => setEconomicScenario(e.target.value)}
                        >
                            {ECONOMIC_SCENARIOS.map((scenario) => (
                                <MenuItem key={scenario.value} value={scenario.value}>
                                    {scenario.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>

                <Grid item xs={12} md={4}>
                    <FormControl fullWidth>
                        <InputLabel id="historical-period-label">Исторический Период</InputLabel>
                        <Select
                            labelId="historical-period-label"
                            value={historicalPeriod}
                            label="Исторический Период"
                            onChange={(e) => setHistoricalPeriod(e.target.value)}
                            // disabled // Исторические данные пока не реализованы (УДАЛЕНО или ЗАКОММЕНТИРОВАНО)
                        >
                            {HISTORICAL_PERIODS.map((period) => (
                                <MenuItem key={period.value} value={period.value}>
                                    {period.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>

                <Grid item xs={12} md={4}>
                    <FormControl fullWidth>
                        <InputLabel id="geographic-region-label">Регион</InputLabel>
                        <Select
                            labelId="geographic-region-label"
                            value={geographicRegion}
                            label="Регион"
                            onChange={(e) => {
                                setGeographicRegion(e.target.value);
                                // Сброс валюты, если регион меняется и у него есть своя валюта по умолчанию
                                const selectedRegion = GEOGRAPHIC_REGIONS.find(r => r.value === e.target.value);
                                if (selectedRegion?.currency) {
                                    setCurrency(selectedRegion.currency);
                                }
                            }}
                        >
                            {GEOGRAPHIC_REGIONS.map((region) => (
                                <MenuItem key={region.value} value={region.value}>
                                    {region.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>

                <Grid item xs={12} md={4}>
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
                </Grid>

                {assetType === 'currency' && (
                    <Grid item xs={12} md={4}>
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
                    </Grid>
                )}

                {assetType === 'property' && (
                    <Grid item xs={12} md={4}>
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
                                        Дом #{i + 1} — {formatCurrency(price, currentRegionData.currency)}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                )}

                {assetType === 'stock' && (
                    <Grid item xs={12} md={4}>
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
                    </Grid>
                )}

                {assetType === 'crypto' && (
                    <Grid item xs={12} md={4}>
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
                    </Grid>
                )}

                <Grid item xs={12}>
                    <Box display="flex" alignItems="center">
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={isMonthlyContributionEnabled}
                                    onChange={(e) => setIsMonthlyContributionEnabled(e.target.checked)}
                                />
                            }
                            label="Вносить каждый месяц"
                        />
                        {isMonthlyContributionEnabled && (
                            <TextField
                                label={`Сумма взноса (${currentRegionData.currency})`}
                                type="number"
                                value={monthlyContribution}
                                onChange={(e) => setMonthlyContribution(Math.max(0, parseFloat(e.target.value) || 0))}
                                size="small"
                                sx={{ ml: 2, width: '200px' }}
                            />
                        )}
                    </Box>
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
                        <Typography variant="h6">{formatCurrency(investment, currentRegionData.currency)}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="subtitle2" color="text.secondary">Конечная сумма</Typography>
                        <Typography variant="h6">
                            {formatCurrency(parseFloat(incomeData[incomeData.length - 1] || 0), currentRegionData.currency)}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="subtitle2" color="text.secondary">Общий доход</Typography>
                        <Typography variant="h6">
                            {formatCurrency(
                                parseFloat((incomeData[incomeData.length - 1] - investment - (isMonthlyContributionEnabled ? monthlyContribution * duration : 0)) || 0),
                                currentRegionData.currency
                            )}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="subtitle2" color="text.secondary">Доходность (%)</Typography>
                        <Typography variant="h6">
                            {incomeData.length > 1
                                ? ((incomeData[incomeData.length - 1] - investment - (isMonthlyContributionEnabled ? monthlyContribution * duration : 0)) / investment * 100).toFixed(2) + '%'
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