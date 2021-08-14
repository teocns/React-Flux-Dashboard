import { EventEmitter } from "events";
import dispatcher from "../dispatcher";
import ActionTypes from "../constants/ActionTypes";

class UIStore extends EventEmitter {
  #default_rows_per_page;

  constructor(params) {
    super(params);
    this.#default_rows_per_page = 25;
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

  getDefaultTableRowsPerPage() {
    if (
      !this.#default_rows_per_page ||
      ![10, 25, 50, 100].includes(this.#default_rows_per_page)
    ) {
      this.#default_rows_per_page =
        parseInt(window.localStorage.getItem("default_rows_per_page")) || 25;
    }
    return this.#default_rows_per_page;
  }
  setDefaultTableRowsPerPage(rows_per_page) {
    if (![10, 25, 50, 100].includes(rows_per_page)) {
      return;
    }

    window.localStorage.setItem("default_rows_per_page", rows_per_page);
    this.#default_rows_per_page = rows_per_page;
  }
}

const uiStore = new UIStore();

dispatcher.register((action) => {
  let willEmitOwnChange = true;
  switch (action.actionType) {
    case ActionTypes.UI.SHOW_SNACKBAR:
      break;
    case ActionTypes.Table.ROWS_PER_PAGE_CHANGED:
      uiStore.setDefaultTableRowsPerPage(action.data);
      break;
    default:
      willEmitOwnChange = false;
      break;
  }

  willEmitOwnChange && uiStore.emitChange(action.actionType, action.data);
});

export default uiStore;
