import { Divider, Grid, InputAdornment } from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import Input from "@material-ui/core/Input";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { FastForward, Search } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import ActionTypes from "../../constants/ActionTypes";
import { isFunction } from "../../helpers/utils";
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

function MultiFilter({
  disableUsers = false,
  disableDateRange,

  onDateRangeChanged,
  onUserFilterChanged,
  onSearchFilterChanged,
  searchPlaceholder = "Search...",
  mini,
}) {
  const [DateFilterOpen, setDateFilterOpen] = useState(false);
  const [SelectedUsers, setSelectedUsers] = useState([]);

  const [Users, setUsers] = useState(!disableUsers && userFilterStore.get());

  const [DateRange, setDateRange] = useState(null);

  const anchorRef = React.useRef(null);
  const usersAnchorRef = React.useRef(null);

  const [UserMenuOpen, setUserMenuOpen] = React.useState(false);

  const classes = useStyles();
  const theme = useTheme();
  const [personName, setPersonName] = React.useState([]);

  const closeUserMenu = (evt) => {
    if (usersAnchorRef.current && usersAnchorRef.current.contains(evt.target)) {
      return;
    }
    return setUserMenuOpen(false);
  };

  const toggleUsersMenu = (evt) => {
    setUserMenuOpen(true);
  };
  const toggleDateRangeFilter = () => {
    setDateFilterOpen(!DateFilterOpen);
  };

  const onUserFilterSync = () => {
    setUsers(userFilterStore.get());
  };

  const bindListeners = () => {
    userFilterStore.addChangeListener(
      ActionTypes.UserFilter.USER_FILTER_SYNC,
      onUserFilterSync
    );

    return () => {
      userFilterStore.removeChangeListener(
        ActionTypes.UserFilter.USER_FILTER_SYNC,
        onUserFilterSync
      );
    };
  };

  useEffect(() => {
    return bindListeners();
  });

  const hasFilterForUser = (userId) => {
    return SelectedUsers.includes(userId);
  };

  const toggleUserFilter = (userId) => {
    const userIdIndex = SelectedUsers.indexOf(userId);
    const isSelected = userIdIndex !== -1;
    if (isSelected) {
      if (SelectedUsers.length === Object.keys(Users).length) {
        // If all the users are already selected
        // And the user is selecting an user
        // Then deselect all others
        handleUsersFilterChanged([userId]);
        return;
      }
      // Remove userId from selected users
      const clone = [...SelectedUsers];
      clone.splice(userIdIndex, 1);
      handleUsersFilterChanged(clone);
    } else {
      handleUsersFilterChanged([...SelectedUsers, userId]);
    }
  };

  const handleUsersFilterChanged = (selectedUsers) => {
    setSelectedUsers(selectedUsers);
    if (isFunction(onUserFilterChanged)) {
      onUserFilterChanged(selectedUsers);
    }
  };

  const onSearchChanged = (evt) => {
    isFunction(onSearchFilterChanged) && onSearchFilterChanged(evt);
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
          <DateFilter />
          <Divider orientation={"vertical"} flexItem />
          <UserFilter onUserFilterChanged={handleUsersFilterChanged} />

          <Divider orientation={"vertical"} flexItem />
          <FormControl fullWidth size="small">
            <Input
              id="standard-adornment-amount"
              size="small"
              disableUnderline
              placeholder="Search portals"
              onChange={(evt) => {
                onSearchChanged(evt.target.value);
              }}
              onKeyPress={(evt) => {
                onSearchChanged(evt.target.value);
              }}
              startAdornment={
                <InputAdornment position="start">
                  <Search />
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
