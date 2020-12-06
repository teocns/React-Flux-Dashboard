import scrapingThreadStore from "../store/ScrapingThreads";
import sessionStore from "../store/session";
import { sendMessage } from "../socket";
import SocketEvents from "../constants/SocketEvents";

import validate from "../helpers/validate";
import uiActions from "../actions/UI";
import Errors from "../constants/Errors";
import ApiError from "../models/ApiError";
const create = (url) => {
  // Make sure it's authenticated, just in case
  if (!sessionStore.isAuthenticated()) {
    uiActions.showSnackbar(
      new ApiError(Errors.ERR_UNAUTHENTICATED).toString(),
      "error"
    );
    return false;
  }

  if (typeof url !== "string") {
    uiActions.showSnackbar(Errors.ERR_INVALID_URL, "error");
    return false;
  }
  url = url.trim();
  if (!validate.url(url)) {
    uiActions.showSnackbar(Errors.ERR_INVALID_URL, "error");
    return false;
  }
  sendMessage(SocketEvents.CREATE_SCRAPING_THREAD, url);

  // Send a socket message requesting a thread creation
};

export default { create };
