import { useEffect, useState } from "react";
import "./App.css";

const STORAGE_KEY = "snack_survey_draft";
const VIDEO_SRC = "/videos/snack-shorts.mp4";

const PACKAGING_ITEMS = [
  {
    id: "q3",
    reasonId: null,
    title: "가격과 양이 같다고 가정할 때, 둘 중 어떤 과자를 구입할 것인가요?",
    image: "/images/q3.png",
    options: ["A 상자형", "B 봉지형"],
  },
  {
    id: "q5",
    reasonId: null,
    title: "가격과 양이 같다고 가정할 때, 둘 중 어떤 과자를 구입할 것인가요?",
    image: "/images/q5.png",
    options: ["A 상자형", "B 원통형"],
  },
  {
    id: "q7",
    reasonId: null,
    title: "가격과 양이 같다고 가정할 때, 둘 중 어떤 과자를 구입할 것인가요?",
    image: "/images/q7.png",
    options: ["A 상자형", "B 원통형"],
  },
  {
    id: "q9",
    reasonId: null,
    title: "가격과 양이 같다고 가정할 때, 둘 중 어떤 과자를 구입할 것인가요?",
    image: "/images/q9.png",
    options: ["A 원통형", "B 봉지형"],
  },
  {
    id: "q11",
    reasonId: "q12",
    title: "가격과 양이 똑같은 과자라면, 어떤 포장을 가장 선호하나요?",
    image: "/images/q11.png",
    options: ["봉지형", "상자형", "원통형"],
  },
  {
    id: "q13",
    reasonId: "q14",
    title: "가격이나 양을 생각하지 않고 둘 중 더 선호하는 것은 무엇입니까?",
    image: "/images/q13.png",
    options: ["A 원통형", "B 봉지형"],
  },
];

const REASONS = [
  "더 맛있어 보여서",
  "보관하기 편해서",
  "들고 다니며 먹기 편할 것 같아서",
  "디자인이 예뻐서",
  "양이 더 많아 보여서",
];

const FREQUENCY_OPTIONS = [
  "전혀 없다",
  "1회 정도",
  "2~3회",
  "4~5회",
  "6회 이상",
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
  "과자가 덜 부서질 것 같아서",
  "디자인이 좋아 보여서",
  "맛이나 제품 자체가 더 중요해서",
  "분리배출이 어렵기 때문에",
  "환경에 좋지 않을 것 같아서",
  "실제로 살 때 어떻게 행동할지 잘 모르겠어서",
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
    id: "q16_game_pouch",
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
    id: "q17_game_box",
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
    id: "q18_game_cylinder",
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
    preSurvey: {},
    experience: {
      q15_pouch: "",
      q15_box: "",
      q15_cylinder: "",
    },
    afterGame: {
      q18: "",
      q19: "",
    },
    postSurvey: {
      q20: "",
      q21: [],
    },
    video: {
      watched: false,
      watchedAt: "",
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

function normalizeSurvey(survey) {
  const base = createInitialSurvey();

  return {
    ...base,
    ...survey,
    preSurvey: survey?.preSurvey || {},
    experience: {
      ...base.experience,
      ...(survey?.experience || {}),
    },
    afterGame: {
      ...base.afterGame,
      ...(survey?.afterGame || {}),
    },
    postSurvey: {
      ...base.postSurvey,
      ...(survey?.postSurvey || {}),
    },
    video: {
      ...base.video,
      ...(survey?.video || {}),
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
      step: saved.step || "intro",
      preIndex: saved.preIndex || 0,
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

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        step,
        preIndex,
        survey,
      })
    );
  }, [step, preIndex, survey]);

  function updateBasic(field, value) {
    setSurvey((prev) => ({
      ...prev,
      [field]: value,
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

  function updateExperience(field, value) {
    setSurvey((prev) => ({
      ...prev,
      experience: {
        ...prev.experience,
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
      const current = prev.postSurvey.q21 || [];
      const next = current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value];

      return {
        ...prev,
        postSurvey: {
          ...prev.postSurvey,
          q21: next,
        },
      };
    });
  }

  function startSurvey() {
    if (!survey.grade || !survey.gender) {
      alert("학년과 성별을 선택하세요.");
      return;
    }

    setStep("preference");
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

    setStep("experience");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function prevPre() {
    if (preIndex > 0) {
      setPreIndex(preIndex - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function finishExperience() {
    const { q15_pouch, q15_box, q15_cylinder } = survey.experience;

    if (!q15_pouch || !q15_box || !q15_cylinder) {
      alert("봉지형, 상자형, 원통형 포장 이용 경험에 모두 응답하세요.");
      return;
    }

    setStep("game");
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
      title: `${partLabel}은 어디에 버릴까요?`,
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

      const log = {
        stage: "pre_video_game",
        selectionStatus: "whole_package_no_separation",
        gameItemId: item.id,
        gameItemName: item.name,
        targetPartId: "whole_package",
        targetPartLabel: "포장 전체(분리할 부분 없음)",
        selectedBin: wholeAnswer.selectedBin,
        selectedBinLabel: wholeAnswer.selectedBinLabel,
        correctBin: "",
        correctBinLabel: "채점 제외",
        isCorrect: false,
        eventTime: wholeAnswer.selectedAt,
      };

      moveToNextGameItem([log], 0, 0);
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

  function finishAfterGame() {
    if (!survey.afterGame.q18 || !survey.afterGame.q19) {
      alert("18번과 19번 문항에 모두 응답하세요.");
      return;
    }

    setStep("video");
  }

  function finishVideo() {
    setSurvey((prev) => ({
      ...prev,
      video: {
        watched: true,
        watchedAt: new Date().toISOString(),
      },
    }));

    setStep("quiz");
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

    if (Object.keys(selectedParts).length === 0) {
      alert("터치형 퀴즈에서 최소 1개 이상 선택하세요.");
      return;
    }

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

    setStep("post");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function finishPostSurvey() {
    if (!survey.q19Quiz.finalized) {
      alert("영상 후 터치형 퀴즈를 먼저 완료하세요.");
      return;
    }

    if (!survey.postSurvey.q20) {
      alert("구매의향 문항에 응답하세요.");
      return;
    }

    if (survey.postSurvey.q21.length === 0) {
      alert("구매의향 이유를 1개 이상 선택하세요.");
      return;
    }

    console.log("최종 제출 데이터", survey);
    alert("현재는 Supabase 연결 전입니다. 콘솔에 데이터가 출력되었습니다.");
    setStep("done");
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
            <h1>과자 포장 유형에 대한 학생 인식과 선택 조사</h1>

            <p className="desc">
              과자 포장 형태를 보고 선택, 이용 경험, 포장 처리 방법 등에 대해 응답하는 조사입니다.
              정답이 있는 문항과 개인 의견을 묻는 문항이 함께 포함되어 있습니다.
              평소 생각에 따라 솔직하게 응답해 주세요.
            </p>

            <div className="respondent-box">
              <strong>자동 생성된 응답자 번호</strong>
              <p>{survey.respondentNo}</p>
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

            <button type="button" className="secondary" onClick={resetDraft}>
              임시 저장값 지우기
            </button>
          </>
        )}

        {step === "preference" && (
          <PreferenceStep
            item={PACKAGING_ITEMS[preIndex]}
            index={preIndex}
            total={PACKAGING_ITEMS.length}
            survey={survey}
            updatePre={updatePre}
            togglePreReason={togglePreReason}
            prevPre={prevPre}
            nextPre={nextPre}
          />
        )}

        {step === "experience" && (
          <ExperienceStep
            survey={survey}
            updateExperience={updateExperience}
            finishExperience={finishExperience}
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

        {step === "video" && <VideoStep finishVideo={finishVideo} />}

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

        {step === "post" && (
          <PostSurveyStep
            survey={survey}
            updatePost={updatePost}
            togglePostReason={togglePostReason}
            finishPostSurvey={finishPostSurvey}
          />
        )}

        {step === "done" && (
          <>
            <h2>제출 테스트 완료</h2>
            <p className="desc">
              현재는 Supabase 연결 전이라 실제 서버에는 저장되지 않았습니다.
              제출 데이터는 브라우저 콘솔에 출력되었습니다.
            </p>

            <button type="button" className="secondary" onClick={resetDraft}>
              새 응답 시작
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

function PreferenceStep({
  item,
  index,
  total,
  survey,
  updatePre,
  togglePreReason,
  prevPre,
  nextPre,
}) {
  const choice = survey.preSurvey[item.id] || "";
  const reasons = item.reasonId ? survey.preSurvey[item.reasonId] || [] : [];

  return (
    <>
      <h2>2단계. 포장 선호도 조사</h2>

      <div className="status">
        문항 {index + 1} / {total}
      </div>

      <div className="question">
        <h3>
          {item.id.replace("q", "")}. {item.title}
        </h3>

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
            <h3>
              {item.reasonId.replace("q", "")}. 그렇게 선택한 이유는
              무엇입니까?
            </h3>

            <div className="options">
              {REASONS.map((reason) => (
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

      <div className="button-row">
        <button type="button" className="secondary" onClick={prevPre}>
          이전
        </button>
        <button type="button" onClick={nextPre}>
          {index === total - 1 ? "이용 경험 문항으로 이동" : "다음"}
        </button>
      </div>
    </>
  );
}

function ExperienceStep({ survey, updateExperience, finishExperience }) {
  return (
    <>
      <h2>3단계. 포장 형태별 과자 이용 경험</h2>

      <p className="desc">
        최근 한 달 동안 아래 포장 형태의 과자를 구입하거나 먹은 경험을 선택하세요.
      </p>

      <FrequencyQuestion
        title="15-1. 봉지형"
        name="q15_pouch"
        value={survey.experience.q15_pouch}
        onChange={(value) => updateExperience("q15_pouch", value)}
      />

      <FrequencyQuestion
        title="15-2. 상자형"
        name="q15_box"
        value={survey.experience.q15_box}
        onChange={(value) => updateExperience("q15_box", value)}
      />

      <FrequencyQuestion
        title="15-3. 원통형"
        name="q15_cylinder"
        value={survey.experience.q15_cylinder}
        onChange={(value) => updateExperience("q15_cylinder", value)}
      />

      <button type="button" onClick={finishExperience}>
        분리배출 게임으로 이동
      </button>
    </>
  );
}

function FrequencyQuestion({ title, name, value, onChange }) {
  return (
    <div className="question">
      <h3>{title}</h3>

      <div className="options">
        {FREQUENCY_OPTIONS.map((option) => (
          <label key={option}>
            <input
              type="radio"
              name={name}
              checked={value === option}
              onChange={() => onChange(option)}
            />
            {option}
          </label>
        ))}
      </div>
    </div>
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
      <h2>4단계. 분리배출 게임</h2>

      <p className="desc">
        포장 이미지를 보고, 버릴 때 어떻게 처리할지 선택하세요.
        버리고자 하는 부분을 터치하면 배출함 선택창이 뜹니다.
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

      <h3>{item.name}</h3>

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

          <button type="button" onClick={finishCurrentGameItem}>
            다음으로
          </button>
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

function AfterGameStep({ survey, updateAfterGame, finishAfterGame }) {
  return (
    <>
      <h2>5단계. 게임 직후·영상 전 인식 문항</h2>

      <LikertQuestion
        title="18. 원통형 포장은 버리거나 분리배출하기 어렵다고 생각한다."
        name="q18"
        value={survey.afterGame.q18}
        onChange={(value) => updateAfterGame("q18", value)}
      />

      <LikertQuestion
        title="19. 원통형 포장은 환경 측면에서 부담이 큰 포장이라고 생각한다."
        name="q19"
        value={survey.afterGame.q19}
        onChange={(value) => updateAfterGame("q19", value)}
      />

      <button type="button" onClick={finishAfterGame}>
        영상 시청으로 이동
      </button>
    </>
  );
}

function LikertQuestion({ title, name, value, onChange }) {
  return (
    <div className="question">
      <h3>{title}</h3>

      <div className="options">
        {LIKERT_OPTIONS.map((option) => (
          <label key={option}>
            <input
              type="radio"
              name={name}
              checked={value === option}
              onChange={() => onChange(option)}
            />
            {option}
          </label>
        ))}
      </div>
    </div>
  );
}

function VideoStep({ finishVideo }) {
  const [videoWatched, setVideoWatched] = useState(false);
  const [videoError, setVideoError] = useState(false);

  return (
    <>
      <h2>6단계. 영상 시청</h2>

      <p className="desc">
        아래 영상을 끝까지 시청한 뒤, 영상 후 터치형 퀴즈로 이동하세요.
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
          영상 파일을 불러오지 못했습니다. public/videos/snack-shorts.mp4 경로와 파일명을 확인하세요.
        </p>
      )}

      {!videoWatched && !videoError && (
        <p className="video-warning">
          영상을 끝까지 보면 아래 버튼이 활성화됩니다.
        </p>
      )}

      <button
        type="button"
        disabled={!videoWatched}
        onClick={finishVideo}
      >
        {videoWatched ? "영상 후 터치형 퀴즈로 이동" : "영상을 끝까지 본 뒤 이동"}
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
      (piece.id === "lid" || piece.id === "bottom" || piece.id === "body_foil")
  );

  const selectedSummary = Q19_PART_DEFS.filter((part) => selectedParts[part.id]).map(
    (part) => ({
      partId: part.id,
      partLabel: part.label,
      binLabel: selectedParts[part.id].selectedBinLabel || "배출함 미선택",
    })
  );

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
      <h2>7단계. 영상 후 터치형 퀴즈</h2>

      <p className="desc">
        다시 해 보는 퀴즈입니다.
        버리고자 하는 부분을 터치하면 배출함 선택창이 뜹니다.
      </p>

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

      <div className="q19-summary-box">
        <div className="q19-summary-title">선택 내용</div>

        {selectedSummary.length > 0 ? (
          <div className="q19-summary-list">
            {selectedSummary.map((item, index) => (
              <div className="q19-summary-row" key={`${item.partLabel}-${index}`}>
                <span className="q19-summary-part">{item.partLabel}</span>
                <span className="q19-summary-arrow">→</span>
                <span className="q19-summary-bin">{item.binLabel}</span>
                <button
                  type="button"
                  className="summary-reset-button"
                  onClick={() => removeQ19PartSelection(item.partId)}
                >
                  다시 선택
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="q19-summary-empty">
            아직 배출함에 넣은 조각이 없습니다.
          </div>
        )}
      </div>

      <button type="button" onClick={finishQ19Quiz}>
        퀴즈 응답 제출
      </button>

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
  return (
    <>
      <h2>8단계. 사후 구매의향</h2>

      <div className="question">
        <h3>
          20. 원통형 포장이 분리배출하기 어렵다는 설명을 본 뒤에도,
          원통형 포장 과자를 구입할 생각이 있나요?
        </h3>

        <div className="options">
          {["그렇다", "아니다", "잘 모르겠다"].map((option) => (
            <label key={option}>
              <input
                type="radio"
                name="q20"
                checked={survey.postSurvey.q20 === option}
                onChange={() => updatePost("q20", option)}
              />
              {option}
            </label>
          ))}
        </div>
      </div>

      <div className="question">
        <h3>21. 그렇게 답한 데 영향을 준 이유는 무엇입니까?</h3>

        <div className="options">
          {POST_REASONS.map((reason) => (
            <label key={reason}>
              <input
                type="checkbox"
                checked={survey.postSurvey.q21.includes(reason)}
                onChange={() => togglePostReason(reason)}
              />
              {reason}
            </label>
          ))}
        </div>
      </div>

      <button type="button" onClick={finishPostSurvey}>
        제출 테스트
      </button>
    </>
  );
}
