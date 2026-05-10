import AdminGate from '@/components/AdminGate';

export default function AdminUsersPage() {
  return (
    <AdminGate>
      <div className="space-y-4">
        <h1 className="section-title">Manage Users</h1>
        <div className="card text-white/75">Connect Firebase Admin user listing here when deploying with service account credentials.</div>
      </div>
    </AdminGate>
  );
}
