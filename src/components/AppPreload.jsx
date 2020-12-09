import React from "react";
import { CircularProgress } from "@material-ui/core";
const AppPreload = () => {
  return (
    <div
      style={{
        position: "fixed",
        width: "100vw",
        height: "100vh",
        top: 0,
        left: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <CircularProgress style={{ width: 54, height: 54 }} />
    </div>
  );
};

export default AppPreload;
