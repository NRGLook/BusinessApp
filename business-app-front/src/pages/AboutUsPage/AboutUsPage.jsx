import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Grid,
    Avatar,
    Paper,
    Stepper,
    Step,
    StepLabel,
    MobileStepper,
    Container,
    useTheme,
    Chip,
    Divider,
} from '@mui/material';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import { TimelineDot } from '@mui/lab';
import { CodeRounded, DesignServicesRounded, CloudRounded, PsychologyRounded } from '@mui/icons-material';
import myImage from '/Users/ilya.tsikhanionak/Programming/BusinessApp/business-app-front/src/assets/images/profile.png';

const team = [
    {
        name: 'Тиханенок Илья Александрович',
        role: 'Основатель & Full-stack разработчик',
        img: myImage,
        bio: 'Пишу чистый и эффективный код с 2018 года. Специализируюсь на создании современных веб-приложений с использованием React, Node.js и облачных технологий. Верю, что технологии должны делать жизнь людей лучше.',
    },
];

const timeline = [
    { label: 'Начал карьеру в разработке', date: '2018', icon: <CodeRounded /> },
    { label: 'Первый коммерческий проект', date: '2019', icon: <DesignServicesRounded /> },
    { label: 'Запуск облачных решений', date: '2021', icon: <CloudRounded /> },
    { label: '50+ успешных проектов', date: '2023', icon: <PsychologyRounded /> },
];

const stats = [
    { label: 'Реализованных проектов', value: 50 },
    { label: 'Технологий в стеке', value: 15 },
    { label: 'Счастливых клиентов', value: 42 },
    { label: 'Лет опыта', value: 5 },
];

const testimonials = [
    { text: 'Илья превратил нашу сложную идею в работающий продукт быстрее, чем мы ожидали!', author: 'Стартап FinTech' },
    { text: 'Профессиональный подход и внимание к деталям. Рекомендую как ответственного разработчика.', author: 'IT компания' },
    { text: 'Его решения помогли оптимизировать наш бизнес-процесс на 40%.', author: 'Логистическая компания' },
];

const technologies = [
    'React', 'TypeScript', 'Node.js', 'AWS', 'Docker', 'MongoDB',
    'GraphQL', 'Python', 'TensorFlow', 'Kubernetes', 'PostgreSQL', 'Redis'
];

const processSteps = [
    {
        title: 'Анализ требований',
        description: 'Глубокое погружение в бизнес-процессы и постановка целей',
        icon: '🔍'
    },
    {
        title: 'Прототипирование',
        description: 'Создание интерактивных макетов и валидация концепции',
        icon: '🎨'
    },
    {
        title: 'Разработка',
        description: 'Поэтапная реализация с использованием лучших практик',
        icon: '💻'
    },
    {
        title: 'Тестирование',
        description: 'Всесторонняя проверка и оптимизация решения',
        icon: '🧪'
    },
    {
        title: 'Запуск',
        description: 'Деплой и мониторинг работы системы',
        icon: '🚀'
    },
    {
        title: 'Поддержка',
        description: 'Постоянное улучшение и развитие продукта',
        icon: '🛠️'
    },
];

export default function AboutUsPage() {
    const theme = useTheme();
    const [activeTest, setActiveTest] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setActiveTest((prev) => (prev + 1) % testimonials.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <Box>
            {/* Hero Section */}
            <Box
                sx={{
                    height: '100vh',
                    background: 'linear-gradient(to bottom, rgba(0, 100, 0, 0.8), rgba(0, 128, 0, 0.8))', // Темно-зеленый к обычному зеленому
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    textAlign: 'center',
                }}
            >
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    style={{ maxWidth: 800, padding: 20 }}
                >
                    <Typography
                        variant="h2"
                        gutterBottom
                        component={motion.div}
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.8 }}
                        sx={{ fontWeight: 700, textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}
                    >
                        Делаем технологии человечными
                    </Typography>
                    <Typography
                        variant="h5"
                        component={motion.div}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 1 }}
                        sx={{ mt: 3 }}
                    >
                        Создаём программные решения, которые решают реальные проблемы и улучшают жизнь людей
                    </Typography>
                </motion.div>
            </Box>

            <Container sx={{ py: 8 }}>
                {/* Mission & Vision */}
                <Grid container spacing={4} mb={8}>
                    {[
                        {
                            title: 'Наша философия',
                            text: 'Каждая строчка кода должна приносить пользу. Мы избегаем избыточных решений и сосредотачиваемся на сути проблемы.',
                            icon: '💡'
                        },
                        {
                            title: 'Подход',
                            text: 'Современные технологии + продуманный UX = эффективный продукт. Тестируем идеи перед реализацией.',
                            icon: '🚀'
                        },
                        {
                            title: 'Обещание',
                            text: 'Честность и прозрачность на всех этапах. Никаких скрытых платежей или ненужного функционала.',
                            icon: '🤝'
                        },
                    ].map((item, idx) => (
                        <Grid item xs={12} md={4} key={idx}>
                            <motion.div
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: idx * 0.2 }}
                            >
                                <Paper sx={{
                                    p: 4,
                                    textAlign: 'center',
                                    height: '100%',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    '&:hover:before': {
                                        transform: 'scale(1.2)'
                                    },
                                    '&:before': {
                                        content: '""',
                                        position: 'absolute',
                                        width: '200%',
                                        height: '200%',
                                        background: `radial-gradient(circle, ${theme.palette.primary.light} 0%, transparent 70%)`,
                                        transition: 'transform 0.5s',
                                        top: '-50%',
                                        left: '-50%',
                                        zIndex: 0,
                                    }
                                }} elevation={3}>
                                    <Box fontSize="3rem" mb={2}>{item.icon}</Box>
                                    <Typography variant="h5" gutterBottom sx={{ position: 'relative', zIndex: 1 }}>
                                        {item.title}
                                    </Typography>
                                    <Typography variant="body1" sx={{ position: 'relative', zIndex: 1 }}>
                                        {item.text}
                                    </Typography>
                                </Paper>
                            </motion.div>
                        </Grid>
                    ))}
                </Grid>

                {/* Stats */}
                <Box mb={8}>
                    <Grid container spacing={4} justifyContent="center">
                        {stats.map((item, idx) => (
                            <Grid item xs={6} md={3} key={idx}>
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    whileInView={{ scale: 1, opacity: 1 }}
                                    transition={{ duration: 0.5, delay: idx * 0.2 }}
                                    style={{ textAlign: 'center' }}
                                >
                                    <Typography variant="h3" color="primary">
                                        <CountUp end={item.value} duration={2} />+
                                    </Typography>
                                    <Typography variant="h6">{item.label}</Typography>
                                </motion.div>
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                {/* Process */}
                <Box mb={8}>
                    <Typography variant="h3" gutterBottom align="center" sx={{ mb: 6 }}>
                        Наш процесс работы
                    </Typography>
                    <Grid container spacing={4}>
                        {processSteps.map((step, idx) => (
                            <Grid item xs={12} sm={6} md={4} key={idx}>
                                <motion.div
                                    initial={{ opacity: 0, x: -50 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                >
                                    <Paper sx={{ p: 4, height: '100%', textAlign: 'center' }}>
                                        <Box fontSize="3rem" mb={2}>{step.icon}</Box>
                                        <Typography variant="h5" gutterBottom>
                                            {step.title}
                                        </Typography>
                                        <Typography variant="body1">
                                            {step.description}
                                        </Typography>
                                    </Paper>
                                </motion.div>
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                {/* Timeline */}
                <Box mb={8}>
                    <Typography variant="h3" gutterBottom align="center" sx={{ mb: 6 }}>
                        Этапы развития
                    </Typography>
                    <Stepper alternativeLabel>
                        {timeline.map((step, idx) => (
                            <Step key={idx} active>
                                <StepLabel
                                    icon={
                                        <motion.div
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                        >
                                            <TimelineDot color="primary" sx={{ width: 60, height: 60 }}>
                                                <Box fontSize="1.5rem">
                                                    {step.icon}
                                                </Box>
                                            </TimelineDot>
                                        </motion.div>
                                    }
                                >
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.2 * idx }}
                                    >
                                        <Typography variant="h6">{step.date}</Typography>
                                        <Typography variant="body2">{step.label}</Typography>
                                    </motion.div>
                                </StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                </Box>

                {/* Technologies */}
                <Box mb={8}>
                    <Typography variant="h3" gutterBottom align="center" sx={{ mb: 4 }}>
                        Используемые технологии
                    </Typography>
                    <Grid container spacing={2} justifyContent="center">
                        {technologies.map((tech, idx) => (
                            <Grid item key={tech}>
                                <motion.div
                                    initial={{ scale: 0 }}
                                    whileInView={{ scale: 1 }}
                                    transition={{ delay: idx * 0.05 }}
                                >
                                    <Chip
                                        label={tech}
                                        variant="outlined"
                                        sx={{
                                            px: 2,
                                            py: 1,
                                            fontSize: '1.1rem',
                                            borderWidth: 2,
                                            '&:hover': {
                                                backgroundColor: theme.palette.primary.light,
                                                color: 'white'
                                            }
                                        }}
                                    />
                                </motion.div>
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                {/* Team Section */}
                <Box mb={8}>
                    <Typography variant="h3" gutterBottom align="center" sx={{ mb: 6 }}>
                        Основатель
                    </Typography>
                    <Grid container justifyContent="center" spacing={4}>
                        <Grid item xs={12} md={8}>
                            <motion.div
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                                style={{ textAlign: 'center' }}
                            >
                                <Avatar
                                    src={team[0].img}
                                    alt={team[0].name}
                                    sx={{
                                        width: 280,
                                        height: 280,
                                        margin: '0 auto 32px',
                                        boxShadow: 6,
                                        border: `4px solid ${theme.palette.primary.main}`,
                                    }}
                                    component={motion.div}
                                    whileHover={{ scale: 1.05 }}
                                />
                                <Typography variant="h2" gutterBottom>
                                    {team[0].name}
                                </Typography>
                                <Typography variant="h4" color="textSecondary" gutterBottom>
                                    {team[0].role}
                                </Typography>
                                <Typography variant="h6" sx={{ maxWidth: 800, mx: 'auto', lineHeight: 1.8 }}>
                                    {team[0].bio}
                                </Typography>
                            </motion.div>
                        </Grid>
                    </Grid>
                </Box>

                {/* Testimonials */}
                <Box mb={8}>
                    <Typography variant="h3" gutterBottom align="center" sx={{ mb: 6 }}>
                        Отзывы клиентов
                    </Typography>
                    <motion.div
                        key={activeTest}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Paper
                            elevation={6}
                            sx={{ p: 6, maxWidth: 800, mx: 'auto', textAlign: 'center' }}
                        >
                            <Typography variant="h4" component="blockquote" sx={{ fontStyle: 'italic', mb: 3 }}>
                                “{testimonials[activeTest].text}”
                            </Typography>
                            <Typography variant="h5" color="primary">
                                — {testimonials[activeTest].author}
                            </Typography>
                            <MobileStepper
                                variant="dots"
                                steps={testimonials.length}
                                position="static"
                                activeStep={activeTest}
                                sx={{ mt: 4, justifyContent: 'center' }}
                                nextButton={null}
                                backButton={null}
                            />
                        </Paper>
                    </motion.div>
                </Box>

                {/* Footer */}
                <Box sx={{ py: 8, textAlign: 'center', color: '#777', mt: 8 }}>
                    <Divider sx={{ mb: 4 }} />
                    <Typography variant="h6">
                        © {new Date().getFullYear()} Тиханенок Илья. Все права защищены.
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
}