import { useState } from 'react';
import { useEffect } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { Box, Button, Typography, Grid, Paper } from '@mui/material';
import {
    Nature,
    AccountBalance,
    TrendingUp,
    Business,
    Computer,
    Security,
    Store,
    Engineering, Cloud, People, LocalShipping, Construction, LocationCity, ElectricBolt, Warehouse
} from '@mui/icons-material';
import background from '/Users/ilya.tsikhanionak/Programming/BusinessApp/business-app-front/src/assets/images/background.png';

const StartBusinessPage = () => {
    const [selectedType, setSelectedType] = useState(null);
    const [currentStep, setCurrentStep] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const controls = useAnimation();

    const [buildingCount, setBuildingCount] = useState(20);

    useEffect(() => {
        const updateCount = () => {
            const width = window.innerWidth;
            const estimatedWidthPerBuilding = 50;
            setBuildingCount(Math.floor(width / estimatedWidthPerBuilding));
        };

        updateCount();
        window.addEventListener('resize', updateCount);
        return () => window.removeEventListener('resize', updateCount);
    }, []);

    const physicalSteps = [
        { title: 'Выбор локации', icon: <LocationCity />, tip: 'Анализ пешеходного трафика и конкурентов' },
        { title: 'Архитектурный план', icon: <Engineering />, tip: 'Разработка 3D-модели здания' },
        { title: 'Закладка фундамента', icon: <Construction />, tip: 'Использование бетона марки М400' },
        { title: 'Каркас здания', icon: <Warehouse />, tip: 'Монтаж стальных конструкций' },
        { title: 'Коммуникации', icon: <ElectricBolt />, tip: 'Прокладка электрических сетей' },
        { title: 'Внешняя отделка', icon: <Store />, tip: 'Облицовка натуральным камнем' },
        { title: 'Внутренняя отделка', icon: <People />, tip: 'Эргономичный дизайн помещений' },
        { title: 'Системы безопасности', icon: <Security />, tip: 'Установка камер и датчиков' },
        { title: 'Закупка оборудования', icon: <LocalShipping />, tip: 'Сертифицированная техника' },
        { title: 'Найм персонала', icon: <TrendingUp />, tip: 'Подбор квалифицированных сотрудников' },
        { title: 'Обучение', icon: <Computer />, tip: 'Тренинги по стандартам обслуживания' },
        { title: 'Маркетинг', icon: <AccountBalance />, tip: 'Запуск рекламной кампании' },
        { title: 'Тестовый запуск', icon: <Nature />, tip: 'Проведение soft-opening' },
        { title: 'Оптимизация', icon: <Cloud />, tip: 'Анализ первых результатов' },
        { title: 'Гранд открытие', icon: <Business />, tip: 'Организация торжественного мероприятия' }
    ];

    // Расширенные данные для виртуального бизнеса (15 шагов)
    const virtualSteps = [
        { title: 'Выбор ниши', icon: <Computer />, tip: 'Анализ рыночных тенденций' },
        { title: 'Доменное имя', icon: <AccountBalance />, tip: 'Подбор короткого и запоминающегося' },
        { title: 'Хостинг', icon: <Cloud />, tip: 'Выбор облачного решения' },
        { title: 'Разработка', icon: <Engineering />, tip: 'Agile-методология' },
        { title: 'Дизайн', icon: <Store />, tip: 'User-friendly интерфейс' },
        { title: 'Тестирование', icon: <Security />, tip: 'Проверка на уязвимости' },
        { title: 'SEO', icon: <TrendingUp />, tip: 'Оптимизация для поисковых систем' },
        { title: 'Контент', icon: <People />, tip: 'Создание медиа-материалов' },
        { title: 'Монетизация', icon: <LocalShipping />, tip: 'Настройка платежных систем' },
        { title: 'Аналитика', icon: <Construction />, tip: 'Внедрение метрик' },
        { title: 'Реклама', icon: <ElectricBolt />, tip: 'Таргетированные кампании' },
        { title: 'Соцсети', icon: <Nature />, tip: 'SMM-стратегия' },
        { title: 'Автоматизация', icon: <LocationCity />, tip: 'Внедрение AI-решений' },
        { title: 'Поддержка', icon: <Business />, tip: '24/7 чат-боты' },
        { title: 'Масштабирование', icon: <Computer />, tip: 'Глобальная экспансия' }
    ];

    const startAnimation = async (type) => {
        setSelectedType(type);
        setIsAnimating(true);
        setCurrentStep(0);
        await controls.start({ opacity: 1, scale: 1 });

        const steps = type === 'physical' ? physicalSteps : virtualSteps;
        let stepIndex = 0;

        const animateSteps = () => {
            setCurrentStep(stepIndex);
            stepIndex++;
            if (stepIndex < steps.length) {
                setTimeout(() => requestAnimationFrame(animateSteps), 3000);
            } else {
                setIsAnimating(false); // Остановим после последнего шага
            }
        };

        animateSteps();
    };


    return (
        <Box
            sx={{
                minHeight: '100vh',
                padding: 4,
                color: 'black',
                ...(selectedType === 'virtual'
                    ? {
                        backgroundImage: `url(${background})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                    }
                    : {
                        position: 'relative',
                        backgroundColor: '#87CEEB',
                        '&::after': {
                            content: '""',
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            width: '100%',
                            height: '27.5vh',
                            backgroundColor: '#4CAF50',
                            zIndex: 1,
                        },
                    }),
            }}
        >
            {!selectedType ? (
                <Grid container spacing={6} justifyContent="center">
                    <Grid item>
                        <motion.div whileHover={{ scale: 1.1, rotate: 2 }} whileTap={{ scale: 0.9 }}>
                            <Button
                                variant="contained"
                                size="large"
                                onClick={() => startAnimation('physical')}
                                sx={{
                                    px: 8,
                                    py: 3,
                                    borderRadius: 4,
                                    background: 'linear-gradient(45deg, #4CAF50 30%, #81C784 90%)',
                                    fontSize: '1.5rem',
                                    boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                                }}
                            >
                                Физический бизнес
                            </Button>
                        </motion.div>
                    </Grid>
                    <Grid item>
                        <motion.div whileHover={{ scale: 1.1, rotate: -2 }} whileTap={{ scale: 0.9 }}>
                            <Button
                                variant="contained"
                                size="large"
                                onClick={() => startAnimation('virtual')}
                                sx={{
                                    px: 8,
                                    py: 3,
                                    borderRadius: 4,
                                    background: 'linear-gradient(45deg, #2196F3 30%, #64B5F6 90%)',
                                    fontSize: '1.5rem',
                                    boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                                }}
                            >
                                Виртуальный бизнес
                            </Button>
                        </motion.div>
                    </Grid>
                </Grid>
            ) : (
                <Box sx={{
                    width: '100vw',
                    height: '70vh',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    overflow: 'hidden',
                    position: 'relative',
                }}>
                    {selectedType === 'physical' && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1 }}
                            style={{
                                position: 'absolute',
                                top: '50%',
                                left: '80%',
                                transform: 'translate(-50%, -50%)',
                                width: '100%',
                                height: '100%',
                                overflow: 'hidden',
                                zIndex: 4,
                                display: 'flex',
                                alignItems: 'flex-end',
                                justifyContent: 'center',
                                gap: '8px',
                            }}
                        >
                            {[...Array(buildingCount)].map((_, i) => {
                                const height = 350 + Math.floor(Math.random() * 100);
                                const width = 25 + Math.floor(Math.random() * 35);
                                const color = ['#90A4AE', '#607D8B', '#78909C'][i % 3];
                                const shadowColor = ['#455A64', '#37474F', '#263238'][i % 3];

                                // Показываем только те здания, чей индекс меньше текущего шага
                                const visible = i <= currentStep;

                                return (
                                    <motion.div
                                        key={`building-${i}`}
                                        initial={{ scaleY: 0, opacity: 0 }}
                                        animate={visible ? { scaleY: 1, opacity: 1 } : {}}
                                        transition={{
                                            duration: 0.6,
                                            ease: 'easeOut',
                                        }}
                                        style={{
                                            width: `${width}px`,
                                            height: `${height}px`,
                                            background: `linear-gradient(160deg, ${color}, #263238)`,
                                            boxShadow: `0 4px 10px ${shadowColor}`,
                                            borderRadius: '2px 2px 0 0',
                                            transformOrigin: 'bottom',
                                            position: 'relative',
                                        }}
                                    >
                                        {[...Array(Math.floor(height / 20))].map((_, w) => (
                                            <div
                                                key={`window-${i}-${w}`}
                                                style={{
                                                    width: '70%',
                                                    height: '10px',
                                                    margin: '4px auto',
                                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                                    borderRadius: '2px',
                                                }}
                                            />
                                        ))}
                                    </motion.div>
                                );
                            })}


                            {/* Солнце / свет над городом */}
                            <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1.2, opacity: 1 }}
                                transition={{
                                    delay: 12 * 0.25 + 0.5,
                                    duration: 1.5,
                                    ease: 'easeOut',
                                }}
                                style={{
                                    position: 'absolute',
                                    top: '10%',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    width: '150px',
                                    height: '150px',
                                    background: 'radial-gradient(circle, #FFEB3B 0%, rgba(255,255,0,0) 70%)',
                                    borderRadius: '50%',
                                    zIndex: 2,
                                    pointerEvents: 'none',
                                    filter: 'blur(12px)',
                                }}
                            />
                        </motion.div>
                    )}


                    {/* Кошелек для виртуального бизнеса */}
                    {selectedType === 'virtual' && (
                        <motion.div
                            initial={{ scale: 0, rotate: -10 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ duration: 1.5, ease: 'backOut' }}
                            style={{
                                position: 'absolute',
                                top: '55%',
                                left: '45%', // Сдвиг влево для коррекции центрирования
                                transform: 'translate(-50%, -50%)',
                                width: 150,
                                height: 150,
                                borderRadius: '15px',
                                boxShadow: '0 10px 25px rgba(0,0,0,0.4)',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                zIndex: 5,
                            }}
                        >
                            {/* Монеты, влетающие в кошелек */}
                            {[...Array(4)].map((_, i) => (
                                <motion.div
                                    key={`coin-${i}`}
                                    initial={{
                                        y: -150 - i * 40,
                                        x: (i % 2 === 0 ? 1 : -1) * (50 + i * 20),
                                        opacity: 1,
                                        scale: 1.5,
                                    }}
                                    animate={{
                                        y: 0,
                                        x: 0,
                                        opacity: 0,
                                        scale: 0.5,
                                        rotate: -360,
                                    }}
                                    transition={{
                                        duration: 2.5,
                                        delay: 1 + i * 0.4,
                                        repeat: Infinity,
                                        repeatDelay: 2,
                                        ease: 'easeIn',
                                    }}
                                    style={{
                                        width: '40px',
                                        height: '40px',
                                        backgroundColor: '#FFEB3B',
                                        borderRadius: '50%',
                                        position: 'absolute',
                                        boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                                        border: '2px solid #FFF',
                                        zIndex: 6,
                                    }}
                                >
                                    <Typography sx={{ fontSize: '20px', textAlign: 'center', lineHeight: '40px', color: '#000' }}>
                                        $
                                    </Typography>
                                </motion.div>
                            ))}
                            {/* Банкноты, влетающие в кошелек */}
                            {[...Array(3)].map((_, i) => (
                                <motion.div
                                    key={`banknote-${i}`}
                                    initial={{
                                        y: -200 - i * 50,
                                        x: (i % 2 === 0 ? -1 : 1) * (60 + i * 30),
                                        opacity: 1,
                                        scale: 1.2,
                                    }}
                                    animate={{
                                        y: 0,
                                        x: 0,
                                        opacity: 0,
                                        scale: 0.3,
                                        rotate: 180,
                                    }}
                                    transition={{
                                        duration: 3,
                                        delay: 1.2 + i * 0.5,
                                        repeat: Infinity,
                                        repeatDelay: 2.5,
                                        ease: 'easeIn',
                                    }}
                                    style={{
                                        width: '60px',
                                        height: '30px',
                                        backgroundColor: '#4CAF50',
                                        borderRadius: '5px',
                                        position: 'absolute',
                                        boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                                        border: '1px solid #FFF',
                                        zIndex: 6,
                                    }}
                                >
                                    <Typography sx={{ fontSize: '14px', textAlign: 'center', lineHeight: '30px', color: '#FFF' }}>
                                        ₽
                                    </Typography>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}

                    {/* Всплывающие подсказки */}
                    <AnimatePresence>
                        {isAnimating && (
                            <>
                                {/* Главная подсказка */}
                                <motion.div
                                    key={`main-${currentStep}`}
                                    initial={{ y: 50, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: -50, opacity: 0 }}
                                    transition={{ duration: 0.5 }}
                                    style={{
                                        position: 'absolute',
                                        top: 50,
                                        left: '25%',
                                        transform: 'translateX(-50%)',
                                        zIndex: 10,
                                    }}
                                >
                                    <Paper sx={{
                                        p: 3,
                                        borderRadius: 4,
                                        background: 'rgba(255, 255, 255, 0.95)',
                                        boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                                        maxWidth: '500px',
                                        backdropFilter: 'blur(5px)',
                                    }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            {selectedType === 'physical'
                                                ? physicalSteps[currentStep]?.icon
                                                : virtualSteps[currentStep]?.icon}
                                            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                                                {selectedType === 'physical'
                                                    ? physicalSteps[currentStep]?.title
                                                    : virtualSteps[currentStep]?.title}
                                            </Typography>
                                        </Box>
                                        <Typography variant="h6" sx={{ mt: 2 }}>
                                            {selectedType === 'physical'
                                                ? physicalSteps[currentStep]?.tip
                                                : virtualSteps[currentStep]?.tip}
                                        </Typography>
                                    </Paper>
                                </motion.div>

                                {/* Дополнительные подсказки */}
                                {[1, 2, 3].map((offset) => {
                                    const stepIndex = (currentStep + offset) %
                                        (selectedType === 'physical'
                                            ? physicalSteps.length
                                            : virtualSteps.length);
                                    return (
                                        <motion.div
                                            key={`sub-${stepIndex}`}
                                            initial={{ y: 50, opacity: 0 }}
                                            animate={{ y: 0, opacity: 0.3 }}
                                            exit={{ y: -50, opacity: 0 }}
                                            transition={{ duration: 0.5, delay: offset * 0.1 }}
                                            style={{
                                                position: 'absolute',
                                                top: 50 + offset * 100,
                                                left: `${50 + offset * 5}%`,
                                                transform: 'translateX(-50%)',
                                                zIndex: 9 - offset,
                                            }}
                                        >
                                            <Paper sx={{
                                                p: 2,
                                                borderRadius: 3,
                                                background: `rgba(255, 255, 255, ${0.9 - offset * 0.2})`,
                                                boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                                                maxWidth: '400px',
                                            }}>
                                                <Typography variant="h6">
                                                    {selectedType === 'physical'
                                                        ? physicalSteps[stepIndex]?.title
                                                        : virtualSteps[stepIndex]?.title}
                                                </Typography>
                                            </Paper>
                                        </motion.div>
                                    );
                                })}
                                <motion.div
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    style={{
                                        position: 'absolute',
                                        top: '20px',  // Позиционирование кнопки в верхней части экрана
                                        left: '20px', // Позиционирование слева
                                        zIndex: 10,  // Выше остальных элементов
                                    }}
                                >
                                    <Button
                                        variant="outlined"
                                        size="large"
                                        onClick={() => setSelectedType(null)}  // Обработчик для кнопки "Назад"
                                        sx={{
                                            borderRadius: 4,
                                            borderColor: '#000',
                                            fontSize: '1rem',
                                            boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                                            color: '#000',
                                        }}
                                    >
                                        Назад
                                    </Button>
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>
                </Box>
            )}
        </Box>
    );
};

export default StartBusinessPage;