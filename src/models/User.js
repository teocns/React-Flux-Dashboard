export default class User {
  /**
   * @type {Number}
   */
  userId;
  /**
   * @type {string}
   */
  username;

  /**
   * @type {string}
   */
  email;

  /**
   * @type {string}
   */
  name;

  /**
   * @type {string}
   */
  UUID;

  /**
   * @type {string}
   */
  authentication_token;

  /**
   * @type {boolean}
   */
  isAdmin;

  static isValid(userData) {
    return [
      typeof userData === "object",
      !!userData.id,
      !!userData.username,
    ].every((c) => c === true);
  }
  constructor(obj) {
    if (typeof obj === "object") {
      for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
          this[key] = obj[key];
        }
      }
    }
  }
}
