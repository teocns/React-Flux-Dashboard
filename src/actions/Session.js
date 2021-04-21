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
import ApiError from "../models/ApiError";

function logout() {
  dispatcher.dispatch({
    actionType: ActionTypes.Session.USER_LOGOUT,
  });
  window.location.reload();
}

const setIsAuthenticating = (isIt) => {
  dispatcher.dispatch({
    actionType: ActionTypes.Session.IS_AUTHENTICATING,
    data: { isAuthenticating: isIt },
  });
};

async function userAuthenticate({ email, password }) {
  setIsAuthenticating(true);
  try {
    const { user } = await UserApi.Authenticate(email, password);
    if (user) {
      sessionStore.setAuthenticationToken(user.authentication_token);
      setTimeout(() => {
        tryAuthentication();
      });
    } else {
      onAuthenticationFailed();
    }
  } catch (e) {
    console.log(e);
    onAuthenticationFailed();
  } finally {
    setIsAuthenticating(false);
  }
}

function onAuthenticationFailed() {
  dispatcher.dispatch({
    actionType: ActionTypes.Session.AUTHENTICATION_FAILED,
  });
  setIsAuthenticating(false);
}

function onUserDataReceived(userData) {
  if (!User.isValid(userData)) {
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
  let err = "";
  if (typeof apiError === "object") {
    err = new ApiError(apiError).toString();
  } else {
    err = apiError;
  }

  dispatcher.dispatch({
    actionType: ActionTypes.UI.SHOW_SNACKBAR,
    data: { message: err, severity: "error" },
  });
}

function onApiSuccess(successMessage) {
  dispatcher.dispatch({
    actionType: ActionTypes.UI.SHOW_SNACKBAR,
    data: { message: successMessage, severity: "success" },
  });
}
function tryAuthentication() {
  const storedAuthenticationToken = sessionStore.getAuthenticationToken();
  const isAuthenticating = sessionStore.isAuthenticating();
  if (!storedAuthenticationToken || isAuthenticating) {
    return;
  }
  setIsAuthenticating(true);
  sendMessage(SocketEvents.AUTHENTICATE, storedAuthenticationToken);
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
