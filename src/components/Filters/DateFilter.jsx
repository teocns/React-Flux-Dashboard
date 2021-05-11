//@ts-check
import { Badge, IconButton } from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { FastForward } from "@material-ui/icons";
import DateRangeIcon from "@material-ui/icons/DateRange";
import React, { useEffect, useState } from "react";
import { isFunction } from "../../helpers/utils";
import { DateRangePicker } from "materialui-daterange-picker";
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

function DateFilter({ onDateRangeChanged }) {
  const [DateFilterOpen, setDateFilterOpen] = useState(false);

  const [DateRange, setDateRange] = useState(null);

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
    <div
      style={{ paddingLeft: theme.spacing(1), paddingRight: theme.spacing(1) }}
    >
      <IconButton size="small" onClick={toggleDateRangeFilter}>
        <Badge color="secondary" variant={DateRange && "dot"}>
          <DateRangeIcon
            size="small"
            style={{ color: theme.palette.text.disabled }}
          />
          <div style={{ postiion: "relative" }}>
            <div style={{ position: "fixed", zIndex: 129831298319 }}>
              <DateRangePicker
                closeOnClickOutside
                open={DateFilterOpen}
                definedRanges={DateRanges}
                toggle={toggleDateRangeFilter}
                onChange={handleChangeDateRange}
              />
            </div>
          </div>
        </Badge>
      </IconButton>
    </div>
  );
}
export default React.memo(DateFilter);
