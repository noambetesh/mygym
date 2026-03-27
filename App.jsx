import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { createRoot } from "react-dom/client";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play, Pause, RotateCcw, SkipForward, SkipBack, Dumbbell, Flame, Clock3,
  CheckCircle2, Youtube, TimerReset, Volume2, VolumeX, Home, ListChecks,
  Swords, Trophy, Settings2, Activity, CalendarDays, Weight, Eye,
  Bot, Sparkles, X, Send, MessageCircle, ExternalLink, TrendingUp, RefreshCcw, Bell, AlertTriangle, FlameKindle, Plus
} from "lucide-react";

// ==========================================
// 1. INLINE UI COMPONENTS (Zero External Dependencies)
// ==========================================
const Card = ({ className, children }: any) => <div className={`bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden ${className || ''}`}>{children}</div>;
const CardHeader = ({ className, children }: any) => <div className={className?.includes('p-') ? className : `p-6 pb-2 ${className || ''}`}>{children}</div>;
const CardTitle = ({ className, children }: any) => <h3 className={`text-xl font-bold ${className || ''}`}>{children}</h3>;
const CardDescription = ({ className, children }: any) => <p className={`text-sm text-zinc-400 ${className || ''}`}>{children}</p>;
const CardContent = ({ className, children }: any) => <div className={className?.includes('p-') ? className : `p-6 ${className || ''}`}>{children}</div>;

const Button = React.forwardRef(({ className, variant = 'default', size = 'default', asChild, ...props }: any, ref: any) => {
  const base = "inline-flex items-center justify-center font-bold transition-all focus:outline-none disabled:opacity-50 disabled:pointer-events-none cursor-pointer";
  const variants: any = {
    default: "bg-zinc-100 text-zinc-950 hover:bg-white",
    outline: "border border-zinc-700 bg-transparent hover:bg-zinc-800 text-zinc-100",
    ghost: "bg-transparent hover:bg-zinc-800 text-zinc-100",
    destructive: "bg-red-900/40 text-red-400 hover:bg-red-900/60 border border-red-900/50",
    secondary: "bg-zinc-800 text-zinc-100 hover:bg-zinc-700",
    link: "text-indigo-400 hover:underline bg-transparent"
  };
  const sizes: any = {
    default: "h-10 px-4 py-2 rounded-xl",
    sm: "h-9 px-3 rounded-lg text-sm",
    lg: "h-14 px-8 rounded-2xl text-lg",
    icon: "h-10 w-10 rounded-full flex items-center justify-center shrink-0"
  };
  if (asChild) {
    const child = React.Children.only(props.children);
    return React.cloneElement(child, {
      ref,
      ...props,
      className: `${base} ${variants[variant] || variants.default} ${sizes[size] || sizes.default} ${className || ''} ${child.props.className || ''}`,
    });
  }
  return <button ref={ref} className={`${base} ${variants[variant] || variants.default} ${sizes[size] || sizes.default} ${className || ''}`} {...props} />;
});

const Badge = ({ className, variant = 'default', children }: any) => {
  const base = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold transition-colors";
  const variants: any = {
    default: "bg-zinc-100 text-zinc-950",
    secondary: "bg-zinc-800 text-zinc-200",
    outline: "border border-zinc-700 text-zinc-300"
  };
  return <div className={`${base} ${variants[variant] || variants.default} ${className || ''}`}>{children}</div>;
};

const Input = React.forwardRef(({ className, ...props }: any, ref: any) => (
  <input ref={ref} className={`flex h-10 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500 disabled:opacity-50 ${className || ''}`} {...props} />
));

const Switch = ({ checked, onCheckedChange }: any) => (
  <button type="button" role="switch" aria-checked={checked} onClick={() => onCheckedChange(!checked)} className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus:outline-none ${checked ? 'bg-indigo-600' : 'bg-zinc-700'}`}>
    <span className={`pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg transition-transform ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
  </button>
);

const Progress = ({ value, className }: any) => (
  <div className={`relative h-2 w-full overflow-hidden rounded-full bg-zinc-800 ${className || ''}`}>
    <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${Math.max(0, Math.min(100, value || 0))}%` }} />
  </div>
);

const Slider = ({ value, min, max, step, onValueChange, className }: any) => (
  <input type="range" min={min} max={max} step={step} value={value[0]} onChange={(e) => onValueChange([parseFloat(e.target.value)])} className={`w-full accent-indigo-500 ${className || ''}`} />
);

const ScrollArea = ({ className, children }: any) => <div className={`overflow-y-auto overflow-x-hidden ${className || ''}`}>{children}</div>;


// ==========================================
// 2. CORE TYPES & DATA
// ==========================================
type MuscleGroup = "Back" | "Chest" | "Legs" | "Shoulders" | "Arms" | "Core" | "FullBody";

type Exercise = {
  id: string;
  name: string;
  sets: number;
  reps: string;
  he: string;
  work: number;
  rest: number;
  category: "pull" | "push" | "legs" | "armor" | "power" | "core" | "bonus";
  muscleGroup: MuscleGroup;
};

type DayPlan = {
  key: string;
  title: string;
  subtitle: string;
  focusHe: string;
  accent: string;
  accentSoft: string;
  exercises: Exercise[];
  bonus: Omit<Exercise, "sets" | "reps" | "work" | "rest">[];
};

type SetRecord = {
  weight: number;
  reps: number;
  rpe: number;
  isWarmup: boolean;
  date: number; // timestamp
};

const imageByMuscle: Record<MuscleGroup, string> = {
  Back: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop",
  Chest: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=800&auto=format&fit=crop",
  Legs: "https://images.unsplash.com/photo-1434682881908-b43d0467b798?q=80&w=800&auto=format&fit=crop",
  Shoulders: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800&auto=format&fit=crop",
  Arms: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=800&auto=format&fit=crop",
  Core: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=800&auto=format&fit=crop",
  FullBody: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=800&auto=format&fit=crop",
};

const initialDays: DayPlan[] =[
  {
    key: "day1",
    title: "Day 1 - Pull",
    subtitle: "Back & Biceps",
    focusHe: "מיקוד: עובי גב, לטים, גב עליון ושיא בייספס",
    accent: "from-red-600 via-red-900 to-zinc-950",
    accentSoft: "bg-red-500/15 text-red-200 border-red-500/30",
    exercises:[
      { id: "e1", name: "Meadows Row", sets: 4, reps: "10-12", he: "עמידה צידית, משוך לכיוון האגן כדי להעמיס על הגב והלטים.", work: 45, rest: 75, category: "pull", muscleGroup: "Back" },
      { id: "e2", name: "Single-Arm Iliac Lat Pulldown", sets: 4, reps: "12", he: "מתיחה מלאה למעלה, סיים עם מרפק צמוד לאגן.", work: 40, rest: 70, category: "pull", muscleGroup: "Back" },
      { id: "e3", name: "Chest-Supported T-Bar Row", sets: 3, reps: "10", he: "חזה נתמך, מניעת מומנטום, כיווץ חזק בשכמות.", work: 40, rest: 75, category: "pull", muscleGroup: "Back" },
      { id: "e4", name: "Weighted Pull-Ups", sets: 4, reps: "6-8", he: "ירידה מלאה ועלייה חזקה בלי קפיצה.", work: 35, rest: 90, category: "pull", muscleGroup: "Back" },
      { id: "e5", name: "Bayesian Cable Curls", sets: 3, reps: "12-15", he: "גב אל הכבל, מתיחה עמוקה לבייספס בסוף התנועה.", work: 35, rest: 60, category: "pull", muscleGroup: "Arms" },
      { id: "e6", name: "Zottman Curls", sets: 3, reps: "12", he: "עלייה רגילה, ירידה באחיזה הפוכה כדי לעבוד גם על האמה.", work: 35, rest: 60, category: "pull", muscleGroup: "Arms" },
    ],
    bonus:[
      { id: "b1", name: "Straight-Arm Pulldown", he: "חיבור חזק ללטים.", category: "bonus", muscleGroup: "Back" },
      { id: "b2", name: "Preacher Curl", he: "בידוד חזק לבייספס.", category: "bonus", muscleGroup: "Arms" },
    ],
  },
  {
    key: "day2",
    title: "Day 2 - Push",
    subtitle: "Chest & Triceps",
    focusHe: "מיקוד: חזה עליון, כוח בלחיצות ומסת טריספס",
    accent: "from-blue-600 via-blue-900 to-zinc-950",
    accentSoft: "bg-blue-500/15 text-blue-200 border-blue-500/30",
    exercises:[
      { id: "e7", name: "Low-Incline DB Press", sets: 4, reps: "8-10", he: "שיפוע עדין (15-30 מעלות), ירידה עמוקה לחזה עליון.", work: 40, rest: 90, category: "push", muscleGroup: "Chest" },
      { id: "e8", name: "Converging Chest Press Machine", sets: 3, reps: "10-12", he: "טווח מלא, דגש על קירוב הידיים בסוף התנועה.", work: 40, rest: 75, category: "push", muscleGroup: "Chest" },
      { id: "e9", name: "Cable Crossover (Mid-to-Low)", sets: 3, reps: "12-15", he: "מתיחה מבוקרת וכיווץ חזק לחזה תחתון/אמצעי.", work: 35, rest: 65, category: "push", muscleGroup: "Chest" },
      { id: "e10", name: "JM Press", sets: 3, reps: "8-10", he: "שילוב לחיצה צרה ופשיטת מרפקים לכוח בטריספס.", work: 40, rest: 80, category: "push", muscleGroup: "Arms" },
      { id: "e11", name: "Katana / Overhead Cable Extension", sets: 3, reps: "12-15", he: "מעולה לראש הארוך של הטריספס בפוזיציה מתוחה.", work: 35, rest: 60, category: "push", muscleGroup: "Arms" },
      { id: "e12", name: "Weighted Dips", sets: 3, reps: "8-10", he: "הטיה קלה קדימה לחזה או גוף זקוף לטריספס.", work: 40, rest: 90, category: "push", muscleGroup: "Chest" },
    ],
    bonus:[
      { id: "b3", name: "Pec Deck Fly", he: "כיווץ מבודד לחזה.", category: "bonus", muscleGroup: "Chest" },
      { id: "b4", name: "Rope Pushdown", he: "פינישר לטריספס.", category: "bonus", muscleGroup: "Arms" },
    ],
  },
  {
    key: "day3",
    title: "Day 3 - Legs & Abs",
    subtitle: "Quads, Glutes & Core",
    focusHe: "מיקוד: קוואדס, שרשרת אחורית וליבה חזקה",
    accent: "from-emerald-600 via-emerald-900 to-zinc-950",
    accentSoft: "bg-emerald-500/15 text-emerald-200 border-emerald-500/30",
    exercises:[
      { id: "e13", name: "Zercher Squat", sets: 4, reps: "8-10", he: "טורסו זקוף, עומס עצום על הקוואדס והליבה.", work: 45, rest: 120, category: "legs", muscleGroup: "Legs" },
      { id: "e14", name: "Bulgarian Split Squat", sets: 3, reps: "8-10/leg", he: "ירידה עמוקה, רגל קדמית עושה את כל העבודה.", work: 45, rest: 90, category: "legs", muscleGroup: "Legs" },
      { id: "e15", name: "Kas Glute Bridge", sets: 3, reps: "10-12", he: "טווח תנועה קצר יותר מהיפ טראסט, דגש נקי על ישבן.", work: 45, rest: 90, category: "legs", muscleGroup: "Legs" },
      { id: "e16", name: "Nordic Hamstring Curl", sets: 3, reps: "5-8", he: "בלימה אקסצנטרית איטית, פצצה להמסטרינג.", work: 30, rest: 90, category: "legs", muscleGroup: "Legs" },
      { id: "e17", name: "Hanging Leg Raises", sets: 3, reps: "12-15", he: "הבאת האגן כלפי מעלה, לא רק את הרגליים.", work: 35, rest: 60, category: "core", muscleGroup: "Core" },
      { id: "e18", name: "Cable Crunches", sets: 3, reps: "15", he: "משקל כבד, כיווץ נקי של שרירי הבטן.", work: 35, rest: 60, category: "core", muscleGroup: "Core" },
    ],
    bonus:[
      { id: "b5", name: "Seated Calf Raise", he: "לשריר הסוליה בשוקיים.", category: "bonus", muscleGroup: "Legs" },
      { id: "b6", name: "Decline Russian Twist", he: "ליבה ואלכסונים.", category: "bonus", muscleGroup: "Core" },
    ],
  },
  {
    key: "day4",
    title: "Day 4 - Armor",
    subtitle: "Shoulders, Upper Back & Neck",
    focusHe: "מיקוד: כתפיים רחבות (3D), טרפזים ויציבה",
    accent: "from-violet-600 via-violet-900 to-zinc-950",
    accentSoft: "bg-violet-500/15 text-violet-200 border-violet-500/30",
    exercises:[
      { id: "e19", name: "Z-Press / Seated DB Press", sets: 4, reps: "8-10", he: "ישיבה על הרצפה נטולת תמיכה - כוח כתפיים וליבה נקי.", work: 40, rest: 90, category: "armor", muscleGroup: "Shoulders" },
      { id: "e20", name: "Cable Lateral Raises", sets: 4, reps: "12-15", he: "הכבל שומר על מתח רציף לאורך כל התנועה (לכתף אמצעית).", work: 40, rest: 60, category: "armor", muscleGroup: "Shoulders" },
      { id: "e21", name: "Lu Raises", sets: 3, reps: "12", he: "הרמה צידית מלאה עד למעלה, פיתוח כתף וטרפז עליון.", work: 35, rest: 65, category: "armor", muscleGroup: "Shoulders" },
      { id: "e22", name: "Chest-Supported Rear Delt Row", sets: 3, reps: "12-15", he: "משיכה גבוהה עם מרפקים החוצה לכתף אחורית.", work: 35, rest: 60, category: "armor", muscleGroup: "Shoulders" },
      { id: "e23", name: "Heavy DB Shrugs", sets: 4, reps: "10-12", he: "החזקה של שנייה בשיא הכיווץ.", work: 35, rest: 70, category: "armor", muscleGroup: "Back" },
      { id: "e24", name: "Neck Extensions", sets: 3, reps: "15-20", he: "חיזוק צוואר לבניית מראה יציב ופציעות פחותות.", work: 35, rest: 55, category: "armor", muscleGroup: "Back" },
    ],
    bonus:[
      { id: "b7", name: "Face Pulls", he: "מרפקים גבוהים, בריאות כתף.", category: "bonus", muscleGroup: "Shoulders" },
      { id: "b8", name: "Upright Row", he: "כתף אמצעית וטרפזים.", category: "bonus", muscleGroup: "Shoulders" },
    ],
  },
  {
    key: "day5",
    title: "Day 5 - Power",
    subtitle: "Explosiveness & Full Body",
    focusHe: "מיקוד: כוח מתפרץ, אחיזה, ועבודה כלל-גופית",
    accent: "from-amber-600 via-amber-900 to-zinc-950",
    accentSoft: "bg-amber-500/15 text-amber-200 border-amber-500/30",
    exercises:[
      { id: "e25", name: "Landmine Thrusters", sets: 4, reps: "8-10", he: "סקוואט ודחיפה מתפרצת בתנועה אחת.", work: 45, rest: 90, category: "power", muscleGroup: "FullBody" },
      { id: "e26", name: "Farmer's Walk", sets: 3, reps: "40m", he: "משקל כבד, צעדים קצרים, מבט קדימה. מחזק אחיזה וליבה.", work: 45, rest: 90, category: "power", muscleGroup: "FullBody" },
      { id: "e27", name: "Renegade Row", sets: 3, reps: "10/arm", he: "פוש-אפ + חתירה. שמור על אגן יציב ללא סיבוב.", work: 45, rest: 75, category: "power", muscleGroup: "FullBody" },
      { id: "e28", name: "Heavy Barbell Curl", sets: 3, reps: "6-8", he: "כפיפת מרפקים כבדה לבניית מאסה בסיסית.", work: 35, rest: 75, category: "power", muscleGroup: "Arms" },
      { id: "e29", name: "Reverse EZ Bar Curl", sets: 3, reps: "10-12", he: "אחיזה הפוכה לחיזוק ברכיאליס ואמות.", work: 35, rest: 60, category: "power", muscleGroup: "Arms" },
      { id: "e30", name: "Medicine Ball Slams", sets: 3, reps: "10-12", he: "הטחה אגרסיבית בעזרת כל הגוף לפריקת אנרגיה.", work: 30, rest: 60, category: "power", muscleGroup: "FullBody" },
    ],
    bonus:[
      { id: "b9", name: "Sled Push", he: "סיבולת וכוח רגליים.", category: "bonus", muscleGroup: "Legs" },
      { id: "b10", name: "Kettlebell Swings", he: "היפ הינג' מתפרץ.", category: "bonus", muscleGroup: "Legs" },
    ],
  },
];

const allExercisesPool = initialDays.flatMap(d => d.exercises);
const iconByCategory = { pull: Dumbbell, push: Flame, legs: Trophy, armor: Swords, power: Activity, core: CheckCircle2, bonus: CheckCircle2 };

// ==========================================
// 3. CUSTOM HOOKS
// ==========================================
function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(error);
    }
  };
  return [storedValue, setValue] as const;
}

function useAudioBeep() {
  const ctxRef = useRef<AudioContext | null>(null);
  const initAudio = useCallback(() => {
    if (!ctxRef.current && typeof window !== "undefined") {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) { ctxRef.current = new AudioCtx(); }
    }
    if (ctxRef.current?.state === 'suspended') { ctxRef.current.resume(); }
  },[]);
  const playBeep = useCallback(() => {
    if (!ctxRef.current) return;
    const ctx = ctxRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = 880;
    gain.gain.setValueAtTime(0.02, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  },[]);
  return { initAudio, playBeep };
}

function useWakeLock(active: boolean) {
  const wakeLockRef = useRef<any>(null);
  useEffect(() => {
    if (typeof navigator === 'undefined' || !('wakeLock' in navigator)) return;
    const requestLock = async () => {
      try { wakeLockRef.current = await (navigator as any).wakeLock.request('screen'); } 
      catch (err) { console.error("Wake Lock error:", err); }
    };
    const releaseLock = async () => {
      if (wakeLockRef.current) { await wakeLockRef.current.release(); wakeLockRef.current = null; }
    };
    if (active) requestLock(); else releaseLock();
    return () => { releaseLock(); };
  }, [active]);
}

function usePushNotifications() {
  const [enabled, setEnabled] = useLocalStorage("reacher_notifications", false);
  const requestPermission = async () => {
    if (!("Notification" in window)) return false;
    if (Notification.permission === "granted") { setEnabled(true); return true; }
    const perm = await Notification.requestPermission();
    const isGranted = perm === "granted";
    setEnabled(isGranted);
    return isGranted;
  };
  const notify = useCallback((title: string, body: string) => {
    if (enabled && "Notification" in window && Notification.permission === "granted") {
      new Notification(title, { body, icon: "/favicon.ico" });
    }
  }, [enabled]);
  return { enabled, requestPermission, notify };
}

function formatTime(total: number) {
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function youtubeUrl(name: string) {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(`${name} proper form workout`)}`;
}

// ==========================================
// 4. AI COACH COMPONENT
// ==========================================
function AiCoachModal({ exercise, apiKey, onClose }: { exercise: Exercise, apiKey: string, onClose: () => void }) {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<{role: 'user'|'ai', text: string}[]>([
    { role: 'ai', text: `מאמן ה-AI איתך! מטרה: מבנה של ריצ'ר. מה הבעיה עם ${exercise.name}?` }
  ]);

  const quickPrompts =[
    { label: "כואב לי המפרק", icon: AlertTriangle, prompt: `כשאני עושה את התרגיל הזה כואב לי המפרק (כתף/מרפק/ברך). מהן הטעויות הנפוצות ביציבה שגורמות לזה, ואיך לתקן עכשיו?` },
    { label: "לא מרגיש תשריר", icon: Sparkles, prompt: `אני לא מצליח להרגיש את השריר המטרה עובד. איך לשפר את הקשר מוח-שריר כאן ולבודד אותו למקסימום היפרטרופיה?` },
    { label: "גרסת משקולות חופשיות", icon: RefreshCcw, prompt: `אני רוצה להחליף את זה למשקולות חופשיות כדי לגייס יותר סיבי שריר. מה התחליף המדויק הכי טוב לזה?` }
  ];

  const handleFallback = () => {
    const prompt = `אני מתאמן על ${exercise.name} ומכוון למבנה גוף מאסיבי ופונקציונלי (בסגנון ריצ'ר). תן לי דגשים לטכניקה נכונה, העדפה למשקולות חופשיות, וטיפ מקצועני אחד בעברית.`;
    navigator.clipboard.writeText(prompt).then(() => {
       window.open("https://gemini.google.com/app", "_blank");
    });
  };

  const askGemini = async (text: string) => {
    if (!text.trim()) return;
    setChatHistory(prev => [...prev, { role: 'user', text }]);
    setQuestion("");
    setLoading(true);
  
    try {
      const prompt = `You are an elite bodybuilding coach. The user wants a physique like 'Reacher' (massive, functional). Focus on: Maximum recruitment, free weights over machines, and biomechanical cues. 
      The user is asking about: ${exercise.name}. 
      Question: ${text}. 
      Answer in HEBREW, be concise (3 short sentences max), and provide one high-level 'Pro-Tip' for muscle growth. No asterisks or formatting.`;
  
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents:[{ parts: [{ text: prompt }] }] })
      });
  
      const data = await res.json();
      if (data.error) throw new Error(data.error.message);
      const answer = data.candidates[0].content.parts[0].text;
      setChatHistory(prev =>[...prev, { role: 'ai', text: answer }]);
    } catch (e: any) {
      setChatHistory(prev =>[...prev, { role: 'ai', text: `שגיאה בחיבור: ${e.message}` }]);
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} 
                  className="bg-zinc-900 border border-zinc-700 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[85vh] max-h-[700px]">
        <div className="bg-gradient-to-r from-indigo-900 to-zinc-900 p-4 border-b border-zinc-800 flex justify-between items-center">
          <div className="flex items-center gap-3">
             <div className="bg-indigo-500/20 p-2 rounded-full border border-indigo-500/30"><Bot className="h-6 w-6 text-indigo-400" /></div>
             <div>
               <h3 className="font-bold text-lg text-white">Reacher AI Coach <Sparkles className="inline w-4 h-4 text-amber-400 mb-1" /></h3>
               <p className="text-xs text-indigo-200">{exercise.name}</p>
             </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-zinc-400 hover:text-white"><X className="h-5 w-5"/></Button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4" dir="rtl">
          {!apiKey ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6 px-4">
               <Bot className="h-16 w-16 text-zinc-600 mb-2" />
               <div>
                  <h4 className="text-xl font-bold mb-2">חסר מפתח AI</h4>
                  <p className="text-zinc-400 text-sm leading-relaxed">להפעלה ישירה מכאן, יש להזין מפתח AI של גוגל בהגדרות.</p>
               </div>
               <Button onClick={handleFallback} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl h-12 font-bold text-lg">
                  <ExternalLink className="ml-2 w-5 h-5" /> פתח את ג'מיני לשאלה
               </Button>
            </div>
          ) : (
            <>
              {chatHistory.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed shadow-md ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-br-sm' : 'bg-zinc-800 border border-zinc-700 text-zinc-200 rounded-bl-sm'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-end">
                   <div className="bg-zinc-800 border border-zinc-700 text-zinc-400 p-3 rounded-2xl rounded-bl-sm text-sm flex gap-1">
                     <span className="animate-bounce">.</span><span className="animate-bounce delay-75">.</span><span className="animate-bounce delay-150">.</span>
                   </div>
                </div>
              )}
            </>
          )}
        </div>

        {apiKey && (
          <div className="p-4 border-t border-zinc-800 bg-zinc-950 flex flex-col gap-3" dir="rtl">
             <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
               {quickPrompts.map((qp, idx) => {
                 const Icon = qp.icon;
                 return (
                   <button key={idx} onClick={() => askGemini(qp.prompt)} className="whitespace-nowrap flex items-center gap-1.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 px-3 py-1.5 rounded-full text-xs text-zinc-300 transition-colors">
                     <Icon className="w-3.5 h-3.5 text-indigo-400" /> {qp.label}
                   </button>
                 );
               })}
             </div>
             <div className="flex gap-2">
                <Button onClick={() => askGemini(question)} disabled={loading || !question.trim()} className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl px-4">
                  <Send className="w-5 h-5" />
                </Button>
                <Input 
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && askGemini(question)}
                  placeholder="הקלד שאלה חופשית..." 
                  className="flex-1 text-right"
                />
             </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}

// ==========================================
// 5. MAIN APP COMPONENT
// ==========================================
function ReacherApp() {
  const[screen, setScreen] = useState<"home" | "day" | "live" | "analytics" | "settings">("home");
  const [viewMode, setViewMode] = useState<"days" | "muscles">("days");
  
  const [exerciseHistory, setExerciseHistory] = useLocalStorage<Record<string, SetRecord[]>>("reacher_history", {});
  const [swaps, setSwaps] = useLocalStorage<Record<string, string>>("reacher_swaps", {});
  const[weeklyProgress, setWeeklyProgress] = useLocalStorage<Record<string, boolean>>("reacher_weekly", {});
  const[geminiApiKey, setGeminiApiKey] = useLocalStorage<string>("reacher_gemini_api_key", "");
  
  const [soundOn, setSoundOn] = useLocalStorage("reacher_sound", true);
  const [autoAdvance, setAutoAdvance] = useLocalStorage("reacher_auto", true);
  const [globalWorkAdjust, setGlobalWorkAdjust] = useLocalStorage("reacher_work_adj", 100);
  const [globalRestAdjust, setGlobalRestAdjust] = useLocalStorage("reacher_rest_adj", 100);

  const { initAudio, playBeep } = useAudioBeep();
  const { enabled: pushEnabled, requestPermission, notify } = usePushNotifications();
  
  const [selectedDayKey, setSelectedDayKey] = useState(initialDays[0].key);
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const[setIndex, setSetIndex] = useState(0);
  const [phase, setPhase] = useState<"work" | "rest" | "done">("work");
  const [running, setRunning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const[targetTime, setTargetTime] = useState<number | null>(null);
  
  const [currentWeight, setCurrentWeight] = useState<string>("");
  const [currentReps, setCurrentReps] = useState<string>("");
  const [currentRpe, setCurrentRpe] = useState<number>(8);
  const[isWarmup, setIsWarmup] = useState(false);

  const[aiExerciseToAsk, setAiExerciseToAsk] = useState<Exercise | null>(null);
  const [swapExerciseOrigin, setSwapExerciseOrigin] = useState<Exercise | null>(null);

  useWakeLock(running);

  const days = useMemo(() => {
    return initialDays.map(day => ({
      ...day,
      exercises: day.exercises.map(ex => {
        const swappedId = swaps[ex.id];
        if (swappedId) {
          const alternative = allExercisesPool.find(e => e.id === swappedId);
          if (alternative) return { ...alternative, originalIdForSwap: ex.id };
        }
        return ex;
      })
    }));
  }, [swaps]);

  const selectedDay = useMemo(() => days.find((d) => d.key === selectedDayKey) ?? days[0],[days, selectedDayKey]);
  const liveExercise = selectedDay.exercises[exerciseIndex];
  
  const previousSetRecord = useMemo(() => {
    if (!liveExercise) return null;
    const history = exerciseHistory[liveExercise.id] ||[];
    const workingSets = history.filter(h => !h.isWarmup).sort((a,b) => b.date - a.date);
    return workingSets.length > 0 ? workingSets[0] : null;
  }, [liveExercise, exerciseHistory]);

  useEffect(() => {
    if (previousSetRecord) {
      setCurrentWeight(previousSetRecord.weight.toString());
      setCurrentReps(previousSetRecord.reps.toString());
      setCurrentRpe(previousSetRecord.rpe);
    } else {
      setCurrentWeight(""); setCurrentReps(""); setCurrentRpe(8);
    }
    setIsWarmup(false);
  }, [liveExercise?.id]);

  function adjustedWork(ex: Exercise) { return Math.max(10, Math.round((ex.work * globalWorkAdjust) / 100)); }
  function adjustedRest(ex: Exercise) { return Math.max(10, Math.round((ex.rest * globalRestAdjust) / 100)); }

  useEffect(() => {
    if (!running || targetTime === null) return;
    const interval = setInterval(() => {
      const now = Date.now();
      const remaining = Math.max(0, Math.ceil((targetTime - now) / 1000));
      setSecondsLeft(remaining);
      
      if (remaining <= 0) {
        clearInterval(interval);
        if (soundOn) playBeep();
        if (phase === "rest" && pushEnabled) notify("Time to lift!", `Rest is over. Get ready for ${liveExercise?.name}`);
        if (autoAdvance) setTimeout(() => handleNextStep(), 100); else setRunning(false);
      }
    }, 100);
    return () => clearInterval(interval);
  },[running, targetTime, autoAdvance, soundOn, phase, liveExercise, pushEnabled, notify]);

  const saveCurrentSetToHistory = (exId: string) => {
    const w = parseFloat(currentWeight) || 0;
    const r = parseInt(currentReps) || parseInt(liveExercise?.reps.split('-')[0]) || 0;
    const record: SetRecord = { weight: w, reps: r, rpe: currentRpe, isWarmup, date: Date.now() };
    setExerciseHistory(prev => ({ ...prev, [exId]:[...(prev[exId] ||[]), record] }));
  };

  const handleNextStep = useCallback(() => {
    setExerciseIndex((currExIdx) => {
      setSetIndex((currSetIdx) => {
        const ex = selectedDay.exercises[currExIdx];
        if (!ex) return currSetIdx;

        if (phase === "work") {
          saveCurrentSetToHistory(ex.id);
          if (isWarmup) {
            setPhase("rest");
            const restTime = adjustedRest(ex) * 0.7;
            setSecondsLeft(restTime);
            setIsWarmup(false);
            if (running || autoAdvance) setTargetTime(Date.now() + restTime * 1000);
            return currSetIdx; 
          }

          const isLastSet = currSetIdx + 1 >= ex.sets;
          if (isLastSet) {
            const isLastExercise = currExIdx + 1 >= selectedDay.exercises.length;
            if (isLastExercise) {
              setPhase("done");
              setRunning(false);
              setTargetTime(null);
              const weekKey = getCurrentWeekKey();
              setWeeklyProgress(prev => ({ ...prev,[`${weekKey}-${selectedDay.key}`]: true }));
              return currSetIdx;
            }
          }
          setPhase("rest");
          const restTime = adjustedRest(ex);
          setSecondsLeft(restTime);
          if (running || autoAdvance) setTargetTime(Date.now() + restTime * 1000);
          return currSetIdx;
        } 
        
        const isLastSet = currSetIdx + 1 >= ex.sets;
        if (isLastSet) {
          const nextEx = selectedDay.exercises[currExIdx + 1];
          setPhase("work");
          const workTime = adjustedWork(nextEx);
          setSecondsLeft(workTime);
          if (running || autoAdvance) setTargetTime(Date.now() + workTime * 1000);
          return 0; 
        } else {
          setPhase("work");
          const workTime = adjustedWork(ex);
          setSecondsLeft(workTime);
          if (running || autoAdvance) setTargetTime(Date.now() + workTime * 1000);
          return currSetIdx + 1;
        }
      });
      
      if (phase === "rest") {
        const isLastSet = setIndex + 1 >= selectedDay.exercises[currExIdx].sets;
        if (isLastSet) return currExIdx + 1;
      }
      return currExIdx;
    });
  },[phase, selectedDay, running, autoAdvance, setIndex, isWarmup, currentWeight, currentReps, currentRpe]);

  function previousStep() {
    setRunning(false);
    setTargetTime(null);
    if (phase === "rest") {
      setPhase("work");
      setSecondsLeft(adjustedWork(selectedDay.exercises[exerciseIndex]));
      return;
    }
    if (setIndex > 0) {
      setSetIndex((s) => s - 1);
      setSecondsLeft(adjustedWork(selectedDay.exercises[exerciseIndex]));
      return;
    }
    if (exerciseIndex > 0) {
      const prevEx = selectedDay.exercises[exerciseIndex - 1];
      setExerciseIndex((i) => i - 1);
      setSetIndex(prevEx.sets - 1);
      setPhase("work");
      setSecondsLeft(adjustedWork(prevEx));
    }
  }

  function startLive(dayKey = selectedDay.key, overrideExIdx = 0) {
    initAudio();
    if (pushEnabled) requestPermission();
    setSelectedDayKey(dayKey);
    setExerciseIndex(overrideExIdx);
    setSetIndex(0);
    const day = days.find((d) => d.key === dayKey) ?? days[0];
    const firstEx = day.exercises[overrideExIdx] || day.exercises[0];
    setPhase("work");
    const workTime = adjustedWork(firstEx);
    setSecondsLeft(workTime);
    setScreen("live");
    
    setTimeout(() => {
      setRunning(true);
      setTargetTime(Date.now() + workTime * 1000);
    }, 400);
  }

  function togglePlayPause() {
    initAudio();
    if (running) {
      setRunning(false);
      setTargetTime(null);
    } else {
      if (pushEnabled) requestPermission();
      setRunning(true);
      setTargetTime(Date.now() + secondsLeft * 1000);
    }
  }

  const getCurrentWeekKey = () => {
    const d = new Date();
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay()||7));
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
    const weekNo = Math.ceil(( ( (d.getTime() - yearStart.getTime()) / 86400000) + 1)/7);
    return `${d.getUTCFullYear()}-W${weekNo}`;
  };

  const analyticsData = useMemo(() => {
     const counts = Object.entries(exerciseHistory).map(([id, records]) => ({ id, count: records.length, maxWeight: Math.max(...records.map(r=>r.weight)) }));
     counts.sort((a,b) => b.count - a.count);
     const topIds = counts.slice(0, 5).map(c => c.id);
     
     return topIds.map(id => {
       const ex = allExercisesPool.find(e => e.id === id);
       const records = exerciseHistory[id].filter(r=>!r.isWarmup).sort((a,b)=>a.date - b.date);
       const firstW = records[0]?.weight || 0;
       const lastW = records[records.length - 1]?.weight || 0;
       const progressPercent = firstW > 0 ? ((lastW - firstW) / firstW) * 100 : 0;
       return { name: ex?.name || id, firstW, lastW, progressPercent, muscle: ex?.muscleGroup };
     });
  }, [exerciseHistory]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 font-sans selection:bg-zinc-800 relative pb-10">
      <AnimatePresence>
        {aiExerciseToAsk && <AiCoachModal exercise={aiExerciseToAsk} apiKey={geminiApiKey} onClose={() => setAiExerciseToAsk(null)} />}
      </AnimatePresence>

      <AnimatePresence>
        {swapExerciseOrigin && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-zinc-900 border border-zinc-700 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl p-6">
               <div className="flex justify-between items-center mb-6">
                 <h3 className="text-xl font-bold">Swap Exercise</h3>
                 <Button variant="ghost" size="icon" onClick={() => setSwapExerciseOrigin(null)}><X className="h-5 w-5"/></Button>
               </div>
               <p className="text-sm text-zinc-400 mb-4">Select an alternative for <strong className="text-white">{swapExerciseOrigin.name}</strong> ({swapExerciseOrigin.muscleGroup}):</p>
               <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                 {allExercisesPool.filter(e => e.muscleGroup === swapExerciseOrigin.muscleGroup && e.id !== swapExerciseOrigin.id).map(alt => (
                   <div key={alt.id} className="bg-zinc-950 border border-zinc-800 p-4 rounded-2xl flex justify-between items-center hover:border-zinc-600 transition-colors">
                      <div>
                        <div className="font-bold">{alt.name}</div>
                        <div className="text-xs text-zinc-500">{alt.category.toUpperCase()}</div>
                      </div>
                      <Button size="sm" className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg" onClick={() => {
                        const origId = (swapExerciseOrigin as any).originalIdForSwap || swapExerciseOrigin.id;
                        setSwaps(prev => ({ ...prev, [origId]: alt.id }));
                        setSwapExerciseOrigin(null);
                      }}>Select</Button>
                   </div>
                 ))}
                 <Button variant="outline" className="w-full mt-4 text-red-400 hover:bg-red-900/20" onClick={() => {
                    const origId = (swapExerciseOrigin as any).originalIdForSwap || swapExerciseOrigin.id;
                    const newSwaps = {...swaps}; delete newSwaps[origId]; setSwaps(newSwaps);
                    setSwapExerciseOrigin(null);
                 }}>Revert to Original</Button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="mx-auto max-w-7xl p-4 md:p-6 lg:p-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 overflow-hidden rounded-[2rem] border border-zinc-800/60 bg-zinc-900/40 p-6 md:p-8 backdrop-blur-xl shadow-2xl">
            <div>
              <div className="mb-4 flex items-center gap-2 flex-wrap">
                <Badge variant="outline" className="border-indigo-500/30 bg-indigo-500/10 text-indigo-300 backdrop-blur-md"><Sparkles className="w-3 h-3 mr-1 inline" /> Beast Mode</Badge>
                <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-emerald-300 backdrop-blur-md"><TrendingUp className="w-3 h-3 mr-1 inline" /> Overload Tracked</Badge>
              </div>
              <h1 className="text-4xl md:text-6xl font-black tracking-tight bg-gradient-to-br from-white to-zinc-500 bg-clip-text text-transparent">Reacher.</h1>
              <p dir="rtl" className="mt-3 max-w-xl text-lg text-zinc-400 font-medium">תכנית היפרטרופיה מתקדמת. עוקב אחרי משקלים, RPE, מנתח התקדמות, ומאמן אותך בזמן אמת.</p>
            </div>
            <div className="flex flex-col gap-3 min-w-[200px]">
              <div className="flex items-center justify-between text-sm font-semibold text-zinc-400"><span>Weekly Streak</span><CalendarDays className="h-4 w-4" /></div>
              <div className="flex gap-2">
                {initialDays.map(d => {
                  const isDone = weeklyProgress[`${getCurrentWeekKey()}-${d.key}`];
                  return (
                    <div key={d.key} className={`h-10 w-10 flex items-center justify-center rounded-xl border ${isDone ? 'border-emerald-500/50 bg-emerald-500/20 text-emerald-400' : 'border-zinc-800 bg-zinc-950/50 text-zinc-600'}`}>
                      {isDone ? <CheckCircle2 className="h-5 w-5" /> : <span className="text-xs font-bold">{d.key.replace('day', '')}</span>}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>

        {/* --- CUSTOM NAVIGATION (Replaces Radix Tabs) --- */}
        <div className="grid h-auto w-full max-w-3xl grid-cols-5 gap-1 rounded-2xl border border-zinc-800/60 bg-zinc-900/40 p-1.5 backdrop-blur-xl mb-8 overflow-x-auto">
          {[
            { id: "home", icon: Home, label: "Home" },
            { id: "day", icon: ListChecks, label: "Routine" },
            { id: "live", icon: Play, label: "Live" },
            { id: "analytics", icon: TrendingUp, label: "Stats" },
            { id: "settings", icon: Settings2, label: "Settings" }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = screen === tab.id;
            return (
              <button key={tab.id} onClick={() => setScreen(tab.id as any)} className={`rounded-xl py-3 flex items-center justify-center transition-all text-xs sm:text-sm font-bold min-w-[65px] ${isActive ? 'bg-zinc-800 text-white shadow-lg' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'}`}>
                <Icon className="sm:mr-2 h-4 w-4 shrink-0" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* HOME SCREEN */}
        {screen === "home" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-zinc-900/40 border border-zinc-800/60 p-2 rounded-2xl backdrop-blur-md max-w-[280px]">
              <Button variant={viewMode === 'days' ? 'default' : 'ghost'} className={`w-1/2 rounded-xl ${viewMode === 'days' ? 'bg-zinc-800 text-white' : 'text-zinc-400'}`} onClick={() => setViewMode('days')}>By Days</Button>
              <Button variant={viewMode === 'muscles' ? 'default' : 'ghost'} className={`w-1/2 rounded-xl ${viewMode === 'muscles' ? 'bg-zinc-800 text-white' : 'text-zinc-400'}`} onClick={() => setViewMode('muscles')}>By Muscle</Button>
            </div>
            <AnimatePresence mode="wait">
              {viewMode === "days" ? (
                <motion.div key="days" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {days.map((day) => (
                    <Card key={day.key} className="group overflow-hidden rounded-3xl border-zinc-800/60 bg-zinc-900/40 backdrop-blur-xl hover:border-zinc-700 transition-colors">
                      <div className={`h-32 bg-gradient-to-br ${day.accent} p-6 relative overflow-hidden`}>
                        <div className="absolute inset-0 bg-black/20" />
                        <div className="relative z-10 flex items-start justify-between">
                          <div>
                            <div className="text-xs font-bold uppercase tracking-widest text-white/70">{day.key}</div>
                            <div className="mt-1 text-3xl font-black text-white">{day.title.split('-')[1]}</div>
                            <div className="mt-1 font-medium text-white/80">{day.subtitle}</div>
                          </div>
                        </div>
                      </div>
                      <CardContent>
                        <p dir="rtl" className="text-right text-sm leading-relaxed text-zinc-400 mb-5 h-10">{day.focusHe}</p>
                        <div className="grid grid-cols-2 gap-3">
                          <Button className="w-full text-zinc-950 font-bold" onClick={() => { setSelectedDayKey(day.key); setScreen("day"); }}>View Details</Button>
                          <Button variant="outline" className="w-full font-bold" onClick={() => startLive(day.key)}>Start Live</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </motion.div>
              ) : (
                <motion.div key="muscles" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {Object.keys(imageByMuscle).map((muscle) => {
                     const exs = allExercisesPool.filter(e => e.muscleGroup === muscle);
                     if(exs.length === 0) return null;
                     return (
                        <Card key={muscle} className="overflow-hidden rounded-3xl border-zinc-800/60 bg-zinc-900/40 backdrop-blur-xl">
                          <div className="h-40 relative">
                             <img src={imageByMuscle[muscle as MuscleGroup]} alt={muscle} className="w-full h-full object-cover opacity-60" />
                             <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent p-6 flex flex-col justify-end">
                                <h2 className="text-3xl font-black text-white">{muscle}</h2>
                                <p className="text-zinc-300 font-medium">{exs.length} Exercises available</p>
                             </div>
                          </div>
                        </Card>
                     );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* DAY / ROUTINE SCREEN */}
        {screen === "day" && (
          <div className="space-y-6">
            <ScrollArea className="w-full pb-4">
              <div className="flex gap-3 min-w-max">
                {days.map((day) => (
                  <Button key={day.key} variant={selectedDayKey === day.key ? "default" : "outline"} className={`rounded-xl px-6 ${selectedDayKey === day.key ? `bg-gradient-to-r ${day.accent} border-none` : 'border-zinc-800 bg-zinc-900/50'}`} onClick={() => setSelectedDayKey(day.key)}>{day.title}</Button>
                ))}
              </div>
            </ScrollArea>
            <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold">Main Routine</h3>
                  <Button className="rounded-xl font-bold text-zinc-950" onClick={() => startLive(selectedDay.key)}><Play className="mr-2 h-4 w-4" /> Start Day</Button>
                </div>
                <div className="space-y-4">
                  {selectedDay.exercises.map((ex, idx) => {
                    const Icon = iconByCategory[ex.category];
                    const hist = exerciseHistory[ex.id];
                    const maxW = hist ? Math.max(...hist.map(h => h.weight)) : 0;
                    return (
                      <Card key={ex.id} className="overflow-hidden rounded-3xl border-zinc-800/60 bg-zinc-900/40 backdrop-blur-md hover:bg-zinc-900/60 transition-colors">
                        <CardContent className="p-0">
                          <div className="grid sm:grid-cols-[180px_1fr] h-full">
                            <div className="h-40 sm:h-full relative overflow-hidden border-r border-zinc-800/50">
                              <img src={imageByMuscle[ex.muscleGroup]} alt={ex.name} className="w-full h-full object-cover opacity-70" />
                              <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md border border-white/10 flex items-center gap-1.5">
                                <Icon className="h-3.5 w-3.5 text-zinc-300" /><span className="text-xs font-bold uppercase">{ex.category}</span>
                              </div>
                            </div>
                            <div className="p-5 flex flex-col justify-between">
                               <div>
                                 <div className="flex justify-between items-start mb-1">
                                    <h4 className="text-xl font-bold">{ex.name}</h4><span className="text-2xl font-black text-zinc-700">0{idx+1}</span>
                                 </div>
                                 <p dir="rtl" className="text-right text-sm text-zinc-400 mb-4">{ex.he}</p>
                               </div>
                               <div className="flex flex-wrap items-center gap-3">
                                  <Badge variant="secondary">{ex.sets} Sets × {ex.reps}</Badge>
                                  {maxW > 0 && <Badge className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"><TrendingUp className="mr-1.5 h-3 w-3" /> PR: {maxW}kg</Badge>}
                                  <div className="flex-1" />
                                  <Button variant="ghost" size="icon" onClick={() => setSwapExerciseOrigin(ex)}><RefreshCcw className="h-4 w-4" /></Button>
                                  <Button variant="ghost" size="icon" className="text-indigo-400 border border-indigo-500/30" onClick={() => setAiExerciseToAsk(ex)}><Bot className="h-4 w-4" /></Button>
                                  <Button variant="secondary" size="sm" onClick={() => startLive(selectedDay.key, idx)}>Go Live</Button>
                               </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
              <div className="space-y-6">
                <Card className="rounded-3xl border-zinc-800/60 bg-zinc-900/40 backdrop-blur-xl overflow-hidden">
                  <div className={`h-2 bg-gradient-to-r ${selectedDay.accent}`} />
                  <CardHeader><CardTitle>Bonus Details</CardTitle></CardHeader>
                  <CardContent className="space-y-3">
                    {selectedDay.bonus.map((bonus) => (
                      <div key={bonus.id} className="group relative rounded-2xl border border-zinc-800/60 bg-zinc-950/50 p-4">
                        <div className="flex justify-between items-start"><div className="font-bold text-lg">{bonus.name}</div><Badge variant="outline">{bonus.muscleGroup}</Badge></div>
                        <p dir="rtl" className="text-right text-sm text-zinc-400 mt-2">{bonus.he}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* LIVE WORKOUT SCREEN */}
        {screen === "live" && (
          <div className="space-y-6">
            <AnimatePresence mode="wait">
              {phase === "done" ? (
                <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex min-h-[60vh] flex-col items-center justify-center">
                  <div className="relative mb-8">
                     <div className="absolute inset-0 bg-emerald-500 blur-[80px] opacity-20 rounded-full" />
                     <CheckCircle2 className="relative h-32 w-32 text-emerald-400 drop-shadow-2xl" />
                  </div>
                  <h2 className="text-6xl font-black mb-4 tracking-tight">BEAST.</h2>
                  <p dir="rtl" className="text-xl text-zinc-400 max-w-lg text-center leading-relaxed">אימון מטורף. כל הסטים הושלמו. תתאושש טוב, תאכל חלבון, ונראה אותך באימון הבא.</p>
                  <Button size="lg" className="mt-10 font-bold text-zinc-950" onClick={() => setScreen("home")}>Finish Session</Button>
                </motion.div>
              ) : (
                <motion.div key="live-player" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid gap-6 lg:grid-cols-[1fr_450px]">
                  <div className="space-y-6">
                    <Card className="overflow-hidden rounded-[2.5rem] border-zinc-800/60 bg-zinc-900/60 shadow-2xl backdrop-blur-xl relative">
                      <div className="absolute top-0 left-0 w-full h-1">
                         <div className={`h-full bg-gradient-to-r ${selectedDay.accent} transition-all duration-500`} style={{ width: `${((setIndex + (exerciseIndex * 10)) / (selectedDay.exercises.length * 10)) * 100}%` }} />
                      </div>
                      <CardContent className="p-6 md:p-12">
                        <div className="flex justify-between items-center mb-6">
                           <Badge variant="outline" className="bg-zinc-950/50 py-1.5 px-4 rounded-full">{selectedDay.title}</Badge>
                           <Badge className={`py-1.5 px-4 rounded-full font-bold ${phase === "work" ? "bg-red-500/20 text-red-400 border border-red-500/30" : "bg-blue-500/20 text-blue-400 border border-blue-500/30"}`}>
                             {phase === "work" ? "WORK PHASE" : "REST PHASE"}
                           </Badge>
                        </div>
                        <div className="text-center mb-8 relative">
                          <div className="flex items-center justify-center gap-4 mb-4">
                             <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight">{liveExercise?.name}</h2>
                             <Button variant="ghost" size="icon" className="shrink-0" onClick={() => setSwapExerciseOrigin(liveExercise)}><RefreshCcw className="h-5 w-5" /></Button>
                          </div>
                          <p dir="rtl" className="text-lg text-zinc-400 max-w-2xl mx-auto">{liveExercise?.he}</p>
                          <Button variant="outline" size="sm" className="mt-4 rounded-full border-indigo-500/30 text-indigo-300" onClick={() => setAiExerciseToAsk(liveExercise)}>
                             <Sparkles className="w-4 h-4 mr-2" /> Ask Coach
                          </Button>
                        </div>
                        <div className="grid grid-cols-2 gap-4 md:gap-8 mb-8">
                          <div className="bg-zinc-950/50 rounded-[2rem] p-6 text-center border border-zinc-800/50 relative">
                             {isWarmup && <Badge className="absolute top-0 right-0 -mt-2 -mr-2 bg-amber-500 text-amber-950">Warmup</Badge>}
                             <div className="text-zinc-500 font-bold mb-2 uppercase tracking-widest text-sm">Current Set</div>
                             <div className="text-5xl md:text-6xl font-black">{setIndex + 1}<span className="text-3xl text-zinc-600">/{liveExercise?.sets}</span></div>
                          </div>
                          <div className={`rounded-[2rem] p-6 text-center border ${phase === 'work' ? 'bg-red-950/30 border-red-900/50' : 'bg-blue-950/30 border-blue-900/50'}`}>
                             <div className="text-zinc-500 font-bold mb-2 uppercase tracking-widest text-sm">Timer</div>
                             <div className={`text-5xl md:text-6xl font-black tabular-nums ${phase === 'work' ? 'text-red-400' : 'text-blue-400'}`}>{formatTime(secondsLeft)}</div>
                          </div>
                        </div>
                        <div className="bg-zinc-950/80 rounded-[2rem] p-6 border border-zinc-800">
                           <div className="flex justify-between items-center mb-4 text-sm">
                              <span className="font-bold text-zinc-300 flex items-center gap-2"><FlameKindle className="w-4 h-4 text-amber-500"/> Log Set</span>
                              {previousSetRecord && <span className="text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">Last: {previousSetRecord.weight}kg × {previousSetRecord.reps}</span>}
                           </div>
                           <div className="grid grid-cols-3 gap-3 mb-6">
                              <div><label className="text-xs text-zinc-500 mb-1 block">Weight</label><Input type="number" value={currentWeight} onChange={e=>setCurrentWeight(e.target.value)} className="text-center font-bold" /></div>
                              <div><label className="text-xs text-zinc-500 mb-1 block">Reps</label><Input type="number" value={currentReps} onChange={e=>setCurrentReps(e.target.value)} className="text-center font-bold" /></div>
                              <div><label className="text-xs text-zinc-500 mb-1 flex justify-between"><span>RPE</span><span>{currentRpe}/10</span></label><Slider value={[currentRpe]} min={5} max={10} step={0.5} onValueChange={(v)=>setCurrentRpe(v[0])} className="mt-3"/></div>
                           </div>
                           <div className="flex gap-3">
                             <Button size="lg" className="flex-1 text-zinc-950" onClick={handleNextStep}><CheckCircle2 className="w-5 h-5 mr-2"/> Log & Next</Button>
                             <Button size="lg" variant="outline" className={isWarmup ? 'bg-amber-500/20 text-amber-400 border-amber-500/50' : 'text-zinc-400'} onClick={() => setIsWarmup(!isWarmup)}><Flame className="w-5 h-5 mr-2"/> Warmup</Button>
                           </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="space-y-6">
                    <Card className="rounded-3xl border-zinc-800/60 bg-zinc-900/40 backdrop-blur-xl">
                      <CardHeader className="pb-4"><CardTitle className="text-lg flex items-center gap-2"><Clock3 className="h-5 w-5 text-zinc-400" /> Controls</CardTitle></CardHeader>
                      <CardContent className="space-y-4">
                         <Button variant={running ? "destructive" : "default"} className="w-full text-zinc-950" onClick={togglePlayPause}>
                             {running ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />} {running ? "Pause" : "Resume"}
                         </Button>
                         <div className="flex justify-between items-center bg-zinc-950/50 p-3 rounded-xl border border-zinc-800">
                            <div className="font-bold text-sm">Auto-Advance</div><Switch checked={autoAdvance} onCheckedChange={setAutoAdvance} />
                         </div>
                         <Button variant="outline" className="w-full" onClick={previousStep}><SkipBack className="mr-2 h-4 w-4" /> Go Back</Button>
                      </CardContent>
                    </Card>
                    <Card className="rounded-3xl border-zinc-800/60 bg-zinc-900/40 backdrop-blur-xl flex-1 max-h-[300px] flex flex-col">
                      <CardHeader className="pb-2"><CardTitle className="text-lg">History</CardTitle></CardHeader>
                      <CardContent className="overflow-y-auto flex-1 space-y-2 pb-4">
                         {exerciseHistory[liveExercise?.id] ? [...exerciseHistory[liveExercise.id]].reverse().map((record, i) => (
                             <div key={i} className={`flex justify-between items-center p-3 rounded-lg border ${record.isWarmup ? 'border-amber-900/30 bg-amber-950/10' : 'border-zinc-800 bg-zinc-950/50'}`}>
                               <div className="text-sm"><span className="text-zinc-500 block text-xs">{new Date(record.date).toLocaleDateString()}</span><span className="font-bold">{record.weight}kg × {record.reps}</span></div>
                               <div>{record.isWarmup ? <Badge variant="outline" className="text-amber-500">Warmup</Badge> : <Badge variant="outline">RPE {record.rpe}</Badge>}</div>
                             </div>
                         )) : <div className="text-zinc-500 text-sm italic text-center py-4">No logged sets yet.</div>}
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* ANALYTICS SCREEN */}
        {screen === "analytics" && (
          <div className="grid gap-6 md:grid-cols-2">
             <Card className="rounded-3xl border-zinc-800/60 bg-zinc-900/40 backdrop-blur-xl">
                <CardHeader><CardTitle className="flex items-center gap-2"><Trendin
