import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import express from "express";
import { BillomatClient } from "./services/client.js";
import { registerClientTools } from "./tools/clients.js";
import { registerInvoiceTools } from "./tools/invoices.js";
import { registerOfferTools } from "./tools/offers.js";

const BILLOMAT_API_KEY = process.env.BILLOMAT_API_KEY;
const BILLOMAT_SUBDOMAIN = process.env.BILLOMAT_SUBDOMAIN;

if (!BILLOMAT_API_KEY || !BILLOMAT_SUBDOMAIN) {
    console.error("Missing required environment variables: BILLOMAT_API_KEY and BILLOMAT_SUBDOMAIN");
    process.exit(1);
}

const api = new BillomatClient(BILLOMAT_SUBDOMAIN, BILLOMAT_API_KEY);

const useHttp = process.env.PORT || process.env.MCP_HTTP;

if (useHttp) {
    const port = parseInt(process.env.PORT || "3000", 10);
    const app = express();
    app.use(express.json());

    app.post("/mcp", async (req, res) => {
        const server = new McpServer({ name: "billomat-mcp-server", version: "1.0.0" });
        registerClientTools(server, api);
        registerInvoiceTools(server, api);
        registerOfferTools(server, api);

        const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
        res.on("close", () => transport.close());
        await server.connect(transport);
        await transport.handleRequest(req, res, req.body);
    });

    app.get("/health", (_req, res) => {
        res.json({ status: "ok", service: "billomat-mcp-server" });
    });

    app.listen(port, () => {
        console.log(`Billomat MCP Server running on port ${port}`);
    });
} else {
    const server = new McpServer({ name: "billomat-mcp-server", version: "1.0.0" });
    registerClientTools(server, api);
    registerInvoiceTools(server, api);
    registerOfferTools(server, api);

    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Billomat MCP Server running on stdio");
}
