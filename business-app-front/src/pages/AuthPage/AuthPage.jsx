import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Tabs,
    Tab,
    Box,
    TextField,
    Button,
    Snackbar,
    CircularProgress,
    Alert,
    Typography,
    useTheme,
    Fade,
    InputAdornment,
    Divider
} from "@mui/material";
import {
    EmailRounded,
    LockRounded,
    VpnKeyRounded,
    LoginRounded,
    PersonAddAltRounded,
    PasswordRounded,
    CheckCircleRounded,
    ArrowForwardRounded,
    ErrorRounded
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useNavigate } from 'react-router-dom'; // Импортируем useNavigate

const BASE_URL = "http://localhost:8000";

const tabLabels = [
    { label: "Вход", icon: <LoginRounded /> },
    { label: "Регистрация", icon: <PersonAddAltRounded /> },
    { label: "Восстановление", icon: <PasswordRounded /> },
    { label: "Сброс пароля", icon: <VpnKeyRounded /> },
    { label: "Подтверждение", icon: <CheckCircleRounded /> }
];

const AuthPage = () => {
    const theme = useTheme();
    const [form, setForm] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        token: ""
    });
    const [tab, setTab] = useState(0);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const navigate = useNavigate(); // Хук для навигации


    // useEffect(() => {
    //     if (localStorage.getItem("token")) {
    //         // Если токен есть, перенаправляем на страницу профиля (или любую другую)
    //         navigate("/profile");
    //         window.location.reload();
    //     }
    // }, [navigate]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleTabChange = (_, newValue) => {
        setTab(newValue);
        setForm({ email: "", password: "", confirmPassword: "", token: "" });
        setErrorMessage("");
        setSuccessMessage("");
    };

    const handleSnackbarClose = () => {
        setOpenSnackbar(false);
    };

    const validateForm = () => {
        if (tab === 1 && form.password !== form.confirmPassword) {
            setErrorMessage("Пароли не совпадают!");
            return false;
        }
        return true;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            setOpenSnackbar(true);
            return;
        }

        setLoading(true);
        setErrorMessage("");
        setSuccessMessage("");

        try {
            let response;
            const config = { headers: { "Content-Type": "application/json" } };

            switch (tab) {
                case 0: // Login
                    const loginData = new URLSearchParams();
                    loginData.append('grant_type', 'password');
                    loginData.append('username', form.email);
                    loginData.append('password', form.password);

                    // Выводим данные для отладки
                    console.log('Данные для входа:', loginData.toString());

                    response = await axios.post(`${BASE_URL}/auth/login`, loginData.toString(), {
                        headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    });
                    localStorage.setItem("token", response.data.access_token);
                    localStorage.setItem("user", JSON.stringify({ email: form.email }));
                    setSuccessMessage("Поздравляем Вы вошли в свою учетную запись! Теперь Вам доступен основной функционал сайта!");
                    // Перенаправляем пользователя после успешного входа
                    navigate("/profile");
                    window.location.reload();
                    break;

                case 1: // Register
                    const registerData = {
                        email: form.email,
                        password: form.password,
                    };
                    console.log('Данные для регистрации:', registerData);
                    response = await axios.post(`${BASE_URL}/auth/register`, registerData, config);
                    setSuccessMessage("Регистрация успешна! Проверьте почту для подтверждения");
                    window.location.reload();
                    break;

                case 2: // Forgot Password
                    const forgotPasswordData = {
                        email: form.email,
                    };
                    console.log('Данные для восстановления пароля:', forgotPasswordData);
                    response = await axios.post(`${BASE_URL}/auth/forgot-password`, forgotPasswordData, config);
                    setSuccessMessage("Ссылка для сброса пароля отправлена на вашу почту");
                    window.location.reload();
                    break;

                case 3: // Reset Password
                    const resetPasswordData = {
                        token: form.token,
                        password: form.password,
                    };
                    console.log('Данные для сброса пароля:', resetPasswordData);
                    response = await axios.post(`${BASE_URL}/auth/reset-password`, resetPasswordData, config);
                    setSuccessMessage("Пароль успешно изменен!");
                    window.location.reload();
                    break;

                case 4: // Verify Email
                    const verifyEmailData = {
                        token: form.token,
                    };
                    console.log('Данные для подтверждения email:', verifyEmailData);
                    response = await axios.post(`${BASE_URL}/auth/verify`, verifyEmailData, config);
                    setSuccessMessage("Email успешно подтвержден!");
                    window.location.reload();
                    break;

                default:
                    break;
            }
        } catch (err) {
            const error = err.response?.data?.detail || "Ошибка сервера";
            setErrorMessage(JSON.stringify(error.message ?? 'Error has occurred'));
        } finally {
            setLoading(false);
            setOpenSnackbar(true);
        }
    };

    const getCurrentForm = () => {
        const commonProps = {
            fullWidth: true,
            margin: "normal",
            variant: "outlined",
            onChange: handleChange,
            required: true
        };

        switch (tab) {
            case 0: // Login
                return (
                    <Fade in={true} timeout={500}>
                        <Box>
                            <TextField
                                {...commonProps}
                                label="Email"
                                name="email"
                                type="email"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <EmailRounded color="action" />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <TextField
                                {...commonProps}
                                label="Пароль"
                                name="password"
                                type="password"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <LockRounded color="action" />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <Button
                                component={motion.button}
                                whileHover={{ scale: 1.02 }}
                                variant="contained"
                                fullWidth
                                size="large"
                                onClick={handleSubmit}
                                disabled={loading}
                                endIcon={!loading && <ArrowForwardRounded />}
                                sx={{ mt: 3 }}
                            >
                                {loading ? <CircularProgress size={24} /> : "Войти"}
                            </Button>
                        </Box>
                    </Fade>
                );

            case 1: // Register
                return (
                    <Fade in={true} timeout={500}>
                        <Box>
                            <TextField
                                {...commonProps}
                                label="Email"
                                name="email"
                                type="email"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <EmailRounded color="action" />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <TextField
                                {...commonProps}
                                label="Пароль"
                                name="password"
                                type="password"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <LockRounded color="action" />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <TextField
                                {...commonProps}
                                label="Подтвердите пароль"
                                name="confirmPassword"
                                type="password"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <LockRounded color="action" />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <Button
                                component={motion.button}
                                whileHover={{ scale: 1.02 }}
                                variant="contained"
                                color="secondary"
                                fullWidth
                                size="large"
                                onClick={handleSubmit}
                                disabled={loading}
                                sx={{ mt: 3 }}
                            >
                                {loading ? <CircularProgress size={24} /> : "Зарегистрироваться"}
                            </Button>
                        </Box>
                    </Fade>
                );

            case 2: // Forgot Password
                return (
                    <Fade in={true} timeout={500}>
                        <Box>
                            <TextField
                                {...commonProps}
                                label="Email"
                                name="email"
                                type="email"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <EmailRounded color="action" />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <Button
                                component={motion.button}
                                whileHover={{ scale: 1.02 }}
                                variant="contained"
                                color="warning"
                                fullWidth
                                size="large"
                                onClick={handleSubmit}
                                disabled={loading}
                                sx={{ mt: 3 }}
                            >
                                {loading ? <CircularProgress size={24} /> : "Отправить ссылку"}
                            </Button>
                        </Box>
                    </Fade>
                );

            case 3: // Reset Password
                return (
                    <Fade in={true} timeout={500}>
                        <Box>
                            <TextField
                                {...commonProps}
                                label="Токен сброса"
                                name="token"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <VpnKeyRounded color="action" />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <TextField
                                {...commonProps}
                                label="Новый пароль"
                                name="password"
                                type="password"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <LockRounded color="action" />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <Button
                                component={motion.button}
                                whileHover={{ scale: 1.02 }}
                                variant="contained"
                                color="success"
                                fullWidth
                                size="large"
                                onClick={handleSubmit}
                                disabled={loading}
                                sx={{ mt: 3 }}
                            >
                                {loading ? <CircularProgress size={24} /> : "Сбросить пароль"}
                            </Button>
                        </Box>
                    </Fade>
                );

            case 4: // Verify Email
                return (
                    <Fade in={true} timeout={500}>
                        <Box>
                            <TextField
                                {...commonProps}
                                label="Верификационный токен"
                                name="token"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <CheckCircleRounded color="action" />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <Button
                                component={motion.button}
                                whileHover={{ scale: 1.02 }}
                                variant="contained"
                                color="info"
                                fullWidth
                                size="large"
                                onClick={handleSubmit}
                                disabled={loading}
                                sx={{ mt: 3 }}
                            >
                                {loading ? <CircularProgress size={24} /> : "Подтвердить Email"}
                            </Button>
                        </Box>
                    </Fade>
                );

            default:
                return null;
        }
    };

    return (
        <Box sx={{
            maxWidth: 500,
            mx: "auto",
            mt: { xs: 2, md: 8 },
            p: 4,
            borderRadius: 4,
            bgcolor: "background.paper",
            boxShadow: theme.shadows[10]
        }}>
            <Box textAlign="center" mb={4}>
                <Typography
                    variant="h4"
                    component="h1"
                    sx={{
                        fontWeight: 700,
                        background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}
                >
                    {tabLabels[tab].label}
                </Typography>
                <Divider sx={{ mt: 2, mb: 3 }} />
            </Box>

            <Tabs
                value={tab}
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons="auto"
                textColor="secondary"
                indicatorColor="secondary"
            >
                {tabLabels.map((tab, index) => (
                    <Tab
                        key={index}
                        label={tab.label}
                        icon={tab.icon}
                        iconPosition="start"
                        sx={{ minHeight: 64 }}
                    />
                ))}
            </Tabs>

            <Box mt={4}>
                {getCurrentForm()}
            </Box>

            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert
                    elevation={6}
                    variant="filled"
                    onClose={handleSnackbarClose}
                    severity={errorMessage ? "error" : "success"}
                    iconMapping={{
                        success: <CheckCircleRounded fontSize="inherit" />,
                        error: <ErrorRounded fontSize="inherit" />
                    }}
                >
                    {errorMessage || successMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default AuthPage;