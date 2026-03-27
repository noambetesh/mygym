import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { createRoot } from "react-dom/client";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play, Pause, RotateCcw, SkipForward, SkipBack, Dumbbell, Flame, Clock3,
  CheckCircle2, Youtube, TimerReset, Volume2, VolumeX, Home, ListChecks,
  Swords, Trophy, Settings2, Activity, CalendarDays, Weight, Eye,
  Bot, Sparkles, X, Send, MessageCircle, ExternalLink, TrendingUp, RefreshCcw, AlertTriangle, Plus, Zap, Cpu, Target
} from "lucide-react";

// --- TYPES & CONSTANTS ---
type MuscleGroup = "Back" | "Chest" | "Legs" | "Shoulders" | "Arms" | "Core" | "FullBody";
type Exercise = { id: string; name: string; sets: number; reps: string; he: string; work: number; rest: number; category: string; muscleGroup: MuscleGroup; videoUrl?: string; imageUrl?: string; };
type DayPlan = { key: string; title: string; subtitle: string; focusHe: string; accent: string; accentSoft: string; exercises: Exercise[]; bonus: any[]; };
type SetRecord = { weight: number; reps: number; rpe: number; isWarmup: boolean; date: number; };

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

// --- UI COMPONENTS (VIBRANT GLASS) ---
const GlassCard = ({ className, children, onClick }: any) => (
  <motion.div 
    whileHover={onClick ? { scale: 1.02 } : {}}
    onClick={onClick}
    className={`bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2.5rem] shadow-2xl overflow-hidden ${className || ''}`}
  >
    {children}
  </motion.div>
);

const NeonButton = ({ className, variant = 'default', children, ...props }: any) => {
  const variants: any = {
    default: "bg-teal-500 text-slate-950 shadow-[0_0_20px_rgba(20,184,166,0.4)] hover:bg-teal-400",
    outline: "border-2 border-white/20 bg-white/5 text-white hover:bg-white/10",
    ghost: "bg-transparent text-white/70 hover:text-white",
    danger: "bg-rose-500 text-white shadow-[0_0_20px_rgba(244,63,94,0.4)]"
  };
  return (
    <button className={`inline-flex items-center justify-center font-black rounded-2xl transition-all active:scale-95 disabled:opacity-50 ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

const Progress = ({ value, color = "bg-teal-500" }: any) => (
  <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden shadow-inner">
    <motion.div 
      initial={{ width: 0 }} animate={{ width: `${value}%` }}
      className={`h-full ${color} shadow-[0_0_15px_rgba(20,184,166,0.5)]`} 
    />
  </div>
);

// --- DATA ---
const exerciseMedia: Record<string, { videoUrl: string; imageUrl: string }> = {
  e1:  { videoUrl: "https://www.youtube.com/watch?v=p1qV6WfI7eQ", imageUrl: imageByMuscle.Back },
  e4:  { videoUrl: "https://www.youtube.com/watch?v=8_800yM5h5M", imageUrl: imageByMuscle.Back },
  e7:  { videoUrl: "https://www.youtube.com/watch?v=uIAyvYp97D8", imageUrl: imageByMuscle.Chest },
  e13: { videoUrl: "https://www.youtube.com/watch?v=pY9F7Mv5G1c", imageUrl: imageByMuscle.Legs },
};

const initialDays: DayPlan[] = [
  { 
    key: "day1", title: "גב וכוח", subtitle: "Reacher Density", focusHe: "מיקוד: עובי גב ולטים", accent: "from-teal-500 to-indigo-600", accentSoft: "bg-teal-500/20 text-teal-200", 
    exercises: [
      { id: "e1", name: "Meadows Row", sets: 4, reps: "8-10", he: "משיכה עם המרפק למותן למקסימום עובי.", work: 45, rest: 90, category: "pull", muscleGroup: "Back" },
      { id: "e4", name: "Weighted Pull-Ups", sets: 3, reps: "6-8", he: "חזה למעלה, מתיחה מלאה למטה.", work: 45, rest: 120, category: "pull", muscleGroup: "Back" }
    ],
    bonus: []
  },
  { 
    key: "day2", title: "חזה ודחיפה", subtitle: "Power Push", focusHe: "מיקוד: חזה עליון וטריספס", accent: "from-rose-500 to-orange-600", accentSoft: "bg-rose-500/20 text-rose-200", 
    exercises: [
      { id: "e7", name: "Low-Incline DB Press", sets: 4, reps: "8-10", he: "שיפוע עדין, דגש על חזה עליון.", work: 40, rest: 90, category: "push", muscleGroup: "Chest" },
      { id: "e12", name: "Weighted Dips", sets: 3, reps: "8-12", he: "הטיה קדימה לגיוס סיבי חזה.", work: 40, rest: 90, category: "push", muscleGroup: "Chest" }
    ],
    bonus: []
  }
];

// --- HOOKS ---
function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try { const item = window.localStorage.getItem(key); return item ? JSON.parse(item) : initialValue; } catch { return initialValue; }
  });
  const setValue = (value: T | ((val: T) => T)) => {
    const valueToStore = value instanceof Function ? value(storedValue) : value;
    setStoredValue(valueToStore);
    window.localStorage.setItem(key, JSON.stringify(valueToStore));
  };
  return [storedValue, setValue] as const;
}

// --- MAIN APP ---
function ReacherApp() {
  const [screen, setScreen] = useState<"splash" | "home" | "day" | "live" | "analytics" | "settings">("splash");
  const [apiKey, setApiKey] = useLocalStorage("reacher_api_key", "");
  const [history, setHistory] = useLocalStorage<Record<string, SetRecord[]>>("reacher_history", {});
  const [selectedDayKey, setSelectedDayKey] = useState("day1");
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [setIndex, setSetIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [aiResponse, setAiResponse] = useState("מערכת AI מוכנה, נעם.");

  const audioCtx = useRef<AudioContext | null>(null);

  const initEngines = useCallback(() => {
    if (!audioCtx.current) audioCtx.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    if (audioCtx.current.state === 'suspended') audioCtx.current.resume();
    if ('speechSynthesis' in window) {
      const u = new SpeechSynthesisUtterance("");
      window.speechSynthesis.speak(u);
    }
    setScreen("home");
  }, []);

  const speak = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'he-IL';
    u.rate = 1.0;
    window.speechSynthesis.speak(u);
  };

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

  const currentDay = initialDays.find(d => d.key === selectedDayKey) || initialDays[0];
  const activeEx = currentDay.exercises[exerciseIndex];

  // AI Logic
  const askAi = async (prompt: string) => {
    if (!apiKey) { setAiResponse("הזן מפתח API בהגדרות."); return; }
    setAiResponse("מנתח ביו-מכניקה...");
    try {
      const system = `You are coaching Noam, a VLSI engineer focused on a Reacher physique. Give ONE professional, aggressive biomechanical cue in Hebrew for: `;
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: system + prompt }] }] })
      });
      const data = await res.json();
      const output = data.candidates[0].content.parts[0].text;
      setAiResponse(output);
      speak(output);
    } catch { setAiResponse("תקשורת AI נכשלה."); }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-teal-500/30 overflow-x-hidden" dir="rtl">
      
      {/* Background Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-teal-500/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/20 blur-[120px] rounded-full" />
      </div>

      <AnimatePresence mode="wait">
        
        {/* --- 1. SPLASH SCREEN --- */}
        {screen === "splash" && (
          <motion.div 
            key="splash" exit={{ opacity: 0, scale: 1.05 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center p-10 text-center"
          >
            <div className="absolute inset-0">
              <img src={REACHER_HERO} className="w-full h-full object-cover opacity-30 grayscale" alt="Reacher" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
            </div>
            <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="z-10 space-y-8 max-w-2xl">
              <div className="flex justify-center gap-2 font-mono text-teal-400"><Cpu size={20} /> VLSI PRECISION v10</div>
              <h1 className="text-7xl md:text-9xl font-black italic tracking-tighter leading-[0.85]">REACHER<br/><span className="text-teal-400">PROTOCOL</span></h1>
              <p className="text-xl text-slate-400 font-bold uppercase tracking-widest">No Machines. No Excuses. Built Different.</p>
              <NeonButton onClick={initEngines} className="px-16 py-8 text-2xl group relative overflow-hidden">
                <span className="relative z-10">IGNITION</span>
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
              </NeonButton>
            </motion.div>
          </motion.div>
        )}

        {/* --- 2. HOME SCREEN --- */}
        {screen === "home" && (
          <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-6xl mx-auto p-6 pt-16 space-y-12 pb-32">
            <header className="flex justify-between items-end">
              <div>
                <h2 className="text-6xl font-black italic tracking-tight">שלום נעם</h2>
                <div className="flex items-center gap-2 mt-2 font-bold text-teal-400 uppercase tracking-widest text-sm">
                  <Zap size={14} /> VLSI Engineer Mode Active
                </div>
              </div>
              <button onClick={() => setScreen("settings")} className="p-5 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 transition-all">
                <Settings2 />
              </button>
            </header>

            {/* AI HUD Card */}
            <GlassCard className="p-10 border-teal-500/30">
              <div className="flex gap-8 items-start">
                <div className="p-6 bg-teal-500/20 rounded-full border border-teal-500/40"><Bot size={36} className="text-teal-400" /></div>
                <div className="space-y-4 flex-1">
                  <p className="text-3xl font-bold leading-tight italic text-teal-50">"{aiResponse}"</p>
                  <div className="flex gap-6 pt-2">
                    <button onClick={() => askAi("תן לי דגש ביו-מכני דחוף לאימון גב")} className="text-teal-400 font-black border-b-2 border-teal-400 pb-1">שאל את המאמן</button>
                    <button className="text-slate-500 font-black border-b-2 border-slate-700 pb-1 cursor-not-allowed">AI LAB 2.0 (Soon)</button>
                  </div>
                </div>
              </div>
            </GlassCard>

            <div className="grid gap-8 md:grid-cols-2">
              {initialDays.map((day) => (
                <GlassCard key={day.key} className="group hover:border-teal-500/50 transition-all cursor-pointer" onClick={() => { setSelectedDayKey(day.key); setScreen("day"); }}>
                  <div className="p-12 space-y-8">
                    <div className="flex justify-between items-center text-teal-500">
                      <Trophy size={48} />
                      <Badge variant="outline" className="border-teal-500/30 text-teal-400 uppercase tracking-[0.2em]">{day.exercises.length} EXERCISES</Badge>
                    </div>
                    <div>
                      <h3 className="text-4xl font-black italic group-hover:text-teal-400 transition-colors uppercase tracking-tighter">{day.title}</h3>
                      <p className="text-slate-400 mt-2 font-bold text-lg">{day.focusHe}</p>
                    </div>
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-teal-500 w-1/4 group-hover:w-full transition-all duration-1000" />
                    </div>
                    <NeonButton className="w-full py-6 text-xl">בחר אימון</NeonButton>
                  </div>
                </GlassCard>
              ))}
            </div>

            {/* Weekly Progress Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { label: "WORKOUTS", val: "12", icon: Activity, col: "text-teal-400" },
                { label: "TOTAL KG", val: "45K+", icon: Weight, col: "text-rose-400" },
                { label: "AI SESSIONS", val: "84", icon: Sparkles, col: "text-indigo-400" },
                { label: "STREAK", val: "5D", icon: Trophy, col: "text-amber-400" }
              ].map((s, i) => (
                <GlassCard key={i} className="p-8 text-center space-y-2">
                  <div className={`${s.col} flex justify-center mb-2`}><s.icon size={24} /></div>
                  <div className="text-4xl font-black italic">{s.val}</div>
                  <div className="text-[10px] font-black text-slate-500 tracking-[0.2em] uppercase">{s.label}</div>
                </GlassCard>
              ))}
            </div>
          </motion.div>
        )}

        {/* --- 3. DAY VIEW --- */}
        {screen === "day" && (
          <motion.div key="day" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-5xl mx-auto p-6 pt-16 space-y-10 pb-40">
            <header className="flex justify-between items-center">
              <button onClick={() => setScreen("home")} className="p-4 bg-white/5 rounded-2xl"><X /></button>
              <h2 className="text-4xl font-black italic uppercase tracking-tighter">{currentDay.title}</h2>
              <div className="w-12" />
            </header>

            <div className="space-y-6">
              {currentDay.exercises.map((ex, i) => (
                <GlassCard key={ex.id} className="p-8 group">
                  <div className="flex flex-col md:flex-row gap-8 items-center">
                    <div className="w-full md:w-48 h-32 rounded-3xl overflow-hidden border border-white/10">
                      <img src={imageByMuscle[ex.muscleGroup]} className="w-full h-full object-cover opacity-60" />
                    </div>
                    <div className="flex-1 space-y-2 text-center md:text-right">
                      <h4 className="text-3xl font-black italic uppercase">{ex.name}</h4>
                      <p className="text-slate-400 font-bold">{ex.he}</p>
                      <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-4">
                        <Badge className="bg-white/5 border-white/10 text-white font-mono">{ex.sets} SETS</Badge>
                        <Badge className="bg-white/5 border-white/10 text-white font-mono">{ex.reps} REPS</Badge>
                        <button onClick={() => askAi(ex.name)} className="text-teal-400 font-black text-sm flex items-center gap-1 hover:text-teal-300">
                          <Sparkles size={14} /> Ask AI
                        </button>
                      </div>
                    </div>
                    <NeonButton onClick={() => { setExerciseIndex(i); setScreen("live"); }} className="w-full md:w-32 py-4">התחל</NeonButton>
                  </div>
                </GlassCard>
              ))}
            </div>
          </motion.div>
        )}

        {/* --- 4. LIVE WORKOUT --- */}
        {screen === "live" && (
          <motion.div key="live" className="fixed inset-0 z-50 bg-slate-950 p-6 md:p-12 overflow-y-auto">
            <div className="max-w-4xl mx-auto space-y-12 pb-32">
              <div className="flex justify-between items-center">
                <button onClick={() => setScreen("day")} className="p-5 bg-white/5 rounded-full"><X /></button>
                <div className="text-center">
                  <div className="text-teal-400 font-black text-xs tracking-widest uppercase">Live Protocol</div>
                  <div className="text-2xl font-black italic">{currentDay.title}</div>
                </div>
                <div className="w-16" />
              </div>

              <div className="text-center space-y-4">
                <h1 className="text-6xl md:text-9xl font-black tracking-tighter italic uppercase leading-none">{activeEx.name}</h1>
                <p className="text-2xl text-slate-400 font-bold italic">"{activeEx.he}"</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <GlassCard className={`p-16 text-center ${isResting ? 'border-amber-500/50' : 'border-teal-500/50'}`}>
                  <div className="text-9xl font-black italic tracking-tighter tabular-nums">
                    {isResting ? timeLeft : "LIFT"}
                  </div>
                  <div className={`text-xl font-black uppercase tracking-[0.3em] mt-4 ${isResting ? 'text-amber-400' : 'text-teal-400'}`}>
                    {isResting ? "Resting Phase" : "Work Phase"}
                  </div>
                </GlassCard>
                <div className="space-y-6 flex flex-col justify-center">
                  <div className="bg-white/5 border border-white/10 p-6 rounded-3xl">
                    <div className="text-slate-500 text-xs font-black uppercase mb-1">Current Set</div>
                    <div className="text-5xl font-black italic">{setIndex + 1} / {activeEx.sets}</div>
                  </div>
                  <div className="bg-white/5 border border-white/10 p-6 rounded-3xl">
                    <div className="text-slate-500 text-xs font-black uppercase mb-1">Target Reps</div>
                    <div className="text-5xl font-black italic">{activeEx.reps}</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-10">
                <NeonButton 
                  onClick={() => {
                    playBeep(440);
                    setIsResting(true);
                    setTimeLeft(60);
                    const timer = setInterval(() => {
                      setTimeLeft(p => {
                        if (p <= 1) { clearInterval(timer); playBeep(880); setIsResting(false); return 0; }
                        return p - 1;
                      });
                    }, 1000);
                  }}
                  className="py-10 text-4xl shadow-[0_0_50px_rgba(20,184,166,0.3)]"
                >
                  SET COMPLETE
                </NeonButton>
                <button onClick={() => window.open(exerciseMedia[activeEx.id]?.videoUrl || "https://youtube.com", "_blank")} className="py-10 bg-white/5 border border-white/10 rounded-[2.5rem] text-3xl font-black flex items-center justify-center gap-4 hover:bg-white/10 transition-all">
                  <Youtube className="text-rose-500" size={40} /> VIDEO
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* --- 5. SETTINGS --- */}
        {screen === "settings" && (
          <motion.div key="settings" className="max-w-2xl mx-auto p-12 pt-32 space-y-12">
            <header className="flex justify-between items-center">
              <h2 className="text-6xl font-black italic uppercase tracking-tighter">Settings</h2>
              <button onClick={() => setScreen("home")} className="p-4 bg-white/5 rounded-full"><X /></button>
            </header>
            <GlassCard className="p-12 space-y-10">
              <div className="space-y-4">
                <label className="text-xs font-black text-slate-500 uppercase tracking-[0.3em]">Gemini AI Core Key</label>
                <input 
                  type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)}
                  className="w-full p-6 bg-white/5 border border-white/10 rounded-3xl text-xl font-bold focus:outline-none focus:border-teal-500 transition-all"
                  placeholder="Paste Key Here..."
                />
              </div>
              <hr className="border-white/5" />
              <div className="flex justify-between items-center">
                <span className="font-black text-2xl italic">REACHER AUDIO CUES</span>
                <button className="w-16 h-8 bg-teal-500 rounded-full relative"><div className="absolute right-1 top-1 w-6 h-6 bg-white rounded-full" /></button>
              </div>
              <NeonButton variant="danger" onClick={() => { localStorage.clear(); window.location.reload(); }} className="w-full py-6 text-xl">
                WIPE SYSTEM MEMORY
              </NeonButton>
            </GlassCard>
          </motion.div>
        )}

      </AnimatePresence>

      {/* Persistent Bottom HUD */}
      {screen !== "splash" && screen !== "live" && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] w-full max-w-md px-6">
          <div className="bg-slate-900/90 backdrop-blur-3xl border border-white/10 p-4 rounded-full flex justify-between items-center shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            <button onClick={() => setScreen("home")} className={`p-4 rounded-full transition-all ${screen === 'home' ? 'bg-teal-500 text-slate-950 shadow-lg shadow-teal-500/40' : 'text-slate-500 hover:text-white'}`}><Home /></button>
            <button onClick={() => setScreen("analytics")} className={`p-4 rounded-full transition-all ${screen === 'analytics' ? 'bg-indigo-500 text-white' : 'text-slate-500 hover:text-white'}`}><TrendingUp /></button>
            <button onClick={() => setScreen("live")} className="p-4 bg-white/5 rounded-full text-white hover:bg-white/10 transition-all"><Play fill="white" size={20} /></button>
            <button onClick={() => setScreen("settings")} className={`p-4 rounded-full transition-all ${screen === 'settings' ? 'bg-white text-slate-950' : 'text-slate-500 hover:text-white'}`}><Settings2 /></button>
          </div>
        </div>
      )}
    </div>
  );
}

// --- RENDER ---
const root = createRoot(document.getElementById("root")!);
root.render(<ReacherApp />);
