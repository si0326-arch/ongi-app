import {
  CategoryMeta,
  ExpenseCategory,
  ExpenseItem,
  ExpenseMood,
  MoodMeta,
} from '../types/gratitude';

export const EXPENSE_CATEGORIES: CategoryMeta[] = [
  {
    id: '식사/배달',
    label: '식사/배달',
    description: '몸과 마음을 든든하게 채워준 한 끼',
    suggestedTags: ['#편리함', '#시간절약', '#든든한한끼', '#나를위한대접'],
    recommendedNotes: [
      '이렇게 편안하게 음식을 주문하고 받을 수 있는 세상에 살고 있고, 주문할 돈이 있어 감사하다.',
      '오늘 요리할 에너지를 아껴 나에게 휴식을 선물해 감사하다.',
      '바쁜 하루 속에서도 따뜻하고 맛있는 음식으로 내 몸을 챙겨주어 감사하다.',
    ],
    accentBg: 'bg-[#F5EFE6]',
    accentText: 'text-[#8C6D46]',
  },
  {
    id: '휴식/카페',
    label: '휴식/카페',
    description: '잠시 멈춰 숨을 고를 수 있었던 다정한 쉼표',
    suggestedTags: ['#소중한시간', '#마음의여유', '#나를위한대접', '#기분전환'],
    recommendedNotes: [
      '따뜻한 음료와 공간 덕분에 지친 마음을 잠시 내려놓고 숨을 고를 수 있어 감사하다.',
      '오롯이 나만의 속도로 머무를 수 있는 편안한 시간을 선물해서 감사하다.',
      '작은 달콤함 하나로 오늘 하루를 버텨낼 기분 좋은 에너지를 얻어 감사하다.',
    ],
    accentBg: 'bg-[#F3ECE1]',
    accentText: 'text-[#876B4B]',
  },
  {
    id: '건강/돌봄',
    label: '건강/돌봄',
    description: '내 몸과 마음을 아끼고 회복시킨 돌봄',
    suggestedTags: ['#건강챙김', '#자기돌봄', '#회복의시간', '#몸과마음'],
    recommendedNotes: [
      '아프거나 지치지 않도록 내 몸을 먼저 살피고 돌볼 수 있는 여유가 있어 감사하다.',
      '내일의 내가 더 가볍고 건강하게 걸어갈 수 있도록 나를 아껴주어 감사하다.',
      '스스로를 소중히 대접하는 데 기꺼이 마음을 쓸 수 있어 감사하다.',
    ],
    accentBg: 'bg-[#EAF0EC]',
    accentText: 'text-[#52725D]',
  },
  {
    id: '생활/편리',
    label: '생활/편리',
    description: '안전한 이동과 쾌적한 일상을 지켜준 기반',
    suggestedTags: ['#편리함', '#안전한일상', '#시간절약', '#든든한기반'],
    recommendedNotes: [
      '비가 오나 눈이 오나 안전하고 빠르게 이동할 수 있는 교통수단과 기반이 있어 감사하다.',
      '일상의 작은 불편을 덜어주고 더 소중한 일에 집중할 시간을 얻어 감사하다.',
      '깨끗하고 따뜻한 공간에서 안심하고 살아갈 수 있음에 감사하다.',
    ],
    accentBg: 'bg-[#EFECE6]',
    accentText: 'text-[#666056]',
  },
  {
    id: '선물/관계',
    label: '선물/관계',
    description: '소중한 사람과 온기를 나눈 연결의 순간',
    suggestedTags: ['#소중한시간', '#따뜻한연결', '#나누는기쁨', '#마음전달'],
    recommendedNotes: [
      '소중한 사람에게 고마움과 애정을 표현할 수 있는 마음의 여유가 있어 감사하다.',
      '함께 웃고 이야기를 나누며 관계가 한 뼘 더 따뜻해진 시간에 감사하다.',
      '누군가의 하루를 환하게 밝혀주는 작은 기쁨을 선물할 수 있어 감사하다.',
    ],
    accentBg: 'bg-[#F6EDE3]',
    accentText: 'text-[#966E44]',
  },
  {
    id: '저축/미래의나',
    label: '저축/미래의나',
    description: '내일의 나를 안심시켜 주는 다정한 응원',
    suggestedTags: ['#미래의안도감', '#든든함', '#나를지키는힘', '#차곡차곡'],
    recommendedNotes: [
      '미래의 나에게 든든한 안도감을 선물할 수 있어 감사하다.',
      '오늘의 작은 선택이 모여 내일의 나에게 더 넓은 자유를 선물할 것임에 감사하다.',
      '불안해서 모으는 것이 아니라, 나를 사랑하는 마음으로 차곡차곡 쌓아갈 수 있어 감사하다.',
    ],
    accentBg: 'bg-[#E8EFE9]',
    accentText: 'text-[#4F6F5A]',
  },
  {
    id: '기타',
    label: '기타',
    description: '삶에 작은 설렘과 배움을 더해준 순간',
    suggestedTags: ['#작은행복', '#성장과영감', '#소중한시간', '#나다운선택'],
    recommendedNotes: [
      '내 취향과 호기심을 존중하며 일상에 작은 설렘을 초대할 수 있어 감사하다.',
      '새로운 경험과 배움을 통해 내 세상이 조금 더 넓어진 것에 감사하다.',
      '오늘 이 순간의 선택이 나에게 필요한 온기로 남아주어 감사하다.',
    ],
    accentBg: 'bg-[#F2EDE4]',
    accentText: 'text-[#6B645A]',
  },
];

export const CATEGORY_MAP: Record<ExpenseCategory, CategoryMeta> =
  EXPENSE_CATEGORIES.reduce(
    (acc, item) => {
      acc[item.id] = item;
      return acc;
    },
    {} as Record<ExpenseCategory, CategoryMeta>
  );

export const EXPENSE_MOODS: MoodMeta[] = [
  { id: 'grateful', label: '감사해요', shortLabel: '감사해요' },
  { id: 'peaceful', label: '편안해요', shortLabel: '편안해요' },
  { id: 'anxious', label: '조금 불안/후회돼요', shortLabel: '불안/후회' },
];

export const MOOD_MAP: Record<ExpenseMood, MoodMeta> = EXPENSE_MOODS.reduce(
  (acc, item) => {
    acc[item.id] = item;
    return acc;
  },
  {} as Record<ExpenseMood, MoodMeta>
);

export const ANXIOUS_REFRAME_MESSAGE =
  '괜찮아요. 그 순간에는 나를 지키기 위해 꼭 필요한 선택이었을 거예요. 이 소비가 내게 남긴 작은 배움이나 감사한 점 하나만 찾아볼까요?';

export const POSITIVE_AFFIRMATIONS: string[] = [
  '돈은 내가 가치 있는 삶을 살도록 돕는 다정한 도구입니다.',
  '돈은 나를 떠나 사라지는 것이 아니라, 오늘 나의 하루를 지켜주는 온기로 돌아옵니다.',
  '내가 쓰는 돈은 나의 삶과 마음을 돌보는 따뜻한 에너지입니다.',
  '나는 결핍의 두려움이 아니라, 이미 내 곁에 있는 풍요와 감사 속에서 선택합니다.',
];

export const DEFAULT_AFFIRMATION = POSITIVE_AFFIRMATIONS[0];

export interface WritingGuidePrinciple {
  step: string;
  title: string;
  description: string;
}

export interface WritingGuideExample {
  id: string;
  category: ExpenseCategory;
  formattedText: string;
  noteText: string;
  tags: string[];
}

export const WRITING_GUIDE_PRINCIPLES: WritingGuidePrinciple[] = [
  {
    step: '01',
    title: '나간 금액보다 내가 얻은 경험을 먼저 떠올려 보세요',
    description:
      '얼마를 썼는지 숫자만 바라보면 마음이 조급해지기 쉬워요. 그 돈과 바꾼 따뜻한 온도, 편안함, 즐거움의 장면을 먼저 마음속에 그려보세요.',
  },
  {
    step: '02',
    title: '당연해 보이는 일상 지출 속에서도 고마움을 찾아보세요',
    description:
      '식사·배달이나 교통·생활비처럼 반복되는 지출도 사실은 오늘 내가 안전하고 편안하게 살아갈 수 있도록 도와준 고마운 기반이에요.',
  },
  {
    step: '03',
    title: '평가하지 말고 나에게 다정한 편지를 쓰듯 적어보세요',
    description:
      '불안이나 후회가 올라오는 날에도 자책 대신, “그 순간 나를 지키기 위한 선택이었어”라고 토닥이며 작은 배움이나 감사 한 가지를 남겨보세요.',
  },
];

export const WRITING_GUIDE_EXAMPLES: WritingGuideExample[] = [
  {
    id: 'guide-ex-1',
    category: '휴식/카페',
    formattedText:
      '- 휴식/카페: 따뜻한 오후 커피 한 잔을 통해 바쁜 하루를 잠시 멈추고 숨을 고르는 여유와 평온함을 누렸어요.',
    noteText:
      '따뜻한 오후 커피 한 잔을 통해 바쁜 하루를 잠시 멈추고 숨을 고르는 여유와 평온함을 누렸어요.',
    tags: ['#소중한시간', '#마음의여유'],
  },
  {
    id: 'guide-ex-2',
    category: '식사/배달',
    formattedText:
      '- 식사/배달: 편안한 저녁 배달 한 끼를 통해 요리할 에너지를 아끼고 지친 나에게 온전한 휴식을 선물했어요.',
    noteText:
      '편안한 저녁 배달 한 끼를 통해 요리할 에너지를 아끼고 지친 나에게 온전한 휴식을 선물했어요.',
    tags: ['#편리함', '#시간절약', '#나를위한대접'],
  },
  {
    id: 'guide-ex-3',
    category: '건강/돌봄',
    formattedText:
      '- 건강/돌봄: 나를 위한 영양제와 스트레칭 케어를 통해 오늘 하루도 애쓴 내 몸을 다정하게 돌보는 든든함을 누렸어요.',
    noteText:
      '나를 위한 영양제와 스트레칭 케어를 통해 오늘 하루도 애쓴 내 몸을 다정하게 돌보는 든든함을 누렸어요.',
    tags: ['#건강챙김', '#자기돌봄'],
  },
];

export interface GratitudeTheme {
  id: string;
  themeLabel: string;
  question: string;
  helperText: string;
  suggestedCategory: ExpenseCategory;
  suggestedTags: string[];
  starterNote: string;
}

export const DAILY_GRATITUDE_THEMES: GratitudeTheme[] = [
  {
    id: 'theme-1',
    themeLabel: '작은 미소의 발견',
    question: '오늘 나를 웃게 한 작은 순간은?',
    helperText:
      '거창한 이벤트가 아니어도 좋아요. 잠깐의 달콤한 간식, 기분 좋은 햇살처럼 미소 지었던 소비를 떠올려 보세요.',
    suggestedCategory: '휴식/카페',
    suggestedTags: ['#작은행복', '#소중한시간'],
    starterNote: '오늘 나를 미소 짓게 한 작은 순간을 통해 하루에 따뜻한 활력을 얻어 감사하다.',
  },
  {
    id: 'theme-2',
    themeLabel: '당연함에 감사하기',
    question: '내가 가진 것 중 당연하게 여겼던 것은?',
    helperText:
      '매일 타는 지하철, 따뜻한 식사, 밝은 불빛처럼 늘 곁에 있어 잊고 지냈던 일상의 풍요를 바라봐요.',
    suggestedCategory: '생활/편리',
    suggestedTags: ['#안전한일상', '#든든한기반'],
    starterNote: '늘 당연하게 누려왔던 일상의 편리함과 안전함 덕분에 오늘도 무사히 보낼 수 있어 감사하다.',
  },
  {
    id: 'theme-3',
    themeLabel: '나를 위한 다정한 돌봄',
    question: '오늘 내가 나를 위해 해준 가장 고마운 일은?',
    helperText:
      '피곤한 나를 위해 배달 음식을 시키거나, 건강을 챙긴 작은 선택도 나를 아낀 증거예요.',
    suggestedCategory: '건강/돌봄',
    suggestedTags: ['#자기돌봄', '#건강챙김'],
    starterNote: '바쁘고 지친 와중에도 내 몸과 마음을 외면하지 않고 다정하게 돌봐주어 감사하다.',
  },
  {
    id: 'theme-4',
    themeLabel: '여유를 선물한 소비',
    question: '오늘 내 수고와 시간을 아껴준 고마운 선택은?',
    helperText:
      '돈으로 시간을 샀다면, 그만큼 나에게 쉴 수 있는 귀한 여유를 선물한 거예요.',
    suggestedCategory: '식사/배달',
    suggestedTags: ['#시간절약', '#편리함'],
    starterNote: '내 시간과 에너지를 아껴주고 편안한 휴식을 허락해 준 이 선택에 감사하다.',
  },
  {
    id: 'theme-5',
    themeLabel: '온기가 이어진 순간',
    question: '누군가의 다정함이나 내가 건넨 마음이 빛난 순간은?',
    helperText:
      '사랑하는 사람과 나눈 커피 한 잔, 작은 선물 속에 담긴 따뜻한 연결을 기록해 보세요.',
    suggestedCategory: '선물/관계',
    suggestedTags: ['#따뜻한연결', '#소중한시간'],
    starterNote: '소중한 사람과 따뜻한 마음을 주고받을 수 있는 여유가 내 삶에 있어 감사하다.',
  },
  {
    id: 'theme-6',
    themeLabel: '내일의 나를 위한 응원',
    question: '미래의 내가 고마워할 오늘의 작은 준비는?',
    helperText:
      '비상금 저축이나 작은 배움처럼, 내일의 나를 안심시켜 주는 든든한 발걸음을 칭찬해 주세요.',
    suggestedCategory: '저축/미래의나',
    suggestedTags: ['#미래의안도감', '#든든함'],
    starterNote: '미래의 내가 조금 더 편안하고 자유로울 수 있도록 오늘 든든한 발판을 만들어주어 감사하다.',
  },
  {
    id: 'theme-7',
    themeLabel: '오감을 채운 작은 기쁨',
    question: '오늘 나를 기분 좋게 만든 맛이나 향기, 분위기는?',
    helperText:
      '향기로운 커피, 좋아하는 음악이나 공간이 오늘 하루의 공기를 어떻게 바꾸었는지 적어보세요.',
    suggestedCategory: '휴식/카페',
    suggestedTags: ['#마음의여유', '#나를위한대접'],
    starterNote: '좋아하는 향기와 분위기 속에서 나만의 감각을 기분 좋게 채울 수 있어 감사하다.',
  },
];

export function createInitialSeedItems(): ExpenseItem[] {
  const now = new Date();
  const makeISO = (daysAgo: number, hour: number, minute: number) => {
    const d = new Date(now);
    d.setDate(d.getDate() - daysAgo);
    d.setHours(hour, minute, 0, 0);
    return d.toISOString();
  };

  return [
    {
      id: 'seed-1',
      amount: 22000,
      category: '식사/배달',
      valueTags: ['#편리함', '#시간절약'],
      gratitudeNote:
        '비 오는 날 집 앞까지 따뜻한 음식을 배달받을 수 있는 편리한 세상과 주문할 여유에 감사합니다.',
      mood: 'grateful',
      createdAt: makeISO(0, 13, 15),
    },
    {
      id: 'seed-2',
      amount: 5500,
      category: '휴식/카페',
      valueTags: ['#소중한시간', '#마음의여유'],
      gratitudeNote:
        '잠시 멈춰 서서 나만의 고요한 시간을 가질 수 있는 공간과 여유에 감사합니다.',
      mood: 'peaceful',
      createdAt: makeISO(0, 10, 20),
    },
    {
      id: 'seed-3',
      amount: 50000,
      category: '저축/미래의나',
      valueTags: ['#미래의안도감', '#든든함'],
      gratitudeNote:
        '미래의 내가 조금 덜 걱정하도록 든든한 울타리를 만들어주어 감사합니다.',
      mood: 'grateful',
      createdAt: makeISO(1, 18, 40),
    },
  ];
}
