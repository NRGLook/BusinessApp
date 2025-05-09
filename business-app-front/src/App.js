import { useEffect, useState } from 'react';
import './styles/site.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage/HomePage';
import AuthPage from './pages/AuthPage/AuthPage';
import PrivateRoute from "./components/PrivateRoute";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import LearnPage from "./pages/LearnPage/LearnPage";
import MarketPlace from "./pages/MarketPlace/MarketPlace";
import BusinessPage from "./pages/BusinessPage/BusinessPage";
import BusinessDetailPage from "./pages/BusinessDetailPage/BusinessDetailPage";
import PhysicalBusinessPage from "./pages/BusinessPage/PhysicalBusinessPage";
import VirtualBusinessPage from "./pages/BusinessPage/VirtualBusinessPage";
import BusinessCreatePage from "./pages/BusinessCreatePage/BusinessCreatePage";
import BusinessSettingsCreatePage from "./pages/BusinessSettingsCreatePage/BusinessSettingsCreatePage";
import StartBusinessPage from "./pages/StartBusinessPage/StartBusinessPage";

// Создаем кастомную тему
export const theme = createTheme({
    palette: {
        primary: {
            main: '#008000', // Основной цвет
        },
        secondary: {
            main: '#dc004e', // Вторичный цвет
        },
        background: {
            default: '#f5f5f5',
            paper: '#ffffff',
        },
        text: {
            primary: '#212121',
            secondary: '#757575',
        },
    },
    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    },
});

function App() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const updateUser = (userData) => {
        if (userData) {
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
        } else {
            localStorage.removeItem('user');
            setUser(null);
        }
    };

    return (
        <ThemeProvider theme={theme}> {/* Оборачиваем все в ThemeProvider */}
            <Router>
                <Navigation user={user} updateUser={updateUser} />
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/learn" element={
                        <PrivateRoute>
                            <LearnPage />
                        </PrivateRoute>
                    } />
                    <Route path="/start" element={
                        <PrivateRoute>
                            <StartBusinessPage />
                        </PrivateRoute>
                    } />
                    <Route path="/business" element={
                        <PrivateRoute>
                            <BusinessPage />
                        </PrivateRoute>
                    } />
                    <Route path="/business/:id" element={
                        <PrivateRoute>
                            <BusinessDetailPage />
                        </PrivateRoute>
                    } />
                    <Route path="/business/create" element={
                        <PrivateRoute>
                            <BusinessCreatePage />
                        </PrivateRoute>
                    } />
                    <Route path="/business/:id/settings/create" element={
                        <PrivateRoute>
                            <BusinessSettingsCreatePage />
                        </PrivateRoute>
                    } />
                    <Route path="/profile" element={
                        <PrivateRoute>
                            <ProfilePage />
                        </PrivateRoute>
                    } />
                    <Route path="/physical" element={
                        <PrivateRoute>
                            <PhysicalBusinessPage />
                        </PrivateRoute>
                    } />
                    <Route path="/virtual" element={
                        <PrivateRoute>
                            <VirtualBusinessPage />
                        </PrivateRoute>
                    } />
                    <Route path="/crypto" element={
                        <PrivateRoute>
                            <MarketPlace />
                        </PrivateRoute>
                    } />
                    <Route path="/auth" element={<AuthPage updateUser={updateUser} />} />
                </Routes>
            </Router>
        </ThemeProvider>
    );
}

export default App;