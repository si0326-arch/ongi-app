import { AnimatePresence, motion } from 'motion/react';
import {
  BookOpenCheck,
  Check,
  ChevronDown,
  Heart,
  Plus,
  X,
} from 'lucide-react';
import { FormEvent, useEffect, useState } from 'react';
import {
  ANXIOUS_REFRAME_MESSAGE,
  CATEGORY_MAP,
  EXPENSE_CATEGORIES,
  EXPENSE_MOODS,
  GratitudeTheme,
  WRITING_GUIDE_EXAMPLES,
  WRITING_GUIDE_PRINCIPLES,
  WritingGuideExample,
} from '../data/mindsetData';
import { ExpenseCategory, ExpenseItem, ExpenseMood } from '../types/gratitude';
import { formatAbundanceKRW, toLocalDateInputValue } from '../utils/format';
import { CategoryIcon } from './CategoryIcon';

interface EntryComposerSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: Omit<ExpenseItem, 'id'>, existingId?: string) => void;
  editingItem?: ExpenseItem | null;
  guidePreset?: WritingGuideExample | null;
  themePreset?: GratitudeTheme | null;
}

const AMOUNT_PRESETS = [1000, 5000, 10000, 50000];

export function EntryComposerSheet({
  isOpen,
  onClose,
  onSave,
  editingItem,
  guidePreset,
  themePreset,
}: EntryComposerSheetProps) {
  const [amountText, setAmountText] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('식사/배달');
  const [mood, setMood] = useState<ExpenseMood>('grateful');
  const [valueTags, setValueTags] = useState<string[]>(['#편리함', '#시간절약']);
  const [customTagInput, setCustomTagInput] = useState('');
  const [gratitudeNote, setGratitudeNote] = useState('');
  const [dateInput, setDateInput] = useState(() =>
    toLocalDateInputValue(new Date().toISOString())
  );
  const [showInlineGuide, setShowInlineGuide] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    if (editingItem) {
      setAmountText(String(editingItem.amount));
      setCategory(editingItem.category);
      setMood(editingItem.mood);
      setValueTags(editingItem.valueTags);
      setGratitudeNote(editingItem.gratitudeNote);
      setDateInput(toLocalDateInputValue(editingItem.createdAt));
    } else if (guidePreset) {
      setAmountText('');
      setCategory(guidePreset.category);
      setMood('grateful');
      setValueTags(guidePreset.tags);
      setGratitudeNote(guidePreset.noteText);
      setDateInput(toLocalDateInputValue(new Date().toISOString()));
    } else if (themePreset) {
      setAmountText('');
      setCategory(themePreset.suggestedCategory);
      setMood('grateful');
      setValueTags(themePreset.suggestedTags);
      setGratitudeNote(themePreset.starterNote);
      setDateInput(toLocalDateInputValue(new Date().toISOString()));
    } else {
      setAmountText('');
      setCategory('식사/배달');
      setMood('grateful');
      setValueTags(CATEGORY_MAP['식사/배달'].suggestedTags.slice(0, 2));
      setGratitudeNote('');
      setDateInput(toLocalDateInputValue(new Date().toISOString()));
    }
    setCustomTagInput('');
    setShowInlineGuide(false);
    setErrorMessage('');
  }, [isOpen, editingItem, guidePreset, themePreset]);

  const activeCategoryMeta = CATEGORY_MAP[category];
  const numericAmount = Number(amountText.replace(/[^0-9]/g, '')) || 0;

  const handleSelectCategory = (nextCat: ExpenseCategory) => {
    setCategory(nextCat);
    if (!editingItem) {
      // Refresh default selected tags gently to match the chosen category
      setValueTags(CATEGORY_MAP[nextCat].suggestedTags.slice(0, 2));
    }
  };

  const handleToggleTag = (tag: string) => {
    setValueTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleAddCustomTag = () => {
    const cleaned = customTagInput.trim().replace(/^#+/, '');
    if (!cleaned) return;
    const formatted = `#${cleaned}`;
    if (!valueTags.includes(formatted)) {
      setValueTags((prev) => [...prev, formatted]);
    }
    setCustomTagInput('');
  };

  const handleAddPresetAmount = (preset: number) => {
    setAmountText(String(numericAmount + preset));
    if (errorMessage) setErrorMessage('');
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (numericAmount <= 0) {
      setErrorMessage('내가 누린 풍요의 금액을 입력해 주세요.');
      return;
    }

    const finalNote =
      gratitudeNote.trim() || activeCategoryMeta.recommendedNotes[0];

    const finalTags =
      valueTags.length > 0 ? valueTags : [activeCategoryMeta.suggestedTags[0]];

    const now = new Date();
    const [y, m, d] = dateInput.split('-').map(Number);
    const createdDate = new Date(
      y,
      (m || 1) - 1,
      d || 1,
      now.getHours(),
      now.getMinutes(),
      now.getSeconds()
    );

    const createdAt = editingItem
      ? toLocalDateInputValue(editingItem.createdAt) === dateInput
        ? editingItem.createdAt
        : createdDate.toISOString()
      : createdDate.toISOString();

    onSave(
      {
        amount: numericAmount,
        category,
        valueTags: finalTags,
        gratitudeNote: finalNote,
        mood,
        createdAt,
      },
      editingItem?.id
    );
    onClose();
  };

  const allDisplayTags = Array.from(
    new Set([...activeCategoryMeta.suggestedTags, ...valueTags])
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#3D3A35]/35 backdrop-blur-[2px]"
            aria-hidden="true"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="composer-sheet-title"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 320 }}
            className="relative w-full max-w-md max-h-[92dvh] flex flex-col bg-[#FDFBF7] rounded-t-3xl shadow-2xl border-t border-[#EAE3D6] overflow-hidden"
          >
            {/* Drag Handle */}
            <div className="pt-3 pb-1 flex justify-center shrink-0">
              <div className="w-10 h-1.5 rounded-full bg-[#DDD5C7]" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-3 border-b border-[#EFE8DC] shrink-0">
              <div>
                <h2
                  id="composer-sheet-title"
                  className="font-diary text-lg font-bold text-[#3D3A35]"
                >
                  {editingItem ? '감사의 기록 다듬기' : '오늘의 감사 기록하기'}
                </h2>
                <p className="text-xs text-[#787166] mt-0.5">
                  내가 쓴 금액을 고마운 가치와 온기로 바꿔 적어요
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="닫기"
                className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full text-[#787166] hover:bg-[#F5EFE6] hover:text-[#3D3A35] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Body */}
            <form
              onSubmit={handleSubmit}
              className="flex-1 overflow-y-auto px-6 py-5 space-y-5"
            >
              {/* 1. Amount with auto comma formatting */}
              <div>
                <div className="flex items-baseline justify-between mb-2">
                  <label
                    htmlFor="expense-amount"
                    className="text-sm font-medium text-[#3D3A35]"
                  >
                    얼마의 풍요를 누렸나요?
                  </label>
                  {numericAmount > 0 && (
                    <span className="text-xs font-medium text-[#52725D] tabular-nums">
                      {formatAbundanceKRW(numericAmount)}
                    </span>
                  )}
                </div>
                <div className="relative">
                  <input
                    id="expense-amount"
                    type="text"
                    inputMode="numeric"
                    value={numericAmount > 0 ? numericAmount.toLocaleString('ko-KR') : ''}
                    onChange={(e) => {
                      const digits = e.target.value.replace(/[^0-9]/g, '');
                      setAmountText(digits);
                      if (errorMessage) setErrorMessage('');
                    }}
                    placeholder="0"
                    className="w-full min-h-[52px] pl-4 pr-10 py-3 rounded-2xl bg-white border border-[#E6DEC8] text-[#3D3A35] text-xl font-bold tabular-nums placeholder:text-[#C5BEB2] focus:outline-none focus:border-[#6B8E78] focus:ring-2 focus:ring-[#6B8E78]/15 transition-colors"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-[#787166]">
                    원
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mt-2.5 overflow-x-auto pb-1">
                  {AMOUNT_PRESETS.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => handleAddPresetAmount(preset)}
                      className="min-h-[36px] px-3 py-1.5 rounded-xl bg-[#F5EFE6] hover:bg-[#ECE3D5] text-xs font-medium text-[#6B5D4D] tabular-nums whitespace-nowrap shrink-0 transition-colors"
                    >
                      +{preset.toLocaleString('ko-KR')}원
                    </button>
                  ))}
                  {numericAmount > 0 && (
                    <button
                      type="button"
                      onClick={() => setAmountText('')}
                      className="min-h-[36px] px-3 py-1.5 rounded-xl bg-white border border-[#EAE3D6] text-xs text-[#8C8478] hover:text-[#3D3A35] whitespace-nowrap shrink-0 transition-colors"
                    >
                      지우기
                    </button>
                  )}
                </div>
              </div>

              {/* 2. Category Selection */}
              <div>
                <span className="block text-sm font-medium text-[#3D3A35] mb-2">
                  어떤 영역의 풍요였나요?
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {EXPENSE_CATEGORIES.map((cat) => {
                    const isSelected = category === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => handleSelectCategory(cat.id)}
                        className={`min-h-[46px] flex items-center gap-2.5 px-3 py-2 rounded-2xl text-left border transition-all duration-150 ${
                          isSelected
                            ? 'bg-[#EAF0EC] border-[#6B8E78] text-[#3D3A35]'
                            : 'bg-white border-[#EAE3D6] text-[#6B645A] hover:border-[#D4CBB8]'
                        }`}
                      >
                        <div
                          className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
                            isSelected
                              ? 'bg-[#6B8E78] text-white'
                              : `${cat.accentBg} ${cat.accentText}`
                          }`}
                        >
                          <CategoryIcon category={cat.id} className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-xs font-semibold truncate">
                          {cat.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
                <p className="text-xs text-[#6B8E78] mt-2 pl-1">
                  {activeCategoryMeta.description}
                </p>
              </div>

              {/* 3. Mood Selection */}
              <div>
                <span className="block text-sm font-medium text-[#3D3A35] mb-2">
                  지금 마음의 느낌은 어떤가요?
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {EXPENSE_MOODS.map((m) => {
                    const isSelected = mood === m.id;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setMood(m.id)}
                        className={`min-h-[44px] px-2.5 py-2 rounded-xl text-xs font-medium border text-center transition-colors ${
                          isSelected
                            ? m.id === 'anxious'
                              ? 'bg-[#F5EFE6] border-[#D4A373] text-[#6B4E2E]'
                              : 'bg-[#EAF0EC] border-[#6B8E78] text-[#3D3A35]'
                            : 'bg-white border-[#EAE3D6] text-[#787166] hover:border-[#D4CBB8]'
                        }`}
                      >
                        {m.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 4. Value Tags Selection */}
              <div>
                <span className="block text-sm font-medium text-[#3D3A35] mb-2">
                  내가 얻은 가치 태그
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {allDisplayTags.map((tag) => {
                    const isSelected = valueTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => handleToggleTag(tag)}
                        className={`min-h-[36px] px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors whitespace-nowrap ${
                          isSelected
                            ? 'bg-[#6B8E78] border-[#6B8E78] text-white'
                            : 'bg-white border-[#EAE3D6] text-[#6B645A] hover:bg-[#F5EFE6]'
                        }`}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="text"
                    value={customTagInput}
                    onChange={(e) => setCustomTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddCustomTag();
                      }
                    }}
                    placeholder="직접 태그 추가 (예: 마음충전)"
                    className="flex-1 min-h-[38px] px-3 py-1.5 rounded-xl bg-white border border-[#EAE3D6] text-xs text-[#3D3A35] placeholder:text-[#ABA396] focus:outline-none focus:border-[#6B8E78]"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomTag}
                    className="min-h-[38px] px-3 py-1.5 rounded-xl bg-[#F5EFE6] hover:bg-[#ECE3D5] text-xs font-medium text-[#5D564C] inline-flex items-center gap-1 whitespace-nowrap shrink-0 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>추가</span>
                  </button>
                </div>
              </div>

              {/* ★ Anxious / Regret Care Reframing Banner (above gratitude input) */}
              <AnimatePresence>
                {mood === 'anxious' && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.2 }}
                    className="p-4 rounded-2xl bg-[#F5EFE6] border border-[#D4A373]/60 space-y-1.5"
                  >
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-[#8C6D46]">
                      <Heart className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>괜찮아요, 마음을 먼저 안아주세요</span>
                    </div>
                    <p className="font-diary text-[13.5px] leading-relaxed text-[#4F4940]">
                      {ANXIOUS_REFRAME_MESSAGE}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* 5. Gratitude Note + Category-Based Auto-Recommended Sentence Chips */}
              <div>
                <label
                  htmlFor="gratitude-note"
                  className="block text-sm font-medium text-[#3D3A35] mb-2"
                >
                  오늘의 감사 한 줄
                </label>

                {/* Recommended Sentence Chips */}
                <div className="mb-2.5 space-y-1.5">
                  <p className="text-[11px] font-medium text-[#6B8E78]">
                    ‘{category}’ 추천 감사 문장 · 누르면 바로 채워져요
                  </p>
                  <div className="flex flex-col gap-1.5">
                    {activeCategoryMeta.recommendedNotes.map((sentence, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setGratitudeNote(sentence)}
                        className={`w-full text-left px-3.5 py-2.5 rounded-xl border text-xs leading-relaxed transition-colors ${
                          gratitudeNote === sentence
                            ? 'bg-[#EAF0EC] border-[#6B8E78] text-[#3D3A35] font-medium'
                            : 'bg-white hover:bg-[#FAF6EE] border-[#EAE3D6] text-[#595248]'
                        }`}
                      >
                        “{sentence}”
                      </button>
                    ))}
                  </div>
                </div>

                <textarea
                  id="gratitude-note"
                  rows={3}
                  value={gratitudeNote}
                  onChange={(e) => setGratitudeNote(e.target.value)}
                  placeholder={activeCategoryMeta.recommendedNotes[0]}
                  className="w-full px-4 py-3 rounded-2xl bg-white border border-[#E6DEC8] text-[#3D3A35] placeholder:text-[#ABA396] text-sm leading-relaxed resize-none focus:outline-none focus:border-[#6B8E78] focus:ring-2 focus:ring-[#6B8E78]/15 transition-colors"
                />

                {/* Collapsible Gratitude Writing Guide */}
                <div className="mt-2.5">
                  <button
                    type="button"
                    onClick={() => setShowInlineGuide((prev) => !prev)}
                    aria-expanded={showInlineGuide}
                    className="w-full min-h-[40px] px-3.5 py-2 rounded-xl bg-[#F5EFE6]/75 hover:bg-[#F5EFE6] border border-[#E8DFCE] flex items-center justify-between text-xs font-medium text-[#5D564C] transition-colors"
                  >
                    <span className="inline-flex items-center gap-1.5">
                      <BookOpenCheck
                        className="w-3.5 h-3.5 text-[#6B8E78]"
                        aria-hidden="true"
                      />
                      <span>감사 기록 작성 가이드 보기</span>
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#8C8478] transition-transform duration-150 ${
                        showInlineGuide ? 'rotate-180' : ''
                      }`}
                      aria-hidden="true"
                    />
                  </button>

                  {showInlineGuide && (
                    <div className="mt-2 p-4 rounded-2xl bg-[#F5EFE6]/60 border border-[#E6DEC8] space-y-3">
                      <div className="space-y-2">
                        {WRITING_GUIDE_PRINCIPLES.map((guide) => (
                          <div
                            key={guide.step}
                            className="text-xs text-[#595248] leading-relaxed"
                          >
                            <span className="font-semibold text-[#3D3A35]">
                              {guide.step}. {guide.title}
                            </span>
                            <span className="block text-[11px] text-[#787166] mt-0.5">
                              {guide.description}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="h-px bg-[#E6DEC8]" />
                      <div className="space-y-1.5">
                        <p className="text-xs font-semibold text-[#8C6D46]">
                          예시 문구 (누르면 바로 채워져요)
                        </p>
                        {WRITING_GUIDE_EXAMPLES.map((ex) => (
                          <button
                            key={ex.id}
                            type="button"
                            onClick={() => {
                              setCategory(ex.category);
                              setValueTags(ex.tags);
                              setGratitudeNote(ex.noteText);
                              setShowInlineGuide(false);
                            }}
                            className="w-full text-left p-2.5 rounded-xl bg-white hover:bg-[#FAF7F0] border border-[#EAE3D6] text-xs text-[#3D3A35] leading-relaxed transition-colors"
                          >
                            {ex.formattedText}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Date Selection */}
              <div className="flex items-center justify-between pt-1">
                <label htmlFor="expense-date" className="text-xs text-[#787166]">
                  기록 날짜
                </label>
                <input
                  id="expense-date"
                  type="date"
                  value={dateInput}
                  onChange={(e) => setDateInput(e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-white border border-[#EAE3D6] text-xs text-[#3D3A35] tabular-nums focus:outline-none focus:border-[#6B8E78]"
                />
              </div>

              {errorMessage && (
                <div
                  role="alert"
                  className="px-4 py-3 rounded-2xl bg-[#F5EFE6] border border-[#D4A373]/60 text-xs text-[#785733]"
                >
                  {errorMessage}
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-2 pb-4">
                <button
                  type="submit"
                  className="w-full min-h-[50px] px-5 py-3 rounded-2xl bg-[#6B8E78] hover:bg-[#5B7D67] active:scale-[0.99] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-all duration-150"
                >
                  <Check className="w-4 h-4" aria-hidden="true" />
                  <span>{editingItem ? '수정된 감사 저장하기' : '감사 마음에 담기'}</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
