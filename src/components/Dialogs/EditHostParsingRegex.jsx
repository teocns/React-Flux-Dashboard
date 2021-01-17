import React, { useState, useEffect } from "react";
import ActionTypes from "../../constants/ActionTypes";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Avatar from "@material-ui/core/Avatar";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import PersonIcon from "@material-ui/icons/Person";
import LanguageIcon from "@material-ui/icons/Language";
import AddIcon from "@material-ui/icons/Add";
import Typography from "@material-ui/core/Typography";
import { blue } from "@material-ui/core/colors";
import countriesStore from "../../store/CountryFilter";
import { Skeleton } from "@material-ui/lab";
import Country from "../../models/Country";
import {
  DialogActions,
  TextField,
  DialogContent,
  Box,
  DialogContentText,
} from "@material-ui/core";
import { Warning } from "@material-ui/icons";

const useStyles = makeStyles({
  avatar: {
    backgroundColor: blue[100],
    color: blue[600],
  },
  skeleton: {
    height: 64,
  },
});

export default function EditHostParsingRegexDialog({
  open,
  onClose,
  host,
  originalRegex,
}) {
  const originalValue = originalRegex;

  const [RegexInputValue, setRegexInputValue] = useState(originalValue);

  const classes = useStyles();
  const handleClose = (passValue = true) => {
    onClose(passValue ? (RegexInputValue || "").trim() : undefined);
  };

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="assign-regex-title"
      open={open}
    >
      <DialogTitle id="assign-regex-title">
        {`Edit job-link parsing regex for ${host}`}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="assign-regex-contenttext">
          Change the way the bot parses links from "{host}" to lookup for pages
          containing jobs.
          <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            style={{ marginTop: 8 }}
          >
            <Warning style={{ color: "orange", marginRight: 8 }} />
            <Typography variant="overline">Proceed with caution</Typography>
          </Box>
        </DialogContentText>
        <TextField
          fullWidth={true}
          placeholder={`Change ${originalValue} to something else...`}
          defaultValue={originalValue}
          onChange={(event) => {
            setRegexInputValue(event.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleClose();
            }
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            handleClose(false);
          }}
        >
          Cancel
        </Button>
        <Button onClick={handleClose} color="secondary" autoFocus>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
