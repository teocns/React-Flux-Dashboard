import ActionTypes from "../constants/ActionTypes";
import SocketEvents from "../constants/SocketEvents";
import dispatcher from "../dispatcher";
import SyncRequest from "../Shared/BBE-CRWL.WebApp.Shared.Models/Statistics/SyncRequest";

import { sendMessage } from "../socket";
import statisticsStore from "../store/Statistics";

/**
 *
 * @param {SyncRequest} request
 */
const syncStatistics = (request) => {
  if (!statisticsStore.canSync(request)) {
    return;
  }
  setTimeout(() => {
    dispatcher.dispatch({
      actionType: ActionTypes.Statistics.STATISTICS_SYNC,
      data: request,
    });
    sendMessage(SocketEvents.STATISTICS_SYNC, request);
  });
};

/**
 *
 * @param {Statistics} statistics
 */
const statisticsSynced = (statistics) => {
  dispatcher.dispatch({
    actionType: ActionTypes.Statistics.STATISTICS_RECEIVED,
    data: { statistics },
  });
};

export default { syncStatistics, statisticsSynced };
