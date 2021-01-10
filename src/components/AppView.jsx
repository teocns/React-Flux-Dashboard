import React, { useState, useEffect } from "react";

import { BrowserRouter, Route, Switch } from "react-router-dom";
import uiActions from "../actions/UI";
import { makeStyles, useTheme } from "@material-ui/core/styles";

import { Backdrop } from "@material-ui/core";
import AddTrackUrlsView from "../views/AddTrackUrls";
import LoginView from "../views/Login";
import ManageUsersView from "../views/ManageUsers";
import AddUsersView from "../views/AddUser";
import ManageUrlsView from "../views/ManageUrls";
import sessionStore from "../store/session";
import ActionTypes from "../constants/ActionTypes";
import FAQView from "../views/FAQ";
import StatisticsView from "../views/Statistics";
import StatisticsAdminView from "../views/StatisticsAdmin";
import ManageUrlsAdminView from "../views/ManageUrlsAdmin";
import XmlManagementView from "../views/XmlManagement";
import CountriesManagementView from "../views/CountriesManagement";

const useStyles = makeStyles((theme) => ({
  appView: {
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    flex: 1,
    background: "rgb(250,250,250)",
    marginTop: 64,
    padding: theme.spacing(2),
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
        <Route exact path="/" component={AddTrackUrlsView} />
        <Route exact path="/login" component={LoginView} />
        <Route exact path="/faq" component={FAQView} />
        <Route exact path="/manage-users" component={ManageUsersView} />
        <Route exact path="/manage-urls" component={ManageUrlsView} />
        <Route exact path="/tracked-urls" component={ManageUrlsAdminView} />
        <Route exact path="/add-user" component={AddUsersView} />
        <Route exact path="/statistics" component={StatisticsView} />
        <Route exact path="/user-statistics" component={StatisticsAdminView} />
        <Route exact path="/xml" component={XmlManagementView} />
        <Route exact path="/countries" component={CountriesManagementView} />
      </Switch>
    </div>
  );
};

export default AppView;
