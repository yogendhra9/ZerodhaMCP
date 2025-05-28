const ZerodhaTrading = require("./trading");
const TokenManager = require("./tokenManager");
const {
  McpServer,
  ResourceTemplate,
} = require("@modelcontextprotocol/sdk/server/mcp.js");
const {
  StdioServerTransport,
} = require("@modelcontextprotocol/sdk/server/stdio.js");
const { z } = require("zod");

const apiKey = "exk3y8egxjnov6dh";
const apiSecret = "YOUR_API_SECRET"; // Replace with your actual API secret
const tokenManager = new TokenManager(apiKey, apiSecret);

async function initializeTrading() {
  try {
    const accessToken = await tokenManager.getValidToken();
    return new ZerodhaTrading(apiKey, accessToken);
  } catch (error) {
    console.error("Error initializing trading:", error.message);
    throw error;
  }
}

const server = new McpServer({
  name: "TradeBot",
  version: "1.0.0",
});

// MCP Tools
server.tool("addition", { a: z.number(), b: z.number() }, async ({ a, b }) => ({
  content: [{ type: "text", text: `${a + b}` }],
}));

server.tool(
  "factorial",
  "This tool calculates the factorial of a number",
  { a: z.number() },
  async ({ a }) => {
    let ans = 1;
    for (let i = 2; i <= a; i++) ans *= i;
    return {
      content: [{ type: "text", text: `${ans}` }],
    };
  }
);

// Add a new tool for generating session
server.tool(
  "Generate-Session",
  "Generate a new session token using request token",
  { requestToken: z.string() },
  async ({ requestToken }) => {
    try {
      const response = await tokenManager.generateSession(requestToken);
      return {
        content: [{ type: "text", text: "Session generated successfully" }],
      };
    } catch (error) {
      return { content: [{ type: "text", text: `Error: ${error.message}` }] };
    }
  }
);

// Modify existing tools to use dynamic trading instance
server.tool(
  "Buy-Stock",
  "This tool buys a stock in the zerodha trading platform for the given quantity and stock name at the current market price for the given user",
  { stock: z.string(), qty: z.number() },
  async ({ stock, qty }) => {
    try {
      const trading = await initializeTrading();
      const response = await trading.placeOrder(stock, qty, "BUY");
      return { content: [{ type: "text", text: String(response) }] };
    } catch (error) {
      return { content: [{ type: "text", text: `Error: ${error.message}` }] };
    }
  }
);

server.tool(
  "Sell-Stock",
  "This tool sells a stock in the zerodha trading platform for the given quantity and stock name at the current market price for the given user",
  { stock: z.string(), qty: z.number() },
  async ({ stock, qty }) => {
    try {
      const trading = await initializeTrading();
      const response = await trading.placeOrder(stock, qty, "SELL");
      return { content: [{ type: "text", text: String(response) }] };
    } catch (error) {
      return { content: [{ type: "text", text: `Error: ${error.message}` }] };
    }
  }
);

server.tool(
  "Show-Portfolio",
  "This tool shows the current portfolio of the given user",
  async () => {
    try {
      const trading = await initializeTrading();
      const response = await trading.getAllHoldings();
      return { content: [{ type: "text", text: String(response) }] };
    } catch (error) {
      return { content: [{ type: "text", text: `Error: ${error.message}` }] };
    }
  }
);

// server.resource(
//   "greeting",
//   new ResourceTemplate("greeting://{name}", { list: undefined }),
//   async (uri, { name }) => ({
//     contents: [{ uri: uri.href, text: `Hello, ${name}!` }],
//   })
// );

const transport = new StdioServerTransport();

async function startServer() {
  // console.log("🔌 Starting MCP server...");
  await server.connect(transport);
}

startServer();
