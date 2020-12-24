// Data sent from client to server socket on initial handshake

/**
 * @typedef {SessionClientDataObject}
 * @property {string} authenticationToken
 * @property {string} language
 * @property {Array} languages
 * @property {string} userAgent
 */

class ClientData {
  /**
   * @type {string}
   */
  authenticationToken;

  userAgent;
  constructor(clientDataRaw) {
    clientDataRaw = typeof clientDataRaw === "object" ? clientDataRaw : {};
    const { userAgent } = clientDataRaw;

    this.userAgent = userAgent;
  }
  isValid() {
    return true;
  }
}

export default ClientData;
