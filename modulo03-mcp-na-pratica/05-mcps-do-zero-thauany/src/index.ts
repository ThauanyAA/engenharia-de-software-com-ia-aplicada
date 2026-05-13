import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { server } from "./mcp.ts";

async function main() {
   const transport = new StdioServerTransport();
   server.connect(transport);
   console.log("Encrypt MCP server is running and connected to standard I/O transport.");
}

main().catch((error) => {
    console.error("Fatal error in main():", error);
    process.exit(1);
});