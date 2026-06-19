import type { SIPInputs, SIPResult } from '@/types';

// ─── Currency Formatting ──────────────────────────────────────────────────────

export function formatCurrency(value: number, compact = false): string {
  if (compact) {
    if (value >= 1_00_00_000) return `₹${(value / 1_00_00_000).toFixed(2)}Cr`;
    if (value >= 1_00_000) return `₹${(value / 1_00_000).toFixed(2)}L`;
    if (value >= 1000) return `₹${(value / 1000).toFixed(2)}K`;
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatNAV(nav: string | number): string {
  const n = typeof nav === 'string' ? parseFloat(nav) : nav;
  return `₹${n.toFixed(4)}`;
}

export function formatReturn(value: number): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-IN').format(Math.round(value));
}

// ─── Date Formatting ─────────────────────────────────────────────────────────

export function formatDate(dateStr: string): string {
  // Input: "DD-MM-YYYY"
  const [d, m, y] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function formatDateShort(dateStr: string): string {
  const [d, m, y] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

export function timeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return `${Math.floor(diffDays / 30)} months ago`;
}

// ─── SIP Calculator ──────────────────────────────────────────────────────────

export function calculateSIP(inputs: SIPInputs): SIPResult {
  const { monthlyAmount, annualReturn, durationYears } = inputs;
  const n = durationYears * 12;
  const r = annualReturn / 12 / 100;
  const totalInvested = monthlyAmount * n;
  const estimatedCorpus = r === 0
    ? totalInvested
    : monthlyAmount * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
  const wealthGained = estimatedCorpus - totalInvested;

  const monthlyBreakdown = Array.from({ length: n }, (_, i) => {
    const month = i + 1;
    const invested = monthlyAmount * month;
    const corpus = r === 0
      ? invested
      : monthlyAmount * ((Math.pow(1 + r, month) - 1) / r) * (1 + r);
    return { month, invested, corpus };
  });

  return { totalInvested, wealthGained, estimatedCorpus, monthlyBreakdown };
}

// ─── CSV Export ──────────────────────────────────────────────────────────────

export function exportNavToCSV(
  schemeName: string,
  schemeCode: number,
  data: Array<{ date: string; nav: string }>
): void {
  const header = 'Date,NAV\n';
  const rows = data.map((d) => `${d.date},${d.nav}`).join('\n');
  const blob = new Blob([header + rows], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${schemeName.replace(/\s+/g, '_')}_${schemeCode}_NAV.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

// ─── Chart PNG Download ───────────────────────────────────────────────────────

export function downloadChartAsPNG(chartId: string, filename: string): void {
  const svg = document.getElementById(chartId)?.querySelector('svg');
  if (!svg) return;
  const serializer = new XMLSerializer();
  const svgStr = serializer.serializeToString(svg);
  const canvas = document.createElement('canvas');
  const img = new Image();
  img.onload = () => {
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#0a0f1e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = filename;
    link.click();
  };
  img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgStr)));
}

// ─── Text Helpers ─────────────────────────────────────────────────────────────

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function truncate(str: string, maxLen: number): string {
  return str.length > maxLen ? str.substring(0, maxLen - 1) + '…' : str;
}

export function extractAMC(schemeName: string): string {
  const knownAMCs = [
    'HDFC', 'SBI', 'ICICI Prudential', 'Axis', 'Mirae Asset', 'Nippon India',
    'Kotak Mahindra', 'Parag Parikh', 'UTI', 'DSP', 'Tata', 'Franklin Templeton',
    'Aditya Birla Sun Life', 'IDFC', 'Edelweiss', 'Canara Robeco', 'Invesco',
    'Union', 'LIC', 'BOI', 'JM Financial', 'Motilal Oswal', 'Mahindra Manulife',
  ];
  for (const amc of knownAMCs) {
    if (schemeName.toLowerCase().includes(amc.toLowerCase())) return amc;
  }
  return schemeName.split(' ').slice(0, 2).join(' ');
}

export function isPositiveReturn(nav1: number, nav2: number): boolean {
  return nav2 >= nav1;
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text);
}

export function shareUrl(title: string, text: string, url: string): void {
  if (navigator.share) {
    navigator.share({ title, text, url });
  } else {
    copyToClipboard(url);
  }
}
