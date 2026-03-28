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
type Exercise = { 
  id: string; 
  name: string; 
  sets: number; 
  reps: string; 
  he: string; 
  work: number; 
  rest: number; 
  category: string; 
  muscleGroup: MuscleGroup; 
  videoUrl?: string; 
  imageUrl?: string; 
  originalIdForSwap?: string; 
};
type DayPlan = { key: string; title: string; subtitle: string; focusHe: string; accent: string; exercises: Exercise[]; bonus: Exercise[]; };
type SetRecord = { weight: number; reps: number; rpe: number; isWarmup: boolean; date: number; };

// --- ASSETS & HELPERS ---
const HERO_IMG = "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1400&auto=format&fit=crop";

const yt = (q: string) => `https://www.youtube.com/watch?v=p1qV6WfI7eQ6{encodeURIComponent(q)}`;

function openSpotifyApp() {
  if (typeof window === "undefined") return;
  const now = Date.now(); window.location.href = "spotify://";
  setTimeout(() => { if (Date.now() - now < 1800) window.open("http://googleusercontent.com/spotify.com/17", "_blank"); }, 900);
}

function openYouTubeApp(url?: string) {
  if (typeof window === "undefined") return;
  const now = Date.now(); window.location.href = "youtube://";
  setTimeout(() => { if (Date.now() - now < 1800) window.open(url || "https://www.youtube.com/watch?v=p1qV6WfI7eQ8", "_blank"); }, 900);
}

const muscleHebrew: Record<string, string> = {
  Back: "גב", Chest: "חזה", Legs: "רגליים", Shoulders: "כתפיים", Arms: "ידיים", Core: "ליבה", FullBody: "כל הגוף"
};

// --- EXPANDED DATASET (v18) ---
const initialDays: DayPlan[] = [
  { key: "day1", title: "פרוטוקול גב", subtitle: "Width & Density", focusHe: "מיקוד: עובי גב, לטים וכוח משיכה", accent: "teal", exercises: [
    { id: "e1", name: "Meadows Row", sets: 4, reps: "10-12", he: "עמידה צידית לספסל, משיכה חזקה של המשקולת לכיוון המותן תוך שמירה על גב מקביל לרצפה. דגש על מתיחה מלאה של הלטים בתחתית וכיווץ שיא למעלה.", work: 45, rest: 75, category: "pull", muscleGroup: "Back", imageUrl: "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?q=80&w=800" },
    { id: "e2", name: "Single-Arm Lat Pulldown", sets: 4, reps: "12", he: "ביצוע בישיבה צידית למכשיר. משיכה של הידית עד שהמרפק נוגע בצלעות. תנועה זו מאפשרת טווח תנועה מוגדל וגיוס ממוקד של סיבי הלטים התחתונים.", work: 40, rest: 70, category: "pull", muscleGroup: "Back", imageUrl: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=800" },
    { id: "e3", name: "Chest-Supported T-Bar Row", sets: 3, reps: "10", he: "שכיבה על הספסל הייעודי למניעת תנופת גוף. משיכה של המוט תוך הצמדת השכמות אחת לשנייה. תרגיל זה בונה עובי משמעותי במרכז הגב.", work: 40, rest: 80, category: "pull", muscleGroup: "Back", imageUrl: "https://images.unsplash.com/photo-1598971451991-628d0979e8b7?q=80&w=800" },
    { id: "e4", name: "Weighted Pull-Ups", sets: 4, reps: "6-8", he: "עלייה עד שהסנטר עובר את המתח וירידה איטית עד למתיחה מלאה. הוספת משקל בחגורה ליצירת עומס פרוגרסיבי לבניית רוחב גב.", work: 35, rest: 120, category: "pull", muscleGroup: "Back", imageUrl: "https://images.unsplash.com/photo-1598971451811-da554737d2f3?q=80&w=800" },
    { id: "e5", name: "Pendlay Rows", sets: 4, reps: "8", he: "חתירה מתפרצת מהרצפה בכל חזרה. גב ישר לגמרי ומשיכה לכיוון הבטן העליונה. כוח מוחלט מהחלק התחתון של הגב.", work: 45, rest: 90, category: "pull", muscleGroup: "Back", imageUrl: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=800" },
    { id: "e6", name: "Seal Rows", sets: 3, reps: "10", he: "חתירה בשכיבה מלאה על ספסל מוגבה. מבודד את הגב העליון ומנטרל לחלוטין כל עזרה מהרגליים או מהגב התחתון.", work: 40, rest: 80, category: "pull", muscleGroup: "Back", imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800" }
  ], bonus: [] },
  { key: "day2", title: "פרוטוקול חזה", subtitle: "Power & Compression", focusHe: "מיקוד: חזה עליון, לחיצות וטריספס", accent: "blue", exercises: [
    { id: "e10", name: "Low-Incline DB Press", sets: 4, reps: "8-10", he: "שיפוע של 15-30 מעלות. ירידה עמוקה עד למתיחה של סיבי החזה העליון ודחיפה חזקה למרכז. שמירה על מרפקים מעט פנימה להגנה על הכתפיים.", work: 45, rest: 90, category: "push", muscleGroup: "Chest", imageUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=800" },
    { id: "e11", name: "Converging Chest Press", sets: 3, reps: "10-12", he: "שימוש במכונה המקרבת את הידיים זו לזו בסוף התנועה. דגש על כיווץ שיא (Squeeze) של החזה במרכז למשך שנייה בכל חזרה.", work: 40, rest: 75, category: "push", muscleGroup: "Chest", imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800" },
    { id: "e12", name: "Dumbbell Floor Press", sets: 4, reps: "8", he: "לחיצה בשכיבה על הרצפה. התנועה נעצרת כשהמרפקים נוגעים בקרקע, מה שמבטל את המתיחה ומחייב גיוס כוח מתפרץ מהחלק האמצעי של התנועה.", work: 45, rest: 90, category: "push", muscleGroup: "Chest", imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800" },
    { id: "e13", name: "Weighted Push-ups", sets: 3, reps: "15", he: "שכיבות סמיכה עם פלטה על הגב או אפוד משקולות. שימוש בידיות הגבהה מאפשר ירידה עמוקה יותר ממה שמתאפשר על הרצפה.", work: 40, rest: 60, category: "push", muscleGroup: "Chest", imageUrl: "https://images.unsplash.com/photo-1598971451991-628d0979e8b7?q=80&w=800" }
  ], bonus: [] },
  { key: "day3", title: "פרוטוקול ליבה", subtitle: "Iron Core", focusHe: "מיקוד: יציבות אבסולוטית וליבה חזקה", accent: "indigo", exercises: [
    { id: "e20", name: "Dragon Flags", sets: 3, reps: "6-8", he: "אחיזה איתנה בספסל מאחורי הראש, הרמת כל הגוף כיחידה אחת ישרה עד למצב אנכי והורדה איטית מאוד עד כמעט נגיעה בספסל.", work: 45, rest: 90, category: "core", muscleGroup: "Core", imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=800" },
    { id: "e21", name: "Hanging Leg Raises", sets: 4, reps: "12", he: "תלייה על מתח, הבאת הרגליים עד לגובה העיניים בשליטה. דגש על סיבוב האגן כלפי מעלה ולא רק הנפת הרגליים.", work: 40, rest: 60, category: "core", muscleGroup: "Core", imageUrl: "https://images.unsplash.com/photo-1590239068512-63200d3d2db3?q=80&w=800" },
    { id: "e22", name: "Ab Wheel Rollouts", sets: 3, reps: "12", he: "גלישה קדימה עם הגלגל עד למתיחה מלאה של הגוף. שמירה על גב עגול מעט ומניעת קריסה של הגב התחתון פנימה.", work: 40, rest: 75, category: "core", muscleGroup: "Core", imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=800" }
  ], bonus: [] }
];

// --- APP CORE COMPONENT ---
function ReacherApp() {
  const [screen, setScreen] = useState<"splash" | "home" | "day" | "live" | "analytics" | "settings">("splash");
  const [viewMode, setViewMode] = useState<"days" | "muscles">("days");
  const [exerciseHistory, setExerciseHistory] = useState(() => JSON.parse(localStorage.getItem("reacher_history") || "{}"));
  const [swaps, setSwaps] = useState(() => JSON.parse(localStorage.getItem("reacher_swaps") || "{}"));
  const [apiKey, setApiKey] = useState(() => localStorage.getItem("reacher_api_key") || "");
  const [selectedDayKey, setSelectedDayKey] = useState("day1");
  const [selectedMuscle, setSelectedMuscle] = useState<MuscleGroup | null>(null);
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [setIndex, setSetIndex] = useState(0);
  const [phase, setPhase] = useState<"work" | "rest" | "done">("work");
  const [timeLeft, setTimeLeft] = useState(0);
  const [running, setRunning] = useState(false);
  const [aiModalEx, setAiModalEx] = useState<Exercise | null>(null);
  const [swapOrigin, setSwapOrigin] = useState<Exercise | null>(null);

  const audioCtx = useRef<AudioContext | null>(null);

  useEffect(() => localStorage.setItem("reacher_history", JSON.stringify(exerciseHistory)), [exerciseHistory]);
  useEffect(() => localStorage.setItem("reacher_swaps", JSON.stringify(swaps)), [swaps]);
  useEffect(() => localStorage.setItem("reacher_api_key", apiKey), [apiKey]);

  const initEngines = useCallback(() => {
    if (!audioCtx.current) audioCtx.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    if (audioCtx.current.state === 'suspended') audioCtx.current.resume();
    if ('speechSynthesis' in window) {
      const u = new SpeechSynthesisUtterance(""); window.speechSynthesis.speak(u);
    }
    setScreen("home");
  }, []);

  const playBeep = (f = 880) => {
    if (!audioCtx.current) return;
    const o = audioCtx.current.createOscillator(); const g = audioCtx.current.createGain();
    o.connect(g); g.connect(audioCtx.current.destination);
    o.frequency.value = f; g.gain.setValueAtTime(0.05, audioCtx.current.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, audioCtx.current.currentTime + 0.3);
    o.start(); o.stop(audioCtx.current.currentTime + 0.3);
  };

  const speak = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text); u.lang = 'he-IL'; u.rate = 1.0;
    window.speechSynthesis.speak(u);
  };

  const currentDay = useMemo(() => {
    const base = initialDays.find(d => d.key === selectedDayKey) || initialDays[0];
    return {
      ...base,
      exercises: base.exercises.map(ex => {
        const swappedId = swaps[ex.id];
        if (swappedId) {
          const alt = initialDays.flatMap(d => d.exercises).find(p => p.id === swappedId);
          if (alt) return { ...alt, originalIdForSwap: ex.id };
        }
        return ex;
      })
    };
  }, [selectedDayKey, swaps]);

  const activeEx = currentDay.exercises[exerciseIndex] || currentDay.exercises[0];

  // Timer Control
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

  // Safe Navigation Fix for White Screen
  const handleStartSession = (dayKey: string, startIndex = 0) => {
    setSelectedDayKey(dayKey);
    setExerciseIndex(startIndex);
    setSetIndex(0);
    const day = initialDays.find(d => d.key === dayKey) || initialDays[0];
    const targetEx = day.exercises[startIndex] || day.exercises[0];
    setPhase("work");
    setTimeLeft(targetEx.work);
    setRunning(false);
    setScreen("live");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-teal-500/20 overflow-x-hidden" dir="rtl">
      
      {/* Modals for AI and Swap */}
      <AnimatePresence>
        {aiModalEx && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4">
             <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-slate-900 border border-white/10 w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl">
                <div className="flex justify-between items-center mb-6"><div className="flex items-center gap-3 text-teal-400"><Bot size={28}/> <h3 className="text-xl font-black italic">AI COACH</h3></div><button onClick={() => setAiModalEx(null)} className="text-slate-500 hover:text-white"><X/></button></div>
                <div className="bg-white/5 p-6 rounded-2xl border border-white/5 space-y-4">
                   <p className="text-teal-400 font-bold">ניתוח טכני ל{aiModalEx.name}:</p>
                   <p className="text-base leading-relaxed font-medium italic">מערכת ה-AI ממליצה לשמור על קצב קבוע של 2 שניות בירידה ו-1 בעלייה. ודא שהמתח בשריר המטרה נשמר לאורך כל טווח התנועה.</p>
                </div>
                <button className="w-full mt-6 bg-teal-500 text-slate-950 py-4 rounded-2xl font-black italic uppercase" onClick={() => window.open(`https://gemini.google.com/app`, "_blank")}>שאל שאלות נוספות</button>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[80%] h-[80%] bg-teal-500/5 blur-[180px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[80%] h-[80%] bg-indigo-500/5 blur-[180px] rounded-full" />
      </div>

      <AnimatePresence mode="wait">
        
        {/* --- 1. SPLASH --- */}
        {screen === "splash" && (
          <motion.div key="splash" exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-10 text-center">
            <div className="absolute inset-0 bg-slate-950">
              <img src={HERO_IMG} className="w-full h-full object-cover opacity-20 grayscale" alt="Apex Training" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />
            </div>
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="z-10 space-y-12 max-w-lg">
              <Badge variant="teal">Elite Training System v18</Badge>
              <h1 className="text-7xl md:text-9xl font-black tracking-tighter uppercase italic leading-[0.85]">APEX<br/><span className="text-teal-400">ENGINE</span></h1>
              <p className="text-slate-400 text-sm font-bold uppercase tracking-widest leading-relaxed">Built Different. Train Ruthless. <br/> Integrated Biomechanical Intelligence.</p>
              <button onClick={initEngines} className="px-20 py-8 bg-teal-500 text-slate-950 text-2xl font-black rounded-3xl shadow-[0_0_50px_rgba(20,184,166,0.4)] group relative overflow-hidden italic uppercase">
                <span className="relative z-10">Ignition</span>
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              </button>
            </motion.div>
          </motion.div>
        )}

        {/* --- 2. HOME --- */}
        {screen === "home" && (
          <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-6xl mx-auto p-5 pt-12 space-y-12 pb-40">
            <header className="flex justify-between items-end px-2">
              <div>
                <h2 className="text-4xl font-black italic tracking-tight uppercase">APEX PROTOCOL.</h2>
                <div className="flex items-center gap-2 mt-1 font-bold text-teal-500 uppercase tracking-widest text-[10px]"><Zap size={12} /> System Online</div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => openYouTubeApp()} className="p-4 bg-red-600/20 text-red-500 rounded-2xl border border-red-500/20"><Youtube size={22}/></button>
                <button onClick={openSpotifyApp} className="p-4 bg-emerald-600/20 text-emerald-500 rounded-2xl border border-emerald-500/20"><Music size={22}/></button>
                <button onClick={() => setScreen("settings")} className="p-4 bg-white/5 text-slate-500 rounded-2xl border border-white/5"><Settings2 size={22} /></button>
              </div>
            </header>

            <div className="flex bg-slate-900/50 p-1.5 rounded-2xl w-fit border border-white/5 mx-auto backdrop-blur-xl">
              <button onClick={() => setViewMode("days")} className={`px-10 py-3 rounded-xl text-[11px] font-black transition ${viewMode === 'days' ? 'bg-white text-slate-950 shadow-xl' : 'text-slate-600'}`}>PROGRAMS</button>
              <button onClick={() => setViewMode("muscles")} className={`px-10 py-3 rounded-xl text-[11px] font-black transition ${viewMode === 'muscles' ? 'bg-white text-slate-950 shadow-xl' : 'text-slate-600'}`}>MUSCLES</button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {viewMode === "days" ? initialDays.map(day => (
                <div key={day.key} onClick={() => { setSelectedDayKey(day.key); setScreen("day"); }} className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] overflow-hidden cursor-pointer hover:border-teal-500/30 transition-all active:scale-[0.98] shadow-2xl group">
                  <div className="relative h-48">
                    <img src={day.exercises[0].imageUrl} className="w-full h-full object-cover opacity-20 group-hover:scale-105 transition-all duration-1000" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                    <div className="absolute bottom-6 right-6 flex items-center justify-between w-[calc(100%-3rem)]">
                       <div>
                         <Badge variant="teal">{day.exercises.length} Exercises</Badge>
                         <h3 className="text-3xl font-black italic uppercase mt-2">{day.title}</h3>
                       </div>
                       <div className="text-teal-500 group-hover:translate-x-[-6px] transition-transform"><SkipBack size={32}/></div>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-4 leading-relaxed">{day.focusHe}</p>
                    <button className="w-full py-4 bg-teal-500 text-slate-950 rounded-2xl font-black uppercase text-sm italic" onClick={(e) => { e.stopPropagation(); handleStartSession(day.key); }}>Start Protocol</button>
                  </div>
                </div>
              )) : Object.keys(muscleHebrew).map(m => (
                <div key={m} onClick={() => { setSelectedMuscle(m as MuscleGroup); setScreen("day"); }} className="h-32 relative bg-slate-900/40 border border-white/5 rounded-[2rem] overflow-hidden cursor-pointer hover:border-teal-500/30 group">
                   <img src={imageByMuscle[m as MuscleGroup]} className="absolute inset-0 w-full h-full object-cover opacity-15 group-hover:scale-105 transition duration-1000" />
                   <div className="absolute inset-0 bg-gradient-to-l from-slate-950 via-slate-950/30 to-transparent" />
                   <div className="relative h-full flex items-center justify-between px-10">
                      <h4 className="text-2xl font-black italic uppercase leading-none">{muscleHebrew[m] || m}</h4>
                      <div className="text-slate-700 group-hover:text-teal-500 transition-colors"><SkipBack size={24} /></div>
                   </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* --- 3. DAY VIEW --- */}
        {screen === "day" && (
          <motion.div key="day" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-5xl mx-auto p-5 pt-16 space-y-10 pb-40">
            <header className="flex justify-between items-center px-4">
              <button onClick={() => { setSelectedMuscle(null); setScreen("home"); }} className="p-4 bg-white/5 rounded-2xl"><X /></button>
              <h2 className="text-3xl font-black italic uppercase tracking-tighter">{selectedMuscle ? muscleHebrew[selectedMuscle] : currentWorkout.title}</h2>
              <button onClick={() => handleStartSession(selectedDayKey)} className="px-8 py-3 bg-teal-500 text-slate-950 rounded-2xl font-black uppercase italic text-xs">Start Full Sequence</button>
            </header>

            <div className="space-y-4">
              {(selectedMuscle ? initialDays.flatMap(d => d.exercises).filter(e => e.muscleGroup === selectedMuscle) : currentWorkout.exercises).map((ex, i) => (
                <div key={ex.id} className="bg-slate-900/40 border border-white/5 rounded-[2rem] p-6 flex flex-col md:flex-row items-center gap-10 hover:border-teal-500/20 transition-all group shadow-xl">
                  <div className="h-32 w-full md:w-44 rounded-3xl overflow-hidden border border-white/5 bg-slate-950">
                     <img src={ex.imageUrl} className="w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-700" alt={ex.name} />
                  </div>
                  <div className="flex-1 text-center md:text-right space-y-3">
                     <div className="flex justify-center md:justify-start gap-2">
                        <Badge variant="teal">{muscleHebrew[ex.muscleGroup]}</Badge>
                        <Badge>{ex.sets} × {ex.reps}</Badge>
                     </div>
                     <h4 className="text-2xl font-black italic uppercase tracking-tight">{ex.name}</h4>
                     <p className="text-slate-400 text-xs font-bold leading-relaxed">{ex.he}</p>
                     <div className="flex justify-center md:justify-start gap-3 mt-2">
                        <button onClick={() => setAiModalEx(ex)} className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/5 rounded-xl text-[10px] font-black uppercase hover:bg-white/10 transition-colors"><Bot size={14} className="text-teal-400"/> ASK AI</button>
                        <button onClick={() => {/* Swap Exercise Logic */}} className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/5 rounded-xl text-[10px] font-black uppercase hover:bg-white/10 transition-colors"><RefreshCcw size={14} className="text-indigo-400"/> SWAP</button>
                        <button onClick={() => openYouTubeApp(yt(ex.name))} className="p-2 bg-red-600/10 border border-red-600/20 rounded-xl text-red-500"><Youtube size={16}/></button>
                     </div>
                  </div>
                  <button onClick={() => handleStartSession(selectedDayKey, i)} className="w-full md:w-32 py-4 bg-white/5 border border-white/10 rounded-2xl font-black text-xs uppercase italic hover:bg-white/10">GO LIVE</button>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* --- 4. LIVE --- */}
        {screen === "live" && (
          <motion.div key="live" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-slate-950 z-[100] p-6 overflow-y-auto flex flex-col">
            <header className="flex justify-between items-center mb-10">
               <button onClick={() => { setRunning(false); setScreen("day"); }} className="p-5 bg-white/5 rounded-full"><X /></button>
               <div className="text-center">
                  <p className="text-[9px] font-black text-slate-700 uppercase tracking-[0.5em] mb-1">APEX PROTOCOL ACTIVE</p>
                  <p className="font-black italic text-sm text-teal-400 uppercase">{currentWorkout.title}</p>
               </div>
               <div className="flex gap-2">
                 <button onClick={openSpotifyApp} className="p-4 bg-emerald-600/10 text-emerald-500 rounded-2xl"><Music size={20}/></button>
                 <button onClick={() => setAiModalEx(activeEx)} className="p-4 bg-white/5 text-teal-400 rounded-2xl"><Bot size={20}/></button>
               </div>
            </header>

            <div className="flex-1 flex flex-col items-center justify-center space-y-16 pb-20">
               <div className="text-center space-y-4 px-6 max-w-2xl">
                  <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase leading-none">{activeEx?.name || "Ready"}</h1>
                  <p className="text-slate-400 font-bold italic text-2xl leading-relaxed">{activeEx?.he || "Prepare for the set"}</p>
               </div>

               <div className="relative flex items-center justify-center">
                  <motion.div animate={running ? { scale: [1, 1.05, 1], opacity: [0.1, 0.3, 0.1] } : {}} transition={{ repeat: Infinity, duration: 2 }} className={`absolute h-96 w-96 rounded-full border border-teal-500/20`} />
                  <div className={`h-80 w-80 rounded-full border-2 flex flex-col items-center justify-center transition-all duration-1000 ${phase === 'rest' ? 'border-amber-500/30 bg-amber-500/5' : 'border-teal-500/40 bg-teal-500/5 shadow-[0_0_100px_rgba(20,184,166,0.1)]'}`}>
                     <span className="text-[12rem] font-black italic tabular-nums leading-none tracking-tighter">{timeLeft}</span>
                     <span className="text-[11px] font-black uppercase tracking-[0.6em] text-slate-600 mt-8">{phase === 'work' ? "WORK" : "REST"}</span>
                  </div>
               </div>

               <div className="flex gap-20">
                  <div className="text-center">
                     <p className="text-slate-700 text-[10px] font-black uppercase tracking-widest mb-2">Protocol Status</p>
                     <p className="text-7xl font-black italic tracking-tighter">{setIndex + 1} <span className="text-2xl text-slate-800">/ {activeEx?.sets || 0}</span></p>
                  </div>
                  <div className="text-center">
                     <p className="text-slate-700 text-[10px] font-black uppercase tracking-widest mb-2">Rep Target</p>
                     <p className="text-7xl font-black italic tracking-tighter">{activeEx?.reps || "0"}</p>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-8 pb-12 max-w-4xl mx-auto w-full">
               <button onClick={() => { playBeep(); setTimeLeft(0); }} className="py-12 bg-teal-500 text-slate-950 rounded-[2.5rem] text-4xl font-black shadow-2xl uppercase italic active:scale-95 transition-transform">Set Complete</button>
               <button onClick={() => { initEngines(); setRunning(!running); }} className="py-12 border-2 border-white/10 text-white rounded-[2.5rem] text-4xl font-black active:scale-95 transition-transform flex items-center justify-center">{running ? <Pause size={40} /> : <Play size={40} />}</button>
            </div>
          </motion.div>
        )}

      </AnimatePresence>

      {/* Nav HUD */}
      {screen !== 'splash' && screen !== 'live' && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[90] w-full max-w-lg px-8">
           <div className="bg-slate-900/90 backdrop-blur-3xl border border-white/5 p-5 rounded-[2.5rem] flex justify-around items-center shadow-[0_40px_100px_rgba(0,0,0,0.9)]">
              <button onClick={() => setScreen("home")} className={`p-4 rounded-full transition-all ${screen === 'home' ? 'bg-teal-500 text-slate-950 shadow-lg' : 'text-slate-600 hover:text-white'}`}><Home size={24} /></button>
              <button onClick={() => setScreen("day")} className={`p-4 rounded-full transition-all ${screen === 'day' ? 'text-teal-400' : 'text-zinc-600 hover:text-white'}`}><ListChecks size={24} /></button>
              <button onClick={() => setScreen("analytics")} className={`p-4 rounded-full transition-all ${screen === 'analytics' ? 'text-teal-400' : 'text-zinc-600 hover:text-white'}`}><TrendingUp size={24} /></button>
              <button onClick={() => setScreen("settings")} className={`p-4 rounded-full transition-all ${screen === 'settings' ? 'bg-white text-slate-950' : 'text-zinc-600 hover:text-white'}`}><Settings2 size={24} /></button>
           </div>
        </div>
      )}
    </div>
  );
}

const Badge = ({ children, variant = "default" }: any) => {
  const styles: any = { default: "bg-white/5 text-white/50", teal: "bg-teal-500/10 text-teal-400 border border-teal-500/10" };
  return <div className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase border border-white/5 ${styles[variant]}`}>{children}</div>;
};

// --- RENDER ---
const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(<ReacherApp />);
}
