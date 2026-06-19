import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { MainLayout } from '@/layouts/MainLayout';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { ChartSkeleton } from '@/components/ui/Skeleton';
import { ROUTES } from '@/constants';

// Lazy load pages for performance optimization
const Home = lazy(() => import('@/pages/Home'));
const Search = lazy(() => import('@/pages/Search'));
const FundDetail = lazy(() => import('@/pages/FundDetail'));
const Compare = lazy(() => import('@/pages/Compare'));
const SIPCalculator = lazy(() => import('@/pages/SIPCalculator'));
const Watchlist = lazy(() => import('@/pages/Watchlist'));
const Settings = lazy(() => import('@/pages/Settings'));

// Configure react-query client with global defaults
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutes cache lifetime
    },
  },
});

export default function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <HelmetProvider>
          <BrowserRouter basename="/mf-tracker">
            <Suspense
              fallback={
                <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ChartSkeleton />
                </div>
              }
            >
              <Routes>
                <Route path={ROUTES.HOME} element={<MainLayout />}>
                  <Route index element={<Home />} />
                  <Route path={ROUTES.SEARCH} element={<Search />} />
                  <Route path={ROUTES.FUND_DETAIL} element={<FundDetail />} />
                  <Route path={ROUTES.COMPARE} element={<Compare />} />
                  <Route path={ROUTES.SIP_CALCULATOR} element={<SIPCalculator />} />
                  <Route path={ROUTES.WATCHLIST} element={<Watchlist />} />
                  <Route path={ROUTES.SETTINGS} element={<Settings />} />
                  {/* Fallback routing */}
                  <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
                </Route>
              </Routes>
            </Suspense>
          </BrowserRouter>
        </HelmetProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
