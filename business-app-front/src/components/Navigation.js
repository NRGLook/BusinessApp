// src/components/Navigation.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Button } from '@mui/material'; // Убедитесь, что Button импортирован

const Navigation = () => {
    return (
        <AppBar position="static">
            <Toolbar>
                <Button color="inherit" component={Link} to="/">
                    Главная
                </Button>
                <Button color="inherit" component={Link} to="/learn">
                    Обучение
                </Button>
                <Button color="inherit" component={Link} to="/auth">
                    Регистрация
                </Button>
            </Toolbar>
        </AppBar>
    );
};

export default Navigation;