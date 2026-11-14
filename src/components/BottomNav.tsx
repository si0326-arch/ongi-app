import { BarChart3, Feather, Plus, Settings } from 'lucide-react';
import { TabId } from '../types/gratitude';

interface BottomNavProps {
  activeTab: TabId;
  onChangeTab: (tab: TabId) => void;
  onOpenRecord: () => void;
}

export function BottomNav({ activeTab, onChangeTab, onOpenRecord }: BottomNavProps) {
  return (
    <nav
      aria-label="주요 메뉴"
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-40 bg-[#FDFBF7]/94 backdrop-blur-md border-t border-[#EAE3D6]"
    >
      <div className="grid grid-cols-4 items-center h-16 px-2">
        {/* 홈 (피드) */}
        <button
          type="button"
          onClick={() => onChangeTab('home')}
          aria-current={activeTab === 'home' ? 'page' : undefined}
          className={`min-h-[44px] flex flex-col items-center justify-center gap-1 rounded-xl transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6B8E78] ${
            activeTab === 'home'
              ? 'text-[#52725D] font-semibold'
              : 'text-[#8C8478] hover:text-[#3D3A35]'
          }`}
        >
          <Feather
            className={`w-5 h-5 ${activeTab === 'home' ? 'stroke-[2.2]' : 'stroke-[1.75]'}`}
            aria-hidden="true"
          />
          <span className="text-[11px] leading-none tracking-tight whitespace-nowrap shrink-0">
            홈
          </span>
        </button>

        {/* 기록하기 (+) */}
        <div className="flex items-center justify-center">
          <button
            type="button"
            onClick={onOpenRecord}
            aria-label="오늘의 감사 기록하기"
            className="min-h-[44px] px-3.5 py-2 rounded-2xl bg-[#6B8E78] hover:bg-[#5B7D67] active:scale-[0.97] text-white shadow-sm flex items-center justify-center gap-1 transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6B8E78]"
          >
            <Plus className="w-4 h-4 stroke-[2.3]" aria-hidden="true" />
            <span className="text-[11px] font-semibold whitespace-nowrap shrink-0">
              기록하기
            </span>
          </button>
        </div>

        {/* 풍요 리포트 (모아보기) */}
        <button
          type="button"
          onClick={() => onChangeTab('report')}
          aria-current={activeTab === 'report' ? 'page' : undefined}
          className={`min-h-[44px] flex flex-col items-center justify-center gap-1 rounded-xl transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6B8E78] ${
            activeTab === 'report'
              ? 'text-[#52725D] font-semibold'
              : 'text-[#8C8478] hover:text-[#3D3A35]'
          }`}
        >
          <BarChart3
            className={`w-5 h-5 ${activeTab === 'report' ? 'stroke-[2.2]' : 'stroke-[1.75]'}`}
            aria-hidden="true"
          />
          <span className="text-[11px] leading-none tracking-tight whitespace-nowrap shrink-0">
            풍요 리포트
          </span>
        </button>

        {/* 설정 */}
        <button
          type="button"
          onClick={() => onChangeTab('settings')}
          aria-current={activeTab === 'settings' ? 'page' : undefined}
          className={`min-h-[44px] flex flex-col items-center justify-center gap-1 rounded-xl transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6B8E78] ${
            activeTab === 'settings'
              ? 'text-[#52725D] font-semibold'
              : 'text-[#8C8478] hover:text-[#3D3A35]'
          }`}
        >
          <Settings
            className={`w-5 h-5 ${activeTab === 'settings' ? 'stroke-[2.2]' : 'stroke-[1.75]'}`}
            aria-hidden="true"
          />
          <span className="text-[11px] leading-none tracking-tight whitespace-nowrap shrink-0">
            설정
          </span>
        </button>
      </div>
    </nav>
  );
}
