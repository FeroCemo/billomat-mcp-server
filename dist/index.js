import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import express from "express";
import { BillomatClient } from "./services/client.js";
import { registerClientTools } from "./tools/clients.js";
import { registerInvoiceTools } from "./tools/invoices.js";
import { registerOfferTools } from "./tools/offers.js";
import { authMiddleware } from "./auth/middleware.js";
import webhookRouter from "./auth/webhook.js";
import checkoutRouter from "./auth/checkout.js";
const useHttp = process.env.PORT || process.env.MCP_HTTP;
if (useHttp) {
    const port = parseInt(process.env.PORT || "3000", 10);
    const app = express();
    // Raw body for Stripe signature verification — must be before express.json()
    app.use('/webhook', express.raw({ type: 'application/json' }));
    app.use(express.json());
    app.use(webhookRouter);
    app.use(checkoutRouter);
    app.post("/mcp", authMiddleware, async (req, res) => {
        const apiKey = req.headers["x-billomat-api-key"] ||
            process.env.BILLOMAT_API_KEY;
        const subdomain = req.headers["x-billomat-subdomain"] ||
            process.env.BILLOMAT_SUBDOMAIN;
        if (!apiKey || !subdomain) {
            res.status(401).json({
                error: "Missing Billomat credentials. Provide X-Billomat-Api-Key and X-Billomat-Subdomain request headers.",
            });
            return;
        }
        const api = new BillomatClient(subdomain, apiKey);
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
}
else {
    const apiKey = process.env.BILLOMAT_API_KEY;
    const subdomain = process.env.BILLOMAT_SUBDOMAIN;
    if (!apiKey || !subdomain) {
        console.error("Missing required environment variables: BILLOMAT_API_KEY and BILLOMAT_SUBDOMAIN");
        process.exit(1);
    }
    const api = new BillomatClient(subdomain, apiKey);
    const server = new McpServer({ name: "billomat-mcp-server", version: "1.0.0" });
    registerClientTools(server, api);
    registerInvoiceTools(server, api);
    registerOfferTools(server, api);
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Billomat MCP Server running on stdio");
}
//# sourceMappingURL=index.js.map