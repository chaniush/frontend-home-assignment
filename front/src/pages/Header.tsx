import AppBar from '@mui/material/AppBar';
import MuiToolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

interface HeaderProps {
    setConfirmLogout: (value: boolean) => void;
    title: string;
  }
  export function Header({ setConfirmLogout, title }: HeaderProps,) {
    return (
      <AppBar
        position="fixed"
        elevation={2}
        sx={{
          background: 'linear-gradient(to right, #ffffff, #f8f9fa)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          zIndex: 1500,
        }}
      >
        <MuiToolbar
          sx={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0,1fr) auto',
            alignItems: 'center',
            gap: '1rem',
            p: { xs: '1rem 1rem', sm: '1rem 2rem' },
            minWidth: 0,
          }}
        >
          <Typography
            variant="h6"
            noWrap
            sx={{
              fontWeight: 600,
              color: '#2d3748',
              margin: 0,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              fontSize: { xs: '1.125rem', md: '1.5rem' },
            }}
          >
            {title?title.charAt(0).toUpperCase() + title.slice(1):"My Application"}
          </Typography>
          <Button
            variant="contained"
            disableElevation
            onClick={() => setConfirmLogout(true)}
            sx={{
              background: 'linear-gradient(135deg, #6c757d, #495057)',
              color: 'white',
              minWidth: '110px',
              textAlign: 'center',
              p: '0.5rem 1rem',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              transition: 'transform 0.15s ease, box-shadow 0.2s ease',
              boxShadow: 'none',
              '&:hover': {
                background: 'linear-gradient(135deg, #5a6268, #343a40)',
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
              },
            }}
          >
            Log Out
          </Button>
        </MuiToolbar>
      </AppBar>
    );
  }
  