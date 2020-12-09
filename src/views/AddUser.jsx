import React from "react";
import { Divider, Paper, TextField, Typography } from "@material-ui/core";

const AddUserView = () => {
  return (
    <Paper>
      <Typography variant="h6">Add new user</Typography>
      <Divider />
      <TextField type="Username" />
    </Paper>
  );
};

export default AddUserView;
