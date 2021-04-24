import { ButtonGroup, CircularProgress } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { DateRange } from "@material-ui/icons";
import KeyMirror from "keymirror";
import React, { useEffect, useState } from "react";
import statisticsActions from "../actions/Statistics";
import CrawlerThreadsChart from "../components/Charts/CrawlerThreads";
import TrackedUrlsChart from "../components/Charts/TrackedUrls";
import DateFilter from "../components/Filters/DateFilter";
import UserFilter from "../components/Filters/UserFilter";
import ActionTypes from "../constants/ActionTypes";
import DateRanges from "../constants/DateRanges";
import { STATISTICS_TYPES } from "../constants/Statistics";
import { StatisticsSyncRequest } from "../models/Statistics";
import sessionStore from "../store/session";
import statisticsStore from "../store/Statistics";

const useStyles = makeStyles((theme) => ({
  card: {
    minWidth: 275,
    maxWidth: 275,
    marginRight: theme.spacing(4),
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  cardIcon: {
    width: "50%",
    height: "50%",
  },
  circle: {
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "2rem",
    height: "2rem",
    margin: theme.spacing(2),
  },
  circleOrange: {
    backgroundColor: "orange",
    color: "white",
  },
  circleBlue: {
    backgroundColor: "blue",
    color: "white",
  },
}));
var isLoading = true;

const CHART_VIEW_MODES = KeyMirror({
  SINGLE: null,
  PUZZLE: null,
});

var lastRequestedFilterB64 = "";

export default function StatisticsView() {
  const [Statistics, setStatistics] = useState(statisticsStore.getStatistics());

  console.log(Statistics);
  const [ChartViewMode, setChartViewMode] = useState(CHART_VIEW_MODES.PUZZLE);

  const [AnchorElements, setAnchorElements] = useState({
    CHART_VIEW_MODE: null,
  });

  const [ActiveStatisticTypes, setActiveStatisticsTypes] = useState(
    Object.values(STATISTICS_TYPES)
  );

  const setAnchorElement = (key, val) => {
    AnchorElements[key] = val;
    setAnchorElements({ ...AnchorElements });
  };

  const [ViewMode, setViewMode] = useState();

  const [DateRangeFilter, setDateRangeFilter] = useState(DateRanges[0]);

  const user = sessionStore.getUser();

  const [SelectedUserFilter, setUserFilter] = useState([]);

  const handleDateFilterChanged = (dateRange) => {
    if (!dateRange.timeFrame) {
      dateRange.timeFrame = "DAY";
    }
    setDateRangeFilter(dateRange);
  };
  const classes = useStyles();

  const getFilter = (syncRequest) => {
    if (!syncRequest)
      return {
        dateRange: DateRangeFilter,
        types: ActiveStatisticTypes,
        userFilter: SelectedUserFilter,
      };

    return {
      dateRange: syncRequest.dateRange,
      types: syncRequest.types,
      userFilter: syncRequest.userFilter,
    };
  };

  const syncStatistics = () => {
    isLoading = true;
    console.log("Syncing statistics bitchj");

    lastRequestedFilterB64 = btoa(JSON.stringify(getFilter()));

    statisticsActions.syncStatistics(
      new StatisticsSyncRequest(
        DateRangeFilter,
        SelectedUserFilter,
        ActiveStatisticTypes
      )
    );
  };

  const onStatisticsSynced = () => {
    // Verify that the received statistics match the requested ones
    const statsb64 = btoa(
      JSON.stringify(getFilter(statisticsStore.getStatistics().syncRequest))
    );

    if (statsb64 !== lastRequestedFilterB64) {
      return false;
    }

    isLoading = false;
    setStatistics(statisticsStore.getStatistics());
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
  });

  const theme = useTheme();

  const changeChartView = (view_mode) => {
    if (!view_mode) {
      return;
    }
    // Close the menu by removing the anchor mode
    setAnchorElement("CHART_VIEW_MODE", null);

    setTimeout(() => {
      setChartViewMode(view_mode);
    });
  };

  const calculateTotalScrapedJobs = () => {
    if (!Statistics || !Statistics.graphs[STATISTICS_TYPES.SCRAPED_JOBS]) {
      return 0;
    }
    let acc = 0;
    for (let dataset of Statistics.graphs[STATISTICS_TYPES.SCRAPED_JOBS]) {
      acc += dataset.summary.scrapedJobs;
    }
    return acc;
  };
  const calculateTotalTrackedUrls = () => {
    if (!Statistics || !Statistics.graphs[STATISTICS_TYPES.TRACKED_URLS]) {
      return 0;
    }
    let acc = 0;
    for (let dataset of Statistics.graphs[STATISTICS_TYPES.TRACKED_URLS]) {
      acc += dataset.summary.trackedUrls;
    }
    return acc;
  };
  return (
    <div style={{ overflow: "hidden" }}>
      <Paper
        style={{
          padding: theme.spacing(2),
          marginBottom: theme.spacing(4),
          display: "flex",
          alignItems: "center",
        }}
      >
        {user.isAdmin ? (
          <div style={{ marginRight: 12 }}>
            <UserFilter
              onUserFilterChanged={(dd) => {
                setUserFilter(dd.map((c) => parseInt(c)));
              }}
            />
          </div>
        ) : (
          ""
        )}
        <DateFilter onDateRangeChanged={handleDateFilterChanged} />
        <ButtonGroup
          disableElevation
          style={{ marginLeft: theme.spacing(1) }}
          variant="text"
        >
          {DateRanges.map((date, index) => (
            <Button
              variant={DateRangeFilter === date ? "contained" : "text"}
              color={DateRangeFilter === date ? "secondary" : "primary"}
              onClick={() => {
                handleDateFilterChanged(date);
              }}
              key={index}
            >
              {date.label}
            </Button>
          ))}
        </ButtonGroup>

        {/* <ChartViewModeSelect /> */}
      </Paper>
      <div
        style={{
          display: "flex",
        }}
      ></div>
      <Grid container spacing={2} style={{ overflow: "hidden" }}>
        {Statistics &&
          ActiveStatisticTypes.map((statistics_type) => {
            let title;
            let sumFunc;

            let chart;
            switch (statistics_type) {
              case STATISTICS_TYPES.TRACKED_URLS:
                title = "Newly added URLs";
                sumFunc = calculateTotalTrackedUrls;
                chart = () => {
                  return (
                    <TrackedUrlsChart
                      chartData={Statistics.graphs[statistics_type]}
                    />
                  );
                };
                break;
              case STATISTICS_TYPES.SCRAPED_JOBS:
                title = "Jobs scraped";
                sumFunc = calculateTotalScrapedJobs;
                chart = () => (
                  <CrawlerThreadsChart
                    chartData={Statistics.graphs[statistics_type]}
                  />
                );
                break;
              default:
                break;
            }
            return (
              <Grid
                item={true}
                xs={6}
                style={{
                  minWidth: 480,
                  minHeight: 480,
                  position: "relative",
                  overflow: "hidden",
                  padding: theme.spacing(2),
                }}
              >
                <Paper
                  style={{
                    width: "100%",
                    height: "100%",
                    overflow: "hidden",
                  }}
                >
                  <Typography
                    variant="h6"
                    style={{ padding: theme.spacing(2) }}
                  >
                    {title} {sumFunc()}
                  </Typography>
                  {!isLoading && !!Statistics.graphs[statistics_type] ? (
                    chart()
                  ) : (
                    <CircularProgress
                      color="secondary"
                      style={{
                        position: "absolute",
                        left: "50%",
                        top: "50%",
                        //transform: "translate(-50%,-50%)",
                      }}
                    />
                  )}
                </Paper>
              </Grid>
            );
          })}
      </Grid>
    </div>
  );
}
