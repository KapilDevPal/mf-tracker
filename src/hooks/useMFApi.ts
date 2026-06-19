import { useQuery } from '@tanstack/react-query';
import { searchFunds, getLatestNAV, getNAVHistory, getSchemes } from '@/services/mfapi';
import { STALE_TIME } from '@/constants';

export function useSearchFunds(query: string) {
  return useQuery({
    queryKey: ['search', query],
    queryFn: () => searchFunds(query),
    enabled: query.trim().length >= 2,
    staleTime: STALE_TIME,
    placeholderData: (prev) => prev,
  });
}

export function useLatestNAV(schemeCode: number | null) {
  return useQuery({
    queryKey: ['latest-nav', schemeCode],
    queryFn: () => getLatestNAV(schemeCode!),
    enabled: schemeCode !== null,
    staleTime: STALE_TIME,
  });
}

export function useNAVHistory(
  schemeCode: number | null,
  startDate?: string,
  endDate?: string
) {
  return useQuery({
    queryKey: ['nav-history', schemeCode, startDate, endDate],
    queryFn: () => getNAVHistory(schemeCode!, startDate, endDate),
    enabled: schemeCode !== null,
    staleTime: STALE_TIME,
  });
}

export function useSchemes(limit = 100, offset = 0) {
  return useQuery({
    queryKey: ['schemes', limit, offset],
    queryFn: () => getSchemes(limit, offset),
    staleTime: STALE_TIME * 6, // 30 min
  });
}
