import dispatcher from "./dispatcher";
import ActionTypes from "./constants/ActionTypes";
import EnvironmentConstants from "./constants/Environment";

import io from "socket.io-client";
import bindSessionSocketHandler from "./socket-handlers/session";
import bindScrapingThreadSocketHandler from "./socket-handlers/ScrapingThread";
import bindTableSocketHandler from "./socket-handlers/Table";

var socketInstance = initialize();

export function initialize() {
  // Should be called once, maybe
  const socket = io.connect(EnvironmentConstants.ENDPOINT_SOCKET, {
    reconnect: true,
    secure: true,
    rejectUnauthorized: false,
    transports: ["websocket"],
  });

  bindSessionSocketHandler(socket);
  bindScrapingThreadSocketHandler(socket);
  bindTableSocketHandler(socket);

  //bindEventHandlers(socket);

  return socket;
}
export function sendMessage(event, data) {
  socketInstance.emit(event, data);
}

export default socketInstance;
