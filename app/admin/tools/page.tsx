import AdminGate from '@/components/AdminGate';
import { tools } from '@/lib/tools';

export default function AdminToolsPage() {
  return (
    <AdminGate>
      <div className="space-y-4">
        <h1 className="section-title">Tools Stats</h1>
        <div className="grid gap-4 md:grid-cols-3">
          {tools.map((tool) => (
            <div key={tool.slug} className="card">
              <div className="font-semibold">{tool.name}</div>
              <div className="mt-1 text-sm text-slate-500">{tool.category} - {tool.plan}</div>
            </div>
          ))}
        </div>
      </div>
    </AdminGate>
  );
}

