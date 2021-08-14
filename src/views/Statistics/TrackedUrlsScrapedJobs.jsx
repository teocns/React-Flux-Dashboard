import React, { useEffect, useState } from "react";
import InsightsChart from "../../components/Insights/Chart";
import ActionTypes from "../../constants/ActionTypes";
import TrackedUrlsApi from "../../api/TrackedUrls";
import statisticsStore from "../../store/Statistics";
import statisticsActions from "../../actions/Statistics";
import StatisticsSyncRequest from "../../Shared/BBE-CRWL.WebApp.Shared.Models/Statistics/SyncRequest";
import { syncRequestToB64 } from "../../helpers/statistics";
import {
  CircularProgress,
  Paper,
  Tooltip,
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

const STATISTIC_TYPE = "USER_TRACKED_URLS";
const NICE_NAME = "Tracked URLs";
var lastRequestedFilter;
var isLoading = false;
var chartSyncRequest = undefined;
var lastCountSYncRequest = undefined;

const TrackedUrlsScrapedJobsChart = ({ graph }) => {
  const [Statistics, setStatistics] = useState(graph);
  const [Summaries, setSummaries] = useState(undefined);

  const theme = useTheme();

  const renderIfNotLoading = (stateVariable, dec = 0) => {
    if (stateVariable === undefined) {
      return (
        <CircularProgress
          style={{
            width: 14,
            height: 14,
            color: theme.palette.text.disabled,
            marginLeft: theme.spacing(1),
            marginRight: theme.spacing(1),
          }}
        />
      );
    }
    return number_format(stateVariable, dec, ".", ",");
  };

  const makePaperBoardStat = ({ stateVariable, name, hint, dec = 0 }) => {
    return (
      <Paper
        elevation={0}
        variant="outlined"
        style={{
          marginRight: theme.spacing(2),
          padding: theme.spacing(1),
        }}
      >
        <Tooltip title={hint} style={{ fontSize: "16px!important" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "nowrap",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography style={{ whiteSpace: "nowrap" }}>{name}:</Typography>
            <Typography
              variant="overline"
              style={{
                fontSize: theme.typography.fontSize + 2,
                marginLeft: theme.spacing(1),
                minWidth: 80,
                textAlign: "right",
              }}
            >
              {renderIfNotLoading(stateVariable, dec)}
            </Typography>
          </div>
        </Tooltip>
      </Paper>
    );
  };

  return (
    <div style={{ width: "100%", height: "100%", paddingBottom: 256 }}>
      <div style={{ display: "flex", marginBottom: theme.spacing(3) }}>
        {makePaperBoardStat({
          stateVariable: Summaries && Summaries.tracked_urls_count,
          name: "Tracked URLs",
          hint: `Number of URLs Tracked within ${DateRangeFilter.label}`,
        })}
        {makePaperBoardStat({
          stateVariable: Summaries && Summaries.total_scraped_jobs,
          name: "Scraped Jobs",
          hint: `Jobs extracted ONLY from the URLs Tracked within ${DateRangeFilter.label}`,
        })}

        {makePaperBoardStat({
          stateVariable: Summaries && Summaries.avg_jobs,
          name: "Average jobs / Tracked URL",
          hint: `Average maximum job-yielding amount per Tracked URL, within ${DateRangeFilter.label}`,
          dec: 2,
        })}

        {makePaperBoardStat({
          stateVariable: Summaries && Summaries.tracked_urls_crawled,
          name: "URLs crawled",
          hint: `Amount of Tracked URLs that have been already crawled at least once, within ${DateRangeFilter.label}`,
          dec: 0,
        })}

        {makePaperBoardStat({
          stateVariable: Summaries && Summaries.urls_with_jobs,
          name: "URLs with jobs",
          hint: `URLs that yielded jobs within ${DateRangeFilter.label}`,
        })}
      </div>
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

export default React.memo(TrackedUrlsScrapedJobsChart);
