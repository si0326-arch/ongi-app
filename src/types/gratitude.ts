export type ExpenseCategory =
  | '식사/배달'
  | '휴식/카페'
  | '건강/돌봄'
  | '생활/편리'
  | '선물/관계'
  | '저축/미래의나'
  | '기타';

export type ExpenseMood = 'grateful' | 'peaceful' | 'anxious';

export interface ExpenseItem {
  id: string;
  amount: number;
  category: ExpenseCategory;
  valueTags: string[];
  gratitudeNote: string;
  mood: ExpenseMood;
  createdAt: string; // ISO date string
}

export interface CategoryMeta {
  id: ExpenseCategory;
  label: ExpenseCategory;
  description: string;
  suggestedTags: string[];
  recommendedNotes: string[];
  accentBg: string;
  accentText: string;
}

export interface MoodMeta {
  id: ExpenseMood;
  label: string;
  shortLabel: string;
}

export interface ReminderSettings {
  enabled: boolean;
  time: string; // HH:mm (24h format, e.g. '21:00')
  lastNotifiedDate: string; // YYYY-MM-DD
}

export type TabId = 'home' | 'report' | 'settings';
