import MakeRequest from "./_Api";
import UrlTrackingThread from "../models/ScrapingThread";

export default class DomainsApi {
  static async GetTable({ step = 1, filter, LastEvaluatedKey = null }) {
    return await MakeRequest.post(`/domains/table`, {
      step,
      filter,
      LastEvaluatedKey,
    });
  }

  static async ToggleCrawlingEnabled({ filter, domain, previous_is_enabled }) {
    return await MakeRequest.post(`/domains/toggle-crawling`, {
      domain,
      previous_is_enabled,
    });
  }
  static async AutoComplete({ word }) {
    return await MakeRequest.post(`/domains/autocomplete`, {
      word: word,
    });
  }
}
