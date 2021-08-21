//@ts-check
import {
  Grid,
  Typography,
  Paper,
  makeStyles,
  useTheme,
  Button,
  Table,
  ButtonBase,
  TableContainer,
  Divider,
  ThemeProvider,
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

// A component that displays a report with the following information:
// - The number of tracked urls blocked (with possibility to navigate to details page)
// - The number of domains crawled today (with possibility to navigate to details page)
// - The number of scraped jobs
// - The list of domains that have been crawled at least 100 times but has never given jobs (with possibility to navigate to details page)
// - The number of erroneous newly added tracked urls (with the possibility to navigate to details page)
// - A top list 10 best performing domains ordered by average jobs per crawl
// - A top list 10 worst performing domains ordered by average jobs per crawl

function DailyStatisticsView() {
  const [_WORST_DOMAINS_LIST, set_WORST_DOMAINS_LIST] = useState([]);
  const [_BEST_DOMAINS_LIST, set_BEST_DOMAINS_LIST] = useState([]);

  // Function that renders a list of 10 _WORST_DOMAINS_LIST wrapped bywith possibility to navigate back and forward
  const render_WORST_DOMAINS_LIST = () => {
    if (_WORST_DOMAINS_LIST.length === 0) {
      return (
        <div>
          <Typography variant="h4">No domains with errors</Typography>
        </div>
      );
    } else {
      return (
        <div>
          <Typography variant="h4">The 10 worst performing domains</Typography>
          <TableContainer>
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <Table>
                  <thead>
                    <tr>
                      <th>Domain</th>
                      <th>Average jobs per crawl</th>
                    </tr>
                  </thead>
                  <tbody>
                    {_WORST_DOMAINS_LIST.map((domain) => (
                      <tr key={domain.domain}>
                        <td>
                          <a href={`/domains/${domain.domain}`}>
                            {domain.domain}
                          </a>
                        </td>
                        <td>{number_format(domain.average_jobs_per_crawl)}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Grid>
            </Grid>
          </TableContainer>
        </div>
      );
    }
  };
  const theme = useTheme();
  return (
    <div>
      <Paper style={{ padding: theme.spacing(2) }}>
        {render_WORST_DOMAINS_LIST()}
      </Paper>
    </div>
  );
}

export default DailyStatisticsView;
