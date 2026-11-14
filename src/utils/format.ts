export function formatAbundanceKRW(amount: number, isSafeMode = false): string {
  if (isSafeMode) {
    return '****원';
  }
  const safePositive = Math.max(0, Math.round(Math.abs(amount)));
  return `${safePositive.toLocaleString('ko-KR')}원`;
}

export function formatKoreanDateFromISO(isoString: string): string {
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return '';
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
  const weekday = weekdays[date.getDay()];
  return `${month}월 ${day}일 (${weekday})`;
}

export function formatKoreanTimeFromISO(isoString: string): string {
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return '';
  const hour = date.getHours();
  const minute = String(date.getMinutes()).padStart(2, '0');
  const period = hour < 12 ? '오전' : '오후';
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${period} ${displayHour}:${minute}`;
}

export function getMonthKeyFromISO(isoString: string): string {
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return '';
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

export function getCurrentMonthKey(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

export function getGreetingByHour(): string {
  const hour = new Date().getHours();
  if (hour < 6) return '고요한 새벽이에요';
  if (hour < 11) return '다정한 아침이에요';
  if (hour < 17) return '따스한 오후예요';
  if (hour < 21) return '포근한 저녁이에요';
  return '수고 많았던 밤이에요';
}

export function toLocalDateInputValue(isoString: string): string {
  const d = new Date(isoString);
  if (Number.isNaN(d.getTime())) {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
      now.getDate()
    ).padStart(2, '0')}`;
  }
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
    d.getDate()
  ).padStart(2, '0')}`;
}
