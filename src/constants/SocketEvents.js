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
  ADD_USER: null,
  TABLE_DATA: null,
  SCRAPING_THREAD_SYNC: null,
  STATISTICS_SYNC: null,
  COUNTRIES_FILTER_SYNC: null,
  USER_FILTER_SYNC: null,
  SET_COUNTRIES_AS_ALIAS: null,
  UNMARK_COUNTRY_ALIAS: null,
  RENAME_COUNTRY: null,
  HOST_SYNC: null,
  RETRY_THREAD: null,
  ADD_BLACKLIST_RULE: null,
  DELETE_BLACKLIST_RULE: null,
  SYNC_BLACKLIST_REASONS: null,
});

export default SocketEvents;
