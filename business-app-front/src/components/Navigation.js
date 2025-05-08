import React, { useState, useEffect } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {
    AppBar,
    Toolbar,
    Button,
    Box,
    Typography,
    useTheme,
    Avatar,
    Menu,
    MenuItem,
    IconButton
} from '@mui/material';

const Navigation = () => {
    const theme = useTheme();
    const [user, setUser] = useState(null);
    const navigate = useNavigate(); // Добавляем хук навигации
    const [anchorEl, setAnchorEl] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        window.location.reload();
    };

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

                    {user && (
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
                    )}

                    {user && (
                        <Box sx={{
                            display: { xs: 'none', md: 'flex' },
                            gap: 2
                        }}>
                            <Button
                                component={Link}
                                to="/business"
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
                                Мои бизнесы
                            </Button>
                        </Box>
                    )}

                    {user && (
                        <Box sx={{
                            display: { xs: 'none', md: 'flex' },
                            gap: 2
                        }}>
                            <Button
                                component={Link}
                                to="/physical"
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
                                Физические бизнесы
                            </Button>
                        </Box>
                    )}

                    {user && (
                        <Box sx={{
                            display: { xs: 'none', md: 'flex' },
                            gap: 2
                        }}>
                            <Button
                                component={Link}
                                to="/virtual"
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
                                Виртуальные бизнесы
                            </Button>
                        </Box>
                    )}

                </Box>

                {/* Правый блок - Профиль или авторизация */}
                {user ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
                            <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                                {user?.email?.[0]?.toUpperCase()}
                            </Avatar>
                        </IconButton>
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleMenuClose}
                        >
                            <MenuItem disabled>
                                <Typography variant="body2">{user?.email}</Typography>
                            </MenuItem>
                            <MenuItem onClick={() => {
                                handleMenuClose();
                                navigate('/profile');
                            }}>
                                Профиль
                            </MenuItem>
                            <MenuItem onClick={handleLogout}>Выйти</MenuItem>
                        </Menu>
                    </Box>
                ) : (
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
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Navigation;