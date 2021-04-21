import {
  Button,
  Divider,
  FormControl,
  InputAdornment,
  OutlinedInput,
} from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import TableContainer from "@material-ui/core/TableContainer";
import { Domain, Language, TextFields } from "@material-ui/icons";
import LinkIcon from "@material-ui/icons/Link";
import SearchIcon from "@material-ui/icons/Search";
import React, { useState } from "react";
import AddToBlacklist from "../components/AddToBlacklist";
import BlacklistTable from "../components/Tables/Blacklist";

const useStyles = makeStyles({
  table: {
    minWidth: 500,
  },
  tableContainer: {
    overflow: "hidden",
    overflowY: "hidden",
    display: "flex",
    flexDirection: "column",
  },
});
let filterTimeout = undefined;

var BLACKLIST_RULE_TYPES = {
  PORTAL: 1,
  DOMAIN: 2,
  URL: 3,
  REGEX: 4,
};

export default function BlacklistView() {
  const [Filter, setFilter] = useState("");

  const [FormBlacklistRuleType, setFormBlacklistRuleType] = useState(
    BLACKLIST_RULE_TYPES.PORTAL
  );

  const classes = useStyles();

  const theme = useTheme();

  const onFilterChanged = (f) => {
    clearTimeout(filterTimeout);
    filterTimeout = setTimeout(() => {
      console.log("Setting filter");
      setFilter(f);
    }, 500);
  };

  return (
    <div>
      <AddToBlacklist />
      <Paper>
        <TableContainer className={classes.tableContainer}>
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
                id="standard-adornment-amount"
                size="small"
                placeholder="Search by keyword or website"
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

            <Button
              variant="contained"
              color="secondary"
              disableElevation
              startIcon={<SearchIcon />}
              style={{ whiteSpace: "nowrap", marginLeft: theme.spacing(2) }}
            >
              Search
            </Button>
          </div>
          <Divider />
          <BlacklistTable filter={Filter} />
        </TableContainer>
      </Paper>
    </div>
  );
}
