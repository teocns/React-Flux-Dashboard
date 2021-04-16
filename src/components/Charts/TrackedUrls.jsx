import Chart from "chart.js";
import React, { useEffect, useRef } from "react";

export default function LineGraph({ chartData }) {
  const chartRef = useRef(null);
  const datasets = [];
  const labels = [];

  const { graph, timeFrame, dateRange } = chartData;

  let dateDiff = Math.abs(
    dateRange.endDate
      ? dateRange.endDate
      : 0 - dateRange.startDate
      ? dateRange.startDate
      : 0
  );

  let dataset_tracked_urls = {
    label: "Newly added URLs",
    borderColor: "blue",
    data: [],
  };

  let yMinTimestamp = "";
  let yMaxTimestamp = "";

  for (let axes of graph) {
    let x = axes.x;
    let y = axes.y;
    x.replace("-", "/");
    let t = new Date(axes.timestamp);
    if (!yMinTimestamp || t < yMinTimestamp) {
      yMinTimestamp = t;
    }
    if (!yMaxTimestamp || t > yMaxTimestamp) {
      yMaxTimestamp = t;
    }
    switch (timeFrame) {
      case "HOUR":
        labels.push(`${x.slice(11, 13)}:00`);
        break;
      case "DAY":
        labels.push(`${x.slice(5, 10)}`);
        break;
      case "MONTH":
        labels.push(`${x.slice(0, 7)}`);
        break;

      default:
        labels.push(`${x}`);
        break;
    }

    dataset_tracked_urls.data.push(y);
  }
  datasets.push(dataset_tracked_urls);

  useEffect(() => {
    const myChartRef = chartRef.current.getContext("2d");
    const chart = new Chart(myChartRef, {
      type: "line",
      data: {
        //Bring in data
        labels,
        datasets,
      },
      options: {
        animation: false,
        tooltips: {
          mode: "index",
          intersect: false,
        },
        scales: {
          xAxes: [
            {
              scaleLabel: {
                display: true,
              },
            },
          ],
          yAxes: [
            {
              ticks: {
                //stepSize: 50,
                callback: (value, index) => value > 0 && value,
                beginAtZero: true,
              },
              suggestedMin: 0,
            },
          ],
        },
      },
    });

    return chart.destroy;
  }, [chartData]);

  return (
    <canvas
      style={{ width: "100%", height: "100%", minHeight: 480, maxHeight: 480 }}
      id="myChart"
      ref={chartRef}
    />
  );
}
