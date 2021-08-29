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
            Earnings
          </Typography>
          <Typography
            style={{ color: theme.palette.text.primary }}
            variant="h6"
          >
            <code style={{ background: "transparent", color: "#3e9042" }}>
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
