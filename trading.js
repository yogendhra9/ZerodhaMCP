const { KiteConnect } = require("kiteconnect");

class ZerodhaTrading {
  constructor(apiKey, accessToken) {
    this.apiKey = apiKey;
    this.accessToken = accessToken;
    this.kc = new KiteConnect({ api_key: this.apiKey });
    this.kc.setAccessToken(this.accessToken);
  }

  getLoginURL() {
    return this.kc.getLoginURL();
  }

  async placeOrder(tradingsymbol, quantity, type) {
    if (!tradingsymbol || !quantity || !type) {
      throw new Error(
        "Please provide all required parameters: tradingsymbol, quantity, and type"
      );
    }

    try {
      const response = await this.kc.placeOrder("regular", {
        exchange: "NSE",
        tradingsymbol: tradingsymbol,
        transaction_type: type,
        quantity: quantity,
        product: "CNC",
        order_type: "MARKET",
      });
      return response;
    } catch (err) {
      if (err.error_type === "InputException") {
        throw new Error(
          `Invalid trading symbol or order parameters: ${err.message}`
        );
      }
      throw err;
    }
  }

  async getProfile() {
    try {
      return await this.kc.getProfile();
    } catch (err) {
      throw new Error(`Error getting profile: ${err.message}`);
    }
  }

  async generateSession(requestToken, apiSecret) {
    try {
      const response = await this.kc.generateSession(requestToken, apiSecret);
      this.accessToken = response.access_token;
      this.kc.setAccessToken(this.accessToken);
      return response;
    } catch (err) {
      throw new Error(`Error generating session: ${err.message}`);
    }
  }
  async getAllHoldings()
  {
    try{
        const holdings =  await this.kc.getPositions();
        let allHoldings = " ";
        for(const holdings of holdings)
        
            {
                allHoldings += `stock:{holding.tradingsymbol} qty:{holding.quantity} avg_price:{holding.average_price} current_price:{holding.last_price}`
                allHoldings += `\n`
            }
            return allHoldings;
    }
    catch(err)
    {
        throw new Error(`Error getting all holdings: ${err.message}`);
    }
  }
}

module.exports = ZerodhaTrading;
