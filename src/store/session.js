import { EventEmitter } from "events";
import dispatcher from "../dispatcher";
import ActionTypes from "../constants/ActionTypes";
import User from "../models/User";

const Errors = require("../constants/Errors");

class SessionStore extends EventEmitter {
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

  needsToAuthenticate() {
    return (
      !this.isAuthenticated() &&
      !this.isAuthenticating &&
      this.getAuthenticationToken()
    );
  }

  /**
   *
   * @param {User} user
   */
  setUser(user) {
    this.user = user;
    if (user && user.authentication_token) {
      this.setAuthenticationToken(user.authentication_token);
      this._isAuthenticated = true;
    } else {
      this._isAuthenticated = false;
    }
  }

  getAuthenticationToken() {
    let _ret = localStorage.getItem("authentication_token");
    if (_ret === undefined || _ret === null || _ret.length < 64) {
      _ret = undefined;
    }
    return _ret;
  }
  setAuthenticationToken(authentication_token) {
    authentication_token = authentication_token || "";
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
  setIsAuthenticating(isIt) {
    this._hasTriedAuthentication = true;
    this._isAuthenticating = isIt;
  }
  hasTriedAuthentication() {
    return !!this._hasTriedAuthentication;
  }
  isAuthenticating() {
    return this._isAuthenticating;
  }

  logout() {
    this.setAuthenticationToken("");
  }
}

const sessionStore = new SessionStore();

sessionStore.dispatchToken = dispatcher.register((event) => {
  switch (event.actionType) {
    case ActionTypes.Session.USER_DATA_UPDATED:
      sessionStore.setUser(event.data.user);
      break;

    case ActionTypes.Session.AUTHENTICATION_FAILED:
      sessionStore.setAuthenticationToken(null);
      break;
    case ActionTypes.Session.USER_LOGOUT:
      sessionStore.logout();
      break;
    case ActionTypes.Session.IS_AUTHENTICATING:
      sessionStore.setIsAuthenticating(event.data.isAuthenticating);
      break;
    // case ActionTypes.Session.:
    //   let errorMessage = undefined;
    //   let errorHasToBeFormatted = Array.isArray(event.data);

    //   if (errorHasToBeFormatted) {
    //     let params = [];
    //     for (let i = 1; i < event.data.length; i++) {
    //       params.push(event.data[i]);
    //     }
    //     errorMessage = Errors[event.data[0]].toString().format(params);
    //   } else {
    //     errorMessage = Errors[event.data];
    //   }

    //   setTimeout(() => {
    //     dispatcher.dispatch({
    //       actionType: ActionTypes.UI_SHOW_SNACKBAR,
    //       data: {
    //         message: errorMessage,
    //         severity: "error",
    //       },
    //     });
    //   });
    //   break;

    // case ActionTypes.API_SUCCESS:
    //   // Snackbar component will subscribe to this

    //   setTimeout(() => {
    //     dispatcher.dispatch({
    //       actionType: ActionTypes.UI_SHOW_SNACKBAR,
    //       data: {
    //         message: Errors[event.data] || event.data,
    //         severity: "success",
    //       },
    //     });
    //   });
    //   break;
    default:
      break; // do nothing
  }
  sessionStore.emitChange(event.actionType, event.data);
});

export default sessionStore;
