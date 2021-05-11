import MakeRequest from "./_Api";
import UrlTrackingThread from "../models/ScrapingThread";
import User from "../models/User";
import ActionTypes from "../constants/ActionTypes";

export default class BlacklistApi {
  static async impactForecast(rule) {
    return await MakeRequest.post("/blacklist/impact-forecast", rule);
  }
  static async getAffectedUrls(ruleId) {
    return await MakeRequest.post("/blacklist/affected-urls", { ruleId });
  }
}
