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
import { CircularProgress } from "@material-ui/core";
import sessionStore from "../../store/session";
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
  formControl: {
    //margin: theme.spacing(1),
    minWidth: 160,
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

function UserFilterDropdown({ onUserFilterChanged, title }) {
  const [Users, setUsers] = useState(userFilterStore.get());

  const [SelectedUser, setSelectedUsers] = useState(sessionStore.getUser().id);

  const classes = useStyles();
  const theme = useTheme();

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

  const handleChange = (ev) => {
    setSelectedUsers(ev.target.value);
    onUserFilterChanged && onUserFilterChanged(ev.target.value);
  };

  const Options = [
    "NOT_YET_CRAWLED",
    "CRAWLED_WITHOUT_JOBS",
    "CRAWLED_WITH_JOBS",
  ];

  const render = () => {
    if (!Users) {
      return <CircularProgress />;
    }
    return (
      <FormControl variant="outlined" className={classes.formControl}>
        <InputLabel id="demo-simple-select-outlined-label">
          {title ? title : "User"}
        </InputLabel>
        <Select
          labelId="demo-simple-select-outlined-label"
          id="demo-simple-select-outlined"
          value={SelectedUser}
          onChange={handleChange}
          label={title ? title : "User"}
          required
        >
          {Object.keys(Options).map((user) => {
            return <MenuItem value={user}>{Users[user]}</MenuItem>;
          })}
        </Select>
      </FormControl>
    );
  };
  return render();
}
export default React.memo(UserFilterDropdown);
