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
  const renderThreadStatus = () => {
    let icon = undefined;
    let innerText = undefined;
    let caption = undefined;
    let status = Statuses.QUEUED;

    // if (row.isCompleted) {
    //   if (row.crawler_threads_cnt > 0 && row.total_scraped_jobs < 0) {
    //     status = Statuses.BAD_LINK;
    //   } else if (row.externalLinksFound > row.childrenCompleted) {
    //     status = Statuses.SCRAPING_JOBS;
    //   } else if (row.externalLinksFound <= row.childrenCompleted) {
    //     status = Statuses.COMPLETED;
    //   } else {
    //     status = Statuses.COMPLETED;
    //   }
    // } else {
    //   if (row.lastFedToBot) {
    //     status = Statuses.SEARCHING_PAGE;
    //   }
    // }
    // switch (status) {
    //   case Statuses.BAD_LINK:
    //     innerText = "NO LINKS PARSED";
    //     icon = (
    //       <Tooltip title="Could not scrape any link, either because our bots failed or the page contained no links to potential jobs.">
    //         <ErrorOutline
    //           style={{
    //             width: 18,
    //             height: 18,
    //             color: "  d",
    //           }}
    //         />
    //       </Tooltip>
    //     );
    //     break;
    //   case Statuses.SEARCHING_PAGE:
    //     innerText = "CRAWLING URL";
    //     icon = (
    //       <BugReport
    //         color="primary"
    //         style={{
    //           width: 18,
    //           height: 18,
    //         }}
    //       />
    //     );
    //     break;
    //   case Statuses.QUEUED:
    //     innerText = "in queue";
    //     icon = (
    //       <Tooltip title="Link queued for scraping">
    //         <HourglassEmpty
    //           style={{
    //             width: 18,
    //             height: 18,
    //             color: theme.palette.text.hint,
    //           }}
    //         />
    //       </Tooltip>
    //     );
    //     break;
    //   case Statuses.COMPLETED:
    //     innerText = `${
    //       row.totalScrapedJobs > 0 ? row.totalScrapedJobs : "No"
    //     } Job${row.totalScrapedJobs !== 1 ? "s" : ""} found`;
    //     caption =
    //       row.childrenCompleted > 0 ? `IN ${row.childrenCompleted} LINKS` : "";
    //     icon =
    //       row.totalScrapedJobs > 0 ? (
    //         <Tooltip title="Scraping is completed">
    //           <DoneAll
    //             style={{
    //               width: 18,
    //               height: 18,
    //               color: "green",
    //             }}
    //           />
    //         </Tooltip>
    //       ) : (
    //         <Tooltip title="No jobs found">
    //           <ErrorOutline
    //             style={{
    //               width: 18,
    //               height: 18,
    //               color: "red",
    //             }}
    //           />
    //         </Tooltip>
    //       );
    //     break;
    //   case Statuses.SCRAPING_JOBS:
    //     innerText = `${row.totalScrapedJobs} Jobs found`;
    //     caption = `SUB LINK ${row.childrenCompleted}/${row.externalLinksFound}`;
    //     icon = (
    //       <BugReport
    //         color="primary"
    //         style={{
    //           width: 18,
    //           height: 18,
    //         }}
    //       />
    //     );
    //     break;
    // }
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
            {row.total_scraped_jobs} jobs
          </Typography>
          <Typography
            variant="caption"
            style={{ color: theme.palette.text.hint }}
          >
            Crawled {row.crawler_threads_cnt} time
            {row.crawler_threads_cnt > 1 ? "s" : ""}
          </Typography>
        </Box>
        {icon}
      </Box>
    );
  };

  return renderThreadStatus();
};

export default ScrapingThreadTableStatus;
