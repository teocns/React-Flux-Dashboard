import errors from "../constants/Errors";
/**
 * @typedef {string} ErrorCode
 */

class ApiError {
  errorCode;
  variables;

  /**
   *
   * @param {ErrorCode} errorCode Error code found in constants/Error
   * @param {Array} data Array containing error variables
   */
  constructor(errorCode, variables) {
    if (typeof errorCode === "object") {
      errorCode = errorCode.errorCode;
      variables = errorCode.variables;
    }
    this.errorCode = errorCode;
    this.variables = variables;
  }

  toString() {
    return errors[this.errorCode];
  }
  /**
   * @returns {boolean}
   */
  static isErrorCode(errorCode) {
    return errorCode in errors;
  }

  /**
   * @returns {boolean}
   */
  static isError(val) {
    return !!(val instanceof ApiError) || val.errorCode;
  }
}

export default ApiError;
