import ActionTypes from "../constants/ActionTypes";
import SocketEvents from "../constants/SocketEvents";
import dispatcher from "../dispatcher";
import Statistics from "../models/Statistics";
import { sendMessage } from "../socket";
import statisticsStore from "../store/Statistics";
const syncStatistics = ({ userFilter, countryFilter, dateRange }) => {
  const _reqData = { userFilter, countryFilter, dateRange };

  if (!statisticsStore.canSync(_reqData)) {
    return;
  }
  setTimeout(() => {
    dispatcher.dispatch({
      actionType: ActionTypes.Statistics.STATISTICS_SYNC,
      data: _reqData,
    });
    sendMessage(SocketEvents.STATISTICS_SYNC, {
      userFilter,
      countryFilter,
      dateRange,
    });
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
