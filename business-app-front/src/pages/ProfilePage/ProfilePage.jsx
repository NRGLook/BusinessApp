// src/pages/ProfilePage.jsx
import React, { useEffect, useState } from 'react';
import {
    Box,
    Container,
    Typography,
    Avatar,
    CircularProgress,
    Button,
    Paper,
    useTheme
} from '@mui/material';
import axios from '../../api/axios';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const theme = useTheme();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get('/user/me', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setUserData(response.data);
            } catch (err) {
                setError('Не удалось загрузить профиль');
                if (err.response?.status === 401) {
                    navigate('/auth');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [navigate]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
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

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Paper elevation={3} sx={{
                p: 4,
                borderRadius: 4,
                background: theme.palette.background.paper
            }}>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 3
                }}>
                    <Avatar
                        sx={{
                            width: 120,
                            height: 120,
                            fontSize: '3rem',
                            bgcolor: theme.palette.primary.main
                        }}
                    >
                        {userData?.username?.[0]?.toUpperCase() || 'U'}
                    </Avatar>

                    <Typography variant="h3" sx={{ fontWeight: 700 }}>
                        {userData?.username || 'Пользователь'}
                    </Typography>

                    <Box sx={{
                        width: '100%',
                        maxWidth: 400,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2
                    }}>
                        <ProfileField
                            label="Email"
                            value={userData?.email}
                            theme={theme}
                        />

                        <ProfileField
                            label="Дата регистрации"
                            value={new Date(userData?.created_at).toLocaleDateString()}
                            theme={theme}
                        />

                        <ProfileField
                            label="Статус"
                            value={userData?.is_verified ? 'Подтвержден' : 'Не подтвержден'}
                            theme={theme}
                        />
                    </Box>

                    <Button
                        variant="contained"
                        size="large"
                        sx={{
                            mt: 3,
                            px: 6,
                            borderRadius: 2,
                            textTransform: 'none',
                            fontSize: '1.1rem'
                        }}
                        onClick={() => navigate('/profile/edit')}
                    >
                        Редактировать профиль
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

const ProfileField = ({ label, value, theme }) => (
    <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        p: 2,
        borderRadius: 2,
        bgcolor: theme.palette.background.default
    }}>
        <Typography variant="body1" sx={{ fontWeight: 500 }}>
            {label}:
        </Typography>
        <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>
            {value || 'Не указано'}
        </Typography>
    </Box>
);

export default ProfilePage;