import { z } from "zod";
import { toArray } from "../types.js";

export function registerInvoiceTools(server, api) {
    server.tool(
        "list-invoices",
        "List all invoices from Billomat",
        {
            client_id: z.number().optional().describe("Filter by client ID"),
            status: z.enum(["draft", "open", "paid", "overdue", "cancelled"]).optional().describe("Filter by invoice status"),
            from: z.string().optional().describe("Start date filter YYYY-MM-DD"),
            to: z.string().optional().describe("End date filter YYYY-MM-DD"),
            per_page: z.number().optional().describe("Results per page (max 100)"),
            page: z.number().optional().describe("Page number"),
        },
        async (params) => {
            const p = Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined));
            const response = await api.get("/invoices", p);
            const invoices = toArray(response?.invoices?.invoice);
            return { content: [{ type: "text", text: JSON.stringify(invoices, null, 2) }] };
        }
    );

    server.tool(
        "get-invoice",
        "Get a specific Billomat invoice by ID",
        { id: z.number().describe("The invoice ID") },
        async ({ id }) => {
            const response = await api.get("/invoices/" + id);
            return { content: [{ type: "text", text: JSON.stringify(response?.invoice, null, 2) }] };
        }
    );

    server.tool(
        "create-invoice",
        "Create a new invoice in Billomat",
        {
            client_id: z.number().describe("ID of the client to invoice"),
            date: z.string().optional().describe("Invoice date YYYY-MM-DD (defaults to today)"),
            due_date: z.string().optional().describe("Due date YYYY-MM-DD"),
            label: z.string().optional().describe("Invoice title / label"),
            intro: z.string().optional().describe("Introductory text"),
            note: z.string().optional().describe("Closing note"),
            discount_rate: z.number().optional().describe("Discount percentage"),
            currency_code: z.string().optional().describe("ISO currency code, e.g. EUR"),
        },
        async ({ client_id, ...rest }) => {
            const data = { client_id, ...Object.fromEntries(Object.entries(rest).filter(([, v]) => v !== undefined)) };
            const response = await api.post("/invoices", { invoice: data });
            return { content: [{ type: "text", text: JSON.stringify(response?.invoice, null, 2) }] };
        }
    );

    server.tool(
        "update-invoice",
        "Update an existing Billomat invoice",
        {
            id: z.number().describe("The invoice ID to update"),
            client_id: z.number().optional().describe("Client ID"),
            date: z.string().optional().describe("Invoice date YYYY-MM-DD"),
            due_date: z.string().optional().describe("Due date YYYY-MM-DD"),
            label: z.string().optional().describe("Invoice title"),
            intro: z.string().optional().describe("Introductory text"),
            note: z.string().optional().describe("Closing note"),
        },
        async ({ id, ...rest }) => {
            const updates = Object.fromEntries(Object.entries(rest).filter(([, v]) => v !== undefined));
            const response = await api.put("/invoices/" + id, { invoice: updates });
            return { content: [{ type: "text", text: JSON.stringify(response?.invoice, null, 2) }] };
        }
    );

    server.tool(
        "complete-invoice",
        "Finalize / complete a draft invoice in Billomat",
        {
            id: z.number().describe("The invoice ID to finalize"),
            template_id: z.number().optional().describe("Template ID for PDF generation"),
        },
        async ({ id, template_id }) => {
            const data = template_id ? { complete: { template_id } } : { complete: {} };
            await api.put("/invoices/" + id + "/complete", data);
            return { content: [{ type: "text", text: "Invoice " + id + " has been finalized." }] };
        }
    );

    server.tool(
        "send-invoice-email",
        "Send an invoice by email via Billomat",
        {
            id: z.number().describe("The invoice ID to send"),
            to: z.string().describe("Recipient email address"),
            subject: z.string().optional().describe("Email subject"),
            body: z.string().optional().describe("Email body text"),
        },
        async ({ id, to, subject, body }) => {
            const data = { email: { to, ...(subject ? { subject } : {}), ...(body ? { body } : {}) } };
            await api.post("/invoices/" + id + "/email", data);
            return { content: [{ type: "text", text: "Invoice " + id + " sent to " + to }] };
        }
    );
}
