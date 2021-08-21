import React, { useState } from "react";
import { useEffect } from "react";
import { Table, TableHead, TableBody, TableCell } from "@material-ui/core";

import StatisticsApi from "../../api/Statistics";

// A React functional component that displays a list of blocked tracked urls with the amount of crawls, scraped jobs and possibility to unblock them
// Allow AJAX pagination
// Allow filtering
// Use @material-ui/core for components
function BlockedTrackedUrlsList({ date }) {
  const [TrackedUrlsList, setTrackedUrlsList] = useState();

  const fetchTrackedUrlsList = () => {
    StatisticsApi.getBlockedTrackedUrls(date)
      .then((response) => {
        setTrackedUrlsList(response);
      })
      .catch((error) => {});
  };
  const handleNavigation = (isForward) => {};

  useEffect(() => {
    fetchTrackedUrlsList();
  }, [date]);

  // Return react component list of tracked urls with @material-ui/core
}
