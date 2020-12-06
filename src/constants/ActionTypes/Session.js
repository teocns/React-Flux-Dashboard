const keyMirror = require("keymirror");

const SessionActionTypes = keyMirror({
  USER_LOGOUT: null,
  AUTHENTICATION_TOKEN_RECEIVED: null,
  USER_BALANCE_CHANGED: null,
  SESSION_CONNECTED: null,
  SESSION_DISCONNECTED: null,
  HANDSHAKE_SOCKET_ID: null,
  USER_AUTHENTICATED: null,
  USER_DATA_UPDATED: null,
  AUTHENTICATION_FAILED: null,
  IS_AUTHENTICATING: null,
  API_ERROR: null,
});

export default SessionActionTypes;
