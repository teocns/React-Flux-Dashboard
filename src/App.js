import React, { useState } from "react";
import AppContents from "./components/AppContents";
import { BrowserRouter } from "react-router-dom";
import sessionActions from "./actions/Session";
import sessionStore from "./actions/Session";
import AppPreload from "./components/AppPreload";

var AUTHENTICATION_TOKEN = sessionStore.getAuthenticationToken();
export default function App() {
  const [ShowPreload, setShowPreload] = useState(true);
  const willTryToAuthenticate =
    AUTHENTICATION_TOKEN !== undefined && !!AUTHENTICATION_TOKEN;

  return (
    <BrowserRouter>
      {ShowPreload ? <AppPreload /> : <AppContents />}
    </BrowserRouter>
  );
}
