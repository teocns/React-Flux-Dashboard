import PauseIcon from "@material-ui/icons/Pause";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";
import uiActions from "../actions/UI";
import { number_format } from "../helpers/numbers";
import {
  Button,
  Divider,
  FormControl,
  Tooltip,
  TextField,
  InputAdornment,
  Grid,
  Typography,
  OutlinedInput,
  ButtonGroup,
  IconButton,
  CircularProgress,
} from "@material-ui/core";

import { Link as RouterLink } from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import TableContainer from "@material-ui/core/TableContainer";
import SearchIcon from "@material-ui/icons/Search";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import DomainsManagementTable from "../components/Tables/DomainsManagement";
import UserFilterComponent from "../components/Filters/UserFilter";
import sessionStore from "../store/session";
import MultiFilter from "../components/Filters/MultiFilter";
import { Settings, TextFieldsOutlined } from "@material-ui/icons";
import { useEffect } from "react";
import CrawlerControlApi from "../api/CrawlerControl";
const useStyles = makeStyles({
  table: {
    minWidth: 500,
  },
  tableContainer: {
    overflow: "hidden",
    overflowY: "hidden",
    display: "flex",
    flexDirection: "column",
  },
});
let filterTimeout = undefined;

export default function CrawlerControlCenter() {
  const [CrawlerThreadsData, setCrawlerThreadsData] = useState();
  //const [AutoscalingConfig, setAutoscalingConfig] = useState();

  //const [CrawlerThreadsData, setCrawlerThreadsData] = useState();

  // const fetchAutoscalingConfig = () => {
  //   CrawlerControlApi.GetAutoscalingConfig().then((data) => {
  //     setAutoscalingConfig(data);
  //   });
  // };

  const fetchCrawlerStats = () => {
    CrawlerControlApi.GetConfig().then((data) => {
      console.log(data);
      setCrawlerThreadsData(data);
    });
  };

  const startCrawling = () => {
    CrawlerControlApi.StartCrawler().then((data) => {
      console.log(data);
      data.success
        ? uiActions.showSnackbar("Crawlers started succcessfully", "success")
        : uiActions.showSnackbar(data.error, "error");
      fetchCrawlerStats();
      //setCrawlerThreadsData(data);
    });
  };

  const reloadIncompleteThreads = () => {
    if (window.confirm("Are you sure?")) {
      CrawlerControlApi.ReloadIncompleteThreads().then((data) => {
        console.log(data);
        data.success &&
          uiActions.showSnackbar("Tasks reloaded successfully", "success");
        fetchCrawlerStats();
        //setCrawlerThreadsData(data);
      });
    }
  };

  const pauseCrawling = () => {
    CrawlerControlApi.StopCrawler().then((data) => {
      console.log(data);
      data.success &&
        uiActions.showSnackbar("Crawlers stopped succcessfully", "success");
      fetchCrawlerStats();
      //setCrawlerThreadsData(data);
    });
  };

  useEffect(() => {
    //fetchAutoscalingConfig();
    fetchCrawlerStats();
  }, []);

  const theme = useTheme();

  const render = () => {
    if (!CrawlerThreadsData) {
      return <CircularProgress />;
    }
    return (
      <div
        style={{
          overflowY: "auto",
          overflowX: "hidden",
          padding: theme.spacing(2),
        }}
      >
        <Paper variant={"outlined"} style={{ padding: theme.spacing(2) }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex" }}>
              <Typography variant="h6">
                Crawler Core{" "}
                {CrawlerThreadsData ? (
                  CrawlerThreadsData.crawling_paused ? (
                    <code style={{ color: "red" }}>PAUSED</code>
                  ) : (
                    <code style={{ color: "green" }}>RUNNING</code>
                  )
                ) : (
                  ""
                )}{" "}
              </Typography>
            </div>

            <Grid container spacing={0} style={{ padding: theme.spacing(1) }}>
              <Grid item xs={3}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <Typography variant="overline">
                    Tasks queued:{" "}
                    {number_format(CrawlerThreadsData.tasks_queued || 0)}
                  </Typography>
                  <Typography variant="overline">
                    Tasks in-process:{" "}
                    {number_format(CrawlerThreadsData.tasks_inprocess || 0)}
                  </Typography>
                </div>
              </Grid>
              <Grid item xs={3}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <Typography variant="overline">
                    Scrape jobs task:{" "}
                    {number_format(CrawlerThreadsData.scrape_jobs || 0)}
                  </Typography>
                  <Typography variant="overline">
                    Extract links tasks:{" "}
                    {number_format(CrawlerThreadsData.scrape_links || 0)}
                  </Typography>
                </div>
              </Grid>
              <Grid item xs={3}></Grid>
            </Grid>

            <div>
              <ButtonGroup disabled={!CrawlerThreadsData}>
                <Tooltip
                  title={
                    "Gracefully " +
                    (CrawlerThreadsData.crawling_paused ? "start" : "pause") +
                    " crawling"
                  }
                >
                  <Button
                    onClick={
                      CrawlerThreadsData.crawling_paused
                        ? startCrawling
                        : pauseCrawling
                    }
                  >
                    {CrawlerThreadsData.crawling_paused ? "start" : "pause"}{" "}
                    crawling
                  </Button>
                </Tooltip>
                <Tooltip title="Fetches ready crawler threads and puts them in REDIS queue">
                  <Button onClick={reloadIncompleteThreads}>
                    Reload incomplete threads
                  </Button>
                </Tooltip>

                <Tooltip title="Clears all Redis cache. Use with caution">
                  <Button>Clear redis cache</Button>
                </Tooltip>
              </ButtonGroup>
            </div>
          </div>
        </Paper>
        <Paper
          variant={"outlined"}
          style={{ padding: theme.spacing(2), marginTop: theme.spacing(2) }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="h6">Autoscaling</Typography>
              <RouterLink to="/autoscaling-config">
                <IconButton>
                  <Settings />
                </IconButton>
              </RouterLink>
            </div>
            <Grid container spacing={0} style={{ padding: theme.spacing(1) }}>
              <Grid item xs={4}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <Typography variant="overline">
                    Scraper Per-Distribution Capacity:{" "}
                    {number_format(
                      (CrawlerThreadsData &&
                        CrawlerThreadsData.autoscaling_distribution_scraper_configured_capacity) ||
                        0
                    )}
                  </Typography>

                  <Typography variant="overline">
                    Browser Engine Per-Distribution Capacity:{" "}
                    {number_format(
                      (CrawlerThreadsData &&
                        CrawlerThreadsData.autoscaling_distribution_spider_configured_capacity) ||
                        0
                    )}
                  </Typography>

                  <Typography variant="overline">
                    Crawler Thread Processing Per-Distribution Capacity:{" "}
                    {number_format(
                      (CrawlerThreadsData &&
                        CrawlerThreadsData.autoscaling_distribution_processor_configured_capacity) ||
                        0
                    )}
                  </Typography>
                </div>
              </Grid>
              <Grid item xs={4}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <Typography variant="overline">
                    Live Scraper Distributions:{" "}
                    {number_format(
                      CrawlerThreadsData.autoscaling_distribution_scraper_current ||
                        0
                    )}
                  </Typography>

                  <Typography variant="overline">
                    Live Browser Engine Distributions:{" "}
                    {number_format(
                      CrawlerThreadsData.autoscaling_distribution_spider_current ||
                        0
                    )}
                  </Typography>

                  <Typography variant="overline">
                    Live Crawler Thread Processing Distributions:{" "}
                    {number_format(
                      CrawlerThreadsData.autoscaling_distribution_processor_current ||
                        0
                    )}
                  </Typography>
                </div>
              </Grid>
              <Grid item xs={4}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <Typography variant="overline">
                    Forecast Scraper Distributions:{" "}
                    {number_format(
                      CrawlerThreadsData.autoscaling_distributions_scraper_forecast ||
                        1
                    )}
                  </Typography>

                  <Typography variant="overline">
                    Forecast Browser Engine Distributions:{" "}
                    {number_format(
                      CrawlerThreadsData.autoscaling_distributions_spider_forecast ||
                        1
                    )}
                  </Typography>

                  <Typography variant="overline">
                    Forecast Thread Processing Distributions:{" "}
                    {number_format(
                      CrawlerThreadsData.autoscaling_distributions_processor_forecast ||
                        1
                    )}
                  </Typography>
                </div>
              </Grid>
            </Grid>
          </div>
        </Paper>
      </div>
    );
  };
  return render();
}
