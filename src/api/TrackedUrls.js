import MakeRequest from "./_Api";
import UrlTrackingThread from "../models/ScrapingThread";

export default class TrackedUrlsApi {
  static async GetFullUrlById(url_id) {
    return await MakeRequest.get(`/tracked-url/${url_id}/url`);
  }

  static async GetTrackedUrlsCount({ dateRange, userFilter }) {
    return await MakeRequest.post(`/statistics/tracked-urls/count`, {
      dateRange,
      userFilter,
    });
  }
  static async GetSummaries({ dateRange, userFilter }) {
    return await MakeRequest.post(`/statistics/tracked-urls/summary`, {
      dateRange,
      userFilter,
    });
  }

  static async GetTable(DATA) {
    return await MakeRequest.post(`/tracked-urls/table`, DATA);
  }

  static async GetCrawlingEvents(DATA) {
    return await MakeRequest.post(`/url/crawler-processes`, DATA);
  }

  static async TrackUrl({ url }) {
    return await MakeRequest.post(`/tracked-urls/track`, {
      url,
    });
  }
}
