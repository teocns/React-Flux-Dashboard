import React, { useRef, useEffect } from "react";
import Chart from "chart.js";

export default function LineGraph() {
  const chartRef = useRef(null);

  useEffect(() => {
    const myChartRef = chartRef.current.getContext("2d");
    new Chart(myChartRef, {
      type: "line",
      data: {
        //Bring in data
        labels: [
          "Jan",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ],
        datasets: [
          {
            label: "Tracked Urls",
            data: [12, 29, 102, 403, 20, 304, 50, 192, 200, 101, 233, 129],
          },
          {
            label: "Scraped Jobs",
            data: [
              12,
              29,
              102,
              403,
              20,
              304,
              50,
              192,
              200,
              101,
              233,
              129,
            ].reverse(),
          },
        ],
      },
      options: {
        //Customize chart options
      },
    });
  });

  return (
    <div>
      <canvas id="myChart" ref={chartRef} />
    </div>
  );
}
