import React, { useState, useEffect } from 'react';
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
    InputAdornment,
    TextField,
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
} from '@mui/material';
import { Search, VideoLibrary, Article, Quiz } from '@mui/icons-material';
import { styled } from '@mui/system';
import axios from 'axios';

// Styled components
const SectionHeader = styled(Typography)(({ theme }) => ({
    margin: theme.spacing(4, 0),
    fontWeight: 700,
    color: theme.palette.primary.main,
    letterSpacing: 1.2,
}));
const CardRoot = styled(Card)(({ theme }) => ({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.3s ease',
    '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: theme.shadows[6],
    },
}));
const ProgressChip = styled(({ completed, ...rest }) => <Chip {...rest} />)(
    ({ theme, completed }) => ({
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: completed ? theme.palette.success.main : theme.palette.warning.main,
        color: '#fff',
    })
);

export default function LearnPage() {
    // state
    const [catLoading, setCatLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const [catError, setCatError] = useState(null);
    const [tabCat, setTabCat] = useState(0);

    const [courseLoading, setCourseLoading] = useState(true);
    const [courses, setCourses] = useState([]);
    const [courseError, setCourseError] = useState(null);
    const [tabCourse, setTabCourse] = useState(null);

    const [lessonLoading, setLessonLoading] = useState(true);
    const [lessons, setLessons] = useState([]);
    const [lessonError, setLessonError] = useState(null);
    const [selectedLesson, setSelectedLesson] = useState(null);

    const [quizLoading, setQuizLoading] = useState(true);
    const [questions, setQuestions] = useState([]);
    const [quizError, setQuizError] = useState(null);
    const [currentQ, setCurrentQ] = useState(0);
    const [answers, setAnswers] = useState({});

    // fetch categories
    useEffect(() => {
        axios.get('http://localhost:8000/education/course-categories')
            .then(res => setCategories(res.data.data))
            .catch(() => setCatError('Failed to load categories'))
            .finally(() => setCatLoading(false));
    }, []);

    // fetch courses
    useEffect(() => {
        if (!categories.length) return;
        setCourseLoading(true);
        axios.get('http://localhost:8000/education/courses')
            .then(res => setCourses(res.data.data))
            .catch(() => setCourseError('Failed to load courses'))
            .finally(() => setCourseLoading(false));
    }, [categories]);

    // fetch lessons when course selected
    useEffect(() => {
        if (!tabCourse) return;
        setLessonLoading(true);
        axios.get('http://localhost:8000/education/lessons', {
            params: { course_id: tabCourse }
        })
            .then(res => setLessons(res.data.data))
            .catch(() => setLessonError('Failed to load lessons'))
            .finally(() => setLessonLoading(false));
    }, [tabCourse]);

    // fetch quiz questions when lesson selected
    useEffect(() => {
        if (!selectedLesson) return;
        setQuizLoading(true);
        axios.get('http://localhost:8000/education/quiz-questions', {
            params: { lesson_id: selectedLesson }
        })
            .then(res => setQuestions(res.data.data))
            .catch(() => setQuizError('Failed to load quiz'))
            .finally(() => setQuizLoading(false));
    }, [selectedLesson]);

    if (catLoading) return <CircularProgress />;
    if (catError) return <Alert severity="error">{catError}</Alert>;

    const handleCatChange = (_, newVal) => {
        setTabCat(newVal);
        setTabCourse(null);
        setSelectedLesson(null);
    };
    const handleCourseSelect = id => {
        setTabCourse(id);
        setSelectedLesson(null);
    };
    const handleLessonSelect = id => {
        setSelectedLesson(id);
        setCurrentQ(0);
        setAnswers({});
    };

    const submitAnswer = () => {
        setCurrentQ(q => q + 1);
    };

    // filtered
    const visibleCourses = courses.filter(c => categories[tabCat]?.id === c.category_id);
    const visibleLessons = lessons;

    return (
        <Container>
            <SectionHeader variant="h4">Обучающие материалы</SectionHeader>

            {/* Categories */}
            <Tabs value={tabCat} onChange={handleCatChange} variant="scrollable" scrollButtons="auto">
                {categories.map((cat, i) =>
                    <Tab key={cat.id} label={cat.name} />
                )}
            </Tabs>

            {/* Courses */}
            {courseLoading ? <CircularProgress /> : courseError ? <Alert severity="error">{courseError}</Alert> :
                <Grid container spacing={2} sx={{ mt: 2 }}>
                    {visibleCourses.map(course => (
                        <Grid item xs={12} sm={6} md={4} key={course.id}>
                            <CardRoot onClick={() => handleCourseSelect(course.id)}>
                                <CardMedia
                                    component="img"
                                    height="140"
                                    image={course.image_url || '/assets/default-thumbnail.jpg'}
                                    alt={course.title}
                                />
                                <CardContent>
                                    <Typography variant="h6">{course.title}</Typography>
                                    <Typography variant="body2">{course.description}</Typography>
                                </CardContent>
                            </CardRoot>
                        </Grid>
                    ))}
                </Grid>
            }

            {/* Lessons */}
            {tabCourse && (
                <>
                    <SectionHeader variant="h5" sx={{ mt: 4 }}>Уроки</SectionHeader>
                    {lessonLoading ? <CircularProgress /> : lessonError ? <Alert severity="error">{lessonError}</Alert> :
                        <Grid container spacing={2}>
                            {visibleLessons.map(lesson => (
                                <Grid item xs={12} sm={6} md={4} key={lesson.id}>
                                    <CardRoot onClick={() => handleLessonSelect(lesson.id)}>
                                        <CardContent>
                                            <Typography variant="subtitle1">{lesson.title}</Typography>
                                        </CardContent>
                                    </CardRoot>
                                </Grid>
                            ))}
                        </Grid>
                    }
                </>
            )}

            {selectedLesson && (
                <>
                    <SectionHeader variant="h5" sx={{ mt: 4 }}>
                        Викторина
                    </SectionHeader>

                    {quizLoading ? (
                        <CircularProgress />
                    ) : quizError ? (
                        <Alert severity="error">{quizError}</Alert>
                    ) : questions.length === 0 ? (
                        <Alert>Вопросы не найдены.</Alert>
                    ) : currentQ < questions.length ? (
                        <Card sx={{ mb: 3, position: 'relative' }}>
                            {/* Progress bar */}
                            <LinearProgress
                                variant="determinate"
                                value={((currentQ) / questions.length) * 100}
                                sx={{ height: 8, borderRadius: 4 }}
                            />

                            <CardContent>
                                {/* Stepper */}
                                <Stepper activeStep={currentQ} sx={{ mb: 2 }}>
                                    {questions.map((_, idx) => (
                                        <Step key={idx}>
                                            <StepLabel />
                                        </Step>
                                    ))}
                                </Stepper>

                                {/* Question */}
                                <Typography variant="h6" gutterBottom>
                                    {questions[currentQ].question_text}
                                </Typography>

                                {/* Choices */}
                                <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                                    <RadioGroup
                                        value={answers[currentQ] || ''}
                                        onChange={(e) =>
                                            setAnswers((a) => ({ ...a, [currentQ]: e.target.value }))
                                        }
                                    >
                                        {questions[currentQ].choices.map((c, i) => (
                                            <FormControlLabel
                                                key={i}
                                                value={c}
                                                control={<Radio />}
                                                label={c}
                                                sx={{ display: 'block', mb: 1 }}
                                            />
                                        ))}
                                    </RadioGroup>
                                </Paper>

                                {/* Next/Finish Button */}
                                <Button
                                    variant="contained"
                                    disabled={!answers[currentQ]}
                                    onClick={() => setCurrentQ((q) => q + 1)}
                                    sx={{ mt: 1, textTransform: 'none' }}
                                >
                                    {currentQ + 1 < questions.length ? 'Next Question' : 'Finish Quiz'}
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        /* Quiz completed */
                        <Paper elevation={3} sx={{ p: 3, mt: 2 }}>
                            <Typography variant="h6" gutterBottom>
                                Quiz Completed!
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                You answered {questions.length} questions.
                            </Typography>
                            {questions.map((q, idx) => (
                                <Box key={idx} sx={{ mb: 1 }}>
                                    <Typography variant="subtitle2">Q{idx + 1}:</Typography>
                                    <Typography variant="body2" sx={{ ml: 2 }}>
                                        Your answer: <strong>{answers[idx]}</strong>
                                    </Typography>
                                    <Typography variant="body2" sx={{ ml: 2 }}>
                                        Correct answer: <strong>{q.correct_answer}</strong>
                                    </Typography>
                                </Box>
                            ))}
                        </Paper>
                    )}
                </>
            )}

        </Container>
    );
}
