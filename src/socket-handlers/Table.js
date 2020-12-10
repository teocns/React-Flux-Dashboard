import dispatcher from "../dispatcher";

import sessionActions from "../actions/Session";
import scrapingThreadActions from "../actions/ScrapingThread";

import SocketEvents from "../constants/SocketEvents";
import sessionStore from "../store/session";
import tableStore from "../store/Tables";
import tableActions from "../actions/Table";
import ActionTypes from "../constants/ActionTypes";
import TableNames from "../constants/Tables";
import { sendMessage } from "../socket";
const bindSocketHandler = (socket) => {
  //   socket.on(SocketEvents.SCRAPING_THREAD_CREATED, (scrapingThread) => {
  //     scrapingThreadActions.onThreadCreated(scrapingThread);
  //   });

  socket.on(SocketEvents.TABLE_DATA, (tableData) => {
    tableActions.onTableDataReceived(tableData);
  });

  /**
   *
   * @param {object} param0
   * @param {TableData} param0.tableData
   */
  const onTableHashCreated = ({ tableData }) => {
    const dup = { ...tableData };
    delete dup.rows;
    delete dup.isLoading;
    sendMessage(SocketEvents.TABLE_SYNC, dup);
  };

  tableStore.addChangeListener(
    ActionTypes.Table.DATA_CREATED,
    onTableHashCreated
  );
};

export default bindSocketHandler;
