/* eslint-disable import/no-anonymous-default-export */
import SessionActionTypes from "./ActionTypes/Session";
import UIActionTypes from "./ActionTypes/UI";
import ScrapingThreadActionTypes from "./ActionTypes/ScrapingThread";
import TableActionTypes from "./ActionTypes/Table";
import UserActionTypes from "./ActionTypes/Users";
import StatisticsActionTypes from "./ActionTypes/Statistics";
import UserFilterActionTypes from "./ActionTypes/UserFilter";
import CountryFilterActionTypes from "./ActionTypes/CountryFilter";
import HostActionTypes from "./ActionTypes/Hosts";

export default {
  Session: SessionActionTypes,
  UI: UIActionTypes,
  ScrapingThread: ScrapingThreadActionTypes,
  Table: TableActionTypes,
  User: UserActionTypes,
  Statistics: StatisticsActionTypes,
  UserFilter: UserFilterActionTypes,
  CountryFilter: CountryFilterActionTypes,
  Hosts: HostActionTypes,
};
