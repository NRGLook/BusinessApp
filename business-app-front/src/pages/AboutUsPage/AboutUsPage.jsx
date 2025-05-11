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
    Button,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    DialogActions,
} from '@mui/material';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import { TimelineDot } from '@mui/lab';
import {
    CodeRounded, DesignServicesRounded, CloudRounded, EmojiEventsRounded, AutoAwesomeRounded, BusinessCenterRounded,
    SearchRounded, PaletteRounded, LaptopMacRounded, ScienceRounded, RocketLaunchRounded, BuildRounded,
    LightbulbOutlined as LightbulbOutlinedIcon, HandshakeOutlined as HandshakeOutlinedIcon, RocketLaunchOutlined as RocketLaunchOutlinedIcon,
} from '@mui/icons-material';
import TelegramIcon from '@mui/icons-material/Telegram';
import EmailIcon from '@mui/icons-material/Email';
import GitHubIcon from '@mui/icons-material/GitHub';
import JavascriptIcon from '@mui/icons-material/Javascript';
import CloudIcon from '@mui/icons-material/Cloud';
import DataObjectIcon from '@mui/icons-material/DataObject';
import BuildIcon from '@mui/icons-material/Build';

import myImage from '/Users/ilya.tsikhanionak/Programming/BusinessApp/business-app-front/src/assets/images/profile.png';

const founder = {
    name: 'Тиханенок Илья Александрович',
    role: 'Основатель & Full-stack Архитектор',
    img: myImage,
    bio: 'С 2018 года я страстно увлечен созданием чистого, эффективного и масштабируемого кода. Специализируюсь на разработке инновационных full-stack веб-приложений, используя передовой стек технологий, включая React, Next.js, Node.js, Python, и глубоко разбираясь в облачных архитектурах AWS и Kubernetes. Моя цель — не просто писать код, а создавать продукты, которые решают сложные бизнес-задачи, оптимизируют процессы и действительно улучшают жизнь пользователей. Убежден, что в основе успешного проекта лежит синергия технологий, ориентированного на пользователя дизайна и глубокого понимания бизнес-целей. Этот сайт — витрина моих навыков и подхода к разработке.',
    telegram: 'https://t.me/your_telegram_link',
    email: 'your_email@example.com',
    github: 'https://github.com/your_github',
};

const timeline = [
    { label: 'Начал карьеру в разработке', date: '2018', icon: <CodeRounded sx={{ fontSize: '1.8rem' }} /> },
    { label: 'Первый коммерческий проект', date: '2019', icon: <DesignServicesRounded sx={{ fontSize: '1.8rem' }} /> },
    { label: 'Запуск облачных решений', date: '2021', icon: <CloudRounded sx={{ fontSize: '1.8rem' }} /> },
    { label: 'Экспертиза в AI/ML', date: '2022', icon: <AutoAwesomeRounded sx={{ fontSize: '1.8rem' }} /> },
    { label: '50+ успешных проектов', date: '2023', icon: <EmojiEventsRounded sx={{ fontSize: '1.8rem' }} /> },
    { label: 'Основание IT-консалтинга', date: '2024', icon: <BusinessCenterRounded sx={{ fontSize: '1.8rem' }} /> },
];

const stats = [
    { label: 'Реализованных проектов', value: 60 },
    { label: 'Технологий в стеке', value: 25 },
    { label: 'Счастливых клиентов', value: 55 },
    { label: 'Лет опыта', value: new Date().getFullYear() - 2018 },
    { label: 'Консультаций проведено', value: 120 },
    { label: 'Строк кода написано (млн)', value: 1.5, suffix: 'M' },
];

const testimonials = [
    { text: 'Илья превратил нашу сложную идею в работающий продукт быстрее, чем мы ожидали! Высочайший профессионализм.', author: 'Стартап FinTech Solutions' },
    { text: 'Профессиональный подход и исключительное внимание к деталям. Рекомендую как ответственного и талантливого разработчика.', author: 'Международная IT компания' },
    { text: 'Его решения помогли оптимизировать наш ключевой бизнес-процесс более чем на 40%. Фантастический результат!', author: 'Крупная логистическая компания' },
    { text: 'Глубокое понимание наших потребностей и гибкость в разработке превзошли все ожидания. Настоящий партнер!', author: 'Инновационная образовательная платформа' },
    { text: 'Илья не просто разработчик, а визионер. Его стратегические идеи помогли нам выйти на совершенно новый уровень.', author: 'Лидер E-commerce рынка' },
];

const technologies = [
    { name: 'React', icon: <JavascriptIcon /> },
    { name: 'Next.js', icon: <JavascriptIcon /> },
    { name: 'TypeScript', icon: <JavascriptIcon /> },
    { name: 'Node.js', icon: <JavascriptIcon /> },
    { name: 'NestJS', icon: <JavascriptIcon /> },
    { name: 'Python', icon: <JavascriptIcon /> },
    { name: 'Django', icon: <JavascriptIcon /> },
    { name: 'AWS', icon: <CloudIcon /> },
    { name: 'Kubernetes', icon: <CloudIcon /> },
    { name: 'Docker', icon: <CloudIcon /> },
    { name: 'Terraform', icon: <CloudIcon /> },
    { name: 'Serverless', icon: <CloudIcon /> },
    { name: 'MongoDB', icon: <DataObjectIcon /> },
    { name: 'PostgreSQL', icon: <DataObjectIcon /> },
    { name: 'Redis', icon: <DataObjectIcon /> },
    { name: 'GraphQL', icon: <DataObjectIcon /> },
    { name: 'Microservices', icon: <BuildIcon /> },
    { name: 'CI/CD', icon: <BuildIcon /> },
    { name: 'Jest', icon: <BuildIcon /> },
    { name: 'Playwright', icon: <BuildIcon /> },
    { name: 'TensorFlow', icon: <DataObjectIcon /> },
    { name: 'PyTorch', icon: <DataObjectIcon /> },
];

const processSteps = [
    {
        title: 'Анализ и Стратегия',
        description: 'Глубокое погружение в ваши бизнес-процессы, выявление ключевых потребностей и постановка четких, измеримых целей. Собираю всю необходимую информацию для создания дорожной карты проекта.',
        icon: <SearchRounded />
    },
    {
        title: 'Дизайн и Прототипирование',
        description: 'Создание интуитивных интерфейсов (UI/UX) и интерактивных макетов. Визуализация идей, быстрая валидация концепции с ключевыми стейкхолдерами для минимизации рисков.',
        icon: <PaletteRounded />
    },
    {
        title: 'Full-stack Разработка',
        description: 'Поэтапная Agile-реализация проекта с использованием лучших практик кодирования, регулярными демо и обратной связью. Пишу чистый, тестируемый и поддерживаемый код.',
        icon: <LaptopMacRounded />
    },
    {
        title: 'QA и Тестирование',
        description: 'Всесторонняя проверка функциональности, производительности, безопасности и UX. Автоматизированное и ручное тестирование для обеспечения высочайшего качества продукта.',
        icon: <ScienceRounded />
    },
    {
        title: 'Запуск и Интеграция',
        description: 'Бесшовный деплой на выбранную инфраструктуру, настройка мониторинга и логирования. Подготовка к полноценной эксплуатации и интеграция с существующими системами.',
        icon: <RocketLaunchRounded />
    },
    {
        title: 'Поддержка и Развитие',
        description: 'Постоянное улучшение и развитие продукта на основе аналитики и обратной связи. Гарантийная поддержка, масштабирование и консультации для долгосрочного успеха.',
        icon: <BuildRounded />
    },
];

const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (delay = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.7, delay, ease: "easeOut" }
    })
};

export default function AboutUsPage() {
    const theme = useTheme();
    const [activeTest, setActiveTest] = useState(0);
    const [openContactDialog, setOpenContactDialog] = useState(false);
    const [contactSubject, setContactSubject] = useState('');
    const [contactBody, setContactBody] = useState('');

    useEffect(() => {
        const timer = setInterval(() => {
            setActiveTest((prev) => (prev + 1) % testimonials.length);
        }, 6000);
        return () => clearInterval(timer);
    }, []);

    const handleOpenContactDialog = () => {
        setOpenContactDialog(true);
    };

    const handleCloseContactDialog = () => {
        setOpenContactDialog(false);
        setContactSubject('');
        setContactBody('');
    };

    const handleSendEmail = () => {
        const mailtoLink = `mailto:${founder.email}?subject=${encodeURIComponent(contactSubject)}&body=${encodeURIComponent(contactBody)}`;
        window.open(mailtoLink, '_blank');
        handleCloseContactDialog();
    };

    return (
        <Box sx={{ overflowX: 'hidden' }}>
            {/* Hero Section */}
            <Box
                sx={{
                    minHeight: '100vh',
                    background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    textAlign: 'center',
                    px: 3,
                }}
            >
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={{
                        hidden: {},
                        visible: { transition: { staggerChildren: 0.3 } }
                    }}
                    style={{ maxWidth: 900, padding: '20px 0' }}
                >
                    <motion.div variants={{ hidden: { opacity: 0, y: -50 }, visible: { opacity: 1, y: 0, transition: { duration: 1 } } }}>
                        <Typography
                            variant="h1"
                            gutterBottom
                            sx={{ fontWeight: 700, textShadow: '0 3px 12px rgba(0,0,0,0.4)', fontSize: { xs: '2.5rem', sm: '3rem', md: '4rem' } }}
                        >
                            Технологии, создающие больше возможностей
                        </Typography>
                        <Box sx={{ mt: 2 }}>
                            <IconButton color="inherit" href={founder.telegram} target="_blank" aria-label="Telegram" component={motion.a} whileHover={{ scale: 1.1 }}>
                                <TelegramIcon sx={{ fontSize: '2rem' }} />
                            </IconButton>
                            <IconButton color="inherit" href={`mailto:${founder.email}`} aria-label="Email" component={motion.a} whileHover={{ scale: 1.1 }}>
                                <EmailIcon sx={{ fontSize: '2rem' }} />
                            </IconButton>
                            <IconButton color="inherit" href={founder.github} target="_blank" aria-label="GitHub" component={motion.a} whileHover={{ scale: 1.1 }}>
                                <GitHubIcon sx={{ fontSize: '2rem' }} />
                            </IconButton>
                        </Box>
                    </motion.div>
                    <motion.div variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 1 } } }}>
                        <Typography
                            variant="h5"
                            sx={{ mt: 3, fontWeight: 300, fontSize: { xs: '1rem', sm: '1.15rem', md: '1.3rem' } }}
                        >
                            Этот сайт — обзор моего опыта и подхода к разработке интеллектуальных программных решений, нацеленных на трансформацию бизнес-процессов и улучшение пользовательского опыта.
                        </Typography>
                    </motion.div>
                    <motion.div variants={{ hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0, transition: { duration: 1, delay: 0.5 } } }}>
                        <Button variant="contained" color="secondary" size="large" sx={{ mt: 4, fontWeight: 600 }} onClick={handleOpenContactDialog} component={motion.button} whileHover={{ scale: 1.05 }}>
                            Связаться со мной
                        </Button>
                    </motion.div>
                </motion.div>
            </Box>

            {/* Contact Dialog */}
            <Dialog open={openContactDialog} onClose={handleCloseContactDialog} fullWidth maxWidth="sm">
                <DialogTitle>Написать письмо основателю</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="subject"
                        label="Тема"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={contactSubject}
                        onChange={(e) => setContactSubject(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        id="body"
                        label="Сообщение"
                        type="text"
                        fullWidth
                        multiline
                        rows={4}
                        variant="outlined"
                        value={contactBody}
                        onChange={(e) => setContactBody(e.target.value)}
                        sx={{ mt: 2 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseContactDialog}>Отмена</Button>
                    <Button onClick={handleSendEmail} variant="contained" color="primary">Отправить</Button>
                </DialogActions>
            </Dialog>

            {/* Mission & Vision Section */}
            <Box sx={{ bgcolor: theme.palette.background.default, py: { xs: 6, md: 10 } }}>
                <Container maxWidth="lg">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={sectionVariants}>
                        <Typography variant="h2" gutterBottom align="center" sx={{ mb: 6, fontWeight: 600 }}>
                            Моя Философия
                        </Typography>
                    </motion.div>
                    <Grid container spacing={4} mb={8}>
                        {[
                            {
                                title: 'Инновации и Польза',
                                text: 'Каждая строчка кода, каждая функция должны приносить реальную пользу и вести к инновациям. Я избегаю избыточных решений, фокусируясь на сути проблемы и элегантности исполнения.',
                                icon: <LightbulbOutlinedIcon sx={{ fontSize: '3rem' }} />
                            },
                            {
                                title: 'Технологическое Превосходство',
                                text: 'Современные технологии + продуманный UX/UI = эффективный и масштабируемый продукт. Я непрерывно исследую и внедряю передовые подходы.',
                                icon: <RocketLaunchOutlinedIcon sx={{ fontSize: '3rem' }} />
                            },
                            {
                                title: 'Партнерство и Прозрачность',
                                text: 'Честность, открытость и прозрачность на всех этапах сотрудничества. Я стремлюсь к построению долгосрочных партнерских отношений, основанных на доверии и взаимном уважении.',
                                icon: <HandshakeOutlinedIcon sx={{ fontSize: '3rem' }} />
                            },
                        ].map((item, idx) => (
                            <Grid item xs={12} md={4} key={idx}>
                                <motion.div
                                    initial={{ opacity: 0, y: 50 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, amount: 0.3 }}
                                    transition={{ duration: 0.6, delay: idx * 0.2 }}
                                    style={{ height: '100%' }}
                                >
                                    <Paper sx={{
                                        p: { xs: 3, md: 4 },
                                        textAlign: 'center',
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignalignItems: 'center',
                                        justifyContent: 'flex-start',
                                        borderTop: `4px solid ${theme.palette.primary.main}`,
                                        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                        '&:hover': {
                                            transform: 'translateY(-10px)',
                                            boxShadow: theme.shadows[10]
                                        }
                                    }} elevation={3}>
                                        <Box color="primary.main" mb={2}>{item.icon}</Box>
                                        <Typography variant="h5" gutterBottom sx={{ fontWeight: 500 }}>
                                            {item.title}
                                        </Typography>
                                        <Typography variant="body1" color="text.secondary">
                                            {item.text}
                                        </Typography>
                                    </Paper>
                                </motion.div>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* Stats Section */}
            <Box sx={{ bgcolor: theme.palette.background.paper, py: { xs: 6, md: 10 } }}>
                <Container maxWidth="lg">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={sectionVariants}>
                        <Typography variant="h2" gutterBottom align="center" sx={{ mb: 6, fontWeight: 600 }}>
                            Ключевые Показатели
                        </Typography>
                    </motion.div>
                    <Grid container spacing={4} justifyContent="center">
                        {stats.map((item, idx) => (
                            <Grid item xs={12} sm={6} md={4} key={idx}>
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true, amount: 0.3 }}
                                    transition={{ duration: 0.5, delay: idx * 0.15 }}
                                    style={{ textAlign: 'center', padding: '16px' }}
                                >
                                    <Typography variant="h2" color="primary.main" sx={{ fontWeight: 700 }}>
                                        <CountUp end={item.value} duration={3} decimals={item.value % 1 !== 0 ? 1 : 0} />{item.suffix || '+'}
                                    </Typography>
                                    <Typography variant="h6" color="text.secondary">{item.label}</Typography>
                                </motion.div>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* Process Section */}
            <Box sx={{ bgcolor: theme.palette.background.default, py: { xs: 6, md: 10 } }}>
                <Container maxWidth="lg">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={sectionVariants}>
                        <Typography variant="h2" gutterBottom align="center" sx={{ mb: { xs: 4, md: 8 }, fontWeight: 600 }}>
                            Мой Процесс Работы
                        </Typography>
                    </motion.div>
                    <Grid container spacing={4}>
                        {processSteps.map((step, idx) => (
                            <Grid item xs={12} sm={6} md={4} key={idx}>
                                <motion.div
                                    initial={{ opacity: 0, y: 50 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, amount: 0.2 }}
                                    transition={{ duration: 0.5, delay: idx * 0.15 }}
                                    style={{ height: '100%' }}
                                >
                                    <Paper sx={{
                                        p: { xs: 3, md: 4 },
                                        height: '100%',
                                        textAlign: 'center',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        transition: 'all 0.3s ease-in-out',
                                        '&:hover': {
                                            borderColor: theme.palette.secondary.main,
                                            boxShadow: `0px 10px 20px -5px ${theme.palette.action.hover}`
                                        },
                                        borderBottom: `3px solid transparent`,
                                    }} elevation={2}>
                                        <Box color="primary.main" fontSize="3rem" mb={2}>{React.cloneElement(step.icon, { sx: { fontSize: 'inherit' } })}</Box>
                                        <Typography variant="h5" gutterBottom sx={{ fontWeight: 500 }}>
                                            {step.title}
                                        </Typography>
                                        <Typography variant="body1" color="text.secondary">
                                            {step.description}
                                        </Typography>
                                    </Paper>
                                </motion.div>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* Timeline Section */}
            <Box sx={{ bgcolor: theme.palette.background.paper, py: { xs: 6, md: 10 } }}>
                <Container maxWidth="lg">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={sectionVariants}>
                        <Typography variant="h2" gutterBottom align="center" sx={{ mb: { xs: 4, md: 8 }, fontWeight: 600 }}>
                            Этапы Развития
                        </Typography>
                    </motion.div>
                    <Stepper alternativeLabel activeStep={timeline.length - 1} sx={{ '& .MuiStepConnector-line': { borderColor: theme.palette.primary.light } }}>
                        {timeline.map((step, idx) => (
                            <Step key={idx} >
                                <StepLabel
                                    icon={
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ duration: 0.5, delay: idx * 0.2, type: "spring", stiffness: 150 }}
                                            whileHover={{ scale: 1.15, rotate: 5 }}
                                        >
                                            <TimelineDot
                                                color="primary"
                                                sx={{
                                                    width: { xs: 50, md: 70 }, height: { xs: 50, md: 70 }, borderWidth: 3,
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    boxShadow: theme.shadows[3]
                                                }}
                                            >
                                                {step.icon}
                                            </TimelineDot>
                                        </motion.div>
                                    }
                                >
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 * idx + 0.3, duration: 0.5 }}
                                    >
                                        <Typography variant="h6" sx={{ fontWeight: 500 }}>{step.date}</Typography>
                                        <Typography variant="body2" color="text.secondary">{step.label}</Typography>
                                    </motion.div>
                                </StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                </Container>
            </Box>

            {/* Technologies Section */}
            <Box sx={{ bgcolor: theme.palette.background.default, py: { xs: 6, md: 10 } }}>
                <Container maxWidth="lg">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={sectionVariants}>
                        <Typography variant="h2" gutterBottom align="center" sx={{ mb: { xs: 3, md: 6 }, fontWeight: 600 }}>
                            Стек Технологий
                        </Typography>
                    </motion.div>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 1.5 }}>
                        {technologies.map((tech, idx) => (
                            <motion.div
                                key={tech.name}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.1 }}
                                transition={{ delay: idx * 0.05, duration: 0.3 }}
                                style={{ display: 'flex', alignItems: 'center' }}
                            >
                                {React.cloneElement(tech.icon, { sx: { mr: 1, fontSize: '1.2rem', color: theme.palette.primary.main } })}
                                <Chip
                                    label={tech.name}
                                    variant="outlined"
                                    color="primary"
                                    sx={{
                                        px: 2, py: 2.5,
                                        fontSize: '1rem',
                                        borderRadius: '8px',
                                        transition: 'all 0.2s ease-in-out',
                                        '&:hover': {
                                            backgroundColor: theme.palette.primary.main,
                                            color: theme.palette.primary.contrastText,
                                            transform: 'scale(1.05)',
                                            boxShadow: theme.shadows[4]
                                        }
                                    }}
                                />
                            </motion.div>
                        ))}
                    </Box>
                </Container>
            </Box>

            {/* Founder Section */}
            <Box sx={{ bgcolor: theme.palette.grey[100], py: { xs: 8, md: 12 } }}>
                <Container maxWidth="md">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={sectionVariants}
                        style={{ textAlign: 'center' }}
                    >
                        <Typography variant="h2" gutterBottom sx={{ mb: { xs: 4, md: 6 }, fontWeight: 600 }}>
                            Основатель
                        </Typography>
                        <motion.div whileHover={{ scale: 1.03 }} transition={{ type: "spring", stiffness: 300 }}>
                            <Avatar
                                src={founder.img}
                                alt={founder.name}
                                sx={{
                                    width: { xs: 200, sm: 240, md: 280 },
                                    height: { xs: 200, sm: 240, md: 280 },
                                    margin: '0 auto 32px',
                                    boxShadow: `0 10px 30px -10px ${theme.palette.primary.light}`,
                                    border: `5px solid ${theme.palette.common.white}`,
                                }}
                            />
                        </motion.div>
                        <Typography variant="h3" gutterBottom sx={{ fontWeight: 600, fontSize: { xs: '2rem', md: '2.5rem' } }}>
                            {founder.name}
                        </Typography>
                        <Typography variant="h5" color="primary" gutterBottom sx={{ fontWeight: 500 }}>
                            {founder.role}
                        </Typography>
                        <Typography variant="body1" sx={{ maxWidth: 700, mx: 'auto', lineHeight: 1.7, fontSize: '1.1rem', mt: 2 }} color="text.secondary">
                            {founder.bio}
                        </Typography>
                        <Box sx={{ mt: 3 }}>
                            <IconButton color="primary" href={founder.telegram} target="_blank" aria-label="Telegram" component={motion.a} whileHover={{ scale: 1.1 }}>
                                <TelegramIcon sx={{ fontSize: '1.8rem' }} />
                            </IconButton>
                            <IconButton color="primary" href={`mailto:${founder.email}`} aria-label="Email" component={motion.a} whileHover={{ scale: 1.1 }}>
                                <EmailIcon sx={{ fontSize: '1.8rem' }} />
                            </IconButton>
                            <IconButton color="primary" href={founder.github} target="_blank" aria-label="GitHub" component={motion.a} whileHover={{ scale: 1.1 }}>
                                <GitHubIcon sx={{ fontSize: '1.8rem' }} />
                            </IconButton>
                        </Box>
                    </motion.div>
                </Container>
            </Box>

            {/* Testimonials Section */}
            <Box sx={{ bgcolor: theme.palette.background.paper, py: { xs: 6, md: 10 } }}>
                <Container maxWidth="md">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={sectionVariants}>
                        <Typography variant="h2" gutterBottom align="center" sx={{ mb: { xs: 4, md: 6 }, fontWeight: 600 }}>
                            Отзывы Клиентов
                        </Typography>
                    </motion.div>
                    <motion.div
                        key={activeTest}
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -30 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                    >
                        <Paper
                            elevation={6}
                            sx={{
                                p: { xs: 3, md: 5 },
                                textAlign: 'center',
                                borderRadius: '12px',
                                borderLeft: `6px solid ${theme.palette.primary.main}`
                            }}
                        >
                            <Typography variant="h5" component="blockquote" sx={{ fontStyle: 'italic', mb: 3, lineHeight: 1.6, color: 'text.secondary' }}>
                                “{testimonials[activeTest].text}”
                            </Typography>
                            <Typography variant="h6" color="primary.main" sx={{ fontWeight: 500 }}>
                                — {testimonials[activeTest].author}
                            </Typography>
                            <MobileStepper
                                variant="dots"
                                steps={testimonials.length}
                                position="static"
                                activeStep={activeTest}
                                sx={{ mt: 3, justifyContent: 'center', bgcolor: 'transparent' }}
                                nextButton={null}
                                backButton={null}
                            />
                        </Paper>
                    </motion.div>
                </Container>
            </Box>
        </Box>
    );
}