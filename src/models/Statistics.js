class Statistics {
  userId;
  dateRange;
  countryFilter;
  trackedUrls;
  scrapedJobs;

  /**
   *
   */
  loading = true;
  constructor(obj) {
    if (typeof obj === "object") {
      for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
          this[key] = obj[key];
        }
      }
    }
  }

  static loading() {
    let _stats = new Statistics();
    _stats.isLoading = true;
    return _stats;
  }
}

export default Statistics;
