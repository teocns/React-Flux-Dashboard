/**
 * @typedef {Object} ScrapingThreadObject
 * @property {number} threadId
 * @property {number} creatorUserId
 * @property {number} age
 * @property {string} url
 * @property {number} scrapedJobsAmount
 */

export default class ScrapingThread {
  /**
   * @type {number}
   */
  threadId;
  /**
   * @type {number}
   */
  creatorUserId;

  creatorUserBrief;
  /**
   * @type {number}
   */
  age;
  /**
   * @type {string}
   */
  url;

  /**
   * @type {number}
   */
  scrapedJobsAmount;

  /**
   * @param {ScrapingThreadObject} obj
   */
  constructor(obj) {
    if (typeof obj === "object") {
      for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
          this[key] = obj[key];
        }
      }
    }
  }
}
