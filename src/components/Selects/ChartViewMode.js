import { IconButton, makeStyles, Menu, MenuItem } from "@material-ui/core";
import { ViewModule, ViewCarousel } from "@material-ui/icons";
import KeyMirror from "keymirror";
import React, { useState } from "react";

const CHART_VIEW_MODES = KeyMirror({
  SINGLE: null,
  PUZZLE: null,
});

const useStyles = makeStyles((theme) => ({
  icon: {
    width: 32,
    height: 32,
    color: theme.palette.primary.main,
  },
}));

const ICONS = {
  [CHART_VIEW_MODES.PUZZLE]: (classes) => (
    <ViewCarousel className={classes.icon} />
  ),
  [CHART_VIEW_MODES.SINGLE]: (classes) => (
    <ViewModule className={classes.icon} />
  ),
};

const ChartViewModeSelect = ({ onViewModeChanged, defaultViewMode }) => {
  const [SelectedChartMode, setSelectedChartMode] = useState(
    defaultViewMode || CHART_VIEW_MODES.SINGLE
  );

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (view_mode) => {
    setAnchorEl(null);
    Object.keys(CHART_VIEW_MODES).includes(view_mode) &&
      setTimeout(() => {
        console.log("setting ", view_mode);
        setSelectedChartMode(view_mode);
      });
  };

  const classes = useStyles();

  return (
    <div>
      <IconButton
        className={classes.icon}
        aria-controls="select-chart-view-mode"
        aria-haspopup="true"
        onClick={handleClick}
      >
        {ICONS[SelectedChartMode](classes)}
      </IconButton>
      <Menu
        id="select-chart-view-mode"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {Object.keys(CHART_VIEW_MODES).map((view_mode) => {
          return (
            <MenuItem
              selected={SelectedChartMode === view_mode}
              onClick={() => handleClose(view_mode)}
              data-view-mode={view_mode}
            >
              {ICONS[view_mode](classes)}
            </MenuItem>
          );
        })}
      </Menu>
    </div>
  );
};

export default ChartViewModeSelect;
