export const BLACKLIST_RULE_TYPES = {
  PORTAL: 1,
  DOMAIN: 2,
  URL: 3,
  REGEX: 4,
};

export const BLACKLIST_RULE_TYPES_NICE_NAMES = {
  [BLACKLIST_RULE_TYPES.PORTAL]: "Portal",
  [BLACKLIST_RULE_TYPES.DOMAIN]: "Portal domain",
  [BLACKLIST_RULE_TYPES.URL]: "Full URL match",
  [BLACKLIST_RULE_TYPES.REGEX]: "Regular expression",
};
