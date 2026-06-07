import { NextResponse } from 'next/server';
import Stripe from 'stripe';

type PlanId = 'standard' | 'elite';

const priceIds: Record<PlanId, string | undefined> = {
  standard: process.env.STRIPE_STANDARD_PRICE_ID,
  elite: process.env.STRIPE_ELITE_PRICE_ID,
};

export async function POST(req: Request) {
  try {
    const { planId } = (await req.json()) as { planId?: PlanId };

    if (!planId || !(planId in priceIds)) {
      return NextResponse.json({ error: 'Please choose a valid plan.' });
    }

    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    const priceId = priceIds[planId];

    if (!stripeSecretKey || !priceId) {
      return NextResponse.json({
        error: 'Stripe price IDs are not configured yet. Add STRIPE_STANDARD_PRICE_ID and STRIPE_ELITE_PRICE_ID to .env.local.',
      });
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2026-05-27.dahlia',
    });

    // Create a Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId, // This is the ID you pass from the frontend
          quantity: 1,
        },
      ],
      mode: 'subscription',
      // Where Stripe sends the user after a successful payment
      success_url: `${new URL(req.url).origin}/dashboard?payment=success`,
      // Where Stripe sends the user if they click "back"
      cancel_url: `${new URL(req.url).origin}/subscribe`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown Stripe error';
    return NextResponse.json({ error: `Error creating checkout session: ${errorMessage}` });
  }
}
