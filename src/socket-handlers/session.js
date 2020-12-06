import dispatcher from "../dispatcher";

import sessionActions from "../actions/Session";

import SocketEvents from "../constants/SocketEvents";

const bindSessionSocketHandler = (socket) => {
  socket.on(SocketEvents.AUTHENTICATION_FAILED, () => {
    // Do nothing for now
  });

  socket.on(SocketEvents.INITIAL_STATUS, (status) => {
    sessionActions.onInitialStatusReceived(status);
  });

  socket.on(SocketEvents.USER_DATA, ({ user }) => {
    sessionActions.onUserDataReceived(user);
  });

  socket.on(SocketEvents.ERROR, (errorCode) => {
    sessionActions.onApiError(errorCode);
  });

  socket.on(SocketEvents.SUCCESS, (successMessage) => {
    sessionActions.onApiSuccess(successMessage);
  });

  socket.on(SocketEvents.AUTHENTICATION_FAILED, (successMessage) => {
    sessionActions.onAuthenticationFailed();
  });
};

export default bindSessionSocketHandler;
