import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { createRoot } from "react-dom/client";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play, Pause, RotateCcw, SkipForward, SkipBack, Dumbbell, Flame, Clock3,
  CheckCircle2, Youtube, TimerReset, Volume2, VolumeX, Home, ListChecks,
  Swords, Trophy, Settings2, Activity, CalendarDays, Weight, Eye,
  Bot, Sparkles, X, Send, MessageCircle, ExternalLink, TrendingUp, RefreshCcw, AlertTriangle, Plus, Zap, Cpu, Target, Music
} from "lucide-react";

// --- TYPES & INTERFACES ---
type MuscleGroup = "Back" | "Chest" | "Legs" | "Shoulders" | "Arms" | "Core" | "FullBody";
type Category = "pull" | "push" | "legs" | "armor" | "power" | "core" | "bonus";
type Exercise = { id: string; name: string; sets: number; reps: string; he: string; work: number; rest: number; category: Category; muscleGroup: MuscleGroup; videoUrl?: string; imageUrl?: string; originalIdForSwap?: string; };
type DayPlan = { key: string; title: string; subtitle: string; focusHe: string; accent: string; exercises: Exercise[]; bonus: Exercise[]; };
type SetRecord = { weight: number; reps: number; rpe: number; isWarmup: boolean; date: number; };

// --- ASSETS ---
const HERO_BG = "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1400&auto=format&fit=crop";

const imageByMuscle: Record<MuscleGroup, string> = {
  Back: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop",
  Chest: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=800&auto=format&fit=crop",
  Legs: "https://images.unsplash.com/photo-1434682881908-b43d0467b798?q=80&w=800&auto=format&fit=crop",
  Shoulders: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800&auto=format&fit=crop",
  Arms: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=800&auto=format&fit=crop",
  Core: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=800&auto=format&fit=crop",
  FullBody: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=800&auto=format&fit=crop",
};

const muscleHebrew: Record<string, string> = {
  Back: "גב", Chest: "חזה", Legs: "רגליים", Shoulders: "כתפיים", Arms: "ידיים", Core: "ליבה", FullBody: "כל הגוף"
};

const yt = (q: string) => `https://www.youtube.com/watch?v=p1qV6WfI7eQ4{encodeURIComponent(q)}`;

// --- MEDIA HELPERS ---
function openSpotifyApp() {
  if (typeof window === "undefined") return;
  const now = Date.now(); window.location.href = "spotify://";
  setTimeout(() => { if (Date.now() - now < 1800) window.open("http://googleusercontent.com/spotify.com/15", "_blank"); }, 900);
}

function openYouTubeApp(url?: string) {
  if (typeof window === "undefined") return;
  const now = Date.now(); window.location.href = "youtube://";
  setTimeout(() => { if (Date.now() - now < 1800) window.open(url || "https://www.youtube.com/watch?v=p1qV6WfI7eQ6", "_blank"); }, 900);
}

// --- DATASET: 60+ EXERCISES ---
const initialDays: DayPlan[] = [
  { key: "day1", title: "יום 1 - גב", subtitle: "Density & Width", focusHe: "מיקוד: עובי גב ולטים", accent: "teal", exercises: [
    { id: "e1", name: "Meadows Row", sets: 4, reps: "10-12", he: "עמידה צידית, משיכה לכיוון האגן.", work: 45, rest: 75, category: "pull", muscleGroup: "Back" },
    { id: "e2", name: "Single-Arm Lat Pulldown", sets: 4, reps: "12", he: "מתיחה מלאה, מרפק צמוד לאגן.", work: 40, rest: 70, category: "pull", muscleGroup: "Back" },
    { id: "e3", name: "Chest-Supported T-Bar Row", sets: 3, reps: "10", he: "בידוד שכמות מקסימלי.", work: 40, rest: 75, category: "pull", muscleGroup: "Back" },
    { id: "e4", name: "Weighted Pull-Ups", sets: 4, reps: "6-8", he: "ירידה מלאה ועלייה חזקה.", work: 35, rest: 90, category: "pull", muscleGroup: "Back" },
    { id: "e5", name: "Pendlay Rows", sets: 4, reps: "8", he: "חתירה מתפרצת מהרצפה.", work: 45, rest: 90, category: "pull", muscleGroup: "Back" },
    { id: "e6", name: "Seal Rows", sets: 3, reps: "10", he: "נטרול מומנטום גב תחתון.", work: 40, rest: 80, category: "pull", muscleGroup: "Back" },
    { id: "e7", name: "Dumbbell Pullovers", sets: 3, reps: "12", he: "מתיחה עמוקה ללטים.", work: 35, rest: 60, category: "pull", muscleGroup: "Back" },
    { id: "e8", name: "Face Pulls", sets: 4, reps: "15", he: "משיכה למצח, מרפקים החוצה.", work: 35, rest: 60, category: "pull", muscleGroup: "Back" },
    { id: "e9", name: "Rack Pulls", sets: 3, reps: "5-8", he: "משיכה מעל הברך לעובי גב.", work: 50, rest: 120, category: "pull", muscleGroup: "Back" },
    { id: "e10", name: "Bayesian Cable Curls", sets: 3, reps: "12-15", he: "גב לכבל, מתיחה עמוקה.", work: 30, rest: 60, category: "pull", muscleGroup: "Arms" }
  ], bonus: [] },
  { key: "day2", title: "יום 2 - חזה", subtitle: "Power Push", focusHe: "מיקוד: חזה עליון וכוח לחיצה", accent: "blue", exercises: [
    { id: "e11", name: "Low-Incline DB Press", sets: 4, reps: "8-10", he: "שיפוע 15-30, ירידה עמוקה.", work: 40, rest: 90, category: "push", muscleGroup: "Chest" },
    { id: "e12", name: "Converging Chest Press", sets: 3, reps: "10-12", he: "סחיטה במרכז.", work: 40, rest: 75, category: "push", muscleGroup: "Chest" },
    { id: "e13", name: "Dumbbell Floor Press", sets: 4, reps: "8", he: "כוח מתפרץ מהחצי.", work: 45, rest: 90, category: "push", muscleGroup: "Chest" },
    { id: "e14", name: "Weighted Push-ups", sets: 3, reps: "12-15", he: "משקל על הגב, ידיות.", work: 40, rest: 75, category: "push", muscleGroup: "Chest" },
    { id: "e15", name: "Weighted Dips", sets: 3, reps: "8-10", he: "הטיה קדימה לגיוס חזה.", work: 40, rest: 90, category: "push", muscleGroup: "Chest" },
    { id: "e16", name: "Cable Crossover", sets: 3, reps: "15", he: "מתיחה וכיווץ חזק.", work: 35, rest: 60, category: "push", muscleGroup: "Chest" },
    { id: "e17", name: "Incline Flyes", sets: 3, reps: "12", he: "בידוד חזה עליון.", work: 35, rest: 60, category: "push", muscleGroup: "Chest" },
    { id: "e18", name: "Hex Press", sets: 3, reps: "12", he: "הצמדת משקולות במרכז.", work: 35, rest: 70, category: "push", muscleGroup: "Chest" },
    { id: "e19", name: "JM Press", sets: 3, reps: "8-10", he: "כוח בטריספס.", work: 40, rest: 80, category: "push", muscleGroup: "Arms" }
  ], bonus: [] },
  { key: "day3", title: "יום 3 - רגליים", subtitle: "Athletic Foundation", focusHe: "מיקוד: קוואדס והמסטרינג", accent: "emerald", exercises: [
    { id: "e20", name: "Zercher Squat", sets: 4, reps: "8-10", he: "טורסו זקוף, עומס קוואדס.", work: 45, rest: 120, category: "legs", muscleGroup: "Legs" },
    { id: "e21", name: "Bulgarian Split Squat", sets: 3, reps: "8-10", he: "ירידה עמוקה, רגל אחת.", work: 45, rest: 90, category: "legs", muscleGroup: "Legs" },
    { id: "e22", name: "Romanian Deadlift", sets: 4, reps: "10", he: "מוט צמוד לרגליים.", work: 50, rest: 120, category: "legs", muscleGroup: "Legs" },
    { id: "e23", name: "Kas Glute Bridge", sets: 3, reps: "12", he: "דגש נקי על ישבן.", work: 45, rest: 90, category: "legs", muscleGroup: "Legs" },
    { id: "e24", name: "Goblet Squat", sets: 3, reps: "12", he: "טווח תנועה מלא.", work: 40, rest: 80, category: "legs", muscleGroup: "Legs" },
    { id: "e25", name: "Nordic Hamstring Curl", sets: 3, reps: "6", he: "בלימה אקסצנטרית.", work: 30, rest: 90, category: "legs", muscleGroup: "Legs" },
    { id: "e26", name: "Step-ups", sets: 3, reps: "10/leg", he: "דחיפה דרך העקב.", work: 40, rest: 75, category: "legs", muscleGroup: "Legs" },
    { id: "e27", name: "Hack Squat", sets: 3, reps: "10", he: "ירידה עמוקה ומבוקרת.", work: 45, rest: 90, category: "legs", muscleGroup: "Legs" }
  ], bonus: [] },
  { key: "day4", title: "יום 4 - בטן", subtitle: "Abs & Core", focusHe: "מיקוד: ליבה חזקה וקוביות", accent: "indigo", exercises: [
    { id: "e28", name: "Dragon Flags", sets: 3, reps: "5-8", he: "הצמדת גוף לספסל, הרמה כיחידה.", work: 40, rest: 90, category: "core", muscleGroup: "Core" },
    { id: "e29", name: "Hanging Leg Raises", sets: 4, reps: "12", he: "הבאת אגן למעלה.", work: 40, rest: 60, category: "core", muscleGroup: "Core" },
    { id: "e30", name: "Ab Wheel Rollouts", sets: 3, reps: "10-12", he: "מתיחה מלאה קדימה.", work: 40, rest: 75, category: "core", muscleGroup: "Core" },
    { id: "e31", name: "Weighted Russian Twists", sets: 3, reps: "20", he: "סיבוב מבוקר עם משקל.", work: 35, rest: 60, category: "core", muscleGroup: "Core" },
    { id: "e32", name: "Hollow Body Hold", sets: 4, reps: "45s", he: "ידיים ורגליים באוויר.", work: 45, rest: 45, category: "core", muscleGroup: "Core" },
    { id: "e33", name: "Cable Crunches", sets: 3, reps: "15", he: "כיווץ בטן עם משקל.", work: 35, rest: 60, category: "core", muscleGroup: "Core" },
    { id: "e34", name: "L-Sit Holds", sets: 4, reps: "20s", he: "תמיכה על הידיים, רגליים קדימה.", work: 20, rest: 60, category: "core", muscleGroup: "Core" }
  ], bonus: [] },
  { key: "day5", title: "יום 5 - כתפיים", subtitle: "Shoulder Armor", focusHe: "מיקוד: כתפיים רחבות (3D)", accent: "violet", exercises: [
    { id: "e35", name: "Z-Press", sets: 4, reps: "8-10", he: "ישיבה על הרצפה - ליבה נטו.", work: 45, rest: 100, category: "armor", muscleGroup: "Shoulders" },
    { id: "e36", name: "Arnold Press", sets: 3, reps: "10", he: "סיבוב המפרק לכיסוי מלא.", work: 45, rest: 90, category: "armor", muscleGroup: "Shoulders" },
    { id: "e37", name: "Lu Raises", sets: 4, reps: "12", he: "הרמה צידית מלאה למעלה.", work: 40, rest: 70, category: "armor", muscleGroup: "Shoulders" },
    { id: "e38", name: "Cable Lateral Raises", sets: 4, reps: "15", he: "מתח רציף לאורך התנועה.", work: 40, rest: 60, category: "armor", muscleGroup: "Shoulders" },
    { id: "e39", name: "Rear Delt Row", sets: 3, reps: "12", he: "משיכה גבוהה לכתף אחורית.", work: 35, rest: 60, category: "armor", muscleGroup: "Shoulders" },
    { id: "e40", name: "Heavy Shrugs", sets: 4, reps: "10-12", he: "החזקה בשיא הכיווץ.", work: 35, rest: 70, category: "armor", muscleGroup: "Shoulders" },
    { id: "e41", name: "Pike Pushups", sets: 3, reps: "10", he: "דחיפה בשיפוע לכתף.", work: 40, rest: 90, category: "armor", muscleGroup: "Shoulders" }
  ], bonus: [] },
  { key: "day6", title: "יום 6 - כוח", subtitle: "Full Body Apex", focusHe: "מיקוד: כוח מתפרץ ואחיזה", accent: "orange", exercises: [
    { id: "e42", name: "Landmine Thrusters", sets: 4, reps: "8-10", he: "סקוואט ודחיפה מתפרצת.", work: 45, rest: 90, category: "power", muscleGroup: "FullBody" },
    { id: "e43", name: "Farmer's Walk", sets: 3, reps: "40m", he: "משקל כבד, צעדים קצרים.", work: 45, rest: 90, category: "power", muscleGroup: "FullBody" },
    { id: "e44", name: "Renegade Row", sets: 3, reps: "10/arm", he: "פוש-אפ וחתירה.", work: 45, rest: 75, category: "power", muscleGroup: "FullBody" },
    { id: "e45", name: "Medicine Ball Slams", sets: 3, reps: "12", he: "הטחה אגרסיבית לרצפה.", work: 30, rest: 60, category: "power", muscleGroup: "FullBody" },
    { id: "e46", name: "Burpees (Weighted)", sets: 3, reps: "10", he: "ירידה ועלייה עם אפוד/משקל.", work: 40, rest: 90, category: "power", muscleGroup: "FullBody" },
    { id: "e47", name: "Sled Push", sets: 4, reps: "20m", he: "דחיפה כבדה של מזחלת.", work: 30, rest: 120, category: "power", muscleGroup: "FullBody" },
    { id: "e48", name: "Heavy Barbell Curls", sets: 3, reps: "6-8", he: "מאסה בסיסית לידיים.", work: 35, rest: 75, category: "power", muscleGroup: "Arms" }
  ], bonus: [] }
];

const allExercisesPool = initialDays.flatMap(day => day.exercises.map(ex => ({
  ...ex, videoUrl: yt(ex.name), imageUrl: imageByMuscle[ex.muscleGroup]
})));

// --- UI COMPONENTS ---
const Card = ({ className, children, onClick }: any) => (
  <div onClick={onClick} className={`bg-zinc-900/60 backdrop-blur-xl border border-white/5 rounded-[2.5rem] shadow-2xl overflow-hidden transition-all active:scale-[0.98] ${className || ''}`}>
    {children}
  </div>
);

const Button = React.forwardRef(({ className, variant = 'default', size = 'default', children, ...props }: any, ref: any) => {
  const base = "inline-flex items-center justify-center font-black transition-all active:scale-90 disabled:opacity-50 cursor-pointer";
  const variants: any = { 
    default: "bg-zinc-100 text-zinc-950 hover:bg-white shadow-[0_0_15px_rgba(255,255,255,0.2)]", 
    outline: "border border-zinc-700 bg-transparent hover:bg-zinc-800 text-zinc-300",
    ghost: "bg-transparent text-zinc-500 hover:text-white hover:bg-white/5",
    teal: "bg-teal-500 text-zinc-950 hover:bg-teal-400"
  };
  const sizes: any = { default: "h-11 px-6 rounded-xl", sm: "h-9 px-4 rounded-lg text-[10px]", lg: "h-14 px-8 rounded-2xl text-lg", icon: "h-10 w-10 rounded-xl" };
  return <button ref={ref} className={`${base} ${variants[variant]} ${sizes[size]} ${className || ''}`} {...props}>{children}</button>;
});

const Badge = ({ children, variant = "default" }: any) => {
  const styles: any = { default: "bg-white/5 text-white/50", teal: "bg-teal-500/10 text-teal-400 border border-teal-500/10" };
  return <div className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase border border-white/5 ${styles[variant]}`}>{children}</div>;
};

// --- MODALS ---
function AiCoachModal({ exercise, apiKey, onClose }: any) {
  const [ans, setAns] = useState("מערכת ה-AI מנתחת דגשים...");
  useEffect(() => {
    if (!apiKey) { setAns("נא להזין מפתח API בהגדרות לקבלת ייעוץ אישי."); return; }
    const fetchCue = async () => {
      try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents:[{ parts:[{ text: `Give a professional 2-sentence biomechanical cue in HEBREW for: ${exercise.name}` }] }] })
        });
        const d = await res.json(); setAns(d.candidates[0].content.parts[0].text);
      } catch { setAns("תקשורת AI נכשלה."); }
    };
    fetchCue();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-zinc-900 border border-white/5 w-full max-w-lg rounded-[2.5rem] overflow-hidden p-8 shadow-2xl">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4"><Bot className="text-teal-400" size={32}/><h3 className="text-2xl font-black italic uppercase">Apex AI Coach</h3></div>
          <Button variant="ghost" size="icon" onClick={onClose}><X/></Button>
        </div>
        <div className="space-y-6 text-right" dir="rtl">
           <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
              <p className="text-teal-400 font-bold mb-2">דגש לתרגיל {exercise.name}:</p>
              <p className="text-lg leading-relaxed font-medium italic">"{ans}"</p>
           </div>
           <Button className="w-full py-5" onClick={() => window.open(`https://gemini.google.com/app`, "_blank")}>שאל את ג'מיני ישירות</Button>
        </div>
      </motion.div>
    </div>
  );
}

// --- MAIN APP ---
function ReacherApp() {
  const [screen, setScreen] = useState<"splash" | "home" | "day" | "live" | "analytics" | "settings">("splash");
  const [viewMode, setViewMode] = useState<"days" | "muscles">("days");
  const [apiKey, setApiKey] = useState(() => localStorage.getItem("reacher_api_key") || "");
  const [exerciseHistory, setExerciseHistory] = useState(() => JSON.parse(localStorage.getItem("reacher_history") || "{}"));
  const [swaps, setSwaps] = useState(() => JSON.parse(localStorage.getItem("reacher_swaps") || "{}"));
  const [selectedDayKey, setSelectedDayKey] = useState("day1");
  const [selectedMuscle, setSelectedMuscle] = useState<MuscleGroup | null>(null);
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [setIndex, setSetIndex] = useState(0);
  const [phase, setPhase] = useState<"work" | "rest" | "done">("work");
  const [timeLeft, setTimeLeft] = useState(0);
  const [running, setRunning] = useState(false);
  const [aiModal, setAiModal] = useState<Exercise | null>(null);
  const [swapOrigin, setSwapOrigin] = useState<Exercise | null>(null);

  const audioCtx = useRef<AudioContext | null>(null);

  useEffect(() => localStorage.setItem("reacher_history", JSON.stringify(exerciseHistory)), [exerciseHistory]);
  useEffect(() => localStorage.setItem("reacher_swaps", JSON.stringify(swaps)), [swaps]);
  useEffect(() => localStorage.setItem("reacher_api_key", apiKey), [apiKey]);

  const initEngines = useCallback(() => {
    if (!audioCtx.current) audioCtx.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    if (audioCtx.current.state === 'suspended') audioCtx.current.resume();
    if ('speechSynthesis' in window) {
      const u = new SpeechSynthesisUtterance("");
      window.speechSynthesis.speak(u);
    }
    setScreen("home");
  }, []);

  const playBeep = (f = 880) => {
    if (!audioCtx.current) return;
    const o = audioCtx.current.createOscillator();
    const g = audioCtx.current.createGain();
    o.connect(g); g.connect(audioCtx.current.destination);
    o.frequency.value = f;
    g.gain.setValueAtTime(0.05, audioCtx.current.currentTime);
    g.gain.exponentialRampToValueAtTime(0.01, audioCtx.current.currentTime + 0.3);
    o.start(); o.stop(audioCtx.current.currentTime + 0.3);
  };

  const speak = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'he-IL'; u.rate = 1.0; window.speechSynthesis.speak(u);
  };

  const currentDay = useMemo(() => {
    const base = initialDays.find(d => d.key === selectedDayKey) || initialDays[0];
    return {
      ...base,
      exercises: base.exercises.map(ex => {
        const swappedId = swaps[ex.id];
        if (swappedId) {
          const alt = allExercisesPool.find(p => p.id === swappedId);
          if (alt) return { ...alt, originalIdForSwap: ex.id };
        }
        return ex;
      })
    };
  }, [selectedDayKey, swaps]);

  const activeEx = currentDay.exercises[exerciseIndex];

  // Timer
  useEffect(() => {
    let t: any;
    if (running && timeLeft > 0) {
      t = setInterval(() => setTimeLeft(p => p - 1), 1000);
    } else if (running && timeLeft === 0) {
      playBeep(phase === 'work' ? 440 : 880);
      if (phase === "work") {
        setPhase("rest"); setTimeLeft(activeEx.rest); speak("סט הושלם. מנוחה.");
      } else {
        if (setIndex + 1 < activeEx.sets) {
          setSetIndex(p => p + 1); setPhase("work"); setTimeLeft(activeEx.work);
        } else if (exerciseIndex + 1 < currentDay.exercises.length) {
          setExerciseIndex(p => p + 1); setSetIndex(0); setPhase("work"); setTimeLeft(currentDay.exercises[exerciseIndex+1].work);
        } else {
          setPhase("done"); setRunning(false); speak("אימון הושלם בהצלחה.");
        }
      }
    }
    return () => clearInterval(t);
  }, [running, timeLeft, phase, activeEx, currentDay, exerciseIndex, setIndex]);

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans selection:bg-teal-500/20 overflow-x-hidden" dir="rtl">
      
      {/* Modals */}
      <AnimatePresence>{aiModal && <AiCoachModal exercise={aiModal} apiKey={apiKey} onClose={() => setAiModal(null)} />}</AnimatePresence>
      <AnimatePresence>
        {swapOrigin && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-4">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-zinc-900 border border-white/10 w-full max-w-md rounded-[2.5rem] overflow-hidden p-8 shadow-2xl">
               <div className="flex justify-between items-center mb-8"><h3 className="text-2xl font-black italic uppercase">Swap Protocol</h3><Button variant="ghost" size="icon" onClick={() => setSwapOrigin(null)}><X/></Button></div>
               <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                 {allExercisesPool.filter(e => e.muscleGroup === swapOrigin.muscleGroup && e.id !== swapOrigin.id).map(alt => (
                   <div key={alt.id} className="bg-white/5 border border-white/5 p-4 rounded-2xl flex justify-between items-center"><div className="font-bold text-sm italic">{alt.name}</div><Button size="sm" variant="teal" onClick={() => { setSwaps(prev => ({ ...prev, [swapOrigin.originalIdForSwap || swapOrigin.id]: alt.id })); setSwapOrigin(null); }}>SELECT</Button></div>
                 ))}
                 <Button variant="outline" className="w-full mt-6 text-rose-400" onClick={() => { const s = {...swaps}; delete s[swapOrigin.originalIdForSwap || swapOrigin.id]; setSwaps(s); setSwapOrigin(null); }}>RESET TO ORIGINAL</Button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] bg-teal-500/5 blur-[180px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[70%] h-[70%] bg-blue-500/5 blur-[180px] rounded-full" />
      </div>

      <AnimatePresence mode="wait">
        
        {/* --- 1. SPLASH --- */}
        {screen === "splash" && (
          <motion.div key="splash" exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex flex-col items-center justify-center p-10 text-center">
            <div className="absolute inset-0">
              <img src={HERO_BG} className="w-full h-full object-cover opacity-20 grayscale" alt="Training" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
            </div>
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="z-10 space-y-12 max-w-lg">
              <Badge variant="teal">Elite Training Protocol v16</Badge>
              <h1 className="text-7xl md:text-9xl font-black tracking-tighter uppercase italic leading-[0.85]">APEX<br/><span className="text-teal-400">ENGINE</span></h1>
              <p className="text-zinc-400 text-sm font-bold uppercase tracking-widest leading-relaxed">Built Different. Train Ruthless. <br/> No Machines. Pure Muscle Intelligence.</p>
              <Button size="lg" onClick={initEngines} className="px-20 py-8 text-2xl shadow-2xl group relative overflow-hidden uppercase italic">
                <span className="relative z-10">Ignition</span>
                <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              </Button>
            </motion.div>
          </motion.div>
        )}

        {/* --- 2. HOME --- */}
        {screen === "home" && (
          <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-6xl mx-auto p-5 pt-12 space-y-12 pb-40">
            <header className="flex justify-between items-end px-2">
              <div>
                <h2 className="text-4xl font-black italic tracking-tight uppercase">PUSH LIMITS.</h2>
                <div className="flex items-center gap-2 mt-1 font-bold text-teal-500 uppercase tracking-widest text-[10px]"><Zap size={12} /> Status: Apex Optimized</div>
              </div>
              <div className="flex gap-4">
                <Button variant="outline" size="icon" onClick={openSpotifyApp}><Music size={20} className="text-emerald-400"/></Button>
                <Button variant="ghost" size="icon" onClick={() => setScreen("settings")}><Settings2 size={24} /></Button>
              </div>
            </header>

            <div className="flex bg-zinc-900/50 p-1.5 rounded-2xl w-fit border border-white/5 mx-auto backdrop-blur-xl">
              <button onClick={() => setViewMode("days")} className={`px-10 py-3 rounded-xl text-[11px] font-black transition ${viewMode === 'days' ? 'bg-white text-zinc-950 shadow-xl' : 'text-zinc-600'}`}>DAYS</button>
              <button onClick={() => setViewMode("muscles")} className={`px-10 py-3 rounded-xl text-[11px] font-black transition ${viewMode === 'muscles' ? 'bg-white text-zinc-950 shadow-xl' : 'text-zinc-600'}`}>MUSCLES</button>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {viewMode === "days" ? initialDays.map(day => (
                <Card key={day.key} className="group cursor-pointer" onClick={() => { setSelectedDayKey(day.key); setScreen("day"); }}>
                  <div className="relative h-52">
                     <img src={imageByMuscle[day.exercises[0].muscleGroup]} className="w-full h-full object-cover opacity-20 group-hover:scale-105 transition-all duration-1000" />
                     <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
                     <div className="absolute bottom-8 right-8 left-8 flex justify-between items-end">
                        <div>
                           <Badge variant="teal">{day.exercises.length} Protocols</Badge>
                           <h3 className="text-3xl font-black italic uppercase leading-none mt-2">{day.title}</h3>
                           <p className="text-zinc-500 text-[10px] font-bold mt-1 uppercase tracking-widest">{day.subtitle}</p>
                        </div>
                        <div className="text-teal-500 group-hover:translate-x-[-8px] transition-transform"><SkipBack size={32}/></div>
                     </div>
                  </div>
                  <div className="p-8 bg-zinc-900/20 space-y-4">
                     <p className="text-xs text-zinc-400 font-bold leading-relaxed">{day.focusHe}</p>
                     <Button className="w-full py-6 text-sm uppercase italic">Engage Session</Button>
                  </div>
                </Card>
              )) : Object.keys(imageByMuscle).map(m => (
                <Card key={m} className="h-32 relative cursor-pointer group" onClick={() => { setSelectedMuscle(m as MuscleGroup); setScreen("day"); }}>
                   <img src={imageByMuscle[m as MuscleGroup]} className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:scale-105 transition duration-1000" />
                   <div className="absolute inset-0 bg-gradient-to-l from-zinc-950 via-zinc-950/20 to-transparent" />
                   <div className="relative h-full flex items-center justify-between px-10">
                      <h4 className="text-2xl font-black italic uppercase tracking-tighter leading-none">{muscleHebrew[m] || m}</h4>
                      <div className="text-zinc-700 group-hover:text-teal-500 transition-colors"><SkipBack size={24} /></div>
                   </div>
                </Card>
              ))}
            </div>
          </motion.div>
        )}

        {/* --- 3. DAY VIEW --- */}
        {screen === "day" && (
          <motion.div key="day" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-5xl mx-auto p-5 pt-16 space-y-10 pb-40">
            <header className="flex justify-between items-center px-4">
              <Button variant="ghost" size="icon" onClick={() => { setSelectedMuscle(null); setScreen("home"); }}><X /></Button>
              <h2 className="text-3xl font-black italic uppercase tracking-tighter">{selectedMuscle ? muscleHebrew[selectedMuscle] : currentWorkout.title}</h2>
              <Button size="sm" variant="outline" onClick={() => { setExerciseIndex(0); setSetIndex(0); setTimeLeft(activeEx.work); setRunning(true); setScreen("live"); }}>Start Full Sequence</Button>
            </header>

            <div className="space-y-4">
              {(selectedMuscle ? allExercisesPool.filter(e => e.muscleGroup === selectedMuscle) : currentWorkout.exercises).map((ex, i) => (
                <Card key={ex.id} className="p-6 flex flex-col md:flex-row items-center gap-10 border-white/5 hover:border-teal-500/20 transition-all">
                  <div className="h-32 w-full md:w-44 rounded-3xl overflow-hidden border border-white/5 bg-zinc-950">
                     <img src={ex.imageUrl} className="w-full h-full object-cover opacity-40" />
                  </div>
                  <div className="flex-1 text-center md:text-right space-y-3">
                     <div className="flex justify-center md:justify-start gap-2">
                        <Badge variant="teal">{muscleHebrew[ex.muscleGroup]}</Badge>
                        <Badge>{ex.sets} × {ex.reps}</Badge>
                     </div>
                     <h4 className="text-2xl font-black italic uppercase tracking-tight">{ex.name}</h4>
                     <p className="text-zinc-400 text-xs font-bold leading-relaxed">"{ex.he}"</p>
                     <div className="flex justify-center md:justify-start gap-3 mt-2">
                        <Button variant="outline" size="sm" className="gap-2" onClick={() => setAiModal(ex)}><Bot size={12}/> ASK AI</Button>
                        <Button variant="outline" size="sm" className="gap-2" onClick={() => setSwapOrigin(ex)}><RefreshCcw size={12}/> SWAP</Button>
                        <Button variant="outline" size="icon" onClick={() => openYouTubeApp(ex.videoUrl)}><Youtube size={18} className="text-rose-500" /></Button>
                     </div>
                  </div>
                  <Button size="sm" variant="teal" onClick={() => { setExerciseIndex(i); setSetIndex(0); setTimeLeft(ex.work); setRunning(true); setScreen("live"); }}>GO LIVE</Button>
                </Card>
              ))}
            </div>
          </motion.div>
        )}

        {/* --- 4. LIVE --- */}
        {screen === "live" && (
          <motion.div key="live" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-zinc-950 z-50 p-6 overflow-y-auto flex flex-col">
            <header className="flex justify-between items-center mb-10">
               <Button variant="ghost" size="icon" onClick={() => { setRunning(false); setScreen("day"); }}><X /></Button>
               <div className="text-center">
                  <p className="text-[9px] font-black text-zinc-700 uppercase tracking-[0.5em] mb-1">APEX PROTOCOL ACTIVE</p>
                  <p className="font-black italic text-sm text-teal-400 uppercase">{currentWorkout.title}</p>
               </div>
               <div className="flex gap-2">
                 <Button variant="outline" size="icon" onClick={openSpotifyApp}><Music size={18}/></Button>
                 <Button variant="outline" size="icon" onClick={() => setAiModal(activeEx)}><Bot size={18}/></Button>
               </div>
            </header>

            <div className="flex-1 flex flex-col items-center justify-center space-y-16 pb-20">
               <div className="text-center space-y-4 px-6 max-w-2xl">
                  <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase leading-none">{activeEx.name}</h1>
                  <p className="text-zinc-400 font-bold italic text-2xl leading-relaxed">"{activeEx.he}"</p>
               </div>

               <div className="relative flex items-center justify-center">
                  <motion.div animate={running ? { scale: [1, 1.05, 1], opacity: [0.1, 0.3, 0.1] } : {}} transition={{ repeat: Infinity, duration: 2 }} className={`absolute h-96 w-96 rounded-full border border-teal-500/20`} />
                  <div className={`h-80 w-80 rounded-full border-2 flex flex-col items-center justify-center transition-all duration-1000 ${phase === 'rest' ? 'border-amber-500/30 bg-amber-500/5' : 'border-teal-500/40 bg-teal-500/5 shadow-[0_0_100px_rgba(20,184,166,0.1)]'}`}>
                     <span className="text-[12rem] font-black italic tabular-nums leading-none tracking-tighter">{timeLeft}</span>
                     <span className="text-[11px] font-black uppercase tracking-[0.6em] text-zinc-600 mt-8">{phase === 'work' ? "WORK" : "REST"}</span>
                  </div>
               </div>

               <div className="flex gap-20">
                  <div className="text-center">
                     <p className="text-zinc-700 text-[10px] font-black uppercase tracking-widest mb-2">Protocol Progress</p>
                     <p className="text-7xl font-black italic tracking-tighter">{setIndex + 1} <span className="text-2xl text-zinc-800">/ {activeEx.sets}</span></p>
                  </div>
                  <div className="text-center">
                     <p className="text-zinc-700 text-[10px] font-black uppercase tracking-widest mb-2">Rep Target</p>
                     <p className="text-7xl font-black italic tracking-tighter">{activeEx.reps}</p>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-8 pb-12 max-w-4xl mx-auto w-full">
               <Button className="py-12 text-4xl shadow-2xl uppercase italic" onClick={() => { playBeep(); setTimeLeft(0); }}>Complete Set</Button>
               <Button variant="outline" className="py-12 text-4xl" onClick={() => { initEngines(); setRunning(!running); }}>{running ? <Pause size={40} /> : <Play size={40} />}</Button>
            </div>
          </motion.div>
        )}

        {/* --- 5. SETTINGS --- */}
        {screen === "settings" && (
           <motion.div key="settings" className="max-w-2xl mx-auto p-12 pt-32 space-y-12">
              <header className="flex justify-between items-center px-2">
                <h2 className="text-5xl font-black italic uppercase tracking-tighter">System</h2>
                <Button variant="ghost" size="icon" onClick={() => setScreen("home")}><X /></Button>
              </header>
              <Card className="p-10 space-y-12 border-white/5 bg-zinc-900/40">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em]">Gemini Core Protocol Key</label>
                  <input type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)} className="w-full p-6 bg-black border border-white/10 rounded-2xl text-xl font-bold focus:border-teal-500 outline-none text-center" placeholder="PASTE API KEY" />
                </div>
                <div className="flex justify-between items-center bg-white/5 p-6 rounded-3xl">
                   <div>
                      <span className="font-black text-lg italic uppercase text-zinc-100">Audio Feedback</span>
                      <p className="text-[10px] text-zinc-500 font-bold uppercase mt-1">Beeps and Voice Cues</p>
                   </div>
                   <div className="w-14 h-7 bg-teal-500 rounded-full relative"><div className="absolute right-1 top-1 w-5 h-5 bg-white rounded-full" /></div>
                </div>
                <Button variant="outline" onClick={() => { if(confirm("Wipe Memory?")) { localStorage.clear(); window.location.reload(); }}} className="w-full py-6 text-rose-500 border-rose-500/20 uppercase font-black italic">Wipe System Memory</Button>
              </Card>
           </motion.div>
        )}

      </AnimatePresence>

      {/* Persistent Bottom HUD */}
      {screen !== 'splash' && screen !== 'live' && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] w-full max-w-lg px-8">
           <div className="bg-zinc-900/90 backdrop-blur-3xl border border-white/5 p-5 rounded-[2.5rem] flex justify-around items-center shadow-[0_40px_100px_rgba(0,0,0,0.9)]">
              <button onClick={() => setScreen("home")} className={`p-4 rounded-full transition-all ${screen === 'home' ? 'bg-teal-500 text-zinc-950 shadow-lg' : 'text-zinc-600 hover:text-white'}`}><Home size={24} /></button>
              <button onClick={() => setScreen("day")} className={`p-4 rounded-full transition-all ${screen === 'day' ? 'text-teal-400' : 'text-zinc-600 hover:text-white'}`}><ListChecks size={24} /></button>
              <button onClick={() => setScreen("analytics")} className={`p-4 rounded-full transition-all ${screen === 'analytics' ? 'text-teal-400' : 'text-zinc-600 hover:text-white'}`}><TrendingUp size={24} /></button>
              <button onClick={() => setScreen("settings")} className={`p-4 rounded-full transition-all ${screen === 'settings' ? 'bg-white text-zinc-950' : 'text-zinc-600 hover:text-white'}`}><Settings2 size={24} /></button>
           </div>
        </div>
      )}
    </div>
  );
}

// --- RENDER ---
const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(<ReacherApp />);
}
