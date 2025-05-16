// Layout.js
import { useLocation } from 'react-router-dom';
import { Box } from '@mui/material';
import Footer from '../Footer'
import Navigation from '../Navigation'

function Layout({ children, user, updateUser }) {
    const location = useLocation();

    const hideFooterRoutes = ['/']; // список роутов, где футер не нужен
    const shouldShowFooter = !hideFooterRoutes.includes(location.pathname);

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
            }}
        >
            <Navigation user={user} updateUser={updateUser} />
            <Box sx={{ flexGrow: 1 }}>
                {children}
            </Box>
            {shouldShowFooter && <Footer />}
        </Box>
    );
}

export default Layout;
