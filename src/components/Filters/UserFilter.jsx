import React, { useState, useRef, useEffect } from "react";
import clsx from "clsx";
import { isFunction } from "../../helpers/utils";
import {
  DateRangePicker,
  DateRange,
  DefinedRange,
} from "materialui-daterange-picker";
import ClearAllIcon from "@material-ui/icons/ClearAll";
import PersonIcon from "@material-ui/icons/Person";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import ListItemText from "@material-ui/core/ListItemText";
import Select from "@material-ui/core/Select";
import Checkbox from "@material-ui/core/Checkbox";
import Chip from "@material-ui/core/Chip";
import userFilterStore from "../../store/UserFilter";
import { Skeleton } from "@material-ui/lab";
import {
  Menu,
  Button,
  IconButton,
  ButtonGroup,
  Divider,
  Typography,
  Badge,
} from "@material-ui/core";
import {
  Close,
  Public,
  FilterList as FilterListIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  FastForward,
  Search,
} from "@material-ui/icons";
import DateRanges from "../../constants/DateRanges";
import countryFilterStore from "../../store/CountryFilter";
import ActionTypes from "../../constants/ActionTypes";
const useStyles = makeStyles((theme) => ({
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

function UserFilter({ onUserFilterChanged }) {
  const [SelectedUsers, setSelectedUsers] = useState([]);

  const [Users, setUsers] = useState(userFilterStore.get());

  const [DateRange, setDateRange] = useState(null);

  const anchorRef = React.useRef(null);
  const usersAnchorRef = React.useRef(null);

  const [UserMenuOpen, setUserMenuOpen] = React.useState(false);

  const classes = useStyles();
  const theme = useTheme();

  const closeUserMenu = (evt) => {
    if (usersAnchorRef.current && usersAnchorRef.current.contains(evt.target)) {
      return;
    }
    return setUserMenuOpen(false);
  };

  const toggleUsersMenu = (evt) => {
    setUserMenuOpen(true);
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

  const toggleUserFilter = (name) => {
    const userIdIndex = SelectedUsers.indexOf(name);
    if (userIdIndex !== -1) {
      const clone = [...SelectedUsers];
      clone.splice(userIdIndex, 1);
      handleUsersFilterChanged(clone);
    } else {
      handleUsersFilterChanged([...SelectedUsers, name]);
    }
  };

  const clearUsersFilter = () => {
    handleUsersFilterChanged([]);
    setTimeout(() => {
      setUserMenuOpen(false);
    });
  };

  const handleUsersFilterChanged = (selectedUsers) => {
    setSelectedUsers(selectedUsers);
    if (isFunction(onUserFilterChanged)) {
      onUserFilterChanged(selectedUsers);
    }
  };

  return (
    <div style={{ display: "inline-flex", alignItems: "center" }}>
      {Users && (
        <Badge
          badgeContent={
            SelectedUsers && SelectedUsers.length ? SelectedUsers.length : ""
          }
          color="secondary"
          variant="dot"
        >
          <IconButton
            size="small"
            aria-controls="users-menu"
            aria-haspopup="true"
            onClick={toggleUsersMenu}
            ref={usersAnchorRef}
          >
            <PersonIcon style={{ color: theme.palette.text.disabled }} />
          </IconButton>
        </Badge>
      )}

      <Menu
        id="users-menu"
        open={UserMenuOpen}
        PaperProps={MenuProps.PaperProps}
        keepMounted
        onClose={closeUserMenu}
        anchorEl={usersAnchorRef.current}
        style={{ paddingTop: 0 }}
      >
        <MenuItem button onClick={clearUsersFilter}>
          <Button
            disableRipple={true}
            disableFocusRipple={true}
            disableTouchRipple={true}
            variant="small"
            startIcon={<ClearAllIcon />}
          >
            Clear and show all
          </Button>
        </MenuItem>
        <Divider />

        {Users &&
          Object.keys(Users).map((userId) => (
            <MenuItem
              alignItems="center"
              key={userId}
              onClick={() => {
                toggleUserFilter(userId);
              }}
              value={userId}
            >
              <Checkbox
                color="secondary"
                checked={hasFilterForUser(userId)}
                size="small"
                disableRipple
              />
              {Users[userId]}
            </MenuItem>
          ))}
      </Menu>
    </div>
  );
}
export default React.memo(UserFilter);
