// ─── Fund Types ─────────────────────────────────────────────────────────────

export interface FundSearchResult {
  schemeCode: number;
  schemeName: string;
}

export interface FundMeta {
  fund_house: string;
  scheme_type: string;
  scheme_category: string;
  scheme_code: number;
  scheme_name: string;
  isin_growth: string | null;
  isin_div_reinvestment: string | null;
}

export interface NAVEntry {
  date: string; // "DD-MM-YYYY"
  nav: string;  // numeric string
}

export interface FundDetail {
  meta: FundMeta;
  data: NAVEntry[];
  status: string;
}

export interface FundScheme {
  schemeCode: number;
  schemeName: string;
}

// ─── Watchlist Types ─────────────────────────────────────────────────────────

export interface WatchlistFund {
  schemeCode: number;
  schemeName: string;
  fundHouse: string;
  category: string;
  latestNav?: number;
  navDate?: string;
  isFavorite: boolean;
  addedAt: string;
}

// ─── Chart Types ─────────────────────────────────────────────────────────────

export interface ChartDataPoint {
  date: string;
  nav: number;
  displayDate: string;
}

export interface CompareChartPoint {
  date: string;
  [key: string]: number | string;
}

// ─── Settings Types ──────────────────────────────────────────────────────────

export type Theme = 'dark' | 'light' | 'system';
export type Currency = 'INR' | 'USD' | 'EUR';
export type ChartType = 'area' | 'line' | 'bar';

export interface AppSettings {
  theme: Theme;
  currency: Currency;
  chartType: ChartType;
  showGridLines: boolean;
  animateCharts: boolean;
}

// ─── Date Range Types ────────────────────────────────────────────────────────

export type DateRangePreset = '1M' | '3M' | '6M' | '1Y' | '3Y' | '5Y' | 'ALL' | 'CUSTOM';

export interface DateRange {
  startDate: string;
  endDate: string;
}

// ─── SIP Calculator Types ────────────────────────────────────────────────────

export interface SIPInputs {
  monthlyAmount: number;
  annualReturn: number;
  durationYears: number;
}

export interface SIPResult {
  totalInvested: number;
  wealthGained: number;
  estimatedCorpus: number;
  monthlyBreakdown: Array<{
    month: number;
    invested: number;
    corpus: number;
  }>;
}
