/* eslint-disable import/no-anonymous-default-export */
import dispatcher from "../dispatcher";
import ActionTypes from "../constants/ActionTypes";

import SocketEvents from "../constants/SocketEvents";

import sessionStore from "../store/session";

import { sendMessage } from "../socket";

import User from "../models/User";

import ClientData from "../models/ClientData.js";
import UserApi from "../api/User";
import { SettingsRemote } from "@material-ui/icons";

function logout() {
  dispatcher.dispatch({
    actionType: ActionTypes.Session.USER_LOGOUT,
  });
  setTimeout(() => {
    window.location.reload();
  });
}

async function userAuthenticate({ email, password }) {
  dispatcher.dispatch({
    actionType: ActionTypes.Session.IS_AUTHENTICATING,
    data: { isAuthenticating: true },
  });
  try {
    const { user } = await UserApi.Authenticate(email, password);

    if (user) {
      onUserDataReceived(user);
    } else {
      onAuthenticationFailed();
    }
  } catch (e) {
    console.log(e);
    onAuthenticationFailed();
  } finally {
    dispatcher.dispatch({
      actionType: ActionTypes.Session.IS_AUTHENTICATING,
      data: { isAuthenticating: false },
    });
  }
}

function onAuthenticationFailed() {
  dispatcher.dispatch({
    actionType: ActionTypes.Session.AUTHENTICATION_FAILED,
  });
  dispatcher.dispatch({
    actionType: ActionTypes.Session.IS_AUTHENTICATING,
    data: { isAuthenticating: false },
  });
}

function setAuthenticationToken(authenticationToken) {
  dispatcher.dispatch({
    actionType: ActionTypes.Session.AUTHENTICATION_TOKEN_RECEIVED,
    data: authenticationToken,
  });
  sendMessage(SocketEvents.AUTHENTICATE, authenticationToken); // Send authentication token to socket
}

function onInitialStatusReceived(status) {
  console.log(status);
  dispatcher.dispatch({
    actionType: ActionTypes.Session.INITIAL_STATUS_RECEIVED,
    data: status,
  });
  // TODO: move in rates actions
  if ("rates" in status) {
    dispatcher.dispatch({
      actionType: ActionTypes.Rates.UPDATED,
      data: {
        rates: status.rates,
      },
    });
  }
}

function onUserDataReceived(userData) {
  if (!User.isValid(userData)) {
    debugger;
    return;
  }
  const user = new User(userData);
  // Dispatch user data received and balance changes
  dispatcher.dispatch({
    actionType: ActionTypes.Session.USER_DATA_UPDATED,
    data: { user },
  });
}
/**
 *
 * @param {ApiError} apiError
 */
function onApiError(apiError) {
  const err = apiError.toString();

  dispatcher.dispatch({
    actionType: ActionTypes.UI.SHOW_SNACKBAR,
    data: { message: err, severity: "error" },
  });
}

function onApiSuccess(successMessage) {
  dispatcher.dispatch({
    actionType: ActionTypes.Session.API_ERROR,
    data: successMessage,
  });
}
function tryAuthentication() {
  const storedAuthenticationToken = sessionStore.getAuthenticationToken();
  if (!storedAuthenticationToken) {
    return;
  }
  dispatcher.dispatch({
    actionType: ActionTypes.Session.IS_AUTHENTICATING,
    data: { isAuthenticating: true },
  });
  sendMessage(SocketEvents.AUTHENTICATE, storedAuthenticationToken);
}
function sendClientData() {
  const clientData = new ClientData();
  // Gather browser info
  if (window.navigator) {
    clientData.userAgent = window.navigator.userAgent;
    clientData.languages = window.navigator.languages;
    clientData.language = window.navigator.language;
  }
  const authenticationToken = sessionStore.getAuthenticationToken();

  if (
    typeof authenticationToken === "string" &&
    authenticationToken.length === 64
  ) {
    // Try to authenticate
    clientData.authenticationToken = authenticationToken;
  }
  //data.appLanguage = languageStore.getLang();
  sendMessage(SocketEvents.CLIENT_DATA, clientData);
}

const onSessionIdReceived = (sessionId) => {
  dispatcher.dispatch({
    actionType: ActionTypes.Session.ID_RECEIVED,
    data: { sessionId },
  });
};

export default {
  userAuthenticate,
  onApiError,
  onApiSuccess,
  onSessionIdReceived,
  tryAuthentication,
  onUserDataReceived,
  onAuthenticationFailed,
  logout,
};
