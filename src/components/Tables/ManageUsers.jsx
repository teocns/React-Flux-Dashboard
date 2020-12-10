import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { prettyTimelapse, timeSince } from "../../helpers/time";
import {
  Box,
  Checkbox,
  Divider,
  IconButton,
  LinearProgress,
  Link,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@material-ui/core";

import { motion } from "framer-motion";

import sessionStore from "../../store/session";
import tableStore from "../../store/Tables";
import scrapingThreadsStore from "../../store/ScrapingThreads";
import TablePaginationActions from "./Pagination";
import EmptyTablePlaceholder from "./EmptyPlaceholder";

import { Skeleton } from "@material-ui/lab";
import ActionTypes from "../../constants/ActionTypes";
import scrapingThreadsActions from "../../actions/ScrapingThread";
import { Delete, Today } from "@material-ui/icons";

import tableActions from "../../actions/Table";
import TableNames from "../../constants/Tables";
import TableData from "../../models/TableData";

const useStyles = makeStyles((theme) => ({
  tableRow: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
  },
  table: {
    minWidth: 500,
  },
}));

const THIS_TABLE_NAME = TableNames.USERS_ADMIN;

var TRIGGER_ROW_ADDED_ANIMATION = false;
const ManageUsersTable = ({ filter }) => {
  let [tableData, setTableData] = useState(
    tableStore.getTableData(THIS_TABLE_NAME)
  );

  const [SelectedRows, setSelectedRows] = useState([]);

  const HasTableData = tableData !== undefined;

  if (!HasTableData) {
    tableData = TableData.defaults(THIS_TABLE_NAME);
  }
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

  const syncTableData = ({ newPage, newRowsPerPage, newFilter }) => {
    tableActions.createTableData({
      rowsPerPage: newRowsPerPage !== undefined ? newRowsPerPage : rowsPerPage,
      page:
        newRowsPerPage !== -1 ? (newPage !== undefined ? newPage : page) : 0,
      filter: newFilter !== undefined ? newFilter : tableData.filter,
      tableName: THIS_TABLE_NAME,
      previousRowCount:
        tableData && tableData.totalRowsCount
          ? tableData.totalRowsCount
          : undefined,
    });
  };

  const handleChangePage = (event, newPage) => {
    console.log("handleChangePage.newPage", newPage);
    syncTableData({ newPage, newFilter: filter });
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    syncTableData({ newRowsPerPage, newPage: 0, newFilter: filter });
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

  const selectAllRows = (evt) => {
    const checked = evt.target.checked;
    if (!checked) {
      setSelectedRows([]);
    } else if (checked) {
      if (Array.isArray(rows)) {
        setSelectedRows(rows.map((row) => row.id));
      }
    }
  };
  const onScrapingThreadCreated = () => {
    TRIGGER_ROW_ADDED_ANIMATION = true;
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
  if (!HasTableData || tableData.filter !== filter) {
    setTimeout(() => {
      syncTableData({ newFilter: filter });
    });
  }
  useEffect(() => {
    // Means data has not yet loaded nor requested

    return bindListeners();
  });
  // if (rows.length <= 0) {
  //   return <EmptyTablePlaceholder />;
  // }

  const theme = useTheme();
  const selectRow = (shouldAdd, id) => {
    console.log(SelectedRows);
    const alreadySelectedIndex = SelectedRows.findIndex((c) => c === id);
    const alreadySelected = alreadySelectedIndex !== 1;
    if (alreadySelected) {
      SelectedRows.splice(alreadySelectedIndex, 0);
      setSelectedRows([...SelectedRows]);
    } else {
      setSelectedRows([id, ...SelectedRows]);
    }
  };
  const renderName = (row) => {
    let toWrap = undefined;
    if (row.name) {
      toWrap = (
        <React.Fragment>
          {row.name}
          <Typography variant="caption">{row.username}</Typography>
        </React.Fragment>
      );
    }
    toWrap = row.username;
    return <TableCell>{toWrap}</TableCell>;
  };
  return (
    <Table className={classes.table} stickyHeader>
      {/* <LinearProgress
        variant="indeterminate"
        color="secondary"
        style={{ height: 2, opacity: IsLoadingResults ? "0.5" : 0 }}
      /> */}
      <TableHead>
        <TableRow>
          <TableCell component="th" colspan="6">
            <Box display="flex" width="100%">
              <Checkbox
                checked={SelectedRows.length === rows.length}
                onChange={selectAllRows}
              />
              0 rows selected
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
                      checked={SelectedRows.includes(row.id)}
                      onChange={(evt) => {
                        selectRow(evt.target.checked, row.id);
                      }}
                    />
                  </TableCell>
                  {renderName(row)}
                  <TableCell>
                    <Link href={row.url} target="_blank">
                      {row.email}
                    </Link>
                  </TableCell>
                  <TableCell style={{ width: 160 }} align="left">
                    <Box
                      display="inline-flex"
                      alignItems="center"
                      justifyContent="start"
                      style={{ color: theme.palette.text.hint }}
                    >
                      <Today style={{ width: 18, height: 18 }} />
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
                    {row.insertedJobs || 0} Inserted jobs
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small">
                      <Delete fontSize="small" />
                    </IconButton>
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

export default ManageUsersTable;
