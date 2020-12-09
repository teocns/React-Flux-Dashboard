import keyMirror from "keymirror";

const SocketEvents = keyMirror({
  AUTHENTICATE: null, // Client sends authentication request
  USER_DATA: null, // Fires when user data is sent from server to client

  AUTHENTICATION_FAILED: null,
  LAST_CHAT_MESSAGES: null, // Gets last chat messages - TODO: Update to CHAT_STATUS
  SEND_CHAT_MESSAGE: null,
  ERROR: null,
  SUCCESS: null,
  HANDSHAKE_SOCKET_ID: null,
  CREATE_SCRAPING_THREAD: null,
  SCRAPING_THREAD_CREATED: null,
  TABLE_SYNC: null,
  TABLE_DATA: null,
});

export default SocketEvents;
