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
import TrackedUrlsChart from "../components/Charts/Generic";
import DateFilter from "../components/Filters/DateFilter";
import UserFilter from "../components/Filters/UserFilter";
import Chart from "../components/Insights/Chart";
import ActionTypes from "../constants/ActionTypes";
import DateRanges from "../constants/DateRanges";
import { STATISTICS_TYPES } from "../constants/Statistics";
import StatisticsDataTypes from "../Shared/BBE-CRWL.WebApp.Shared.Models/Statistics/DataTypes";
import StatisticsTypes from "../Shared/BBE-CRWL.WebApp.Shared.Models/Statistics/Types";

import sessionStore from "../store/session";
import statisticsStore from "../store/Statistics";
import TrackedUrlStatisticsView from "./Statistics/TrackedUrls";
import ScrapedJobsStatisticsView from "./Statistics/ScrapedJobs";
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

export default function StatisticsView(props) {
  const [Statistics, setStatistics] = useState(statisticsStore.getStatistics());

  const [ChartViewMode, setChartViewMode] = useState(CHART_VIEW_MODES.PUZZLE);

  const [AnchorElements, setAnchorElements] = useState({
    CHART_VIEW_MODE: null,
  });

  const StatisticType = props.match.params.type;

  const setAnchorElement = (key, val) => {
    AnchorElements[key] = val;
    setAnchorElements({ ...AnchorElements });
  };

  const [ViewMode, setViewMode] = useState();

  const [DateRangeFilter, setDateRangeFilter] = useState(DateRanges[0]);

  const user = sessionStore.getUser();

  const [SelectedUserFilter, setUserFilter] = useState(
    user.isAdmin ? [] : [user.id]
  );

  const handleDateFilterChanged = (dateRange) => {
    if (!dateRange.timeFrame) {
      dateRange.timeFrame = "DAY";
    }
    setDateRangeFilter(dateRange);
  };
  const classes = useStyles();

  useEffect(() => {
    console.log("Rendering");
    // Bind listeners
    // statisticsStore.addChangeListener(
    //   ActionTypes.Statistics.STATISTICS_RECEIVED,
    //   onStatisticsSynced
    // );
    // syncStatistics();
    // return () => {
    //   // Unbind listeners
    //   statisticsStore.removeChangeListener(
    //     ActionTypes.Statistics.STATISTICS_RECEIVED,
    //     onStatisticsSynced
    //   );
    // };
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

  const renderStatisticView = () => {
    switch (StatisticType) {
      case StatisticsDataTypes.USER_TRACKED_URLS:
        return (
          <TrackedUrlStatisticsView
            DateRangeFilter={DateRangeFilter}
            SelectedUserFilter={SelectedUserFilter}
          />
        );

      case StatisticsDataTypes.USER_SCRAPED_JOBS:
        return (
          <ScrapedJobsStatisticsView
            DateRangeFilter={DateRangeFilter}
            SelectedUserFilter={SelectedUserFilter}
          />
        );

      default:
        return null;
    }
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
        {/* <DateFilter onDateRangeChanged={handleDateFilterChanged} /> */}
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
      >
        {renderStatisticView()}
      </div>
    </div>
  );
}
