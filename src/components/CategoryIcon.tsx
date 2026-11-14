import {
  Coffee,
  Gift,
  HeartPulse,
  Home,
  PiggyBank,
  Sparkles,
  Utensils,
} from 'lucide-react';
import { ExpenseCategory } from '../types/gratitude';

interface CategoryIconProps {
  category: ExpenseCategory;
  className?: string;
}

export function CategoryIcon({ category, className = 'w-4 h-4' }: CategoryIconProps) {
  switch (category) {
    case '식사/배달':
      return <Utensils className={className} aria-hidden="true" />;
    case '휴식/카페':
      return <Coffee className={className} aria-hidden="true" />;
    case '건강/돌봄':
      return <HeartPulse className={className} aria-hidden="true" />;
    case '생활/편리':
      return <Home className={className} aria-hidden="true" />;
    case '선물/관계':
      return <Gift className={className} aria-hidden="true" />;
    case '저축/미래의나':
      return <PiggyBank className={className} aria-hidden="true" />;
    case '기타':
      return <Sparkles className={className} aria-hidden="true" />;
  }
}
