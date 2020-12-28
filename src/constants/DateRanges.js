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
    label: "Clear",
    startDate: null,
    endDate: null,
  },
  {
    label: "Today",
    startDate: new Date().setDate(new Date().getDate() - 1),
    endDate: new Date().setDate(new Date().getDate()),
  },
  {
    label: "Yesterday",
    startDate: new Date().setDate(new Date().getDate() - 2),
    endDate: new Date().setDate(new Date().getDate() - 1),
  },
  {
    label: "This week",
    startDate: getMonday(),
    endDate: new Date(),
  },
  {
    label: "Last 7 days",
    startDate: new Date().setDate(new Date().getDate() - 7),
    endDate: new Date(),
  },
  {
    label: "This month",
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    endDate: new Date(),
  },
  {
    label: "Last month",
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
  },
];
