import React, { useState } from "react";
import clsx from "clsx";
import { useConfirm } from "material-ui-confirm";
import {
  Box,
  IconButton,
  Checkbox,
  Divider,
  Button,
  FormControlLabel,
  Paper,
  TextField,
  Typography,
  FormGroup,
  FormLabel,
  FormControl,
  ButtonGroup,
  FormHelperText,
  InputLabel,
  OutlinedInput,
  InputAdornment,
} from "@material-ui/core";
import FaceIcon from "@material-ui/icons/Face";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import ClearIcon from "@material-ui/icons/Clear";
import UserApi from "../api/User";
import { useHistory } from "react-router-dom";
import LinearScaleIcon from "@material-ui/icons/LinearScale";
import {
  ArrowBack,
  Check,
  Mail,
  Person,
  Visibility,
  VisibilityOff,
  Lock,
} from "@material-ui/icons";

import uiActions from "../actions/UI";
import ApiError from "../models/ApiError";
const useStyles = makeStyles((theme) => ({
  root: {
    display: "inline-block",
  },
  paper: {
    padding: theme.spacing(2),
  },
  box: {
    "& > *": {
      marginBottom: theme.spacing(1.5),
    },
  },
  saveBtn: {
    color: theme.palette.success.main,
  },
  abortBtn: {
    color: theme.palette.error.dark,
  },
  hide: {
    display: "none",
  },
}));

const AddUserView = () => {
  const [Password, setPassword] = useState("");
  const [ShowPassword, setShowPassword] = useState(false);
  const [Email, setEmail] = useState("");
  const [IsAdmin, setIsAdmin] = useState(false);
  const [FullName, setFullName] = useState("");
  const [Username, setUsername] = useState("");

  const [InputErrors, setInputErrors] = useState([]);

  const hasError = (field) => {
    return InputErrors.includes(field);
  };
  const classes = useStyles();
  const theme = useTheme();
  const history = useHistory();
  const onGoBack = () => {
    history.goBack();
  };

  const handleClickShowPassword = () => {
    setShowPassword(!ShowPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const performAddUser = async () => {
    let result = await UserApi.AddUser({
      email: Email,
      username: Username,
      name: FullName,
      password: Password,
      isAdmin: IsAdmin,
    });

    if (ApiError.isError(result)) {
      const vars = Object.keys(result.variables);
      setInputErrors(vars);
    } else {
      history.goBack();
      uiActions.showSnackbar(`User "${Username}" created.`, "success");
    }
  };
  return (
    <div className={classes.root}>
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          marginBottom: theme.spacing(1),
        }}
      >
        <IconButton size="small" onClick={onGoBack}>
          <ArrowBack size="small" />
        </IconButton>
        <Typography variant="h6" style={{ marginLeft: theme.spacing(1) }}>
          Add new user
        </Typography>
      </div>
      <Paper className={classes.paper}>
        <Box
          className={classes.box}
          display="inline-flex"
          alignItems="start"
          flexDirection="column"
        >
          <Typography
            variant="body1"
            style={{ color: theme.palette.text.hint }}
          >
            User information
          </Typography>

          <FormGroup row>
            <FormControl variant="outlined">
              <InputLabel htmlFor="full-name-input">Full name</InputLabel>
              <OutlinedInput
                id="full-name-input"
                startAdornment={
                  <InputAdornment position="start">
                    <FaceIcon />
                  </InputAdornment>
                }
                value={FullName}
                required
                min="4"
                name="fullName"
                max="50"
                onChange={(evt) => {
                  setFullName(evt.target.value);
                }}
                type="text"
                size="small"
                placeholder="John doe"
                labelWidth={70}
                error={hasError("name")}
                aria-describedby="full-name-helper"
              />
              <FormHelperText
                id="full-name-helper"
                error={hasError("name")}
                className={clsx({ [classes.hide]: !hasError("name") })}
              >
                3-50 characters
              </FormHelperText>
            </FormControl>
            <FormControl
              variant="outlined"
              style={{ marginLeft: theme.spacing(1) }}
            >
              <InputLabel htmlFor="email-input">Email</InputLabel>
              <OutlinedInput
                id="email-input"
                startAdornment={
                  <InputAdornment position="start">
                    <Mail />
                  </InputAdornment>
                }
                value={Email}
                required
                onChange={(evt) => {
                  setEmail(evt.target.value);
                }}
                type="text"
                size="small"
                placeholder="johndoe@mail.com"
                labelWidth={40}
                error={hasError("email")}
                aria-describedby="email-helper"
              />
              <FormHelperText
                id="email-helper"
                error={hasError("email")}
                className={clsx({ [classes.hide]: !hasError("email") })}
              >
                Must be a valid email
              </FormHelperText>
            </FormControl>
          </FormGroup>

          <Typography
            variant="body1"
            style={{
              color: theme.palette.text.hint,
              marginTop: theme.spacing(3),
            }}
          >
            Authentication credentials
          </Typography>

          <FormGroup row>
            <FormControl variant="outlined">
              <InputLabel htmlFor="username-input">Username</InputLabel>
              <OutlinedInput
                id="username-input"
                required
                startAdornment={
                  <InputAdornment position="start">
                    <Person />
                  </InputAdornment>
                }
                value={Username}
                onChange={(evt) => {
                  setUsername(evt.target.value);
                }}
                type="text"
                size="small"
                placeholder="johndoe12"
                labelWidth={70}
                error={hasError("username")}
                aria-describedby="username-helper"
              />
              <FormHelperText
                id="username-helper"
                error={hasError("username")}
                className={clsx({ [classes.hide]: !hasError("username") })}
              >
                6-32 characters
              </FormHelperText>
            </FormControl>
            <FormControl
              variant="outlined"
              style={{ marginLeft: theme.spacing(1) }}
            >
              <InputLabel htmlFor="password-input">Password</InputLabel>
              <OutlinedInput
                id="password-input"
                startAdornment={
                  <InputAdornment position="start">
                    <Lock />
                  </InputAdornment>
                }
                type={ShowPassword ? "text" : "password"}
                size="small"
                placeholder={"******"}
                required
                value={Password}
                onChange={(evt) => {
                  setPassword(evt.target.value);
                }}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {ShowPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
                labelWidth={70}
                error={hasError("password")}
                aria-describedby="password-helper"
              />
              <FormHelperText
                id="password-helper"
                error={hasError("password")}
                className={clsx({ [classes.hide]: !hasError("password") })}
              >
                6-32 characters
              </FormHelperText>
            </FormControl>
          </FormGroup>
          <Typography
            variant="body1"
            style={{
              color: theme.palette.text.hint,
              marginTop: theme.spacing(3),
              marginBottom: 0,
            }}
          >
            Privileges
          </Typography>
          <FormControl component="fieldset">
            <FormGroup row>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={IsAdmin}
                    onChange={(evt) => {
                      setIsAdmin(!IsAdmin);
                    }}
                  />
                }
                label={"Admin"}
              />
            </FormGroup>
          </FormControl>
          <Box
            flexDirection="row"
            alignItems="center"
            style={{ marginTop: theme.spacing(2) }}
          >
            <Button
              color="secondary"
              variant="contained"
              startIcon={<Check />}
              onClick={performAddUser}
            >
              Confirm
            </Button>
            <Button
              variant="text"
              onClick={onGoBack}
              style={{ marginLeft: theme.spacing(1) }}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Paper>
    </div>
  );
};

export default AddUserView;
