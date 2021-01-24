import { EventEmitter } from "events";
import dispatcher from "../dispatcher";
import ActionTypes from "../constants/ActionTypes";
import User from "../models/User";
import TableData from "../models/TableData";
import Country from "../models/Country";
import { hostname } from "os";
const Errors = require("../constants/Errors");

class HostsStore extends EventEmitter {
  #hosts;
  constructor(params) {
    super(params);
    this.dispatchToken = undefined;
    this.#hosts = {};
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

  storeHost(host) {
    this.#hosts[host.host] = host;
  }

  getByName(hostName) {
    return this.#hosts[hostName];
  }
}

const hostsStore = new HostsStore();

hostsStore.dispatchToken = dispatcher.register((event) => {
  switch (event.actionType) {
    case ActionTypes.Hosts.HOST_SYNC:
      hostsStore.set(event.data.availableCountries);
      break;
    default:
      break; // do nothing
  }
  hostsStore.emitChange(event.actionType, event.data);
});

export default hostsStore;
