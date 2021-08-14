//@ts-check
import { CircularProgress, Paper } from "@material-ui/core";
import React from "react";

import SimpleChart from "../Charts/Simple";

var lastRequestedFilterB64 = undefined;

/**
 * @typedef InsightsChartConstructor
 * @property {string} name
 * @property {string} type
 * @property {Object} filter
 */

/**
 * @typedef InsightsChartConstructorFilter
 * @property {string} domain
 * @property {string} tracked_url_id
 * @property {Object|string} dateRange
 */

/**
 *
 * @param {Object} param0
 * @param {import("../../Shared/BBE-CRWL.WebApp.Shared.Models/Statistics/Charts/ChartData").ChartDataObject} param0.chartData
 * @returns
 */
const InsightsChart = ({ chartData, tooltipCallbacks }) => {
  /**
   *
   * @param {import("../../Shared/BBE-CRWL.WebApp.Shared.Models/Statistics/Charts/ChartData").ChartDataRecord} graphRecord
   */

  const makeDataset = (graphRecord) => {};
  return (
    <Paper style={{ width: "100%", height: "100%" }}>
      {chartData ? (
        <SimpleChart
          chartData={chartData}
          tooltipCallbacks={tooltipCallbacks}
        />
      ) : (
        <CircularProgress color="secondary" />
      )}
    </Paper>
  );
};

export default React.memo(InsightsChart);
