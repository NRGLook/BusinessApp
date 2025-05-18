import React from 'react';
import {
    Box,
    Typography,
    Container,
    Button,
    Card,
    CardContent,
    Grid,
    Tooltip,
    Fade,
    Divider,
} from '@mui/material';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';

function StartBusinessInfoPage() {
    return (
        <Box
            sx={{
                background: 'linear-gradient(to bottom right, #f0fdf4, #ffffff)',
                py: 10,
            }}
        >
            <Container maxWidth="lg">
                <Box textAlign="center" mb={8}>
                    <RocketLaunchIcon color="primary" sx={{fontSize: 70}}/>
                    <Typography variant="h3" fontWeight="bold" gutterBottom>
                        Построй свой бизнес с нуля
                    </Typography>
                    <Typography variant="h6" color="text.secondary" maxWidth="md" mx="auto">
                        Наше приложение — это твой персональный помощник на пути к созданию и развитию собственного
                        дела. Всё от идеи до прибыли — в одном месте.
                    </Typography>
                </Box>


                <div style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap : '40px'
                }}>
                    {steps.map((step, index) => (
                        <Grid item xs={12} md={6} key={index}>
                            <Fade in timeout={500 + index * 300}>
                                <Card
                                    sx={{
                                        height: '100%',
                                        borderRadius: 4,
                                        boxShadow: 6,
                                        p: 2,
                                        transition: 'transform 0.3s ease',
                                        '&:hover': {
                                            transform: 'scale(1.02)',
                                        },
                                        background: '#ffffffcc',
                                    }}
                                >
                                    <CardContent>
                                        <Box display="flex" alignItems="center" gap={2}>
                                            <Tooltip title={step.tooltip} arrow>
                                                <Box>{step.icon}</Box>
                                            </Tooltip>
                                            <Typography variant="h6" fontWeight="bold">
                                                {step.title}
                                            </Typography>
                                        </Box>
                                        <Divider sx={{my: 2}}/>
                                        <Typography variant="body1" color="text.secondary">
                                            {step.description}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Fade>
                        </Grid>
                    ))}
                </div>

                <Box textAlign="center" mt={8}>
                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        href="/business/create"
                        sx={{
                            px: 6,
                            py: 1.8,
                            fontSize: '1.1rem',
                            borderRadius: 3,
                            boxShadow: 4,
                            textTransform: 'none',
                        }}
                    >
                        🚀 Создай свой бизнес
                    </Button>
                </Box>
            </Container>

        </Box>
    );
}

const steps = [
    {
        title: '1. Генерация бизнес-идеи',
        description
            :
            'Сформируй и оформи чёткую бизнес-идею с помощью нашего конструктора идей и анализа ниш.',
        tooltip: 'Получай идеи на основе интересов, трендов и анализа рынка.',
        icon: <EmojiObjectsIcon sx={{fontSize: 40, color: '#f59e0b'}}/>,
    },
    {
        title: '2. Построение профиля бизнеса',
        description: 'Создай свой цифровой бизнес-профиль: логотип, описание, цели, юридическую структуру.',
        tooltip: 'Это лицо твоего бизнеса — формирует доверие и имидж.',
        icon: <BusinessCenterIcon sx={{fontSize: 40, color: '#10b981'}}/>,
    },
    {
        title: '3. Запуск и настройки',
        description: 'Настрой ассортимент, способы монетизации, доступы, подключи платёжные инструменты.',
        tooltip: 'Твоя витрина готова к продажам — подключи Stripe или крипту.',
        icon: <RocketLaunchIcon sx={{fontSize: 40, color: '#3b82f6'}}/>,
    },
    {
        title: '4. Рост и масштабирование',
        description: 'Используй аналитику, рекламу, партнёрства, интеграции для расширения бизнеса.',
        tooltip: 'Следи за метриками и используй A/B тестирование для роста.',
        icon: <TrendingUpIcon sx={{fontSize: 40, color: '#9333ea'}}/>,
    },
];

export default StartBusinessInfoPage;
