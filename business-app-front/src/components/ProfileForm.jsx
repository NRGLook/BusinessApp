import React, {useEffect, useState} from "react";
import {
    TextField,
    Button,
    Paper,
    useTheme,
    Grid,
    CircularProgress,
    Box,
    Typography,
    Stack,
} from "@mui/material";
import {Save, Cancel, ArrowBack} from "@mui/icons-material";
import {useNavigate, useParams, Link} from "react-router-dom";
import {useSpring, animated, config} from "react-spring";
import {Formik, Form, Field, ErrorMessage} from "formik";
import * as Yup from "yup";
import axios from "axios";

const AnimatedBox = animated(Box);

const profileSchema = Yup.object().shape({
    first_name: Yup.string()
        .min(2, "Имя должно быть не менее 2 символов")
        .max(50, "Имя должно быть не более 50 символов")
        .required("Пожалуйста, введите ваше имя"),
    last_name: Yup.string()
        .min(2, "Фамилия должна быть не менее 2 символов")
        .max(50, "Фамилия должна быть не более 50 символов")
        .required("Пожалуйста, введите вашу фамилию"),
    bio: Yup.string()
        .min(10, "Биография должна быть не менее 10 символов")
        .max(500, "Биография должна быть не более 500 символов"),
    avatar_url: Yup.string().url("Неверный формат URL аватара"),
});

const ProfileForm = ({initialValues, isEditing}) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formValues, setFormValues] = useState({});
    const {id} = useParams();
    const token = localStorage.getItem('token');
    const profileId = localStorage.getItem('profile_id');
    const userId = localStorage.getItem("user_id");
    useEffect(() => {
        setFormValues({
            id: profileId ?? '',
            user_id: userId ?? '',
            first_name: initialValues.user_profile.first_name ?? '',
            last_name: initialValues.user_profile.last_name ?? '',
            avatar_url: initialValues.user_profile.avatar_url ?? "",
            bio: initialValues.user_profile.bio ?? "",
        })
    }, [initialValues]);
    const handleSubmit = async (values) => {
        const createData = {
            data: [
                {
                    user_id: userId,
                    first_name: values.first_name ?? '',
                    last_name: values.last_name ?? '',
                    avatar_url: values.avatar_url ?? "",
                    bio: values.bio ?? "",
                }
            ]
        }
        const editData = {
            data: [
                {
                    id: profileId,
                    user_id: userId,
                    first_name: values.first_name ?? '',
                    last_name: values.last_name ?? '',
                    avatar_url: values.avatar_url ?? "",
                    bio: values.bio ?? "",
                }
            ]
        }
        const data = isEditing ? editData : createData;
        try {
            const response = axios.post(`http://127.0.0.1:8000/user/${userId}/profile/edit`, data, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            response.then(( ) => {
                navigate("/profile");
            })
        } catch (err) {
            if (err.status === 401) {
                navigate('auth')
            } else {
                alert(err)
            }
        }
    }
    const fadeIn = useSpring({
        opacity: 1,
        from: {opacity: 0},
        config: config.molasses,
    });
    return (
        <AnimatedBox style={fadeIn}>
            <Paper
                elevation={5}
                sx={{
                    p: 4,
                    borderRadius: 8,
                    background: theme.palette.background.paper,
                    boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
                }}
            >
                <Formik
                    initialValues={formValues}
                    validationSchema={profileSchema}
                    onSubmit={handleSubmit}
                    enableReinitialize
                >
                    {({isSubmitting}) => (
                        <Form>
                            <Stack spacing={2}>
                                <Stack direction="row" alignItems="center" spacing={1}>
                                    <Link to="/profile" style={{textDecoration: "none"}}>
                                        <Button variant="outlined" startIcon={<ArrowBack/>}>
                                            Назад
                                        </Button>
                                    </Link>
                                    <Typography
                                        variant="h4"
                                        sx={{fontWeight: 700, color: theme.palette.primary.main}}
                                    >
                                        {isEditing ? "Редактирование профиля" : "Создание профиля"}
                                    </Typography>
                                </Stack>

                                {/* Поля формы */}
                                <Grid container spacing={4}>
                                    <Grid item xs={12} md={6}>
                                        <Field name="first_name">
                                            {({field, meta}) => (
                                                <TextField
                                                    {...field}
                                                    label="Имя"
                                                    fullWidth
                                                    variant="outlined"
                                                    error={meta.touched && !!meta.error}
                                                    helperText={meta.touched && meta.error}
                                                    InputLabelProps={{
                                                        shrink: true, // Фиксирует лейбл над полем
                                                    }}
                                                />
                                            )}
                                        </Field>
                                        <ErrorMessage name="first_name" component="div" className="error"/>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Field name="last_name">
                                            {({field, meta}) => (
                                                <TextField
                                                    {...field}
                                                    label="Фамилия"
                                                    fullWidth
                                                    variant="outlined"
                                                    error={meta.touched && !!meta.error}
                                                    helperText={meta.touched && meta.error}
                                                    InputLabelProps={{
                                                        shrink: true, // Фиксирует лейбл над полем
                                                    }}
                                                />
                                            )}
                                        </Field>
                                        <ErrorMessage name="last_name" component="div" className="error"/>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Field name="bio">
                                            {({field, meta}) => (
                                                <TextField
                                                    {...field}
                                                    multiline rows={2}
                                                    label="О себе"
                                                    fullWidth
                                                    variant="outlined"
                                                    error={meta.touched && !!meta.error}
                                                    helperText={meta.touched && meta.error}
                                                    InputLabelProps={{
                                                        shrink: true, // Фиксирует лейбл над полем
                                                    }}
                                                />
                                            )}
                                        </Field>
                                        <ErrorMessage name="bio" component="div" className="error"/>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Field name="avatar_url">
                                            {({field, meta}) => (
                                                <TextField
                                                    {...field}
                                                    multiline rows={2}
                                                    label="URL аватара"
                                                    fullWidth
                                                    variant="outlined"
                                                    error={meta.touched && !!meta.error}
                                                    helperText={meta.touched && meta.error}
                                                    InputLabelProps={{
                                                        shrink: true, // Фиксирует лейбл над полем
                                                    }}
                                                />
                                            )}
                                        </Field>
                                        <ErrorMessage name="avatar_url" component="div" className="error"/>
                                    </Grid>
                                </Grid>

                                {/* Кнопки */}
                                <Stack direction="row" spacing={2} justifyContent="center">
                                    <Button
                                        variant="outlined"
                                        onClick={() => navigate(`/profile`)}
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
                                            "&:hover": {backgroundColor: theme.palette.success.dark},
                                        }}
                                    >
                                        {loading ? (
                                            <>
                                                <CircularProgress size={20} color="inherit" sx={{mr: 1}}/>
                                                Сохранение...
                                            </>
                                        ) : (
                                            isEditing ? "Сохранить изменения" : "Создать профиль"
                                        )}
                                    </Button>
                                </Stack>
                            </Stack>
                        </Form>
                    )}
                </Formik>
            </Paper>
        </AnimatedBox>
    );
};

export {ProfileForm};
