import Link from 'next/link';

type LogoProps = {
  href?: string;
  compact?: boolean;
};

export default function Logo({ href = '/', compact = false }: LogoProps) {
  const mark = (
    <span className="inline-flex items-center gap-2">
      <svg width="36" height="36" viewBox="0 0 48 48" fill="none" aria-hidden="true" className="shrink-0">
        <rect width="48" height="48" rx="12" fill="#2563eb" />
        <path d="M13 27.5C16.6 20.8 21 17.4 26.2 17.4C31.1 17.4 34.4 20.2 36 25.8" stroke="white" strokeWidth="3.4" strokeLinecap="round" />
        <path d="M15 31.4C18.2 27.7 21.8 25.9 25.8 25.9C29.8 25.9 33.2 27.7 36 31.4" stroke="#bfdbfe" strokeWidth="3.4" strokeLinecap="round" />
        <path d="M23 12.5L28.5 18L23 23.5" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {!compact && (
        <span className="leading-none">
          <span className="block text-lg font-black tracking-normal text-slate-950">ToolNests</span>
          <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-blue-700">SaaS Toolkit</span>
        </span>
      )}
    </span>
  );

  return href ? <Link href={href} className="text-slate-950 hover:text-slate-950">{mark}</Link> : mark;
}

