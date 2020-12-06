/* eslint-disable import/no-anonymous-default-export */
import dispatcher from "../dispatcher";
import ActionTypes from "../constants/ActionTypes";

const showSnackbar = (message, severity) => {
  severity = typeof severity !== "string" ? "" : severity;
  message = typeof message !== "string" ? "" : message;
  severity = !severity && !message ? "error" : severity;
  message = !message
    ? "An error occured, please verify your connection and try again."
    : message;

  dispatcher.dispatch({
    actionType: ActionTypes.UI.SHOW_SNACKBAR,
    data: {
      message: message,
      severity: severity,
    },
  });
};
export default { showSnackbar };
