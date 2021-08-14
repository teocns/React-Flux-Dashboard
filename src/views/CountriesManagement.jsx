import {
  Button,
  Divider,
  InputBase,
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
import UserFilterComponent from "../components/Filters/UserFilter";
import sessionStore from "../store/session";
import MultiFilter from "../components/Filters/MultiFilter";
import CountriesManagementTable from "../components/Tables/CountriesManagement";
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

  const user = sessionStore.getUser();

  const [UserFilter, setUserFilter] = useState(user.isAdmin ? [] : [user.id]);
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
          background: "white",
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
            placeholder="Search Domains"
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

      <CountriesManagementTable filter={Filter} />
    </TableContainer>
  );
}
