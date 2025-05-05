// src/pages/HomePage/HomePage.jsx
import React from 'react';
import {
    Box, Container, Typography, Grid, Button, Paper, Divider, List, ListItem, ListItemText, LinearProgress
} from '@mui/material';
import { styled } from '@mui/system';
import { Link } from 'react-router-dom';

const HeroSection = styled(Box)(({ theme }) => ({
    padding: theme.spacing(8, 0),
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    textAlign: 'center',
}));

const BusinessCard = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(4),
    height: '100%',
    transition: 'transform 0.3s',
    '&:hover': {
        transform: 'translateY(-10px)',
    },
}));







const AchievementBadge = styled(Box)(({ theme }) => ({
    display: 'inline-flex',
    alignItems: 'center',
    padding: theme.spacing(1.5, 3),
    borderRadius: '20px',
    backgroundColor: theme.palette.secondary.light,
    margin: theme.spacing(0.75),
    fontWeight: 'bold',
}));

const HomePage = () => {
    const businessTypes = [
        { title: 'Физический бизнес', description: 'Производство, торговля, услуги', icon: '🏭', path: '/physical' },
        { title: 'Виртуальный бизнес', description: 'Криптовалюты, инвестиции', icon: '💻', path: '/crypto' },
    ];

    const achievements = ['Первая прибыль', '5 сотрудников', 'Открыл второй офис', 'Инвестор месяца'];

    const news = [
        '📢 Инвесторы заинтересованы в вашем бизнесе!',
        '📈 Рост дохода на 12% за неделю!',
        '🔧 Проведен аудит фабрики.',
    ];

    const recentActions = ['Нанят сотрудник', 'Закуплено оборудование', 'Инвестировано $10,000'];

    return (
        <Box>
            {/* Hero Section */}
            <HeroSection>
                <Container>
                    <Typography variant="h2" gutterBottom>Бизнес-симулятор</Typography>
                    <Typography variant="h5">Развивай свою империю — шаг за шагом!</Typography>
                </Container>
            </HeroSection>

            {/* Business Types */}
            <Container sx={{ py: 8 }}>
                <Typography variant="h4" align="center" gutterBottom>Выбери направление</Typography>
                <Grid container spacing={4}>
                    {businessTypes.map((b, index) => (
                        <Grid item xs={12} md={6} key={index}>
                            <BusinessCard elevation={3}>
                                <Typography variant="h3" gutterBottom>{b.icon}</Typography>
                                <Typography variant="h5">{b.title}</Typography>
                                <Typography color="textSecondary">{b.description}</Typography>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    sx={{ mt: 3 }}
                                    fullWidth
                                    component={Link}
                                    to={b.path}
                                >
                                    Начать
                                </Button>
                            </BusinessCard>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            {/* Achievements */}
            <Box bgcolor="background.default" py={6}>
                <Container>
                    <Typography variant="h4" align="center" gutterBottom>Твои достижения</Typography>
                    <Box display="flex" justifyContent="center" flexWrap="wrap">
                        {achievements.map((ach, index) => (
                            <AchievementBadge key={index}>{ach}</AchievementBadge>
                        ))}
                    </Box>
                </Container>
            </Box>

            {/* Business News & Recent Actions */}
            <Container sx={{ py: 8 }}>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={6}>
                        <Paper elevation={2} sx={{ p: 3 }}>
                            <Typography variant="h6">📰 Новости бизнеса</Typography>
                            <Divider sx={{ my: 1 }} />
                            <List>
                                {news.map((item, idx) => (
                                    <ListItem key={idx}><ListItemText primary={item} /></ListItem>
                                ))}
                            </List>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Paper elevation={2} sx={{ p: 3 }}>
                            <Typography variant="h6">🕒 Последние действия</Typography>
                            <Divider sx={{ my: 1 }} />
                            <List>
                                {recentActions.map((item, idx) => (
                                    <ListItem key={idx}><ListItemText primary={item} /></ListItem>
                                ))}
                            </List>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>

            {/* Progress Card */}
            <Container sx={{ py: 4 }}>
                <Paper elevation={3} sx={{ p: 4 }}>
                    <Typography variant="h5" gutterBottom>📊 Прогресс развития</Typography>
                    <Typography>Этап 1: Прибыльность</Typography>
                    <LinearProgress variant="determinate" value={70} sx={{ height: 10, my: 1, borderRadius: 5 }} />
                    <Typography>Этап 2: Расширение — 30%</Typography>
                    <LinearProgress variant="determinate" value={30} sx={{ height: 10, mt: 1, borderRadius: 5 }} />
                </Paper>
            </Container>

            {/* Quick Actions */}
            <Container sx={{ py: 4 }}>
                <Grid container spacing={2} justifyContent="center">
                    <Grid item><Button variant="contained" size="large">📈 Аналитика</Button></Grid>
                    <Grid item><Button variant="outlined" size="large">📚 Обучение</Button></Grid>
                    <Grid item><Button variant="text" size="large">⚙️ Настройки</Button></Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default HomePage;
