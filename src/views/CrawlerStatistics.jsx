// @ts-nocheck
import Paper from "@material-ui/core/Paper";
import {
  Collapse,
  Grid,
  Typography,
  TextField,
  List,
  ListItem,
  Divider,
} from "@material-ui/core";
import InfoIcon from "@material-ui/icons/Info";
import DomainsApi from "../api/Domains";
import AjaxAutocomplete from "../components/Autocompletes/Ajax";
import GenericSelect from "../components/Selects/Generic";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import React, { useEffect, useState } from "react";
import InsightsChart from "../components/Insights/Chart";
import StatisticsApi from "../api/Statistics";
import UserFilterDropdown from "../components/Filters/UserFilter";
import ConfigApi from "../api/Config";
import MonthSelectComponent from "../components/Selects/Month";
import sessionStore from "../store/session";
import { CircularProgress } from "@material-ui/core";
import TitledDivider from "../components/Dashboard/TitledDivider";
import { number_format } from "../helpers/numbers";
const useStyles = makeStyles((theme) => ({
  filters: {
    "& > *": {
      marginRight: theme.spacing(2),
    },
  },
}));
var isLoading = true;

export default function StatisticsView(props) {
  const [StatsData, setStatsData] = useState();

  const [Day, setDay] = useState(formatDate());
  const user = sessionStore.getUser();

  const [ProxyFilter, setProxyFilter] = useState();
  const [CrawlerEngineFilter, setCrawlerEngineFilter] = useState();
  const [DomainFilter, setDomainFilter] = useState();

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
      filters: [ProxyFilter, CrawlerEngineFilter, DomainFilter].filter(
        (c) => !!c
      ),
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
  }, [Day, ProxyFilter, DomainFilter, CrawlerEngineFilter]);

  const theme = useTheme();

  const renderGraph = (statisticType) => {
    return (
      <InsightsChart
        chartData={StatsData[statisticType].graph}
        style={{ padding: theme.spacing(5), zIndex: 99999 }}
        name={"Buu"}
        tooltipCallbacks={{
          afterLabel: function (tooltipItem, data) {
            return data.full_date;
          },
        }}
      />
    );
  };

  /**
   * Pass statistics summary attributes to render
   * @param {Array} statistics
   */
  const renderSummaryBox = (statistics) => {
    return (
      <Grid container spacing={2}>
        {statistics.map(({ name, value }) => (
          <Grid item>
            <Typography variant="overline">
              {name}: {number_format(value, 0, ".", ",")}
            </Typography>
          </Grid>
        ))}
      </Grid>
    );
  };

  const renderStatisticType = ({ type, title, statisticMappings }) => {
    return (
      <div style={{}}>
        {title && <TitledDivider title={title} />}

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            padding: theme.spacing(1),
          }}
        >
          {statisticMappings && renderSummaryBox(statisticMappings)}
          {renderGraph(type)}
        </div>
      </div>
    );
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
        variant="outlined"
        className={classes.filters}
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
        <GenericSelect
          label="Proxy"
          ajaxEndpoint={async () => {
            return await ConfigApi.GetConfig("PUBLIC_PROXIES");
          }}
          onChange={(value) => {
            setProxyFilter(value);
          }}
        />
        <GenericSelect
          onChange={(value) => {
            setCrawlerEngineFilter(value);
          }}
          label="Crawler Engine"
          ajaxEndpoint={() => {
            return new Promise((resolve) => {
              resolve(["SCRAPER", "SPIDER"]);
            });
          }}
        />
        <AjaxAutocomplete
          label="Website domain"
          onChange={(value) => {
            setDomainFilter(value);
          }}
          ajaxEndpoint={async (word) => {
            return await DomainsApi.AutoComplete({ word });
          }}
        />

        <Divider
          style={{
            marginLeft: theme.spacing(1),
            marginRight: theme.spacing(1),
          }}
          orientation="vertical"
        />
      </Paper>
      <TitledDivider
        icon={<InfoIcon />}
        title={
          `Viewing statistics for: ${Day} ` +
          (ProxyFilter ? `, Proxy ${ProxyFilter}` : "") +
          (CrawlerEngineFilter
            ? `, Crawler Engine ${CrawlerEngineFilter}`
            : "") +
          (DomainFilter ? `, Domain ${DomainFilter}` : "")
        }
      />
      {StatsData && (
        <React.Fragment>
          {renderStatisticType({
            type: "overview",
            statisticMappings: [
              {
                name: "Links extraction tasks",
                value: StatsData.overview.summary.crawler_threads_scrape_links,
              },
              {
                name: "Job scraping tasks",
                value: StatsData.overview.summary.crawler_threads_scrape_jobs,
              },
              {
                name: "Crawler Threads Failed",
                value: StatsData.overview.summary.crawler_threads_failed,
              },
              {
                name: "Jobs",
                value: StatsData.overview.summary.jobs,
              },
            ],
          })}
          {renderStatisticType({
            title: "Jobs flow",
            type: "jobs",
            statisticMappings: [
              {
                name: "Jobs parsed",
                value: StatsData.jobs.summary.jobs,
              },
              {
                name: "Job schema extracting errors",
                value: StatsData.jobs.summary.jobs_parsing_errors,
              },
              {
                name: "Jobs pushed to S3",
                value: StatsData.jobs.summary.jobs_pushed_to_s3,
              },
            ],
          })}
          {renderStatisticType({
            title: "Timings averages (ms)",
            type: "timings",
            // statisticMappings: [
            //   {
            //     name: "AVG Crawler Thread Processing Time",
            //     value: StatsData.timings.time_needed_execution,
            //   },
            //   {
            //     name: "AVG Request Time",
            //     value: StatsData.timings.time_needed_requests,
            //   },
            // ],
          })}
          {renderStatisticType({
            title: "Requests flow",
            type: "dynamics",
          })}
          {renderStatisticType({
            title: "Errors",
            type: "errors",
          })}

          <TitledDivider title={"Bandwith consumption (GB)"} />
          <Grid container>
            <Grid item xs={12}>
              {renderStatisticType({
                type: "bandwith",
              })}
            </Grid>
            <Grid item xs={12}></Grid>
          </Grid>
        </React.Fragment>
      )}
    </div>
  );
}
