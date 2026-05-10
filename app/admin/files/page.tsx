import AdminGate from '@/components/AdminGate';

export default function AdminFilesPage() {
  return (
    <AdminGate>
      <div className="space-y-4">
        <h1 className="section-title">File Logs</h1>
        <div className="card text-slate-600">Expiring link and file locker records are stored in Firestore collections named expiring_links and file_locker.</div>
      </div>
    </AdminGate>
  );
}

