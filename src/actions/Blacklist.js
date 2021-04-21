import SocketEvents from "../constants/SocketEvents";
import { sendMessage, waitForEvent } from "../socket";
import { waitForEitherPromise } from "../helpers/utils";

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

export default { addRule, removeRules };
