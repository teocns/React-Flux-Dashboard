import FilterListIcon from "@material-ui/icons/FilterList";
import uiActions from "../actions/UI";
import SpinnerGrow from "../components/SpinnerGrow";
import {
  Button,
  Divider,
  FormControl,
  FormHelperText,
  InputLabel,
  InputAdornment,
  InputBase,
  Menu,
  MenuItem,
  OutlinedInput,
  Select,
} from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import TableContainer from "@material-ui/core/TableContainer";
import SearchIcon from "@material-ui/icons/Search";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import TitledDivider from "../components/Dashboard/TitledDivider";
import TrackedUrlsTable from "../components/Tables/TrackedUrls";
import { number_format } from "../helpers/numbers";
import { parseDomain } from "../helpers/url";

import {
  Link as LinkIcon,
  AddCircle as AddCircleIcon,
} from "@material-ui/icons";
import TrackedUrlsApi from "../api/TrackedUrls";
import UserFilterDropdown from "../components/Filters/UserFilter";
import sessionStore from "../store/session";

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    overflowY: "hidden",
    padding: 2,
  },
  tableContainer: {
    overflow: "hidden",
    overflowY: "hidden",
    display: "flex",
    flexDirection: "column",
  },
});
let filterTimeout = undefined;

var HasEverSearched = false;

const getSearchParam = (props) => {
  return new URLSearchParams(props.location.search).get("search");
};

var previousFilter = null;

const filter_options = ["FAILED_TO_CRAWL", "NEVER_GAVE_JOBS", "BANNED"];

export default function TrackedUrlsView(props) {
  const [Filter, setFilter] = useState(getSearchParam(props));
  const [UserFilter, setUserFilter] = useState(sessionStore.getUser().id);
  const [TrackedUrlsIndex, setTrackedUrlsIndex] = useState(1);
  const classes = useStyles();

  const history = useHistory();

  const theme = useTheme();

  /**
   * Destructures the search values
   * Interprets the domain (if present) to boost indexing
   */

  const onFilterChanged = (f) => {
    return;
    HasEverSearched = true;
    setTimeout(() => {
      history.push({
        search: f ? `?search=${f}` : "",
      });
    });
    clearTimeout(filterTimeout);
    filterTimeout = setTimeout(() => {
      setFilter(f);
    }, 500);
  };

  const isValidRuleType = () => {
    try {
      return !!Filter;
    } catch (e) {
      return false;
    }
  };

  return (
    <div className={classes.root}>
      <Paper style={{ marginBottom: theme.spacing(3) }}>
        <div
          style={{
            padding: theme.spacing(2),
            width: "100%",
            display: "flex",
            flexDirection: "row",
            flexWrap: "nowrap",
          }}
        >
          <UserFilterDropdown
            title="Tracked by user"
            onUserFilterChanged={(userId) => {
              setUserFilter(userId);
            }}
          />

          <FormControl
            style={{
              minWidth: 120,
            }}
          >
            <InputLabel labelId="sadfasdfdsafd">Filter</InputLabel>
            <Select
              labelId="sadfasdfdsafd"
              id="standard-adornment-amount"
              placeholder="Password"
              type="password"
              label="Filter"
              //disabled={!!IsAuthenticating}
              onChange={(evt) => {
                setFilter(evt.target.value);
              }}
              startAdornment={
                <InputAdornment position="start">
                  <FilterListIcon />
                </InputAdornment>
              }
            >
              <MenuItem key="None" value="None">
                None
              </MenuItem>
              {filter_options.map((name) => (
                <MenuItem key={name} value={name}>
                  {name.split("_").join(" ").toUpperCase()}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      </Paper>

      <TableContainer component={Paper} className={classes.tableContainer}>
        <div
          style={{
            padding: theme.spacing(2),
            width: "100%",
            display: "flex",
            flexDirection: "row",
            flexWrap: "nowrap",
          }}
        >
          <FormControl fullWidth size="small" className={classes.margin}>
            <InputBase
              defaultValue={Filter}
              variant="standard"
              style={{ outline: "none" }}
              id="standard-adornment-amount"
              size="small"
              aria-describedby="search-error"
              placeholder="Search URLs"
              error={!isValidRuleType()}
              onChange={(evt) => {
                onFilterChanged(evt.target.value);
              }}
              onKeyPress={(evt) => {
                onFilterChanged(evt.target.value);
              }}
              startAdornment={
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              }
            />
          </FormControl>
        </div>
        <Divider />
        <TrackedUrlsTable
          TrackedUrlsIndex={TrackedUrlsIndex}
          filter={isValidRuleType() ? Filter : undefined}
          userFilter={UserFilter}
          //onLoaded={onTableDataLoaded}
        />
      </TableContainer>
    </div>
  );
}
