import React, { useEffect, useState } from "react";
import InsightsChart from "../../components/Insights/Chart";
import ActionTypes from "../../constants/ActionTypes";
import TrackedUrlsApi from "../../api/TrackedUrls";
import statisticsStore from "../../store/Statistics";
import statisticsActions from "../../actions/Statistics";
import StatisticsSyncRequest from "../../Shared/BBE-CRWL.WebApp.Shared.Models/Statistics/SyncRequest";
import { syncRequestToB64 } from "../../helpers/statistics";
import { Paper, Typography, useTheme } from "@material-ui/core";
import SyncRequest from "../../Shared/BBE-CRWL.WebApp.Shared.Models/Statistics/SyncRequest";
import ChartSyncResponse from "../../Shared/BBE-CRWL.WebApp.Shared.Models/Statistics/Charts/SyncRequest";
import ChartSyncRequest from "../../Shared/BBE-CRWL.WebApp.Shared.Models/Statistics/Charts/SyncRequest";
import StatisticsFilters from "../../Shared/BBE-CRWL.WebApp.Shared.Models/Statistics/Filters";
import UserFilter from "../../actions/UserFilter";
import StatisticsDataTypes from "../../Shared/BBE-CRWL.WebApp.Shared.Models/Statistics/DataTypes";
import { number_format } from "../../helpers/numbers";

const STATISTIC_TYPE = "USER_TRACKED_URLS";
const NICE_NAME = "Tracked URLs";
var lastRequestedFilter;
var isLoading = false;
var chartSyncRequest = undefined;

const TrackedUrlsStatisticsView = ({ DateRangeFilter, SelectedUserFilter }) => {
  const [Statistics, setStatistics] = useState();
  const [TrackedUrlsCount, setTrackedUrlsCount] = useState(undefined);
  const onStatisticsSynced = ({ statistics }) => {
    const { syncRequest, chartData } = statistics;
    // Verify that the received statistics match the requested ones

    if (syncRequest.uuid !== chartSyncRequest.uuid) {
      return false;
    }
    isLoading = false;
    setStatistics({ chartData });
  };

  const theme = useTheme();

  const syncStatistics = () => {
    chartSyncRequest = ChartSyncRequest.create({
      filter: {
        dateRange: DateRangeFilter,
        users: SelectedUserFilter,
      },
      dataType: StatisticsDataTypes.USER_TRACKED_URLS,
    });
    statisticsActions.syncStatistics(chartSyncRequest);
  };

  useEffect(() => {
    //Bind listeners1
    statisticsStore.addChangeListener(
      ActionTypes.Statistics.STATISTICS_RECEIVED,
      onStatisticsSynced
    );
    syncStatistics();

    TrackedUrlsApi.GetTrackedUrlsCount({
      dateRange: DateRangeFilter,
      userFilter: SelectedUserFilter,
    }).then((c) => setTrackedUrlsCount(c.trackedUrls));

    return () => {
      // Unbind listeners
      statisticsStore.removeChangeListener(
        ActionTypes.Statistics.STATISTICS_RECEIVED,
        onStatisticsSynced
      );
    };
  }, [DateRangeFilter, SelectedUserFilter]);

  return (
    <div style={{ width: "100%", height: "100%", paddingBottom: 256 }}>
      <Paper
        style={{
          padding: theme.spacing(2),
          width: 200,
          marginBottom: theme.spacing(2),
        }}
      >
        <Typography>
          Tracked urls: {number_format(TrackedUrlsCount, 0, ".", ",")}
        </Typography>
      </Paper>
      <InsightsChart
        chartData={Statistics && Statistics.chartData}
        style={{ padding: theme.spacing(5), zIndex: 99999 }}
        name={NICE_NAME}
        tooltipCallbacks={{
          afterLabel: function (tooltipItem, data) {
            return data.full_date;
          },
        }}
      />
    </div>
  );
};

export default React.memo(TrackedUrlsStatisticsView);
