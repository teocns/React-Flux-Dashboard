import { Typography, useTheme } from "@material-ui/core";
import React from "react";
import BlockIcon from "@material-ui/icons/Block";
const EmptyTablePlaceholder = () => {
  const theme = useTheme();
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        margin: "4rem 0",
      }}
    >
      <BlockIcon
        style={{ width: 64, height: 64, color: theme.palette.grey[300] }}
      />
      <Typography variant="h6" style={{ textAlign: "center", marginTop: 18 }}>
        No results to show
      </Typography>
    </div>
  );
};

export default EmptyTablePlaceholder;
