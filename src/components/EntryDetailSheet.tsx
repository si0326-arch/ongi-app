import { AnimatePresence, motion } from 'motion/react';
import { Edit3, Trash2, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { CATEGORY_MAP, MOOD_MAP } from '../data/mindsetData';
import { ExpenseItem } from '../types/gratitude';
import {
  formatAbundanceKRW,
  formatKoreanDateFromISO,
  formatKoreanTimeFromISO,
} from '../utils/format';
import { CategoryIcon } from './CategoryIcon';

interface EntryDetailSheetProps {
  item: ExpenseItem | null;
  isSafeMode: boolean;
  onClose: () => void;
  onEdit: (item: ExpenseItem) => void;
  onDelete: (id: string) => void;
}

export function EntryDetailSheet({
  item,
  isSafeMode,
  onClose,
  onEdit,
  onDelete,
}: EntryDetailSheetProps) {
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  useEffect(() => {
    setConfirmingDelete(false);
  }, [item?.id]);

  return (
    <AnimatePresence>
      {item && (
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
            aria-labelledby="detail-sheet-title"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 320 }}
            className="relative w-full max-w-md bg-[#FDFBF7] rounded-t-3xl shadow-2xl border-t border-[#EAE3D6] px-6 pb-8 pt-3"
          >
            <div className="flex justify-center mb-3">
              <div className="w-10 h-1.5 rounded-full bg-[#DDD5C7]" />
            </div>

            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${CATEGORY_MAP[item.category].accentBg} ${CATEGORY_MAP[item.category].accentText}`}
                >
                  <CategoryIcon category={item.category} className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-[#787166]">
                    {formatKoreanDateFromISO(item.createdAt)} ·{' '}
                    {formatKoreanTimeFromISO(item.createdAt)}
                  </div>
                  <h2
                    id="detail-sheet-title"
                    className="font-diary text-lg font-bold text-[#3D3A35] mt-0.5"
                  >
                    {item.category}
                  </h2>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="닫기"
                className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full text-[#787166] hover:bg-[#F5EFE6] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-5 p-5 rounded-2xl bg-white border border-[#EAE3D6]">
              <div className="flex items-baseline justify-between">
                <span className="text-xs text-[#787166]">내가 누린 풍요</span>
                <span className="text-2xl font-bold text-[#3D3A35] tabular-nums">
                  {formatAbundanceKRW(item.amount, isSafeMode)}
                </span>
              </div>
              <div className="h-px bg-[#F0E9DD] my-4" />
              <p className="font-diary text-base leading-relaxed text-[#3D3A35]">
                “{item.gratitudeNote}”
              </p>
              <div className="mt-4 text-xs text-[#787166] leading-relaxed">
                {MOOD_MAP[item.mood].label}
                {item.valueTags.length > 0 && ` · ${item.valueTags.join(' ')}`}
              </div>
            </div>

            {!confirmingDelete ? (
              <div className="flex items-center gap-3 mt-5">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onEdit(item);
                  }}
                  className="flex-1 min-h-[46px] px-4 py-2.5 rounded-2xl bg-[#6B8E78] hover:bg-[#5B7D67] text-white text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                >
                  <Edit3 className="w-4 h-4" aria-hidden="true" />
                  <span>내용 다듬기</span>
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmingDelete(true)}
                  className="min-h-[46px] px-4 py-2.5 rounded-2xl bg-[#F5EFE6] hover:bg-[#EAE1D2] text-[#6B645A] text-sm font-medium flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Trash2 className="w-4 h-4" aria-hidden="true" />
                  <span>비우기</span>
                </button>
              </div>
            ) : (
              <div className="mt-5 p-4 rounded-2xl bg-[#F5EFE6] border border-[#E2D8C7] space-y-3">
                <p className="text-xs text-[#595248] leading-relaxed">
                  이 감사의 기록을 목록에서 조용히 비울까요? 언제든 다시 새로운 순간을 적을 수 있어요.
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setConfirmingDelete(false)}
                    className="flex-1 min-h-[44px] rounded-xl bg-white border border-[#DED5C5] text-xs font-medium text-[#3D3A35] hover:bg-[#FAF7F2] transition-colors"
                  >
                    그대로 둘게요
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onDelete(item.id);
                      onClose();
                    }}
                    className="flex-1 min-h-[44px] rounded-xl bg-[#D4A373] hover:bg-[#C49261] text-xs font-semibold text-white transition-colors"
                  >
                    네, 비울게요
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
