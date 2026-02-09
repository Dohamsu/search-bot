export interface MBTIResult {
  type: string;
  title: string;
  description: string;
  traits: string[];
  compatible: string[];
  percentage: number;
  careers: string[];
  celebrities: string[];
}

const MBTI_TYPES = [
  "ENFP", "INTJ", "INFP", "ESTJ", "ISFJ", "ENTP",
  "ISFP", "ENTJ", "INTP", "ESFP", "ISTP", "ESFJ",
  "INFJ", "ENFJ", "ISTJ", "ESTP",
] as const;

export type MBTIType = (typeof MBTI_TYPES)[number];

export function getAllTypes(): MBTIType[] {
  return [...MBTI_TYPES];
}

const detailedResults: Record<string, MBTIResult> = {
  ENFP: {
    type: "ENFP",
    title: "열정적인 활동가",
    description:
      "자유로운 영혼의 소유자로, 창의적이고 열정적입니다. 새로운 가능성을 발견하는 데 뛰어나며, 사람들에게 영감을 줍니다.",
    traits: [
      "새로운 가능성에 열정적",
      "사람들과의 교류를 즐김",
      "창의적이고 자유분방함",
      "공감 능력이 뛰어남",
    ],
    compatible: ["INTJ", "INFJ"],
    percentage: 8,
    careers: ["마케터", "작가", "상담사", "배우", "이벤트 플래너"],
    celebrities: ["로버트 다우니 주니어", "로빈 윌리엄스", "윌 스미스"],
  },
  INTJ: {
    type: "INTJ",
    title: "전략적 사색가",
    description:
      "독립적이고 분석적인 전략가입니다. 높은 기준을 가지고 있으며, 복잡한 문제를 해결하는 데 뛰어납니다.",
    traits: [
      "전략적 사고가 뛰어남",
      "독립적이고 자기주도적",
      "높은 기준과 완벽주의",
      "논리적이고 체계적",
    ],
    compatible: ["ENFP", "ENTP"],
    percentage: 2,
    careers: ["전략 컨설턴트", "소프트웨어 아키텍트", "과학자", "투자 분석가", "교수"],
    celebrities: ["일론 머스크", "마크 저커버그", "크리스토퍼 놀란"],
  },
  INFP: {
    type: "INFP",
    title: "몽상적인 중재자",
    description:
      "이상주의적이고 공감 능력이 뛰어난 중재자입니다. 내면의 가치관을 중시하며, 세상을 더 나은 곳으로 만들고자 합니다.",
    traits: [
      "깊은 내면의 가치관",
      "뛰어난 공감 능력",
      "이상주의적 세계관",
      "창의적 표현력",
    ],
    compatible: ["ENFJ", "ENTJ"],
    percentage: 4,
    careers: ["작가", "심리상담사", "그래픽 디자이너", "사회복지사", "음악가"],
    celebrities: ["윌리엄 셰익스피어", "에드거 앨런 포", "팀 버튼"],
  },
  ESTJ: {
    type: "ESTJ",
    title: "엄격한 관리자",
    description:
      "체계적이고 실용적인 관리자입니다. 규칙과 질서를 중시하며, 책임감이 강하고 결단력 있게 행동합니다.",
    traits: [
      "뛰어난 조직 관리 능력",
      "책임감과 리더십",
      "실용적이고 현실적",
      "체계적이고 효율적",
    ],
    compatible: ["ISTP", "ISFP"],
    percentage: 9,
    careers: ["경영 관리자", "판사", "금융 분석가", "군 장교", "프로젝트 매니저"],
    celebrities: ["헨리 포드", "미셸 오바마", "이순신"],
  },
  ISFJ: {
    type: "ISFJ",
    title: "용감한 수호자",
    description:
      "따뜻하고 헌신적인 수호자입니다. 타인을 돕는 것에서 보람을 느끼며, 세심하고 신뢰할 수 있는 사람입니다.",
    traits: [
      "헌신적이고 따뜻함",
      "세심한 관찰력",
      "강한 책임감",
      "안정을 추구함",
    ],
    compatible: ["ESFP", "ESTP"],
    percentage: 14,
    careers: ["간호사", "교사", "사서", "사회복지사", "행정 관리자"],
    celebrities: ["마더 테레사", "비욘세", "앤 해서웨이"],
  },
  ENTP: {
    type: "ENTP",
    title: "대담한 변론가",
    description:
      "재치 있고 도전적인 변론가입니다. 지적 호기심이 넘치며, 기존의 틀을 깨는 것을 즐깁니다.",
    traits: [
      "지적 호기심이 넘침",
      "토론과 논쟁을 즐김",
      "혁신적 사고방식",
      "적응력이 뛰어남",
    ],
    compatible: ["INFJ", "INTJ"],
    percentage: 3,
    careers: ["기업가", "변호사", "발명가", "프로듀서", "정치 전략가"],
    celebrities: ["토머스 에디슨", "벤자민 프랭클린", "사샤 바론 코언"],
  },
  ISFP: {
    type: "ISFP",
    title: "호기심 많은 예술가",
    description:
      "조용하고 감성적인 예술가입니다. 자신만의 가치관으로 세상을 바라보며, 아름다움을 추구합니다.",
    traits: [
      "예술적 감성",
      "유연하고 개방적",
      "현재를 즐기는 성격",
      "내면의 가치 중시",
    ],
    compatible: ["ESTJ", "ESFJ"],
    percentage: 9,
    careers: ["디자이너", "사진작가", "셰프", "플로리스트", "수의사"],
    celebrities: ["마이클 잭슨", "밥 딜런", "오드리 헵번"],
  },
  ENTJ: {
    type: "ENTJ",
    title: "대담한 통솔자",
    description:
      "카리스마 넘치는 리더입니다. 효율성과 성과를 중시하며, 큰 비전을 현실로 만드는 데 탁월합니다.",
    traits: [
      "강력한 리더십",
      "전략적 비전",
      "결단력과 추진력",
      "효율성 추구",
    ],
    compatible: ["INFP", "INTP"],
    percentage: 2,
    careers: ["CEO", "변호사", "경영 컨설턴트", "정치인", "기업가"],
    celebrities: ["스티브 잡스", "마거릿 대처", "나폴레옹"],
  },
  INTP: {
    type: "INTP",
    title: "논리적인 사색가",
    description:
      "호기심 많은 사색가입니다. 논리적 분석과 이론적 탐구를 즐기며, 독창적인 아이디어를 만들어냅니다.",
    traits: [
      "분석적 사고력",
      "지적 호기심",
      "독창적 문제 해결",
      "객관적 관점",
    ],
    compatible: ["ENTJ", "ESTJ"],
    percentage: 3,
    careers: ["소프트웨어 개발자", "데이터 과학자", "철학자", "수학자", "게임 디자이너"],
    celebrities: ["아인슈타인", "빌 게이츠", "래리 페이지"],
  },
  ESFP: {
    type: "ESFP",
    title: "자유로운 연예인",
    description:
      "활기차고 즐거움을 추구하는 사교적인 성격입니다. 주변 사람들에게 에너지를 주며, 순간을 즐깁니다.",
    traits: [
      "사교적이고 활발함",
      "현재를 즐기는 낙천성",
      "뛰어난 관찰력",
      "유연한 적응력",
    ],
    compatible: ["ISFJ", "ISTJ"],
    percentage: 9,
    careers: ["연예인", "이벤트 플래너", "영업사원", "여행 가이드", "스타일리스트"],
    celebrities: ["아이유", "엘비스 프레슬리", "마릴린 먼로"],
  },
  ISTP: {
    type: "ISTP",
    title: "만능 재주꾼",
    description:
      "논리적이면서도 실용적인 성격입니다. 손재주가 뛰어나며 문제를 현장에서 해결하는 데 탁월합니다.",
    traits: [
      "실용적 문제 해결",
      "침착하고 논리적",
      "독립적 성향",
      "뛰어난 적응력",
    ],
    compatible: ["ESTJ", "ESFJ"],
    percentage: 5,
    careers: ["엔지니어", "파일럿", "정비사", "소방관", "외과의사"],
    celebrities: ["마이클 조던", "클린트 이스트우드", "톰 크루즈"],
  },
  ESFJ: {
    type: "ESFJ",
    title: "사교적인 외교관",
    description:
      "따뜻하고 배려심이 깊은 성격입니다. 조화를 중시하며, 주변 사람들을 챙기는 데 탁월합니다.",
    traits: [
      "배려심과 친절함",
      "사교적 능력",
      "조화를 중시함",
      "책임감 있는 성격",
    ],
    compatible: ["ISFP", "ISTP"],
    percentage: 12,
    careers: ["교사", "간호사", "이벤트 기획자", "인사 관리자", "고객 서비스"],
    celebrities: ["테일러 스위프트", "제니퍼 가너", "앤디 코엔"],
  },
  INFJ: {
    type: "INFJ",
    title: "선의의 옹호자",
    description:
      "통찰력 있고 이상주의적인 성격입니다. 깊은 공감 능력으로 타인을 이해하며, 의미 있는 변화를 추구합니다.",
    traits: [
      "깊은 통찰력",
      "이상주의적 비전",
      "뛰어난 공감 능력",
      "의미를 추구함",
    ],
    compatible: ["ENFP", "ENTP"],
    percentage: 2,
    careers: ["상담 심리사", "작가", "인권 변호사", "교수", "코치"],
    celebrities: ["마틴 루터 킹", "간디", "레이디 가가"],
  },
  ENFJ: {
    type: "ENFJ",
    title: "정의로운 사회운동가",
    description:
      "카리스마와 공감 능력을 겸비한 리더입니다. 타인의 성장을 돕는 것에 열정적이며, 영감을 주는 사람입니다.",
    traits: [
      "타인의 성장을 도움",
      "카리스마 넘치는 리더십",
      "뛰어난 의사소통",
      "이타적 성격",
    ],
    compatible: ["INFP", "ISFP"],
    percentage: 3,
    careers: ["교사", "HR 매니저", "외교관", "심리치료사", "소셜 워커"],
    celebrities: ["오바마", "오프라 윈프리", "마틴 루터 킹"],
  },
  ISTJ: {
    type: "ISTJ",
    title: "청렴결백한 논리주의자",
    description:
      "신뢰할 수 있고 성실한 성격입니다. 전통과 규칙을 중시하며, 맡은 일에 대한 책임감이 강합니다.",
    traits: [
      "성실하고 꼼꼼함",
      "전통과 규칙 중시",
      "강한 책임감",
      "실용적 사고방식",
    ],
    compatible: ["ESFP", "ESTP"],
    percentage: 11,
    careers: ["회계사", "공무원", "은행원", "감사관", "법무사"],
    celebrities: ["워렌 버핏", "나탈리 포트만", "안젤라 메르켈"],
  },
  ESTP: {
    type: "ESTP",
    title: "모험을 즐기는 사업가",
    description:
      "에너지 넘치고 행동력이 뛰어난 성격입니다. 위험을 감수하며, 현실적인 문제 해결에 강합니다.",
    traits: [
      "행동력과 결단력",
      "모험을 즐김",
      "현실적 문제 해결",
      "사교적이고 대담함",
    ],
    compatible: ["ISFJ", "ISTJ"],
    percentage: 4,
    careers: ["기업가", "세일즈 매니저", "소방관", "스포츠 에이전트", "마케터"],
    celebrities: ["도널드 트럼프", "마돈나", "잭 니콜슨"],
  },
};

export function getResult(type: string): MBTIResult {
  return (
    detailedResults[type] || {
      type,
      title: `${type} 유형`,
      description: `당신은 ${type} 유형입니다. 독특한 성격 조합을 가지고 있습니다.`,
      traits: [
        "독특한 성격의 소유자",
        "균형 잡힌 시각",
        "다양한 상황에 적응",
        "자신만의 강점 보유",
      ],
      compatible: ["ENFP", "INTJ"],
      percentage: 5,
      careers: ["다양한 분야에서 활약 가능"],
      celebrities: [],
    }
  );
}
