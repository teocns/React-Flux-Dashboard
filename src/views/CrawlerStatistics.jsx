import Paper from "@material-ui/core/Paper";
import {
  Collapse,
  Typography,
  TextField,
  List,
  ListItem,
  Divider,
} from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import React, { useEffect, useState } from "react";
import InsightsChart from "../components/Insights/Chart";
import StatisticsApi from "../api/Statistics";
import UserFilterDropdown from "../components/Filters/UserFilter";
import MonthSelectComponent from "../components/Selects/Month";
import sessionStore from "../store/session";
import { CircularProgress } from "@material-ui/core";

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

export default function StatisticsView(props) {
  const [StatsData, setStatsData] = useState();
  const [Month, setMonth] = useState(new Date().getMonth() + 1);

  const [AvailableProxies, setAvailableProxies] = useState();

  const [Day, setDay] = useState(formatDate());
  const user = sessionStore.getUser();
  const [SelectedUserFilter, setUserFilter] = useState(user.id);

  const [AnchorElements, setAnchorElements] = useState({
    CHART_VIEW_MODE: null,
  });

  const setAnchorElement = (key, val) => {
    AnchorElements[key] = val;
    setAnchorElements({ ...AnchorElements });
  };

  const syncProxyFilters = () => {};

  const classes = useStyles();

  const syncStats = () => {
    StatisticsApi.GetCrawlerStatistics({
      day: Day,
    }).then(setStatsData);
  };

  function formatDate() {
    var d = new Date(),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  }

  useEffect(() => {
    syncStats();
  }, [Day]);

  const theme = useTheme();

  const renderGraph = () => {
    if (StatsData) {
      return (
        <InsightsChart
          chartData={StatsData.graph}
          style={{ padding: theme.spacing(5), zIndex: 99999 }}
          name={"Buu"}
          tooltipCallbacks={{
            afterLabel: function (tooltipItem, data) {
              return data.full_date;
            },
          }}
        />
      );
    }
    return <CircularProgress />;
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
        <form className={classes.container} noValidate>
          <TextField
            id="date"
            label="Date"
            type="date"
            onChange={(evt) => {
              setDay(evt.target.value);
            }}
            defaultValue={formatDate()}
            className={classes.textField}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </form>
        <Divider
          style={{
            marginLeft: theme.spacing(1),
            marginRight: theme.spacing(1),
          }}
          orientation="vertical"
        />
      </Paper>
      {StatsData && (
        <div>
          <Paper>Total Requests: {StatsData.trackedUrlsTotal || 0}</Paper>
          <Paper>Total Scraped Jobs: {StatsData.jobCntTotal || 0}</Paper>
          <Paper>Total Errors: {StatsData.jobCntTotal || 0}</Paper>
        </div>
      )}
      <div
        style={{
          display: "flex",
        }}
      >
        {renderGraph()}
      </div>

      {/* <Paper style={{ padding: theme.spacing(2), marginTop: theme.spacing(2) }}>
        <Typography variant="h6">Details</Typography>
        <List></List>
        <Collapse></Collapse>
      </Paper> */}
    </div>
  );
}
