import Chart from "chart.js";
import React, { useEffect, useRef } from "react";

import { getRandomColor } from "../../helpers/colors";

const insertIgnore = (array, item) => {
  if (!array.includes(item)) {
    array.push(item);
  }
};

export default function LineGraph({ chartData }) {
  const chartRef = useRef(null);
  const datasets = [];
  const labels = [];

  for (let dataset of chartData) {
    const { graph, syncRequest, userName } = dataset;

    const timeFrame = syncRequest.dateRange.timeFrame;

    let dataset_scraped_jobs = {
      label: userName,
      borderColor: getRandomColor(userName[1]),
      borderWidth: 2,
      data: [],
    };

    let yMinTimestamp = "";
    let yMaxTimestamp = "";

    for (let axes of graph) {
      let x = axes.x;
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
          insertIgnore(labels, `${x.slice(11, 13)}:00`);
          break;
        case "DAY":
          insertIgnore(labels, `${x.slice(5, 10)}`);
          break;
        case "MONTH":
          insertIgnore(labels, `${x.slice(0, 7)}`);
          break;

        default:
          insertIgnore(labels, `${x}`);
          break;
      }
      console.log(dataset_scraped_jobs.borderColor);
      dataset_scraped_jobs.data.push(axes.y2);
    }

    datasets.push(dataset_scraped_jobs);
  }

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
        spanGaps: true, // enable for all datasets
        tooltips: {
          mode: "index",
          intersect: false,
        },
        scales: {
          xAxes: [
            {
              scaleLabel: {
                display: true,
                // labelString: `${yMinTimestamp.toLocaleString()} ${
                //   yMaxTimestamp ? "-> " + yMaxTimestamp.toLocaleString() : ""
                // }`,
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
    return () => {
      try {
        chart.destroy();
      } catch (e) {}
    };
  }, [chartData]);

  return (
    <canvas
      style={{ width: "100%", height: "100%", minHeight: 480, maxHeight: 480 }}
      id="myChart"
      ref={chartRef}
    />
  );
}
