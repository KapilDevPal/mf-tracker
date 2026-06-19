import { useEffect, useState } from 'react';
import { useSettingsStore } from '@/store/settingsStore';

export function useTheme() {
  const { theme, setTheme } = useSettingsStore();
  const [resolvedTheme, setResolvedTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const root = document.documentElement;

    function applyTheme(t: 'dark' | 'light') {
      root.classList.toggle('dark', t === 'dark');
      setResolvedTheme(t);
    }

    if (theme === 'system') {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      applyTheme(mq.matches ? 'dark' : 'light');
      const handler = (e: MediaQueryListEvent) => applyTheme(e.matches ? 'dark' : 'light');
      mq.addEventListener('change', handler);
      return () => mq.removeEventListener('change', handler);
    } else {
      applyTheme(theme);
    }
  }, [theme]);

  return { theme, setTheme, resolvedTheme };
}
