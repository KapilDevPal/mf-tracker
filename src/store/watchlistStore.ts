import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { WatchlistFund } from '@/types';

interface WatchlistStore {
  funds: WatchlistFund[];
  addFund: (fund: WatchlistFund) => void;
  removeFund: (schemeCode: number) => void;
  toggleFavorite: (schemeCode: number) => void;
  isInWatchlist: (schemeCode: number) => boolean;
  isFavorite: (schemeCode: number) => boolean;
  clearWatchlist: () => void;
}

export const useWatchlistStore = create<WatchlistStore>()(
  persist(
    (set, get) => ({
      funds: [],
      addFund: (fund) =>
        set((state) => {
          if (state.funds.some((f) => f.schemeCode === fund.schemeCode)) return state;
          return { funds: [...state.funds, fund] };
        }),
      removeFund: (schemeCode) =>
        set((state) => ({ funds: state.funds.filter((f) => f.schemeCode !== schemeCode) })),
      toggleFavorite: (schemeCode) =>
        set((state) => ({
          funds: state.funds.map((f) =>
            f.schemeCode === schemeCode ? { ...f, isFavorite: !f.isFavorite } : f
          ),
        })),
      isInWatchlist: (schemeCode) => get().funds.some((f) => f.schemeCode === schemeCode),
      isFavorite: (schemeCode) =>
        get().funds.find((f) => f.schemeCode === schemeCode)?.isFavorite ?? false,
      clearWatchlist: () => set({ funds: [] }),
    }),
    { name: 'mf-watchlist' }
  )
);
