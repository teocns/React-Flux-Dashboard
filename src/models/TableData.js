/**
 * Enum string values.
 * @enum {string}
 */
var SortVariants = {
  asc: "asc",
  desc: "desc",
};

export class SortColumn {
  /**
   *
   */
  name;
  /**
   * @type {SortVariants}
   */
  order;

  /**
   *
   * @param {string} name
   * @param {SortVariants} order
   */
  constructor(name, order) {
    this.name = name;
    this.order = order;
  }
}

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
   * @type {SortColumn}
   */
  sort;

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

  /**
   * @type {number}
   */
  age;
  // getSortForColumn(columnName) {
  //   if (this.sortColumns && Array.isArray(this.sortColumns)) {
  //     for (let col of this.sortColumns) {
  //       if (col.name === columnName) {
  //         return col.order;
  //       }
  //     }
  //   }
  //   return undefined;
  // }

  getColumns() {}
  // Uniquely identify each TableData representation by a hash
  createHash() {
    const hashable = [
      this.tableName,
      this.rowsPerPage,
      this.filter,
      this.page,
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
    sort,
    countryFilter,
    unfilteredRowsCount,
  }) {
    this.rows = rows;
    this.rowsPerPage = rowsPerPage !== undefined ? rowsPerPage : 5;
    this.filter = filter || "";
    this.page = page !== undefined ? page : 0;
    this.tableName = tableName;
    this.totalRowsCount = totalRowsCount;
    this.sort = sort;
    this.isLoading = isLoading || true;
    this.countryFilter = Array.isArray(countryFilter) ? countryFilter : [];
    this.dateRange =
      typeof dateRange === "object" && Object.values(dateRange).length > 0
        ? dateRange
        : {};
    this.unfilteredRowsCount = unfilteredRowsCount || 0;
    this.hash = this.createHash();
    this.age = parseInt(new Date() / 1000);
  }
}
