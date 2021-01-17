import React, { useEffect, useState } from "react";
import HttpIcon from "@material-ui/icons/Http";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import clsx from "clsx";
import Collapse from "@material-ui/core/Collapse";
import {
  IconButton,
  Paper,
  Typography,
  Box,
  TableHead,
  TableRow,
  TableCell,
  TableContainer,
  List,
  Table,
  TableBody,
  ListItem,
  Link,
  Tooltip,
} from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import { Skeleton } from "@material-ui/lab";
import {
  ArrowBack,
  Check,
  Mail,
  Person,
  Visibility,
  VisibilityOff,
  Lock,
  Close,
} from "@material-ui/icons";
import { useHistory } from "react-router-dom";

import ScrapingThreadApi from "../api/ScrapingThread";
import Collapsable from "../components/Collapsable";

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650,
  },
  green: {
    color: "green",
  },
  red: {
    color: "red",
  },
  orange: {
    color: "orange",
  },
}));
const ScrapingThreadDetailsView = (props) => {
  const [Rows, setRows] = useState(null);

  const history = useHistory();
  const isLoadingResults = !Rows;
  const theme = useTheme();
  const onGoBack = () => {
    history.goBack();
  };
  const classes = useStyles();

  const retrieveResults = async () => {
    const threadId = props.match.params.threadId;
    const details = await ScrapingThreadApi.GetDetails(threadId);
    setRows(details);
  };

  useEffect(() => {
    retrieveResults();
  }, []);

  const renderRetryStatusCode = (statusCode) => {
    statusCode = statusCode || 200;
    return (
      <Typography
        variant="overline"
        className={clsx({
          [classes.red]: statusCode >= 400,
          [classes.orange]: statusCode >= 300 && statusCode < 400,
          [classes.green]: statusCode < 300,
        })}
      >
        <code>{statusCode}</code>
      </Typography>
    );
  };

  const renderRetriesTitle = (retries) => {
    if (retries.length === 1) {
      return renderRetryStatusCode(retries[0].statusCode);
    }
  };

  const renderRetry = (retry, num = 1) => {
    const reason = retry.reason ? "/ " + retry.reason : "";
    return (
      <ListItem style={{ padding: 0 }}>
        <Box
          display="inline-flex"
          alignItems="center"
          justifyContent="flex-start"
        >
          <Typography
            variant="caption"
            style={{
              marginRight: theme.spacing(1),
              color: theme.palette.text.hint,
            }}
          >
            ({num})
          </Typography>
          <HttpIcon style={{ marginRight: theme.spacing(1) }} />
          {renderRetryStatusCode(retry.statusCode)} {reason}
        </Box>
      </ListItem>
    );
  };
  const renderJobSchemaFound = (row) => {
    debugger;
    if (row.jobSchemaFound === 1) {
    }
    return !row.jobSchemaFound ? (
      <Tooltip title={"No job schema found in page source"}>
        <Close className={classes.red} />
      </Tooltip>
    ) : (
      <Link
        href={`https://api2-scrapers.bebee.com/scraping-thread/${row.threadId}/schema`}
      >
        View schema
      </Link>
    );
  };
  return (
    <div style={{ display: "inline-block" }}>
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          marginBottom: theme.spacing(1),
        }}
      >
        <IconButton size="small" onClick={onGoBack}>
          <ArrowBack size="small" />
        </IconButton>
        <Typography variant="h6" style={{ marginLeft: theme.spacing(1) }}>
          Viewing scraping thread details
        </Typography>
      </div>

      <Paper style={{ marginBottom: theme.spacing(3) }}>
        <Box display="flex" justifyContent="between" alignItems="center">
          <Box
            display="flex"
            flexDirection="column"
            style={{ padding: theme.spacing(2) }}
          >
            <Typography variant="caption">Total requests performed:</Typography>
            <Typography variant="caption">Failed requests:</Typography>
            <Typography variant="caption">Links found:</Typography>
          </Box>
          <Box
            display="flex"
            flexDirection="column"
            style={{ padding: theme.spacing(2) }}
          >
            <Typography variant="caption">1203</Typography>
            <Typography variant="caption">123</Typography>
            <Typography variant="caption">1298</Typography>
          </Box>
        </Box>
      </Paper>

      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell width="50%">URL</TableCell>
              <TableCell width="35%">Retries</TableCell>
              <TableCell width="15%">Job Schema</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoadingResults
              ? [...Array(8).keys()].map((x) => (
                  <TableRow key={x} style={{ height: 56 }}>
                    <TableCell>
                      <Skeleton animation="wave" style={{ width: "75%" }} />
                    </TableCell>
                    <TableCell align="right">
                      <Skeleton animation="wave" style={{ width: "75%" }} />
                    </TableCell>

                    <TableCell align="right">
                      <Skeleton animation="wave" style={{ width: "75%" }} />
                    </TableCell>
                  </TableRow>
                ))
              : Rows.map((row) => (
                  <TableRow key={row.pageAuditId}>
                    <TableCell scope="row" verticalAlign="start">
                      <Link href={row.url} target="_blank">
                        {row.url}
                      </Link>
                    </TableCell>
                    <TableCell align="left">
                      {row.retries.length === 1 ? (
                        renderRetry(row.retries[0])
                      ) : (
                        <Collapsable title={renderRetriesTitle(row.retries)}>
                          <List>
                            {row.retries.map((retry, index) =>
                              renderRetry(retry, index + 1)
                            )}
                          </List>
                        </Collapsable>
                      )}
                    </TableCell>
                    <TableCell>{renderJobSchemaFound(row)}</TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default ScrapingThreadDetailsView;
