// src/components/Navigation.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Button, Box, Typography, useTheme } from '@mui/material';

const Navigation = () => {
    const theme = useTheme();

    return (
        <AppBar position="sticky" elevation={1} sx={{
            backgroundColor: 'background.paper',
            color: 'text.primary',
            borderBottom: `1px solid ${theme.palette.divider}`
        }}>
            <Toolbar sx={{
                justifyContent: 'space-between',
                padding: { xs: '0 16px', md: '0 32px' }
            }}>
                {/* Левый блок - Лого и основные ссылки */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Typography
                        variant="h6"
                        component={Link}
                        to="/"
                        sx={{
                            textDecoration: 'none',
                            color: 'inherit',
                            fontWeight: 700,
                            '&:hover': {
                                color: theme.palette.primary.main
                            }
                        }}
                    >
                        BusinessApp
                    </Typography>

                    <Box sx={{
                        display: { xs: 'none', md: 'flex' },
                        gap: 2
                    }}>
                        <Button
                            component={Link}
                            to="/learn"
                            sx={{
                                textTransform: 'none',
                                fontSize: '1rem',
                                fontWeight: 500,
                                '&:hover': {
                                    backgroundColor: 'transparent',
                                    color: theme.palette.primary.main
                                }
                            }}
                        >
                            Обучение
                        </Button>
                    </Box>
                </Box>

                {/* Правый блок - Авторизация */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Button
                        component={Link}
                        to="/auth"
                        variant="outlined"
                        sx={{
                            textTransform: 'none',
                            borderRadius: 50,
                            px: 3,
                            borderWidth: 2,
                            '&:hover': {
                                borderWidth: 2
                            }
                        }}
                    >
                        Войти
                    </Button>
                    <Button
                        component={Link}
                        to="/auth?mode=register"
                        variant="contained"
                        sx={{
                            textTransform: 'none',
                            borderRadius: 50,
                            px: 3,
                            boxShadow: 'none',
                            '&:hover': {
                                boxShadow: 'none'
                            }
                        }}
                    >
                        Регистрация
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navigation;