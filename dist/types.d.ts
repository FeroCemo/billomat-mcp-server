export interface BillomatClient {
    id: string;
    created: string;
    updated: string;
    client_number: string;
    number: number;
    name: string;
    email?: string;
    phone?: string;
    mobile?: string;
    fax?: string;
    address?: string;
    street?: string;
    zip?: string;
    city?: string;
    state?: string;
    country_code?: string;
    www?: string;
    tax_number?: string;
    vat_number?: string;
    bank_account_owner?: string;
    bank_number?: string;
    bank_account_number?: string;
    bank_swift?: string;
    bank_iban?: string;
    note?: string;
    revenue_net?: string;
    revenue_gross?: string;
}
export interface ClientsResponse {
    clients: {
        client: BillomatClient | BillomatClient[];
        "@total": string;
        "@page": string;
        "@per_page": string;
    };
}
export interface ClientResponse {
    client: BillomatClient;
}
export interface BillomatInvoice {
    id: string;
    created: string;
    updated: string;
    invoice_number: string;
    number: number;
    status: "DRAFT" | "OPEN" | "PAID" | "OVERDUE" | "CANCELLED";
    client_id: string;
    date: string;
    due_date?: string;
    address?: string;
    label?: string;
    intro?: string;
    note?: string;
    total_net?: string;
    total_gross?: string;
    total_taxes?: string;
    currency_code?: string;
    net_gross?: "NET" | "GROSS";
    discount_rate?: string;
    discount_date?: string;
    discount_amount?: string;
    paid_amount?: string;
    open_amount?: string;
    payment_type?: string;
}
export interface InvoicesResponse {
    invoices: {
        invoice: BillomatInvoice | BillomatInvoice[];
        "@total": string;
        "@page": string;
        "@per_page": string;
    };
}
export interface InvoiceResponse {
    invoice: BillomatInvoice;
}
export interface BillomatInvoiceItem {
    id: string;
    invoice_id: string;
    position: number;
    unit: string;
    quantity: string;
    unit_price: string;
    net_total: string;
    gross_total: string;
    tax_name?: string;
    tax_rate?: string;
    title: string;
    description?: string;
}
export interface InvoiceItemsResponse {
    "invoice-items": {
        "invoice-item": BillomatInvoiceItem | BillomatInvoiceItem[];
    };
}
export interface BillomatOffer {
    id: string;
    created: string;
    updated: string;
    offer_number: string;
    number: number;
    status: "DRAFT" | "OPEN" | "WON" | "LOST" | "CANCELLED";
    client_id: string;
    date: string;
    validity_date?: string;
    label?: string;
    intro?: string;
    note?: string;
    total_net?: string;
    total_gross?: string;
    currency_code?: string;
}
export interface OffersResponse {
    offers: {
        offer: BillomatOffer | BillomatOffer[];
        "@total": string;
        "@page": string;
        "@per_page": string;
    };
}
export interface OfferResponse {
    offer: BillomatOffer;
}
/** Normalise Billomat's single-item-or-array pattern */
export declare function toArray<T>(val: T | T[] | undefined): T[];
//# sourceMappingURL=types.d.ts.map