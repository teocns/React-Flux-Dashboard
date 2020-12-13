import ActionTypes from "../constants/ActionTypes";
import dispatcher from "../dispatcher";
import TableData from "../models/TableData";
import sessionStore from "../store/session";
import tableStore from "../store/Tables";

/**
 * @returns {TableData}
 * @param {TableData} param0
 */
const createTableData = ({
  tableName,
  filter,
  page,
  rowsPerPage,
  previousRowCount,
  countryFilter,
  dateRange,
}) => {
  const createdTableData = new TableData({
    tableName,
    filter,
    rowsPerPage,
    page,
    isLoading: true,
    totalRowsCount: previousRowCount !== undefined ? previousRowCount : -1,
    rows: [],
    dateRange,
    countryFilter,
  });

  console.log("createdTableData", createdTableData);
  dispatcher.dispatch({
    actionType: ActionTypes.Table.DATA_CREATED,
    data: {
      tableData: createdTableData,
    },
  });
};

/**
 *
 * @param {TableData} tableData
 */
const onTableDataReceived = (tableData) => {
  dispatcher.dispatch({
    actionType: ActionTypes.Table.DATA_UPDATED,
    data: { tableData },
  });
};

const onRowAdded = ({ row, tableName }) => {
  dispatcher.dispatch({
    actionType: ActionTypes.Table.ROW_ADDED,
    data: { row, tableName },
  });
};

// eslint-disable-next-line import/no-anonymous-default-export
export default { createTableData, onTableDataReceived, onRowAdded };
