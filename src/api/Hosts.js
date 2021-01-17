import MakeRequest from "./_Api";
import UrlTrackingThread from "../models/ScrapingThread";
import User from "../models/User";
import ActionTypes from "../constants/ActionTypes";

export default class HostsApi {
  /**
   * @returns {User}
   * @param {string} email
   * @param {string} password
   */
  static async changeRegex(hostId, regex) {
    return await MakeRequest.post(`/hosts/${hostId}/change-regex`, { regex });
  }
}
