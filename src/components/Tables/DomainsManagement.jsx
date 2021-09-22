import DomainsApi from "../../api/Domains";
import {
  Box,
  Checkbox,
  IconButton,
  Menu,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TablePagination,
  TableRow,
  Switch,
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
    name: "is_enabled",
    label: "Enable crawling",
    sortable: false,
  },
];

/**
 * @typedef {Object} DomainsManagementTableFilter
 * @property {string} domain
 * @property {string} users
 */

/**
 * @param {Object} param0
 * @param {DomainsManagementTableFilter} param0.filter
 */
const DomainsManagementTable = ({ filter }) => {
  const [Table_Page, setTable_Page] = useState(0);
  const [Table_LastStep, setTable_LastStep] = useState(1);
  const [Table_LastEvaluatedKey_History, setTable_LastEvaluatedKey_History] =
    useState([]);
  const [IsLoading, setIsLoading] = useState(true);
  const [RowsPerPage, setRowsPerPage] = useState(
    uiStore.getDefaultTableRowsPerPage()
  );
  let [tableData, setTableData] = useState(
    tableStore.getTableData(THIS_TABLE_NAME)
  );
  /**
   * @type {Array.<Country,CallableFunction>}
   */
  const [HostParsingRegexDialogOpen, setHostParsingRegexDialogOpen] =
    useState(false);

  const [RowActionObject, setRowActionObject] = useState(null);

  const [Rows, setRows] = useState([]);
  const [rowMenuAnchorRef, setRowMenuAnchorRef] = React.useState(null);

  const [SelectedRows, setSelectedRows] = useState([]);
  const [DateRange, setDateRange] = useState(null);

  const toggleRowMenuOpen = (event, country) => {
    setRowActionObject(country);
    setRowMenuAnchorRef(event.currentTarget);
  };

  const onRowsPerPageChanged = (data) => {
    setTable_LastEvaluatedKey_History([]);
    setTable_Page(0);
    setRowsPerPage(data);
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

  const confirm = useConfirm();
  const rowsPerPage = RowsPerPage;
  const page = tableData.page;

  const dateRange = tableData.dateRange;
  let rows = tableData.Items;

  const IsLoadingResults = tableData.isLoading || !tableData || !tableData.rows;
  let hasInheritedRows = false;
  // if (IsLoadingResults && tableData.previousTableData) {
  //   rows = tableData.previousTableData.rows;
  //   hasInheritedRows = true;
  // }

  const isLoadingResults = tableData ? tableData.isLoading : true;
  const rowsLength = Array.isArray(rows) ? rows.length : 0;
  const classes = useStyles();
  const emptyRows =
    rowsPerPage -
    Math.min(rowsPerPage, rowsLength - page * rowsPerPage) +
    (rowsLength > 1 ? 0 : 1);

  const onTableDataReceived = (td) => {
    setIsLoading(false);
    const { LastEvaluatedKey, step, ScanIndexForward, Items } = td;
    setTable_Page(Table_Page + step);
    console.log("TablePage", Table_Page);
    setTable_LastStep(step);
    if (step === 1) {
      if (LastEvaluatedKey && !(Table_Page === 1)) {
        setTable_LastEvaluatedKey_History([
          ...Table_LastEvaluatedKey_History,
          LastEvaluatedKey,
        ]);
      }
    }
    setTableData(td);
  };

  const syncTableData = ({ step }) => {
    setIsLoading(true);
    if (step === 1) {
      DomainsApi.GetTable({
        step,
        filter,
        LastEvaluatedKey: tableData.LastEvaluatedKey,
      }).then(onTableDataReceived);
    } else if (step === -1) {
      if (Table_LastStep === 1) {
        Table_LastEvaluatedKey_History.pop();
        setTable_LastEvaluatedKey_History([...Table_LastEvaluatedKey_History]);
      }
      const lastEvalKey = Table_LastEvaluatedKey_History.pop();
      setTable_LastEvaluatedKey_History([...Table_LastEvaluatedKey_History]);
      DomainsApi.GetTable({
        step,
        filter,
        LastEvaluatedKey: lastEvalKey,
      }).then(onTableDataReceived);
    } else {
      DomainsApi.GetTable({ filter, step: 1 }).then(onTableDataReceived);
    }
  };

  const handleChangePage = (step) => {
    syncTableData({ step });
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    uiActions.changeTableRowsPerPage(newRowsPerPage);
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
    uiStore.addChangeListener(
      ActionTypes.Table.ROWS_PER_PAGE_CHANGED,
      onRowsPerPageChanged
    );
    // tableStore.addChangeListener(
    //   ActionTypes.Table.DATA_CREATED,
    //   onTableRowsDataUpdated
    // );
    // tableStore.addChangeListener(
    //   ActionTypes.Table.DATA_UPDATED,
    //   onTableRowsDataUpdated
    // );
    // return () => {
    //   tableStore.removeChangeListener(
    //     ActionTypes.Table.DATA_CREATED,
    //     onTableRowsDataUpdated
    //   );
    //   tableStore.removeChangeListener(
    //     ActionTypes.Table.DATA_UPDATED,
    //     onTableRowsDataUpdated
    //   );
    // };
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
  }, [filter, RowsPerPage]);

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

  const toggleDomainCrawlingEnabled = ({ domain, previous_is_enabled }) => {
    DomainsApi.ToggleCrawlingEnabled({ domain, previous_is_enabled }).then(
      (data) => {
        const newTable = { ...tableData };
        let updateIndex = undefined;

        for (let i = 0; i < newTable.Items.length; i++) {
          if (newTable["Items"][i].domain === domain) {
            updateIndex = i;
            break;
          }
        }
        if (updateIndex !== undefined) {
          newTable["Items"][updateIndex]["is_enabled"] =
            data.Attributes.is_enabled;
        }
        setTableData(newTable);
      }
    );
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
            //viewJobYieldingLinksExample();
            handleRowMenuClose();
          }}
        >
          View links with job schema
        </MenuItem>

        <MenuItem
          onClick={() => {
            // viewHtmlSample();
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
            {/* <col style={{ width: 64 }} /> */}
            <col style={{ width: "40%" }} />
            <col style={{ width: "20%" }} />
            <col style={{ width: "20%" }} />
            <col style={{ width: "20%" }} />
            <col style={{ width: 128 }} />
          </colgroup>
          <MultifunctionalHeading
            hideChecker
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
                          checked={SelectedRows.includes(row.threadId)}
                          onChange={(evt) => {
                            onRowSelectionChanged(row.threadId);
                          }}
                        />
                      </TableCell> */}
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
                        {number_format(row.TRACKED_URLS, ".", ",")}
                      </TableCell>

                      <TableCell align="right">
                        {number_format(row.cnt_scraped_jobs, ".", ",")}
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
                      <TableCell align="right">
                        <div>
                          <Switch
                            checked={row.is_enabled}
                            onChange={() => {
                              toggleDomainCrawlingEnabled({
                                domain: row.domain,
                                previous_is_enabled: row.is_enabled,
                              });
                            }}
                            size="small"
                            color="secondary"
                            inputProps={{
                              "aria-label": "checkbox with default color",
                            }}
                          />
                        </div>
                      </TableCell>
                      {/* <TableCell component="th" align="right">
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
        <div
          style={{
            pointerEvents: IsLoading ? "none" : "auto",
            //backgroundColor: IsLoading ? "black" : "white",
          }}
        >
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

export default DomainsManagementTable;
