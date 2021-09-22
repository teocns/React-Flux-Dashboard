import { Typography, useTheme, Divider } from "@material-ui/core";
import React from "react";

const TitledDivider = ({ title, subtitle, icon }) => {
  const theme = useTheme();
  return (
    <div
      style={{ marginTop: theme.spacing(3), marginBottom: theme.spacing(3) }}
    >
      <Divider style={{ height: 2, marginBottom: theme.spacing(1) }} />

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          marginLeft: theme.spacing(1),
        }}
      >
        {icon &&
          React.cloneElement(icon, {
            style: {
              color: theme.palette.secondary.main,
              marginRight: theme.spacing(1),
            },
          })}

        <div style={{ display: "flex", flexDirection: "column" }}>
          <Typography variant="h6" style={{ color: "#6b6b6b" }}>
            {title}
          </Typography>
          {subtitle && (
            <Typography
              variant="subtitle2"
              style={{ color: theme.palette.text.hint }}
            >
              {subtitle}
            </Typography>
          )}
        </div>
      </div>
    </div>
  );
};

export default TitledDivider;
