//@ts-check
import uiActions from "../actions/UI";
import SpinnerGrow from "../components/SpinnerGrow";
import {
  Button,
  Divider,
  FormControl,
  FormHelperText,
  InputAdornment,
  InputBase,
  OutlinedInput,
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

export default function TrackedUrlsView(props) {
  const [Filter, setFilter] = useState(getSearchParam(props));
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

  const trackUrl = () => {
    TrackedUrlsApi.TrackUrl({
      url: document.getElementById("track-url-input").value,
    }).then((result) => {
      if (result.success) {
        setTrackedUrlsIndex(TrackedUrlsIndex + 1);
        uiActions.showSnackbar(`URL tracked successfully`, "success");
      }
    });
  };
  const onTableDataLoaded = () => {};
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
          <FormControl fullWidth size="small">
            <OutlinedInput
              id="track-url-input"
              placeholder="URL to track"
              //value={UrlInputValue.inputValue}

              onKeyPress={(evt) => {
                if (evt.key === "Enter") {
                  trackUrl();
                }
              }}
              startAdornment={
                <InputAdornment position="start">
                  <LinkIcon />
                </InputAdornment>
              }
            />
          </FormControl>
          <Button
            variant="contained"
            color="secondary"
            disableElevation
            startIcon={<AddCircleIcon />}
            endIcon={<SpinnerGrow />}
            onClick={trackUrl}
            style={{ whiteSpace: "nowrap", marginLeft: theme.spacing(2) }}
          >
            Add URL
          </Button>
        </div>
      </Paper>
      {/* <div>
        <Paper>
          <div style={{ padding: theme.spacing(2) }}>
            <Typography
              variant="body2"
              style={{ color: theme.palette.text.hint }}
            >
              Websites with crawled jobs
            </Typography>
            <Typography variant="h6">
              {number_format(12390128, 0, ".", ",")}
            </Typography>
          </div>

          <Button>SHOW</Button>
        </Paper>
      </div>
      <TitledDivider /> */}
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
          //onLoaded={onTableDataLoaded}
        />
      </TableContainer>
    </div>
  );
}
