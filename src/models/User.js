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
   * Defaults to size 32
   * @type {string}
   */
  avatarUrl;
  /**
   * @type {string}
   */
  email;

  /**
   * @type {string}
   */
  authentication_token;

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
