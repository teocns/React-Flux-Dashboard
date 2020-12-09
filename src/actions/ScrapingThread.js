/* eslint-disable import/no-anonymous-default-export */
import scrapingThreadStore from "../store/ScrapingThreads";
import sessionStore from "../store/session";
import { sendMessage } from "../socket";
import SocketEvents from "../constants/SocketEvents";

import validate from "../helpers/validate";
import uiActions from "../actions/UI";
import Errors from "../constants/Errors";
import ApiError from "../models/ApiError";
import ScrapingThread from "../models/ScrapingThread";
import dispatcher from "../dispatcher";
import ActionTypes from "../constants/ActionTypes";
import { Socket } from "socket.io-client";
import TableData from "../models/TableData";
import tableActions from "../actions/Table";

import TableConstants from "../constants/Tables";
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

/**
 *
 * @param {ScrapingThread} scrapingThread
 */
const onThreadCreated = (scrapingThread) => {
  uiActions.showSnackbar("URL successfuly registered for tracking", "success");
  dispatcher.dispatch({
    actionType: ActionTypes.ScrapingThread.THREAD_CREATED,
    data: { scrapingThread },
  });
};

/**
 *
 * @param {TableData} tableData
 */
const requestTableDataRows = (tableData) => {
  dispatcher.dispatch({
    actionType: ActionTypes.ScrapingThread.TABLE_DATA_REQUESTED,
    data: { tableData },
  });

  // Create an unreferenced object
  const packet = { ...tableData };
  delete packet.rows;
  delete packet.isLoading;
  sendMessage(SocketEvents.SCRAPING_THREADS_TABLE_REQUEST, packet);
};

export default {
  create,
  onThreadCreated,
  requestTableDataRows,
};