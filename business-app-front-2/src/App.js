import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import HomePage from "./pages/HomePage/HomePage";
import LearnPage from "./pages/LearnPage/LearnPage";
import AuthPage from "./pages/AuthPage/AuthPage";
import Navigation from "./components/Navigation";
import PrivateRoute from "./components/PrivateRoute";
import axios from "./api/axios";

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router>
                <Navigation />
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/learn" element={
                        <PrivateRoute>
                            <LearnPage />
                        </PrivateRoute>
                    } />
                    <Route path="/auth" element={<AuthPage />} />
                </Routes>
            </Router>
        </ThemeProvider>
    );
}

export default App;