import constants from "../constants/Environment";
import sessionStore from "../store/session";
import sessionActions from "../actions/Session";
import Errors from "../constants/Errors";
import ApiError from "../models/ApiError";
String.prototype.trimChar = function (charToRemove) {
  let string = this;
  while (string.charAt(0) == charToRemove) {
    string = string.substring(1);
  }

  while (string.charAt(string.length - 1) == charToRemove) {
    string = string.substring(0, string.length - 1);
  }

  return string;
};

// The class will automatically handle errors (notifies genericAppErrorHanelr)
export default class MakeRequest {
  static _req(method, endpoint, data) {
    endpoint = `${constants.ENDPOINT.trimChar("/")}/${endpoint.trimChar("/")}`;

    const headers = { "Content-Type": "application/json" };
    // If authentication token, append it
    const authentication_token = sessionStore.getAuthenticationToken();

    if (authentication_token) {
      headers["X-Authentication-Token"] = authentication_token;
    }
    return new Promise((resolve) => {
      let requestOptions = {
        method: method,
        headers,
        body: JSON.stringify(data),
      };
      fetch(endpoint, requestOptions)
        .then((response) => {
          response.json().then((json) => {
            try {
              if (ApiError.isError(json)) {
                sessionActions.onApiError(new ApiError(json));
                return resolve(json);
              }
              resolve(json);
            } catch (error) {
              sessionActions.onApiError(new ApiError(Errors.ERR_UNKNOWN));
              resolve(error);
            }
          });
        })
        .catch((e) => {
          console.log(e);
          resolve(false);
        });
    });
  }
  static post(endpoint, data) {
    // Adjust endpoint

    return this._req("POST", endpoint, data);
  }
  static get(endpoint) {
    return this._req("GET", endpoint);
  }
}
