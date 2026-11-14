import {
  Bell,
  BookOpenCheck,
  Check,
  Clock,
  Eye,
  EyeOff,
  RotateCcw,
  Send,
} from 'lucide-react';
import { FormEvent, useState } from 'react';
import { POSITIVE_AFFIRMATIONS } from '../data/mindsetData';
import { ReminderSettings } from '../types/gratitude';

interface SettingsViewProps {
  reminderSettings: ReminderSettings;
  notificationPermission: NotificationPermission | 'unsupported';
  isSafeMode: boolean;
  affirmation: string;
  onToggleReminder: () => void;
  onChangeReminderTime: (time: string) => void;
  onSendTestNotification: () => void;
  onToggleSafeMode: () => void;
  onChangeAffirmation: (next: string) => void;
  onOpenGuide: () => void;
  onResetSample: () => void;
  onClearAll: () => void;
  onNotify: (message: string) => void;
}

const EVENING_TIME_PRESETS = [
  { label: '저녁 8시', value: '20:00' },
  { label: '저녁 9시', value: '21:00' },
  { label: '밤 10시', value: '22:00' },
];

function formatKoreanClock(hhmm: string): string {
  const [hStr, mStr] = hhmm.split(':');
  const h = Number(hStr);
  if (Number.isNaN(h)) return hhmm;
  const period = h < 12 ? '오전' : '오후';
  const displayHour = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${period} ${displayHour}시 ${mStr === '00' ? '' : `${Number(mStr)}분`}`.trim();
}

export function SettingsView({
  reminderSettings,
  notificationPermission,
  isSafeMode,
  affirmation,
  onToggleReminder,
  onChangeReminderTime,
  onSendTestNotification,
  onToggleSafeMode,
  onChangeAffirmation,
  onOpenGuide,
  onResetSample,
  onClearAll,
  onNotify,
}: SettingsViewProps) {
  const [draftAffirmation, setDraftAffirmation] = useState(affirmation);
  const [confirmClear, setConfirmClear] = useState(false);

  const handleSaveAffirmation = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = draftAffirmation.trim();
    if (!trimmed) return;
    onChangeAffirmation(trimmed);
    onNotify('나만의 긍정 확언을 다정하게 저장했어요.');
  };

  return (
    <div className="space-y-5 pb-28">
      <header className="pt-2">
        <h1 className="font-diary text-2xl font-bold text-[#3D3A35]">설정</h1>
        <p className="text-xs text-[#787166] mt-0.5">
          매일 마음을 돌보는 알림 시간과 나만의 환경을 가꿔보세요
        </p>
      </header>

      {/* ★ Daily Evening Gratitude Notification Settings */}
      <section
        aria-label="매일 저녁 감사 알림 설정"
        className="p-5 rounded-2xl bg-white border border-[#EAE3D6] space-y-4"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-[#EAF0EC] text-[#52725D] flex items-center justify-center shrink-0">
              <Bell className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-[#3D3A35]">
                매일 저녁 감사 알림
              </h2>
              <p className="text-xs text-[#787166] mt-0.5 leading-relaxed">
                정해진 시간에 “오늘의 감사함을 돌아볼까요?” 알림을 보내드려요
              </p>
            </div>
          </div>

          {/* Toggle Switch */}
          <button
            type="button"
            role="switch"
            aria-checked={reminderSettings.enabled}
            aria-label="매일 저녁 감사 알림 켜기 또는 끄기"
            onClick={onToggleReminder}
            className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6B8E78] ${
              reminderSettings.enabled ? 'bg-[#6B8E78]' : 'bg-[#DDD5C7]'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs transition duration-200 ${
                reminderSettings.enabled ? 'translate-x-5' : 'translate-x-0.5'
              }`}
            />
          </button>
        </div>

        {/* Time Picker & Presets */}
        <div className="p-4 rounded-2xl bg-[#FDFBF7] border border-[#EFE8DC] space-y-3">
          <div className="flex items-center justify-between gap-3">
            <label
              htmlFor="reminder-time"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-[#595248]"
            >
              <Clock className="w-3.5 h-3.5 text-[#6B8E78]" aria-hidden="true" />
              <span>알림 받을 시간</span>
            </label>
            <input
              id="reminder-time"
              type="time"
              value={reminderSettings.time}
              onChange={(e) => onChangeReminderTime(e.target.value)}
              className="min-h-[38px] px-3 py-1.5 rounded-xl bg-white border border-[#E2D9C8] text-xs font-semibold text-[#3D3A35] tabular-nums focus:outline-none focus:border-[#6B8E78]"
            />
          </div>

          <div className="flex items-center gap-1.5">
            {EVENING_TIME_PRESETS.map((preset) => {
              const active = reminderSettings.time === preset.value;
              return (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => onChangeReminderTime(preset.value)}
                  className={`flex-1 min-h-[36px] px-2.5 py-1.5 rounded-xl text-xs font-medium transition-colors whitespace-nowrap ${
                    active
                      ? 'bg-[#6B8E78] text-white'
                      : 'bg-white border border-[#EAE3D6] text-[#6B645A] hover:bg-[#F5EFE6]'
                  }`}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>

          <div className="pt-1 flex items-center justify-between gap-2 text-xs text-[#787166]">
            <span>
              {reminderSettings.enabled
                ? `매일 ${formatKoreanClock(reminderSettings.time)}에 다정히 알려드릴게요`
                : '알림이 꺼져 있어요'}
            </span>
          </div>
        </div>

        {/* Permission Status & Preview Trigger */}
        {notificationPermission === 'unsupported' && (
          <div className="p-3.5 rounded-xl bg-[#F5EFE6] text-xs text-[#6B5D4D] leading-relaxed">
            현재 브라우저 환경에서는 시스템 푸시 알림 API가 제한되어 있어요. 대신 앱이 열려 있을 때 정해진 시간에 따뜻한 안내 메시지로 알려드릴게요.
          </div>
        )}

        {notificationPermission === 'denied' && (
          <div className="p-3.5 rounded-xl bg-[#F5EFE6] border border-[#D4A373]/50 text-xs text-[#6B5D4D] leading-relaxed">
            브라우저 알림 권한이 차단되어 있어요. 브라우저 주소창 왼쪽의 사이트 설정에서 알림 권한을 ‘허용’으로 바꾸면 저녁 푸시 알림을 받을 수 있어요.
          </div>
        )}

        <div className="flex items-center justify-between gap-3 pt-1">
          <span className="text-[11px] text-[#8C8478]">
            {notificationPermission === 'granted'
              ? '브라우저 알림 권한이 허용되어 있어요'
              : notificationPermission === 'default'
              ? '알림을 켜면 브라우저 권한을 요청해요'
              : ''}
          </span>
          <button
            type="button"
            onClick={onSendTestNotification}
            className="min-h-[40px] px-3.5 py-2 rounded-xl bg-[#F5EFE6] hover:bg-[#ECE3D5] text-xs font-medium text-[#5D564C] inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-colors"
          >
            <Send className="w-3.5 h-3.5 text-[#6B8E78]" aria-hidden="true" />
            <span>알림 미리보기</span>
          </button>
        </div>
      </section>

      {/* Safe Mode & Guide */}
      <section className="p-5 rounded-2xl bg-white border border-[#EAE3D6] space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F5EFE6] text-[#8C6D46] flex items-center justify-center shrink-0">
              {isSafeMode ? (
                <EyeOff className="w-5 h-5" aria-hidden="true" />
              ) : (
                <Eye className="w-5 h-5" aria-hidden="true" />
              )}
            </div>
            <div>
              <h2 className="text-sm font-semibold text-[#3D3A35]">
                안심 모드 (금액 가리기)
              </h2>
              <p className="text-xs text-[#787166] mt-0.5 leading-relaxed">
                숫자 스트레스를 덜고 감사 문장만 편안하게 읽을 수 있어요
              </p>
            </div>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={isSafeMode}
            aria-label="안심 모드 켜기 또는 끄기"
            onClick={onToggleSafeMode}
            className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6B8E78] ${
              isSafeMode ? 'bg-[#6B8E78]' : 'bg-[#DDD5C7]'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs transition duration-200 ${
                isSafeMode ? 'translate-x-5' : 'translate-x-0.5'
              }`}
            />
          </button>
        </div>

        <div className="h-px bg-[#F2ECE1]" />

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#EAF0EC] text-[#52725D] flex items-center justify-center shrink-0">
              <BookOpenCheck className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-[#3D3A35]">
                감사 기록 작성 가이드
              </h2>
              <p className="text-xs text-[#787166] mt-0.5">
                따뜻한 기록 팁과 예시 문구 3가지 보기
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenGuide}
            className="min-h-[40px] px-3.5 py-2 rounded-xl bg-[#EAF0EC] hover:bg-[#DCE7DF] text-xs font-semibold text-[#52725D] whitespace-nowrap shrink-0 transition-colors"
          >
            열어보기
          </button>
        </div>
      </section>

      {/* Personal Money Affirmation Editor */}
      <section className="p-5 rounded-2xl bg-white border border-[#EAE3D6] space-y-3">
        <div>
          <h2 className="text-sm font-semibold text-[#3D3A35]">
            나만의 긍정 확언 문구
          </h2>
          <p className="text-xs text-[#787166] mt-0.5">
            홈 화면 상단 배너에서 나를 다독여주는 문장이에요
          </p>
        </div>

        <form onSubmit={handleSaveAffirmation} className="space-y-2.5">
          <textarea
            rows={2}
            value={draftAffirmation}
            onChange={(e) => setDraftAffirmation(e.target.value)}
            aria-label="나만의 긍정 확언 문구"
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#FDFBF7] border border-[#E6DEC8] text-xs text-[#3D3A35] leading-relaxed resize-none focus:outline-none focus:border-[#6B8E78]"
          />
          <div className="flex flex-wrap gap-1.5">
            {POSITIVE_AFFIRMATIONS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setDraftAffirmation(preset);
                  onChangeAffirmation(preset);
                  onNotify('추천 확언으로 변경했어요.');
                }}
                className="px-2.5 py-1.5 rounded-lg bg-[#F5EFE6] hover:bg-[#ECE3D5] text-[11px] text-[#6B5D4D] transition-colors"
              >
                추천 {idx + 1}
              </button>
            ))}
          </div>
          <button
            type="submit"
            className="w-full min-h-[44px] px-4 py-2 rounded-xl bg-[#6B8E78] hover:bg-[#5B7D67] text-white text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-colors"
          >
            <Check className="w-3.5 h-3.5" aria-hidden="true" />
            <span>확언 저장하기</span>
          </button>
        </form>
      </section>

      {/* Data Management */}
      <section className="p-5 rounded-2xl bg-white border border-[#EAE3D6] space-y-3">
        <div>
          <h2 className="text-sm font-semibold text-[#3D3A35]">기록 데이터 관리</h2>
          <p className="text-xs text-[#787166] mt-0.5">
            모든 감사 기록과 알림 설정은 이 브라우저에 저장됩니다
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onResetSample}
            className="flex-1 min-h-[42px] px-3 py-2 rounded-xl bg-[#F5EFE6] hover:bg-[#ECE3D5] text-xs font-medium text-[#5D564C] inline-flex items-center justify-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            <span>예시 기록 채우기</span>
          </button>

          {!confirmClear ? (
            <button
              type="button"
              onClick={() => setConfirmClear(true)}
              className="flex-1 min-h-[42px] px-3 py-2 rounded-xl bg-white hover:bg-[#FAF7F2] border border-[#EAE3D6] text-xs font-medium text-[#787166] transition-colors"
            >
              기록 모두 비우기
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                onClearAll();
                setConfirmClear(false);
              }}
              className="flex-1 min-h-[42px] px-3 py-2 rounded-xl bg-[#D4A373] text-xs font-semibold text-white transition-colors"
            >
              정말 비울게요
            </button>
          )}
        </div>
      </section>
    </div>
  );
}
