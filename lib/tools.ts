export type ToolPlan = 'Free' | 'Pro' | 'Premium';

export type Tool = {
  slug: string;
  name: string;
  description: string;
  category: string;
  plan: ToolPlan;
};

export const tools: Tool[] = [
  {
    slug: 'image-converter',
    name: 'Image Converter',
    description: 'Convert PNG, JPG, and WebP files in your browser.',
    category: 'Media',
    plan: 'Free',
  },
  {
    slug: 'whatsapp-link',
    name: 'WhatsApp Link Generator',
    description: 'Build clean WhatsApp chat links with pre-filled messages.',
    category: 'Growth',
    plan: 'Free',
  },
  {
    slug: 'invoice-maker',
    name: 'Invoice Maker',
    description: 'Create itemized invoices and export them as PDFs.',
    category: 'Business',
    plan: 'Pro',
  },
  {
    slug: 'expiring-link',
    name: 'Expiring Link Generator',
    description: 'Upload files and share links that expire automatically.',
    category: 'Files',
    plan: 'Pro',
  },
  {
    slug: 'file-locker',
    name: 'File Locker',
    description: 'Protect uploads with passphrases and signed downloads.',
    category: 'Files',
    plan: 'Premium',
  },
  {
    slug: 'voice-to-text',
    name: 'Voice to Text',
    description: 'Transcribe audio or video files with AssemblyAI.',
    category: 'AI',
    plan: 'Premium',
  },
  {
    slug: 'image-to-text',
    name: 'Image to Text',
    description: 'Extract text from images with OCR.',
    category: 'AI',
    plan: 'Free',
  },
  {
    slug: 'stamp-signature',
    name: 'Stamp and Signature',
    description: 'Draw signatures and generate stamp PNGs.',
    category: 'Documents',
    plan: 'Free',
  },
  {
    slug: 'send-later',
    name: 'Send Later',
    description: 'Schedule emails for later delivery.',
    category: 'Productivity',
    plan: 'Pro',
  },
  {
    slug: 'cv-maker',
    name: 'CV Maker',
    description: 'Create a polished resume and download it as PDF.',
    category: 'Documents',
    plan: 'Free',
  },
  {
    slug: 'video-converter',
    name: 'Video Converter',
    description: 'Convert videos to MP4 or WebM in the browser.',
    category: 'Media',
    plan: 'Premium',
  },
];

export function toolHref(slug: string) {
  return `/tools/${slug}`;
}
