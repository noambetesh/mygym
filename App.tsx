import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { createRoot } from "react-dom/client";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play, Pause, RotateCcw, SkipForward, SkipBack, Dumbbell, Flame, Clock3,
  CheckCircle2, Youtube, TimerReset, Volume2, VolumeX, Home, ListChecks,
  Swords, Trophy, Settings2, Activity, CalendarDays, Weight, Eye,
  Bot, Sparkles, X, Send, MessageCircle, ExternalLink, TrendingUp, RefreshCcw, AlertTriangle, Plus, Sparkle, 
  Zap, BarChart3, Target, ShieldAlert, Cpu
} from "lucide-react";

// --- THEME CONSTANTS ---
const REACHER_BG = "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=1200&auto=format&fit=crop";

const GlassCard = ({ className, children, onClick }: any) => (
  <motion.div 
    whileHover={{ scale: 1.01 }}
    onClick={onClick}
    className={`bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[2.5rem] shadow-2xl overflow-hidden ${className || ''}`}
  >
    {children}
  </motion.div>
);

// --- MAIN APPLICATION ---
function ReacherApp() {
  const [screen, setScreen] = useState<"splash" | "home" | "live" | "analytics" | "settings" | "ai-lab">("splash");
  const [apiKey, setApiKey] = useState(() => localStorage.getItem("reacher_api_key") || "");
  const [isReacherMode, setIsReacherMode] = useState(false);
  const [currentDay, setCurrentDay] = useState("day1");
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [aiResponse, setAiResponse] = useState("מערכת AI מוכנה לפקודה, נעם.");
  
  const audioCtx = useRef<AudioContext | null>(null);

  // --- ENGINE ACTIVATION ---
  const initEngines = useCallback(() => {
    if (!audioCtx.current) {
      audioCtx.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
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
    u.pitch = isReacherMode ? 0.8 : 1.1;
    window.speechSynthesis.speak(u);
  };

  const playBeep = (type: 'work' | 'rest') => {
    if (!audioCtx.current) return;
    const osc = audioCtx.current.createOscillator();
    const gain = audioCtx.current.createGain();
    osc.connect(gain); gain.connect(audioCtx.current.destination);
    osc.frequency.value = type === 'work' ? 880 : 440;
    gain.gain.setValueAtTime(0.2, audioCtx.current.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.current.currentTime + 0.5);
    osc.start(); osc.stop(audioCtx.current.currentTime + 0.5);
  };

  // --- AI COACH LOGIC ---
  const callAi = async (prompt: string, context = "general") => {
    if (!apiKey) { setAiResponse("נעם, המוח כבוי. הזן מפתח API בהגדרות."); return; }
    setAiResponse("מנתח ביו-מכניקה...");
    try {
      const system = context === "lab" 
        ? "You are a bodybuilding AI specialist. Create a custom Reacher protocol for Noam. Use heavy compound exercises. Hebrew only."
        : "You are the Reacher Coach. Give a 10-word professional biomechanical cue in Hebrew.";
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: system + prompt }] }] })
      });
      const data = await res.json();
      const output = data.candidates[0].content.parts[0].text;
      setAiResponse(output);
      speak(output);
    } catch (e) { setAiResponse("תקשורת AI נכשלה."); }
  };

  // --- WORKOUT DATA (Non-Machine Focus) ---
  const workouts: any = {
    day1: { name: "REACHER DENSITY (PUSH)", exercises: [
      { name: "Low-Incline DB Press", sets: 4, reps: "6-8", yt: "uIAyvYp97D8", cue: "מתיחה עמוקה, כיווץ דחוס." },
      { name: "Weighted Dips", sets: 3, reps: "10", yt: "yZ8K_I_0H_o", cue: "הטיה קדימה לגיוס סיבי חזה." }
    ]},
    day2: { name: "REACHER WIDTH (PULL)", exercises: [
      { name: "Meadows Row", sets: 4, reps: "12", yt: "p1qV6WfI7eQ", cue: "משיכה עם המרפק למותן." },
      { name: "Weighted Pull-ups", sets: 3, reps: "6-8", yt: "8_800yM5h5M", cue: "חזה למעלה, מתיחה מלאה." }
    ]}
  };
  const activeWorkout = workouts[currentDay];
  const activeEx = activeWorkout.exercises[exerciseIndex];

  return (
    <div className={`min-h-screen transition-colors duration-1000 ${isReacherMode ? 'bg-red-950' : 'bg-slate-950'} text-white overflow-x-hidden`} dir="rtl">
      
      {/* Background Neon Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-40 -left-40 w-96 h-96 rounded-full blur-[150px] opacity-30 ${isReacherMode ? 'bg-red-600' : 'bg-teal-500'}`} />
        <div className={`absolute -bottom-40 -right-40 w-96 h-96 rounded-full blur-[150px] opacity-30 ${isReacherMode ? 'bg-orange-600' : 'bg-indigo-500'}`} />
      </div>

      <AnimatePresence mode="wait">
        
        {/* --- 1. SPLASH SCREEN --- */}
        {screen === "splash" && (
          <motion.div 
            key="splash" exit={{ opacity: 0, scale: 1.1 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center p-10 text-center"
          >
            <div className="absolute inset-0 z-0">
              <img src={REACHER_BG} className="w-full h-full object-cover opacity-30 grayscale" alt="Reacher" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />
            </div>
            <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="z-10 space-y-10">
              <div className="flex justify-center gap-2 font-mono text-teal-400"><Cpu /> PROJECT REACHER v10</div>
              <h1 className="text-8xl md:text-9xl font-black italic tracking-tighter leading-none">BUILT<br/><span className="text-teal-400">DIFFERENT</span></h1>
              <p className="text-2xl text-slate-400 font-bold tracking-widest uppercase">Noam, Let's Build That Physique.</p>
              <button 
                onClick={initEngines}
                className="group relative px-20 py-8 bg-white text-slate-950 text-3xl font-black rounded-full shadow-[0_0_50px_rgba(255,255,255,0.3)] hover:scale-105 transition-all"
              >
                IGNITION
              </button>
            </motion.div>
          </motion.div>
        )}

        {/* --- 2. HOME SCREEN --- */}
        {screen === "home" && (
          <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-6xl mx-auto p-6 pt-16 space-y-12 pb-40">
            <header className="flex justify-between items-end">
              <div>
                <h2 className="text-6xl font-black italic">היי נעם</h2>
                <div className="flex gap-2 mt-2 font-bold text-teal-400">VLSI ENGINEER | PROJECT REACHER</div>
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={() => setIsReacherMode(!isReacherMode)}
                  className={`p-5 rounded-3xl border-2 transition-all ${isReacherMode ? 'border-red-500 bg-red-500 shadow-[0_0_30px_rgba(239,68,68,0.5)]' : 'border-slate-800 bg-slate-900 text-slate-500'}`}
                >
                  <Zap fill={isReacherMode ? "white" : "none"} />
                </button>
                <button onClick={() => setScreen("settings")} className="p-5 rounded-3xl bg-slate-900 border border-slate-800 text-slate-400"><Settings2 /></button>
              </div>
            </header>

            {/* AI HUD */}
            <GlassCard className="p-10 border-teal-500/30">
              <div className="flex gap-8 items-start">
                <div className="p-6 bg-teal-500/20 rounded-full border border-teal-500/50"><Bot size={40} className="text-teal-400" /></div>
                <div className="space-y-4 flex-1">
                  <p className="text-3xl font-bold leading-tight text-teal-100 italic">"{aiResponse}"</p>
                  <div className="flex gap-6">
                    <button onClick={() => callAi("תן לי דגש ביו-מכני")} className="text-teal-400 font-black border-b-2 border-teal-400 pb-1">דגש מהיר</button>
                    <button onClick={() => setScreen("ai-lab")} className="text-orange-400 font-black border-b-2 border-orange-400 pb-1">AI LAB 2.0</button>
                  </div>
                </div>
              </div>
            </GlassCard>

            <div className="grid gap-8 md:grid-cols-2">
              {Object.entries(workouts).map(([id, w]: any) => (
                <GlassCard key={id} className="group cursor-pointer hover:border-teal-500" onClick={() => { setCurrentDay(id); setScreen("live"); }}>
                  <div className="p-12 space-y-8">
                    <h3 className="text-4xl font-black italic group-hover:text-teal-400 transition-colors">{w.name}</h3>
                    <button className="w-full py-6 bg-white text-slate-950 rounded-3xl font-black text-xl group-hover:bg-teal-400 transition-colors">START SESSION</button>
                  </div>
                </GlassCard>
              ))}
            </div>
          </motion.div>
        )}

        {/* --- 3. LIVE SESSION --- */}
        {screen === "live" && (
          <motion.div key="live" className="fixed inset-0 z-50 bg-slate-950 p-6 md:p-12 overflow-y-auto">
             <div className="max-w-4xl mx-auto space-y-12 pb-32">
                <button onClick={() => setScreen("home")} className="p-6 bg-white/5 rounded-full"><X /></button>
                <div className="text-center space-y-4">
                   <h1 className="text-7xl md:text-9xl font-black tracking-tighter italic uppercase">{activeEx.name}</h1>
                   <p className="text-2xl text-slate-400 font-bold italic">"{activeEx.cue}"</p>
                </div>
                <GlassCard className={`p-16 text-center ${isResting ? 'border-orange-500' : 'border-teal-500'}`}>
                   <div className="text-9xl font-black tabular-nums">{isResting ? timeLeft : "LIFT"}</div>
                </GlassCard>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <button 
                    onClick={() => {
                      playBeep('work');
                      setIsResting(true); setTimeLeft(60);
                      const timer = setInterval(() => {
                        setTimeLeft(p => {
                           if (p <= 1) { clearInterval(timer); playBeep('rest'); setIsResting(false); return 0; }
                           return p - 1;
                        });
                      }, 1000);
                    }}
                    className="py-10 bg-teal-500 text-slate-950 rounded-[2.5rem] text-4xl font-black shadow-xl"
                  >
                    COMPLETE SET
                  </button>
                  <button 
                    onClick={() => window.open(`http://googleusercontent.com/youtube.com/6{activeEx.yt}`, '_blank')}
                    className="py-10 bg-white/5 border border-white/10 rounded-[2.5rem] text-3xl font-black flex items-center justify-center gap-4"
                  >
                    <Youtube className="text-rose-500" size={40} /> VIDEO
                  </button>
                </div>
             </div>
          </motion.div>
        )}

        {/* --- 4. AI LAB --- */}
        {screen === "ai-lab" && (
           <motion.div key="ai-lab" className="fixed inset-0 z-[60] bg-slate-950 p-8 flex flex-col items-center justify-center">
              <button onClick={() => setScreen("home")} className="absolute top-10 right-10 p-4 bg-white/5 rounded-full"><X /></button>
              <div className="max-w-3xl w-full text-center space-y-10">
                 <Cpu size={64} className="text-orange-400 mx-auto" />
                 <h2 className="text-7xl font-black italic uppercase">AI LAB <span className="text-orange-400">2.0</span></h2>
                 <input 
                    type="text" 
                    placeholder="תאר אימון רצוי (למשל: 'גב רחב בלי מכונות')..."
                    className="w-full p-8 bg-white/5 border-2 border-slate-800 rounded-[2.5rem] text-2xl font-bold focus:border-orange-500 transition-all text-center"
                    onKeyDown={(e: any) => e.key === 'Enter' && callAi(e.target.value, 'lab')}
                 />
                 <GlassCard className="p-10 border-orange-500/30">
                    <p className="text-3xl font-black italic text-orange-100">"{aiResponse}"</p>
                 </GlassCard>
              </div>
           </motion.div>
        )}

        {/* --- 5. SETTINGS --- */}
        {screen === "settings" && (
           <motion.div key="settings" className="max-w-2xl mx-auto p-12 pt-32 space-y-12">
              <div className="flex justify-between items-center">
                 <h2 className="text-6xl font-black italic">SETTINGS</h2>
                 <button onClick={() => setScreen("home")} className="p-4 bg-white/5 rounded-full"><X /></button>
              </div>
              <GlassCard className="p-10 space-y-8">
                 <div className="space-y-4">
                    <label className="text-xs font-black text-slate-500 tracking-[0.3em]">GEMINI API KEY</label>
                    <input 
                      type="password" value={apiKey} onChange={(e) => { setApiKey(e.target.value); localStorage.setItem("reacher_api_key", e.target.value); }}
                      className="w-full p-6 bg-white/5 border border-white/10 rounded-2xl text-xl font-bold focus:border-teal-500"
                    />
                 </div>
                 <button 
                   onClick={() => { localStorage.clear(); window.location.reload(); }}
                   className="w-full py-5 text-rose-500 font-black border border-rose-500/30 rounded-2xl"
                 >
                   RESET SYSTEM
                 </button>
              </GlassCard>
           </motion.div>
        )}

      </AnimatePresence>

      {/* Persistent Navigation */}
      {screen !== "splash" && screen !== "live" && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] w-full max-w-md px-6">
           <div className="bg-slate-900/90 backdrop-blur-3xl border border-white/10 p-4 rounded-full flex justify-around items-center shadow-2xl">
              <button onClick={() => setScreen("home")} className={`p-4 rounded-full ${screen === 'home' ? 'text-teal-400' : 'text-slate-500'}`}><Home /></button>
              <button onClick={() => setScreen("ai-lab")} className={`p-4 rounded-full ${screen === 'ai-lab' ? 'text-orange-400' : 'text-slate-500'}`}><Cpu /></button>
              <button onClick={() => setScreen("live")} className="p-4 text-indigo-400"><Play /></button>
              <button onClick={() => setScreen("settings")} className="p-4 text-slate-500"><Settings2 /></button>
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
