import MakeRequest from "./_Api";
import UrlTrackingThread from "../models/ScrapingThread";
import User from "../models/User";
import ActionTypes from "../constants/ActionTypes";

export default class ScrapingThread {
  static async Delete(threadIds) {
    return await MakeRequest.post("/delete-scraping-threads", threadIds);
  }
}
