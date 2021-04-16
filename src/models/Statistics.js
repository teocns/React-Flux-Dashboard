export class StatisticsSyncRequest {
  dateRange;
  userFilter;
  types;

  constructor(dateRange, userFilter, types) {
    this.dateRange = dateRange;
    this.userFilter = userFilter;
    this.types = types;
  }
}

export default class Statistics {
  userFilter;

  dateRange;

  chartData;

  summary;

  age;

  type;
}
