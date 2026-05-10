export type ToolPlan = 'Free' | 'Pro' | 'Premium';

export type Tool = {
  slug: string;
  name: string;
  description: string;
  category: string;
  plan: ToolPlan;
  featured?: boolean;
  popular?: boolean;
  keywords?: string[];
};

export const tools: Tool[] = [
  {
    slug: 'image-converter',
    name: 'Image Converter',
    description: 'Convert PNG, JPG, and WebP files in your browser.',
    category: 'Media',
    plan: 'Free',
    featured: true,
    popular: true,
    keywords: ['image', 'png', 'jpg', 'webp', 'converter'],
  },
  {
    slug: 'whatsapp-link',
    name: 'WhatsApp Link Generator',
    description: 'Build clean WhatsApp chat links with pre-filled messages.',
    category: 'Growth',
    plan: 'Free',
    featured: true,
    popular: true,
    keywords: ['whatsapp', 'marketing', 'link', 'message'],
  },
  {
    slug: 'invoice-maker',
    name: 'Invoice Maker',
    description: 'Create itemized invoices and export them as PDFs.',
    category: 'Business',
    plan: 'Pro',
    featured: true,
    popular: true,
    keywords: ['invoice', 'pdf', 'billing', 'business'],
  },
  {
    slug: 'expiring-link',
    name: 'Expiring Link Generator',
    description: 'Upload files and share links that expire automatically.',
    category: 'Files',
    plan: 'Pro',
    keywords: ['file', 'share', 'expiring', 'download'],
  },
  {
    slug: 'file-locker',
    name: 'File Locker',
    description: 'Protect uploads with passphrases and signed downloads.',
    category: 'Files',
    plan: 'Premium',
    featured: true,
    keywords: ['locker', 'secure', 'password', 'storage'],
  },
  {
    slug: 'voice-to-text',
    name: 'Voice to Text',
    description: 'Transcribe audio or video files with AssemblyAI.',
    category: 'AI',
    plan: 'Premium',
    keywords: ['audio', 'transcription', 'voice', 'ai'],
  },
  {
    slug: 'image-to-text',
    name: 'Image to Text',
    description: 'Extract text from images with OCR.',
    category: 'AI',
    plan: 'Free',
    popular: true,
    keywords: ['ocr', 'text', 'image', 'ai'],
  },
  {
    slug: 'stamp-signature',
    name: 'Stamp and Signature',
    description: 'Draw signatures and generate stamp PNGs.',
    category: 'Documents',
    plan: 'Free',
    keywords: ['signature', 'stamp', 'png', 'documents'],
  },
  {
    slug: 'send-later',
    name: 'Send Later',
    description: 'Schedule emails for later delivery.',
    category: 'Productivity',
    plan: 'Pro',
    keywords: ['email', 'schedule', 'send later'],
  },
  {
    slug: 'cv-maker',
    name: 'CV Maker',
    description: 'Create a polished resume and download it as PDF.',
    category: 'Documents',
    plan: 'Free',
    featured: true,
    popular: true,
    keywords: ['resume', 'cv', 'pdf', 'career'],
  },
  {
    slug: 'video-converter',
    name: 'Video Converter',
    description: 'Convert videos to MP4 or WebM in the browser.',
    category: 'Media',
    plan: 'Premium',
    featured: true,
    keywords: ['video', 'mp4', 'webm', 'converter'],
  },
  {
    slug: 'qr-generator',
    name: 'QR Code Generator',
    description: 'Create QR codes for links, WhatsApp messages, and text.',
    category: 'Growth',
    plan: 'Free',
    featured: true,
    popular: true,
    keywords: ['qr', 'code', 'url', 'whatsapp'],
  },
  {
    slug: 'pdf-tools',
    name: 'PDF Tools',
    description: 'Convert images to PDF and prepare PDF workflows.',
    category: 'Documents',
    plan: 'Free',
    keywords: ['pdf', 'image', 'merge', 'compress'],
  },
  {
    slug: 'calculators',
    name: 'Calculators',
    description: 'Quick percentage, currency-style, and freelance calculators.',
    category: 'Productivity',
    plan: 'Free',
    popular: true,
    keywords: ['calculator', 'percentage', 'currency', 'freelance'],
  },
];

export function toolHref(slug: string) {
  return `/tools/${slug}`;
}
