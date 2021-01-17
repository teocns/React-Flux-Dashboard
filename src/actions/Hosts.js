import ActionTypes from "../constants/ActionTypes";
import SocketEvents from "../constants/SocketEvents";
import dispatcher from "../dispatcher";
import { sendMessage } from "../socket";
import HostsApi from "../api/Hosts";
import UIActions from "../actions/UI";
import TableConstants from "../constants/Tables";
const changeRegex = async (hostId, regex) => {
  const result = await HostsApi.changeRegex(hostId, regex);
  if (result.ok) {
    UIActions.showSnackbar("Host regex changed successfully", "success");
    return true;
  }
  return false;
};

const onHostUpdated = (host) => {
  //uiActions.showSnackbar("URL successfuly registered for tracking", "success");
  dispatcher.dispatch({
    actionType: ActionTypes.Table.DATA_MODIFIED,
    data: {
      key: "hostId",
      tableNames: [TableConstants.DOMAINS_MANAGEMENT],
      row: host,
    },
  });
};

export default { changeRegex, onHostUpdated };
