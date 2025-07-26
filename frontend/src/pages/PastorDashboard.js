import React, { useEffect, useState } from "react";
import { 
  Typography, 
  Box, 
  Button, 
  Grid, 
  Card, 
  CardContent,
  AppBar,
  Toolbar,
  IconButton
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import LogoutIcon from '@mui/icons-material/Logout';
import PeopleIcon from '@mui/icons-material/People';
import EventIcon from '@mui/icons-material/Event';
import PrayerIcon from '@mui/icons-material/VolunteerActivism';
import MessageIcon from '@mui/icons-material/Message';

function PastorDashboard() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    // Get user info from localStorage
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userRole');
    const email = localStorage.getItem('userEmail');

    if (!token || role !== 'pastor') {
      navigate('/');
      return;
    }

    setUserInfo({ role, email });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    navigate('/');
  };

  if (!userInfo) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            50th Fellowship Church - Pastor Dashboard
          </Typography>
          <Typography variant="body2" sx={{ mr: 2 }}>
            Pastor: {userInfo.email}
          </Typography>
          <IconButton color="inherit" onClick={handleLogout}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box p={4}>
        <Typography variant="h4" gutterBottom>
          Pastor Dashboard
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  <PeopleIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Pastoral Care
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Manage pastoral care requests and member counseling sessions.
                </Typography>
                <Button 
                  variant="contained" 
                  sx={{ mt: 2 }}
                  onClick={() => navigate('/pastor/care')}
                >
                  Pastoral Care
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  <PrayerIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Prayer Requests
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  View and respond to prayer requests from church members.
                </Typography>
                <Button 
                  variant="contained" 
                  sx={{ mt: 2 }}
                  onClick={() => navigate('/pastor/prayer-requests')}
                >
                  Prayer Requests
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  <EventIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Sermon Planning
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Plan sermons, services, and spiritual teaching sessions.
                </Typography>
                <Button 
                  variant="contained" 
                  sx={{ mt: 2 }}
                  onClick={() => navigate('/pastor/sermons')}
                >
                  Sermon Planning
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  <MessageIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Member Communication
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Send messages and announcements to church members.
                </Typography>
                <Button 
                  variant="contained" 
                  sx={{ mt: 2 }}
                  onClick={() => navigate('/pastor/communication')}
                >
                  Communication
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default PastorDashboard; 