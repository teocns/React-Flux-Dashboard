import { EventEmitter } from "events";
import dispatcher from "../dispatcher";
import ActionTypes from "../constants/ActionTypes";
import User from "../models/User";
import TableData from "../models/TableData";
import { getPanelId } from "@material-ui/lab";

const Errors = require("../constants/Errors");

class TableStore extends EventEmitter {
  /**
   * @type {Object.<string,TableData[]>}
   */
  #tables;

  /**
   * @type {Object.<string,string>}
   */
  #tables_name_hash_keypairs;

  /**
   * @type {string}
   */
  #current_table_name;
  constructor(params) {
    super(params);
    this.dispatchToken = undefined;
    this.#current_table_name = undefined;
    this.#tables = {};
    this.#tables_name_hash_keypairs = {};
  }
  addChangeListener(event, callback) {
    this.on(event, callback);
  }

  removeChangeListener(event, callback) {
    this.removeListener(event, callback);
  }

  emitChange(event, data) {
    this.emit(event, data);
  }

  /**
   * @returns {TableData}
   * @param {string} tableName
   */
  getTableData(tableName) {
    const tableHash = this.#tables_name_hash_keypairs[tableName];
    if (!tableHash) {
      const td = TableData.defaults(tableName);
      const cachedResult = this.getCachedRowsPerPage(tableName);
      if (cachedResult) {
        td.rowsPerPage = cachedResult;
      }
      return td;
    }
    return this.#tables[tableHash];
  }

  isLoadingTableData(tableName) {
    const td = this.getTableData(tableName);
    if (td instanceof TableData && td.isLoading) {
      return true;
    }
    return false;
  }

  /**
   *
   * @param {TableData} tableData
   */
  setTableLoading(tableData) {
    if (!this.hasTableData(tableData)) {
      this.#tables[tableData.tableName] = tableData;
    } else {
      this.#tables[tableData.tableName].isLoading = true;
    }
  }
  /**
   * @param {TableData} tableData
   */
  storeTableData(tableData) {
    this.#current_table_name = tableData.tableName;
    const previousTableData = this.getByTableName(tableData.tableName);
    if (previousTableData) {
      tableData.previousTableData = { ...previousTableData };
      this.deleteTableData(previousTableData.hash);
    }

    this.#tables_name_hash_keypairs[tableData.tableName] = tableData.hash;
    this.#tables[tableData.hash] = tableData;

    // Store settings for current table data
    console.log(">> CACHING", tableData.tableName, tableData.rowsPerPage);
    this.cacheRowsPerPage(tableData.tableName, tableData.rowsPerPage);
  }

  // cachePagination(tableName, page) {
  //   localStorage.setItem(`table_pagination_${tableName}`, page);
  // }

  // getCachedRowsPerPage(tableName) {
  //   localStorage.getItem(`table_pagination_${tableName}`);
  // }

  cacheRowsPerPage(tableName, rrp) {
    localStorage.setItem(`table_rowsperpage_${tableName}`, rrp);
  }

  getCachedRowsPerPage(tableName) {
    return parseInt(
      localStorage.getItem(`table_rowsperpage_${tableName}`) || 0
    );
  }

  deleteTableData(hash) {
    delete this.#tables[hash];
  }

  /**
   * @param {TableData} tableData
   */
  updateTableData(tableData) {
    tableData.age = parseInt(new Date() / 1000);
    this.#tables[tableData.hash] = tableData;
    console.log("newTabelData", this.#tables);
  }

  getByHash(tableHash) {
    return this.#tables[tableHash];
  }

  /**
   * @returns {TableData}
   * @param {string} tableName
   */
  getByTableName(tableName) {
    const foundHash = this.#tables_name_hash_keypairs[tableName];
    if (foundHash) {
      return this.getByHash(foundHash);
    }
  }

  addRow({ row, tableName }) {
    const tableData = this.getByTableName(tableName);
    if (!tableData) {
      // Wtf
      return;
    }
    tableData.rows = [row, ...tableData.rows];
    tableData.totalRowsCount++;
    // That's it
  }

  alterRow({ row, key, tableName }) {
    const tableData = this.getByTableName(tableName);
    if (!tableData) {
      // Wtf
      return;
    }
    const replaceable = tableData.rows.findIndex((c) => c[key] === row[key]);
    if (replaceable !== -1) {
      tableData.rows[replaceable] = row;
    }
  }

  getCurrentTableName() {
    return this.#current_table_name;
  }
}

const tableStore = new TableStore();

tableStore.dispatchToken = dispatcher.register((event) => {
  switch (event.actionType) {
    case ActionTypes.Table.DATA_CREATED:
      tableStore.storeTableData(event.data.tableData);
      break;
    case ActionTypes.Table.DATA_UPDATED:
      tableStore.updateTableData(event.data.tableData);
      break;
    case ActionTypes.Table.DATA_MODIFIED:
      const { row, key, tableNames } = event.data;
      const currentTable = tableStore.getCurrentTableName();
      if (tableNames.includes(currentTable)) {
        event.data.tableName = currentTable;
        tableStore.alterRow({ row, key, tableName: currentTable });
      }
      break;
    case ActionTypes.Table.ROW_ADDED:
      tableStore.addRow(event.data);
      break;
    default:
      break; // do nothing
  }
  tableStore.emitChange(event.actionType, event.data);
});

export default tableStore;
