import MakeRequest from "./_Api";
import UrlTrackingThread from "../models/ScrapingThread";
import User from "../models/User";
import ActionTypes from "../constants/ActionTypes";

const Delete = async (threadIds) => {
  return await MakeRequest.post("/delete-scraping-threads", threadIds);
};

const GetDetails = async (threadId) => {
  return await MakeRequest.get(`/scraping-thread/${threadId}/details`);
};

export default { Delete, GetDetails };
