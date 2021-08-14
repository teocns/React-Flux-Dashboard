import MakeRequest from "./_Api";
import UrlTrackingThread from "../models/ScrapingThread";

export default class DomainsApi {
  static async GetTable(data) {
    return await MakeRequest.post(`/countries/table`, data);
  }

  static async SetPrice({ countries, price }) {
    return await MakeRequest.post(`/countries/update-price`, {
      countries,
      price,
    });
  }
}
