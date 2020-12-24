import React, { useState, useRef, useEffect } from "react";
import clsx from "clsx";
import { isFunction } from "../../helpers/utils";
import {
  DateRangePicker,
  DateRange,
  DefinedRange,
} from "materialui-daterange-picker";
import ClearAllIcon from "@material-ui/icons/ClearAll";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import ListItemText from "@material-ui/core/ListItemText";
import Select from "@material-ui/core/Select";
import Checkbox from "@material-ui/core/Checkbox";
import Chip from "@material-ui/core/Chip";
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
} from "@material-ui/icons";
import DateRanges from "../../constants/DateRanges";
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

function DateCountryFilter({
  Countries,
  onCountriesChanged,
  onDateRangeChanged,
}) {
  const [DateFilterOpen, setDateFilterOpen] = useState(false);
  const [SelectedCountries, setSelectedCountries] = useState([]);

  const [DateRange, setDateRange] = useState(null);
  const anchorRef = React.useRef(null);
  const [MenuOpen, setMenuOpen] = React.useState(false);

  const classes = useStyles();
  const theme = useTheme();
  const [personName, setPersonName] = React.useState([]);

  const closeMenu = (evt) => {
    if (anchorRef.current && anchorRef.current.contains(evt.target)) {
      return;
    }
    return setMenuOpen(false);
  };
  const toggleMenu = (evt) => {
    setMenuOpen(true);
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
  const countryIsSelected = (country) => {
    return SelectedCountries.includes(country);
  };
  const toggleCountry = (name) => {
    const countryIndex = SelectedCountries.indexOf(name);
    if (countryIndex !== -1) {
      const clone = [...SelectedCountries];
      clone.splice(countryIndex, 1);
      handleCountriesChanged(clone);
    } else {
      handleCountriesChanged([...SelectedCountries, name]);
    }
  };

  const clearCountries = () => {
    handleCountriesChanged([]);
    setTimeout(() => {
      setMenuOpen(false);
    });
  };
  const handleChangeDateRange = (dateRange) => {
    if (!dateRange.startDate && !dateRange.endDate) {
      setDateRange(null);
    } else {
      setDateRange(dateRange);
    }

    if (isFunction(onDateRangeChanged)) {
      onDateRangeChanged(dateRange);
    }
  };

  const handleCountriesChanged = (selectedCountries) => {
    setSelectedCountries(selectedCountries);
    if (isFunction(onCountriesChanged)) {
      onCountriesChanged(selectedCountries);
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
      <ButtonGroup variant="outlined" style={{ marginLeft: theme.spacing(1) }}>
        <Button
          startIcon={
            <FilterListIcon style={{ color: theme.palette.text.disabled }} />
          }
          endIcon={<KeyboardArrowDownIcon fontSize="small" />}
          onClick={toggleDateRangeFilter}
        >
          {renderFilteringDateValue()}
        </Button>

        <Button
          aria-controls="simple-menu"
          aria-haspopup="true"
          onClick={toggleMenu}
          ref={anchorRef}
          disabled={
            !Countries || !Array.isArray(Countries) || !Countries.length
          }
          startIcon={
            <Public
              style={{ color: theme.palette.text.disabled }}
              fontSize="small"
            />
          }
          endIcon={<KeyboardArrowDownIcon fontSize="small" />}
        >
          {SelectedCountries.length > 0
            ? `Within ${SelectedCountries.length} countries`
            : "Countries"}
        </Button>
      </ButtonGroup>

      <div style={{ position: "relative" }}>
        <Menu
          id="simple-menu"
          open={MenuOpen}
          PaperProps={MenuProps.PaperProps}
          keepMounted
          onClose={closeMenu}
          anchorEl={anchorRef.current}
          style={{ paddingTop: 0 }}
        >
          <MenuItem
            button
            onClick={clearCountries}
            // disabled={SelectedCountries.length < 1}
          >
            <ClearAllIcon style={{ margin: theme.spacing(1) }} />
            Clear and show all
          </MenuItem>
          <Divider />

          {Array.isArray(Countries) &&
            Countries.map((name) => (
              <MenuItem
                alignItems="center"
                key={name}
                onClick={() => {
                  toggleCountry(name);
                }}
                value={name}
                style={getStyles(name, personName, theme)}
              >
                <Checkbox
                  color="secondary"
                  checked={countryIsSelected(name)}
                  size="small"
                  disableRipple
                />
                {name}
              </MenuItem>
            ))}
        </Menu>
      </div>
    </div>
  );
}
export default React.memo(DateCountryFilter);
