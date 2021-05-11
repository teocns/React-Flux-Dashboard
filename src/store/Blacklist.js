import { EventEmitter } from "events";
import dispatcher from "../dispatcher";
import ActionTypes from "../constants/ActionTypes";
import User from "../models/User";
import TableData from "../models/TableData";
import Country from "../models/Country";
import { hostname } from "os";
const Errors = require("../constants/Errors");

class BlacklistStore extends EventEmitter {
  #reasons;
  #lastSync;
  constructor(params) {
    super(params);
    this.dispatchToken = undefined;
    this.#reasons = null;
    this.#lastSync = null;
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

  storeRules(rules) {
    this.#reasons = rules;
    this.#lastSync = parseInt(Date.now() / 1000);
  }
  lastSync() {
    return this.#lastSync;
  }
  requiresSync() {
    return !this.#lastSync;
  }
  getReasons() {
    return this.#reasons;
  }
}

const blacklistStore = new BlacklistStore();

blacklistStore.dispatchToken = dispatcher.register((event) => {
  switch (event.actionType) {
    case ActionTypes.Blacklist.SYNC_BLACKLIST_REASONS:
      blacklistStore.storeRules(event.data.reasons);
      break;
    default:
      break; // do nothing
  }
  blacklistStore.emitChange(event.actionType, event.data);
});

export default blacklistStore;
