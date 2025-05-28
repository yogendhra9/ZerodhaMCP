# Zerodha Trading Bot

A Node.js-based trading bot that integrates with the Zerodha trading platform using the Model Context Protocol (MCP) for automated trading operations.

## Features

- Automated stock trading through Zerodha platform
- Session management and token handling
- Portfolio management
- Buy and Sell operations
- Real-time portfolio tracking

## Prerequisites

- Node.js (v14 or higher)
- Zerodha Trading Account
- API Key and Secret from Zerodha

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd trading-journal
```

2. Install dependencies:
```bash
npm install
```

3. Configure your Zerodha credentials:
   - Open `backend/index.js`
   - Replace `apiKey` and `apiSecret` with your Zerodha credentials

## Project Structure

```
├── backend/
│   ├── index.js          # Main server file with MCP tools
│   ├── trading.js        # Zerodha trading implementation
│   └── tokenManager.js   # Token management system
```

## Available Tools

The bot provides the following MCP tools:

1. **Generate-Session**
   - Generates a new session token using request token
   - Required parameter: `requestToken`

2. **Buy-Stock**
   - Places a buy order for specified stock
   - Parameters:
     - `stock`: Stock symbol
     - `qty`: Quantity to buy

3. **Sell-Stock**
   - Places a sell order for specified stock
   - Parameters:
     - `stock`: Stock symbol
     - `qty`: Quantity to sell

4. **Show-Portfolio**
   - Displays current portfolio holdings
   - No parameters required

## Usage

1. Start the server:
```bash
node backend/index.js
```

2. The server will start and listen for MCP commands through stdio transport.

## Security Notes

- Never commit your API credentials to version control
- Keep your `apiSecret` secure and private
- Use environment variables for sensitive data in production

## Error Handling

The bot includes comprehensive error handling for:
- Authentication failures
- Trading operation errors
- Network issues
- Invalid parameters

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Disclaimer

This trading bot is for educational purposes only. Use at your own risk. Always test thoroughly before using with real money.
