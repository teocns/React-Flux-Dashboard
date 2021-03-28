import { Box, Tooltip, Typography } from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import {
  BugReport,
  DoneAll,
  ErrorOutline,
  HourglassEmpty,
} from "@material-ui/icons";
import React from "react";
import { Statuses } from "../../constants/CrawlerThreadsStatuses";

/**
 *
 * @param {Object} param0
 * @param {ScrapingThread} param0.row
 */
const ScrapingThreadTableStatus = ({ row }) => {
  const theme = useTheme();

  let icon = undefined;
  let innerText = undefined;
  let caption = undefined;
  let status = Statuses.QUEUED;

  const renderGeneralStatus = () => {
    if (row.crawler_threads_cnt === 0) {
      return "Scheduled for crawling";
    }
    let ret = `${row.total_scraped_jobs} jobs`;
    return ret;
  };
  const renderCrawlPlan = () => {
    let ret = "";
    if (row.crawler_threads_cnt === 0) {
      ret = "";
    } else {
      ret = `Crawled ${row.crawler_threads_cnt} times`;
    }
    return ret;
  };

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
          {renderGeneralStatus()}
        </Typography>
        <Typography
          variant="caption"
          style={{ color: theme.palette.text.hint, whiteSpace: "nowrap" }}
        >
          {renderCrawlPlan()}
        </Typography>
      </Box>
      {icon}
    </Box>
  );
};

export default ScrapingThreadTableStatus;
