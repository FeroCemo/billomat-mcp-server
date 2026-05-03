import axios, { AxiosError } from 'axios';

export class BillomatClient {
    private baseUrl: string;
    private apiKey: string;

    constructor(subdomain: string, apiKey: string) {
        this.baseUrl = `https://${subdomain}.billomat.net/api`;
        this.apiKey = apiKey;
    }

    async get(path: string, params?: Record<string, unknown>) {
        try {
            const res = await axios.get(`${this.baseUrl}${path}`, {
                headers: {
                    'X-BillomatApiKey': this.apiKey,
                    'Accept': 'application/json',
                },
                params,
            });
            return res.data;
        } catch (err) {
            if (err instanceof AxiosError) {
                throw new Error(`Billomat API error ${err.response?.status}: ${JSON.stringify(err.response?.data)}`);
            }
            throw err;
        }
    }

    async post(path: string, data: unknown) {
        try {
            const res = await axios.post(`${this.baseUrl}${path}`, data, {
                headers: {
                    'X-BillomatApiKey': this.apiKey,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
            });
            return res.data;
        } catch (err) {
            if (err instanceof AxiosError) {
                throw new Error(`Billomat API error ${err.response?.status}: ${JSON.stringify(err.response?.data)}`);
            }
            throw err;
        }
    }

    async put(path: string, data: unknown) {
        try {
            const res = await axios.put(`${this.baseUrl}${path}`, data, {
                headers: {
                    'X-BillomatApiKey': this.apiKey,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
            });
            return res.data;
        } catch (err) {
            if (err instanceof AxiosError) {
                throw new Error(`Billomat API error ${err.response?.status}: ${JSON.stringify(err.response?.data)}`);
            }
            throw err;
        }
    }

    async delete(path: string) {
        try {
            const res = await axios.delete(`${this.baseUrl}${path}`, {
                headers: {
                    'X-BillomatApiKey': this.apiKey,
                    'Accept': 'application/json',
                },
            });
            return res.data;
        } catch (err) {
            if (err instanceof AxiosError) {
                throw new Error(`Billomat API error ${err.response?.status}: ${JSON.stringify(err.response?.data)}`);
            }
            throw err;
        }
    }
}
