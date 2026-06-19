import { MFAPI_BASE } from '@/constants';
import type { FundDetail, FundSearchResult, FundScheme, NAVEntry } from '@/types';

// ─── Retry Helper ────────────────────────────────────────────────────────────

async function fetchWithRetry<T>(url: string, retries = 3, delay = 500): Promise<T> {
  let lastError: Error | null = null;
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      return (await res.json()) as T;
    } catch (err) {
      lastError = err instanceof Error ? err : new Error('Unknown error');
      if (i < retries - 1) await new Promise((r) => setTimeout(r, delay * Math.pow(2, i)));
    }
  }
  throw lastError ?? new Error('Request failed after retries');
}

// ─── API Methods ─────────────────────────────────────────────────────────────

/**
 * Search mutual funds by query string.
 */
export async function searchFunds(query: string): Promise<FundSearchResult[]> {
  if (!query.trim()) return [];
  const url = `${MFAPI_BASE}/mf/search?q=${encodeURIComponent(query.trim())}`;
  return fetchWithRetry<FundSearchResult[]>(url);
}

/**
 * Get list of schemes with pagination.
 */
export async function getSchemes(limit = 100, offset = 0): Promise<FundScheme[]> {
  const url = `${MFAPI_BASE}/mf?limit=${limit}&offset=${offset}`;
  return fetchWithRetry<FundScheme[]>(url);
}

/**
 * Get latest NAV data for a scheme.
 */
export async function getLatestNAV(schemeCode: number): Promise<FundDetail> {
  const url = `${MFAPI_BASE}/mf/${schemeCode}/latest`;
  return fetchWithRetry<FundDetail>(url);
}

/**
 * Get full NAV history for a scheme (optionally filtered by date range).
 */
export async function getNAVHistory(
  schemeCode: number,
  startDate?: string,
  endDate?: string
): Promise<FundDetail> {
  let url = `${MFAPI_BASE}/mf/${schemeCode}`;
  const params = new URLSearchParams();
  if (startDate) params.set('startDate', startDate);
  if (endDate) params.set('endDate', endDate);
  const qs = params.toString();
  if (qs) url += `?${qs}`;
  return fetchWithRetry<FundDetail>(url);
}

// ─── Data Helpers ────────────────────────────────────────────────────────────

/**
 * Parse "DD-MM-YYYY" → Date object.
 */
export function parseNavDate(dateStr: string): Date {
  const [d, m, y] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
}

/**
 * Format Date → "YYYY-MM-DD" for API.
 */
export function toApiDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * Get startDate string from a preset period.
 */
export function getStartDateFromPreset(preset: string): string {
  const now = new Date();
  const map: Record<string, () => Date> = {
    '1M': () => new Date(now.getFullYear(), now.getMonth() - 1, now.getDate()),
    '3M': () => new Date(now.getFullYear(), now.getMonth() - 3, now.getDate()),
    '6M': () => new Date(now.getFullYear(), now.getMonth() - 6, now.getDate()),
    '1Y': () => new Date(now.getFullYear() - 1, now.getMonth(), now.getDate()),
    '3Y': () => new Date(now.getFullYear() - 3, now.getMonth(), now.getDate()),
    '5Y': () => new Date(now.getFullYear() - 5, now.getMonth(), now.getDate()),
    ALL: () => new Date(2000, 0, 1),
  };
  return toApiDate((map[preset] ?? map['1Y'])());
}

/**
 * Sort NAV data ascending by date.
 */
export function sortNavData(data: NAVEntry[]): NAVEntry[] {
  return [...data].sort(
    (a, b) => parseNavDate(a.date).getTime() - parseNavDate(b.date).getTime()
  );
}

/**
 * Calculate returns between two NAV values.
 */
export function calculateReturn(oldNav: number, newNav: number): number {
  if (!oldNav) return 0;
  return ((newNav - oldNav) / oldNav) * 100;
}
