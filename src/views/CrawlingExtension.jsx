import React from "react";
import { Paper, Box, Typography } from "@material-ui/core";
const CrawlingExtensionView = () => {
  return (
    <div>
      <Paper variant="outlined">
        <Box p={3}>
          <Typography>Current version: </Typography>
        </Box>
      </Paper>

      <Typography variant="h6">Statistics</Typography>

      <Typography variant="h6"></Typography>
    </div>
  );
};

export default CrawlingExtensionView;
