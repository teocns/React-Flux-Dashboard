import MakeRequest from "./_Api";
import UrlTrackingThread from "../models/ScrapingThread";

export default class StatisticsApi {
  static async GetUserStatistics({ userId, month }) {
    return await MakeRequest.post(`/statistics/user`, {
      userId,
      month,
    });
  }

  static async GetCrawlerStatistics({ day }) {
    return await MakeRequest.post(`/statistics/crawler`, {
      day,
    });
  }
}
