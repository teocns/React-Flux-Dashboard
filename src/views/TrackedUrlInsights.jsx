//@ts-check
import {
  Grid,
  Typography,
  Paper,
  makeStyles,
  useTheme,
  Button,
  ButtonBase,
  TableContainer,
  Divider,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { number_format } from "../helpers/numbers";
import { useHistory, useLocation } from "react-router-dom";
import TouchRipple from "@material-ui/core/ButtonBase/TouchRipple";
import SimpleChart from "../components/Charts/Simple";
import CrawlerProcessesTable from "../components/Tables/CrawlerProcesses";
import BugReportIcon from "@material-ui/icons/BugReport";
import TitledDivider from "../components/Dashboard/TitledDivider";
import ViewHeader from "../components/ViewHeader";
import TrackedUrlsApi from "../api/TrackedUrls";
const useStyles = makeStyles((theme) => ({
  cardPaper: {
    //maxWidth: 240,
    padding: theme.spacing(2),
  },
  tableContainer: {
    overflow: "hidden",
    overflowY: "hidden",
    display: "flex",
    flexDirection: "column",
  },
}));

const fromBase64 = (string) => {
  return atob(string);
};
const TrackedUrlInsights = (props) => {
  let location = useLocation();
  const theme = useTheme();
  const requestedUrl = fromBase64(props.match.params.url);

  const classes = useStyles();

  const makeCard = (name, value, change) => {
    return (
      <Grid item xs={4}>
        <Paper className={classes.cardPaper} component={ButtonBase}>
          <div>
            <Typography variant="h6">{name}</Typography>
            <Typography>{number_format(value, 0, ".", ",")}</Typography>
            <Typography>{change}</Typography>
          </div>
        </Paper>
      </Grid>
    );
  };

  useEffect(() => {}, [requestedUrl]);
  return (
    <div
      style={{
        overflowY: "auto",
        overflowX: "hidden",
        padding: theme.spacing(2),
      }}
    >
      <ViewHeader
        // @ts-ignore
        title="Recent crawling events"
        subtitle={requestedUrl}
        subtitleLoading={false}
      />

      <TableContainer component={Paper} className={classes.tableContainer}>
        <CrawlerProcessesTable url={requestedUrl} />
      </TableContainer>
    </div>
  );
};

export default TrackedUrlInsights;
