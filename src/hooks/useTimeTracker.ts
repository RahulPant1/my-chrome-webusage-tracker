import { useState, useEffect, useCallback } from 'react';
import { TimeEntry, getTimeEntriesByDate, deleteTimeEntryByDomain } from '../utils/db';
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';

export interface TimeStats {
  totalTime: number;
  topSites: Array<{
    domain: string;
    totalTime: number;
    percentage: number;
  }>;
}

export function useTimeTracker(period: 'day' | 'week' | 'month' = 'day') {
  const [entries, setEntries] = useState<TimeEntry[]>([]);
  const [stats, setStats] = useState<TimeStats>({
    totalTime: 0,
    topSites: []
  });
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const now = new Date();
    let startDate: Date;
    let endDate: Date;

    switch (period) {
      case 'week':
        startDate = startOfWeek(now);
        endDate = endOfWeek(now);
        break;
      case 'month':
        startDate = startOfMonth(now);
        endDate = endOfMonth(now);
        break;
      default:
        startDate = startOfDay(now);
        endDate = endOfDay(now);
    }

    try {
      const timeEntries = await getTimeEntriesByDate(startDate, endDate);
      setEntries(timeEntries);

      const domainMap = new Map<string, number>();
      let totalDuration = 0;

      timeEntries.forEach(entry => {
        const currentDuration = domainMap.get(entry.domain) || 0;
        domainMap.set(entry.domain, currentDuration + entry.duration);
        totalDuration += entry.duration;
      });

      const topSites = Array.from(domainMap.entries())
        .map(([domain, totalTime]) => ({
          domain,
          totalTime,
          percentage: (totalTime / totalDuration) * 100
        }))
        .sort((a, b) => b.totalTime - a.totalTime)
        .slice(0, 10);

      setStats({
        totalTime: totalDuration,
        topSites
      });
    } catch (error) {
      console.error('Error fetching time entries:', error);
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { stats, loading, refreshData: fetchData };
}