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
import userFilterActions from "../../actions/UserFilter";
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
  Done,
} from "@material-ui/icons";
import DateRanges from "../../constants/DateRanges";
import countryFilterStore from "../../store/CountryFilter";
import ActionTypes from "../../constants/ActionTypes";
import dispatcher from "../../dispatcher";
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
      overflow: "hidden",
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
  const [Users, setUsers] = useState(userFilterStore.get());

  const [SelectedUsersUnconfirmed, setSelectedUsersUnconfirmed] = useState(
    Users ? Object.keys(Users) : []
  );

  const [SelectedUsers, setSelectedUsers] = useState(
    Users ? Object.keys(Users) : []
  );

  const [DateRange, setDateRange] = useState(null);

  const anchorRef = React.useRef(null);
  const usersAnchorRef = React.useRef(null);

  const [UserMenuOpen, setUserMenuOpen] = React.useState(false);

  const classes = useStyles();
  const theme = useTheme();

  const closeUserMenu = (confirm) => {
    // if (usersAnchorRef.current && usersAnchorRef.current.contains(evt.target)) {
    //   return;
    // }

    setTimeout(() => {
      if (confirm === true) {
        confirmUserFilter();
      } else if (confirm === false) {
        setSelectedUsersUnconfirmed(SelectedUsers);
      }
    });
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

  const UserIsSelected = (userId) => {
    return SelectedUsersUnconfirmed.includes(userId);
  };

  const selectUser = (userId) => {
    const userIdIndex = SelectedUsersUnconfirmed.indexOf(userId);
    const isSelected = userIdIndex !== -1;
    if (isSelected) {
      if (SelectedUsersUnconfirmed.length === Object.keys(Users).length) {
        // If all the users are already selected
        // And the user is selecting an user
        // Then deselect all others
        setSelectedUsersUnconfirmed([userId]);
        return;
      }
      // Remove userId from selected users
      const clone = [...SelectedUsersUnconfirmed];
      clone.splice(userIdIndex, 1);
      setSelectedUsersUnconfirmed(clone);
    } else {
      setSelectedUsersUnconfirmed([...SelectedUsersUnconfirmed, userId]);
    }
  };

  const selectAllUsers = () => {
    setSelectedUsersUnconfirmed(Object.keys(Users));
    // setTimeout(() => {
    //   setUserMenuOpen(false);
    // });
  };

  const confirmUserFilter = () => {
    setSelectedUsers(SelectedUsersUnconfirmed);
    userFilterActions.userFilterChanged(SelectedUsersUnconfirmed);

    if (isFunction(onUserFilterChanged)) {
      onUserFilterChanged(SelectedUsersUnconfirmed);
    }
  };

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        paddingLeft: theme.spacing(1),
        paddingRight: theme.spacing(1),
      }}
    >
      {Users && (
        <IconButton
          size="small"
          aria-controls="users-menu"
          aria-haspopup="true"
          onClick={toggleUsersMenu}
          ref={usersAnchorRef}
        >
          <Badge
            badgeContent={
              SelectedUsers && SelectedUsers.length ? SelectedUsers.length : ""
            }
            color="secondary"
            invisible={!SelectedUsers.length}
            variant={SelectedUsers.length && "dot"}
          >
            <PersonIcon
              style={{ color: theme.palette.text.disabled }}
              size={SelectedUsers.length ? "medium" : "small"}
            />
          </Badge>
        </IconButton>
      )}

      <Menu
        id="users-menu"
        open={UserMenuOpen}
        PaperProps={MenuProps.PaperProps}
        keepMounted
        onClose={() => closeUserMenu(false)}
        anchorEl={usersAnchorRef.current}
        style={{ paddingTop: 0 }}
        MenuListProps={{ style: { maxHeight: 500, overflow: "hidden" } }}
      >
        <div
          style={{
            maxHeight: 500,
            height: 500,
            overflowY: "hidden",
            marginTop: -8,
          }}
        >
          <div>
            <ButtonGroup variant="text" style={{ width: "100%" }}>
              <Button
                disableRipple={true}
                disableFocusRipple={true}
                disableTouchRipple={true}
                onClick={() => closeUserMenu(false)}
              >
                <Close />
              </Button>
              <Button
                style={{ width: "100%" }}
                disableRipple={true}
                onClick={selectAllUsers}
                disableFocusRipple={true}
                disableTouchRipple={true}
                startIcon={<ClearAllIcon />}
              >
                {"Select all"}
              </Button>
              <Button
                disableRipple={true}
                disableFocusRipple={true}
                disableTouchRipple={true}
                onClick={() => closeUserMenu(true)}
              >
                <Done />
              </Button>
            </ButtonGroup>
          </div>
          <Divider />

          <div style={{ overflowY: "auto", height: 310 }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              {Users &&
                Object.keys(Users).map((userId) => (
                  <MenuItem
                    alignItems="center"
                    key={userId}
                    onClick={() => {
                      selectUser(userId);
                    }}
                    value={userId}
                  >
                    <Checkbox
                      color="secondary"
                      checked={UserIsSelected(userId)}
                      size="small"
                      disableRipple
                    />
                    {Users[userId]}
                  </MenuItem>
                ))}
            </div>
          </div>
        </div>
      </Menu>
    </div>
  );
}
export default React.memo(UserFilter);
