import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    CardMedia,
    Chip,
    Tabs,
    Tab,
    Button,
    CircularProgress,
    Alert,
    RadioGroup,
    FormControlLabel,
    Radio,
    Stepper,
    Step,
    StepLabel,
    LinearProgress,
    Paper,
    useTheme,
    alpha,
    Dialog,
    DialogTitle,
    DialogContent,
    List,
    ListItem,
    ListItemIcon,
    ListItemText
} from '@mui/material';
import {
    Category as CategoryIcon,
    VideoLibrary as LessonsIcon,
    Quiz as QuizIcon,
    CheckCircle as CompletedIcon,
    PlayCircle as StartIcon,
    Videocam as VideoIcon
} from '@mui/icons-material';
import { styled } from '@mui/system';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const SectionHeader = styled(Typography)(({ theme }) => ({
    margin: theme.spacing(6, 0, 4),
    fontWeight: 800,
    background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    letterSpacing: '1.5px',
    textAlign: 'center',
    position: 'relative',
    '&:after': {
        content: '""',
        display: 'block',
        width: '60px',
        height: '4px',
        backgroundColor: theme.palette.primary.main,
        margin: '16px auto 0',
        borderRadius: '2px'
    }
}));

const CourseCard = styled(motion(Card))(({ theme }) => ({
    borderRadius: '16px',
    overflow: 'visible',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
        transform: 'translateY(-8px)',
        boxShadow: `0 12px 24px ${alpha(theme.palette.primary.main, 0.1)}`
    },
    cursor: 'pointer',
    position: 'relative'
}));

const ProgressChip = styled(Chip)(({ theme, completed }) => ({
    position: 'absolute',
    top: theme.spacing(2),
    right: theme.spacing(2),
    backgroundColor: completed ? theme.palette.success.main : theme.palette.warning.light,
    color: theme.palette.common.white,
    fontWeight: 600,
    borderRadius: '8px',
    padding: theme.spacing(0.5),
    fontSize: '0.75rem'
}));

const LessonCard = styled(motion(Paper))(({ theme }) => ({
    padding: theme.spacing(3),
    borderRadius: '12px',
    transition: 'all 0.2s ease',
    '&:hover': {
        backgroundColor: alpha(theme.palette.primary.light, 0.05)
    },
    cursor: 'pointer',
    border: `2px solid ${alpha(theme.palette.primary.main, 0.1)}`
}));

export default function LearnPage() {
    const navigate = useNavigate();
    const theme = useTheme();
    const [categories, setCategories] = useState([]);
    const [courses, setCourses] = useState([]);
    const [lessons, setLessons] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [loadingStates, setLoadingStates] = useState({
        categories: true,
        courses: true,
        lessons: true,
        quiz: true
    });
    const [errors, setErrors] = useState({
        categories: null,
        courses: null,
        lessons: null,
        quiz: null
    });
    const [selectedTab, setSelectedTab] = useState({ category: 0, course: null, lesson: null });
    const [selectedLessonAction, setSelectedLessonAction] = useState(null);
    const [selectedCourseAction, setSelectedCourseAction] = useState(null); // Добавляем это состояние

    useEffect(() => {
        axios.get('http://localhost:8000/education/course-categories')
            .then(response => {
                setCategories(response.data.data);
                setLoadingStates(prev => ({ ...prev, categories: false }));
            })
            .catch(error => {
                setErrors(prev => ({ ...prev, categories: 'Не удалось загрузить категории' }));
                setLoadingStates(prev => ({ ...prev, categories: false }));
            });
    }, []);

    useEffect(() => {
        if (categories.length === 0) return;
        setLoadingStates(prev => ({ ...prev, courses: true }));
        axios.get('http://localhost:8000/education/courses')
            .then(response => {
                setCourses(response.data.data);
                setLoadingStates(prev => ({ ...prev, courses: false }));
            })
            .catch(error => {
                setErrors(prev => ({ ...prev, courses: 'Не удалось загрузить курсы' }));
                setLoadingStates(prev => ({ ...prev, courses: false }));
            });
    }, [categories]);

    useEffect(() => {
        if (!selectedTab.course) return;
        setLoadingStates(prev => ({ ...prev, lessons: true }));
        axios.get('http://localhost:8000/education/lessons', { params: { course_id: selectedTab.course } })
            .then(response => {
                setLessons(response.data.data);
                setLoadingStates(prev => ({ ...prev, lessons: false }));
            })
            .catch(error => {
                setErrors(prev => ({ ...prev, lessons: 'Не удалось загрузить уроки' }));
                setLoadingStates(prev => ({ ...prev, lessons: false }));
            });
    }, [selectedTab.course]);

    useEffect(() => {
        if (!selectedTab.lesson) return;
        setLoadingStates(prev => ({ ...prev, quiz: true }));
        axios.get('http://localhost:8000/education/quiz-questions', { params: { lesson_id: selectedTab.lesson } })
            .then(response => {
                setQuestions(response.data.data);
                setLoadingStates(prev => ({ ...prev, quiz: false }));
            })
            .catch(error => {
                setErrors(prev => ({ ...prev, quiz: 'Не удалось загрузить вопросы' }));
                setLoadingStates(prev => ({ ...prev, quiz: false }));
            });
    }, [selectedTab.lesson]);

    const handleCategoryChange = (event, newValue) => {
        setSelectedTab({ category: newValue, course: null, lesson: null });
    };

    const handleCourseSelect = (courseId) => {
        setSelectedTab(prev => ({ ...prev, course: courseId, lesson: null }));
    };

    const handleLessonAction = (lesson) => {
        if (lesson.lesson_url) {
            if (lesson.lesson_url.startsWith('/')) {
                navigate(lesson.lesson_url);
            } else {
                window.open(lesson.lesson_url, '_blank');
            }
        } else {
            setSelectedTab(prev => ({ ...prev, lesson: lesson.id }));
            setCurrentQuestionIndex(0);
            setAnswers({});
        }
        setSelectedLessonAction(null);
    };

    const filteredCourses = courses.filter(course =>
        categories[selectedTab.category]?.id === course.category_id
    );

    const quizProgress = (currentQuestionIndex / questions.length) * 100;

    const getVideoPreview = (lesson_url) => {
        const FALLBACK_IMAGE = '/Users/ilya.tsikhanionak/Programming/BusinessApp/business-app-front/src/assets/images/course-default.png';
        console.log('[DEBUG] Input videoUrl:', lesson_url);

        if (!lesson_url) {
            console.error('[ERROR] Video URL is undefined or empty');
            return FALLBACK_IMAGE;
        }

        try {
            // YouTube обработка
            if (lesson_url.includes('youtube.com') || lesson_url.includes('youtu.be')) {
                console.log('[DEBUG] Detected YouTube URL');

                const videoIdMatch = lesson_url.match(/(?:v=|\/)([a-zA-Z0-9_-]{11})/);
                console.log('[DEBUG] Video ID match:', videoIdMatch);

                const videoId = videoIdMatch?.[1];
                console.log('[DEBUG] Extracted video ID:', videoId);

                if (!videoId) {
                    console.error('[ERROR] Failed to extract YouTube video ID');
                    return FALLBACK_IMAGE;
                }

                const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
                console.log('[DEBUG] Generated YouTube thumbnail URL:', thumbnailUrl);
                return thumbnailUrl;
            }

            // Vimeo обработка
            if (lesson_url.includes('vimeo.com')) {
                console.log('[DEBUG] Detected Vimeo URL');

                const videoId = lesson_url.split('/').pop();
                console.log('[DEBUG] Extracted Vimeo video ID:', videoId);

                if (!videoId) {
                    console.error('[ERROR] Failed to extract Vimeo video ID');
                    return FALLBACK_IMAGE;
                }

                const thumbnailUrl = `https://vumbnail.com/${videoId}.jpg`;
                console.log('[DEBUG] Generated Vimeo thumbnail URL:', thumbnailUrl);
                return thumbnailUrl;
            }

            console.error('[ERROR] Unsupported video platform');
            return FALLBACK_IMAGE;

        } catch (error) {
            console.error('[ERROR] Error in getVideoPreview:', error);
            return FALLBACK_IMAGE;
        }
    };

    if (loadingStates.categories) return <CircularProgress sx={{ margin: '40vh auto' }} />;
    if (errors.categories) return <Alert severity="error" sx={{ margin: 4 }}>{errors.categories}</Alert>;

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            {/* Категории курсов */}
            <Tabs
                value={selectedTab.category}
                onChange={handleCategoryChange}
                variant="scrollable"
                scrollButtons="auto"
                sx={{
                    marginBottom: 4,
                    '& .MuiTab-root': {
                        minHeight: 48,
                        borderRadius: 2,
                        margin: theme.spacing(0.5),
                        transition: 'all 0.3s',
                        '&.Mui-selected': {
                            backgroundColor: alpha(theme.palette.primary.main, 0.1)
                        }
                    }
                }}
            >
                {categories.map((category, index) => (
                    <Tab
                        key={category.id}
                        label={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <CategoryIcon fontSize="small" />
                                {category.name}
                            </Box>
                        }
                    />
                ))}
            </Tabs>

            {/* Список курсов */}
            {loadingStates.courses ? (
                <CircularProgress sx={{ display: 'block', margin: '40px auto' }} />
            ) : errors.courses ? (
                <Alert severity="error" sx={{ margin: 4 }}>{errors.courses}</Alert>
            ) : (
                <Grid container spacing={3} sx={{ marginBottom: 6 }}>
                    {filteredCourses.map(course => {
                        // Добавляем переменную lessonUrl с проверкой
                        const lessonUrl = course?.lesson_url;

                        return (
                            <Grid item key={course.id} sx={{
                                width: { xs: '100%', sm: '50%', md: '33.33%', lg: '25%' },
                                padding: 2
                            }}>
                                <CourseCard
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                    onClick={() => {
                                        handleCourseSelect(course.id);
                                        setSelectedCourseAction(course);
                                    }}
                                >
                                    <CardMedia
                                        component="img"
                                        height="200"
                                        image={
                                            (() => {
                                                console.log('[DEBUG] Course object:', course);
                                                // Используем объявленную переменную lessonUrl
                                                const preview = lessonUrl
                                                    ? getVideoPreview(lessonUrl)
                                                    : '/assets/images/course-default.png';

                                                console.log('[DEBUG] Preview URL:', preview);
                                                return preview;
                                            })()
                                        }
                                        alt={course?.title || "Название курса"}
                                        sx={{
                                            borderRadius: '16px 16px 0 0',
                                            objectFit: 'cover',
                                            backgroundColor: theme.palette.grey[200],
                                            backgroundImage: 'url(/assets/images/course-default.png)'
                                        }}
                                        onError={(e) => {
                                            e.target.src = '/assets/images/course-default.png';
                                        }}
                                        loading="lazy"
                                    />
                                    <ProgressChip
                                        label={`${course.progress ?? 0}%`}
                                        completed={course.progress === 100 ? "true" : "false"}
                                        sx={{
                                            position: 'absolute',
                                            top: theme.spacing(2),
                                            right: theme.spacing(2),
                                            backgroundColor: course.progress === 100
                                                ? theme.palette.success.main
                                                : theme.palette.warning.light,
                                            color: theme.palette.common.white,
                                            borderRadius: '8px',
                                            fontSize: '0.75rem'
                                        }}
                                    />
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom>
                                            {course.title}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {course.description}
                                        </Typography>
                                        <Box sx={{ mt: 2, display: 'flex', gap: 2, flexDirection: 'column' }}>
                                            {lessonUrl && (
                                                <Button
                                                    variant="outlined"
                                                    startIcon={<VideoIcon />}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        window.open(lessonUrl, '_blank');
                                                    }}
                                                >
                                                    Смотреть программу курса
                                                </Button>
                                            )}
                                        </Box>
                                    </CardContent>
                                </CourseCard>
                            </Grid>
                        );
                    })}
                </Grid>
            )}

            {/* Список уроков */}
            {selectedTab.course && (
                <Box sx={{ marginBottom: 6 }}>
                    <SectionHeader variant="h3">
                        <LessonsIcon sx={{ verticalAlign: 'middle', marginRight: 2, fontSize: 'inherit' }} />
                        Уроки курса
                    </SectionHeader>

                    {loadingStates.lessons ? (
                        <CircularProgress sx={{ display: 'block', margin: '40px auto' }} />
                    ) : errors.lessons ? (
                        <Alert severity="error" sx={{ margin: 4 }}>{errors.lessons}</Alert>
                    ) : (
                        <Grid container spacing={3}>
                            {lessons.map(lesson => (
                                <Grid item xs={12} md={6} key={lesson.id}>
                                    <LessonCard
                                        onClick={() => setSelectedLessonAction(lesson)}
                                        whileHover={{ scale: 1.02 }}
                                    >
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                                            <CompletedIcon
                                                fontSize="large"
                                                color={lesson.completed ? 'success' : 'disabled'}
                                                sx={{ flexShrink: 0 }}
                                            />
                                            <Box sx={{ flexGrow: 1 }}>
                                                <Typography variant="h6">{lesson.title}</Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Длительность: {lesson.duration} минут
                                                </Typography>
                                                <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                                                    {lesson.lesson_url && (
                                                        <Button
                                                            variant="outlined"
                                                            startIcon={<VideoIcon />}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleLessonAction(lesson);
                                                            }}
                                                        >
                                                            Смотреть урок
                                                        </Button>
                                                    )}
                                                    <Button
                                                        variant="contained"
                                                        startIcon={<QuizIcon />}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setSelectedTab(prev => ({ ...prev, lesson: lesson.id }));
                                                            setCurrentQuestionIndex(0);
                                                            setAnswers({});
                                                        }}
                                                    >
                                                        Пройти тест
                                                    </Button>
                                                </Box>
                                            </Box>
                                        </Box>
                                    </LessonCard>
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </Box>
            )}

            {/* Диалог выбора действия для урока */}
            <Dialog open={!!selectedLessonAction} onClose={() => setSelectedLessonAction(null)}>
                <DialogTitle>Выберите действие для урока</DialogTitle>
                <DialogContent>
                    <List>
                        <ListItem
                            button
                            onClick={() => {
                                setSelectedTab(prev => ({ ...prev, lesson: selectedLessonAction.id }));
                                setCurrentQuestionIndex(0);
                                setAnswers({});
                                setSelectedLessonAction(null);
                            }}
                        >
                            <ListItemIcon><QuizIcon /></ListItemIcon>
                            <ListItemText primary="Пройти тест" />
                        </ListItem>
                        {selectedLessonAction?.lesson_url && (
                            <ListItem
                                button
                                onClick={() => {
                                    handleLessonAction(selectedLessonAction);
                                    setSelectedLessonAction(null);
                                }}
                            >
                                <ListItemIcon><VideoIcon /></ListItemIcon>
                                <ListItemText primary="Смотреть урок" />
                            </ListItem>
                        )}
                    </List>
                </DialogContent>
            </Dialog>

            <Dialog open={!!selectedCourseAction} onClose={() => setSelectedCourseAction(null)}>
                <DialogTitle>Выберите действие для курса</DialogTitle>
                <DialogContent>
                    <List>
                        {selectedCourseAction?.lesson_url && (
                            <ListItem
                                button
                                onClick={() => {
                                    window.open(selectedCourseAction.lesson_url, '_blank');
                                    setSelectedCourseAction(null);
                                }}
                            >
                                <ListItemIcon><VideoIcon /></ListItemIcon>
                                <ListItemText primary="Смотреть введение" />
                            </ListItem>
                        )}
                        <ListItem
                            button
                            onClick={() => {
                                const firstLesson = selectedCourseAction?.lessons?.[0];
                                if (firstLesson) handleLessonAction(firstLesson);
                                setSelectedCourseAction(null);
                            }}
                        >
                            <ListItemIcon><StartIcon /></ListItemIcon>
                            <ListItemText primary="Начать обучение" />
                        </ListItem>
                    </List>
                </DialogContent>
            </Dialog>

            {/* Викторина */}
            {selectedTab.lesson && (
                <Box sx={{ marginBottom: 6 }}>
                    <SectionHeader variant="h3">
                        <QuizIcon sx={{ verticalAlign: 'middle', marginRight: 2, fontSize: 'inherit' }} />
                        Проверка знаний
                    </SectionHeader>

                    {loadingStates.quiz ? (
                        <CircularProgress sx={{ display: 'block', margin: '40px auto' }} />
                    ) : errors.quiz ? (
                        <Alert severity="error" sx={{ margin: 4 }}>{errors.quiz}</Alert>
                    ) : questions.length === 0 ? (
                        <Alert severity="info" sx={{ margin: 4 }}>Вопросы не найдены</Alert>
                    ) : currentQuestionIndex < questions.length ? (
                        <Card sx={{ borderRadius: 3, overflow: 'visible' }}>
                            <LinearProgress
                                variant="determinate"
                                value={quizProgress}
                                sx={{
                                    height: 6,
                                    '& .MuiLinearProgress-bar': {
                                        borderRadius: 3,
                                        backgroundColor: theme.palette.primary.main
                                    }
                                }}
                            />
                            <CardContent>
                                <Stepper
                                    activeStep={currentQuestionIndex}
                                    sx={{ marginBottom: 4 }}
                                >
                                    {questions.map((_, index) => (
                                        <Step key={index}>
                                            <StepLabel />
                                        </Step>
                                    ))}
                                </Stepper>

                                <AnimatePresence mode='wait'>
                                    <motion.div
                                        key={currentQuestionIndex}
                                        initial={{ opacity: 0, x: 50 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -50 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <Typography variant="h5" gutterBottom>
                                            {questions[currentQuestionIndex]?.question_text}
                                        </Typography>
                                        <RadioGroup
                                            value={answers[currentQuestionIndex] || ''}
                                            onChange={(event) => setAnswers(prev => ({
                                                ...prev,
                                                [currentQuestionIndex]: event.target.value
                                            }))}
                                        >
                                            {(() => {
                                                const question = questions[currentQuestionIndex];
                                                if (!question) return null;

                                                // Обработка разных форматов choices
                                                let choicesArray = [];
                                                let isObjectFormat = false;

                                                if (Array.isArray(question.choices)) {
                                                    // Формат массива: ["вариант1", "вариант2"]
                                                    choicesArray = question.choices.map((item, index) => ({
                                                        key: String.fromCharCode(65 + index), // A, B, C...
                                                        value: item
                                                    }));
                                                } else if (typeof question.choices === 'object' && question.choices !== null) {
                                                    // Формат объекта: {A: "вариант1", B: "вариант2"}
                                                    isObjectFormat = true;
                                                    choicesArray = Object.entries(question.choices).map(([key, value]) => ({
                                                        key: key,
                                                        value: value
                                                    }));
                                                } else {
                                                    // Неизвестный формат
                                                    return <Typography color="error">Некорректный формат вариантов ответов</Typography>;
                                                }

                                                return choicesArray.map((choice, index) => (
                                                    <FormControlLabel
                                                        key={`${currentQuestionIndex}-${choice.key}`}
                                                        value={isObjectFormat ? choice.key : choice.value}
                                                        control={<Radio color="primary" />}
                                                        label={
                                                            <Typography
                                                                variant="body1"
                                                                sx={{
                                                                    whiteSpace: 'pre-line',
                                                                    wordBreak: 'break-word',
                                                                    textAlign: 'left'
                                                                }}
                                                            >
                                                                {`${choice.key}. ${choice.value}`}
                                                            </Typography>
                                                        }
                                                        sx={{
                                                            margin: '8px 0',
                                                            padding: 2,
                                                            borderRadius: 2,
                                                            alignItems: 'flex-start',
                                                            backgroundColor: alpha(
                                                                theme.palette.primary.main,
                                                                answers[currentQuestionIndex] === (isObjectFormat ? choice.key : choice.value) ? 0.1 : 0
                                                            ),
                                                            width: '100%'
                                                        }}
                                                    />
                                                ));
                                            })()}
                                        </RadioGroup>
                                        <Button
                                            fullWidth
                                            variant="contained"
                                            size="large"
                                            onClick={() => {
                                                if (currentQuestionIndex < questions.length - 1) {
                                                    setCurrentQuestionIndex(prev => prev + 1);
                                                } else {
                                                    setCurrentQuestionIndex(questions.length);
                                                }
                                            }}
                                            disabled={!answers.hasOwnProperty(currentQuestionIndex)}
                                            sx={{
                                                marginTop: 3,
                                                borderRadius: 2,
                                                py: 1.5
                                            }}
                                        >
                                            {currentQuestionIndex === questions.length - 1
                                                ? 'Завершить тест'
                                                : 'Следующий вопрос'}
                                        </Button>
                                    </motion.div>
                                </AnimatePresence>
                            </CardContent>
                        </Card>
                    ) : (
                        <Paper elevation={3} sx={{ padding: 4, borderRadius: 3 }}>
                            <Typography variant="h4" gutterBottom>
                                Тест завершен!
                            </Typography>
                            <Typography variant="body1" paragraph>
                                Правильных ответов: {
                                questions.filter((q, index) => {
                                    const userAnswer = answers[index];
                                    const correctAnswer = q.correct_answer;

                                    // Обработка разных форматов ответов
                                    if (Array.isArray(q.choices)) {
                                        return userAnswer === correctAnswer;
                                    } else {
                                        return userAnswer === correctAnswer;
                                    }
                                }).length
                            } из {questions.length}
                            </Typography>
                            {questions.map((question, index) => {
                                const userAnswer = answers[index];
                                const correctAnswer = question.correct_answer;

                                // Формируем данные для отображения
                                let choicesData = [];
                                if (Array.isArray(question.choices)) {
                                    choicesData = question.choices.map((item, i) => ({
                                        key: String.fromCharCode(65 + i),
                                        value: item
                                    }));
                                } else {
                                    choicesData = Object.entries(question.choices || {}).map(([key, value]) => ({
                                        key: key,
                                        value: value
                                    }));
                                }

                                const userAnswerText = choicesData.find(c =>
                                    Array.isArray(question.choices) ? c.value === userAnswer : c.key === userAnswer
                                )?.value || 'Нет ответа';

                                const correctAnswerText = choicesData.find(c =>
                                    Array.isArray(question.choices) ? c.value === correctAnswer : c.key === correctAnswer
                                )?.value || correctAnswer;

                                return (
                                    <Box
                                        key={index}
                                        sx={{
                                            marginBottom: 3,
                                            padding: 3,
                                            borderRadius: 2,
                                            backgroundColor: alpha(
                                                userAnswer === correctAnswer
                                                    ? theme.palette.success.light
                                                    : theme.palette.error.light,
                                                0.1
                                            )
                                        }}
                                    >
                                        <Typography variant="h6" paragraph>
                                            Вопрос {index + 1}: {question.question_text}
                                        </Typography>
                                        <Typography color="text.secondary">
                                            Ваш ответ: {userAnswerText}
                                        </Typography>
                                        <Typography color="text.secondary">
                                            Правильный ответ: {correctAnswerText}
                                        </Typography>
                                    </Box>
                                );
                            })}
                        </Paper>
                    )}
                </Box>
            )}
        </Container>
    );
}