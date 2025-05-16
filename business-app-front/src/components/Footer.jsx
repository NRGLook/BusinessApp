// src/components/Footer.jsx
import React from 'react';
import { Box, Container, Typography, Divider, useTheme } from '@mui/material';

const Footer = () => {
    const theme = useTheme();
    const founderName = 'Тиханенок Илья Александрович'; // Замените на фактическое имя основателя, если необходимо

    return (
        <Box
            component="footer" // Используем семантический тег footer
            sx={{
                py: 4,
                textAlign: 'center',
                bgcolor: theme.palette.grey[200],
                mt: 4, // Добавляем небольшой отступ сверху, чтобы отделить от контента
            }}
        >
            <Container maxWidth="lg">
                <Divider sx={{ mb: 2, borderColor: theme.palette.grey[400] }} />
                <Typography variant="body2" color="text.secondary">
                    © {new Date().getFullYear()} {founderName}. Все права защищены.
                </Typography>
            </Container>
        </Box>
    );
};

export default Footer;