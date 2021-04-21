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
import SearchIcon from "@material-ui/icons/Search";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import DomainsManagementTable from "../components/Tables/DomainsManagement";

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
export default function DomainsManagementView() {
  const [Filter, setFilter] = useState("");
  const classes = useStyles();

  const history = useHistory();

  const theme = useTheme();

  const onFilterChanged = (f) => {
    clearTimeout(filterTimeout);
    filterTimeout = setTimeout(() => {
      console.log("Setting filter");
      setFilter(f);
    }, 500);
  };

  return (
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
            id="standard-adornment-amount"
            size="small"
            placeholder="Search URLs"
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
      <DomainsManagementTable filter={Filter} />
    </TableContainer>
  );
}
