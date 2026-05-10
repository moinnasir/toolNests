import { notFound } from 'next/navigation';
import BrowserToolRunner from '@/components/BrowserToolRunner';
import { tools } from '@/lib/tools';

const browserToolSlugs = [
  'word-counter',
  'character-counter',
  'text-case-converter',
  'remove-extra-spaces',
  'duplicate-line-remover',
  'text-sorter',
  'slug-generator',
  'json-formatter',
  'base64-encoder-decoder',
  'url-encoder-decoder',
  'html-entity-encoder-decoder',
  'regex-tester',
  'jwt-decoder',
  'uuid-generator',
  'hash-generator',
  'meta-tag-generator',
  'open-graph-preview',
  'keyword-density-checker',
  'robots-txt-generator',
  'sitemap-xml-generator',
  'schema-markup-generator',
  'image-compressor',
  'image-resizer',
  'color-picker',
  'gradient-generator',
  'css-box-shadow-generator',
  'profit-margin-calculator',
  'gst-tax-calculator',
  'loan-emi-calculator',
  'paypal-stripe-fee-calculator',
  'discount-calculator',
  'password-generator',
  'age-calculator',
  'unit-converter',
  'timestamp-converter',
] as const;

type Params = {
  params: {
    slug: string;
  };
};

export function generateStaticParams() {
  return browserToolSlugs.map((slug) => ({ slug }));
}

export function generateMetadata({ params }: Params) {
  const tool = tools.find((item) => item.slug === params.slug);
  if (!tool || !browserToolSlugs.includes(params.slug as typeof browserToolSlugs[number])) return {};
  return {
    title: `${tool.name} | ToolNest`,
    description: tool.description,
  };
}

export default function DynamicToolPage({ params }: Params) {
  const tool = tools.find((item) => item.slug === params.slug);
  if (!tool || !browserToolSlugs.includes(params.slug as typeof browserToolSlugs[number])) notFound();

  return <BrowserToolRunner slug={tool.slug} title={tool.name} description={tool.description} />;
}
