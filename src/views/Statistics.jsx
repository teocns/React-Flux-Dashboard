import React, { useState, useEffect } from "react";
import Chart from "chart.js";

import clsx from "clsx";
import PropTypes from "prop-types";

import SearchIcon from "@material-ui/icons/Search";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableFooter from "@material-ui/core/TableFooter";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import IconButton from "@material-ui/core/IconButton";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import LastPageIcon from "@material-ui/icons/LastPage";

import { useHistory } from "react-router-dom";

import AddIcon from "@material-ui/icons/Add";
import LinkIcon from "@material-ui/icons/Link";
import sessionStore from "../store/session";
import ManagaUrlsTable from "../components/Tables/ManageUrls";
import dispatcher from "../dispatcher";

import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { Skeleton } from "@material-ui/lab";
import MultiFilter from "../components/Filters/MultiFilter";

import Statistics from "../models/Statistics";
import statisticsActions from "../actions/Statistics";
import statisticsStore from "../store/Statistics";
import AssignmentTurnedInIcon from "@material-ui/icons/AssignmentTurnedIn";
import ActionTypes from "../constants/ActionTypes";
import LineGraph from "../components/Charts/Statistics";
import {
  ButtonGroup,
  Select,
  MenuItem,
  Menu,
  CircularProgress,
} from "@material-ui/core";
import DateRanges from "../constants/DateRanges";
import DateFilter from "../components/Filters/DateFilter";
import UserFilter from "../components/Filters/UserFilter";
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
export default function StatisticsView() {
  const [Statistics, setStatistics] = useState(statisticsStore.getStatistics());

  //const [UserFilter, setUserFilter] = useState(null);
  const [DateRangeFilter, setDateRangeFilter] = useState(DateRanges[0]);

  const user = sessionStore.getUser();

  const [SelectedUserFilter, setUserFilter] = useState(null);

  const handleDateFilterChanged = (dateRange) => {
    if (!dateRange.timeFrame) {
      dateRange.timeFrame = "DAY";
    }
    setDateRangeFilter(dateRange);
  };
  const classes = useStyles();

  const bull = <span className={classes.bullet}>•</span>;

  const syncStatistics = () => {
    isLoading = true;
    statisticsActions.syncStatistics({
      dateRange: DateRangeFilter,
      userFilter: SelectedUserFilter,
    });
  };

  const onStatisticsSynced = () => {
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
  return (
    <div style={{ overflowY: "auto" }}>
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
                console.log(dd);
                setUserFilter(dd);
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
      </Paper>
      <div
        style={{
          display: "flex",
        }}
      >
        <Card className={classes.card}>
          <CardContent>
            <Box display="flex" flexDirection="row" alignItems="center">
              <div style={{ flex: 1 }}>
                <Typography
                  className={classes.title}
                  color="textSecondary"
                  gutterBottom
                >
                  Total tracked URLs
                </Typography>
                {isLoading ? (
                  <Skeleton
                    variant="rect"
                    style={{ width: 120, marginTop: 8 }}
                  ></Skeleton>
                ) : (
                  <Typography variant="h5" component="h2">
                    {Statistics.summary.trackedUrls}
                  </Typography>
                )}
              </div>
              <div
                className={clsx({
                  [classes.circle]: true,
                  [classes.circleOrange]: true,
                })}
              >
                <LinkIcon className={classes.cardIcon} />
              </div>
            </Box>
          </CardContent>
          {false && (
            <CardActions>
              <Button size="small">Learn More</Button>
            </CardActions>
          )}
        </Card>
        <Card className={classes.card}>
          <CardContent>
            <Box display="flex" flexDirection="row" alignItems="center">
              <div style={{ flex: 1 }}>
                <Typography
                  className={classes.title}
                  color="textSecondary"
                  gutterBottom
                >
                  Inserted Jobs
                </Typography>
                {isLoading ? (
                  <Skeleton
                    variant="rect"
                    style={{ width: 120, marginTop: 8 }}
                  ></Skeleton>
                ) : (
                  <Typography variant="h5" component="h2">
                    {Statistics.summary.scrapedJobs}
                  </Typography>
                )}
              </div>
              <div
                className={clsx({
                  [classes.circle]: true,
                  [classes.circleBlue]: true,
                })}
              >
                <AssignmentTurnedInIcon className={classes.cardIcon} />
              </div>
            </Box>
          </CardContent>
          {false && (
            <CardActions>
              <Button size="small">Learn More</Button>
            </CardActions>
          )}
        </Card>
      </div>

      {Statistics && (
        <div
          style={{
            margin: 64,
            minWidth: 480,
            minHeight: 480,
            position: "relative",
          }}
        >
          {!isLoading ? (
            <LineGraph chartData={Statistics.chartData} />
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
        </div>
      )}
    </div>
  );
}
