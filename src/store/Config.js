import { EventEmitter } from "events";
import dispatcher from "../dispatcher";
import ActionTypes from "../constants/ActionTypes";
import User from "../models/User";
import TableData from "../models/TableData";
import Country from "../models/Country";
import { hostname } from "os";
const Errors = require("../constants/Errors");

class ConfigStore extends EventEmitter {
  #configs;

  default_recrawling_delay = 86400;

  constructor() {
    super();
    this.#configs = {
      RECRAWLING_DELAY_DEFAULT: 86400,
    };
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

  getConfig(config_name) {
    return this.#configs[config_name];
  }
}

const configStore = new ConfigStore();

configStore.dispatchToken = dispatcher.register((event) => {
  switch (event.actionType) {
    // case ActionTypes.Blacklist.SYNC_BLACKLIST_REASONS:
    //   configStore.storeRules(event.data.reasons);
    //   break;
    default:
      break; // do nothing
  }
  configStore.emitChange(event.actionType, event.data);
});

export default configStore;
