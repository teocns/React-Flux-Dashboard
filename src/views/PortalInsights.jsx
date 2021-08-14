//@ts-check
import React, { useState } from "react";
import HistoryIcon from "@material-ui/icons/History";
import StatisticsCard from "../components/Statistics/Card";
import {
  Grid,
  Typography,
  Paper,
  makeStyles,
  useTheme,
  Button,
  ButtonBase,
  TableContainer,
} from "@material-ui/core";

import { number_format } from "../helpers/numbers";
import { useHistory, useLocation } from "react-router-dom";
import TouchRipple from "@material-ui/core/ButtonBase/TouchRipple";
import SimpleChart from "../components/Charts/Simple";
import CrawlerThreadsTable from "../components/Tables/CrawlerProcesses";
import TitledDivider from "../components/Dashboard/TitledDivider";
import { BugReport } from "@material-ui/icons";
import InsightsChart from "../components/Insights/Chart";
import ViewHeader from "../components/ViewHeader";
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

const PortalInsights = (props) => {
  const [DateRange, setDateRange] = useState("MAX");
  let location = useLocation();
  const theme = useTheme();
  const requestedDomain = props.match.params.portal;
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

  return (
    <React.Fragment>
      {/* <Paper elevation={0}>Tracked URLs</Paper> */}
      {/* <InsightsChart
        filter={{
          domain: requestedDomain,
          dateRange: DateRange,
        }}
      /> */}
      <ViewHeader title="Domain insights" subtitle={requestedDomain} />
      <StatisticsCard
        title="Average scraped jobs"
        value={number_format(12.5)}
      />
      <TitledDivider title="Recent crawling events" icon={<HistoryIcon />} />
      <TableContainer component={Paper} className={classes.tableContainer}>
        <CrawlerThreadsTable domain={requestedDomain} />
      </TableContainer>
    </React.Fragment>
  );
};

export default PortalInsights;
