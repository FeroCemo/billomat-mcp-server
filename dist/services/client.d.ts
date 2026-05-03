export interface BillomatConfig {
    billomatId: string;
    apiKey: string;
}
export declare class BillomatClient {
    private http;
    constructor(config: BillomatConfig);
    get<T>(path: string, params?: Record<string, unknown>): Promise<T>;
    post<T>(path: string, data: unknown): Promise<T>;
    put<T>(path: string, data: unknown): Promise<T>;
    delete(path: string): Promise<void>;
}
//# sourceMappingURL=client.d.ts.map