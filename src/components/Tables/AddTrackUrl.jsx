import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { prettyTimelapse, timeSince } from "../../helpers/time";
import clsx from "clsx";
import {
  Box,
  CircularProgress,
  LinearProgress,
  Link,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
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
import { Today } from "@material-ui/icons";

import tableActions from "../../actions/Table";
import TableNames from "../../constants/Tables";
import TableData from "../../models/TableData";
import ImportExportIcon from "@material-ui/icons/ImportExport";
import AssignmentTurnedInIcon from "@material-ui/icons/AssignmentTurnedIn";
import FindInPageIcon from "@material-ui/icons/FindInPage";
import Search from "@material-ui/icons/Search";
const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 500,
  },
  tableRow: {
    height: 70,
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
  },
  emptyRow: {
    height: 70,
    backgroundColor: "white!important",
    "&:first-child td": {
      paddingTop: "8rem",
      paddingBottom: "8rem",
    },
  },
}));

const THIS_TABLE_NAME = TableNames.ADD_TRACK_URL;
var TRIGGER_ROW_ADDED_ANIMATION = false;
const AddTrackUrlTable = () => {
  let [tableData, setTableData] = useState(
    tableStore.getTableData(THIS_TABLE_NAME)
  );

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

  const syncTableData = ({ newPage, newRowsPerPage }) => {
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
  const renderEmptyRows = () => {
    if (rowsPerPage === rowsLength) {
      return "";
    }
    const isJustFilling = rowsLength > 0;
    const hasFilterApplied =
      tableData.totalRowsCount < tableData.unfilteredRowsCount;
    const _renderHint = () => {
      if (hasFilterApplied) {
        return (
          <Typography
            variant={isJustFilling ? "body2" : "h6"}
            style={{ color: theme.palette.text.hint }}
          >
            Try changing filter options
          </Typography>
        );
      }
      if (!isJustFilling)
        return (
          <Typography variant="h6" style={{ color: theme.palette.text.hint }}>
            Add some links to get started
          </Typography>
        );
    };
    const _emptyRowContent = () => (
      <TableCell colspan="6">
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
        >
          {!isJustFilling && (
            <Search
              style={{
                color: theme.palette.text.disabled,
                width: 48,
                height: 48,
              }}
            />
          )}

          <Box display="flex" justifyContent="center" alignItems="center">
            <Typography
              variant={isJustFilling ? "h6" : "h4"}
              style={{
                color: isJustFilling
                  ? theme.palette.text.hint
                  : theme.palette.text.primary,
              }}
            >
              No{rowsLength > 0 ? " more" : ""} links found
            </Typography>
          </Box>
          {_renderHint()}
        </Box>
      </TableCell>
    );

    const _createRow = () => (
      <TableRow
        className={clsx({
          [classes.tableRow]: true,
          [classes.emptyRow]: true,
        })}
        key={Math.random()}
      >
        {_emptyRowContent()}
      </TableRow>
    );

    return _createRow();
  };
  useEffect(() => {
    // Means data has not yet loaded nor requested
    if (!HasTableData) {
      setTimeout(() => {
        syncTableData({});
      });
    }
    if (!hasInheritedRows) {
      //TRIGGER_ROW_ADDED_ANIMATION = false;
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
        {!IsLoadingResults && renderEmptyRows()}
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

export default React.memo(AddTrackUrlTable);
