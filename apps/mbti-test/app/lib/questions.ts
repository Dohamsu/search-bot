export type MBTIAxis = "EI" | "SN" | "TF" | "JP";
export type MBTIDimension = "E" | "I" | "S" | "N" | "T" | "F" | "J" | "P";

export interface OptionScore {
  [key: string]: number;
}

export interface QuestionOption {
  emoji: string;
  text: string;
  score: OptionScore;
}

export interface Question {
  id: number;
  question: string;
  axis: MBTIAxis;
  options: QuestionOption[];
}

export const questions: Question[] = [
  // === E/I 축 (4문항) ===
  {
    id: 1,
    question: "주말에 에너지를 충전하는 방법은?",
    axis: "EI",
    options: [
      { emoji: "🏠", text: "집에서 혼자 쉬며 재충전", score: { I: 2 } },
      { emoji: "👥", text: "친구들과 만나서 수다", score: { E: 2 } },
      { emoji: "📚", text: "카페에서 책이나 영화 감상", score: { I: 1 } },
      { emoji: "🎉", text: "새로운 사람들과 파티", score: { E: 2 } },
    ],
  },
  {
    id: 2,
    question: "새로운 모임에 갔을 때 나는?",
    axis: "EI",
    options: [
      { emoji: "🙋", text: "먼저 다가가서 인사한다", score: { E: 2 } },
      { emoji: "👀", text: "누가 말 걸어주길 기다린다", score: { I: 2 } },
      { emoji: "😊", text: "아는 사람 옆에 붙어있는다", score: { I: 1 } },
      { emoji: "🗣️", text: "분위기를 주도하며 대화를 이끈다", score: { E: 2 } },
    ],
  },
  {
    id: 3,
    question: "스트레스를 받으면 어떻게 해소하나요?",
    axis: "EI",
    options: [
      { emoji: "🎵", text: "혼자 음악 듣거나 산책", score: { I: 2 } },
      { emoji: "🍻", text: "친구에게 연락해서 만남", score: { E: 2 } },
      { emoji: "✍️", text: "일기를 쓰거나 혼자 정리", score: { I: 1 } },
      { emoji: "💬", text: "여러 사람과 대화하며 풀기", score: { E: 1 } },
    ],
  },
  {
    id: 4,
    question: "이상적인 직장 환경은?",
    axis: "EI",
    options: [
      { emoji: "🏢", text: "팀 프로젝트와 회의가 많은 곳", score: { E: 2 } },
      { emoji: "💻", text: "독립적으로 일할 수 있는 곳", score: { I: 2 } },
      { emoji: "🤝", text: "소규모 팀에서 협업하는 곳", score: { E: 1 } },
      { emoji: "🏡", text: "재택근무가 가능한 곳", score: { I: 1 } },
    ],
  },

  // === S/N 축 (4문항) ===
  {
    id: 5,
    question: "여행 계획을 세울 때 나는?",
    axis: "SN",
    options: [
      { emoji: "📋", text: "분 단위 상세 일정표 작성", score: { S: 2 } },
      { emoji: "🌟", text: "가고 싶은 곳만 체크하고 즉흥으로", score: { N: 2 } },
      { emoji: "📍", text: "유명 맛집과 관광지 위주로 계획", score: { S: 1 } },
      { emoji: "🗺️", text: "현지에서 영감 받아 돌아다니기", score: { N: 1 } },
    ],
  },
  {
    id: 6,
    question: "새로운 것을 배울 때 선호하는 방식은?",
    axis: "SN",
    options: [
      { emoji: "📖", text: "교과서를 차근차근 따라가기", score: { S: 2 } },
      { emoji: "💡", text: "전체 큰 그림을 먼저 파악", score: { N: 2 } },
      { emoji: "🔧", text: "직접 해보면서 익히기", score: { S: 1 } },
      { emoji: "🤔", text: "왜 이런 건지 이론부터 이해", score: { N: 1 } },
    ],
  },
  {
    id: 7,
    question: "대화할 때 주로 어떤 이야기를 하나요?",
    axis: "SN",
    options: [
      { emoji: "📰", text: "오늘 있었던 일, 구체적인 경험", score: { S: 2 } },
      { emoji: "🔮", text: "미래의 가능성과 아이디어", score: { N: 2 } },
      { emoji: "📊", text: "사실과 데이터에 기반한 이야기", score: { S: 1 } },
      { emoji: "🌈", text: "상상력을 자극하는 이야기", score: { N: 1 } },
    ],
  },
  {
    id: 8,
    question: "문제를 해결할 때 나의 접근법은?",
    axis: "SN",
    options: [
      { emoji: "📝", text: "과거 경험에서 해답을 찾는다", score: { S: 2 } },
      { emoji: "🚀", text: "완전히 새로운 방법을 시도한다", score: { N: 2 } },
      { emoji: "✅", text: "검증된 방법을 단계적으로 적용", score: { S: 1 } },
      { emoji: "💭", text: "직감과 영감으로 해결한다", score: { N: 1 } },
    ],
  },

  // === T/F 축 (4문항) ===
  {
    id: 9,
    question: "친구가 고민 상담을 할 때 나는?",
    axis: "TF",
    options: [
      { emoji: "🧠", text: "객관적 분석과 해결책을 제시", score: { T: 2 } },
      { emoji: "🤗", text: "공감하고 감정을 들어준다", score: { F: 2 } },
      { emoji: "📊", text: "장단점을 정리해서 알려준다", score: { T: 1 } },
      { emoji: "💕", text: "함께 울고 웃어준다", score: { F: 1 } },
    ],
  },
  {
    id: 10,
    question: "중요한 결정을 내릴 때 가장 중요한 것은?",
    axis: "TF",
    options: [
      { emoji: "⚖️", text: "논리적 근거와 합리적 판단", score: { T: 2 } },
      { emoji: "❤️", text: "관련된 사람들의 감정과 영향", score: { F: 2 } },
      { emoji: "📈", text: "객관적 데이터와 효율성", score: { T: 1 } },
      { emoji: "🤝", text: "모두가 만족할 수 있는 방법", score: { F: 1 } },
    ],
  },
  {
    id: 11,
    question: "팀 프로젝트에서 갈등이 생기면?",
    axis: "TF",
    options: [
      { emoji: "🎯", text: "목표에 집중하고 감정은 배제", score: { T: 2 } },
      { emoji: "🕊️", text: "팀원들의 기분을 먼저 살핀다", score: { F: 2 } },
      { emoji: "📐", text: "규칙과 기준에 따라 해결", score: { T: 1 } },
      { emoji: "💬", text: "대화로 서로 이해하려 노력", score: { F: 1 } },
    ],
  },
  {
    id: 12,
    question: "영화를 볼 때 주로 끌리는 장르는?",
    axis: "TF",
    options: [
      { emoji: "🔍", text: "추리/스릴러 (논리적 전개)", score: { T: 2 } },
      { emoji: "💑", text: "로맨스/드라마 (감정적 공감)", score: { F: 2 } },
      { emoji: "🧪", text: "SF/다큐 (지적 호기심)", score: { T: 1 } },
      { emoji: "🎭", text: "감동적인 휴먼 스토리", score: { F: 1 } },
    ],
  },

  // === J/P 축 (4문항) ===
  {
    id: 13,
    question: "하루 일과를 보내는 스타일은?",
    axis: "JP",
    options: [
      { emoji: "📅", text: "계획표대로 체계적으로", score: { J: 2 } },
      { emoji: "🎲", text: "그때그때 기분에 따라", score: { P: 2 } },
      { emoji: "⏰", text: "할 일 목록을 만들고 체크", score: { J: 1 } },
      { emoji: "🌊", text: "유연하게 흘러가는 대로", score: { P: 1 } },
    ],
  },
  {
    id: 14,
    question: "과제나 업무 마감 스타일은?",
    axis: "JP",
    options: [
      { emoji: "📌", text: "미리미리 끝내놓는 편", score: { J: 2 } },
      { emoji: "⚡", text: "마감 직전에 집중력 폭발", score: { P: 2 } },
      { emoji: "📊", text: "단계별로 나눠서 진행", score: { J: 1 } },
      { emoji: "🎯", text: "압박감이 있어야 시작", score: { P: 1 } },
    ],
  },
  {
    id: 15,
    question: "옷장이나 책상 정리 스타일은?",
    axis: "JP",
    options: [
      { emoji: "✨", text: "항상 깔끔하게 정돈", score: { J: 2 } },
      { emoji: "🌀", text: "창의적 혼돈 속에서 편안함", score: { P: 2 } },
      { emoji: "📁", text: "카테고리별로 분류 정리", score: { J: 1 } },
      { emoji: "🤷", text: "필요할 때만 정리", score: { P: 1 } },
    ],
  },
  {
    id: 16,
    question: "갑자기 계획이 변경되면?",
    axis: "JP",
    options: [
      { emoji: "😤", text: "스트레스를 받고 불편하다", score: { J: 2 } },
      { emoji: "😄", text: "오히려 신선하고 좋다", score: { P: 2 } },
      { emoji: "🔄", text: "빨리 새 계획을 세운다", score: { J: 1 } },
      { emoji: "🏄", text: "변화를 즐기며 적응한다", score: { P: 1 } },
    ],
  },
];
