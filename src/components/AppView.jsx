import React, { useState, useEffect } from "react";

import { BrowserRouter, Route, Switch } from "react-router-dom";
import uiActions from "../actions/UI";
import { makeStyles, useTheme } from "@material-ui/core/styles";

import { Backdrop } from "@material-ui/core";
import AddTrackUrlsView from "../views/AddTrackUrls";
import LoginView from "../views/Login";
import ManageUsersView from "../views/ManageUsers";
import AddUsersView from "../views/AddUser";
import TrackedUrlsView from "../views/TrackedUrls";
import sessionStore from "../store/session";
import ActionTypes from "../constants/ActionTypes";
import FAQView from "../views/FAQ";
import UserStatisticsView from "../views/UserStatistics";
import CrawlerStatisticsView from "../views/CrawlerStatistics";
import StatisticsAdminView from "../views/CrawlerStatistics";
import ManageUrlsAdminView from "../views/ManageUrlsAdmin";
import XmlManagementView from "../views/XmlManagement";
import CountriesManagementView from "../views/CountriesManagement";
import ScrapingThreadDetailsView from "../views/ScrapingThreadDetails";
import DomainsManagementView from "../views/DomainsManagement";
import CrawlingExtensionView from "../views/CrawlingExtension";
import BlacklistView from "../views/BlacklistView";
import WebsiteInsights from "../views/PortalInsights";
import CrawlerThreadsView from "../views/CrawlerThreads";
import TrackedUrlInsights from "../views/TrackedUrlInsights";
import BlacklistImpactView from "../views/BlacklistImpactView";
import AutoscalingConfig from "../views/AutoscalingConfig";
import CrawlerControlCenter from "../views/CrawlerControlCenter";
const useStyles = makeStyles((theme) => ({
  appView: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    background: "rgb(250,250,250)",
    padding: theme.spacing(2),
    paddingTop: 86,
    height: "100%",
    overflowY: "auto",
    maxHeight: "100%",
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));

const AppView = () => {
  const classes = useStyles();

  return (
    <div className={classes.appView}>
      <Switch>
        <Route exact path="/" component={TrackedUrlsView} />
        <Route exact path="/login" component={LoginView} />
        <Route exact path="/faq" component={FAQView} />
        <Route exact path="/manage-users" component={ManageUsersView} />
        <Route exact path="/manage-urls" component={TrackedUrlsView} />
        <Route exact path="/tracked-urls" component={TrackedUrlsView} />
        <Route exact path="/countries" component={CountriesManagementView} />
        <Route path="/tracked-url/:url" component={TrackedUrlInsights} />
        <Route exact path="/add-user" component={AddUsersView} />
        <Route path="/statistics/user" component={UserStatisticsView} />
        <Route path="/statistics/crawlers" component={CrawlerStatisticsView} />
        <Route exact path="/user-statistics" component={StatisticsAdminView} />
        <Route exact path="/portals" component={DomainsManagementView} />
        <Route exact path="/domain/:portal" component={WebsiteInsights} />
        {/* <Route exact path="/blacklist" component={BlacklistView} /> */}
        <Route exact path="/crawlers" component={CrawlerControlCenter} />
        <Route exact path="/autoscaling-config" component={AutoscalingConfig} />
        <Route
          exact
          path="/blacklist/:ruleId/impact"
          component={BlacklistImpactView}
        />
        <Route exact path="/crawler-threads" component={CrawlerThreadsView} />
      </Switch>
    </div>
  );
};

export default AppView;
