// ...existing code...
// --- Replace renderContent and improve UI ---
import { Card, CardContent, Avatar, Grid, TextField, CircularProgress, Chip } from "@mui/material";
// ...existing code...

// Example professional card for ministries/events
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

const renderContent = () => {
  switch (selected) {
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
      return (
        <Box>
          <Typography variant="h3" gutterBottom fontWeight={700}>Welcome to the Member Dashboard</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            Use the sidebar to navigate through your dashboard features.
          </Typography>
        </Box>
      );
  }
};
// ...existing code...