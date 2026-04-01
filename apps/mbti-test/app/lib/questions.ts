export type MBTIAxis = "EI" | "SN" | "TF" | "JP";
export type MBTIDimension = "E" | "I" | "S" | "N" | "T" | "F" | "J" | "P";

export interface OptionScore {
  [key: string]: number;
}

export interface QuestionOption {
  emoji: string;
  textKey: string;
  score: OptionScore;
}

export interface Question {
  id: number;
  questionKey: string;
  axis: MBTIAxis;
  options: QuestionOption[];
}

export const questions: Question[] = [
  // === E/I axis (4 questions) ===
  {
    id: 1,
    questionKey: "questions.q1.question",
    axis: "EI",
    options: [
      { emoji: "\u{1F3E0}", textKey: "questions.q1.options.o1", score: { I: 2 } },
      { emoji: "\u{1F465}", textKey: "questions.q1.options.o2", score: { E: 2 } },
      { emoji: "\u{1F4DA}", textKey: "questions.q1.options.o3", score: { I: 1 } },
      { emoji: "\u{1F389}", textKey: "questions.q1.options.o4", score: { E: 2 } },
    ],
  },
  {
    id: 2,
    questionKey: "questions.q2.question",
    axis: "EI",
    options: [
      { emoji: "\u{1F64B}", textKey: "questions.q2.options.o1", score: { E: 2 } },
      { emoji: "\u{1F440}", textKey: "questions.q2.options.o2", score: { I: 2 } },
      { emoji: "\u{1F60A}", textKey: "questions.q2.options.o3", score: { I: 1 } },
      { emoji: "\u{1F5E3}\u{FE0F}", textKey: "questions.q2.options.o4", score: { E: 2 } },
    ],
  },
  {
    id: 3,
    questionKey: "questions.q3.question",
    axis: "EI",
    options: [
      { emoji: "\u{1F3B5}", textKey: "questions.q3.options.o1", score: { I: 2 } },
      { emoji: "\u{1F37B}", textKey: "questions.q3.options.o2", score: { E: 2 } },
      { emoji: "\u{270D}\u{FE0F}", textKey: "questions.q3.options.o3", score: { I: 1 } },
      { emoji: "\u{1F4AC}", textKey: "questions.q3.options.o4", score: { E: 1 } },
    ],
  },
  {
    id: 4,
    questionKey: "questions.q4.question",
    axis: "EI",
    options: [
      { emoji: "\u{1F3E2}", textKey: "questions.q4.options.o1", score: { E: 2 } },
      { emoji: "\u{1F4BB}", textKey: "questions.q4.options.o2", score: { I: 2 } },
      { emoji: "\u{1F91D}", textKey: "questions.q4.options.o3", score: { E: 1 } },
      { emoji: "\u{1F3E1}", textKey: "questions.q4.options.o4", score: { I: 1 } },
    ],
  },

  // === S/N axis (4 questions) ===
  {
    id: 5,
    questionKey: "questions.q5.question",
    axis: "SN",
    options: [
      { emoji: "\u{1F4CB}", textKey: "questions.q5.options.o1", score: { S: 2 } },
      { emoji: "\u{1F31F}", textKey: "questions.q5.options.o2", score: { N: 2 } },
      { emoji: "\u{1F4CD}", textKey: "questions.q5.options.o3", score: { S: 1 } },
      { emoji: "\u{1F5FA}\u{FE0F}", textKey: "questions.q5.options.o4", score: { N: 1 } },
    ],
  },
  {
    id: 6,
    questionKey: "questions.q6.question",
    axis: "SN",
    options: [
      { emoji: "\u{1F4D6}", textKey: "questions.q6.options.o1", score: { S: 2 } },
      { emoji: "\u{1F4A1}", textKey: "questions.q6.options.o2", score: { N: 2 } },
      { emoji: "\u{1F527}", textKey: "questions.q6.options.o3", score: { S: 1 } },
      { emoji: "\u{1F914}", textKey: "questions.q6.options.o4", score: { N: 1 } },
    ],
  },
  {
    id: 7,
    questionKey: "questions.q7.question",
    axis: "SN",
    options: [
      { emoji: "\u{1F4F0}", textKey: "questions.q7.options.o1", score: { S: 2 } },
      { emoji: "\u{1F52E}", textKey: "questions.q7.options.o2", score: { N: 2 } },
      { emoji: "\u{1F4CA}", textKey: "questions.q7.options.o3", score: { S: 1 } },
      { emoji: "\u{1F308}", textKey: "questions.q7.options.o4", score: { N: 1 } },
    ],
  },
  {
    id: 8,
    questionKey: "questions.q8.question",
    axis: "SN",
    options: [
      { emoji: "\u{1F4DD}", textKey: "questions.q8.options.o1", score: { S: 2 } },
      { emoji: "\u{1F680}", textKey: "questions.q8.options.o2", score: { N: 2 } },
      { emoji: "\u{2705}", textKey: "questions.q8.options.o3", score: { S: 1 } },
      { emoji: "\u{1F4AD}", textKey: "questions.q8.options.o4", score: { N: 1 } },
    ],
  },

  // === T/F axis (4 questions) ===
  {
    id: 9,
    questionKey: "questions.q9.question",
    axis: "TF",
    options: [
      { emoji: "\u{1F9E0}", textKey: "questions.q9.options.o1", score: { T: 2 } },
      { emoji: "\u{1F917}", textKey: "questions.q9.options.o2", score: { F: 2 } },
      { emoji: "\u{1F4CA}", textKey: "questions.q9.options.o3", score: { T: 1 } },
      { emoji: "\u{1F495}", textKey: "questions.q9.options.o4", score: { F: 1 } },
    ],
  },
  {
    id: 10,
    questionKey: "questions.q10.question",
    axis: "TF",
    options: [
      { emoji: "\u{2696}\u{FE0F}", textKey: "questions.q10.options.o1", score: { T: 2 } },
      { emoji: "\u{2764}\u{FE0F}", textKey: "questions.q10.options.o2", score: { F: 2 } },
      { emoji: "\u{1F4C8}", textKey: "questions.q10.options.o3", score: { T: 1 } },
      { emoji: "\u{1F91D}", textKey: "questions.q10.options.o4", score: { F: 1 } },
    ],
  },
  {
    id: 11,
    questionKey: "questions.q11.question",
    axis: "TF",
    options: [
      { emoji: "\u{1F3AF}", textKey: "questions.q11.options.o1", score: { T: 2 } },
      { emoji: "\u{1F54A}\u{FE0F}", textKey: "questions.q11.options.o2", score: { F: 2 } },
      { emoji: "\u{1F4D0}", textKey: "questions.q11.options.o3", score: { T: 1 } },
      { emoji: "\u{1F4AC}", textKey: "questions.q11.options.o4", score: { F: 1 } },
    ],
  },
  {
    id: 12,
    questionKey: "questions.q12.question",
    axis: "TF",
    options: [
      { emoji: "\u{1F50D}", textKey: "questions.q12.options.o1", score: { T: 2 } },
      { emoji: "\u{1F491}", textKey: "questions.q12.options.o2", score: { F: 2 } },
      { emoji: "\u{1F9EA}", textKey: "questions.q12.options.o3", score: { T: 1 } },
      { emoji: "\u{1F3AD}", textKey: "questions.q12.options.o4", score: { F: 1 } },
    ],
  },

  // === J/P axis (4 questions) ===
  {
    id: 13,
    questionKey: "questions.q13.question",
    axis: "JP",
    options: [
      { emoji: "\u{1F4C5}", textKey: "questions.q13.options.o1", score: { J: 2 } },
      { emoji: "\u{1F3B2}", textKey: "questions.q13.options.o2", score: { P: 2 } },
      { emoji: "\u{23F0}", textKey: "questions.q13.options.o3", score: { J: 1 } },
      { emoji: "\u{1F30A}", textKey: "questions.q13.options.o4", score: { P: 1 } },
    ],
  },
  {
    id: 14,
    questionKey: "questions.q14.question",
    axis: "JP",
    options: [
      { emoji: "\u{1F4CC}", textKey: "questions.q14.options.o1", score: { J: 2 } },
      { emoji: "\u{26A1}", textKey: "questions.q14.options.o2", score: { P: 2 } },
      { emoji: "\u{1F4CA}", textKey: "questions.q14.options.o3", score: { J: 1 } },
      { emoji: "\u{1F3AF}", textKey: "questions.q14.options.o4", score: { P: 1 } },
    ],
  },
  {
    id: 15,
    questionKey: "questions.q15.question",
    axis: "JP",
    options: [
      { emoji: "\u{2728}", textKey: "questions.q15.options.o1", score: { J: 2 } },
      { emoji: "\u{1F300}", textKey: "questions.q15.options.o2", score: { P: 2 } },
      { emoji: "\u{1F4C1}", textKey: "questions.q15.options.o3", score: { J: 1 } },
      { emoji: "\u{1F937}", textKey: "questions.q15.options.o4", score: { P: 1 } },
    ],
  },
  {
    id: 16,
    questionKey: "questions.q16.question",
    axis: "JP",
    options: [
      { emoji: "\u{1F624}", textKey: "questions.q16.options.o1", score: { J: 2 } },
      { emoji: "\u{1F604}", textKey: "questions.q16.options.o2", score: { P: 2 } },
      { emoji: "\u{1F504}", textKey: "questions.q16.options.o3", score: { J: 1 } },
      { emoji: "\u{1F3C4}", textKey: "questions.q16.options.o4", score: { P: 1 } },
    ],
  },
];
