import dispatcher from "../dispatcher";

import sessionActions from "../actions/Session";
import scrapingThreadActions from "../actions/ScrapingThread";
import statisticsActions from "../actions/Statistics";

import SocketEvents from "../constants/SocketEvents";
import sessionStore from "../store/session";
import tableStore from "../store/Tables";
import ActionTypes from "../constants/ActionTypes";
import TableNames from "../constants/Tables";
import { sendMessage } from "../socket";

const bindSessionSocketHandler = (socket) => {
  socket.on(SocketEvents.STATISTICS_SYNC, (data) => {
    statisticsActions.statisticsSynced(data);
  });
};

export default bindSessionSocketHandler;
