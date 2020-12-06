import { EventEmitter } from "events";
import dispatcher from "../dispatcher";
import ActionTypes from "../constants/ActionTypes";
import ScrapingThread from "../models/ScrapingThread";

const Errors = require("../constants/Errors");

class ScrapingThreadsStore extends EventEmitter {
  /**
   * @type {Object.<string,ScrapingThread[]>} threads
   */
  #threads;
  /**
   * Generally set to true whenever the client is waiting for thread creation feedback from the server
   * @type {boolean}
   */
  #add_track_url_is_busy;
  constructor(params) {
    super(params);
    this.#add_track_url_is_busy = true;
  }

  canAddUrl() {
    return this.#add_track_url_is_busy;
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
