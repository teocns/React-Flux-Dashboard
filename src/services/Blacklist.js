import blacklistStore from "../store/Blacklist";
import blacklistActions from "../actions/Blacklist";
import userStore from "../store/session";

import userFilterActions from "../actions/UserFilter";

import ActionTypes from "../constants/ActionTypes";
import sessionStore from "../store/session";

const run = () => {
  if (blacklistStore.requiresSync()) {
    if (sessionStore.isAdmin()) {
      blacklistActions.sync();
    }
  }
};

export default function BlacklistService() {
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
