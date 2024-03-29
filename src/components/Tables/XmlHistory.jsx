import React, { useState, useEffect } from "react";

import PropTypes from "prop-types";
import clsx from "clsx";
import DateRangeIcon from "@material-ui/icons/DateRange";
import { DateRangePicker, DateRange } from "materialui-daterange-picker";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { useConfirm } from "material-ui-confirm";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import GlobeIcon from "@material-ui/icons/Public";
import { prettyTimelapse, timeSince } from "../../helpers/time";
import UserAvatar from "../User/Avatar/ShortLettersAvatar";

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
import ScrapingThreadApi from "../../api/ScrapingThread";
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
  RssFeedTwoTone,
  Search,
  CheckCircle,
} from "@material-ui/icons";

import tableActions from "../../actions/Table";
import TableNames from "../../constants/Tables";
import TableData from "../../models/TableData";
import MultiFilter from "../Filters/MultiFilter";
import LinkIcon from "@material-ui/icons/Link";

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

const THIS_TABLE_NAME = TableNames.XML_FEEDS;

const XmlFeedsTable = ({ filter }) => {
  let [tableData, setTableData] = useState(
    tableStore.getTableData(THIS_TABLE_NAME)
  );
  const [SelectedRows, setSelectedRows] = useState([]);
  const [DateRange, setDateRange] = useState(null);

  const HasTableData = tableData !== undefined;

  if (!HasTableData) {
    tableData = TableData.defaults(THIS_TABLE_NAME);
  }
  const confirm = useConfirm();
  const rowsPerPage = tableData.rowsPerPage;
  const page = tableData.page;
  const countryFilter = tableData.countryFilter;
  const dateRange = tableData.dateRange;
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
  const emptyRows =
    rowsPerPage -
    Math.min(rowsPerPage, rowsLength - page * rowsPerPage) +
    (rowsLength > 1 ? 0 : 1);
  const deleteSelectedRows = () => {
    if (SelectedRows.length) {
      confirm({
        description: `Are you sure you want to delete ${SelectedRows.length} links?`,
        title: `Delete ${SelectedRows.length} links`,
      })
        .then(async () => {
          const res = await ScrapingThreadApi.Delete(SelectedRows);
          if (res && res.success) {
            uiActions.showSnackbar(`Links deleted successfully`, "success");
            setSelectedRows([]);
            setTimeout(() => {
              syncTableData({});
            });
          }
        })
        .catch();
    }
  };
  const handleUserFilterChanged = (userFilter) => {
    return;
    //setUserFilter(userFilter);
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
  const syncTableData = ({
    newPage,
    newRowsPerPage,
    newDateRange,
    newCountryFilter,
  }) => {
    tableActions.createTableData({
      rowsPerPage: newRowsPerPage !== undefined ? newRowsPerPage : rowsPerPage,
      page:
        newRowsPerPage !== -1 ? (newPage !== undefined ? newPage : page) : 0,
      filter: filter || "",
      tableName: THIS_TABLE_NAME,
      previousRowCount:
        tableData && tableData.totalRowsCount
          ? tableData.totalRowsCount
          : undefined,
      dateRange: newDateRange !== undefined ? newDateRange : dateRange,
      countryFilter:
        newCountryFilter !== undefined ? newCountryFilter : countryFilter,
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

    return () => {
      tableStore.removeChangeListener(
        ActionTypes.Table.DATA_CREATED,
        onTableRowsDataUpdated
      );
      tableStore.removeChangeListener(
        ActionTypes.Table.DATA_UPDATED,
        onTableRowsDataUpdated
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
    setTimeout(() => {
      if (!HasTableData || filter !== tableData.filter) {
        syncTableData({});
      }
    });

    return bindListeners();
  });
  // if (rows.length <= 0) {
  //   return <EmptyTablePlaceholder />;
  // }

  const handleCountryFilterChanged = (_countryFilter) => {
    syncTableData({ newCountryFilter: _countryFilter });
  };
  const handleDateFilterChanged = (_dateRange) => {
    syncTableData({ newDateRange: _dateRange });
  };

  const theme = useTheme();

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

  const renderXmlStatus = (row) => {
    if (row.isAvailable) {
      return (
        <React.Fragment>
          <CheckCircle
            style={{
              width: 18,
              height: 18,
              color: "green",
            }}
          />
          <Typography
            variant="body2"
            noWrap={true}
            style={{ marginLeft: theme.spacing(1) }}
          >
            Available
          </Typography>
        </React.Fragment>
      );
    }
  };
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
                  title={`Permanently delete ${SelectedRows.length} links?`}
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
                <MultiFilter
                  onUserFilterChanged={handleUserFilterChanged}
                  onCountriesChanged={handleCountryFilterChanged}
                  onDateRangeChanged={handleDateFilterChanged}
                />
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
                    <Box display="flex" alignItems="center">
                      <UserAvatar
                        username={row.username}
                        fullname={row.fullname}
                      />
                      <Box
                        display="flex"
                        flexDirection="column"
                        style={{ marginLeft: theme.spacing(1) }}
                      >
                        <Typography
                          variant="caption"
                          style={{ color: theme.palette.text.hint }}
                        >
                          Generated by {row.username || "BOT"}
                        </Typography>
                        <Typography variant="subtitle2">
                          <Link
                            target="_blank"
                            href={
                              "https://api2-scrapers.bebee.com/feed/" +
                              row.uuid +
                              ".xml"
                            }
                          >
                            {row.uuid}.xml
                          </Link>
                        </Typography>
                      </Box>
                    </Box>
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
                  <TableCell align="left">
                    <Box alignItems="center" display="inline-flex">
                      <GlobeIcon
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
                        {row.country}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell style={{ width: 160 }} align="left">
                    <Box
                      display="inline-flex"
                      alignItems="center"
                      justifyContent="start"
                    >
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
                        style={{ marginLeft: theme.spacing(1) }}
                      >
                        {row.totalJobs} jobs
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box display="inline-flex" alignItems="center">
                      {renderXmlStatus(row)}
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
              rowsPerPageOptions={[5, 8, 10, 25, { label: "All", value: -1 }]}
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

export default XmlFeedsTable;
