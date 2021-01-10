import SocketEvents from "../constants/SocketEvents";
import { sendMessage } from "../socket";
/**
 * @param {number[]} countryIds
 */
const setCountriesAsAlias = (countryIds, parentCountryId) => {
  sendMessage(SocketEvents.SET_COUNTRIES_AS_ALIAS, {
    countryIds,
    parentCountryId,
  });
};

const unmarkCountryAlias = (countryId) => {
  sendMessage(SocketEvents.UNMARK_COUNTRY_ALIAS, countryId);
};

const renameCountry = (countryId, countryName) => {
  sendMessage(SocketEvents.RENAME_COUNTRY, { countryId, name: countryName });
};
export default { unmarkCountryAlias, setCountriesAsAlias, renameCountry };
