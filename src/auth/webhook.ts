import { Router } from 'express'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import crypto from 'crypto'

const router = Router()
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
const resend = new Resend(process.env.RESEND_API_KEY!)

// Raw body needed for Stripe signature verification
router.post('/webhook', async (req, res) => {
  const sig = req.headers['stripe-signature']!
  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return res.status(400).json({ error: 'Invalid signature' })
  }
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const email = session.customer_details?.email ?? session.customer_email
    const customerId = session.customer as string
    if (!email) return res.status(400).json({ error: 'No email in session' })
    // Generate prefixed key
    const apiKey = `billomcp_key_${crypto.randomUUID().replace(/-/g, '')}`
    // Store in Supabase
    const { error } = await supabase.from('api_keys').insert({
      key: apiKey,
      user_email: email,
      stripe_customer_id: customerId,
      active: true,
    })
    if (error) {
      console.error('Supabase insert error:', error)
      return res.status(500).json({ error: 'DB error' })
    }
    // Send key via email
    await resend.emails.send({
      from: 'BillomCP <noreply@yourdomain.com>', // TODO: set verified domain
      to: email,
      subject: 'Dein BillomCP API Key',
      html: `
        <h2>Willkommen bei BillomCP!</h2>
        <p>Dein API Key:</p>
        <pre style="background:#f4f4f4;padding:12px;border-radius:6px;font-size:16px;">${apiKey}</pre>
        <p>Nutze ihn als Header: <code>x-billomcp-key: ${apiKey}</code></p>
        <p>Basis-URL: <code>${process.env.RAILWAY_PUBLIC_DOMAIN ?? 'https://your-server.railway.app'}/mcp</code></p>
      `,
    })
  }
  res.json({ received: true })
})

export default router
