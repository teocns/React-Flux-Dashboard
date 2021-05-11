import moment from "moment";

export const prettyTimelapse = (date) => {
  if (!moment.isMoment(date)) {
    date = moment.unix(date); // ok for js date, milliseconds or string in ISO format
  }
  if (date.isSame(moment(), "day")) {
    return date.format("hh:mm a");
  } else if (date.isSame(moment().subtract(1, "d"), "day")) {
    return "Yesterday";
  } else if (date.isSame(moment(), "week")) {
    return date.format("dddd");
  } else {
    return date.format("DD/MM/YYYY");
  }
};

/**
 * @typedef {Object} TimeRemaining
 * @property {number} total
 * @property {number} days
 * @property {number} hours
 * @property {number} minutes
 * @property {number} seconds
 */

/**
 * @param {number} endtime
 * @returns {TimeRemaining}
 */
export function getTimeRemaining(endtime, asString = false) {
  const total = endtime - parseInt(Date.now() / 1000);
  const seconds = Math.floor(total % 60);
  const minutes = Math.floor((total / 60) % 60);
  const hours = Math.floor((total / (60 * 60)) % 24);
  const days = Math.floor(total / (60 * 60 * 24));

  if (asString) {
    const _days = days ? `${days}d ` : "";
    const _hours = hours ? `${hours}h ` : "";
    let _minutes = minutes ? `${minutes}m ` : "";
    const _seconds = seconds ? `${seconds}s` : "";
    if (minutes === 0) {
      _minutes = "<1m";
    }
    return `${_days}${_hours}${_minutes}`;
  }

  return {
    total,
    days,
    hours,
    minutes,
    seconds,
  };
}

export function timeSince(date) {
  return moment((date - 10) * 1000).fromNow();
}

export function getMonthName(idx) {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return monthNames[idx];
}

export function prettyPrintDate(timestamp) {
  return moment(timestamp * 1000).format("YYYY-MM-DD HH:ss");
}
