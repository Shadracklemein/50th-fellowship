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
  Divider
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import LogoutIcon from '@mui/icons-material/Logout';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import EventIcon from '@mui/icons-material/Event';
import GroupWorkIcon from '@mui/icons-material/GroupWork';
import PrayerIcon from '@mui/icons-material/VolunteerActivism';
import axios from "axios";

const drawerWidth = 220;

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

  // Fetch prayer requests when userInfo or selected changes
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
    { key: 'profile', label: 'My Profile', icon: <PersonIcon /> },
    { key: 'events', label: 'Church Events', icon: <EventIcon /> },
    { key: 'ministries', label: 'Ministries', icon: <GroupWorkIcon /> },
    { key: 'prayer', label: 'Prayer Requests', icon: <PrayerIcon /> },
  ];

  // Main content for each section
  const renderContent = () => {
    switch (selected) {
      case 'profile':
        return (
          <Box>
            <Typography variant="h5" gutterBottom>My Profile</Typography>
            <Typography variant="body1" color="text.secondary">View your member profile information.</Typography>
            <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate('/member-profile')}>View Profile</Button>
          </Box>
        );
      case 'events':
        return (
          <Box>
            <Typography variant="h5" gutterBottom>Church Events</Typography>
            <Typography variant="body1" color="text.secondary">View upcoming church events and activities.</Typography>
            <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate('/events')}>View Events</Button>
          </Box>
        );
      case 'ministries':
        return (
          <Box>
            <Typography variant="h5" gutterBottom>Ministry Opportunities</Typography>
            <Typography variant="body1" color="text.secondary">Explore ministry opportunities and volunteer positions.</Typography>
            <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate('/ministries')}>View Ministries</Button>
          </Box>
        );
      case 'prayer':
        return (
          <Box>
            <Typography variant="h5" gutterBottom>Prayer Requests</Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              Submit a new prayer request or view your previous requests below.
            </Typography>
            <form onSubmit={handlePrayerSubmit} style={{ marginBottom: 24 }}>
              <Box display="flex" gap={2} alignItems="center">
                <input
                  type="text"
                  value={newPrayer}
                  onChange={e => setNewPrayer(e.target.value)}
                  placeholder="Enter your prayer request..."
                  style={{ flex: 1, padding: 8, fontSize: 16 }}
                  disabled={loadingPrayer}
                />
                <Button type="submit" variant="contained" disabled={loadingPrayer}>
                  {loadingPrayer ? "Submitting..." : "Submit"}
                </Button>
              </Box>
              {prayerError && <Typography color="error" sx={{ mt: 1 }}>{prayerError}</Typography>}
              {prayerSuccess && <Typography color="primary" sx={{ mt: 1 }}>{prayerSuccess}</Typography>}
            </form>
            <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>My Prayer Requests</Typography>
            {loadingPrayer ? (
              <Typography>Loading...</Typography>
            ) : (
              <Box>
                {prayerRequests.length === 0 ? (
                  <Typography>No prayer requests yet.</Typography>
                ) : (
                  <ul style={{ paddingLeft: 16 }}>
                    {prayerRequests.map((prayer) => (
                      <li key={prayer._id} style={{ marginBottom: 8 }}>
                        <Typography variant="body2">{prayer.message}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(prayer.createdAt).toLocaleString()}
                        </Typography>
                      </li>
                    ))}
                  </ul>
                )}
              </Box>
            )}
          </Box>
        );
      default:
        return (
          <Box>
            <Typography variant="h4" gutterBottom>Welcome to the Member Dashboard</Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              This dashboard is for all members, youth, choir, and praise & worship team. Most items are read-only except those that require your intervention, such as prayer requests.
            </Typography>
            <Typography variant="body2">Use the sidebar to navigate through your dashboard features.</Typography>
          </Box>
        );
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
          <Typography variant="body2" sx={{ mr: 2 }}>
            Welcome, {userInfo.email} ({userInfo.role})
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