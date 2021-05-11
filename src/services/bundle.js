import UserFilterService from "./UserFilter";

import BlacklistService from "./Blacklist";

const ServicesBundle = () => {
  [UserFilterService, BlacklistService].map((func) => func());
};

export default ServicesBundle;
