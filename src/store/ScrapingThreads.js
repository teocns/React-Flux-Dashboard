import { EventEmitter } from "events";
import dispatcher from "../dispatcher";
import ActionTypes from "../constants/ActionTypes";
import ScrapingThread from "../models/ScrapingThread";
import TableData from "../models/TableData";
const Errors = require("../constants/Errors");

class ScrapingThreadsStore extends EventEmitter {
  /**
   * @type {ScrapingThread[]} threads
   */
  #threads;
  /**
   * Generally set to true whenever the client is waiting for thread creation feedback from the server
   * @type {boolean}
   */
  #add_track_url_is_busy;

  /**
   * @type {number}
   */
  #is_waiting_for_results;

  /**
   * @type {Object.<string,TableData>}
   */
  #tables;
  constructor(params) {
    super(params);
    this.#tables = {};

    this.#add_track_url_is_busy = true;
  }

  canAddUrl() {
    return this.#add_track_url_is_busy;
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
   * @param {ScrapingThread[]} threads
   */
  storeThreads(threads) {
    this.#threads = threads;
  }

  threadUpdated(threadId, threadData) {}

  storeSingleThread(thread) {
    this.#threads[thread.threadId] = thread;
  }

  getThreads() {
    return this.#threads;
  }

  hasTableData(tableName) {
    return Object.keys(this.#tables).includes(tableName);
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

  setLoadingResults(isWaiting) {
    this.#is_waiting_for_results = isWaiting;
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
   *
   * @param {TableData} tableData
   */
  setTableData(tableData) {
    console.log(tableData.rows);
    if (this.hasTableData(tableData.tableName)) {
      this.#tables[tableData.tableName].rows = tableData.rows;
      this.#tables[tableData.tableName].totalRowsCount =
        tableData.totalRowsCount;
      this.#tables[tableData.tableName].isLoading = false;
    }
  }
}

const scrapingThreadsStore = new ScrapingThreadsStore();

scrapingThreadsStore.dispatchToken = dispatcher.register((event) => {
  let willEmitChange = true;
  switch (event.actionType) {
    case ActionTypes.ScrapingThread.THREAD_CREATED:
      break;
    default:
      // Do nothing.
      willEmitChange = false;
      break;
  }
  willEmitChange &&
    scrapingThreadsStore.emitChange(event.actionType, event.data);
});

export default scrapingThreadsStore;
