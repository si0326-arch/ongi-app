import { motion } from 'motion/react';
import {
  BookOpenCheck,
  Eye,
  EyeOff,
  Feather,
  PenLine,
  RefreshCw,
  Sun,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import {
  CATEGORY_MAP,
  DAILY_GRATITUDE_THEMES,
  EXPENSE_CATEGORIES,
  GratitudeTheme,
  MOOD_MAP,
  POSITIVE_AFFIRMATIONS,
} from '../data/mindsetData';
import { ExpenseCategory, ExpenseItem } from '../types/gratitude';
import {
  formatAbundanceKRW,
  formatKoreanDateFromISO,
  formatKoreanTimeFromISO,
  getCurrentMonthKey,
  getGreetingByHour,
  getMonthKeyFromISO,
} from '../utils/format';
import { CategoryIcon } from './CategoryIcon';

interface HomeFeedViewProps {
  items: ExpenseItem[];
  affirmation: string;
  isSafeMode: boolean;
  onToggleSafeMode: () => void;
  onChangeAffirmation: (next: string) => void;
  onOpenComposer: (themePreset?: GratitudeTheme) => void;
  onOpenGuide: () => void;
  onSelectItem: (item: ExpenseItem) => void;
}

function getDayOfYearIndex(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const day = Math.floor(diff / (1000 * 60 * 60 * 24));
  return day % DAILY_GRATITUDE_THEMES.length;
}

export function HomeFeedView({
  items,
  affirmation,
  isSafeMode,
  onToggleSafeMode,
  onChangeAffirmation,
  onOpenComposer,
  onOpenGuide,
  onSelectItem,
}: HomeFeedViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<'전체' | ExpenseCategory>('전체');
  const [themeIndex, setThemeIndex] = useState<number>(() => getDayOfYearIndex());
  const greeting = getGreetingByHour();
  const currentMonthKey = getCurrentMonthKey();

  const activeTheme = DAILY_GRATITUDE_THEMES[themeIndex];

  const currentMonthItems = useMemo(
    () => items.filter((item) => getMonthKeyFromISO(item.createdAt) === currentMonthKey),
    [items, currentMonthKey]
  );

  const monthTotal = useMemo(
    () => currentMonthItems.reduce((sum, item) => sum + item.amount, 0),
    [currentMonthItems]
  );

  const sortedFilteredItems = useMemo(() => {
    const base =
      selectedCategory === '전체'
        ? items
        : items.filter((item) => item.category === selectedCategory);
    return [...base].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [items, selectedCategory]);

  const handleCycleAffirmation = () => {
    const currentIdx = POSITIVE_AFFIRMATIONS.indexOf(affirmation);
    const nextIdx = (currentIdx + 1) % POSITIVE_AFFIRMATIONS.length;
    onChangeAffirmation(POSITIVE_AFFIRMATIONS[nextIdx]);
  };

  const handleCycleTheme = () => {
    setThemeIndex((prev) => (prev + 1) % DAILY_GRATITUDE_THEMES.length);
  };

  return (
    <div className="space-y-5 pb-28">
      {/* Top Greeting & Guide Button */}
      <header className="flex items-start justify-between gap-3 pt-2">
        <div>
          <h1 className="font-diary text-2xl font-bold text-[#3D3A35] tracking-tight">
            온기
          </h1>
          <p className="text-xs text-[#787166] mt-0.5">{greeting}</p>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={onOpenGuide}
            className="min-h-[44px] px-3 py-2 rounded-2xl bg-[#F5EFE6] hover:bg-[#ECE3D5] text-xs font-medium text-[#5D564C] inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-colors"
          >
            <BookOpenCheck className="w-4 h-4 text-[#6B8E78]" aria-hidden="true" />
            <span>작성 가이드</span>
          </button>
        </div>
      </header>

      {/* Positive Money Affirmation Banner */}
      <section
        aria-label="돈에 대한 긍정 확언"
        className="p-4 rounded-2xl bg-[#F5EFE6] border border-[#EAE0D0] flex items-start justify-between gap-3"
      >
        <div className="min-w-0">
          <p className="text-[11px] font-semibold text-[#8C6D46] mb-1">
            오늘의 다정한 시선
          </p>
          <p className="font-diary text-[14px] leading-relaxed text-[#3D3A35]">
            “{affirmation}”
          </p>
        </div>
        <button
          type="button"
          onClick={handleCycleAffirmation}
          aria-label="다른 긍정 확언 보기"
          title="다른 긍정 확언 보기"
          className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-xl text-[#8C6D46] hover:bg-[#EAE0D0]/70 transition-colors shrink-0"
        >
          <RefreshCw className="w-4 h-4" aria-hidden="true" />
        </button>
      </section>

      {/* ★ 오늘의 추천 감사 테마 Question Card */}
      <section
        aria-label="오늘의 추천 감사 테마"
        className="p-5 rounded-2xl bg-[#EAF0EC]/75 border border-[#D4E1D8] space-y-3"
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#52725D]">
            <Sun className="w-4 h-4 text-[#6B8E78]" aria-hidden="true" />
            <span>오늘의 추천 감사 테마</span>
            <span className="text-[#8CA394]" aria-hidden="true">·</span>
            <span className="font-medium text-[#6B8E78]">{activeTheme.themeLabel}</span>
          </div>
          <button
            type="button"
            onClick={handleCycleTheme}
            className="min-h-[36px] px-2.5 py-1 rounded-xl bg-white/80 hover:bg-white text-[11px] font-medium text-[#52725D] inline-flex items-center gap-1 whitespace-nowrap shrink-0 transition-colors"
          >
            <RefreshCw className="w-3 h-3" aria-hidden="true" />
            <span>다른 질문</span>
          </button>
        </div>

        <div className="space-y-1.5">
          <h2 className="font-diary text-[17px] font-bold text-[#3D3A35] leading-snug">
            “{activeTheme.question}”
          </h2>
          <p className="text-xs text-[#59645C] leading-relaxed">
            {activeTheme.helperText}
          </p>
        </div>

        <button
          type="button"
          onClick={() => onOpenComposer(activeTheme)}
          className="w-full min-h-[42px] px-4 py-2 rounded-xl bg-white hover:bg-[#FAF8F4] border border-[#CFE0D4] text-xs font-semibold text-[#52725D] inline-flex items-center justify-center gap-1.5 transition-colors"
        >
          <PenLine className="w-3.5 h-3.5" aria-hidden="true" />
          <span>이 테마로 감사 기록하기</span>
        </button>
      </section>

      {/* Monthly Abundance Summary Card + Safe Mode Toggle */}
      <section
        aria-label="이번 달 내가 누린 풍요"
        className="p-6 rounded-2xl bg-white border border-[#EAE3D6] shadow-[0_2px_12px_rgba(61,58,53,0.03)]"
      >
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-medium text-[#6B8E78]">
            이번 달 내가 누린 풍요
          </span>

          {/* ★ Safe Mode Toggle Button */}
          <button
            type="button"
            onClick={onToggleSafeMode}
            aria-pressed={isSafeMode}
            className={`min-h-[38px] px-3 py-1.5 rounded-xl text-xs font-medium inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-colors border ${
              isSafeMode
                ? 'bg-[#EAF0EC] border-[#6B8E78]/40 text-[#52725D]'
                : 'bg-[#FAF7F2] border-[#EAE3D6] text-[#787166] hover:text-[#3D3A35]'
            }`}
          >
            {isSafeMode ? (
              <>
                <EyeOff className="w-3.5 h-3.5" aria-hidden="true" />
                <span>안심 모드 켜짐</span>
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5" aria-hidden="true" />
                <span>안심 모드</span>
              </>
            )}
          </button>
        </div>

        <div className="mt-3 flex items-baseline justify-between gap-3">
          <p
            className={`text-3xl font-bold text-[#3D3A35] tabular-nums tracking-tight transition-all duration-200 ${
              isSafeMode ? 'tracking-wider text-[#6B8E78]' : ''
            }`}
          >
            {formatAbundanceKRW(monthTotal, isSafeMode)}
          </p>
          <span className="text-xs text-[#8C8478] tabular-nums whitespace-nowrap">
            감사 {currentMonthItems.length}건
          </span>
        </div>

        <p className="mt-2.5 text-xs text-[#6B645A] leading-relaxed">
          {isSafeMode
            ? '숫자에 대한 부담을 잠시 내려놓고, 내가 남긴 감사의 문장만 천천히 읽어보세요.'
            : currentMonthItems.length > 0
            ? `이번 달 ${currentMonthItems.length}번의 고마운 순간과 가치를 삶에 초대했어요.`
            : '첫 번째 감사를 기록하면 이번 달 내가 누린 풍요가 이곳에 모입니다.'}
        </p>

        <button
          type="button"
          onClick={() => onOpenComposer()}
          className="mt-5 w-full min-h-[48px] px-5 py-3 rounded-2xl bg-[#6B8E78] hover:bg-[#5B7D67] active:scale-[0.99] text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-150"
        >
          <PenLine className="w-4 h-4" aria-hidden="true" />
          <span>오늘의 감사 기록하기</span>
        </button>
      </section>

      {/* Category Filter Buttons */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => setSelectedCategory('전체')}
          className={`min-h-[38px] px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap shrink-0 transition-colors ${
            selectedCategory === '전체'
              ? 'bg-[#6B8E78] text-white'
              : 'bg-white border border-[#EAE3D6] text-[#6B645A] hover:bg-[#F5EFE6]'
          }`}
        >
          전체 보기
        </button>
        {EXPENSE_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setSelectedCategory(cat.id)}
            className={`min-h-[38px] px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap shrink-0 transition-colors ${
              selectedCategory === cat.id
                ? 'bg-[#6B8E78] text-white'
                : 'bg-white border border-[#EAE3D6] text-[#6B645A] hover:bg-[#F5EFE6]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Gratitude Timeline List */}
      <section aria-label="오늘의 풍요 타임라인" className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-semibold text-[#3D3A35]">
            감사의 타임라인
          </h2>
          {sortedFilteredItems.length > 0 && (
            <span className="text-xs text-[#8C8478]">카드를 눌러 다듬기</span>
          )}
        </div>

        {sortedFilteredItems.length === 0 ? (
          <div className="p-7 rounded-2xl bg-white border border-[#EAE3D6] text-center space-y-3">
            <div className="w-11 h-11 rounded-2xl bg-[#EAF0EC] text-[#6B8E78] flex items-center justify-center mx-auto">
              <Feather className="w-5 h-5" aria-hidden="true" />
            </div>
            <div className="space-y-1">
              <p className="font-diary text-base font-bold text-[#3D3A35]">
                아직 이곳에 담긴 기록이 없어요
              </p>
              <p className="text-xs text-[#787166] leading-relaxed">
                오늘 나를 기쁘게 하거나 안전하게 지켜준 작은 소비 하나를 떠올려 볼까요?
              </p>
            </div>
            <button
              type="button"
              onClick={() => onOpenComposer()}
              className="inline-flex items-center justify-center min-h-[42px] px-4 py-2 rounded-xl bg-[#EAF0EC] hover:bg-[#DCE7DF] text-xs font-semibold text-[#52725D] transition-colors"
            >
              첫 감사 기록 남기기
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedFilteredItems.map((item, idx) => {
              const catMeta = CATEGORY_MAP[item.category];
              const moodMeta = MOOD_MAP[item.mood];

              return (
                <motion.button
                  key={item.id}
                  type="button"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: Math.min(idx * 0.04, 0.2) }}
                  onClick={() => onSelectItem(item)}
                  className="w-full text-left p-5 rounded-2xl bg-white hover:bg-[#FCFBF8] border border-[#EAE3D6] hover:border-[#D4CBB8] transition-colors space-y-3"
                >
                  {/* Card Top Metadata & Gentle Positive Amount */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${catMeta.accentBg} ${catMeta.accentText}`}
                      >
                        <CategoryIcon category={item.category} className="w-4 h-4" />
                      </div>
                      <div className="text-xs text-[#787166] truncate">
                        <span className="font-medium text-[#595248]">{item.category}</span>
                        <span aria-hidden="true"> · </span>
                        <span>{moodMeta.label}</span>
                      </div>
                    </div>

                    <span className="text-sm font-medium text-[#6B8E78] tabular-nums whitespace-nowrap shrink-0">
                      {formatAbundanceKRW(item.amount, isSafeMode)}
                    </span>
                  </div>

                  {/* Hero Gratitude Note */}
                  <p className="font-diary text-[15.5px] leading-[1.65] text-[#3D3A35]">
                    “{item.gratitudeNote}”
                  </p>

                  {/* Quiet Footer Metadata: Value Tags & Timestamp */}
                  <div className="flex items-center justify-between gap-2 text-xs text-[#8C8478] pt-0.5">
                    <span className="truncate text-[#8C6D46]">
                      {item.valueTags.join(' ')}
                    </span>
                    <span className="tabular-nums whitespace-nowrap shrink-0">
                      {formatKoreanDateFromISO(item.createdAt)} ·{' '}
                      {formatKoreanTimeFromISO(item.createdAt)}
                    </span>
                  </div>
                </motion.button>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
