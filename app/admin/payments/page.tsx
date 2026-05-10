import AdminGate from '@/components/AdminGate';

export default function AdminPaymentsPage() {
  return (
    <AdminGate>
      <div className="space-y-4">
        <h1 className="section-title">Payments</h1>
        <div className="card text-white/75">Stripe checkout and EasyPaisa initiation are available from Pricing. Add webhooks before full production subscription automation.</div>
      </div>
    </AdminGate>
  );
}
