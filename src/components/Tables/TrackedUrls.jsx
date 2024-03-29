import {
  Box,
  Checkbox,
  CircularProgress,
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
import AccessTimeIcon from "@material-ui/icons/AccessTime";
import { Skeleton } from "@material-ui/lab";
import clsx from "clsx";
import KeyMirror from "keymirror";
import { useConfirm } from "material-ui-confirm";
import React, { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import tableActions from "../../actions/Table";
import uiActions from "../../actions/UI";
import ScrapingThreadApi from "../../api/ScrapingThread";
import ActionTypes from "../../constants/ActionTypes";
import TableNames from "../../constants/Tables";
import { number_format } from "../../helpers/numbers";
import {
  getTimeRemaining,
  prettyPrintDate,
  timeSince,
} from "../../helpers/time";
import TableData from "../../models/TableData";
import tableStore from "../../store/Tables";
import MultifunctionalHeading from "../Table/MultifunctionalHeading";
import TablePaginationActions from "./Pagination";

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

const THIS_TABLE_NAME = TableNames.MANAGE_URLS;
const COLUMNS = [
  {
    name: "age",
    label: "Tracked at",
    align: "right",
  },
  {
    name: "url",
    label: "URL",
    sortable: false,
  },

  {
    name: "total_scraped_jobs",
    label: "Total jobs",
    align: "right",
  },
  {
    name: "crawler_threads_cnt",
    label: "Times crawled",
    align: "right",
  },
  {
    name: "crawler_threads_cnt",
    label: "Latest crawl",
    hint: "X jobs scraped / out of X crawled links",
    align: "right",
    colspan: 2,
  },
  {
    name: "Score",
    label: "Next crawl",
    align: "right",
  },
  {
    name: "actions",
    label: "",
    sortable: false,
  },
];
const ManageUrlsTable = ({ filter, multiUser = false, onLoaded }) => {
  let [tableData, setTableData] = useState(
    tableStore.getTableData(THIS_TABLE_NAME)
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
        setSelectedRows(rows.map((row) => row.url_id));
      }
    }
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
      filter: filter || {},
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
      onLoaded && onLoaded();
      setTableData(foundTable);
    }
  };

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
      syncTableData({});
    });

    return bindListeners();
  }, [filter]);

  // const handleCountryFilterChanged = (_countryFilter) => {
  //   syncTableData({ newCountryFilter: _countryFilter });
  // };
  // const handleDateFilterChanged = (_dateRange) => {
  //   syncTableData({ newDateRange: _dateRange });
  // };

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
      <TableCell colspan="9">
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

  const CrawlingStatuses = KeyMirror({
    IS_CRAWLING: null,
    HAS_BEEN_CRAWLED: null,
    NOT_PROCESSED: null,
  });

  const calculateCrawlingStatus = (row) => {
    if (row.crawler_threads_last_completed_age === null) {
      if (!row.crawler_threads_cnt) {
        return CrawlingStatuses.NOT_PROCESSED;
      } else {
        return CrawlingStatuses.IS_CRAWLING;
      }
    } else {
      return CrawlingStatuses.HAS_BEEN_CRAWLED;
    }
  };

  const makeNextCrawl = (row) => {
    const crawlingStatus = calculateCrawlingStatus(row);
    switch (crawlingStatus) {
      case CrawlingStatuses.NOT_PROCESSED:
        return "Not yet processed";
      case CrawlingStatuses.IS_CRAWLING:
        return (
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            Crawling now{" "}
            <CircularProgress
              style={{
                width: 14,
                height: 14,
                color: theme.palette.text.disabled,
                marginLeft: theme.spacing(1),
              }}
            />
          </div>
        );
      case CrawlingStatuses.HAS_BEEN_CRAWLED:
        const targetDate =
          row.crawler_threads_last_completed_age + row.recrawling_delay;

        return (
          <div
            style={{
              color: theme.palette.text.hint,
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            <Typography
              variant="overline"
              style={{ textTransform: "lowercase" }}
            >
              {`${getTimeRemaining(targetDate, true)} `}
            </Typography>
            <AccessTimeIcon
              fontSize="small"
              style={{ marginLeft: theme.spacing(1) }}
            />
          </div>
        );
        break;
    }
  };

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
        <MenuItem
          // onClick={() => {
          //   handleRowMenuClose();
          //   //toggleCountryRenameDialog();
          // }}
          component={RouterLink}
          to={`/tracked-url/${RowActionObject && RowActionObject.url_id}`}
        >
          View details
        </MenuItem>
      </Menu>
    );
  };

  const makeLatestCrawl = (row, colNum) => {
    if (
      !row.crawler_threads_cnt ||
      (row.crawler_threads_cnt === 1 && !row.crawler_threads_last_completed_age)
    ) {
      if (colNum === 2) {
        return "Never";
      }
    } else {
      if (colNum === 1) {
        return (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              transform: "translateY(-8px)",
            }}
          >
            <Typography
              variant="caption"
              style={{ color: theme.palette.text.hint }}
            >
              Links found:
            </Typography>
            {row.crawler_threads_last_links_cnt}
          </div>
        );
      } else {
        return (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Typography
                variant="caption"
                style={{ color: theme.palette.text.hint }}
              >
                Jobs scraped:
              </Typography>
              {row.crawler_threads_last_jobs_cnt}
            </div>

            <Typography
              variant="caption"
              style={{ color: theme.palette.text.disabled }}
            >
              {timeSince(row.crawler_threads_last_completed_age)}
            </Typography>
          </div>
        );
      }
    }
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
            <col style={{ width: 54 }} />
            <col style={{ width: 128 }} />
            <col style={{ width: "100%" }} />
            <col style={{ width: 96 }} />
            <col style={{ width: 128 }} />
            <col style={{ width: 132 }} />
            <col style={{ width: 132 }} />
            <col style={{ width: 170 }} />
            <col style={{ width: 54 }} />
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
                          checked={SelectedRows.includes(row.url_id)}
                          onChange={(evt) => {
                            onRowSelectionChanged(row.url_id);
                          }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <div
                          style={{ display: "flex", flexDirection: "column" }}
                        >
                          <Typography
                            variant="caption"
                            style={{ color: theme.palette.text.hint }}
                          >
                            {prettyPrintDate(row.age)}
                          </Typography>
                          <Typography
                            variant="caption"
                            style={{ color: "rgb(132 132 132)" }}
                          >
                            {timeSince(row.age)}
                          </Typography>
                        </div>
                      </TableCell>

                      <TableCell scope="row">
                        <div
                          style={{
                            alignItems: "center",
                            overflow: "hidden",
                            display: "block",
                            textOverflow: "ellipsis",
                          }}
                        >
                          <Link
                            href={"https://" + row.url}
                            target="_blank"
                            style={{ textOverflow: "ellipsis" }}
                          >
                            {row.url}
                          </Link>
                        </div>
                      </TableCell>

                      <TableCell align="right">
                        {number_format(row.total_scraped_jobs, 0, ".", ",")}
                      </TableCell>
                      <TableCell align="right">
                        {row.crawler_threads_cnt}
                      </TableCell>

                      <TableCell align="right">
                        {makeLatestCrawl(row, 1)}
                      </TableCell>
                      <TableCell align="right">
                        {makeLatestCrawl(row, 2)}
                      </TableCell>

                      <TableCell align="right">{makeNextCrawl(row)}</TableCell>

                      <TableCell align="right">
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
            colSpan={9}
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

export default ManageUrlsTable;
