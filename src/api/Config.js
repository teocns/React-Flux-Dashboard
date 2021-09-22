import MakeRequest from "./_Api";
import UrlTrackingThread from "../models/ScrapingThread";

export default class ConfigApi {
  static async GetConfig(configName) {
    return await MakeRequest.get(`/config/${configName}`);
  }
}
