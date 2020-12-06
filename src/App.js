import React from "react";
import AppContents from "./components/AppContents";
import { BrowserRouter } from "react-router-dom";
export default function App() {
  return (
    <BrowserRouter>
      <AppContents />
    </BrowserRouter>
  );
}
