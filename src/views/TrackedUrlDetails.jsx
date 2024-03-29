import React, { useEffect, useState } from "react";
import AddBoxOutlinedIcon from "@material-ui/icons/AddBoxOutlined";
import HttpIcon from "@material-ui/icons/Http";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import clsx from "clsx";
import { motion, AnimatePresence } from "framer-motion";
import SubdirectoryArrowRightIcon from "@material-ui/icons/SubdirectoryArrowRight";
import HourglassEmptyIcon from "@material-ui/icons/HourglassEmpty";
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
  Button,
} from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import { Skeleton } from "@material-ui/lab";
import {
  ArrowBack,
  Check,
  Extension as ExtensionIcon,
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

const openWindowWithJson = (dict) => {
  let jsstr = JSON.stringify(dict, undefined, 2);
  console.log(dict);
  let myWindow = window.open(
    "about:blank?doctype=application/json",
    "_blank",
    "width=420,height=480"
  );
  let pre = myWindow.document.createElement("pre");
  pre.textContent = jsstr;
  myWindow.document.body.appendChild(pre);
  myWindow.focus();
};

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
  subRow: {
    marginLeft: theme.spacing(3),
  },
}));
const ScrapingThreadDetailsView = (props) => {
  const [CollapsedRow, setCollapsedRow] = useState(null);
  const [Rows, setRows] = useState(null);
  const ShortDetails = {
    totalRequests: 0,
    failedRequests: 0,
    scrapedJobs: 0,
  };
  if (Array.isArray(Rows))
    for (let scrapingThread of Rows) {
      if (scrapingThread.requests && Array.isArray(scrapingThread.requests)) {
        for (let request of scrapingThread.requests) {
          ShortDetails.totalRequests += 1;
          if (request.statusCode >= 400) {
            ShortDetails.failedRequests += 1;
          }
        }
        if (scrapingThread.jobSchemaFound) {
          ShortDetails.scrapedJobs += scrapingThread.scrapedJobs;
        }
      }
    }
  const history = useHistory();
  const isLoadingResults = !Rows;
  const theme = useTheme();
  const onGoBack = () => {
    history.goBack();
  };
  const classes = useStyles();
  const parentThreadId = props.match.params.threadId;

  const retrieveResults = async () => {
    const details = await ScrapingThreadApi.GetDetails(parentThreadId);
    setRows(details);
  };

  useEffect(() => {
    retrieveResults();
  }, []);

  const renderStatusCode = (
    statusCode,
    statusText,
    isFromExtension,
    isCompleted,
    parentThreadId
  ) => {
    let statusCodeRenderable = statusCode ? (
      <code>{statusCode}</code>
    ) : isFromExtension && !parentThreadId ? (
      <div style={{ display: "inline-flex", alignItems: "center" }}>
        <ExtensionIcon
          style={{
            color: theme.palette.text.hint,
            height: 18,
            width: 18,
            marginRight: theme.spacing(1),
          }}
        />
        {`Scraped from extension`}
      </div>
    ) : (
      <div style={{ display: "inline-flex", alignItems: "center" }}>
        <HourglassEmptyIcon
          style={{
            color: theme.palette.text.hint,
            height: 18,
            width: 18,
            marginRight: theme.spacing(1),
          }}
        />
        {`Pending crawl`}
      </div>
    );
    if (!statusCode && !isCompleted) {
      statusText = "Waiting for Bot to crawl the URL";
    }
    statusText =
      !statusText && isFromExtension && !parentThreadId
        ? `This URL's was crawled from the Extension, and the bot won't perform any actions on this.`
        : statusText;
    return (
      <Tooltip title={statusText}>
        <Typography
          variant="caption"
          className={clsx({
            [classes.red]: statusCode >= 400,
            [classes.orange]: statusCode >= 300 && statusCode < 400,
            [classes.green]: statusCode < 300,
          })}
        >
          {statusCodeRenderable}
        </Typography>
      </Tooltip>
    );
  };

  // const renderRetriesTitle = (retries) => {
  //   if (retries.length === 1) {
  //     return renderStatusCode(retries[0].statusCode);
  //   }
  // };

  // const renderRetry = (retry, num = 1) => {
  //   const reason = retry.reason ? "/ " + retry.reason : "";
  //   return (
  //     <ListItem style={{ padding: 0 }}>
  //       <Box
  //         display="inline-flex"
  //         alignItems="center"
  //         justifyContent="flex-start"
  //       >
  //         <Typography
  //           variant="caption"
  //           style={{
  //             marginRight: theme.spacing(1),
  //             color: theme.palette.text.hint,
  //           }}
  //         >
  //           ({num})
  //         </Typography>
  //         <HttpIcon style={{ marginRight: theme.spacing(1) }} />
  //         {renderStatusCode(retry.statusCode, retry.statusText)}
  //       </Box>
  //     </ListItem>
  //   );
  // };

  const renderJobSchemaFound = ({ jobSchemaFound, threadId, isCompleted }) => {
    if (!isCompleted) {
      return "-";
    }
    return !jobSchemaFound ? (
      <Tooltip title={"No job schema found in page source"}>
        <Close className={classes.red} />
      </Tooltip>
    ) : (
      <Link
        href={`https://api2-scrapers.bebee.com/scraping-thread/${threadId}/schema`}
        target="_blank"
      >
        View schema
      </Link>
    );
  };
  const renderRow = (data, renderRequest = null) => {
    // Filter out some requests that have empty URL
    if (renderRequest && !renderRequest.url) {
      return null;
    }

    // Collapsed row?
    const isSubRow = !!renderRequest;

    let url = data.scraping_thread.url;
    let threadId = data.scraping_thread.threadId;
    let requests = data.requests;
    if (!renderRequest) {
      renderRequest = requests[0];
    }
    const hasResources = data.spider_used && data.requests.length > 0;

    return (
      <TableRow
        key={data.threadId}
        // className={clsx({
        //   [classes.subRow]: !!isSubRow,
        // })}
      >
        <TableCell>
          <Box display="flex" style={{ alignItems: "center" }}>
            {isSubRow && (
              // <div
              //   style={{ padding: 24, background: theme.palette.grey[200] }}
              // ></div>
              <SubdirectoryArrowRightIcon
                size="small"
                style={{
                  marginLeft: theme.spacing(2),
                  color: theme.palette.grey[400],
                }}
              />
            )}
            <Box
              display="flex"
              flexDirection="column"
              style={{
                padding: theme.spacing(2),
                maxWidth: "100%",
                overflow: "hidden",
              }}
            >
              <Typography
                variant="caption"
                style={{ color: theme.palette.text.disabled }}
              >
                #{data.scraping_thread.threadId}
              </Typography>
              <Link
                href={renderRequest.url}
                target="_blank"
                style={{ textOverflow: "clip" }}
              >
                {renderRequest.url}
              </Link>
              {!isSubRow && data.requests.length >= 2 && (
                <div
                  compoennt={Button}
                  style={{
                    color: theme.palette.text.hint,
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    const target = Boolean(CollapsedRow) ? 0 : threadId;

                    setCollapsedRow(target);
                  }}
                >
                  <AddBoxOutlinedIcon
                    style={{
                      height: 16,
                      width: 16,
                      marginRight: theme.spacing(1),
                    }}
                  />
                  <Typography variant="caption">
                    ({requests.length}){" "}
                    {hasResources ? " resources loaded" : " retries"}
                  </Typography>
                </div>
              )}
            </Box>
          </Box>
        </TableCell>
        <TableCell>
          {(() => {
            return renderStatusCode(
              renderRequest.response.status_code,
              renderRequest.response.status_text,
              false,
              1,
              data.scraping_thread.parentThreadId
            );
          })()}
        </TableCell>
        <TableCell>
          {(() => {
            if (isSubRow) {
              return renderRequest.response.time_needed;
            }
            return data.timings.post_processing + data.timings.crawler;
          })()}
        </TableCell>
        <TableCell>
          {/* {renderJobSchemaFound({ threadId, jobSchemaFound, isCompleted })} */}
          {data.job_schemas.length ? (
            <Link
              href={`https://api2-scrapers.bebee.com/scraping-thread/${threadId}/schema`}
              target="_blank"
            >
              View schemas
            </Link>
          ) : (
            "-"
          )}
        </TableCell>
      </TableRow>
    );
  };

  return (
    <div style={{ display: "inline-block", paddingBottom: 168 }}>
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

      <Paper variant="outlined" style={{ marginBottom: theme.spacing(3) }}>
        <Box display="flex" justifyContent="between" alignItems="center">
          <Box
            display="flex"
            flexDirection="column"
            style={{ padding: theme.spacing(2) }}
          >
            <Typography variant="caption">Total requests performed:</Typography>
            <Typography variant="caption">Failed requests:</Typography>
            <Typography variant="caption">Job schemas:</Typography>
            <Link
              href="javascript:void(0)"
              onClick={() => {
                let js = Rows;
                for (let i = 0; i < js.length; i++) {
                  js[i].results = JSON.parse(js[i].results);
                }
                openWindowWithJson(js);
              }}
            >
              View raw json
            </Link>
          </Box>
          <Box
            display="flex"
            flexDirection="column"
            style={{ padding: theme.spacing(2) }}
          >
            <Typography variant="caption">
              {ShortDetails.totalRequests}
            </Typography>
            <Typography variant="caption">
              {ShortDetails.failedRequests}
            </Typography>
            <Typography variant="caption">
              {ShortDetails.scrapedJobs}
            </Typography>
          </Box>
        </Box>
      </Paper>

      <TableContainer component={Paper}>
        <Table
          className={classes.table}
          aria-label="simple table"
          style={{ tableLayout: "fixed" }}
        >
          <colgroup>
            <col style={{ width: "60%" }} />
            <col style={{ width: "20%" }} />
            <col style={{ width: "10%" }} />
            <col style={{ width: "10%" }} />
          </colgroup>
          <TableHead>
            <TableRow>
              <TableCell width="60%">URL</TableCell>
              <TableCell width="15%">Status</TableCell>
              <TableCell width="15%">Time needed (ms)</TableCell>
              <TableCell width="10%">Job Schema(s)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoadingResults
              ? [...Array(8).keys()].map((x) => (
                  <TableRow key={x} style={{ height: 56 }}>
                    <TableCell>
                      <Skeleton animation="wave" style={{ width: "60%" }} />
                    </TableCell>
                    <TableCell align="right">
                      <Skeleton animation="wave" style={{ width: "15%" }} />
                    </TableCell>
                    <TableCell align="right">
                      <Skeleton animation="wave" style={{ width: "15%" }} />
                    </TableCell>
                    <TableCell align="right">
                      <Skeleton animation="wave" style={{ width: "10%" }} />
                    </TableCell>
                  </TableRow>
                ))
              : Rows.map((row) => {
                  const threadId = row.threadId;
                  const rowData = JSON.parse(row.results);
                  return (
                    <React.Fragment>
                      {renderRow(rowData)}

                      {CollapsedRow === threadId &&
                        rowData.requests.map((request) =>
                          renderRow(rowData, request)
                        )}
                    </React.Fragment>
                  );
                })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default ScrapingThreadDetailsView;
