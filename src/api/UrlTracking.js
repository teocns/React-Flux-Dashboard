import MakeRequest from "./_Api";
import UrlTrackingThread from "../models/ScrapingThread";
export default class UrlTracking {
  static GetHistory() {
    //return MakeRequest.post("/get-history");
    const _ret = [];

    for (let i = 0; i < 99; i++) {
      const tnow = parseInt(new Date() / 1000);
      _ret.push(
        new UrlTrackingThread({
          age: tnow - Math.floor(Math.random() * 200020) + 1,
          creatorUserId: 12,
          scrapedJobsAmount: Math.floor(Math.random() * 1010) + 1,
          threadId: Math.floor(Math.random() * 100000) + 1,
          url: "https://sample.com",
        })
      );
    }
  }
}
