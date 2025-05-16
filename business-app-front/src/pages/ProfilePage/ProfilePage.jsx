import React, { useEffect, useState } from 'react';
import {
    Box,
    Container,
    Typography,
    Avatar,
    CircularProgress,
    Button,
    Paper,
    useTheme,
    Grid,
    Card,
    CardContent,
    IconButton,
    LinearProgress
} from '@mui/material';
import { Facebook, Twitter, LinkedIn, Event, TrendingUp, Lightbulb, People } from '@mui/icons-material';
import axios from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import { useSpring, animated, config } from 'react-spring';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './ProfilePage.css';

const AnimatedBox = animated(Box);
const AnimatedCalendar = animated(Calendar);
const AnimatedLinearProgress = animated(LinearProgress);

const ProfilePage = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const theme = useTheme();
    const navigate = useNavigate();
    const [calendarDate, setCalendarDate] = useState(new Date());
    const [upcomingEvents, /* setUpcomingEvents - Removed unused variable */] = useState([
        { date: new Date(new Date().setDate(new Date().getDate() + 3)), title: 'Онлайн конференция' },
        { date: new Date(new Date().setDate(new Date().getDate() + 7)), title: 'Вебинар по маркетингу' },
        { date: new Date(new Date().setDate(new Date().getDate() + 12)), title: 'Встреча с партнерами' },
    ]);
    const [userId, setUserId] = useState(null);


    const fadeIn = useSpring({
        opacity: loading ? 0 : 1,
        transform: loading ? 'translateY(20px)' : 'translateY(0)',
        config: config.molasses,
    });

    const calendarAnimation = useSpring({
        transform: 'scale(1)',
        opacity: 1,
        from: { transform: 'scale(0.9)', opacity: 0.8 },
        config: config.wobbly,
    });

    const progressAnimation = useSpring({
        from: { value: 0 },
        to: { value: userData?.user_stats?.[0]?.success_rate || 0 },
        config: config.slow,
    });
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');

                if (!token) {
                    console.warn('No token found, redirecting...');
                    navigate('/auth');
                    return;
                }

                // First, get the user ID
                const meResponse = await axios.get('/user/me', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const myId = meResponse.data?.id;
                if (!myId) {
                    console.error("Failed to fetch user ID");
                    setError("Failed to fetch user ID");
                    setLoading(false);
                    return;
                }
                setUserId(myId);
                localStorage.setItem('user_id', myId.toString());


                const response = await axios.get(`http://127.0.0.1:8000/user/${myId}/profile`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const raw = response.data;


                if (raw?.data && Array.isArray(raw.data)) {
                    if (raw.data.length > 0) {
                        setUserData(raw.data[0]);
                    } else {
                        setUserData({}); // Set an empty object to indicate no profile
                    }
                } else {
                    setError('Ошибка при загрузке профиля');
                    setUserData({});
                }
            } catch (err) {
                console.error('Error while fetching profile:', err);
                setError('Не удалось загрузить профиль');
                if (err.response?.status === 401) {
                    navigate('/auth');
                }
                setUserData({});
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [navigate]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
                <CircularProgress size={60} />
            </Box>
        );
    }

    if (error) {
        return (
            <Container maxWidth="md" sx={{ mt: 4 }}>
                <Typography variant="h5" color="error" align="center">
                    {error}
                </Typography>
            </Container>
        );
    }

    const { user_profile, user_stats, role, achievement, id: profileId } = userData || {};

    const fullName = `${user_profile?.first_name || ''} ${user_profile?.last_name || ''}`.trim();
    const successRate = user_stats?.[0]?.success_rate || 0;
    const hasProfile = userData && Object.keys(userData).length > 0 && userData.user_profile !== undefined && userData.user_profile !== null;
    const isEmptyProfile = !hasProfile || !fullName;


    const handleEditOrCreateProfile = () => {
        navigate(`/user/profile/${userId}/edit`);
    };

    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            <AnimatedBox style={fadeIn}>
                <Paper elevation={5} sx={{
                    p: 5,
                    borderRadius: 8,
                    background: theme.palette.background.paper,
                    mb: 5,
                    boxShadow: '0px 4px 12px rgba(0,0,0,0.1)',
                }}>
                    <Grid container spacing={6} alignItems="center">
                        <Grid item md={3} sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Avatar
                                src={user_profile?.avatar_url || undefined}
                                sx={{
                                    width: 160,
                                    height: 160,
                                    fontSize: '4rem',
                                    bgcolor: theme.palette.primary.dark,
                                    boxShadow: '0px 2px 8px rgba(0,0,0,0.2)',
                                    transition: 'transform 0.3s ease-in-out',
                                    '&:hover': { transform: 'scale(1.05)' },
                                }}
                            >
                                {fullName ? fullName[0].toUpperCase() : 'U'}
                            </Avatar>
                        </Grid>
                        <Grid item md={6} sx={{ textAlign: 'center' }}>
                            <Typography variant="h3" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
                                {fullName || 'Пользователь'}
                            </Typography>
                            <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 1 }}>
                                {user_profile?.bio || 'Информация о пользователе отсутствует.'}
                            </Typography>
                        </Grid>
                        <Grid item md={3} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                            <IconButton aria-label="Facebook" href="https://www.facebook.com/yourcompany" target="_blank" color="primary">
                                <Facebook fontSize="large" />
                            </IconButton>
                            <IconButton aria-label="Twitter" href="https://twitter.com/yourcompany" target="_blank" color="primary">
                                <Twitter fontSize="large" />
                            </IconButton>
                            <IconButton aria-label="LinkedIn" href="https://www.linkedin.com/company/yourcompany" target="_blank" color="primary">
                                <LinkedIn fontSize="large" />
                            </IconButton>
                        </Grid>
                    </Grid>
                </Paper>

                <Grid container spacing={4}>
                    <Grid item md={6}>
                        <Paper elevation={4} sx={{ p: 4, borderRadius: 8, background: theme.palette.background.paper, boxShadow: '0px 2px 6px rgba(0,0,0,0.05)' }}>
                            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: theme.palette.secondary.main, display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Lightbulb /> Информация профиля
                            </Typography>
                            {hasProfile &&  fullName ? (
                                <>
                                    <ProfileField
                                        label="О себе"
                                        value={user_profile?.bio}
                                        theme={theme}
                                    />
                                    {user_profile?.email && (
                                        <ProfileField
                                            label="Email"
                                            value={user_profile?.email}
                                            theme={theme}
                                        />
                                    )}
                                    {user_profile?.phone_number && (
                                        <ProfileField
                                            label="Телефон"
                                            value={user_profile?.phone_number}
                                            theme={theme}
                                        />
                                    )}

                                    {user_stats && user_stats.length > 0 && (
                                        <Box mt={3}>
                                            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: theme.palette.secondary.main, display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <TrendingUp /> Статистика
                                            </Typography>
                                            <Card sx={{ mb: 2, backgroundColor: theme.palette.grey[100], borderRadius: 4, boxShadow: '0px 1px 3px rgba(0,0,0,0.03)' }}>
                                                <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                                    <Typography variant="subtitle2" color="text.secondary">
                                                        Общее количество бизнесов: {user_stats[0]?.total_businesses}
                                                    </Typography>
                                                    <Typography variant="subtitle2" color="text.secondary">
                                                        Общий капитал: {user_stats[0]?.total_capital}
                                                    </Typography>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <Typography variant="subtitle2" color="text.secondary">
                                                            Успешность: {Math.round(successRate * 100)}%
                                                        </Typography>
                                                        <AnimatedLinearProgress
                                                            variant="determinate"
                                                            value={progressAnimation.value}
                                                            sx={{ flexGrow: 1, borderRadius: 4, height: 8 }}
                                                            color="success"
                                                        />
                                                    </Box>
                                                </CardContent>
                                            </Card>
                                        </Box>
                                    )}

                                    {achievement && achievement.length > 0 && (
                                        <Box mt={3}>
                                            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: theme.palette.secondary.main, display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <People /> Достижения
                                            </Typography>
                                            <Grid container spacing={2}>
                                                {achievement.map((ach, index) => (
                                                    <Grid item xs={12} sm={6} key={index}>
                                                        <Card sx={{ backgroundColor: theme.palette.grey[100], borderRadius: 4, boxShadow: '0px 1px 3px rgba(0,0,0,0.03)', transition: 'transform 0.2s ease-in-out', '&:hover': { transform: 'scale(1.03)' } }}>
                                                            <CardContent>
                                                                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                                                    {ach.name}
                                                                </Typography>
                                                                {ach.description && (
                                                                    <Typography variant="body2" color="text.secondary">
                                                                        {ach.description}
                                                                    </Typography>
                                                                )}
                                                            </CardContent>
                                                        </Card>
                                                    </Grid>
                                                ))}
                                            </Grid>
                                        </Box>
                                    )}

                                    {role && role.length > 0 && (
                                        <Box mt={3}>
                                            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: theme.palette.secondary.main, display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <People /> Роли
                                            </Typography>
                                            {role.map((r, index) => (
                                                <Card key={index} sx={{ mb: 1, backgroundColor: theme.palette.grey[100], borderRadius: 4, boxShadow: '0px 1px 3px rgba(0,0,0,0.03)', transition: 'transform 0.2s ease-in-out', '&:hover': { transform: 'scale(1.03)' } }}>
                                                    <CardContent>
                                                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                                            {r.name}
                                                        </Typography>
                                                        {r.description && (
                                                            <Typography variant="body2" color="text.secondary">
                                                                {r.description}
                                                            </Typography>
                                                        )}
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </Box>
                                    )}

                                    <Button
                                        variant="contained"
                                        size="large"
                                        sx={{
                                            mt: 4,
                                            px: 5,
                                            borderRadius: 6,
                                            textTransform: 'none',
                                            fontSize: '1.1rem',
                                            backgroundColor: theme.palette.primary.main,
                                            '&:hover': {
                                                backgroundColor: theme.palette.primary.dark,
                                            },
                                        }}
                                        onClick={handleEditOrCreateProfile}
                                        disabled={false}
                                    >
                                        Редактировать профиль
                                    </Button>
                                </>
                            ) : (
                                <Box mt={3}>
                                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: theme.palette.secondary.main }}>
                                        Профиль отсутствует
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" mb={2}>
                                        Похоже, у вас еще нет профиля. Создайте его, чтобы поделиться своей информацией.
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        size="large"
                                        sx={{
                                            px: 5,
                                            borderRadius: 6,
                                            textTransform: 'none',
                                            fontSize: '1.1rem',
                                            backgroundColor: theme.palette.success.main,
                                            '&:hover': {
                                                backgroundColor: theme.palette.success.dark,
                                            },
                                        }}
                                        onClick={handleEditOrCreateProfile}
                                        disabled={false}

                                    >
                                        Создать профиль
                                    </Button>
                                </Box>
                            )}
                        </Paper>
                    </Grid>
                    <Grid item md={6}>
                        <Paper elevation={4} sx={{ p: 4, borderRadius: 8, background: theme.palette.background.paper, boxShadow: '0px 2px 6px rgba(0,0,0,0.05)' }}>
                            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: theme.palette.secondary.main, display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Event /> Ближайшие события
                            </Typography>
                            {upcomingEvents.length > 0 ? (
                                upcomingEvents.map((event, index) => (
                                    <Box key={index} sx={{ mb: 3, borderLeft: `4px solid ${theme.palette.primary.light}`, pl: 3, transition: 'transform 0.2s ease-in-out', '&:hover': { transform: 'translateX(8px)' } }}>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                            {event.title}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {event.date.toLocaleDateString('ru-RU', { year: 'numeric', month: 'long', day: 'numeric' })}
                                        </Typography>
                                    </Box>
                                ))
                            ) : (
                                <Typography variant="body2" color="text.secondary">
                                    Нет запланированных событий.
                                </Typography>
                            )}
                        </Paper>

                        <Paper elevation={4} sx={{ mt: 4, p: 4, borderRadius: 8, background: theme.palette.background.paper, overflow: 'hidden', position: 'relative' }}>
                            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: theme.palette.secondary.main }}>
                                Календарь событий
                            </Typography>
                            <AnimatedCalendar
                                style={calendarAnimation}
                                value={calendarDate}
                                onChange={setCalendarDate}
                                className="animated-calendar"
                                tileContent={({ date, view }) => {
                                    if (view === 'month') {
                                        const eventOnDay = upcomingEvents.find(event =>
                                            event.date.toDateString() === date.toDateString()
                                        );
                                        return eventOnDay ? (
                                            <Box className="event-marker" sx={{ backgroundColor: theme.palette.primary.light, color: 'white', borderRadius: 2, fontSize: '0.8rem', padding: '3px 6px' }}>
                                                {eventOnDay.title.substring(0, 10)}...
                                            </Box>
                                        ) : null;
                                    }
                                    return null;
                                }}
                            />
                            {/* Subtle background pattern */}
                            <Box sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                backgroundImage: 'radial-gradient(circle, rgba(0, 123, 255, 0.05) 15%, transparent 15%)',
                                backgroundSize: '20px 20px',
                                pointerEvents: 'none',
                                opacity: 0.4,
                            }} />
                        </Paper>
                    </Grid>
                </Grid>
            </AnimatedBox>
        </Container>
    );
};

const ProfileField = ({ label, value, theme }) => (
    <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        p: 3,
        borderRadius: 6,
        bgcolor: theme.palette.grey[100],
        mb: 2,
        transition: 'background-color 0.3s ease-in-out',
        '&:hover': {
            backgroundColor: theme.palette.grey[200],
        },
    }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 500, color: theme.palette.text.primary }}>
            {label}:
        </Typography>
        <Typography variant="body1" sx={{ color: theme.palette.text.secondary, textAlign: 'right' }}>
            {value || 'Не указано'}
        </Typography>
    </Box>
);

export default ProfilePage;
