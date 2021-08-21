import React, { useRef } from "react";
import { randomNumbers } from "../../helpers/numbers";
import Chart from "chart.js";
import { useEffect } from "react";
import { useTheme } from "@material-ui/styles";
import * as Utils from "../../helpers/chartjsUtils";
import { Typography } from "@material-ui/core";

const InsightsPie = ({ data, size }) => {
  const chart_id = new Date().getTime().toString();

  const chartRef = useRef(null);

  useEffect(() => {
    const ctx = new Chart(chartRef.current.getContext("2d"), {
      type: "doughnut",
      data,
      options: {
        legend: {
          display: false,
        },
        cutoutPercentage: 75,
        elements: {
          arc: {
            borderWidth: 0,
          },
        },
        responsive: true,

        maintainAspectRatio: false,
      },
    });
  });

  // .donut-inner {
  //   margin-top: -100px;
  //   margin-bottom: 100px;
  // }
  // .donut-inner h5 {
  //   margin-bottom: 5px;
  //   margin-top: 0;
  // }
  // .donut-inner span {
  //   font-size: 12px;
  // }

  const theme = useTheme();

  return (
    <div
      style={{
        width: size + 4,
        height: size + 4,
        position: "relative",
      }}
    >
      <canvas
        style={{
          height: size,
          width: "auto",
        }}
        id={chart_id}
        ref={chartRef}
      />
      <div
        style={{
          position: "absolute",
          left: size / 2,
          top: size / 2,
          transform: "translate(-50%, -50%)",
        }}
      >
        <Typography
          variant="h6"
          style={{
            color: theme.palette.primary.main,
          }}
        >
          80%
        </Typography>
      </div>
    </div>
  );
};

export default React.memo(InsightsPie);
