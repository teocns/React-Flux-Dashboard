import { EventEmitter } from "events";
import dispatcher from "../dispatcher";
import ActionTypes from "../constants/ActionTypes";
import User from "../models/User";
import TableData from "../models/TableData";

const Errors = require("../constants/Errors");

class UserFilterStore extends EventEmitter {
  /**
   * @type {Object.<number, string>}
   */
  #available_users;

  #lastSync;
  constructor(params) {
    super(params);
    this.#lastSync = null;
    this.#available_users = undefined;
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
    return this.#available_users;
  }

  set(available_users) {
    this.#available_users = available_users;
    this.#lastSync = parseInt(Date.now() / 1000);
  }
  lastSync() {
    return this.#lastSync;
  }
  requiresSync() {
    return !this.#lastSync;
  }
}

const userFilterStore = new UserFilterStore();

userFilterStore.dispatchToken = dispatcher.register((event) => {
  let willEmit = true;
  switch (event.actionType) {
    case ActionTypes.UserFilter.USER_FILTER_SYNC:
      userFilterStore.set(event.data.availableUsers);
      break;
    default:
      willEmit = false;
      break; // do nothing
  }
  willEmit && userFilterStore.emitChange(event.actionType, event.data);
});

export default userFilterStore;
