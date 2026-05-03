import axios, { AxiosError } from "axios";
export class BillomatClient {
    http;
    constructor(config) {
        this.http = axios.create({
            baseURL: `https://${config.billomatId}.billomat.net/api`,
            headers: {
                "X-BillomatApiKey": config.apiKey,
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            timeout: 15000,
        });
    }
    async get(path, params) {
        try {
            const res = await this.http.get(path, { params });
            return res.data;
        }
        catch (err) {
            throw formatError(err);
        }
    }
    async post(path, data) {
        try {
            const res = await this.http.post(path, data);
            return res.data;
        }
        catch (err) {
            throw formatError(err);
        }
    }
    async put(path, data) {
        try {
            const res = await this.http.put(path, data);
            return res.data;
        }
        catch (err) {
            throw formatError(err);
        }
    }
    async delete(path) {
        try {
            await this.http.delete(path);
        }
        catch (err) {
            throw formatError(err);
        }
    }
}
function formatError(err) {
    if (err instanceof AxiosError) {
        const status = err.response?.status;
        const detail = err.response?.data?.message
            ?? err.message;
        if (status === 401)
            return new Error("Billomat: Ungültige API-Credentials. Prüfe BILLOMAT_ID und BILLOMAT_API_KEY.");
        if (status === 404)
            return new Error(`Billomat: Ressource nicht gefunden (404). ${detail}`);
        if (status === 429)
            return new Error("Billomat: Rate-Limit erreicht. Bitte kurz warten und erneut versuchen.");
        return new Error(`Billomat API Fehler (${status}): ${detail}`);
    }
    return err instanceof Error ? err : new Error(String(err));
}
//# sourceMappingURL=client.js.map