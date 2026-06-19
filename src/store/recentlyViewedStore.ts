import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MAX_RECENTLY_VIEWED } from '@/constants';

export interface RecentFund {
  schemeCode: number;
  schemeName: string;
  fundHouse: string;
  latestNav?: number;
  navDate?: string;
  viewedAt: string;
}

interface RecentlyViewedStore {
  funds: RecentFund[];
  addFund: (fund: Omit<RecentFund, 'viewedAt'>) => void;
  removeFund: (schemeCode: number) => void;
  clearAll: () => void;
}

export const useRecentlyViewedStore = create<RecentlyViewedStore>()(
  persist(
    (set) => ({
      funds: [],
      addFund: (fund) =>
        set((state) => {
          const filtered = state.funds.filter((f) => f.schemeCode !== fund.schemeCode);
          const updated = [{ ...fund, viewedAt: new Date().toISOString() }, ...filtered];
          return { funds: updated.slice(0, MAX_RECENTLY_VIEWED) };
        }),
      removeFund: (schemeCode) =>
        set((state) => ({ funds: state.funds.filter((f) => f.schemeCode !== schemeCode) })),
      clearAll: () => set({ funds: [] }),
    }),
    { name: 'mf-recently-viewed' }
  )
);
