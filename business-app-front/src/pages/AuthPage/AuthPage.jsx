import React, { useState } from "react";
import axios from "../../api/axios";
import qs from "qs";
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
} from "@mui/material";

const BASE_URL = "http://localhost:8000";

export default function AuthPage() {
    const [form, setForm] = useState({
        email: "",
        password: "",
        token: "",
    });

    const [tab, setTab] = useState(0);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleTabChange = (_, newValue) => {
        setTab(newValue);
    };

    const handleSnackbarClose = () => {
        setOpenSnackbar(false);
    };

    const handleSubmit = async () => {
        setLoading(true);
        setErrorMessage("");
        setSuccessMessage("");

        try {
            let response;
            switch (tab) {
                case 0:
                    const loginData = qs.stringify({
                        grant_type: "password",
                        username: form.email,
                        password: form.password,
                    });

                    response = await axios.post(`${BASE_URL}/auth/login`, loginData, {
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded",
                        },
                    });

                    setSuccessMessage("Вход успешен!");
                    localStorage.setItem("token", response.data.access_token);

                    break;
                case 1:
                    response = await axios.post(`${BASE_URL}/auth/register`, {
                        email: form.email,
                        password: form.password,
                        is_active: true,
                        is_superuser: false,
                        is_verified: false,
                    });
                    setSuccessMessage("Регистрация успешна!");
                    break;
                case 2:
                    response = await axios.post(`${BASE_URL}/auth/forgot-password`, {
                        email: form.email,
                    });
                    setSuccessMessage("Ссылка для сброса отправлена!");
                    break;
                case 3:
                    response = await axios.post(`${BASE_URL}/auth/reset-password`, {
                        token: form.token,
                        password: form.password,
                    });
                    setSuccessMessage("Пароль успешно сброшен!");
                    break;
                case 4:
                    response = await axios.post(`${BASE_URL}/auth/verify`, {
                        token: form.token,
                    });
                    setSuccessMessage("Email успешно подтвержден!");
                    break;
                default:
                    break;
            }
        } catch (err) {
            console.error("Error:", err.response?.data || err.message);
            setErrorMessage("Произошла ошибка. Попробуйте снова.");
        } finally {
            setLoading(false);
            setOpenSnackbar(true);
        }
    };

    return (
        <Box sx={{ maxWidth: 400, mx: "auto", mt: 6, p: 3, boxShadow: 3, borderRadius: 2, bgcolor: "#fff" }}>
            <Tabs value={tab} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
                <Tab label="Вход" />
                <Tab label="Регистрация" />
                <Tab label="Забыл пароль" />
                <Tab label="Сброс" />
                <Tab label="Верификация" />
            </Tabs>

            {tab === 0 && (
                <Box mt={2}>
                    <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        type="email"
                        margin="normal"
                        onChange={handleChange}
                    />
                    <TextField
                        fullWidth
                        label="Пароль"
                        name="password"
                        type="password"
                        margin="normal"
                        onChange={handleChange}
                    />
                    <Button
                        variant="contained"
                        fullWidth
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} /> : "Войти"}
                    </Button>
                </Box>
            )}

            {tab === 1 && (
                <Box mt={2}>
                    <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        type="email"
                        margin="normal"
                        onChange={handleChange}
                    />
                    <TextField
                        fullWidth
                        label="Пароль"
                        name="password"
                        type="password"
                        margin="normal"
                        onChange={handleChange}
                    />
                    <Button
                        variant="contained"
                        fullWidth
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} /> : "Зарегистрироваться"}
                    </Button>
                </Box>
            )}

            {tab === 2 && (
                <Box mt={2}>
                    <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        type="email"
                        margin="normal"
                        onChange={handleChange}
                    />
                    <Button
                        variant="contained"
                        fullWidth
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} /> : "Отправить ссылку для сброса"}
                    </Button>
                </Box>
            )}

            {tab === 3 && (
                <Box mt={2}>
                    <TextField
                        fullWidth
                        label="Токен"
                        name="token"
                        type="text"
                        margin="normal"
                        onChange={handleChange}
                    />
                    <TextField
                        fullWidth
                        label="Новый пароль"
                        name="password"
                        type="password"
                        margin="normal"
                        onChange={handleChange}
                    />
                    <Button
                        variant="contained"
                        fullWidth
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} /> : "Сбросить пароль"}
                    </Button>
                </Box>
            )}

            {tab === 4 && (
                <Box mt={2}>
                    <TextField
                        fullWidth
                        label="Токен верификации"
                        name="token"
                        type="text"
                        margin="normal"
                        onChange={handleChange}
                    />
                    <Button
                        variant="contained"
                        fullWidth
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} /> : "Подтвердить Email"}
                    </Button>
                </Box>
            )}

            {/* Snackbar for success or error messages */}
            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
            >
                <Alert onClose={handleSnackbarClose} severity={errorMessage ? "error" : "success"}>
                    {errorMessage || successMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
}
