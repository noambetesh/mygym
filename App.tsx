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

// --- IMAGES & ASSETS ---
const REACHER_HERO = "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=1400&auto=format&fit=crop";

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

const yt = (q: string) => `https://www.youtube.com/watch?v=p1qV6WfI7eQ2{encodeURIComponent(q)}`;

// --- APP LOGIC HELPERS (Spotify/YouTube from v7) ---
function openSpotifyApp() {
  if (typeof window === "undefined") return;
  const now = Date.now();
  window.location.href = "spotify://";
  setTimeout(() => { if (Date.now() - now < 1800) window.open("http://googleusercontent.com/spotify.com/13", "_blank"); }, 900);
}

function openYouTubeApp(url?: string) {
  if (typeof window === "undefined") return;
  const fallback = url || "https://www.youtube.com/watch?v=p1qV6WfI7eQ4";
  const now = Date.now();
  window.location.href = "youtube://";
  setTimeout(() => { if (Date.now() - now < 1800) window.open(fallback, "_blank"); }, 900);
}

// --- DATASET: THE COMPLETE REACHER PROTOCOL ---
const initialDays: DayPlan[] = [
  { key: "day1", title: "יום 1 - גב", subtitle: "Reacher Width & Density", focusHe: "מיקוד: גב עליון, לטים וכוח משיכה", accent: "teal", exercises: [
    { id: "e1", name: "Meadows Row", sets: 4, reps: "10-12", he: "עמידה צידית, משיכה לכיוון האגן.", work: 45, rest: 90, category: "pull", muscleGroup: "Back" },
    { id: "e2", name: "Single-Arm Lat Pulldown", sets: 4, reps: "12", he: "מתיחה מלאה למעלה, סיום במרפק צמוד.", work: 40, rest: 75, category: "pull", muscleGroup: "Back" },
    { id: "e3", name: "Chest-Supported T-Bar Row", sets: 3, reps: "10", he: "בידוד שכמות מוחלט.", work: 40, rest: 80, category: "pull", muscleGroup: "Back" },
    { id: "e4", name: "Weighted Pull-Ups", sets: 4, reps: "6-8", he: "חזה למעלה, מתיחה מלאה למטה.", work: 35, rest: 120, category: "pull", muscleGroup: "Back" },
    { id: "e5", name: "Pendlay Row", sets: 4, reps: "8", he: "משיכה מתפרצת מהרצפה, גב מקביל לקרקע.", work: 45, rest: 90, category: "pull", muscleGroup: "Back" },
    { id: "e6", name: "Seal Row", sets: 3, reps: "10", he: "שכיבה על ספסל גבוה, נטרול מומנטום גב תחתון.", work: 40, rest: 80, category: "pull", muscleGroup: "Back" },
    { id: "e7", name: "Rack Pulls", sets: 3, reps: "6", he: "משיכה מעל הברך, דגש על זוקפי גב ועובי.", work: 50, rest: 120, category: "pull", muscleGroup: "Back" },
    { id: "e8", name: "Bayesian Cable Curls", sets: 3, reps: "12-15", he: "גב לכבל, מתיחה עמוקה.", work: 30, rest: 60, category: "pull", muscleGroup: "Arms" },
    { id: "e9", name: "Zottman Curls", sets: 3, reps: "12", he: "פיתול האמה בירידה.", work: 30, rest: 60, category: "pull", muscleGroup: "Arms" }
  ], bonus: [] },
  { key: "day2", title: "יום 2 - חזה", subtitle: "Reacher Power Push", focusHe: "מיקוד: חזה עליון, לחיצות כבדות וטריספס", accent: "blue", exercises: [
    { id: "e10", name: "Low-Incline DB Press", sets: 4, reps: "8-10", he: "שיפוע 15-30, ירידה עמוקה.", work: 45, rest: 100, category: "push", muscleGroup: "Chest" },
    { id: "e11", name: "Converging Chest Press", sets: 3, reps: "10-12", he: "סחיטה מקסימלית במרכז.", work: 40, rest: 80, category: "push", muscleGroup: "Chest" },
    { id: "e12", name: "Dumbbell Floor Press", sets: 4, reps: "8", he: "שכיבה על הרצפה, כוח מתפרץ מהחצי.", work: 45, rest: 90, category: "push", muscleGroup: "Chest" },
    { id: "e13", name: "Weighted Push-ups", sets: 3, reps: "12-15", he: "משקל על הגב, ידיות להעמקת הטווח.", work: 40, rest: 75, category: "push", muscleGroup: "Chest" },
    { id: "e14", name: "Weighted Dips", sets: 4, reps: "8", he: "הטיה קדימה לחזה.", work: 45, rest: 100, category: "push", muscleGroup: "Chest" },
    { id: "e15", name: "JM Press", sets: 3, reps: "8-10", he: "מלך הכוח לטריספס.", work: 40, rest: 80, category: "push", muscleGroup: "Arms" },
    { id: "e16", name: "Katana Extension", sets: 3, reps: "12", he: "מתיחה לראש הארוך.", work: 35, rest: 60, category: "push", muscleGroup: "Arms" },
    { id: "e17", name: "Hex Press", sets: 3, reps: "12", he: "הצמדת משקולות במרכז החזה.", work: 35, rest: 70, category: "push", muscleGroup: "Chest" }
  ], bonus: [] },
  { key: "day3", title: "יום 3 - רגליים", subtitle: "Functional Massive Legs", focusHe: "מיקוד: קוואדס, המסטרינג וכוח בסיסי", accent: "emerald", exercises: [
    { id: "e18", name: "Zercher Squat", sets: 4, reps: "8-10", he: "טורסו זקוף, מוט במרפקים.", work: 50, rest: 150, category: "legs", muscleGroup: "Legs" },
    { id: "e19", name: "Bulgarian Split Squat", sets: 3, reps: "8/leg", he: "ירידה עמוקה, יציבות ליבה.", work: 45, rest: 90, category: "legs", muscleGroup: "Legs" },
    { id: "e20", name: "Romanian Deadlift", sets: 4, reps: "10", he: "מוט צמוד לרגליים, מתיחה המסטרינג.", work: 50, rest: 120, category: "legs", muscleGroup: "Legs" },
    { id: "e21", name: "Kas Glute Bridge", sets: 3, reps: "12", he: "דגש נקי על הישבן.", work: 45, rest: 90, category: "legs", muscleGroup: "Legs" },
    { id: "e22", name: "Goblet Squat", sets: 3, reps: "12", he: "משקולת אחת, טווח תנועה מקסימלי.", work: 40, rest: 80, category: "legs", muscleGroup: "Legs" },
    { id: "e23", name: "Nordic Hamstring Curl", sets: 3, reps: "6", he: "ירידה איטית בשליטה.", work: 30, rest: 100, category: "legs", muscleGroup: "Legs" },
    { id: "e24", name: "Step-ups (High Box)", sets: 3, reps: "10/leg", he: "דחיפה דרך העקב.", work: 40, rest: 75, category: "legs", muscleGroup: "Legs" }
  ], bonus: [] },
  { key: "day4", title: "יום 4 - בטן (CORE)", subtitle: "The Reacher Midsection", focusHe: "מיקוד: ליבה חזקה וקוביות דחוסות", accent: "indigo", exercises: [
    { id: "e25", name: "Dragon Flags", sets: 3, reps: "5-8", he: "התנועה האולטימטיבית של ברוס לי/ריצ'ר.", work: 40, rest: 90, category: "core", muscleGroup: "Core" },
    { id: "e26", name: "Hanging Leg Raises", sets: 4, reps: "12", he: "הבאת אגן למעלה, רגליים ישרות.", work: 40, rest: 60, category: "core", muscleGroup: "Core" },
    { id: "e27", name: "Hollow Body Hold", sets: 4, reps: "45s", he: "הצמדת גב תחתון לרצפה, ידיים ורגליים באוויר.", work: 45, rest: 45, category: "core", muscleGroup: "Core" },
    { id: "e28", name: "Weighted Russian Twists", sets: 3, reps: "20", he: "סיבוב מבוקר עם משקולת.", work: 35, rest: 60, category: "core", muscleGroup: "Core" },
    { id: "e29", name: "Ab Wheel Rollouts", sets: 3, reps: "10-12", he: "מתיחה מלאה בשליטה.", work: 40, rest: 75, category: "core", muscleGroup: "Core" },
    { id: "e30", name: "Plank with Reach", sets: 3, reps: "12", he: "מצב פלאנק, שליחת יד קדימה ללא סיבוב אגן.", work: 45, rest: 45, category: "core", muscleGroup: "Core" }
  ], bonus: [] },
  { key: "day5", title: "יום 5 - כתפיים", subtitle: "3D Armor", focusHe: "מיקוד: כתפיים רחבות ויציבה עוצמתית", accent: "violet", exercises: [
    { id: "e31", name: "Z-Press", sets: 4, reps: "8-10", he: "ישיבה על הרצפה, דחיפה נקייה.", work: 45, rest: 100, category: "armor", muscleGroup: "Shoulders" },
    { id: "e32", name: "Arnold Press", sets: 3, reps: "10", he: "סיבוב מלא של המפרק לכיסוי כל הכתף.", work: 45, rest: 90, category: "armor", muscleGroup: "Shoulders" },
    { id: "e33", name: "Lu Raises", sets: 4, reps: "12", he: "הרמה צידית מלאה מעבר לראש.", work: 40, rest: 70, category: "armor", muscleGroup: "Shoulders" },
    { id: "e34", name: "Face Pulls", sets: 4, reps: "15", he: "משיכה למצח, מרפקים החוצה.", work: 40, rest: 60, category: "armor", muscleGroup: "Shoulders" },
    { id: "e35", name: "Rear Delt Row", sets: 3, reps: "12", he: "משיכה גבוהה לכתף אחורית.", work: 35, rest: 60, category: "armor", muscleGroup: "Shoulders" },
    { id: "e36", name: "Pike Pushups", sets: 3, reps: "10", he: "דחיפת הגוף בשיפוע חריף.", work: 40, rest: 90, category: "armor", muscleGroup: "Shoulders" }
  ], bonus: [] }
];

const allExercisesPool = initialDays.flatMap(day => day.exercises.map(ex => ({
  ...ex,
  videoUrl: yt(ex.name),
  imageUrl: imageByMuscle[ex.muscleGroup]
})));

// --- UI COMPONENTS ---
const GlassCard = ({ className, children, onClick }: any) => (
  <motion.div 
    whileHover={onClick ? { scale: 1.01, borderColor: "rgba(20, 184, 166, 0.4)" } : {}}
    onClick={onClick}
    className={`bg-slate-900/40 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] shadow-2xl overflow-hidden transition-all ${className || ''}`}
  >
    {children}
  </motion.div>
);

const ActionButton = React.forwardRef(({ className, variant = 'default', size = 'default', children, ...props }: any, ref: any) => {
  const base = "inline-flex items-center justify-center font-black transition-all active:scale-95 disabled:opacity-50 cursor-pointer";
  const variants: any = { 
    default: "bg-teal-500 text-slate-950 hover:bg-teal-400 shadow-[0_0_20px_rgba(20,184,166,0.3)]", 
    outline: "border border-white/10 bg-transparent hover:bg-white/5 text-white/90",
    ghost: "bg-transparent text-white/40 hover:text-white hover:bg-white/5",
    danger: "bg-rose-600 text-white"
  };
  const sizes: any = { default: "h-12 px-6 rounded-2xl", sm: "h-9 px-4 rounded-xl text-[10px]", lg: "h-16 px-10 rounded-3xl text-lg", icon: "h-11 w-11 rounded-xl" };
  return <button ref={ref} className={`${base} ${variants[variant]} ${sizes[size]} ${className || ''}`} {...props}>{children}</button>;
});

const Badge = ({ children, variant = "default" }: any) => {
  const styles: any = { default: "bg-white/5 text-white/50", teal: "bg-teal-500/10 text-teal-400 border border-teal-500/10" };
  return <div className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest border border-white/5 ${styles[variant]}`}>{children}</div>;
};

// --- MODALS ---
function AiCoachModal({ exercise, apiKey, onClose }: any) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-900 border border-white/10 w-full max-w-lg rounded-[2.5rem] overflow-hidden p-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4"><Bot className="text-teal-400" size={32}/><h3 className="text-2xl font-black italic uppercase">AI Coach</h3></div>
          <ActionButton variant="ghost" size="icon" onClick={onClose}><X/></ActionButton>
        </div>
        <div className="space-y-6 text-right" dir="rtl">
           <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
              <p className="text-teal-400 font-bold mb-2">דגש ביו-מכני ל{exercise.name}:</p>
              <p className="text-lg leading-relaxed font-medium italic">"נעם, שים לב לטווח התנועה המלא. אל תשתמש במומנטום. המטרה היא גיוס יחידות מוטוריות מקסימלי."</p>
           </div>
           <ActionButton className="w-full py-6" onClick={() => window.open(`https://gemini.google.com/app`, "_blank")}>שאל שאלות נוספות בג'מיני</ActionButton>
        </div>
      </motion.div>
    </div>
  );
}

// --- MAIN APP ---
function ReacherApp() {
  const [screen, setScreen] = useState<"splash" | "home" | "day" | "live" | "analytics" | "settings">("splash");
  const [exerciseHistory, setExerciseHistory] = useState(() => JSON.parse(localStorage.getItem("reacher_history") || "{}"));
  const [geminiApiKey, setGeminiApiKey] = useState(() => localStorage.getItem("reacher_api_key") || "");
  const [selectedDayKey, setSelectedDayKey] = useState("day1");
  const [selectedMuscle, setSelectedMuscle] = useState<MuscleGroup | null>(null);
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [setIndex, setSetIndex] = useState(0);
  const [phase, setPhase] = useState<"work" | "rest" | "done">("work");
  const [timeLeft, setTimeLeft] = useState(0);
  const [running, setRunning] = useState(false);
  const [activeAiModal, setActiveAiModal] = useState<Exercise | null>(null);

  const audioCtx = useRef<AudioContext | null>(null);

  // Persistence
  useEffect(() => localStorage.setItem("reacher_history", JSON.stringify(exerciseHistory)), [exerciseHistory]);

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
    u.lang = 'he-IL'; u.rate = 1.0;
    window.speechSynthesis.speak(u);
  };

  const currentWorkout = useMemo(() => initialDays.find(d => d.key === selectedDayKey) || initialDays[0], [selectedDayKey]);
  const activeEx = currentWorkout.exercises[exerciseIndex];

  // Timer Logic
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
        } else if (exerciseIndex + 1 < currentWorkout.exercises.length) {
          setExerciseIndex(p => p + 1); setSetIndex(0); setPhase("work"); setTimeLeft(currentWorkout.exercises[exerciseIndex+1].work);
        } else {
          setPhase("done"); setRunning(false); speak("אימון הושלם בהצלחה.");
        }
      }
    }
    return () => clearInterval(t);
  }, [running, timeLeft, phase, activeEx, currentWorkout, exerciseIndex, setIndex]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-teal-500/20 overflow-x-hidden" dir="rtl">
      
      <AnimatePresence>{activeAiModal && <AiCoachModal exercise={activeAiModal} onClose={() => setActiveAiModal(null)} />}</AnimatePresence>

      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] bg-teal-500/5 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[70%] h-[70%] bg-indigo-500/5 blur-[150px] rounded-full" />
      </div>

      <AnimatePresence mode="wait">
        
        {/* --- 1. SPLASH --- */}
        {screen === "splash" && (
          <motion.div key="splash" exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex flex-col items-center justify-center p-10 text-center">
            <div className="absolute inset-0">
              <img src={REACHER_HERO} className="w-full h-full object-cover opacity-15 grayscale" alt="Reacher" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent" />
            </div>
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="z-10 space-y-10 max-w-lg">
              <div className="flex justify-center gap-2 font-mono text-teal-400 text-xs uppercase tracking-widest"><Cpu size={14}/> APEX ENGINE v15</div>
              <h1 className="text-7xl md:text-9xl font-black tracking-tighter uppercase italic leading-[0.85]">REACHER<br/><span className="text-teal-400">APEX</span></h1>
              <p className="text-slate-400 text-sm font-bold uppercase tracking-widest leading-relaxed">Built Different. Train Ruthless. <br/> No Machines. Pure Muscle.</p>
              <ActionButton size="lg" onClick={initEngines} className="px-20 py-8 text-2xl shadow-2xl group relative overflow-hidden">
                <span className="relative z-10 uppercase italic">Ignition</span>
                <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              </ActionButton>
            </motion.div>
          </motion.div>
        )}

        {/* --- 2. HOME --- */}
        {screen === "home" && (
          <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-6xl mx-auto p-5 pt-12 space-y-12 pb-40">
            <header className="flex justify-between items-end px-2">
              <div>
                <h2 className="text-4xl font-black italic tracking-tight uppercase">BUILT DIFFERENT.</h2>
                <div className="flex items-center gap-2 mt-1 font-bold text-teal-500 uppercase tracking-widest text-[10px]"><Zap size={12} /> System: Reacher Optimized</div>
              </div>
              <div className="flex gap-4">
                <ActionButton variant="outline" size="icon" onClick={openSpotifyApp}><Music size={20}/></ActionButton>
                <ActionButton variant="ghost" size="icon" onClick={() => setScreen("settings")}><Settings2 size={24} /></ActionButton>
              </div>
            </header>

            <div className="flex bg-slate-900/50 p-1.5 rounded-2xl w-fit border border-white/5 mx-auto backdrop-blur-xl">
              <button onClick={() => setViewMode("days")} className={`px-10 py-3 rounded-xl text-[11px] font-black transition ${viewMode === 'days' ? 'bg-white text-slate-950 shadow-xl' : 'text-slate-600'}`}>DAYS</button>
              <button onClick={() => setViewMode("muscles")} className={`px-10 py-3 rounded-xl text-[11px] font-black transition ${viewMode === 'muscles' ? 'bg-white text-slate-950 shadow-xl' : 'text-slate-600'}`}>MUSCLES</button>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {viewMode === "days" ? initialDays.map(day => (
                <GlassCard key={day.key} className="group cursor-pointer" onClick={() => { setSelectedDayKey(day.key); setScreen("day"); }}>
                  <div className="relative h-56">
                     <img src={imageByMuscle[day.exercises[0].muscleGroup]} className="w-full h-full object-cover opacity-20 group-hover:scale-105 transition-all duration-1000" />
                     <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                     <div className="absolute bottom-8 right-8 left-8 flex justify-between items-end">
                        <div>
                           <Badge variant="teal">{day.exercises.length} Protocols</Badge>
                           <h3 className="text-4xl font-black italic uppercase leading-none mt-2">{day.title}</h3>
                           <p className="text-slate-500 text-[10px] font-bold mt-1 uppercase tracking-widest">{day.subtitle}</p>
                        </div>
                        <div className="text-teal-500 group-hover:translate-x-[-8px] transition-transform"><SkipBack size={32}/></div>
                     </div>
                  </div>
                  <div className="p-8 bg-slate-900/20 space-y-4">
                     <p className="text-xs text-slate-400 font-bold">{day.focusHe}</p>
                     <ActionButton className="w-full py-6 text-sm uppercase italic">Engage Workout</ActionButton>
                  </div>
                </GlassCard>
              )) : Object.keys(imageByMuscle).map(m => (
                <GlassCard key={m} className="h-32 relative cursor-pointer group" onClick={() => { setSelectedMuscle(m as MuscleGroup); setScreen("day"); }}>
                   <img src={imageByMuscle[m as MuscleGroup]} className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:scale-105 transition duration-1000" />
                   <div className="absolute inset-0 bg-gradient-to-l from-slate-950 via-slate-950/20 to-transparent" />
                   <div className="relative h-full flex items-center justify-between px-10">
                      <h4 className="text-2xl font-black italic uppercase tracking-tighter leading-none">{muscleHebrew[m] || m}</h4>
                      <div className="text-slate-700 group-hover:text-teal-500 transition-colors"><SkipBack size={20} /></div>
                   </div>
                </GlassCard>
              ))}
            </div>

            {/* Stats Glance */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "PROTOCOLS", val: "12", icon: Activity, col: "text-teal-500" },
                { label: "DENSITY", val: "45K", icon: Weight, col: "text-rose-500" },
                { label: "AI SYNC", val: "ACTIVE", icon: Sparkles, col: "text-indigo-500" },
                { label: "STREAK", val: "5D", icon: Trophy, col: "text-amber-500" }
              ].map((s, i) => (
                <GlassCard key={i} className="p-6 text-center space-y-1">
                  <div className={`${s.col} flex justify-center mb-1`}><s.icon size={18} /></div>
                  <div className="text-2xl font-black italic">{s.val}</div>
                  <div className="text-[9px] font-black text-slate-600 uppercase tracking-widest">{s.label}</div>
                </GlassCard>
              ))}
            </div>
          </motion.div>
        )}

        {/* --- 3. DAY VIEW --- */}
        {screen === "day" && (
          <motion.div key="day" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-5xl mx-auto p-5 pt-16 space-y-10 pb-40">
            <header className="flex justify-between items-center px-4">
              <ActionButton variant="ghost" size="icon" onClick={() => { setSelectedMuscle(null); setScreen("home"); }}><X /></ActionButton>
              <h2 className="text-3xl font-black italic uppercase tracking-tighter">{selectedMuscle ? muscleHebrew[selectedMuscle] : currentWorkout.title}</h2>
              <ActionButton size="sm" variant="outline" onClick={() => { setExerciseIndex(0); setSetIndex(0); setTimeLeft(activeEx.work); setRunning(true); setScreen("live"); }}>Start Session</ActionButton>
            </header>

            <div className="space-y-6">
              {(selectedMuscle ? allExercisesPool.filter(e => e.muscleGroup === selectedMuscle) : currentWorkout.exercises).map((ex, i) => (
                <GlassCard key={ex.id} className="p-8 flex flex-col md:flex-row items-center gap-10 border-white/5">
                  <div className="h-32 w-full md:w-48 rounded-3xl overflow-hidden border border-white/5 bg-slate-950">
                     <img src={imageByMuscle[ex.muscleGroup]} className="w-full h-full object-cover opacity-40" />
                  </div>
                  <div className="flex-1 text-center md:text-right space-y-4">
                     <div className="flex justify-center md:justify-start gap-2">
                        <Badge variant="teal">{muscleHebrew[ex.muscleGroup]}</Badge>
                        <Badge>{categoryHebrew[ex.category]}</Badge>
                     </div>
                     <h4 className="text-2xl font-black italic uppercase tracking-tight">{ex.name}</h4>
                     <p className="text-slate-400 text-xs font-bold leading-relaxed">"{ex.he}"</p>
                     <div className="flex justify-center md:justify-start gap-4">
                        <div className="text-[11px] font-black uppercase text-slate-500">Sets: <span className="text-white">{ex.sets}</span></div>
                        <div className="text-[11px] font-black uppercase text-slate-500">Reps: <span className="text-white">{ex.reps}</span></div>
                     </div>
                     <div className="flex justify-center md:justify-start gap-3 mt-4">
                        <ActionButton variant="outline" size="sm" onClick={() => setActiveAiModal(ex)}><Sparkles size={12}/> Ask AI</ActionButton>
                        <ActionButton variant="outline" size="sm" onClick={() => {/* Swap Logic */}}><RefreshCcw size={12}/> Swap</ActionButton>
                        <ActionButton variant="outline" size="icon" onClick={() => openYouTubeApp(yt(ex.name))}><Youtube size={16} className="text-rose-500"/></ActionButton>
                     </div>
                  </div>
                  <ActionButton size="sm" onClick={() => { setExerciseIndex(i); setSetIndex(0); setTimeLeft(ex.work); setRunning(true); setScreen("live"); }}>Go Live</ActionButton>
                </GlassCard>
              ))}
            </div>
          </motion.div>
        )}

        {/* --- 4. LIVE --- */}
        {screen === "live" && (
          <motion.div key="live" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-slate-950 z-50 p-6 overflow-y-auto flex flex-col">
            <header className="flex justify-between items-center mb-10">
               <ActionButton variant="ghost" size="icon" onClick={() => { setRunning(false); setScreen("day"); }}><X /></ActionButton>
               <div className="text-center">
                  <p className="text-[9px] font-black text-slate-700 uppercase tracking-[0.5em] mb-1">REACHER PROTOCOL ACTIVE</p>
                  <p className="font-black italic text-sm text-teal-400 uppercase">{currentWorkout.title}</p>
               </div>
               <ActionButton variant="outline" size="icon" onClick={openSpotifyApp}><Music size={18}/></ActionButton>
            </header>

            <div className="flex-1 flex flex-col items-center justify-center space-y-16 pb-20">
               <div className="text-center space-y-4 px-6 max-w-2xl">
                  <h1 className="text-6xl md:text-9xl font-black italic tracking-tighter uppercase leading-none">{activeEx.name}</h1>
                  <p className="text-slate-400 font-bold italic text-2xl leading-relaxed">"{activeEx.he}"</p>
               </div>

               <div className="relative flex items-center justify-center">
                  <motion.div animate={running ? { scale: [1, 1.05, 1], opacity: [0.2, 0.5, 0.2] } : {}} transition={{ repeat: Infinity, duration: 2 }} className={`absolute h-96 w-96 rounded-full border border-teal-500/20`} />
                  <div className={`h-80 w-80 rounded-full border-2 flex flex-col items-center justify-center transition-all duration-1000 ${phase === 'rest' ? 'border-amber-500/30 bg-amber-500/5' : 'border-teal-500/40 bg-teal-500/5 shadow-[0_0_80px_rgba(20,184,166,0.15)]'}`}>
                     <span className="text-[12rem] font-black italic tabular-nums leading-none tracking-tighter">{timeLeft}</span>
                     <span className="text-[11px] font-black uppercase tracking-[0.6em] text-slate-600 mt-8">{phase === 'work' ? "WORK PHASE" : "REST PHASE"}</span>
                  </div>
               </div>

               <div className="flex gap-20">
                  <div className="text-center">
                     <p className="text-slate-700 text-[10px] font-black uppercase tracking-widest mb-2">Protocol Status</p>
                     <p className="text-7xl font-black italic tracking-tighter">{setIndex + 1} <span className="text-2xl text-slate-800">/ {activeEx.sets}</span></p>
                  </div>
                  <div className="text-center">
                     <p className="text-slate-700 text-[10px] font-black uppercase tracking-widest mb-2">Rep Target</p>
                     <p className="text-7xl font-black italic tracking-tighter">{activeEx.reps}</p>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-8 pb-12 max-w-4xl mx-auto w-full">
               <ActionButton className="py-12 text-4xl shadow-2xl uppercase italic" onClick={() => { playBeep(); setTimeLeft(0); }}>Protocol Complete</ActionButton>
               <ActionButton variant="outline" className="py-12 text-4xl" onClick={() => { initEngines(); setRunning(!running); }}>{running ? <Pause size={40} /> : <Play size={40} />}</ActionButton>
            </div>
          </motion.div>
        )}

      </AnimatePresence>

      {/* Persistent Bottom Navigation */}
      {screen !== 'splash' && screen !== 'live' && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] w-full max-w-lg px-8">
           <div className="bg-slate-900/80 backdrop-blur-3xl border border-white/5 p-5 rounded-[2.5rem] flex justify-around items-center shadow-[0_40px_100px_rgba(0,0,0,0.9)]">
              <button onClick={() => setScreen("home")} className={`p-4 rounded-full transition-all ${screen === 'home' ? 'bg-teal-500 text-slate-950 shadow-lg shadow-teal-500/50' : 'text-slate-600 hover:text-white'}`}><Home size={28} /></button>
              <button onClick={() => setScreen("day")} className={`p-4 rounded-full transition-all ${screen === 'day' ? 'text-teal-400' : 'text-slate-600 hover:text-white'}`}><ListChecks size={28} /></button>
              <button onClick={() => setScreen("analytics")} className={`p-4 rounded-full transition-all ${screen === 'analytics' ? 'text-teal-400' : 'text-slate-600 hover:text-white'}`}><TrendingUp size={28} /></button>
              <button onClick={() => setScreen("settings")} className={`p-4 rounded-full transition-all ${screen === 'settings' ? 'bg-white text-slate-950' : 'text-slate-600 hover:text-white'}`}><Settings2 size={28} /></button>
           </div>
        </div>
      )}
    </div>
  );
}

// --- INITIALIZATION ---
const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(<ReacherApp />);
}
