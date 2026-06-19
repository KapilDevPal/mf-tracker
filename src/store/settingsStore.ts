import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppSettings, Theme, Currency, ChartType } from '@/types';

interface SettingsStore extends AppSettings {
  setTheme: (theme: Theme) => void;
  setCurrency: (currency: Currency) => void;
  setChartType: (chartType: ChartType) => void;
  setShowGridLines: (value: boolean) => void;
  setAnimateCharts: (value: boolean) => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      theme: 'dark',
      currency: 'INR',
      chartType: 'area',
      showGridLines: true,
      animateCharts: true,
      setTheme: (theme) => set({ theme }),
      setCurrency: (currency) => set({ currency }),
      setChartType: (chartType) => set({ chartType }),
      setShowGridLines: (showGridLines) => set({ showGridLines }),
      setAnimateCharts: (animateCharts) => set({ animateCharts }),
    }),
    { name: 'mf-settings' }
  )
);
