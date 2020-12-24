import { EventEmitter } from "events";
import dispatcher from "../dispatcher";
import ActionTypes from "../constants/ActionTypes";
import User from "../models/User";
import TableData from "../models/TableData";

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

  constructor(params) {
    super(params);
    this.dispatchToken = undefined;

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
    if (!Object.keys(this.#tables).includes(tableName)) {
      // Prepare table data object
      return undefined;
    }
    return this.#tables[tableName];
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
    const previousTableData = this.getByTableName(tableData.tableName);
    if (previousTableData) {
      tableData.previousTableData = { ...previousTableData };
      this.deleteTableData(previousTableData.hash);
    }

    this.#tables_name_hash_keypairs[tableData.tableName] = tableData.hash;
    this.#tables[tableData.hash] = tableData;
  }

  deleteTableData(hash) {
    delete this.#tables[hash];
  }
  /**
   * @param {TableData} tableData
   */
  updateTableData(tableData) {
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
      //const { row, key, tableName } = event;
      tableStore.alterRow(event.data);
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
