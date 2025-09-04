import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { LoginPage } from './pages/Login';
import { UsersPage } from './pages/Users';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { MyAccountPage } from './pages/MyAccountPage';

/**
 * A wrapper component to manage routing logic.
 * We need this because the useNavigate hook can only be used inside a Router component.
 */
function AppRoutes() {
  const [authToken, setAuthToken] = useState<string | null>(localStorage.getItem('authToken'));
  const [uuid, setUuid] = useState<string | null>(null);
  const [role, setRole] = useState<'admin' | 'user' | null>(null);
  const [username, setUsername] = useState<string | null>(null);
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
  const handleLoginSuccess = (token: string, role: string,uuid: string, username: string) => {
    setAuthToken(token);
    setUuid(uuid);
    setUsername(username);
    setRole(role as 'admin' | 'user');
    localStorage.setItem('authToken', token);
    navigate('/my-account');
  };

  const handleLogout = () => {
    setAuthToken(null);
    setUuid(null);
    setRole(null);
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  return (
    <ThemeProvider theme={theme}>
    <Routes>
      <Route path="/login" element={<LoginPage onLoginSuccess={handleLoginSuccess} />} />
      <Route
        path="/users"
        element={
          authToken && uuid && role === 'admin' ? (
            <UsersPage authToken={authToken} uuid={uuid} onLogout={handleLogout} />
          ) : (
            <Navigate to="/login" /> // Protect this route
          )
        }
      />
     
     <Route
          path="/my-account"
          element={
            authToken && uuid && role  ? (
              <MyAccountPage username={username} role={role} onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" />
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
