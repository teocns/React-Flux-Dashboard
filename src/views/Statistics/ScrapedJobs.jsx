//@ts-check

import React, { useEffect, useState } from "react";
import InsightsChart from "../../components/Insights/Chart";
import ActionTypes from "../../constants/ActionTypes";
import ScrapedJobsApi from "../../api/ScrapingThread";
import statisticsStore from "../../store/Statistics";
import statisticsActions from "../../actions/Statistics";
import StatisticsSyncRequest from "../../Shared/BBE-CRWL.WebApp.Shared.Models/Statistics/SyncRequest";
import { syncRequestToB64 } from "../../helpers/statistics";
import {
  CircularProgress,
  Paper,
  Typography,
  useTheme,
} from "@material-ui/core";
import SyncRequest from "../../Shared/BBE-CRWL.WebApp.Shared.Models/Statistics/SyncRequest";
import ChartSyncResponse from "../../Shared/BBE-CRWL.WebApp.Shared.Models/Statistics/Charts/SyncRequest";
import ChartSyncRequest from "../../Shared/BBE-CRWL.WebApp.Shared.Models/Statistics/Charts/SyncRequest";
import StatisticsFilters from "../../Shared/BBE-CRWL.WebApp.Shared.Models/Statistics/Filters";
import UserFilter from "../../actions/UserFilter";
import StatisticsDataTypes from "../../Shared/BBE-CRWL.WebApp.Shared.Models/Statistics/DataTypes";
import { number_format } from "../../helpers/numbers";

const NICE_NAME = "Scraped Jobs";
var lastRequestedFilter;
var isLoading = false;
var chartSyncRequest = undefined;

const ScrapedJobsStatisticsView = ({ DateRangeFilter, SelectedUserFilter }) => {
  const [Statistics, setStatistics] = useState();
  const [ScrapedJobsCount, setScrapedJobsCount] = useState("-");
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
      dataType: StatisticsDataTypes.USER_SCRAPED_JOBS,
    });
    statisticsActions.syncStatistics(chartSyncRequest);
  };

  const renderIfNotLoading = () => {
    if (ScrapedJobsCount === undefined) {
      return (
        <CircularProgress
          style={{
            width: 14,
            height: 14,
            color: theme.palette.text.disabled,
            marginLeft: theme.spacing(1),
          }}
        />
      );
    }
    return number_format(ScrapedJobsCount, 0, ".", ",");
  };

  const loadCounts = () => {
    setScrapedJobsCount(undefined);
    setTimeout(() => {
      ScrapedJobsApi.GetScrapedJobsCount({
        dateRange: DateRangeFilter,
        userFilter: SelectedUserFilter,
      }).then((c) => setScrapedJobsCount(c.scrapedJobs));
    });
  };

  useEffect(() => {
    //Bind listeners1
    statisticsStore.addChangeListener(
      ActionTypes.Statistics.STATISTICS_RECEIVED,
      onStatisticsSynced
    );
    syncStatistics();
    loadCounts();
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
        <Typography>Scraped jobs: {renderIfNotLoading()}</Typography>
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

export default React.memo(ScrapedJobsStatisticsView);
