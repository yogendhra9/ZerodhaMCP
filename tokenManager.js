const fs = require("fs").promises;
const path = require("path");
const { KiteConnect } = require("kiteconnect");

class TokenManager {
  constructor(apiKey, apiSecret) {
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
    this.tokenFile = path.join(__dirname, "token.json");
    this.kc = new KiteConnect({ api_key: this.apiKey });
  }

  async saveToken(tokenData) {
    const data = {
      access_token: tokenData.access_token,
      timestamp: Date.now(),
    };
    await fs.writeFile(this.tokenFile, JSON.stringify(data));
  }

  async loadToken() {
    try {
      const data = await fs.readFile(this.tokenFile, "utf8");
      return JSON.parse(data);
    } catch (error) {
      return null;
    }
  }

  async getValidToken() {
    const tokenData = await this.loadToken();

    if (!tokenData) {
      throw new Error(
        "No token found. Please generate a new token using generateSession"
      );
    }

    // Check if token is older than 24 hours
    const tokenAge = Date.now() - tokenData.timestamp;
    if (tokenAge > 24 * 60 * 60 * 1000) {
      throw new Error(
        "Token expired. Please generate a new token using generateSession"
      );
    }

    return tokenData.access_token;
  }

  async generateSession(requestToken) {
    try {
      const response = await this.kc.generateSession(
        requestToken,
        this.apiSecret
      );
      await this.saveToken(response);
      return response;
    } catch (error) {
      throw new Error(`Error generating session: ${error.message}`);
    }
  }
}

module.exports = TokenManager;
