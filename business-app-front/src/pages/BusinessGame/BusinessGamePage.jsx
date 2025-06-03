import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
    Box,
    Typography,
    Button,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Grid,
    Card,
    CardContent,
    Tooltip,
    Alert,
    Snackbar,
    FormControlLabel,
    Switch,
    createTheme,
    ThemeProvider,
    CssBaseline,
    LinearProgress,
} from '@mui/material';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import GppBadIcon from '@mui/icons-material/GppBad';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CasinoIcon from '@mui/icons-material/Casino';
import CoffeeIcon from '@mui/icons-material/Coffee'; // For coffee shop
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid'; // For app development
import LocalShippingIcon from '@mui/icons-material/LocalShipping'; // For dropshipping
import ArtTrackIcon from '@mui/icons-material/ArtTrack'; // For art gallery
import AgricultureIcon from '@mui/icons-material/Agriculture'; // For local farm

// Import Chart.js components
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip as ChartTooltip, // Renamed to avoid conflict with Material-UI Tooltip
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    ChartTooltip,
    Legend
);


// --- In-line Data ---
const projectsData = [
    {
        "id": "coffee_shop",
        "name": "Открыть кофейню",
        "description": "Классический бизнес с локальной клиентской базой. Высокая конкуренция, но при правильном подходе может принести стабильный доход.",
        "risk": 3,
        "potentialProfit": "medium",
        "intuitionHint": "Рынок кофеен насыщен, но уникальная концепция или локация могут изменить все. Ищите нишу.",
        "profitFactor": 0.5, // 50% profit on success
        "successThreshold": 60, // Need to roll 60 or higher
        "icon": CoffeeIcon,
    },
    {
        "id": "app_development",
        "name": "Разработка мобильного приложения",
        "description": "Высокотехнологичный проект с потенциалом быстрого роста, но требующий значительных начальных инвестиций и подверженный изменениям рынка.",
        "risk": 4,
        "potentialProfit": "high",
        "intuitionHint": "Идея — лишь начало. Важна команда, маркетинг и готовность к изменениям. Юзабилити решает.",
        "profitFactor": 1.2, // 120% profit on success
        "successThreshold": 75, // Need to roll 75 or higher
        "icon": PhoneAndroidIcon,
    },
    {
        "id": "dropshipping",
        "name": "Дропшиппинг",
        "description": "Низкий порог входа, не требуется склад. Зависит от поставщиков, трендов и эффективной рекламы. Прибыль может быть нестабильной.",
        "risk": 3,
        "potentialProfit": "low",
        "intuitionHint": "Ключ к успеху в дропшиппинге — выбор ниши и надежные поставщики. Избегайте перенасыщенных рынков.",
        "profitFactor": 0.2, // 20% profit on success
        "successThreshold": 50, // Need to roll 50 or higher
        "icon": LocalShippingIcon,
    },
    {
        "id": "art_gallery",
        "name": "Арт-галерея",
        "description": "Культурный проект, требующий страсти к искусству и связей. Потенциал высокой прибыли, но с высоким риском и длительным сроком окупаемости.",
        "risk": 5,
        "potentialProfit": "high",
        "intuitionHint": "Искусство — это долгосрочная игра. Важна репутация, сеть контактов и понимание рынка. Не для быстрых денег.",
        "profitFactor": 1.5, // 150% profit on success
        "successThreshold": 85, // Need to roll 85 or higher
        "icon": ArtTrackIcon,
    },
    {
        "id": "local_farm",
        "name": "Локальная ферма",
        "description": "Экологически чистый продукт с растущим спросом. Зависит от погоды, земли и первоначальных затрат. Стабильный, но медленный рост.",
        "risk": 2,
        "potentialProfit": "medium",
        "intuitionHint": "Устойчивый рост и лояльные клиенты. Риски связаны с природой, но инвестиции окупаются стабильностью и репутацией.",
        "profitFactor": 0.4, // 40% profit on success
        "successThreshold": 40, // Need to roll 40 or higher
        "icon": AgricultureIcon,
    }
];

// --- Game Settings ---
const INITIAL_CAPITAL = 5000;
const GOAL_CAPITAL = 20000;
const STARTING_TURNS = 10;
const INTUITION_MODIFIER = 10; // Bonus for intuition
const FAILURE_LOSS_FACTOR = 0.8; // Lose 80% on failure

// --- Theme (Optional, but good practice for Material-UI) ---
const theme = createTheme();

// Helper to format currency
const formatCurrency = (amount, currencySymbol = '€') => {
    return new Intl.NumberFormat('de-DE', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);
};

const BusinessGamePage = () => {
    // --- Game State Variables ---
    const [currentCapital, setCurrentCapital] = useState(INITIAL_CAPITAL);
    const [turnsLeft, setTurnsLeft] = useState(STARTING_TURNS);
    const [winStreak, setWinStreak] = useState(0);
    const [highestWinStreak, setHighestWinStreak] = useState(0);
    const [gamesPlayed, setGamesPlayed] = useState(0);
    const [gamesWon, setGamesWon] = useState(0);
    const [gamePhase, setGamePhase] = useState('playing'); // 'playing', 'won', 'lost'
    const [capitalHistory, setCapitalHistory] = useState([{ turn: 0, capital: INITIAL_CAPITAL }]); // For chart

    // --- Existing State Variables ---
    const [selectedProjectId, setSelectedProjectId] = useState(projectsData[0].id);
    const [investmentAmount, setInvestmentAmount] = useState(500);
    const [gameResult, setGameResult] = useState(null); // { success: boolean, profit: number }
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [showIntuition, setShowIntuition] = useState(false);
    const [rollResult, setRollResult] = useState(null);
    const [rollExplanation, setRollExplanation] = useState('');
    const [capitalFlash, setCapitalFlash] = useState(false); // New: for visual flash
    const [isRolling, setIsRolling] = useState(false); // For dice animation

    const selectedProject = useMemo(() => {
        return projectsData.find(p => p.id === selectedProjectId);
    }, [selectedProjectId]);

    // --- Game Reset Function ---
    const resetGame = useCallback(() => {
        setCurrentCapital(INITIAL_CAPITAL);
        setTurnsLeft(STARTING_TURNS);
        setWinStreak(0);
        setGameResult(null);
        setSelectedProjectId(projectsData[0].id);
        setInvestmentAmount(500);
        setGamePhase('playing');
        setSnackbarOpen(false);
        setRollResult(null);
        setRollExplanation('');
        setGamesPlayed(0);
        setGamesWon(0);
        setHighestWinStreak(0);
        setCapitalHistory([{ turn: 0, capital: INITIAL_CAPITAL }]); // Reset history
        setIsRolling(false);
    }, []);

    // --- Game Logic: handleInvest ---
    const handleInvest = () => {
        if (gamePhase !== 'playing') {
            setSnackbarMessage('Игра завершена. Начните новую игру.');
            setSnackbarOpen(true);
            return;
        }

        if (!selectedProject) {
            setSnackbarMessage('Пожалуйста, выберите проект для инвестирования.');
            setSnackbarOpen(true);
            return;
        }
        if (investmentAmount <= 0) {
            setSnackbarMessage('Сумма инвестиции должна быть больше нуля.');
            setSnackbarOpen(true);
            return;
        }
        if (investmentAmount > currentCapital) {
            setSnackbarMessage('Недостаточно средств для этой инвестиции!');
            setSnackbarOpen(true);
            return;
        }

        setIsRolling(true); // Start rolling animation

        setTimeout(() => { // Simulate rolling time
            setGamesPlayed(prev => prev + 1);
            const newTurnsLeft = turnsLeft - 1;
            setTurnsLeft(newTurnsLeft); // Decrement turns

            let explanation = [];
            let baseRoll = Math.floor(Math.random() * 100) + 1; // Roll from 1 to 100
            explanation.push(`Вы бросили кубик: ${baseRoll}.`);

            let finalRoll = baseRoll;

            // Apply risk modifier: Higher risk reduces the roll
            let riskModifier = 0;
            switch (selectedProject.risk) {
                case 1: riskModifier = 10; explanation.push(`(${selectedProject.name} имеет низкий риск: +${riskModifier} к броску).`); break;
                case 2: riskModifier = 5; explanation.push(`(${selectedProject.name} имеет умеренный риск: +${riskModifier} к броску).`); break;
                case 3: riskModifier = 0; explanation.push(`(${selectedProject.name} имеет средний риск: без изменений).`); break;
                case 4: riskModifier = -5; explanation.push(`(${selectedProject.name} имеет высокий риск: ${riskModifier} к броску).`); break;
                case 5: riskModifier = -15; explanation.push(`(${selectedProject.name} имеет очень высокий риск: ${riskModifier} к броску).`); break;
                default: break;
            }
            finalRoll += riskModifier;

            // Apply intuition modifier
            const intuitionBonus = showIntuition ? INTUITION_MODIFIER : 0;
            if (intuitionBonus > 0) {
                finalRoll += intuitionBonus;
                explanation.push(`(Интуиция активирована: +${intuitionBonus} к броску).`);
                setSnackbarMessage('Интуиция активирована: Ваши шансы немного увеличились!');
                setSnackbarOpen(true);
            }

            // Clamp finalRoll between 1 and 100
            finalRoll = Math.max(1, Math.min(100, finalRoll));
            explanation.push(`Финальный результат броска: ${finalRoll}.`);

            const success = finalRoll >= selectedProject.successThreshold;

            let profitLossAmount = 0;
            let newCapital = currentCapital;

            if (success) {
                profitLossAmount = investmentAmount * selectedProject.profitFactor;
                newCapital += profitLossAmount;
                setWinStreak(prev => prev + 1);
                setGamesWon(prev => prev + 1);
                setGameResult({ success: true, profit: profitLossAmount });
                explanation.push(`Для успеха требовался бросок не менее ${selectedProject.successThreshold}. Ваш бросок ${finalRoll} успешно прошел!`);
            } else {
                profitLossAmount = -investmentAmount * FAILURE_LOSS_FACTOR;
                newCapital += profitLossAmount;
                setWinStreak(0); // Reset streak on loss
                setGameResult({ success: false, profit: profitLossAmount });
                explanation.push(`Для успеха требовался бросок не менее ${selectedProject.successThreshold}. Ваш бросок ${finalRoll} был ниже порога. Проект не окупился.`);
            }

            setCurrentCapital(newCapital);
            setRollResult(finalRoll);
            setRollExplanation(explanation.join(' '));

            // Update highest win streak
            if (winStreak + (success ? 1 : 0) > highestWinStreak) {
                setHighestWinStreak(winStreak + (success ? 1 : 0));
            }

            // Add to capital history for the chart
            setCapitalHistory(prev => [...prev, { turn: prev.length, capital: newCapital }]);

            // Trigger capital flash effect
            setCapitalFlash(true);
            setTimeout(() => setCapitalFlash(false), 500); // Flash for 0.5 seconds
            setIsRolling(false); // Stop rolling animation
        }, 1500); // Simulate 1.5 seconds of rolling
    };

    // --- Check Game End Conditions ---
    useEffect(() => {
        if (gamePhase === 'playing') {
            if (currentCapital >= GOAL_CAPITAL) {
                setGamePhase('won');
                setSnackbarMessage(`Поздравляем! Вы достигли цели в ${formatCurrency(GOAL_CAPITAL)}!`);
                setSnackbarOpen(true);
            } else if (currentCapital <= 0 || turnsLeft <= 0) {
                setGamePhase('lost');
                setSnackbarMessage(`Игра окончена! Вы либо обанкротились, либо у вас закончились ходы.`);
                setSnackbarOpen(true);
            }
        }
    }, [currentCapital, turnsLeft, gamePhase]);

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

    // Calculate progress towards goal
    const progress = Math.min(100, (currentCapital / GOAL_CAPITAL) * 100);

    // Chart data and options
    const chartData = {
        labels: capitalHistory.map(entry => `Ход ${entry.turn}`),
        datasets: [
            {
                label: 'Ваш Капитал',
                data: capitalHistory.map(entry => entry.capital),
                fill: false,
                borderColor: theme.palette.primary.main,
                backgroundColor: theme.palette.primary.light,
                tension: 0.1,
                pointRadius: 5,
                pointBackgroundColor: theme.palette.primary.dark,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Динамика Капитала',
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Ход Игры',
                },
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)',
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Капитал (€)',
                },
                beginAtZero: true,
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)',
                },
            },
        },
    };

    const diceRollStyle = {
        fontSize: '3rem',
        fontWeight: 'bold',
        color: gameResult?.success ? 'success.main' : 'error.main',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        transition: 'transform 1s ease-in-out', // Smooth transition
        transform: isRolling ? 'rotate(360deg)' : 'rotate(0deg)', // Rotate during rolling
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={{ flexGrow: 1, p: 3, maxWidth: 900, mx: 'auto' }}>
                <Typography variant="h4" sx={{ mb: 3, fontWeight: 700, display: 'flex', alignItems: 'center' }}>
                    <BusinessCenterIcon sx={{ mr: 1 }} /> Игра в риск: Оцени проект
                </Typography>

                {/* --- Game Stats --- */}
                <Card variant="outlined" sx={{ mb: 3 }}>
                    <CardContent>
                        <Typography variant="h6" sx={{ mb: 1 }}>
                            Ваш Капитал:{' '}
                            <Box
                                component="span"
                                fontWeight="bold"
                                sx={{
                                    transition: 'color 0.3s ease-in-out, transform 0.3s ease-in-out',
                                    color: currentCapital <= 0 ? 'error.main' : 'primary.main',
                                    transform: capitalFlash ? 'scale(1.05)' : 'scale(1)',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '4px'
                                }}
                            >
                                <AttachMoneyIcon sx={{ verticalAlign: 'middle', fontSize: '1.2em' }} />
                                {formatCurrency(currentCapital)}
                            </Box>
                        </Typography>
                        <LinearProgress
                            variant="determinate"
                            value={progress}
                            sx={{ height: 10, borderRadius: 5, mb: 1 }}
                            color={currentCapital >= GOAL_CAPITAL ? 'success' : currentCapital < INITIAL_CAPITAL / 2 ? 'warning' : 'primary'}
                        />
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            Цель: {formatCurrency(GOAL_CAPITAL)} | Ходов осталось: {turnsLeft}
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                                    <EmojiEventsIcon sx={{ mr: 0.5, fontSize: 18 }} color="warning" />
                                    Серия побед: <Box component="span" fontWeight="bold" sx={{ ml: 0.5 }}>{winStreak}</Box>
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                                    <EmojiEventsIcon sx={{ mr: 0.5, fontSize: 18 }} color="info" />
                                    Лучшая серия: <Box component="span" fontWeight="bold" sx={{ ml: 0.5 }}>{highestWinStreak}</Box>
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="body2">Игр сыграно: {gamesPlayed}</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="body2">Игр выиграно: {gamesWon}</Typography>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>

                {/* --- Game Over/Win State --- */}
                {gamePhase !== 'playing' && (
                    <Alert
                        severity={gamePhase === 'won' ? 'success' : 'error'}
                        sx={{ mb: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                    >
                        <Typography variant="h5" fontWeight="bold" sx={{ mb: 1 }}>
                            {gamePhase === 'won' ? 'ПОБЕДА В ИГРЕ!' : 'ИГРА ОКОНЧЕНА!'}
                        </Typography>
                        <Typography variant="body1" sx={{ textAlign: 'center', mb: 2 }}>
                            {gamePhase === 'won'
                                ? `Вы успешно достигли цели и заработали ${formatCurrency(currentCapital)}!`
                                : `Ваш капитал: ${formatCurrency(currentCapital)}. Попробуйте снова!`}
                        </Typography>
                        <Button
                            variant="contained"
                            color={gamePhase === 'won' ? 'success' : 'error'}
                            startIcon={<RestartAltIcon />}
                            onClick={resetGame}
                        >
                            Начать новую игру
                        </Button>
                    </Alert>
                )}

                {/* --- Dynamic Capital Chart --- */}
                <Card variant="outlined" sx={{ mb: 4 }}>
                    <CardContent>
                        <Box sx={{ height: 300 }}> {/* Fixed height for chart */}
                            <Line data={chartData} options={chartOptions} />
                        </Box>
                    </CardContent>
                </Card>

                {/* Project Selection */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12}>
                        <Card variant="outlined">
                            <CardContent>
                                <Typography variant="h6" sx={{ mb: 2 }}>
                                    Выберите проект для инвестирования
                                </Typography>
                                <FormControl fullWidth sx={{ mb: 2 }} disabled={gamePhase !== 'playing'}>
                                    <InputLabel id="project-select-label">Проект</InputLabel>
                                    <Select
                                        labelId="project-select-label"
                                        value={selectedProjectId}
                                        label="Проект"
                                        onChange={(e) => {
                                            setSelectedProjectId(e.target.value);
                                            setGameResult(null);
                                            setRollResult(null);
                                            setRollExplanation('');
                                        }}
                                    >
                                        {projectsData.map((project) => (
                                            <MenuItem key={project.id} value={project.id}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <project.icon />
                                                    {project.name}
                                                </Box>
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                {selectedProject && (
                                    <Box sx={{ mt: 2 }}>
                                        <Typography variant="subtitle1" fontWeight="bold">{selectedProject.name}</Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                            {selectedProject.description}
                                        </Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }} mb={1}>
                                            <GppBadIcon color="error" fontSize="small" sx={{ mr: 0.5 }} />
                                            <Typography variant="body2">
                                                Риск: {selectedProject.risk} / 5
                                                <Tooltip title={`Высокий риск (${selectedProject.risk}/5) уменьшает ваш бросок кубика.`} arrow>
                                                    <InfoOutlinedIcon sx={{ ml: 0.5, fontSize: 16 }} />
                                                </Tooltip>
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <TrendingUpIcon color="success" fontSize="small" sx={{ mr: 0.5 }} />
                                            <Typography variant="body2">
                                                Потенциальная прибыль: {selectedProject.potentialProfit.charAt(0).toUpperCase() + selectedProject.potentialProfit.slice(1)}
                                                <Tooltip title={`Потенциальная прибыль: ${selectedProject.potentialProfit === 'low' ? 'Низкая (прибыль в 20%)' : selectedProject.potentialProfit === 'medium' ? 'Средняя (прибыль в 50%)' : 'Высокая (прибыль в 120%)'} от инвестиции.`} arrow>
                                                    <InfoOutlinedIcon sx={{ ml: 0.5, fontSize: 16 }} />
                                                </Tooltip>
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }} mt={1}>
                                            <CasinoIcon color="primary" fontSize="small" sx={{ mr: 0.5 }} />
                                            <Typography variant="body2">
                                                Порог успеха (бросок): {selectedProject.successThreshold} или выше
                                                <Tooltip title={`Для успеха вам нужно, чтобы финальный бросок кубика был равен или выше ${selectedProject.successThreshold}.`} arrow>
                                                    <InfoOutlinedIcon sx={{ ml: 0.5, fontSize: 16 }} />
                                                </Tooltip>
                                            </Typography>
                                        </Box>
                                        {showIntuition && selectedProject.intuitionHint && (
                                            <Alert severity="info" sx={{ mt: 2 }}>
                                                <Typography variant="body2" fontWeight="bold">
                                                    Подсказка интуиции:
                                                </Typography>
                                                <Typography variant="body2">{selectedProject.intuitionHint}</Typography>
                                            </Alert>
                                        )}
                                    </Box>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Investment and Intuition */}
                    <Grid item xs={12}>
                        <Card variant="outlined">
                            <CardContent>
                                <Typography variant="h6" sx={{ mb: 2 }}>
                                    Ваша инвестиция
                                </Typography>
                                <TextField
                                    fullWidth
                                    label="Сумма инвестиции"
                                    type="number"
                                    value={investmentAmount}
                                    onChange={(e) => setInvestmentAmount(Math.max(0, parseFloat(e.target.value) || 0))}
                                    InputProps={{ startAdornment: <AttachMoneyIcon sx={{ mr: 1 }} /> }}
                                    sx={{ mb: 2 }}
                                    disabled={gamePhase !== 'playing'}
                                />
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={showIntuition}
                                            onChange={(e) => setShowIntuition(e.target.checked)}
                                            name="checkIntuition"
                                            disabled={gamePhase !== 'playing'}
                                        />
                                    }
                                    label={
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            Активировать Интуицию
                                            <Tooltip title="Получите подсказки о проекте, а также небольшой бонус к броску кубика!" arrow>
                                                <InfoOutlinedIcon sx={{ ml: 0.5, fontSize: 16 }} />
                                            </Tooltip>
                                        </Box>
                                    }
                                    sx={{ mb: 2 }}
                                />
                                <Button
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    onClick={handleInvest}
                                    sx={{ py: 1.5 }}
                                    disabled={gamePhase !== 'playing' || investmentAmount === 0 || investmentAmount > currentCapital}
                                    startIcon={<PlayArrowIcon />}
                                    className={isRolling ? 'rolling' : ''} // Apply rolling class
                                    style={{ transition: 'transform 1s ease-in-out', transform: isRolling ? 'rotate(360deg)' : 'rotate(0deg)' }} // Inline style for animation
                                >
                                    Инвестировать
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Game Result */}
                    {gameResult && (
                        <Grid item xs={12}>
                            <Card variant="outlined">
                                <CardContent>
                                    <Typography variant="h6" sx={{ mb: 2 }}>
                                        Результат
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
                                        <Typography variant="h5" color="text.secondary">
                                            Ваш бросок:
                                        </Typography>
                                        <Typography
                                            sx={{
                                                fontSize: '3rem', // Larger font size for impact
                                                fontWeight: 'bold',
                                                color: gameResult.success ? 'success.main' : 'error.main', // Color changes based on success
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '8px',
                                            }}
                                        >
                                            <CasinoIcon sx={{ fontSize: 'inherit' }} /> {rollResult}
                                        </Typography>
                                        <Typography
                                            variant="h5"
                                            sx={{
                                                mt: 1,
                                                fontWeight: 'bold',
                                                color: gameResult.profit >= 0 ? 'success.main' : 'error.main',
                                                transition: 'transform 0.3s ease-out',
                                                transform: gameResult ? 'scale(1.05)' : 'scale(1)',
                                            }}
                                        >
                                            {gameResult.profit >= 0 ? '+' : ''}{formatCurrency(gameResult.profit)}
                                        </Typography>
                                    </Box>
                                    <Alert severity={gameResult.success ? 'success' : 'error'}>
                                        <Typography variant="h6" fontWeight="bold">
                                            {gameResult.success ? 'УСПЕХ!' : 'НЕУДАЧА!'}
                                        </Typography>
                                        <Typography variant="body1">
                                            {gameResult.success
                                                ? `Ваши инвестиции в размере ${formatCurrency(investmentAmount)} принесли прибыль в ${formatCurrency(gameResult.profit)}. Ваш капитал теперь: ${formatCurrency(currentCapital)}.`
                                                : `Вы потеряли ${formatCurrency(Math.abs(gameResult.profit))}. Ваш капитал теперь: ${formatCurrency(currentCapital)}.`}
                                        </Typography>
                                        <Typography variant="caption" display="block" sx={{ mt: 1, fontStyle: 'italic' }}>
                                            **Почему так:** {rollExplanation}
                                        </Typography>
                                    </Alert>
                                </CardContent>
                            </Card>
                        </Grid>
                    )}
                </Grid>

                <Snackbar
                    open={snackbarOpen}
                    autoHideDuration={4000}
                    onClose={handleSnackbarClose}
                    message={snackbarMessage}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                />
            </Box>
        </ThemeProvider>
    );
};

export default BusinessGamePage;