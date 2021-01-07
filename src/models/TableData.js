/**
 * @typedef {Object} DateRange
 * @property {number} dateStart
 * @property {number} dateEnd
 */
export default class TableData {
  /**
   * @type {Object[]}
   */
  rows;
  /**
   * @type {number}
   */
  rowsPerPage;
  /**
   * @type {number}
   */
  page;

  /**
   * @type {string}
   */
  filter;
  /**
   * @type {string}
   */
  tableName;

  /**
   * @type {DateRange}
   */
  dateRange;

  /**
   * Appliable to specific tables only
   * @type {string[]}
   */
  countryFilter;

  ///////////////////////////////////
  /**
   * @type {boolean}
   */
  isLoading;

  /**
   * @type {number}
   */
  totalRowsCount;

  /**
   * @type {number}
   */
  unfilteredRowsCount;

  /**
   * @type {string}
   */
  hash;

  /**
   * @type {TableData}
   */
  previousTableData;

  /**
   * @type {boolean}
   */
  scrapingFinished;

  /**
   * @type {number}
   */
  scrapedJobs;

  // Uniquely identify each TableData representation by a hash
  createHash() {
    const hashable = [
      this.tableName,
      this.rowsPerPage,
      this.filter,
      this.page,
      this.countryFilter.join(),
      Object.values(this.dateRange).join(),
    ].reduce((a, b) => {
      return (a || "").toString() + (b || "").toString();
    });
    return Buffer.from(hashable).toString("base64");
  }

  static defaults(tableName) {
    return new TableData({
      tableName,
      rowsPerPage: 8,
      page: 0,
      filter: 0,
      isLoading: true,
      totalRowsCount: -1,
      rows: [],
      dateRange: {},
      countryFilter: [],
      unfilteredRowsCount: 0,
    });
  }

  constructor({
    tableName,
    rows,
    rowsPerPage,
    page,
    filter,
    isLoading,
    totalRowsCount,
    dateRange,
    countryFilter,
    unfilteredRowsCount,
  }) {
    this.rows = rows;
    this.rowsPerPage = rowsPerPage !== undefined ? rowsPerPage : 5;
    this.filter = filter || "";
    this.page = page !== undefined ? page : 0;
    this.tableName = tableName;
    this.totalRowsCount = totalRowsCount;
    this.isLoading = isLoading || true;
    this.countryFilter = Array.isArray(countryFilter) ? countryFilter : [];
    this.dateRange =
      typeof dateRange === "object" && Object.values(dateRange).length > 0
        ? dateRange
        : {};
    this.unfilteredRowsCount = unfilteredRowsCount || 0;
    this.hash = this.createHash();
  }
}
