export const sampleText = 'ToolNest helps freelancers and small teams finish everyday web tasks faster.';

export function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

export function shiftHex(hex: string, amount: number) {
  const value = parseInt(hex.slice(1), 16);
  const r = Math.max(0, Math.min(255, ((value >> 16) & 255) + amount));
  const g = Math.max(0, Math.min(255, ((value >> 8) & 255) + amount));
  const b = Math.max(0, Math.min(255, (value & 255) + amount));
  return `#${[r, g, b].map((item) => item.toString(16).padStart(2, '0')).join('')}`;
}

export function hexToRgb(hex: string) {
  const value = parseInt(hex.slice(1), 16);
  return `${(value >> 16) & 255}, ${(value >> 8) & 255}, ${value & 255}`;
}

export function hexToHsl(hex: string) {
  const [r, g, b] = hexToRgb(hex).split(', ').map((item) => Number(item) / 255);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
    h /= 6;
  }
  return `${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%`;
}
