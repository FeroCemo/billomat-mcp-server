export interface BillomatClient {
    id: number;
    name: string;
    email?: string;
    phone?: string;
    address?: string;
    zip?: string;
    city?: string;
    country_code?: string;
    client_number?: string;
    tax_number?: string;
    vat_number?: string;
    created?: string;
    updated?: string;
}

export interface BillomatInvoice {
    id: number;
    client_id: number;
    date?: string;
    due_date?: string;
    status?: string;
    label?: string;
    intro?: string;
    note?: string;
    total_gross?: string;
    total_net?: string;
    currency_code?: string;
    invoice_number?: string;
    created?: string;
    updated?: string;
}

export interface BillomatOffer {
    id: number;
    client_id?: number;
    date?: string;
    valid_days?: number;
    status?: string;
    label?: string;
    intro?: string;
    note?: string;
    total_gross?: string;
    total_net?: string;
    currency_code?: string;
    offer_number?: string;
    created?: string;
    updated?: string;
}

export function toArray<T>(val: T | T[] | undefined | null): T[] {
    if (!val) return [];
    if (Array.isArray(val)) return val;
    return [val];
}
