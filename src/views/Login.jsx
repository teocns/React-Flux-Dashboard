import React, { useState, useRef, useEffect } from "react";
import { useHistory } from "react-router-dom";
import {
  Paper,
  Typography,
  FormControl,
  OutlinedInput,
  InputAdornment,
  Button,
  CircularProgress,
} from "@material-ui/core";

import EmailIcon from "@material-ui/icons/Email";
import LockIcon from "@material-ui/icons/Lock";

import { makeStyles, useTheme } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import ActionTypes from "../constants/ActionTypes";

import sessionActions from "../actions/Session";
import sessionStore from "../store/session";

const useStyles = makeStyles((theme) => ({
  formPaper: {
    padding: theme.spacing(3),
    maxWidth: 420, // Blaze it
    width: "100%",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  inputField: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
  },
}));

const LoginView = () => {
  const [IsAuthenticating, setIsAuthenticating] = useState(false);
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const history = useHistory();
  const storedAuthToken = sessionStore.getAuthenticationToken();
  const isAuthenticating = sessionStore.isAuthenticating();
  const performAuthentication = () => {
    setTimeout(async () => {
      const authData = {
        email: Email,
        password: Password,
      };

      sessionActions.userAuthenticate(authData).then();
    });
  };
  const classes = useStyles();
  const theme = useTheme();
  const onUserAuthenticatingChanged = () => {
    setIsAuthenticating(sessionStore.isAuthenticating());
  };
  useEffect(() => {
    if (sessionStore.isAuthenticated()) {
      history.push("/");
      return <div></div>;
    }

    // Bind event listeners
    sessionStore.addChangeListener(
      ActionTypes.Session.IS_AUTHENTICATING,
      onUserAuthenticatingChanged
    );

    if (storedAuthToken && !isAuthenticating) {
      sessionActions.tryAuthentication();
    }
    return () => {
      sessionStore.removeChangeListener(
        ActionTypes.Session.IS_AUTHENTICATING,
        onUserAuthenticatingChanged
      );
    };
  });

  if (storedAuthToken) {
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
  }
  return (
    <Paper className={classes.formPaper}>
      <Typography variant="h6">Sign in</Typography>

      <FormControl fullWidth className={classes.inputField}>
        <OutlinedInput
          id="standard-adornment-amount"
          disabled={!!IsAuthenticating}
          value={Email}
          placeholder="Email / Username"
          onChange={(evt) => {
            setEmail(evt.target.value);
          }}
          startAdornment={
            <InputAdornment position="start">
              <EmailIcon />
            </InputAdornment>
          }
        />
      </FormControl>

      <FormControl fullWidth className={classes.inputField}>
        <OutlinedInput
          id="standard-adornment-amount"
          placeholder="Password"
          type="password"
          disabled={!!IsAuthenticating}
          onChange={(evt) => {
            setPassword(evt.target.value);
          }}
          onKeyPress={(evt) => {
            if (evt.key === "Enter") {
              performAuthentication();
            }
          }}
          startAdornment={
            <InputAdornment position="start">
              <LockIcon />
            </InputAdornment>
          }
        />
      </FormControl>

      <Button
        variant="contained"
        fullWidth
        disableElevation
        color="secondary"
        style={{ marginTop: theme.spacing(2) }}
        onClick={performAuthentication}
        disabled={!!IsAuthenticating}
      >
        {IsAuthenticating ? (
          <CircularProgress style={{ color: "white", width: 24, height: 24 }} />
        ) : (
          "Login"
        )}
      </Button>

      <Link
        to="reset-password"
        fullWidth
        style={{ textAlign: "center", marginTop: theme.spacing(1) }}
      >
        Forgot your password?
      </Link>
    </Paper>
  );
};

export default LoginView;
