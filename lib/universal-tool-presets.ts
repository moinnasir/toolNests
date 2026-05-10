/** Text templates and helpers for UniversalTool (browser-first; optional AI API elsewhere). */

export function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'toolnest';
}

export function buildUniversalOutput(slug: string, title: string, category: string, topic: string, details: string) {
  const subject = topic.trim() || title;
  if (slug.includes('keyword-research')) {
    return `Seed keyword: ${subject}\n\nPrimary keywords:\n- ${subject} tool\n- best ${subject}\n- free ${subject}\n\nLong-tail keywords:\n- how to use ${subject}\n- ${subject} for small business\n- ${subject} checklist\n\nIntent clusters:\n- Informational: guides, examples, FAQs\n- Commercial: pricing, comparison, templates\n- Transactional: generator, checker, converter`;
  }
  if (slug.includes('meta-title')) {
    return `Meta title options:\n1. ${subject} | Free Online Tool\n2. Best ${subject} Generator for Fast Results\n3. ${subject}: Create, Check, and Improve Online\n\nMeta description:\nUse this free ${subject} tool to create cleaner results, save time, and improve your workflow in minutes.`;
  }
  if (
    slug.includes('audit')
    || slug.includes('page-speed')
    || slug.includes('domain-authority')
    || slug.includes('backlink')
    || slug.includes('google-index')
    || slug.includes('broken-link')
  ) {
    return `${title} report for: ${subject}\n\nChecks:\n- Crawl important pages\n- Confirm indexable URLs\n- Review titles and meta descriptions\n- Check internal links and broken links\n- Review image size and performance\n- Track backlinks and referring domains\n\nNotes:\n${details || 'Add a URL or notes to customize this report.'}\n\nThird-party index metrics require external data — use this as a checklist, not live scores, unless you connect an API.`;
  }
  if (slug.includes('blog-outline')) {
    return `Blog outline: ${subject}\n\nH1: ${subject}\n\nH2: What it is\nH2: Why it matters\nH2: Step-by-step process\nH2: Common mistakes\nH2: Best tools and examples\nH2: FAQs\n\nCTA: Try ToolNest to speed up this workflow.`;
  }
  if (slug.includes('api-tester')) {
    return `fetch('${subject}', {\n  method: 'GET',\n  headers: {\n    'Accept': 'application/json'\n  }\n})\n  .then((response) => response.json())\n  .then(console.log)\n  .catch(console.error);`;
  }
  if (slug.includes('cron')) {
    return `Common cron expressions:\n\nEvery 5 minutes: */5 * * * *\nEvery hour: 0 * * * *\nEvery day at midnight: 0 0 * * *\nEvery Monday at 9:00: 0 9 * * 1\n\nFor ${subject}: choose the expression that matches your run frequency.`;
  }
  if (slug.includes('git-cheat')) {
    return `Git commands for ${subject}:\n\ngit status\ngit checkout -b feature/${slugify(subject)}\ngit add .\ngit commit -m \"${subject}\"\ngit push -u origin feature/${slugify(subject)}\n\ngit pull --rebase origin main`;
  }
  if (slug.includes('curl-converter')) {
    return `// Fetch version\nfetch('${subject.startsWith('http') ? subject : 'https://api.example.com'}', {\n  method: 'GET',\n  headers: { 'Content-Type': 'application/json' }\n});`;
  }
  if (slug.includes('env-file')) {
    return `NEXT_PUBLIC_APP_NAME="${subject}"\nNEXT_PUBLIC_BASE_URL="https://example.com"\nAPI_KEY="replace_me"\nDATABASE_URL="replace_me"`;
  }
  if (slug.includes('docker')) {
    return `docker run --name ${slugify(subject)} -p 3000:3000 ${slugify(subject)}:latest\n\n# Compose starter\nservices:\n  app:\n    image: ${slugify(subject)}:latest\n    ports:\n      - "3000:3000"`;
  }
  if (category === 'Design') {
    return `${title} concept for: ${subject}\n\nStyle direction:\n- Clean SaaS look\n- Strong contrast\n- Reusable layout blocks\n- Export-ready sizes\n\nPrompt:\nCreate a professional ${title.toLowerCase()} for ${subject}. Use modern composition, balanced whitespace, and clear brand hierarchy.\n\nDetails:\n${details || 'Add brand colors, audience, and format for better results.'}`;
  }
  if (category === 'Business') {
    return `${title}\n\nClient/project: ${subject}\n\nSummary:\n${details || 'Add scope, amount, dates, and payment terms.'}\n\nTemplate:\n- Scope of work\n- Deliverables\n- Timeline\n- Price / rate\n- Terms\n- Signature / approval`;
  }
  if (category === 'Content' || category === 'AI') {
    return `${title} draft for: ${subject}\n\nHook:\nA clear result-focused opening for ${subject}.\n\nDraft:\n${details || `Create concise, useful content about ${subject}. Focus on benefits, examples, and a strong call to action.`}\n\nVariants:\n- Professional\n- Friendly\n- Short social caption\n- SEO-focused version`;
  }
  if (slug.includes('url-shortener')) {
    return `Long URL: ${subject}\nSuggested slug: ${slugify(subject).slice(0, 32)}\nShort link preview: https://toolnests.app/go/${slugify(subject).slice(0, 16)}`;
  }
  if (slug.includes('meme')) {
    return `Top text: WHEN YOU NEED ${subject.toUpperCase()}\nBottom text: TOOLNEST ALREADY HAS IT\n\nCaption ideas:\n- Built for speed.\n- One more tool, one less tab.\n- Freelance workflow unlocked.`;
  }
  return `${title}\n\nInput: ${subject}\n\nResult:\n${details || 'Add details to generate a more specific result.'}`;
}

/** Slugs allowed to call POST /api/tools/ai-draft (server validates again). */
export const AI_DRAFT_SLUGS = new Set([
  'ai-article-writer',
  'ai-paraphrasing-tool',
  'ai-grammar-checker',
  'ai-email-writer',
  'ai-upwork-proposal-generator',
  'ai-fiverr-gig-generator',
  'ai-product-description-generator',
  'ai-hashtag-generator',
  'ai-resume-builder',
  'ai-cover-letter-generator',
  'ai-translation-tool',
  'ai-meta-title-description-generator',
  'ai-blog-outline-generator',
  'ai-code-explainer',
  'ai-logo-generator',
  'ai-icon-generator',
  'screenshot-to-code-ai',
  'ai-chatbot-assistant',
]);

export function isAiDraftSlug(slug: string) {
  return AI_DRAFT_SLUGS.has(slug);
}
