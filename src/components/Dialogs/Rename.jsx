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
  DialogContentText,
} from "@material-ui/core";

const useStyles = makeStyles({
  avatar: {
    backgroundColor: blue[100],
    color: blue[600],
  },
  skeleton: {
    height: 64,
  },
});

export default function RenameDialog({ open, onClose, country }) {
  const [CountryNameValue, setCountryNameValue] = useState(
    country && country.name
  );
  const [Countries, setCountries] = useState(countriesStore.get());
  const classes = useStyles();
  const originalValue = country && country.name;
  const handleClose = () => {
    onClose(CountryNameValue);
  };
  const onCountriesUpdated = () => {
    setCountries(countriesStore.get());
  };
  useEffect(() => {
    countriesStore.addChangeListener(
      ActionTypes.CountryFilter.COUNTRY_FILTER_SYNC,
      onCountriesUpdated
    );

    return () => {
      countriesStore.removeChangeListener(
        ActionTypes.CountryFilter.COUNTRY_FILTER_SYNC,
        onCountriesUpdated
      );
    };
  });

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="simple-dialog-title"
      open={open}
    >
      <DialogTitle id="simple-dialog-title">
        {`Rename ${originalValue}`}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Warning: Country names are parsed literally from Job Schemas. Edit the
          name only if you believe that {originalValue} is not a standard
          country name found within the majority of these scraped schemas.
        </DialogContentText>
        <TextField
          fullWidth={true}
          placeholder={`Rename ${originalValue} to something else...`}
          defaultValue={originalValue}
          onChange={(event) => {
            setCountryNameValue(event.target.value);
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleClose} color="secondary" autoFocus>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
