import dispatcher from "../dispatcher";

import sessionActions from "../actions/Session";
import countryFilterActions from "../actions/CountryFilter";

import SocketEvents from "../constants/SocketEvents";

const bindCountryFilterHandler = (socket) => {
  socket.on(SocketEvents.COUNTRIES_FILTER_SYNC, (countryFilter) => {
    countryFilterActions.onSyncReceived(countryFilter);
  });
};

export default bindCountryFilterHandler;
