'use client';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
export default function SubscriptionPage(){
  const params = useSearchParams();
  const ok = params.get('success');
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Subscription</h1>
      {ok ? (
        <div className="card">
          <p className="mb-3">Payment success! Your subscription will be active shortly.</p>
          <Link className="btn" href="/dashboard">Go to Dashboard</Link>
        </div>
      ) : (
        <div className="card">
          <p>No recent subscription action. See <Link href="/pricing">Pricing</Link>.</p>
        </div>
      )}
    </div>
  )
}
