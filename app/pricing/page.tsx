'use client';

const tiers = [
  { name: 'Free', price: '$0', features: ['Image Converter', 'WhatsApp Link', 'CV Maker', 'OCR'], priceId: '' },
  { name: 'Pro', price: '$5/mo', features: ['Invoice Maker', 'Expiring Links', 'Send Later'], priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO || '' },
  { name: 'Premium', price: '$12/mo', features: ['File Locker', 'Voice to Text', 'Video Converter', 'Priority Support'], priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_PREMIUM || '' },
];

export default function PricingPage() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="section-title">Pricing</h1>
        <p className="mt-2 text-white/70">Start free, then upgrade through Stripe or EasyPaisa when your payment credentials are configured.</p>
      </header>
      <div className="grid gap-6 md:grid-cols-3">
        {tiers.map((tier) => (
          <div key={tier.name} className="card space-y-4">
            <div>
              <h2 className="text-xl font-semibold">{tier.name}</h2>
              <div className="mt-2 text-3xl font-bold">{tier.price}</div>
            </div>
            <ul className="ml-5 list-disc text-white/80">
              {tier.features.map((feature) => <li key={feature}>{feature}</li>)}
            </ul>
            {tier.name === 'Free' ? (
              <a href="/register" className="btn">Get Started</a>
            ) : (
              <div className="space-y-2">
                <form method="POST" action="/api/stripe/checkout">
                  <input type="hidden" name="priceId" value={tier.priceId} />
                  <button className="btn w-full" type="submit">Pay with Stripe</button>
                </form>
                <form method="POST" action="/api/easypaisa/checkout">
                  <input type="hidden" name="plan" value={tier.name} />
                  <input type="hidden" name="amount" value={tier.name === 'Pro' ? '5' : '12'} />
                  <button className="btn-secondary w-full" type="submit">Pay with EasyPaisa</button>
                </form>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
