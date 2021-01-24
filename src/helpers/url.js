  const parseHostname = (url) => {
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

export default { parseHostname };
