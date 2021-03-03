import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import AppContents from "./components/AppContents";
import { ConfirmProvider } from "material-ui-confirm";
import sessionActions from "./actions/Session";
import sessionStore from "./store/session";
import AppPreload from "./components/AppPreload";
import ActionTypes from "./constants/ActionTypes";
import { CssBaseline, ThemeProvider } from "@material-ui/core";
import defaultTheme from "./theme";
import StartServices from "./services/bundle";

export default function App() {
  document.title = "BeBee Crawling";
  const [ShowPreload, setShowPreload] = useState(true);
  const history = useHistory();

  const onIsAuthenticatingChanged = (data) => {
    const isAuthenticating = sessionStore.isAuthenticating();
    const isAuthenticated = sessionStore.isAuthenticated();
    const canAuthenticate = !!sessionStore.getAuthenticationToken();
    if (canAuthenticate && !isAuthenticated && !isAuthenticating) {
      if (!ShowPreload) setShowPreload(true);
      setTimeout(() => {
        sessionActions.tryAuthentication();
      });
    } else if (!isAuthenticated && !canAuthenticate) {
      history.push("/login");
      if (ShowPreload) setShowPreload(false);
    } else if (isAuthenticated) {
      if (ShowPreload) setShowPreload(false);
    }
  };
  StartServices();
  onIsAuthenticatingChanged();
  useEffect(() => {
    sessionStore.addChangeListener(
      ActionTypes.Session.IS_AUTHENTICATING,
      onIsAuthenticatingChanged
    );

    sessionStore.addChangeListener(
      ActionTypes.Session.USER_DATA_UPDATED,
      onIsAuthenticatingChanged
    );
    return () => {
      sessionStore.removeChangeListener(
        ActionTypes.Session.IS_AUTHENTICATING,
        onIsAuthenticatingChanged
      );
      sessionStore.removeChangeListener(
        ActionTypes.Session.USER_DATA_UPDATED,
        onIsAuthenticatingChanged
      );
    };
  });
  return (
    <ThemeProvider theme={defaultTheme}>
      <ConfirmProvider>
        {ShowPreload ? <AppPreload /> : <AppContents />}
      </ConfirmProvider>
    </ThemeProvider>
  );
}
