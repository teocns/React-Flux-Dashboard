import { makeStyles, useTheme } from "@material-ui/core/styles";

import { IconButton } from "@material-ui/core";
import { FastForward, FilterList as FilterListIcon } from "@material-ui/icons";
import { DateRangePicker } from "materialui-daterange-picker";
import React, { useEffect, useState } from "react";
import DateRanges from "../../constants/DateRanges";
import { isFunction } from "../../helpers/utils";
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

function DateFilter({ onDateRangeChanged }) {
  const [DateFilterOpen, setDateFilterOpen] = useState(false);

  const [DateRange, setDateRange] = useState(null);

  const anchorRef = React.useRef(null);
  const usersAnchorRef = React.useRef(null);

  const classes = useStyles();
  const theme = useTheme();

  const toggleDateRangeFilter = () => {
    setDateFilterOpen(!DateFilterOpen);
  };

  const bindListeners = () => {};

  useEffect(() => {
    return bindListeners();
  });

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

      <IconButton size="small" onClick={toggleDateRangeFilter}>
        <FilterListIcon style={{ color: theme.palette.text.disabled }} />
      </IconButton>
    </div>
  );
}
export default React.memo(DateFilter);
