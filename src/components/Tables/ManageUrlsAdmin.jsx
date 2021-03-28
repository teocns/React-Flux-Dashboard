import {
  Badge,
  Box,
  Checkbox,
  IconButton,
  Link,
  Menu,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
} from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { Delete, Search, Today } from "@material-ui/icons";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { Skeleton } from "@material-ui/lab";
import clsx from "clsx";
import { useConfirm } from "material-ui-confirm";
import React, { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import scrapingThreadsActions from "../../actions/ScrapingThread";
import tableActions from "../../actions/Table";
import uiActions from "../../actions/UI";
import ScrapingThreadApi from "../../api/ScrapingThread";
import ManageUrlsHeader from "../../components/Table/Headers/ManageUrls";
import UserAvatar from "../../components/User/Avatar/ShortLettersAvatar";
import ActionTypes from "../../constants/ActionTypes";
import TableNames from "../../constants/Tables";
import { timeSince } from "../../helpers/time";
import TableData from "../../models/TableData";
import scrapingThreadsStore from "../../store/ScrapingThreads";
import tableStore from "../../store/Tables";
import ScrapingThreadStatus from "../Table/ScrapingThreadStatus";
import TablePaginationActions from "./Pagination";

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 500,
    tableLayout: "fixed",
    display: "block",
    overflowY: "auto",
  },
  tableRow: {
    height: 70,
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
  },
  tableBody: {},
  emptyRow: {
    height: 70,
    backgroundColor: "white!important",
    "&:first-child td": {
      paddingTop: "8rem",
      paddingBottom: "8rem",
    },
  },

  columnCheckbox: {
    width: 64,
  },
}));

const THIS_TABLE_NAME = TableNames.TRACKED_URLS;

const ManageUrlsAdminTable = ({ filter }) => {
  const [tableData, setTableData] = useState(
    tableStore.getTableData(THIS_TABLE_NAME)
  );
  const [SelectedRows, setSelectedRows] = useState([]);
  const [DateRange, setDateRange] = useState(null);
  const [RowActionObject, setRowActionObject] = useState(null);
  const [rowMenuAnchorRef, setRowMenuAnchorRef] = React.useState(null);
  const HasTableData = tableData !== undefined;

  const confirm = useConfirm();
  const rowsPerPage = tableData.rowsPerPage;
  const page = tableData.page;
  const countryFilter = tableData.countryFilter;
  const dateRange = tableData.dateRange;
  let rows = tableData.rows;
  const toggleRowMenuOpen = (event, row) => {
    setRowMenuAnchorRef(event.currentTarget);
    setRowActionObject(row);
  };

  const handleRowMenuClose = (event) => {
    if (
      rowMenuAnchorRef.current &&
      rowMenuAnchorRef.current.contains(event.target)
    ) {
      return;
    }

    setRowMenuAnchorRef(null);
  };
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
        setSelectedRows(rows.map((row) => row.trackedUrlId));
      }
    }
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
  const registerEventListeners = () => {
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
  const retryThread = () => {
    let threadId = RowActionObject.trackedUrlId;
    setTimeout(() => {
      scrapingThreadsActions.retryThread(threadId);
    });
  };
  const _attachRowActionsMenu = () => {
    return (
      <Menu
        id={`row-actions-menu`}
        anchorEl={rowMenuAnchorRef}
        // keepMounted
        open={Boolean(rowMenuAnchorRef)}
        onClose={handleRowMenuClose}
      >
        <MenuItem
          // onClick={() => {
          //   handleRowMenuClose();
          //   //toggleCountryRenameDialog();
          // }}
          component={RouterLink}
          to={`/url-details/${RowActionObject.groupId}`}
        >
          View details
        </MenuItem>

        <MenuItem
          onClick={() => {
            confirm({
              title: "Confirm to retry crawling URL?",
              description:
                "If you proceed some of the scraped data will be deleted. Make sure you know what you're doing.",
            }).then(() => {
              retryThread();
              handleRowMenuClose();
            });

            //toggleCountryPickerDialog();
          }}
        >
          Retry
        </MenuItem>
      </Menu>
    );
  };
  const getTableData = () => {
    return tableStore.getTableData(THIS_TABLE_NAME) || tableData;
  };
  const refreshFunc = () => {
    const _tableData = getTableData();

    if (
      _tableData.isLoading ||
      parseInt(new Date() / 1000) - _tableData.age < 10
    ) {
      console.log("@@@@@ Skipping REFRESH");
      return;
    }
    syncTableData({});
  };
  useEffect(() => {
    // Create an interval that refreshes the page every X
    const refreshInterval = setInterval(refreshFunc, 5000);
    setTimeout(() => {
      syncTableData({});
    });

    const revokeEventListeners = registerEventListeners();

    return () => {
      clearInterval(refreshInterval);
      revokeEventListeners();
    };
  }, []);

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
  const _createRowActionsButton = (row) => {
    const key = row.trackedUrlId;
    return (
      <React.Fragment>
        <IconButton
          key={key}
          size="small"
          aria-haspopup="true"
          onClick={(event) => {
            toggleRowMenuOpen(event, row);
          }}
          aria-controls={`row-actions-menu`}
        >
          <MoreVertIcon />
        </IconButton>
      </React.Fragment>
    );
  };
  return (
    <React.Fragment>
      <ManageUrlsHeader
        rows={rows}
        SelectedRows={SelectedRows}
        selectAllRowsFunc={selectAllRows}
        deleteSelectedRowsFunc={deleteSelectedRows}
        refreshFunc={() => {
          syncTableData({ keepCurrentSettings: true });
        }}
        IsLoading={isLoadingResults}
        theme={theme}
      />
      <Table className={classes.table} aria-label="custom pagination table">
        {/* <LinearProgress
        variant="indeterminate"
        color="secondary"
        style={{ height: 2, opacity: IsLoadingResults ? "0.5" : 0 }}
      /> */}
        <colgroup>
          <col style={{ width: 64 }} />
          <col style={{ width: "70%" }} />
          <col style={{ width: "15%" }} />
          <col style={{ width: "15%" }} />
          <col style={{ width: 64 }} />
        </colgroup>
        <TableBody className={classes.tableBody}>
          {isLoadingResults && !hasInheritedRows
            ? [
                ...Array(rowsPerPage !== undefined ? rowsPerPage : 10).keys(),
              ].map((x) => (
                <TableRow key={x} style={{ height: 56 }}>
                  {/* <TableCell>
                  <Skeleton animation="wave" />
                </TableCell> */}
                  <div></div>
                  <TableCell>
                    <Skeleton animation="wave" />
                  </TableCell>
                  <TableCell>
                    <Skeleton animation="wave" />
                  </TableCell>
                  <TableCell>
                    <Skeleton animation="wave" />
                  </TableCell>
                  <div></div>
                </TableRow>
              ))
            : rows.map((row, index) => {
                const innerRow = (
                  <React.Fragment>
                    <TableCell width="64px">
                      <Checkbox
                        size="small"
                        checked={SelectedRows.includes(row.trackedUrlId)}
                        onChange={(evt) => {
                          onRowSelectionChanged(row.trackedUrlId);
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
                            {row.username}
                          </Typography>
                          <Link href={row.url} target="_blank">
                            {row.url}
                          </Link>
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
                    <TableCell style={{ width: 160 }} align="right">
                      <ScrapingThreadStatus row={row} />
                    </TableCell>
                    <TableCell component="th" scope="row" align="right">
                      {_createRowActionsButton(row)}
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
          {RowActionObject && _attachRowActionsMenu()}
        </TableBody>
      </Table>
      {rowsLength > 0 && (
        <div>
          <TablePagination
            style={{ width: "100%", float: "right" }}
            rowsPerPageOptions={[5, 8, 10, 25, 50, 100]}
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
        </div>
      )}
    </React.Fragment>
  );
};

export default ManageUrlsAdminTable;
