import configStore from "../../store/Config";
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
import uiActions from "../../actions/UI";
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

import TrackedUrlsApi from "../../api/TrackedUrls";
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
import uiStore from "../../store/UI";

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
    name: "row",
    label: "URL",
    align: "left",
  },

  {
    name: "total_scraped_jobs",
    label: "Jobs Extracted",
    align: "right",
  },
  {
    name: "crawler_threads_cnt",
    label: "Sub-Links Crawled",
    align: "right",
  },
  {
    name: "crawler_threads_cnt",
    label: "Duplicates skipped",
    align: "right",
  },
  {
    name: "crawler_threads_cnt",
    label: "Consumed bandwith",
    align: "right",
  },
  {
    name: "crawler_threads_cnt",
    label: "Finished at",
    align: "right",
    colspan: 2,
  },
];

var Table_LastEvaluatedKey_History = [];
var Table_LastStep = 1;
var Table_Page = 0;
const CrawlerThreadsTable = ({ crawler_process_id }) => {
  const [IsLoading, setIsLoading] = useState(true);
  const [RowsPerPage, setRowsPerPage] = useState(
    uiStore.getDefaultTableRowsPerPage()
  );

  const [tableData, setTableData] = useState(
    tableStore.getTableData(THIS_TABLE_NAME)
  );
  //tableStore.getTableData(THIS_TABLE_NAME)

  const [RowActionObject, setRowActionObject] = useState(null);
  const [rowMenuAnchorRef, setRowMenuAnchorRef] = React.useState(null);

  const [SelectedRows, setSelectedRows] = useState([]);

  const rows = (tableData && tableData.Items) || [];
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

  const IsLoadingResults = IsLoading;

  const rowsLength =
    tableData && Array.isArray(tableData.Items) ? tableData.Items.length : 0;
  const classes = useStyles();

  const onTableDataReceived = (td) => {
    setIsLoading(false);
    const { LastEvaluatedKey, step, ScanIndexForward, Items } = td;
    Table_Page += step;
    console.log("TablePage", Table_Page);
    Table_LastStep = step;
    if (step === 1) {
      if (LastEvaluatedKey && !(Table_Page === 1)) {
        Table_LastEvaluatedKey_History.push(LastEvaluatedKey);
      }
    }
    setTableData(td);
  };

  const syncTableData = ({ step }) => {
    setIsLoading(true);
    const limit = RowsPerPage;
    if (step === 1) {
      TrackedUrlsApi.GetCrawlerEventInfo({
        step,
        crawler_process_id,
        limit,
        LastEvaluatedKey: tableData.LastEvaluatedKey,
      }).then(onTableDataReceived);
    } else if (step === -1) {
      if (Table_LastStep === 1) {
        Table_LastEvaluatedKey_History.pop();
      }
      TrackedUrlsApi.GetCrawlerEventInfo({
        step,
        crawler_process_id,
        limit,
        LastEvaluatedKey: Table_LastEvaluatedKey_History.pop(),
      }).then(onTableDataReceived);
    } else {
      TrackedUrlsApi.GetCrawlerEventInfo({
        step: 1,
        limit,
        crawler_process_id,
      }).then(onTableDataReceived);
    }
  };

  const handleChangePage = (event, newPage) => {
    console.log("handleChangePage.newPage", newPage);
    syncTableData({ newPage });
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    uiActions.changeTableRowsPerPage(newRowsPerPage);
  };

  const reSync = () => {
    setTimeout(() => {
      syncTableData({});
    });
  };

  const onRowsPerPageChanged = (data) => {
    setRowsPerPage(data);
  };

  const bindListeners = () => {
    uiStore.addChangeListener(
      ActionTypes.Table.ROWS_PER_PAGE_CHANGED,
      onRowsPerPageChanged
    );
    // // tableStore.addChangeListener(
    // //   ActionTypes.CountryFilter.COUNTRY_FILTER_SYNC,
    // //   reSync
    // // );
    // tableStore.addChangeListener(
    //   ActionTypes.Table.DATA_UPDATED,
    //   onTableRowsDataUpdated
    // );

    return () => {
      uiStore.removeChangeListener(
        ActionTypes.Table.ROWS_PER_PAGE_CHANGED,
        onRowsPerPageChanged
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
  }, [RowsPerPage]);

  // const handleCountryFilterChanged = (_countryFilter) => {
  //   syncTableData({ newCountryFilter: _countryFilter });
  // };
  // const handleDateFilterChanged = (_dateRange) => {
  //   syncTableData({ newDateRange: _dateRange });
  // };

  const theme = useTheme();

  const renderEmptyRows = () => {
    if (RowsPerPage === rowsLength) {
      return "";
    }
    const isJustFilling = rowsLength > 0;
    const hasFilterApplied =
      tableData.totalRowsCount < tableData.unfilteredRowsCount;
    const _renderHint = () => {
      if (!isJustFilling)
        return (
          <Typography variant="h6" style={{ color: theme.palette.text.hint }}>
            Please be patient
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
              No links scraped yet
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
          component={RouterLink}
          to={`/tracked-url/${RowActionObject && RowActionObject.url_id}`}
        >
          View details
        </MenuItem>
      </Menu>
    );
  };

  const isCompleted = (cp) => {
    let links = cp["links"];
    let duplicates = cp["duplicates"];
    let done_threads = cp["threads_done_cnt"];
    let real_threads_count = links - duplicates + 1;

    return done_threads >= real_threads_count;
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
            <col style={{ width: "100%" }} />
            <col style={{ width: 128 }} />
            <col style={{ width: 132 }} />
            <col style={{ width: 132 }} />
          </colgroup>
          <MultifunctionalHeading
            columns={COLUMNS}
            sort={tableData && tableData.sort}
            disableChecker={true}
            hideChecker={true}
            onSortChanged={() => {}}
          />
          <TableBody>
            {IsLoadingResults
              ? [...Array(RowsPerPage).keys()].map((x) => (
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
                      {/* <TableCell width="64px">
                        <Checkbox
                          size="small"
                          checked={SelectedRows.includes(row.thread_id)}
                          onChange={(evt) => {
                            onRowSelectionChanged(row.thread_id);
                          }}
                        />
                      </TableCell> */}
                      <TableCell align="right">
                        <div
                          style={{
                            display: "flex",
                            whiteSpace: "nowrap",
                            alignItems: "center",
                          }}
                        >
                          <Typography
                            component={Link}
                            href={row.url}
                            style={{ fontSize: 13, whiteSpace: "no-wrap" }}
                          >
                            {row.url}
                          </Typography>
                        </div>
                      </TableCell>

                      <TableCell align="right">
                        {number_format(row.jobs || 0, 0, ".", ",")}
                      </TableCell>
                      <TableCell align="right">
                        {number_format(
                          (row.threads_done_cnt || 0) - 1,
                          0,
                          ".",
                          ","
                        )}{" "}
                        / {number_format(row.links || 0, 0, ".", ",")}
                      </TableCell>

                      <TableCell align="right">
                        {number_format(row.duplicates || 0, 0, ".", ",")}
                      </TableCell>
                      <TableCell align="right">
                        {number_format(
                          (row.bytes || 0) / 1048576 || 0,
                          1,
                          ".",
                          ","
                        )}{" "}
                        MB
                      </TableCell>
                      <TableCell align="right">
                        {isCompleted(row) ? (
                          prettyPrintDate(row.last_thread_done_age)
                        ) : (
                          <CircularProgress
                            style={{
                              width: 16,
                              height: 16,
                              color: theme.palette.text.disabled,
                            }}
                          />
                        )}
                      </TableCell>

                      {/* <TableCell align="right">{makeNextCrawl(row)}</TableCell> */}
                      {/* 
                      <TableCell align="right">
                        {_createRowActionsButton(row)}
                      </TableCell> */}
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
            rowsPerPageOptions={[10, 25, 50, 100]}
            colSpan={3}
            count={-1}
            rowsPerPage={RowsPerPage}
            //page={page}
            labelDisplayedRows={() => {
              return "";
            }}
            SelectProps={{
              inputProps: { "aria-label": "rows per page" },
              native: true,
            }}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
            ActionsComponent={(props) => {
              return (
                <TablePaginationActions
                  backwardDisabled={Table_Page < 2}
                  forwardDisabled={!tableData.LastEvaluatedKey}
                  {...props}
                />
              );
            }}
          />
        </div>
      )}
    </React.Fragment>
  );
};

export default CrawlerThreadsTable;
