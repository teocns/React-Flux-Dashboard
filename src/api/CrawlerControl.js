import MakeRequest from "./_Api";

import UrlTrackingThread from "../models/ScrapingThread";

export default class CrawlerControl {
  static GetAutoscalingConfig() {
    return MakeRequest.get("/config/AUTOSCALING_CONFIG");
  }

  static GetAutoscalingGroupsCapacity() {
    return MakeRequest.get("/autoscaling/capacity");
  }

  static GetConfig() {
    return MakeRequest.get("/crawlers/stats");
  }

  static ReloadIncompleteThreads() {
    return MakeRequest.post("/crawlers/reload-threads");
  }

  static SaveConfig(config) {
    return MakeRequest.post("/config/AUTOSCALING_CONFIG/update", config);
  }

  static StartCrawler() {
    return MakeRequest.post("/crawlers/start");
  }

  static StopCrawler() {
    return MakeRequest.post("/crawlers/pause");
  }
}
