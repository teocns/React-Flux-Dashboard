import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import DateRangeIcon from "@material-ui/icons/DateRange";
import { DateRangePicker, DateRange } from "materialui-daterange-picker";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { useConfirm } from "material-ui-confirm";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import { prettyTimelapse, timeSince } from "../../helpers/time";
import {
  Badge,
  Box,
  Button,
  Checkbox,
  Divider,
  IconButton,
  LinearProgress,
  Link,
  Table,
  TableBody,
  TableCell,
  CircularProgress,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
  ButtonGroup,
} from "@material-ui/core";

import FilterListIcon from "@material-ui/icons/FilterList";
import uiActions from "../../actions/UI";
import UserApi from "../../api/User";
import { motion } from "framer-motion";
import { Link as RouterLink } from "react-router-dom";
import sessionStore from "../../store/session";
import tableStore from "../../store/Tables";
import scrapingThreadsStore from "../../store/ScrapingThreads";
import CountryFilter from "../Filters/CountryFilter";
import TablePaginationActions from "./Pagination";
import EmptyTablePlaceholder from "./EmptyPlaceholder";

import { Skeleton } from "@material-ui/lab";
import ActionTypes from "../../constants/ActionTypes";
import scrapingThreadsActions from "../../actions/ScrapingThread";
import {
  Add,
  AddCircle,
  Delete,
  Today,
  AssignmentTurnedIn as AssignmentTurnedInIcon,
  Public,
} from "@material-ui/icons";

import tableActions from "../../actions/Table";
import TableNames from "../../constants/Tables";
import TableData from "../../models/TableData";
import DateCountryFilter from "../Filters/DateCountryFilter";

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 500,
  },
  tableRow: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
  },
}));

const THIS_TABLE_NAME = TableNames.ADD_TRACK_URL;

const ManageUrlsTable = () => {
  let [tableData, setTableData] = useState(
    tableStore.getTableData(THIS_TABLE_NAME)
  );
  const [SelectedRows, setSelectedRows] = useState([]);
  const [DateRange, setDateRange] = useState(null);

  const [SelectedCountriesFilter, setSelectedCountriesFilter] = useState();
  const HasTableData = tableData !== undefined;

  if (!HasTableData) {
    tableData = TableData.defaults(THIS_TABLE_NAME);
  }
  const confirm = useConfirm();
  const rowsPerPage = tableData.rowsPerPage;
  const page = tableData.page;
  let rows = tableData.rows;

  const IsLoadingResults = tableData.isLoading;
  let hasInheritedRows = false;
  if (IsLoadingResults && tableData.previousTableData) {
    rows = tableData.previousTableData.rows;
    hasInheritedRows = true;
  }

  const isLoadingResults = tableData ? tableData.isLoading : true;
  const rowsLength = Array.isArray(rows) ? rows.length : 0;
  const classes = useStyles();
  // const emptyRows =
  //   rowsPerPage - Math.min(rowsPerPage, rowsLength - page * rowsPerPage);
  const deleteSelectedRows = () => {
    if (SelectedRows.length) {
      confirm({
        description: `Are you sure you want to delete ${SelectedRows.length} users?`,
        title: `Delete ${SelectedRows.length} users`,
      })
        .then(async () => {
          const res = await UserApi.DeleteUsers(SelectedRows);
          if (res && res.success) {
            uiActions.showSnackbar(`Users deleted successfully`, "success");
            setSelectedRows([]);
            setTimeout(() => {
              syncTableData({});
            });
          }
        })
        .catch();
    }
  };
  const selectAllRows = (evt) => {
    const checked = evt.target.checked;
    if (!checked) {
      setSelectedRows([]);
    } else if (checked) {
      if (Array.isArray(rows)) {
        setSelectedRows(rows.map((row) => row.threadId));
      }
    }
  };
  const syncTableData = ({ newPage, newRowsPerPage, newDateRange }) => {
    tableActions.createTableData({
      rowsPerPage: newRowsPerPage !== undefined ? newRowsPerPage : rowsPerPage,
      page:
        newRowsPerPage !== -1 ? (newPage !== undefined ? newPage : page) : 0,
      filter: "",
      tableName: THIS_TABLE_NAME,
      previousRowCount:
        tableData && tableData.totalRowsCount
          ? tableData.totalRowsCount
          : undefined,
      dateRange:
        newDateRange !== undefined ? newDateRange : tableData.dateRange,
    });
  };
  const handleChangePage = (event, newPage) => {
    console.log("handleChangePage.newPage", newPage);
    syncTableData({ newPage });
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    syncTableData({ newRowsPerPage, newPage: 0 });
  };

  /**
   * @type {Object} obj
   * @type {TableData} obj.tableData
   */
  const onTableRowsDataUpdated = ({ tableData }) => {
    if (tableData.tableName === THIS_TABLE_NAME) {
      const foundTable = tableStore.getByTableName(THIS_TABLE_NAME);
      console.log("foundTable", foundTable);
      setTableData(foundTable);
    }
  };
  console.log("rendering", tableData);

  const onScrapingThreadCreated = () => {
    setTimeout(() => {
      syncTableData({ newPage: 0 });
    });
  };
  const bindListeners = () => {
    tableStore.addChangeListener(
      ActionTypes.Table.DATA_CREATED,
      onTableRowsDataUpdated
    );
    tableStore.addChangeListener(
      ActionTypes.Table.DATA_UPDATED,
      onTableRowsDataUpdated
    );
    scrapingThreadsStore.addChangeListener(
      ActionTypes.ScrapingThread.THREAD_CREATED,
      onScrapingThreadCreated
    );
    return () => {
      tableStore.removeChangeListener(
        ActionTypes.Table.DATA_CREATED,
        onTableRowsDataUpdated
      );
      tableStore.removeChangeListener(
        ActionTypes.Table.DATA_UPDATED,
        onTableRowsDataUpdated
      );
      scrapingThreadsStore.removeChangeListener(
        ActionTypes.Table.ROW_ADDED,
        onScrapingThreadCreated
      );
    };
  };
  const onRowSelectionChanged = (id) => {
    console.log(SelectedRows);
    const alreadySelectedIndex = SelectedRows.findIndex((c) => c === id);
    const alreadySelected =
      alreadySelectedIndex !== -1 && alreadySelectedIndex !== false;
    if (alreadySelected) {
      SelectedRows.splice(alreadySelectedIndex, 1);
      setSelectedRows([...SelectedRows]);
    } else {
      setSelectedRows([id, ...SelectedRows]);
    }
  };

  useEffect(() => {
    // Means data has not yet loaded nor requested
    if (!HasTableData) {
      setTimeout(() => {
        syncTableData({});
      });
    }

    return bindListeners();
  });
  // if (rows.length <= 0) {
  //   return <EmptyTablePlaceholder />;
  // }

  const theme = useTheme();
  return (
    <Table className={classes.table} aria-label="custom pagination table">
      {/* <LinearProgress
        variant="indeterminate"
        color="secondary"
        style={{ height: 2, opacity: IsLoadingResults ? "0.5" : 0 }}
      /> */}
      <TableHead>
        <TableRow>
          <TableCell component="th" colspan="6">
            <Box display="flex" width="100%" position="relative">
              <div style={{ display: "flex", alignItems: "center" }}>
                <Checkbox
                  size="small"
                  disabled={rows.length < 1}
                  checked={rows.length && SelectedRows.length === rows.length}
                  onChange={selectAllRows}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginLeft: theme.spacing(1),
                }}
              >
                <Tooltip
                  title={`Permanently delete ${SelectedRows.length} users`}
                >
                  <IconButton
                    disabled={SelectedRows.length < 1}
                    size="small"
                    onClick={deleteSelectedRows}
                  >
                    <Badge badgeContent={SelectedRows.length} color="secondary">
                      <Delete />
                    </Badge>
                  </IconButton>
                </Tooltip>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginLeft: theme.spacing(1),
                }}
              >
                <DateCountryFilter />
              </div>
            </Box>
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {isLoadingResults && !hasInheritedRows
          ? [...Array(rowsPerPage !== undefined ? rowsPerPage : 10).keys()].map(
              (x) => (
                <TableRow key={x} style={{ height: 56 }}>
                  {/* {[...Array(3).keys()].map((c) => (
                  <TableCell key={c} colSpan={6 / c}>
                    <Skeleton animation="wave" style={{ height: 48 }} />
                  </TableCell>
                ))} */}
                  <TableCell width="45%">
                    <Skeleton animation="wave" style={{ width: "75%" }} />
                  </TableCell>
                  <TableCell width="27,5%">
                    <Skeleton animation="wave" style={{ width: "75%" }} />
                  </TableCell>
                  <TableCell width="27,5%" align="right">
                    <Skeleton
                      animation="wave"
                      style={{
                        width: "75%",
                        display: "inline-block",
                      }}
                    />
                  </TableCell>
                </TableRow>
              )
            )
          : rows.map((row, index) => {
              const innerRow = (
                <React.Fragment>
                  <TableCell width="64px">
                    <Checkbox
                      size="small"
                      checked={SelectedRows.includes(row.threadId)}
                      onChange={(evt) => {
                        onRowSelectionChanged(row.threadId);
                      }}
                    />
                  </TableCell>
                  <TableCell component="th" scope="row">
                    <Link href={row.url} target="_blank">
                      {row.url}
                    </Link>
                  </TableCell>
                  <TableCell style={{ width: 160 }} align="left">
                    <Box
                      display="inline-flex"
                      alignItems="center"
                      justifyContent="start"
                    >
                      <Today
                        style={{
                          width: 18,
                          height: 18,
                          color: theme.palette.text.hint,
                        }}
                        //style={{ color: theme.palette.text.hint }}
                      />
                      <Typography
                        variant="body2"
                        noWrap={true}
                        style={{ marginLeft: theme.spacing(1) }}
                      >
                        {timeSince(row.age)}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell style={{ width: 160 }} align="right">
                    <Box alignItems="center" flexWrap="nowrap" display="flex">
                      <AssignmentTurnedInIcon
                        style={{
                          width: 18,
                          height: 18,
                          color: theme.palette.text.hint,
                        }}
                      />

                      <Typography
                        variant="body2"
                        noWrap={true}
                        style={{
                          marginLeft: theme.spacing(1),
                          whiteSpace: "nowrap",
                        }}
                      >
                        {row.scrapedJobs} Inserted jobs
                      </Typography>
                    </Box>
                  </TableCell>
                </React.Fragment>
              );
              const wrapComponent = (
                <TableRow className={classes.tableRow} key={row.uuid}>
                  {innerRow}
                </TableRow>
              );
              return wrapComponent;
            })}
      </TableBody>
      <TableFooter>
        <TableRow>
          {rowsLength > 0 && (
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
              colSpan={3}
              count={tableData.totalRowsCount}
              rowsPerPage={rowsPerPage}
              page={page}
              SelectProps={{
                inputProps: { "aria-label": "rows per page" },
                native: true,
              }}
              onChangePage={handleChangePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActions}
            />
          )}
        </TableRow>
      </TableFooter>
    </Table>
  );
};

export default ManageUrlsTable;
