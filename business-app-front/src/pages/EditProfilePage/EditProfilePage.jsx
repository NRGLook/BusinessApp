import React, { useState, useEffect } from 'react';
import {
    Container,
    CircularProgress,
    Box,
    Typography,
    Button
} from '@mui/material';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from '../../api/axios';
import { ProfileForm } from '/Users/ilya.tsikhanionak/Programming/BusinessApp/business-app-front/src/components/ProfileForm.jsx';

const EditProfilePage = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { userId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('Token not found');
                }

                const response = await axios.get(`/user/${userId}/profile`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });


                const raw = response.data;

                if (raw?.data && Array.isArray(raw.data)) {
                    if (raw.data.length > 0) {
                        setUserData(raw.data[0]);
                    } else {
                        setError('Profile not found'); // Установите ошибку
                        setLoading(false);
                        return;
                    }
                } else {
                    setError('Ошибка при загрузке профиля');
                    setLoading(false);
                    return;
                }

            } catch (err) {
                console.error('Error fetching profile:', err);
                setError('Не удалось загрузить профиль');
                if (err.response?.status === 401) {
                    navigate('/auth');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [userId, navigate]);

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
                    <Box mt={2} textAlign="center">
                        <Link to={`/user/${userId}/profile`}>
                            <Button variant="contained">
                                Go to Profile
                            </Button>
                        </Link>
                    </Box>
                </Typography>
            </Container>
        );
    }

    const { user_profile, id } = userData || {};

    const initialValues = {
        id: id, // Включите id для обновлений
        firstName: user_profile?.first_name || '',
        lastName: user_profile?.last_name || '',
        bio: user_profile?.bio || '',
        avatarUrl: user_profile?.avatar_url || '',
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <ProfileForm initialValues={initialValues} isEditing={true} />
        </Container>
    );
};

export default EditProfilePage;