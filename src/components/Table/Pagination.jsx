import React from "react";

import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import SkipNextIcon from "@material-ui/icons/SkipNext";
import SkipPreviousIcon from "@material-ui/icons/SkipPrevious";
import { IconButton } from "@material-ui/core";
const PaginationComponent = ({
  hasMoreItems,
  directionForward,
  isForward,
  goBack,
  goForward,
  goLast,
  goFirst,
}) => {
  return (
    <div style={{ display: "flex" }}>
      <IconButton size="small" onClick={goFirst} disabled={directionForward}>
        <SkipPreviousIcon />
      </IconButton>

      <IconButton size="small" onClick={goBack}>
        <ArrowBackIosIcon />
      </IconButton>

      <IconButton size="small" onClick={goForward}>
        <ArrowForwardIosIcon />
      </IconButton>

      <IconButton size="small" onClick={goLast}>
        <SkipNextIcon />
      </IconButton>
    </div>
  );
};

export default PaginationComponent;
