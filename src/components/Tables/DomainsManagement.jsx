import React, { useState, useEffect } from "react";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { useConfirm } from "material-ui-confirm";
import MultifunctionalHeading from "../Table/MultifunctionalHeading";
import countriesActions from "../../actions/Countries";
import hostsActions from "../../actions/Hosts";
import DEFAULT_PARSING_REGEX from "../../constants/Scraper";
import {
  Badge,
  Box,
  Checkbox,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Menu,
  MenuItem,
  Link,
  Typography,
} from "@material-ui/core";

import uiActions from "../../actions/UI";
import ScrapingThreadApi from "../../api/ScrapingThread";
import tableStore from "../../store/Tables";
import scrapingThreadsStore from "../../store/ScrapingThreads";
import TablePaginationActions from "./Pagination";

import { Skeleton } from "@material-ui/lab";
import ActionTypes from "../../constants/ActionTypes";
import EditHostParsingRegexDialog from "../Dialogs/EditHostParsingRegex";
import {
  Delete,
  AssignmentTurnedIn as AssignmentTurnedInIcon,
  Search,
  MoreVert,
  Edit,
} from "@material-ui/icons";

import tableActions from "../../actions/Table";
import TableNames from "../../constants/Tables";
import TableData from "../../models/TableData";
import MultiFilter from "../Filters/MultiFilter";
import Country from "../../models/Country";

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 500,
  },
  editRegexIcon: {
    opacity: 0,
  },
  tableRow: {
    height: 70,
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
    '&:hover [name="editRegexIcon"]': {
      opacity: 1,
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

const THIS_TABLE_NAME = TableNames.DOMAINS_MANAGEMENT;
const COLUMNS = [
  {
    name: "host",
    label: "Host",
  },
  {
    name: "totalLinks",
    label: "Total parsed links",
  },
  {
    name: "scrapedJobs",
    label: "Scraped jobs",
  },
  {
    name: "linksWithoutJobSchema",
    label: "Links without jobs",
  },
  {
    name: "link_parsing_regex",
    label: "External link parsing regex",
    sortable: false,
  },
  {
    name: "actions",
    label: "",
    sortable: false,
  },
];
const DomainsManagementTable = ({ filter }) => {
  let [tableData, setTableData] = useState(
    tableStore.getTableData(THIS_TABLE_NAME)
  );
  /**
   * @type {Array.<Country,CallableFunction>}
   */
  const [HostParsingRegexDialogOpen, setHostParsingRegexDialogOpen] = useState(
    false
  );

  const [RowActionObject, setRowActionObject] = useState(null);
  const [rowMenuAnchorRef, setRowMenuAnchorRef] = React.useState(null);

  const [SelectedRows, setSelectedRows] = useState([]);
  const [DateRange, setDateRange] = useState(null);

  const toggleRowMenuOpen = (event, country) => {
    setRowActionObject(country);
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
    newSort,
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
      sort: newSort,
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

  // const onScrapingThreadCreated = () => {
  //   setTimeout(() => {
  //     syncTableData({ newPage: 0 });
  //   });
  // };

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

  const toggleHostParsingRegexDialog = () => {
    setHostParsingRegexDialogOpen(!HostParsingRegexDialogOpen);
  };

  const onHostParsingRegexDialogClosed = (regex) => {
    const hostId = RowActionObject.hostId;
    setHostParsingRegexDialogOpen(false);
    setTimeout(() => {
      setRowActionObject(null);
    }, 275);

    if (regex && regex !== setRowActionObject.link_parsing_regex) {
      hostsActions.changeRegex(hostId, regex);
    }

    // Handle chosenCountry
  };
  // const onCountryRenameDialogClosed = (newCountryName) => {
  //   setCountryRenameDialogOpen(false);
  //   if (
  //     typeof newCountryName === "string" &&
  //     newCountryName &&
  //     newCountryName.trim().toLowerCase() !== newCountryName
  //   ) {
  //     countriesActions.renameCountry(
  //       RowActionCountryObject.countryId,
  //       newCountryName.trim()
  //     );
  //   }
  //   setRowActionCountryObject(null);
  //   // Handle chosenCountry
  // };

  const viewJobYieldingLinksExample = () => {
    let hostId = RowActionObject.hostId;
    let handle = window.open(
      `https://api2-scrapers.bebee.com/hosts/${hostId}/job-yielding-sample`,
      "_blank"
    );
    handle.focus();
  };

  const viewHtmlSample = () => {
    let hostId = RowActionObject.hostId;
    let handle = window.open(
      `https://api2-scrapers.bebee.com/hosts/${hostId}/view-html-sample`,
      "_blank"
    );
    handle.focus();
  };
  const testRegex = () => {
    let hostId = RowActionObject.hostId;
    let handle = window.open(
      `https://api2-scrapers.bebee.com/hosts/${hostId}/test-regex`,
      "_blank"
    );
    handle.focus();
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
        {/* <MenuItem
          onClick={() => {
            handleRowMenuClose();
            HostParsingRegexDialog();
          }}
        >
          Rename
        </MenuItem>

        <MenuItem
          onClick={() => {
            handleRowMenuClose();
            toggleHostParsingRegexDialog();
          }}
        >
          Mark as alias of..
        </MenuItem> */}
        <MenuItem onClick={handleRowMenuClose}>Generate XML</MenuItem>
        <MenuItem
          onClick={() => {
            viewJobYieldingLinksExample();
            handleRowMenuClose();
          }}
        >
          View links with job schema
        </MenuItem>

        <MenuItem
          onClick={() => {
            viewHtmlSample();
            handleRowMenuClose();
          }}
        >
          View HTML sample
        </MenuItem>

        <MenuItem
          onClick={() => {
            testRegex();
            handleRowMenuClose();
          }}
        >
          Test Regex
        </MenuItem>
      </Menu>
    );
  };

  const onSortChanged = ({ name, sort }) => {
    syncTableData({ newSort: { name, sort } });
  };

  return (
    <React.Fragment>
      <Table className={classes.table} aria-label="custom pagination table">
        {/* <LinearProgress
        variant="indeterminate"
        color="secondary"
        style={{ height: 2, opacity: IsLoadingResults ? "0.5" : 0 }}
      /> */}
        <MultifunctionalHeading
          columns={COLUMNS}
          sort={tableData && tableData.sort}
          onSortChanged={onSortChanged}
        />
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
                        <Link href={"https://" + row.host} target="_blank">
                          {row.host}
                        </Link>
                      </Box>
                    </TableCell>

                    <TableCell component="th" scope="row">
                      {row.totalLinks}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row.scrapedJobs}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row.linksWithoutJobSchema}
                    </TableCell>

                    <TableCell component="th" scope="row">
                      <Box display="inline-flex" alignItems="center">
                        <Box display="flex" flexDirection="column">
                          <code style={{ fontWeight: "400" }}>
                            {row.link_parsing_regex
                              ? row.link_parsing_regex
                              : DEFAULT_PARSING_REGEX}
                          </code>
                        </Box>
                        <IconButton
                          name="editRegexIcon"
                          className={classes.editRegexIcon}
                          size="small"
                          style={{ marginLeft: theme.spacing(1) }}
                          onClick={(event) => {
                            setRowActionObject(row);

                            setTimeout(() => {
                              toggleHostParsingRegexDialog();
                            });
                          }}
                        >
                          <Edit style={{ height: 16, width: 16 }} />
                        </IconButton>
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
      <EditHostParsingRegexDialog
        open={HostParsingRegexDialogOpen}
        onClose={onHostParsingRegexDialogClosed}
        host={RowActionObject && RowActionObject.host}
        originalRegex={RowActionObject && RowActionObject.link_parsing_regex}
      />
    </React.Fragment>
  );
};

export default DomainsManagementTable;
