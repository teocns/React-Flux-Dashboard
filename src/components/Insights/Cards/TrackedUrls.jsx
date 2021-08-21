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

const TrackedUrlsCard = ({ count }) => {
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
                whiteSpace: "nowrap",
                marginRight: theme.spacing(2),
              }}
            >
              Tracked URLs
            </Typography>
            <Typography
              style={{ color: theme.palette.text.primary }}
              variant="h6"
            >
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

export default TrackedUrlsCard;
