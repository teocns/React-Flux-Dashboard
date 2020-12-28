import userFilterStore from "../store/UserFilter";

import userFilterActions from "../actions/UserFilter";
import sessionStore from "../store/session";
import ActionTypes from "../constants/ActionTypes";

const run = () => {
  if (userFilterStore.requiresSync()) {
    userFilterActions.sync();
  }
};

export default function UserFilterService() {
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
