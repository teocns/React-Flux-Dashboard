//@ts-check

import { makeStyles, Paper, Typography, useTheme } from "@material-ui/core";
import React from "react";

const useStyles = makeStyles((theme) => {
  return {
    circle: {
      width: 44,
      height: 44,
      borderRadius: 44 / 2,
    },
  };
});

const StatisticsCard = ({ title, value, icon, circleColor }) => {
  const classes = useStyles();
  const theme = useTheme();
  return (
    <Paper elevation={0} style={{ padding: theme.spacing(2) }}>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <Typography variant="overline">{title}</Typography>
        <Typography variant="subtitle2">{value} </Typography>
      </div>
      {icon && (
        <div className={classes.circle}>
          {React.cloneElement(icon, {
            style: {
              color: circleColor,
            },
          })}
        </div>
      )}
    </Paper>
  );
};

export default StatisticsCard;
