
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  BarChart3,
  Bot,
  CalendarDays,
  CheckCircle2,
  Cpu,
  Dumbbell,
  Flame,
  HeartPulse,
  Home,
  LayoutGrid,
  Pause,
  Play,
  Plus,
  RefreshCcw,
  Search,
  Sparkles,
  Target,
  Trash2,
  User,
  Weight,
  X,
  Youtube,
} from "lucide-react";
const REACHER_HERO = "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1600";
const DEFAULT_EXERCISE_IMAGE = "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1200";
const ANATOMY_IMAGE = "data:image/svg+xml;utf8,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%201200%20900'%3E%0A%20%20%3Cdefs%3E%0A%20%20%20%20%3ClinearGradient%20id='bg'%20x1='0'%20y1='0'%20x2='0'%20y2='1'%3E%0A%20%20%20%20%20%20%3Cstop%20offset='0%25'%20stop-color='#0b1227'/%3E%0A%20%20%20%20%20%20%3Cstop%20offset='100%25'%20stop-color='#091021'/%3E%0A%20%20%20%20%3C/linearGradient%3E%0A%20%20%20%20%3ClinearGradient%20id='skin'%20x1='0'%20y1='0'%20x2='0'%20y2='1'%3E%0A%20%20%20%20%20%20%3Cstop%20offset='0%25'%20stop-color='#ead2bf'/%3E%0A%20%20%20%20%20%20%3Cstop%20offset='100%25'%20stop-color='#c9ac95'/%3E%0A%20%20%20%20%3C/linearGradient%3E%0A%20%20%20%20%3ClinearGradient%20id='muscle'%20x1='0'%20y1='0'%20x2='1'%20y2='1'%3E%0A%20%20%20%20%20%20%3Cstop%20offset='0%25'%20stop-color='#33e3a4'/%3E%0A%20%20%20%20%20%20%3Cstop%20offset='100%25'%20stop-color='#0fbf78'/%3E%0A%20%20%20%20%3C/linearGradient%3E%0A%20%20%20%20%3Cfilter%20id='glow'%20x='-30%25'%20y='-30%25'%20width='160%25'%20height='160%25'%3E%0A%20%20%20%20%20%20%3CfeGaussianBlur%20stdDeviation='8'%20result='b'/%3E%0A%20%20%20%20%20%20%3CfeMerge%3E%3CfeMergeNode%20in='b'/%3E%3CfeMergeNode%20in='SourceGraphic'/%3E%3C/feMerge%3E%0A%20%20%20%20%3C/filter%3E%0A%20%20%20%20%3Cg%20id='front'%3E%0A%20%20%20%20%20%20%3Ccircle%20cx='0'%20cy='-185'%20r='46'%20fill='url(#skin)'/%3E%0A%20%20%20%20%20%20%3Crect%20x='-23'%20y='-142'%20width='46'%20height='36'%20rx='16'%20fill='url(#skin)'/%3E%0A%20%20%20%20%20%20%3Cpath%20d='M-68%20-102%20C-40%20-118%2040%20-118%2068%20-102%20C82%20-74%2088%20-40%2084%20-8%20C80%2028%2064%2058%2036%2076%20L24%20288%20L-24%20288%20L-36%2076%20C-64%2058%20-80%2028%20-84%20-8%20C-88%20-40%20-82%20-74%20-68%20-102Z'%20fill='url(#skin)'/%3E%0A%20%20%20%20%20%20%3Cpath%20d='M-68%20-92%20C-82%20-44%20-102%206%20-120%2072%20L-92%2088%20L-72%2020%20L-62%20-28%20Z'%20fill='url(#skin)'/%3E%0A%20%20%20%20%20%20%3Cpath%20d='M68%20-92%20C82%20-44%20102%206%20120%2072%20L92%2088%20L72%2020%20L62%20-28%20Z'%20fill='url(#skin)'/%3E%0A%20%20%20%20%20%20%3Cpath%20d='M-58%2024%20L-76%20172%20L-48%20172%20L-32%2042%20Z'%20fill='url(#skin)'/%3E%0A%20%20%20%20%20%20%3Cpath%20d='M58%2024%20L76%20172%20L48%20172%20L32%2042%20Z'%20fill='url(#skin)'/%3E%0A%20%20%20%20%20%20%3Cpath%20d='M-26%20288%20L-40%20502%20L-10%20502%20L6%20288%20Z'%20fill='url(#skin)'/%3E%0A%20%20%20%20%20%20%3Cpath%20d='M26%20288%20L10%20502%20L40%20502%20L56%20288%20Z'%20fill='url(#skin)'/%3E%0A%20%20%20%20%20%20%3Cpath%20d='M-34%20502%20L-52%20552%20L-20%20552%20L-8%20508%20Z'%20fill='url(#skin)'/%3E%0A%20%20%20%20%20%20%3Cpath%20d='M34%20502%20L20%20552%20L52%20552%20L8%20508%20Z'%20fill='url(#skin)'/%3E%0A%20%20%20%20%20%20%3Cpath%20d='M-64%20-80%20C-36%20-94%2036%20-94%2064%20-80'%20fill='none'%20stroke='url(#muscle)'%20stroke-width='6'%20opacity='0.55'/%3E%0A%20%20%20%20%20%20%3Cpath%20d='M-52%20-6%20C-48%2026%20-28%2044%20-5%2050%20L-5%20132'%20fill='none'%20stroke='#7fb0a1'%20stroke-width='4'%20opacity='0.45'/%3E%0A%20%20%20%20%20%20%3Cpath%20d='M52%20-6%20C48%2026%2028%2044%205%2050%20L5%20132'%20fill='none'%20stroke='#7fb0a1'%20stroke-width='4'%20opacity='0.45'/%3E%0A%20%20%20%20%20%20%3Cpath%20d='M-24%20140%20C-4%20122%204%20122%2024%20140'%20fill='none'%20stroke='url(#muscle)'%20stroke-width='6'%20opacity='0.45'/%3E%0A%20%20%20%20%20%20%3Ccircle%20cx='0'%20cy='-64'%20r='12'%20fill='url(#muscle)'%20filter='url(#glow)'/%3E%0A%20%20%20%20%20%20%3Ccircle%20cx='-66'%20cy='4'%20r='12'%20fill='url(#muscle)'%20filter='url(#glow)'/%3E%0A%20%20%20%20%20%20%3Ccircle%20cx='66'%20cy='4'%20r='12'%20fill='url(#muscle)'%20filter='url(#glow)'/%3E%0A%20%20%20%20%20%20%3Ccircle%20cx='0'%20cy='48'%20r='12'%20fill='url(#muscle)'%20filter='url(#glow)'/%3E%0A%20%20%20%20%20%20%3Ccircle%20cx='0'%20cy='96'%20r='12'%20fill='url(#muscle)'%20filter='url(#glow)'/%3E%0A%20%20%20%20%20%20%3Ccircle%20cx='0'%20cy='160'%20r='12'%20fill='url(#muscle)'%20filter='url(#glow)'/%3E%0A%20%20%20%20%20%20%3Ccircle%20cx='-12'%20cy='356'%20r='13'%20fill='url(#muscle)'%20filter='url(#glow)'/%3E%0A%20%20%20%20%20%20%3Ccircle%20cx='12'%20cy='356'%20r='13'%20fill='url(#muscle)'%20filter='url(#glow)'/%3E%0A%20%20%20%20%3C/g%3E%0A%20%20%20%20%3Cg%20id='back'%3E%0A%20%20%20%20%20%20%3Ccircle%20cx='0'%20cy='-185'%20r='46'%20fill='url(#skin)'/%3E%0A%20%20%20%20%20%20%3Crect%20x='-23'%20y='-142'%20width='46'%20height='36'%20rx='16'%20fill='url(#skin)'/%3E%0A%20%20%20%20%20%20%3Cpath%20d='M-68%20-102%20C-40%20-118%2040%20-118%2068%20-102%20C82%20-74%2088%20-40%2084%20-8%20C80%2028%2064%2058%2036%2076%20L24%20288%20L-24%20288%20L-36%2076%20C-64%2058%20-80%2028%20-84%20-8%20C-88%20-40%20-82%20-74%20-68%20-102Z'%20fill='url(#skin)'/%3E%0A%20%20%20%20%20%20%3Cpath%20d='M-68%20-92%20C-82%20-44%20-102%206%20-120%2072%20L-92%2088%20L-72%2020%20L-62%20-28%20Z'%20fill='url(#skin)'/%3E%0A%20%20%20%20%20%20%3Cpath%20d='M68%20-92%20C82%20-44%20102%206%20120%2072%20L92%2088%20L72%2020%20L62%20-28%20Z'%20fill='url(#skin)'/%3E%0A%20%20%20%20%20%20%3Cpath%20d='M-58%2024%20L-76%20172%20L-48%20172%20L-32%2042%20Z'%20fill='url(#skin)'/%3E%0A%20%20%20%20%20%20%3Cpath%20d='M58%2024%20L76%20172%20L48%20172%20L32%2042%20Z'%20fill='url(#skin)'/%3E%0A%20%20%20%20%20%20%3Cpath%20d='M-26%20288%20L-40%20502%20L-10%20502%20L6%20288%20Z'%20fill='url(#skin)'/%3E%0A%20%20%20%20%20%20%3Cpath%20d='M26%20288%20L10%20502%20L40%20502%20L56%20288%20Z'%20fill='url(#skin)'/%3E%0A%20%20%20%20%20%20%3Cpath%20d='M-34%20502%20L-52%20552%20L-20%20552%20L-8%20508%20Z'%20fill='url(#skin)'/%3E%0A%20%20%20%20%20%20%3Cpath%20d='M34%20502%20L20%20552%20L52%20552%20L8%20508%20Z'%20fill='url(#skin)'/%3E%0A%20%20%20%20%20%20%3Cpath%20d='M-66%20-82%20C-34%20-96%2034%20-96%2066%20-82'%20fill='none'%20stroke='url(#muscle)'%20stroke-width='6'%20opacity='0.55'/%3E%0A%20%20%20%20%20%20%3Cpath%20d='M-64%20-20%20C-58%2038%20-20%2066%200%2084%20C20%2066%2058%2038%2064%20-20'%20fill='none'%20stroke='#7fb0a1'%20stroke-width='4'%20opacity='0.45'/%3E%0A%20%20%20%20%20%20%3Cpath%20d='M-24%20140%20C-4%20122%204%20122%2024%20140'%20fill='none'%20stroke='url(#muscle)'%20stroke-width='6'%20opacity='0.45'/%3E%0A%20%20%20%20%20%20%3Ccircle%20cx='0'%20cy='-64'%20r='12'%20fill='url(#muscle)'%20filter='url(#glow)'/%3E%0A%20%20%20%20%20%20%3Ccircle%20cx='-66'%20cy='4'%20r='12'%20fill='url(#muscle)'%20filter='url(#glow)'/%3E%0A%20%20%20%20%20%20%3Ccircle%20cx='66'%20cy='4'%20r='12'%20fill='url(#muscle)'%20filter='url(#glow)'/%3E%0A%20%20%20%20%20%20%3Ccircle%20cx='0'%20cy='52'%20r='12'%20fill='url(#muscle)'%20filter='url(#glow)'/%3E%0A%20%20%20%20%20%20%3Ccircle%20cx='0'%20cy='154'%20r='12'%20fill='url(#muscle)'%20filter='url(#glow)'/%3E%0A%20%20%20%20%20%20%3Ccircle%20cx='-12'%20cy='356'%20r='13'%20fill='url(#muscle)'%20filter='url(#glow)'/%3E%0A%20%20%20%20%20%20%3Ccircle%20cx='12'%20cy='356'%20r='13'%20fill='url(#muscle)'%20filter='url(#glow)'/%3E%0A%20%20%20%20%3C/g%3E%0A%20%20%3C/defs%3E%0A%20%20%3Crect%20width='1200'%20height='900'%20fill='url(#bg)'/%3E%0A%20%20%3Crect%20x='150'%20y='70'%20width='900'%20height='730'%20rx='32'%20fill='#0b1327'%20opacity='0.88'/%3E%0A%20%20%3Cg%20transform='translate(430%20390)'%3E%3Cuse%20href='#front'/%3E%3C/g%3E%0A%20%20%3Cg%20transform='translate(770%20390)'%3E%3Cuse%20href='#back'/%3E%3C/g%3E%0A%3C/svg%3E";

type MuscleGroup = "Back" | "Chest" | "Legs" | "Glutes" | "Shoulders" | "Arms" | "Core" | "FullBody";
type Category = "pull" | "push" | "legs" | "armor" | "power" | "core" | "isolation";
type EquipmentSector = "Gym" | "Home" | "TRX";
type DayKey = "sun" | "mon" | "tue" | "wed" | "thu" | "fri";
type MainTab = "dashboard" | "vault" | "stats" | "nutrition" | "cardio";

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
  sector: EquipmentSector;
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

interface NutritionProfile {
  age: number;
  weight: number;
  height: number;
  goal: "maintain" | "gain" | "cut";
  activity: "light" | "moderate" | "high";
}


interface CardioProfilePlan {
  zone2Minutes: number;
  hiitMinutes: number;
  walkingSteps: number;
  recommendedSessions: string;
  weeklyFocus: string;
  paceTip: string;
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

const DAY_SPLITS = [
  { id: "sun", label: "יום א", title: "Pull Power", subtitle: "גב + יד קדמית + ליבה", muscles: ["Back", "Arms", "Core"], nutrition: "יותר פחמימה לפני אימון, חלבון מלא אחרי האימון." },
  { id: "mon", label: "יום ב", title: "Push Builder", subtitle: "חזה + כתפיים + טרייספס", muscles: ["Chest", "Shoulders", "Arms"], nutrition: "דגש על חלבון, נוזלים וארוחה מסודרת 60-90 דקות לפני." },
  { id: "tue", label: "יום ג", title: "Legs Heavy", subtitle: "רגליים + ליבה", muscles: ["Legs", "Core"], nutrition: "פחמימות מורכבות, מלח ונוזלים כדי לשמור ביצועים." },
  { id: "wed", label: "יום ד", title: "Recovery Pump", subtitle: "עומס נמוך, נפח נשלט", muscles: ["Shoulders", "Arms", "Core"], nutrition: "יותר ירקות, חלבון קבוע ושינה טובה." },
  { id: "thu", label: "יום ה", title: "Upper Mix", subtitle: "פלג גוף עליון משולב", muscles: ["Back", "Chest", "Shoulders"], nutrition: "שמור על חלבון גבוה וחטיף קל לפני הסשן." },
  { id: "fri", label: "יום ו", title: "Full Body", subtitle: "כוח, קצב, מטבוליזם", muscles: ["FullBody", "Legs", "Core"], nutrition: "שילוב פחמימה מהירה אחרי אימון וחלבון מלא." },
] as const;

const EXERCISES: Exercise[] = [
  { id: "gym_1", name: "Meadows Row", sets: 4, reps: "10-12", he: "Meadows Row - תרגיל לחדר כושר עם דגש על גב.", work: 40, rest: 75, category: "pull", muscleGroup: "Back", videoUrl: "https://www.youtube.com/results?search_query=Meadows+Row", imageUrl: muscleGroupImages.Back, difficulty: "Advanced", sector: "Gym" },
  { id: "gym_2", name: "Weighted Pull-Ups", sets: 4, reps: "10-12", he: "Weighted Pull-Ups - תרגיל לחדר כושר עם דגש על גב.", work: 40, rest: 75, category: "pull", muscleGroup: "Back", videoUrl: "https://www.youtube.com/results?search_query=Weighted+Pull-Ups", imageUrl: muscleGroupImages.Back, difficulty: "Elite", sector: "Gym" },
  { id: "gym_3", name: "Low-Incline DB Press", sets: 4, reps: "10-12", he: "Low-Incline DB Press - תרגיל לחדר כושר עם דגש על חזה.", work: 40, rest: 75, category: "push", muscleGroup: "Chest", videoUrl: "https://www.youtube.com/results?search_query=Low-Incline+DB+Press", imageUrl: muscleGroupImages.Chest, difficulty: "Advanced", sector: "Gym" },
  { id: "gym_4", name: "Cable Flyes", sets: 3, reps: "12-15", he: "Cable Flyes - תרגיל לחדר כושר עם דגש על חזה.", work: 30, rest: 45, category: "isolation", muscleGroup: "Chest", videoUrl: "https://www.youtube.com/results?search_query=Cable+Flyes", imageUrl: muscleGroupImages.Chest, difficulty: "Standard", sector: "Gym" },
  { id: "gym_5", name: "Zercher Squat", sets: 4, reps: "10-12", he: "Zercher Squat - תרגיל לחדר כושר עם דגש על רגליים.", work: 40, rest: 75, category: "legs", muscleGroup: "Legs", videoUrl: "https://www.youtube.com/results?search_query=Zercher+Squat", imageUrl: muscleGroupImages.Legs, difficulty: "Elite", sector: "Gym" },
  { id: "gym_6", name: "Romanian Deadlift", sets: 4, reps: "10-12", he: "Romanian Deadlift - תרגיל לחדר כושר עם דגש על רגליים.", work: 40, rest: 75, category: "legs", muscleGroup: "Legs", videoUrl: "https://www.youtube.com/results?search_query=Romanian+Deadlift", imageUrl: muscleGroupImages.Legs, difficulty: "Advanced", sector: "Gym" },
  { id: "gym_7", name: "Barbell Hip Thrust", sets: 4, reps: "10-12", he: "Barbell Hip Thrust - תרגיל לחדר כושר עם דגש על ישבן.", work: 40, rest: 75, category: "legs", muscleGroup: "Glutes", videoUrl: "https://www.youtube.com/results?search_query=Barbell+Hip+Thrust", imageUrl: muscleGroupImages.Glutes, difficulty: "Advanced", sector: "Gym" },
  { id: "gym_8", name: "Cable Glute Kickback", sets: 3, reps: "12-15", he: "Cable Glute Kickback - תרגיל לחדר כושר עם דגש על ישבן.", work: 30, rest: 45, category: "isolation", muscleGroup: "Glutes", videoUrl: "https://www.youtube.com/results?search_query=Cable+Glute+Kickback", imageUrl: muscleGroupImages.Glutes, difficulty: "Standard", sector: "Gym" },
  { id: "gym_9", name: "Military Press", sets: 4, reps: "10-12", he: "Military Press - תרגיל לחדר כושר עם דגש על כתפיים.", work: 40, rest: 75, category: "armor", muscleGroup: "Shoulders", videoUrl: "https://www.youtube.com/results?search_query=Military+Press", imageUrl: muscleGroupImages.Shoulders, difficulty: "Advanced", sector: "Gym" },
  { id: "gym_10", name: "Face Pulls", sets: 4, reps: "10-12", he: "Face Pulls - תרגיל לחדר כושר עם דגש על כתפיים.", work: 40, rest: 75, category: "armor", muscleGroup: "Shoulders", videoUrl: "https://www.youtube.com/results?search_query=Face+Pulls", imageUrl: muscleGroupImages.Shoulders, difficulty: "Standard", sector: "Gym" },
  { id: "gym_11", name: "Bayesian Cable Curl", sets: 3, reps: "12-15", he: "Bayesian Cable Curl - תרגיל לחדר כושר עם דגש על ידיים.", work: 30, rest: 45, category: "isolation", muscleGroup: "Arms", videoUrl: "https://www.youtube.com/results?search_query=Bayesian+Cable+Curl", imageUrl: muscleGroupImages.Arms, difficulty: "Advanced", sector: "Gym" },
  { id: "gym_12", name: "Skull Crusher", sets: 3, reps: "12-15", he: "Skull Crusher - תרגיל לחדר כושר עם דגש על ידיים.", work: 30, rest: 45, category: "isolation", muscleGroup: "Arms", videoUrl: "https://www.youtube.com/results?search_query=Skull+Crusher", imageUrl: muscleGroupImages.Arms, difficulty: "Advanced", sector: "Gym" },
  { id: "gym_13", name: "Dragon Flag", sets: 4, reps: "10-12", he: "Dragon Flag - תרגיל לחדר כושר עם דגש על ליבה.", work: 30, rest: 45, category: "core", muscleGroup: "Core", videoUrl: "https://www.youtube.com/results?search_query=Dragon+Flag", imageUrl: muscleGroupImages.Core, difficulty: "Elite", sector: "Gym" },
  { id: "gym_14", name: "Cable Crunches", sets: 4, reps: "10-12", he: "Cable Crunches - תרגיל לחדר כושר עם דגש על ליבה.", work: 30, rest: 45, category: "core", muscleGroup: "Core", videoUrl: "https://www.youtube.com/results?search_query=Cable+Crunches", imageUrl: muscleGroupImages.Core, difficulty: "Standard", sector: "Gym" },
  { id: "gym_15", name: "Kettlebell Swing", sets: 4, reps: "12-16", he: "Kettlebell Swing - תרגיל לחדר כושר עם דגש על כל הגוף.", work: 35, rest: 60, category: "power", muscleGroup: "FullBody", videoUrl: "https://www.youtube.com/results?search_query=Kettlebell+Swing", imageUrl: muscleGroupImages.FullBody, difficulty: "Standard", sector: "Gym" },
  { id: "gym_16", name: "Farmer's Walk", sets: 4, reps: "40m", he: "Farmer's Walk - תרגיל לחדר כושר עם דגש על כל הגוף.", work: 35, rest: 60, category: "power", muscleGroup: "FullBody", videoUrl: "https://www.youtube.com/results?search_query=Farmer's+Walk", imageUrl: muscleGroupImages.FullBody, difficulty: "Elite", sector: "Gym" },
  { id: "home_1", name: "Push-Up", sets: 4, reps: "10-12", he: "Push-Up - תרגיל לבית עם דגש על חזה.", work: 40, rest: 75, category: "push", muscleGroup: "Chest", videoUrl: "https://www.youtube.com/results?search_query=Push-Up", imageUrl: muscleGroupImages.Chest, difficulty: "Standard", sector: "Home" },
  { id: "home_2", name: "Decline Push-Up", sets: 4, reps: "10-12", he: "Decline Push-Up - תרגיל לבית עם דגש על חזה.", work: 40, rest: 75, category: "push", muscleGroup: "Chest", videoUrl: "https://www.youtube.com/results?search_query=Decline+Push-Up", imageUrl: muscleGroupImages.Chest, difficulty: "Advanced", sector: "Home" },
  { id: "home_3", name: "Wide Push-Up", sets: 4, reps: "10-12", he: "Wide Push-Up - תרגיל לבית עם דגש על חזה.", work: 40, rest: 75, category: "push", muscleGroup: "Chest", videoUrl: "https://www.youtube.com/results?search_query=Wide+Push-Up", imageUrl: muscleGroupImages.Chest, difficulty: "Standard", sector: "Home" },
  { id: "home_4", name: "Pike Push-Up", sets: 4, reps: "10-12", he: "Pike Push-Up - תרגיל לבית עם דגש על כתפיים.", work: 40, rest: 75, category: "armor", muscleGroup: "Shoulders", videoUrl: "https://www.youtube.com/results?search_query=Pike+Push-Up", imageUrl: muscleGroupImages.Shoulders, difficulty: "Advanced", sector: "Home" },
  { id: "home_5", name: "Chair Dip", sets: 4, reps: "10-12", he: "Chair Dip - תרגיל לבית עם דגש על ידיים.", work: 40, rest: 75, category: "push", muscleGroup: "Arms", videoUrl: "https://www.youtube.com/results?search_query=Chair+Dip", imageUrl: muscleGroupImages.Arms, difficulty: "Standard", sector: "Home" },
  { id: "home_6", name: "Diamond Push-Up", sets: 4, reps: "10-12", he: "Diamond Push-Up - תרגיל לבית עם דגש על ידיים.", work: 40, rest: 75, category: "push", muscleGroup: "Arms", videoUrl: "https://www.youtube.com/results?search_query=Diamond+Push-Up", imageUrl: muscleGroupImages.Arms, difficulty: "Advanced", sector: "Home" },
  { id: "home_7", name: "Table Row", sets: 4, reps: "10-12", he: "Table Row - תרגיל לבית עם דגש על גב.", work: 40, rest: 75, category: "pull", muscleGroup: "Back", videoUrl: "https://www.youtube.com/results?search_query=Table+Row", imageUrl: muscleGroupImages.Back, difficulty: "Standard", sector: "Home" },
  { id: "home_8", name: "Towel Row", sets: 4, reps: "10-12", he: "Towel Row - תרגיל לבית עם דגש על גב.", work: 40, rest: 75, category: "pull", muscleGroup: "Back", videoUrl: "https://www.youtube.com/results?search_query=Towel+Row", imageUrl: muscleGroupImages.Back, difficulty: "Advanced", sector: "Home" },
  { id: "home_9", name: "Reverse Snow Angels", sets: 3, reps: "12-15", he: "Reverse Snow Angels - תרגיל לבית עם דגש על גב.", work: 30, rest: 45, category: "isolation", muscleGroup: "Back", videoUrl: "https://www.youtube.com/results?search_query=Reverse+Snow+Angels", imageUrl: muscleGroupImages.Back, difficulty: "Standard", sector: "Home" },
  { id: "home_10", name: "Superman Hold", sets: 3, reps: "12-15", he: "Superman Hold - תרגיל לבית עם דגש על גב.", work: 30, rest: 45, category: "isolation", muscleGroup: "Back", videoUrl: "https://www.youtube.com/results?search_query=Superman+Hold", imageUrl: muscleGroupImages.Back, difficulty: "Standard", sector: "Home" },
  { id: "home_11", name: "Bodyweight Squat", sets: 4, reps: "10-12", he: "Bodyweight Squat - תרגיל לבית עם דגש על רגליים.", work: 40, rest: 75, category: "legs", muscleGroup: "Legs", videoUrl: "https://www.youtube.com/results?search_query=Bodyweight+Squat", imageUrl: muscleGroupImages.Legs, difficulty: "Standard", sector: "Home" },
  { id: "home_12", name: "Jump Squat", sets: 4, reps: "20-30s", he: "Jump Squat - תרגיל לבית עם דגש על רגליים.", work: 35, rest: 60, category: "power", muscleGroup: "Legs", videoUrl: "https://www.youtube.com/results?search_query=Jump+Squat", imageUrl: muscleGroupImages.Legs, difficulty: "Advanced", sector: "Home" },
  { id: "home_13", name: "Split Squat", sets: 4, reps: "10-12", he: "Split Squat - תרגיל לבית עם דגש על רגליים.", work: 40, rest: 75, category: "legs", muscleGroup: "Legs", videoUrl: "https://www.youtube.com/results?search_query=Split+Squat", imageUrl: muscleGroupImages.Legs, difficulty: "Standard", sector: "Home" },
  { id: "home_14", name: "Wall Sit", sets: 3, reps: "12-15", he: "Wall Sit - תרגיל לבית עם דגש על רגליים.", work: 30, rest: 45, category: "isolation", muscleGroup: "Legs", videoUrl: "https://www.youtube.com/results?search_query=Wall+Sit", imageUrl: muscleGroupImages.Legs, difficulty: "Standard", sector: "Home" },
  { id: "home_15", name: "Calf Raise", sets: 3, reps: "12-15", he: "Calf Raise - תרגיל לבית עם דגש על רגליים.", work: 30, rest: 45, category: "isolation", muscleGroup: "Legs", videoUrl: "https://www.youtube.com/results?search_query=Calf+Raise", imageUrl: muscleGroupImages.Legs, difficulty: "Standard", sector: "Home" },
  { id: "home_16", name: "Glute Bridge", sets: 4, reps: "10-12", he: "Glute Bridge - תרגיל לבית עם דגש על ישבן.", work: 40, rest: 75, category: "legs", muscleGroup: "Glutes", videoUrl: "https://www.youtube.com/results?search_query=Glute+Bridge", imageUrl: muscleGroupImages.Glutes, difficulty: "Standard", sector: "Home" },
  { id: "home_17", name: "Single Leg Glute Bridge", sets: 4, reps: "10-12", he: "Single Leg Glute Bridge - תרגיל לבית עם דגש על ישבן.", work: 40, rest: 75, category: "legs", muscleGroup: "Glutes", videoUrl: "https://www.youtube.com/results?search_query=Single+Leg+Glute+Bridge", imageUrl: muscleGroupImages.Glutes, difficulty: "Advanced", sector: "Home" },
  { id: "home_18", name: "Frog Pump", sets: 3, reps: "12-15", he: "Frog Pump - תרגיל לבית עם דגש על ישבן.", work: 30, rest: 45, category: "isolation", muscleGroup: "Glutes", videoUrl: "https://www.youtube.com/results?search_query=Frog+Pump", imageUrl: muscleGroupImages.Glutes, difficulty: "Standard", sector: "Home" },
  { id: "home_19", name: "Donkey Kick", sets: 3, reps: "12-15", he: "Donkey Kick - תרגיל לבית עם דגש על ישבן.", work: 30, rest: 45, category: "isolation", muscleGroup: "Glutes", videoUrl: "https://www.youtube.com/results?search_query=Donkey+Kick", imageUrl: muscleGroupImages.Glutes, difficulty: "Standard", sector: "Home" },
  { id: "home_20", name: "Fire Hydrant", sets: 3, reps: "12-15", he: "Fire Hydrant - תרגיל לבית עם דגש על ישבן.", work: 30, rest: 45, category: "isolation", muscleGroup: "Glutes", videoUrl: "https://www.youtube.com/results?search_query=Fire+Hydrant", imageUrl: muscleGroupImages.Glutes, difficulty: "Standard", sector: "Home" },
  { id: "home_21", name: "Mountain Climber", sets: 4, reps: "10-12", he: "Mountain Climber - תרגיל לבית עם דגש על ליבה.", work: 30, rest: 45, category: "core", muscleGroup: "Core", videoUrl: "https://www.youtube.com/results?search_query=Mountain+Climber", imageUrl: muscleGroupImages.Core, difficulty: "Standard", sector: "Home" },
  { id: "home_22", name: "Plank", sets: 3, reps: "30-45s", he: "Plank - תרגיל לבית עם דגש על ליבה.", work: 35, rest: 40, category: "core", muscleGroup: "Core", videoUrl: "https://www.youtube.com/results?search_query=Plank", imageUrl: muscleGroupImages.Core, difficulty: "Standard", sector: "Home" },
  { id: "home_23", name: "Side Plank", sets: 3, reps: "30-45s", he: "Side Plank - תרגיל לבית עם דגש על ליבה.", work: 35, rest: 40, category: "core", muscleGroup: "Core", videoUrl: "https://www.youtube.com/results?search_query=Side+Plank", imageUrl: muscleGroupImages.Core, difficulty: "Standard", sector: "Home" },
  { id: "home_24", name: "Dead Bug", sets: 4, reps: "10-12", he: "Dead Bug - תרגיל לבית עם דגש על ליבה.", work: 30, rest: 45, category: "core", muscleGroup: "Core", videoUrl: "https://www.youtube.com/results?search_query=Dead+Bug", imageUrl: muscleGroupImages.Core, difficulty: "Standard", sector: "Home" },
  { id: "home_25", name: "Hollow Hold", sets: 4, reps: "10-12", he: "Hollow Hold - תרגיל לבית עם דגש על ליבה.", work: 30, rest: 45, category: "core", muscleGroup: "Core", videoUrl: "https://www.youtube.com/results?search_query=Hollow+Hold", imageUrl: muscleGroupImages.Core, difficulty: "Advanced", sector: "Home" },
  { id: "home_26", name: "Burpee", sets: 4, reps: "20-30s", he: "Burpee - תרגיל לבית עם דגש על כל הגוף.", work: 35, rest: 60, category: "power", muscleGroup: "FullBody", videoUrl: "https://www.youtube.com/results?search_query=Burpee", imageUrl: muscleGroupImages.FullBody, difficulty: "Advanced", sector: "Home" },
  { id: "home_27", name: "Bear Crawl", sets: 4, reps: "20-30s", he: "Bear Crawl - תרגיל לבית עם דגש על כל הגוף.", work: 35, rest: 60, category: "power", muscleGroup: "FullBody", videoUrl: "https://www.youtube.com/results?search_query=Bear+Crawl", imageUrl: muscleGroupImages.FullBody, difficulty: "Standard", sector: "Home" },
  { id: "home_28", name: "High Knees", sets: 4, reps: "20-30s", he: "High Knees - תרגיל לבית עם דגש על כל הגוף.", work: 35, rest: 60, category: "power", muscleGroup: "FullBody", videoUrl: "https://www.youtube.com/results?search_query=High+Knees", imageUrl: muscleGroupImages.FullBody, difficulty: "Standard", sector: "Home" },
  { id: "home_29", name: "Skater Hop", sets: 4, reps: "12-16", he: "Skater Hop - תרגיל לבית עם דגש על כל הגוף.", work: 35, rest: 60, category: "power", muscleGroup: "FullBody", videoUrl: "https://www.youtube.com/results?search_query=Skater+Hop", imageUrl: muscleGroupImages.FullBody, difficulty: "Advanced", sector: "Home" },
  { id: "home_30", name: "Reverse Lunge", sets: 4, reps: "10-12", he: "Reverse Lunge - תרגיל לבית עם דגש על רגליים.", work: 40, rest: 75, category: "legs", muscleGroup: "Legs", videoUrl: "https://www.youtube.com/results?search_query=Reverse+Lunge", imageUrl: muscleGroupImages.Legs, difficulty: "Standard", sector: "Home" },
  { id: "trx_1", name: "TRX Row", sets: 4, reps: "10-12", he: "TRX Row - תרגיל עם TRX עם דגש על גב.", work: 40, rest: 75, category: "pull", muscleGroup: "Back", videoUrl: "https://www.youtube.com/results?search_query=TRX+Row", imageUrl: muscleGroupImages.Back, difficulty: "Standard", sector: "TRX" },
  { id: "trx_2", name: "TRX High Row", sets: 4, reps: "10-12", he: "TRX High Row - תרגיל עם TRX עם דגש על גב.", work: 40, rest: 75, category: "pull", muscleGroup: "Back", videoUrl: "https://www.youtube.com/results?search_query=TRX+High+Row", imageUrl: muscleGroupImages.Back, difficulty: "Advanced", sector: "TRX" },
  { id: "trx_3", name: "TRX Reverse Fly", sets: 3, reps: "12-15", he: "TRX Reverse Fly - תרגיל עם TRX עם דגש על גב.", work: 30, rest: 45, category: "isolation", muscleGroup: "Back", videoUrl: "https://www.youtube.com/results?search_query=TRX+Reverse+Fly", imageUrl: muscleGroupImages.Back, difficulty: "Standard", sector: "TRX" },
  { id: "trx_4", name: "TRX Chest Press", sets: 4, reps: "10-12", he: "TRX Chest Press - תרגיל עם TRX עם דגש על חזה.", work: 40, rest: 75, category: "push", muscleGroup: "Chest", videoUrl: "https://www.youtube.com/results?search_query=TRX+Chest+Press", imageUrl: muscleGroupImages.Chest, difficulty: "Standard", sector: "TRX" },
  { id: "trx_5", name: "TRX Atomic Push-Up", sets: 4, reps: "10-12", he: "TRX Atomic Push-Up - תרגיל עם TRX עם דגש על חזה.", work: 40, rest: 75, category: "push", muscleGroup: "Chest", videoUrl: "https://www.youtube.com/results?search_query=TRX+Atomic+Push-Up", imageUrl: muscleGroupImages.Chest, difficulty: "Advanced", sector: "TRX" },
  { id: "trx_6", name: "TRX Fly", sets: 3, reps: "12-15", he: "TRX Fly - תרגיל עם TRX עם דגש על חזה.", work: 30, rest: 45, category: "isolation", muscleGroup: "Chest", videoUrl: "https://www.youtube.com/results?search_query=TRX+Fly", imageUrl: muscleGroupImages.Chest, difficulty: "Advanced", sector: "TRX" },
  { id: "trx_7", name: "TRX Tricep Extension", sets: 3, reps: "12-15", he: "TRX Tricep Extension - תרגיל עם TRX עם דגש על ידיים.", work: 30, rest: 45, category: "isolation", muscleGroup: "Arms", videoUrl: "https://www.youtube.com/results?search_query=TRX+Tricep+Extension", imageUrl: muscleGroupImages.Arms, difficulty: "Standard", sector: "TRX" },
  { id: "trx_8", name: "TRX Bicep Curl", sets: 3, reps: "12-15", he: "TRX Bicep Curl - תרגיל עם TRX עם דגש על ידיים.", work: 30, rest: 45, category: "isolation", muscleGroup: "Arms", videoUrl: "https://www.youtube.com/results?search_query=TRX+Bicep+Curl", imageUrl: muscleGroupImages.Arms, difficulty: "Standard", sector: "TRX" },
  { id: "trx_9", name: "TRX Y Fly", sets: 3, reps: "12-15", he: "TRX Y Fly - תרגיל עם TRX עם דגש על כתפיים.", work: 30, rest: 45, category: "isolation", muscleGroup: "Shoulders", videoUrl: "https://www.youtube.com/results?search_query=TRX+Y+Fly", imageUrl: muscleGroupImages.Shoulders, difficulty: "Standard", sector: "TRX" },
  { id: "trx_10", name: "TRX T Fly", sets: 3, reps: "12-15", he: "TRX T Fly - תרגיל עם TRX עם דגש על כתפיים.", work: 30, rest: 45, category: "isolation", muscleGroup: "Shoulders", videoUrl: "https://www.youtube.com/results?search_query=TRX+T+Fly", imageUrl: muscleGroupImages.Shoulders, difficulty: "Standard", sector: "TRX" },
  { id: "trx_11", name: "TRX Face Pull", sets: 3, reps: "12-15", he: "TRX Face Pull - תרגיל עם TRX עם דגש על כתפיים.", work: 30, rest: 45, category: "isolation", muscleGroup: "Shoulders", videoUrl: "https://www.youtube.com/results?search_query=TRX+Face+Pull", imageUrl: muscleGroupImages.Shoulders, difficulty: "Standard", sector: "TRX" },
  { id: "trx_12", name: "TRX Pike", sets: 4, reps: "10-12", he: "TRX Pike - תרגיל עם TRX עם דגש על ליבה.", work: 30, rest: 45, category: "core", muscleGroup: "Core", videoUrl: "https://www.youtube.com/results?search_query=TRX+Pike", imageUrl: muscleGroupImages.Core, difficulty: "Advanced", sector: "TRX" },
  { id: "trx_13", name: "TRX Plank", sets: 3, reps: "30-45s", he: "TRX Plank - תרגיל עם TRX עם דגש על ליבה.", work: 35, rest: 40, category: "core", muscleGroup: "Core", videoUrl: "https://www.youtube.com/results?search_query=TRX+Plank", imageUrl: muscleGroupImages.Core, difficulty: "Standard", sector: "TRX" },
  { id: "trx_14", name: "TRX Mountain Climber", sets: 4, reps: "10-12", he: "TRX Mountain Climber - תרגיל עם TRX עם דגש על ליבה.", work: 30, rest: 45, category: "core", muscleGroup: "Core", videoUrl: "https://www.youtube.com/results?search_query=TRX+Mountain+Climber", imageUrl: muscleGroupImages.Core, difficulty: "Standard", sector: "TRX" },
  { id: "trx_15", name: "TRX Body Saw", sets: 4, reps: "10-12", he: "TRX Body Saw - תרגיל עם TRX עם דגש על ליבה.", work: 30, rest: 45, category: "core", muscleGroup: "Core", videoUrl: "https://www.youtube.com/results?search_query=TRX+Body+Saw", imageUrl: muscleGroupImages.Core, difficulty: "Advanced", sector: "TRX" },
  { id: "trx_16", name: "TRX Fallout", sets: 4, reps: "10-12", he: "TRX Fallout - תרגיל עם TRX עם דגש על ליבה.", work: 30, rest: 45, category: "core", muscleGroup: "Core", videoUrl: "https://www.youtube.com/results?search_query=TRX+Fallout", imageUrl: muscleGroupImages.Core, difficulty: "Advanced", sector: "TRX" },
  { id: "trx_17", name: "TRX Knee Tuck", sets: 4, reps: "10-12", he: "TRX Knee Tuck - תרגיל עם TRX עם דגש על ליבה.", work: 30, rest: 45, category: "core", muscleGroup: "Core", videoUrl: "https://www.youtube.com/results?search_query=TRX+Knee+Tuck", imageUrl: muscleGroupImages.Core, difficulty: "Standard", sector: "TRX" },
  { id: "trx_18", name: "TRX Squat", sets: 4, reps: "10-12", he: "TRX Squat - תרגיל עם TRX עם דגש על רגליים.", work: 40, rest: 75, category: "legs", muscleGroup: "Legs", videoUrl: "https://www.youtube.com/results?search_query=TRX+Squat", imageUrl: muscleGroupImages.Legs, difficulty: "Standard", sector: "TRX" },
  { id: "trx_19", name: "TRX Jump Squat", sets: 4, reps: "20-30s", he: "TRX Jump Squat - תרגיל עם TRX עם דגש על רגליים.", work: 35, rest: 60, category: "power", muscleGroup: "Legs", videoUrl: "https://www.youtube.com/results?search_query=TRX+Jump+Squat", imageUrl: muscleGroupImages.Legs, difficulty: "Advanced", sector: "TRX" },
  { id: "trx_20", name: "TRX Split Squat", sets: 4, reps: "10-12", he: "TRX Split Squat - תרגיל עם TRX עם דגש על רגליים.", work: 40, rest: 75, category: "legs", muscleGroup: "Legs", videoUrl: "https://www.youtube.com/results?search_query=TRX+Split+Squat", imageUrl: muscleGroupImages.Legs, difficulty: "Standard", sector: "TRX" },
  { id: "trx_21", name: "TRX Hamstring Curl", sets: 3, reps: "12-15", he: "TRX Hamstring Curl - תרגיל עם TRX עם דגש על רגליים.", work: 30, rest: 45, category: "isolation", muscleGroup: "Legs", videoUrl: "https://www.youtube.com/results?search_query=TRX+Hamstring+Curl", imageUrl: muscleGroupImages.Legs, difficulty: "Advanced", sector: "TRX" },
  { id: "trx_22", name: "TRX Lateral Lunge", sets: 4, reps: "10-12", he: "TRX Lateral Lunge - תרגיל עם TRX עם דגש על רגליים.", work: 40, rest: 75, category: "legs", muscleGroup: "Legs", videoUrl: "https://www.youtube.com/results?search_query=TRX+Lateral+Lunge", imageUrl: muscleGroupImages.Legs, difficulty: "Standard", sector: "TRX" },
  { id: "trx_23", name: "TRX Assisted Pistol Squat", sets: 4, reps: "10-12", he: "TRX Assisted Pistol Squat - תרגיל עם TRX עם דגש על רגליים.", work: 40, rest: 75, category: "legs", muscleGroup: "Legs", videoUrl: "https://www.youtube.com/results?search_query=TRX+Assisted+Pistol+Squat", imageUrl: muscleGroupImages.Legs, difficulty: "Advanced", sector: "TRX" },
  { id: "trx_24", name: "TRX Hip Press", sets: 4, reps: "10-12", he: "TRX Hip Press - תרגיל עם TRX עם דגש על ישבן.", work: 40, rest: 75, category: "legs", muscleGroup: "Glutes", videoUrl: "https://www.youtube.com/results?search_query=TRX+Hip+Press", imageUrl: muscleGroupImages.Glutes, difficulty: "Standard", sector: "TRX" },
  { id: "trx_25", name: "TRX Single Leg Hip Press", sets: 4, reps: "10-12", he: "TRX Single Leg Hip Press - תרגיל עם TRX עם דגש על ישבן.", work: 40, rest: 75, category: "legs", muscleGroup: "Glutes", videoUrl: "https://www.youtube.com/results?search_query=TRX+Single+Leg+Hip+Press", imageUrl: muscleGroupImages.Glutes, difficulty: "Advanced", sector: "TRX" },
  { id: "trx_26", name: "TRX Glute Bridge", sets: 4, reps: "10-12", he: "TRX Glute Bridge - תרגיל עם TRX עם דגש על ישבן.", work: 40, rest: 75, category: "legs", muscleGroup: "Glutes", videoUrl: "https://www.youtube.com/results?search_query=TRX+Glute+Bridge", imageUrl: muscleGroupImages.Glutes, difficulty: "Standard", sector: "TRX" },
  { id: "trx_27", name: "TRX Sprinter Start", sets: 4, reps: "12-16", he: "TRX Sprinter Start - תרגיל עם TRX עם דגש על כל הגוף.", work: 35, rest: 60, category: "power", muscleGroup: "FullBody", videoUrl: "https://www.youtube.com/results?search_query=TRX+Sprinter+Start", imageUrl: muscleGroupImages.FullBody, difficulty: "Advanced", sector: "TRX" },
  { id: "trx_28", name: "TRX Burpee", sets: 4, reps: "20-30s", he: "TRX Burpee - תרגיל עם TRX עם דגש על כל הגוף.", work: 35, rest: 60, category: "power", muscleGroup: "FullBody", videoUrl: "https://www.youtube.com/results?search_query=TRX+Burpee", imageUrl: muscleGroupImages.FullBody, difficulty: "Advanced", sector: "TRX" },
  { id: "trx_29", name: "TRX Power Pull", sets: 4, reps: "10-12", he: "TRX Power Pull - תרגיל עם TRX עם דגש על גב.", work: 40, rest: 75, category: "pull", muscleGroup: "Back", videoUrl: "https://www.youtube.com/results?search_query=TRX+Power+Pull", imageUrl: muscleGroupImages.Back, difficulty: "Advanced", sector: "TRX" },
  { id: "trx_30", name: "TRX Lunge to Row", sets: 4, reps: "12-16", he: "TRX Lunge to Row - תרגיל עם TRX עם דגש על כל הגוף.", work: 35, rest: 60, category: "power", muscleGroup: "FullBody", videoUrl: "https://www.youtube.com/results?search_query=TRX+Lunge+to+Row", imageUrl: muscleGroupImages.FullBody, difficulty: "Advanced", sector: "TRX" }
];

const AI_TIPS = [
  "שמור על טכניקה נקייה לפני העלאת משקל.",
  "ירידה איטית נותנת יותר שליטה ויותר עבודה לשריר.",
  "אל תדלג על מנוחה בין סטים כבדים.",
  "חלבון, מים ושינה יעזרו לך יותר מכל תרגיל קסם.",
  "בטווחי בית ו-TRX עדיף קצב מדויק ותנועה מלאה.",
];

const NUTRITION_SUGGESTIONS = {
  maintain: ["2-3 ארוחות מאוזנות עם חלבון בכל ארוחה", "להחזיק שתייה רציפה לאורך היום", "לשמור פחמימה סביב אימון"],
  gain: ["להוסיף 250-350 קלוריות ליום", "לשלב פחמימה גם לפני וגם אחרי אימון", "חלבון בכל ארוחה ונשנוש"],
  cut: ["להוריד 300-450 קלוריות ליום", "להעדיף ירקות ונפח מזון גבוה", "לשמור חלבון גבוה גם בחיטוב"],
};

const APEX_MEALS = {
  maintain: ["יוגורט + גרנולה + פרי", "אורז + עוף + ירקות", "חביתה + לחם + סלט"],
  gain: ["שייק חלבון + בננה + שיבולת שועל", "אורז + עוף + טחינה", "פסטה + טונה + ירקות"],
  cut: ["סקיר + פרי", "חזה עוף + תפוח אדמה + סלט", "טונה + קרקרים + ירקות"],
};


function getExerciseImage(exercise: Exercise) {
  return exercise.imageUrl || muscleGroupImages[exercise.muscleGroup] || DEFAULT_EXERCISE_IMAGE;
}

function getExerciseLogs(exerciseId: string, logs: SetRecord[]) {
  return logs.filter((log) => log.exerciseId === exerciseId).sort((a, b) => b.timestamp - a.timestamp);
}

function parseRepTarget(repText: string): number {
  const match = repText.match(/\d+/);
  return match ? parseInt(match[0], 10) : 10;
}

function getOverloadSuggestion(exercise: Exercise, logs: SetRecord[]) {
  const last = getExerciseLogs(exercise.id, logs)[0];
  if (!last) return "אין עדיין תיעוד. התחל נקי ושמור חזרה אחת או שתיים ברזרבה.";
  const target = parseRepTarget(exercise.reps);
  const bump = exercise.category === "isolation" ? 1.25 : 2.5;
  if (last.reps >= target) return `בפעם הקודמת עשית ${last.weight} ק״ג ל-${last.reps} חזרות. אפשר לנסות ${last.weight + bump} ק״ג.`;
  return `בפעם הקודמת עשית ${last.weight} ק״ג ל-${last.reps} חזרות. עדיף לשמור משקל ולשפר חזרות.`;
}

function getExerciseAiNotes(exercise: Exercise, logs: SetRecord[]) {
  return [
    exercise.muscleGroup === "Back" ? "תחשוב על משיכת מרפק ולא רק יד." : null,
    exercise.muscleGroup === "Chest" ? "חזה פתוח ושכמות מסודרות לפני כל לחיצה." : null,
    exercise.muscleGroup === "Legs" ? "שמור על שליטה בירידה ועל ברך יציבה." : null,
    exercise.muscleGroup === "Glutes" ? "סיים כל חזרה עם סחיטה למעלה בלי לשבור גב." : null,
    exercise.muscleGroup === "Shoulders" ? "אל תעלה כתפיים לאוזניים." : null,
    exercise.muscleGroup === "Arms" ? "פחות תנופה, יותר שליטה." : null,
    exercise.muscleGroup === "Core" ? "נשימה מבוקרת ובטן אסופה." : null,
    exercise.muscleGroup === "FullBody" ? "תרגיל כזה דורש קצב, נשימה ויציבות." : null,
    getOverloadSuggestion(exercise, logs),
  ].filter(Boolean) as string[];
}

function getDefaultDayExercises(day: DayKey) {
  const config = DAY_SPLITS.find((d) => d.id === day) || DAY_SPLITS[0];
  return EXERCISES.filter((ex) => ex.sector === "Gym" && config.muscles.includes(ex.muscleGroup)).slice(0, 8);
}

function estimateCalories(volume: number) {
  if (volume <= 0) return 0;
  return Math.round(Math.min(900, Math.max(160, volume / 18)));
}

function getRecoveryScore(history: SessionData[]) {
  const recent = history.slice(0, 4);
  if (!recent.length) return 82;
  const avg = recent.reduce((sum, item) => sum + item.volume, 0) / recent.length;
  if (avg > 3000) return 72;
  if (avg > 1800) return 79;
  return 88;
}

function calcBMI(weight: number, height: number) {
  if (!weight || !height) return 0;
  return +(weight / ((height / 100) ** 2)).toFixed(1);
}

function calcCalories(profile: NutritionProfile) {
  if (!profile.age || !profile.weight || !profile.height) return 0;
  const base = 10 * profile.weight + 6.25 * profile.height - 5 * profile.age + 5;
  const mult = profile.activity === "light" ? 1.35 : profile.activity === "moderate" ? 1.55 : 1.75;
  const maintenance = Math.round(base * mult);
  if (profile.goal === "gain") return maintenance + 280;
  if (profile.goal === "cut") return maintenance - 350;
  return maintenance;
}


function getCardioPlan(profile: NutritionProfile, bmi: number): CardioProfilePlan {
  const baseZone2 = profile.goal === "cut" ? 120 : profile.goal === "gain" ? 60 : 90;
  const zone2Minutes = profile.activity === "high" ? baseZone2 - 15 : profile.activity === "light" ? baseZone2 + 15 : baseZone2;
  const hiitMinutes = profile.goal === "gain" ? 12 : profile.goal === "cut" ? 24 : 18;
  const walkingSteps = profile.goal === "cut" ? 10000 : profile.goal === "maintain" ? 8500 : 7500;
  const recommendedSessions =
    profile.goal === "gain"
      ? "2-3 יחידות אירובי קצרות"
      : profile.goal === "cut"
        ? "3-5 יחידות אירובי משולבות"
        : "3-4 יחידות אירובי חכמות";
  const weeklyFocus =
    profile.goal === "gain"
      ? "שמור את האירובי כתומך התאוששות ולא כמשהו שמרוקן אותך."
      : profile.goal === "cut"
        ? "שלב הליכה יומית עם Zone 2 קבוע, ורק מעט HIIT."
        : "בנה בסיס לב-ריאה טוב עם עבודה עקבית ולא קיצונית.";
  const paceTip =
    bmi && bmi >= 27
      ? "עדיף להתחיל בהליכה מהירה, אופניים או אליפטיקל כדי לשמור על מפרקים."
      : "אפשר לשלב ריצה קלה, אופניים, חתירה או הליכה בשיפוע לפי העדפה.";
  return { zone2Minutes, hiitMinutes, walkingSteps, recommendedSessions, weeklyFocus, paceTip };
}

function generateExerciseCoachReply(exercise: Exercise, logs: SetRecord[], question: string) {
  const last = getExerciseLogs(exercise.id, logs)[0];
  const patterns = getExerciseAiNotes(exercise, logs);
  const lower = question.toLowerCase();
  const goalTip = lower.includes("mass") || lower.includes("מסה")
    ? "למסה, שמור טווח חזרות נקי, התקרב לכשל רק בסט האחרון, ותעד עומס כל שבוע."
    : lower.includes("cut") || lower.includes("חיטוב")
      ? "בחיטוב, שמור על הטכניקה ועל המשקל כמה שאפשר, גם אם החזרות יורדות מעט."
      : "המטרה היא לשפר ביצוע יציב, שליטה, ועומס מתקדם בלי לפגוע בטכניקה.";
  const mistakeTip =
    exercise.muscleGroup === "Back" ? "הטעות הנפוצה כאן היא משיכה עם הידיים במקום הובלת המרפק." :
    exercise.muscleGroup === "Chest" ? "הטעות הנפוצה כאן היא כתפיים שעולות קדימה ואיבוד שליטה בירידה." :
    exercise.muscleGroup === "Legs" ? "הטעות הנפוצה כאן היא איבוד יציבות בברך וירידה מהירה מדי." :
    exercise.muscleGroup === "Shoulders" ? "הטעות הנפוצה כאן היא עומס גדול מדי וטווח תנועה חלקי." :
    "הטעות הנפוצה כאן היא תנופה במקום שליטה.";
  const progression = last
    ? `לפי התיעוד האחרון שלך, עשית ${last.weight} ק״ג ל-${last.reps} חזרות. כדאי לשאוף או לעוד חזרה אחת, או לעלייה קטנה במשקל רק אם הטכניקה נשארת טובה.`
    : "עדיין אין היסטוריה לתרגיל הזה, אז כדאי להתחיל ב-2-3 סטים נקיים, לבדוק שליטה, ואז להתקדם.";
  return [
    `שאלה על ${exercise.name}: ${question || "איך לבצע טוב יותר?"}`,
    patterns[0],
    mistakeTip,
    goalTip,
    progression,
  ].join(" ");
}

function FieldBlock({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-2">
      <div className="text-sm font-bold text-slate-300">{label}</div>
      {children}
    </label>
  );
}

function LogoMark({ className = "" }: { className?: string }) {
  return (
    // הוסר: bg-white/10, ring-1, shadow. הוגדל מ-w-12 ל-w-28
    <div className={`w-28 h-28 p-1 transition-transform hover:scale-105 ${className}`}>
      <img src="/icon-192.png" alt="Betesh Training logo" className="w-full h-full object-contain" />
    </div>
  );
}

function SpotifyIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12 1.5A10.5 10.5 0 1 0 22.5 12 10.51 10.51 0 0 0 12 1.5Zm4.8 15.14a.92.92 0 0 1-1.26.3 10.2 10.2 0 0 0-5.54-1.43 14.9 14.9 0 0 0-3.53.46.92.92 0 1 1-.43-1.8 16.8 16.8 0 0 1 3.96-.5 12 12 0 0 1 6.43 1.7.92.92 0 0 1 .37 1.27Zm1.8-3.34a1.14 1.14 0 0 1-1.56.37 12.95 12.95 0 0 0-6.92-1.78 19.58 19.58 0 0 0-4.47.57 1.14 1.14 0 1 1-.52-2.22 21.55 21.55 0 0 1 4.99-.63 15.14 15.14 0 0 1 8.12 2.12 1.14 1.14 0 0 1 .36 1.57Zm.15-3.48a1.37 1.37 0 0 1-1.88.44A15.87 15.87 0 0 0 8.8 8.2a24.02 24.02 0 0 0-4.56.59 1.37 1.37 0 0 1-.59-2.67 26.14 26.14 0 0 1 5.12-.66 18.13 18.13 0 0 1 9.56 2.5 1.37 1.37 0 0 1 .42 1.86Z"/>
    </svg>
  );
}

function SafeImage({ src, alt, className, fallbackSrc = DEFAULT_EXERCISE_IMAGE }: { src: string; alt: string; className?: string; fallbackSrc?: string }) {
  const [imgSrc, setImgSrc] = useState(src || fallbackSrc);
  useEffect(() => setImgSrc(src || fallbackSrc), [src, fallbackSrc]);
  return <img src={imgSrc} alt={alt} className={className} onError={() => setImgSrc(fallbackSrc)} />;
}

const Card = ({ children, className = "", onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) => (
  <motion.div whileHover={{ scale: onClick ? 1.01 : 1 }} onClick={onClick} className={`bg-slate-900/60 backdrop-blur-3xl border border-white/5 rounded-[2rem] overflow-hidden transition-all duration-300 ${className}`}>
    {children}
  </motion.div>
);

const Btn = ({ children, className = "", variant = "default", ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { className?: string; variant?: "default" | "outline" | "ghost" | "premium" | "youtube" | "home" | "vault" | "stats" | "spotify" | "cardio" }) => {
  const styles = {
    default: "bg-teal-500 text-slate-950 hover:bg-teal-400",
    outline: "border border-white/15 bg-white/8 hover:bg-white/12 text-white",
    ghost: "bg-transparent text-white/70 hover:text-white",
    premium: "bg-gradient-to-r from-teal-500 to-indigo-600 text-white shadow-xl",
    youtube: "bg-red-600 text-white hover:bg-red-500 shadow-[0_0_20px_rgba(220,38,38,0.28)]",
    home: "bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-[0_0_20px_rgba(34,197,94,0.28)]",
    vault: "bg-pink-500 text-white hover:bg-pink-400 shadow-[0_0_20px_rgba(236,72,153,0.28)]",
    stats: "bg-gradient-to-r from-violet-500 to-cyan-500 text-white shadow-[0_0_26px_rgba(6,182,212,0.25)]",
    spotify: "bg-[#1DB954] text-slate-950 hover:bg-[#22d861] shadow-[0_0_20px_rgba(29,185,84,0.32)]",
    cardio: "bg-orange-500 text-white hover:bg-orange-400 shadow-[0_0_20px_rgba(249,115,22,0.28)]",
  } as const;
  return <button className={`inline-flex items-center justify-center gap-2 h-12 px-5 rounded-2xl font-black transition-all active:scale-95 ring-1 ring-transparent ${styles[variant]} ${className}`} {...props}>{children}</button>;
};

function ScreenFlash({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1.08 }} exit={{ opacity: 0, scale: 1.15 }} transition={{ duration: 0.28 }} className="fixed inset-0 z-[1000] pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-teal-300/35 via-cyan-200/15 to-transparent" />
          <div className="absolute inset-0 bg-white/5" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function BodyMap({ onSelect, activeMuscle }: { onSelect: (muscle: MuscleGroup) => void; activeMuscle: MuscleGroup | "All" }) {
  const bodyImage = ANATOMY_IMAGE;
  const Dot = ({ x, y, label, muscle }: { x: number; y: number; label: string; muscle: MuscleGroup }) => {
    const active = activeMuscle === muscle;
    return (
      <button onClick={() => onSelect(muscle)} className="absolute -translate-x-1/2 -translate-y-1/2 group" style={{ left: `${x}%`, top: `${y}%` }}>
        <span className={`absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] px-2 py-1 rounded-full transition-opacity ${active ? "bg-emerald-500/30 text-emerald-200 opacity-100" : "bg-emerald-500/20 text-emerald-300 opacity-0 group-hover:opacity-100"}`}>{label}</span>
        <span className={`block w-4 h-4 rounded-full border transition-all ${active ? "bg-emerald-300 shadow-[0_0_22px_rgba(74,222,128,0.95)] border-emerald-100 scale-125" : "bg-emerald-400 shadow-[0_0_18px_rgba(74,222,128,0.7)] border-emerald-200/60"}`} />
      </button>
    );
  };
  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-4"><User className="text-emerald-400" /><h3 className="text-2xl font-black italic">מפת שרירים אינטראקטיבית</h3></div>
      <div className="relative h-[420px] rounded-[1.8rem] bg-gradient-to-b from-slate-950 to-slate-900 overflow-hidden">
        <SafeImage src={bodyImage} alt="body map" className="absolute inset-0 w-full h-full object-contain opacity-80 p-4" fallbackSrc={DEFAULT_EXERCISE_IMAGE} />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/35 to-slate-900/35" />
        <div className="absolute inset-x-0 top-0 h-full bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.12),transparent_55%)]" />
        <Dot x={50} y={22} label="כתפיים" muscle="Shoulders" />
        <Dot x={50} y={31} label="חזה" muscle="Chest" />
        <Dot x={35} y={36} label="ידיים" muscle="Arms" />
        <Dot x={65} y={36} label="ידיים" muscle="Arms" />
        <Dot x={50} y={42} label="ליבה" muscle="Core" />
        <Dot x={50} y={49} label="גב" muscle="Back" />
        <Dot x={50} y={58} label="ישבן" muscle="Glutes" />
        <Dot x={44} y={73} label="רגליים" muscle="Legs" />
        <Dot x={56} y={73} label="רגליים" muscle="Legs" />
        <Dot x={50} y={86} label="כל הגוף" muscle="FullBody" />
      </div>
      <p className="text-slate-400 mt-4 text-sm">לחץ על שריר כדי לסנן את המאגר.</p>
    </Card>
  );
}

function AskAIModal({ exercise, logs, onClose, onAdd }: { exercise: Exercise; logs: SetRecord[]; onClose: () => void; onAdd: () => void }) {
  const notes = useMemo(() => getExerciseAiNotes(exercise, logs), [exercise, logs]);
  const [question, setQuestion] = useState(`איך לשפר את ${exercise.name} עם דגש על טכניקה והתקדמות?`);
  const [reply, setReply] = useState(() => generateExerciseCoachReply(exercise, logs, `איך לשפר את ${exercise.name} עם דגש על טכניקה והתקדמות?`));

  const askCoach = () => {
    setReply(generateExerciseCoachReply(exercise, logs, question));
  };

  return (
    <div className="fixed inset-0 z-[700] bg-black/90 backdrop-blur-2xl flex items-center justify-center p-4" dir="rtl">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-4xl bg-slate-900 border border-white/10 rounded-[2rem] overflow-hidden">
        <div className="relative h-52">
          <SafeImage src={getExerciseImage(exercise)} alt={exercise.name} className="w-full h-full object-cover opacity-30" fallbackSrc={muscleGroupImages[exercise.muscleGroup]} />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
          <div className="absolute inset-0 p-6 flex items-end justify-between">
            <div>
              <div className="text-xs tracking-[0.3em] uppercase text-teal-400 mb-2">{exercise.sector} · {exercise.difficulty}</div>
              <h3 className="text-3xl font-black italic">{exercise.name}</h3>
              <div className="text-sm text-slate-300 mt-2">עוזר AI פנימי לתרגיל, עם הקשר אוטומטי מהמאגר ומהביצועים שלך.</div>
            </div>
            <Btn variant="ghost" onClick={onClose}><X /></Btn>
          </div>
        </div>
        <div className="p-6 grid lg:grid-cols-[0.9fr_1.1fr] gap-6">
          <div className="space-y-4">
            <Card className="p-5 bg-teal-500/5 border-teal-500/20">
              <div className="text-sm font-bold text-teal-300 mb-3">הקשר מהיר לתרגיל</div>
              <div className="space-y-3">{notes.map((n, i) => <div key={i} className="text-slate-200">- {n}</div>)}</div>
            </Card>
            <Card className="p-5 bg-white/5 border-white/10">
              <div className="text-sm font-bold text-slate-200 mb-3">שאלה מוכנה</div>
              <textarea 
                value={question} 
                onChange={(e) => setQuestion(e.target.value)} 
                className="w-full min-h-[150px] bg-black/30 border border-white/10 rounded-2xl p-4 outline-none resize-none text-white placeholder-slate-500 focus:border-teal-500 transition-colors" 
              />
              <div className="grid sm:grid-cols-2 gap-3 mt-4">
                <Btn variant="premium" onClick={askCoach}><Bot size={16} /> שאל מתוך התרגיל</Btn>
                <Btn variant="outline" onClick={() => setQuestion(`תן לי וריאציה קלה יותר ל-${exercise.name} ודגשים לטעויות נפוצות`)}>
                  <Sparkles size={16} /> מלא שאלה חכמה
                </Btn>
              </div>
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="p-5 min-h-[280px] bg-slate-950/70 border-white/10">
              <div className="text-sm font-bold text-cyan-300 mb-3">תשובת המאמן</div>
              <div className="text-slate-100 leading-8 whitespace-pre-wrap">{reply}</div>
            </Card>
            <div className="grid sm:grid-cols-3 gap-3">
              <Btn variant="premium" onClick={onAdd}><Plus size={16} /> הוסף לסשן</Btn>
              <Btn variant="youtube" onClick={() => window.open(exercise.videoUrl, "_blank", "noopener,noreferrer")}><Youtube size={16} /> הדרכה</Btn>
              <Btn variant="outline" onClick={() => navigator.clipboard?.writeText(question)}><Sparkles size={16} /> העתק שאלה</Btn>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
function getNutritionTrainingPlan(profile: NutritionProfile, bmi: number) {
  const bmiNote =
    !bmi
      ? "הכנס נתונים כדי לקבל הערכה."
      : bmi < 18.5
        ? "BMI נמוך יחסית, כדאי להתמקד בבנייה הדרגתית."
        : bmi < 25
          ? "BMI בטווח תקין, אפשר להתאים לפי מטרה."
          : bmi < 30
            ? "BMI מעט גבוה, עדיף לשלב כוח עם אירובי מסודר."
            : "BMI גבוה יחסית, כדאי לעבוד בהדרגה ולשמור על עקביות.";

  const weeklyStrength =
    profile.goal === "gain"
      ? "4-5 אימוני כוח בשבוע"
      : profile.goal === "cut"
        ? "3-4 אימוני כוח בשבוע"
        : "3-5 אימוני כוח בשבוע";

  const cardio =
    profile.goal === "gain"
      ? "1-2 יחידות אירובי קל של 15-20 דקות כדי לשמור כושר בלי לפגוע בהתאוששות."
      : profile.goal === "cut"
        ? "2-4 יחידות אירובי של 20-35 דקות, בקצב שאפשר להתמיד בו."
        : "2-3 יחידות אירובי בינוני של 20-30 דקות לשמירה על כושר ובריאות.";

  const focus =
    profile.goal === "gain"
      ? "דגש על עומס מתקדם, התאוששות טובה, וחלבון קבוע לאורך היום."
      : profile.goal === "cut"
        ? "דגש על שמירת מסת שריר, חלבון גבוה, וניהול עומס חכם."
        : "דגש על איזון בין כוח, התאוששות, ושמירה על שגרה יציבה.";

  return {
    bmiNote,
    weeklyStrength,
    cardio,
    focus,
  };
}

function tabButtonVariant(current: MainTab, item: MainTab) {
  if (item === "dashboard") return current === item ? "home" : "outline";
  if (item === "vault") return current === item ? "vault" : "outline";
  if (item === "stats") return current === item ? "stats" : "outline";
  if (item === "nutrition") return current === item ? "premium" : "outline";
  return current === item ? "cardio" : "outline";
}

function bottomTabClasses(item: MainTab, current: MainTab) {
  const active = current === item;
  if (!active) return "text-slate-500 hover:text-white bg-transparent";
  if (item === "dashboard") return "bg-emerald-500 text-slate-950 shadow-[0_0_30px_rgba(34,197,94,0.45)] scale-110";
  if (item === "vault") return "bg-pink-500 text-white shadow-[0_0_30px_rgba(236,72,153,0.45)] scale-110";
  if (item === "stats") return "bg-gradient-to-r from-violet-500 to-cyan-500 text-white shadow-[0_0_34px_rgba(34,211,238,0.38)] scale-110";
  if (item === "nutrition") return "bg-gradient-to-r from-teal-500 to-indigo-600 text-white shadow-[0_0_30px_rgba(20,184,166,0.38)] scale-110";
  return "bg-orange-500 text-white shadow-[0_0_30px_rgba(249,115,22,0.42)] scale-110";
}

function ReacherApp() {
  const [tab, setTab] = useState<MainTab>("dashboard");
  const [selectedDay, setSelectedDay] = useState<DayKey>("sun");
  const [selectedSector, setSelectedSector] = useState<EquipmentSector | "All">("Gym");
  const [selectedMuscle, setSelectedMuscle] = useState<MuscleGroup | "All">("All");
  const [searchText, setSearchText] = useState("");
  const [askAIExercise, setAskAIExercise] = useState<Exercise | null>(null);
  const [toast, setToast] = useState("");
  const [flash, setFlash] = useState(false);
  const [plannerMode, setPlannerMode] = useState<"default" | "custom">(() => (typeof window !== "undefined" && (window.localStorage.getItem("planner_mode_v2") as "default" | "custom")) || "default");
  const [customWeek, setCustomWeek] = useState<Record<DayKey, string[]>>(() => {
    if (typeof window === "undefined") return { sun: [], mon: [], tue: [], wed: [], thu: [], fri: [] };
    try { return JSON.parse(window.localStorage.getItem("custom_week_v2") || '{"sun":[],"mon":[],"tue":[],"wed":[],"thu":[],"fri":[]}'); } catch { return { sun: [], mon: [], tue: [], wed: [], thu: [], fri: [] }; }
  });

  const [sessionList, setSessionList] = useState<Exercise[]>([]);
  const [inSession, setInSession] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [phase, setPhase] = useState<"work" | "rest">("work");
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");
  const [tip, setTip] = useState(AI_TIPS[0]);

  const [logs, setLogs] = useState<SetRecord[]>(() => {
    if (typeof window === "undefined") return [];
    try { return JSON.parse(window.localStorage.getItem("reacher_logs_v30") || "[]"); } catch { return []; }
  });
  const [history, setHistory] = useState<SessionData[]>(() => {
    if (typeof window === "undefined") return [];
    try { return JSON.parse(window.localStorage.getItem("reacher_hist_v30") || "[]"); } catch { return []; }
  });
  const [nutritionProfile, setNutritionProfile] = useState<NutritionProfile>(() => {
    if (typeof window === "undefined") return { age: 28, weight: 75, height: 175, goal: "maintain", activity: "moderate" };
    try { return JSON.parse(window.localStorage.getItem("nutrition_profile_v2") || '{"age":28,"weight":75,"height":175,"goal":"maintain","activity":"moderate"}'); } catch { return { age: 28, weight: 75, height: 175, goal: "maintain", activity: "moderate" }; }
  });

  const audioCtx = useRef<AudioContext | null>(null);

  const playSoftTones = useCallback((freqs: number[], mode: "nav" | "add" | "save" | "rest" | "finish" = "nav") => {
    if (typeof window === "undefined") return;
    if (!audioCtx.current) audioCtx.current = new AudioContext();
    if (audioCtx.current.state === "suspended") audioCtx.current.resume();

    
const profiles = {
  nav: { type: "sine" as OscillatorType, attack: 0.01, decay: 0.1, gain: 0.04, step: 0.05 },
  add: { type: "triangle" as OscillatorType, attack: 0.02, decay: 0.2, gain: 0.05, step: 0.08 },
  save: { type: "sawtooth" as OscillatorType, attack: 0.005, decay: 0.15, gain: 0.02, step: 0.04 }, // צליל מתכתי קצר
  rest: { type: "sine" as OscillatorType, attack: 0.05, decay: 0.4, gain: 0.03, step: 0.1 }, // צליל עמוק ומרגיע
  finish: { type: "square" as OscillatorType, attack: 0.01, decay: 0.5, gain: 0.04, step: 0.06 }, // צליל ניצחון עוצמתי
} as const;
    
    const profile = profiles[mode];

    freqs.forEach((freq, i) => {
      const osc = audioCtx.current!.createOscillator();
      const gain = audioCtx.current!.createGain();
      const filter = audioCtx.current!.createBiquadFilter();

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.current!.destination);

      osc.type = profile.type;
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(mode === "finish" ? 1800 : 1400, audioCtx.current!.currentTime);

      const start = audioCtx.current!.currentTime + i * profile.step;
      osc.frequency.setValueAtTime(freq, start);
      osc.frequency.exponentialRampToValueAtTime(Math.max(80, freq * 0.94), start + profile.decay);
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.linearRampToValueAtTime(profile.gain, start + profile.attack);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + profile.decay);

      osc.start(start);
      osc.stop(start + profile.decay + 0.03);
    });
  }, []);

  const playNavigateSound = useCallback(() => playSoftTones([220, 330, 440], "nav"), [playSoftTones]);
  const playAddSound = useCallback(() => playSoftTones([180, 240, 320], "add"), [playSoftTones]);
  const playSaveSound = useCallback(() => playSoftTones([260, 390, 520], "save"), [playSoftTones]);
  const playRestSound = useCallback(() => playSoftTones([150, 190], "rest"), [playSoftTones]);
  const playFinishSound = useCallback(() => playSoftTones([180, 240, 320, 420], "finish"), [playSoftTones]);

  const navigateTab = (next: MainTab) => {
    setFlash(true);
    if (next === "nutrition") playSoftTones([210, 280, 360], "nav");
    else playNavigateSound();
    window.setTimeout(() => setTab(next), 120);
    window.setTimeout(() => setFlash(false), 320);
  };

  useEffect(() => { window.localStorage.setItem("reacher_logs_v30", JSON.stringify(logs)); }, [logs]);
  useEffect(() => { window.localStorage.setItem("reacher_hist_v30", JSON.stringify(history)); }, [history]);
  useEffect(() => { window.localStorage.setItem("planner_mode_v2", plannerMode); }, [plannerMode]);
  useEffect(() => { window.localStorage.setItem("custom_week_v2", JSON.stringify(customWeek)); }, [customWeek]);
  useEffect(() => { window.localStorage.setItem("nutrition_profile_v2", JSON.stringify(nutritionProfile)); }, [nutritionProfile]);
  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(""), 2200);
    return () => window.clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    if (!(isRunning && timer > 0)) return;
    const t = window.setInterval(() => setTimer((v) => v - 1), 1000);
    return () => window.clearInterval(t);
  }, [isRunning, timer]);

  const filteredVault = useMemo(() => {
    return EXERCISES.filter((ex) => {
      const sectorOK = selectedSector === "All" || ex.sector === selectedSector;
      const muscleOK = selectedMuscle === "All" || ex.muscleGroup === selectedMuscle;
      const text = `${ex.name} ${ex.he} ${muscleHebrew[ex.muscleGroup]}`.toLowerCase();
      const searchOK = !searchText.trim() || text.includes(searchText.toLowerCase());
      return sectorOK && muscleOK && searchOK;
    });
  }, [selectedSector, selectedMuscle, searchText]);

  const currentPlanExercises = useMemo(() => {
    if (plannerMode === "default") return getDefaultDayExercises(selectedDay);
    const ids = customWeek[selectedDay];
    return ids.map((id) => EXERCISES.find((ex) => ex.id === id)).filter(Boolean) as Exercise[];
  }, [plannerMode, selectedDay, customWeek]);

  const currentExercise = sessionList[currentIndex];
  const sessionVolume = useMemo(() => {
    const ids = new Set(sessionList.map((item) => item.id));
    return logs.filter((log) => ids.has(log.exerciseId)).reduce((sum, item) => sum + item.weight * item.reps, 0);
  }, [logs, sessionList]);
  const recoveryScore = useMemo(() => getRecoveryScore(history), [history]);
  const weeklyStreak = Math.min(6, Math.max(0, history.length));
  const estimatedSessionMinutes = sessionList.reduce((sum, ex) => sum + ex.sets * (ex.work + ex.rest), 0) / 60;
  const bmi = calcBMI(nutritionProfile.weight, nutritionProfile.height);
  const recommendedCalories = calcCalories(nutritionProfile);
  const trainingPlan = getNutritionTrainingPlan(nutritionProfile, bmi);
  const cardioPlan = getCardioPlan(nutritionProfile, bmi);

  const addExerciseToSession = (exercise: Exercise) => {
    setSessionList((prev) => [...prev, exercise]);
    setToast(`${exercise.name} נוסף לסשן`);
    playAddSound();
  };

  const addExerciseToCustomDay = (day: DayKey, exerciseId: string) => {
    setCustomWeek((prev) => {
      if (prev[day].includes(exerciseId)) return prev;
      return { ...prev, [day]: [...prev[day], exerciseId] };
    });
    setToast("התרגיל נוסף ליום שבחרת");
  };

  const removeExerciseFromCustomDay = (day: DayKey, exerciseId: string) => {
    setCustomWeek((prev) => ({ ...prev, [day]: prev[day].filter((id) => id !== exerciseId) }));
  };

  const startSession = () => {
    if (!sessionList.length) {
      setToast("צריך לפחות תרגיל אחד בסשן");
      return;
    }
    setInSession(true);
    setCurrentIndex(0);
    setCurrentSet(1);
    setPhase("work");
    setTimer(sessionList[0].work);
    setIsRunning(true);
    playNavigateSound();
  };

  const handlePhaseTransition = () => {
    const ex = sessionList[currentIndex];
    if (!ex) return;
    if (phase === "work") {
      setPhase("rest");
      setTimer(ex.rest);
      setTip(getExerciseAiNotes(ex, logs)[0] || AI_TIPS[0]);
      playRestSound();
      return;
    }
    if (currentSet < ex.sets) {
      setCurrentSet((s) => s + 1);
      setPhase("work");
      setTimer(ex.work);
      playSaveSound();
      return;
    }
    if (currentIndex + 1 < sessionList.length) {
      setCurrentIndex((i) => i + 1);
      setCurrentSet(1);
      setPhase("work");
      setTimer(sessionList[currentIndex + 1].work);
      playSaveSound();
      return;
    }
    const totalVolume = logs.reduce((sum, item) => sum + item.weight * item.reps, 0);
    setHistory((prev) => [{ id: Math.random().toString(36).slice(2, 9), date: new Date().toLocaleDateString("he-IL"), volume: totalVolume, exercises: sessionList.length }, ...prev]);
    setInSession(false);
    setIsRunning(false);
    setSessionList([]);
    setToast("האימון הושלם");
    playFinishSound();
  };

  useEffect(() => {
    if (isRunning && timer === 0 && inSession) handlePhaseTransition();
  }, [timer, isRunning, inSession]);

  const logCurrentSet = () => {
    if (!currentExercise || !weight || !reps) {
      setToast("מלא משקל וחזרות");
      return;
    }
    setLogs((prev) => [...prev, { weight: parseInt(weight, 10), reps: parseInt(reps, 10), exerciseId: currentExercise.id, timestamp: Date.now() }]);
    setWeight("");
    setReps("");
    setToast("הסט נשמר");
    playSaveSound();
  };

  const renderDashboard = () => (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        <Card className="p-5 md:p-8"><div className="text-[9px] uppercase tracking-[0.18em] text-slate-500 mb-2">Exercises</div><div className="text-3xl md:text-4xl font-black italic">{sessionList.length}</div></Card>
        <Card className="p-5 md:p-8"><div className="text-[9px] uppercase tracking-[0.18em] text-slate-500 mb-2">Volume</div><div className="text-3xl md:text-4xl font-black italic text-teal-400">{sessionVolume}</div></Card>
        <Card className="p-5 md:p-8"><div className="text-[9px] uppercase tracking-[0.18em] text-slate-500 mb-2">Calories</div><div className="text-3xl md:text-4xl font-black italic text-amber-400">{estimateCalories(sessionVolume)}</div></Card>
        <Card className="p-5 md:p-8"><div className="text-[9px] uppercase tracking-[0.18em] text-slate-500 mb-2">Recovery</div><div className="text-3xl md:text-4xl font-black italic text-indigo-400">{recoveryScore}</div></Card>
        <Card className="p-5 md:p-8 col-span-2 md:col-span-4"><div className="flex flex-wrap items-center justify-between gap-3"><div><div className="text-[9px] uppercase tracking-[0.18em] text-slate-500 mb-2">Extra features</div><div className="text-lg font-black italic">סטREAK {weeklyStreak} · זמן סשן משוער {estimatedSessionMinutes ? estimatedSessionMinutes.toFixed(0) : 0} דק׳</div></div><div className="text-sm text-slate-400">יש עכשיו גם AI פנימי לתרגיל, סקשן אירובי נפרד, ומפת שרירים אנטומית.</div></div></Card>
      </div>

      <div className="grid xl:grid-cols-[1.05fr_0.95fr] gap-6">
        <Card className="p-6 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="text-[10px] uppercase tracking-[0.4em] text-teal-400 mb-2">weekly plan</div>
              <h2 className="text-3xl md:text-4xl font-black italic">בית</h2>
              <p className="text-slate-400 mt-2">ברירת המחדל היא התוכנית שלך. אפשר לעבור לתכנון אישי ולבנות תוכנית שבועית משלך.</p>
            </div>
            <div className="flex gap-2">
              <Btn variant={plannerMode === "default" ? "premium" : "outline"} onClick={() => setPlannerMode("default")}>ברירת מחדל</Btn>
              <Btn variant={plannerMode === "custom" ? "premium" : "outline"} onClick={() => setPlannerMode("custom")}>תכנון אישי</Btn>
            </div>
          </div>

          <div className="flex overflow-x-auto gap-3 pb-2">
            {DAY_SPLITS.map((day) => (
              <button key={day.id} onClick={() => setSelectedDay(day.id as DayKey)} className={`min-w-[180px] rounded-[1.4rem] p-4 border transition-all text-right ${selectedDay === day.id ? "border-teal-400 bg-teal-500/10" : "border-white/5 bg-black/20"}`}>
                <div className="text-[10px] tracking-[0.25em] uppercase text-teal-400 mb-1">{day.label}</div>
                <div className="font-black italic text-lg">{day.title}</div>
                <div className="text-sm text-slate-400 mt-1">{day.subtitle}</div>
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {currentPlanExercises.map((ex) => (
              <Card key={ex.id} className="p-4">
                <div className="flex gap-4">
                  <SafeImage src={getExerciseImage(ex)} alt={ex.name} className="w-20 h-20 rounded-2xl object-cover" fallbackSrc={muscleGroupImages[ex.muscleGroup]} />
                  <div className="flex-1">
                    <div className="font-black italic text-lg">{ex.name}</div>
                    <div className="text-sm text-slate-400">{muscleHebrew[ex.muscleGroup]} · {ex.sector}</div>
                    <div className="text-xs text-teal-300 mt-1">{ex.sets} סטים · {ex.reps}</div>
                    <div className="flex gap-2 mt-3 flex-wrap">
                      <Btn variant="premium" className="h-10 px-4" onClick={() => addExerciseToSession(ex)}><Plus size={14} /> הוסף</Btn>
                      <Btn variant="outline" className="h-10 px-4" onClick={() => setAskAIExercise(ex)}><Sparkles size={14} /> askAI</Btn>
                      {plannerMode === "custom" && <Btn variant="outline" className="h-10 px-4" onClick={() => removeExerciseFromCustomDay(selectedDay, ex.id)}><Trash2 size={14} /></Btn>}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
            {!currentPlanExercises.length && <Card className="p-6 text-slate-400">אין תרגילים ביום הזה עדיין. עבור למאגר והוסף לתכנון האישי.</Card>}
          </div>

          <Card className="p-5 bg-white/5 border-white/10">
            <div className="text-[10px] uppercase tracking-[0.25em] text-slate-500 mb-2">fuel tip</div>
            <div className="text-slate-200">{DAY_SPLITS.find((d) => d.id === selectedDay)?.nutrition}</div>
          </Card>
        </Card>

        <div className="space-y-6">
          <BodyMap activeMuscle={selectedMuscle} onSelect={(muscle) => { setSelectedMuscle(muscle); setSelectedSector("All"); navigateTab("vault"); }} />

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-black italic">סשן לייב</h3>
              <Dumbbell className="text-teal-400" />
            </div>
            {!inSession ? (
              <div className="space-y-4">
                {sessionList.length ? sessionList.map((ex, i) => (
                  <div key={`${ex.id}-${i}`} className="bg-black/30 border border-white/5 rounded-2xl p-4 flex items-center justify-between gap-3">
                    <div>
                      <div className="font-black italic">{ex.name}</div>
                      <div className="text-xs text-slate-400">{getOverloadSuggestion(ex, logs)}</div>
                    </div>
                    <button onClick={() => setSessionList((prev) => prev.filter((_, idx) => idx !== i))} className="p-2 rounded-xl hover:bg-rose-500/10"><Trash2 size={18} className="text-rose-400" /></button>
                  </div>
                )) : <div className="text-slate-400">הוסף תרגילים מהדשבורד או מהמאגר כדי להתחיל סשן.</div>}
                <Btn variant="premium" className="w-full h-14" onClick={startSession}>התחל אוסף אימון</Btn>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="text-center">
                  <div className="text-[10px] uppercase tracking-[0.4em] text-teal-400 mb-2">{phase === "work" ? "work" : "rest"}</div>
                  <div className="text-6xl font-black italic">{timer}</div>
                  <div className="text-slate-300 mt-2">{currentExercise?.name} · סט {currentSet}/{currentExercise?.sets}</div>
                </div>
                <Card className="p-4 bg-teal-500/5 border-teal-500/20"><div className="text-slate-200">{tip}</div></Card>
                <div className="grid grid-cols-2 gap-3">
                  <input value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="משקל" className="h-12 bg-black/30 border border-white/10 rounded-2xl px-4 outline-none" />
                  <input value={reps} onChange={(e) => setReps(e.target.value)} placeholder="חזרות" className="h-12 bg-black/30 border border-white/10 rounded-2xl px-4 outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Btn variant="premium" onClick={logCurrentSet}>שמור סט</Btn>
                  <Btn variant="outline" onClick={() => setIsRunning((v) => !v)}>{isRunning ? <Pause size={16} /> : <Play size={16} />}{isRunning ? "עצור" : "המשך"}</Btn>
                  <Btn variant="outline" onClick={handlePhaseTransition}>הבא</Btn>
                  <Btn variant="outline" onClick={() => currentExercise && setAskAIExercise(currentExercise)}>askAI</Btn>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </motion.div>
  );

  const renderVault = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div className="grid md:grid-cols-[1fr_auto] gap-4">
        <div className="relative">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input value={searchText} onChange={(e) => setSearchText(e.target.value)} placeholder="חפש תרגיל, שריר, ציוד..." className="w-full h-14 bg-slate-900/60 border border-white/5 rounded-[1.5rem] pr-12 pl-4 outline-none focus:border-teal-500" />
        </div>
        <Btn variant="outline" onClick={() => { setSearchText(""); setSelectedSector("All"); setSelectedMuscle("All"); }}><RefreshCcw size={16} /> איפוס</Btn>
      </div>

      <div className="flex flex-wrap gap-2">
        {(["All", "Gym", "Home", "TRX"] as const).map((s) => (
          <button key={s} onClick={() => setSelectedSector(s as any)} className={`px-5 py-3 rounded-2xl font-black text-sm ${selectedSector === s ? "bg-teal-500 text-slate-950" : "bg-slate-900 text-slate-300 border border-white/5"}`}>
            {s === "All" ? "הכל" : s === "Gym" ? "חדר כושר" : s === "Home" ? "אימונים ביתיים" : "TRX"}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {(["All", ...Object.keys(muscleHebrew)] as const).map((m) => (
          <button key={m} onClick={() => setSelectedMuscle(m as any)} className={`px-4 py-2 rounded-xl text-sm ${selectedMuscle === m ? "bg-emerald-500 text-slate-950" : "bg-black/20 border border-white/5 text-slate-300"}`}>
            {m === "All" ? "כל השרירים" : muscleHebrew[m as MuscleGroup]}
          </button>
        ))}
      </div>

      <Card className="p-5">
        <div className="grid sm:grid-cols-3 gap-4 text-center">
          <div><div className="text-slate-400 text-sm">אימונים ביתיים</div><div className="text-3xl font-black italic text-teal-400">{EXERCISES.filter((e) => e.sector === "Home").length}</div></div>
          <div><div className="text-slate-400 text-sm">אימוני TRX</div><div className="text-3xl font-black italic text-indigo-400">{EXERCISES.filter((e) => e.sector === "TRX").length}</div></div>
          <div><div className="text-slate-400 text-sm">סה״כ תרגילים</div><div className="text-3xl font-black italic text-amber-400">{EXERCISES.length}</div></div>
        </div>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filteredVault.map((ex) => (
          <Card key={ex.id} className="overflow-hidden">
            <div className="h-44 relative">
              <SafeImage src={getExerciseImage(ex)} alt={ex.name} className="w-full h-full object-cover opacity-50" fallbackSrc={muscleGroupImages[ex.muscleGroup]} />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
              <div className="absolute top-4 right-4 text-xs tracking-[0.25em] uppercase text-teal-300">{ex.sector}</div>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <div className="flex items-center gap-2"><div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-xs font-black text-teal-300">{filteredVault.findIndex((item) => item.id === ex.id) + 1}</div><div className="font-black italic text-2xl">{ex.name}</div></div>
                <div className="text-sm text-slate-400 mt-1">{muscleHebrew[ex.muscleGroup]} · {categoryHebrew[ex.category]}</div>
              </div>
              <div className="text-slate-300 text-sm leading-relaxed">{ex.he}</div>
              <div className="text-xs text-teal-300">{ex.sets} סטים · {ex.reps}</div>
              <Card className="p-4 bg-white/5 border-white/5"><div className="text-sm text-slate-200">{getExerciseAiNotes(ex, logs)[0]}</div></Card>
              <div className="grid grid-cols-2 gap-2">
                <Btn variant="premium" onClick={() => addExerciseToSession(ex)}><Plus size={15} /> אוסף תרגיל לאימון</Btn>
                <Btn variant="outline" onClick={() => setAskAIExercise(ex)}><Sparkles size={15} /> askAI</Btn>
                <Btn variant="youtube" onClick={() => window.open(ex.videoUrl, "_blank", "noopener,noreferrer")}><Youtube size={15} /> הדרכה</Btn>
                <Btn variant="outline" onClick={() => addExerciseToCustomDay(selectedDay, ex.id)}><CalendarDays size={15} /> הוסף לתכנון שבועי</Btn>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </motion.div>
  );

  const renderStats = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
        <Card className="p-8"><div className="text-[10px] tracking-[0.25em] uppercase text-slate-500 mb-2">AI readiness</div><div className="text-4xl font-black italic text-teal-400">{Math.max(72, Math.min(97, recoveryScore + (sessionList.length ? 3 : 0)))}</div></Card>
        <Card className="p-8"><div className="text-[10px] tracking-[0.25em] uppercase text-slate-500 mb-2">Momentum</div><div className="text-4xl font-black italic text-amber-400">{history.length >= 3 ? "Rising" : "Building"}</div></Card>
        <Card className="p-8"><div className="text-[10px] tracking-[0.25em] uppercase text-slate-500 mb-2">Recovery</div><div className="text-4xl font-black italic text-indigo-400">{recoveryScore}</div></Card>
        <Card className="p-8"><div className="text-[10px] tracking-[0.25em] uppercase text-slate-500 mb-2">Sessions</div><div className="text-4xl font-black italic text-rose-400">{history.length}</div></Card>
      </div>
      <Card className="p-8">
        <div className="flex justify-between items-center mb-6"><h3 className="text-2xl font-black italic">היסטוריית אימונים</h3><BarChart3 className="text-teal-400" /></div>
        <div className="space-y-4">
          {history.length ? history.map((h) => (
            <div key={h.id} className="bg-black/30 rounded-2xl p-4 flex justify-between items-center border border-white/5">
              <div><div className="font-black italic">Apex Session</div><div className="text-xs text-slate-500">{h.date} · {h.exercises} תרגילים</div></div>
              <div className="text-2xl font-black italic text-teal-400">{h.volume}kg</div>
            </div>
          )) : <div className="text-slate-400">עדיין אין היסטוריית אימונים.</div>}
        </div>
      </Card>
    
      <Card className="p-8">
        <div className="flex justify-between items-center mb-4"><h3 className="text-2xl font-black italic">שיאים אחרונים</h3><Target className="text-amber-400" /></div>
        <div className="space-y-3">
          {EXERCISES.slice(0, 4).map((ex) => {
            const best = getExerciseLogs(ex.id, logs).sort((a, b) => (b.weight * b.reps) - (a.weight * a.reps))[0];
            if (!best) return null;
            return <div key={ex.id} className="bg-black/30 rounded-2xl p-4 border border-white/5 flex justify-between gap-3"><div><div className="font-black italic">{ex.name}</div><div className="text-xs text-slate-400">{muscleHebrew[ex.muscleGroup]}</div></div><div className="text-right"><div className="text-lg font-black italic text-teal-400">{best.weight}kg</div><div className="text-xs text-slate-400">{best.reps} חזרות</div></div></div>;
          }).filter(Boolean)}
          {!logs.length && <div className="text-slate-400">אחרי שתשמור סטים, יופיעו כאן שיאים אחרונים.</div>}
        </div>
      </Card>

    </motion.div>
  );

  const renderNutrition = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4"><Flame className="text-teal-400" /><h2 className="text-3xl md:text-4xl font-black italic">מרכז תזונה חכם</h2></div>
        <div className="grid md:grid-cols-2 xl:grid-cols-5 gap-4">
          <FieldBlock label="גיל">
            <input type="number" value={nutritionProfile.age} onChange={(e) => setNutritionProfile({ ...nutritionProfile, age: +e.target.value })} placeholder="הכנס גיל" className="w-full h-12 bg-black/30 border border-white/10 rounded-2xl px-4 outline-none" />
          </FieldBlock>
          <FieldBlock label="משקל">
            <input type="number" value={nutritionProfile.weight} onChange={(e) => setNutritionProfile({ ...nutritionProfile, weight: +e.target.value })} placeholder="הכנס משקל" className="w-full h-12 bg-black/30 border border-white/10 rounded-2xl px-4 outline-none" />
          </FieldBlock>
          <FieldBlock label="גובה">
            <input type="number" value={nutritionProfile.height} onChange={(e) => setNutritionProfile({ ...nutritionProfile, height: +e.target.value })} placeholder="הכנס גובה" className="w-full h-12 bg-black/30 border border-white/10 rounded-2xl px-4 outline-none" />
          </FieldBlock>
          <FieldBlock label="מטרה">
            <select value={nutritionProfile.goal} onChange={(e) => setNutritionProfile({ ...nutritionProfile, goal: e.target.value as any })} className="w-full h-12 bg-black/30 border border-white/10 rounded-2xl px-4 outline-none">
              <option value="maintain">שמירה</option><option value="gain">מסה</option><option value="cut">חיטוב</option>
            </select>
          </FieldBlock>
          <FieldBlock label="רמת פעילות">
            <select value={nutritionProfile.activity} onChange={(e) => setNutritionProfile({ ...nutritionProfile, activity: e.target.value as any })} className="w-full h-12 bg-black/30 border border-white/10 rounded-2xl px-4 outline-none">
              <option value="light">קל</option><option value="moderate">בינוני</option><option value="high">גבוה</option>
            </select>
          </FieldBlock>
        </div>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-5"><div className="text-xs text-slate-500 mb-1">BMI</div><div className="text-3xl font-black italic text-teal-400">{bmi || "-"}</div><div className="text-xs text-slate-400 mt-2">{trainingPlan.bmiNote}</div></Card>
        <Card className="p-5"><div className="text-xs text-slate-500 mb-1">קלוריות יעד</div><div className="text-3xl font-black italic text-amber-400">{recommendedCalories || "-"}</div><div className="text-xs text-slate-400 mt-2">יעד יומי משוער לפי גיל, משקל, גובה ומטרה.</div></Card>
        <Card className="p-5"><div className="text-xs text-slate-500 mb-1">חלבון יעד</div><div className="text-3xl font-black italic text-indigo-400">{nutritionProfile.weight ? Math.round(nutritionProfile.weight * 2) : "-"}g</div><div className="text-xs text-slate-400 mt-2">כדאי לפזר על פני 3-5 ארוחות ביום.</div></Card>
        <Card className="p-5"><div className="text-xs text-slate-500 mb-1">מים</div><div className="text-3xl font-black italic text-cyan-400">{nutritionProfile.weight ? (nutritionProfile.weight * 0.035).toFixed(1) : "-"}L</div><div className="text-xs text-slate-400 mt-2">לפחות, ובאימונים חמים אפילו יותר.</div></Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4"><Dumbbell className="text-teal-400" /><h3 className="text-2xl font-black italic">כמה אימונים בשבוע</h3></div>
          <div className="text-slate-100 text-xl font-black italic mb-3">{trainingPlan.weeklyStrength}</div>
          <div className="text-slate-300 leading-relaxed">{trainingPlan.focus}</div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4"><HeartPulse className="text-rose-400" /><h3 className="text-2xl font-black italic">אירובי</h3></div>
          <div className="text-slate-300 leading-relaxed">{trainingPlan.cardio}</div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4"><Target className="text-amber-400" /><h3 className="text-2xl font-black italic">דגש עיקרי</h3></div>
          <div className="text-slate-300 leading-relaxed">{trainingPlan.focus}</div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4"><Cpu className="text-teal-400" /><h3 className="text-2xl font-black italic">המלצות AI</h3></div>
          <div className="space-y-3">{NUTRITION_SUGGESTIONS[nutritionProfile.goal].map((tip) => <div key={tip} className="bg-black/30 border border-white/5 rounded-2xl px-4 py-3 text-slate-200">{tip}</div>)}</div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4"><Weight className="text-amber-400" /><h3 className="text-2xl font-black italic">בניית תפריט יומי</h3></div>
          <div className="space-y-3">{APEX_MEALS[nutritionProfile.goal].map((meal) => <div key={meal} className="bg-black/30 border border-white/5 rounded-2xl px-4 py-3 text-slate-200">{meal}</div>)}</div>
        </Card>
      </div>
    </motion.div>
  );


  const renderCardio = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4"><HeartPulse className="text-orange-400" /><h2 className="text-3xl md:text-4xl font-black italic">מרכז אירובי חכם</h2></div>
        <div className="text-slate-300 leading-7">סקשן נפרד לאירובי עם חישובים לפי גיל, משקל, גובה, מטרה ורמת פעילות. המטרה כאן היא לא רק לשרוף קלוריות, אלא לבנות סיבולת, התאוששות ובריאות לב-ריאה.</div>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-5"><div className="text-xs text-slate-500 mb-1">Zone 2 שבועי</div><div className="text-3xl font-black italic text-orange-400">{cardioPlan.zone2Minutes} דק׳</div><div className="text-xs text-slate-400 mt-2">קצב שבו אפשר לדבר אבל לא לשיר.</div></Card>
        <Card className="p-5"><div className="text-xs text-slate-500 mb-1">HIIT שבועי</div><div className="text-3xl font-black italic text-rose-400">{cardioPlan.hiitMinutes} דק׳</div><div className="text-xs text-slate-400 mt-2">רק כתוספת, לא כבסיס היחיד.</div></Card>
        <Card className="p-5"><div className="text-xs text-slate-500 mb-1">צעדים מומלצים</div><div className="text-3xl font-black italic text-cyan-400">{cardioPlan.walkingSteps}</div><div className="text-xs text-slate-400 mt-2">עוזר גם בהתאוששות וגם בהוצאה אנרגטית.</div></Card>
        <Card className="p-5"><div className="text-xs text-slate-500 mb-1">כמות יחידות</div><div className="text-2xl font-black italic text-emerald-400">{cardioPlan.recommendedSessions}</div><div className="text-xs text-slate-400 mt-2">מותאם למטרה הנוכחית שלך.</div></Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4"><Target className="text-orange-400" /><h3 className="text-2xl font-black italic">פוקוס שבועי</h3></div>
          <div className="text-slate-300 leading-relaxed">{cardioPlan.weeklyFocus}</div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4"><Flame className="text-rose-400" /><h3 className="text-2xl font-black italic">המלצת ביצוע</h3></div>
          <div className="text-slate-300 leading-relaxed">{cardioPlan.paceTip}</div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4"><Sparkles className="text-cyan-400" /><h3 className="text-2xl font-black italic">רעיונות לאירובי</h3></div>
          <div className="space-y-3">
            {["הליכה בשיפוע 20-40 דקות", "אופניים בקצב קבוע", "חתירה לסבבים קצרים", "אינטרוולים של 30/60", "הליכה ארוכה ביום התאוששות"].map((tip) => (
              <div key={tip} className="bg-black/30 border border-white/5 rounded-2xl px-4 py-3 text-slate-200">{tip}</div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4"><CalendarDays className="text-emerald-400" /><h3 className="text-2xl font-black italic">חלוקה מומלצת לשבוע</h3></div>
        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
          {[
            { title: "יום התאוששות", text: "20-30 דקות הליכה מהירה או אופניים קלים." },
            { title: "Zone 2", text: "35-45 דקות בקצב אחיד ונשלט." },
            { title: "HIIT", text: "8-12 סבבים קצרים, לא אחרי יום רגליים קשה." },
            { title: "NEAT", text: "עוד צעדים במהלך היום, מדרגות, והליכות קצרות." },
          ].map((item) => (
            <Card key={item.title} className="p-4 bg-black/20 border-white/5">
              <div className="font-black italic text-lg">{item.title}</div>
              <div className="text-slate-400 mt-2 text-sm leading-6">{item.text}</div>
            </Card>
          ))}
        </div>
      </Card>
    </motion.div>
  );

  return (
    <>
      <ScreenFlash show={flash} />
      <AnimatePresence>{toast && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="fixed top-6 left-1/2 -translate-x-1/2 z-[900] bg-slate-900/95 border border-teal-500/30 rounded-[1.2rem] px-5 py-3 text-white">
          <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-teal-400" /><span className="font-bold">{toast}</span></div>
        </motion.div>
      )}</AnimatePresence>
      {askAIExercise && <AskAIModal exercise={askAIExercise} logs={logs} onClose={() => setAskAIExercise(null)} onAdd={() => { addExerciseToSession(askAIExercise); setAskAIExercise(null); }} />}
      <div className="min-h-screen bg-[#020617] text-slate-100 overflow-x-hidden" dir="rtl">
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-[-20%] left-[-10%] w-full h-full bg-teal-500/5 blur-[150px] rounded-full animate-pulse" />
          <div className="absolute bottom-[-20%] right-[-10%] w-full h-full bg-indigo-500/5 blur-[150px] rounded-full" />
        </div>

        <header className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 pt-8 md:pt-12 pb-6 md:pb-8 flex flex-col lg:flex-row justify-between items-start gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <LogoMark />
              <h1 className="text-[2.2rem] sm:text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-none break-words">Betesh<span className="text-teal-500">Training</span></h1>
            </div>
            <div className="text-slate-400 font-bold text-xs sm:text-sm max-w-full">Training, nutrition, cardio, recovery, progression.</div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Btn variant={tabButtonVariant(tab, "dashboard")} onClick={() => navigateTab("dashboard")}><Home size={16} /> בית</Btn>
            <Btn variant={tabButtonVariant(tab, "vault")} onClick={() => navigateTab("vault")}><LayoutGrid size={16} /> מאגר תרגילים</Btn>
            <Btn variant={tabButtonVariant(tab, "stats")} onClick={() => navigateTab("stats")}><BarChart3 size={16} /> ביצועים</Btn>
            <Btn variant={tabButtonVariant(tab, "nutrition")} onClick={() => navigateTab("nutrition")}><HeartPulse size={16} /> תזונה</Btn>
            <Btn variant={tabButtonVariant(tab, "cardio")} onClick={() => navigateTab("cardio")}><Flame size={16} /> אירובי</Btn>
            <Btn variant="youtube" onClick={() => window.open("https://www.youtube.com/", "_blank", "noopener,noreferrer")}><Youtube size={16} /> YouTube</Btn>
            <Btn variant="spotify" onClick={() => window.open("https://open.spotify.com/", "_blank", "noopener,noreferrer")}><SpotifyIcon className="w-4 h-4" /> ספוטיפיי</Btn>
          </div>
        </header>

        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 pb-56 md:pb-40">
          {tab === "dashboard" && renderDashboard()}
          {tab === "vault" && renderVault()}
          {tab === "stats" && renderStats()}
          {tab === "nutrition" && renderNutrition()}
          {tab === "cardio" && renderCardio()}
        </div>

        <div className="fixed bottom-4 md:bottom-10 left-1/2 -translate-x-1/2 z-[200] w-full max-w-md md:max-w-lg px-4 md:px-8">
          <motion.div initial={{ y: 100 }} animate={{ y: 0 }} className="bg-[#0f172a]/90 backdrop-blur-3xl border border-white/10 p-3 md:p-5 rounded-[2rem] md:rounded-[3rem] flex justify-around items-center shadow-[0_40px_100px_rgba(0,0,0,0.9)]">
            {[{ id: "dashboard", icon: Home, active: "bg-emerald-500 text-slate-950 shadow-[0_0_30px_rgba(34,197,94,0.45)]" }, { id: "vault", icon: LayoutGrid, active: "bg-pink-500 text-white shadow-[0_0_30px_rgba(236,72,153,0.45)]" }, { id: "stats", icon: BarChart3, active: "bg-gradient-to-r from-violet-500 to-cyan-500 text-white shadow-[0_0_30px_rgba(6,182,212,0.45)]" }, { id: "nutrition", icon: HeartPulse, active: "bg-teal-500 text-slate-950 shadow-[0_0_30px_rgba(20,184,166,0.45)]" }, { id: "cardio", icon: Flame, active: "bg-orange-500 text-white shadow-[0_0_30px_rgba(249,115,22,0.45)]" }].map((item) => (
              <button key={item.id} onClick={() => navigateTab(item.id as MainTab)} className={`p-3 md:p-5 rounded-[1.2rem] transition-all duration-500 relative ${tab === item.id ? `${item.active} scale-110` : "text-slate-600 hover:text-white"}`}>
                <item.icon size={24} />
              </button>
            ))}
          </motion.div>
        </div>
      </div>
    </>
  );
}

export default ReacherApp;
