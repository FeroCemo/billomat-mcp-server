export declare class BillomatClient {
    private baseUrl;
    private apiKey;
    constructor(subdomain: string, apiKey: string);
    get(path: string, params?: Record<string, unknown>): Promise<any>;
    post(path: string, data: unknown): Promise<any>;
    put(path: string, data: unknown): Promise<any>;
    delete(path: string): Promise<any>;
}
//# sourceMappingURL=client.d.ts.map