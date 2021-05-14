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
import UserFilterComponent from "../components/Filters/UserFilter";
import sessionStore from "../store/session";
import MultiFilter from "../components/Filters/MultiFilter";
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

  const onSearchFilterChanged = (f) => {
    setFilter(f);
  };

  const onUserFilterChanged = (f) => {
    debugger;
    setUserFilter(f);
  };
  return (
    <TableContainer component={Paper} className={classes.tableContainer}>
      <MultiFilter
        mini
        dateRangeTooltip={"Filter websites by datetime of crawl"}
        onSearchFilterChanged={onSearchFilterChanged}
        onUserFilterChanged={onUserFilterChanged}
      />

      <Divider />
      <DomainsManagementTable
        filter={{
          domain: Filter,
          users: UserFilter,
        }}
      />
    </TableContainer>
  );
}
