import React, { useEffect, useState } from "react";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import faviconIconPng from "../assets/favicon128.png";
import ExtensionIcon from "@material-ui/icons/Extension";
import CssBaseline from "@material-ui/core/CssBaseline";
import UserAvatar from "../components/User/Avatar/ShortLettersAvatar";
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
  Box,
  Badge,
} from "@material-ui/core";

import { Link, useHistory } from "react-router-dom";

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
  Public as GlobeIcon,
  Domain,
} from "@material-ui/icons";
import AppView from "./AppView";
import sessionStore from "../store/session";
import ActionTypes from "../constants/ActionTypes";
import logoIconSvg from "../assets/l4c.svg";
const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    height: "100vh",
    overflow: "hidden",
  },
  avatar: {
    height: 32,
    width: 32,
    fontSize: theme.typography.body1.fontSize,
    marginLeft: -3,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    background: "white",
    color: "rgb(127, 127, 127)",
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
  drawerHeader: {},
  hide: {
    display: "none",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
    backgroundColor: "#f2902b",
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
    width: "58px !important",
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

  drawerPaper: {
    backgroundColor: theme.palette.primary.dark,
    color: "#ffffff",
    "& .MuiListItemIcon-root": {
      color: "#ffffff",
    },
    "& .MuiDivider-root": {
      backgroundColor: "#ffffff2e",
    },
  },
}));

function AppContents() {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);

  const [User, setUser] = useState(sessionStore.getUser());
  const IsAdmin = (User && User.isAdmin) || false;
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
    setOpen(!open);
  };

  const location = useLocation();

  const renderShortLetters = () => {
    if (!User || !User.name) {
      return "";
    }
    const fullName = User.name;
    let shortLetters = "";
    const nameParts = fullName.split(" ");
    if (nameParts.length >= 2) {
      shortLetters =
        nameParts[0].substring(0, 1) + nameParts[1].substring(0, 1);
    } else {
      shortLetters = nameParts[0].substring(0, 2);
    }
    // alert(fullName);
    return shortLetters;
  };
  console.log("isAuthenticated", isAuthenticated);
  return (
    <div className={classes.root}>
      <CssBaseline />
      {isAuthenticated && User && User.name && (
        <React.Fragment>
          <AppBar
            position="fixed"
            className={clsx(classes.appBar, {
              [classes.appBarShift]: isAuthenticated && open,
            })}
          >
            <Toolbar>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                edge="start"
                className={classes.menuButton}
              >
                <MenuIcon />
              </IconButton>
              <Button
                variant="text"
                color={
                  location.pathname === "/" || location.pathname === ""
                    ? "secondary"
                    : "rgb(127, 127, 127)"
                }
                startIcon={
                  <AddCircleOutlineIcon
                    color={
                      location.pathname === "/" || location.pathname === ""
                        ? "secondary"
                        : "rgb(127, 127, 127)"
                    }
                  />
                }
                component={Link}
                to="/"
              >
                Crawl URLs
              </Button>
              <Button
                variant="text"
                style={{ marginLeft: theme.spacing(1) }}
                component={Link}
                to="/manage-urls"
                startIcon={
                  <EditIcon
                    color={
                      location.pathname === "/manage-urls"
                        ? "secondary"
                        : "rgb(127, 127, 127)"
                    }
                  />
                }
                color={
                  location.pathname === "/manage-urls"
                    ? "secondary"
                    : theme.palette.text.hint
                }
              >
                Manage URLs
              </Button>
            </Toolbar>
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
                [classes.drawerPaper]: true,
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
                  <List>
                    <ListItem button>
                      <img
                        style={{ width: 64 }}
                        src={faviconIconPng}
                        alt="yes"
                      />
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <Typography
                          variant="h6"
                          style={{ marginLeft: theme.spacing(3) }}
                        >
                          BeBee
                        </Typography>
                        <Typography
                          variant="body1"
                          style={{
                            marginLeft: theme.spacing(3),
                            marginTop: -4,
                          }}
                        >
                          Crawling
                        </Typography>
                      </div>
                    </ListItem>
                  </List>
                </div>
                <Divider />
                <List>
                  {false && IsAdmin && (
                    <ListItem style={{ padding: 0 }}>
                      <div
                        style={{
                          width: "100%",
                          display: "flex",
                          justifyContent: "flex-end",
                          paddingRight: theme.spacing(2),
                          transform: "scale(0.9)",
                        }}
                      >
                        <Badge
                          size="small"
                          style={{ marginLeft: 24, marginBottom: -8 }}
                          badgeContent={
                            <div style={{ fontSize: 11 }}>ADMIN</div>
                          }
                          color="secondary"
                          anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "right",
                          }}
                        />
                      </div>
                    </ListItem>
                  )}
                  <ListItem button key={"userId"}>
                    <ListItemIcon>
                      <UserAvatar username={User.name} fullname={User.name} />
                    </ListItemIcon>
                    <ListItemText primary={User.name || User.username} />
                  </ListItem>
                </List>
                <Divider />
                <List>
                  <ListItem
                    button
                    key={"stats"}
                    component={Link}
                    to="/statistics"
                  >
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
                  <ListItem
                    button
                    key={"Extension"}
                    component={Link}
                    to="/extension"
                    selected={location.pathname === "/extension"}
                  >
                    <ListItemIcon>
                      <ExtensionIcon />
                    </ListItemIcon>
                    <ListItemText primary={"Chrome Extension"} />
                  </ListItem>
                </List>
                <Divider />
                {IsAdmin && (
                  <React.Fragment>
                    <List>
                      <ListItem
                        button
                        key={"user-stats"}
                        component={Link}
                        to="/user-statistics"
                      >
                        <ListItemIcon>
                          <SupervisedUserCircleIcon />
                        </ListItemIcon>
                        <ListItemText primary={"User Statistics"} />
                      </ListItem>
                      <ListItem
                        button
                        key={"tracked-urls"}
                        component={Link}
                        to={"/tracked-urls"}
                      >
                        <ListItemIcon>
                          <LinkIcon />
                        </ListItemIcon>
                        <ListItemText primary={"Tracked URLs"} />
                      </ListItem>
                      <ListItem button key={"xml"} component={Link} to="/xml">
                        <ListItemIcon>
                          <CodeIcon />
                        </ListItemIcon>
                        <ListItemText primary={"XML"} />
                      </ListItem>
                      <ListItem
                        button
                        key={"domains"}
                        component={Link}
                        to="/domains"
                      >
                        <ListItemIcon>
                          <Domain />
                        </ListItemIcon>
                        <ListItemText primary={"Domains"} />
                      </ListItem>
                      <ListItem
                        button
                        key={"countries"}
                        component={Link}
                        to="/countries"
                      >
                        <ListItemIcon>
                          <GlobeIcon />
                        </ListItemIcon>
                        <ListItemText primary={"Countries"} />
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
                <ListItem button key={"users"} onClick={sessionActions.logout}>
                  <ListItemIcon>
                    <PowerSettingsNewIcon />
                  </ListItemIcon>
                  <ListItemText primary={"Disconnect"} />
                </ListItem>
              </List>
            </div>
          </Drawer>
        </React.Fragment>
      )}

      <main
        className={clsx(classes.content, {
          [classes.contentShift]: open,
        })}
      >
        <AppView />
        <AppSnackbar />
      </main>
    </div>
  );
}
export default React.memo(AppContents);
