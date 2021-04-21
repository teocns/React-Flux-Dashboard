const Errors = {
  ERR_UNKNOWN: "Uknown",
  ERR_INSUFFICIENT_BALANCE: "Insufficient balance",
  ERR_BETS_CLOSED: "Bets already closed",
  ERR_INVALID_CURRENCY: "Choose a currency to bet with.",
  ERR_ROUND_INEXISTENT: "Round does not exist",
  ERR_MESSAGE_TOO_SHORT: "Message too short",
  ERR_MESSAGE_TOO_LONG: "Message too long",
  ERR_INVALID_BET: "Error while placing your bet.",
  ERR_WAIT_BEFORE_SENDING_MESSAGE: "Please wait {0}s to text again.",
  ERR_UNAUTHENTICATED: "It seems you're not logged in...",
  ERR_INVALID_PICTURE: "Please try with another picture.",
  ERR_USER_NOT_FOUND: "Invalid credentials",
  ERR_CREDENTIALS_INVALID: "Invalid credentials",
  ERR_INVALID_URL: "The URL appears to be invalid",
  ERR_INSUFFICIENT_PERMISSIONS: "Insufficient privileges",
  ERR_CHECK_FIELDS: "All fields must be correctly filled",
  ERR_EMAIL_ALREADY_REGISTERED: "Email already registered",
  ERR_USERNAME_ALREADY_REGISTERED: "Username already registered",
  ERR_CANNOT_DELETE_YOURSELF: "Cannot delete yourself",
  ERR_COUNTRY_WITH_SAME_NAME_EXISTS:
    "A country with the same name already exists",
  ERR_URL_SCRAPED_RECENTLY:
    "The URL has already been scraped in the past 24 hours",
  ERR_HOST_BANNED: "Domain is banned by administrators",
  ERR_URL_ALREADY_TRACKED: "URL has already been tracked",
  ERR_RULE_TYPE_CURRENTLY_UNSUPPORTED:
    "Rule type is not supported at the moment",
  ERR_RULE_INVALID: "The rule is not valid",
  ERR_SAME_RULE_ALREADY_EXIST: "A rule with the same criteria already exists",
  ERR_BLACKLISTED_URL: "URL blacklisted by the administration",
};

export default Errors;
