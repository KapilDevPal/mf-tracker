import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MAX_COMPARE_FUNDS, MAX_SEARCH_HISTORY } from '@/constants';

// ─── Compare Store ────────────────────────────────────────────────────────────

interface CompareFund {
  schemeCode: number;
  schemeName: string;
  fundHouse: string;
}

interface CompareStore {
  funds: CompareFund[];
  addFund: (fund: CompareFund) => void;
  removeFund: (schemeCode: number) => void;
  clearAll: () => void;
  isInCompare: (schemeCode: number) => boolean;
}

export const useCompareStore = create<CompareStore>()(
  persist(
    (set, get) => ({
      funds: [],
      addFund: (fund) =>
        set((state) => {
          if (state.funds.length >= MAX_COMPARE_FUNDS) return state;
          if (state.funds.some((f) => f.schemeCode === fund.schemeCode)) return state;
          return { funds: [...state.funds, fund] };
        }),
      removeFund: (schemeCode) =>
        set((state) => ({ funds: state.funds.filter((f) => f.schemeCode !== schemeCode) })),
      clearAll: () => set({ funds: [] }),
      isInCompare: (schemeCode) => get().funds.some((f) => f.schemeCode === schemeCode),
    }),
    { name: 'mf-compare' }
  )
);

// ─── Search History Store ─────────────────────────────────────────────────────

interface SearchHistoryStore {
  queries: string[];
  addQuery: (query: string) => void;
  removeQuery: (query: string) => void;
  clearAll: () => void;
}

export const useSearchHistoryStore = create<SearchHistoryStore>()(
  persist(
    (set) => ({
      queries: [],
      addQuery: (query) =>
        set((state) => {
          const filtered = state.queries.filter((q) => q !== query);
          return { queries: [query, ...filtered].slice(0, MAX_SEARCH_HISTORY) };
        }),
      removeQuery: (query) =>
        set((state) => ({ queries: state.queries.filter((q) => q !== query) })),
      clearAll: () => set({ queries: [] }),
    }),
    { name: 'mf-search-history' }
  )
);
