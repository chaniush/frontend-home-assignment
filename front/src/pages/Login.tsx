import { useState, type FormEvent } from 'react';
import { Alert, Box, Button, Paper, TextField, Typography } from '@mui/material';

// Props for the component, including a callback for when login is successful
interface LoginPageProps {
  onLoginSuccess: (token: string, role: string, uuid: string) => void;
}

export function LoginPage({ onLoginSuccess }: LoginPageProps) {
  // State for form inputs, loading status, and error messages
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Handles the form submission
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        // If response is not OK, throw an error with the message from the backend
        throw new Error(data.message || 'Failed to log in');
      }

      // On success, call the parent component's onLoginSuccess function
      if (data.token) {
        onLoginSuccess(data.token, data.role, data.uuid);
      }

    } catch (err) {
      // Handle network errors or errors thrown from the response check
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{
      height: '100vh',
      width: '100vw',
      m: '0',
      p: '0',
      boxSizing: 'border-box',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(135deg, #2563eb, #9333ea)',
      fontFamily: 'Alef, sans-serif',
    }}>
      <Paper
        component="div"
        sx={{
          p: '2rem',
          bgColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          width: '100%',
          maxWidth: '400px',
          animation: 'popIn 0.3s ease-out',
        }}
        elevation={3}
        square={false}
      >
        <Typography
          component="h2"
          variant="h5"
          sx={{
            mb: "1.5rem",
            textAlign: "center",
            color: '#333',
          }}
        >
          Admin Login
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: "flex",
            flexDirection: "column"
          }}
        >
          <TextField
            fullWidth
            id="username"
            label="Username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            margin="normal"
            sx={{ mb: '1rem' }}
          />

          <TextField
            fullWidth
            id="password"
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            margin="normal"
            sx={{ mb: '1rem' }}
          />

          {error && (
            <Alert severity="error" sx={{
              color: '#d93025',
              bgColor: '#fbe9e7',
              border: '1px solid #ffcdd2',
              borderRadius: '4px',
              p: '0.75rem',
              mb: '1rem',
              textAlign: 'center',
            }}>
              {error}
            </Alert>
          )}

          <Button
            type="submit"
            fullWidth
            disabled={isLoading}
            sx={{
              width: '100%',
              p: '0.75rem',
              border: 'none',
              borderRadius: '4px',
              background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
              color: 'white',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'transform 0.15s ease, box-shadow 0.2s ease',
              "&:hover": { background: "linear-gradient(135deg, #1d4ed8, #1e40af)" },
              "&:disabled": { background: "#93c5fd",cursor: 'not-allowed', },
            }}
          >
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
