import React, { useState } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Box,
    Grid,
    Card,
    CardContent,
    Button,
    LinearProgress,
    Avatar,
    IconButton,
    Paper,
    BottomNavigation,
    BottomNavigationAction
} from '@mui/material';
import {
    Storefront as PhysicalIcon,
    CurrencyBitcoin as CryptoIcon,
    AccountCircle as ProfileIcon,
    School as LearnIcon,
    Article as NewsIcon,
    BarChart as AnalyticsIcon,
    HelpOutline as HelpIcon
} from '@mui/icons-material';

const FirstAppView = () => {
    const [selectedModel, setSelectedModel] = useState(null);
    const [navValue, setNavValue] = useState('learn');
    const [balance, setBalance] = useState(1250000);
    const [progress, setProgress] = useState({
        factory: 50,
        portfolio: 30
    });

    // Данные для разделов
    const businessModels = [
        { id: 'physical', name: 'Physical Business', icon: <PhysicalIcon fontSize="large" /> },
        { id: 'crypto', name: 'Cryptocurrency', icon: <CryptoIcon fontSize="large" /> }
    ];

    const achievements = [
        { id: 'first-profit', name: 'First Profit', description: 'Reach a net profit for the first time', completed: false },
        { id: 'expand-factory', name: 'Expand Factory', description: 'Build an additional factory', completed: false, progress: progress.factory },
        { id: 'portfolio-growth', name: 'Portfolio Growth', description: 'Increase portfolio value by 10%', completed: false, progress: progress.portfolio }
    ];

    const quickActions = [
        { id: 'invest', label: 'Invest', icon: <PhysicalIcon /> },
        { id: 'hire', label: 'Hire', icon: <ProfileIcon /> },
        { id: 'trade', label: 'Trade', icon: <CryptoIcon /> },
        { id: 'sell', label: 'Sell', icon: <PhysicalIcon /> }
    ];

    const developmentPlan = [
        { stage: 'Start', action: 'Reach profitability', completed: false },
        { stage: 'Expand', action: 'Build factory', completed: false },
        { stage: 'Grow', action: 'Increase market share', completed: false }
    ];

    const handleModelSelect = (model) => {
        setSelectedModel(model);
    };

    const renderSection = () => {
        switch(navValue) {
            case 'learn':
                return <LearnSection />;
            case 'profile':
                return <ProfileSection />;
            case 'business':
                return <BusinessSection />;
            case 'news':
                return <NewsSection />;
            default:
                return <MainSection />;
        }
    };

    const MainSection = () => (
        <Box sx={{ p: 3 }}>
            {/* Выбор бизнес-модели */}
            <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
                <Typography variant="h6" gutterBottom>
                    Choose a Business Model
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                    Select a business model you want to develop
                </Typography>

                <Grid container spacing={3} sx={{ mt: 2 }}>
                    {businessModels.map((model) => (
                        <Grid item xs={6} key={model.id}>
                            <Card
                                onClick={() => handleModelSelect(model.id)}
                                sx={{
                                    cursor: 'pointer',
                                    border: selectedModel === model.id ? '2px solid #1976d2' : 'none'
                                }}
                            >
                                <CardContent sx={{ textAlign: 'center' }}>
                                    <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56, margin: '0 auto 16px' }}>
                                        {model.icon}
                                    </Avatar>
                                    <Typography variant="h6">{model.name}</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Paper>

            {/* Достижения */}
            <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
                <Typography variant="h6" gutterBottom>
                    Achievements
                </Typography>

                <Grid container spacing={2}>
                    {achievements.map((achievement) => (
                        <Grid item xs={12} md={4} key={achievement.id}>
                            <Card>
                                <CardContent>
                                    <Typography variant="subtitle1" gutterBottom>
                                        {achievement.name}
                                        {achievement.progress && (
                                            <LinearProgress
                                                variant="determinate"
                                                value={achievement.progress}
                                                sx={{ mt: 1, height: 8 }}
                                            />
                                        )}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {achievement.description}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Paper>

            {/* Быстрые действия */}
            <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
                <Grid container spacing={2} justifyContent="center">
                    {quickActions.map((action) => (
                        <Grid item key={action.id}>
                            <Button variant="contained" startIcon={action.icon}>
                                {action.label}
                            </Button>
                        </Grid>
                    ))}
                </Grid>
            </Paper>

            {/* План развития */}
            <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                    Business Development Plan
                </Typography>

                <Grid container spacing={3} sx={{ mt: 1 }}>
                    {developmentPlan.map((step, index) => (
                        <Grid item xs={4} key={index}>
                            <Card sx={{ height: '100%' }}>
                                <CardContent sx={{ textAlign: 'center' }}>
                                    <Typography variant="subtitle1" color="primary" gutterBottom>
                                        {step.stage}
                                    </Typography>
                                    <Typography variant="body2">
                                        {step.action}
                                    </Typography>
                                    <Box sx={{ mt: 2 }}>
                                        {step.completed ? (
                                            <Button variant="contained" size="small" disabled>
                                                Completed
                                            </Button>
                                        ) : (
                                            <Button variant="outlined" size="small">
                                                Start
                                            </Button>
                                        )}
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Paper>
        </Box>
    );

    const LearnSection = () => (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Learning Center
            </Typography>
            {/* Добавьте контент для обучающего раздела */}
        </Box>
    );

    const ProfileSection = () => (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                User Profile
            </Typography>
            {/* Добавьте контент для профиля пользователя */}
        </Box>
    );

    const BusinessSection = () => (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                My Businesses
            </Typography>
            {/* Добавьте контент для раздела бизнесов */}
        </Box>
    );

    const NewsSection = () => (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Latest News
            </Typography>
            {/* Добавьте контент для новостей */}
        </Box>
    );

    return (
        <Box sx={{ pb: 7 }}>
            {/* Шапка */}
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Business Simulator
                    </Typography>
                    <Typography variant="h6">
                        ${balance.toLocaleString()}
                    </Typography>
                    <IconButton color="inherit">
                        <HelpIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>

            {/* Основной контент */}
            {renderSection()}

            {/* Нижняя навигация */}
            <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
                <BottomNavigation
                    showLabels
                    value={navValue}
                    onChange={(event, newValue) => setNavValue(newValue)}
                >
                    <BottomNavigationAction label="Learn" value="learn" icon={<LearnIcon />} />
                    <BottomNavigationAction label="Profile" value="profile" icon={<ProfileIcon />} />
                    <BottomNavigationAction label="Business" value="business" icon={<PhysicalIcon />} />
                    <BottomNavigationAction label="News" value="news" icon={<NewsIcon />} />
                    <BottomNavigationAction label="Analytics" value="analytics" icon={<AnalyticsIcon />} />
                </BottomNavigation>
            </Paper>
        </Box>
    );
};

export default FirstAppView;