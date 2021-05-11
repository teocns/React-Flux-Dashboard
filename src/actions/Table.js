import ActionTypes from "../constants/ActionTypes";
import dispatcher from "../dispatcher";
import TableData from "../models/TableData";
import sessionStore from "../store/session";
import tableStore from "../store/Tables";

/**
 * @returns {TableData}
 * @param {TableData} param0
 */
const createTableData = (data) => {
  // const {
  //   tableName,
  //   filter,
  //   page,
  //   rowsPerPage,
  //   sort,
  //   previousRowCount,
  //   countryFilter,
  //   dateRange,
  // } = data;
  const createdTableData = new TableData({
    ...data,
    isLoading: true,
    rows: [],
    totalRowsCount:
      data.previousRowCount !== undefined ? data.previousRowCount : -1,
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
