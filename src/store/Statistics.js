import { EventEmitter } from "events";
import dispatcher from "../dispatcher";
import ActionTypes from "../constants/ActionTypes";
import User from "../models/User";
import TableData from "../models/TableData";
import Statistics from "../Shared/BBE-CRWL.WebApp.Shared.Models/Statistics/index";
import StatisticsSyncRequest from "../Shared/BBE-CRWL.WebApp.Shared.Models/Statistics/SyncRequest";
import DateRanges from "../constants/DateRanges";

const Errors = require("../constants/Errors");

class StatisticsStore extends EventEmitter {
  /**
   * @type {Statistics}
   */
  #statistics;

  #availableCountries;
  #availableUsers;

  #lastSync;
  #lastRequestData;

  constructor(params) {
    super(params);
    this.#statistics = {};
    this.#availableUsers = undefined;
    this.#availableCountries = undefined;
    this.#lastSync = undefined;
    this.#lastRequestData = undefined;
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

  getTrackedUrls() {
    return this.#statistics.trackedUrls;
  }

  getInsertedJobs() {
    return this.#statistics.scrapedJobs;
  }

  hasStats(userId) {
    if (!this.#statistics) {
      return false;
    }
    if (userId && this.#statistics.userId !== userId) {
      return false;
    }
    return true;
  }

  getLastSyncRequest() {
    return this.#lastSync;
  }

  onSyncRequested(requestData) {
    this.#lastRequestData = requestData;
    this.#lastSync = parseInt(Date.now());
  }

  canSync(syncStatisticsData) {
    // If 5 seconds have not passed and requesting data was unaltered, leave it for the same
    if (
      parseInt(Date.now()) - this.#lastSync < 500 &&
      this.#lastRequestData &&
      syncStatisticsData
    ) {
      console.log(
        "TIme passed since last sync: ",
        parseInt(Date.now()) - this.#lastSync
      );
      let a = JSON.stringify(this.#lastRequestData);

      let b = JSON.stringify(syncStatisticsData);

      if (a === b) {
        return false;
      }
    }
    return true;
  }

  /**
   *
   * @param {Statistics} statistics
   */
  storeStats(statistics) {
    const { syncRequest } = statistics;

    const index = JSON.stringify(syncRequest);
    this.#statistics[index] = statistics;
  }

  /**
   * @returns {Statistics}
   */
  getStatistics(syncRequest) {
    const index = JSON.stringify(syncRequest);
    return this.#statistics[index];
  }

  getAvailableUsers() {
    return this.#availableUsers;
  }

  getAvailableCountries() {
    return this.#availableCountries;
  }
}

const statisticsStore = new StatisticsStore();

statisticsStore.dispatchToken = dispatcher.register((event) => {
  let willEmitChange = true;
  switch (event.actionType) {
    case ActionTypes.Statistics.STATISTICS_SYNC:
      statisticsStore.onSyncRequested(event.data);
      break;
    case ActionTypes.Statistics.STATISTICS_RECEIVED:
      statisticsStore.storeStats(event.data.statistics);
      break;
    default:
      willEmitChange = false;
      break;
  }
  statisticsStore.emitChange(event.actionType, event.data);
});

export default statisticsStore;
