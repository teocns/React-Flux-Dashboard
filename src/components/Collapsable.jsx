import React, { useState } from "react";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { Typography, Collapse, IconButton } from "@material-ui/core";
import { ExpandMore } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
  },
  media: {
    height: 0,
    paddingTop: "56.25%", // 16:9
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: "rotate(180deg)",
  },
}));

const Collapsable = ({ title, children }) => {
  const [Collapsed, setCollapsed] = useState(false);
  const classes = useStyles();
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div
        style={{ display: "flex", flexDirection: "row", alignItems: "center" }}
      >
        {title}
        <IconButton
          onClick={() => {
            setCollapsed(!Collapsed);
          }}
          aria-expanded={Collapsed}
          aria-label="show more"
          className={clsx(classes.expand, {
            [classes.expandOpen]: Collapsed,
          })}
        >
          <ExpandMore />
        </IconButton>
      </div>
      <Collapse in={Collapsed} timeout="auto" unmountOnExit>
        {children}
      </Collapse>
    </div>
  );
};

export default Collapsable;
