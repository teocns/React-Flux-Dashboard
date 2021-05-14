import { Divider, Grid, InputAdornment } from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import Input from "@material-ui/core/Input";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { FastForward, Search } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import ActionTypes from "../../constants/ActionTypes";
import { isFunction } from "../../helpers/utils";
import sessionStore from "../../store/session";
import userFilterStore from "../../store/UserFilter";
import DateFilter from "./DateFilter";
import UserFilter from "./UserFilter";
const useStyles = makeStyles((theme) => ({
  grid: {
    width: "fit-content",
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.secondary,
    flexWrap: "nowrap",
    "& > *": {
      margin: theme.spacing(0.5),
    },
  },
  select: {
    "&:before": {
      border: "none",
    },
    "&:after": {
      border: "none",
    },
    "&:focus": {
      border: "none",
      outline: "none",
    },
    "& .MuiSelect-select ": {
      backgroundColor: "transparent!important",
      border: "none",
    },
  },
  chips: {
    display: "flex",
    flexWrap: "wrap",
  },
  chip: {
    margin: 2,
  },
  noLabel: {
    marginTop: theme.spacing(3),
  },
  selectedCountriesContainer: {
    display: "inline-flex",
    maxWidth: 520,
    flexWrap: "nowrap",
    overflow: "hidden",
  },
}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 7 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

var filterTimeout = undefined;

function MultiFilter({
  disableUsers = false,
  disableDateRange,
  onDateRangeChanged,
  onUserFilterChanged,
  onSearchFilterChanged,
  searchPlaceholder = "Search...",
  dateRangeTooltip,
  mini,
}) {
  const [DateFilterOpen, setDateFilterOpen] = useState(false);
  const [SelectedUsers, setSelectedUsers] = useState([]);

  const [Users, setUsers] = useState(!disableUsers && userFilterStore.get());

  const [DateRange, setDateRange] = useState(null);

  const anchorRef = React.useRef(null);
  const usersAnchorRef = React.useRef(null);

  const classes = useStyles();
  const theme = useTheme();

  const user = sessionStore.getUser();

  const bindListeners = () => {};

  useEffect(() => {
    return bindListeners();
  });

  const handleUsersFilterChanged = (selectedUsers) => {
    setSelectedUsers(selectedUsers);
    setTimeout(() => {
      if (isFunction(onUserFilterChanged)) {
        onUserFilterChanged(selectedUsers);
      }
    });
  };

  const onSearchChanged = (evt) => {
    isFunction(onSearchFilterChanged) &&
      (() => {
        clearTimeout(filterTimeout);
        filterTimeout = setTimeout(() => {
          console.log("Setting filter");
          onSearchFilterChanged(evt);
        }, 500);
      })();
  };

  return (
    <div>
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          padding: theme.spacing(2),
        }}
      >
        <Grid container alignItems="center" className={classes.grid}>
          <DateFilter tooltip={dateRangeTooltip} />
          <Divider orientation={"vertical"} flexItem />
          {user && user.isAdmin ? (
            <React.Fragment>
              <UserFilter onUserFilterChanged={handleUsersFilterChanged} />

              <Divider orientation={"vertical"} flexItem />
            </React.Fragment>
          ) : null}

          <FormControl fullWidth size="small">
            <Input
              id="standard-adornment-amount"
              size="small"
              disableUnderline
              placeholder={searchPlaceholder}
              onChange={(evt) => {
                onSearchChanged(evt.target.value);
              }}
              onKeyPress={(evt) => {
                onSearchChanged(evt.target.value);
              }}
              startAdornment={
                <InputAdornment position="start">
                  <Search style={{ color: theme.palette.text.disabled }} />
                </InputAdornment>
              }
            />
          </FormControl>
        </Grid>
      </div>
    </div>
  );
}
export default React.memo(MultiFilter);
