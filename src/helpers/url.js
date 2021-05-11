import { hasSlashAfterDot } from "./strings";

export const parseHostname = (url) => {
  if (!url) {
    return null;
  }
  try {
    const host_parts = new URL(url).hostname.split(".");
    const host = [
      host_parts[host_parts.length - 2],
      host_parts[host_parts.length - 1],
    ].join(".");
    return host;
  } catch (e) {
    return null;
  }
};

export const isDomain = (raw_input) => {
  try {
    let input = raw_input;
    if (!input.startsWith("http://") && !input.startsWith("https://")) {
      input = "http://" + input;
    }
    const url = new URL(input);
    if (url.pathname === "/" && url.hostname.split(".").length >= 2) {
      let matches = raw_input.match(
        /^(([a-zA-Z]{1})|([a-zA-Z]{1}[a-zA-Z]{1})|([a-zA-Z]{1}[0-9]{1})|([0-9]{1}[a-zA-Z]{1})|([a-zA-Z0-9][-_\.a-zA-Z0-9]{1,61}[a-zA-Z0-9]))\.([a-zA-Z]{2,13}|[a-zA-Z0-9-]{2,30}\.[a-zA-Z]{2,3})$/
      );
      return matches[0] === raw_input;
    }
    return false;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const isHostname = (raw_input) => {
  try {
    let input = raw_input;
    if (!input.startsWith("http://") && !input.startsWith("https://")) {
      input = "http://" + input;
    }
    const url = new URL(input);

    if (url.pathname === "/" && url.hostname.split(".").length === 2) {
      let matches = raw_input.match(
        /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/
      );
      return matches[0] === raw_input;
    }
    return false;
  } catch (e) {
    console.log(e);
    return false;
  }
};

/**
 *
 * @param {string} str
 * @returns {bool}
 */
export const isUrl = (str) => {
  try {
    return Boolean(new URL(str)); // Asserts on this line
  } catch (e) {
    return false;
  }
};
export const parseDomain = (url) => {
  if (!url) {
    return null;
  }
  return new URL(url).hostname;
};
export default { parseHostname, isDomain, isHostname, isUrl, parseDomain };
