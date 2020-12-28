import dispatcher from "../dispatcher";

import sessionActions from "../actions/Session";
import userFilterActions from "../actions/UserFilter";

import SocketEvents from "../constants/SocketEvents";

const bindSessionSocketHandler = (socket) => {
  socket.on(SocketEvents.USER_FILTER_SYNC, (userFilter) => {
    userFilterActions.onSyncReceived(userFilter);
  });
};

export default bindSessionSocketHandler;
