/* eslint-disable import/no-anonymous-default-export */
import SessionActionTypes from "./ActionTypes/Session";
import UIActionTypes from "./ActionTypes/UI";
import ScrapingThreadActionTypes from "./ActionTypes/ScrapingThread";
import TableActionTypes from "./ActionTypes/Table";
import UserActionTypes from "./ActionTypes/Users";

export default {
  Session: SessionActionTypes,
  UI: UIActionTypes,
  ScrapingThread: ScrapingThreadActionTypes,
  Table: TableActionTypes,
  User: UserActionTypes,
};
