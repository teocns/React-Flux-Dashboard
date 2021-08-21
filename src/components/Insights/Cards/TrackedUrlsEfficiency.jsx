import React, { useState } from "react";
import Chart from "chart.js";
import {
  Card,
  CardHeader,
  Typography,
  CardContent,
  Paper,
  Button,
} from "@material-ui/core";
import InsightsPie from "../Pie";
import { useTheme } from "@material-ui/core/styles";

const TrackedUrlsEfficiency = () => {
  const [CrawlData, setCrawlData] = useState({
    domainsCrawled: 1230,
  });

  // Make a pie component returning filling with CrawlData.domains and Crawldata.validDomains
  // use chart.js to render the chart

  const data = {
    labels: ["With jobs", "Without jobs"],
    datasets: [
      {
        label: "Dataset 1",
        data: [1123319, 1232132],
        backgroundColor: ["#6fbf73", "#f44336"],
      },
    ],
  };
  const theme = useTheme();
  return (
    <div style={{ width: "min-content" }}>
      <Paper style={{ padding: theme.spacing(2) }}>
        <div style={{ minWidth: 180 }}>
          <Typography
            variant="h6"
            style={{ width: "100%", textAlign: "center" }}
          >
            URLs Efficiency
          </Typography>
          <Typography
            variant="subtitle2"
            style={{
              width: "100%",
              textAlign: "center",
              color: theme.palette.text.disabled,
            }}
          >
            Based on tracked URLs where jobs were crawled
          </Typography>
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              padding: theme.spacing(2),
            }}
          >
            <InsightsPie data={data} size={150} />
          </div>
          <Button
            style={{
              width: "100%",
              margin: 0,
            }}
          >
            View details
          </Button>
        </div>
      </Paper>
    </div>
  );
};

export default TrackedUrlsEfficiency;
