import { Drawer, List, ListItemButton, ListItemText, Box, IconButton, Divider } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';;

interface SidebarProps {
    role: 'user' | 'admin';
}

export function Sidebar(currentUser: SidebarProps) {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const menuItems = currentUser.role === 'admin'
        ? [
            { text: 'User Management', path: '/users' },
            { text: 'My Account', path: '/my-account' },
        ]
        : [
            { text: 'My Account', path: '/my-account' },
        ];

    return (
        <>
            <IconButton
                color="inherit"
                edge="start"
                onClick={() => setOpen(true)}
            >
                ☰
            </IconButton>
            <Drawer sx={{
                width: 240,
                flexShrink: 0,
                [`& .MuiDrawer-paper`]: { width: 240, boxSizing: 'border-box', marginTop: '64px', },

            }}
                variant="persistent"
                open={open}
                onClose={() => setOpen(false)}
                anchor="left">
                <Box sx={{ width: 240, mt: 8 }}>
                    <List>
                        {menuItems.map(item => (
                            <>
                                <ListItemButton key={item.text} onClick={() => navigate(item.path)}>
                                    <ListItemText primary={item.text} />
                                </ListItemButton>
                                <Divider />
                            </>
                        ))}
                    </List>
                </Box>
            </Drawer>
        </>
    );
}

