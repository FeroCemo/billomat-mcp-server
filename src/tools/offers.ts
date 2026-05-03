import { z } from "zod";
import { toArray } from "../types.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { BillomatClient } from "../services/client.js";

export function registerOfferTools(server: McpServer, api: BillomatClient): void {
    server.tool("list-offers", "List all offers/quotes from Billomat",
        {
            client_id: z.number().optional().describe("Filter by client ID"),
            status: z.enum(["draft", "open", "accepted", "rejected", "cancelled"]).optional(),
            from: z.string().optional().describe("Start date YYYY-MM-DD"),
            to: z.string().optional().describe("End date YYYY-MM-DD"),
            per_page: z.number().optional(),
            page: z.number().optional(),
        },
        async (params) => {
            const p = Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined));
            const response = await api.get("/offers", p as Record<string, unknown>);
            const offers = toArray(response?.offers?.offer);
            return { content: [{ type: "text", text: JSON.stringify(offers, null, 2) }] };
        }
    );

    server.tool("get-offer", "Get a Billomat offer by ID",
        { id: z.number().describe("The offer ID") },
        async ({ id }) => {
            const response = await api.get(`/offers/${id}`);
            return { content: [{ type: "text", text: JSON.stringify(response?.offer, null, 2) }] };
        }
    );

    server.tool("create-offer", "Create a new offer/quote in Billomat",
        {
            client_id: z.number().optional().describe("Client ID"),
            date: z.string().optional().describe("Offer date YYYY-MM-DD"),
            valid_days: z.number().optional().describe("Validity in days"),
            label: z.string().optional().describe("Offer title"),
            intro: z.string().optional(),
            note: z.string().optional(),
            currency_code: z.string().optional(),
        },
        async (params) => {
            const data = Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined));
            const response = await api.post("/offers", { offer: data });
            return { content: [{ type: "text", text: JSON.stringify(response?.offer, null, 2) }] };
        }
    );

    server.tool("update-offer", "Update a Billomat offer",
        {
            id: z.number().describe("Offer ID"),
            client_id: z.number().optional(),
            date: z.string().optional(),
            valid_days: z.number().optional(),
            label: z.string().optional(),
            note: z.string().optional(),
        },
        async ({ id, ...rest }) => {
            const updates = Object.fromEntries(Object.entries(rest).filter(([, v]) => v !== undefined));
            const response = await api.put(`/offers/${id}`, { offer: updates });
            return { content: [{ type: "text", text: JSON.stringify(response?.offer, null, 2) }] };
        }
    );
}
