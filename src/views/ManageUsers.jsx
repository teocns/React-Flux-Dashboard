import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useConfirm } from "material-ui-confirm";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableFooter from "@material-ui/core/TableFooter";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import LastPageIcon from "@material-ui/icons/LastPage";

import SearchIcon from "@material-ui/icons/Search";
import scrapingThreadsActions from "../actions/ScrapingThread";
import { useHistory } from "react-router-dom";
import ManageUsersTable from "../components/Tables/ManageUsers";
import {
  Divider,
  Input,
  TableHead,
  TextField,
  Button,
  FormControl,
  InputLabel,
  InputAdornment,
  ButtonGroup,
  OutlinedInput,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import sessionStore from "../store/session";
import AddTrackUrlTable from "../components/Tables/AddTrackUrl";
import dispatcher from "../dispatcher";
import { Search } from "@material-ui/icons";
const useStyles = makeStyles((theme) => ({
  root: {
    flexShrink: 0,
    marginLeft: theme.spacing(2.5),
  },
}));

function createData(name, calories, fat) {
  return { name, calories, fat };
}

const useStyles2 = makeStyles({
  table: {
    minWidth: 500,
  },
});
let filterTimeout = undefined;
export default function ManageUsersView() {
  const [Filter, setFilter] = useState("");
  const classes = useStyles2();

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
    <div
      style={{
        overflowY: "auto",
        overflowX: "hidden",
        padding: theme.spacing(2),
      }}
    >
      <TableContainer component={Paper}>
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
              placeholder="Search users"
              onChange={(evt) => {
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
            startIcon={<Search />}
            style={{ whiteSpace: "nowrap", marginLeft: theme.spacing(2) }}
          >
            Search
          </Button>
        </div>
        <Divider />
        <ManageUsersTable filter={Filter} />
      </TableContainer>
    </div>
  );
}
