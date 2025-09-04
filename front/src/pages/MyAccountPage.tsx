import { Box, Typography } from '@mui/material';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
interface MyAccountPageProps {
    username: string | null;
    role: 'admin' | 'user';

    onLogout: () => void;

}

export function MyAccountPage({ role, username, onLogout }: MyAccountPageProps) {
    return (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>

            <Sidebar role={role} />
            <Box component="main" sx={{
                display: 'flex',
                justifyContent: 'center',  
                alignItems: 'center',      
                minHeight: '100vh',  
                px: 6,
                backgroundColor: 'background.default',
            }}>
                <Header setConfirmLogout={onLogout} title={role + " account"} />
                <Box sx={{
                    p: '2rem',
                    bgColor: 'white',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    width: '100%',
                    maxWidth: '400px',
                   
                }}
                >
                    <Typography variant="h4" gutterBottom>
                        My Account
                    </Typography>
                    <Typography variant="h6" sx={{ mt: 6 }}><strong>Username:</strong> {username}</Typography>
                    <Typography variant="h6" sx={{ mt: 6 }}><strong>Role:</strong> {role}</Typography>
                </Box>
            </Box>
        </Box>
    );
}
