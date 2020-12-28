import UserFilterService from "./UserFilter";
import CountryFilterService from "./CountryFilter";
const ServicesBundle = () => {
  [UserFilterService, CountryFilterService].map((func) => func());
};

export default ServicesBundle;
