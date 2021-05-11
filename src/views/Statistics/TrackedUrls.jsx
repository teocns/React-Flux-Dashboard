import React, { useEffect, useState } from "react";
import Chart from "../../components/Insights/Chart";
import ActionTypes from "../../constants/ActionTypes";

import statisticsStore from "../../store/Statistics";
import statisticsActions from "../../actions/Statistics";
import StatisticsSyncRequest from "../../Shared/BBE-CRWL.WebApp.Shared.Models/Statistics/SyncRequest";
import { syncRequestToB64 } from "../../helpers/statistics";

const STATISTIC_TYPE = "USER_TRACKED_URLS";
const NICE_NAME = "Tracked URLs";
var lastRequestedFilter;
var isLoading = false;

const TrackedUrlsStatistics = ({ DateRangeFilter, SelectedUserFilter }) => {
  const [Statistics, setStatistics] = useState();

  const getSyncRequestB64 = (syncRequest) => {
    let target = undefined;
    if (!syncRequest)
      target = {
        dateRange: DateRangeFilter,
        types: [STATISTIC_TYPE],
        userFilter: SelectedUserFilter,
      };
    else {
      debugger;
      target = {
        type: syncRequest.type,
        filter: syncRequest,
      };
    }

    return syncRequestToB64(target);
  };

  const onStatisticsSynced = () => {
    // Verify that the received statistics match the requested ones
    const thisStats = statisticsStore.getStatistics(getSyncRequestB64());

    if (!thisStats) {
      return null;
    }
    const receivedStatisticsFilter = getSyncRequestB64(thisStats.syncRequest);

    if (receivedStatisticsFilter !== lastRequestedFilter) {
      return false;
    }

    isLoading = false;
    setStatistics(thisStats);
  };
  const syncStatistics = () => {
    isLoading = true;

    lastRequestedFilter = getSyncRequestB64();

    statisticsActions.syncStatistics(
      new StatisticsSyncRequest({
        filter: {
          dateRange: DateRangeFilter,
          users: SelectedUserFilter,
        },
        type: STATISTIC_TYPE,
      })
    );
  };

  useEffect(() => {
    //Bind listeners
    statisticsStore.addChangeListener(
      ActionTypes.Statistics.STATISTICS_RECEIVED,
      onStatisticsSynced
    );
    syncStatistics();
    return () => {
      // Unbind listeners
      statisticsStore.removeChangeListener(
        ActionTypes.Statistics.STATISTICS_RECEIVED,
        onStatisticsSynced
      );
    };
  });

  return <Chart name={NICE_NAME} type={STATISTIC_TYPE} />;
};

export default TrackedUrlsStatistics;
