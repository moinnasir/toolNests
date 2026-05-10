'use client';

export default function ToolErrorBanner({ message }: { message: string }) {
  if (!message) return null;
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800" role="alert">
      {message}
    </div>
  );
}
