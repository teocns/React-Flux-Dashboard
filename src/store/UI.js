import { EventEmitter } from "events";
import dispatcher from "../dispatcher";
import ActionTypes from "../constants/ActionTypes";

class UIStore extends EventEmitter {
  constructor(params) {
    super(params);
    this.messages = [];
    this.sidebar = {
      isOpen: true,
      width: 320,
    };
    this.views = {
      current: "",
    };
    this.modals = {
      login: { isOpen: false },
      userProfile: {
        isOpen: false,
      },
    };
  }

  addChangeListener(event, callback) {
    this.on(event, callback);
  }

  removeChangeListener(event, callback) {
    this.removeListener(event, callback);
  }

  emitChange(event, data) {
    this.emit(event, data);
  }

  storeMessageReceived(message) {
    // Keep a maximum stack of 255 messages received. Why not?
    if (this.messages.length > 244) this.messages.shift();
    this.messages.push(message);
    this.lastMessageReceived = new Date().getTime();
  }
  storeMessageSent() {
    this.lastMessageSent = new Date().getTime();
  }

  getSidebar() {
    return this.sidebar;
  }
  sidebarIsOpen() {
    return this.sidebar.isOpen;
  }
  getSidebarWidth() {
    return this.sidebar.width;
  }
  toggleSidebar() {
    this.sidebar.isOpen = !this.sidebar.isOpen;
  }
  toggleLoginModal() {
    this.modals.login.isOpen = !this.modals.login.isOpen;
  }
  loginModalIsOpen() {
    return this.modals.login.isOpen;
  }
}

const uiStore = new UIStore();

dispatcher.register((action) => {
  let willEmitOwnChange = true;
  switch (action.actionType) {
    case ActionTypes.UI.SHOW_SNACKBAR:
      break;
    default:
      willEmitOwnChange = false;
      break;
  }

  willEmitOwnChange && uiStore.emitChange(action.actionType, action.data);
});

export default uiStore;
