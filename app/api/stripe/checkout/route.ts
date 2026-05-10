import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(req: NextRequest) {
  const body = await req.formData();
  const priceId = String(body.get('priceId') || '');
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!priceId) return NextResponse.json({ error: 'Missing priceId' }, { status: 400 });
  if (!secret) return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 });

  const stripe = new Stripe(secret, { apiVersion: '2023-10-16' });
  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${req.nextUrl.origin}/subscription?success=1`,
      cancel_url: `${req.nextUrl.origin}/pricing?canceled=1`,
    });
    return NextResponse.redirect(session.url!, 303);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
