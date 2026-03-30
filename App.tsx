
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { AnimatePresence, motion } from "framer-motion";

import {

  BarChart3,

  Bot,

  CalendarDays,

  Camera,

  CheckCircle2,

  Cpu,

  Droplets,

  Dumbbell,

  Flame,

  Footprints,

  HeartPulse,

  Home,

  Image as ImageIcon,

  LayoutGrid,

  MessageSquarePlus,

  Pause,

  Play,

  Plus,

  RefreshCcw,

  Ruler,

  Search,

  Sparkles,

  Target,

  Trash2,

  User,

  UtensilsCrossed,

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



type NutritionEntryType = "text" | "image" | "drink";



interface NutritionEntry {

  id: string;

  type: NutritionEntryType;

  title: string;

  mealLabel: string;

  calories: number;

  protein: number;

  carbs: number;

  fat: number;

  waterMl?: number;

  imageUrl?: string;

  createdAt: number;

}



interface BodyMeasurement {

  id: string;

  weight?: number;

  waist?: number;

  chest?: number;

  arm?: number;

  thigh?: number;

  createdAt: number;

}



interface BodyPhoto {

  id: string;

  imageUrl: string;

  note?: string;

  createdAt: number;

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

  // ================= GYM - BACK (15) =================

  { id: "gym_b1", name: "Meadows Row", sets: 4, reps: "10-12", he: "חתירה במוט חופשי מהצד. דגש על עובי הגב והלטים.", work: 45, rest: 90, category: "pull", muscleGroup: "Back", videoUrl: "https://www.youtube.com/results?search_query=Meadows+Row+tutorial", imageUrl: "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?q=80&w=800", difficulty: "Advanced", sector: "Gym" },

  { id: "gym_b2", name: "Weighted Pull-Ups", sets: 4, reps: "6-8", he: "עליות מתח עם משקל. התרגיל הכי טוב לרוחב הגב.", work: 40, rest: 120, category: "pull", muscleGroup: "Back", videoUrl: "https://www.youtube.com/results?search_query=Weighted+Pull-Ups+tutorial", imageUrl: "https://images.unsplash.com/photo-1598971639058-fab3c32f850c?q=80&w=800", difficulty: "Elite", sector: "Gym" },

  { id: "gym_b3", name: "Iliac Lat Pulldown", sets: 3, reps: "12-15", he: "משיכה ממוקדת ללטיסימוס התחתון.", work: 35, rest: 75, category: "pull", muscleGroup: "Back", videoUrl: "https://www.youtube.com/results?search_query=Iliac+Lat+Pulldown", imageUrl: "https://images.unsplash.com/photo-1590487988256-9ed24133863e?q=80&w=800", difficulty: "Advanced", sector: "Gym" },

  { id: "gym_b4", name: "T-Bar Row", sets: 3, reps: "10", he: "חתירה בטי-בר עם תמיכת חזה. עובי גב מקסימלי.", work: 40, rest: 90, category: "pull", muscleGroup: "Back", videoUrl: "https://www.youtube.com/results?search_query=T-Bar+Row+chest+supported", imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800", difficulty: "Standard", sector: "Gym" },

  { id: "gym_b5", name: "Rack Pulls", sets: 4, reps: "5-8", he: "משיכת מוט מגובה הברך. כוח אדיר לזוקפים.", work: 30, rest: 150, category: "pull", muscleGroup: "Back", videoUrl: "https://www.youtube.com/results?search_query=Rack+Pulls+form", imageUrl: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=800", difficulty: "Elite", sector: "Gym" },

  { id: "gym_b6", name: "Seal Row", sets: 3, reps: "10-12", he: "חתירה בשכיבה על ספסל מוגבה. מבודד גב לחלוטין.", work: 40, rest: 90, category: "pull", muscleGroup: "Back", videoUrl: "https://www.youtube.com/results?search_query=Seal+Row+back", imageUrl: "https://images.unsplash.com/photo-1603287611837-f2146f5de8e8?q=80&w=800", difficulty: "Advanced", sector: "Gym" },

  { id: "gym_b7", name: "Lat Prayer", sets: 3, reps: "15", he: "משיכת ידיים ישרות בפולי. בידוד מושלם ללטים.", work: 35, rest: 60, category: "isolation", muscleGroup: "Back", videoUrl: "https://www.youtube.com/results?search_query=Lat+Prayer+cable", imageUrl: "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?q=80&w=800", difficulty: "Standard", sector: "Gym" },

  { id: "gym_b8", name: "Pendlay Row", sets: 4, reps: "8", he: "חתירה מתפרצת מהרצפה. כוח מתפרץ וגב עוצמתי.", work: 45, rest: 120, category: "pull", muscleGroup: "Back", videoUrl: "https://www.youtube.com/results?search_query=Pendlay+Row+technique", imageUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800", difficulty: "Elite", sector: "Gym" },

  { id: "gym_b9", name: "Kroc Rows", sets: 3, reps: "20+", he: "חתירה כבדה מאוד בחזרות גבוהות. בונה אחיזה וגב רחב.", work: 60, rest: 120, category: "pull", muscleGroup: "Back", videoUrl: "https://www.youtube.com/results?search_query=Kroc+Rows+tutorial", imageUrl: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=800", difficulty: "Elite", sector: "Gym" },

  { id: "gym_b10", name: "Snatch Grip High Pull", sets: 4, reps: "6", he: "משיכה מהירה וגבוהה. בונה טרפזים וכתפיים אחוריות.", work: 30, rest: 150, category: "power", muscleGroup: "Back", videoUrl: "https://www.youtube.com/results?search_query=Snatch+Grip+High+Pull", imageUrl: "https://images.unsplash.com/photo-1591741535018-d042766c62eb?q=80&w=800", difficulty: "Elite", sector: "Gym" },

  { id: "gym_b11", name: "Incline DB Row", sets: 3, reps: "12", he: "חתירה בשכיבה על ספסל בשיפוע. מבודד גב עליון.", work: 40, rest: 90, category: "pull", muscleGroup: "Back", videoUrl: "https://www.youtube.com/results?search_query=Incline+DB+Row+form", imageUrl: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=800", difficulty: "Advanced", sector: "Gym" },

  { id: "gym_b12", name: "Barbell Pullover", sets: 3, reps: "12", he: "פולאובר עם מוט. מרחיב את כלוב הצלעות.", work: 40, rest: 75, category: "pull", muscleGroup: "Back", videoUrl: "https://www.youtube.com/results?search_query=Barbell+Pullover+tutorial", imageUrl: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=800", difficulty: "Standard", sector: "Gym" },

  { id: "gym_b13", name: "Chin-Ups", sets: 3, reps: "10", he: "מתח באחיזה הפוכה. עבודה חזקה על בייספס.", work: 40, rest: 90, category: "pull", muscleGroup: "Back", videoUrl: "https://www.youtube.com/results?search_query=Chin+Ups+technique", imageUrl: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?q=80&w=800", difficulty: "Standard", sector: "Gym" },

  { id: "gym_b14", name: "Renegade Row", sets: 3, reps: "10/side", he: "חתירה במצב פלאנק. יציבות ליבה וגב.", work: 50, rest: 90, category: "power", muscleGroup: "Back", videoUrl: "https://www.youtube.com/results?search_query=Renegade+Row+dumbbell", imageUrl: "https://images.unsplash.com/photo-1434608519344-49d77a699e1d?q=80&w=800", difficulty: "Advanced", sector: "Gym" },

  { id: "gym_b15", name: "Deadlift", sets: 3, reps: "5", he: "דדליפט קלאסי. בניית כוח ומסה בכל הגוף.", work: 45, rest: 180, category: "power", muscleGroup: "Back", videoUrl: "https://www.youtube.com/results?search_query=Deadlift+form+tutorial", imageUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800", difficulty: "Elite", sector: "Gym" },



  // ================= GYM - CHEST (15) =================

  { id: "gym_c1", name: "Low-Incline DB Press", sets: 4, reps: "8-10", he: "לחיצת משקולות בשיפוע קל. מפתח חזה עליון.", work: 45, rest: 100, category: "push", muscleGroup: "Chest", videoUrl: "https://www.youtube.com/results?search_query=Low+Incline+DB+Press", imageUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=800", difficulty: "Advanced", sector: "Gym" },

  { id: "gym_c2", name: "Weighted Dips", sets: 4, reps: "8-12", he: "מקבילים עם משקל. התרגיל הכי טוב לחזה תחתון.", work: 40, rest: 100, category: "push", muscleGroup: "Chest", videoUrl: "https://www.youtube.com/results?search_query=Weighted+Dips+chest", imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef03a7403f?q=80&w=800", difficulty: "Elite", sector: "Gym" },

  { id: "gym_c3", name: "Converging Press", sets: 3, reps: "10-12", he: "לחיצת חזה במכונה עם סחיטה במרכז.", work: 40, rest: 90, category: "push", muscleGroup: "Chest", videoUrl: "https://www.youtube.com/results?search_query=Converging+Chest+Press", imageUrl: "https://images.unsplash.com/photo-1591741535018-d042766c62eb?q=80&w=800", difficulty: "Standard", sector: "Gym" },

  { id: "gym_c4", name: "Floor Press", sets: 3, reps: "8", he: "לחיצה מהרצפה. שיפור כוח הנעילה ומניעת פציעות.", work: 40, rest: 90, category: "push", muscleGroup: "Chest", videoUrl: "https://www.youtube.com/results?search_query=Floor+Press+dumbbell", imageUrl: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=800", difficulty: "Advanced", sector: "Gym" },

  { id: "gym_c5", name: "Cable Flyes", sets: 3, reps: "15", he: "פרפר בכבלים מלמעלה. חיטוב ובידוד החזה.", work: 35, rest: 60, category: "isolation", muscleGroup: "Chest", videoUrl: "https://www.youtube.com/results?search_query=Cable+Flyes+tutorial", imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800", difficulty: "Standard", sector: "Gym" },

  { id: "gym_c6", name: "Hex Press", sets: 3, reps: "12", he: "לחיצה עם משקולות צמודות. מתח תמידי בחזה.", work: 35, rest: 75, category: "isolation", muscleGroup: "Chest", videoUrl: "https://www.youtube.com/results?search_query=Hex+Press+chest", imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=800", difficulty: "Standard", sector: "Gym" },

  { id: "gym_c7", name: "Flat Bench Press", sets: 4, reps: "6-8", he: "לחיצת חזה קלאסית. בניית מסה בסיסית.", work: 45, rest: 120, category: "push", muscleGroup: "Chest", videoUrl: "https://www.youtube.com/results?search_query=Bench+Press+form", imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800", difficulty: "Advanced", sector: "Gym" },

  { id: "gym_c8", name: "Guillotine Press", sets: 3, reps: "10", he: "לחיצה לכיוון הצוואר. בידוד חזה עליון קיצוני.", work: 45, rest: 100, category: "push", muscleGroup: "Chest", videoUrl: "https://www.youtube.com/results?search_query=Guillotine+Press+chest", imageUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=800", difficulty: "Elite", sector: "Gym" },

  { id: "gym_c9", name: "Low-To-High Fly", sets: 3, reps: "15", he: "פרפר מלמטה למעלה. ממוקד לחזה עליון.", work: 35, rest: 60, category: "isolation", muscleGroup: "Chest", videoUrl: "https://www.youtube.com/results?search_query=Low+to+High+Cable+Fly", imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800", difficulty: "Standard", sector: "Gym" },

  { id: "gym_c10", name: "Landmine Press", sets: 3, reps: "10-12", he: "לחיצה באלכסון מלמטה. בונה חזה עליון.", work: 40, rest: 90, category: "push", muscleGroup: "Chest", videoUrl: "https://www.youtube.com/results?search_query=Landmine+Chest+Press", imageUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=800", difficulty: "Advanced", sector: "Gym" },

  { id: "gym_c11", name: "Pec Deck Fly", sets: 3, reps: "15", he: "פרפר במכונה. סחיטה מקסימלית בשיא התנועה.", work: 30, rest: 60, category: "isolation", muscleGroup: "Chest", videoUrl: "https://www.youtube.com/results?search_query=Pec+Deck+Fly+form", imageUrl: "https://images.unsplash.com/photo-1591741535018-d042766c62eb?q=80&w=800", difficulty: "Standard", sector: "Gym" },

  { id: "gym_c12", name: "Weighted Push-Ups", sets: 3, reps: "Max", he: "שכיבות סמיכה עם משקל. כוח בסיסי.", work: 45, rest: 75, category: "push", muscleGroup: "Chest", videoUrl: "https://www.youtube.com/results?search_query=Weighted+Pushups+form", imageUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=800", difficulty: "Standard", sector: "Gym" },

  { id: "gym_c13", name: "Incline BB Press", sets: 4, reps: "6-8", he: "לחיצת מוט בשיפוע. הכלי לחזה עליון מסיבי.", work: 45, rest: 120, category: "push", muscleGroup: "Chest", videoUrl: "https://www.youtube.com/results?search_query=Incline+Barbell+Press", imageUrl: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=800", difficulty: "Advanced", sector: "Gym" },

  { id: "gym_c14", name: "Svend Press", sets: 3, reps: "20", he: "דחיפת פלטה קדימה. תרגיל סיום להזרמת דם.", work: 30, rest: 45, category: "isolation", muscleGroup: "Chest", videoUrl: "https://www.youtube.com/results?search_query=Svend+Press+chest", imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800", difficulty: "Standard", sector: "Gym" },

  { id: "gym_c15", name: "Spoto Press", sets: 4, reps: "5", he: "לחיצה עם עצירה מעל החזה. כוח מתפרץ.", work: 40, rest: 150, category: "push", muscleGroup: "Chest", videoUrl: "https://www.youtube.com/results?search_query=Spoto+Press+tutorial", imageUrl: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=800", difficulty: "Elite", sector: "Gym" },



  // ================= GYM - LEGS (15) =================

  { id: "gym_l1", name: "Zercher Squat", sets: 4, reps: "8-10", he: "סקוואט עם המוט במרפקים. עבודה על ליבה ורגליים.", work: 50, rest: 150, category: "legs", muscleGroup: "Legs", videoUrl: "https://www.youtube.com/results?search_query=Zercher+Squat+form", imageUrl: "https://images.unsplash.com/photo-1434608519344-49d77a699e1d?q=80&w=800", difficulty: "Elite", sector: "Gym" },

  { id: "gym_l2", name: "Bulgarian Split", sets: 3, reps: "10/leg", he: "סקוואט רגל אחת על ספסל. בידוד רגליים.", work: 45, rest: 90, category: "legs", muscleGroup: "Legs", videoUrl: "https://www.youtube.com/results?search_query=Bulgarian+Split+Squat+tutorial", imageUrl: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=800", difficulty: "Advanced", sector: "Gym" },

  { id: "gym_l3", name: "Romanian DL", sets: 4, reps: "10-12", he: "דדליפט רומני. עבודה על המסטרינג וישבן.", work: 45, rest: 100, category: "legs", muscleGroup: "Legs", videoUrl: "https://www.youtube.com/results?search_query=Romanian+Deadlift+form", imageUrl: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=800", difficulty: "Advanced", sector: "Gym" },

  { id: "gym_l4", name: "Nordic Curl", sets: 3, reps: "5-8", he: "ירידה איטית לכיוון הרצפה. מלך ההמסטרינג.", work: 30, rest: 120, category: "legs", muscleGroup: "Legs", videoUrl: "https://www.youtube.com/results?search_query=Nordic+Hamstring+Curl", imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800", difficulty: "Elite", sector: "Gym" },

  { id: "gym_l5", name: "Kas Bridge", sets: 3, reps: "12-15", he: "דחיפת אגן על ספסל. סחיטת ישבן.", work: 40, rest: 90, category: "legs", muscleGroup: "Legs", videoUrl: "https://www.youtube.com/results?search_query=Kas+Glute+Bridge", imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=800", difficulty: "Standard", sector: "Gym" },

  { id: "gym_l6", name: "Hack Squat", sets: 4, reps: "8-10", he: "סקוואט במכונה. מיקוד בארבע-ראשי.", work: 45, rest: 120, category: "legs", muscleGroup: "Legs", videoUrl: "https://www.youtube.com/results?search_query=Hack+Squat+form", imageUrl: "https://images.unsplash.com/photo-1434608519344-49d77a699e1d?q=80&w=800", difficulty: "Advanced", sector: "Gym" },

  { id: "gym_l7", name: "Leg Press High", sets: 4, reps: "12-15", he: "לחיצת רגליים גבוהה. דגש על ישבן.", work: 45, rest: 90, category: "legs", muscleGroup: "Legs", videoUrl: "https://www.youtube.com/results?search_query=Leg+Press+high+foot", imageUrl: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=800", difficulty: "Standard", sector: "Gym" },

  { id: "gym_l8", name: "Walking Lunges", sets: 3, reps: "20 Steps", he: "מכרעים בהליכה. כוח דינמי וסיבולת.", work: 60, rest: 90, category: "legs", muscleGroup: "Legs", videoUrl: "https://www.youtube.com/results?search_query=Walking+Lunges+dumbbell", imageUrl: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=800", difficulty: "Standard", sector: "Gym" },

  { id: "gym_l9", name: "Cyclist Squat", sets: 3, reps: "15", he: "סקוואט עם עקבים מוגבהים. שורף קוואדס.", work: 40, rest: 75, category: "legs", muscleGroup: "Legs", videoUrl: "https://www.youtube.com/results?search_query=Cyclist+Goblet+Squat", imageUrl: "https://images.unsplash.com/photo-1434682881908-b43d0467b798?q=80&w=800", difficulty: "Advanced", sector: "Gym" },

  { id: "gym_l10", name: "Stiff-Legged DL", sets: 4, reps: "8-10", he: "דדליפט רגליים ישרות. מתיחה חזקה.", work: 45, rest: 120, category: "pull", muscleGroup: "Legs", videoUrl: "https://www.youtube.com/results?search_query=Stiff+Legged+Deadlift", imageUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800", difficulty: "Elite", sector: "Gym" },

  { id: "gym_l11", name: "Calf Raises", sets: 4, reps: "20", he: "הרמת עקבים בעמידה. תאומים עוצמתיים.", work: 30, rest: 60, category: "isolation", muscleGroup: "Legs", videoUrl: "https://www.youtube.com/results?search_query=Standing+Calf+Raise", imageUrl: "https://images.unsplash.com/photo-1434682881908-b43d0467b798?q=80&w=800", difficulty: "Standard", sector: "Gym" },

  { id: "gym_l12", name: "Leg Extension", sets: 3, reps: "20", he: "פשיטת רגליים במכונה. פאמפ לקוואדס.", work: 30, rest: 60, category: "isolation", muscleGroup: "Legs", videoUrl: "https://www.youtube.com/results?search_query=Leg+Extension+tutorial", imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800", difficulty: "Standard", sector: "Gym" },

  { id: "gym_l13", name: "Box Squat", sets: 4, reps: "6", he: "סקוואט על קופסה. כוח מתפרץ.", work: 45, rest: 150, category: "legs", muscleGroup: "Legs", videoUrl: "https://www.youtube.com/results?search_query=Box+Squat+form", imageUrl: "https://images.unsplash.com/photo-1434608519344-49d77a699e1d?q=80&w=800", difficulty: "Advanced", sector: "Gym" },

  { id: "gym_l14", name: "Adductor Machine", sets: 3, reps: "15", he: "קירוב ירכיים במכונה. יציבות ירך.", work: 30, rest: 60, category: "isolation", muscleGroup: "Legs", videoUrl: "https://www.youtube.com/results?search_query=Adductor+Machine+proper+form", imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800", difficulty: "Standard", sector: "Gym" },

  { id: "gym_l15", name: "Step-Ups", sets: 3, reps: "12/leg", he: "עלייה על קופסה גבוהה. כוח חד צדדי.", work: 45, rest: 75, category: "legs", muscleGroup: "Legs", videoUrl: "https://www.youtube.com/results?search_query=Step+Ups+high+box", imageUrl: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=800", difficulty: "Standard", sector: "Gym" },



  // ================= GYM - SHOULDERS (15) =================

  { id: "gym_s1", name: "Z-Press", sets: 4, reps: "8-10", he: "לחיצה בישיבה על הרצפה. מבודד כתפיים.", work: 45, rest: 120, category: "armor", muscleGroup: "Shoulders", videoUrl: "https://www.youtube.com/results?search_query=Z+Press+shoulder", imageUrl: "https://images.unsplash.com/photo-1591741535018-d042766c62eb?q=80&w=800", difficulty: "Elite", sector: "Gym" },

  { id: "gym_s2", name: "Lu Raises", sets: 3, reps: "15", he: "הרמה צידית בטווח מלא. כתפיים רחבות.", work: 35, rest: 75, category: "armor", muscleGroup: "Shoulders", videoUrl: "https://www.youtube.com/results?search_query=Lu+Raises+shoulder", imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800", difficulty: "Advanced", sector: "Gym" },

  { id: "gym_s3", name: "Face Pulls", sets: 4, reps: "20", he: "משיכת חבל למצח. בריאות הכתף.", work: 40, rest: 60, category: "armor", muscleGroup: "Shoulders", videoUrl: "https://www.youtube.com/results?search_query=Face+Pulls+proper+form", imageUrl: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=800", difficulty: "Standard", sector: "Gym" },

  { id: "gym_s4", name: "Arnold Press", sets: 3, reps: "10", he: "לחיצת ארנולד. עבודה על כל חלקי הכתף.", work: 45, rest: 90, category: "armor", muscleGroup: "Shoulders", videoUrl: "https://www.youtube.com/results?search_query=Arnold+Press+technique", imageUrl: "https://images.unsplash.com/photo-1591741535018-d042766c62eb?q=80&w=800", difficulty: "Advanced", sector: "Gym" },

  { id: "gym_s5", name: "Cable Lateral", sets: 4, reps: "15", he: "הרמה צידית בכבל מאחורי הגוף.", work: 35, rest: 60, category: "isolation", muscleGroup: "Shoulders", videoUrl: "https://www.youtube.com/results?search_query=Cable+Lateral+Raise+behind+back", imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800", difficulty: "Standard", sector: "Gym" },

  { id: "gym_s6", name: "Military Press", sets: 4, reps: "6", he: "לחיצת מוט בעמידה. המלך של הכתפיים.", work: 45, rest: 150, category: "armor", muscleGroup: "Shoulders", videoUrl: "https://www.youtube.com/results?search_query=Military+Press+form", imageUrl: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=800", difficulty: "Advanced", sector: "Gym" },

  { id: "gym_s7", name: "Rear Delt Row", sets: 3, reps: "15", he: "חתירה לכתף אחורית וטרפזים.", work: 40, rest: 60, category: "isolation", muscleGroup: "Shoulders", videoUrl: "https://www.youtube.com/results?search_query=Rear+Delt+Row", imageUrl: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=800", difficulty: "Standard", sector: "Gym" },

  { id: "gym_s8", name: "Upright Row", sets: 3, reps: "12", he: "משיכת מוט צמוד לגוף עד החזה.", work: 40, rest: 90, category: "armor", muscleGroup: "Shoulders", videoUrl: "https://www.youtube.com/results?search_query=Upright+Row+form", imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800", difficulty: "Standard", sector: "Gym" },

  { id: "gym_s9", name: "Front Raise", sets: 3, reps: "15", he: "הרמת פלטה מלפנים לכתף קדמית.", work: 30, rest: 60, category: "isolation", muscleGroup: "Shoulders", videoUrl: "https://www.youtube.com/results?search_query=Front+Raise+plate", imageUrl: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=800", difficulty: "Standard", sector: "Gym" },

  { id: "gym_s10", name: "Push Press", sets: 4, reps: "5", he: "לחיצה מתפרצת עם עזרה מהרגליים.", work: 40, rest: 180, category: "power", muscleGroup: "Shoulders", videoUrl: "https://www.youtube.com/results?search_query=Push+Press+tutorial", imageUrl: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=800", difficulty: "Elite", sector: "Gym" },

  { id: "gym_s11", name: "Y-Raise", sets: 3, reps: "15", he: "הרמת ידיים בצורת Y. טרפז תחתון.", work: 35, rest: 60, category: "isolation", muscleGroup: "Shoulders", videoUrl: "https://www.youtube.com/results?search_query=Y+Raise+incline", imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800", difficulty: "Standard", sector: "Gym" },

  { id: "gym_s12", name: "Bradford Press", sets: 3, reps: "12", he: "לחיצה מלפנים ומאחור לסירוגין.", work: 45, rest: 90, category: "armor", muscleGroup: "Shoulders", videoUrl: "https://www.youtube.com/results?search_query=Bradford+Press+tutorial", imageUrl: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=800", difficulty: "Advanced", sector: "Gym" },

  { id: "gym_s13", name: "Bus Driver", sets: 3, reps: "45s", he: "סיבוב פלטה לסיבולת כתפיים.", work: 45, rest: 60, category: "isolation", muscleGroup: "Shoulders", videoUrl: "https://www.youtube.com/results?search_query=Bus+Driver+exercise", imageUrl: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=800", difficulty: "Standard", sector: "Gym" },

  { id: "gym_s14", name: "HSPU", sets: 3, reps: "Max", he: "שכיבות סמיכה בעמידת ידיים.", work: 45, rest: 120, category: "armor", muscleGroup: "Shoulders", videoUrl: "https://www.youtube.com/results?search_query=Handstand+Pushups+tutorial", imageUrl: "https://images.unsplash.com/photo-1599058917233-57c0e6244a4d?q=80&w=800", difficulty: "Elite", sector: "Gym" },

  { id: "gym_s15", name: "DB Lateral Raise", sets: 4, reps: "15", he: "הרמה צידית קלאסית לכתף רחבה.", work: 30, rest: 60, category: "isolation", muscleGroup: "Shoulders", videoUrl: "https://www.youtube.com/results?search_query=Lateral+Raises+dumbbell", imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800", difficulty: "Standard", sector: "Gym" },



  // ================= GYM - ARMS (15) =================

  { id: "gym_a1", name: "Bayesian Curl", sets: 3, reps: "12-15", he: "כפיפה כשהגב לכבל. מתיחה עצומה.", work: 35, rest: 60, category: "isolation", muscleGroup: "Arms", videoUrl: "https://www.youtube.com/results?search_query=Bayesian+Cable+Curl", imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800", difficulty: "Advanced", sector: "Gym" },

  { id: "gym_a2", name: "Katana Extension", sets: 3, reps: "12-15", he: "פשיטת טריספס מעבר לראש בכבל.", work: 35, rest: 60, category: "isolation", muscleGroup: "Arms", videoUrl: "https://www.youtube.com/results?search_query=Katana+Extension+triceps", imageUrl: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=800", difficulty: "Advanced", sector: "Gym" },

  { id: "gym_a3", name: "Hammer Curl", sets: 3, reps: "12", he: "כפיפה באחיזה ניטרלית. בונה אמות.", work: 35, rest: 75, category: "isolation", muscleGroup: "Arms", videoUrl: "https://www.youtube.com/results?search_query=Hammer+Curls+form", imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800", difficulty: "Standard", sector: "Gym" },

  { id: "gym_a4", name: "Close Grip Bench", sets: 4, reps: "8", he: "לחיצת חזה צמודה לטריספס.", work: 45, rest: 100, category: "push", muscleGroup: "Arms", videoUrl: "https://www.youtube.com/results?search_query=Close+Grip+Bench+Press", imageUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=800", difficulty: "Advanced", sector: "Gym" },

  { id: "gym_a5", name: "Preacher Curl", sets: 3, reps: "12", he: "כפיפה על ספסל ייעודי לבידוד בייספס.", work: 35, rest: 75, category: "isolation", muscleGroup: "Arms", videoUrl: "https://www.youtube.com/results?search_query=Preacher+Curl+form", imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800", difficulty: "Standard", sector: "Gym" },

  { id: "gym_a6", name: "Skull Crusher", sets: 3, reps: "10-12", he: "פשיטת מרפקים למצח. מסה לטריספס.", work: 40, rest: 90, category: "isolation", muscleGroup: "Arms", videoUrl: "https://www.youtube.com/results?search_query=Skull+Crusher+form", imageUrl: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=800", difficulty: "Advanced", sector: "Gym" },

  { id: "gym_a7", name: "Concentration Curl", sets: 3, reps: "15", he: "כפיפה בישיבה לשיא הגובה בבייספס.", work: 30, rest: 60, category: "isolation", muscleGroup: "Arms", videoUrl: "https://www.youtube.com/results?search_query=Concentration+Curl", imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800", difficulty: "Standard", sector: "Gym" },

  { id: "gym_a8", name: "Rope Pushdown", sets: 4, reps: "15", he: "לחיצת חבל למטה לטריספס.", work: 30, rest: 60, category: "isolation", muscleGroup: "Arms", videoUrl: "https://www.youtube.com/results?search_query=Tricep+Pushdown+rope", imageUrl: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=800", difficulty: "Standard", sector: "Gym" },

  { id: "gym_a9", name: "Spider Curl", sets: 3, reps: "12", he: "כפיפה בשכיבה עם חזה על ספסל.", work: 35, rest: 75, category: "isolation", muscleGroup: "Arms", videoUrl: "https://www.youtube.com/results?search_query=Spider+Curl", imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800", difficulty: "Advanced", sector: "Gym" },

  { id: "gym_a10", name: "French Press", sets: 3, reps: "12", he: "פשיטת מרפקים מעבר לראש בישיבה.", work: 40, rest: 90, category: "isolation", muscleGroup: "Arms", videoUrl: "https://www.youtube.com/results?search_query=French+Press+dumbbell", imageUrl: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=800", difficulty: "Advanced", sector: "Gym" },

  { id: "gym_a11", name: "Zottman Curl", sets: 3, reps: "12", he: "כפיפה רגילה וירידה הפוכה. לאמות.", work: 40, rest: 75, category: "isolation", muscleGroup: "Arms", videoUrl: "https://www.youtube.com/results?search_query=Zottman+Curl", imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800", difficulty: "Advanced", sector: "Gym" },

  { id: "gym_a12", name: "Diamond Push-Up", sets: 3, reps: "Max", he: "שכיבות סמיכה ביהלום לטריספס.", work: 35, rest: 60, category: "push", muscleGroup: "Arms", videoUrl: "https://www.youtube.com/results?search_query=Diamond+Pushup+form", imageUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=800", difficulty: "Standard", sector: "Gym" },

  { id: "gym_a13", name: "Reverse BB Curl", sets: 3, reps: "15", he: "כפיפה במוט באחיזה הפוכה לאמות.", work: 30, rest: 60, category: "isolation", muscleGroup: "Arms", videoUrl: "https://www.youtube.com/results?search_query=Reverse+Barbell+Curl", imageUrl: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=800", difficulty: "Standard", sector: "Gym" },

  { id: "gym_a14", name: "Cross Body Hammer", sets: 3, reps: "12/side", he: "כפיפת פטישים לרוחב הגוף.", work: 35, rest: 60, category: "isolation", muscleGroup: "Arms", videoUrl: "https://www.youtube.com/results?search_query=Cross+Body+Hammer+Curls", imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800", difficulty: "Standard", sector: "Gym" },

  { id: "gym_a15", name: "JM Press", sets: 3, reps: "10", he: "שילוב לחיצה ופשיטה לטריספס.", work: 45, rest: 90, category: "push", muscleGroup: "Arms", videoUrl: "https://www.youtube.com/results?search_query=JM+Press+tutorial", imageUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=800", difficulty: "Advanced", sector: "Gym" },



  // ================= GYM - CORE & FULL (10) =================

  { id: "gym_cr1", name: "Dragon Flag", sets: 3, reps: "5-8", he: "הרמת כל הגוף בשכיבה. שיא הבטן.", work: 40, rest: 90, category: "core", muscleGroup: "Core", videoUrl: "https://www.youtube.com/results?search_query=Dragon+Flag+tutorial", imageUrl: "https://images.unsplash.com/photo-1599058917233-57c0e6244a4d?q=80&w=800", difficulty: "Elite", sector: "Gym" },

  { id: "gym_cr2", name: "Hanging Leg Raise", sets: 4, reps: "15", he: "תלייה והרמת רגליים לבטן תחתונה.", work: 40, rest: 60, category: "core", muscleGroup: "Core", videoUrl: "https://www.youtube.com/results?search_query=Hanging+Leg+Raise", imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=800", difficulty: "Advanced", sector: "Gym" },

  { id: "gym_cr3", name: "Ab Wheel", sets: 3, reps: "12", he: "גלישה עם גלגל בטן. קשוח מאוד.", work: 40, rest: 90, category: "core", muscleGroup: "Core", videoUrl: "https://www.youtube.com/results?search_query=Ab+Wheel+Rollout", imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=800", difficulty: "Elite", sector: "Gym" },

  { id: "gym_cr4", name: "Cable Crunches", sets: 4, reps: "20", he: "כפיפות בטן בכריעה עם חבל.", work: 35, rest: 60, category: "core", muscleGroup: "Core", videoUrl: "https://www.youtube.com/results?search_query=Cable+Crunches", imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=800", difficulty: "Standard", sector: "Gym" },

  { id: "gym_cr5", name: "Plank Reach", sets: 3, reps: "12/side", he: "פלאנק ושליחת יד קדימה.", work: 45, rest: 45, category: "core", muscleGroup: "Core", videoUrl: "https://www.youtube.com/results?search_query=Plank+with+Reach", imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=800", difficulty: "Standard", sector: "Gym" },

  { id: "gym_f1", name: "Landmine Thruster", sets: 4, reps: "10", he: "סקוואט ודחיפה מתפרצת של המוט.", work: 60, rest: 120, category: "power", muscleGroup: "FullBody", videoUrl: "https://www.youtube.com/results?search_query=Landmine+Thruster", imageUrl: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=800", difficulty: "Advanced", sector: "Gym" },

  { id: "gym_f2", name: "Farmer's Walk", sets: 3, reps: "40m", he: "הליכה עם משקולות כבדות. בונה עוצמה.", work: 45, rest: 120, category: "power", muscleGroup: "FullBody", videoUrl: "https://www.youtube.com/results?search_query=Farmers+Walk+guide", imageUrl: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=800", difficulty: "Elite", sector: "Gym" },

  { id: "gym_f3", name: "Ball Slam", sets: 3, reps: "15", he: "הטחת כדור כוח ברצפה.", work: 30, rest: 60, category: "power", muscleGroup: "FullBody", videoUrl: "https://www.youtube.com/results?search_query=Medicine+Ball+Slam", imageUrl: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=800", difficulty: "Standard", sector: "Gym" },

  { id: "gym_f4", name: "Turkish Get-Up", sets: 3, reps: "5/side", he: "מעבר משכיבה לעמידה עם משקל.", work: 90, rest: 90, category: "power", muscleGroup: "FullBody", videoUrl: "https://www.youtube.com/results?search_query=Turkish+Get+Up", imageUrl: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=800", difficulty: "Elite", sector: "Gym" },

  { id: "gym_f5", name: "Kettlebell Swing", sets: 4, reps: "20", he: "הנפת קטלבל מתפרצת מהירכיים.", work: 45, rest: 60, category: "power", muscleGroup: "FullBody", videoUrl: "https://www.youtube.com/results?search_query=Kettlebell+Swing+form", imageUrl: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=800", difficulty: "Standard", sector: "Gym" },



  // ================= HOME (10) =================

  { id: "home_1", name: "Push-Up", sets: 4, reps: "12-15", he: "שכיבות סמיכה קלאסיות.", work: 40, rest: 60, category: "push", muscleGroup: "Chest", videoUrl: "https://www.youtube.com/results?search_query=Proper+Pushup+form", imageUrl: "https://images.unsplash.com/photo-1598971639058-fab3c32f850c?q=80&w=800", difficulty: "Standard", sector: "Home" },

  { id: "home_2", name: "Decline Push-Up", sets: 4, reps: "10-12", he: "שכיבות סמיכה עם רגליים מוגבהות.", work: 40, rest: 75, category: "push", muscleGroup: "Chest", videoUrl: "https://www.youtube.com/results?search_query=Decline+Push+Up", imageUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=800", difficulty: "Advanced", sector: "Home" },

  { id: "home_4", name: "Pike Push-Up", sets: 4, reps: "10-12", he: "שכיבות סמיכה בשיפוע לכתפיים.", work: 40, rest: 75, category: "armor", muscleGroup: "Shoulders", videoUrl: "https://www.youtube.com/results?search_query=Pike+Push+Up", imageUrl: "https://images.unsplash.com/photo-1591741535018-d042766c62eb?q=80&w=800", difficulty: "Advanced", sector: "Home" },

  { id: "home_6", name: "Diamond Push-Up", sets: 4, reps: "10-12", he: "שכיבות סמיכה ביהלום לידיים.", work: 40, rest: 75, category: "push", muscleGroup: "Arms", videoUrl: "https://www.youtube.com/results?search_query=Diamond+Push+Up", imageUrl: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=800", difficulty: "Advanced", sector: "Home" },

  { id: "home_11", name: "Bodyweight Squat", sets: 4, reps: "12-15", he: "סקוואט משקל גוף.", work: 40, rest: 75, category: "legs", muscleGroup: "Legs", videoUrl: "https://www.youtube.com/results?search_query=Bodyweight+Squat", imageUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800", difficulty: "Standard", sector: "Home" },

  { id: "home_21", name: "Mountain Climber", sets: 4, reps: "15-20", he: "טיפוס הרים לליבה ודופק.", work: 30, rest: 45, category: "core", muscleGroup: "Core", videoUrl: "https://www.youtube.com/results?search_query=Mountain+Climber", imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=800", difficulty: "Standard", sector: "Home" },



  // ================= TRX (10) =================

  { id: "trx_1", name: "TRX Row", sets: 4, reps: "10-12", he: "חתירה ב-TRX לגב.", work: 40, rest: 60, category: "pull", muscleGroup: "Back", videoUrl: "https://www.youtube.com/results?search_query=TRX+Row", imageUrl: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?q=80&w=800", difficulty: "Standard", sector: "TRX" },

  { id: "trx_4", name: "TRX Chest Press", sets: 4, reps: "10-12", he: "לחיצת חזה ב-TRX.", work: 40, rest: 75, category: "push", muscleGroup: "Chest", videoUrl: "https://www.youtube.com/results?search_query=TRX+Chest+Press", imageUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=800", difficulty: "Standard", sector: "TRX" },

  { id: "trx_12", name: "TRX Pike", sets: 4, reps: "10", he: "הרמת אגן ב-TRX לליבה.", work: 30, rest: 45, category: "core", muscleGroup: "Core", videoUrl: "https://www.youtube.com/results?search_query=TRX+Pike", imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=800", difficulty: "Advanced", sector: "TRX" }

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

    // מיכל ראשי לכל הרוחב עם שוליים מינימליים

    <div className={`w-full mb-6 px-4 ${className}`}>

      {/* מיכל יחסי ששומר על פרופורציות של כמעט ריבוע כדי לתת "נפח" בחלק העליון */}

      <div className="w-full aspect-square max-h-[35vh] flex items-center justify-center relative mx-auto">

        <img 

          src="/icon-192.png" 

          alt="Betesh Training logo" 

          // object-contain מבטיח שהתמונה תגדל הכי הרבה שאפשר בלי להיחתך

          className="w-full h-full object-contain drop-shadow-[0_0_50px_rgba(45,212,191,0.4)] transition-transform duration-500 hover:scale-105" 

        />

        {/* שכבת אור אחורית עדינה להשלמת המראה */}

        <div className="absolute inset-0 bg-teal-500/5 blur-[100px] rounded-full pointer-events-none" />

      </div>

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



function BodyMap({

  onSelect,

  activeMuscle,

}: {

  onSelect: (muscle: MuscleGroup) => void;

  activeMuscle: MuscleGroup | "All";

}) {

  const bodyImage = "/anatomy-map.png";



  const Dot = ({

    x,

    y,

    label,

    muscle,

    side = "front",

  }: {

    x: number;

    y: number;

    label: string;

    muscle: MuscleGroup;

    side?: "front" | "back";

  }) => {

    const active = activeMuscle === muscle;



    return (

      <button

        onClick={() => onSelect(muscle)}

        className="absolute -translate-x-1/2 -translate-y-1/2 group z-20"

        style={{ left: `${x}%`, top: `${y}%` }}

      >

        <span

          className={`absolute ${

            side === "front" ? "-right-16" : "-left-16"

          } top-1/2 -translate-y-1/2 whitespace-nowrap text-[10px] font-black px-2 py-1 rounded-full transition-all ${

            active

              ? "bg-teal-500 text-white opacity-100 scale-110"

              : "bg-black/80 text-teal-300 opacity-0 group-hover:opacity-100 border border-white/10"

          }`}

        >

          {label}

        </span>



        <span

          className={`block w-5 h-5 rounded-full border-2 transition-all ${

            active

              ? "bg-teal-400 border-white shadow-[0_0_20px_#2dd4bf] scale-125"

              : "bg-teal-900/70 border-teal-400/70"

          }`}

        />

      </button>

    );

  };



  return (

    <Card className="p-4 relative overflow-hidden bg-slate-950/80 border-white/10">

      <div className="flex items-center gap-3 mb-4 px-2">

        <User className="text-teal-400" size={20} />

        <h3 className="text-xl font-black italic text-white uppercase tracking-tight">

          Anatomy Map

        </h3>

      </div>



      <div className="relative h-[560px] rounded-[2rem] bg-black border border-white/5 overflow-hidden">

        <img

          src={bodyImage}

          alt="Anatomy map"

          className="absolute inset-0 w-full h-full object-contain opacity-95"

        />



        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-black/10 pointer-events-none" />



        {/* FRONT */}

        <Dot x={17} y={22} label="כתפיים" muscle="Shoulders" side="front" />

        <Dot x={24} y={24} label="חזה" muscle="Chest" side="front" />

        <Dot x={12} y={38} label="ידיים" muscle="Arms" side="front" />

        <Dot x={28} y={39} label="ליבה" muscle="Core" side="front" />

        <Dot x={24} y={55} label="רגליים" muscle="Legs" side="front" />



        {/* BACK */}

        <Dot x={56} y={22} label="כתפיים" muscle="Shoulders" side="back" />

        <Dot x={67} y={24} label="גב" muscle="Back" side="back" />

        <Dot x={77} y={38} label="ידיים" muscle="Arms" side="back" />

        <Dot x={63} y={39} label="ישבן" muscle="Glutes" side="back" />

        <Dot x={63} y={55} label="רגליים" muscle="Legs" side="back" />

      </div>

    </Card>

  );

}



function ProgressRing({
  value,
  total = 100,
  size = 120,
  stroke = 10,
  label,
  sublabel,
  accentClassName = "text-teal-400",
}: {
  value: number;
  total?: number;
  size?: number;
  stroke?: number;
  label: string;
  sublabel?: string;
  accentClassName?: string;
}) {
  const safeTotal = total <= 0 ? 1 : total;
  const pct = Math.max(0, Math.min(100, Math.round((value / safeTotal) * 100)));
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - pct / 100);

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={radius} stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} fill="none" />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={stroke}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className={accentClassName}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <div className={`text-2xl font-black italic ${accentClassName}`}>{pct}%</div>
          <div className="text-[11px] text-slate-400">{label}</div>
        </div>
      </div>
      {sublabel && <div className="text-xs text-slate-400 text-center">{sublabel}</div>}
    </div>
  );
}

function formatDayKey(date: Date) {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

function buildMonthCells(baseDate: Date) {
  const year = baseDate.getFullYear();
  const month = baseDate.getMonth();
  const first = new Date(year, month, 1);
  const firstWeekDay = first.getDay();
  const start = new Date(year, month, 1 - firstWeekDay);
  return Array.from({ length: 42 }, (_, index) => {
    const current = new Date(start);
    current.setDate(start.getDate() + index);
    return current;
  });
}

function generateNutritionCoachReply({
  profile,
  calories,
  targetCalories,
  protein,
  proteinTarget,
  waterMl,
  waterTargetMl,
  steps,
  nextMealLabel,
}: {
  profile: NutritionProfile;
  calories: number;
  targetCalories: number;
  protein: number;
  proteinTarget: number;
  waterMl: number;
  waterTargetMl: number;
  steps: number;
  nextMealLabel: string;
}) {
  const goalText = profile.goal === "gain" ? "מסה" : profile.goal === "cut" ? "חיטוב" : "שמירה";
  const caloriesDelta = targetCalories - calories;
  const proteinDelta = proteinTarget - protein;
  const waterDelta = waterTargetMl - waterMl;

  const calorieLine =
    caloriesDelta > 250
      ? `חסרות לך בערך ${Math.max(0, caloriesDelta)} קלוריות כדי להתקרב ליעד של היום.`
      : caloriesDelta < -250
        ? `עברת את היעד בערך ב-${Math.abs(caloriesDelta)} קלוריות, אז הארוחה הבאה עדיף שתהיה קלה יותר.`
        : "הקלוריות שלך יחסית קרובות ליעד, אז אין צורך בתיקון אגרסיבי.";

  const proteinLine =
    proteinDelta > 25
      ? `כדאי שב${nextMealLabel} תכניס עוד חלבון, חסרים לך בערך ${proteinDelta} גרם.`
      : "מבחינת חלבון אתה בקצב טוב מאוד להיום.";

  const hydrationLine =
    waterDelta > 500
      ? `עדיף להוסיף עוד ${waterDelta} מ״ל מים לאורך השעות הקרובות.`
      : "ההידרציה שלך נראית טובה להיום.";

  const movementLine =
    steps < 6000
      ? "כדאי לסגור עוד הליכה קלה בערב כדי לחזק התאוששות ועיכול."
      : "מבחינת תנועה יומית אתה במצב טוב.";

  return `AI Nutrition Coach - מטרה: ${goalText}. ${calorieLine} ${proteinLine} ${hydrationLine} ${movementLine}`;
}

function NutritionCalendarCard({
  baseDate,
  onPrev,
  onNext,
  mealDates,
  workoutDates,
}: {
  baseDate: Date;
  onPrev: () => void;
  onNext: () => void;
  mealDates: Set<string>;
  workoutDates: Set<string>;
}) {
  const monthTitle = baseDate.toLocaleDateString("he-IL", { month: "long", year: "numeric" });
  const cells = buildMonthCells(baseDate);
  const weekNames = ["א", "ב", "ג", "ד", "ה", "ו", "ש"];

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="text-[10px] uppercase tracking-[0.25em] text-teal-400 mb-1">calendar</div>
          <div className="text-2xl font-black italic">{monthTitle}</div>
        </div>
        <div className="flex gap-2">
          <Btn variant="outline" className="h-10 px-3" onClick={onNext}>הבא</Btn>
          <Btn variant="outline" className="h-10 px-3" onClick={onPrev}>הקודם</Btn>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-2">
        {weekNames.map((day) => (
          <div key={day} className="text-center text-xs text-slate-500 font-bold py-2">{day}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {cells.map((date) => {
          const key = formatDayKey(date);
          const inMonth = date.getMonth() === baseDate.getMonth();
          const hasMeal = mealDates.has(key);
          const hasWorkout = workoutDates.has(key);
          const isToday = key === formatDayKey(new Date());

          return (
            <div
              key={key}
              className={`min-h-[72px] rounded-2xl border p-2 flex flex-col justify-between ${
                inMonth ? "bg-black/25 border-white/5" : "bg-black/10 border-white/0 opacity-45"
              } ${isToday ? "ring-1 ring-teal-400/50" : ""}`}
            >
              <div className="text-sm font-black">{date.getDate()}</div>
              <div className="flex flex-wrap gap-1">
                {hasMeal && <span className="text-[10px] px-2 py-1 rounded-full bg-teal-500/15 text-teal-300">תזונה</span>}
                {hasWorkout && <span className="text-[10px] px-2 py-1 rounded-full bg-violet-500/15 text-violet-300">אימון</span>}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function ExercisePreviewModal({
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
  const recentLogs = getExerciseLogs(exercise.id, logs).slice(0, 4);
  const aiNotes = getExerciseAiNotes(exercise, logs);

  return (
    <div className="fixed inset-0 z-[840] bg-black/85 backdrop-blur-md flex items-center justify-center p-4" dir="rtl">
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-3xl bg-slate-900 border border-white/10 rounded-[2.3rem] overflow-hidden shadow-2xl">
        <div className="relative h-64">
          <SafeImage src={getExerciseImage(exercise)} alt={exercise.name} className="w-full h-full object-cover opacity-60" fallbackSrc={muscleGroupImages[exercise.muscleGroup]} />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
          <button onClick={onClose} className="absolute top-4 left-4 w-10 h-10 rounded-full bg-black/40 text-white flex items-center justify-center border border-white/10">
            <X size={18} />
          </button>
          <div className="absolute bottom-5 right-5 left-5">
            <div className="text-xs tracking-[0.25em] uppercase text-teal-300 mb-2">{exercise.sector} · {muscleHebrew[exercise.muscleGroup]}</div>
            <div className="text-3xl font-black italic">{exercise.name}</div>
            <div className="text-slate-300 mt-2">{exercise.he}</div>
          </div>
        </div>

        <div className="p-6 grid lg:grid-cols-[1.05fr_0.95fr] gap-5">
          <Card className="p-5 bg-black/30 border-white/5">
            <div className="text-sm text-slate-400 mb-3">פרטי ביצוע</div>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-white/5 rounded-2xl p-4"><div className="text-xs text-slate-500">סטים</div><div className="text-2xl font-black italic text-teal-300">{exercise.sets}</div></div>
              <div className="bg-white/5 rounded-2xl p-4"><div className="text-xs text-slate-500">חזרות</div><div className="text-2xl font-black italic text-amber-300">{exercise.reps}</div></div>
              <div className="bg-white/5 rounded-2xl p-4"><div className="text-xs text-slate-500">רמה</div><div className="text-xl font-black italic text-violet-300">{exercise.difficulty}</div></div>
            </div>

            <div className="mt-5">
              <div className="text-sm text-slate-400 mb-3">נקודות AI</div>
              <div className="space-y-2">
                {aiNotes.map((note) => (
                  <div key={note} className="bg-white/5 rounded-2xl px-4 py-3 text-sm text-slate-200">{note}</div>
                ))}
              </div>
            </div>
          </Card>

          <Card className="p-5 bg-black/30 border-white/5">
            <div className="text-sm text-slate-400 mb-3">היסטוריית ביצוע אחרונה</div>
            <div className="space-y-3">
              {recentLogs.length ? recentLogs.map((log) => (
                <div key={log.timestamp} className="bg-white/5 rounded-2xl px-4 py-3 flex items-center justify-between">
                  <div>
                    <div className="font-black italic text-white">{log.weight} ק״ג</div>
                    <div className="text-xs text-slate-400">{new Date(log.timestamp).toLocaleDateString("he-IL")}</div>
                  </div>
                  <div className="text-teal-300 font-black">{log.reps} חזרות</div>
                </div>
              )) : <div className="text-slate-400">אין עדיין תיעוד לתרגיל הזה.</div>}
            </div>

            <div className="grid grid-cols-2 gap-3 mt-6">
              <Btn variant="premium" onClick={onAdd}><Plus size={16} /> הוסף לאימון</Btn>
              <Btn variant="youtube" onClick={() => window.open(exercise.videoUrl, "_blank", "noopener,noreferrer")}><Youtube size={16} /> סרטון</Btn>
            </div>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}

function SessionQueueModal({
  open,
  exercises,
  logs,
  onClose,
  onRemove,
}: {
  open: boolean;
  exercises: Exercise[];
  logs: SetRecord[];
  onClose: () => void;
  onRemove: (index: number) => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[830] bg-black/80 backdrop-blur-md flex items-center justify-center p-4" dir="rtl">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-2xl bg-slate-900 border border-white/10 rounded-[2.2rem] overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-white/5">
          <div>
            <div className="text-[10px] uppercase tracking-[0.25em] text-teal-400 mb-1">live queue</div>
            <div className="text-2xl font-black italic">רשימת האימון</div>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center"><X size={18} /></button>
        </div>
        <div className="p-5 max-h-[70vh] overflow-y-auto space-y-3">
          {exercises.length ? exercises.map((exercise, index) => (
            <div key={`${exercise.id}-${index}`} className="bg-black/30 border border-white/5 rounded-2xl p-4 flex items-center gap-3">
              <SafeImage src={getExerciseImage(exercise)} alt={exercise.name} className="w-16 h-16 rounded-2xl object-cover" fallbackSrc={muscleGroupImages[exercise.muscleGroup]} />
              <div className="flex-1">
                <div className="font-black italic">{index + 1}. {exercise.name}</div>
                <div className="text-sm text-slate-400">{muscleHebrew[exercise.muscleGroup]} · {exercise.sets} סטים · {exercise.reps}</div>
                <div className="text-xs text-teal-300 mt-1">{getOverloadSuggestion(exercise, logs)}</div>
              </div>
              <button onClick={() => onRemove(index)} className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
                <Trash2 size={16} />
              </button>
            </div>
          )) : <div className="text-slate-400">אין עדיין תרגילים ברשימה.</div>}
        </div>
      </motion.div>
    </div>
  );
}




function AskAIModal({ exercise, logs, onClose, onAdd }: { exercise: Exercise; logs: SetRecord[]; onClose: () => void; onAdd: () => void }) {

  const notes = useMemo(() => getExerciseAiNotes(exercise, logs), [exercise, logs]);

  const [question, setQuestion] = useState(`איך לשפר את ${exercise.name} עם דגש על טכניקה והתקדמות?`);

  const [reply, setReply] = useState(() => generateExerciseCoachReply(exercise, logs, `איך לשפר את ${exercise.name} עם דגש על טכניקה והתקדמות?`));



  const askCoach = () => setReply(generateExerciseCoachReply(exercise, logs, question));



  return (

    <div className="fixed inset-0 z-[800] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto" dir="rtl">

      <motion.div 

        initial={{ opacity: 0, scale: 0.9 }} 

        animate={{ opacity: 1, scale: 1 }} 

        className="w-full max-w-2xl bg-slate-900 border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden my-auto"

      >

        {/* Header עם כפתור סגירה */}

        <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/5">

          <div className="flex items-center gap-3">

            <Bot className="text-teal-400" />

            <h3 className="text-xl font-black italic text-white">{exercise.name} - AI Coach</h3>

          </div>

          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-rose-500/20 transition-colors">

            <X size={20} />

          </button>

        </div>



        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">

          <Card className="p-4 bg-teal-500/5 border-teal-500/20 text-sm leading-relaxed text-slate-200">

            {notes.map((n, i) => <div key={i} className="mb-1">• {n}</div>)}

          </Card>



          <div className="space-y-2">

            <div className="text-xs font-bold text-slate-400 px-1">שאלה מוכנה</div>

            <textarea 

              value={question} 

              onChange={(e) => setQuestion(e.target.value)} 

              className="w-full h-32 bg-black/40 border border-white/10 rounded-2xl p-4 outline-none resize-none text-white focus:border-teal-500 transition-all shadow-inner" 

            />

          </div>



          <Card className="p-5 bg-black/60 border-white/5">

            <div className="text-xs font-bold text-cyan-400 mb-3 uppercase tracking-widest">תשובת המאמן</div>

            <div className="text-slate-100 leading-8 text-md font-medium">{reply}</div>

          </Card>



          <div className="grid grid-cols-2 gap-3 pt-2 pb-4">

            <Btn variant="premium" className="h-14" onClick={askCoach}><Bot size={18} /> שאל שוב</Btn>

            <Btn variant="outline" className="h-14" onClick={onAdd}><Plus size={18} /> הוסף לסשן</Btn>

          </div>

        </div>

      </motion.div>

    </div>

  );

}



function getNutritionProgressScore(entries: NutritionEntry[], waterMl: number, steps: number, profile: NutritionProfile) {

  const targetCalories = calcCalories(profile);

  const calories = entries.reduce((sum, item) => sum + item.calories, 0);

  const protein = entries.reduce((sum, item) => sum + item.protein, 0);

  const proteinTarget = profile.weight ? profile.weight * 2 : 130;

  let score = 0;



  if (entries.length >= 2) score += 25;

  else if (entries.length === 1) score += 12;



  if (waterMl >= 2000) score += 20;

  else if (waterMl >= 1200) score += 10;



  if (steps >= 8000) score += 15;

  else if (steps >= 5000) score += 8;



  if (protein >= proteinTarget * 0.9) score += 20;

  else if (protein >= proteinTarget * 0.65) score += 10;



  if (targetCalories > 0) {

    const delta = Math.abs(calories - targetCalories);

    if (delta <= 180) score += 20;

    else if (delta <= 350) score += 10;

  }



  return Math.min(100, score);

}



function getWelcomeMessage(score: number, profile: NutritionProfile, history: SessionData[], userName: string) {

  const namePart = userName ? ` ${userName}` : "";

  const goalLabel = profile.goal === "gain" ? "מסה" : profile.goal === "cut" ? "חיטוב" : "שמירה";



  if (score >= 85) return `ברוך הבא${namePart}, ההתקדמות שלך ב-${goalLabel} נראית מצוין.`;

  if (score >= 65) return `ברוך הבא${namePart}, אתה שומר על קצב יפה. עוד יום טוב ואתה מחזק את ההתקדמות.`;

  if (score >= 40) return `ברוך הבא${namePart}, יש בסיס טוב להיום. בוא נסגור ארוחות, מים ותנועה.`;

  if (history.length >= 3) return `ברוך הבא${namePart}, גם אם היה קצת בלגן לאחרונה, היום חוזרים למסלול.`;

  return `ברוך הבא${namePart}, היום בונים בסיס חזק בצעד אחד טוב.`;

}



function getNextMealLabel(entries: NutritionEntry[]) {

  const count = entries.filter((entry) => entry.type !== "drink").length;

  if (count === 0) return "ארוחת בוקר";

  if (count === 1) return "ארוחת צהריים";

  if (count === 2) return "ארוחת ביניים";

  if (count === 3) return "ארוחת ערב";

  return "ארוחה קלה";

}



function QuickAddNutritionModal({

  open,

  onClose,

  onAddEntry,

  onAddWater,

  onAddMeasurement,

  onAddPhoto,

}: {

  open: boolean;

  onClose: () => void;

  onAddEntry: (entry: Omit<NutritionEntry, "id" | "createdAt">) => void;

  onAddWater: (ml: number) => void;

  onAddMeasurement: (measurement: Omit<BodyMeasurement, "id" | "createdAt">) => void;

  onAddPhoto: (photo: Omit<BodyPhoto, "id" | "createdAt">) => void;

}) {

  const [mode, setMode] = useState<"menu" | "text" | "image" | "drink" | "measurement" | "photo">("menu");

  const [title, setTitle] = useState("");

  const [mealLabel, setMealLabel] = useState("ארוחה");

  const [calories, setCalories] = useState("");

  const [protein, setProtein] = useState("");

  const [carbs, setCarbs] = useState("");

  const [fat, setFat] = useState("");

  const [imageUrl, setImageUrl] = useState("");

  const [waterMl, setWaterMl] = useState("500");

  const [weight, setWeight] = useState("");

  const [waist, setWaist] = useState("");

  const [chest, setChest] = useState("");

  const [arm, setArm] = useState("");

  const [thigh, setThigh] = useState("");

  const [photoUrl, setPhotoUrl] = useState("");

  const [photoNote, setPhotoNote] = useState("");



  if (!open) return null;



  const resetAndClose = () => {

    setMode("menu");

    setTitle("");

    setMealLabel("ארוחה");

    setCalories("");

    setProtein("");

    setCarbs("");

    setFat("");

    setImageUrl("");

    setWaterMl("500");

    setWeight("");

    setWaist("");

    setChest("");

    setArm("");

    setThigh("");

    setPhotoUrl("");

    setPhotoNote("");

    onClose();

  };



  const addMeal = (type: NutritionEntryType) => {

    if (!title.trim()) return;

    onAddEntry({

      type,

      title,

      mealLabel,

      calories: Number(calories || 0),

      protein: Number(protein || 0),

      carbs: Number(carbs || 0),

      fat: Number(fat || 0),

      imageUrl: imageUrl || undefined,

      waterMl: type === "drink" ? Number(waterMl || 0) : undefined,

    });

    resetAndClose();

  };



  const MenuButton = ({ icon, title, subtitle, onClick }: { icon: React.ReactNode; title: string; subtitle: string; onClick: () => void }) => (

    <button onClick={onClick} className="w-full text-right rounded-[1.6rem] bg-black/30 border border-white/10 p-4 hover:border-teal-400/50 transition-all">

      <div className="flex items-center gap-3 mb-2"><div className="w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center text-teal-300">{icon}</div><div className="font-black text-white">{title}</div></div>

      <div className="text-sm text-slate-400">{subtitle}</div>

    </button>

  );



  return (

    <div className="fixed inset-0 z-[850] bg-black/80 backdrop-blur-md flex items-center justify-center p-4" dir="rtl">

      <motion.div initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-xl rounded-[2rem] bg-slate-900 border border-white/10 shadow-2xl overflow-hidden">

        <div className="flex items-center justify-between p-5 border-b border-white/5"><div><div className="text-xs uppercase tracking-[0.25em] text-teal-400 mb-1">nutrition action</div><div className="text-2xl font-black italic text-white">הוספה מהירה</div></div><button onClick={resetAndClose} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-rose-500/20"><X size={18} /></button></div>

        <div className="p-5 max-h-[80vh] overflow-y-auto space-y-4">

          {mode === "menu" && <div className="grid gap-3">

            <MenuButton icon={<MessageSquarePlus size={20} />} title="הוסף ארוחה בטקסט" subtitle="שם הארוחה ומאקרו מלא" onClick={() => setMode("text")} />

            <MenuButton icon={<ImageIcon size={20} />} title="הוסף ארוחה עם תמונה" subtitle="קישור לתמונה יחד עם ערכים תזונתיים" onClick={() => setMode("image")} />

            <MenuButton icon={<Droplets size={20} />} title="הוסף שתייה" subtitle="עדכון מהיר של כמות מים יומית" onClick={() => setMode("drink")} />

            <MenuButton icon={<Ruler size={20} />} title="הוסף מדידה" subtitle="משקל, מותן, חזה, יד וירך" onClick={() => setMode("measurement")} />

            <MenuButton icon={<Camera size={20} />} title="הוסף תמונות גוף" subtitle="שמור תמונת מעקב עם הערה" onClick={() => setMode("photo")} />

          </div>}



          {(mode === "text" || mode === "image") && <div className="space-y-4">

            <FieldBlock label="שם הארוחה"><input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full h-12 bg-black/30 border border-white/10 rounded-2xl px-4 outline-none" placeholder="למשל: אורז, עוף וירקות" /></FieldBlock>

            <FieldBlock label="סוג ארוחה"><input value={mealLabel} onChange={(e) => setMealLabel(e.target.value)} className="w-full h-12 bg-black/30 border border-white/10 rounded-2xl px-4 outline-none" placeholder="למשל: ארוחת צהריים" /></FieldBlock>

            <div className="grid grid-cols-2 gap-3">

              <FieldBlock label="קלוריות"><input value={calories} onChange={(e) => setCalories(e.target.value)} type="number" className="w-full h-12 bg-black/30 border border-white/10 rounded-2xl px-4 outline-none" /></FieldBlock>

              <FieldBlock label="חלבון"><input value={protein} onChange={(e) => setProtein(e.target.value)} type="number" className="w-full h-12 bg-black/30 border border-white/10 rounded-2xl px-4 outline-none" /></FieldBlock>

              <FieldBlock label="פחמימות"><input value={carbs} onChange={(e) => setCarbs(e.target.value)} type="number" className="w-full h-12 bg-black/30 border border-white/10 rounded-2xl px-4 outline-none" /></FieldBlock>

              <FieldBlock label="שומן"><input value={fat} onChange={(e) => setFat(e.target.value)} type="number" className="w-full h-12 bg-black/30 border border-white/10 rounded-2xl px-4 outline-none" /></FieldBlock>

            </div>

            {mode === "image" && <FieldBlock label="קישור לתמונה"><input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="w-full h-12 bg-black/30 border border-white/10 rounded-2xl px-4 outline-none" placeholder="https://..." /></FieldBlock>}

            <div className="grid grid-cols-2 gap-3"><Btn variant="outline" onClick={() => setMode("menu")}>חזרה</Btn><Btn variant="premium" onClick={() => addMeal(mode === "image" ? "image" : "text")}>שמור</Btn></div>

          </div>}



          {mode === "drink" && <div className="space-y-4">

            <FieldBlock label="כמות במ״ל"><input value={waterMl} onChange={(e) => setWaterMl(e.target.value)} type="number" className="w-full h-12 bg-black/30 border border-white/10 rounded-2xl px-4 outline-none" /></FieldBlock>

            <div className="grid grid-cols-2 gap-3"><Btn variant="outline" onClick={() => setMode("menu")}>חזרה</Btn><Btn variant="premium" onClick={() => { onAddWater(Number(waterMl || 0)); onAddEntry({ type: "drink", title: "שתייה", mealLabel: "מים", calories: 0, protein: 0, carbs: 0, fat: 0, waterMl: Number(waterMl || 0) }); resetAndClose(); }}>הוסף שתייה</Btn></div>

          </div>}



          {mode === "measurement" && <div className="space-y-4">

            <div className="grid grid-cols-2 gap-3">

              <FieldBlock label="משקל"><input value={weight} onChange={(e) => setWeight(e.target.value)} type="number" className="w-full h-12 bg-black/30 border border-white/10 rounded-2xl px-4 outline-none" /></FieldBlock>

              <FieldBlock label="מותן"><input value={waist} onChange={(e) => setWaist(e.target.value)} type="number" className="w-full h-12 bg-black/30 border border-white/10 rounded-2xl px-4 outline-none" /></FieldBlock>

              <FieldBlock label="חזה"><input value={chest} onChange={(e) => setChest(e.target.value)} type="number" className="w-full h-12 bg-black/30 border border-white/10 rounded-2xl px-4 outline-none" /></FieldBlock>

              <FieldBlock label="יד"><input value={arm} onChange={(e) => setArm(e.target.value)} type="number" className="w-full h-12 bg-black/30 border border-white/10 rounded-2xl px-4 outline-none" /></FieldBlock>

              <FieldBlock label="ירך"><input value={thigh} onChange={(e) => setThigh(e.target.value)} type="number" className="w-full h-12 bg-black/30 border border-white/10 rounded-2xl px-4 outline-none" /></FieldBlock>

            </div>

            <div className="grid grid-cols-2 gap-3"><Btn variant="outline" onClick={() => setMode("menu")}>חזרה</Btn><Btn variant="premium" onClick={() => { onAddMeasurement({ weight: weight ? Number(weight) : undefined, waist: waist ? Number(waist) : undefined, chest: chest ? Number(chest) : undefined, arm: arm ? Number(arm) : undefined, thigh: thigh ? Number(thigh) : undefined }); resetAndClose(); }}>שמור מדידה</Btn></div>

          </div>}



          {mode === "photo" && <div className="space-y-4">

            <FieldBlock label="קישור לתמונה"><input value={photoUrl} onChange={(e) => setPhotoUrl(e.target.value)} className="w-full h-12 bg-black/30 border border-white/10 rounded-2xl px-4 outline-none" placeholder="https://..." /></FieldBlock>

            <FieldBlock label="הערה"><input value={photoNote} onChange={(e) => setPhotoNote(e.target.value)} className="w-full h-12 bg-black/30 border border-white/10 rounded-2xl px-4 outline-none" placeholder="למשל: בוקר, אחרי שבוע טוב" /></FieldBlock>

            <div className="grid grid-cols-2 gap-3"><Btn variant="outline" onClick={() => setMode("menu")}>חזרה</Btn><Btn variant="premium" onClick={() => { if (!photoUrl.trim()) return; onAddPhoto({ imageUrl: photoUrl, note: photoNote || undefined }); resetAndClose(); }}>שמור תמונה</Btn></div>

          </div>}

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

function getNextWorkoutDay(selectedDay: DayKey) {

  const dayIndex = DAY_SPLITS.findIndex((d) => d.id === selectedDay);

  const nextIndex = dayIndex === DAY_SPLITS.length - 1 ? 0 : dayIndex + 1;

  return DAY_SPLITS[nextIndex];

}



function getCompletedExercisesCount(sessionList: Exercise[], logs: SetRecord[]) {

  const sessionIds = new Set(sessionList.map((ex) => ex.id));

  const completedIds = new Set(

    logs.filter((log) => sessionIds.has(log.exerciseId)).map((log) => log.exerciseId)

  );

  return completedIds.size;

}



function getRemainingMuscleGroups(sessionList: Exercise[], logs: SetRecord[]) {

  const completedIds = new Set(logs.map((log) => log.exerciseId));



  const summary = sessionList.reduce<Record<string, { total: number; done: number }>>((acc, ex) => {

    if (!acc[ex.muscleGroup]) {

      acc[ex.muscleGroup] = { total: 0, done: 0 };

    }

    acc[ex.muscleGroup].total += 1;

    if (completedIds.has(ex.id)) {

      acc[ex.muscleGroup].done += 1;

    }

    return acc;

  }, {});



  return Object.entries(summary).map(([muscle, data]) => ({

    muscle: muscle as MuscleGroup,

    total: data.total,

    done: data.done,

    left: Math.max(0, data.total - data.done),

  }));

}



function getWorkoutProgressText(sessionList: Exercise[], logs: SetRecord[]) {

  const done = getCompletedExercisesCount(sessionList, logs);

  const total = sessionList.length;

  if (!total) return "עוד לא נבנה אימון";

  return `${done}/${total} תרגילים הושלמו`;

}

function ReacherApp() {

  const [tab, setTab] = useState<MainTab>("dashboard");

  const [selectedDay, setSelectedDay] = useState<DayKey>("sun");

  const [selectedSector, setSelectedSector] = useState<EquipmentSector | "All">("Gym");

  const [selectedMuscle, setSelectedMuscle] = useState<MuscleGroup | "All">("All");

  const [searchText, setSearchText] = useState("");
  const [exercisePreview, setExercisePreview] = useState<Exercise | null>(null);
  const [showSessionQueue, setShowSessionQueue] = useState(false);
  const [nutritionCalendarDate, setNutritionCalendarDate] = useState(() => new Date());
  const [nutritionAiPrompt, setNutritionAiPrompt] = useState("איך לשפר את התזונה שלי להיום?");
  const [nutritionAiReply, setNutritionAiReply] = useState("");

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

  const [userName, setUserName] = useState(() => typeof window === "undefined" ? "" : window.localStorage.getItem("reacher_user_name_v1") || "");

  const [showNamePrompt, setShowNamePrompt] = useState(() => typeof window !== "undefined" && !(window.localStorage.getItem("reacher_user_name_v1") || ""));

  const [quickAddMenuOpen, setQuickAddMenuOpen] = useState(false);

  const [nutritionEntries, setNutritionEntries] = useState<NutritionEntry[]>(() => {

    if (typeof window === "undefined") return [];

    try { return JSON.parse(window.localStorage.getItem("nutrition_entries_v1") || "[]"); } catch { return []; }

  });

  const [waterMl, setWaterMl] = useState<number>(() => typeof window === "undefined" ? 0 : Number(window.localStorage.getItem("water_ml_v1") || 0));

  const [dailySteps, setDailySteps] = useState<number>(() => typeof window === "undefined" ? 4500 : Number(window.localStorage.getItem("daily_steps_v1") || 4500));

  const [bodyMeasurements, setBodyMeasurements] = useState<BodyMeasurement[]>(() => {

    if (typeof window === "undefined") return [];

    try { return JSON.parse(window.localStorage.getItem("body_measurements_v1") || "[]"); } catch { return []; }

  });

  const [bodyPhotos, setBodyPhotos] = useState<BodyPhoto[]>(() => {

    if (typeof window === "undefined") return [];

    try { return JSON.parse(window.localStorage.getItem("body_photos_v1") || "[]"); } catch { return []; }

  });



  const audioCtx = useRef<AudioContext | null>(null);



  const playSoftTones = useCallback((freqs: number[], mode: "nav" | "add" | "save" | "rest" | "finish" = "nav") => {

    if (typeof window === "undefined") return;

    if (!audioCtx.current) audioCtx.current = new AudioContext();

    if (audioCtx.current.state === "suspended") audioCtx.current.resume();



    

const profiles = {

  nav: { type: "triangle" as OscillatorType, attack: 0.01, decay: 0.1, gain: 0.03, step: 0.05 },

  add: { type: "sawtooth" as OscillatorType, attack: 0.02, decay: 0.15, gain: 0.02, step: 0.04 }, // צליל מתכתי

  save: { type: "square" as OscillatorType, attack: 0.005, decay: 0.1, gain: 0.02, step: 0.03 }, // צליל של "קליק" מכני

  rest: { type: "sine" as OscillatorType, attack: 0.1, decay: 0.5, gain: 0.04, step: 0.1 },

  finish: { type: "sawtooth" as OscillatorType, attack: 0.01, decay: 0.4, gain: 0.03, step: 0.06 }, // סיום עוצמתי

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

  useEffect(() => { window.localStorage.setItem("nutrition_entries_v1", JSON.stringify(nutritionEntries)); }, [nutritionEntries]);

  useEffect(() => { window.localStorage.setItem("water_ml_v1", String(waterMl)); }, [waterMl]);

  useEffect(() => { window.localStorage.setItem("daily_steps_v1", String(dailySteps)); }, [dailySteps]);

  useEffect(() => { window.localStorage.setItem("body_measurements_v1", JSON.stringify(bodyMeasurements)); }, [bodyMeasurements]);

  useEffect(() => { window.localStorage.setItem("body_photos_v1", JSON.stringify(bodyPhotos)); }, [bodyPhotos]);

  useEffect(() => { if (userName.trim()) window.localStorage.setItem("reacher_user_name_v1", userName.trim()); }, [userName]);

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



  const nextWorkout = useMemo(() => getNextWorkoutDay(selectedDay), [selectedDay]);

const completedExercises = useMemo(() => getCompletedExercisesCount(sessionList, logs), [sessionList, logs]);

const remainingByMuscle = useMemo(() => getRemainingMuscleGroups(sessionList, logs), [sessionList, logs]);

const workoutProgressText = useMemo(() => getWorkoutProgressText(sessionList, logs), [sessionList, logs]);

  

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

  const totalNutritionCalories = nutritionEntries.reduce((sum, item) => sum + item.calories, 0);

  const totalProtein = nutritionEntries.reduce((sum, item) => sum + item.protein, 0);

  const totalCarbs = nutritionEntries.reduce((sum, item) => sum + item.carbs, 0);

  const totalFat = nutritionEntries.reduce((sum, item) => sum + item.fat, 0);

  const proteinTarget = Math.round((nutritionProfile.weight || 75) * 2);

  const waterTargetMl = Math.round((nutritionProfile.weight || 75) * 35);

  const caloriesPct = recommendedCalories ? Math.min(100, Math.round((totalNutritionCalories / recommendedCalories) * 100)) : 0;

  const waterPct = waterTargetMl ? Math.min(100, Math.round((waterMl / waterTargetMl) * 100)) : 0;

  const nutritionScore = getNutritionProgressScore(nutritionEntries, waterMl, dailySteps, nutritionProfile);

  const welcomeMessage = getWelcomeMessage(nutritionScore, nutritionProfile, history, userName);

  const nextMealLabel = getNextMealLabel(nutritionEntries);

  const todayMeals = nutritionEntries.filter((item) => item.type !== "drink").slice().sort((a, b) => b.createdAt - a.createdAt);

  const latestMeasurement = bodyMeasurements[0];

  const latestPhotos = bodyPhotos.slice(0, 3);
  const mealDates = useMemo(() => new Set(nutritionEntries.map((entry) => formatDayKey(new Date(entry.createdAt)))), [nutritionEntries]);
  const workoutDates = useMemo(() => new Set(history.map((entry) => {
    const parsed = new Date(entry.date);
    return formatDayKey(isNaN(parsed.getTime()) ? new Date() : parsed);
  })), [history]);

  useEffect(() => {
    setNutritionAiReply(generateNutritionCoachReply({
      profile: nutritionProfile,
      calories: totalNutritionCalories,
      targetCalories: recommendedCalories,
      protein: totalProtein,
      proteinTarget,
      waterMl,
      waterTargetMl,
      steps: dailySteps,
      nextMealLabel,
    }));
  }, [nutritionProfile, totalNutritionCalories, recommendedCalories, totalProtein, proteinTarget, waterMl, waterTargetMl, dailySteps, nextMealLabel]);




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



  const addNutritionEntry = (entry: Omit<NutritionEntry, "id" | "createdAt">) => {

    setNutritionEntries((prev) => [{ ...entry, id: Math.random().toString(36).slice(2, 9), createdAt: Date.now() }, ...prev]);

    setToast("נוספה רשומת תזונה חדשה");

  };



  const addWater = (ml: number) => {

    setWaterMl((prev) => prev + ml);

    setToast(`נוספו ${ml} מ״ל מים`);

  };



  const addMeasurement = (measurement: Omit<BodyMeasurement, "id" | "createdAt">) => {

    setBodyMeasurements((prev) => [{ ...measurement, id: Math.random().toString(36).slice(2, 9), createdAt: Date.now() }, ...prev]);

    setToast("נוספה מדידה חדשה");

  };



  const addPhoto = (photo: Omit<BodyPhoto, "id" | "createdAt">) => {

    setBodyPhotos((prev) => [{ ...photo, id: Math.random().toString(36).slice(2, 9), createdAt: Date.now() }, ...prev]);

    setToast("נוספה תמונת גוף חדשה");

  };



  const renderDashboard = () => (

    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">

      <Card className="p-6 bg-gradient-to-r from-teal-500/15 to-indigo-500/10 border-teal-400/20">

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

          <div>

            <div className="text-[10px] uppercase tracking-[0.28em] text-teal-300 mb-2">welcome back</div>

            <h2 className="text-2xl md:text-3xl font-black italic text-white mb-2">{welcomeMessage}</h2>

            <div className="text-slate-300">ציון התזונה שלך כרגע הוא {nutritionScore}/100, עם {history.length} אימונים שמורים ו-{todayMeals.length} ארוחות היום.</div>

          </div>

          <Card className="p-4 bg-black/30 border-white/10 min-w-[180px]"><div className="text-xs text-slate-500 mb-1">Nutrition score</div><div className="text-4xl font-black italic text-teal-400">{nutritionScore}</div></Card>

        </div>

      </Card>

      <div className="grid md:grid-cols-3 gap-4">

  <Card className="p-5">

    <div className="text-[10px] uppercase tracking-[0.25em] text-slate-500 mb-2">

      next workout

    </div>

    <div className="text-2xl font-black italic text-teal-400">{nextWorkout.title}</div>

    <div className="text-sm text-slate-400 mt-2">{nextWorkout.subtitle}</div>

  </Card>



  <Card className="p-5">

    <div className="text-[10px] uppercase tracking-[0.25em] text-slate-500 mb-2">

      workout progress

    </div>

    <div className="text-2xl font-black italic text-amber-400">{workoutProgressText}</div>

    <div className="text-sm text-slate-400 mt-2">

      {sessionList.length ? `נשארו ${Math.max(0, sessionList.length - completedExercises)} תרגילים` : "הוסף תרגילים כדי להתחיל"}

    </div>

  </Card>



  <Card className="p-5">

    <div className="text-[10px] uppercase tracking-[0.25em] text-slate-500 mb-2">

      muscle remaining

    </div>

    <div className="space-y-2">

      {remainingByMuscle.length ? (

        remainingByMuscle.map((item) => (

          <div key={item.muscle} className="flex items-center justify-between text-sm">

            <span className="text-slate-300">{muscleHebrew[item.muscle]}</span>

            <span className="text-teal-300 font-bold">{item.done}/{item.total}</span>

          </div>

        ))

      ) : (

        <div className="text-sm text-slate-400">אין עדיין חלוקת שרירים באימון</div>

      )}

    </div>

  </Card>

</div>

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

                <div className="grid grid-cols-2 gap-3"><Btn variant="premium" className="w-full h-14" onClick={startSession}>התחל אוסף אימון</Btn><Btn variant="outline" className="w-full h-14" onClick={() => setShowSessionQueue(true)}>צפייה באימון</Btn></div>

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

      <div className="grid md:grid-cols-3 gap-4">
        <Card className="p-5">
          <div className="text-[10px] uppercase tracking-[0.25em] text-pink-300 mb-2">next in queue</div>
          <div className="text-2xl font-black italic text-white">{sessionList[0]?.name || "עדיין לא נבחר"}</div>
          <div className="text-sm text-slate-400 mt-2">{sessionList.length ? "התרגיל הבא שנמצא כרגע ברשימת האימון שלך." : "תבחר תרגילים מהמאגר ותבנה לעצמך אימון."}</div>
        </Card>
        <Card className="p-5">
          <div className="text-[10px] uppercase tracking-[0.25em] text-teal-300 mb-2">vault progress</div>
          <div className="flex items-end gap-2">
            <div className="text-3xl font-black italic text-teal-400">{filteredVault.length}</div>
            <div className="text-sm text-slate-400 mb-1">תוצאות פעילות</div>
          </div>
          <div className="mt-4 h-3 rounded-full bg-white/10 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-teal-400 to-cyan-400" style={{ width: `${Math.min(100, Math.max(8, Math.round((filteredVault.length / EXERCISES.length) * 100)))}%` }} />
          </div>
        </Card>
        <Card className="p-5">
          <div className="text-[10px] uppercase tracking-[0.25em] text-amber-300 mb-2">session list</div>
          <div className="text-3xl font-black italic text-amber-400">{sessionList.length}</div>
          <div className="text-sm text-slate-400 mt-2">לחץ כדי לראות את כל רשימת האימון שבנית.</div>
          <Btn variant="outline" className="w-full mt-4" onClick={() => setShowSessionQueue(true)}>צפייה באימון</Btn>
        </Card>
      </div>

      <Card className="p-5">

  <div className="flex items-center justify-between mb-4">

    <div>

      <div className="text-[10px] uppercase tracking-[0.25em] text-teal-400 mb-1">

        quick anatomy filter

      </div>

      <div className="text-2xl font-black italic text-white">בחר שריר מהר</div>

    </div>

    <Btn

      variant="outline"

      className="h-10"

      onClick={() => {

        setSelectedMuscle("All");

        setSelectedSector("All");

      }}

    >

      איפוס

    </Btn>

  </div>



  <BodyMap

    activeMuscle={selectedMuscle}

    onSelect={(muscle) => {

      setSelectedMuscle(muscle);

      setSelectedSector("All");

    }}

  />

</Card>

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

                <Btn variant="outline" onClick={() => setExercisePreview(ex)}><Dumbbell size={15} /> כרטיס תרגיל</Btn>

                <Btn variant="youtube" onClick={() => window.open(ex.videoUrl, "_blank", "noopener,noreferrer")}><Youtube size={15} /> הדרכה</Btn>

                <Btn variant="outline" onClick={() => addExerciseToCustomDay(selectedDay, ex.id)}><CalendarDays size={15} /> הוסף לתכנון שבועי</Btn>

                <Btn variant="outline" className="col-span-2" onClick={() => setAskAIExercise(ex)}><Sparkles size={15} /> askAI</Btn>

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

      <Card className="p-6 bg-gradient-to-r from-teal-500/10 to-cyan-500/10 border-teal-400/20">

        <div className="flex items-center gap-3 mb-4"><Flame className="text-teal-400" /><h2 className="text-3xl md:text-4xl font-black italic">מרכז תזונה חכם</h2></div>

        <div className="text-slate-300 leading-7">{welcomeMessage}</div>

      </Card>



      <Card className="p-6">

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



      <div className="grid md:grid-cols-4 gap-4">

        <Card className="p-5"><div className="text-xs text-slate-500 mb-1">BMI</div><div className="text-3xl font-black italic text-teal-400">{bmi || "-"}</div><div className="text-xs text-slate-400 mt-2">{trainingPlan.bmiNote}</div></Card>

        <Card className="p-5"><div className="text-xs text-slate-500 mb-1">קלוריות יעד</div><div className="text-3xl font-black italic text-amber-400">{recommendedCalories || "-"}</div><div className="text-xs text-slate-400 mt-2">יעד יומי משוער לפי גיל, משקל, גובה ומטרה.</div></Card>

        <Card className="p-5"><div className="text-xs text-slate-500 mb-1">חלבון יעד</div><div className="text-3xl font-black italic text-indigo-400">{proteinTarget}g</div><div className="text-xs text-slate-400 mt-2">כדאי לפזר על פני 3-5 ארוחות ביום.</div></Card>

        <Card className="p-5"><div className="text-xs text-slate-500 mb-1">ציון תזונה</div><div className="text-3xl font-black italic text-cyan-400">{nutritionScore}/100</div><div className="text-xs text-slate-400 mt-2">מבוסס ארוחות, מים, צעדים וחלבון.</div></Card>

      </div>

      <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <div className="text-[10px] uppercase tracking-[0.25em] text-teal-400 mb-1">visual progress</div>
              <div className="text-2xl font-black italic">מעקב עוגות</div>
            </div>
            <Sparkles className="text-teal-400" />
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            <ProgressRing value={totalNutritionCalories} total={recommendedCalories || 1} label="קלוריות" sublabel={`${totalNutritionCalories} / ${recommendedCalories || 0}`} accentClassName="text-amber-400" />
            <ProgressRing value={totalProtein} total={proteinTarget || 1} label="חלבון" sublabel={`${totalProtein} / ${proteinTarget}g`} accentClassName="text-indigo-400" />
            <ProgressRing value={waterMl} total={waterTargetMl || 1} label="מים" sublabel={`${waterMl} / ${waterTargetMl}ml`} accentClassName="text-cyan-400" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4"><Bot className="text-teal-400" /><h3 className="text-2xl font-black italic">AI Nutrition Coach</h3></div>
          <div className="space-y-3">
            <textarea value={nutritionAiPrompt} onChange={(e) => setNutritionAiPrompt(e.target.value)} className="w-full h-24 bg-black/30 border border-white/10 rounded-2xl p-4 outline-none resize-none" />
            <Btn variant="premium" className="w-full" onClick={() => setNutritionAiReply(`${generateNutritionCoachReply({
              profile: nutritionProfile,
              calories: totalNutritionCalories,
              targetCalories: recommendedCalories,
              protein: totalProtein,
              proteinTarget,
              waterMl,
              waterTargetMl,
              steps: dailySteps,
              nextMealLabel,
            })} שאלה: ${nutritionAiPrompt}`)}>קבל תשובת AI</Btn>
            <Card className="p-4 bg-black/30 border-white/5">
              <div className="text-sm leading-7 text-slate-200">{nutritionAiReply}</div>
            </Card>
          </div>
        </Card>
      </div>



      <div className="grid lg:grid-cols-4 gap-4">

        <Card className="p-5 bg-cyan-500/10 border-cyan-400/20"><div className="flex items-center gap-2 mb-3"><Droplets className="text-cyan-300" /><div className="font-black">מים</div></div><div className="text-3xl font-black italic text-cyan-300">{waterMl} ml</div><div className="text-sm text-slate-400 mt-2">יעד: {waterTargetMl} ml, הושלם {waterPct}%</div><Btn variant="outline" className="w-full mt-4" onClick={() => addWater(250)}>+ 250 מ״ל</Btn></Card>

        <Card className="p-5 bg-emerald-500/10 border-emerald-400/20"><div className="flex items-center gap-2 mb-3"><Footprints className="text-emerald-300" /><div className="font-black">צעדים</div></div><div className="text-3xl font-black italic text-emerald-300">{dailySteps}</div><div className="text-sm text-slate-400 mt-2">מטרה: {cardioPlan.walkingSteps}</div><Btn variant="outline" className="w-full mt-4" onClick={() => setDailySteps((prev) => prev + 1000)}>+ 1000</Btn></Card>

        <Card className="p-5 bg-orange-500/10 border-orange-400/20"><div className="flex items-center gap-2 mb-3"><UtensilsCrossed className="text-orange-300" /><div className="font-black">ארוחה הבאה</div></div><div className="text-2xl font-black italic text-orange-300">{nextMealLabel}</div><div className="text-sm text-slate-400 mt-2">לפי הרישום של היום</div></Card>

        <Card className="p-5 bg-violet-500/10 border-violet-400/20"><div className="flex items-center gap-2 mb-3"><Target className="text-violet-300" /><div className="font-black">קלוריות היום</div></div><div className="text-3xl font-black italic text-violet-300">{totalNutritionCalories}</div><div className="text-sm text-slate-400 mt-2">{caloriesPct}% מהיעד</div></Card>

      </div>



      <div className="grid lg:grid-cols-3 gap-6">

        <Card className="p-6">

          <div className="flex items-center justify-between mb-4"><h3 className="text-2xl font-black italic">מאקרו</h3><Cpu className="text-teal-400" /></div>

          <div className="space-y-3">

            <div className="flex justify-between"><span>חלבון</span><span className="font-black text-indigo-300">{totalProtein}g</span></div>

            <div className="flex justify-between"><span>פחמימות</span><span className="font-black text-amber-300">{totalCarbs}g</span></div>

            <div className="flex justify-between"><span>שומן</span><span className="font-black text-rose-300">{totalFat}g</span></div>

          </div>

          <div className="mt-4 h-3 rounded-full bg-white/10 overflow-hidden"><div className="h-full bg-gradient-to-r from-teal-400 to-cyan-400" style={{ width: `${caloriesPct}%` }} /></div>

        </Card>

        <Card className="p-6">

          <div className="flex items-center gap-3 mb-4"><Dumbbell className="text-teal-400" /><h3 className="text-2xl font-black italic">כמה אימונים בשבוע</h3></div>

          <div className="text-slate-100 text-xl font-black italic mb-3">{trainingPlan.weeklyStrength}</div>

          <div className="text-slate-300 leading-relaxed">{trainingPlan.focus}</div>

        </Card>

        <Card className="p-6">

          <div className="flex items-center gap-3 mb-4"><HeartPulse className="text-rose-400" /><h3 className="text-2xl font-black italic">אירובי</h3></div>

          <div className="text-slate-300 leading-relaxed">{trainingPlan.cardio}</div>

        </Card>

      </div>



      <div className="grid lg:grid-cols-2 gap-6">

        <Card className="p-6">

          <div className="flex items-center justify-between mb-4"><h3 className="text-2xl font-black italic">ארוחות היום</h3><CalendarDays className="text-teal-400" /></div>

          <div className="space-y-3">{todayMeals.length ? todayMeals.map((entry) => <div key={entry.id} className="bg-black/30 border border-white/5 rounded-2xl p-4 flex gap-3">{entry.imageUrl ? <SafeImage src={entry.imageUrl} alt={entry.title} className="w-16 h-16 rounded-2xl object-cover" /> : <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center"><UtensilsCrossed className="text-teal-300" /></div>}<div className="flex-1"><div className="font-black italic">{entry.title}</div><div className="text-sm text-slate-400">{entry.mealLabel}</div><div className="text-xs text-slate-300 mt-1">{entry.calories} קלוריות · {entry.protein} חלבון · {entry.carbs} פחמימות · {entry.fat} שומן</div></div><button onClick={() => setNutritionEntries((prev) => prev.filter((item) => item.id !== entry.id))} className="text-rose-400"><Trash2 size={16} /></button></div>) : <div className="text-slate-400">עדיין אין ארוחות שמורות להיום.</div>}</div>

        </Card>



        <Card className="p-6">

          <div className="flex items-center gap-3 mb-4"><Weight className="text-amber-400" /><h3 className="text-2xl font-black italic">בניית תפריט יומי</h3></div>

          <div className="space-y-3">{APEX_MEALS[nutritionProfile.goal].map((meal) => <div key={meal} className="bg-black/30 border border-white/5 rounded-2xl px-4 py-3 text-slate-200">{meal}</div>)}</div>

          <div className="mt-6 flex items-center gap-3"><Btn variant="premium" onClick={() => setQuickAddMenuOpen(true)}><Plus size={16} /> הוספה מהירה</Btn></div>

        </Card>

      </div>



      <div className="grid lg:grid-cols-2 gap-6">

        <Card className="p-6"><div className="flex items-center justify-between mb-4"><h3 className="text-2xl font-black italic">מדידה אחרונה</h3><Ruler className="text-amber-400" /></div>{latestMeasurement ? <div className="grid grid-cols-2 gap-3 text-sm">{latestMeasurement.weight && <div className="bg-black/30 rounded-2xl p-4">משקל: <span className="font-black">{latestMeasurement.weight}</span></div>}{latestMeasurement.waist && <div className="bg-black/30 rounded-2xl p-4">מותן: <span className="font-black">{latestMeasurement.waist}</span></div>}{latestMeasurement.chest && <div className="bg-black/30 rounded-2xl p-4">חזה: <span className="font-black">{latestMeasurement.chest}</span></div>}{latestMeasurement.arm && <div className="bg-black/30 rounded-2xl p-4">יד: <span className="font-black">{latestMeasurement.arm}</span></div>}{latestMeasurement.thigh && <div className="bg-black/30 rounded-2xl p-4">ירך: <span className="font-black">{latestMeasurement.thigh}</span></div>}</div> : <div className="text-slate-400">אין מדידות עדיין.</div>}</Card>

        <Card className="p-6"><div className="flex items-center justify-between mb-4"><h3 className="text-2xl font-black italic">תמונות גוף</h3><Camera className="text-pink-400" /></div><div className="grid grid-cols-3 gap-3">{latestPhotos.length ? latestPhotos.map((photo) => <div key={photo.id} className="space-y-2"><SafeImage src={photo.imageUrl} alt={photo.note || "body progress"} className="w-full h-28 rounded-2xl object-cover" /><div className="text-xs text-slate-400">{photo.note || "ללא הערה"}</div></div>) : <div className="text-slate-400 col-span-3">אין תמונות גוף עדיין.</div>}</div></Card>

      </div>



      <NutritionCalendarCard
        baseDate={nutritionCalendarDate}
        onPrev={() => setNutritionCalendarDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))}
        onNext={() => setNutritionCalendarDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))}
        mealDates={mealDates}
        workoutDates={workoutDates}
      />

      <Card className="p-6">

        <div className="flex items-center gap-3 mb-4"><Cpu className="text-teal-400" /><h3 className="text-2xl font-black italic">המלצות AI</h3></div>

        <div className="space-y-3">{NUTRITION_SUGGESTIONS[nutritionProfile.goal].map((tip) => <div key={tip} className="bg-black/30 border border-white/5 rounded-2xl px-4 py-3 text-slate-200">{tip}</div>)}</div>

      </Card>

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



    <AnimatePresence>

      {toast && (

        <motion.div

          initial={{ opacity: 0, y: 20 }}

          animate={{ opacity: 1, y: 0 }}

          exit={{ opacity: 0, y: 20 }}

          className="fixed top-6 left-1/2 -translate-x-1/2 z-[900] bg-slate-900/95 border border-teal-500/30 rounded-[1.2rem] px-5 py-3 text-white"

        >

          <div className="flex items-center gap-2">

            <CheckCircle2 size={16} className="text-teal-400" />

            <span className="font-bold">{toast}</span>

          </div>

        </motion.div>

      )}

    </AnimatePresence>



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

    {exercisePreview && (
      <ExercisePreviewModal
        exercise={exercisePreview}
        logs={logs}
        onClose={() => setExercisePreview(null)}
        onAdd={() => {
          addExerciseToSession(exercisePreview);
          setExercisePreview(null);
        }}
      />
    )}

    <SessionQueueModal
      open={showSessionQueue}
      exercises={sessionList}
      logs={logs}
      onClose={() => setShowSessionQueue(false)}
      onRemove={(index) => setSessionList((prev) => prev.filter((_, idx) => idx !== index))}
    />

    <QuickAddNutritionModal

      open={quickAddMenuOpen}

      onClose={() => setQuickAddMenuOpen(false)}

      onAddEntry={addNutritionEntry}

      onAddWater={addWater}

      onAddMeasurement={addMeasurement}

      onAddPhoto={addPhoto}

    />



    <AnimatePresence>

      {showNamePrompt && (

        <motion.div

          initial={{ opacity: 0 }}

          animate={{ opacity: 1 }}

          exit={{ opacity: 0 }}

          className="fixed inset-0 z-[950] bg-black/80 backdrop-blur-md flex items-center justify-center p-4"

        >

          <motion.div

            initial={{ scale: 0.9, y: 20 }}

            animate={{ scale: 1, y: 0 }}

            className="w-full max-w-md bg-slate-900 border border-white/10 rounded-[2rem] p-6"

          >

<div className="text-2xl font-bold text-white mb-2">ברוך הבא</div>

<div className="text-sm font-medium text-slate-400 mb-6">איך לקרוא לך באפליקציה?</div>

          <input

  value={userName}

  onChange={(e) => setUserName(e.target.value)}

  onKeyDown={(e) => {

    if (e.key === "Enter" && userName.trim()) {

      localStorage.setItem("reacher_user_name_v1", userName.trim());

      setShowNamePrompt(false);

    }

  }}

  placeholder="השם שלך"

  className="w-full h-12 bg-black/30 border border-white/10 rounded-2xl px-4 outline-none 

             text-teal-400                

             placeholder:text-slate-500      

             text-right                   

             caret-teal-400               

             mb-4 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 transition-all"

/>

            <Btn

              variant="premium"

              className={`w-full ${!userName.trim() ? "opacity-50 cursor-not-allowed" : ""}`}

              disabled={!userName.trim()}

              onClick={() => {

                if (!userName.trim()) return;

                localStorage.setItem("reacher_user_name_v1", userName.trim());

                setShowNamePrompt(false);

              }}

            >

              שמור

            </Btn>

          </motion.div>

        </motion.div>

      )}

    </AnimatePresence>



    <div className="min-h-screen bg-[#020617] text-slate-100 overflow-x-hidden" dir="rtl">

      <div className="fixed inset-0 pointer-events-none z-0">

        <div className="absolute top-[-20%] left-[-10%] w-full h-full bg-teal-500/5 blur-[150px] rounded-full animate-pulse" />

        <div className="absolute bottom-[-20%] right-[-10%] w-full h-full bg-indigo-500/5 blur-[150px] rounded-full" />

      </div>



      <header className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 pt-8 md:pt-12 pb-6 md:pb-8 flex flex-col lg:flex-row justify-between items-start gap-6">

        <div className="space-y-3">

          <div className="flex flex-wrap items-center gap-3">

            <LogoMark />

            <h1 className="text-[2.2rem] sm:text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-none break-words">

              Betesh<span className="text-teal-500">Training</span>

            </h1>

          </div>

          <div className="text-slate-400 font-bold text-xs sm:text-sm max-w-full">

            Training, nutrition, cardio, recovery, progression.

          </div>

        </div>



        <div className="flex flex-wrap gap-3">

          <Btn variant={tabButtonVariant(tab, "dashboard")} onClick={() => navigateTab("dashboard")}>

            <Home size={16} /> בית

          </Btn>

          <Btn variant={tabButtonVariant(tab, "vault")} onClick={() => navigateTab("vault")}>

            <Dumbbell size={16} /> מאגר תרגילים

          </Btn>

          <Btn variant={tabButtonVariant(tab, "stats")} onClick={() => navigateTab("stats")}>

            <BarChart3 size={16} /> ביצועים

          </Btn>

          <Btn variant={tabButtonVariant(tab, "nutrition")} onClick={() => navigateTab("nutrition")}>

            <UtensilsCrossed size={16} /> תזונה

          </Btn>

          <Btn variant={tabButtonVariant(tab, "cardio")} onClick={() => navigateTab("cardio")}>

            <Footprints size={16} /> אירובי

          </Btn>

          <Btn

            variant="youtube"

            onClick={() => window.open("https://www.youtube.com/", "_blank", "noopener,noreferrer")}

          >

            <Youtube size={16} /> YouTube

          </Btn>

          <Btn

            variant="spotify"

            onClick={() => window.open("https://open.spotify.com/", "_blank", "noopener,noreferrer")}

          >

            <SpotifyIcon className="w-4 h-4" /> ספוטיפיי

          </Btn>

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

        <motion.div

          initial={{ y: 100 }}

          animate={{ y: 0 }}

          className="bg-[#0f172a]/90 backdrop-blur-3xl border border-white/10 p-3 md:p-5 rounded-[2rem] md:rounded-[3rem] flex justify-around items-center shadow-[0_40px_100px_rgba(0,0,0,0.9)]"

        >

          {[

            {

              id: "dashboard",

              icon: Home,

              active: "bg-emerald-500 text-slate-950 shadow-[0_0_30px_rgba(34,197,94,0.45)]",

            },

            {

              id: "vault",

              icon: Dumbbell,

              active: "bg-pink-500 text-white shadow-[0_0_30px_rgba(236,72,153,0.45)]",

            },

            {

              id: "stats",

              icon: BarChart3,

              active: "bg-gradient-to-r from-violet-500 to-cyan-500 text-white shadow-[0_0_30px_rgba(6,182,212,0.45)]",

            },

            {

              id: "nutrition",

              icon: UtensilsCrossed,

              active: "bg-teal-500 text-slate-950 shadow-[0_0_30px_rgba(20,184,166,0.45)]",

            },

            {

              id: "cardio",

              icon: Footprints,

              active: "bg-orange-500 text-white shadow-[0_0_30px_rgba(249,115,22,0.45)]",

            },

          ].map((item) => (

            <button

              key={item.id}

              onClick={() => navigateTab(item.id as MainTab)}

              className={`px-3 py-2 md:px-4 md:py-3 rounded-[1.2rem] transition-all duration-500 relative flex flex-col items-center gap-1 min-w-[64px] ${

                tab === item.id ? `${item.active} scale-110` : "text-slate-600 hover:text-white"

              }`}

            >

              <item.icon size={22} />
              <span className="text-[11px] font-bold">
                {item.id === "dashboard" ? "בית" : item.id === "vault" ? "מאגר" : item.id === "stats" ? "ביצועים" : item.id === "nutrition" ? "תזונה" : "אירובי"}
              </span>

            </button>

          ))}

        </motion.div>

      </div>

    </div>

  </>

);

}

export default ReacherApp;
