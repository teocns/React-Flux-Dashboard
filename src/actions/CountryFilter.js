import ActionTypes from "../constants/ActionTypes";
import SocketEvents from "../constants/SocketEvents";
import dispatcher from "../dispatcher";
import { sendMessage } from "../socket";
/**
 * @deprecated
 */
const sync = () => {
  //
  sendMessage(SocketEvents.COUNTRIES_FILTER_SYNC);
};

const onSyncReceived = (availableCountries) => {
  dispatcher.dispatch({
    actionType: ActionTypes.CountryFilter.COUNTRY_FILTER_SYNC,
    data: { availableCountries },
  });
};

export default { sync, onSyncReceived };
