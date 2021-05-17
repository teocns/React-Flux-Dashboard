import { IconButton, Typography, useTheme } from "@material-ui/core";
import React from "react";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";

import { withRouter } from "react-router-dom";
import { Skeleton } from "@material-ui/lab";

const ViewHeader = ({ title, subtitle, history, subtitleLoading }) => {
  const theme = useTheme();

  const renderSubtitle = () => {
    if (subtitleLoading) {
      return <Skeleton variant="text" width={120} />;
    } else if (subtitle) {
      return <Typography variant="subtitle2">{subtitle}</Typography>;
    }
    return null;
  };
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        marginBottom: theme.spacing(3),
      }}
    >
      <IconButton
        size="small"
        style={{ color: theme.palette.secondary.main }}
        onClick={() => {
          history.goBack();
        }}
      >
        <ArrowBackIcon />
      </IconButton>
      <div style={{ marginLeft: theme.spacing(2) }}>
        <Typography variant="h6">{title}</Typography>

        {renderSubtitle()}
      </div>
    </div>
  );
};

export default withRouter(ViewHeader);
