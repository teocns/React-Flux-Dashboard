export const BLACKLIST_RULE_TYPES = {
  PORTAL: 1,
  DOMAIN: 2,
  URL: 3,
  REGEX: 4,
  WILDCARD_RULE: 5,
};

export const BLACKLIST_RULE_TYPES_NICE_NAMES = {
  [BLACKLIST_RULE_TYPES.PORTAL]: "Hostname",
  [BLACKLIST_RULE_TYPES.DOMAIN]: "Exact (sub)domain",
  [BLACKLIST_RULE_TYPES.URL]: "Full URL match",
  [BLACKLIST_RULE_TYPES.REGEX]: "Regular expression",
  [BLACKLIST_RULE_TYPES.WILDCARD_RULE]: "Wildcard domain match",
};
