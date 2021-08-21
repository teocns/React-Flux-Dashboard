import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import { Route, Switch } from "react-router-dom";
import AddUsersView from "../views/AddUser";
import AutoscalingConfig from "../views/AutoscalingConfig";
import BlacklistImpactView from "../views/BlacklistImpactView";
import CountriesManagementView from "../views/CountriesManagement";
import CrawlerControlCenter from "../views/CrawlerControlCenter";
import {
  default as CrawlerStatisticsView,
  default as StatisticsAdminView,
} from "../views/CrawlerStatistics";
import CrawlerThreadsView from "../views/CrawlerThreads";
import DailyStatisticsView from "../views/DailyStatisticsView";
import DomainsManagementView from "../views/DomainsManagement";
import FAQView from "../views/FAQ";
import LoginView from "../views/Login";
import ManageUsersView from "../views/ManageUsers";
import TrackedUrlsReviewCenter from "../views/TrackedUrlsReviewCenter";
import WebsiteInsights from "../views/PortalInsights";
import TrackedUrlInsights from "../views/TrackedUrlInsights";
import TrackedUrlsView from "../views/TrackedUrls";
import UserMonthlyPerformance from "../views/DashboardView";
import DashboardView from "../views/DashboardView";
import AddTrackUrl from "./Tables/AddTrackUrl";

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
        <Route exact path="/" component={DashboardView} />
        <Route exact path="/tracking" component={TrackedUrlsView} />
        <Route exact path="/login" component={LoginView} />
        <Route exact path="/faq" component={FAQView} />
        <Route exact path="/manage-users" component={ManageUsersView} />
        <Route exact path="/manage-urls" component={TrackedUrlsView} />
        <Route exact path="/tracked-urls" component={TrackedUrlsReviewCenter} />
        <Route exact path="/countries" component={CountriesManagementView} />
        <Route path="/tracked-url/:url" component={TrackedUrlInsights} />
        <Route exact path="/add-user" component={AddUsersView} />

        <Route path="/statistics/crawlers" component={CrawlerStatisticsView} />
        <Route path="/statistics/daily" component={DailyStatisticsView} />
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
