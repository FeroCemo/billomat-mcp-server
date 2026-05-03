import { z } from "zod";
import { toArray } from "../types.js";

export function registerClientTools(server, api) {
    server.tool(
        "list-clients",
        "List all clients from Billomat",
        {
            name: z.string().optional().describe("Filter by client name"),
            email: z.string().optional().describe("Filter by email address"),
            client_number: z.string().optional().describe("Filter by client number"),
            country_code: z.string().optional().describe("Filter by ISO country code"),
            per_page: z.number().optional().describe("Results per page (max 100)"),
            page: z.number().optional().describe("Page number"),
        },
        async (params) => {
            const p = Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined));
            const response = await api.get("/clients", p);
            const clients = toArray(response?.clients?.client);
            return { content: [{ type: "text", text: JSON.stringify(clients, null, 2) }] };
        }
    );

    server.tool(
        "get-client",
        "Get a specific Billomat client by ID",
        { id: z.number().describe("The client ID") },
        async ({ id }) => {
            const response = await api.get("/clients/" + id);
            return { content: [{ type: "text", text: JSON.stringify(response?.client, null, 2) }] };
        }
    );

    server.tool(
        "create-client",
        "Create a new client in Billomat",
        {
            name: z.string().describe("Client company or person name"),
            email: z.string().optional().describe("Email address"),
            phone: z.string().optional().describe("Phone number"),
            address: z.string().optional().describe("Street address"),
            zip: z.string().optional().describe("ZIP / postal code"),
            city: z.string().optional().describe("City"),
            country_code: z.string().optional().describe("ISO country code, e.g. DE"),
            tax_number: z.string().optional().describe("Tax identification number"),
            vat_number: z.string().optional().describe("VAT number"),
        },
        async ({ name, ...rest }) => {
            const data = { name, ...Object.fromEntries(Object.entries(rest).filter(([, v]) => v !== undefined)) };
            const response = await api.post("/clients", { client: data });
            return { content: [{ type: "text", text: JSON.stringify(response?.client, null, 2) }] };
        }
    );

    server.tool(
        "update-client",
        "Update an existing Billomat client",
        {
            id: z.number().describe("The client ID to update"),
            name: z.string().optional().describe("Client name"),
            email: z.string().optional().describe("Email address"),
            phone: z.string().optional().describe("Phone number"),
            address: z.string().optional().describe("Street address"),
            zip: z.string().optional().describe("ZIP / postal code"),
            city: z.string().optional().describe("City"),
            country_code: z.string().optional().describe("Country code"),
            tax_number: z.string().optional().describe("Tax number"),
            vat_number: z.string().optional().describe("VAT number"),
        },
        async ({ id, ...rest }) => {
            const updates = Object.fromEntries(Object.entries(rest).filter(([, v]) => v !== undefined));
            const response = await api.put("/clients/" + id, { client: updates });
            return { content: [{ type: "text", text: JSON.stringify(response?.client, null, 2) }] };
        }
    );
}
