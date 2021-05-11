import Chart from "chart.js";
import React, { useEffect, useRef } from "react";
import { getRandomColor } from "../../helpers/colors";
import { randomNumbers } from "../../helpers/numbers";

const insertIgnore = (array, item) => {
  if (!array.includes(item)) {
    array.push(item);
  }
};

const insertIgnoreIndexed = (lookupObject, item) => {
  if (!lookupObject[item]) {
    lookupObject[item] = null;
  }
};

export default function Minichart({ chartData }) {
  const chartRef = useRef(null);

  let dataLabelsKeys = {};

  let datasetsKeys = [];

  chartData.map((item) => {
    insertIgnoreIndexed(dataLabelsKeys, item.x);

    if (!datasetsKeys[item.dataset]) {
      datasetsKeys[item.dataset] = [item.y];
    } else {
      datasetsKeys[item.dataset].push(item.y);
    }
  });

  let data = {
    labels: Object.keys(dataLabelsKeys),
    datasets: Object.keys(datasetsKeys).map((datasetKey) => {
      return {
        data: datasetsKeys[datasetKey],
        label: datasetKey,
        borderColor: "#3e95cd",
        //fill: false,
      };
    }),
  };

  console.log(data);
  useEffect(() => {
    const myChartRef = chartRef.current.getContext("2d");
    const chart = new Chart(myChartRef, {
      type: "line",
      data,
      options: {
        responsive: true,
        legend: {
          display: false,
        },

        animation: false,
        // bezierCurve: false, //remove curves from your plot
        scaleShowLabels: false, //remove labels
        tooltipEvents: [], //remove trigger from tooltips so they will'nt be show
        //pointDot: false, //remove the points markers

        scaleShowGridLines: false, //set to false to remove the grids background
        tooltips: {
          mode: "index",
          intersect: false,
        },
        scales: {
          xAxes: [
            {
              scaleShowLabels: false,
              scaleLabel: {
                display: false,
              },
              // ticks: {
              //   stepSize: 1,
              //   steps: 10,
              //   //callback: (value, index) => value > 0 && value,
              //   //beginAtZero: true,
              //   // min: Math.min.apply(this, data) - 5,
              //   // max: Math.max.apply(this, data) + 5,
              // },
            },
          ],
          yAxes: [
            {
              scaleShowLabels: false,
              scaleLabel: {
                display: false,
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
  });

  return (
    <canvas
      style={{ width: "100%", height: "100%", minHeight: 480, maxHeight: 480 }}
      id="myChart"
      ref={chartRef}
    />
  );
}
