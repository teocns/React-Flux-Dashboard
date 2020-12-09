import React, { useEffect, useState } from "react";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";

import CssBaseline from "@material-ui/core/CssBaseline";

import {
  Drawer,
  Avatar,
  ListItemText,
  ListItemIcon,
  ListItem,
  AppBar,
  Typography,
  Toolbar,
  Divider,
  Button,
  IconButton,
  List,
} from "@material-ui/core";

import { Link } from "react-router-dom";

import AppSnackbar from "./AppSnackbar";

import sessionActions from "../actions/Session";

import InboxIcon from "@material-ui/icons/MoveToInbox";
import MailIcon from "@material-ui/icons/Mail";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import EditIcon from "@material-ui/icons/Edit";
import { deepOrange, deepPurple } from "@material-ui/core/colors";
import { useLocation } from "react-router-dom";
import {
  Link as LinkIcon,
  Code as CodeIcon,
  AccountCircle as AccountIcon,
  Help as HelpIcon,
  Timeline as TimelineIcon,
  SupervisedUserCircle as SupervisedUserCircleIcon,
  PowerSettingsNew as PowerSettingsNewIcon,
  AddCircleOutline as AddCircleOutlineIcon,
} from "@material-ui/icons";
import AppView from "./AppView";
import sessionStore from "../store/session";
import ActionTypes from "../constants/ActionTypes";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: "none",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9) + 1,
    },
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  orange: {
    color: theme.palette.getContrastText(deepOrange[500]),
    backgroundColor: deepOrange[500],
  },
  purple: {
    color: theme.palette.getContrastText(deepPurple[500]),
    backgroundColor: deepPurple[500],
  },
}));

export default function AppContents() {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);

  const [IsAdmin, setIsAdmin] = useState(true);
  const [User, setUser] = useState(undefined);

  const [isAuthenticated, setIsAuthenticated] = useState(
    sessionStore.isAuthenticated()
  );

  const onAuthenticationStatusChanged = () => {
    setIsAuthenticated(sessionStore.isAuthenticated());
  };
  useEffect(() => {
    sessionStore.addChangeListener(
      ActionTypes.Session.USER_DATA_UPDATED,
      onAuthenticationStatusChanged
    );
    return () => {
      sessionStore.removeChangeListener(
        ActionTypes.Session.USER_DATA_UPDATED,
        onAuthenticationStatusChanged
      );
    };
  });

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const location = useLocation();
  console.log(location.pathname);

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: isAuthenticated && open,
        })}
      >
        {isAuthenticated && (
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              className={clsx(classes.menuButton, open && classes.hide)}
            >
              <MenuIcon />
            </IconButton>
            <Button
              variant="text"
              style={{ color: "white" }}
              startIcon={<AddCircleOutlineIcon />}
              component={Link}
              to="/"
            >
              Crawl URLs
            </Button>
            <Button
              variant="text"
              style={{ color: "white", marginLeft: theme.spacing(1) }}
              startIcon={<EditIcon />}
            >
              Manage URLs
            </Button>
          </Toolbar>
        )}
      </AppBar>
      <Drawer
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
          [classes.hide]: !isAuthenticated,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          }),
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            flexDirection: "column",
            flex: 1,
          }}
        >
          <div>
            <div className={classes.drawerHeader}>
              <IconButton onClick={handleDrawerClose}>
                {theme.direction === "ltr" ? (
                  <ChevronLeftIcon />
                ) : (
                  <ChevronRightIcon />
                )}
              </IconButton>
            </div>
            <Divider />
            <List style={{ padding: 0 }}>
              <ListItem button key={"userId"}>
                <ListItemIcon>
                  <Avatar className={classes.orange}>JC</Avatar>
                </ListItemIcon>
                <ListItemText primary={"Javier"} />
              </ListItem>
              <Divider />
            </List>
            <List>
              <ListItem button key={"stats"}>
                <ListItemIcon>
                  <TimelineIcon />
                </ListItemIcon>
                <ListItemText primary={"Statistics"} />
              </ListItem>
              <ListItem
                button
                key={"FAQ"}
                component={Link}
                to="/faq"
                selected={location.pathname === "/faq"}
              >
                <ListItemIcon>
                  <HelpIcon />
                </ListItemIcon>
                <ListItemText primary={"FAQ"} />
              </ListItem>
            </List>
            <Divider />
            {IsAdmin && (
              <React.Fragment>
                <List>
                  <ListItem button key={"user-stats"}>
                    <ListItemIcon>
                      <SupervisedUserCircleIcon />
                    </ListItemIcon>
                    <ListItemText primary={"User Statistics"} />
                  </ListItem>
                  <ListItem button key={"tracked-urls"}>
                    <ListItemIcon>
                      <LinkIcon />
                    </ListItemIcon>
                    <ListItemText primary={"Tracked URLs"} />
                  </ListItem>
                  <ListItem button key={"xml"}>
                    <ListItemIcon>
                      <CodeIcon />
                    </ListItemIcon>
                    <ListItemText primary={"XML"} />
                  </ListItem>
                  <ListItem
                    button
                    key={"users"}
                    selected={location.pathname === "/manage-users"}
                    component={Link}
                    to="/manage-users"
                  >
                    <ListItemIcon>
                      <AccountIcon />
                    </ListItemIcon>
                    <ListItemText primary={"Users"} />
                  </ListItem>
                </List>
                <Divider />
              </React.Fragment>
            )}
          </div>
          <List>
            <div
              style={{
                display: "block",
                whiteSpace: "normal",
                overflow: "hidden",
                color: theme.palette.text.disabled,
                textAlign: "center",
              }}
            >
              <Typography variant="caption" style={{ display: "block" }}>
                @ 2020 beBee Affinity Social Network, S.L
              </Typography>
              <Typography variant="caption" style={{ display: "block" }}>
                CIF B84471838 - <Link>Contact</Link>
              </Typography>
            </div>
            <Divider />
            <ListItem button key={"users"} onClick={sessionActions.logout}>
              <ListItemIcon>
                <PowerSettingsNewIcon />
              </ListItemIcon>
              <ListItemText primary={"Disconnect"} />
            </ListItem>
          </List>
        </div>
      </Drawer>
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: open,
        })}
      >
        <div className={classes.drawerHeader} />
        <AppView />
        <AppSnackbar />
      </main>
    </div>
  );
}
