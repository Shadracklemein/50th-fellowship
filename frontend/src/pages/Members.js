import React, { useEffect, useState } from "react";
import {
  Typography,
  Box,
  Button,
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CssBaseline,
  Divider,
  Card,
  CardContent,
  Grid,
  TextField,
  CircularProgress,
  Chip
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import LogoutIcon from '@mui/icons-material/Logout';
import DashboardIcon from '@mui/icons-material/Dashboard';
import EventIcon from '@mui/icons-material/Event';
import GroupWorkIcon from '@mui/icons-material/GroupWork';
import PrayerIcon from '@mui/icons-material/VolunteerActivism';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import axios from "axios";

const drawerWidth = 220;

const ProfessionalList = ({ items, type }) => (
  <Grid container spacing={2}>
    {items.map((item, idx) => (
      <Grid item xs={12} sm={6} md={4} key={idx}>
        <Card elevation={2} sx={{ borderRadius: 2 }}>
          <CardContent>
            <Typography variant="h6">{item.name}</Typography>
            {item.description && (
              <Typography variant="body2" color="text.secondary">{item.description}</Typography>
            )}
            {type === "event" && item.date && (
              <Chip label={new Date(item.date).toLocaleDateString()} color="primary" sx={{ mt: 1 }} />
            )}
          </CardContent>
        </Card>
      </Grid>
    ))}
  </Grid>
);

function Members() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [selected, setSelected] = useState('dashboard');
  const [prayerRequests, setPrayerRequests] = useState([]);
  const [newPrayer, setNewPrayer] = useState("");
  const [loadingPrayer, setLoadingPrayer] = useState(false);
  const [prayerError, setPrayerError] = useState("");
  const [prayerSuccess, setPrayerSuccess] = useState("");

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userRole');
    const email = localStorage.getItem('userEmail');
    if (!token) {
      navigate('/');
      return;
    }
    setUserInfo({ role, email });
  }, [navigate]);

  useEffect(() => {
    if (userInfo && selected === 'prayer') {
      fetchPrayerRequests();
    }
    // eslint-disable-next-line
  }, [userInfo, selected]);

  const fetchPrayerRequests = async () => {
    setLoadingPrayer(true);
    setPrayerError("");
    try {
      const res = await axios.get(`${API_URL}/api/prayer-requests`, {
        params: { email: userInfo.email },
      });
      setPrayerRequests(res.data);
    } catch (err) {
      setPrayerError("Failed to load prayer requests.");
    } finally {
      setLoadingPrayer(false);
    }
  };

  const handlePrayerSubmit = async (e) => {
    e.preventDefault();
    setPrayerError("");
    setPrayerSuccess("");
    if (!newPrayer.trim()) {
      setPrayerError("Prayer request cannot be empty.");
      return;
    }
    setLoadingPrayer(true);
    try {
      await axios.post(`${API_URL}/api/prayer-requests`, {
        email: userInfo.email,
        message: newPrayer.trim(),
      });
      setPrayerSuccess("Prayer request submitted!");
      setNewPrayer("");
      fetchPrayerRequests();
    } catch (err) {
      setPrayerError("Failed to submit prayer request.");
    } finally {
      setLoadingPrayer(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    navigate('/');
  };

  if (!userInfo) {
    return <Typography>Loading...</Typography>;
  }

  // Sidebar navigation items
  const navItems = [
    { key: 'dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
    { key: 'ministries', label: 'Ministries', icon: <GroupWorkIcon /> },
    { key: 'events', label: 'Church Events', icon: <EventIcon /> },
    { key: 'prayer', label: 'Prayer Requests', icon: <PrayerIcon /> },
  ];

  // Mocked data for ministries and events (replace with API later)
  const ministries = [
    { name: "Youth Ministry", description: "Empowering the next generation." },
    { name: "Music Ministry", description: "Leading worship and praise." }
  ];
  const events = [
    { name: "Annual Retreat", description: "A time for spiritual renewal.", date: "2025-08-15" },
    { name: "Community Outreach", description: "Serving our neighborhood.", date: "2025-09-10" }
  ];

  const renderContent = () => {
    switch (selected) {
      case 'dashboard':
        return (
          <Box>
            <Typography variant="h3" gutterBottom fontWeight={700}>Welcome to the Member Dashboard</Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              Use the sidebar to navigate through your dashboard features.
            </Typography>
          </Box>
        );
      case 'ministries':
        return (
          <Box>
            <Typography variant="h4" gutterBottom fontWeight={700}>Ministries</Typography>
            {ministries.length === 0 ? (
              <Typography color="text.secondary">No ministries available.</Typography>
            ) : (
              <ProfessionalList items={ministries} type="ministry" />
            )}
          </Box>
        );
      case 'events':
        return (
          <Box>
            <Typography variant="h4" gutterBottom fontWeight={700}>Church Events</Typography>
            {events.length === 0 ? (
              <Typography color="text.secondary">No church events available.</Typography>
            ) : (
              <ProfessionalList items={events} type="event" />
            )}
          </Box>
        );
      case 'prayer':
        return (
          <Box>
            <Typography variant="h4" gutterBottom fontWeight={700}>Prayer Requests</Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              Submit a new prayer request or view your previous requests below.
            </Typography>
            <form onSubmit={handlePrayerSubmit} style={{ marginBottom: 24 }}>
              <Box display="flex" gap={2} alignItems="center">
                <TextField
                  fullWidth
                  variant="outlined"
                  value={newPrayer}
                  onChange={e => setNewPrayer(e.target.value)}
                  placeholder="Enter your prayer request..."
                  disabled={loadingPrayer}
                  size="small"
                />
                <Button type="submit" variant="contained" disabled={loadingPrayer}>
                  {loadingPrayer ? <CircularProgress size={20} /> : "Submit"}
                </Button>
              </Box>
              {prayerError && <Typography color="error" sx={{ mt: 1 }}>{prayerError}</Typography>}
              {prayerSuccess && <Typography color="primary" sx={{ mt: 1 }}>{prayerSuccess}</Typography>}
            </form>
            <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>My Prayer Requests</Typography>
            {loadingPrayer ? (
              <CircularProgress />
            ) : (
              <Grid container spacing={2}>
                {prayerRequests.length === 0 ? (
                  <Typography color="text.secondary">No prayer requests yet.</Typography>
                ) : (
                  prayerRequests.map((prayer) => (
                    <Grid item xs={12} sm={6} md={4} key={prayer._id}>
                      <Card elevation={1} sx={{ borderRadius: 2 }}>
                        <CardContent>
                          <Typography variant="body1">{prayer.message}</Typography>
                          <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                            Status: <Chip label={prayer.status ? prayer.status : 'pending'} size="small" color={prayer.status === 'answered' ? 'success' : 'warning'} /> <br />
                            {new Date(prayer.createdAt).toLocaleString()}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))
                )}
              </Grid>
            )}
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            50th Fellowship Church - Member Dashboard
          </Typography>
          <IconButton color="inherit" sx={{ ml: 2 }} aria-label="Profile" title="My Profile" onClick={() => navigate('/member-profile')}>
            <AccountCircleIcon />
          </IconButton>
          <Typography variant="body2" sx={{ ml: 2, mr: 2 }}>
            {userInfo.email} ({userInfo.role})
          </Typography>
          <IconButton color="inherit" onClick={handleLogout} aria-label="Logout" title="Logout">
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box', WebkitUserSelect: 'none', userSelect: 'none', width: '-webkit-fill-available' },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {navItems.map((item) => (
              <ListItem button key={item.key} selected={selected === item.key} onClick={() => setSelected(item.key)}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItem>
            ))}
          </List>
          <Divider />
          <List>
            <ListItem button onClick={handleLogout} aria-label="Logout" title="Logout">
              <ListItemIcon><LogoutIcon /></ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItem>
          </List>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 4, ml: `${drawerWidth}px` }}>
        <Toolbar />
        {renderContent()}
      </Box>
    </Box>
  );
}

export default Members;