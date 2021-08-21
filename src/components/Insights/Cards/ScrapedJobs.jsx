import React from "react";
import {
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  Typography,
  useTheme,
} from "@material-ui/core";
import { number_format } from "../../../helpers/numbers";

const ScrapedJobsCard = ({ count }) => {
  const theme = useTheme();
  return (
    <Card style={{ minWidth: 180 }}>
      <CardActionArea>
        <CardContent style={{ paddingBottom: 16 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "start",
            }}
          >
            <Typography
              variant="h6"
              style={{
                marginRight: theme.spacing(2),
                whiteSpace: "nowrap",
              }}
            >
              Scraped jobs
            </Typography>
            <Typography variant="h6">
              <code style={{ background: "transparent" }}>
                {number_format(count, 0, ",", ".")}
              </code>
            </Typography>
          </div>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default ScrapedJobsCard;
