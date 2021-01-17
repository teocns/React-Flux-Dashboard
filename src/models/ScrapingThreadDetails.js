class ScrapingThreadDetails {
  threadId;
  age;
  url;
  externalLinksFound;
  /**
   * Bundled audits count
   */
  auditsCount;

  /**
   * Determines when a scraping thread is completed
   */
  isCompleted;

  /**
   * @type {number}
   */
  scrapedJobs;
}

export default ScrapingThreadDetails;
