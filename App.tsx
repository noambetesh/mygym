
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  ArrowRightLeft,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Cpu,
  Dumbbell,
  Flame,
  HeartPulse,
  History,
  Home,
  LayoutGrid,
  Music,
  Pause,
  Play,
  Plus,
  RefreshCcw,
  RotateCcw,
  Search,
  SkipBack,
  SkipForward,
  Trash2,
  Trophy,
  Weight,
  X,
  Youtube,
} from "lucide-react";

const REACHER_HERO =
  "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1600";
const DEFAULT_EXERCISE_IMAGE =
  "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1200";

type MuscleGroup =
  | "Back"
  | "Chest"
  | "Legs"
  | "Glutes"
  | "Shoulders"
  | "Arms"
  | "Core"
  | "FullBody";

type Category =
  | "pull"
  | "push"
  | "legs"
  | "armor"
  | "power"
  | "core"
  | "isolation";

type DayKey = "sun" | "mon" | "tue" | "wed" | "thu" | "fri";
type MainTab = "dashboard" | "vault" | "stats";

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  he: string;
  work: number;
  rest: number;
  category: Category;
  muscleGroup: MuscleGroup;
  videoUrl: string;
  imageUrl: string;
  difficulty: "Elite" | "Advanced" | "Standard";
}

interface SetRecord {
  weight: number;
  reps: number;
  timestamp: number;
  exerciseId: string;
}

interface SessionData {
  id: string;
  date: string;
  volume: number;
  exercises: number;
}

const muscleHebrew: Record<MuscleGroup, string> = {
  Back: "גב",
  Chest: "חזה",
  Legs: "רגליים",
  Glutes: "ישבן",
  Shoulders: "כתפיים",
  Arms: "ידיים",
  Core: "ליבה",
  FullBody: "כל הגוף",
};

const categoryHebrew: Record<Category, string> = {
  pull: "משיכה",
  push: "דחיפה",
  legs: "רגליים",
  armor: "שריון",
  power: "כוח",
  core: "ליבה",
  isolation: "בידוד",
};

const muscleGroupImages: Record<MuscleGroup, string> = {
  Back: "https://images.unsplash.com/photo-1603287611837-f2146f5de8e8?q=80&w=800",
  Chest: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=800",
  Legs: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800",
  Glutes: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=800",
  Shoulders: "https://images.unsplash.com/photo-1591741535018-d042766c62eb?q=80&w=800",
  Arms: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=800",
  Core: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=800",
  FullBody: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=800",
};

const DAY_SPLITS: {
  id: DayKey;
  label: string;
  title: string;
  subtitle: string;
  muscles: MuscleGroup[];
  nutrition: string;
}[] = [
  {
    id: "sun",
    label: "יום א",
    title: "Pull Power",
    subtitle: "גב + יד קדמית + ליבה",
    muscles: ["Back", "Arms", "Core"],
    nutrition: "יותר פחמימה לפני אימון, חלבון מלא אחרי האימון.",
  },
  {
    id: "mon",
    label: "יום ב",
    title: "Push Builder",
    subtitle: "חזה + כתפיים + טרייספס",
    muscles: ["Chest", "Shoulders", "Arms"],
    nutrition: "דגש על חלבון, נוזלים וארוחה מסודרת 60-90 דקות לפני.",
  },
  {
    id: "tue",
    label: "יום ג",
    title: "Legs Heavy",
    subtitle: "רגליים + ליבה",
    muscles: ["Legs", "Core"],
    nutrition: "פחמימות מורכבות, מלח ונוזלים כדי לשמור ביצועים.",
  },
  {
    id: "wed",
    label: "יום ד",
    title: "Recovery Pump",
    subtitle: "עומס נמוך, נפח נשלט",
    muscles: ["Shoulders", "Arms", "Core"],
    nutrition: "יותר ירקות, חלבון קבוע ושינה טובה.",
  },
  {
    id: "thu",
    label: "יום ה",
    title: "Upper Mix",
    subtitle: "פלג גוף עליון משולב",
    muscles: ["Back", "Chest", "Shoulders"],
    nutrition: "שמור על חלבון גבוה וחטיף קל לפני הסשן.",
  },
  {
    id: "fri",
    label: "יום ו",
    title: "Full Body",
    subtitle: "כוח, קצב, מטבוליזם",
    muscles: ["FullBody", "Legs", "Core"],
    nutrition: "שילוב פחמימה מהירה אחרי אימון וחלבון מלא.",
  },
];

const AI_TIPS = [
  "שמור על טכניקה נקייה לפני העלאת משקל.",
  "ירידה איטית תיתן לך יותר שליטה ויותר עבודה לשריר.",
  "אל תדלג על מנוחה בין סטים כבדים.",
  "תן עדיפות לטווח תנועה טוב ולאגו.",
  "חלבון, מים ושינה יעזרו לך יותר מכל תרגיל קסם.",
  "כשאתה מרגיש שהטכניקה נשברת, עצור רגע ותסדר את עצמך.",
];

const NUTRITION_TRACKS = [
  {
    title: "Lean Build",
    calories: "2700-3000",
    protein: "160-190g",
    carbs: "300-360g",
    fats: "65-80g",
    focus: "מסה נקייה עם שליטה בשומן",
  },
  {
    title: "Performance",
    calories: "2500-2800",
    protein: "150-180g",
    carbs: "260-330g",
    fats: "60-75g",
    focus: "ביצועים, התאוששות ואנרגיה לאימונים",
  },
  {
    title: "Cut Smart",
    calories: "2100-2400",
    protein: "170-200g",
    carbs: "170-230g",
    fats: "55-70g",
    focus: "שמירה על שריר תוך ירידה מבוקרת",
  },
];

const MASTER_VAULT: Exercise[] = [
  { id: "b1", name: "Meadows Row", sets: 4, reps: "10-12", he: "חתירה ביד אחת מקצה מוט חופשי עם דגש על עומק ועובי בגב.", work: 45, rest: 90, category: "pull", muscleGroup: "Back", videoUrl: "https://www.youtube.com/watch?v=2v-re_6_23w", imageUrl: muscleGroupImages.Back, difficulty: "Advanced" },
  { id: "b2", name: "Weighted Pull-Ups", sets: 4, reps: "6-8", he: "מתח בתוספת משקל לבניית רוחב וכוח בסיסי.", work: 40, rest: 120, category: "pull", muscleGroup: "Back", videoUrl: "https://www.youtube.com/watch?v=p1qV6WfI7eQ", imageUrl: muscleGroupImages.Back, difficulty: "Elite" },
  { id: "b3", name: "Iliac Lat Pulldown", sets: 3, reps: "12-15", he: "פולי עליון עם דגש על המרפק לכיוון האגן.", work: 35, rest: 75, category: "pull", muscleGroup: "Back", videoUrl: "https://www.youtube.com/results?search_query=Iliac+Lat+Pulldown", imageUrl: muscleGroupImages.Back, difficulty: "Advanced" },
  { id: "b4", name: "T-Bar Row", sets: 3, reps: "10", he: "חתירה עם תמיכת חזה לבידוד נקי של הגב העליון.", work: 40, rest: 90, category: "pull", muscleGroup: "Back", videoUrl: "https://www.youtube.com/results?search_query=T-Bar+Row", imageUrl: muscleGroupImages.Back, difficulty: "Standard" },
  { id: "b5", name: "Rack Pulls", sets: 4, reps: "5-8", he: "משיכת מוט מהכלוב לחיזוק זוקפים וגב חזק.", work: 30, rest: 150, category: "pull", muscleGroup: "Back", videoUrl: "https://www.youtube.com/results?search_query=Rack+Pulls", imageUrl: muscleGroupImages.Back, difficulty: "Elite" },
  { id: "c1", name: "Low-Incline DB Press", sets: 4, reps: "8-10", he: "לחיצת משקולות בשיפוע קל עם דגש על חזה עליון.", work: 45, rest: 100, category: "push", muscleGroup: "Chest", videoUrl: "https://www.youtube.com/watch?v=8iP_u5h_8E0", imageUrl: muscleGroupImages.Chest, difficulty: "Advanced" },
  { id: "c2", name: "Weighted Dips", sets: 4, reps: "8-12", he: "מקבילים בתוספת משקל עם הטיה קלה קדימה.", work: 40, rest: 100, category: "push", muscleGroup: "Chest", videoUrl: "https://www.youtube.com/watch?v=2z8JmcrW-As", imageUrl: muscleGroupImages.Chest, difficulty: "Elite" },
  { id: "c3", name: "Cable Flyes", sets: 3, reps: "15", he: "בידוד חזה בכבלים עם מתיחה וסחיטה.", work: 35, rest: 60, category: "isolation", muscleGroup: "Chest", videoUrl: "https://www.youtube.com/results?search_query=Cable+Flyes", imageUrl: muscleGroupImages.Chest, difficulty: "Standard" },
  { id: "c4", name: "Flat Bench Press", sets: 4, reps: "6-8", he: "לחיצת חזה קלאסית עם מוט לבניית כוח ומסה.", work: 45, rest: 120, category: "push", muscleGroup: "Chest", videoUrl: "https://www.youtube.com/results?search_query=Flat+Bench+Press", imageUrl: muscleGroupImages.Chest, difficulty: "Advanced" },
  { id: "c5", name: "Incline Barbell Press", sets: 4, reps: "6-8", he: "לחיצת מוט בשיפוע לחזה עליון חזק.", work: 45, rest: 120, category: "push", muscleGroup: "Chest", videoUrl: "https://www.youtube.com/results?search_query=Incline+Barbell+Press", imageUrl: muscleGroupImages.Chest, difficulty: "Advanced" },
  { id: "l1", name: "Zercher Squat", sets: 4, reps: "8-10", he: "סקוואט עם המוט במרפקים, ליבה ורגליים חזקות.", work: 50, rest: 150, category: "legs", muscleGroup: "Legs", videoUrl: "https://www.youtube.com/watch?v=U2OKweR-N-g", imageUrl: muscleGroupImages.Legs, difficulty: "Elite" },
  { id: "l2", name: "Bulgarian Split Squat", sets: 3, reps: "10/leg", he: "תרגיל חד צדדי חזק לקוואדס ויציבות.", work: 45, rest: 90, category: "legs", muscleGroup: "Legs", videoUrl: "https://www.youtube.com/watch?v=2C-uNgKwPLE", imageUrl: muscleGroupImages.Legs, difficulty: "Advanced" },
  { id: "l3", name: "Romanian Deadlift", sets: 4, reps: "10-12", he: "מתיחה חזקה להמסטרינג ולשרשרת האחורית.", work: 45, rest: 100, category: "legs", muscleGroup: "Legs", videoUrl: "https://www.youtube.com/watch?v=jEy_czb3qwA", imageUrl: muscleGroupImages.Legs, difficulty: "Advanced" },
  { id: "l4", name: "Hack Squat", sets: 4, reps: "8-10", he: "סקוואט במכונה עם דגש על קוואדס.", work: 45, rest: 120, category: "legs", muscleGroup: "Legs", videoUrl: "https://www.youtube.com/results?search_query=Hack+Squat", imageUrl: muscleGroupImages.Legs, difficulty: "Advanced" },
  { id: "l5", name: "Standing Calf Raises", sets: 4, reps: "20", he: "שוקיים בעמידה עם מתיחה וסחיטה מלאה.", work: 30, rest: 60, category: "isolation", muscleGroup: "Legs", videoUrl: "https://www.youtube.com/results?search_query=Standing+Calf+Raises", imageUrl: muscleGroupImages.Legs, difficulty: "Standard" },

  { id: "g1", name: "Barbell Hip Thrust", sets: 4, reps: "8-12", he: "דחיפת אגן עם מוט, תרגיל בסיס חזק מאוד לישבן.", work: 45, rest: 90, category: "legs", muscleGroup: "Glutes", videoUrl: "https://www.youtube.com/results?search_query=Barbell+Hip+Thrust", imageUrl: muscleGroupImages.Glutes, difficulty: "Advanced" },
  { id: "g2", name: "Kas Glute Bridge", sets: 3, reps: "12-15", he: "טווח קצר עם סחיטה חזקה וממוקדת לישבן.", work: 40, rest: 90, category: "legs", muscleGroup: "Glutes", videoUrl: "https://www.youtube.com/results?search_query=Kas+Glute+Bridge", imageUrl: muscleGroupImages.Glutes, difficulty: "Standard" },
  { id: "g3", name: "Cable Glute Kickback", sets: 3, reps: "15/leg", he: "פשיטת ירך לאחור בכבל עם בידוד טוב לישבן.", work: 35, rest: 60, category: "isolation", muscleGroup: "Glutes", videoUrl: "https://www.youtube.com/results?search_query=Cable+Glute+Kickback", imageUrl: muscleGroupImages.Glutes, difficulty: "Standard" },
  { id: "g4", name: "Walking Lunges", sets: 3, reps: "20 Steps", he: "צעדי מכרע שעובדים חזק גם על ישבן וגם על ירך.", work: 60, rest: 90, category: "legs", muscleGroup: "Glutes", videoUrl: "https://www.youtube.com/results?search_query=Walking+Lunges", imageUrl: muscleGroupImages.Glutes, difficulty: "Standard" },
  { id: "g5", name: "Leg Press (High Foot)", sets: 4, reps: "12-15", he: "מנח רגליים גבוה להעברת דגש לישבן ולהמסטרינג.", work: 45, rest: 90, category: "legs", muscleGroup: "Glutes", videoUrl: "https://www.youtube.com/results?search_query=Leg+Press+High+Foot", imageUrl: muscleGroupImages.Glutes, difficulty: "Standard" },
  { id: "g6", name: "Frog Pumps", sets: 3, reps: "20-25", he: "פאמפ מהיר וממוקד לישבן בסוף אימון.", work: 30, rest: 45, category: "isolation", muscleGroup: "Glutes", videoUrl: "https://www.youtube.com/results?search_query=Frog+Pumps", imageUrl: muscleGroupImages.Glutes, difficulty: "Standard" },

  { id: "s1", name: "Z-Press", sets: 4, reps: "8-10", he: "לחיצת כתפיים בישיבה על הרצפה.", work: 45, rest: 120, category: "armor", muscleGroup: "Shoulders", videoUrl: "https://www.youtube.com/watch?v=0_fL9S0v00A", imageUrl: muscleGroupImages.Shoulders, difficulty: "Elite" },
  { id: "s2", name: "Face Pulls", sets: 4, reps: "20", he: "תרגיל חובה לבריאות כתף אחורית ויציבה.", work: 40, rest: 60, category: "armor", muscleGroup: "Shoulders", videoUrl: "https://www.youtube.com/watch?v=rep-qVOkqgk", imageUrl: muscleGroupImages.Shoulders, difficulty: "Standard" },
  { id: "s3", name: "Military Press", sets: 4, reps: "6", he: "לחיצת מוט בעמידה לכוח כתפיים וליבה.", work: 45, rest: 150, category: "armor", muscleGroup: "Shoulders", videoUrl: "https://www.youtube.com/results?search_query=Military+Press", imageUrl: muscleGroupImages.Shoulders, difficulty: "Advanced" },
  { id: "s4", name: "Cable Lateral Raise", sets: 4, reps: "15", he: "הרמה צידית עם מתח רציף.", work: 35, rest: 60, category: "isolation", muscleGroup: "Shoulders", videoUrl: "https://www.youtube.com/results?search_query=Cable+Lateral+Raise", imageUrl: muscleGroupImages.Shoulders, difficulty: "Standard" },
  { id: "s5", name: "Push Press", sets: 4, reps: "5", he: "לחיצה מתפרצת עם עזרה מהרגליים.", work: 40, rest: 180, category: "power", muscleGroup: "Shoulders", videoUrl: "https://www.youtube.com/results?search_query=Push+Press", imageUrl: muscleGroupImages.Shoulders, difficulty: "Elite" },
  { id: "a1", name: "Bayesian Cable Curl", sets: 3, reps: "12-15", he: "כפיפה בכבל עם מתיחה חזקה לבייספס.", work: 35, rest: 60, category: "isolation", muscleGroup: "Arms", videoUrl: "https://www.youtube.com/watch?v=6id88qL2vXk", imageUrl: muscleGroupImages.Arms, difficulty: "Advanced" },
  { id: "a2", name: "Hammer Curl", sets: 3, reps: "12", he: "בייספס ואמות באחיזה ניטרלית.", work: 35, rest: 75, category: "isolation", muscleGroup: "Arms", videoUrl: "https://www.youtube.com/results?search_query=Hammer+Curl", imageUrl: muscleGroupImages.Arms, difficulty: "Standard" },
  { id: "a3", name: "Close-Grip Bench", sets: 4, reps: "8", he: "לחיצה צרה לכוח טרייספס.", work: 45, rest: 100, category: "push", muscleGroup: "Arms", videoUrl: "https://www.youtube.com/results?search_query=Close+Grip+Bench+Press", imageUrl: muscleGroupImages.Arms, difficulty: "Advanced" },
  { id: "a4", name: "Skull Crusher", sets: 3, reps: "10-12", he: "פשיטת מרפקים בשכיבה לטרייספס.", work: 40, rest: 90, category: "isolation", muscleGroup: "Arms", videoUrl: "https://www.youtube.com/results?search_query=Skull+Crusher", imageUrl: muscleGroupImages.Arms, difficulty: "Advanced" },
  { id: "a5", name: "Tricep Pushdown", sets: 4, reps: "15", he: "לחיצת חבל למטה לבידוד טרייספס.", work: 30, rest: 60, category: "isolation", muscleGroup: "Arms", videoUrl: "https://www.youtube.com/results?search_query=Tricep+Pushdown", imageUrl: muscleGroupImages.Arms, difficulty: "Standard" },
  { id: "cr1", name: "Dragon Flag", sets: 3, reps: "5-8", he: "תרגיל שליטה מתקדם מאוד לבטן.", work: 40, rest: 90, category: "core", muscleGroup: "Core", videoUrl: "https://www.youtube.com/watch?v=moyFIvRrS0E", imageUrl: muscleGroupImages.Core, difficulty: "Elite" },
  { id: "cr2", name: "Hanging Leg Raise", sets: 4, reps: "15", he: "בטן תחתונה וליבה בתלייה.", work: 40, rest: 60, category: "core", muscleGroup: "Core", videoUrl: "https://www.youtube.com/results?search_query=Hanging+Leg+Raise", imageUrl: muscleGroupImages.Core, difficulty: "Advanced" },
  { id: "cr3", name: "Cable Crunches", sets: 4, reps: "20", he: "כפיפות בטן בכבל לעומס טוב על הליבה.", work: 35, rest: 60, category: "core", muscleGroup: "Core", videoUrl: "https://www.youtube.com/results?search_query=Cable+Crunches", imageUrl: muscleGroupImages.Core, difficulty: "Standard" },
  { id: "f1", name: "Landmine Thruster", sets: 4, reps: "10", he: "סקוואט ודחיפה של המוט מעל הראש בתנועה אחת.", work: 60, rest: 120, category: "power", muscleGroup: "FullBody", videoUrl: "https://www.youtube.com/results?search_query=Landmine+Thruster", imageUrl: muscleGroupImages.FullBody, difficulty: "Advanced" },
  { id: "f2", name: "Farmer's Walk", sets: 3, reps: "40m", he: "הליכה עם משקולות כבדות לאחיזה, ליבה וגב.", work: 45, rest: 120, category: "power", muscleGroup: "FullBody", videoUrl: "https://www.youtube.com/results?search_query=Farmer%27s+Walk", imageUrl: muscleGroupImages.FullBody, difficulty: "Elite" },
  { id: "f3", name: "Kettlebell Swing", sets: 4, reps: "20", he: "הנפה מתפרצת לישבן, ירך אחורית וסיבולת.", work: 45, rest: 60, category: "power", muscleGroup: "FullBody", videoUrl: "https://www.youtube.com/results?search_query=Kettlebell+Swing", imageUrl: muscleGroupImages.FullBody, difficulty: "Standard" },
];

function getDayRecommendations(day: DayKey, exercises: Exercise[]) {
  const config = DAY_SPLITS.find((d) => d.id === day) || DAY_SPLITS[0];
  return exercises.filter((ex) => config.muscles.includes(ex.muscleGroup)).slice(0, 8);
}

function getExerciseImage(exercise: Exercise) {
  return exercise.imageUrl || muscleGroupImages[exercise.muscleGroup] || DEFAULT_EXERCISE_IMAGE;
}

function parseRepTarget(repText: string): number {
  const match = repText.match(/\d+/);
  return match ? parseInt(match[0], 10) : 8;
}

function getExerciseLogs(exerciseId: string, logs: SetRecord[]) {
  return logs
    .filter((log) => log.exerciseId === exerciseId)
    .sort((a, b) => b.timestamp - a.timestamp);
}

function getOverloadSuggestion(exercise: Exercise, logs: SetRecord[]) {
  const exLogs = getExerciseLogs(exercise.id, logs);
  const last = exLogs[0];
  if (!last) {
    return "אין תיעוד קודם. התחל במשקל שאתה שולט בו ושמור טכניקה נקייה.";
  }

  const target = parseRepTarget(exercise.reps);
  const increment =
    exercise.category === "isolation" || exercise.muscleGroup === "Arms"
      ? 1.25
      : 2.5;

  if (last.reps >= target) {
    return `בפעם הקודמת עשית ${last.weight} ק"ג ל-${last.reps} חזרות. נסה ${Number(
      last.weight + increment
    )
      .toFixed(2)
      .replace(".00", "")} ק"ג.`;
  }

  return `בפעם הקודמת עשית ${last.weight} ק"ג ל-${last.reps} חזרות. שמור על אותו משקל ונסה להוסיף חזרה או שתיים.`;
}

function getExerciseAiNotes(exercise: Exercise, logs: SetRecord[]) {
  const notes = [
    exercise.muscleGroup === "Back"
      ? "תחשוב על משיכת מרפקים ולא רק ידיים."
      : null,
    exercise.muscleGroup === "Chest"
      ? "שמור על חזה פתוח ושכמות מסודרות."
      : null,
    exercise.muscleGroup === "Legs"
      ? "שמור על שליטה בברך ובאגן בירידה."
      : null,
    exercise.muscleGroup === "Glutes"
      ? "בתרגילי ישבן תסיים עם סחיטה למעלה בלי לזרוק את הגב."
      : null,
    exercise.muscleGroup === "Shoulders"
      ? "אל תרים כתפיים לאוזניים, תשאיר צוואר רגוע."
      : null,
    exercise.muscleGroup === "Arms"
      ? "פחות תנופה, יותר שליטה."
      : null,
    exercise.muscleGroup === "Core"
      ? "קיר בטן חזק ונשימה מבוקרת."
      : null,
    exercise.muscleGroup === "FullBody"
      ? "קצב, שליטה ונשימה חשובים פה אפילו יותר מהעומס."
      : null,
    getOverloadSuggestion(exercise, logs),
  ].filter(Boolean) as string[];

  return notes.slice(0, 3);
}

function estimateCalories(volume: number) {
  if (volume <= 0) return 0;
  return Math.round(Math.min(900, Math.max(160, volume / 18)));
}

function getRecoveryScore(history: SessionData[]) {
  const recent = history.slice(0, 4);
  if (recent.length === 0) return 78;
  const avgVolume =
    recent.reduce((acc, item) => acc + item.volume, 0) / recent.length;
  if (avgVolume > 3000) return 71;
  if (avgVolume > 1800) return 79;
  return 87;
}

function SafeImage({
  src,
  alt,
  className,
  fallbackSrc = DEFAULT_EXERCISE_IMAGE,
}: {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
}) {
  const [imgSrc, setImgSrc] = useState(src || fallbackSrc);

  useEffect(() => {
    setImgSrc(src || fallbackSrc);
  }, [src, fallbackSrc]);

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={() => setImgSrc(fallbackSrc)}
    />
  );
}

const ApexCard = ({
  children,
  className,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) => (
  <motion.div
    whileHover={onClick ? { scale: 1.01 } : {}}
    onClick={onClick}
    className={`bg-slate-900/60 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] overflow-hidden transition-all duration-300 ${className || ""}`}
  >
    {children}
  </motion.div>
);

const ApexButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "default" | "outline" | "ghost" | "danger" | "premium";
    size?: "default" | "sm" | "lg" | "icon";
  }
>(({ className, variant = "default", size = "default", children, ...props }, ref) => {
  const base =
    "inline-flex items-center justify-center font-black transition-all active:scale-95 disabled:opacity-50 cursor-pointer select-none";
  const variants = {
    default:
      "bg-teal-500 text-slate-950 hover:bg-teal-400 shadow-[0_0_20px_rgba(20,184,166,0.3)]",
    outline: "border border-white/10 bg-white/5 hover:bg-white/10 text-white/90",
    ghost: "bg-transparent text-white/50 hover:text-white hover:bg-white/5",
    danger: "bg-rose-600 text-white",
    premium: "bg-gradient-to-r from-teal-500 to-indigo-600 text-white shadow-xl",
  };
  const sizes = {
    default: "h-14 px-8 rounded-2xl text-sm",
    sm: "h-10 px-4 rounded-xl text-[10px]",
    lg: "h-20 px-12 rounded-3xl text-xl",
    icon: "h-12 w-12 rounded-xl",
  };

  return (
    <button
      ref={ref}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className || ""}`}
      {...props}
    >
      {children}
    </button>
  );
});
ApexButton.displayName = "ApexButton";

function Toast({ message }: { message: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 25, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.96 }}
      className="fixed top-8 left-1/2 -translate-x-1/2 z-[900] bg-slate-900/95 border border-teal-500/30 rounded-[1.8rem] px-6 py-4 text-white shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-2xl"
      dir="rtl"
    >
      <div className="flex items-center gap-3">
        <CheckCircle2 size={18} className="text-teal-400" />
        <span className="font-bold">{message}</span>
      </div>
    </motion.div>
  );
}

function TransitionFlash({ tone = "teal" }: { tone?: "teal" | "indigo" }) {
  const glow =
    tone === "indigo"
      ? "from-indigo-400/55 via-cyan-300/30 to-transparent"
      : "from-teal-300/60 via-cyan-200/30 to-transparent";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1.08 }}
      exit={{ opacity: 0, scale: 1.18 }}
      transition={{ duration: 0.34, ease: "easeOut" }}
      className="fixed inset-0 z-[1000] pointer-events-none overflow-hidden"
    >
      <div className={`absolute inset-0 bg-gradient-to-b ${glow}`} />
      <motion.div
        initial={{ opacity: 0.2, scale: 0.8 }}
        animate={{ opacity: 0.95, scale: 1.45 }}
        exit={{ opacity: 0, scale: 1.8 }}
        transition={{ duration: 0.34, ease: "easeOut" }}
        className="absolute inset-0 m-auto h-[22rem] w-[22rem] rounded-full border border-white/40 bg-white/10 blur-2xl"
      />
      <div className="absolute inset-0 bg-white/5" />
    </motion.div>
  );
}

function AskAIModal({
  exercise,
  logs,
  onClose,
  onAdd,
}: {
  exercise: Exercise;
  logs: SetRecord[];
  onClose: () => void;
  onAdd: () => void;
}) {
  const notes = useMemo(() => getExerciseAiNotes(exercise, logs), [exercise, logs]);

  return (
    <div
      className="fixed inset-0 z-[700] bg-black/90 backdrop-blur-2xl flex items-center justify-center p-6"
      dir="rtl"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-3xl bg-slate-900 border border-white/10 rounded-[3rem] overflow-hidden"
      >
        <div className="relative h-56">
          <SafeImage
            src={getExerciseImage(exercise)}
            alt={exercise.name}
            className="w-full h-full object-cover opacity-30"
            fallbackSrc={muscleGroupImages[exercise.muscleGroup]}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
          <div className="absolute inset-0 p-8 flex items-end justify-between">
            <div className="space-y-2">
              <div className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border bg-teal-500/10 text-teal-400 border-teal-500/20 inline-block">
                {exercise.difficulty}
              </div>
              <h3 className="text-4xl font-black italic uppercase tracking-tighter">
                {exercise.name}
              </h3>
            </div>
            <ApexButton variant="ghost" size="icon" onClick={onClose}>
              <X />
            </ApexButton>
          </div>
        </div>

        <div className="p-8 space-y-8">
          <ApexCard className="p-6 bg-teal-500/5 border-teal-500/20">
            <div className="space-y-3">
              {notes.map((note, idx) => (
                <div key={idx} className="text-slate-200 leading-relaxed font-medium">
                  - {note}
                </div>
              ))}
            </div>
          </ApexCard>

          <div className="flex flex-col md:flex-row gap-4">
            <ApexButton variant="premium" className="flex-1 gap-2" onClick={onAdd}>
              <Plus size={18} /> הוסף לסשן
            </ApexButton>
            <ApexButton
              variant="outline"
              className="flex-1 gap-2"
              onClick={() =>
                window.open(exercise.videoUrl, "_blank", "noopener,noreferrer")
              }
            >
              <Youtube size={18} /> פתח וידאו
            </ApexButton>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function ReacherApp() {
  const [screen, setScreen] = useState<"splash" | "nutrition" | "main">("splash");
  const [tab, setTab] = useState<MainTab>("dashboard");
  const [vaultFilter, setVaultFilter] = useState<MuscleGroup | "All">("All");
  const [selectedDay, setSelectedDay] = useState<DayKey>("sun");
  const [searchText, setSearchText] = useState("");
  const [askAIExercise, setAskAIExercise] = useState<Exercise | null>(null);
  const [toast, setToast] = useState("");
  const [favorites, setFavorites] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      return JSON.parse(window.localStorage.getItem("reacher_favorites_v22") || "[]");
    } catch {
      return [];
    }
  });

  const [sessionList, setSessionList] = useState<Exercise[]>([]);
  const [inSession, setInSession] = useState(false);
  const [curIdx, setCurIdx] = useState(0);
  const [curSet, setCurSet] = useState(1);
  const [phase, setPhase] = useState<"work" | "rest">("work");
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [tip, setTip] = useState(AI_TIPS[0]);

  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");
  const [logs, setLogs] = useState<SetRecord[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      return JSON.parse(window.localStorage.getItem("reacher_logs_v22") || "[]");
    } catch {
      return [];
    }
  });

  const [history, setHistory] = useState<SessionData[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      return JSON.parse(window.localStorage.getItem("reacher_hist_v22") || "[]");
    } catch {
      return [];
    }
  });

  const audioCtx = useRef<AudioContext | null>(null);
  const [flashTone, setFlashTone] = useState<null | "teal" | "indigo">(null);

  const playToneBurst = useCallback((freqs: number[], duration = 0.16) => {
    if (typeof window === "undefined") return;

    if (!audioCtx.current) {
      audioCtx.current = new AudioContext();
    }
    if (audioCtx.current.state === "suspended") {
      audioCtx.current.resume();
    }

    freqs.slice(0, 4).forEach((freq, index) => {
      const osc = audioCtx.current!.createOscillator();
      const gain = audioCtx.current!.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.current!.destination);
      osc.type = "sine";

      const start = audioCtx.current!.currentTime + index * 0.045;
      osc.frequency.setValueAtTime(freq, start);
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.linearRampToValueAtTime(0.012, start + 0.018);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
      osc.start(start);
      osc.stop(start + duration + 0.03);
    });
  }, []);

  const navigateWithFlash = useCallback(
    (nextScreen: "splash" | "nutrition" | "main", tone: "teal" | "indigo" = "teal") => {
      setFlashTone(tone);
      playToneBurst(tone === "indigo" ? [480, 610, 760] : [520, 660, 820], 0.12);
      window.setTimeout(() => setScreen(nextScreen), 140);
      window.setTimeout(() => setFlashTone(null), 380);
    },
    [playToneBurst]
  );

  useEffect(() => {
    window.localStorage.setItem("reacher_logs_v22", JSON.stringify(logs));
  }, [logs]);

  useEffect(() => {
    window.localStorage.setItem("reacher_hist_v22", JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    window.localStorage.setItem("reacher_favorites_v22", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(""), 2300);
    return () => window.clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    if (screen === "splash") return;
    playToneBurst(screen === "nutrition" ? [520, 650, 780] : [470, 620, 760], 0.1);
  }, [screen, playToneBurst]);

  useEffect(() => {
    let t: number | undefined;
    if (isRunning && timer > 0) {
      t = window.setInterval(() => setTimer((v) => v - 1), 1000);
    } else if (isRunning && timer === 0 && inSession) {
      handlePhaseTransition();
    }
    return () => {
      if (t) window.clearInterval(t);
    };
  });

  const recoveryScore = useMemo(() => getRecoveryScore(history), [history]);
  const currentDayConfig = useMemo(
    () => DAY_SPLITS.find((d) => d.id === selectedDay) || DAY_SPLITS[0],
    [selectedDay]
  );

  const dayRecommendations = useMemo(
    () => getDayRecommendations(selectedDay, MASTER_VAULT),
    [selectedDay]
  );

  const filteredVault = useMemo(() => {
    return MASTER_VAULT.filter((ex) => {
      const filterOk = vaultFilter === "All" || ex.muscleGroup === vaultFilter;
      const text = `${ex.name} ${ex.he} ${muscleHebrew[ex.muscleGroup]} ${categoryHebrew[ex.category]}`.toLowerCase();
      const searchOk =
        searchText.trim() === "" || text.includes(searchText.toLowerCase());
      return filterOk && searchOk;
    });
  }, [vaultFilter, searchText]);

  const sessionVolume = useMemo(() => {
    const sessionIds = new Set(sessionList.map((item) => item.id));
    return logs
      .filter((log) => sessionIds.has(log.exerciseId))
      .reduce((acc, curr) => acc + curr.weight * curr.reps, 0);
  }, [logs, sessionList]);

  const currentExercise = sessionList[curIdx];

  const addExerciseToSession = (exercise: Exercise) => {
    setSessionList((prev) => [...prev, exercise]);
    setToast(`${exercise.name} נוסף לסשן`);
    playToneBurst([820, 980], 0.1);
  };

  const toggleFavorite = (exerciseId: string) => {
    setFavorites((prev) =>
      prev.includes(exerciseId)
        ? prev.filter((id) => id !== exerciseId)
        : [...prev, exerciseId]
    );
  };

  const startProtocol = () => {
    if (sessionList.length === 0) {
      setToast("קודם תוסיף לפחות תרגיל אחד לסשן");
      return;
    }

    setInSession(true);
    setCurIdx(0);
    setCurSet(1);
    setPhase("work");
    setTimer(sessionList[0].work);
    setIsRunning(true);
    setToast("הסשן התחיל");
    playToneBurst([500, 620, 740], 0.14);
  };

  const completeWorkout = () => {
    const sessionIds = new Set(sessionList.map((item) => item.id));
    const sessionLogs = logs.filter((log) => sessionIds.has(log.exerciseId));
    const totalVolume = sessionLogs.reduce(
      (acc, curr) => acc + curr.weight * curr.reps,
      0
    );

    const newHist: SessionData = {
      id: Math.random().toString(36).slice(2, 10),
      date: new Date().toLocaleDateString("he-IL"),
      volume: totalVolume,
      exercises: sessionList.length,
    };

    setHistory((prev) => [newHist, ...prev]);
    setInSession(false);
    setIsRunning(false);
    setSessionList([]);
    setCurIdx(0);
    setCurSet(1);
    setTimer(0);
    setToast("אימון הושלם והיסטוריה נשמרה");
  };

  const handlePhaseTransition = () => {
    const ex = sessionList[curIdx];
    if (!ex) return;

    if (phase === "work") {
      setPhase("rest");
      setTimer(ex.rest);
      setTip(
        getExerciseAiNotes(ex, logs)[
          Math.floor(Math.random() * getExerciseAiNotes(ex, logs).length)
        ] || AI_TIPS[0]
      );
      playToneBurst([620, 720], 0.1);
    } else {
      if (curSet < ex.sets) {
        setCurSet((s) => s + 1);
        setPhase("work");
        setTimer(ex.work);
      } else if (curIdx + 1 < sessionList.length) {
        setCurIdx((i) => i + 1);
        setCurSet(1);
        setPhase("work");
        setTimer(sessionList[curIdx + 1].work);
      } else {
        completeWorkout();
      }
      playToneBurst([880, 980], 0.1);
    }
  };

  const logCurrentSet = () => {
    if (!currentExercise || !weight || !reps) {
      setToast("צריך למלא משקל וחזרות");
      return;
    }

    const record: SetRecord = {
      weight: parseInt(weight, 10),
      reps: parseInt(reps, 10),
      exerciseId: currentExercise.id,
      timestamp: Date.now(),
    };

    setLogs((prev) => [...prev, record]);
    setWeight("");
    setReps("");
    setToast("הסט נשמר");
    playToneBurst([820, 980], 0.1);
  };

  const openYoutubeHub = () =>
    window.open("https://www.youtube.com/", "_blank", "noopener,noreferrer");

  const openMusicHub = () => {
    const appWindow = window.open("spotify://", "_blank");
    window.setTimeout(() => {
      if (!appWindow || appWindow.closed) {
        window.open("https://open.spotify.com/", "_blank", "noopener,noreferrer");
      }
    }, 300);
  };

  if (screen === "splash") {
    return (
      <>
        <AnimatePresence>{flashTone && <TransitionFlash tone={flashTone} />}</AnimatePresence>
        <div className="fixed inset-0 bg-slate-950 flex flex-col items-center justify-center p-12 overflow-hidden text-center">
          <div className="absolute inset-0 opacity-10 blur-sm scale-110">
            <SafeImage
              src={REACHER_HERO}
              alt="hero"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
          </div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 space-y-12">
            <div className="flex flex-col items-center gap-4">
              <div className="px-7 py-6 bg-teal-500 rounded-[2.5rem] flex items-center justify-center shadow-[0_0_50px_rgba(20,184,166,0.5)]">
                <span className="text-slate-950 text-3xl font-black italic tracking-tight">
                  askAI
                </span>
              </div>
              <p className="text-teal-400 font-mono text-[10px] uppercase tracking-[0.6em] mt-4">
                <Cpu size={14} className="inline mr-2" /> PLATINUM ENGINE
              </p>
            </div>

            <h1 className="text-7xl md:text-[9rem] font-black italic uppercase text-white tracking-tighter leading-[0.85]">
              Betesh
              <br />
              <span className="text-teal-500">training</span>
            </h1>

            <p className="text-slate-500 font-bold uppercase tracking-[0.28em] text-sm">
              Training, nutrition, recovery, progression.
            </p>

            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <ApexButton
                size="lg"
                className="px-14 py-10 text-2xl gap-3"
                onClick={() => navigateWithFlash("main", "teal")}
              >
                <Dumbbell size={24} /> Workout Board
              </ApexButton>
              <ApexButton
                variant="outline"
                size="lg"
                className="px-14 py-10 text-2xl gap-3 border-teal-500/30 text-white"
                onClick={() => navigateWithFlash("nutrition", "indigo")}
              >
                <Flame size={24} /> Nutrition
              </ApexButton>
            </div>
          </motion.div>
        </div>
      </>
    );
  }

  if (screen === "nutrition") {
    return (
      <>
        <AnimatePresence>{flashTone && <TransitionFlash tone={flashTone} />}</AnimatePresence>
        <div className="min-h-screen bg-[#020617] text-white p-6 md:p-12" dir="rtl">
          <div className="max-w-7xl mx-auto space-y-10">
            <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div>
                <p className="text-teal-500 font-black text-[10px] uppercase tracking-[0.5em] mb-2">
                  Fuel system
                </p>
                <h2 className="text-6xl font-black italic uppercase tracking-tighter">
                  Betesh
                  <br />
                  Nutrition
                </h2>
                <p className="text-slate-400 mt-3 max-w-2xl">
                  מסך תזונה מלא עם המלצות חכמות, מקרו, התאוששות וגישה מהירה ל-askAI.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <ApexButton variant="outline" className="gap-2" onClick={() => navigateWithFlash("splash", "teal")}>
                  <Home size={18} /> מסך פתיחה
                </ApexButton>
                <ApexButton variant="outline" className="gap-2" onClick={openYoutubeHub}>
                  <Youtube size={18} /> YouTube
                </ApexButton>
                <ApexButton variant="outline" className="gap-2" onClick={openMusicHub}>
                  <Music size={18} /> Music
                </ApexButton>
                <ApexButton variant="premium" className="gap-2" onClick={() => navigateWithFlash("main", "indigo")}>
                  <ArrowRightLeft size={18} /> לעבור לאימונים
                </ApexButton>
              </div>
            </header>

            <div className="grid lg:grid-cols-3 gap-8">
              {NUTRITION_TRACKS.map((track) => (
                <ApexCard key={track.title} className="p-8 space-y-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-3xl font-black italic uppercase">{track.title}</h3>
                      <p className="text-slate-400 mt-2">{track.focus}</p>
                    </div>
                    <HeartPulse className="text-teal-400" />
                  </div>
                  <div className="space-y-3 text-slate-200 font-medium">
                    <div>קלוריות: {track.calories}</div>
                    <div>חלבון: {track.protein}</div>
                    <div>פחמימות: {track.carbs}</div>
                    <div>שומנים: {track.fats}</div>
                  </div>
                </ApexCard>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <AnimatePresence>{flashTone && <TransitionFlash tone={flashTone} />}</AnimatePresence>
      <AnimatePresence>{toast && <Toast message={toast} />}</AnimatePresence>
      <AnimatePresence>
        {askAIExercise && (
          <AskAIModal
            exercise={askAIExercise}
            logs={logs}
            onClose={() => setAskAIExercise(null)}
            onAdd={() => {
              addExerciseToSession(askAIExercise);
              setAskAIExercise(null);
            }}
          />
        )}
      </AnimatePresence>

      <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden" dir="rtl">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 right-0 h-[28rem] overflow-hidden opacity-20">
            <SafeImage src={REACHER_HERO} alt="hero" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-teal-500/10 via-transparent to-slate-950" />
          </div>
        </div>

        <header className="relative z-10 max-w-7xl mx-auto px-6 pt-10 pb-6">
          <div className="flex flex-col gap-8">
            <div className="flex flex-wrap justify-between items-center gap-4">
              <div>
                <p className="text-teal-400 font-black text-[10px] uppercase tracking-[0.55em] mb-3">
                  Betesh Training
                </p>
                <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter leading-none">
                  בית
                </h1>
                <p className="text-slate-400 mt-4 max-w-2xl">
                  מאגר תרגילים, סשן לייב, מדדי ביצוע ותזונה, הכל במקום אחד.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <ApexButton variant="outline" className="gap-2 rounded-2xl border-white/5 px-5" onClick={() => navigateWithFlash("splash", "teal")}>
                  <Home size={20} /> פתיחה
                </ApexButton>
                <ApexButton variant="outline" className="gap-2 rounded-2xl border-white/5 px-5" onClick={() => navigateWithFlash("nutrition", "indigo")}>
                  <Flame size={20} /> תזונה
                </ApexButton>
                <ApexButton variant="outline" className="gap-2 rounded-2xl border-white/5 px-5" onClick={openYoutubeHub}>
                  <Youtube size={20} /> YouTube
                </ApexButton>
                <ApexButton variant="outline" className="gap-2 rounded-2xl border-white/5 px-5" onClick={openMusicHub}>
                  <Music size={20} /> Music
                </ApexButton>
              </div>
            </div>
          </div>
        </header>

        <div className="relative z-10 max-w-7xl mx-auto px-6 pb-40">
          <div className="flex bg-slate-900/80 p-2 rounded-[2.5rem] w-full max-w-3xl mx-auto mb-12 border border-white/10 backdrop-blur-3xl shadow-2xl">
            {[
              { id: "dashboard", label: "בית", icon: Home },
              { id: "vault", label: "מאגר תרגילים", icon: LayoutGrid },
              { id: "stats", label: "הביצועים שלי", icon: BarChart3 },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id as MainTab)}
                className={`flex-1 flex items-center justify-center gap-3 py-5 rounded-[2rem] transition-all duration-500 ${
                  tab === t.id
                    ? "bg-white text-slate-950 shadow-2xl scale-[1.02]"
                    : "text-slate-400 hover:text-white"
                } font-black text-sm md:text-base tracking-wide`}
                style={{ fontFamily: "ui-rounded, system-ui, sans-serif" }}
              >
                <t.icon size={18} /> {t.label}
              </button>
            ))}
          </div>

          {tab === "dashboard" && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
              <ApexCard className="p-8">
                <div className="flex flex-col lg:flex-row justify-between gap-8">
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-teal-400 mb-3">
                      Daily split
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter">
                      בחר יום אימון
                    </h2>
                    <p className="text-slate-400 mt-4 max-w-2xl">
                      תרגילי הישבן נוספו למאגר תרגילים בלבד ולא נכנסו לימי האימון.
                    </p>
                  </div>
                  <div className="flex items-center">
                    <div className="px-5 py-4 rounded-[1.6rem] bg-white/5 border border-white/10 text-sm text-slate-300">
                      <span className="font-black text-white">{MASTER_VAULT.filter((ex) => ex.muscleGroup === "Glutes").length}</span> תרגילי ישבן במאגר
                    </div>
                  </div>
                </div>
              </ApexCard>

              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {DAY_SPLITS.map((day) => (
                  <ApexCard
                    key={day.id}
                    className={`p-6 cursor-pointer transition-all ${
                      selectedDay === day.id
                        ? "border-teal-500/40 bg-teal-500/10"
                        : "hover:border-white/15"
                    }`}
                    onClick={() => setSelectedDay(day.id)}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-3">
                        <div className="text-[10px] uppercase tracking-widest text-slate-500 font-black">
                          {day.label}
                        </div>
                        <h3 className="text-3xl font-black italic">{day.title}</h3>
                        <p className="text-slate-300">{day.subtitle}</p>
                      </div>
                      <CalendarDays className="text-teal-400" />
                    </div>
                  </ApexCard>
                ))}
              </div>

              <div className="grid xl:grid-cols-[1.15fr_0.85fr] gap-8">
                <ApexCard className="overflow-hidden">
                  <div className="relative h-72">
                    <SafeImage
                      src={muscleGroupImages[currentDayConfig.muscles[0]]}
                      alt={currentDayConfig.title}
                      className="w-full h-full object-cover opacity-30"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
                    <div className="absolute inset-0 p-8 flex flex-col justify-end">
                      <div className="text-[10px] uppercase tracking-widest text-teal-400 mb-3">
                        {currentDayConfig.label}
                      </div>
                      <h3 className="text-5xl font-black italic">{currentDayConfig.title}</h3>
                      <p className="text-slate-300 mt-3">{currentDayConfig.subtitle}</p>
                      <p className="text-slate-400 mt-4">{currentDayConfig.nutrition}</p>
                    </div>
                  </div>

                  <div className="p-8">
                    <div className="flex justify-between items-center mb-6">
                      <h4 className="text-2xl font-black italic">המלצות לתרגילים</h4>
                      <ApexButton
                        variant="outline"
                        className="gap-2"
                        onClick={() => {
                          if (dayRecommendations[0]) {
                            setAskAIExercise(dayRecommendations[0]);
                          }
                        }}
                      >
                        <Cpu size={18} /> askAI
                      </ApexButton>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      {dayRecommendations.map((ex) => (
                        <div key={ex.id} className="bg-black/30 border border-white/5 rounded-[1.8rem] p-4 flex items-center gap-4">
                          <SafeImage
                            src={getExerciseImage(ex)}
                            alt={ex.name}
                            className="w-20 h-20 rounded-2xl object-cover"
                            fallbackSrc={muscleGroupImages[ex.muscleGroup]}
                          />
                          <div className="flex-1">
                            <div className="font-black italic text-lg">{ex.name}</div>
                            <div className="text-sm text-slate-400">{muscleHebrew[ex.muscleGroup]}</div>
                            <div className="text-xs text-teal-300 mt-1">{ex.sets} סטים | {ex.reps}</div>
                          </div>
                          <ApexButton
                            variant="ghost"
                            size="icon"
                            onClick={() => addExerciseToSession(ex)}
                          >
                            <Plus size={18} />
                          </ApexButton>
                        </div>
                      ))}
                    </div>
                  </div>
                </ApexCard>

                <ApexCard className="p-8">
                  <div className="flex justify-between items-center mb-6">
                    <h4 className="text-2xl font-black italic">סשן לייב</h4>
                    <Dumbbell className="text-teal-400" />
                  </div>

                  {!inSession ? (
                    <div className="space-y-5">
                      {sessionList.length > 0 ? (
                        <>
                          <div className="text-slate-300">
                            {sessionList.length} תרגילים מחכים להתחלה
                          </div>
                          <div className="space-y-3">
                            {sessionList.map((ex, i) => (
                              <div
                                key={`${ex.id}-${i}`}
                                className="bg-black/40 p-5 rounded-3xl flex justify-between items-center border border-white/5"
                              >
                                <div className="flex items-center gap-4">
                                  <span className="text-slate-700 font-mono text-xs">
                                    0{i + 1}
                                  </span>
                                  <div>
                                    <span className="font-black italic uppercase text-lg block">
                                      {ex.name}
                                    </span>
                                    <span className="text-slate-500 text-xs">
                                      {getOverloadSuggestion(ex, logs)}
                                    </span>
                                  </div>
                                </div>
                                <button
                                  onClick={() =>
                                    setSessionList((prev) =>
                                      prev.filter((_, idx) => idx !== i)
                                    )
                                  }
                                  className="p-2 hover:bg-rose-500/10 rounded-xl transition-colors"
                                >
                                  <Trash2 size={18} className="text-rose-500" />
                                </button>
                              </div>
                            ))}
                          </div>

                          <ApexButton
                            variant="premium"
                            className="w-full h-20 text-xl italic uppercase font-black tracking-widest"
                            onClick={startProtocol}
                          >
                            Engage Apex Protocol
                          </ApexButton>
                        </>
                      ) : (
                        <div className="text-center py-14 bg-white/5 rounded-[3rem] border border-dashed border-white/10 space-y-4">
                          <Activity size={42} className="mx-auto text-slate-700" />
                          <p className="text-slate-400 font-bold">
                            תוסיף תרגילים מהמאגר או מההמלצות של היום
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="bg-black/30 border border-white/5 rounded-[2rem] p-6">
                        <div className="text-[10px] uppercase tracking-widest text-teal-400 mb-2">
                          Current
                        </div>
                        <div className="text-3xl font-black italic">
                          {currentExercise?.name}
                        </div>
                        <div className="text-slate-400 mt-2">
                          סט {curSet} מתוך {currentExercise?.sets}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <ApexCard className="p-6 text-center">
                          <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-2">
                            Phase
                          </div>
                          <div className="text-3xl font-black italic text-teal-400">
                            {phase === "work" ? "WORK" : "REST"}
                          </div>
                        </ApexCard>

                        <ApexCard className="p-6 text-center">
                          <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-2">
                            Timer
                          </div>
                          <div className="text-3xl font-black italic text-amber-400">
                            {timer}s
                          </div>
                        </ApexCard>
                      </div>

                      <ApexCard className="p-6">
                        <div className="text-[10px] uppercase tracking-widest text-teal-400 mb-3">
                          AI tip
                        </div>
                        <div className="text-slate-200 leading-relaxed">{tip}</div>
                      </ApexCard>

                      <div className="grid grid-cols-2 gap-4">
                        <input
                          value={weight}
                          onChange={(e) => setWeight(e.target.value)}
                          placeholder="משקל"
                          className="h-14 bg-slate-900/60 border border-white/5 rounded-[1.2rem] px-4 outline-none focus:border-teal-500"
                        />
                        <input
                          value={reps}
                          onChange={(e) => setReps(e.target.value)}
                          placeholder="חזרות"
                          className="h-14 bg-slate-900/60 border border-white/5 rounded-[1.2rem] px-4 outline-none focus:border-teal-500"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <ApexButton variant="premium" className="gap-2" onClick={logCurrentSet}>
                          <Plus size={18} /> שמור סט
                        </ApexButton>
                        <ApexButton
                          variant="outline"
                          className="gap-2"
                          onClick={() => setIsRunning((prev) => !prev)}
                        >
                          {isRunning ? <Pause size={18} /> : <Play size={18} />}
                          {isRunning ? "עצור" : "המשך"}
                        </ApexButton>
                        <ApexButton variant="outline" className="gap-2" onClick={handlePhaseTransition}>
                          <SkipForward size={18} /> הבא
                        </ApexButton>
                        <ApexButton
                          variant="outline"
                          className="gap-2"
                          onClick={() => {
                            setPhase("work");
                            setTimer(currentExercise?.work || 0);
                          }}
                        >
                          <RotateCcw size={18} /> איפוס
                        </ApexButton>
                        <ApexButton
                          variant="outline"
                          className="gap-2 col-span-2"
                          onClick={() => {
                            setInSession(false);
                            setIsRunning(false);
                            setTimer(0);
                          }}
                        >
                          <SkipBack size={18} /> חזור למסך הקודם
                        </ApexButton>
                      </div>
                    </div>
                  )}
                </ApexCard>
              </div>

              <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
                <ApexCard className="p-8">
                  <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-3">
                    Exercises loaded
                  </div>
                  <div className="text-4xl font-black italic">{sessionList.length}</div>
                </ApexCard>
                <ApexCard className="p-8">
                  <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-3">
                    Session volume
                  </div>
                  <div className="text-4xl font-black italic text-teal-400">{sessionVolume}</div>
                </ApexCard>
                <ApexCard className="p-8">
                  <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-3">
                    Estimated kcal
                  </div>
                  <div className="text-4xl font-black italic text-amber-400">
                    {estimateCalories(sessionVolume)}
                  </div>
                </ApexCard>
                <ApexCard className="p-8">
                  <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-3">
                    Recovery
                  </div>
                  <div className="text-4xl font-black italic text-indigo-400">
                    {recoveryScore}
                  </div>
                </ApexCard>
              </div>
            </motion.div>
          )}

          {tab === "vault" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
              <div className="grid md:grid-cols-[1fr_auto] gap-4">
                <div className="relative">
                  <Search className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    placeholder="חפש תרגיל, שריר, תיאור."
                    className="w-full h-16 bg-slate-900/60 border border-white/5 rounded-[1.6rem] pr-14 pl-5 outline-none focus:border-teal-500"
                  />
                </div>
                <ApexButton
                  variant="outline"
                  className="gap-2"
                  onClick={() => {
                    setVaultFilter("All");
                    setSearchText("");
                  }}
                >
                  <RefreshCcw size={16} /> איפוס חיפוש
                </ApexButton>
              </div>

              <div className="flex overflow-x-auto gap-3 pb-4">
                {(["All"] as const)
                  .concat(Object.keys(muscleHebrew) as MuscleGroup[])
                  .map((m) => (
                    <button
                      key={m}
                      onClick={() => setVaultFilter(m as MuscleGroup | "All")}
                      className={`px-10 py-5 rounded-[1.5rem] whitespace-nowrap font-black text-[10px] uppercase tracking-widest transition-all duration-500 ${
                        vaultFilter === m
                          ? "bg-teal-500 text-slate-950 shadow-2xl scale-105"
                          : "bg-slate-900 text-slate-500 border border-white/5"
                      }`}
                    >
                      {m === "All" ? "הכל" : muscleHebrew[m as MuscleGroup]}
                    </button>
                  ))}
              </div>

              <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
                {filteredVault.map((ex, idx) => {
                  const favorite = favorites.includes(ex.id);
                  const notes = getExerciseAiNotes(ex, logs);

                  return (
                    <ApexCard key={ex.id} className="group flex flex-col h-full hover:border-teal-500/30">
                      <div className="h-64 relative overflow-hidden bg-black/40">
                        <SafeImage
                          src={getExerciseImage(ex)}
                          alt={ex.name}
                          className="w-full h-full object-cover opacity-50 group-hover:scale-110 transition-all duration-1000"
                          fallbackSrc={muscleGroupImages[ex.muscleGroup]}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                        <div className="absolute top-6 right-6 flex gap-3 items-center">
                          <div className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border bg-white/5 text-white/50 border-white/5">
                            #{idx + 1}
                          </div>
                          <div className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border bg-teal-500/10 text-teal-400 border-teal-500/20">
                            {ex.difficulty}
                          </div>
                          <button
                            onClick={() => toggleFavorite(ex.id)}
                            className={`w-11 h-11 rounded-2xl border flex items-center justify-center ${
                              favorite
                                ? "bg-rose-500/15 border-rose-500/30 text-rose-400"
                                : "bg-black/40 border-white/10 text-white/60"
                            }`}
                          >
                            <HeartPulse size={18} />
                          </button>
                        </div>
                      </div>

                      <div className="p-6 flex flex-col space-y-5">
                        <div className="flex justify-between items-start gap-4">
                          <h4 className="text-4xl font-black italic uppercase tracking-tighter leading-none text-white">
                            {ex.name}
                          </h4>
                          <div className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border bg-white/5 text-white/50 border-white/5">
                            {categoryHebrew[ex.category]}
                          </div>
                        </div>

                        <p className="text-slate-400 text-sm font-medium leading-relaxed">
                          {ex.he}
                        </p>

                        <ApexCard className="p-4 bg-white/5 border-white/5">
                          <div className="space-y-2 text-sm text-slate-200">
                            {notes.slice(0, 2).map((note, noteIdx) => (
                              <div key={noteIdx}>- {note}</div>
                            ))}
                          </div>
                        </ApexCard>

                        <div className="flex justify-between items-center pt-4 border-t border-white/5">
                          <div className="flex gap-8">
                            <div className="text-center">
                              <p className="text-[8px] uppercase font-black text-slate-600 mb-2">
                                SETS
                              </p>
                              <p className="text-2xl font-black italic">{ex.sets}</p>
                            </div>
                            <div className="text-center">
                              <p className="text-[8px] uppercase font-black text-slate-600 mb-2">
                                REPS
                              </p>
                              <p className="text-2xl font-black italic">{ex.reps}</p>
                            </div>
                          </div>
                          <div className="text-left">
                            <div className="text-[8px] uppercase font-black text-slate-600 mb-2">
                              Muscle
                            </div>
                            <div className="text-sm text-teal-300 max-w-[180px] leading-relaxed">
                              {muscleHebrew[ex.muscleGroup]}
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                          <ApexButton
                            variant="premium"
                            className="gap-2"
                            onClick={() => addExerciseToSession(ex)}
                          >
                            <Plus size={16} /> הוסף
                          </ApexButton>
                          <ApexButton
                            variant="outline"
                            className="gap-2"
                            onClick={() => setAskAIExercise(ex)}
                          >
                            <Cpu size={16} /> askAI
                          </ApexButton>
                          <ApexButton
                            variant="outline"
                            className="gap-2"
                            onClick={() =>
                              window.open(ex.videoUrl, "_blank", "noopener,noreferrer")
                            }
                          >
                            <Youtube size={16} /> וידאו
                          </ApexButton>
                        </div>
                      </div>
                    </ApexCard>
                  );
                })}
              </div>
            </motion.div>
          )}

          {tab === "stats" && (
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-12">
              <header className="text-center space-y-4">
                <h2 className="text-6xl md:text-7xl font-black italic uppercase tracking-tighter">
                  PERFORMANCE AI
                </h2>
                <p className="text-slate-600 font-bold uppercase tracking-[0.6em] text-xs">
                  Adaptive coaching and progression signals
                </p>
              </header>

              <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
                <ApexCard className="p-8">
                  <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-3">
                    AI readiness
                  </div>
                  <div className="text-4xl font-black italic text-teal-400">
                    {Math.max(72, Math.min(97, recoveryScore + (sessionList.length ? 3 : 0)))}
                  </div>
                  <div className="text-sm text-slate-400 mt-3">
                    מבוסס על התאוששות, פעילות אחרונה ונפח.
                  </div>
                </ApexCard>

                <ApexCard className="p-8">
                  <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-3">
                    Momentum
                  </div>
                  <div className="text-4xl font-black italic text-amber-400">
                    {history.length >= 3 ? "Rising" : "Building"}
                  </div>
                  <div className="text-sm text-slate-400 mt-3">
                    מדד מגמה לפי היסטוריית אימונים.
                  </div>
                </ApexCard>

                <ApexCard className="p-8">
                  <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-3">
                    Recovery mode
                  </div>
                  <div className="text-4xl font-black italic text-indigo-400">
                    {recoveryScore >= 85 ? "Push" : recoveryScore >= 76 ? "Normal" : "Deload"}
                  </div>
                  <div className="text-sm text-slate-400 mt-3">
                    המלצה כללית לעומס היומי.
                  </div>
                </ApexCard>

                <ApexCard className="p-8">
                  <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-3">
                    Total sessions
                  </div>
                  <div className="text-4xl font-black italic text-rose-400">{history.length}</div>
                  <div className="text-sm text-slate-400 mt-3">
                    מספר אימונים שתועדו במערכת.
                  </div>
                </ApexCard>
              </div>

              <div className="space-y-4">
                {history.length > 0 ? (
                  history.map((h) => (
                    <ApexCard
                      key={h.id}
                      className="p-8 flex justify-between items-center bg-slate-900/20 border-white/5 hover:border-teal-500/20 transition-all"
                    >
                      <div className="space-y-1">
                        <h5 className="font-black italic uppercase text-xl text-white">
                          Apex Custom Session
                        </h5>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                          {h.date} | {h.exercises} תרגילים
                        </p>
                      </div>

                      <div className="text-center">
                        <p className="text-[9px] font-black text-slate-600 uppercase mb-1">
                          Vol
                        </p>
                        <p className="text-3xl font-black italic text-teal-400">
                          {h.volume}kg
                        </p>
                      </div>

                      <ChevronRight size={24} className="text-slate-800" />
                    </ApexCard>
                  ))
                ) : (
                  <div className="text-center py-24 bg-white/5 rounded-[3rem] border border-dashed border-white/10 space-y-4">
                    <History size={48} className="mx-auto text-slate-800" />
                    <p className="text-slate-600 font-bold uppercase tracking-widest">
                      No session logs found yet.
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>

        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[200] w-full max-w-lg px-8">
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            className="bg-[#0f172a]/90 backdrop-blur-3xl border border-white/10 p-5 rounded-[3rem] flex justify-around items-center shadow-[0_40px_100px_rgba(0,0,0,0.9)]"
          >
            {[
              { id: "dashboard", icon: Home },
              { id: "vault", icon: LayoutGrid },
              { id: "stats", icon: BarChart3 },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setTab(item.id as MainTab)}
                className={`p-5 rounded-[1.5rem] transition-all duration-500 relative group ${
                  tab === item.id
                    ? "bg-teal-500 text-slate-950 shadow-[0_0_30px_rgba(20,184,166,0.5)] scale-110"
                    : "text-slate-600 hover:text-white"
                }`}
              >
                <item.icon size={28} />
                {tab === item.id && (
                  <motion.div
                    layoutId="nav-glow"
                    className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-teal-400 rounded-full"
                  />
                )}
              </button>
            ))}
          </motion.div>
        </div>
      </div>
    </>
  );
}

const rootElement = document.getElementById("root");
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(<ReacherApp />);
}
