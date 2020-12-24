import dispatcher from "../dispatcher";

import sessionActions from "../actions/Session";
import scrapingThreadActions from "../actions/ScrapingThread";

import SocketEvents from "../constants/SocketEvents";
import sessionStore from "../store/session";
import tableStore from "../store/Tables";
import ActionTypes from "../constants/ActionTypes";
import TableNames from "../constants/Tables";
import { sendMessage } from "../socket";
const bindSessionSocketHandler = (socket) => {
  socket.on(SocketEvents.SCRAPING_THREAD_CREATED, (scrapingThread) => {
    scrapingThreadActions.onThreadCreated(scrapingThread);
  });

  socket.on(SocketEvents.SCRAPING_THREAD_SYNC, (scrapingThread) => {
    scrapingThreadActions.onThreadModified(scrapingThread);
  });

  // socket.on(SocketEvents.SCRAPING_THREADS_TABLE_DATA, (tableData) => {
  //   console.log("SocketEvents.SCRAPING_THREADS_TABLE_DATA");
  //   scrapingThreadActions.onTableDataReceived(tableData);
  // });

  /**
   *
   * @param {object} param0
   * @param {TableData} param0.tableData
   */
  // const onTableHashCreated = ({ tableData }) => {
  //   if (tableData.tableName === TableNames.ADD_TRACK_URL) {
  //     // Request table data for this
  //     delete tableData.rows;
  //     delete tableData.isLoading;
  //     sendMessage(SocketEvents.SCRAPING_THREADS_TABLE_REQUEST, tableData);
  //   }
  //   console.log("onTableHashCreated", tableData);
  // };

  // tableStore.addChangeListener(
  //   ActionTypes.Table.DATA_CREATED,
  //   onTableHashCreated
  // );
};

export default bindSessionSocketHandler;
