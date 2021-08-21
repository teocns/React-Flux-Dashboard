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

const EarningsCard = ({ count }) => {
  const theme = useTheme();
  return (
    <Card style={{ minWidth: 180 }}>
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
            Earnings
          </Typography>
          <Typography style={{ color: "green" }} variant="h6">
            <code style={{ background: "transparent" }}>
              €{number_format(count, 0, ",", ".")}
            </code>
          </Typography>
        </div>
        {/* <CardActionArea>
          <Button fullWidth>Go to table</Button>
        </CardActionArea> */}
      </CardContent>
    </Card>
  );
};

export default EarningsCard;
