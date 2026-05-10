import {
  AgeTool,
  PasswordTool,
  TimestampTool,
  UnitTool,
} from './productivity-tools';
import {
  CodecTool,
  HashTool,
  JsonTool,
  JwtTool,
  MinifierTool,
  RegexTool,
  SqlFormatterTool,
  UuidTool,
} from './dev-tools';
import { BusinessCalculator } from './business-tools';
import { DesignTool } from './design-tools';
import { ImageCanvasTool } from './media-tools';
import {
  KeywordTool,
  MetaTool,
  SeoGenerator,
  SeoScoreTool,
  XmlValidatorTool,
} from './seo-tools';
import {
  CounterTool,
  ImageToBase64Tool,
  LoremTool,
  MarkdownPreviewTool,
  SimilarityTool,
  TextCaseTool,
  TextToSpeechTool,
  TextTransformTool,
} from './text-tools';
import UniversalTool from './universal-tool';

export function renderTool(slug: string, title: string, category: string) {
  if (['word-counter', 'character-counter'].includes(slug)) return <CounterTool mode={slug} />;
  if (slug === 'text-case-converter') return <TextCaseTool />;
  if (['remove-extra-spaces', 'duplicate-line-remover', 'text-sorter', 'slug-generator'].includes(slug))
    return <TextTransformTool mode={slug} />;
  if (slug === 'json-formatter') return <JsonTool />;
  if (slug === 'html-css-js-minifier') return <MinifierTool />;
  if (slug === 'sql-formatter') return <SqlFormatterTool />;
  if (['base64-encoder-decoder', 'url-encoder-decoder', 'html-entity-encoder-decoder'].includes(slug)) return <CodecTool mode={slug} />;
  if (slug === 'regex-tester') return <RegexTool />;
  if (slug === 'jwt-decoder') return <JwtTool />;
  if (slug === 'uuid-generator') return <UuidTool />;
  if (slug === 'hash-generator') return <HashTool />;
  if (['meta-tag-generator', 'open-graph-preview'].includes(slug))
    return <MetaTool preview={slug === 'open-graph-preview'} slug={slug} />;
  if (slug === 'serp-preview-tool') return <MetaTool preview slug={slug} />;
  if (slug === 'seo-score-checker') return <SeoScoreTool />;
  if (slug === 'keyword-density-checker') return <KeywordTool />;
  if (slug === 'xml-sitemap-validator') return <XmlValidatorTool />;
  if (['robots-txt-generator', 'sitemap-xml-generator', 'schema-markup-generator'].includes(slug)) return <SeoGenerator mode={slug} />;
  if (['image-compressor', 'image-resizer'].includes(slug)) return <ImageCanvasTool mode={slug} />;
  if (slug === 'image-to-base64') return <ImageToBase64Tool />;
  if (
    [
      'color-picker',
      'gradient-generator',
      'css-box-shadow-generator',
      'color-palette-generator',
      'glassmorphism-generator',
      'neumorphism-generator',
      'svg-blob-generator',
      'css-animation-generator',
    ].includes(slug)
  )
    return <DesignTool mode={slug} />;
  if (
    [
      'profit-margin-calculator',
      'gst-tax-calculator',
      'loan-emi-calculator',
      'paypal-stripe-fee-calculator',
      'discount-calculator',
      'currency-converter',
      'subscription-calculator',
    ].includes(slug)
  )
    return <BusinessCalculator mode={slug} />;
  if (slug === 'password-generator') return <PasswordTool />;
  if (slug === 'age-calculator') return <AgeTool />;
  if (slug === 'unit-converter') return <UnitTool />;
  if (slug === 'timestamp-converter') return <TimestampTool />;
  if (slug === 'lorem-ipsum-generator') return <LoremTool />;
  if (slug === 'markdown-previewer') return <MarkdownPreviewTool />;
  if (slug === 'text-to-speech') return <TextToSpeechTool />;
  if (slug === 'plagiarism-checker') return <SimilarityTool />;
  return <UniversalTool slug={slug} title={title} category={category} />;
}
