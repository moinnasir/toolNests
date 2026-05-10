'use client';

const tiers = [
  { name: 'Free', price: '$0', features: ['100+ SEO, developer, design, content, and business tools', 'Ads-supported access', 'Image Converter, QR, JSON, Password, Resume, Invoice basics', 'Tool embedding previews'], priceId: '' },
  { name: 'Pro', price: '$5/mo', features: ['Premium file sharing with expiry', 'No-ads workspace', 'Freelancer documents and business templates', 'API access starter plan', 'Affiliate-ready tool pages'], priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO || '' },
  { name: 'Premium', price: '$12/mo', features: ['AI credit system ready', 'Team workspace plan foundation', 'White-label SaaS positioning', 'Voice, video, locker, and AI-assisted tools', 'Priority support'], priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_PREMIUM || '' },
];

export default function PricingPage() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="section-title">Pricing</h1>
        <p className="mt-2 text-slate-600">Start free, then upgrade through Stripe or EasyPaisa when your payment credentials are configured.</p>
      </header>
      <div className="grid gap-6 md:grid-cols-3">
        {tiers.map((tier) => (
          <div key={tier.name} className="card space-y-4">
            <div>
              <h2 className="text-xl font-semibold">{tier.name}</h2>
              <div className="mt-2 text-3xl font-bold">{tier.price}</div>
            </div>
            <ul className="ml-5 list-disc text-slate-600">
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

