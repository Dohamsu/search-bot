/** 두 날짜 사이의 일수 차이 (절대값) */
export function getDaysBetween(a: Date, b: Date): number {
  const msPerDay = 1000 * 60 * 60 * 24;
  const utcA = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const utcB = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
  return Math.abs(Math.floor((utcB - utcA) / msPerDay));
}

/** 두 날짜 사이의 일수 차이 (부호 있음: b - a) */
export function getSignedDaysBetween(a: Date, b: Date): number {
  const msPerDay = 1000 * 60 * 60 * 24;
  const utcA = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const utcB = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
  return Math.floor((utcB - utcA) / msPerDay);
}

/** 두 날짜 사이의 영업일 수 (토/일 제외) */
export function getBusinessDays(startDate: Date, endDate: Date): number {
  let count = 0;
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Ensure start <= end
  const isReversed = start > end;
  const from = isReversed ? end : start;
  const to = isReversed ? start : end;

  const current = new Date(from);
  current.setDate(current.getDate() + 1); // 시작일 제외

  while (current <= to) {
    const dayOfWeek = current.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      count++;
    }
    current.setDate(current.getDate() + 1);
  }

  return count;
}

/** 날짜에 일수 더하기/빼기 */
export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/** 날짜에 년/월/일 더하기/빼기 */
export function addYearsMonthsDays(
  date: Date,
  years: number,
  months: number,
  days: number
): Date {
  const result = new Date(date);
  result.setFullYear(result.getFullYear() + years);
  result.setMonth(result.getMonth() + months);
  result.setDate(result.getDate() + days);
  return result;
}

/** 영업일 기준으로 일수 더하기/빼기 */
export function addBusinessDays(date: Date, businessDays: number): Date {
  const result = new Date(date);
  const direction = businessDays >= 0 ? 1 : -1;
  let remaining = Math.abs(businessDays);

  while (remaining > 0) {
    result.setDate(result.getDate() + direction);
    const dayOfWeek = result.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      remaining--;
    }
  }

  return result;
}

/** 만 나이 계산 */
export function getKoreanAge(birthDate: Date, today: Date): number {
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return Math.max(0, age);
}

/** 한국 나이 (연 나이) 계산 */
export function getKoreanTraditionalAge(
  birthDate: Date,
  today: Date
): number {
  return today.getFullYear() - birthDate.getFullYear() + 1;
}

/** 띠 (12지신) */
export function getZodiacAnimal(year: number): {
  name: string;
  emoji: string;
} {
  const animals: { name: string; emoji: string }[] = [
    { name: "원숭이", emoji: "🐵" },
    { name: "닭", emoji: "🐔" },
    { name: "개", emoji: "🐕" },
    { name: "돼지", emoji: "🐷" },
    { name: "쥐", emoji: "🐭" },
    { name: "소", emoji: "🐂" },
    { name: "호랑이", emoji: "🐯" },
    { name: "토끼", emoji: "🐰" },
    { name: "용", emoji: "🐲" },
    { name: "뱀", emoji: "🐍" },
    { name: "말", emoji: "🐴" },
    { name: "양", emoji: "🐑" },
  ];
  return animals[year % 12];
}

/** 다음 생일까지 남은 일수 */
export function getDaysUntilNextBirthday(birthDate: Date, today: Date): number {
  const thisYearBirthday = new Date(
    today.getFullYear(),
    birthDate.getMonth(),
    birthDate.getDate()
  );

  if (thisYearBirthday <= today) {
    // 올해 생일이 이미 지남
    const nextYearBirthday = new Date(
      today.getFullYear() + 1,
      birthDate.getMonth(),
      birthDate.getDate()
    );
    return getDaysBetween(today, nextYearBirthday);
  }

  return getDaysBetween(today, thisYearBirthday);
}

/** 두 날짜 사이의 년/월/일 차이 */
export function getDateDifference(
  startDate: Date,
  endDate: Date
): { years: number; months: number; days: number } {
  const isReversed = startDate > endDate;
  const from = isReversed ? endDate : startDate;
  const to = isReversed ? startDate : endDate;

  let years = to.getFullYear() - from.getFullYear();
  let months = to.getMonth() - from.getMonth();
  let days = to.getDate() - from.getDate();

  if (days < 0) {
    months--;
    const prevMonth = new Date(to.getFullYear(), to.getMonth(), 0);
    days += prevMonth.getDate();
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  return { years, months, days };
}

/** 요일 이름 (한국어) */
export function getDayName(date: Date): string {
  const days = [
    "일요일",
    "월요일",
    "화요일",
    "수요일",
    "목요일",
    "금요일",
    "토요일",
  ];
  return days[date.getDay()];
}

/** 날짜를 YYYY-MM-DD 형식 문자열로 변환 */
export function formatDateToString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** 날짜를 한국식 표기로 변환 */
export function formatDateKorean(date: Date): string {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const dayName = getDayName(date);
  return `${year}년 ${month}월 ${day}일 (${dayName})`;
}

/** 숫자에 천 단위 콤마 */
export function formatNumber(num: number): string {
  return num.toLocaleString("ko-KR");
}

/** 밀리초를 시/분/초로 변환 */
export function msToTime(ms: number): {
  hours: number;
  minutes: number;
  seconds: number;
} {
  const totalSeconds = Math.floor(Math.abs(ms) / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return { hours, minutes, seconds };
}
