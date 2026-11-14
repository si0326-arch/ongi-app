import { toPng } from 'html-to-image';
import { Download, Eye, EyeOff, ImageDown, RotateCcw, Shuffle } from 'lucide-react';
import { useMemo, useRef, useState } from 'react';
import { MOOD_MAP } from '../data/mindsetData';
import { ExpenseItem } from '../types/gratitude';
import {
  formatAbundanceKRW,
  getCurrentMonthKey,
  getMonthKeyFromISO,
} from '../utils/format';

interface ReportViewProps {
  items: ExpenseItem[];
  isSafeMode: boolean;
  onToggleSafeMode: () => void;
  onResetSample: () => void;
  onClearAll: () => void;
  onNotify?: (message: string) => void;
}

const CHART_PALETTE = [
  '#6B8E78',
  '#D4A373',
  '#8AA896',
  '#C99768',
  '#A5BCAE',
  '#DFBA94',
];

export function ReportView({
  items,
  isSafeMode,
  onToggleSafeMode,
  onResetSample,
  onClearAll,
  onNotify,
}: ReportViewProps) {
  const [shuffleSeed, setShuffleSeed] = useState(0);
  const [confirmClear, setConfirmClear] = useState(false);
  const [isSavingImage, setIsSavingImage] = useState(false);
  const receiptRef = useRef<HTMLDivElement>(null);

  const currentMonthKey = getCurrentMonthKey();
  const [yearStr, monthStr] = currentMonthKey.split('-');

  const monthItems = useMemo(
    () => items.filter((item) => getMonthKeyFromISO(item.createdAt) === currentMonthKey),
    [items, currentMonthKey]
  );

  const monthTotal = useMemo(
    () => monthItems.reduce((sum, item) => sum + item.amount, 0),
    [monthItems]
  );

  // Aggregate by valueTags
  const valueTagStats = useMemo(() => {
    const map = new Map<string, { tag: string; count: number; amount: number }>();
    const source = monthItems.length > 0 ? monthItems : items;

    for (const item of source) {
      for (const tag of item.valueTags) {
        const existing = map.get(tag) || { tag, count: 0, amount: 0 };
        existing.count += 1;
        existing.amount += item.amount;
        map.set(tag, existing);
      }
    }

    const list = Array.from(map.values()).sort((a, b) => b.count - a.count || b.amount - a.amount);
    const totalCount = list.reduce((sum, entry) => sum + entry.count, 0);

    return list.map((entry, idx) => ({
      ...entry,
      percent: totalCount > 0 ? Math.round((entry.count / totalCount) * 100) : 0,
      color: CHART_PALETTE[idx % CHART_PALETTE.length],
    }));
  }, [monthItems, items]);

  const topTagsForChart = valueTagStats.slice(0, 6);
  const mostFrequentTag = valueTagStats[0] || null;

  // Compute SVG Donut segments
  const donutSegments = useMemo(() => {
    const total = topTagsForChart.reduce((sum, t) => sum + t.count, 0);
    if (total === 0) return [];
    const radius = 42;
    const circumference = 2 * Math.PI * radius;
    let accumulated = 0;

    return topTagsForChart.map((tagStat) => {
      const fraction = tagStat.count / total;
      const strokeLength = fraction * circumference;
      const offset = circumference - accumulated;
      accumulated += strokeLength;
      return {
        ...tagStat,
        strokeDasharray: `${strokeLength} ${circumference - strokeLength}`,
        strokeDashoffset: offset,
      };
    });
  }, [topTagsForChart]);

  // Pick 3 random gratitude sentences for the Monthly Receipt
  const randomReceiptNotes = useMemo(() => {
    const pool = monthItems.length > 0 ? monthItems : items;
    if (pool.length === 0) return [];

    // Deterministic-friendly Fisher-Yates copy influenced by shuffleSeed
    const copy = [...pool];
    for (let i = copy.length - 1; i > 0; i--) {
      const pseudoRandom = Math.abs(
        Math.sin((i + 1) * (shuffleSeed + 1) * 12.9898) * 43758.5453
      );
      const j = Math.floor((pseudoRandom % 1) * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy.slice(0, 3);
  }, [monthItems, items, shuffleSeed]);

  const handleDownloadReceiptText = () => {
    const lines = [
      `차곡 — ${yearStr}년 ${Number(monthStr)}월 감사 영수증`,
      '========================================',
      `이번 달 누린 풍요: ${formatAbundanceKRW(monthTotal, isSafeMode)}`,
      `가장 많이 누린 가치: ${mostFrequentTag ? mostFrequentTag.tag : '기록 대기 중'}`,
      '',
      '[이달의 감사 문장]',
      ...randomReceiptNotes.map((item, i) => `${i + 1}. "${item.gratitudeNote}" (${item.category})`),
      '',
      '========================================',
      '내가 쓴 돈은 나의 하루를 지켜준 온기입니다.',
    ];

    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `chagok-receipt-${currentMonthKey}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    onNotify?.('감사 영수증 텍스트 파일이 저장되었어요.');
  };

  const handleSaveReceiptImage = async () => {
    if (!receiptRef.current || isSavingImage) return;
    setIsSavingImage(true);
    try {
      let dataUrl: string;
      try {
        dataUrl = await toPng(receiptRef.current, {
          pixelRatio: 2,
          backgroundColor: '#FDFBF7',
          cacheBust: true,
        });
      } catch {
        // Fallback when cross-origin Google Fonts CSS rules block stylesheet reading
        dataUrl = await toPng(receiptRef.current, {
          pixelRatio: 2,
          backgroundColor: '#FDFBF7',
          skipFonts: true,
        });
      }

      const link = document.createElement('a');
      link.download = `chagok-gratitude-receipt-${currentMonthKey}.png`;
      link.href = dataUrl;
      link.click();
      onNotify?.('감사 영수증이 이미지로 저장되었어요 🌱');
    } catch {
      onNotify?.('이미지 저장 중 잠시 문제가 생겼어요. 다시 시도해 주세요.');
    } finally {
      setIsSavingImage(false);
    }
  };

  return (
    <div className="space-y-6 pb-28">
      {/* Header */}
      <header className="flex items-start justify-between gap-3 pt-2">
        <div>
          <h1 className="font-diary text-2xl font-bold text-[#3D3A35]">
            풍요 리포트
          </h1>
          <p className="text-xs text-[#787166] mt-0.5">
            숫자보다 내 삶에 쌓인 가치와 감사의 결을 모아봐요
          </p>
        </div>

        <button
          type="button"
          onClick={onToggleSafeMode}
          aria-pressed={isSafeMode}
          className={`min-h-[40px] px-3 py-1.5 rounded-xl text-xs font-medium inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-colors border ${
            isSafeMode
              ? 'bg-[#EAF0EC] border-[#6B8E78]/40 text-[#52725D]'
              : 'bg-white border-[#EAE3D6] text-[#787166] hover:text-[#3D3A35]'
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
      </header>

      {/* Value Tag Donut & Soft Bar Chart */}
      <section className="p-5 rounded-2xl bg-white border border-[#EAE3D6] space-y-5">
        <div>
          <h2 className="text-sm font-semibold text-[#3D3A35]">
            내가 가장 많이 누린 가치 태그
          </h2>
          <p className="text-xs text-[#787166] mt-0.5">
            지출의 액수가 아니라 어떤 가치로 내 삶이 채워졌는지 살펴봐요
          </p>
        </div>

        {topTagsForChart.length === 0 ? (
          <p className="text-xs text-[#787166] py-6 text-center">
            감사를 기록하면 내가 자주 선택한 가치 태그 통계가 이곳에 나타나요.
          </p>
        ) : (
          <div className="space-y-5">
            {/* Soft Donut Chart */}
            <div className="flex items-center gap-5">
              <div className="relative w-28 h-28 shrink-0">
                <svg viewBox="0 0 110 110" className="w-full h-full -rotate-90">
                  <circle
                    cx="55"
                    cy="55"
                    r="42"
                    fill="none"
                    stroke="#F5EFE6"
                    strokeWidth="14"
                  />
                  {donutSegments.map((seg) => (
                    <circle
                      key={seg.tag}
                      cx="55"
                      cy="55"
                      r="42"
                      fill="none"
                      stroke={seg.color}
                      strokeWidth="14"
                      strokeDasharray={seg.strokeDasharray}
                      strokeDashoffset={seg.strokeDashoffset}
                      strokeLinecap="butt"
                    />
                  ))}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-2">
                  <span className="text-[10px] text-[#8C8478]">최다 가치</span>
                  <span className="text-xs font-bold text-[#3D3A35] truncate max-w-[72px]">
                    {mostFrequentTag?.tag}
                  </span>
                </div>
              </div>

              <div className="flex-1 space-y-2 min-w-0">
                {topTagsForChart.slice(0, 4).map((tagStat) => (
                  <div
                    key={tagStat.tag}
                    className="flex items-center justify-between gap-2 text-xs"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: tagStat.color }}
                      />
                      <span className="font-medium text-[#3D3A35] truncate">
                        {tagStat.tag}
                      </span>
                    </div>
                    <span className="text-[#787166] tabular-nums shrink-0">
                      {tagStat.count}회 ({tagStat.percent}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Soft Horizontal Bars */}
            <div className="space-y-3 pt-2 border-t border-[#F2ECE1]">
              {topTagsForChart.map((tagStat) => (
                <div key={tagStat.tag} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-[#3D3A35]">{tagStat.tag}</span>
                    <span className="text-[#787166] tabular-nums">
                      {tagStat.count}번 · {formatAbundanceKRW(tagStat.amount, isSafeMode)}
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#F5EFE6] overflow-hidden">
                    <div
                      style={{
                        width: `${Math.max(8, tagStat.percent)}%`,
                        backgroundColor: tagStat.color,
                      }}
                      className="h-full rounded-full transition-all duration-300"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ★ Monthly Gratitude Receipt Card */}
      <section aria-label="이달의 감사 영수증 발급" className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-semibold text-[#3D3A35]">
            이달의 감사 영수증
          </h2>
          <button
            type="button"
            onClick={() => setShuffleSeed((s) => s + 1)}
            className="min-h-[36px] px-2.5 py-1 rounded-xl text-xs font-medium text-[#6B8E78] hover:bg-[#EAF0EC] inline-flex items-center gap-1 transition-colors"
          >
            <Shuffle className="w-3.5 h-3.5" aria-hidden="true" />
            <span>다른 문장 3개 뽑기</span>
          </button>
        </div>

        {/* Paper Receipt Design */}
        <div
          ref={receiptRef}
          className="relative bg-white border border-[#E6DEC8] rounded-2xl shadow-[0_6px_24px_rgba(61,58,53,0.06)] overflow-hidden"
        >
          {/* Subtle top paper perforation bar */}
          <div className="h-2 bg-[repeating-linear-gradient(90deg,#F5EFE6_0px,#F5EFE6_8px,#FFFFFF_8px,#FFFFFF_16px)] border-b border-dashed border-[#E2D9C8]" />

          <div className="px-6 py-5 space-y-4">
            {/* Receipt Header */}
            <div className="text-center space-y-1">
              <p className="text-[11px] font-semibold tracking-widest text-[#8C8478]">
                CHAGOK GRATITUDE RECEIPT
              </p>
              <h3 className="font-diary text-lg font-bold text-[#3D3A35]">
                {yearStr}년 {Number(monthStr)}월 감사의 영수증
              </h3>
              <p className="text-xs text-[#787166]">
                내가 지불한 것은 비용이 아니라 삶의 온기였습니다
              </p>
            </div>

            <div className="border-t border-dashed border-[#DED5C5]" />

            {/* Receipt Metrics */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#787166]">이번 달 총 누린 풍요</span>
                <span className="text-base font-bold text-[#3D3A35] tabular-nums">
                  {formatAbundanceKRW(monthTotal, isSafeMode)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#787166]">가장 많이 선택한 가치</span>
                <span className="font-semibold text-[#52725D]">
                  {mostFrequentTag ? mostFrequentTag.tag : '아직 없음'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#787166]">이번 달 감사의 순간</span>
                <span className="font-medium text-[#3D3A35] tabular-nums">
                  {monthItems.length}건
                </span>
              </div>
            </div>

            <div className="border-t border-dashed border-[#DED5C5]" />

            {/* 3 Random Gratitude Sentences */}
            <div className="space-y-3">
              <p className="text-xs font-semibold text-[#8C6D46]">
                오늘 다시 꺼내 읽는 나의 감사 3줄
              </p>
              {randomReceiptNotes.length === 0 ? (
                <p className="text-xs text-[#787166] py-3 text-center">
                  감사 기록이 쌓이면 영수증에 따뜻한 문장들이 인쇄됩니다.
                </p>
              ) : (
                <div className="space-y-2.5">
                  {randomReceiptNotes.map((entry, idx) => (
                    <div
                      key={entry.id}
                      className="p-3.5 rounded-xl bg-[#FDFBF7] border border-[#EFE8DC] space-y-1"
                    >
                      <div className="flex items-center justify-between text-[11px] text-[#8C8478]">
                        <span>
                          0{idx + 1} · {entry.category} · {MOOD_MAP[entry.mood].label}
                        </span>
                        <span className="tabular-nums text-[#6B8E78]">
                          {formatAbundanceKRW(entry.amount, isSafeMode)}
                        </span>
                      </div>
                      <p className="font-diary text-[13.5px] leading-relaxed text-[#3D3A35]">
                        “{entry.gratitudeNote}”
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="border-t border-dashed border-[#DED5C5]" />

            {/* Receipt Footer */}
            <div className="text-center pt-1">
              <span className="font-diary text-xs text-[#787166]">
                오늘도 충분히 잘 살아내었어요 · 차곡 감사 가계부
              </span>
            </div>
          </div>

          <div className="h-2 bg-[repeating-linear-gradient(90deg,#F5EFE6_0px,#F5EFE6_8px,#FFFFFF_8px,#FFFFFF_16px)] border-t border-dashed border-[#E2D9C8]" />
        </div>

        {/* Receipt Action Buttons (outside receiptRef so saved image stays clean) */}
        <div className="flex items-center gap-2.5 pt-1">
          <button
            type="button"
            onClick={handleSaveReceiptImage}
            disabled={isSavingImage}
            className="flex-1 min-h-[46px] px-4 py-2.5 rounded-2xl bg-[#6B8E78] hover:bg-[#5B7D67] disabled:opacity-60 text-white text-xs font-semibold inline-flex items-center justify-center gap-1.5 whitespace-nowrap transition-colors"
          >
            <ImageDown className="w-4 h-4" aria-hidden="true" />
            <span>{isSavingImage ? '이미지 만드는 중...' : '이미지로 저장하기'}</span>
          </button>
          <button
            type="button"
            onClick={handleDownloadReceiptText}
            className="min-h-[46px] px-4 py-2.5 rounded-2xl bg-[#F5EFE6] hover:bg-[#ECE3D5] text-xs font-medium text-[#5D564C] inline-flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0 transition-colors"
          >
            <Download className="w-4 h-4" aria-hidden="true" />
            <span>텍스트 저장</span>
          </button>
        </div>
      </section>

      {/* Quiet Local Data Management */}
      <section className="p-5 rounded-2xl bg-white border border-[#EAE3D6] space-y-3">
        <div>
          <h2 className="text-sm font-semibold text-[#3D3A35]">기록 데이터 관리</h2>
          <p className="text-xs text-[#787166] mt-0.5">
            모든 감사 기록은 브라우저(localStorage)에 안전하게 저장됩니다
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
