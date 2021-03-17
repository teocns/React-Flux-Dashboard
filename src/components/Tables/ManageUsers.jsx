import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { useConfirm } from "material-ui-confirm";
import { prettyTimelapse, timeSince } from "../../helpers/time";
import clsx from "clsx";
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
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
} from "@material-ui/core";
import uiActions from "../../actions/UI";
import UserApi from "../../api/User";
import { motion } from "framer-motion";
import { Link as RouterLink } from "react-router-dom";
import sessionStore from "../../store/session";
import tableStore from "../../store/Tables";
import scrapingThreadsStore from "../../store/ScrapingThreads";
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
  Search,
  AssignmentTurnedIn,
} from "@material-ui/icons";

import tableActions from "../../actions/Table";
import TableNames from "../../constants/Tables";
import TableData from "../../models/TableData";

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

const THIS_TABLE_NAME = TableNames.USERS_ADMIN;

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

  const rowsLength = Array.isArray(rows) ? rows.length : 0;
  const emptyRows =
    rowsPerPage -
    Math.min(rowsPerPage, rowsLength - page * rowsPerPage) +
    (rowsLength > 1 ? 0 : 1);

  const isLoadingResults = tableData ? tableData.isLoading : true;
  const classes = useStyles();
  // const emptyRows =
  //   rowsPerPage - Math.min(rowsPerPage, rowsLength - page * rowsPerPage);
  const confirm = useConfirm();
  const deleteUser = async (userId, username) => {
    confirm({
      description: `Are you sure you want to delete "${username}" (ID: ${userId})?`,
      title: `Delete user "${username}"`,
    })
      .then(async () => {
        const res = await UserApi.DeleteUsers([userId]);
        if (res && res.success) {
          uiActions.showSnackbar(`User "${username}" deleted`, "success");
          syncTableData({});
        }
      })
      .catch();
  };
  const getTableData = () => {
    return tableStore.getTableData(THIS_TABLE_NAME) || tableData;
  };
  const syncTableData = ({ newPage, newRowsPerPage, newDateRange }) => {
    const _tableData = getTableData();

    tableActions.createTableData({
      rowsPerPage:
        newRowsPerPage !== undefined ? newRowsPerPage : _tableData.rowsPerPage,
      totalRowsCount: _tableData.totalRowsCount,
      page:
        newRowsPerPage !== -1
          ? newPage !== undefined
            ? newPage
            : _tableData.page
          : 0,
      filter: filter || "",
      tableName: THIS_TABLE_NAME,
      previousRowCount:
        _tableData && _tableData.totalRowsCount
          ? _tableData.totalRowsCount
          : undefined,
      dateRange:
        newDateRange !== undefined ? newDateRange : _tableData.dateRange,
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

  useEffect(() => {
    // Means data has not yet loaded nor requested
    setTimeout(() => {
      syncTableData({});
    });

    return bindListeners();
  }, []);
  // if (rows.length <= 0) {
  //   return <EmptyTablePlaceholder />;
  // }

  const theme = useTheme();
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
  const deleteSelectedUsers = () => {
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
          <Typography variant="h6" style={{ color: theme.palette.text.hint }}>
            Try changing filter options
          </Typography>
        );
      }
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
              No{rowsLength > 0 ? " more" : ""} users found
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
                    size="small"
                    disabled={SelectedRows.length < 1}
                    onClick={deleteSelectedUsers}
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
                <Tooltip title="Register new user">
                  <Button
                    style={{ marginLeft: theme.spacing(1) }}
                    startIcon={<AddCircle color="primary" />}
                    component={RouterLink}
                    to="/add-user"
                  >
                    Add user
                  </Button>
                </Tooltip>
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
          : rows.map((row) => {
              const innerRow = (
                <React.Fragment>
                  <TableCell width="64px">
                    <Checkbox
                      size="small"
                      checked={SelectedRows.includes(row.id)}
                      onChange={(evt) => {
                        onRowSelectionChanged(row.id);
                      }}
                    />
                  </TableCell>
                  {renderName(row)}
                  <TableCell>
                    <Link href={row.url} target="_blank">
                      {row.email}
                    </Link>
                  </TableCell>
                  <TableCell style={{ width: 160 }} align="right">
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
                  <TableCell style={{ width: 48 }} align="right">
                    <Box alignItems="center" flexWrap="nowrap" display="flex">
                      <AssignmentTurnedIn
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
                        {row.scrapedJobs || 0} Inserted jobs
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={() => {
                        deleteUser(row.id, row.username);
                      }}
                    >
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
        {!IsLoadingResults && renderEmptyRows()}
      </TableBody>
      <TableFooter>
        <TableRow>
          {rowsLength > 0 && (
            <TablePagination
              rowsPerPageOptions={[5, 8, 10, 25, { label: "All", value: -1 }]}
              colSpan={6}
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
