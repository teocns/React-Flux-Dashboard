//@ts-check
import Chart from "chart.js";
import React, { useEffect, useRef } from "react";
import {
  colorHash,
  getRandomColor,
  stringToHslColor,
} from "../../helpers/colors";
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

export default function SimpleChart({ chartData, tooltipCallbacks }) {
  const chartRef = useRef(null);

  let dataLabelsKeys = {};

  let datasetsKeys = [];

  let labelTooltips = {};

  chartData.map((item) => {
    insertIgnoreIndexed(dataLabelsKeys, item.x);
    labelTooltips[item.x] = item.tooltip;
    if (!datasetsKeys[item.dataset]) {
      datasetsKeys[item.dataset] = [item.y];
    } else {
      datasetsKeys[item.dataset].push(item.y);
    }
  });

  let data = {
    labels: Object.keys(dataLabelsKeys),
    datasets: Object.keys(datasetsKeys).map((datasetKey) => {
      const labelName = JSON.parse(datasetKey).name;
      return {
        data: datasetsKeys[datasetKey],
        label: labelName,
        borderColor: colorHash(labelName),
        borderWidth: 2,
        //fill: false,
      };
    }),
  };

  useEffect(() => {
    const myChartRef = chartRef.current.getContext("2d");
    const chart = new Chart(myChartRef, {
      type: "line",
      data,
      options: {
        maintainAspectRatio: false,
        legend: {
          display: true,
        },

        animation: false,
        // bezierCurve: false, //remove curves from your plot
        //scaleShowLabels: false, //remove labels
        //tooltipEvents: [], //remove trigger from tooltips so they will'nt be show
        //pointDot: false, //remove the points markers

        //scaleShowGridLines: false, //set to false to remove the grids background
        tooltips: {
          mode: "index",
          intersect: false,
          callbacks: {
            // title: function (tooltipItem, data) {
            //   debugger;
            // },
            label: function (tooltipItem, data) {
              return data.datasets[tooltipItem.datasetIndex].data[
                tooltipItem.index
              ].tooltip;
            },
            title: (tooltipItems, data) => {
              return labelTooltips[tooltipItems[0].xLabel];
            },
            afterLabel: function (tooltipItem, data) {
              return (
                data.datasets[tooltipItem.datasetIndex].label +
                ": " +
                tooltipItem.yLabel
              );
            },
          },
        },
        scales: {
          xAxes: [
            {
              //scaleShowLabels: false,
              scaleLabel: {
                display: true,
              },
              ticks: {
                //stepSize: 1,
                //steps: 10,
                //callback: (value, index) => value > 0 && value,
                beginAtZero: true,
                // min: Math.min.apply(this, data) - 5,
                // max: Math.max.apply(this, data) + 5,
              },
            },
          ],
          yAxes: [
            {
              // scaleShowLabels: false,
              // scaleLabel: {
              //   display: false,
              // },
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
    <div>
      <canvas
        style={{
          width: "100%",
          height: "100%",
          minHeight: 480,
          maxHeight: 480,
        }}
        id="myChart"
        ref={chartRef}
      />
    </div>
  );
}
