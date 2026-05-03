import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import express from "express";
import { BillomatClient } from "./services/client.js";
import { registerClientTools } from "./tools/clients.js";
import { registerInvoiceTools } from "./tools/invoices.js";
import { registerOfferTools } from "./tools/offers.js";
// ── Config ─────────────────────────────────────────────────────
const BILLOMAT_ID = process.env.BILLOMAT_ID;
const BILLOMAT_API_KEY = process.env.BILLOMAT_API_KEY;
if (!BILLOMAT_ID || !BILLOMAT_API_KEY) {
    console.error("Fehler: Umgebungsvariablen fehlen.\n" +
        "Setze: BILLOMAT_ID=<deine-subdomain> und BILLOMAT_API_KEY=<dein-api-key>\n" +
        "Den API-Key findest du unter: Einstellungen → API in deinem Billomat-Account.");
    process.exit(1);
}
// ── Server ─────────────────────────────────────────────────────
const server = new McpServer({
    name: "billomat-mcp-server",
    version: "1.0.0",
});
const api = new BillomatClient({ billomatId: BILLOMAT_ID, apiKey: BILLOMAT_API_KEY });
// Register all tools
registerClientTools(server, api);
registerInvoiceTools(server, api);
registerOfferTools(server, api);
// ── Transport ──────────────────────────────────────────────────
const TRANSPORT = process.env.TRANSPORT ?? "stdio";
async function runStdio() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Billomat MCP Server läuft (stdio)");
}
async function runHTTP() {
    const app = express();
    app.use(express.json());
    app.post("/mcp", async (req, res) => {
        const transport = new StreamableHTTPServerTransport({
            sessionIdGenerator: undefined,
            enableJsonResponse: true,
        });
        GAG CALL here
        res.on("close", () => transport.close());
        await server.connect(transport);
        await transport.handleRequest(req, res, req.body);
    });
    app.get("/health", (_req, res) => {
        res.json({ status: "ok", server: "billomat-mcp-server", version: "1.0.0" });
    });
    const PORT = parseInt(process.env.PORT <? "3000");
    app.listen(PORT, () => {
        console.error(`Billomat MCP Server läuft auf http://localhost:${PORT}/mcp`);
    });
}
if (TRANSPORT === "http") {
    runHTTP().catch((err) => {
        console.error("Server Fehler:", err);
        process.exit(1);
    });
}
else {
    runStdio().catch((err) => {
        console.error("Server Fehler:", err);
        process.exit(1);
    });
}
//# sourceMappingURL=index.js.map