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

function MultiFilter({
  disableCountries,
  disableUsers,
  disableDateRange,
  onCountriesChanged,
  onDateRangeChanged,
  onUserFilterChanged,
  mini,
}) {
  const [DateFilterOpen, setDateFilterOpen] = useState(false);
  const [SelectedCountries, setSelectedCountries] = useState([]);
  const [SelectedUsers, setSelectedUsers] = useState([]);

  const [Countries, setCountries] = useState(
    !disableCountries && countryFilterStore.get()
  );
  const [Users, setUsers] = useState(!disableUsers && userFilterStore.get());

  const [DateRange, setDateRange] = useState(null);

  const anchorRef = React.useRef(null);
  const usersAnchorRef = React.useRef(null);
  const [CountryMenuOpen, setCountryMenuOpen] = React.useState(false);
  const [UserMenuOpen, setUserMenuOpen] = React.useState(false);

  const classes = useStyles();
  const theme = useTheme();
  const [personName, setPersonName] = React.useState([]);

  const closeCountriesMenu = (evt) => {
    if (anchorRef.current && anchorRef.current.contains(evt.target)) {
      return;
    }
    return setCountryMenuOpen(false);
  };
  const closeUserMenu = (evt) => {
    if (usersAnchorRef.current && usersAnchorRef.current.contains(evt.target)) {
      return;
    }
    return setUserMenuOpen(false);
  };
  const toggleCountriesMenu = (evt) => {
    setCountryMenuOpen(true);
  };
  const toggleUsersMenu = (evt) => {
    setUserMenuOpen(true);
  };
  const toggleDateRangeFilter = () => {
    setDateFilterOpen(!DateFilterOpen);
  };

  //   const renderSelectedCountries = () => {
  //     return SelectedCountries.map((value) => (
  //       <Chip
  //         variant="outlined"
  //         key={value}
  //         label={value}
  //         icon={<Close />}
  //         onClick={() => {
  //           removeCountry(value);
  //         }}
  //         className={classes.chip}
  //       />
  //     ));
  //   };

  //   const countriesContainerRef = useRef(null);
  //   const findElementsInViewCount = () => {
  //     const containerElement = countriesContainerRef.current;
  //     const visibleWidth = containerElement.clientWidth;
  //     // Accumulate elemnts width until we overflow
  //     let accumulatedWidth = 0;
  //     let numOfElementsInView = 0;

  //     for (const element of containerElement.childNodes) {
  //       accumulatedWidth += element.offsetWidth;
  //       if (accumulatedWidth >= visibleWidth) {
  //         break;
  //       }
  //       numOfElementsInView++;
  //     }

  //     return numOfElementsInView;
  //   };
  //   const hideNonVisibleChips = () => {
  //     const numOfVisibleElements = findElementsInViewCount();
  //     const containerElement = countriesContainerRef.current;
  //     let childrenLen = containerElement.children.length;
  //     console.log("skipping", numOfVisibleElements, "vs ", childrenLen);
  //     let gotTruncated = false;
  //     while (containerElement.children.length > numOfVisibleElements) {
  //       gotTruncated = true;
  //       containerElement.removeChild(
  //         containerElement.children[numOfVisibleElements]
  //       );
  //     }
  //   };

  const onCountryFilterSync = () => {
    setCountries(countryFilterStore.get());
  };
  const onUserFilterSync = () => {
    setUsers(userFilterStore.get());
  };

  const bindListeners = () => {
    countryFilterStore.addChangeListener(
      ActionTypes.CountryFilter.COUNTRY_FILTER_SYNC,
      onCountryFilterSync
    );
    userFilterStore.addChangeListener(
      ActionTypes.UserFilter.USER_FILTER_SYNC,
      onUserFilterSync
    );

    return () => {
      countryFilterStore.removeChangeListener(
        ActionTypes.CountryFilter.COUNTRY_FILTER_SYNC,
        onCountryFilterSync
      );
      userFilterStore.removeChangeListener(
        ActionTypes.UserFilter.USER_FILTER_SYNC,
        onUserFilterSync
      );
    };
  };

  useEffect(() => {
    return bindListeners();
  });
  const hasFilterForCountry = (country) => {
    return SelectedCountries.includes(country);
  };
  const hasFilterForUser = (userId) => {
    return SelectedUsers.includes(userId);
  };
  const toggleCountry = (name) => {
    const countryIndex = SelectedCountries.indexOf(name);
    if (countryIndex !== -1) {
      const clone = [...SelectedCountries];
      clone.splice(countryIndex, 1);
      handleCountryFilterChanged(clone);
    } else {
      handleCountryFilterChanged([...SelectedCountries, name]);
    }
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

  const clearCountriesFilter = () => {
    handleCountryFilterChanged([]);
    setTimeout(() => {
      setCountryMenuOpen(false);
    });
  };
  const clearUsersFilter = () => {
    handleUsersFilterChanged([]);
    setTimeout(() => {
      setUserMenuOpen(false);
    });
  };
  const handleChangeDateRange = (dateRange) => {
    if (!dateRange.startDate && !dateRange.endDate) {
      setDateRange(null);
    } else {
      console.log(dateRange);
      setDateRange(dateRange);
    }

    if (isFunction(onDateRangeChanged)) {
      onDateRangeChanged(dateRange);
    }
  };

  const handleCountryFilterChanged = (selectedCountries) => {
    setSelectedCountries(selectedCountries);
    if (isFunction(onCountriesChanged)) {
      onCountriesChanged(selectedCountries);
    }
  };
  const handleUsersFilterChanged = (selectedUsers) => {
    setSelectedUsers(selectedUsers);
    if (isFunction(onUserFilterChanged)) {
      onUserFilterChanged(selectedUsers);
    }
  };

  const renderFilteringDateValue = () => {
    const def = "Filter by date";
    if (DateRange) {
      const { startDate, endDate, label } = DateRange;

      if (label) {
        return label;
      }
      let _startDateText = "";
      if (startDate) {
        _startDateText = new Intl.DateTimeFormat("en").format(startDate);
      }
      let _endDateText = "";
      if (endDate) {
        _endDateText = new Intl.DateTimeFormat("en").format(endDate);
      }
      return (
        <React.Fragment>
          {_startDateText}
          {_endDateText && (
            <FastForward
              style={{
                width: 14,
                height: 14,
                color: theme.palette.text.disabled,
                marginLeft: 4,
                marginRight: 4,
              }}
            />
          )}
          {_endDateText}
        </React.Fragment>
      );
    }

    return def;
  };

  const renderUserButton = () => {};
  return (
    <div style={{ display: "inline-flex", alignItems: "center" }}>
      <div style={{ postiion: "relative" }}>
        <div style={{ position: "fixed", zIndex: 129831298319 }}>
          <DateRangePicker
            open={DateFilterOpen}
            definedRanges={DateRanges}
            toggle={toggleDateRangeFilter}
            onChange={handleChangeDateRange}
          />
        </div>
      </div>
      <ButtonGroup
        variant={!mini ? "outlined" : "text"}
        // style={{ marginLeft: theme.spacing(1) }}
      >
        <Button
          startIcon={
            !mini && (
              <FilterListIcon style={{ color: theme.palette.text.disabled }} />
            )
          }
          endIcon={!mini && <KeyboardArrowDownIcon fontSize="small" />}
          onClick={toggleDateRangeFilter}
        >
          {!mini ? (
            renderFilteringDateValue()
          ) : (
            <FilterListIcon style={{ color: theme.palette.text.disabled }} />
          )}
        </Button>

        {!disableUsers &&
          (Users ? (
            <Button
              aria-controls="users-menu"
              aria-haspopup="true"
              onClick={toggleUsersMenu}
              ref={usersAnchorRef}
              startIcon={
                !mini && (
                  <PersonIcon
                    style={{ color: theme.palette.text.disabled }}
                    fontSize="small"
                  />
                )
              }
              endIcon={!mini && <Search fontSize="small" />}
            >
              {!mini ? (
                SelectedUsers.length > 0 ? (
                  `Within ${SelectedUsers.length} users`
                ) : (
                  "Users"
                )
              ) : (
                <PersonIcon
                  style={{ color: theme.palette.text.disabled }}
                  fontSize="small"
                />
              )}
            </Button>
          ) : (
            <Button variant="outlined">
              <Skeleton
                variant="rect"
                style={{ padding: 4, width: 124 }}
                animation="wave"
              />
            </Button>
          ))}
      </ButtonGroup>

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

      <Menu
        id="countries-menu"
        open={CountryMenuOpen}
        PaperProps={MenuProps.PaperProps}
        keepMounted
        onClose={closeCountriesMenu}
        anchorEl={anchorRef.current}
        style={{ paddingTop: 0 }}
      >
        <MenuItem
          button
          onClick={clearCountriesFilter}
          // disabled={SelectedCountries.length < 1}
        >
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

        {Array.isArray(Countries) &&
          Countries.map((country) => (
            <MenuItem
              alignItems="center"
              key={country.countryId}
              onClick={() => {
                toggleCountry(country.countryId);
              }}
              value={country.countryId}
            >
              <Checkbox
                color="secondary"
                checked={hasFilterForCountry(country.countryId)}
                size="small"
                disableRipple
              />
              {country.name}
            </MenuItem>
          ))}
      </Menu>
    </div>
  );
}
export default React.memo(MultiFilter);
