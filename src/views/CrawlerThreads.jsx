import { TableContainer, Paper, Typography } from "@material-ui/core";
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

const CrawlerThreadsView = (props) => {
  const loc = useLocation();
  const params = getSearchParameters(loc);

  return (
    <div>
      <TableContainer>
        <Typography variant="h1">Latest crawls</Typography>
        <CrawlerThreadsTable />
      </TableContainer>
    </div>
  );
};

export default CrawlerThreadsView;
