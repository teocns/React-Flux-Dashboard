import {
  Box,
  Checkbox,
  IconButton,
  Link,
  Menu,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TablePagination,
  TableRow,
  Typography,
} from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { MoreVert, Search } from "@material-ui/icons";
import { Skeleton } from "@material-ui/lab";
import clsx from "clsx";
import { useConfirm } from "material-ui-confirm";
import React, { useEffect, useState } from "react";
import hostsActions from "../../actions/Hosts";
import tableActions from "../../actions/Table";
import uiActions from "../../actions/UI";
import ScrapingThreadApi from "../../api/ScrapingThread";
import ActionTypes from "../../constants/ActionTypes";
import TableNames from "../../constants/Tables";
import Country from "../../models/Country";
import TableData from "../../models/TableData";
import tableStore from "../../store/Tables";
import MultifunctionalHeading from "../Table/MultifunctionalHeading";
import TablePaginationActions from "./Pagination";

import { Link as RouterLink } from "react-router-dom";
import { number_format } from "../../helpers/numbers";
const useStyles = makeStyles((theme) => ({
  tableContainer: {
    overflowY: "scroll",
    overflowX: "hidden",
  },
  table: {
    minWidth: 500,
    tableLayout: "fixed",
    overflowY: "auto",
    overflowX: "hidden",
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
    label: "Domain",
  },
  {
    name: "totalLinks",
    label: "Tracked URLs",
    align: "right",
  },
  {
    name: "scrapedJobs",
    label: "Scraped jobs",
    align: "right",
  },
  {
    name: "crawlerThreadsCount",
    label: "Times crawled",
    align: "right",
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
  }) => {
    tableActions.createTableData({
      rowsPerPage: newRowsPerPage !== undefined ? newRowsPerPage : rowsPerPage,
      page:
        newRowsPerPage !== -1 ? (newPage !== undefined ? newPage : page) : 0,
      filter: {
        domain: filter || "",
      },
      tableName: THIS_TABLE_NAME,
      sort: newSort,
      previousRowCount:
        tableData && tableData.totalRowsCount
          ? tableData.totalRowsCount
          : undefined,
      // dateRange: newDateRange !== undefined ? newDateRange : dateRange,
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
      syncTableData({});
    });

    return bindListeners();
  }, [filter]);

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
            Try changing filter settings
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
              No{rowsLength > 0 ? " more" : ""} portals found
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
      </Menu>
    );
  };

  const onSortChanged = ({ name, sort }) => {
    syncTableData({ newSort: { name, sort } });
  };

  return (
    <React.Fragment>
      <div className={classes.tableContainer}>
        <Table
          stickyHeader
          size="small"
          className={classes.table}
          aria-label="custom pagination table"
        >
          <colgroup>
            <col style={{ width: 64 }} />
            <col style={{ width: "40%" }} />
            <col style={{ width: "20%" }} />
            <col style={{ width: "20%" }} />
            <col style={{ width: "20%" }} />
            <col style={{ width: 128 }} />
          </colgroup>
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
                    <TableCell width="5%">
                      <Skeleton animation="wave" style={{ width: "75%" }} />
                    </TableCell>
                    <TableCell width="50%">
                      <Skeleton animation="wave" style={{ width: "75%" }} />
                    </TableCell>
                    <TableCell width="15%">
                      <Skeleton animation="wave" style={{ width: "75%" }} />
                    </TableCell>
                    <TableCell width="15%" align="right">
                      <Skeleton
                        animation="wave"
                        style={{
                          width: "75%",
                          display: "inline-block",
                        }}
                      />
                    </TableCell>
                    <TableCell width="15%" align="right">
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
                      <TableCell scope="row">
                        <Box display="inline-flex" alignItems="center">
                          <RouterLink
                            to={"/domain/" + row.domain}
                            style={{
                              color: theme.palette.text.primary,
                              textDecoration: "none",
                            }}
                          >
                            {row.domain}
                          </RouterLink>
                        </Box>
                      </TableCell>

                      <TableCell align="right">
                        {number_format(row.totalLinks, ".", ",")}
                      </TableCell>
                      <TableCell align="right">
                        {number_format(row.scrapedJobs, ".", ",")}
                      </TableCell>
                      <TableCell align="right">
                        <RouterLink
                          to={`/domain/${row.domain}`}
                          style={{
                            color: theme.palette.text.primary,
                            textDecoration: "none",
                          }}
                        >
                          {number_format(row.crawlerThreadsCount, ".", ",")}
                        </RouterLink>
                      </TableCell>

                      {/* <TableCell component="th" scope="row">
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
                    </TableCell> */}
                      <TableCell component="th" align="right">
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
        </Table>
      </div>
      {rowsLength > 0 && (
        <div>
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
        </div>
      )}
    </React.Fragment>
  );
};

export default DomainsManagementTable;
