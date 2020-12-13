import ActionTypes from "../constants/ActionTypes";
import SocketEvents from "../constants/SocketEvents";
import dispatcher from "../dispatcher";
import User from "../models/User";

import { sendMessage } from "../socket";
/**
 * @param {User} user
 */
const addUser = (user) => {
  sendMessage(SocketEvents.ADD_USER, user);
};

const onUserAdded = (user) => {
  dispatcher.dispatch({
    actionTypes: ActionTypes.User.USER_ADDED,
    data: user,
  });
};

// eslint-disable-next-line import/no-anonymous-default-export
export default { addUser, onUserAdded };
