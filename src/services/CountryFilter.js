import countryFilterStore from "../store/CountryFilter";
import countryFilterActions from "../actions/CountryFilter";

import sessionStore from "../store/session";
import ActionTypes from "../constants/ActionTypes";

const run = () => {
  if (countryFilterStore.requiresSync()) {
    countryFilterActions.sync();
  }
};

export default function CountryFilterService() {
  if (!sessionStore.isAuthenticated()) {
    const _onAuthenticated = () => {
      sessionStore.removeChangeListener(
        ActionTypes.Session.USER_AUTHENTICATED,
        _onAuthenticated
      );
      run();
    };
    sessionStore.addChangeListener(
      ActionTypes.Session.USER_AUTHENTICATED,
      _onAuthenticated
    );
  } else {
    run();
  }
}
