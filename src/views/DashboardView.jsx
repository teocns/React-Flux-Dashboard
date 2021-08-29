import Paper from "@material-ui/core/Paper";
import DetailsIcon from "@material-ui/icons/Details";
import LanguageIcon from "@material-ui/icons/Language";
import {
  Collapse,
  Grid,
  Typography,
  List,
  ListItem,
  Divider,
} from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import React, { useEffect, useState } from "react";
import InsightsChart from "../components/Insights/Chart";
import StatisticsApi from "../api/Statistics";
import UserFilterDropdown from "../components/Filters/UserFilter";
import YearSelectComponent from "../components/Selects/Year";
import MonthSelectComponent from "../components/Selects/Month";
import DaySelectComponent from "../components/Selects/Day";
import sessionStore from "../store/session";
import { CircularProgress } from "@material-ui/core";
import { number_format } from "../helpers/numbers";
import TitledDivider from "../components/Dashboard/TitledDivider";
import CrawlingPerformance from "../components/Insights/Cards/TrackedUrlsEfficiency";
import TrackedUrlsEfficiency from "../components/Insights/Cards/TrackedUrlsEfficiency";
import TrackedUrlsCard from "../components/Insights/Cards/TrackedUrls";
import ScrapedJobsCard from "../components/Insights/Cards/ScrapedJobs";
import PortalsCard from "../components/Insights/Cards/PortalsTracked";
import EarningsCard from "../components/Insights/Cards/Earnings";
import DomainsPerformanceTable from "../components/Tables/DomainsPerformance";
import { FilterList } from "@material-ui/icons";

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

export default function DashboardView(props) {
  const [StatsData, setStatsData] = useState();
  const [Month, setMonth] = useState(new Date().getMonth() + 1);
  const [Year, setYear] = useState(new Date().getFullYear());
  const [Day, setDay] = useState(undefined);
  const user = sessionStore.getUser();
  const [SelectedUserFilter, setUserFilter] = useState(user.id);

  const [AnchorElements, setAnchorElements] = useState({
    CHART_VIEW_MODE: null,
  });

  const setAnchorElement = (key, val) => {
    AnchorElements[key] = val;
    setAnchorElements({ ...AnchorElements });
  };

  const classes = useStyles();

  const syncStats = () => {
    if (!Month && !SelectedUserFilter) {
      return false;
    }
    StatisticsApi.GetUserStatistics({
      userId: SelectedUserFilter,
      month: Month,
    }).then(setStatsData);
  };

  useEffect(() => {
    syncStats();
  }, [Month, SelectedUserFilter]);

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
    <div
      style={{
        overflowY: "auto",
        overflowX: "hidden",
        padding: theme.spacing(2),
      }}
    >
      <Paper
        elevation={0}
        variant="outlined"
        style={{
          padding: theme.spacing(2),

          display: "flex",
          alignItems: "center",
        }}
      >
        <Grid container direction="row" spacing={1} alignItems="center">
          <Grid item alignItems={"center"}>
            <FilterList
              style={{
                marginRight: 8,
                marginTop: 8,
              }}
            />
          </Grid>
          <Grid item>
            <UserFilterDropdown
              onUserFilterChanged={(userId) => {
                setUserFilter(userId);
              }}
            />
          </Grid>

          <Grid item>
            <YearSelectComponent
              onYearChanged={(year) => {
                setYear(year);
              }}
              year={Year}
            />
            <MonthSelectComponent
              onMonthChanged={(month) => {
                setMonth(month);
              }}
            />
            <DaySelectComponent
              month={Month}
              year={Year}
              day={Day}
              onDayChanged={(day) => {
                setDay(day);
              }}
            />
          </Grid>
        </Grid>
      </Paper>
      {/* <div>
        <TitledDivider
          title="Overview"
          subtitle="Pick a specific day from the filter to view crawling performance reports"
        />
      </div> */}
      {/* {StatsData && (
        <Paper
          variant="outlined"
          style={{ padding: theme.spacing(2), marginBottom: theme.spacing(2) }}
        >
          <Grid container spacing={2}>
            <Grid item>
              <Typography variant="overline">
                Tracked URLs:{" "}
                <code>
                  {number_format(StatsData.trackedUrlsTotal || 0, 0, ".", ",")}
                </code>
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="overline">
                Scraped Jobs:{" "}
                <code>
                  {number_format(StatsData.jobCntTotal || 0, 0, ".", ",")}
                </code>
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="overline">
                Earnings:{" "}
                <code style={{ color: "green" }}>
                  €{number_format(StatsData.earningsTotal || 0, 2, ".", ",")}
                </code>
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      )} */}

      <Grid
        container
        spacing={2}
        style={{ padding: theme.spacing(0), paddingBottom: theme.spacing(3) }}
        direction="row"
      >
        {/* <Grid item xs={6} md={3} xl={2}>
          <TrackedUrlsEfficiency />
        </Grid> */}

        <Grid item xs={12}>
          <TitledDivider
            title="Summary"
            subtitle="Insights on tracked portals over the selected timeframe. Click on the portal to view the tracked URLs"
            icon={<DetailsIcon />}
          />
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={2} direction="row" style={{ padding: 0 }}>
            <Grid item xs={12} xl={6}>
              <TrackedUrlsCard count={123214} />
            </Grid>
            <Grid item xs={12} xl={6}>
              <ScrapedJobsCard
                day={Day}
                year={Year}
                month={Month}
                count={129839}
              />
            </Grid>
            <Grid item xs={12} xl={6}>
              <PortalsCard count={129839} />
            </Grid>
            <Grid item xs={12} xl={6}>
              <EarningsCard count={129839} />
            </Grid>
          </Grid>
        </Grid>
        {/* <Grid item xs={12}>
          <TitledDivider
            title="Tracked portals"
            subtitle="Insights on tracked portals over the selected timeframe. Click on the portal to view the tracked URLs"
            icon={<LanguageIcon />}
          />
        </Grid>
        <Grid item xs={12}>
          <DomainsPerformanceTable />
        </Grid> */}

        <Grid item xs={12} xl={12}>
          <div
            style={{
              display: "flex",

              padding: 2,
              paddingBottom: theme.spacing(2),
            }}
          >
            {renderGraph()}
          </div>
        </Grid>
      </Grid>
    </div>
  );
}
