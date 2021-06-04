//@ts-check
import {
  AppBar,
  Badge,
  Button,
  Collapse,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { deepOrange, deepPurple } from "@material-ui/core/colors";
import CssBaseline from "@material-ui/core/CssBaseline";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import {
  AccountCircle as AccountIcon,
  AddCircleOutline as AddCircleOutlineIcon,
  Block,
  BugReport,
  ExpandLess,
  ExpandMore,
  Link as LinkIcon,
  PowerSettingsNew as PowerSettingsNewIcon,
  Timeline as TimelineIcon,
} from "@material-ui/icons";
import LanguageIcon from "@material-ui/icons/Language";
import MenuIcon from "@material-ui/icons/Menu";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import sessionActions from "../actions/Session";
import faviconIconPng from "../assets/favicon128.png";
import UserAvatar from "../components/User/Avatar/ShortLettersAvatar";
import ActionTypes from "../constants/ActionTypes";

import StatisticsDataTypes from "../Shared/BBE-CRWL.WebApp.Shared.Models/Statistics/DataTypes";
import sessionStore from "../store/session";
import AppSnackbar from "./AppSnackbar";
import AppView from "./AppView";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    height: "100vh",
    overflow: "hidden",
  },
  nested: {
    paddingLeft: theme.spacing(4),
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
  appContent: {
    flexGrow: 1,
    display: "contents",
    padding: theme.spacing(3),
  },
  contentDrawerOpen: {},
  orange: {
    color: theme.palette.getContrastText(deepOrange[500]),
    backgroundColor: deepOrange[500],
  },
  purple: {
    color: theme.palette.getContrastText(deepPurple[500]),
    backgroundColor: deepPurple[500],
  },

  drawerPaper: {
    backgroundColor: "white",
    color: theme.palette.text.primary,
    // "& .MuiListItem-root": {
    //   color: "#3e3d3d",
    // },
    "& .MuiListItem-root ": {
      fontWeight: 500,
    },
    "& .MuiDivider-root": {
      backgroundColor: "#13131314",
    },
  },
}));

function AppContents() {
  const classes = useStyles();
  const theme = useTheme();
  const [drawerOpen, setDrawerOpen] = React.useState(true);

  const [User, setUser] = useState(sessionStore.getUser());
  const IsAdmin = (User && User.isAdmin) || false;

  const [ListItemStatisticsExpanded, setListItemStatisticsExpanded] =
    useState(false);

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
    setDrawerOpen(!drawerOpen);
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
            elevation={1}
            className={clsx(classes.appBar, {
              [classes.appBarShift]: isAuthenticated && drawerOpen,
            })}
          >
            <Toolbar style={{ paddingLeft: 18 }}>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                size="small"
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
              {/* <Button
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
                Manage Your URLs
              </Button> */}
            </Toolbar>
          </AppBar>

          <Drawer
            variant="permanent"
            className={clsx(classes.drawer, {
              [classes.drawerOpen]: drawerOpen,
              [classes.drawerClose]: !drawerOpen,
              [classes.hide]: !isAuthenticated,
            })}
            classes={{
              paper: clsx({
                [classes.drawerOpen]: drawerOpen,
                [classes.drawerClose]: !drawerOpen,
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
                <AnimatePresence>
                  {drawerOpen && (
                    <motion.div
                      exit={{
                        scale: 0,
                      }}
                      animate={{
                        scale: 1,
                      }}
                    >
                      <div className={classes.drawerHeader}>
                        <List>
                          <ListItem button style={{ display: "block" }}>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                paddingLeft: theme.spacing(4),
                              }}
                            >
                              <img
                                style={{ width: 54 }}
                                src={faviconIconPng}
                                alt="yes"
                              />
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                }}
                              >
                                <Typography
                                  variant="h6"
                                  style={{ marginLeft: theme.spacing(1) }}
                                >
                                  BeBee
                                </Typography>
                                <Typography
                                  variant="body1"
                                  style={{
                                    marginLeft: theme.spacing(1),
                                    marginTop: -4,
                                  }}
                                >
                                  Crawling
                                </Typography>
                              </div>
                            </div>
                          </ListItem>
                        </List>
                      </div>
                      <Divider />
                    </motion.div>
                  )}
                </AnimatePresence>

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
                    <ListItemText
                      disableTypography={true}
                      primary={User.name || User.username}
                    />
                  </ListItem>
                </List>
                <Divider />
                <List>
                  <ListItem button key={"stats"} component={Link} to="/">
                    <ListItemIcon>
                      <AddCircleOutlineIcon />
                    </ListItemIcon>
                    <ListItemText
                      disableTypography={true}
                      primary={"Crawl URLs"}
                    />
                  </ListItem>

                  {/* <ListItem
                    button
                    key={"stats"}
                    component={Link}
                    to="/tracked-urls"
                  >
                    <ListItemIcon>
                      <LinkIcon />
                    </ListItemIcon>
                    <ListItemText
                      disableTypography={true}
                      primary={"Your Crawled URLs"}
                    />
                  </ListItem> */}

                  <ListItem
                    button
                    key={"stats"}
                    //component={Link}
                    //to="/statistics"
                    key={"/statistics/" + StatisticsDataTypes.USER_TRACKED_URLS}
                    component={Link}
                    to={"/statistics/" + StatisticsDataTypes.USER_TRACKED_URLS}
                    // onClick={() =>
                    //   setListItemStatisticsExpanded(!ListItemStatisticsExpanded)
                    // }
                  >
                    <ListItemIcon>
                      <TimelineIcon />
                    </ListItemIcon>
                    <ListItemText
                      disableTypography={true}
                      primary={"Performance insights"}
                    />
                    {/* {ListItemStatisticsExpanded ? (
                      <ExpandLess />
                    ) : (
                      <ExpandMore />
                    )} */}
                  </ListItem>
                  {/* <Collapse
                    in={ListItemStatisticsExpanded}
                    timeout="auto"
                    unmountOnExit
                  >
                    <List component="div" disablePadding>
                      <ListItem
                        button
                        key={
                          "/statistics/" + StatisticsDataTypes.USER_TRACKED_URLS
                        }
                        component={Link}
                        to={
                          "/statistics/" + StatisticsDataTypes.USER_TRACKED_URLS
                        }
                        className={classes.nested}
                      >
                        <ListItemIcon>
                          <LinkIcon />
                        </ListItemIcon>
                        <ListItemText
                          disableTypography={true}
                          primary={"Tracked URLs"}
                        />
                      </ListItem>
                      
                      <ListItem
                        button
                        key={
                          "/statistics/" + StatisticsDataTypes.USER_TRACKED_URLS
                        }
                        component={Link}
                        to={
                          "/statistics/" + StatisticsDataTypes.USER_SCRAPED_JOBS
                        }
                        className={classes.nested}
                      >
                        <ListItemIcon>
                          <BugReport />
                        </ListItemIcon>
                        <ListItemText
                          disableTypography={true}
                          primary={"Scraped Jobs"}
                        />
                      </ListItem>
                    </List>
                  </Collapse> */}
                </List>
                <Divider />
                {IsAdmin && (
                  <React.Fragment>
                    <List>
                      <ListItem
                        button
                        key={"tracked-urls"}
                        component={Link}
                        to={"/tracked-urls"}
                      >
                        <ListItemIcon>
                          <LinkIcon />
                        </ListItemIcon>
                        <ListItemText
                          disableTypography={true}
                          primary={"What's being crawled"}
                        />
                      </ListItem>
                      <ListItem
                        button
                        key={"domains"}
                        component={Link}
                        to="/portals"
                      >
                        <ListItemIcon>
                          <LanguageIcon />
                        </ListItemIcon>
                        <ListItemText
                          disableTypography={true}
                          primary={"Crawled websites"}
                        />
                      </ListItem>

                      <ListItem
                        button
                        key={"blacklist"}
                        component={Link}
                        to="/blacklist"
                      >
                        <ListItemIcon>
                          <Block />
                        </ListItemIcon>
                        <ListItemText
                          disableTypography={true}
                          primary={"Blacklist"}
                        />
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
                        <ListItemText
                          disableTypography={true}
                          primary={"Users"}
                        />
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
                  <ListItemText
                    disableTypography={true}
                    primary={"Disconnect"}
                  />
                </ListItem>
              </List>
            </div>
          </Drawer>
        </React.Fragment>
      )}

      <main
        className={clsx({
          [classes.appContent]: true,
        })}
      >
        <AppView />
        <AppSnackbar />
      </main>
    </div>
  );
}
export default React.memo(AppContents);
