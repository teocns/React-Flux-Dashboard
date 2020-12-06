import { EventEmitter } from "events";
import dispatcher from "../dispatcher";
import ActionTypes from "../constants/ActionTypes";
import User from "../models/User";

const Errors = require("../constants/Errors");

class ManageUsersStore extends EventEmitter {
  constructor(params) {
    super(params);
    this.dispatchToken = undefined;

    this.connectionInitiatedTimestamp = undefined; // When
    this._isAuthenticated = false;
    this.user = {
      authentication_token: localStorage.authentication_token,
      email: undefined,
      username: undefined,
    };
    this.authentication_token_sent_timestamp = false;
    this.sessionId = undefined;
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

  getUser() {
    return this.user;
  }

  setUser(user) {
    this.user = user;
    localStorage.setItem("authentication_token", user.authentication_token);
    this._isAuthenticated = true;
  }

  getAuthenticationToken() {
    return localStorage.getItem("authentication_token");
  }
  setAuthenticationToken(authentication_token) {
    this.user.authentication_token = authentication_token;
    localStorage.setItem("authentication_token", authentication_token);
  }
  setSessionId(sessionId) {
    this.sessionId = sessionId;
  }

  isAuthenticated() {
    return this.user instanceof User;
  }

  updateAvatar(avatar) {
    this.user.avatar = avatar;
  }
}

const manageUsersStore = new ManageUsersStore();

manageUsersStore.dispatchToken = dispatcher.register((event) => {
  switch (event.actionType) {
    default:
      break;
  }
  manageUsersStore.emitChange(event.actionType, event.data);
});

export default manageUsersStore;
