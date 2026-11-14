import { createInitialSeedItems, DEFAULT_AFFIRMATION } from '../data/mindsetData';
import { ExpenseItem, ReminderSettings } from '../types/gratitude';

const ITEMS_KEY = 'ongi_expense_items_v3';
const INITIALIZED_KEY = 'ongi_initialized_v3';
const AFFIRMATION_KEY = 'ongi_personal_affirmation_v2';
const SAFE_MODE_KEY = 'ongi_safe_mode_v2';
const REMINDER_KEY = 'ongi_reminder_settings_v1';

const DEFAULT_REMINDER_SETTINGS: ReminderSettings = {
  enabled: false,
  time: '21:00',
  lastNotifiedDate: '',
};

export function loadExpenseItems(): ExpenseItem[] {
  try {
    const initialized = localStorage.getItem(INITIALIZED_KEY);
    const raw = localStorage.getItem(ITEMS_KEY);

    if (!initialized && !raw) {
      const seeded = createInitialSeedItems();
      localStorage.setItem(ITEMS_KEY, JSON.stringify(seeded));
      localStorage.setItem(INITIALIZED_KEY, 'true');
      return seeded;
    }

    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

export function saveExpenseItems(items: ExpenseItem[]): void {
  try {
    localStorage.setItem(ITEMS_KEY, JSON.stringify(items));
    localStorage.setItem(INITIALIZED_KEY, 'true');
  } catch {
    // Ignore storage quota errors gracefully
  }
}

export function loadAffirmation(): string {
  try {
    return localStorage.getItem(AFFIRMATION_KEY) || DEFAULT_AFFIRMATION;
  } catch {
    return DEFAULT_AFFIRMATION;
  }
}

export function saveAffirmation(affirmation: string): void {
  try {
    localStorage.setItem(AFFIRMATION_KEY, affirmation);
  } catch {
    // Ignore storage quota errors gracefully
  }
}

export function loadSafeMode(): boolean {
  try {
    return localStorage.getItem(SAFE_MODE_KEY) === 'true';
  } catch {
    return false;
  }
}

export function saveSafeMode(enabled: boolean): void {
  try {
    localStorage.setItem(SAFE_MODE_KEY, String(enabled));
  } catch {
    // Ignore storage quota errors gracefully
  }
}

export function loadReminderSettings(): ReminderSettings {
  try {
    const raw = localStorage.getItem(REMINDER_KEY);
    if (!raw) return DEFAULT_REMINDER_SETTINGS;
    const parsed = JSON.parse(raw) as Partial<ReminderSettings>;
    return {
      enabled: Boolean(parsed.enabled),
      time: typeof parsed.time === 'string' && parsed.time ? parsed.time : '21:00',
      lastNotifiedDate:
        typeof parsed.lastNotifiedDate === 'string' ? parsed.lastNotifiedDate : '',
    };
  } catch {
    return DEFAULT_REMINDER_SETTINGS;
  }
}

export function saveReminderSettings(settings: ReminderSettings): void {
  try {
    localStorage.setItem(REMINDER_KEY, JSON.stringify(settings));
  } catch {
    // Ignore storage quota errors gracefully
  }
}

export function resetToSampleData(): ExpenseItem[] {
  const seeded = createInitialSeedItems();
  saveExpenseItems(seeded);
  return seeded;
}

export function clearAllExpenseItems(): ExpenseItem[] {
  saveExpenseItems([]);
  return [];
}
