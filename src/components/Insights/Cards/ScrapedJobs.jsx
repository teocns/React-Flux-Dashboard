import React from "react";
import {
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  Tooltip,
  Typography,
  useTheme,
} from "@material-ui/core";
import { number_format } from "../../../helpers/numbers";

const ScrapedJobsCard = ({ count, year, month, day }) => {
  const theme = useTheme();
  return (
    <Tooltip
      title={`Indicates the amount of jobs scraped only from the URLs that have been tracked within ${year}/${month}${
        day ? "/" + day : ""
      }`}
    >
      <Card style={{ minWidth: 180 }}>
        <CardActionArea>
          <CardContent style={{ paddingBottom: 16 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography
                variant="subtitle2"
                style={{
                  whiteSpace: "nowrap",
                  marginRight: theme.spacing(2),
                }}
              >
                Jobs Scraped
              </Typography>
              <Typography
                style={{ color: theme.palette.text.primary }}
                variant="h6"
              >
                <code style={{ background: "transparent", color: "#434375" }}>
                  {number_format(count, 0, ",", ".")}
                </code>
              </Typography>
            </div>
          </CardContent>
        </CardActionArea>
      </Card>
    </Tooltip>
  );
};

export default ScrapedJobsCard;
