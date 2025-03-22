import Dexie, { Table } from 'dexie';

export interface TimeEntry {
  id?: number;
  url: string;
  domain: string;
  startTime: Date;
  endTime: Date;
  duration: number;
  title: string;
}

export interface WebsiteLimit {
  id?: number;
  domain: string;
  dailyLimit: number;
  isActive: boolean;
}

class TimeTrackerDatabase extends Dexie {
  timeEntries!: Table<TimeEntry>;
  websiteLimits!: Table<WebsiteLimit>;

  constructor() {
    super('TimeTrackerDB');
    this.version(1).stores({
      timeEntries: '++id, url, domain, startTime, endTime',
      websiteLimits: '++id, domain'
    });
  }
}

export const db = new TimeTrackerDatabase();

export const addTimeEntry = async (entry: Omit<TimeEntry, 'id'>) => {
  return await db.timeEntries.add(entry);
};

export const getTimeEntriesByDate = async (startDate: Date, endDate: Date) => {
  return await db.timeEntries
    .where('startTime')
    .between(startDate, endDate)
    .toArray();
};

export const getWebsiteLimits = async () => {
  return await db.websiteLimits.toArray();
};

export const setWebsiteLimit = async (limit: Omit<WebsiteLimit, 'id'>) => {
  const existing = await db.websiteLimits
    .where('domain')
    .equals(limit.domain)
    .first();
  
  if (existing) {
    return await db.websiteLimits.update(existing.id!, limit);
  } else {
    return await db.websiteLimits.add(limit);
  }
};

// Add this function to your db.ts file
export async function deleteTimeEntryByDomain(domain: string): Promise<void> {
  try {
    await db.timeEntries.where('domain').equals(domain).delete();
  } catch (error) {
    console.error('Error deleting time entries:', error);
  }
}