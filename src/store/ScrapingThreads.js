import { EventEmitter } from "events";
import dispatcher from "../dispatcher";
import ActionTypes from "../constants/ActionTypes";
import ScrapingThread from "../models/ScrapingThread";

const Errors = require("../constants/errors");

class ScrapingThreadsStore extends EventEmitter {
  /**
   * @type {Object.<string,ScrapingThread[]>} threads
   */
  #threads;
  constructor(params) {
    super(params);
    this.dispatchToken = undefined;

    this.connectionInitiatedTimestamp = undefined; // When
    this._isAuthenticated = false;
    this.user = {
      authentication_token: localStorage.authentication_token,
      email: undefined,
      username: undefined,
    };
    this.authentication_token_sent_timestamp = false;
    this.sessionId = undefined;
  }
  addChangeListener(event, callback) {
    this.on(event, callback);
  }

  removeChangeListener(event, callback) {
    this.removeListener(event, callback);
  }

  emitChange(event, data) {
    this.emit(event, data);
  }

  /**
   * @param {Object.<string,ScrapingThread[]>} threads
   */
  storeThreads(threads) {
    this.#threads = threads;
  }

  threadUpdated(threadId, threadData) {}

  storeSingleThread(thread) {
    this.#threads[thread.threadId] = thread;
  }
}

const scrapingThreadsStore = new ScrapingThreadsStore();

scrapingThreadsStore.dispatchToken = dispatcher.register((event) => {
  switch (event.actionType) {
    case ActionTypes.SCRAPING_THREAD_ADDED:
      scrapingThreadsStore.storeSingleThread(event.data.thread);
      break;
    default:
      // Do nothing.
      break;
  }
  scrapingThreadsStore.emitChange(event.actionType, event.data);
});

export default scrapingThreadsStore;
