import React, {useEffect, useState} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Box,
    Container,
    Typography,
    Grid,
    Button,
    Card,
    CardContent,
    useTheme,
} from '@mui/material';
import { Link } from 'react-router-dom';
import {
    Business,
    CurrencyExchange,
} from '@mui/icons-material';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';

const DynamicHeader = () => {
    const [currentWord, setCurrentWord] = useState(0);
    const words = ['Стройте', 'Управляйте', 'Развивайте', 'Покоряйте'];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentWord((prev) => (prev + 1) % words.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [words.length]);

    return (
        <Box sx={{ position: 'relative', mb: 4 }}>
            <Typography
                variant="h1"
                sx={{
                    fontSize: { xs: '3rem', md: '4rem' },
                    fontWeight: 900,
                    lineHeight: 1.2,
                    letterSpacing: '-0.03em',
                    color: '#fff',
                    textShadow: '0 4px 12px rgba(0,0,0,0.3)',
                }}
            >
            </Typography>

            <AnimatePresence mode="wait">
                <motion.div
                    key={currentWord}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    style={{
                        position: 'absolute',
                        bottom: -40,
                        left: 0,
                        right: 0,
                        textAlign: 'center',
                    }}
                >
                    <Typography
                        variant="h4"
                        sx={{
                            fontSize: '1.8rem',
                            fontWeight: 600,
                            color: '#FFD700',
                        }}
                    >
                        {words[currentWord]}
                    </Typography>
                </motion.div>
            </AnimatePresence>
        </Box>
    );
};

const HeroSection = () => {
    const theme = useTheme();

    return (
        <Box sx={{
            py: 10,
            position: 'relative',
            background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
            overflow: 'hidden'
        }}>
            <MoneyAnimation side="left" />
            <MoneyAnimation side="right" />

            {/* Анимированная ракета */}
            <motion.div
                initial={{
                    y: 100,
                    x: -50,
                    opacity: 0,
                    rotate: -45
                }}
                animate={{
                    y: [-20, 20, -20],
                    x: [-50, -30, -50],
                    opacity: 1,
                    rotate: [-45, -35, -45]
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                style={{
                    position: 'absolute',
                    left: '30%',
                    top: '20%',
                    zIndex: 1
                }}
            >
                <RocketLaunchIcon
                    sx={{
                        fontSize: 80,
                        color: '#FFD700',
                        filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))'
                    }}
                />
            </motion.div>
            <motion.div
                initial={{
                    y: 100,
                    x: -50,
                    opacity: 0,
                    rotate: -45
                }}
                animate={{
                    y: [-20, 20, -20],
                    x: [-50, -30, -50],
                    opacity: 1,
                    rotate: [-45, -35, -45]
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                style={{
                    position: 'absolute',
                    left: '70%',
                    top: '20%',
                    zIndex: 1
                }}
            >
                <RocketLaunchIcon
                    sx={{
                        fontSize: 80,
                        color: '#FFD700',
                        filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))'
                    }}
                />
            </motion.div>

            <Container>
                <Box sx={{
                    textAlign: 'center',
                    maxWidth: 800,
                    mx: 'auto',
                    position: 'relative',
                    zIndex: 2
                }}>
                    <Typography
                        variant="h1"
                        sx={{
                            fontSize: { xs: '2.5rem', md: '3.5rem' },
                            fontWeight: 800,
                            color: '#fff',
                            textShadow: '0 4px 12px rgba(0,0,0,0.3)',
                            mb: 1,
                            position: 'relative',
                            display: 'inline-block'
                        }}
                    >
                        Бизнес Империя
                    </Typography>

                    <Box sx={{ mb: 15 }}>
                        <DynamicHeader />
                    </Box>

                    <Button
                        component={Link}
                        to="/start"
                        variant="contained"
                        size="large"
                        sx={{
                            px: 6,
                            borderRadius: 2,
                            textTransform: 'none',
                            fontSize: '1.1rem',
                            fontWeight: 600,
                            background: 'linear-gradient(45deg, #FFD700 30%, #FFA000 90%)',
                            color: '#000',
                            '&:hover': {
                                transform: 'translateY(-2px)'
                            }
                        }}
                    >
                        Стартовать бизнес
                    </Button>
                </Box>
            </Container>
        </Box>
    );
};

const MoneyAnimation = ({ side }) => {
    const theme = useTheme();
    const symbols = ['💵', '💰', '💸', '🪙', '🤑'];
    const count = 40;

    const getRandom = (min, max) => Math.random() * (max - min) + min;

    return (
        <Box sx={{
            position: 'absolute',
            width: '200px',
            height: '100%',
            [side]: 0,
            overflow: 'hidden',
            zIndex: 0,
            pointerEvents: 'none'
        }}>
            {Array.from({ length: count }).map((_, i) => {
                const pos = getRandom(0, 200);
                const rotate = getRandom(-180, 180);
                const symbol = symbols[i % symbols.length];
                return (
                    <motion.div
                        key={i}
                        initial={{
                            y: -100,
                            x: side === 'left' ? -pos : pos,
                            opacity: 0,
                            rotate
                        }}
                        animate={{
                            y: '100vh',
                            opacity: [0, 0.6, 0],
                            x: side === 'left' ? pos : -pos,
                            rotate: rotate + 360
                        }}
                        transition={{
                            duration: getRandom(6, 12),
                            delay: getRandom(0, 3),
                            repeat: Infinity,
                            ease: "linear"
                        }}
                        style={{
                            position: 'absolute',
                            fontSize: '2rem',
                            color: theme.palette.mode === 'dark' ? '#4CAF50' : '#2E7D32'
                        }}
                    >
                        {symbol}
                    </motion.div>
                );
            })}
        </Box>
    );
};

const NewsTicker = ({ items }) => {
    const [activeIndex, setActiveIndex] = React.useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex(prev => (prev + 1) % items.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [items.length]);

    return (
        <Box sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            bgcolor: 'background.paper',
            borderTop: '2px solid',
            borderColor: 'divider',
            zIndex: 1000
        }}>
            <Container>
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    py: 2,
                    gap: 2
                }}>
                    <AnimatePresence mode='wait'>
                        <motion.div
                            key={activeIndex}
                            initial={{ x: 100, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -100, opacity: 0 }}
                            transition={{ duration: 0.5 }}
                            style={{ flexGrow: 1 }}
                        >
                            <Typography variant="body1" sx={{
                                fontWeight: 500,
                                textAlign: 'center'
                            }}>
                                {items[activeIndex]}
                            </Typography>
                        </motion.div>
                    </AnimatePresence>
                </Box>
            </Container>
        </Box>
    );
};

const BusinessCard = ({ title, description, path, icon, color, hoverMessage }) => {
    const theme = useTheme();
    const [isHovered, setIsHovered] = useState(false);

    return (
        <Grid item xs={12} md={6} sx={{ display: 'flex' }}>
            <motion.div
                style={{ flexGrow: 1 }}
                whileHover={{ scale: 1.02 }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="relative"
            >
                <Card
                    sx={{
                        height: 600,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        background: `linear-gradient(45deg, ${color}20 0%, ${theme.palette.background.paper} 100%)`,
                        border: `2px solid ${color}30`,
                        borderRadius: 4,
                        overflow: 'hidden',
                        boxSizing: 'border-box',
                    }}
                >
                    <CardContent
                        sx={{
                            p: 4,
                            textAlign: 'center',
                            flexGrow: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                        }}
                    >
                        <Box
                            sx={{
                                width: 140,
                                height: 140,
                                bgcolor: `${color}20`,
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mx: 'auto',
                                mb: 4,
                            }}
                        >
                            {React.cloneElement(icon, {
                                sx: {
                                    fontSize: 60,
                                    color: color,
                                },
                            })}
                        </Box>

                        <Typography
                            variant="h4"
                            sx={{
                                fontWeight: 800,
                                mb: 3,
                                color: color,
                                fontSize: '2rem',
                            }}
                        >
                            {title}
                        </Typography>

                        <Typography
                            variant="body1"
                            sx={{
                                color: theme.palette.text.secondary,
                                fontSize: '1.1rem',
                                lineHeight: 1.6,
                            }}
                        >
                            {description}
                        </Typography>
                    </CardContent>

                    <Button
                        component={Link}
                        to={path}
                        variant="contained"
                        sx={{
                            m: 3,
                            py: 2,
                            borderRadius: 2,
                            fontWeight: 700,
                            fontSize: '1.1rem',
                            background: `linear-gradient(45deg, ${color} 0%, ${color}80 100%)`,
                        }}
                    >
                        Начать сейчас
                    </Button>
                </Card>
                <AnimatePresence>
                    {isHovered && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.3 }}
                            className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md"
                        >
                            {hoverMessage}
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </Grid>
    );
};

const HomePage = () => {
    const businessTypes = [
        {
            title: 'Промышленный Гигант',
            description: 'Создайте производственную империю с полным циклом',
            path: '/physical',
            icon: <Business />,
            color: '#2196F3'
        },
        {
            title: 'Цифровая Экономика',
            description: 'Инвестируйте в криптовалюты и блокчейн',
            path: '/crypto',
            icon: <CurrencyExchange />,
            color: '#4CAF50'
        },
    ];

    const newsItems = [
        '🔥 Глобальный экономический форум 2024',
        '📈 Курс криптовалют вырос на 15%',
        '🏭 Новый промышленный кластер',
        '💼 Стартап-акселератор до 30 сентября'
    ];

    return (
        <Box sx={{
            bgcolor: 'background.default',
            minHeight: '100vh',
            position: 'relative'
        }}>
            <HeroSection />

            <Container sx={{
                py: 10,
                display: 'flex',
                justifyContent: 'center'
            }}>
                <Grid
                    container
                    spacing={4}
                    sx={{
                        maxWidth: '1400px',
                        justifyContent: 'center'
                    }}
                >
                    {businessTypes.map((b, index) => (
                        <BusinessCard key={index} {...b} />
                    ))}
                </Grid>
            </Container>

            <NewsTicker items={newsItems} />
        </Box>
    );
};

export default HomePage;