import ActionTypes from "../constants/ActionTypes";
import SocketEvents from "../constants/SocketEvents";
import dispatcher from "../dispatcher";
import { sendMessage } from "../socket";
const sync = () => {
  sendMessage(SocketEvents.USER_FILTER_SYNC);
};

const onSyncReceived = (availableUsers) => {
  dispatcher.dispatch({
    actionType: ActionTypes.UserFilter.USER_FILTER_SYNC,
    data: { availableUsers },
  });
};

const userFilterChanged = (userFilter) => {
  dispatcher.dispatch({
    actionType: ActionTypes.UserFilter.USER_FILTER_CHANGED,
    data: { userFilter },
  });
};

export default { sync, onSyncReceived, userFilterChanged };
