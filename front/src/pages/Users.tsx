import { useState, useEffect, type FormEvent } from 'react';
import Container from '@mui/material/Container';
import { Header } from './Header';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { Alert, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, MenuItem, Table, TableBody, TableCell, TableHead, TableRow, TextField } from '@mui/material';
import { Sidebar } from './Sidebar';

// The User type definition
interface User {
  uuid: string;
  username: string;
  role: 'user' | 'admin';
}

interface UsersPageProps {
  authToken: string;
  uuid: string;
  onLogout: () => void;
}

// Main component for the entire page
export function UsersPage({ authToken, uuid, onLogout }: UsersPageProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [currentUser, setCurrentUser] = useState<User>({ uuid: '', username: '', role: 'user' }); // State to hold the current user details

  // New state for toast-style notifications
  const [notification, setNotification] = useState<string | null>(null);

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/users', {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch users. You may not have permission.');
      }
      const data: User[] = await response.json();
      // Find and set the current user based on the provided uuid
      const current = data.find(user => user.uuid === uuid) || { uuid: '', username: '', role: 'user' };
      setCurrentUser(current);
      setUsers(data);
    } catch (err) {
      // Use the main error state for critical fetch failures
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [authToken]);

  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      const response = await fetch(`/api/users/${userToDelete.uuid}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete user.');
      }

      setUserToDelete(null); // Close the confirmation modal
      fetchUsers(); // Refresh the user list

    } catch (err) {
      // For non-critical errors, show a notification instead of replacing the page
      setNotification((err as Error).message);
      setUserToDelete(null); // Close modal on error
    }
  };

  return (
    <Container sx={{
      p: '100px 2rem 2rem 2rem',
      maxWidth: '1200px',
      margin: '0 auto',
      fontFamily: 'Alef, sans-serif',
    }}>
      {/* Render the notification if one exists */}
      {notification && <Notification message={notification} onClose={() => setNotification(null)} />}
      <Header setConfirmLogout={setConfirmLogout} title='Admin Management'/>
      <Sidebar role={currentUser.role}/>

      <Toolbar onOpenCreateModal={() => setIsModalOpen(true)} />

      {isLoading &&
        <Box sx={{ display: "flex", justifyContent: "center", my: '2' }}>
          <CircularProgress size={24} />
          <Typography variant="body1" sx={{ ml: 1 }}>
            Loading users...
          </Typography>
        </Box>
      }
      {/* The main error message is only for critical load failures */}
      {error &&
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>}

      {/* The table is no longer hidden by non-critical errors */}
      {!isLoading && !error && (
        <UserTable
          users={users}
          currentUser={currentUser}
          onDeleteClick={(user) => setUserToDelete(user)}
        />
      )}

      {isModalOpen && (
        <CreateUserModal
          authToken={authToken}
          onClose={() => setIsModalOpen(false)}
          onUserCreated={(newUser: User) => {
            setIsModalOpen(false);
            setUsers(prev => [...prev, newUser]);
          }}
        />
      )}

      {userToDelete && (
        <ConfirmDeleteModal
          user={userToDelete}
          onConfirm={handleDeleteUser}
          onCancel={() => setUserToDelete(null)}
        />
      )}
      {confirmLogout && (
        <LogoutDialog
        confirmLogout={confirmLogout}
        setConfirmLogout={setConfirmLogout}
        onLogout={onLogout}
      />

      )}
    </Container>
  );
}

interface LogoutDialogProps {
  confirmLogout: boolean;
  setConfirmLogout: (value: boolean) => void;
  onLogout: () => void;
}

function LogoutDialog({ confirmLogout, setConfirmLogout, onLogout }: LogoutDialogProps) {
  return <Dialog
    open={confirmLogout}
    onClose={() => setConfirmLogout(false)}
    fullWidth
    slotProps={{
      paper: {
        sx: {
          borderRadius: "14px",
          p: 2,
        },
      },
    }}
  >
    <DialogTitle sx={{
      textAlign: "center"
    }}>
      confirm logout
    </DialogTitle>
    <DialogContent>
      <DialogContentText sx={{
        color: 'text.primary'
      }}>
        Are you sure you want to log out?
      </DialogContentText>
    </DialogContent>
    <DialogActions
      sx={{
        mt: '1.5rem',
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '0.6rem',
      }}
    >

      <Button onClick={() => setConfirmLogout(false)}>Cancel</Button>
      <Button onClick={onLogout}>
        Log out
      </Button>
    </DialogActions>
  </Dialog>;
}

// --- Helper Components ---

// Notification component
function Notification({ message, onClose }: { message: string; onClose: () => void; }) {
  // Automatically close the notification after 5 seconds
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <Box
      sx={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        p: '1rem 1.5rem',
        borderRadius: '10px',
        boxShadow: '0 6px 16px rgba(0, 0, 0, 0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        minWidth: '300px',
        maxWidth: '450px',
        zIndex: 1500,
        animation: 'slideIn 0.3s ease-out',
        background: 'linear-gradient(135deg, #fef2f2, #fee2e2)',
        borderLeft: '6px solid #dc2626',
        color: '#991b1b',
      }}
    >
      <Typography
        component="span"
        sx={{
          flex: 1,
          margin: 0,
          p: '0.5rem 0',
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {message}
      </Typography>

      <IconButton
        onClick={onClose}
        sx={{
          color: "inherit",
          ml: "0.5rem",
          opacity: 0.7,
          "&:hover": {
            opacity: 1,
          },
        }}
      >
        &times;
      </IconButton>
    </Box>
  );
}

// Toolbar with the "Create User" button
function Toolbar({ onOpenCreateModal }: { onOpenCreateModal: () => void }) {
  return (
    <Box
      sx={{
        margin: "2rem 0 1.5rem 0",
        textAlign: "right",
      }}
    >
      <Button
        onClick={onOpenCreateModal}
        sx={{
          background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
          transition: "transform 0.15s ease, box-shadow 0.2s ease",
          "&:hover": {
            background: "linear-gradient(135deg, #1d4ed8, #1e40af)",
            transform: "translateY(-2px)",
            boxShadow: "0 4px 10px rgba(37, 99, 235, 0.4)",
          },
        }}
      >
        Create New User
      </Button>
    </Box>
  );
}

// Table to display users
function UserTable({ users, currentUser, onDeleteClick }: { users: User[]; currentUser: User, onDeleteClick: (user: User) => void; }) {
  return (
    <Table
      sx={{
        width: '100%',
        borderCollapse: 'collapse',
        overflow: 'hidden',
        borderRadius: '8px',
        boxShadow: '0 4px 14px rgba(0, 0, 0, 0.08)',
        bgColor: 'white',

        "& th": {
          p: '14px 18px',
          borderBottom: '1px solid #e5e7eb',
          textAlign: 'left',
          verticalAlign: 'middle',
          bgColor: '#f9fafb',
          fontWeight: 600,
          color: '#374151',
        },

        "& td": {
          p: '14px 18px',
          borderBottom: '1px solid #e5e7eb',
          textAlign: 'left',
          verticalAlign: 'middle',
        },

        "& tbody tr:hover": {
          bgColor: '#f1f5f9',
          transition: 'background-color 0.2s',
        },
      }}
    >
      <TableHead>
        <TableRow>
          <TableCell>UUID</TableCell>
          <TableCell>Username</TableCell>
          <TableCell>Role</TableCell>
          <TableCell align="right">Actions</TableCell>
        </TableRow>
      </TableHead>

      <TableBody>
        {users.map((user) => (
          <TableRow key={user.uuid}>
            <TableCell>{user.uuid}</TableCell>
            <TableCell>{user.username}</TableCell>
            <TableCell>{user.role}</TableCell>
            {
              user.uuid !== currentUser.uuid &&
              (
                <TableCell align="right">
                  <Button
                    variant="contained"
                    onClick={() => onDeleteClick(user)}
                    sx={{
                      background: "linear-gradient(135deg, #dc2626, #b91c1c)",
                      p: '6px 12px',
                      fontSize: '0.9rem',
                      transition: ' transform 0.15s ease, box-shadow 0.2s ease',
                      "&:hover": {
                        background: 'linear-gradient(135deg, #c82333, #96242e)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 10px rgba(220, 53, 69, 0.4)',
                      },
                    }}
                  >
                    Delete
                  </Button>
                </TableCell>
              )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

// Modal for the user creation form
interface CreateUserModalProps {
  authToken: string;
  onClose: () => void;
  onUserCreated: (newUser: User) => void;
}

function CreateUserModal({ authToken, onClose, onUserCreated }: CreateUserModalProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'user' | 'admin'>('user');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({ username, password, role }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create user.');
      }
      onUserCreated(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open
      onClose={onClose}
      slotProps={{
        backdrop: {
          sx: {
            bgColor: 'rgba(15, 23, 42, 0.55)',
          },
        },
        paper: {
          sx: {
            borderRadius: '12px',
            p: '26px',
            minWidth: '500px',
          },
        },
      }}
    >
      <DialogTitle sx={{ fontSize: "1.25rem", fontWeight: 600 }}>
        Create New User
      </DialogTitle>

      <Box component="form" onSubmit={handleSubmit}
        sx={{
          bgColor: 'white',
          borderRadius: '12px',
          width: '100%',
          animation: 'popIn 0.25s ease-out',
        }}
      >
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            id="new-username"
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            fullWidth
          />

          <TextField
            id="new-password"
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
          />

          <TextField
            id="new-role"
            label="Role"
            value={role}
            onChange={(e) => setRole(e.target.value as "user" | "admin")}
            select
            fullWidth
          >
            <MenuItem value="user">User</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
          </TextField>

          {error && (
            <Typography
              sx={{
                color: "#b91c1c",
                bgColor: "#fef2f2",
                border: "1px solid #fecaca",
                borderRadius: "6px",
                p: 1.2,
                textAlign: "center",
                fontWeight: 500,
              }}
            >
              {error}
            </Typography>
          )}
        </DialogContent>

        <DialogActions sx={{ mt: 2, display: "flex", gap: 1 }}>
          <Button
            onClick={onClose}
            sx={{
              background: "linear-gradient(135deg, #6c757d, #495057)",
              color: "white",
              px: 2,
              py: 1,
              borderRadius: "6px",
              "&:hover": {
                background: "linear-gradient(135deg, #5a6268, #343a40)",
              },
            }}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            disabled={isSubmitting}
            sx={{
              background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
              color: "white",
              px: 2,
              py: 1,
              borderRadius: "6px",
              "&:hover:not(:disabled)": {
                background: "linear-gradient(135deg, #1d4ed8, #1e40af)",
                transform: "translateY(-2px)",
                boxShadow: "0 4px 12px rgba(37, 99, 235, 0.4)",
              },
            }}
          >
            {isSubmitting ? "Creating..." : "Create User"}
          </Button>
        </DialogActions>
      </Box>
    </Dialog >
  );
}

// Component for confirming deletion
function ConfirmDeleteModal({ user, onConfirm, onCancel }: { user: User; onConfirm: () => void; onCancel: () => void; }) {
  return (
    <Dialog
      open
      onClose={onCancel}
      slotProps={{
        backdrop: {
          sx: {
            bgColor: "rgba(15, 23, 42, 0.55)",
          },
        },
        paper: {
          sx: {
            borderRadius: "12px",
            p: "24px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
            minWidth: "400px",
          },
        },
      }}
    >
      <DialogTitle >Confirm Deletion</DialogTitle>
      <DialogContent>
        <Typography>
          Are you sure you want to delete the user "<strong>{user.username}</strong>"?
          This action cannot be undone.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ gap: 1, p: "16px 24px" }}>
        <Button
          onClick={onCancel}
          variant="outlined"
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          sx={{
            background: "linear-gradient(135deg, #dc2626, #b91c1c)",
            "&:hover": {
              background: "linear-gradient(135deg, #c82333, #96242e)",
              boxShadow: "0 4px 10px rgba(220, 53, 69, 0.4)",
            },
          }}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
