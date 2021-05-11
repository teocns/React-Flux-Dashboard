import {
  Button,
  Divider,
  FormControl,
  FormHelperText,
  InputAdornment,
  OutlinedInput,
  Typography,
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
function createData(name, calories, fat) {
  return { name, calories, fat };
}

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
  const classes = useStyles();

  const history = useHistory();

  const theme = useTheme();

  /**
   * Destructures the search values
   * Interprets the domain (if present) to boost indexing
   */
  const buildFilter = (value) => {
    // Validate

    if (typeof value !== "string" || !(value.length > 5)) {
      return setFilter(undefined);
    }

    const httpInjectedValue =
      !value.startsWith("http://") && !value.startsWith("https://")
        ? `https://${value}`
        : value;

    // Attempt parsing the domain
    const filter = {
      domain: undefined,
      url: undefined,
    };

    console.log(httpInjectedValue);
    try {
      filter.domain = parseDomain(httpInjectedValue);
    } catch (e) {
      //pass
    }

    // Attempt constructing URL
    try {
      const url = new URL(httpInjectedValue);
      if (url !== filter.domain) {
        filter.url = httpInjectedValue;
      }
    } catch (e) {
      //pass
    }

    // Make sure we are not re-rendering for nothing
    if (
      Filter &&
      (filter.domain !== Filter.domain || filter.url !== Filter.url)
    ) {
      setFilter(filter);
    }
    console.log("Made filter ", filter);
  };

  const onFilterChanged = (f) => {
    HasEverSearched = true;
    setTimeout(() => {
      history.push({
        search: f ? `?search=${f}` : "",
      });
    });
    clearTimeout(filterTimeout);
    filterTimeout = setTimeout(() => {
      buildFilter(f);
    }, 500);
  };

  const isValidRuleType = () => {
    try {
      return !!Filter;
    } catch (e) {
      return false;
    }
  };

  const onTableDataLoaded = () => {};
  return (
    <div className={classes.root}>
      <div>
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
      <TitledDivider />
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
            <OutlinedInput
              defaultValue={Filter}
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

            {HasEverSearched && !isValidRuleType() ? (
              <FormHelperText id="search-error">
                Input a domain or a valid URL
              </FormHelperText>
            ) : (
              ""
            )}
          </FormControl>
        </div>
        <Divider />
        <TrackedUrlsTable
          filter={isValidRuleType() ? Filter : undefined}
          onLoaded={onTableDataLoaded}
        />
      </TableContainer>
    </div>
  );
}
