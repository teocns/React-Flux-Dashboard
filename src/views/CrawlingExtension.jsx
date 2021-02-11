import React from "react";
import { Paper, Box, Typography } from "@material-ui/core";
const CrawlingExtensionView = () => {
  return (
    <div>
      <Typography variant="h6">Details & Downloads</Typography>
      <Paper variant="outlined">
        <Box p={3}>
          <Typography>Current version: BETA</Typography>
          <Typography>Download: UNAVAILABLE</Typography>
        </Box>
      </Paper>

      <Typography variant="h6" style={{ marginTop: 16 }}>
        Crawling statistics
      </Typography>

      <Paper variant="outlined">
        <Box p={3}>
          <Typography>Total links added: 0</Typography>
          <Typography>Added in the past 24 hours: 0</Typography>
          <Typography>Jobs scraped: 0</Typography>
        </Box>
      </Paper>
    </div>
  );
};

export default CrawlingExtensionView;
