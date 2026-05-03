import { z } from "zod";
import { toArray } from "../types.js";
export function registerOfferTools(server, api) {
    // ── LIST OFFERS ───────────────────────────────────────────────
    server.registerTool("billomat_list_offers", {
        title: "Angebote auflisten",
        description: `Listet Angebote auf, optional gefiltert.

Args:
  - client_id (string, optional): Nur Angebote dieses Kunden
  - status (string, optional): DRAFT | OPEN | WON | LOST | CANCELLED
  - page (number, optional): Seite (Standard: 1)
  - per_page (number, optional): Pro Seite 1–100 (Standard: 25)`,
        inputSchema: z.object({
            client_id: z.string().optional(),
            status: z.enum(["DRAFT", "OPEN", "WON", "LOST", "CANCELLED"]).optional(),
            page: z.number().int().min(1).default(1),
            per_page: z.number().int().min(1).max(100).default(25),
        }).strict(),
        annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    }, async ({ client_id, status, page, per_page }) => {
        const data = await api.get("/offers", { client_id, status, page, per_page });
        const offers = toArray(data.offers?.offer);
        const total = data.offers?.["@total"] ?? "0";
        if (!offers.length)
            return { content: [{ type: "text", text: "Keine Angebote gefunden." }] };
        const rows = offers.map(o => `[${o.id}] ${o.offer_number} | ${o.status} | Datum: ${o.date} | Brutto: ${o.total_gross ?? "–"} €`).join("\n");
        return { content: [{ type: "text", text: `Angebote (${offers.length} von ${total}):\n\n${rows}` }] };
    });
    // ── CREATE OFFER ──────────────────────────────────────────────
    server.registerTool("billomat_create_offer", {
        title: "Angebot erstellen",
        description: `Erstellt ein neues Angebot als Entwurf. Positionen møssen separat hinzugeføgdt werden.

Args:
  - client_id (string): Billomat-ID des Kunden (Pflichtfeld)
  - date (string): Angebotsdatum YYYY-MM-DD (Pflichtfeld)
  - validity_date (string, optional): Gøltig bis YYYY-MM-DD
  - label (string, optional): Betreff
  - intro (string, optional): Einleitungstext
  - note (string, optional): Schlusstext`,
        inputSchema: z.object({
            client_id: z.string().describe("Billomat-ID des Kunden"),
            date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).describe("Angebotsdatum YYYY-MM-DD"),
            validity_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().describe("Gøltig bis YYYY-MM-DD"),
            label: z.string().optional().describe("Betreff des Angebots"),
            intro: z.string().optional(),
            note: z.string().optional(),
            currency_code: z.string().length(3).default("EUR"),
        }).strict(),
        annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: false },
    }, async (params) => {
        const data = await api.post("/offers", { offer: params });
        const o = data.offer;
        return {
            content: [{
                    type: "text",
                    text: `✅ Angebot erstellt:\nID: ${o.id}\nNummer: ${o.offer_number}\nStatus: ${o.status}`
                }]
        };
    });
    // ── MARK OFFER WON ────────────────────────────────────────────
    server.registerTool("billomat_win_offer", {
        title: "Angebot als gewonnen markieren",
        description: `Markiert ein Angebot als gewonnen (WON). Ermøglicht danach die Umwandlung in eine Rechnung.

Args:
  - offer_id (string): ID des Angebots`,
        inputSchema: z.object({
            offer_id: z.string().describe("ID des Angebots"),
        }).strict(),
        annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    }, async ({ offer_id }) => {
        await api.put(`/offers/${offer_id}/win`, { win: {} });
        return { content: [{ type: "text", text: `🏆 Angebot ${offer_id} als gewonnen markiert.` }] };
    });
}
//# sourceMappingURL=offers.js.map