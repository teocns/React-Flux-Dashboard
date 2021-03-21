function getMonday() {
  const date = new Date();
  let day = date.getDay() || 7;
  if (day !== 1) date.setHours(-24 * (day - 1));
  date.setHours(0);
  return date;
}
// eslint-disable-next-line import/no-anonymous-default-export
export default [
  {
    label: "Today",
    startDate: (() => {
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      return d;
    })(),
    endDate: (() => {
      const d = new Date();
      d.setDate(new Date().getDate() + 1);
      d.setHours(0, 0, 0, 0);
      return d;
    })(),
    dateFormat: "%Y-%m-%d %H",
    timeFrame: "HOUR",
  },
  {
    label: "Yesterday",
    startDate: (() => {
      const d = new Date();
      d.setDate(d.getDate() - 1);
      d.setHours(0, 0, 0, 0);
      return d;
    })(),
    endDate: (() => {
      const d = new Date();

      d.setHours(0, 0, 0, 0);
      return d;
    })(),
    dateFormat: "%Y-%m-%d %H",
    timeFrame: "HOUR",
  },
  {
    label: "This week",
    startDate: getMonday(),
    endDate: new Date().setDate(new Date().getDate() + 1),
    timeFrame: "DAY",
    dateFormat: "%Y-%m-%d",
  },
  {
    label: "Last 7 days",
    startDate: new Date().setDate(new Date().getDate() - 7),
    endDate: new Date().setDate(new Date().getDate() + 1),
    timeFrame: "DAY",
    dateFormat: "%Y-%m-%d",
  },
  {
    label: "This month",
    startDate: (() => {
      const date = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
      date.setMonth(date.getMonth() - 1);
      return date;
    })(),
    endDate: (() => {
      function daysInMonth(month, year) {
        return new Date(year, month, 0).getDate();
      }
      const ynow = new Date().getFullYear();
      const mnow = new Date().getMonth();
      const date = new Date(ynow, mnow, 1);
      date.setMonth(date.getMonth() - 1);
      date.setDate(daysInMonth(mnow, ynow));
      return date;
    })(),
    dateFormat: "%Y-%m-%d",
    timeFrame: "DAY",
  },
  {
    label: "MAX",
    timeFrame: "MONTH",
    startDate: null,
    endDate: null,
    dateFormat: "%Y-%m",
  },
];
