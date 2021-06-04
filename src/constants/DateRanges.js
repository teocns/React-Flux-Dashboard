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
    startDate: (function () {
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      return d.getTime();
    })(),
    endDate: (function () {
      const d = new Date();
      d.setDate(new Date().getDate() + 1);
      d.setHours(0, 0, 0, 0);
      return d.getTime();
    })(),
    dateFormat: "%h %p",
    timeFrame: "HOUR",
  },
  {
    label: "Yesterday",
    startDate: (function () {
      const d = new Date();
      d.setDate(d.getDate() - 1);
      d.setHours(0, 0, 0, 0);
      return d.getTime() / 1000;
    })(),
    endDate: (function () {
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      return d.getTime() / 1000;
    })(),
    dateFormat: "%h %p",
    timeFrame: "HOUR",
  },

  {
    label: "Last 7 days",
    startDate: (function () {
      let date = new Date();
      date.setDate(new Date().getDate() - 7);
      return date.getTime();
    })(),
    endDate: (function () {
      let date = new Date();
      date.setDate(new Date().getDate() + 1);
      return date.getTime();
    })(),
    timeFrame: "DAY",
    dateFormat: "%W %D",
  },
  {
    label: "Last 30 days",
    startDate: (function () {
      let date = new Date();
      date.setDate(new Date().getDate() - 30);
      return date.getTime();
    })(),
    endDate: (function () {
      let date = new Date();
      date.setDate(new Date().getDate() + 1);
      return date.getTime();
    })(),
    timeFrame: "DAY",
    dateFormat: "%W %D",
  },
  {
    label: "MAX",
    timeFrame: "MONTH",
    startDate: null,
    endDate: null,
    dateFormat: "%b %Y",
  },
];
