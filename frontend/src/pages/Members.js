import React from "react";
import { Typography, Box } from "@mui/material";

function Members() {
  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Members
      </Typography>
      <Typography>
        Welcome! This is where you’ll see the list of church members.
      </Typography>
    </Box>
  );
}

export default Members;