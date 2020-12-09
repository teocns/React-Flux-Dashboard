import React, { useState } from "react";
import AppContents from "./components/AppContents";
import { BrowserRouter } from "react-router-dom";
import sessionActions from "./actions/Session";
import sessionStore from "./actions/Session";
import AppPreload from "./components/AppPreload";


export default function App() {
  const [ShowPreload, setShowPreload] = useState(true);
  const authToken = sessionStore.needsToAuthenticate();
  const willTryToAuthenticate =
    authToken !== undefined && !!authToken;

  return (
    <BrowserRouter>
      {ShowPreload ? <AppPreload /> : <AppContents />}
    </BrowserRouter>
  );
}
