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

export const isDomain = (input) => {
  try {
    if (!input.startsWith("http://") && !!input.startsWith("https://")) {
      input = "http://" + input;
    }
    const url = new URL(input);
    if (url.pathname === "/" && url.hostname.split(".").length === 3) {
      return true;
    }
    return false;
  } catch (e) {
    return false;
  }
};

export const isHostname = (input) => {
  try {
    if (!input.startsWith("http://") && !!input.startsWith("https://")) {
      input = "http://" + input;
    }
    const url = new URL(input);

    if (url.pathname === "/" && url.hostname.split(".").length === 2) {
      return true;
    }
    return false;
  } catch (e) {
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

export default { parseHostname, isDomain, isHostname, isUrl };
