import React from "react";

import { makeStyles, useTheme } from "@material-ui/core/styles";
import {
  Box,
  CircularProgress,
  LinearProgress,
  Link,
  Table,
  TableBody,
  Tooltip,
  TableCell,
  TableContainer,
  TableFooter,
  TablePagination,
  TableRow,
  Typography,
} from "@material-ui/core";

import { Statuses } from "../../constants/ScrapingThread";
import {
  BrandingWatermark,
  Cancel,
  HourglassFull,
  Today,
  HourglassEmpty,
  DoneAll,
  BrandingWatermarkOutlined,
  Check,
  ErrorOutline,
  BugReport,
} from "@material-ui/icons";

const ScrapingThreadTableStatus = ({ row }) => {
  const theme = useTheme();
  const renderThreadStatus = () => {
    let icon = undefined;
    let innerText = undefined;
    let caption = undefined;
    switch (row.status) {
      case Statuses.BAD_LINK:
        innerText = "Bad link";
        icon = (
          <Tooltip title="Could not scrape link">
            <ErrorOutline
              style={{
                width: 18,
                height: 18,
                color: "red",
              }}
            />
          </Tooltip>
        );
        break;
      case Statuses.SEARCHING_PAGE:
        innerText = "SCANNING URL";
        icon = (
          <BugReport
            color="primary"
            style={{
              width: 18,
              height: 18,
            }}
          />
        );
        break;
      case Statuses.QUEUED:
        innerText = "in queue";
        icon = (
          <Tooltip title="Link queued for scraping">
            <HourglassEmpty
              style={{
                width: 18,
                height: 18,
                color: theme.palette.text.hint,
              }}
            />
          </Tooltip>
        );
        break;
      case Statuses.COMPLETED:
        innerText = `${
          row.scrapedJobs > 0 ? row.scrapedJobs : "No"
        } Jobs found`;
        caption = `IN ${row.auditsCount} LINKS`;
        icon =
          row.scrapedJobs > 0 ? (
            <Tooltip title="Scraping is completed">
              <DoneAll
                style={{
                  width: 18,
                  height: 18,
                  color: "green",
                }}
              />
            </Tooltip>
          ) : (
            <Tooltip title="No jobs found">
              <ErrorOutline
                style={{
                  width: 18,
                  height: 18,
                  color: "red",
                }}
              />
            </Tooltip>
          );
        break;
      case Statuses.SCRAPING_JOBS:
        innerText = `${row.scrapedJobs} Jobs found`;
        caption = `SUB LINK ${row.auditsCount}/${row.externalLinksFound}`;
        icon = (
          <BugReport
            color="primary"
            style={{
              width: 18,
              height: 18,
            }}
          />
        );
        break;
    }
    return (
      <Box
        alignItems="center"
        flexWrap="nowrap"
        display="flex"
        justifyContent="flex-end"
      >
        <Box display="flex" flexDirection="column" mr={theme.spacing(1)}>
          <Typography
            variant="overline"
            noWrap={true}
            style={{
              marginLeft: theme.spacing(1),
              whiteSpace: "nowrap",
              lineHeight: "1rem",
            }}
          >
            {innerText}
          </Typography>
          {caption && (
            <Typography
              variant="caption"
              style={{ color: theme.palette.text.hint }}
            >
              {caption}
            </Typography>
          )}
        </Box>
        {icon}
      </Box>
    );
  };

  return renderThreadStatus();
};

export default ScrapingThreadTableStatus;