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
    ].reduce((a, b) => {
      return (a || "").toString() + (b || "").toString();
    });
    return Buffer.from(hashable).toString("base64");
  }

  static defaults(tableName) {
    return new TableData({
      tableName,
      rowsPerPage: 5,
      page: 0,
      filter: 0,
      isLoading: true,
      totalRowsCount: -1,
      rows: [],
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
  }) {
    this.rows = rows;
    this.rowsPerPage = rowsPerPage !== undefined ? rowsPerPage : 5;
    this.filter = filter || "";
    this.page = page !== undefined ? page : 0;
    this.tableName = tableName;
    this.totalRowsCount = totalRowsCount;
    this.isLoading = isLoading || true;
    this.hash = this.createHash();
  }
}
