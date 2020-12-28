import { EventEmitter } from "events";
import dispatcher from "../dispatcher";
import ActionTypes from "../constants/ActionTypes";
import User from "../models/User";
import TableData from "../models/TableData";

const Errors = require("../constants/Errors");

class CountryFilterStore extends EventEmitter {
  /**
   * @type {Object.<number, string>}
   */
  #available_countries;
  #lastSync;
  constructor(params) {
    super(params);
    this.dispatchToken = undefined;
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

  get() {
    return this.#available_countries;
  }

  set(available_countries) {
    this.#available_countries = available_countries;
    this.#lastSync = parseInt(Date.now() / 1000);
  }
  lastSync() {
    return this.#lastSync;
  }
  requiresSync() {
    return !this.#lastSync;
  }
}

const countryFilterStore = new CountryFilterStore();

countryFilterStore.dispatchToken = dispatcher.register((event) => {
  switch (event.actionType) {
    case ActionTypes.CountryFilter.COUNTRY_FILTER_SYNC:
      countryFilterStore.set(event.data.availableCountries);
      break;
    default:
      break; // do nothing
  }
  countryFilterStore.emitChange(event.actionType, event.data);
});

export default countryFilterStore;
