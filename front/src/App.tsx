import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { LoginPage } from './pages/Login';
import { UsersPage } from './pages/Users';
import { ThemeProvider, createTheme } from '@mui/material/styles';

/**
 * A wrapper component to manage routing logic.
 * We need this because the useNavigate hook can only be used inside a Router component.
 */
function AppRoutes() {
  const [authToken, setAuthToken] = useState<string | null>(localStorage.getItem('authToken'));
  const [uuid, setUuid] = useState<string | null>(null);
  const navigate = useNavigate();
  const theme = createTheme({
    components: {
      
      
      MuiDialogTitle: {
        styleOverrides: {
          root: {
            fontFamily: "'Alef', sans-serif",
            fontWeight: 600,
          },
        },
      },
     
      MuiDialogContent: {
        styleOverrides: {
          root: {
            fontFamily: "'Alef', sans-serif",
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            background: "linear-gradient(135deg, #6c757d, #495057)",
            color: "white",
            border: 'none',
            p: '0.6rem 1.2rem',
            borderRadius: '6px',
            fontFamily: "'Alef', sans-serif",
            fontSize: '1rem',
            fontWeight: 'bold',
            textTransform: 'none',
            '&:hover': {
              background: "linear-gradient(135deg, #5a6268, #343a40)",
            },
          },
        },
        defaultProps: {
          fullWidth: true, // set fullWidth by default if you want
        },
      },
    },
  });
  const handleLoginSuccess = (token: string, role: string,uuid: string) => {
    if (role !== 'admin') {
      alert('Login failed: Only admin users are allowed.');
      return;
    }
    setAuthToken(token);
    setUuid(uuid);
    localStorage.setItem('authToken', token);
    navigate('/users'); // Redirect to users page on successful login
  };

  const handleLogout = () => {
    setAuthToken(null);
    localStorage.removeItem('authToken');
    navigate('/login'); // Redirect to login page on logout
  };

  return (
    <ThemeProvider theme={theme}>
    <Routes>
      <Route path="/login" element={<LoginPage onLoginSuccess={handleLoginSuccess} />} />
      <Route
        path="/users"
        element={
          authToken && uuid ? (
            <UsersPage authToken={authToken} uuid={uuid} onLogout={handleLogout} />
          ) : (
            <Navigate to="/login" /> // Protect this route
          )
        }
      />
      {/* Default route redirects based on auth status */}
      <Route path="*" element={<Navigate to={authToken ? "/users" : "/login"} />} />
    </Routes>
    </ThemeProvider>
  );
}

// The main App component now just sets up the Router
function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
