import type { Tool } from '@/lib/tools';

type Props = {
  tool: Pick<Tool, 'slug' | 'name' | 'category'>;
  size?: 'sm' | 'md' | 'lg';
};

const categoryLines: Record<string, string> = {
  Media: 'M18 46h28M20 20l24 24M44 20L20 44',
  Growth: 'M20 42c12-18 20-18 32 0M20 42h32M36 18v38',
  Business: 'M20 26h32M24 20h24v32H24zM30 34h12M30 42h18',
  Files: 'M24 18h18l10 10v26H24zM42 18v12h10M30 38h16',
  AI: 'M22 38h28M28 24h16M32 18v40M20 32h36M20 44h36',
  Documents: 'M24 18h28v38H24zM30 28h16M30 36h12M30 44h18',
  Productivity: 'M20 38l10 10 22-28M20 22h32M20 30h24',
  Text: 'M20 22h32M36 22v32M26 54h20',
  Developer: 'M28 24L18 36l10 12M44 24l10 12-10 12M38 20l-12 36',
  SEO: 'M20 42c6-18 24-24 34-8M40 28l14 6-6 14M20 52h34',
  Design: 'M20 44l16-24 16 24M27 34h18M22 52h28',
};

export default function ToolIcon({ tool, size = 'md' }: Props) {
  const hash = hashSlug(tool.slug);
  const hue = hash % 360;
  const nextHue = (hue + 42) % 360;
  const initials = tool.name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
  const classes = size === 'lg' ? 'h-24 w-24' : size === 'sm' ? 'h-11 w-11' : 'h-14 w-14';
  const textSize = size === 'lg' ? 'text-lg' : 'text-xs';
  const path = categoryLines[tool.category] || 'M20 22h32v32H20zM28 30h16M28 38h16M28 46h10';

  return (
    <div
      className={`${classes} relative shrink-0 overflow-hidden rounded-lg shadow-sm`}
      style={{ background: `linear-gradient(135deg, hsl(${hue} 78% 45%), hsl(${nextHue} 78% 48%))` }}
      aria-hidden="true"
    >
      <svg className="absolute inset-0 h-full w-full opacity-90" viewBox="0 0 72 72" fill="none">
        <circle cx={54 - (hash % 18)} cy={18 + (hash % 14)} r="18" fill="white" opacity="0.14" />
        <circle cx={18 + (hash % 12)} cy={58 - (hash % 18)} r="20" fill="white" opacity="0.10" />
        <path d={path} stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" opacity="0.78" />
      </svg>
      <div className={`absolute bottom-1.5 right-1.5 rounded-md bg-white/20 px-1.5 py-0.5 font-black leading-none text-white ${textSize}`}>
        {initials}
      </div>
    </div>
  );
}

function hashSlug(value: string) {
  return value.split('').reduce((acc, char) => (acc * 31 + char.charCodeAt(0)) % 9973, 7);
}
