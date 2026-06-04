import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import "./App.css";

const STORAGE_KEY = "snack_survey_draft_v2";
const VIDEO_SRC = "/videos/snack-shorts.mp4";

const PACKAGING_ITEMS = [
  {
    id: "q3",
    reasonId: "q4",
    displayNo: "3",
    reasonDisplayNo: "4",
    title: "가격과 양이 똑같은 과자라면, 어떤 포장을 가장 선호하나요?",
    image: "/images/q11.png",
    options: ["원통형", "상자형", "봉지형"],
    reasonTitle: "그렇게 선택한 이유를 모두 고르시오.",
    reasons: [
      "더 맛있어 보여서",
      "먹다 남은 것을 보관하기 편해서",
      "들고 다니며 먹기 편할 것 같아서",
      "디자인이 예뻐서",
      "양이 더 많아 보여서",
      "쓰레기가 적게 나올 것 같아서",
      "익숙해서",
    ],
  },
  {
    id: "q5",
    reasonId: "q6",
    displayNo: "5",
    reasonDisplayNo: "6",
    title: "다음 중 더 선호하는 과자는 무엇입니까?",
    image: "/images/q13.png",
    options: ["A 원통형", "B 봉지형"],
    reasonTitle: "그렇게 선택한 이유를 모두 고르시오.",
    reasons: [
      "더 맛있어서",
      "더 저렴해서",
      "보관하기 편해서",
      "양이 더 많기 때문에",
      "쓰레기 처리가 편해서",
    ],
  },
];

const PRE_SURVEY_KEYS = PACKAGING_ITEMS.flatMap((item) =>
  item.reasonId ? [item.id, item.reasonId] : [item.id]
);

function normalizePreSurvey(preSurvey = {}) {
  return Object.fromEntries(
    Object.entries(preSurvey).filter(([key]) => PRE_SURVEY_KEYS.includes(key))
  );
}


const BASIC_FREQUENCY_OPTIONS = [
  "전혀 없음",
  "1~3회",
  "4~6회",
  "7~9회",
  "10회 이상",
];

const OPINION_REFLECT_OPTIONS = [
  "매우 많이 반영된다",
  "많이 반영된다",
  "보통이다",
  "반영되지 않는다",
  "전혀 반영되지 않는다",
];

const BASIC_PACKAGE_EXPERIENCE_ITEMS = [
  {
    id: "q2_1_pouch",
    displayNo: "2-1",
    label: "봉지형",
    image: "/images/q4_pouch.png",
    fallbackImage: "/images/game_pouch.png",
  },
  {
    id: "q2_2_box",
    displayNo: "2-2",
    label: "상자형",
    image: "/images/q4_box.png",
    fallbackImage: "/images/game_box.png",
  },
  {
    id: "q2_3_cylinder",
    displayNo: "2-3",
    label: "원통형",
    image: "/images/q4_cylinder.png",
    fallbackImage: "/images/game_cylinder.png",
  },
];

const CONVENIENCE_ITEMS = [
  {
    id: "q7_1",
    title: "7-1. 원통형 포장은 남은 음식을 보관하기 편하다고 생각한다.",
  },
  {
    id: "q7_2",
    title: "7-2. 원통형 포장은 쌓아두기 편하다고 생각한다.",
  },
  {
    id: "q7_3",
    title: "7-3. 원통형 포장은 과자가 덜 부서진다고 생각한다.",
  },
  {
    id: "q7_4",
    title: "7-4. 원통형 포장은 들고 다니며 먹기 편하다고 생각한다.",
  },
  {
    id: "q7_5",
    title: "7-5. 나는 과자 포장을 올바르게 분리배출할 수 있다.",
  },
];

const LIKERT_OPTIONS = [
  "전혀 그렇지 않다",
  "그렇지 않다",
  "보통이다",
  "그렇다",
  "매우 그렇다",
];

const POST_REASONS = [
  "보관하기 편해서",
  "먹다가 남겨도 다시 닫을 수 있어서",
  "맛이 있어서",
  "환경에 좋지 않을 것 같아서",
  "분리배출이 어려워서",
  "분리배출하기 귀찮아서",
  "쓰레기가 많이 나와서",
  "기타",
];

const BINS = [
  {
    id: "general",
    icon: "🗑️",
    name: "일반",
    label: "🗑️ 일반",
    image: "/images/bin_general.png",
  },
  {
    id: "plastic",
    icon: "🧴",
    name: "플라스틱",
    label: "🧴 플라스틱",
    image: "/images/bin_plastic.png",
  },
  {
    id: "vinyl",
    icon: "🛍️",
    name: "비닐",
    label: "🛍️ 비닐",
    image: "/images/bin_vinyl.png",
  },
  {
    id: "metal",
    icon: "🥫",
    name: "금속",
    label: "🥫 금속",
    image: "/images/bin_metal.png",
  },
  {
    id: "paper",
    icon: "📄",
    name: "종이",
    label: "📄 종이",
    image: "/images/bin_paper.png",
  },
];

const POUCH_HOTSPOTS = [
  {
    id: "pouch",
    label: "과자 봉지",
    correctBin: "vinyl",
    z: 10,
    svg: {
      type: "polygon",
      points: "145,95 790,70 860,200 895,845 195,915 105,230",
    },
    pieceImage: "/images/piece_pouch.png",
  },
];

const BOX_HOTSPOTS = [
  {
    id: "outer_box",
    label: "상자",
    correctBin: "paper",
    z: 10,
    svg: {
      type: "path",
      d:
        "M18,515 L285,382 L962,654 L965,846 L865,957 L278,845 L12,655 Z " +
        "M302,245 L425,105 L728,239 L894,287 L959,434 L924,557 L813,614 L566,562 L329,470 L238,357 Z",
    },
    pieceImage: "/images/piece_box_outer.png",
  },
  {
    id: "inner_pack",
    label: "속포장",
    correctBin: "vinyl",
    z: 30,
    svg: {
      type: "path",
      d:
        "M268,461 L365,391 L526,358 L672,412 L782,505 L833,632 " +
        "L792,760 L665,828 L492,812 L353,760 L245,650 L210,542 Z " +
        "M713,455 L817,411 L890,471 L900,610 L833,690 L742,651 Z",
    },
    pieceImage: "/images/piece_box_inner.png",
  },
];

const PRINGLES_VIEWBOX = "0 0 1589 1027";

const PRINGLES_HOTSPOTS = [
  {
    id: "body_print",
    label: "원통 본체",
    correctBin: "general",
    z: 20,
    svg: {
      type: "polygon",
      points:
        "500,115 680,145 920,220 1195,310 1390,370 " +
        "1210,895 1035,855 790,775 575,665 470,555 " +
        "420,425 430,285",
    },
    pieceImage: "/images/piece_cylinder_print.png",
  },
  {
    id: "lid",
    label: "플라스틱 뚜껑",
    correctBin: "plastic",
    z: 80,
    svg: {
      type: "polygon",
      points:
        "195,660 235,595 315,535 425,505 535,520 630,580 " +
        "690,665 700,745 655,820 560,870 440,890 315,865 " +
        "220,805 175,730",
    },
    pieceImage: "/images/piece_cylinder_lid.png",
  },
  {
    id: "inner_lid",
    label: "속뚜껑",
    correctBin: "general",
    z: 90,
    svg: {
      type: "polygon",
      points:
        "150,65 260,25 395,45 510,125 575,250 555,385 " +
        "465,490 335,530 210,490 130,390 105,260",
    },
    pieceImage: "/images/piece_q19_inner_lid.png",
    className: "q19-inner-lid-piece",
    overlayInStage: true,
  },
  {
    id: "bottom",
    label: "알루미늄 바닥",
    correctBin: "metal",
    z: 100,
    svg: {
      type: "polygon",
      points:
        "1345,335 1470,360 1478,415 1260,930 1180,900 " +
        "1215,780 1370,395",
    },
    pieceImage: "/images/piece_cylinder_bottom.png",
  },
];

const Q19_VIEWBOX = PRINGLES_VIEWBOX;

const Q19_BODY_HIT = {
  ...PRINGLES_HOTSPOTS.find((part) => part.id === "body_print"),
};

const Q19_LID_HIT = {
  ...PRINGLES_HOTSPOTS.find((part) => part.id === "lid"),
};

const Q19_INNER_LID_HIT = {
  ...PRINGLES_HOTSPOTS.find((part) => part.id === "inner_lid"),
};

const Q19_BOTTOM_ATTACHED_HIT = {
  ...PRINGLES_HOTSPOTS.find((part) => part.id === "bottom"),
};

const Q19_BOTTOM_DETACHED_HIT = {
  id: "bottom",
  label: "알루미늄 바닥",
  correctBin: "metal",
  z: 120,
  svg: {
    type: "polygon",
    points:
      "1382,574 1400,528 1430,480 1470,432 1515,400 1550,438 " +
      "1576,565 1562,704 1522,836 1454,924 1369,950 1332,914 " +
      "1314,868 1309,800 1313,726 1327,658 1340,604 1360,566",
  },
};

const Q19_PART_DEFS = [
  { id: "lid", label: "플라스틱 뚜껑", correctBin: "plastic" },
  { id: "inner_lid", label: "속뚜껑", correctBin: "general" },
  { id: "bottom", label: "알루미늄 바닥", correctBin: "metal" },
  { id: "body_print", label: "겉 인쇄 코팅면", correctBin: "general" },
  { id: "body_paper", label: "종이 부분", correctBin: "paper" },
  { id: "body_foil", label: "은박 코팅 부분", correctBin: "general" },
];

const Q19_LAYER_BASE = [
  {
    id: "body_print",
    label: "겉 인쇄 코팅면",
    correctBin: "general",
    pieceImage: "/images/piece_q19_print.png",
    className: "q19-print-piece",
    hit: Q19_BODY_HIT,
  },
  {
    id: "lid",
    label: "플라스틱 뚜껑",
    correctBin: "plastic",
    pieceImage: "/images/piece_q19_lid.png",
    className: "q19-lid-piece",
    hit: Q19_LID_HIT,
  },
  {
    id: "inner_lid",
    label: "속뚜껑",
    correctBin: "general",
    pieceImage: "/images/piece_q19_inner_lid.png",
    className: "q19-inner-lid-piece",
    hit: Q19_INNER_LID_HIT,
  },
];

const Q19_PAPER_LAYER = {
  id: "body_paper",
  label: "종이 부분",
  correctBin: "paper",
  pieceImage: "/images/piece_q19_paper.png",
  className: "q19-paper-piece",
  hit: Q19_BODY_HIT,
};

const Q19_FOIL_LAYER = {
  id: "body_foil",
  label: "은박 코팅 부분",
  correctBin: "general",
  pieceImage: "/images/piece_q19_foil.png",
  className: "q19-foil-piece",
  hit: Q19_BODY_HIT,
};

function getQ19BottomPiece(selectedParts) {
  const paperRemoved = !!selectedParts.body_paper?.selectedBin;

  return {
    id: "bottom",
    label: "알루미늄 바닥",
    correctBin: "metal",
    pieceImage: paperRemoved
      ? "/images/piece_q19_bottom.png"
      : "/images/piece_cylinder_bottom.png",
    className: paperRemoved
      ? "q19-bottom-piece q19-bottom-detached-piece"
      : "q19-bottom-piece",
    hit: paperRemoved ? Q19_BOTTOM_DETACHED_HIT : Q19_BOTTOM_ATTACHED_HIT,
  };
}

function getQ19BaseImage(selectedParts) {
  if (selectedParts.body_paper?.selectedBin) {
    return "/images/q19_foil.png";
  }

  if (selectedParts.body_print?.selectedBin) {
    return "/images/q19_paper.png";
  }

  return "/images/q19_print.png";
}

const GAME_ITEMS = [
  {
    id: "pre_game_pouch",
    name: "봉지형 포장 과자",
    image: "/images/game_pouch.png",
    hotspots: [
      {
        ...POUCH_HOTSPOTS[0],
        pieceImage: "/images/game_pouch.png",
      },
    ],
    layeredPieces: [
      {
        id: "pouch",
        label: "포장 전체",
        correctBin: "vinyl",
        pieceImage: "/images/game_pouch.png",
        className: "pouch-piece",
      },
    ],
  },
  {
    id: "pre_game_box",
    name: "상자형 포장 과자",
    image: "/images/game_box.png",
    hotspots: BOX_HOTSPOTS,
    layeredPieces: [
      {
        id: "outer_box",
        label: "상자",
        correctBin: "paper",
        pieceImage: "/images/piece_box_outer.png",
        className: "box-outer-piece",
      },
      {
        id: "inner_pack",
        label: "속포장",
        correctBin: "vinyl",
        pieceImage: "/images/piece_box_inner.png",
        className: "box-inner-piece",
      },
    ],
  },
  {
    id: "pre_game_cylinder",
    name: "원통형 포장 과자",
    image: "/images/game_cylinder.png",
    viewBox: PRINGLES_VIEWBOX,
    hotspots: PRINGLES_HOTSPOTS,
    maskGame: true,
  },
];

function getBinLabel(binId) {
  const bin = BINS.find((item) => item.id === binId);
  return bin ? bin.label : binId;
}

function getResultPieceImage(log) {
  const gameItem = GAME_ITEMS.find((item) => item.id === log.gameItemId);

  if (!gameItem) return "";

  if (log.targetPartId === "whole_package") {
    return gameItem.image || "";
  }

  const layeredPiece = gameItem.layeredPieces?.find(
    (piece) => piece.id === log.targetPartId
  );

  if (layeredPiece?.pieceImage) {
    return layeredPiece.pieceImage;
  }

  const hotspotPiece = gameItem.hotspots?.find(
    (part) => part.id === log.targetPartId
  );

  return hotspotPiece?.pieceImage || gameItem.image || "";
}

function getPercent(score, maxScore) {
  if (!maxScore) return 0;
  return Math.round((score / maxScore) * 1000) / 10;
}

function isPouchGameItem(item) {
  return item?.id === "pre_game_pouch";
}

function isBoxGameItem(item) {
  return item?.id === "pre_game_box";
}

function isGameItemAutoComplete(item, mode, selectedMap) {
  if (!item || !mode) return false;

  if (mode === "no_separation") {
    return !!selectedMap.__whole_package?.selectedBin;
  }

  if (mode === "separate") {
    return item.hotspots.every((part) => !!selectedMap[part.id]?.selectedBin);
  }

  return false;
}

function makeRespondentNo() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const hh = String(now.getHours()).padStart(2, "0");
  const mi = String(now.getMinutes()).padStart(2, "0");
  const ss = String(now.getSeconds()).padStart(2, "0");
  const random = Math.random().toString(36).slice(2, 6).toUpperCase();

  return `R-${yyyy}${mm}${dd}-${hh}${mi}${ss}-${random}`;
}

function createInitialGame() {
  return {
    currentIndex: 0,
    modes: {},
    selectedParts: {},
    logs: [],
    score: 0,
    maxScore: 0,
  };
}

function createInitialSurvey() {
  return {
    respondentNo: makeRespondentNo(),
    grade: "",
    gender: "",
    basicSurvey: {
      q1: "",
      q2_1_pouch: "",
      q2_2_box: "",
      q2_3_cylinder: "",
    },
    preSurvey: {},
    convenienceSurvey: {
      q7_1: "",
      q7_2: "",
      q7_3: "",
      q7_4: "",
      q7_5: "",
    },
    afterGame: {
      q8: "",
      q9: "",
    },
    postPerception: {
      q10: "",
      q11: "",
    },
    postSurvey: {
      q12: "",
      q13: [],
      q13Other: "",
      q14: "",
    },
    video: {
      watched: false,
      watchedAt: "",
    },
    voiceQuiz: {
      answer: "",
      submittedAt: "",
    },
    eventEntry: {
      studentId: "",
      name: "",
      applied: false,
      skipped: false,
      submittedAt: "",
    },
    q19Quiz: {
      selectedParts: {},
      logs: [],
      score: 0,
      maxScore: 0,
      percent: 0,
      allCorrect: false,
      selectedSummary: "",
      finalImageStage: "print",
      finalized: false,
    },
    game: createInitialGame(),
  };
}

function joinReasons(value) {
  return Array.isArray(value) ? value.join(" | ") : "";
}

function buildSurveyRow(nextSurvey, hasFullEventInfo, meta = {}) {
  const now = new Date().toISOString();
  const status = meta.status || "in_progress";

  return {
    respondent_no: nextSurvey.respondentNo,

    status,
    last_step: meta.lastStep || "intro",
    pre_index: meta.preIndex ?? 0,

    grade: nextSurvey.grade,
    gender: nextSurvey.gender,

    q1_opinion_reflect: nextSurvey.basicSurvey?.q1 || "",
    q2_1_pouch_experience: nextSurvey.basicSurvey?.q2_1_pouch || "",
    q2_2_box_experience: nextSurvey.basicSurvey?.q2_2_box || "",
    q2_3_cylinder_experience: nextSurvey.basicSurvey?.q2_3_cylinder || "",

    q3_package_preference: nextSurvey.preSurvey?.q3 || "",
    q4_preference_reasons: joinReasons(nextSurvey.preSurvey?.q4),
    q5_pair_preference: nextSurvey.preSurvey?.q5 || "",
    q6_pair_reasons: joinReasons(nextSurvey.preSurvey?.q6),

    q7_1_storage_convenience: nextSurvey.convenienceSurvey?.q7_1 || "",
    q7_2_stack_convenience: nextSurvey.convenienceSurvey?.q7_2 || "",
    q7_3_breakage_protection: nextSurvey.convenienceSurvey?.q7_3 || "",
    q7_4_portable_convenience: nextSurvey.convenienceSurvey?.q7_4 || "",
    q7_5_recycle_confidence: nextSurvey.convenienceSurvey?.q7_5 || "",

    pre_game_score: nextSurvey.game?.score ?? 0,
    pre_game_max_score: nextSurvey.game?.maxScore ?? 0,
    pre_game_logs: nextSurvey.game?.logs || [],

    q8_after_game_difficulty: nextSurvey.afterGame?.q8 || "",
    q9_after_game_environment: nextSurvey.afterGame?.q9 || "",

    voice_quiz_answer: nextSurvey.voiceQuiz?.answer || "",

    post_quiz_score: nextSurvey.q19Quiz?.score ?? 0,
    post_quiz_max_score: nextSurvey.q19Quiz?.maxScore ?? 0,
    post_quiz_logs: nextSurvey.q19Quiz?.logs || [],

    q10_after_video_difficulty: nextSurvey.postPerception?.q10 || "",
    q11_after_video_environment: nextSurvey.postPerception?.q11 || "",

    q12_purchase_intent: nextSurvey.postSurvey?.q12 || "",
    q13_purchase_reasons: joinReasons(nextSurvey.postSurvey?.q13),
    q13_other: nextSurvey.postSurvey?.q13Other || "",
    q14_friend_purchase_prediction: nextSurvey.postSurvey?.q14 || "",

    event_applied: hasFullEventInfo,
    event_student_id: hasFullEventInfo ? nextSurvey.eventEntry?.studentId || "" : null,
    event_name: hasFullEventInfo ? nextSurvey.eventEntry?.name || "" : null,

    survey_json: nextSurvey,
    game_logs_json: nextSurvey.game?.logs || [],
    q19_logs_json: nextSurvey.q19Quiz?.logs || [],

    updated_at: now,
    completed_at: status === "completed" ? now : null,

    payload: nextSurvey,
  };
}

function normalizeSurvey(survey) {
  const base = createInitialSurvey();

  return {
    ...base,
    ...survey,
    basicSurvey: {
      ...base.basicSurvey,
      ...(survey?.basicSurvey || {}),
    },
    preSurvey: normalizePreSurvey(survey?.preSurvey || {}),
    convenienceSurvey: {
      ...base.convenienceSurvey,
      ...(survey?.convenienceSurvey || {}),
    },
    afterGame: {
      ...base.afterGame,
      ...(survey?.afterGame || {}),
    },
    postPerception: {
      ...base.postPerception,
      ...(survey?.postPerception || {}),
    },
    postSurvey: {
      ...base.postSurvey,
      ...(survey?.postSurvey || {}),
      q13: Array.isArray(survey?.postSurvey?.q13) ? survey.postSurvey.q13 : [],
    },
    video: {
      ...base.video,
      ...(survey?.video || {}),
    },
    voiceQuiz: {
      ...base.voiceQuiz,
      ...(survey?.voiceQuiz || {}),
    },
    eventEntry: {
      ...base.eventEntry,
      ...(survey?.eventEntry || {}),
    },
    q19Quiz: {
      ...base.q19Quiz,
      ...(survey?.q19Quiz || {}),
      selectedParts: survey?.q19Quiz?.selectedParts || {},
      logs: survey?.q19Quiz?.logs || [],
    },
    game: {
      ...base.game,
      ...(survey?.game || {}),
      modes: survey?.game?.modes || {},
      selectedParts: survey?.game?.selectedParts || {},
      logs: survey?.game?.logs || [],
    },
  };
}

function loadSavedDraft() {
  const raw = localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return {
      step: "intro",
      preIndex: 0,
      survey: createInitialSurvey(),
    };
  }

  try {
    const saved = JSON.parse(raw);

    return {
      step: saved.step === "voiceQuiz" ? "video" : saved.step || "intro",
      preIndex: saved.preIndex >= 0 && saved.preIndex < PACKAGING_ITEMS.length ? saved.preIndex : 0,
      survey: normalizeSurvey(saved.survey || createInitialSurvey()),
    };
  } catch {
    localStorage.removeItem(STORAGE_KEY);

    return {
      step: "intro",
      preIndex: 0,
      survey: createInitialSurvey(),
    };
  }
}

export default function App() {
  const savedDraft = loadSavedDraft();

  const [step, setStep] = useState(savedDraft.step);
  const [survey, setSurvey] = useState(savedDraft.survey);
  const [preIndex, setPreIndex] = useState(savedDraft.preIndex);
  const [binModal, setBinModal] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        step,
        preIndex,
        survey,
      })
    );

    const hasStarted = step !== "intro" || survey.grade || survey.gender;
    const isAlreadySubmitted = !!survey.eventEntry?.submittedAt;

  if (!hasStarted || isSubmitting || isAlreadySubmitted) return;

    const timer = window.setTimeout(async () => {
    const hasVoiceQuizAnswer = !!(survey.voiceQuiz?.answer || "").trim();
    const hasFullEventInfo =
      hasVoiceQuizAnswer &&
      !!(survey.eventEntry?.studentId || "").trim() &&
      !!(survey.eventEntry?.name || "").trim();

    const status = survey.eventEntry?.submittedAt
      ? "completed"
      : step === "intro"
      ? "started"
      : "in_progress";

    const row = buildSurveyRow(survey, hasFullEventInfo, {
      status,
      lastStep: step,
      preIndex,
    });

    const { error } = await supabase
      .from("snack_survey_responses")
      .upsert(row, { onConflict: "respondent_no" });

    if (error) {
      console.error("Supabase 중간 저장 오류:", error);
    }
  }, 800);

  return () => window.clearTimeout(timer);

  }, [step, preIndex, survey, isSubmitting]);

  function updateBasic(field, value) {
    setSurvey((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function updateBasicSurvey(field, value) {
    setSurvey((prev) => ({
      ...prev,
      basicSurvey: {
        ...(prev.basicSurvey || {}),
        [field]: value,
      },
    }));
  }

  function updatePre(questionId, value) {
    setSurvey((prev) => ({
      ...prev,
      preSurvey: {
        ...prev.preSurvey,
        [questionId]: value,
      },
    }));
  }

  function togglePreReason(reasonId, value) {
    setSurvey((prev) => {
      const current = prev.preSurvey[reasonId] || [];
      const next = current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value];

      return {
        ...prev,
        preSurvey: {
          ...prev.preSurvey,
          [reasonId]: next,
        },
      };
    });
  }

  function updateConvenience(field, value) {
    setSurvey((prev) => ({
      ...prev,
      convenienceSurvey: {
        ...prev.convenienceSurvey,
        [field]: value,
      },
    }));
  }


  function updateAfterGame(field, value) {
    setSurvey((prev) => ({
      ...prev,
      afterGame: {
        ...prev.afterGame,
        [field]: value,
      },
    }));
  }

  function updatePostPerception(field, value) {
    setSurvey((prev) => ({
      ...prev,
      postPerception: {
        ...(prev.postPerception || {}),
        [field]: value,
      },
    }));
  }

  function updatePost(field, value) {
    setSurvey((prev) => ({
      ...prev,
      postSurvey: {
        ...prev.postSurvey,
        [field]: value,
      },
    }));
  }

  function togglePostReason(value) {
    setSurvey((prev) => {
      const current = prev.postSurvey.q13 || [];
      const isRemoving = current.includes(value);
      const next = isRemoving
        ? current.filter((item) => item !== value)
        : [...current, value];

      return {
        ...prev,
        postSurvey: {
          ...prev.postSurvey,
          q13: next,
          q13Other:
            value === "기타" && isRemoving ? "" : prev.postSurvey.q13Other || "",
        },
      };
    });
  }

  function startSurvey() {
    if (!survey.grade || !survey.gender) {
      alert("학년과 성별을 선택하세요.");
      return;
    }

    setStep("basicSurvey");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function finishBasicSurvey() {
    const { q1, q2_1_pouch, q2_2_box, q2_3_cylinder } = survey.basicSurvey || {};

    if (!q1) {
      alert("1번 문항에 응답하세요.");
      return;
    }

    if (!q2_1_pouch || !q2_2_box || !q2_3_cylinder) {
      alert("2번 포장 형태별 이용 경험에 모두 응답하세요.");
      return;
    }

    setStep("preference");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function nextPre() {
    const item = PACKAGING_ITEMS[preIndex];
    const choice = survey.preSurvey[item.id];
    const reasons = item.reasonId ? survey.preSurvey[item.reasonId] || [] : [];

    if (!choice) {
      alert("선택 문항에 응답하세요.");
      return;
    }

    if (item.reasonId && reasons.length === 0) {
      alert("선택 이유를 1개 이상 고르세요.");
      return;
    }

    if (preIndex < PACKAGING_ITEMS.length - 1) {
      setPreIndex(preIndex + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setStep("convenience");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function finishConvenience() {
    const convenienceSurvey = survey.convenienceSurvey || {};
    const unansweredItem = CONVENIENCE_ITEMS.find((item) => !convenienceSurvey[item.id]);

    if (unansweredItem) {
      alert("7-1번부터 7-5번까지 모두 응답하세요.");
      return;
    }

    setStep("game");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  


  function chooseGameMode(mode) {
    const item = GAME_ITEMS[survey.game.currentIndex];

    setSurvey((prev) => {
      const currentParts = {
        ...(prev.game.selectedParts[item.id] || {}),
      };

      if (mode === "no_separation") {
        item.hotspots.forEach((part) => {
          delete currentParts[part.id];
        });
      } else {
        delete currentParts.__whole_package;
      }

      return {
        ...prev,
        game: {
          ...prev.game,
          modes: {
            ...prev.game.modes,
            [item.id]: mode,
          },
          selectedParts: {
            ...prev.game.selectedParts,
            [item.id]: currentParts,
          },
        },
      };
    });
  }

  function tapGamePart(partId) {
    const item = GAME_ITEMS[survey.game.currentIndex];
    const mode = survey.game.modes[item.id];

    if (mode !== "separate") {
      alert("먼저 ‘분리할 부분 없음 또는 있음’을 선택하세요.");
      return;
    }

    setSurvey((prev) => {
      const itemParts = {
        ...(prev.game.selectedParts[item.id] || {}),
      };

      if (!itemParts[partId]) {
        itemParts[partId] = {
          selectedBin: "",
          selectedBinLabel: "",
          selectedAt: new Date().toISOString(),
        };
      }

      return {
        ...prev,
        game: {
          ...prev.game,
          selectedParts: {
            ...prev.game.selectedParts,
            [item.id]: itemParts,
          },
        },
      };
    });
  }

  function assignGamePartBin(partId, binId) {
    const item = GAME_ITEMS[survey.game.currentIndex];

    setSurvey((prev) => {
      const itemParts = {
        ...(prev.game.selectedParts[item.id] || {}),
      };

      itemParts[partId] = {
        ...(itemParts[partId] || {}),
        selectedBin: binId,
        selectedBinLabel: getBinLabel(binId),
        selectedAt: new Date().toISOString(),
      };

      return {
        ...prev,
        game: {
          ...prev.game,
          selectedParts: {
            ...prev.game.selectedParts,
            [item.id]: itemParts,
          },
        },
      };
    });
  }

  function removeGamePartSelection(partId) {
    const item = GAME_ITEMS[survey.game.currentIndex];

    setSurvey((prev) => {
      const itemParts = {
        ...(prev.game.selectedParts[item.id] || {}),
      };

      delete itemParts[partId];

      return {
        ...prev,
        game: {
          ...prev.game,
          selectedParts: {
            ...prev.game.selectedParts,
            [item.id]: itemParts,
          },
        },
      };
    });
  }

  function chooseBin(binId) {
    if (!binModal) return;

    if (binModal.type === "game") {
      assignGamePartBin(binModal.partId, binId);
      setBinModal(null);
      return;
    }

    if (binModal.type === "q19") {
      setSurvey((prev) => ({
        ...prev,
        q19Quiz: {
          ...prev.q19Quiz,
          selectedParts: {
            ...prev.q19Quiz.selectedParts,
            [binModal.partId]: {
              selectedBin: binId,
              selectedBinLabel: getBinLabel(binId),
              selectedAt: new Date().toISOString(),
            },
          },
        },
      }));

      setBinModal(null);
      return;
    }

    setBinModal(null);
  }

  function openGameBinModal(partId, partLabel) {
    setBinModal({
      type: "game",
      partId,
      title: `${partLabel}를 어디에 버릴까요?`,
      desc: "알맞은 배출함을 선택하세요.",
    });
  }

  function finishCurrentGameItem() {
    const item = GAME_ITEMS[survey.game.currentIndex];
    const mode = survey.game.modes[item.id] || "";
    const selectedMap = survey.game.selectedParts[item.id] || {};

    if (!mode) {
      alert("먼저 ‘분리할 부분 없음’ 또는 ‘분리할 부분 있음’을 선택하세요.");
      return;
    }

    if (mode === "no_separation") {
      const wholeAnswer = selectedMap.__whole_package;

      if (!wholeAnswer) {
        alert("포장 전체를 어디에 버릴지 선택하세요.");
        return;
      }

      if (isPouchGameItem(item)) {
        const isCorrect = wholeAnswer.selectedBin === "vinyl";

        const log = {
          stage: "pre_video_game",
          selectionStatus: "whole_package_no_separation",
          gameItemId: item.id,
          gameItemName: item.name,
          targetPartId: "whole_package",
          targetPartLabel: "포장 전체(분리할 부분 없음)",
          selectedBin: wholeAnswer.selectedBin,
          selectedBinLabel: wholeAnswer.selectedBinLabel,
          correctBin: "vinyl",
          correctBinLabel: getBinLabel("vinyl"),
          isCorrect,
          eventTime: wholeAnswer.selectedAt,
        };

        moveToNextGameItem([log], isCorrect ? 1 : 0, 1);
        return;
      }

      if (isBoxGameItem(item)) {
        const logs = item.hotspots.map((part) => ({
          stage: "pre_video_game",
          selectionStatus: "whole_package_no_separation",
          gameItemId: item.id,
          gameItemName: item.name,
          targetPartId: part.id,
          targetPartLabel: part.label,
          selectedBin: wholeAnswer.selectedBin,
          selectedBinLabel: wholeAnswer.selectedBinLabel,
          correctBin: part.correctBin,
          correctBinLabel: getBinLabel(part.correctBin),
          isCorrect: false,
          eventTime: wholeAnswer.selectedAt,
        }));

        moveToNextGameItem(logs, 0, item.hotspots.length);
        return;
      }

      const logs = item.hotspots.map((part) => ({
        stage: "pre_video_game",
        selectionStatus: "whole_package_no_separation",
        gameItemId: item.id,
        gameItemName: item.name,
        targetPartId: part.id,
        targetPartLabel: part.label,
        selectedBin: wholeAnswer.selectedBin,
        selectedBinLabel: wholeAnswer.selectedBinLabel,
        correctBin: part.correctBin,
        correctBinLabel: getBinLabel(part.correctBin),
        isCorrect: false,
        eventTime: wholeAnswer.selectedAt,
      }));

      moveToNextGameItem(logs, 0, item.hotspots.length);
      return;
    }

    const selectedPartCount = Object.keys(selectedMap).filter(
      (key) => !key.startsWith("__")
    ).length;

    if (selectedPartCount === 0) {
      alert("분리할 부분이 있다고 선택한 경우, 이미지에서 분리할 부분을 최소 1개 이상 터치하세요.");
      return;
    }

    const unassignedPart = item.hotspots.find(
      (part) => selectedMap[part.id] && !selectedMap[part.id].selectedBin
    );

    if (unassignedPart) {
      alert("선택한 조각을 배출함으로 끌어다 놓거나, 조각을 선택한 뒤 배출함을 눌러 주세요.");
      return;
    }

    let addScore = 0;
    const addMaxScore = item.hotspots.length;

    const logs = item.hotspots.map((part) => {
      const answer = selectedMap[part.id] || null;
      const isSelected = answer !== null;
      const isCorrect = isSelected && answer.selectedBin === part.correctBin;

      if (isCorrect) {
        addScore += 1;
      }

      return {
        stage: "pre_video_game",
        selectionStatus: isSelected ? "selected" : "not_selected",
        gameItemId: item.id,
        gameItemName: item.name,
        targetPartId: part.id,
        targetPartLabel: part.label,
        selectedBin: isSelected ? answer.selectedBin : "",
        selectedBinLabel: isSelected ? answer.selectedBinLabel : "",
        correctBin: part.correctBin,
        correctBinLabel: getBinLabel(part.correctBin),
        isCorrect,
        eventTime: isSelected ? answer.selectedAt : new Date().toISOString(),
      };
    });

    moveToNextGameItem(logs, addScore, addMaxScore);
  }

  function moveToNextGameItem(logs, addScore, addMaxScore) {
    const isLastGameItem = survey.game.currentIndex >= GAME_ITEMS.length - 1;

    setSurvey((prev) => ({
      ...prev,
      game: {
        ...prev.game,
        currentIndex: isLastGameItem
          ? prev.game.currentIndex
          : prev.game.currentIndex + 1,
        logs: [...prev.game.logs, ...logs],
        score: prev.game.score + addScore,
        maxScore: prev.game.maxScore + addMaxScore,
      },
    }));

    if (isLastGameItem) {
      setStep("afterGame");
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  useEffect(() => {
    if (step !== "game") return;

    const item = GAME_ITEMS[survey.game.currentIndex];
    const mode = item ? survey.game.modes[item.id] || "" : "";
    const selectedMap = item ? survey.game.selectedParts[item.id] || {} : {};

    if (!isGameItemAutoComplete(item, mode, selectedMap)) return;

    const timer = window.setTimeout(() => {
      finishCurrentGameItem();
    }, 450);

    return () => window.clearTimeout(timer);
  }, [step, survey.game.currentIndex, survey.game.modes, survey.game.selectedParts]);

  function finishAfterGame() {
    if (!survey.afterGame.q8 || !survey.afterGame.q9) {
      alert("8번과 9번 문항에 모두 응답하세요.");
      return;
    }

    setStep("gameResult");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function finishPostPerception() {
    const postPerception = survey.postPerception || {};

    if (!postPerception.q10 || !postPerception.q11) {
      alert("10번과 11번 문항에 모두 응답하세요.");
      return;
    }

    setStep("post");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function updateVoiceQuizAnswer(value) {
    setSurvey((prev) => ({
      ...prev,
      voiceQuiz: {
        ...(prev.voiceQuiz || {}),
        answer: value,
      },
    }));
  }


  function updateEventEntry(field, value) {
    setSurvey((prev) => ({
      ...prev,
      eventEntry: {
        ...(prev.eventEntry || {}),
        [field]: value,
      },
    }));
  }

  async function submitEventEntry() {
    if (isSubmitting) return;

    const studentId = (survey.eventEntry?.studentId || "").trim();
    const name = (survey.eventEntry?.name || "").trim();
    const voiceQuizAnswer = (survey.voiceQuiz?.answer || "").trim();

    const hasVoiceQuizAnswer = !!voiceQuizAnswer;
    const hasFullEventInfo = hasVoiceQuizAnswer && !!studentId && !!name;

    const nextEventEntry = {
      ...(survey.eventEntry || {}),
      studentId,
      name,
      applied: hasFullEventInfo,
      skipped: !hasFullEventInfo,
      submittedAt: new Date().toISOString(),
    };
    const nextSurvey = {
      ...survey,
      submittedAt: new Date().toISOString(),
      eventEntry: nextEventEntry,
    };

    const row = buildSurveyRow(nextSurvey, hasFullEventInfo, {

     status: "completed",
     lastStep: "done",
     preIndex,
   });

    setIsSubmitting(true);

    const { error } = await supabase
      .from("snack_survey_responses")
      .upsert(row, { onConflict: "respondent_no" });

    setIsSubmitting(false);

    if (error) {
      console.error("Supabase 저장 오류:", error);
      alert("응답 저장 중 오류가 발생했습니다. 인터넷 연결을 확인한 뒤 다시 제출해 주세요.");
      return;
    }

    setSurvey(nextSurvey);
    alert(
      hasFullEventInfo
        ? "설문이 제출되었습니다. 이벤트 응모 정보도 함께 기록되었습니다."
        : "설문이 제출되었습니다. 이벤트 응모 정보는 입력하지 않았습니다."
    );
  }


  function finishVideo(videoHadError = false) {
    const answer = (survey.voiceQuiz?.answer || "").trim();

    setSurvey((prev) => ({
      ...prev,
      video: {
        watched: !videoHadError,
        watchedAt: new Date().toISOString(),
        error: videoHadError,
      },
      voiceQuiz: {
        ...(prev.voiceQuiz || {}),
        answer,
        submittedAt: new Date().toISOString(),
      },
    }));

    setStep("quiz");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function getQ19StageKey(selectedParts = survey.q19Quiz.selectedParts) {
    if (selectedParts.body_foil?.selectedBin) {
      return "은박 처리 후";
    }

    if (selectedParts.body_paper?.selectedBin) {
      return "은박 표시";
    }

    if (selectedParts.body_print?.selectedBin) {
      return "종이 표시";
    }

    return "초기 전체 이미지";
  }

  function tapQ19Part(partId) {
    setBinModal({
      type: "q19",
      partId,
      title: "선택한 부분은 어디에 버려야 할까요?",
      desc: "방금 터치한 부분에 알맞은 배출함을 선택하세요.",
    });
  }

  function assignQ19PartBin(partId, binId) {
    setSurvey((prev) => ({
      ...prev,
      q19Quiz: {
        ...prev.q19Quiz,
        selectedParts: {
          ...prev.q19Quiz.selectedParts,
          [partId]: {
            selectedBin: binId,
            selectedBinLabel: getBinLabel(binId),
            selectedAt: new Date().toISOString(),
          },
        },
      },
    }));
  }

  function removeQ19PartSelection(partId) {
    setSurvey((prev) => {
      const nextSelectedParts = {
        ...prev.q19Quiz.selectedParts,
      };

      delete nextSelectedParts[partId];

      if (partId === "body_print") {
        delete nextSelectedParts.body_paper;
        delete nextSelectedParts.body_foil;
      }

      if (partId === "body_paper") {
        delete nextSelectedParts.body_foil;
      }

      return {
        ...prev,
        q19Quiz: {
          ...prev.q19Quiz,
          selectedParts: nextSelectedParts,
          finalized: false,
        },
      };
    });
  }

  function finishQ19Quiz() {
    const selectedParts = survey.q19Quiz.selectedParts;

    let score = 0;
    const maxScore = Q19_PART_DEFS.length;
    const finalStage = getQ19StageKey(selectedParts);

    const logs = Q19_PART_DEFS.map((part) => {
      const answer = selectedParts[part.id] || null;
      const isSelected = answer !== null;
      const isCorrect = isSelected && answer.selectedBin === part.correctBin;

      if (isCorrect) {
        score += 1;
      }

      return {
        stage: "post_video_q19_touch_quiz",
        selectionStatus: isSelected ? "selected" : "not_selected",
        imageStageAtFinish: finalStage,
        gameItemId: "q19_touch_quiz",
        gameItemName: "원통형 포장 터치형 퀴즈",
        targetPartId: part.id,
        targetPartLabel: part.label,
        selectedBin: isSelected ? answer.selectedBin : "",
        selectedBinLabel: isSelected ? answer.selectedBinLabel : "",
        correctBin: part.correctBin,
        correctBinLabel: getBinLabel(part.correctBin),
        isCorrect,
        eventTime: isSelected ? answer.selectedAt : new Date().toISOString(),
      };
    });

    const percent =
      maxScore > 0 ? Math.round((score / maxScore) * 1000) / 10 : 0;

    const selectedSummary = Q19_PART_DEFS.filter((part) => selectedParts[part.id])
      .map((part) => `${part.label}→${selectedParts[part.id].selectedBinLabel}`)
      .join(", ");

    setSurvey((prev) => ({
      ...prev,
      q19Quiz: {
        selectedParts,
        logs,
        score,
        maxScore,
        percent,
        allCorrect: score === maxScore,
        selectedSummary,
        finalImageStage: finalStage,
        finalized: true,
      },
    }));

    setStep("q19Result");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function finishPostSurvey() {
    if (!survey.q19Quiz.finalized) {
      alert("영상 후 터치형 퀴즈를 먼저 완료하세요.");
      return;
    }

    if (!survey.postSurvey.q12) {
      alert("12번 문항에 응답하세요.");
      return;
    }

    if ((survey.postSurvey.q13 || []).length === 0) {
      alert("13번 이유를 1개 이상 선택하세요.");
      return;
    }

    if (survey.postSurvey.q13?.includes("기타") && !survey.postSurvey.q13Other?.trim()) {
      alert("13번에서 기타를 선택한 경우 내용을 입력하세요.");
      return;
    }

    if (!survey.postSurvey.q14) {
      alert("14번 문항에 응답하세요.");
      return;
    }

    setSurvey((prev) => ({
      ...prev,
      submittedAt: new Date().toISOString(),
    }));
    setStep("done");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetDraft() {
    const ok = confirm("임시 저장된 응답을 모두 지울까요?");

    if (!ok) return;

    const freshSurvey = createInitialSurvey();

    localStorage.removeItem(STORAGE_KEY);
    setSurvey(freshSurvey);
    setStep("intro");
    setPreIndex(0);
    setBinModal(null);
  }

  return (
    <main className="app">
      <section className="card">
        {step === "intro" && (
          <>
            <h1>과자 포장에 대한 인식과 태도 조사</h1>

            <p className="desc">
              과자는 청소년의 일상에서 자주 접하는 기호식품입니다.  <br />
  본 설문은 과자를 고를 때 포장 형태가 선호도와 구매 의향에 어떤 영향을 주는지 알아보기 위한 조사입니다. 또한 보관의 편리성, 먹을 때의 편리성, 분리배출의 어려움 등 과자 소비 전 과정에서 느끼는 경험과 인식을 함께 확인합니다.<br />
  설문에는 직접 터치하며 참여하는 분리배출 미니게임과 영상 퀴즈가 포함되어 있어서 화면 전환 시 잠시 로딩될 수 있습니다. 
              <span className="intro-warning">설문 중 이미지가 바로 뜨지 않아도 잠시 기다려 주세요.</span>
            </p>

            <div className="event-notice-box">
              <strong>특별 이벤트 안내</strong>
              <p>
                설문 중 나오는 영상 속 목소리의 주인공을 맞춰라! 
              </p>
 
              <p className="event-hint">
                힌트! "ㄱㅈㅇ" 우리학교 2학년이에요. 
              </p>

              <p>
                정답자 중 추첨하여 <span className="event-prize">특별 선물</span>을 드립니다. 이벤트 응모는 설문 마지막 화면에서 할 수 있습니다.
              </p>
            </div>

            <label className="field">
              학년
              <select
                value={survey.grade}
                onChange={(e) => updateBasic("grade", e.target.value)}
              >
                <option value="">선택</option>
                <option value="1학년">1학년</option>
                <option value="2학년">2학년</option>
                <option value="3학년">3학년</option>
              </select>
            </label>

            <label className="field">
              성별
              <select
                value={survey.gender}
                onChange={(e) => updateBasic("gender", e.target.value)}
              >
                <option value="">선택</option>
                <option value="남자">남자</option>
                <option value="여자">여자</option>
              </select>
            </label>

            <button type="button" onClick={startSurvey}>
              설문 시작
            </button>

            <div className="respondent-box">
              <strong>자동 생성된 응답자 번호</strong>
              <p>{survey.respondentNo}</p>
            </div>

          </>
        )}

        {step === "basicSurvey" && (
          <BasicSurveyStep
            survey={survey}
            updateBasicSurvey={updateBasicSurvey}
            finishBasicSurvey={finishBasicSurvey}
          />
        )}

        {step === "preference" && (
          <PreferenceStep
            item={PACKAGING_ITEMS[preIndex]}
            index={preIndex}
            total={PACKAGING_ITEMS.length}
            survey={survey}
            updatePre={updatePre}
            togglePreReason={togglePreReason}
            nextPre={nextPre}
          />
        )}

        {step === "convenience" && (
          <ConvenienceStep
            survey={survey}
            updateConvenience={updateConvenience}
            finishConvenience={finishConvenience}
          />
        )}


        {step === "game" && (
          <GameStep
            game={survey.game}
            chooseGameMode={chooseGameMode}
            tapGamePart={tapGamePart}
            assignGamePartBin={assignGamePartBin}
            removeGamePartSelection={removeGamePartSelection}
            finishCurrentGameItem={finishCurrentGameItem}
            openGameBinModal={openGameBinModal}
          />
        )}

        {step === "afterGame" && (
          <AfterGameStep
            survey={survey}
            updateAfterGame={updateAfterGame}
            finishAfterGame={finishAfterGame}
          />
        )}

        {step === "gameResult" && (
          <GameResultStep
            game={survey.game}
            onNext={() => {
              setStep("video");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        )}

        {step === "video" && (
          <VideoStep
            survey={survey}
            updateVoiceQuizAnswer={updateVoiceQuizAnswer}
            finishVideo={finishVideo}
          />
        )}

        {step === "quiz" && (
          <Q19QuizStep
            q19Quiz={survey.q19Quiz}
            getQ19StageKey={getQ19StageKey}
            assignQ19PartBin={assignQ19PartBin}
            removeQ19PartSelection={removeQ19PartSelection}
            openQ19BinModal={tapQ19Part}
            finishQ19Quiz={finishQ19Quiz}
          />
        )}

        {step === "q19Result" && (
          <Q19ResultStep
            q19Quiz={survey.q19Quiz}
            onNext={() => {
              setStep("postPerception");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        )}

        {step === "postPerception" && (
          <PostPerceptionStep
            survey={survey}
            updatePostPerception={updatePostPerception}
            finishPostPerception={finishPostPerception}
          />
        )}

        {step === "post" && (
          <PostSurveyStep
            survey={survey}
            updatePost={updatePost}
            togglePostReason={togglePostReason}
            finishPostSurvey={finishPostSurvey}
          />
        )}

        {step === "done" && (
          <EventEntryStep
            survey={survey}
            updateEventEntry={updateEventEntry}
            submitEventEntry={submitEventEntry}
            isSubmitting={isSubmitting}
          />
        )}

        {![
          "intro",
          "basicSurvey",
          "preference",
          "convenience",
          "game",
          "afterGame",
          "gameResult",
          "video",
          "quiz",
          "q19Result",
          "postPerception",
          "post",
          "done",
        ].includes(step) && (
          <>
            <h2>화면을 불러오지 못했습니다</h2>
            <p className="desc">
              이전 임시 저장값과 현재 설문 단계가 맞지 않습니다. 아래 버튼을 눌러 처음부터 다시 시작하세요.
            </p>
            <button type="button" className="secondary" onClick={resetDraft}>
              처음부터 다시 시작
            </button>
          </>
        )}
      </section>

      {binModal && (
        <BinModal
          title={binModal.title}
          desc={binModal.desc}
          chooseBin={chooseBin}
          close={() => setBinModal(null)}
        />
      )}
    </main>
  );
}

function QuestionTitle({ no, text, note }) {
  return (
    <h3 className="survey-question-title question-title-with-pill">
      <span className="question-number-pill">{no}</span>
      <span className="question-title-text">{text}</span>
      {note && <span className="question-note">{note}</span>}
    </h3>
  );
}

function BasicSurveyStep({ survey, updateBasicSurvey, finishBasicSurvey }) {
  const basicSurvey = survey.basicSurvey || {};

  return (
    <>
      <h2>2단계. 기초 조사</h2>

      <OpinionReflectQuestion
        no="1"
        title="평소 과자를 구매할 때 내 의견은 어느 정도 반영되나요?"
        name="q1"
        value={basicSurvey.q1 || ""}
        onChange={(value) => updateBasicSurvey("q1", value)}
      />

      <div className="question">
        <QuestionTitle
          no="2"
          text="최근 한 달 동안 아래 포장 형태의 과자를 구입하거나 먹은 경험을 선택하세요."
        />

        <div className="basic-package-grid">
          {BASIC_PACKAGE_EXPERIENCE_ITEMS.map((item) => (
            <BasicPackageFrequencyQuestion
              key={item.id}
              item={item}
              value={basicSurvey[item.id] || ""}
              onChange={(value) => updateBasicSurvey(item.id, value)}
            />
          ))}
        </div>
      </div>

      <button type="button" onClick={finishBasicSurvey}>
        다음으로
      </button>
    </>
  );
}

function OpinionReflectQuestion({ no, title, name, value, onChange }) {
  return (
    <div className="question opinion-reflect-question">
      <QuestionTitle no={no} text={title} />

      <div className="opinion-reflect-guide">
        내 의견이 과자 구매 결정에 실제로 어느 정도 반영되는지 선택하세요.
      </div>

      <div className="opinion-reflect-options">
        {OPINION_REFLECT_OPTIONS.map((option) => (
          <label
            key={option}
            className={value === option ? "opinion-reflect-option selected" : "opinion-reflect-option"}
          >
            <input
              type="radio"
              name={name}
              checked={value === option}
              onChange={() => onChange(option)}
            />
            <span>{option}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

function BasicPackageFrequencyQuestion({ item, value, onChange }) {
  const [imageSrc, setImageSrc] = useState(item.image);

  return (
    <div className={`basic-package-card basic-package-card-${item.id}`}>
      <div className="basic-package-title">
        <span className="basic-package-no">{item.displayNo}</span>
        <span>{item.label}</span>
      </div>

      <div className="basic-package-image-box">
        <img
          src={imageSrc}
          alt={`${item.label} 포장 이미지`}
          onError={() => {
            if (item.fallbackImage && imageSrc !== item.fallbackImage) {
              setImageSrc(item.fallbackImage);
            }
          }}
        />
      </div>

      <div className="frequency-chip-grid">
        {BASIC_FREQUENCY_OPTIONS.map((option) => (
          <label
            key={option}
            className={value === option ? "frequency-chip selected" : "frequency-chip"}
          >
            <input
              type="radio"
              name={item.id}
              checked={value === option}
              onChange={() => onChange(option)}
            />
            <span>{option}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

function PreferenceStep({
  item,
  index,
  total,
  survey,
  updatePre,
  togglePreReason,
  nextPre,
}) {
  const choice = survey.preSurvey[item.id] || "";
  const reasons = item.reasonId ? survey.preSurvey[item.reasonId] || [] : [];

  return (
    <>
      <h2>3단계. 포장 선호도 조사</h2>

      <div className="status">
        문항 {index + 1} / {total}
      </div>

      <div className="question">
        <QuestionTitle
          no={item.displayNo || item.id.replace("q", "")}
          text={item.title}
        />

        {item.image && (
          <div className="image-box">
            <img src={item.image} alt={`${item.id} 문항 이미지`} />
          </div>
        )}

        <div className={`options choice-options option-count-${item.options.length}`}>
          {item.options.map((option) => (
            <label key={option}>
              <input
                type="radio"
                name={item.id}
                checked={choice === option}
                onChange={() => updatePre(item.id, option)}
              />
              {option}
            </label>
          ))}
        </div>

        {item.reasonId && (
          <>
            <QuestionTitle
              no={item.reasonDisplayNo || item.reasonId.replace("q", "")}
              text={item.reasonTitle || "그렇게 선택한 이유를 모두 고르시오."}
              note="복수 체크 가능"
            />

            <div className="options">
              {(item.reasons || []).map((reason) => (
                <label key={reason}>
                  <input
                    type="checkbox"
                    checked={reasons.includes(reason)}
                    onChange={() => togglePreReason(item.reasonId, reason)}
                  />
                  {reason}
                </label>
              ))}
            </div>
          </>
        )}
      </div>

      <button type="button" onClick={nextPre}>
        {index === total - 1 ? "다음으로" : "다음"}
      </button>
    </>
  );
}

function ConvenienceStep({ survey, updateConvenience, finishConvenience }) {
  const convenienceSurvey = survey.convenienceSurvey || {};

  return (
    <>
      <h2>4단계. 원통형 포장은 얼마나 편할까?</h2>

      <p className="desc">
        원통형 포장의 편리성에 대해 어느 정도 동의하는지 선택하세요.
      </p>

      {CONVENIENCE_ITEMS.map((item) => (
        <LikertQuestion
          key={item.id}
          title={item.title}
          name={item.id}
          value={convenienceSurvey[item.id] || ""}
          onChange={(value) => updateConvenience(item.id, value)}
          horizontal
        />
      ))}

      <button type="button" onClick={finishConvenience}>
        다음으로
      </button>
    </>
  );
}


function useIsMobileLike() {
  return true;
}

function GameStep({
  game,
  chooseGameMode,
  tapGamePart,
  assignGamePartBin,
  removeGamePartSelection,
  finishCurrentGameItem,
  openGameBinModal,
}) {
  const item = GAME_ITEMS[game.currentIndex];
  const [activePieceId, setActivePieceId] = useState("");
  const [draggingPieceId, setDraggingPieceId] = useState("");
  const [dragPreview, setDragPreview] = useState(null);
  const isMobileLike = useIsMobileLike();

  const mode = item ? game.modes[item.id] || "" : "";
  const selectedMap = item ? game.selectedParts[item.id] || {} : {};
  const isLayeredPieceGame = !!item && mode === "separate" && item.layeredPieces;
  const isMaskedPieceGame = !!item && mode === "separate" && item.maskGame;

  useEffect(() => {
    if (!item) return;

    setActivePieceId(mode === "no_separation" ? "__whole_package" : "");
    setDraggingPieceId("");
    setDragPreview(null);
  }, [item?.id, mode]);

  if (!item) {
    return null;
  }

  const selectedPieces =
    mode === "no_separation"
      ? [
          {
            id: "__whole_package",
            label: "포장 전체",
            pieceImage: item.image,
          },
        ]
      : isLayeredPieceGame
      ? item.layeredPieces.filter((piece) => !selectedMap[piece.id]?.selectedBin)
      : isMaskedPieceGame
      ? item.hotspots.filter((part) => !selectedMap[part.id]?.selectedBin)
      : item.hotspots.filter((part) => selectedMap[part.id]);

  const selectedPartsSummary =
    mode === "no_separation"
      ? selectedMap.__whole_package?.selectedBinLabel
        ? [
            {
              partId: "__whole_package",
              partLabel: "포장 전체",
              binLabel: selectedMap.__whole_package.selectedBinLabel,
            },
          ]
        : []
      : item.hotspots
          .filter((part) => selectedMap[part.id])
          .map((part) => {
            const answer = selectedMap[part.id];

            return {
              partId: part.id,
              partLabel: part.label,
              binLabel: answer?.selectedBinLabel || "배출함 미선택",
            };
          });

  function getDragPiece(partId) {
    if (!item) return null;

    if (partId === "__whole_package") {
      return {
        id: "__whole_package",
        label: "포장 전체",
        pieceImage: item.image,
      };
    }

    return (
      item.hotspots.find((part) => part.id === partId) ||
      item.layeredPieces?.find((part) => part.id === partId) ||
      null
    );
  }

  function startDragPiece(partId, event) {
    const piece = getDragPiece(partId);

    setDraggingPieceId(partId);
    setActivePieceId(partId);

    if (piece) {
      setDragPreview({
        id: partId,
        label: piece.label,
        pieceImage: piece.pieceImage || item.image,
        x: event?.clientX || 0,
        y: event?.clientY || 0,
      });
    }
  }

  function handleDropOnBin(binId, partId) {
    if (!partId) return;
    assignGamePartBin(partId, binId);
    setActivePieceId("");
    setDraggingPieceId("");
    setDragPreview(null);
  }

  useEffect(() => {
    if (!draggingPieceId) return;

    function handlePointerMove(event) {
      setDragPreview((prev) =>
        prev
          ? {
              ...prev,
              x: event.clientX,
              y: event.clientY,
            }
          : prev
      );
    }

    function handlePointerUp(event) {
      const dropTarget = event.target.closest?.("[data-bin-id]");

      if (dropTarget) {
        handleDropOnBin(dropTarget.dataset.binId, draggingPieceId);
        return;
      }

      setDraggingPieceId("");
      setDragPreview(null);
    }

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [draggingPieceId]);

  return (
    <>
      <h2>5단계. 분리배출 게임</h2>

      <p className="desc game-desc">
        포장 이미지를 보고, 버릴 때 어떻게 처리할지 선택하세요. 우선 {" "}
        <span className="game-touch-emphasis">분리할 부분</span> {" "}이 있는지 없는지 {" "}
        <span className="game-touch-emphasis">‘선택’</span>하세요. 다음으로 {" "}
        <span className="game-touch-emphasis">버리고자 하는 부분</span>을 {" "}
        <span className="game-touch-emphasis">‘터치’</span>하면
        배출함 선택창이 뜹니다.
      </p>

      <div className="status">
        게임 {game.currentIndex + 1} / {GAME_ITEMS.length}
      </div>

      <div className="game-choice-buttons">
        <button type="button" onClick={() => chooseGameMode("no_separation")}>
          분리할 부분 없음
        </button>
        <button type="button" onClick={() => chooseGameMode("separate")}>
          분리할 부분 있음
        </button>
      </div>

      {mode === "no_separation" ? (
        <WholePackageImage
          item={item}
          selected={activePieceId === "__whole_package"}
          removed={!!selectedMap.__whole_package?.selectedBin}
          isMobileLike={isMobileLike}
          onSelect={() => setActivePieceId("__whole_package")}
          onMobileTap={() => openGameBinModal("__whole_package", "포장 전체")}
          onDragStart={(event) => startDragPiece("__whole_package", event)}
          onDragEnd={() => setDraggingPieceId("")}
        />
      ) : isMaskedPieceGame ? (
        <MaskedGameImage
          item={item}
          selectedMap={selectedMap}
          activePieceId={activePieceId}
          isMobileLike={isMobileLike}
          onSelect={(partId) => setActivePieceId(partId)}
          onMobileTap={(part) => openGameBinModal(part.id, part.label)}
          onDragStart={(partId, event) => startDragPiece(partId, event)}
          onDragEnd={() => setDraggingPieceId("")}
        />
      ) : isLayeredPieceGame ? (
        <div className="layer-game-box">
          <div className="layer-stage">
            {selectedPieces.map((piece) => (
              <LayerPiece
                key={piece.id}
                piece={piece}
                isActive={activePieceId === piece.id}
                isMobileLike={isMobileLike}
                onSelect={() => setActivePieceId(piece.id)}
                onMobileTap={() => openGameBinModal(piece.id, piece.label)}
                onDragStart={() => {
                  setDraggingPieceId(piece.id);
                  setActivePieceId(piece.id);
                }}
                onDragEnd={() => setDraggingPieceId("")}
              />
            ))}

            {selectedPieces.length === 0 && (
              <div className="layer-stage-empty">
                모든 조각을 배출함으로 옮겼습니다.
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="image-box">
          <HotspotImage item={item} selectedMap={selectedMap} onTap={tapGamePart} />
        </div>
      )}

      {mode === "separate" && !isLayeredPieceGame && !isMaskedPieceGame && (
        <>
          <div className="piece-help">
            이미지에서 분리할 부분을 터치하면 조각이 아래에 나타납니다.
            조각을 배출함으로 끌어다 놓거나, 조각을 누른 뒤 배출함을 누르세요.
          </div>

          <div className="piece-zone">
            {selectedPieces.length > 0 ? (
              selectedPieces.map((part) => {
                const answer = selectedMap[part.id] || null;

                return (
                  <PieceCard
                    key={part.id}
                    piece={part}
                    isActive={activePieceId === part.id}
                    selectedBinLabel={answer?.selectedBinLabel || ""}
                    onSelect={() => setActivePieceId(part.id)}
                    onDragStart={() => {
                      setDraggingPieceId(part.id);
                      setActivePieceId(part.id);
                    }}
                    onDragEnd={() => setDraggingPieceId("")}
                  />
                );
              })
            ) : (
              <div className="piece-empty">
                이미지에서 분리할 부분을 터치하면 여기 나타납니다.
              </div>
            )}
          </div>
        </>
      )}

      {mode && (
        <>
          {selectedPartsSummary.length > 0 && (
            <GameSelectionSummary
              items={selectedPartsSummary}
              onReset={removeGamePartSelection}
            />
          )}

          {isGameItemAutoComplete(item, mode, selectedMap) && (
            <div className="auto-next-notice">
              선택이 완료되었습니다. 다음 화면으로 이동합니다.
            </div>
          )}
        </>
      )}

      {dragPreview && <DragPreview preview={dragPreview} />}
    </>
  );
}

function PieceCard({
  piece,
  isActive,
  selectedBinLabel,
  onSelect,
  onDragStart,
  onDragEnd,
}) {
  const [imgError, setImgError] = useState(false);

  return (
    <div
      className={isActive ? "piece-card active" : "piece-card"}
      draggable
      onClick={onSelect}
      onDragStart={(event) => {
        event.dataTransfer.setData("text/plain", piece.id);
        onDragStart();
      }}
      onDragEnd={onDragEnd}
    >
      {piece.pieceImage && !imgError ? (
        <img
          src={piece.pieceImage}
          alt={piece.label}
          onError={() => setImgError(true)}
        />
      ) : (
        <div className="piece-card-fallback">{piece.label}</div>
      )}

      <div className="piece-card-label">{piece.label}</div>
      <div className="piece-card-bin">
        {selectedBinLabel
          ? `현재 배출함: ${selectedBinLabel}`
          : "아직 배출함을 선택하지 않음"}
      </div>
    </div>
  );
}

function DragPreview({ preview }) {
  return (
    <div
      className="drag-preview"
      style={{
        left: `${preview.x}px`,
        top: `${preview.y}px`,
      }}
    >
      {preview.pieceImage ? (
        <img src={preview.pieceImage} alt="" aria-hidden="true" />
      ) : (
        <div className="drag-preview-fallback">{preview.label}</div>
      )}
      <div>{preview.label}</div>
    </div>
  );
}

function WholePackageImage({
  item,
  selected,
  removed,
  isMobileLike,
  onSelect,
  onMobileTap,
  onDragStart,
  onDragEnd,
}) {
  return (
    <div className="layer-game-box">
      <div className="layer-stage whole-package-stage">
        {removed ? (
          <div className="layer-stage-empty">
            포장 전체를 배출함으로 옮겼습니다.
          </div>
        ) : (
          <img
            className={selected ? "whole-package-image active" : "whole-package-image"}
            src={item.image}
            alt={`${item.name} 전체`}
            draggable={!isMobileLike}
            onClick={(event) => {
              if (isMobileLike) {
                event.preventDefault();
                onMobileTap();
                return;
              }

              onSelect();
            }}
            onPointerDown={(event) => {
              if (isMobileLike) return;

              event.preventDefault();
              onSelect();
              onDragStart(event);
            }}
            onDragStart={(event) => {
              if (isMobileLike) {
                event.preventDefault();
                return;
              }

              event.dataTransfer.setData("text/plain", "__whole_package");
              onDragStart(event);
            }}
            onDragEnd={onDragEnd}
          />
        )}
      </div>
    </div>
  );
}

function MaskedGameImage({
  item,
  selectedMap,
  activePieceId,
  isMobileLike,
  onSelect,
  onMobileTap,
  onDragStart,
  onDragEnd,
}) {
  const removedParts = item.hotspots.filter((part) => selectedMap[part.id]?.selectedBin);
  const selectableParts = item.hotspots.filter((part) => !selectedMap[part.id]?.selectedBin);

  return (
    <div className="layer-game-box">
      <div className="layer-stage mask-game-stage">
        <img className="mask-game-base-image" src={item.image} alt={item.name} />

        {selectableParts
          .filter((part) => part.overlayInStage && part.pieceImage)
          .sort((a, b) => (a.z || 0) - (b.z || 0))
          .map((part) => (
            <img
              key={`overlay-${part.id}`}
              className={`mask-game-overlay-image ${part.className || ""}`}
              src={part.pieceImage}
              alt=""
              aria-hidden="true"
              draggable={false}
            />
          ))}

        <svg
          className="mask-game-mask-svg"
          viewBox={item.viewBox || "0 0 1000 1000"}
          preserveAspectRatio="xMidYMid meet"
          aria-hidden="true"
        >
          {removedParts
            .sort((a, b) => (a.z || 0) - (b.z || 0))
            .map((part) => (
              <MaskShape key={`mask-${part.id}`} part={part} />
            ))}
        </svg>

        <svg
          className="mask-game-hit-svg"
          viewBox={item.viewBox || "0 0 1000 1000"}
          preserveAspectRatio="xMidYMid meet"
        >
          {selectableParts
            .sort((a, b) => (a.z || 0) - (b.z || 0))
            .map((part) => (
              <MaskHitShape
                key={`hit-${part.id}`}
                part={part}
                selected={activePieceId === part.id}
                isMobileLike={isMobileLike}
                onSelect={() => onSelect(part.id)}
                onMobileTap={() => onMobileTap(part)}
                onDragStart={(event) => onDragStart(part.id, event)}
                onDragEnd={onDragEnd}
              />
            ))}
        </svg>

        {selectableParts.length === 0 && (
          <div className="layer-stage-empty">
            모든 조각을 배출함으로 옮겼습니다.
          </div>
        )}
      </div>
    </div>
  );
}

function MaskShape({ part }) {
  if (part.svg.type === "polygon") {
    return <polygon className="mask-game-mask-shape" points={part.svg.points} />;
  }

  if (part.svg.type === "path") {
    return <path className="mask-game-mask-shape" d={part.svg.d} />;
  }

  return null;
}

function MaskHitShape({
  part,
  selected,
  isMobileLike,
  onSelect,
  onMobileTap,
  onDragStart,
  onDragEnd,
}) {
  const className = selected ? "mask-game-hit-shape selected" : "mask-game-hit-shape";
  const commonProps = {
    className,
    draggable: !isMobileLike,
    onClick: (event) => {
      if (isMobileLike) {
        event.preventDefault();
        onMobileTap();
        return;
      }

      onSelect();
    },
    onPointerDown: (event) => {
      if (isMobileLike) return;

      event.preventDefault();
      onSelect();
      onDragStart(event);
    },
    onDragStart: (event) => {
      if (isMobileLike) {
        event.preventDefault();
        return;
      }

      event.dataTransfer.setData("text/plain", part.id);
      onDragStart(event);
    },
    onDragEnd,
  };

  if (part.svg.type === "polygon") {
    return <polygon {...commonProps} points={part.svg.points} />;
  }

  if (part.svg.type === "path") {
    return <path {...commonProps} d={part.svg.d} />;
  }

  return null;
}

function GameSelectionSummary({ items, onReset }) {
  return (
    <div className="game-summary-box">
      <div className="game-summary-title">선택 내용</div>

      <div className="game-summary-list">
        {items.map((item, index) => (
          <div className="game-summary-row" key={`${item.partLabel}-${index}`}>
            <span className="game-summary-part">{item.partLabel}</span>
            <span className="game-summary-arrow">→</span>
            <span className="game-summary-bin">{item.binLabel}</span>
            <button
              type="button"
              className="summary-reset-button"
              onClick={() => onReset(item.partId)}
            >
              다시 선택
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function LayerPiece({
  piece,
  isActive,
  isMobileLike,
  onSelect,
  onMobileTap,
  onDragStart,
  onDragEnd,
}) {
  return (
    <img
      className={
        isActive
          ? `layer-piece ${piece.className || ""} active`
          : `layer-piece ${piece.className || ""}`
      }
      src={piece.pieceImage}
      alt={piece.label}
      draggable={!isMobileLike}
      onClick={(event) => {
        if (isMobileLike) {
          event.preventDefault();
          onMobileTap();
          return;
        }

        onSelect();
      }}
      onDragStart={(event) => {
        if (isMobileLike) {
          event.preventDefault();
          return;
        }

        event.dataTransfer.setData("text/plain", piece.id);
        onDragStart();
      }}
      onDragEnd={onDragEnd}
    />
  );
}

function HotspotImage({ item, selectedMap, onTap }) {
  const hotspots = [...item.hotspots].sort((a, b) => (a.z || 0) - (b.z || 0));

  return (
    <div className="hotspot-wrap">
      <img src={item.image} alt={item.name} />

      <svg
        className="hotspot-svg"
        viewBox={item.viewBox || "0 0 1000 1000"}
        preserveAspectRatio="xMidYMid meet"
      >
        {hotspots.map((part) => (
          <HotspotShape
            key={part.id}
            part={part}
            selected={!!selectedMap[part.id]}
            onTap={onTap}
          />
        ))}
      </svg>
    </div>
  );
}

function HotspotShape({ part, selected, onTap }) {
  const className = selected ? "hotspot-shape selected" : "hotspot-shape";
  const commonProps = {
    className,
    onClick: () => onTap(part.id),
  };

  if (part.svg.type === "polygon") {
    return <polygon {...commonProps} points={part.svg.points} />;
  }

  if (part.svg.type === "path") {
    return <path {...commonProps} d={part.svg.d} />;
  }

  return null;
}

function BinModal({ title, desc, chooseBin, close }) {
  return (
    <div className="bin-modal-backdrop">
      <div className="bin-modal-card">
        <h2>{title}</h2>
        <p className="desc">{desc}</p>

        <div className="bin-grid">
          {BINS.map((bin) => (
            <BinOption key={bin.id} bin={bin} onChoose={() => chooseBin(bin.id)} />
          ))}
        </div>

        <button type="button" className="secondary" onClick={close}>
          취소
        </button>
      </div>
    </div>
  );
}

function BinOption({ bin, onChoose }) {
  const [imageError, setImageError] = useState(false);

  return (
    <button type="button" className="bin-option-button" onClick={onChoose}>
      {bin.image && !imageError ? (
        <img
          className="bin-option-image"
          src={bin.image}
          alt=""
          aria-hidden="true"
          onError={() => setImageError(true)}
        />
      ) : (
        <span className="bin-option-emoji" aria-hidden="true">
          {bin.icon}
        </span>
      )}
      <span className="bin-option-name">{bin.name}</span>
    </button>
  );
}


function ResultItem({ log, wrong }) {
  const pieceImage = getResultPieceImage(log);

  return (
    <div className={wrong ? "result-item result-item-wrong" : "result-item"}>
      {pieceImage && (
        <div className="result-piece-thumb">
          <img src={pieceImage} alt={log.targetPartLabel || "분리배출 조각"} />
        </div>
      )}

      <div className="result-item-content">
        <div className="result-item-title">
          {log.gameItemName} · {log.targetPartLabel}
        </div>

        <div className="result-item-line">
          내 선택: <strong>{log.selectedBinLabel || "선택 안 함"}</strong>
        </div>

        <div className={wrong ? "result-item-line result-wrong-text" : "result-item-line"}>
          정답: <strong>{log.correctBinLabel || "정답 없음"}</strong>
        </div>
      </div>
    </div>
  );
}

function ResultSection({ title, logs, wrong }) {
  return (
    <div className="result-section">
      <div className={wrong ? "result-section-title result-wrong-text" : "result-section-title"}>
        {title} ({logs.length})
      </div>

      {logs.length > 0 ? (
        <div className="result-list">
          {logs.map((log, index) => (
            <ResultItem
              key={`${log.gameItemId}-${log.targetPartId}-${index}`}
              log={log}
              wrong={wrong}
            />
          ))}
        </div>
      ) : (
        <div className="result-empty">
          해당 항목이 없습니다.
        </div>
      )}
    </div>
  );
}

function ResultScoreScreen({
  title,
  desc,
  score,
  maxScore,
  logs,
  standardText,
  nextButtonText,
  onNext,
  correctionOnly = false,
  scoreOnly = false,
}) {
  const percent = getPercent(score, maxScore);
  const scoredLogs = logs;
  const correctLogs = scoredLogs.filter((log) => log.isCorrect);
  const wrongLogs = scoredLogs.filter((log) => !log.isCorrect);

  if (scoreOnly) {
    return (
      <>
        <h2>{title}</h2>

        <div className="result-score-card result-score-hero-card result-score-only-card">
          <div className="result-score-label">내 점수</div>
          <div className="result-score-main result-score-hero-main">
            <strong>{score}</strong>
            <span>/ {maxScore}점</span>
          </div>
          <div className="result-score-max">만점: {maxScore}점</div>
        </div>

        <button type="button" onClick={onNext}>
          {nextButtonText}
        </button>
      </>
    );
  }

  if (correctionOnly) {
    return (
      <>
        <h2>{title}</h2>
        <p className="desc">{desc}</p>

        <div className="result-score-card result-score-hero-card">
          <div className="result-score-label">답변자가 얻은 점수</div>
          <div className="result-score-main result-score-hero-main">
            <strong>{score}</strong>
            <span>/ {maxScore}점</span>
          </div>
          <div className="result-score-max">만점: {maxScore}점</div>
          <div className="result-score-percent">정답률 {percent}%</div>

          {standardText && (
            <div className="result-standard">
              {standardText}
            </div>
          )}
        </div>

        <div className="result-section result-correction-section">
          <div className="result-section-title result-correction-title">
            오답 정정 ({wrongLogs.length})
          </div>

          {wrongLogs.length > 0 ? (
            <div className="result-list">
              {wrongLogs.map((log, index) => (
                <ResultItem
                  key={`${log.gameItemId}-${log.targetPartId}-${index}`}
                  log={log}
                  wrong
                />
              ))}
            </div>
          ) : (
            <div className="result-empty result-correction-empty">
              오답이 없습니다.
            </div>
          )}
        </div>

        <button type="button" onClick={onNext}>
          {nextButtonText}
        </button>
      </>
    );
  }

  return (
    <>
      <h2>{title}</h2>
      <p className="desc">{desc}</p>

      <div className="result-score-card">
        <div className="result-score-label">점수</div>
        <div className="result-score-main">
          <strong>{score}</strong>
          <span>/ 만점 {maxScore}점</span>
        </div>
        <div className="result-score-percent">정답률 {percent}%</div>

        {standardText && (
          <div className="result-standard">
            {standardText}
          </div>
        )}
      </div>

      <ResultSection title="맞힌 것" logs={correctLogs} />
      <ResultSection title="틀린 것" logs={wrongLogs} wrong />

      <button type="button" onClick={onNext}>
        {nextButtonText}
      </button>
    </>
  );
}

function GameResultStep({ game, onNext }) {
  return (
    <ResultScoreScreen
      title="7단계. 분리배출 게임 점수 공개"
      desc="분리배출 게임의 총점과 오답 정정 내용을 확인한 뒤 영상을 보세요."
      score={game.score}
      maxScore={game.maxScore}
      logs={game.logs}
      standardText="만점 기준: 봉지 1점 + 상자 2점 + 원통 4점 = 총 7점"
      nextButtonText="다음으로"
      onNext={onNext}
      correctionOnly
    />
  );
}

function Q19ResultStep({ q19Quiz, onNext }) {
  return (
    <ResultScoreScreen
      title="10단계. 분리배출 재도전 결과"
      desc=""
      score={q19Quiz.score}
      maxScore={q19Quiz.maxScore}
      logs={q19Quiz.logs}
      standardText=""
      nextButtonText="다음으로"
      onNext={onNext}
      scoreOnly
    />
  );
}

function AfterGameStep({ survey, updateAfterGame, finishAfterGame }) {
  return (
    <PerceptionQuestionStep
      title="6단계. 게임 후 생각 확인"
      desc="현재 생각에 가장 가까운 답을 선택하세요."
      values={survey.afterGame || {}}
      updateValue={updateAfterGame}
      onNext={finishAfterGame}
      nextButtonText="다음으로"
      inputNamePrefix="afterGame"
      difficultyNo="8"
      environmentNo="9"
      difficultyKey="q8"
      environmentKey="q9"
    />
  );
}

function PostPerceptionStep({ survey, updatePostPerception, finishPostPerception }) {
  return (
    <PerceptionQuestionStep
      title="11단계. 게임 체험 및 영상 시청 후 생각 확인"
      desc="현재 생각에 가장 가까운 답을 선택하세요."
      values={survey.postPerception || {}}
      updateValue={updatePostPerception}
      onNext={finishPostPerception}
      nextButtonText="다음으로"
      inputNamePrefix="postPerception"
      difficultyNo="10"
      environmentNo="11"
      difficultyKey="q10"
      environmentKey="q11"
    />
  );
}

function PerceptionQuestionStep({
  title,
  desc,
  values,
  updateValue,
  onNext,
  nextButtonText,
  inputNamePrefix,
  difficultyNo,
  environmentNo,
  difficultyKey,
  environmentKey,
}) {
  return (
    <>
      <h2>{title}</h2>
      <p className="desc">{desc}</p>

      <LikertQuestion
        title={`${difficultyNo}. 원통형 포장은 버리거나 분리배출하기 어렵다고 생각한다.`}
        name={`${inputNamePrefix}_${difficultyKey}`}
        value={values[difficultyKey] || ""}
        onChange={(value) => updateValue(difficultyKey, value)}
        horizontal
      />

      <LikertQuestion
        title={`${environmentNo}. 원통형 포장은 환경 측면에서 부담이 큰 포장이라고 생각한다.`}
        name={`${inputNamePrefix}_${environmentKey}`}
        value={values[environmentKey] || ""}
        onChange={(value) => updateValue(environmentKey, value)}
        horizontal
      />

      <button type="button" onClick={onNext}>
        {nextButtonText}
      </button>
    </>
  );
}

function LikertQuestion({ title, name, value, onChange, horizontal = false }) {
  const [questionNo, ...questionTextParts] = title.split(". ");
  const questionText = questionTextParts.join(". ");

  return (
    <div className={horizontal ? "question likert-question-horizontal" : "question"}>
      {horizontal ? (
        <div className="likert-question-title">
          <span className="likert-question-no">{questionNo}</span>
          <span className="likert-question-text">{questionText || title}</span>
        </div>
      ) : (
        <h3 className="survey-question-title">{title}</h3>
      )}

      <div className={horizontal ? "options likert-horizontal-options" : "options"}>
        {LIKERT_OPTIONS.map((option, index) => (
          <label
            key={option}
            className={horizontal && value === option ? "selected" : ""}
          >
            <input
              type="radio"
              name={name}
              checked={value === option}
              onChange={() => onChange(option)}
            />
            {horizontal ? (
              <>
                <span className="likert-score">{index + 1}</span>
                <span className="likert-text">{option}</span>
              </>
            ) : (
              option
            )}
          </label>
        ))}
      </div>
    </div>
  );
}

function VideoStep({ survey, updateVoiceQuizAnswer, finishVideo }) {
  const [videoWatched, setVideoWatched] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const answer = survey.voiceQuiz?.answer || "";

  return (
    <>
      <h2>8단계. 올바른 분리배출 방법은?</h2>

      <p className="desc">
        영상을 끝까지 시청하면 아래에 특별 이벤트 영상 퀴즈가 나타납니다.
        이벤트에 응모하려면 정답을 쓰세요. 입력하지 않아도 <strong>시청 완료</strong> 버튼을 누르면 다음으로 이동합니다.
      </p>

      <div className="shorts-video-frame">
        <video
          className="shorts-video"
          controls
          playsInline
          preload="metadata"
          onEnded={() => setVideoWatched(true)}
          onError={() => setVideoError(true)}
        >
          <source src={VIDEO_SRC} type="video/mp4" />
          이 브라우저에서는 동영상을 재생할 수 없습니다.
        </video>
      </div>

      {videoError && (
        <p className="video-warning">
          영상 파일을 불러오지 못했습니다.  관리자에게 알려 주세요. 그래도 설문은 다음 단계로 진행할 수 있습니다.
        </p>
      )}

      {!videoWatched && !videoError && (
        <p className="video-warning">
          영상을 끝까지 보면 영상 퀴즈와 시청 완료 버튼이 활성화됩니다.
        </p>
      )}

      {videoWatched && (
        <div className="question event-quiz-question video-inline-quiz">
          <div className="event-notice-box video-quiz-notice">
            <strong>특별 이벤트 영상 퀴즈</strong>
            <p>
              정답자 중 추첨하여 특별 선물을 드립니다.
            </p>
          </div>

          <h3 className="survey-question-title">영상 속 목소리의 주인공은 누구일까요?</h3>
          <input
            className="text-answer-input"
            type="text"
            value={answer}
            onChange={(event) => updateVoiceQuizAnswer(event.target.value)}
            placeholder="정답 입력하기! 이벤트에 응모하지 않으려면 '시청 완료'."
          />
        </div>
      )}

      <button
        type="button"
        disabled={!videoWatched && !videoError}
        onClick={() => finishVideo(videoError)}
      >
        {videoError ? "영상 오류로 다음 단계 진행" : "시청 완료"}
      </button>
    </>
  );
}

function Q19QuizStep({
  q19Quiz,
  getQ19StageKey,
  assignQ19PartBin,
  removeQ19PartSelection,
  openQ19BinModal,
  finishQ19Quiz,
}) {
  const [activePieceId, setActivePieceId] = useState("");
  const [draggingPieceId, setDraggingPieceId] = useState("");
  const [dragPreview, setDragPreview] = useState(null);
  const isMobileLike = useIsMobileLike();
  const selectedParts = q19Quiz.selectedParts;
  const baseImage = getQ19BaseImage(selectedParts);

  const visiblePieces = [...Q19_LAYER_BASE, getQ19BottomPiece(selectedParts)];

  if (selectedParts.body_print?.selectedBin) {
    visiblePieces.push(Q19_PAPER_LAYER);
  }

  if (selectedParts.body_paper?.selectedBin) {
    visiblePieces.push(Q19_FOIL_LAYER);
  }

  const unassignedPieces = visiblePieces.filter(
    (piece) => !selectedParts[piece.id]?.selectedBin
  );

  const assignedMaskPieces = visiblePieces.filter(
    (piece) =>
      selectedParts[piece.id]?.selectedBin &&
      (piece.id === "lid" ||
        piece.id === "inner_lid" ||
        piece.id === "bottom" ||
        piece.id === "body_foil")
  );

  const selectedCount = Q19_PART_DEFS.filter(
    (part) => selectedParts[part.id]?.selectedBin
  ).length;
  const allPartsAssigned = Q19_PART_DEFS.every(
    (part) => selectedParts[part.id]?.selectedBin
  );

  useEffect(() => {
    if (!allPartsAssigned || q19Quiz.finalized) return;

    const timer = window.setTimeout(() => {
      finishQ19Quiz();
    }, 500);

    return () => window.clearTimeout(timer);
  }, [allPartsAssigned, q19Quiz.finalized, finishQ19Quiz]);

  function getQ19DragPiece(partId) {
    return visiblePieces.find((piece) => piece.id === partId) || null;
  }

  function startQ19Drag(partId, event) {
    const piece = getQ19DragPiece(partId);

    setDraggingPieceId(partId);
    setActivePieceId(partId);

    if (piece) {
      setDragPreview({
        id: partId,
        label: piece.label,
        pieceImage: piece.pieceImage,
        x: event?.clientX || 0,
        y: event?.clientY || 0,
      });
    }
  }

  function handleDropOnBin(binId, partId) {
    if (!partId) return;

    assignQ19PartBin(partId, binId);
    setActivePieceId("");
    setDraggingPieceId("");
    setDragPreview(null);
  }

  useEffect(() => {
    if (!draggingPieceId) return;

    function handlePointerMove(event) {
      setDragPreview((prev) =>
        prev
          ? {
              ...prev,
              x: event.clientX,
              y: event.clientY,
            }
          : prev
      );
    }

    function handlePointerUp(event) {
      const dropTarget = event.target.closest?.("[data-bin-id]");

      if (dropTarget) {
        handleDropOnBin(dropTarget.dataset.binId, draggingPieceId);
        return;
      }

      setDraggingPieceId("");
      setDragPreview(null);
    }

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [draggingPieceId, visiblePieces]);

  return (
    <>
      <h2>9단계. 분리배출, 다시 도전!</h2>

      <div className="q19-guide-box">
        <div className="q19-guide-title">버리고자 하는 부분을 터치하세요.</div>
        <p>
          선택한 부분에 맞는 배출함을 고르면 이미지가 바뀝니다.
          더 이상 분리할 부분이 없다고 생각하면 아래의 ‘분리배출 완료’ 버튼을 누르세요.
        </p>
      </div>

      <div className="layer-game-box">
        <div className="layer-stage q19-layer-stage">
          <img className="q19-base-image" src={baseImage} alt="원통형 포장 전체 이미지" />

          {unassignedPieces.map((piece) => (
            <img
              key={`visual-${piece.id}`}
              className={`q19-visual-piece ${piece.className || ""}`}
              src={piece.pieceImage}
              alt=""
              aria-hidden="true"
              draggable={false}
            />
          ))}

          <svg
            className="q19-mask-svg"
            viewBox={Q19_VIEWBOX}
            preserveAspectRatio="xMidYMid meet"
            aria-hidden="true"
          >
            {assignedMaskPieces.map((piece) => (
              <Q19MaskShape key={`mask-${piece.id}`} piece={piece} />
            ))}
          </svg>

          <svg
            className="q19-hit-svg"
            viewBox={Q19_VIEWBOX}
            preserveAspectRatio="xMidYMid meet"
          >
            {unassignedPieces
              .filter((piece) => piece.hit && piece.hit.svg)
              .sort((a, b) => (a.hit.z || 0) - (b.hit.z || 0))
              .map((piece) => (
                <Q19HitShape
                  key={`hit-${piece.id}`}
                  piece={piece}
                  selected={activePieceId === piece.id}
                  isMobileLike={isMobileLike}
                  onSelect={() => setActivePieceId(piece.id)}
                  onMobileTap={() => openQ19BinModal(piece.id)}
                  onDragStart={(event) => startQ19Drag(piece.id, event)}
                  onDragEnd={() => {
                    setDraggingPieceId("");
                    setDragPreview(null);
                  }}
                />
              ))}
          </svg>

          {unassignedPieces.length === 0 && (
            <div className="layer-stage-empty">
              모든 조각을 배출함으로 옮겼습니다.
            </div>
          )}
        </div>
      </div>

      <div className="q19-complete-box">
        <div className="q19-complete-title">현재 선택한 부분: {selectedCount} / {Q19_PART_DEFS.length}</div>
        <p>
          모든 부분을 선택하면 자동으로 결과 화면으로 이동합니다.
          모두 찾지 못했더라도 더 이상 선택할 부분이 없다고 판단하면 완료할 수 있습니다.
        </p>
        <button type="button" className="q19-complete-button" onClick={finishQ19Quiz}>
          분리배출 완료
        </button>
      </div>

      {dragPreview && <DragPreview preview={dragPreview} />}
    </>
  );
}

function Q19MaskShape({ piece }) {
  if (piece.hit.svg.type === "polygon") {
    return <polygon className="q19-mask-shape" points={piece.hit.svg.points} />;
  }

  if (piece.hit.svg.type === "path") {
    return <path className="q19-mask-shape" d={piece.hit.svg.d} />;
  }

  return null;
}

function Q19HitShape({
  piece,
  selected,
  isMobileLike,
  onSelect,
  onMobileTap,
  onDragStart,
  onDragEnd,
}) {
  const className = selected ? "q19-hit-shape selected" : "q19-hit-shape";
  const commonProps = {
    className,
    draggable: !isMobileLike,
    onClick: (event) => {
      if (isMobileLike) {
        event.preventDefault();
        onMobileTap();
        return;
      }

      onSelect();
    },
    onPointerDown: (event) => {
      if (isMobileLike) return;

      event.preventDefault();
      onSelect();
      onDragStart(event);
    },
    onDragStart: (event) => {
      if (isMobileLike) {
        event.preventDefault();
        return;
      }

      event.dataTransfer.setData("text/plain", piece.id);
      onDragStart(event);
    },
    onDragEnd,
  };

  if (piece.hit.svg.type === "polygon") {
    return <polygon {...commonProps} points={piece.hit.svg.points} />;
  }

  if (piece.hit.svg.type === "path") {
    return <path {...commonProps} d={piece.hit.svg.d} />;
  }

  return null;
}

function PostSurveyStep({
  survey,
  updatePost,
  togglePostReason,
  finishPostSurvey,
}) {
  const postSurvey = survey.postSurvey || {};
  const selectedReasons = postSurvey.q13 || [];
  const hasOtherReason = selectedReasons.includes("기타");

  return (
    <>
      <h2>12단계. 앞으로의 선택</h2>

      <LikertQuestion
        title="12. 앞으로 원통형 포장 과자를 구입하거나 먹을 생각이 있나요?"
        name="q12"
        value={postSurvey.q12 || ""}
        onChange={(value) => updatePost("q12", value)}
        horizontal
      />

      <div className="question post-reason-question">
        <QuestionTitle
          no="13"
          text="그렇게 답한 데 영향을 준 이유를 모두 고르시오."
          note="복수 체크 가능"
        />

        <div className="options">
          {POST_REASONS.map((reason) => (
            <label key={reason}>
              <input
                type="checkbox"
                checked={selectedReasons.includes(reason)}
                onChange={() => togglePostReason(reason)}
              />
              {reason}
            </label>
          ))}
        </div>

        {hasOtherReason && (
          <label className="field post-other-field">
            기타 내용
            <input
              className="text-answer-input"
              type="text"
              value={postSurvey.q13Other || ""}
              onChange={(event) => updatePost("q13Other", event.target.value)}
              placeholder="기타 이유를 직접 입력하세요."
            />
          </label>
        )}
      </div>

      <LikertQuestion
        title="14. 친구들은 원통형 포장의 분리배출 문제를 알게 된 뒤에도, 원통형 포장 과자를 구입할 것 같다."
        name="q14"
        value={postSurvey.q14 || ""}
        onChange={(value) => updatePost("q14", value)}
        horizontal
      />

      <button type="button" onClick={finishPostSurvey}>
        마지막 페이지로 이동
      </button>
    </>
  );
}

function EventEntryStep({
  survey,
  updateEventEntry,
  submitEventEntry,
  isSubmitting,
}) {
  const eventEntry = survey.eventEntry || {};
  const isFinalSubmitted = !!eventEntry.submittedAt;
  const hasVoiceQuizAnswer = !!(survey.voiceQuiz?.answer || "").trim();

  return (
    <>
      <h2>마지막 페이지</h2>

      <p className="desc final-thanks">
        설문에 참여해 주셔서 감사합니다.<br />
       
      {hasVoiceQuizAnswer ? (
      <div className="event-final-box">
      <strong>설문 참여자 전원 선물</strong>
       소정의{" "}
      <strong style={{ color: "#d32f2f" }}>선물</strong>
       이 준비되어 있습니다.<br />
       {" "}
      <strong style={{ color: "#d32f2f" }}>설문을 완료</strong>
       한 학생은{" "}
      <strong style={{ color: "#d32f2f" }}>1층 교무실</strong>
        {" 김선미 선생님께 찾아가 "}
      <strong style={{ color: "#d32f2f" }}>선물</strong>
       을 받아가세요.
      </p>

        <strong>특별 이벤트 응모</strong>
        <p>
          특별 이벤트 영상 퀴즈의 정답자를 추첨하여 특별 선물을 드립니다.
          이벤트에 응모하려면 학번과 이름을 입력하세요.
        </p>
        <p className="event-entry-note">
          학번과 이름을 공란으로 두어도 설문 제출은 가능합니다.
          다만 이벤트 응모는 학번과 이름을 모두 입력한 경우에만 처리됩니다.
        </p>

        {isFinalSubmitted ? (
          <div className="event-entry-status">
            {eventEntry.applied
              ? "설문이 제출되었습니다. 이벤트 응모 정보도 함께 기록되었습니다."
              : "설문이 제출되었습니다. 이벤트 응모 정보는 입력하지 않았습니다."}
          </div>
        ) : (
          <>
            <label className="field">
              학번
              <input
                className="text-answer-input"
                type="text"
                value={eventEntry.studentId || ""}
                onChange={(event) => updateEventEntry("studentId", event.target.value)}
                placeholder="예: 10315"
              />
            </label>

            <label className="field">
              이름
              <input
                className="text-answer-input"
                type="text"
                value={eventEntry.name || ""}
                onChange={(event) => updateEventEntry("name", event.target.value)}
                placeholder="이름을 입력하세요"
              />
            </label>

             <button type="button" onClick={submitEventEntry} disabled={isSubmitting}>
                {isSubmitting ? "저장 중..." : "설문 제출하기"}
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="event-final-box">
          <strong>설문 제출</strong>
          <p>
            특별 이벤트 영상 퀴즈에 응답하지 않았으므로 이벤트 응모 정보는 입력하지 않습니다.
            아래 버튼을 누르면 설문이 제출됩니다.
          </p>

          {isFinalSubmitted ? (
            <div className="event-entry-status">
              설문이 제출되었습니다. 참여해 주셔서 감사합니다.
            </div>
          ) : (
            <button type="button" onClick={submitEventEntry} disabled={isSubmitting}>
              {isSubmitting ? "저장 중..." : "설문 제출하기"}
            </button>
          )}
        </div>
      )}
    </>
  );
}