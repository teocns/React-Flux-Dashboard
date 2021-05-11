import SocketEvents from "../constants/SocketEvents";
import { sendMessage, waitForEvent } from "../socket";
import { waitForEitherPromise } from "../helpers/utils";
import dispatcher from "../dispatcher";
import ActionTypes from "../constants/ActionTypes";
import BlacklistApi from "../api/Blacklist";
export const addRule = (rule, reason) => {
  return new Promise((cb) => {
    waitForEitherPromise([
      waitForEvent(SocketEvents.ERROR),
      waitForEvent(SocketEvents.SUCCESS),
    ]).then((event) => {
      cb(event);
    });

    sendMessage(SocketEvents.ADD_BLACKLIST_RULE, {
      rule,
      reason,
    });
  });
};

export const removeRules = (rule_ids) => {
  return new Promise((cb) => {
    waitForEitherPromise([
      waitForEvent(SocketEvents.ERROR),
      waitForEvent(SocketEvents.SUCCESS),
    ]).then((event) => {
      cb(event);
    });

    sendMessage(SocketEvents.DELETE_BLACKLIST_RULE, {
      rule_ids,
    });
  });
};

export const getImpactForecast = async (rule) => {
  return await BlacklistApi.impactForecast(rule);
};
export const reasonsSynced = (reasons) => {
  dispatcher.dispatch({
    actionType: ActionTypes.Blacklist.SYNC_BLACKLIST_REASONS,
    data: { reasons },
  });
};

export const sync = () => {
  sendMessage(SocketEvents.SYNC_BLACKLIST_REASONS);
};

export default { addRule, removeRules, reasonsSynced, sync, getImpactForecast };
