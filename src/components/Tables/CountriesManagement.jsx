import {
  Badge,
  Box,
  Checkbox,
  IconButton,
  Menu,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
} from "@material-ui/core";
import Chip from "@material-ui/core/Chip";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { Delete, MoreVert, Search } from "@material-ui/icons";
import AssignmentTurnedIn from "@material-ui/icons/AssignmentTurnedIn";
import WarningIcon from "@material-ui/icons/Warning";
import { Skeleton } from "@material-ui/lab";
import clsx from "clsx";
import { useConfirm } from "material-ui-confirm";
import React, { useEffect, useState } from "react";
import countriesActions from "../../actions/Countries";
import tableActions from "../../actions/Table";
import uiActions from "../../actions/UI";
import ScrapingThreadApi from "../../api/ScrapingThread";
import ActionTypes from "../../constants/ActionTypes";
import TableNames from "../../constants/Tables";
import Country from "../../models/Country";
import TableData from "../../models/TableData";
import tableStore from "../../store/Tables";
import CountryPickerDialog from "../Dialogs/CountryPicker";
import RenameDialog from "../Dialogs/Rename";
import MultiFilter from "../Filters/MultiFilter";
import TablePaginationActions from "./Pagination";

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

  countryChipContainer: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    listStyle: "none",
    padding: theme.spacing(0.5),
    margin: 0,
  },
  countryChip: {
    margin: 0,
    marginRight: theme.spacing(0.5),
  },
}));

const THIS_TABLE_NAME = TableNames.COUNTRIES_MANAGEMENT;

const CountriesManagementTable = ({ filter }) => {
  let [tableData, setTableData] = useState(
    tableStore.getTableData(THIS_TABLE_NAME)
  );
  /**
   * @type {Array.<Country,CallableFunction>}
   */
  const [CountryPickerDialogOpen, setCountryPickerDialogOpen] = useState(false);
  const [CountryRenameDialogOpen, setCountryRenameDialogOpen] = useState(false);

  const [RowActionCountryObject, setRowActionCountryObject] = useState(null);
  const [rowMenuAnchorRef, setRowMenuAnchorRef] = React.useState(null);

  const [SelectedRows, setSelectedRows] = useState([]);
  const [DateRange, setDateRange] = useState(null);

  const toggleRowMenuOpen = (event, country) => {
    setRowActionCountryObject(country);
    setRowMenuAnchorRef(event.currentTarget);
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

  const reSync = () => {
    setTimeout(() => {
      syncTableData({});
    });
  };

  const bindListeners = () => {
    tableStore.addChangeListener(
      ActionTypes.Table.DATA_CREATED,
      onTableRowsDataUpdated
    );
    tableStore.addChangeListener(
      ActionTypes.CountryFilter.COUNTRY_FILTER_SYNC,
      reSync
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
        ActionTypes.CountryFilter.COUNTRY_FILTER_SYNC,
        reSync
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
  const toggleCountryPickerDialog = () => {
    setCountryPickerDialogOpen(!CountryPickerDialogOpen);
  };
  const toggleCountryRenameDialog = () => {
    setCountryRenameDialogOpen(!CountryRenameDialogOpen);
  };

  const onCountryPickerDialogClosed = (chosenCountryId) => {
    setCountryPickerDialogOpen(false);

    if (chosenCountryId) {
      setTimeout(() => {
        countriesActions.setCountriesAsAlias(
          [RowActionCountryObject.countryId],
          chosenCountryId
        );
      });
    }
    setRowActionCountryObject(null);
    // Handle chosenCountry
  };
  const onCountryRenameDialogClosed = (newCountryName) => {
    setCountryRenameDialogOpen(false);
    if (
      typeof newCountryName === "string" &&
      newCountryName &&
      newCountryName.trim().toLowerCase() !== newCountryName
    ) {
      countriesActions.renameCountry(
        RowActionCountryObject.countryId,
        newCountryName.trim()
      );
    }
    setRowActionCountryObject(null);
    // Handle chosenCountry
  };
  const _createRowActionsButton = (country) => {
    const key = country.countryId;
    return (
      <React.Fragment>
        <IconButton
          size="small"
          aria-haspopup="true"
          onClick={(event) => {
            toggleRowMenuOpen(event, country);
          }}
          aria-controls={`row-actions-menu`}
        >
          <MoreVert />
        </IconButton>
      </React.Fragment>
    );
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
          onClick={() => {
            handleRowMenuClose();
            toggleCountryRenameDialog();
          }}
        >
          Rename
        </MenuItem>

        <MenuItem
          onClick={() => {
            handleRowMenuClose();
            toggleCountryPickerDialog();
          }}
        >
          Mark as alias of..
        </MenuItem>
        <MenuItem onClick={handleRowMenuClose}>Generate XML</MenuItem>
      </Menu>
    );
  };

  return (
    <React.Fragment>
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
                      <Badge
                        badgeContent={SelectedRows.length}
                        color="secondary"
                      >
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
                    disableCountries={true}
                    disableUsers={true}
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
            ? [
                ...Array(rowsPerPage !== undefined ? rowsPerPage : 10).keys(),
              ].map((x) => (
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
              ))
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
                      <Box display="inline-flex" alignItems="center">
                        {row.name.length < 3 && (
                          <Tooltip title="Possible alias identified">
                            <WarningIcon
                              style={{
                                marginRight: theme.spacing(1),
                                width: 18,
                                height: 18,
                                color: "red",
                              }}
                            />
                          </Tooltip>
                        )}
                        {row.name}
                      </Box>
                    </TableCell>

                    <TableCell component="th" scope="row">
                      {row.aliases && (
                        <Box display="flex" flexDirection="column">
                          <Typography
                            variant="caption"
                            style={{ color: theme.palette.text.hint }}
                          >
                            Aliases
                          </Typography>
                          <Box display="inline-flex">
                            {row.aliases.map((alias) => {
                              return (
                                <div key={alias.countryId}>
                                  <Chip
                                    label={alias.name}
                                    onDelete={() => {
                                      confirm({
                                        title: "Confirm removing alias  ",
                                        description: `If you proceed, "${alias.name}" won't be an alias of "${row.name}" and both will be treated as separate countries.`,
                                      }).then(() => {
                                        countriesActions.unmarkCountryAlias(
                                          alias.countryId
                                        );
                                      });
                                    }}
                                    className={classes.countryChip}
                                  />
                                </div>
                              );
                            })}
                          </Box>
                        </Box>
                      )}
                    </TableCell>
                    <TableCell>
                      <Box display="inline-flex" alignItems="center">
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
                          {row.totalJobs} jobs
                        </Typography>
                      </Box>
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
          {/* Row actions menu */}
          {_attachRowActionsMenu()}
          {/* Row actions menu */}
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
      <RenameDialog
        open={CountryRenameDialogOpen}
        country={RowActionCountryObject}
        onClose={onCountryRenameDialogClosed}
      />
      <CountryPickerDialog
        markAsAlias={RowActionCountryObject}
        open={CountryPickerDialogOpen}
        onClose={onCountryPickerDialogClosed}
      />
    </React.Fragment>
  );
};

export default CountriesManagementTable;
