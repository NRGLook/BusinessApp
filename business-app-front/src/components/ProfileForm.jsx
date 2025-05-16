import React, {useState} from 'react';
import {
    TextField,
    Button,
    Paper,
    useTheme,
    Grid,
    CircularProgress, Box, Typography
} from '@mui/material';
import {
    Save,
    Cancel,
    ArrowBack
} from '@mui/icons-material';
import {useNavigate, useParams, Link} from 'react-router-dom';
import {useSpring, animated, config} from 'react-spring';
import {Formik, Form, Field, ErrorMessage} from 'formik';
import * as Yup from 'yup';
import '../pages/ProfilePage/ProfilePage.css';
import axios from 'axios';

const AnimatedBox = animated(Box);

// Schema for form validation
const profileSchema = Yup.object().shape({
    firstName: Yup.string()
        .min(2, 'Имя должно быть не менее 2 символов')
        .max(50, 'Имя должно быть не более 50 символов')
        .required('Пожалуйста, введите ваше имя'),
    lastName: Yup.string()
        .min(2, 'Фамилия должна быть не менее 2 символов')
        .max(50, 'Фамилия должна быть не более 50 символов')
        .required('Пожалуйста, введите вашу фамилию'),
    bio: Yup.string()
        .min(10, 'Биография должна быть не менее 10 символов')
        .max(500, 'Биография должна быть не более 500 символов'),
    avatarUrl: Yup.string().url('Неверный формат URL аватара'),
});

const ProfileForm = ({initialValues, isEditing}) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const {id} = useParams();

    const fadeIn = useSpring({
        opacity: 1,
        from: {opacity: 0},
        config: config.molasses,
    });

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Token not found');
            }
            const profileId = localStorage.getItem('profile_id')
            const endpoint = `http://localhost:8000/user/${id}/profile/edit`; // Use the same endpoint

            const dataToSendEdit = {
                data: [
                    {
                        id: profileId,
                        first_name: values.firstName,
                        last_name: values.lastName,
                        bio: values.bio,
                        avatar_url: values.avatarUrl,
                        user_id: id,
                    },
                ]
            };
            const dataToSendCreate = {
                data: [
                    {
                        first_name: values.firstName,
                        last_name: values.lastName,
                        bio: values.bio,
                        avatar_url: values.avatarUrl,
                        user_id: id,
                    },
                ]
            };

            // // Include the id if it exists (for updating)
            // if (initialValues.id) {
            //     dataToSend.user_profile.id = initialValues.id;
            // }

            const response = await axios({
                method: "POST",
                url: endpoint,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                data: isEditing ? dataToSendEdit : dataToSendCreate,
            });

            if (response.status >= 200 && response.status < 300) {
                // Handle success (e.g., show a success message, redirect)
                console.log(isEditing ? 'Profile updated successfully' : 'Profile created successfully');
                navigate(`/profile`); // Redirect to profile view
            } else {
                // Handle server error
                console.error('Failed to save profile:', response);
                throw new Error('Failed to save profile');
            }
        } catch (error) {
            // Handle network error or error from the catch block
            console.error('Error saving profile:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatedBox style={fadeIn}>
            <Paper elevation={5} sx={{
                p: 4,
                borderRadius: 8,
                background: theme.palette.background.paper,
                boxShadow: '0px 4px 12px rgba(0,0,0,0.1)'
            }}>
                <Formik
                    initialValues={initialValues}
                    validationSchema={profileSchema}
                    onSubmit={handleSubmit}
                    enableReinitialize
                >
                    {({isSubmitting}) => (
                        <Form>
                            <Grid container spacing={4}>
                                <Grid item xs={12} sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                                    <Link to={`/profile`} style={{textDecoration: 'none'}}>
                                        <Button variant="outlined" startIcon={<ArrowBack/>}>
                                            Назад
                                        </Button>
                                    </Link>
                                    <Typography variant="h4"
                                                sx={{fontWeight: 700, color: theme.palette.primary.main, ml: 2}}>
                                        {isEditing ? 'Редактирование профиля' : 'Создание профиля'}
                                    </Typography>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <Field name="firstName" as={TextField} label="Имя" fullWidth variant="outlined"/>
                                    <ErrorMessage name="firstName" component="div" className="error"/>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Field name="lastName" as={TextField} label="Фамилия" fullWidth variant="outlined"/>
                                    <ErrorMessage name="lastName" component="div" className="error"/>
                                </Grid>
                                <Grid item xs={12}>
                                    <Field name="bio" as={TextField} label="О себе" fullWidth multiline rows={4}
                                           variant="outlined"/>
                                    <ErrorMessage name="bio" component="div" className="error"/>
                                </Grid>
                                <Grid item xs={12}>
                                    <Field name="avatarUrl" as={TextField} label="URL аватара" fullWidth
                                           variant="outlined"/>
                                    <ErrorMessage name="avatarUrl" component="div" className="error"/>
                                </Grid>

                                <Grid item xs={12} sx={{display: 'flex', justifyContent: 'flex-end', gap: 2}}>
                                    <Button
                                        variant="outlined"
                                        onClick={() => navigate(`/user/${id}/profile`)} // Go back
                                        disabled={isSubmitting}
                                        startIcon={<Cancel/>}
                                    >
                                        Отмена
                                    </Button>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        disabled={isSubmitting || loading}
                                        startIcon={<Save/>}
                                        sx={{
                                            backgroundColor: theme.palette.success.main,
                                            '&:hover': {backgroundColor: theme.palette.success.dark}
                                        }}
                                    >
                                        {loading ? (
                                            <>
                                                <CircularProgress size={20} color="inherit" sx={{mr: 1}}/>
                                                Сохранение...
                                            </>
                                        ) : (
                                            isEditing ? 'Сохранить изменения' : 'Создать профиль'
                                        )}
                                    </Button>
                                </Grid>
                            </Grid>
                        </Form>
                    )}
                </Formik>
            </Paper>
        </AnimatedBox>
    );
};

export {ProfileForm};
