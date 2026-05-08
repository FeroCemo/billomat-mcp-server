import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
export async function authMiddleware(req, res, next) {
    const key = req.headers['x-billomcp-key'];
    if (!key || typeof key !== 'string') {
        return res.status(401).json({ error: 'Missing x-billomcp-key header' });
    }
    const { data, error } = await supabase
        .from('api_keys')
        .select('active')
        .eq('key', key)
        .single();
    if (error || !data || !data.active) {
        return res.status(401).json({ error: 'Invalid or inactive API key' });
    }
    next();
}
//# sourceMappingURL=middleware.js.map