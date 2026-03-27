import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { createRoot } from "react-dom/client";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play, Pause, RotateCcw, SkipForward, SkipBack, Dumbbell, Flame, Clock3,
  CheckCircle2, Youtube, TimerReset, Volume2, VolumeX, Home, ListChecks,
  Swords, Trophy, Settings2, Activity, CalendarDays, Weight, Eye,
  Bot, Sparkles, X, Send, MessageCircle, ExternalLink, TrendingUp, RefreshCcw, Bell, AlertTriangle, FlameKindle, Plus
} from "lucide-react";

// --- UI COMPONENTS ---
const Card = ({ className, children }: any) => <div className={`bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden ${className || ''}`}>{children}</div>;
const CardHeader = ({ className, children }: any) => <div className={className?.includes('p-') ? className : `p-6 pb-2 ${className || ''}`}>{children}</div>;
const CardTitle = ({ className, children }: any) => <h3 className={`text-xl font-bold ${className || ''}`}>{children}</h3>;
const CardDescription = ({ className, children }: any) => <p className={`text-sm text-zinc-400 ${className || ''}`}>{children}</p>;
const CardContent = ({ className, children }: any) => <div className={className?.includes('p-') ? className : `p-6 ${className || ''}`}>{children}</div>;

const Button = React.forwardRef(({ className, variant = 'default', size = 'default', asChild, ...props }: any, ref: any) => {
  const base = "inline-flex items-center justify-center font-bold transition-all focus:outline-none disabled:opacity-50 disabled:pointer-events-none cursor-pointer";
  const variants: any = { default: "bg-zinc-100 text-zinc-950 hover:bg-white", outline: "border border-zinc-700 bg-transparent hover:bg-zinc-800 text-zinc-100", ghost: "bg-transparent hover:bg-zinc-800 text-zinc-100", destructive: "bg-red-900/40 text-red-400 hover:bg-red-900/60 border border-red-900/50", secondary: "bg-zinc-800 text-zinc-100 hover:bg-zinc-700", link: "text-indigo-400 hover:underline bg-transparent" };
  const sizes: any = { default: "h-10 px-4 py-2 rounded-xl", sm: "h-9 px-3 rounded-lg text-sm", lg: "h-14 px-8 rounded-2xl text-lg", icon: "h-10 w-10 rounded-full flex items-center justify-center shrink-0" };
  if (asChild) {
    const child = React.Children.only(props.children);
    return React.cloneElement(child, { ref, ...props, className: `${base} ${variants[variant] || variants.default} ${sizes[size] || sizes.default} ${className || ''} ${child.props.className || ''}` });
  }
  return <button ref={ref} className={`${base} ${variants[variant] || variants.default} ${sizes[size] || sizes.default} ${className || ''}`} {...props} />;
});

const Badge = ({ className, variant = 'default', children }: any) => {
  const base = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold transition-colors";
  const variants: any = { default: "bg-zinc-100 text-zinc-950", secondary: "bg-zinc-800 text-zinc-200", outline: "border border-zinc-700 text-zinc-300" };
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

// --- TYPES ---
type MuscleGroup = "Back" | "Chest" | "Legs" | "Shoulders" | "Arms" | "Core" | "FullBody";
type Exercise = { id: string; name: string; sets: number; reps: string; he: string; work: number; rest: number; category: "pull" | "push" | "legs" | "armor" | "power" | "core" | "bonus"; muscleGroup: MuscleGroup; };
type DayPlan = { key: string; title: string; subtitle: string; focusHe: string; accent: string; accentSoft: string; exercises: Exercise[]; bonus: Omit<Exercise, "sets" | "reps" | "work" | "rest">[]; };
type SetRecord = { weight: number; reps: number; rpe: number; isWarmup: boolean; date: number; };

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
  { key: "day1", title: "Day 1 - Pull", subtitle: "Back & Biceps", focusHe: "מיקוד: עובי גב, לטים, גב עליון ושיא בייספס", accent: "from-red-600 via-red-900 to-zinc-950", accentSoft: "bg-red-500/15 text-red-200 border-red-500/30", exercises:[ { id: "e1", name: "Meadows Row", sets: 4, reps: "10-12", he: "עמידה צידית, משוך לכיוון האגן כדי להעמיס על הגב והלטים.", work: 45, rest: 75, category: "pull", muscleGroup: "Back" }, { id: "e2", name: "Single-Arm Iliac Lat Pulldown", sets: 4, reps: "12", he: "מתיחה מלאה למעלה, סיים עם מרפק צמוד לאגן.", work: 40, rest: 70, category: "pull", muscleGroup: "Back" }, { id: "e3", name: "Chest-Supported T-Bar Row", sets: 3, reps: "10", he: "חזה נתמך, מניעת מומנטום, כיווץ חזק בשכמות.", work: 40, rest: 75, category: "pull", muscleGroup: "Back" }, { id: "e4", name: "Weighted Pull-Ups", sets: 4, reps: "6-8", he: "ירידה מלאה ועלייה חזקה בלי קפיצה.", work: 35, rest: 90, category: "pull", muscleGroup: "Back" }, { id: "e5", name: "Bayesian Cable Curls", sets: 3, reps: "12-15", he: "גב אל הכבל, מתיחה עמוקה לבייספס בסוף התנועה.", work: 35, rest: 60, category: "pull", muscleGroup: "Arms" }, { id: "e6", name: "Zottman Curls", sets: 3, reps: "12", he: "עלייה רגילה, ירידה באחיזה הפוכה כדי לעבוד גם על האמה.", work: 35, rest: 60, category: "pull", muscleGroup: "Arms" } ], bonus:[ { id: "b1", name: "Straight-Arm Pulldown", he: "חיבור חזק ללטים.", category: "bonus", muscleGroup: "Back" }, { id: "b2", name: "Preacher Curl", he: "בידוד חזק לבייספס.", category: "bonus", muscleGroup: "Arms" } ] },
  { key: "day2", title: "Day 2 - Push", subtitle: "Chest & Triceps", focusHe: "מיקוד: חזה עליון, כוח בלחיצות ומסת טריספס", accent: "from-blue-600 via-blue-900 to-zinc-950", accentSoft: "bg-blue-500/15 text-blue-200 border-blue-500/30", exercises:[ { id: "e7", name: "Low-Incline DB Press", sets: 4, reps: "8-10", he: "שיפוע עדין (15-30 מעלות), ירידה עמוקה לחזה עליון.", work: 40, rest: 90, category: "push", muscleGroup: "Chest" }, { id: "e8", name: "Converging Chest Press Machine", sets: 3, reps: "10-12", he: "טווח מלא, דגש על קירוב הידיים בסוף התנועה.", work: 40, rest: 75, category: "push", muscleGroup: "Chest" }, { id: "e9", name: "Cable Crossover", sets: 3, reps: "12-15", he: "מתיחה מבוקרת וכיווץ חזק לחזה תחתון/אמצעי.", work: 35, rest: 65, category: "push", muscleGroup: "Chest" }, { id: "e10", name: "JM Press", sets: 3, reps: "8-10", he: "שילוב לחיצה צרה ופשיטת מרפקים לכוח בטריספס.", work: 40, rest: 80, category: "push", muscleGroup: "Arms" }, { id: "e11", name: "Katana Extension", sets: 3, reps: "12-15", he: "מעולה לראש הארוך של הטריספס בפוזיציה מתוחה.", work: 35, rest: 60, category: "push", muscleGroup: "Arms" }, { id: "e12", name: "Weighted Dips", sets: 3, reps: "8-10", he: "הטיה קלה קדימה לחזה או גוף זקוף לטריספס.", work: 40, rest: 90, category: "push", muscleGroup: "Chest" } ], bonus:[ { id: "b3", name: "Pec Deck Fly", he: "כיווץ מבודד לחזה.", category: "bonus", muscleGroup: "Chest" }, { id: "b4", name: "Rope Pushdown", he: "פינישר לטריספס.", category: "bonus", muscleGroup: "Arms" } ] },
  { key: "day3", title: "Day 3 - Legs & Abs", subtitle: "Quads, Glutes & Core", focusHe: "מיקוד: קוואדס, שרשרת אחורית וליבה חזקה", accent: "from-emerald-600 via-emerald-900 to-zinc-950", accentSoft: "bg-emerald-500/15 text-emerald-200 border-emerald-500/30", exercises:[ { id: "e13", name: "Zercher Squat", sets: 4, reps: "8-10", he: "טורסו זקוף, עומס עצום על הקוואדס והליבה.", work: 45, rest: 120, category: "legs", muscleGroup: "Legs" }, { id: "e14", name: "Bulgarian Split Squat", sets: 3, reps: "8-10/leg", he: "ירידה עמוקה, רגל קדמית עושה את כל העבודה.", work: 45, rest: 90, category: "legs", muscleGroup: "Legs" }, { id: "e15", name: "Kas Glute Bridge", sets: 3, reps: "10-12", he: "טווח תנועה קצר יותר מהיפ טראסט, דגש נקי על ישבן.", work: 45, rest: 90, category: "legs", muscleGroup: "Legs" }, { id: "e16", name: "Nordic Hamstring Curl", sets: 3, reps: "5-8", he: "בלימה אקסצנטרית איטית, פצצה להמסטרינג.", work: 30, rest: 90, category: "legs", muscleGroup: "Legs" }, { id: "e17", name: "Hanging Leg Raises", sets: 3, reps: "12-15", he: "הבאת האגן כלפי מעלה, לא רק את הרגליים.", work: 35, rest: 60, category: "core", muscleGroup: "Core" }, { id: "e18", name: "Cable Crunches", sets: 3, reps: "15", he: "משקל כבד, כיווץ נקי של שרירי הבטן.", work: 35, rest: 60, category: "core", muscleGroup: "Core" } ], bonus:[ { id: "b5", name: "Seated Calf Raise", he: "לשריר הסוליה בשוקיים.", category: "bonus", muscleGroup: "Legs" }, { id: "b6", name: "Decline Russian Twist", he: "ליבה ואלכסונים.", category: "bonus", muscleGroup: "Core" } ] },
  { key: "day4", title: "Day 4 - Armor", subtitle: "Shoulders, Upper Back & Neck", focusHe: "מיקוד: כתפיים רחבות (3D), טרפזים ויציבה", accent: "from-violet-600 via-violet-900 to-zinc-950", accentSoft: "bg-violet-500/15 text-violet-200 border-violet-500/30", exercises:[ { id: "e19", name: "Z-Press", sets: 4, reps: "8-10", he: "ישיבה על הרצפה נטולת תמיכה - כוח כתפיים וליבה נקי.", work: 40, rest: 90, category: "armor", muscleGroup: "Shoulders" }, { id: "e20", name: "Cable Lateral Raises", sets: 4, reps: "12-15", he: "הכבל שומר על מתח רציף לאורך כל התנועה (לכתף אמצעית).", work: 40, rest: 60, category: "armor", muscleGroup: "Shoulders" }, { id: "e21", name: "Lu Raises", sets: 3, reps: "12", he: "הרמה צידית מלאה עד למעלה, פיתוח כתף וטרפז עליון.", work: 35, rest: 65, category: "armor", muscleGroup: "Shoulders" }, { id: "e22", name: "Rear Delt Row", sets: 3, reps: "12-15", he: "משיכה גבוהה עם מרפקים החוצה לכתף אחורית.", work: 35, rest: 60, category: "armor", muscleGroup: "Shoulders" }, { id: "e23", name: "Heavy DB Shrugs", sets: 4, reps: "10-12", he: "החזקה של שנייה בשיא הכיווץ.", work: 35, rest: 70, category: "armor", muscleGroup: "Back" }, { id: "e24", name: "Neck Extensions", sets: 3, reps: "15-20", he: "חיזוק צוואר לבניית מראה יציב ופציעות פחותות.", work: 35, rest: 55, category: "armor", muscleGroup: "Back" } ], bonus:[ { id: "b7", name: "Face Pulls", he: "מרפקים גבוהים, בריאות כתף.", category: "bonus", muscleGroup: "Shoulders" }, { id: "b8", name: "Upright Row", he: "כתף אמצעית וטרפזים.", category: "bonus", muscleGroup: "Shoulders" } ] },
  { key: "day5", title: "Day 5 - Power", subtitle: "Explosiveness & Full Body", focusHe: "מיקוד: כוח מתפרץ, אחיזה, ועבודה כלל-גופית", accent: "from-amber-600 via-amber-900 to-zinc-950", accentSoft: "bg-amber-500/15 text-amber-200 border-amber-500/30", exercises:[ { id: "e25", name: "Landmine Thrusters", sets: 4, reps: "8-10", he: "סקוואט ודחיפה מתפרצת בתנועה אחת.", work: 45, rest: 90, category: "power", muscleGroup: "FullBody" }, { id: "e26", name: "Farmer's Walk", sets: 3, reps: "40m", he: "משקל כבד, צעדים קצרים, מבט קדימה. מחזק אחיזה וליבה.", work: 45, rest: 90, category: "power", muscleGroup: "FullBody" }, { id: "e27", name: "Renegade Row", sets: 3, reps: "10/arm", he: "פוש-אפ + חתירה. שמור על אגן יציב ללא סיבוב.", work: 45, rest: 75, category: "power", muscleGroup: "FullBody" }, { id: "e28", name: "Heavy Barbell Curl", sets: 3, reps: "6-8", he: "כפיפת מרפקים כבדה לבניית מאסה בסיסית.", work: 35, rest: 75, category: "power", muscleGroup: "Arms" }, { id: "e29", name: "Reverse EZ Bar Curl", sets: 3, reps: "10-12", he: "אחיזה הפוכה לחיזוק ברכיאליס ואמות.", work: 35, rest: 60, category: "power", muscleGroup: "Arms" }, { id: "e30", name: "Medicine Ball Slams", sets: 3, reps: "10-12", he: "הטחה אגרסיבית בעזרת כל הגוף לפריקת אנרגיה.", work: 30, rest: 60, category: "power", muscleGroup: "FullBody" } ], bonus:[ { id: "b9", name: "Sled Push", he: "סיבולת וכוח רגליים.", category: "bonus", muscleGroup: "Legs" }, { id: "b10", name: "Kettlebell Swings", he: "היפ הינג' מתפרץ.", category: "bonus", muscleGroup: "Legs" } ] }
];

const allExercisesPool = initialDays.flatMap(d => d.exercises);
const iconByCategory = { pull: Dumbbell, push: Flame, legs: Trophy, armor: Swords, power: Activity, core: CheckCircle2, bonus: CheckCircle2 };

// --- HOOKS ---
function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") return initialValue;
    try { const item = window.localStorage.getItem(key); return item ? JSON.parse(item) : initialValue; } catch (error) { return initialValue; }
  });
  const setValue = (value: T | ((val: T) => T)) => {
    try { const valueToStore = value instanceof Function ? value(storedValue) : value; setStoredValue(valueToStore); if (typeof window !== "undefined") window.localStorage.setItem(key, JSON.stringify(valueToStore)); } catch (error) { console.error(error); }
  };
  return [storedValue, setValue] as const;
}

function useAudioBeep() {
  const ctxRef = useRef<AudioContext | null>(null);
  const initAudio = useCallback(() => {
    if (!ctxRef.current && typeof window !== "undefined") { const AudioCtx = window.AudioContext || (window as any).webkitAudioContext; if (AudioCtx) ctxRef.current = new AudioCtx(); }
    if (ctxRef.current?.state === 'suspended') ctxRef.current.resume();
  },[]);
  const playBeep = useCallback(() => {
    if (!ctxRef.current) return;
    const ctx = ctxRef.current; const osc = ctx.createOscillator(); const gain = ctx.createGain();
    osc.type = "sine"; osc.frequency.value = 880; gain.gain.setValueAtTime(0.02, ctx.currentTime); gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    osc.connect(gain); gain.connect(ctx.destination); osc.start(); osc.stop(ctx.currentTime + 0.3);
  },[]);
  return { initAudio, playBeep };
}

function useWakeLock(active: boolean) {
  const wakeLockRef = useRef<any>(null);
  useEffect(() => {
    if (typeof navigator === 'undefined' || !('wakeLock' in navigator)) return;
    const requestLock = async () => { try { wakeLockRef.current = await (navigator as any).wakeLock.request('screen'); } catch (err) {} };
    const releaseLock = async () => { if (wakeLockRef.current) { await wakeLockRef.current.release(); wakeLockRef.current = null; } };
    if (active) requestLock(); else releaseLock();
    return () => { releaseLock(); };
  }, [active]);
}

function usePushNotifications() {
  const[enabled, setEnabled] = useLocalStorage("reacher_notifications", false);
  const requestPermission = async () => {
    if (!("Notification" in window)) return false;
    if (Notification.permission === "granted") { setEnabled(true); return true; }
    const perm = await Notification.requestPermission(); const isGranted = perm === "granted"; setEnabled(isGranted); return isGranted;
  };
  const notify = useCallback((title: string, body: string) => {
    if (enabled && "Notification" in window && Notification.permission === "granted") { new Notification(title, { body, icon: "/favicon.ico" }); }
  },[enabled]);
  return { enabled, requestPermission, notify };
}

function formatTime(total: number) { const m = Math.floor(total / 60); const s = total % 60; return `${m}:${String(s).padStart(2, "0")}`; }

// --- AI COACH ---
function AiCoachModal({ exercise, apiKey, onClose }: { exercise: Exercise, apiKey: string, onClose: () => void }) {
  const[question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const[chatHistory, setChatHistory] = useState<{role: 'user'|'ai', text: string}[]>([{ role: 'ai', text: `מאמן ה-AI איתך! מטרה: מבנה של ריצ'ר. מה הבעיה עם ${exercise.name}?` }]);

  const quickPrompts =[
    { label: "כואב לי המפרק", icon: AlertTriangle, prompt: `כשאני עושה את התרגיל הזה כואב לי המפרק. מהן הטעויות הנפוצות ביציבה שגורמות לזה, ואיך לתקן?` },
    { label: "לא מרגיש תשריר", icon: Sparkles, prompt: `אני לא מצליח להרגיש את השריר המטרה עובד. איך לשפר את הקשר מוח-שריר כאן?` },
    { label: "גרסת חופשיות", icon: RefreshCcw, prompt: `אני רוצה להחליף למשקולות חופשיות. מה התחליף המדויק הכי טוב לזה?` }
  ];

  const handleFallback = () => {
    navigator.clipboard.writeText(`אני מתאמן על ${exercise.name} ומכוון למבנה גוף מאסיבי. תן לי דגשים לטכניקה נכונה וטיפ מקצועני אחד בעברית.`).then(() => { window.open("https://gemini.google.com/app", "_blank"); });
  };

  const askGemini = async (text: string) => {
    if (!text.trim()) return;
    setChatHistory(prev => [...prev, { role: 'user', text }]); setQuestion(""); setLoading(true);
    try {
      const prompt = `You are an elite bodybuilding coach. User wants a physique like 'Reacher'. Focus on: Maximum recruitment, free weights, biomechanical cues. Exercise: ${exercise.name}. Question: ${text}. Answer in HEBREW, be concise (3 short sentences max). No asterisks.`;
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ contents:[{ parts:[{ text: prompt }] }] })
      });
      const data = await res.json(); if (data.error) throw new Error(data.error.message);
      setChatHistory(prev =>[...prev, { role: 'ai', text: data.candidates[0].content.parts[0].text }]);
    } catch (e: any) { setChatHistory(prev =>[...prev, { role: 'ai', text: `שגיאה: ${e.message}` }]); }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-zinc-900 border border-zinc-700 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[85vh] max-h-[700px]">
        <div className="bg-gradient-to-r from-indigo-900 to-zinc-900 p-4 border-b border-zinc-800 flex justify-between items-center">
          <div className="flex items-center gap-3"><div className="bg-indigo-500/20 p-2 rounded-full border border-indigo-500/30"><Bot className="h-6 w-6 text-indigo-400" /></div><div><h3 className="font-bold text-lg text-white">Reacher AI Coach</h3><p className="text-xs text-indigo-200">{exercise.name}</p></div></div>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-zinc-400 hover:text-white"><X className="h-5 w-5"/></Button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4" dir="rtl">
          {!apiKey ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6 px-4">
               <Bot className="h-16 w-16 text-zinc-600 mb-2" /><div><h4 className="text-xl font-bold mb-2">חסר מפתח AI</h4><p className="text-zinc-400 text-sm">הזן מפתח בהגדרות.</p></div>
               <Button onClick={handleFallback} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl h-12 font-bold"><ExternalLink className="ml-2 w-5 h-5" /> פתח את ג'מיני לשאלה</Button>
            </div>
          ) : (
            <>
              {chatHistory.map((msg, i) => (<div key={i} className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}><div className={`max-w-[85%] p-3 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-br-sm' : 'bg-zinc-800 border border-zinc-700 text-zinc-200 rounded-bl-sm'}`}>{msg.text}</div></div>))}
              {loading && <div className="flex justify-end"><div className="bg-zinc-800 border border-zinc-700 text-zinc-400 p-3 rounded-2xl text-sm">...</div></div>}
            </>
          )}
        </div>
        {apiKey && (
          <div className="p-4 border-t border-zinc-800 bg-zinc-950 flex flex-col gap-3" dir="rtl">
             <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
               {quickPrompts.map((qp, idx) => { const Icon = qp.icon; return (<button key={idx} onClick={() => askGemini(qp.prompt)} className="whitespace-nowrap flex items-center gap-1.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 px-3 py-1.5 rounded-full text-xs text-zinc-300"><Icon className="w-3.5 h-3.5 text-indigo-400" /> {qp.label}</button>); })}
             </div>
             <div className="flex gap-2">
                <Button onClick={() => askGemini(question)} disabled={loading || !question.trim()} className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl px-4"><Send className="w-5 h-5" /></Button>
                <Input value={question} onChange={(e: any) => setQuestion(e.target.value)} onKeyDown={(e: any) => e.key === 'Enter' && askGemini(question)} placeholder="הקלד שאלה..." className="flex-1 text-right" />
             </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}

// --- MAIN APP ---
function ReacherApp() {
  const[screen, setScreen] = useState<"home" | "day" | "live" | "analytics" | "settings">("home");
  const [viewMode, setViewMode] = useState<"days" | "muscles">("days");
  const [exerciseHistory, setExerciseHistory] = useLocalStorage<Record<string, SetRecord[]>>("reacher_history", {});
  const [swaps, setSwaps] = useLocalStorage<Record<string, string>>("reacher_swaps", {});
  const [weeklyProgress, setWeeklyProgress] = useLocalStorage<Record<string, boolean>>("reacher_weekly", {});
  const [geminiApiKey, setGeminiApiKey] = useLocalStorage<string>("reacher_gemini_api_key", "");
  const [soundOn, setSoundOn] = useLocalStorage("reacher_sound", true);
  const [autoAdvance, setAutoAdvance] = useLocalStorage("reacher_auto", true);
  const [globalWorkAdjust, setGlobalWorkAdjust] = useLocalStorage("reacher_work_adj", 100);
  const [globalRestAdjust, setGlobalRestAdjust] = useLocalStorage("reacher_rest_adj", 100);

  const { initAudio, playBeep } = useAudioBeep();
  const { enabled: pushEnabled, requestPermission, notify } = usePushNotifications();
  
  const [selectedDayKey, setSelectedDayKey] = useState(initialDays[0].key);
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [setIndex, setSetIndex] = useState(0);
  const [phase, setPhase] = useState<"work" | "rest" | "done">("work");
  const [running, setRunning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [targetTime, setTargetTime] = useState<number | null>(null);
  
  const [currentWeight, setCurrentWeight] = useState<string>("");
  const [currentReps, setCurrentReps] = useState<string>("");
  const[currentRpe, setCurrentRpe] = useState<number>(8);
  const [isWarmup, setIsWarmup] = useState(false);

  const [aiExerciseToAsk, setAiExerciseToAsk] = useState<Exercise | null>(null);
  const [swapExerciseOrigin, setSwapExerciseOrigin] = useState<Exercise | null>(null);

  useWakeLock(running);

  const days = useMemo(() => {
    return initialDays.map(day => ({
      ...day,
      exercises: day.exercises.map(ex => {
        const swappedId = swaps[ex.id];
        if (swappedId) { const alternative = allExercisesPool.find(e => e.id === swappedId); if (alternative) return { ...alternative, originalIdForSwap: ex.id }; }
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
  },[liveExercise, exerciseHistory]);

  useEffect(() => {
    if (previousSetRecord) { setCurrentWeight(previousSetRecord.weight.toString()); setCurrentReps(previousSetRecord.reps.toString()); setCurrentRpe(previousSetRecord.rpe); } 
    else { setCurrentWeight(""); setCurrentReps(""); setCurrentRpe(8); }
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
    const w = parseFloat(currentWeight) || 0; const r = parseInt(currentReps) || parseInt(liveExercise?.reps.split('-')[0]) || 0;
    setExerciseHistory(prev => ({ ...prev, [exId]:[...(prev[exId] ||[]), { weight: w, reps: r, rpe: currentRpe, isWarmup, date: Date.now() }] }));
  };

  const handleNextStep = useCallback(() => {
    setExerciseIndex((currExIdx) => {
      setSetIndex((currSetIdx) => {
        const ex = selectedDay.exercises[currExIdx]; if (!ex) return currSetIdx;
        if (phase === "work") {
          saveCurrentSetToHistory(ex.id);
          if (isWarmup) { setPhase("rest"); const rt = adjustedRest(ex) * 0.7; setSecondsLeft(rt); setIsWarmup(false); if (running || autoAdvance) setTargetTime(Date.now() + rt * 1000); return currSetIdx; }
          if (currSetIdx + 1 >= ex.sets) {
            if (currExIdx + 1 >= selectedDay.exercises.length) { setPhase("done"); setRunning(false); setTargetTime(null); setWeeklyProgress(prev => ({ ...prev,[`${getCurrentWeekKey()}-${selectedDay.key}`]: true })); return currSetIdx; }
          }
          setPhase("rest"); const rt = adjustedRest(ex); setSecondsLeft(rt); if (running || autoAdvance) setTargetTime(Date.now() + rt * 1000); return currSetIdx;
        } 
        if (currSetIdx + 1 >= ex.sets) { const nx = selectedDay.exercises[currExIdx + 1]; setPhase("work"); const wt = adjustedWork(nx); setSecondsLeft(wt); if (running || autoAdvance) setTargetTime(Date.now() + wt * 1000); return 0; } 
        else { setPhase("work"); const wt = adjustedWork(ex); setSecondsLeft(wt); if (running || autoAdvance) setTargetTime(Date.now() + wt * 1000); return currSetIdx + 1; }
      });
      if (phase === "rest") { if (setIndex + 1 >= selectedDay.exercises[currExIdx].sets) return currExIdx + 1; }
      return currExIdx;
    });
  },[phase, selectedDay, running, autoAdvance, setIndex, isWarmup, currentWeight, currentReps, currentRpe]);

  function previousStep() {
    setRunning(false); setTargetTime(null);
    if (phase === "rest") { setPhase("work"); setSecondsLeft(adjustedWork(selectedDay.exercises[exerciseIndex])); return; }
    if (setIndex > 0) { setSetIndex((s) => s - 1); setSecondsLeft(adjustedWork(selectedDay.exercises[exerciseIndex])); return; }
    if (exerciseIndex > 0) { const prevEx = selectedDay.exercises[exerciseIndex - 1]; setExerciseIndex((i) => i - 1); setSetIndex(prevEx.sets - 1); setPhase("work"); setSecondsLeft(adjustedWork(prevEx)); }
  }

  function startLive(dayKey = selectedDay.key, overrideExIdx = 0) {
    initAudio(); if (pushEnabled) requestPermission(); setSelectedDayKey(dayKey); setExerciseIndex(overrideExIdx); setSetIndex(0);
    const day = days.find((d) => d.key === dayKey) ?? days[0]; const firstEx = day.exercises[overrideExIdx] || day.exercises[0];
    setPhase("work"); const wt = adjustedWork(firstEx); setSecondsLeft(wt); setScreen("live");
    setTimeout(() => { setRunning(true); setTargetTime(Date.now() + wt * 1000); }, 400);
  }

  function togglePlayPause() {
    initAudio(); if (running) { setRunning(false); setTargetTime(null); } else { if (pushEnabled) requestPermission(); setRunning(true); setTargetTime(Date.now() + secondsLeft * 1000); }
  }

  const getCurrentWeekKey = () => {
    const d = new Date(); d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay()||7));
    return `${d.getUTCFullYear()}-W${Math.ceil(( ( (d.getTime() - new Date(Date.UTC(d.getUTCFullYear(),0,1)).getTime()) / 86400000) + 1)/7)}`;
  };

  const analyticsData = useMemo(() => {
     const counts = Object.entries(exerciseHistory).map(([id, records]) => ({ id, count: records.length, maxWeight: Math.max(...records.map(r=>r.weight)) })).sort((a,b) => b.count - a.count);
     return counts.slice(0, 5).map(c => c.id).map(id => {
       const ex = allExercisesPool.find(e => e.id === id); const records = exerciseHistory[id].filter(r=>!r.isWarmup).sort((a,b)=>a.date - b.date);
       const firstW = records[0]?.weight || 0; const lastW = records[records.length - 1]?.weight || 0;
       return { name: ex?.name || id, firstW, lastW, progressPercent: firstW > 0 ? ((lastW - firstW) / firstW) * 100 : 0, muscle: ex?.muscleGroup };
     });
  },[exerciseHistory]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 font-sans selection:bg-zinc-800 relative pb-10">
      <AnimatePresence>{aiExerciseToAsk && <AiCoachModal exercise={aiExerciseToAsk} apiKey={geminiApiKey} onClose={() => setAiExerciseToAsk(null)} />}</AnimatePresence>
      <AnimatePresence>
        {swapExerciseOrigin && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-zinc-900 border border-zinc-700 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl p-6">
               <div className="flex justify-between items-center mb-6"><h3 className="text-xl font-bold">Swap Exercise</h3><Button variant="ghost" size="icon" onClick={() => setSwapExerciseOrigin(null)}><X className="h-5 w-5"/></Button></div>
               <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                 {allExercisesPool.filter(e => e.muscleGroup === swapExerciseOrigin.muscleGroup && e.id !== swapExerciseOrigin.id).map(alt => (
                   <div key={alt.id} className="bg-zinc-950 border border-zinc-800 p-4 rounded-2xl flex justify-between items-center"><div className="font-bold">{alt.name}</div><Button size="sm" className="bg-indigo-600 text-white" onClick={() => { setSwaps(prev => ({ ...prev,[(swapExerciseOrigin as any).originalIdForSwap || swapExerciseOrigin.id]: alt.id })); setSwapExerciseOrigin(null); }}>Select</Button></div>
                 ))}
                 <Button variant="outline" className="w-full mt-4 text-red-400" onClick={() => { const newSwaps = {...swaps}; delete newSwaps[(swapExerciseOrigin as any).originalIdForSwap || swapExerciseOrigin.id]; setSwaps(newSwaps); setSwapExerciseOrigin(null); }}>Revert</Button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="mx-auto max-w-7xl p-4 md:p-6 lg:p-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex flex-col md:flex-row justify-between gap-6 bg-zinc-900/40 p-6 md:p-8 rounded-[2rem] border border-zinc-800/60 shadow-2xl">
            <div>
              <div className="mb-4 flex gap-2"><Badge variant="outline" className="text-indigo-300"><Sparkles className="w-3 h-3 mr-1 inline" /> Beast Mode</Badge><Badge variant="outline" className="text-emerald-300"><TrendingUp className="w-3 h-3 mr-1 inline" /> Tracked</Badge></div>
              <h1 className="text-4xl md:text-6xl font-black">Reacher.</h1>
              <p dir="rtl" className="mt-3 text-zinc-400">תכנית היפרטרופיה. מעקב משקלים ומאמן AI חי.</p>
            </div>
            <div className="flex flex-col gap-3 min-w-[200px]"><div className="flex justify-between text-sm font-semibold text-zinc-400"><span>Weekly</span><CalendarDays className="h-4 w-4" /></div><div className="flex gap-2">{initialDays.map(d => { const isDone = weeklyProgress[`${getCurrentWeekKey()}-${d.key}`]; return <div key={d.key} className={`h-10 w-10 flex items-center justify-center rounded-xl border ${isDone ? 'border-emerald-500/50 bg-emerald-500/20 text-emerald-400' : 'border-zinc-800 text-zinc-600'}`}>{isDone ? <CheckCircle2 className="h-5 w-5" /> : <span className="text-xs font-bold">{d.key.replace('day', '')}</span>}</div>; })}</div></div>
          </div>
        </motion.div>

        <div className="grid h-auto w-full max-w-3xl grid-cols-5 gap-1 rounded-2xl border border-zinc-800/60 bg-zinc-900/40 p-1.5 mb-8">
          {[{ id: "home", icon: Home, label: "Home" }, { id: "day", icon: ListChecks, label: "Routine" }, { id: "live", icon: Play, label: "Live" }, { id: "analytics", icon: TrendingUp, label: "Stats" }, { id: "settings", icon: Settings2, label: "Settings" }].map(tab => {
            const Icon = tab.icon; const isActive = screen === tab.id;
            return <button key={tab.id} onClick={() => setScreen(tab.id as any)} className={`rounded-xl py-3 flex items-center justify-center text-xs sm:text-sm font-bold ${isActive ? 'bg-zinc-800 text-white' : 'text-zinc-400'}`}><Icon className="sm:mr-2 h-4 w-4" /><span className="hidden sm:inline">{tab.label}</span></button>;
          })}
        </div>

        {screen === "home" && (
          <div className="space-y-6">
            <div className="flex bg-zinc-900/40 p-2 rounded-2xl max-w-[280px]"><Button variant={viewMode === 'days' ? 'default' : 'ghost'} className="w-1/2" onClick={() => setViewMode('days')}>Days</Button><Button variant={viewMode === 'muscles' ? 'default' : 'ghost'} className="w-1/2" onClick={() => setViewMode('muscles')}>Muscle</Button></div>
            <AnimatePresence mode="wait">
              {viewMode === "days" ? (
                <motion.div key="days" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {days.map((day) => (
                    <Card key={day.key}>
                      <div className={`h-32 bg-gradient-to-br ${day.accent} p-6`}><div className="text-xs font-bold text-white/70">{day.key}</div><div className="text-3xl font-black text-white">{day.title.split('-')[1]}</div></div>
                      <CardContent><p dir="rtl" className="text-right text-sm text-zinc-400 mb-5">{day.focusHe}</p><div className="grid grid-cols-2 gap-3"><Button onClick={() => { setSelectedDayKey(day.key); setScreen("day"); }}>Details</Button><Button variant="outline" onClick={() => startLive(day.key)}>Start</Button></div></CardContent>
                    </Card>
                  ))}
                </motion.div>
              ) : (
                <motion.div key="muscles" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {Object.keys(imageByMuscle).map((muscle) => {
                     const exs = allExercisesPool.filter(e => e.muscleGroup === muscle); if(exs.length === 0) return null;
                     return <Card key={muscle}><div className="h-40 relative"><img src={imageByMuscle[muscle as MuscleGroup]} alt={muscle} className="w-full h-full object-cover opacity-60" /><div className="absolute inset-0 bg-gradient-to-t from-zinc-950 p-6 flex flex-col justify-end"><h2 className="text-3xl font-black">{muscle}</h2></div></div></Card>;
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {screen === "day" && (
          <div className="space-y-6">
            <ScrollArea className="w-full pb-4"><div className="flex gap-3 min-w-max">{days.map((day) => (<Button key={day.key} variant={selectedDayKey === day.key ? "default" : "outline"} onClick={() => setSelectedDayKey(day.key)}>{day.title}</Button>))}</div></ScrollArea>
            <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
              <div className="space-y-6">
                <div className="flex justify-between"><h3 className="text-2xl font-bold">Routine</h3><Button onClick={() => startLive(selectedDay.key)}><Play className="mr-2 h-4 w-4" /> Start</Button></div>
                {selectedDay.exercises.map((ex, idx) => {
                  const Icon = iconByCategory[ex.category]; const maxW = Math.max(...(exerciseHistory[ex.id] ||[]).map(h => h.weight), 0);
                  return (
                    <Card key={ex.id}><CardContent className="p-0"><div className="grid sm:grid-cols-[180px_1fr]">
                      <div className="h-40 sm:h-full relative border-r border-zinc-800"><img src={imageByMuscle[ex.muscleGroup]} className="w-full h-full object-cover opacity-70" /><div className="absolute top-3 left-3 bg-black/60 px-2 py-1 rounded text-xs font-bold">{ex.category}</div></div>
                      <div className="p-5 flex flex-col justify-between"><div><div className="flex justify-between"><h4 className="text-xl font-bold">{ex.name}</h4><span className="text-xl text-zinc-700">{idx+1}</span></div><p dir="rtl" className="text-sm text-zinc-400 mb-4">{ex.he}</p></div><div className="flex gap-3"><Badge variant="secondary">{ex.sets} × {ex.reps}</Badge>{maxW > 0 && <Badge className="text-emerald-300">PR: {maxW}kg</Badge>}<div className="flex-1"/><Button variant="ghost" size="icon" onClick={() => setSwapExerciseOrigin(ex)}><RefreshCcw className="h-4 w-4" /></Button><Button variant="ghost" size="icon" className="text-indigo-400" onClick={() => setAiExerciseToAsk(ex)}><Bot className="h-4 w-4" /></Button><Button variant="secondary" size="sm" onClick={() => startLive(selectedDay.key, idx)}>Live</Button></div></div>
                    </div></CardContent></Card>
                  );
                })}
              </div>
              <div className="space-y-6"><Card><div className={`h-2 bg-gradient-to-r ${selectedDay.accent}`} /><CardHeader><CardTitle>Bonus Details</CardTitle></CardHeader><CardContent className="space-y-3">{selectedDay.bonus.map((bonus) => (<div key={bonus.id} className="p-4 border border-zinc-800 rounded-2xl"><div className="font-bold">{bonus.name}</div><p dir="rtl" className="text-sm text-zinc-400 mt-1">{bonus.he}</p></div>))}</CardContent></Card></div>
            </div>
          </div>
        )}

        {screen === "live" && (
          <div className="space-y-6">
            {phase === "done" ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center py-20"><CheckCircle2 className="h-32 w-32 text-emerald-400 mb-8" /><h2 className="text-6xl font-black mb-4">BEAST.</h2><Button size="lg" onClick={() => setScreen("home")}>Finish</Button></motion.div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid gap-6 lg:grid-cols-[1fr_450px]">
                <div className="space-y-6">
                  <Card className="relative"><div className="absolute top-0 left-0 w-full h-1"><div className={`h-full bg-gradient-to-r ${selectedDay.accent}`} style={{ width: `${((setIndex + (exerciseIndex * 10)) / (selectedDay.exercises.length * 10)) * 100}%` }} /></div><CardContent className="p-8 md:p-12"><div className="flex justify-between mb-6"><Badge variant="outline">{selectedDay.title}</Badge><Badge className={phase === "work" ? "bg-red-500/20 text-red-400" : "bg-blue-500/20 text-blue-400"}>{phase.toUpperCase()}</Badge></div><div className="text-center mb-8"><h2 className="text-4xl md:text-5xl font-black mb-4">{liveExercise?.name}</h2><p dir="rtl" className="text-zinc-400 mb-4">{liveExercise?.he}</p><Button variant="outline" size="sm" onClick={() => setAiExerciseToAsk(liveExercise)}><Sparkles className="w-4 h-4 mr-2" /> Ask Coach</Button></div><div className="grid grid-cols-2 gap-4 mb-8"><div className="bg-zinc-950/50 rounded-3xl p-6 text-center"><div className="text-zinc-500 font-bold mb-2">Set</div><div className="text-5xl font-black">{setIndex + 1}/{liveExercise?.sets}</div></div><div className="bg-zinc-950/50 rounded-3xl p-6 text-center"><div className="text-zinc-500 font-bold mb-2">Timer</div><div className="text-5xl font-black">{formatTime(secondsLeft)}</div></div></div><div className="bg-zinc-950/80 rounded-3xl p-6 border border-zinc-800"><div className="flex justify-between mb-4"><span className="font-bold flex items-center gap-2"><FlameKindle className="w-4 h-4 text-amber-500"/> Log Set</span>{previousSetRecord && <span className="text-emerald-400 text-sm">Last: {previousSetRecord.weight}kg × {previousSetRecord.reps}</span>}</div><div className="grid grid-cols-3 gap-3 mb-6"><div><label className="text-xs text-zinc-500 mb-1">Weight</label><Input type="number" value={currentWeight} onChange={(e:any)=>setCurrentWeight(e.target.value)} className="text-center font-bold" /></div><div><label className="text-xs text-zinc-500 mb-1">Reps</label><Input type="number" value={currentReps} onChange={(e:any)=>setCurrentReps(e.target.value)} className="text-center font-bold" /></div><div><label className="text-xs text-zinc-500 mb-1">RPE {currentRpe}</label><Slider value={[currentRpe]} min={5} max={10} step={0.5} onValueChange={(v:any)=>setCurrentRpe(v[0])} className="mt-3"/></div></div><div className="flex gap-3"><Button size="lg" className="flex-1" onClick={handleNextStep}><CheckCircle2 className="w-5 h-5 mr-2"/> Log & Next</Button><Button size="lg" variant="outline" className={isWarmup ? 'text-amber-400' : ''} onClick={() => setIsWarmup(!isWarmup)}><Flame className="w-5 h-5 mr-2"/> Warmup</Button></div></div></CardContent></Card>
                </div>
                <div className="space-y-6">
                  <Card><CardHeader><CardTitle>Controls</CardTitle></CardHeader><CardContent className="space-y-4"><Button variant={running ? "destructive" : "default"} className="w-full" onClick={togglePlayPause}>{running ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />} {running ? "Pause" : "Resume"}</Button><div className="flex justify-between items-center bg-zinc-950 p-3 rounded-xl"><div className="font-bold text-sm">Auto-Advance</div><Switch checked={autoAdvance} onCheckedChange={setAutoAdvance} /></div><Button variant="outline" className="w-full" onClick={previousStep}>Go Back</Button></CardContent></Card>
                  <Card className="flex-1 max-h-[300px] flex flex-col"><CardHeader className="pb-2"><CardTitle>History</CardTitle></CardHeader><CardContent className="overflow-y-auto flex-1 space-y-2 pb-4">{exerciseHistory[liveExercise?.id] ? [...exerciseHistory[liveExercise.id]].reverse().map((record, i) => (<div key={i} className="flex justify-between p-3 rounded-lg bg-zinc-950/50 border border-zinc-800"><div className="text-sm"><span className="text-zinc-500 block text-xs">{new Date(record.date).toLocaleDateString()}</span><span className="font-bold">{record.weight}kg × {record.reps}</span></div><div><Badge variant="outline">RPE {record.rpe}</Badge></div></div>)) : <div className="text-zinc-500 text-center py-4">No logged sets yet.</div>}</CardContent></Card>
                </div>
              </motion.div>
            )}
          </div>
        )}

        {screen === "analytics" && (
          <div className="grid gap-6 md:grid-cols-2">
             <Card><CardHeader><CardTitle className="flex items-center gap-2"><TrendingUp className="text-emerald-400" /> Progression</CardTitle></CardHeader><CardContent className="space-y-6">{analyticsData.length > 0 ? analyticsData.map((data, i) => (<div key={i} className="space-y-2"><div className="flex justify-between items-end"><span className="font-bold">{data.name}</span><span className="text-emerald-400 font-bold">+{data.progressPercent.toFixed(1)}%</span></div><div className="h-4 bg-zinc-950 rounded-full relative"><div className="absolute h-full bg-zinc-700" style={{ width: '40%' }}><span className="absolute right-2 text-[10px]">{data.firstW}kg</span></div>{data.progressPercent > 0 && <div className="absolute left-[40%] h-full bg-emerald-500" style={{ width: `${Math.min(data.progressPercent, 60)}%` }}><span className="absolute right-2 text-[10px] text-emerald-950 font-bold">{data.lastW}kg</span></div>}</div></div>)) : <div className="text-zinc-500 text-center py-10">Log workouts to see progress!</div>}</CardContent></Card>
             <Card><CardHeader><CardTitle>Volume Heatmap</CardTitle></CardHeader><CardContent><div className="flex flex-wrap gap-2">{Object.keys(weeklyProgress).reverse().slice(0, 14).map(key => (<div key={key} className="p-3 bg-emerald-500/20 text-emerald-300 rounded-xl text-xs font-bold">{key}</div>))}</div></CardContent></Card>
          </div>
        )}

        {screen === "settings" && (
          <div className="max-w-3xl mx-auto space-y-6">
             <Card className="border-indigo-500/30"><CardHeader><CardTitle className="text-2xl flex items-center gap-2"><Bot className="text-indigo-400 h-6 w-6"/> AI Coach</CardTitle></CardHeader><CardContent className="space-y-6" dir="rtl"><div className="space-y-3"><label className="font-bold text-zinc-200">Gemini API Key</label><Input type="password" value={geminiApiKey} onChange={(e: any) => setGeminiApiKey(e.target.value)} /></div></CardContent></Card>
             <Card><CardHeader><CardTitle className="text-2xl">Global Settings</CardTitle></CardHeader><CardContent className="space-y-8"><div className="flex justify-between items-center text-lg font-bold"><span>Push Notifications</span><Button variant="outline" size="sm" onClick={requestPermission} className={pushEnabled ? "text-emerald-400" : ""}>{pushEnabled ? "Enabled" : "Enable"}</Button></div><div className="space-y-4"><div className="flex justify-between font-bold"><span>Work Base</span><span className="text-zinc-400">{globalWorkAdjust}%</span></div><Slider value={[globalWorkAdjust]} min={50} max={200} step={10} onValueChange={(v:any) => setGlobalWorkAdjust(v[0])} /></div><div className="space-y-4"><div className="flex justify-between font-bold"><span>Rest Base</span><span className="text-zinc-400">{globalRestAdjust}%</span></div><Slider value={[globalRestAdjust]} min={50} max={200} step={10} onValueChange={(v:any) => setGlobalRestAdjust(v[0])} /></div><div className="pt-6 border-t border-zinc-800"><Button variant="destructive" className="w-full" onClick={() => { if(confirm("Clear ALL history?")) { window.localStorage.clear(); window.location.reload(); }}}>Reset All Data</Button></div></CardContent></Card>
          </div>
        )}
      </div>
    </div>
  );
}

const rootElement = document.getElementById("root");
if (rootElement && !rootElement.innerHTML) {
  const root = createRoot(rootElement);
  root.render(<ReacherApp />);
}
