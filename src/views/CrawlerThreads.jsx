import { TableContainer, Paper, Typography, useTheme } from "@material-ui/core";
import React from "react";
import { useLocation } from "react-router";
import CrawlerThreadsTable from "../components/Tables/CrawlerThreads";

function getSearchParameters(loc) {
  var prmstr = loc.search.substr(1);
  return prmstr != null && prmstr != "" ? transformToAssocArray(prmstr) : {};
}

function transformToAssocArray(prmstr) {
  var params = {};
  var prmarr = prmstr.split("&");
  for (var i = 0; i < prmarr.length; i++) {
    var tmparr = prmarr[i].split("=");
    params[tmparr[0]] = tmparr[1];
  }
  return params;
}

const fromBase64 = (string) => {
  return atob(string);
};
const CrawlerThreadsView = ({ match }) => {
  const loc = useLocation();
  const params = getSearchParameters(loc);
  const theme = useTheme();

  const raw_crawler_process_id = match.params.crawler_process_id;
  // URL decode raw_crawler_process_id
  const crawler_process_id = fromBase64(raw_crawler_process_id);

  return (
    <div
      style={{
        overflowY: "auto",
        overflowX: "hidden",
        padding: theme.spacing(2),
      }}
    >
      <TableContainer>
        <CrawlerThreadsTable crawler_process_id={crawler_process_id} />
      </TableContainer>
    </div>
  );
};

export default CrawlerThreadsView;
