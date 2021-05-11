import React, { useEffect, useState } from "react";
import Minichart from "../Charts/Simple";

import statisticsActions from "../../actions/Statistics";
import StatisticsSyncRequest from "../../Shared/BBE-CRWL.WebApp.Shared.Models/Statistics/SyncRequest";
import ChartTypes from "../../Shared/BBE-CRWL.WebApp.Shared.Models/Statistics/ChartTypes";
import statisticsStore from "../../store/Statistics";
import ActionTypes from "../../constants/ActionTypes";
import { CircularProgress, Paper } from "@material-ui/core";
var lastRequestedFilterB64 = undefined;

/**
 * @typedef InsightsChartConstructor
 * @property {string} name
 * @property {string} type
 * @property {Object} filter
 */

/**
 * @typedef InsightsChartConstructorFilter
 * @property {string} domain
 * @property {string} tracked_url_id
 * @property {Object|string} dateRange
 */

/**
 *
 * @param {Object} param0
 * @param {InsightsChartConstructorFilter} param0.filter
 * @returns
 */

const InsightsChart = ({ name, type, filter }) => {
  const [ChartData, setChartData] = useState();

  let currentSyncRequest = undefined;
  const syncStatistics = () => {
    lastRequestedFilterB64 = btoa(JSON.stringify(filter));

    currentSyncRequest = {
      type: ChartTypes.DOMAIN_TRACKED_URLS,
      filter,
    };
    statisticsActions.syncStatistics(currentSyncRequest);
  };
  const getFilter = (syncRequest) => {
    if (!syncRequest) return filter;

    return {
      dateRange: syncRequest.dateRange,
      types: syncRequest.types,
      userFilter: syncRequest.userFilter,
    };
  };
  const onStatisticsSynced = (stats) => {
    const { syncRequest } = stats.statistics;
    // Verify that the received statistics match the requested ones
    // const statsb64 = btoa(
    //   JSON.stringify(getFilter(statisticsStore.getStatistics().filter))
    // );

    // if (statsb64 !== lastRequestedFilterB64) {
    //   return false;
    // }

    //isLoading = false;

    if (JSON.stringify(syncRequest) === JSON.stringify(currentSyncRequest)) {
      setChartData(statisticsStore.getStatistics(currentSyncRequest).chartData);
    }
  };

  useEffect(() => {
    // Bind listeners
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
  }, [filter]);
  return (
    <Paper>
      {ChartData ? (
        <Minichart chartData={ChartData} />
      ) : (
        <CircularProgress color="secondary" />
      )}
    </Paper>
  );
};

export default React.memo(InsightsChart);
