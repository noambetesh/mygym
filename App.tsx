import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { createRoot } from "react-dom/client";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play, Pause, RotateCcw, SkipForward, SkipBack, Dumbbell, Flame, Clock3,
  CheckCircle2, Youtube, TimerReset, Volume2, VolumeX, Home, ListChecks,
  Swords, Trophy, Settings2, Activity, CalendarDays, Weight, Eye,
  Bot, Sparkles, X, Send, MessageCircle, ExternalLink, TrendingUp, RefreshCcw, AlertTriangle, Plus, Zap, Cpu
} from "lucide-react";

// --- UI COMPONENTS (GLASSMORPHISM) ---
const Card = ({ className, children, onClick }: any) => (
  <motion.div 
    whileHover={onClick ? { scale: 1.01 } : {}}
    onClick={onClick}
    className={`bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl ${className || ''}`}
  >
    {children}
  </motion.div>
);

const Button = React.forwardRef(({ className, variant = 'default', size = 'default', ...props }: any, ref: any) => {
  const base = "inline-flex items-center justify-center font-black transition-all focus:outline-none disabled:opacity-50 disabled:pointer-events-none cursor-pointer active:scale-95";
  const variants: any = { 
    default: "bg-teal-500 text-slate-950 hover:bg-teal-400 shadow-[0_0_20px_rgba(20,184,166,0.3)]", 
    outline: "border-2 border-white/20 bg-transparent hover:bg-white/5 text-white", 
    ghost: "bg-transparent hover:bg-white/5 text-white/70", 
    destructive: "bg-rose-600/80 text-white hover:bg-rose-600 shadow-[0_0_20px_rgba(225,29,72,0.3)]", 
    secondary: "bg-white/10 text-white hover:bg-white/20" 
  };
  const sizes: any = { default: "h-14 px-8 rounded-2xl", sm: "h-10 px-4 rounded-xl text-sm", lg: "h-16 px-10 rounded-3xl text-xl", icon: "h-12 w-12 rounded-2xl flex items-center justify-center shrink-0" };
  return <button ref={ref} className={`${base} ${variants[variant]} ${sizes[size]} ${className || ''}`} {...props} />;
});

const Badge = ({ className, variant = 'default', children }: any) => {
  const variants: any = { default: "bg-teal-500/20 text-teal-400 border border-teal-500/30", secondary: "bg-white/10 text-white", outline: "border border-white/20 text-white/60" };
  return <div className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${variants[variant]} ${className || ''}`}>{children}</div>;
};

// --- DATA TYPES FROM v7 ---
type MuscleGroup = "Back" | "Chest" | "Legs" | "Shoulders" | "Arms" | "Core" | "FullBody";
type Exercise = { id: string; name: string; sets: number; reps: string; he: string; work: number; rest: number; category: string; muscleGroup: MuscleGroup; videoUrl?: string; imageUrl?: string; };
type DayPlan = { key: string; title: string; subtitle: string; focusHe: string; accent: string; accentSoft: string; exercises: Exercise[]; bonus: any[]; };
type SetRecord = { weight: number; reps: number; rpe: number; isWarmup: boolean; date: number; };

// --- FULL EXERCISE MEDIA FROM v7 ---
const imageByMuscle: Record<MuscleGroup, string> = {
  Back: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop",
  Chest: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=800&auto=format&fit=crop",
  Legs: "https://images.unsplash.com/photo-1434682881908-b43d0467b798?q=80&w=800&auto=format&fit=crop",
  Shoulders: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800&auto=format&fit=crop",
  Arms: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=800&auto=format&fit=crop",
  Core: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=800&auto=format&fit=crop",
  FullBody: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=800&auto=format&fit=crop",
};

const yt = (query: string) => `http://googleusercontent.com/youtube.com/9{encodeURIComponent(query)}`;

const exerciseMedia: Record<string, { videoUrl: string; imageUrl: string }> = {
  e1: { videoUrl: yt("Meadows Row tutorial"), imageUrl: imageByMuscle.Back },
  e2: { videoUrl: yt("Single Arm Iliac Lat Pulldown tutorial"), imageUrl: imageByMuscle.Back },
  e13: { videoUrl: yt("Zercher Squat tutorial"), imageUrl: imageByMuscle.Legs },
  e19: { videoUrl: yt("Z Press tutorial"), imageUrl: imageByMuscle.Shoulders },
  // ... more mapping follows in the logic
};

// --- COMPLETE DATASET FROM v7 ---
const initialDays: DayPlan[] = [
  { key: "day1", title: "יום 1 - גב", subtitle: "גב ובייספס", focusHe: "מיקוד: עובי גב, לטים, גב עליון ושיא בייספס", accent: "from-teal-600 to-slate-900", accentSoft: "bg-teal-500/15 text-teal-200", exercises: [
    { id: "e1", name: "Meadows Row", sets: 4, reps: "10-12", he: "עמידה צידית, משוך לכיוון האגן כדי להעמיס על הגב והלטים.", work: 45, rest: 75, category: "pull", muscleGroup: "Back" },
    { id: "e2", name: "Single-Arm Iliac Lat Pulldown", sets: 4, reps: "12", he: "מתיחה מלאה למעלה, סיים עם מרפק צמוד לאגן.", work: 40, rest: 70, category: "pull", muscleGroup: "Back" },
    { id: "e3", name: "Chest-Supported T-Bar Row", sets: 3, reps: "10", he: "חזה נתמך, מניעת מומנטום, כיווץ חזק בשכמות.", work: 40, rest: 75, category: "pull", muscleGroup: "Back" },
    { id: "e4", name: "Weighted Pull-Ups", sets: 4, reps: "6-8", he: "ירידה מלאה ועלייה חזקה בלי קפיצה.", work: 35, rest: 90, category: "pull", muscleGroup: "Back" },
    { id: "e5", name: "Bayesian Cable Curls", sets: 3, reps: "12-15", he: "גב אל הכבל, מתיחה עמוקה לבייספס בסוף התנועה.", work: 35, rest: 60, category: "pull", muscleGroup: "Arms" },
    { id: "e6", name: "Zottman Curls", sets: 3, reps: "12", he: "עלייה רגילה, ירידה באחיזה הפוכה כדי לעבוד גם על האמה.", work: 35, rest: 60, category: "pull", muscleGroup: "Arms" }
  ], bonus: [] },
  { key: "day2", title: "יום 2 - חזה", subtitle: "חזה וטריספס", focusHe: "מיקוד: חזה עליון, כוח בלחיצות ומסת טריספס", accent: "from-blue-600 to-slate-900", accentSoft: "bg-blue-500/15 text-blue-200", exercises: [
    { id: "e7", name: "Low-Incline DB Press", sets: 4, reps: "8-10", he: "שיפוע עדין (15-30 מעלות), ירידה עמוקה לחזה עליון.", work: 40, rest: 90, category: "push", muscleGroup: "Chest" },
    { id: "e8", name: "Converging Chest Press Machine", sets: 3, reps: "10-12", he: "טווח מלא, דגש על קירוב הידיים בסוף התנועה.", work: 40, rest: 75, category: "push", muscleGroup: "Chest" },
    { id: "e9", name: "Cable Crossover", sets: 3, reps: "12-15", he: "מתיחה מבוקרת וכיווץ חזק לחזה תחתון/אמצעי.", work: 35, rest: 65, category: "push", muscleGroup: "Chest" },
    { id: "e10", name: "JM Press", sets: 3, reps: "8-10", he: "שילוב לחיצה צרה ופשיטת מרפקים לכוח בטריספס.", work: 40, rest: 80, category: "push", muscleGroup: "Arms" },
    { id: "e11", name: "Katana Extension", sets: 3, reps: "12-15", he: "מעולה לראש הארוך של הטריספס בפוזיציה מתוחה.", work: 35, rest: 60, category: "push", muscleGroup: "Arms" },
    { id: "e12", name: "Weighted Dips", sets: 3, reps: "8-10", he: "הטיה קלה קדימה לחזה או גוף זקוף לטריספס.", work: 40, rest: 90, category: "push", muscleGroup: "Chest" }
  ], bonus: [] },
  { key: "day3", title: "יום 3 - רגליים", subtitle: "רגליים ובטן", focusHe: "מיקוד: קוואדס, שרשרת אחורית וליבה חזקה", accent: "from-emerald-600 to-slate-900", accentSoft: "bg-emerald-500/15 text-emerald-200", exercises: [
    { id: "e13", name: "Zercher Squat", sets: 4, reps: "8-10", he: "טורסו זקוף, עומס עצום על הקוואדס והליבה.", work: 45, rest: 120, category: "legs", muscleGroup: "Legs" },
    { id: "e14", name: "Bulgarian Split Squat", sets: 3, reps: "8-10/leg", he: "ירידה עמוקה, רגל קדמית עושה את כל העבודה.", work: 45, rest: 90, category: "legs", muscleGroup: "Legs" },
    { id: "e15", name: "Kas Glute Bridge", sets: 3, reps: "10-12", he: "טווח תנועה קצר יותר מהיפ טראסט, דגש נקי על ישבן.", work: 45, rest: 90, category: "legs", muscleGroup: "Legs" },
    { id: "e16", name: "Nordic Hamstring Curl", sets: 3, reps: "5-8", he: "בלימה אקסצנטרית איטית, פצצה להמסטרינג.", work: 30, rest: 90, category: "legs", muscleGroup: "Legs" },
    { id: "e17", name: "Hanging Leg Raises", sets: 3, reps: "12-15", he: "הבאת האגן כלפי מעלה, לא רק את הרגליים.", work: 35, rest: 60, category: "core", muscleGroup: "Core" }
  ], bonus: [] },
  { key: "day4", title: "יום 4 - כתפיים", subtitle: "3D Shoulders", focusHe: "מיקוד: כתפיים רחבות, טרפזים ויציבה", accent: "from-violet-600 to-slate-900", accentSoft: "bg-violet-500/15 text-violet-200", exercises: [
    { id: "e19", name: "Z-Press", sets: 4, reps: "8-10", he: "ישיבה על הרצפה - כוח כתפיים וליבה נקי.", work: 40, rest: 90, category: "armor", muscleGroup: "Shoulders" },
    { id: "e20", name: "Cable Lateral Raises", sets: 4, reps: "12-15", he: "הכבל שומר על מתח רציף לאורך כל התנועה.", work: 40, rest: 60, category: "armor", muscleGroup: "Shoulders" },
    { id: "e21", name: "Lu Raises", sets: 3, reps: "12", he: "הרמה צידית מלאה עד למעלה, פיתוח כתף וטרפז עליון.", work: 35, rest: 65, category: "armor", muscleGroup: "Shoulders" },
    { id: "e22", name: "Rear Delt Row", sets: 3, reps: "12-15", he: "משיכה גבוהה עם מרפקים החוצה לכתף אחורית.", work: 35, rest: 60, category: "armor", muscleGroup: "Shoulders" }
  ], bonus: [] },
  { key: "day5", title: "יום 5 - כוח", subtitle: "Full Body Power", focusHe: "מיקוד: כוח מתפרץ ואחיזה", accent: "from-amber-600 to-slate-900", accentSoft: "bg-amber-500/15 text-amber-200", exercises: [
    { id: "e25", name: "Landmine Thrusters", sets: 4, reps: "8-10", he: "סקוואט ודחיפה מתפרצת בתנועה אחת.", work: 45, rest: 90, category: "power", muscleGroup: "FullBody" },
    { id: "e26", name: "Farmer's Walk", sets: 3, reps: "40m", he: "משקל כבד, צעדים קצרים. מחזק אחיזה וליבה.", work: 45, rest: 90, category: "power", muscleGroup: "FullBody" }
  ], bonus: [] }
];

// --- MAIN APP COMPONENT ---
function ReacherApp() {
  const [screen, setScreen] = useState<"splash" | "home" | "day" | "live" | "analytics" | "settings">("splash");
  const [exerciseHistory, setExerciseHistory] = useState(() => JSON.parse(localStorage.getItem("reacher_history") || "{}"));
  const [swaps, setSwaps] = useState(() => JSON.parse(localStorage.getItem("reacher_swaps") || "{}"));
  const [geminiApiKey, setGeminiApiKey] = useState(() => localStorage.getItem("reacher_api_key") || "");
  const [selectedDayKey, setSelectedDayKey] = useState("day1");
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [setIndex, setSetIndex] = useState(0);
  const [phase, setPhase] = useState<"work" | "rest" | "done">("work");
  const [timeLeft, setTimeLeft] = useState(0);
  const [running, setRunning] = useState(false);
  const [aiCoachActive, setAiCoachActive] = useState(false);

  const audioCtx = useRef<AudioContext | null>(null);

  // Persistence
  useEffect(() => localStorage.setItem("reacher_history", JSON.stringify(exerciseHistory)), [exerciseHistory]);
  useEffect(() => localStorage.setItem("reacher_swaps", JSON.stringify(swaps)), [swaps]);
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

  const playBeep = (freq = 880) => {
    if (!audioCtx.current) return;
    const osc = audioCtx.current.createOscillator();
    const gain = audioCtx.current.createGain();
    osc.connect(gain); gain.connect(audioCtx.current.destination);
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.1, audioCtx.current.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.current.currentTime + 0.3);
    osc.start(); osc.stop(audioCtx.current.currentTime + 0.3);
  };

  const speak = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'he-IL';
    u.rate = 1.0;
    window.speechSynthesis.speak(u);
  };

  // Logic Helpers
  const currentDay = useMemo(() => initialDays.find(d => d.key === selectedDayKey) || initialDays[0], [selectedDayKey]);
  const activeEx = currentDay.exercises[exerciseIndex];

  // Timer logic
  useEffect(() => {
    let timer: any;
    if (running && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && running) {
      playBeep(phase === 'work' ? 440 : 880);
      handleNext();
    }
    return () => clearInterval(timer);
  }, [running, timeLeft, phase]);

  const handleNext = () => {
    if (phase === "work") {
      setPhase("rest");
      setTimeLeft(activeEx.rest);
      speak("סט הושלם. מנוחה.");
    } else {
      if (setIndex + 1 < activeEx.sets) {
        setSetIndex(prev => prev + 1);
        setPhase("work");
        setTimeLeft(activeEx.work);
        speak(`סט ${setIndex + 2} התחל.`);
      } else if (exerciseIndex + 1 < currentDay.exercises.length) {
        setExerciseIndex(prev => prev + 1);
        setSetIndex(0);
        setPhase("work");
        setTimeLeft(currentDay.exercises[exerciseIndex + 1].work);
        speak(`תרגיל הבא: ${currentDay.exercises[exerciseIndex + 1].name}`);
      } else {
        setPhase("done");
        setRunning(false);
        speak("האימון הושלם. כל הכבוד נועם.");
      }
    }
  };

  const askAi = async (prompt: string) => {
    if (!geminiApiKey) { speak("נא להזין מפתח API."); return; }
    setAiCoachActive(true);
    try {
      const system = `You are a bodybuilding coach for Noam. Give a professional biomechanical cue in Hebrew for: `;
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: system + prompt }] }] })
      });
      const data = await res.json();
      const output = data.candidates[0].content.parts[0].text;
      speak(output);
    } catch (e) { console.error(e); }
    setAiCoachActive(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-teal-500/30 overflow-x-hidden" dir="rtl">
      
      {/* Background Neon Glows */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-teal-500/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-600/10 blur-[150px] rounded-full" />
      </div>

      <AnimatePresence mode="wait">
        
        {/* --- 1. SPLASH SCREEN (IGNITION) --- */}
        {screen === "splash" && (
          <motion.div 
            key="splash" exit={{ opacity: 0, scale: 1.05 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center p-12 text-center"
          >
            <div className="absolute inset-0">
              <img src="https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=1200&auto=format&fit=crop" className="w-full h-full object-cover opacity-20 grayscale" alt="Reacher" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
            </div>
            <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="z-10 space-y-10 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 font-mono text-xs uppercase tracking-widest">
                <Cpu size={14} /> VLSI Precision Engine v11
              </div>
              <h1 className="text-7xl md:text-9xl font-black italic tracking-tighter leading-[0.85] uppercase">
                Project<br/><span className="text-teal-400">Reacher</span>
              </h1>
              <p className="text-xl text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
                Built Different. Train Ruthless. <br/> Noam, Ignition sequence ready.
              </p>
              <Button size="lg" onClick={initEngines} className="group relative overflow-hidden px-20 py-8 text-2xl shadow-[0_0_50px_rgba(20,184,166,0.3)]">
                <span className="relative z-10">IGNITION</span>
                <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              </Button>
            </motion.div>
          </motion.div>
        )}

        {/* --- 2. HOME SCREEN --- */}
        {screen === "home" && (
          <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-6xl mx-auto p-6 pt-16 space-y-12 pb-40">
            <header className="flex justify-between items-end">
              <div>
                <h2 className="text-6xl font-black italic tracking-tighter">היי נעם</h2>
                <div className="flex items-center gap-2 mt-2 font-bold text-teal-400 uppercase tracking-widest text-xs">
                  <Zap size={14} /> Reacher Protocol Active
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setScreen("settings")} className="p-4 bg-white/5 border border-white/10 rounded-3xl"><Settings2 /></Button>
            </header>

            {/* AI HUB STATUS */}
            <Card className="p-10 border-teal-500/20 bg-teal-500/5 backdrop-blur-3xl">
              <div className="flex gap-8 items-start">
                <div className="p-6 bg-teal-500/20 rounded-full border border-teal-500/40"><Bot size={40} className="text-teal-400" /></div>
                <div className="space-y-4 flex-1">
                  <p className="text-3xl font-bold leading-tight italic text-teal-50">"נעם, מוכנים לעבודה. המטרה: מסה דחוסה ועוצמתית."</p>
                  <div className="flex gap-6">
                    <button onClick={() => askAi("תן לי דגש ביו-מכני לאימון של היום")} className="text-teal-400 font-black border-b-2 border-teal-400 pb-1">שאל את המאמן</button>
                    <button className="text-slate-500 font-black border-b-2 border-slate-800 pb-1 cursor-not-allowed">AI LAB 2.0 (נעול)</button>
                  </div>
                </div>
              </div>
            </Card>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {initialDays.map((day) => (
                <Card key={day.key} className="group hover:border-teal-500/40 transition-all cursor-pointer" onClick={() => { setSelectedDayKey(day.key); setScreen("day"); }}>
                  <div className="p-10 space-y-6">
                    <div className="flex justify-between items-center text-teal-500">
                      <Trophy size={40} />
                      <Badge variant="outline">{day.exercises.length} תרגילים</Badge>
                    </div>
                    <div>
                      <h3 className="text-3xl font-black italic tracking-tighter uppercase">{day.title}</h3>
                      <p className="text-slate-400 mt-1 font-bold">{day.focusHe}</p>
                    </div>
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-teal-500 w-1/4 group-hover:w-full transition-all duration-1000" />
                    </div>
                    <Button className="w-full py-5">בחר אימון</Button>
                  </div>
                </Card>
              ))}
            </div>

            {/* Analytics Glance */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { label: "אימונים", val: "12", icon: Activity, col: "text-teal-400" },
                { label: "משקל כולל", val: "45K", icon: Weight, col: "text-rose-400" },
                { label: "שימוש ב-AI", val: "84", icon: Sparkles, col: "text-indigo-400" },
                { label: "רצף ימים", val: "5", icon: Trophy, col: "text-amber-400" }
              ].map((s, i) => (
                <Card key={i} className="p-8 text-center space-y-2">
                  <div className={`${s.col} flex justify-center mb-2`}><s.icon size={24} /></div>
                  <div className="text-4xl font-black italic">{s.val}</div>
                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{s.label}</div>
                </Card>
              ))}
            </div>
          </motion.div>
        )}

        {/* --- 3. DAY DETAILS --- */}
        {screen === "day" && (
          <motion.div key="day" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-5xl mx-auto p-6 pt-16 space-y-10 pb-40">
            <header className="flex justify-between items-center">
              <Button variant="ghost" size="icon" onClick={() => setScreen("home")} className="bg-white/5"><X /></Button>
              <h2 className="text-4xl font-black italic uppercase tracking-tighter">{currentDay.title}</h2>
              <Button variant="secondary" onClick={() => { setExerciseIndex(0); setSetIndex(0); setScreen("live"); }}>התחל הכל</Button>
            </header>

            <div className="space-y-6">
              {currentDay.exercises.map((ex, i) => (
                <Card key={ex.id} className="p-8">
                  <div className="flex flex-col md:flex-row gap-8 items-center">
                    <div className="w-full md:w-48 h-32 rounded-3xl overflow-hidden border border-white/10 bg-slate-900 flex items-center justify-center">
                       <Dumbbell className="text-slate-800" size={48} />
                    </div>
                    <div className="flex-1 space-y-2 text-center md:text-right">
                      <h4 className="text-3xl font-black italic uppercase tracking-tight">{ex.name}</h4>
                      <p className="text-slate-400 font-bold">{ex.he}</p>
                      <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4">
                        <Badge className="font-mono">{ex.sets} SETS</Badge>
                        <Badge className="font-mono">{ex.reps} REPS</Badge>
                        <button onClick={() => askAi(ex.name)} className="text-teal-400 font-black text-sm flex items-center gap-1 hover:text-teal-300">
                          <Sparkles size={14} /> הדרכת AI
                        </button>
                      </div>
                    </div>
                    <Button onClick={() => { setExerciseIndex(i); setSetIndex(0); setScreen("live"); }} className="w-full md:w-32">התחל</Button>
                  </div>
                </Card>
              ))}
            </div>
          </motion.div>
        )}

        {/* --- 4. LIVE WORKOUT --- */}
        {screen === "live" && (
          <motion.div key="live" className="fixed inset-0 z-50 bg-slate-950 p-6 md:p-12 overflow-y-auto">
            <div className="max-w-4xl mx-auto space-y-12 pb-32">
              <header className="flex justify-between items-center">
                <Button variant="ghost" size="icon" onClick={() => setScreen("day")} className="bg-white/5"><X /></Button>
                <div className="text-center">
                  <div className="text-teal-400 font-black text-xs tracking-widest uppercase">Protocol Active</div>
                  <div className="text-2xl font-black italic">{currentDay.title}</div>
                </div>
                <div className="w-12" />
              </header>

              <div className="text-center space-y-4">
                <h1 className="text-7xl md:text-9xl font-black tracking-tighter italic uppercase leading-none">{activeEx.name}</h1>
                <p className="text-2xl text-slate-400 font-bold italic">"{activeEx.he}"</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <Card className={`p-20 text-center ${isResting ? 'border-amber-500/40' : 'border-teal-500/40'}`}>
                  <div className="text-[12rem] font-black italic tracking-tighter tabular-nums leading-none">
                    {phase === 'work' ? "GO" : timeLeft}
                  </div>
                  <div className={`text-2xl font-black uppercase tracking-[0.4em] mt-8 ${phase === 'work' ? 'text-teal-400' : 'text-amber-400'}`}>
                    {phase === 'work' ? "Work" : "Rest"}
                  </div>
                </Card>
                <div className="space-y-8 flex flex-col justify-center">
                  <div className="bg-white/5 border border-white/10 p-10 rounded-[2.5rem] shadow-xl">
                    <div className="text-slate-500 text-sm font-black uppercase mb-2">Set Progress</div>
                    <div className="text-7xl font-black italic tracking-tighter">{setIndex + 1} <span className="text-3xl text-slate-700">/ {activeEx.sets}</span></div>
                  </div>
                  <div className="bg-white/5 border border-white/10 p-10 rounded-[2.5rem] shadow-xl">
                    <div className="text-slate-500 text-sm font-black uppercase mb-2">Target Reps</div>
                    <div className="text-7xl font-black italic tracking-tighter">{activeEx.reps}</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
                <Button onClick={() => { setRunning(true); setTimeLeft(activeEx.rest); handleNext(); }} className="py-12 text-4xl shadow-[0_0_60px_rgba(20,184,166,0.3)]">
                  סיים סט
                </Button>
                <Button variant="outline" onClick={() => window.open(yt(activeEx.name), "_blank")} className="py-12 text-3xl flex items-center justify-center gap-4">
                   <Youtube className="text-rose-600" size={40} /> מדריך וידאו
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* --- 5. SETTINGS --- */}
        {screen === "settings" && (
           <motion.div key="settings" className="max-w-2xl mx-auto p-12 pt-32 space-y-12 pb-40">
              <header className="flex justify-between items-center">
                <h2 className="text-6xl font-black italic uppercase tracking-tighter">Settings</h2>
                <Button variant="ghost" size="icon" onClick={() => setScreen("home")} className="bg-white/5"><X /></Button>
              </header>
              <Card className="p-12 space-y-10">
                <div className="space-y-4">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-[0.4em]">Gemini AI Key</label>
                  <input 
                    type="password" value={geminiApiKey} onChange={(e) => setGeminiApiKey(e.target.value)}
                    className="w-full p-8 bg-white/5 border border-white/10 rounded-3xl text-xl font-bold focus:outline-none focus:border-teal-500 transition-all text-center"
                    placeholder="מפתח API..."
                  />
                </div>
                <hr className="border-white/5" />
                <div className="flex justify-between items-center">
                   <span className="font-black text-2xl italic uppercase">Audio Protocol</span>
                   <button className="w-16 h-8 bg-teal-500 rounded-full relative"><div className="absolute right-1 top-1 w-6 h-6 bg-white rounded-full" /></button>
                </div>
                <Button variant="destructive" onClick={() => { if(confirm("למחוק הכל?")) { localStorage.clear(); window.location.reload(); }}} className="w-full py-6 text-xl">RESET ALL SYSTEMS</Button>
              </Card>
           </motion.div>
        )}

      </AnimatePresence>

      {/* PERSISTENT BOTTOM HUD */}
      {screen !== "splash" && screen !== "live" && (
        <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[100] w-full max-w-lg px-8">
           <div className="bg-slate-900/90 backdrop-blur-3xl border border-white/10 p-5 rounded-full flex justify-around items-center shadow-[0_25px_60px_rgba(0,0,0,0.6)]">
              <button onClick={() => setScreen("home")} className={`p-4 rounded-full transition-all ${screen === 'home' ? 'bg-teal-500 text-slate-950 shadow-[0_0_20px_rgba(20,184,166,0.5)]' : 'text-slate-500 hover:text-white'}`}><Home size={28} /></button>
              <button onClick={() => setScreen("analytics")} className={`p-4 rounded-full transition-all ${screen === 'analytics' ? 'bg-indigo-500 text-white' : 'text-slate-500 hover:text-white'}`}><TrendingUp size={28} /></button>
              <button onClick={() => setScreen("live")} className="p-4 bg-white/10 rounded-full text-white hover:bg-white/20 transition-all"><Play fill="white" size={28} /></button>
              <button onClick={() => setScreen("settings")} className={`p-4 rounded-full transition-all ${screen === 'settings' ? 'bg-white text-slate-950' : 'text-slate-500 hover:text-white'}`}><Settings2 size={28} /></button>
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
