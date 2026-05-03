import { z } from "zod";
import { toArray } from "../types.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { BillomatClient } from "../services/client.js";

export function registerInvoiceTools(server: McpServer, api: BillomatClient): void {
    server.tool("list-invoices", "List all invoices from Billomat",
        {
            client_id: z.number().optional().describe("Filter by client ID"),
            status: z.enum(["draft", "open", "paid", "overdue", "cancelled"]).optional(),
            from: z.string().optional().describe("Start date YYYY-MM-DD"),
            to: z.string().optional().describe("End date YYYY-MM-DD"),
            per_page: z.number().optional(),
            page: z.number().optional(),
        },
        async (params) => {
            const p = Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined));
            const response = await api.get("/invoices", p as Record<string, unknown>);
            const invoices = toArray(response?.invoices?.invoice);
            return { content: [{ type: "text", text: JSON.stringify(invoices, null, 2) }] };
        }
    );

    server.tool("get-invoice", "Get a Billomat invoice by ID",
        { id: z.number().describe("The invoice ID") },
        async ({ id }) => {
            const response = await api.get(`/invoices/${id}`);
            return { content: [{ type: "text", text: JSON.stringify(response?.invoice, null, 2) }] };
        }
    );

    server.tool("create-invoice", "Create a new invoice in Billomat",
        {
            client_id: z.number().describe("Client ID"),
            date: z.string().optional().describe("Invoice date YYYY-MM-DD"),
            due_date: z.string().optional().describe("Due date YYYY-MM-DD"),
            label: z.string().optional().describe("Invoice title"),
            intro: z.string().optional(),
            note: z.string().optional(),
            discount_rate: z.number().optional().describe("Discount %"),
            currency_code: z.string().optional().describe("ISO currency code"),
        },
        async ({ client_id, ...rest }) => {
            const data = { client_id, ...Object.fromEntries(Object.entries(rest).filter(([, v]) => v !== undefined)) };
            const response = await api.post("/invoices", { invoice: data });
            return { content: [{ type: "text", text: JSON.stringify(response?.invoice, null, 2) }] };
        }
    );

    server.tool("update-invoice", "Update a Billomat invoice",
        {
            id: z.number().describe("Invoice ID"),
            client_id: z.number().optional(),
            date: z.string().optional(),
            due_date: z.string().optional(),
            label: z.string().optional(),
            note: z.string().optional(),
        },
        async ({ id, ...rest }) => {
            const updates = Object.fromEntries(Object.entries(rest).filter(([, v]) => v !== undefined));
            const response = await api.put(`/invoices/${id}`, { invoice: updates });
            return { content: [{ type: "text", text: JSON.stringify(response?.invoice, null, 2) }] };
        }
    );

    server.tool("complete-invoice", "Finalize / complete a draft invoice",
        {
            id: z.number().describe("The invoice ID to finalize"),
            template_id: z.number().optional().describe("Template ID for PDF"),
        },
        async ({ id, template_id }) => {
            const data = { complete: template_id ? { template_id } : {} };
            await api.put(`/invoices/${id}/complete`, data);
            return { content: [{ type: "text", text: `Invoice ${id} finalized.` }] };
        }
    );

    server.tool("send-invoice-email", "Send an invoice by email via Billomat",
        {
            id: z.number().describe("The invoice ID"),
            to: z.string().describe("Recipient email"),
            subject: z.string().optional(),
            body: z.string().optional(),
        },
        async ({ id, to, subject, body }) => {
            const data = { email: { to, ...(subject ? { subject } : {}), ...(body ? { body } : {}) } };
            await api.post(`/invoices/${id}/email`, data);
            return { content: [{ type: "text", text: `Invoice ${id} emailed to ${to}` }] };
        }
    );
}
