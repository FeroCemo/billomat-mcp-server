import axios, { AxiosError } from 'axios';
export class BillomatClient {
    baseUrl;
    apiKey;
    constructor(subdomain, apiKey) {
        this.baseUrl = `https://${subdomain}.billomat.net/api`;
        this.apiKey = apiKey;
    }
    async get(path, params) {
        try {
            const res = await axios.get(`${this.baseUrl}${path}`, {
                headers: {
                    'X-BillomatApiKey': this.apiKey,
                    'Accept': 'application/json',
                },
                params,
            });
            return res.data;
        }
        catch (err) {
            if (err instanceof AxiosError) {
                throw new Error(`Billomat API error ${err.response?.status}: ${JSON.stringify(err.response?.data)}`);
            }
            throw err;
        }
    }
    async post(path, data) {
        try {
            const res = await axios.post(`${this.baseUrl}${path}`, data, {
                headers: {
                    'X-BillomatApiKey': this.apiKey,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
            });
            return res.data;
        }
        catch (err) {
            if (err instanceof AxiosError) {
                throw new Error(`Billomat API error ${err.response?.status}: ${JSON.stringify(err.response?.data)}`);
            }
            throw err;
        }
    }
    async put(path, data) {
        try {
            const res = await axios.put(`${this.baseUrl}${path}`, data, {
                headers: {
                    'X-BillomatApiKey': this.apiKey,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
            });
            return res.data;
        }
        catch (err) {
            if (err instanceof AxiosError) {
                throw new Error(`Billomat API error ${err.response?.status}: ${JSON.stringify(err.response?.data)}`);
            }
            throw err;
        }
    }
    async delete(path) {
        try {
            const res = await axios.delete(`${this.baseUrl}${path}`, {
                headers: {
                    'X-BillomatApiKey': this.apiKey,
                    'Accept': 'application/json',
                },
            });
            return res.data;
        }
        catch (err) {
            if (err instanceof AxiosError) {
                throw new Error(`Billomat API error ${err.response?.status}: ${JSON.stringify(err.response?.data)}`);
            }
            throw err;
        }
    }
}
//# sourceMappingURL=client.js.map