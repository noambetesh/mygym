import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { createRoot } from "react-dom/client";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play, Pause, RotateCcw, SkipForward, SkipBack, Dumbbell, Flame, Clock3,
  CheckCircle2, Youtube, TimerReset, Volume2, VolumeX, Home, ListChecks,
  Swords, Trophy, Settings2, Activity, CalendarDays, Weight, Eye,
  Bot, Sparkles, X, Send, MessageCircle, ExternalLink, TrendingUp, RefreshCcw, AlertTriangle, Plus, Zap, Cpu
} from "lucide-react";

// --- TYPES & CONSTANTS ---
type MuscleGroup = "Back" | "Chest" | "Legs" | "Shoulders" | "Arms" | "Core" | "FullBody";
type Exercise = { id: string; name: string; sets: number; reps: string; he: string; work: number; rest: number; category: "pull" | "push" | "legs" | "armor" | "power" | "core" | "bonus"; muscleGroup: MuscleGroup; videoUrl?: string; imageUrl?: string; };
type DayPlan = { key: string; title: string; subtitle: string; focusHe: string; accent: string; exercises: Exercise[]; bonus: Omit<Exercise, "sets" | "reps" | "work" | "rest">[]; };
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

const muscleHebrew: Record<string, string> = {
  Back: "גב", Chest: "חזה", Legs: "רגליים", Shoulders: "כתפיים", Arms: "ידיים", Core: "ליבה", FullBody: "כל הגוף"
};

const categoryHebrew: Record<string, string> = {
  pull: "משיכה", push: "דחיפה", legs: "רגליים", armor: "כתפיים", power: "כוח", core: "ליבה", bonus: "בונוס"
};

// --- DATASET RESTORATION (v7 FULL) ---
const yt = (query: string) => `https://www.youtube.com/watch?v=p1qV6WfI7eQ1{encodeURIComponent(query)}`;

const exerciseMedia: Record<string, { videoUrl: string; imageUrl: string }> = {
  e1:  { videoUrl: yt("Meadows Row tutorial"), imageUrl: imageByMuscle.Back },
  e2:  { videoUrl: yt("Single Arm Iliac Lat Pulldown tutorial"), imageUrl: imageByMuscle.Back },
  e3:  { videoUrl: yt("Chest Supported T Bar Row tutorial"), imageUrl: imageByMuscle.Back },
  e4:  { videoUrl: yt("Weighted Pull Ups tutorial"), imageUrl: imageByMuscle.Back },
  e5:  { videoUrl: yt("Bayesian Cable Curls tutorial"), imageUrl: imageByMuscle.Arms },
  e6:  { videoUrl: yt("Zottman Curls tutorial"), imageUrl: imageByMuscle.Arms },
  e7:  { videoUrl: yt("Low Incline Dumbbell Press tutorial"), imageUrl: imageByMuscle.Chest },
  e8:  { videoUrl: yt("Converging Chest Press Machine tutorial"), imageUrl: imageByMuscle.Chest },
  e9:  { videoUrl: yt("Cable Crossover tutorial"), imageUrl: imageByMuscle.Chest },
  e10: { videoUrl: yt("JM Press tutorial"), imageUrl: imageByMuscle.Arms },
  e11: { videoUrl: yt("Katana Extension triceps tutorial"), imageUrl: imageByMuscle.Arms },
  e12: { videoUrl: yt("Weighted Dips tutorial"), imageUrl: imageByMuscle.Chest },
  e13: { videoUrl: yt("Zercher Squat tutorial"), imageUrl: imageByMuscle.Legs },
  e14: { videoUrl: yt("Bulgarian Split Squat tutorial"), imageUrl: imageByMuscle.Legs },
  e15: { videoUrl: yt("Kas Glute Bridge tutorial"), imageUrl: imageByMuscle.Legs },
  e16: { videoUrl: yt("Nordic Hamstring Curl tutorial"), imageUrl: imageByMuscle.Legs },
  e17: { videoUrl: yt("Hanging Leg Raises tutorial"), imageUrl: imageByMuscle.Core },
  e18: { videoUrl: yt("Cable Crunches tutorial"), imageUrl: imageByMuscle.Core },
  e19: { videoUrl: yt("Z Press tutorial"), imageUrl: imageByMuscle.Shoulders },
  e20: { videoUrl: yt("Cable Lateral Raises tutorial"), imageUrl: imageByMuscle.Shoulders },
  e21: { videoUrl: yt("Lu Raises tutorial"), imageUrl: imageByMuscle.Shoulders },
  e22: { videoUrl: yt("Rear Delt Row tutorial"), imageUrl: imageByMuscle.Shoulders },
  e23: { videoUrl: yt("Heavy Dumbbell Shrugs tutorial"), imageUrl: imageByMuscle.Back },
  e24: { videoUrl: yt("Neck Extensions tutorial"), imageUrl: imageByMuscle.Back },
  e25: { videoUrl: yt("Landmine Thrusters tutorial"), imageUrl: imageByMuscle.FullBody },
  e26: { videoUrl: yt("Farmer Walk tutorial"), imageUrl: imageByMuscle.FullBody },
  e27: { videoUrl: yt("Renegade Row tutorial"), imageUrl: imageByMuscle.FullBody },
  e28: { videoUrl: yt("Heavy Barbell Curl tutorial"), imageUrl: imageByMuscle.Arms },
  e29: { videoUrl: yt("Reverse EZ Bar Curl tutorial"), imageUrl: imageByMuscle.Arms },
  e30: { videoUrl: yt("Medicine Ball Slams tutorial"), imageUrl: imageByMuscle.FullBody },
};

const initialDays: DayPlan[] = [
  { key: "day1", title: "יום 1 - גב", subtitle: "גב ובייספס", focusHe: "מיקוד: עובי גב, לטים ושיא בייספס", accent: "teal", exercises: [
    { id: "e1", name: "Meadows Row", sets: 4, reps: "10-12", he: "עמידה צידית, משיכה לאגן.", work: 45, rest: 75, category: "pull", muscleGroup: "Back" },
    { id: "e2", name: "Single-Arm Lat Pulldown", sets: 4, reps: "12", he: "מתיחה מלאה, מרפק לאגן.", work: 40, rest: 70, category: "pull", muscleGroup: "Back" },
    { id: "e3", name: "T-Bar Row", sets: 3, reps: "10", he: "חזה נתמך, כיווץ שכמות.", work: 40, rest: 75, category: "pull", muscleGroup: "Back" },
    { id: "e4", name: "Weighted Pull-Ups", sets: 4, reps: "6-8", he: "ירידה מלאה, עלייה חזקה.", work: 35, rest: 90, category: "pull", muscleGroup: "Back" },
    { id: "e5", name: "Bayesian Cable Curls", sets: 3, reps: "12-15", he: "גב לכבל, מתיחה עמוקה.", work: 35, rest: 60, category: "pull", muscleGroup: "Arms" },
    { id: "e6", name: "Zottman Curls", sets: 3, reps: "12", he: "עלייה רגילה, ירידה הפוכה.", work: 35, rest: 60, category: "pull", muscleGroup: "Arms" }
  ], bonus: [{ id: "b1", name: "Straight-Arm Pulldown", he: "חיבור ללטים.", category: "bonus", muscleGroup: "Back" }, { id: "b2", name: "Preacher Curl", he: "בידוד בייספס.", category: "bonus", muscleGroup: "Arms" }] },
  { key: "day2", title: "יום 2 - חזה", subtitle: "חזה וטריספס", focusHe: "מיקוד: חזה עליון וכוח לחיצה", accent: "blue", exercises: [
    { id: "e7", name: "Low-Incline DB Press", sets: 4, reps: "8-10", he: "שיפוע 15-30, ירידה עמוקה.", work: 40, rest: 90, category: "push", muscleGroup: "Chest" },
    { id: "e8", name: "Chest Press Machine", sets: 3, reps: "10-12", he: "טווח מלא, קירוב ידיים.", work: 40, rest: 75, category: "push", muscleGroup: "Chest" },
    { id: "e9", name: "Cable Crossover", sets: 3, reps: "12-15", he: "מתיחה וכיווץ חזק.", work: 35, rest: 65, category: "push", muscleGroup: "Chest" },
    { id: "e10", name: "JM Press", sets: 3, reps: "8-10", he: "לחיצה צרה ופשיטת מרפקים.", work: 40, rest: 80, category: "push", muscleGroup: "Arms" },
    { id: "e11", name: "Katana Extension", sets: 3, reps: "12-15", he: "לראש הארוך של הטריספס.", work: 35, rest: 60, category: "push", muscleGroup: "Arms" },
    { id: "e12", name: "Weighted Dips", sets: 3, reps: "8-10", he: "הטיה קדימה לגיוס חזה.", work: 40, rest: 90, category: "push", muscleGroup: "Chest" }
  ], bonus: [{ id: "b3", name: "Pec Deck Fly", he: "כיווץ מבודד.", category: "bonus", muscleGroup: "Chest" }] },
  { key: "day3", title: "יום 3 - רגליים", subtitle: "רגליים ובטן", focusHe: "מיקוד: קוואדס וליבה חזקה", accent: "emerald", exercises: [
    { id: "e13", name: "Zercher Squat", sets: 4, reps: "8-10", he: "טורסו זקוף, עומס קוואדס.", work: 45, rest: 120, category: "legs", muscleGroup: "Legs" },
    { id: "e14", name: "Bulgarian Split Squat", sets: 3, reps: "8-10", he: "ירידה עמוקה, רגל אחת.", work: 45, rest: 90, category: "legs", muscleGroup: "Legs" },
    { id: "e15", name: "Kas Glute Bridge", sets: 3, reps: "10-12", he: "דגש נקי על ישבן.", work: 45, rest: 90, category: "legs", muscleGroup: "Legs" },
    { id: "e16", name: "Nordic Hamstring Curl", sets: 3, reps: "5-8", he: "בלימה אקסצנטרית איטית.", work: 30, rest: 90, category: "legs", muscleGroup: "Legs" },
    { id: "e17", name: "Hanging Leg Raises", sets: 3, reps: "12-15", he: "הבאת אגן כלפי מעלה.", work: 35, rest: 60, category: "core", muscleGroup: "Core" },
    { id: "e18", name: "Cable Crunches", sets: 3, reps: "15", he: "משקל כבד, כיווץ בטן.", work: 35, rest: 60, category: "core", muscleGroup: "Core" }
  ], bonus: [{ id: "b5", name: "Seated Calf Raise", he: "לשוקיים.", category: "bonus", muscleGroup: "Legs" }] },
  { key: "day4", title: "יום 4 - כתפיים", subtitle: "כתפיים וצוואר", focusHe: "מיקוד: כתפיים רחבות ויציבה", accent: "violet", exercises: [
    { id: "e19", name: "Z-Press", sets: 4, reps: "8-10", he: "ישיבה על הרצפה - כוח כתפיים.", work: 40, rest: 90, category: "armor", muscleGroup: "Shoulders" },
    { id: "e20", name: "Cable Lateral Raises", sets: 4, reps: "12-15", he: "מתח רציף לאורך התנועה.", work: 40, rest: 60, category: "armor", muscleGroup: "Shoulders" },
    { id: "e21", name: "Lu Raises", sets: 3, reps: "12", he: "הרמה צידית מלאה למעלה.", work: 35, rest: 65, category: "armor", muscleGroup: "Shoulders" },
    { id: "e22", name: "Rear Delt Row", sets: 3, reps: "12-15", he: "משיכה גבוהה לכתף אחורית.", work: 35, rest: 60, category: "armor", muscleGroup: "Shoulders" },
    { id: "e23", name: "Heavy Shrugs", sets: 4, reps: "10-12", he: "החזקה בשיא הכיווץ.", work: 35, rest: 70, category: "armor", muscleGroup: "Back" },
    { id: "e24", name: "Neck Extensions", sets: 3, reps: "15-20", he: "חיזוק צוואר ויציבה.", work: 35, rest: 55, category: "armor", muscleGroup: "Back" }
  ], bonus: [{ id: "b7", name: "Face Pulls", he: "בריאות כתף.", category: "bonus", muscleGroup: "Shoulders" }] },
  { key: "day5", title: "יום 5 - כוח", subtitle: "כוח מתפרץ", focusHe: "מיקוד: כוח, אחיזה וכל הגוף", accent: "orange", exercises: [
    { id: "e25", name: "Landmine Thrusters", sets: 4, reps: "8-10", he: "סקוואט ודחיפה מתפרצת.", work: 45, rest: 90, category: "power", muscleGroup: "FullBody" },
    { id: "e26", name: "Farmer's Walk", sets: 3, reps: "40m", he: "משקל כבד, צעדים קצרים.", work: 45, rest: 90, category: "power", muscleGroup: "FullBody" },
    { id: "e27", name: "Renegade Row", sets: 3, reps: "10/arm", he: "פוש-אפ וחתירה.", work: 45, rest: 75, category: "power", muscleGroup: "FullBody" },
    { id: "e28", name: "Heavy Barbell Curl", sets: 3, reps: "6-8", he: "בניית מאסה בסיסית.", work: 35, rest: 75, category: "power", muscleGroup: "Arms" },
    { id: "e29", name: "Reverse EZ Bar Curl", sets: 3, reps: "10-12", he: "חיזוק ברכיאליס ואמות.", work: 35, rest: 60, category: "power", muscleGroup: "Arms" },
    { id: "e30", name: "Medicine Ball Slams", sets: 3, reps: "10-12", he: "הטחה אגרסיבית.", work: 30, rest: 60, category: "power", muscleGroup: "FullBody" }
  ], bonus: [{ id: "b9", name: "Sled Push", he: "כוח רגליים.", category: "bonus", muscleGroup: "Legs" }] }
];

const initialDaysWithMedia = initialDays.map(day => ({
  ...day,
  exercises: day.exercises.map(ex => ({ ...ex, videoUrl: exerciseMedia[ex.id]?.videoUrl, imageUrl: exerciseMedia[ex.id]?.imageUrl ?? imageByMuscle[ex.muscleGroup] })),
  bonus: day.bonus.map(ex => ({ ...ex, videoUrl: exerciseMedia[ex.id]?.videoUrl, imageUrl: exerciseMedia[ex.id]?.imageUrl ?? imageByMuscle[ex.muscleGroup] }))
}));

const allExercisesPool = initialDaysWithMedia.flatMap(d => d.exercises);

// --- UI COMPONENTS ---
const Card = ({ className, children, onClick }: any) => (
  <div onClick={onClick} className={`bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl transition-all active:scale-[0.98] ${className || ''}`}>
    {children}
  </div>
);

const Button = React.forwardRef(({ className, variant = 'default', size = 'default', ...props }: any, ref: any) => {
  const base = "inline-flex items-center justify-center font-black transition-all active:scale-90 disabled:opacity-50 cursor-pointer";
  const variants: any = { 
    default: "bg-teal-500 text-slate-950 hover:bg-teal-400 shadow-[0_0_20px_rgba(20,184,166,0.3)]", 
    outline: "border border-white/20 bg-transparent hover:bg-white/5 text-white",
    ghost: "bg-transparent text-white/50 hover:text-white",
    danger: "bg-rose-600 text-white"
  };
  const sizes: any = { default: "h-12 px-6 rounded-xl", sm: "h-9 px-4 rounded-lg text-[10px]", lg: "h-16 px-10 rounded-2xl text-lg", icon: "h-11 w-11 rounded-xl" };
  return <button ref={ref} className={`${base} ${variants[variant]} ${sizes[size]} ${className || ''}`} {...props} />;
});

const Badge = ({ children, variant = "default" }: any) => {
  const styles: any = { default: "bg-white/10 text-white/70", teal: "bg-teal-500/20 text-teal-400 border border-teal-500/20" };
  return <div className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase border border-white/5 ${styles[variant]}`}>{children}</div>;
};

// --- MAIN APP COMPONENT ---
function ReacherApp() {
  const [screen, setScreen] = useState<"splash" | "home" | "day" | "live" | "analytics" | "settings">("splash");
  const [viewMode, setViewMode] = useState<"days" | "muscles">("days");
  const [geminiApiKey, setGeminiApiKey] = useState(() => localStorage.getItem("reacher_api_key") || "");
  const [exerciseHistory, setExerciseHistory] = useState(() => JSON.parse(localStorage.getItem("reacher_history") || "{}"));
  const [selectedDayKey, setSelectedDayKey] = useState("day1");
  const [selectedMuscle, setSelectedMuscle] = useState<MuscleGroup | null>(null);
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [setIndex, setSetIndex] = useState(0);
  const [phase, setPhase] = useState<"work" | "rest" | "done">("work");
  const [timeLeft, setTimeLeft] = useState(0);
  const [running, setRunning] = useState(false);

  const audioCtx = useRef<AudioContext | null>(null);

  // Persistence
  useEffect(() => localStorage.setItem("reacher_history", JSON.stringify(exerciseHistory)), [exerciseHistory]);
  useEffect(() => localStorage.setItem("reacher_api_key", geminiApiKey), [geminiApiKey]);

  // Engines
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

  const currentWorkout = useMemo(() => initialDaysWithMedia.find(d => d.key === selectedDayKey) || initialDaysWithMedia[0], [selectedDayKey]);
  const activeEx = currentWorkout.exercises[exerciseIndex];

  // Timer Control
  useEffect(() => {
    let t: any;
    if (running && timeLeft > 0) {
      t = setInterval(() => setTimeLeft(p => p - 1), 1000);
    } else if (running && timeLeft === 0) {
      playBeep(phase === 'work' ? 440 : 880);
      if (phase === "work") {
        setPhase("rest"); setTimeLeft(activeEx.rest);
        speak("סט הושלם. מנוחה.");
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
      
      {/* Background Subtle Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] bg-teal-500/5 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[70%] h-[70%] bg-indigo-500/5 blur-[150px] rounded-full" />
      </div>

      <AnimatePresence mode="wait">
        
        {/* --- 1. SPLASH SCREEN --- */}
        {screen === "splash" && (
          <motion.div key="splash" exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex flex-col items-center justify-center p-10 text-center">
            <div className="absolute inset-0">
              <img src="https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=1200&auto=format&fit=crop" className="w-full h-full object-cover opacity-20 grayscale" alt="Reacher" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
            </div>
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="z-10 space-y-10 max-w-lg">
              <div className="flex justify-center gap-2 font-mono text-teal-400 text-xs uppercase tracking-widest"><Cpu size={14}/> VLSI PRECISION ENGINE v14</div>
              <h1 className="text-7xl md:text-9xl font-black tracking-tighter uppercase italic leading-[0.85]">REACHER<br/><span className="text-teal-400">PROJECT</span></h1>
              <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">Built Different. Train Ruthless. No Machines.</p>
              <Button size="lg" onClick={initEngines} className="px-20 py-8 text-2xl shadow-2xl group relative overflow-hidden">
                <span className="relative z-10">IGNITION</span>
                <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              </Button>
            </motion.div>
          </motion.div>
        )}

        {/* --- 2. HOME SCREEN --- */}
        {screen === "home" && (
          <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-6xl mx-auto p-5 pt-12 space-y-12 pb-40">
            <header className="flex justify-between items-end px-2">
              <div>
                <h2 className="text-4xl font-black italic tracking-tight uppercase">LIFT HEAVY.</h2>
                <div className="flex items-center gap-2 mt-1 font-bold text-teal-500 uppercase tracking-widest text-[10px]">
                  <Zap size={12} /> System Status: Online
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setScreen("settings")}><Settings2 size={24} /></Button>
            </header>

            {/* Toggle View Mode */}
            <div className="flex bg-slate-900/50 p-1.5 rounded-2xl w-fit border border-white/5 mx-auto backdrop-blur-xl shadow-xl">
              <button onClick={() => setViewMode("days")} className={`px-8 py-2 rounded-xl text-[10px] font-black transition ${viewMode === 'days' ? 'bg-white text-slate-950 shadow-xl' : 'text-slate-500'}`}>ימים</button>
              <button onClick={() => setViewMode("muscles")} className={`px-8 py-2 rounded-xl text-[10px] font-black transition ${viewMode === 'muscles' ? 'bg-white text-slate-950 shadow-xl' : 'text-slate-500'}`}>שרירים</button>
            </div>

            {/* Grid Display */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {viewMode === "days" ? initialDaysWithMedia.map(day => (
                <Card key={day.key} className="group cursor-pointer hover:border-teal-500/40 transition-all" onClick={() => { setSelectedDayKey(day.key); setScreen("day"); }}>
                  <div className="relative h-48">
                     <img src={day.exercises[0].imageUrl} className="w-full h-full object-cover opacity-30 group-hover:scale-105 transition-all duration-700" />
                     <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                     <div className="absolute bottom-6 right-6 left-6 flex justify-between items-end">
                        <div>
                           <Badge variant="teal">{day.exercises.length} Exercises</Badge>
                           <h3 className="text-3xl font-black italic uppercase leading-none mt-2">{day.title}</h3>
                           <p className="text-slate-500 text-[10px] font-bold mt-1 uppercase tracking-widest">{day.subtitle}</p>
                        </div>
                        <div className="text-teal-500 group-hover:translate-x-[-4px] transition-transform"><SkipBack size={24}/></div>
                     </div>
                  </div>
                  <div className="p-6 bg-slate-900/30">
                     <p className="text-xs text-slate-400 font-bold mb-4">{day.focusHe}</p>
                     <Button className="w-full py-5 text-sm uppercase">Start Protocol</Button>
                  </div>
                </Card>
              )) : Object.keys(imageByMuscle).map(m => (
                <Card key={m} className="h-32 relative cursor-pointer group" onClick={() => { setSelectedMuscle(m as MuscleGroup); setScreen("day"); }}>
                   <img src={imageByMuscle[m as MuscleGroup]} className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:scale-105 transition duration-1000" />
                   <div className="absolute inset-0 bg-gradient-to-l from-slate-950 via-slate-950/20 to-transparent" />
                   <div className="relative h-full flex items-center justify-between px-10">
                      <h4 className="text-2xl font-black italic uppercase tracking-tighter leading-none">{muscleHebrew[m] || m}</h4>
                      <div className="text-slate-700 group-hover:text-teal-500 transition-colors"><SkipBack size={20} /></div>
                   </div>
                </Card>
              ))}
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "SESSIONS", val: "12", icon: Activity, col: "text-teal-500" },
                { label: "VOLUME", val: "45K+", icon: Weight, col: "text-rose-500" },
                { label: "AI DATA", val: "84", icon: Sparkles, col: "text-indigo-500" },
                { label: "STREAK", val: "5D", icon: Trophy, col: "text-amber-500" }
              ].map((s, i) => (
                <Card key={i} className="p-6 text-center space-y-1 border-white/5 bg-slate-900/20">
                  <div className={`${s.col} flex justify-center mb-1`}><s.icon size={18} /></div>
                  <div className="text-2xl font-black italic">{s.val}</div>
                  <div className="text-[8px] font-black text-slate-600 uppercase tracking-widest">{s.label}</div>
                </Card>
              ))}
            </div>
          </motion.div>
        )}

        {/* --- 3. DAY VIEW --- */}
        {screen === "day" && (
          <motion.div key="day" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-5xl mx-auto p-5 pt-16 space-y-10 pb-40">
            <header className="flex justify-between items-center px-2">
              <Button variant="ghost" size="icon" onClick={() => { setSelectedMuscle(null); setScreen("home"); }}><X /></Button>
              <h2 className="text-3xl font-black italic uppercase tracking-tighter">{selectedMuscle ? muscleHebrew[selectedMuscle] : currentWorkout.title}</h2>
              <Button size="sm" variant="outline" onClick={() => { setExerciseIndex(0); setSetIndex(0); setTimeLeft(activeEx.work); setRunning(true); setScreen("live"); }}>Start Session</Button>
            </header>

            <div className="space-y-4">
              {(selectedMuscle ? allExercisesPool.filter(e => e.muscleGroup === selectedMuscle) : currentWorkout.exercises).map((ex, i) => (
                <Card key={ex.id} className="p-6 flex flex-col md:flex-row items-center gap-8 border-white/5 hover:border-teal-500/20 transition-all">
                  <div className="h-28 w-full md:w-40 rounded-2xl overflow-hidden border border-white/5 bg-slate-950">
                     <img src={ex.imageUrl} className="w-full h-full object-cover opacity-40" />
                  </div>
                  <div className="flex-1 text-center md:text-right space-y-2">
                     <div className="flex justify-center md:justify-start gap-2 mb-1">
                        <Badge>{categoryHebrew[ex.category]}</Badge>
                        <Badge variant="teal">{muscleHebrew[ex.muscleGroup]}</Badge>
                     </div>
                     <h4 className="text-xl font-black italic uppercase leading-none tracking-tight">{ex.name}</h4>
                     <p className="text-slate-400 text-xs font-bold leading-relaxed">"{ex.he}"</p>
                     <div className="flex justify-center md:justify-start gap-4 mt-4">
                        <div className="text-[10px] font-black uppercase text-slate-500">Sets: <span className="text-white">{ex.sets}</span></div>
                        <div className="text-[10px] font-black uppercase text-slate-500">Reps: <span className="text-white">{ex.reps}</span></div>
                     </div>
                  </div>
                  <div className="flex gap-3">
                     <Button variant="outline" size="icon" onClick={() => window.open(ex.videoUrl, '_blank')}><Youtube size={20} className="text-rose-500" /></Button>
                     <Button size="sm" onClick={() => { setExerciseIndex(i); setSetIndex(0); setTimeLeft(ex.work); setRunning(true); setScreen("live"); }}>Go Live</Button>
                  </div>
                </Card>
              ))}
            </div>

            {/* Bonus Section */}
            {!selectedMuscle && currentWorkout.bonus.length > 0 && (
              <div className="pt-10 space-y-6">
                 <h3 className="text-xl font-black italic uppercase tracking-widest text-teal-400 px-2">Bonus Protocols</h3>
                 <div className="grid gap-4 md:grid-cols-2">
                    {currentWorkout.bonus.map(b => (
                       <Card key={b.id} className="p-6 flex items-center justify-between border-white/5 bg-white/[0.02]">
                          <div>
                             <h5 className="font-black italic uppercase">{b.name}</h5>
                             <p className="text-xs text-slate-500 font-bold mt-1">"{b.he}"</p>
                          </div>
                          <Button variant="ghost" size="icon" onClick={() => window.open(yt(b.name), '_blank')}><Youtube size={16} /></Button>
                       </Card>
                    ))}
                 </div>
              </div>
            )}
          </motion.div>
        )}

        {/* --- 4. LIVE SESSION --- */}
        {screen === "live" && (
          <motion.div key="live" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-slate-950 z-50 p-6 overflow-y-auto flex flex-col">
            <header className="flex justify-between items-center mb-10">
               <Button variant="ghost" size="icon" onClick={() => { setRunning(false); setScreen("day"); }}><X /></Button>
               <div className="text-center">
                  <p className="text-[9px] font-black text-slate-700 uppercase tracking-[0.4em] mb-1">REACHER PROTOCOL ACTIVE</p>
                  <p className="font-black italic text-sm text-teal-400">{currentWorkout.title}</p>
               </div>
               <div className="w-10" />
            </header>

            <div className="flex-1 flex flex-col items-center justify-center space-y-12 pb-20">
               <div className="text-center space-y-4 px-6 max-w-2xl">
                  <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase leading-tight">{activeEx.name}</h1>
                  <p className="text-slate-400 font-bold italic text-lg leading-relaxed">"{activeEx.he}"</p>
               </div>

               <div className="relative flex items-center justify-center">
                  {/* Outer Pulsing Ring */}
                  <motion.div 
                    animate={running ? { scale: [1, 1.05, 1], opacity: [0.3, 0.6, 0.3] } : {}}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className={`absolute h-80 w-80 rounded-full border-2 border-teal-500/20`}
                  />
                  <div className={`h-72 w-72 rounded-full border-2 flex flex-col items-center justify-center transition-all duration-1000 ${phase === 'rest' ? 'border-amber-500/20 bg-amber-500/5' : 'border-teal-500/30 bg-teal-500/5 shadow-[0_0_60px_rgba(20,184,166,0.1)]'}`}>
                     <span className="text-[10rem] font-black italic tabular-nums leading-none tracking-tighter">{timeLeft}</span>
                     <span className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-600 mt-6">{phase === 'work' ? "WORK PHASE" : "REST PHASE"}</span>
                  </div>
               </div>

               <div className="flex gap-16">
                  <div className="text-center">
                     <p className="text-slate-700 text-[10px] font-black uppercase tracking-widest mb-1">Set Progress</p>
                     <p className="text-6xl font-black italic tracking-tighter">{setIndex + 1} <span className="text-2xl text-slate-800">/ {activeEx.sets}</span></p>
                  </div>
                  <div className="text-center">
                     <p className="text-slate-700 text-[10px] font-black uppercase tracking-widest mb-1">Target Reps</p>
                     <p className="text-6xl font-black italic tracking-tighter">{activeEx.reps}</p>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-6 pb-12 max-w-4xl mx-auto w-full">
               <Button className="py-10 text-3xl shadow-2xl uppercase italic" onClick={() => { playBeep(); setTimeLeft(0); }}>Set Complete</Button>
               <Button variant="outline" className="py-10 text-3xl" onClick={() => { initEngines(); setRunning(!running); }}>{running ? <Pause size={32} /> : <Play size={32} />}</Button>
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
              <Card className="p-10 space-y-12 border-white/5">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Gemini AI Core Key</label>
                  <input type="password" value={geminiApiKey} onChange={(e) => setGeminiApiKey(e.target.value)} className="w-full p-6 bg-black/50 border border-white/10 rounded-2xl text-xl font-bold focus:border-teal-500 transition-all text-center outline-none" placeholder="PASTE API KEY HERE" />
                </div>
                <div className="flex justify-between items-center">
                   <div>
                      <span className="font-black text-lg italic uppercase text-slate-100">Audio Protocol</span>
                      <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">Beeps and AI Coaching</p>
                   </div>
                   <button className="w-14 h-7 bg-teal-500 rounded-full relative"><div className="absolute right-1 top-1 w-5 h-5 bg-white rounded-full shadow-lg" /></button>
                </div>
                <Button variant="danger" onClick={() => { localStorage.clear(); window.location.reload(); }} className="w-full py-6 text-sm italic font-black uppercase">Wipe System Memory</Button>
              </Card>
           </motion.div>
        )}

      </AnimatePresence>

      {/* Persistent Bottom Navigation */}
      {screen !== 'splash' && screen !== 'live' && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] w-full max-w-lg px-8">
           <div className="bg-slate-900/80 backdrop-blur-3xl border border-white/10 p-5 rounded-[2.5rem] flex justify-around items-center shadow-[0_30px_70px_rgba(0,0,0,0.8)]">
              <button onClick={() => setScreen("home")} className={`p-4 rounded-full transition-all ${screen === 'home' ? 'bg-teal-500 text-slate-950 shadow-lg shadow-teal-500/40' : 'text-slate-600 hover:text-white'}`}><Home size={28} /></button>
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
