import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';

const DAILY_REMINDER_ID = 1001;
const TEST_REMINDER_ID = 1002;
const NOTIFICATION_TITLE = '온기 · 감사 가계부';
const NOTIFICATION_BODY =
  '오늘의 감사함을 돌아볼까요? 오늘 누린 작은 풍요를 다정하게 적어보아요.';

export type UnifiedNotificationPermission = NotificationPermission | 'unsupported';

export function isNativeAndroid(): boolean {
  return Capacitor.isNativePlatform();
}

export async function getUnifiedNotificationPermission(): Promise<UnifiedNotificationPermission> {
  if (isNativeAndroid()) {
    try {
      const status = await LocalNotifications.checkPermissions();
      if (status.display === 'granted') return 'granted';
      if (status.display === 'denied') return 'denied';
      return 'default';
    } catch {
      return 'unsupported';
    }
  }

  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'unsupported';
  }
  return Notification.permission;
}

export async function requestUnifiedNotificationPermission(): Promise<UnifiedNotificationPermission> {
  if (isNativeAndroid()) {
    try {
      const status = await LocalNotifications.requestPermissions();
      if (status.display === 'granted') return 'granted';
      if (status.display === 'denied') return 'denied';
      return 'default';
    } catch {
      return 'denied';
    }
  }

  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'unsupported';
  }
  try {
    return await Notification.requestPermission();
  } catch {
    return 'denied';
  }
}

export async function scheduleNativeDailyReminder(hhmm: string): Promise<void> {
  if (!isNativeAndroid()) return;
  const [hStr, mStr] = hhmm.split(':');
  const hour = Number(hStr);
  const minute = Number(mStr);
  if (Number.isNaN(hour) || Number.isNaN(minute)) return;

  try {
    await LocalNotifications.cancel({ notifications: [{ id: DAILY_REMINDER_ID }] });
    await LocalNotifications.schedule({
      notifications: [
        {
          id: DAILY_REMINDER_ID,
          title: NOTIFICATION_TITLE,
          body: NOTIFICATION_BODY,
          schedule: {
            on: { hour, minute },
            repeats: true,
            allowWhileIdle: true,
          },
        },
      ],
    });
  } catch {
    // Ignore native scheduling error cleanly
  }
}

export async function cancelNativeDailyReminder(): Promise<void> {
  if (!isNativeAndroid()) return;
  try {
    await LocalNotifications.cancel({ notifications: [{ id: DAILY_REMINDER_ID }] });
  } catch {
    // Ignore cancel error
  }
}

export async function triggerImmediateGratitudeNotification(
  onFallbackToast: () => void,
  onClick?: () => void
): Promise<boolean> {
  if (isNativeAndroid()) {
    try {
      await LocalNotifications.schedule({
        notifications: [
          {
            id: TEST_REMINDER_ID,
            title: NOTIFICATION_TITLE,
            body: NOTIFICATION_BODY,
            schedule: { at: new Date(Date.now() + 800) },
          },
        ],
      });
      return true;
    } catch {
      onFallbackToast();
      return false;
    }
  }

  if (
    typeof window !== 'undefined' &&
    'Notification' in window &&
    Notification.permission === 'granted'
  ) {
    try {
      const notification = new Notification(NOTIFICATION_TITLE, {
        body: NOTIFICATION_BODY,
        tag: 'ongi-daily-gratitude-reminder',
      });
      notification.onclick = () => {
        window.focus();
        onClick?.();
      };
      return true;
    } catch {
      onFallbackToast();
      return false;
    }
  }

  onFallbackToast();
  return false;
}
