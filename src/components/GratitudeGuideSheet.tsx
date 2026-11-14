import { AnimatePresence, motion } from 'motion/react';
import { BookOpenCheck, PenLine, X } from 'lucide-react';
import {
  WRITING_GUIDE_EXAMPLES,
  WRITING_GUIDE_PRINCIPLES,
  WritingGuideExample,
} from '../data/mindsetData';

interface GratitudeGuideSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onStartWritingWithExample?: (example?: WritingGuideExample) => void;
}

export function GratitudeGuideSheet({
  isOpen,
  onClose,
  onStartWritingWithExample,
}: GratitudeGuideSheetProps) {
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
            aria-labelledby="guide-sheet-title"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 320 }}
            className="relative w-full max-w-md max-h-[88dvh] flex flex-col bg-[#FDFBF7] rounded-t-3xl shadow-2xl border-t border-[#EAE3D6] overflow-hidden"
          >
            {/* Drag Handle */}
            <div className="pt-3 pb-1 flex justify-center shrink-0">
              <div className="w-10 h-1.5 rounded-full bg-[#DDD5C7]" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-3 border-b border-[#EFE8DC] shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#EAF0EC] text-[#52725D] flex items-center justify-center shrink-0">
                  <BookOpenCheck className="w-4 h-4" aria-hidden="true" />
                </div>
                <div>
                  <h2
                    id="guide-sheet-title"
                    className="font-diary text-lg font-bold text-[#3D3A35]"
                  >
                    감사 기록 작성 가이드
                  </h2>
                  <p className="text-xs text-[#787166]">
                    쓰는 순간의 불안을 따뜻한 고마움으로 바꾸는 연습
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="가이드 닫기"
                className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full text-[#787166] hover:bg-[#F5EFE6] hover:text-[#3D3A35] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
              <div className="p-4 rounded-2xl bg-[#F5EFE6] text-sm text-[#4F4940] leading-relaxed font-diary">
                돈을 쓰는 일은 무언가를 잃는 일이 아니라, 지금 나의 삶에 필요한 온기와
                도움을 초대하는 과정이에요. 아래의 세 가지 시선을 천천히 따라오며 오늘의
                풍요를 기록해 보세요.
              </div>

              <section className="space-y-4">
                <h3 className="text-sm font-semibold text-[#3D3A35]">
                  마음이 편안해지는 기록의 3가지 방법
                </h3>
                <div className="space-y-3">
                  {WRITING_GUIDE_PRINCIPLES.map((item) => (
                    <div
                      key={item.step}
                      className="p-4 rounded-2xl bg-white border border-[#EAE3D6]"
                    >
                      <div className="text-xs font-semibold text-[#6B8E78] mb-1">
                        {item.step}. {item.title}
                      </div>
                      <p className="text-xs text-[#6B645A] leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="space-y-3">
                <div>
                  <h3 className="text-sm font-semibold text-[#3D3A35]">
                    ‘오늘 내가 누린 풍요’ 기록 예시 3가지
                  </h3>
                  <p className="text-xs text-[#787166] mt-0.5">
                    문장을 눌러 바로 오늘의 감사 기록으로 시작할 수도 있어요
                  </p>
                </div>

                <div className="space-y-2.5">
                  {WRITING_GUIDE_EXAMPLES.map((example) => (
                    <button
                      key={example.id}
                      type="button"
                      onClick={() => {
                        onClose();
                        onStartWritingWithExample?.(example);
                      }}
                      className="w-full text-left p-4 rounded-2xl bg-white hover:bg-[#FAF6EE] border border-[#EAE3D6] hover:border-[#6B8E78]/50 transition-colors group"
                    >
                      <p className="font-diary text-[13.5px] leading-relaxed text-[#3D3A35]">
                        {example.formattedText}
                      </p>
                      <div className="mt-2.5 flex items-center justify-end gap-1 text-xs font-medium text-[#6B8E78] group-hover:text-[#52725D]">
                        <PenLine className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>이 예시로 기록해 보기</span>
                      </div>
                    </button>
                  ))}
                </div>
              </section>
            </div>

            <div className="px-6 py-4 border-t border-[#EFE8DC] bg-[#FDFBF7] shrink-0">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onStartWritingWithExample?.();
                }}
                className="w-full min-h-[48px] px-5 py-3 rounded-2xl bg-[#6B8E78] hover:bg-[#5B7D67] text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <PenLine className="w-4 h-4" aria-hidden="true" />
                <span>오늘의 감사 기록하기</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
