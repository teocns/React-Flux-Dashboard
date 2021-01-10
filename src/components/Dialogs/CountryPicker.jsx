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

const useStyles = makeStyles({
  avatar: {
    backgroundColor: blue[100],
    color: blue[600],
  },
  skeleton: {
    height: 64,
  },
});

export default function CountryPickerDialog({ open, onClose, markAsAlias }) {
  console.log("markAsAlias ", markAsAlias);
  /**
   * @type {Country}
   */
  const countryTarget = markAsAlias;
  const [selectedValue, setSelectedValue] = React.useState(null);

  const handleClose = (value) => {
    onClose(value);
  };
  const [Countries, setCountries] = useState(countriesStore.get());
  const classes = useStyles();

  const handleListItemClick = (value) => {
    handleClose(value);
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
  const renderSkeletons = () => {
    return [...Array(10).keys()].map((index) => {
      return (
        <Skeleton className={classes.skeleton} key={"skeleton-" + index} />
      );
    });
  };
  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="simple-dialog-title"
      open={open}
    >
      <DialogTitle id="simple-dialog-title">
        Mark {countryTarget ? `"${countryTarget.name}"` : ""} as alias of...
      </DialogTitle>
      <List>
        {Countries
          ? Countries.map(({ name, countryId }) => (
              <ListItem
                button
                onClick={() => handleListItemClick(countryId)}
                key={countryId}
              >
                <ListItemAvatar>
                  <Avatar className={classes.avatar}>
                    <LanguageIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={name} />
              </ListItem>
            ))
          : renderSkeletons()}

        {/* <ListItem
            autoFocus
            button
            onClick={() => handleListItemClick("addAccount")}
          >
            <ListItemAvatar>
              <Avatar>
                <AddIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="Add account" />
          </ListItem> */}
      </List>
    </Dialog>
  );
}
