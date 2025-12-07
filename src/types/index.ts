export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
  isCustom: boolean;
}

export interface Activity {
  id: string;
  name: string;
  categoryId: string;
  duration: number; // in minutes
  createdAt: Date;
}

export interface DayData {
  date: string; // YYYY-MM-DD format
  activities: Activity[];
  totalMinutes: number;
}

export interface AIInsight {
  id: string;
  type: 'productivity' | 'health' | 'wellness' | 'balance' | 'tip';
  icon: string;
  title: string;
  message: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  createdAt: Date;
}

export const MAX_MINUTES_PER_DAY = 1440; // 24 hours * 60 minutes
