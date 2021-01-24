import ActionTypes from "../constants/ActionTypes";
import SocketEvents from "../constants/SocketEvents";
import dispatcher from "../dispatcher";
import { sendMessage } from "../socket";
import HostsApi from "../api/Hosts";
import UIActions from "../actions/UI";
import TableConstants from "../constants/Tables";
import HostsStore from "../store/Hosts";
import hostsStore from "../store/Hosts";

const changeRegex = async (hostId, regex) => {
  const result = await HostsApi.changeRegex(hostId, regex);
  if (result.ok) {
    UIActions.showSnackbar("Host regex changed successfully", "success");
    return true;
  }
  return false;
};

const retrieveHostByName = async (hostname) => {
  // Check if we should post an API call - in case where we don't have the current hostname stored
  const storedHost = hostsStore.getByName(hostname);
  if (storedHost) {
    return false;
  }
  const host = await HostsApi.retrieveHostByName(hostname);
  if (host) {
    dispatcher.dispatch({
      actionType: ActionTypes.Hosts.REGEX_RECEIVED,
      data: { host },
    });
  }
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
