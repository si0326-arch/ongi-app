/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AnimatePresence, motion } from 'motion/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { BottomNav } from './components/BottomNav';
import { EntryComposerSheet } from './components/EntryComposerSheet';
import { EntryDetailSheet } from './components/EntryDetailSheet';
import { GratitudeGuideSheet } from './components/GratitudeGuideSheet';
import { HomeFeedView } from './components/HomeFeedView';
import { ReportView } from './components/ReportView';
import { SettingsView } from './components/SettingsView';
import { GratitudeTheme, WritingGuideExample } from './data/mindsetData';
import { ExpenseItem, ReminderSettings, TabId } from './types/gratitude';
import {
  cancelNativeDailyReminder,
  getUnifiedNotificationPermission,
  isNativeAndroid,
  requestUnifiedNotificationPermission,
  scheduleNativeDailyReminder,
  triggerImmediateGratitudeNotification,
  UnifiedNotificationPermission,
} from './utils/notifications';
import {
  clearAllExpenseItems,
  loadAffirmation,
  loadExpenseItems,
  loadReminderSettings,
  loadSafeMode,
  resetToSampleData,
  saveAffirmation,
  saveExpenseItems,
  saveReminderSettings,
  saveSafeMode,
} from './utils/storage';

function getLocalTodayISO(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
    now.getDate()
  ).padStart(2, '0')}`;
}

function getCurrentHHMM(): string {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, '0')}:${String(
    now.getMinutes()
  ).padStart(2, '0')}`;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('home');
  const [items, setItems] = useState<ExpenseItem[]>(() => loadExpenseItems());
  const [affirmation, setAffirmation] = useState<string>(() => loadAffirmation());
  const [isSafeMode, setIsSafeMode] = useState<boolean>(() => loadSafeMode());
  const [reminderSettings, setReminderSettings] = useState<ReminderSettings>(() =>
    loadReminderSettings()
  );
  const [notificationPermission, setNotificationPermission] =
    useState<UnifiedNotificationPermission>('default');

  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ExpenseItem | null>(null);
  const [guidePreset, setGuidePreset] = useState<WritingGuideExample | null>(null);
  const [themePreset, setThemePreset] = useState<GratitudeTheme | null>(null);

  const [selectedItem, setSelectedItem] = useState<ExpenseItem | null>(null);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimerRef = useRef<number | null>(null);

  const showToast = useCallback((message: string) => {
    setToastMessage(message);
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = window.setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  }, []);

  useEffect(() => {
    getUnifiedNotificationPermission().then(setNotificationPermission);
    return () => {
      if (toastTimerRef.current) {
        window.clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  const fireGratitudeNotification = useCallback(() => {
    void triggerImmediateGratitudeNotification(
      () => showToast('오늘의 감사함을 돌아볼까요? 🌱'),
      () => setActiveTab('home')
    );
  }, [showToast]);

  // Web browser daily evening reminder check loop (Android native uses OS LocalNotifications scheduler)
  useEffect(() => {
    if (!reminderSettings.enabled || isNativeAndroid()) return;

    const checkSchedule = () => {
      const todayISO = getLocalTodayISO();
      const nowHHMM = getCurrentHHMM();
      if (
        reminderSettings.lastNotifiedDate !== todayISO &&
        nowHHMM >= reminderSettings.time
      ) {
        fireGratitudeNotification();
        const updated: ReminderSettings = {
          ...reminderSettings,
          lastNotifiedDate: todayISO,
        };
        setReminderSettings(updated);
        saveReminderSettings(updated);
      }
    };

    checkSchedule();
    const intervalId = window.setInterval(checkSchedule, 20000);
    return () => window.clearInterval(intervalId);
  }, [reminderSettings, fireGratitudeNotification]);

  const handleToggleReminder = async () => {
    if (reminderSettings.enabled) {
      const updated = { ...reminderSettings, enabled: false };
      setReminderSettings(updated);
      saveReminderSettings(updated);
      await cancelNativeDailyReminder();
      showToast('저녁 감사 알림을 잠시 꺼두었어요.');
      return;
    }

    let permission = await getUnifiedNotificationPermission();
    if (permission === 'default') {
      permission = await requestUnifiedNotificationPermission();
    }
    setNotificationPermission(permission);

    if (permission === 'unsupported') {
      const updated = { ...reminderSettings, enabled: true };
      setReminderSettings(updated);
      saveReminderSettings(updated);
      showToast('알림이 켜졌어요. 앱이 열려 있을 때 다정하게 알려드릴게요.');
      return;
    }

    if (permission === 'granted') {
      const updated = { ...reminderSettings, enabled: true };
      setReminderSettings(updated);
      saveReminderSettings(updated);
      await scheduleNativeDailyReminder(updated.time);
      showToast('매일 저녁 다정한 감사 알림을 보내드릴게요 🌱');
    } else if (permission === 'denied') {
      showToast('기기 또는 브라우저 설정에서 알림 권한을 허용하면 푸시 알림을 받을 수 있어요.');
    } else {
      showToast('알림 권한이 아직 허용되지 않았어요.');
    }
  };

  const handleChangeReminderTime = async (time: string) => {
    if (!time) return;
    const updated: ReminderSettings = {
      ...reminderSettings,
      time,
      lastNotifiedDate:
        time > getCurrentHHMM() ? '' : reminderSettings.lastNotifiedDate,
    };
    setReminderSettings(updated);
    saveReminderSettings(updated);
    if (updated.enabled) {
      await scheduleNativeDailyReminder(time);
    }
  };

  const handleSendTestNotification = async () => {
    let permission = await getUnifiedNotificationPermission();
    if (permission === 'default') {
      permission = await requestUnifiedNotificationPermission();
    }
    setNotificationPermission(permission);

    if (permission === 'granted') {
      await triggerImmediateGratitudeNotification(
        () => showToast('오늘의 감사함을 돌아볼까요? 🌱'),
        () => setActiveTab('home')
      );
      showToast('감사 알림을 보냈어요!');
    } else {
      showToast('오늘의 감사함을 돌아볼까요? 🌱');
    }
  };

  const handleToggleSafeMode = () => {
    const next = !isSafeMode;
    setIsSafeMode(next);
    saveSafeMode(next);
    showToast(
      next
        ? '안심 모드가 켜졌어요. 이제 감사의 문장만 편안하게 읽어보세요.'
        : '안심 모드를 끄고 풍요 금액을 다시 보여드려요.'
    );
  };

  const handleChangeAffirmation = (next: string) => {
    setAffirmation(next);
    saveAffirmation(next);
  };

  const handleOpenComposer = (
    preset?: WritingGuideExample,
    theme?: GratitudeTheme
  ) => {
    setEditingItem(null);
    setGuidePreset(preset || null);
    setThemePreset(theme || null);
    setIsComposerOpen(true);
  };

  const handleEditItem = (item: ExpenseItem) => {
    setGuidePreset(null);
    setThemePreset(null);
    setEditingItem(item);
    setIsComposerOpen(true);
  };

  const handleSaveItem = (
    payload: Omit<ExpenseItem, 'id'>,
    existingId?: string
  ) => {
    if (existingId) {
      const updated = items.map((item) =>
        item.id === existingId ? { ...payload, id: existingId } : item
      );
      setItems(updated);
      saveExpenseItems(updated);
      showToast('감사의 문장을 다정하게 다듬었어요.');
    } else {
      const newItem: ExpenseItem = {
        ...payload,
        id: `ongi-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      };
      const updated = [newItem, ...items];
      setItems(updated);
      saveExpenseItems(updated);
      showToast('오늘의 풍요가 소중히 기록되었어요 🌱');
    }
  };

  const handleDeleteItem = (id: string) => {
    const updated = items.filter((item) => item.id !== id);
    setItems(updated);
    saveExpenseItems(updated);
    showToast('기록을 조용히 비웠어요.');
  };

  const handleResetSample = () => {
    const seeded = resetToSampleData();
    setItems(seeded);
    showToast('따뜻한 예시 기록들을 다시 채워두었어요.');
  };

  const handleClearAll = () => {
    const cleared = clearAllExpenseItems();
    setItems(cleared);
    showToast('깨끗한 백지 상태로 비워두었어요.');
  };

  return (
    <div className="min-h-dvh w-full bg-[#F4EFE6] flex justify-center">
      <div className="w-full max-w-md min-h-dvh bg-[#FDFBF7] text-[#3D3A35] relative sm:border-x sm:border-[#EAE3D6] sm:shadow-[0_0_40px_rgba(61,58,53,0.06)] flex flex-col">
        {/* Main Scrollable Content */}
        <main className="flex-1 px-5 pt-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            >
              {activeTab === 'home' && (
                <HomeFeedView
                  items={items}
                  affirmation={affirmation}
                  isSafeMode={isSafeMode}
                  onToggleSafeMode={handleToggleSafeMode}
                  onChangeAffirmation={handleChangeAffirmation}
                  onOpenComposer={(theme) => handleOpenComposer(undefined, theme)}
                  onOpenGuide={() => setIsGuideOpen(true)}
                  onSelectItem={(item) => setSelectedItem(item)}
                />
              )}

              {activeTab === 'report' && (
                <ReportView
                  items={items}
                  isSafeMode={isSafeMode}
                  onToggleSafeMode={handleToggleSafeMode}
                  onResetSample={handleResetSample}
                  onClearAll={handleClearAll}
                  onNotify={showToast}
                />
              )}

              {activeTab === 'settings' && (
                <SettingsView
                  reminderSettings={reminderSettings}
                  notificationPermission={notificationPermission}
                  isSafeMode={isSafeMode}
                  affirmation={affirmation}
                  onToggleReminder={handleToggleReminder}
                  onChangeReminderTime={handleChangeReminderTime}
                  onSendTestNotification={handleSendTestNotification}
                  onToggleSafeMode={handleToggleSafeMode}
                  onChangeAffirmation={handleChangeAffirmation}
                  onOpenGuide={() => setIsGuideOpen(true)}
                  onResetSample={handleResetSample}
                  onClearAll={handleClearAll}
                  onNotify={showToast}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Warm Toast Feedback */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              role="status"
              aria-live="polite"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="fixed bottom-20 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-2.5rem)] max-w-[380px] px-4 py-3 rounded-2xl bg-[#3D3A35] text-[#FDFBF7] text-xs font-medium text-center shadow-lg"
            >
              {toastMessage}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom Navigation: 홈 / 기록하기 (+) / 풍요 리포트 / 설정 */}
        <BottomNav
          activeTab={activeTab}
          onChangeTab={setActiveTab}
          onOpenRecord={() => handleOpenComposer()}
        />

        {/* Sheets */}
        <EntryComposerSheet
          isOpen={isComposerOpen}
          onClose={() => {
            setIsComposerOpen(false);
            setEditingItem(null);
            setGuidePreset(null);
            setThemePreset(null);
          }}
          onSave={handleSaveItem}
          editingItem={editingItem}
          guidePreset={guidePreset}
          themePreset={themePreset}
        />

        <EntryDetailSheet
          item={selectedItem}
          isSafeMode={isSafeMode}
          onClose={() => setSelectedItem(null)}
          onEdit={handleEditItem}
          onDelete={handleDeleteItem}
        />

        <GratitudeGuideSheet
          isOpen={isGuideOpen}
          onClose={() => setIsGuideOpen(false)}
          onStartWritingWithExample={(example) => handleOpenComposer(example)}
        />
      </div>
    </div>
  );
}
