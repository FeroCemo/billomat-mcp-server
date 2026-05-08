import { Router } from 'express';
import Stripe from 'stripe';
import { z } from 'zod';
const router = Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const CheckoutBody = z.object({
    email: z.string().email(),
});
router.post('/create-checkout', async (req, res) => {
    const parsed = CheckoutBody.safeParse(req.body);
    if (!parsed.success)
        return res.status(400).json({ error: parsed.error.flatten() });
    const { email } = parsed.data;
    const session = await stripe.checkout.sessions.create({
        mode: 'subscription',
        customer_email: email,
        line_items: [{ price: process.env.STRIPE_PRICE_ID, quantity: 1 }],
        success_url: `${process.env.RAILWAY_PUBLIC_DOMAIN ?? 'https://your-server.railway.app'}/success`,
        cancel_url: `${process.env.RAILWAY_PUBLIC_DOMAIN ?? 'https://your-server.railway.app'}/cancel`,
    });
    res.json({ url: session.url });
});
export default router;
//# sourceMappingURL=checkout.js.map