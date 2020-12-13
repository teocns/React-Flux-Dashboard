import MakeRequest from "./_Api";
import UrlTrackingThread from "../models/ScrapingThread";
import User from "../models/User";
import ActionTypes from "../constants/ActionTypes";

export default class UrlTracking {
  /**
   * @returns {User}
   * @param {string} email
   * @param {string} password
   */
  static async Authenticate(email, password) {
    return await MakeRequest.post("/authenticate", { email, password });
  }

  static async AddUser(userData) {
    return await MakeRequest.post("/add-user", userData);
  }
  /**
   *
   * @param {number[]} userIds
   */
  static async DeleteUsers(userIds) {
    return await MakeRequest.post("/delete-users", userIds);
  }
}
