import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { LoginPage } from './pages/Login';
import { UsersPage } from './pages/Users';

/**
 * A wrapper component to manage routing logic.
 * We need this because the useNavigate hook can only be used inside a Router component.
 */
function AppRoutes() {
  const [authToken, setAuthToken] = useState<string | null>(localStorage.getItem('authToken'));
  const [uuid, setUuid] = useState<string | null>(null);
  const navigate = useNavigate();

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
