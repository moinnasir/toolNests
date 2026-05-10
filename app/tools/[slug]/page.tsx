import { notFound } from 'next/navigation';
import BrowserToolRunner from '@/components/BrowserToolRunner';
import { tools } from '@/lib/tools';

type Params = {
  params: {
    slug: string;
  };
};

export function generateStaticParams() {
  return tools.map((tool) => ({ slug: tool.slug }));
}

export function generateMetadata({ params }: Params) {
  const tool = tools.find((item) => item.slug === params.slug);
  if (!tool) return {};
  return {
    title: `${tool.name} | ToolNest`,
    description: tool.description,
  };
}

export default function DynamicToolPage({ params }: Params) {
  const tool = tools.find((item) => item.slug === params.slug);
  if (!tool) notFound();

  return <BrowserToolRunner slug={tool.slug} title={tool.name} description={tool.description} category={tool.category} />;
}
