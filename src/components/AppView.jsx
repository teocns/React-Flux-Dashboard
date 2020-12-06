import React, { useState, useEffect } from "react";

import { BrowserRouter, Route, Switch } from "react-router-dom";
import uiActions from "../actions/UI";
import { makeStyles, useTheme } from "@material-ui/core/styles";

import { Backdrop } from "@material-ui/core";
import AddTrackUrlsView from "../views/AddTrackUrls";
import LoginView from "../views/Login";
import ManageUsersView from "../views/ManageUsers";
import sessionStore from "../store/session";
import ActionTypes from "../constants/ActionTypes";

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
  const [IsAuthenticated, setIsAuthenticated] = useState(
    sessionStore.isAuthenticated()
  );

  const onUserDataUpdated = () => {
    setIsAuthenticated(sessionStore.isAuthenticated());
  };
  useEffect(() => {
    sessionStore.addChangeListener(
      ActionTypes.Session.USER_DATA_UPDATED,
      onUserDataUpdated
    );
    return () => {
      sessionStore.removeChangeListener(
        ActionTypes.Session.USER_DATA_UPDATED,
        onUserDataUpdated
      );
    };
  });
  const classes = useStyles();

  return (
    <div className={classes.appView}>
      <Switch>
        <Route exact path="/" component={AddTrackUrlsView} />
        <Route exact path="/login" component={LoginView} />
        <Route exact path="/manage-users" component={ManageUsersView} />
      </Switch>
    </div>
  );
};

export default AppView;
