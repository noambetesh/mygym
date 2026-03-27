// App.tsx v8 - "Project Reacher" - Light & Optimized
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';

// --- CONFIGURATION ---
const GEMINI_API_KEY = "YOUR_GEMINI_API_KEY"; // Replace with your key
const REACHER_IMAGE_URL = "./reacher_inspire.png"; // Placeholder for the generated image

const config = {
  intervals: {
    prep: 10,
    work: 30,
    rest: 10,
  },
  aiCoach: {
    voiceLocale: 'he-IL',
    apiKey: GEMINI_API_KEY,
  }
};

const muscleCues = {
  Chest: [
    { cue: "Lean forward to engage lower chest", target: "Lower Chest" },
    { cue: "Keep elbows tucked to minimize shoulder strain", target: "Shoulder Health" },
    { cue: "Squeeze biceps against your chest for maximum contraction", target: "Inner Chest" },
    { cue: "Drive up explosively, but descend with full control", target: "Hypertrophy" },
  ],
  Back: [
    { cue: "Drive with your elbows, not your hands", target: "Lats" },
    { cue: "Keep your chest high and upper back arched", target: "Shoulder Blades" },
    { cue: "Focus on the stretch at the bottom without losing tension", target: "Lower Lats" },
    { cue: "Maintain a neutral spine and engage your core", target: "Spinal Health" },
  ],
};

const workoutPlan = {
  Day1: {
    name: "Pull & Legs A (Density Focus)",
    exercises: [
      { id: 101, name: "Barbell T-Bar Row", sets: 4, type: "Back", yt: "p1qV6WfI7eQ" },
      { id: 102, name: "Weighted Pull-ups (Wide Grip)", sets: 3, type: "Back", yt: "8_800yM5h5M" },
      { id: 103, name: "Dumbbell Seal Row", sets: 3, type: "Back", yt: "gC4L_tJ675g" },
      { id: 104, name: "Deficit Deadlift", sets: 3, type: "Hams/Glutes", yt: "pY9F7Mv5G1c" },
      { id: 105, name: "Seated Leg Curl", sets: 4, type: "Hams", yt: "k589F4P5W0c" },
    ],
  },
  Day2: {
    name: "Push & Legs B (Volume Focus)",
    exercises: [
      { id: 201, name: "Dumbbell Floor Press", sets: 4, type: "Chest", yt: "L8fFfN5mN_w" },
      { id: 202, name: "Weighted Dips", sets: 4, type: "Chest", yt: "G2y1pD5vC90" },
      { id: 203, name: "Barbell Overhead Press", sets: 3, type: "Shoulders", yt: "25z2Q3cM18s" },
      { id: 204, name: "Bulgarian Split Squats (Front Foot Elevated)", sets: 3, type: "Quads", yt: "tG0_m2r_G90" },
      { id: 205, name: "Pec Deck Fly", sets: 3, type: "Chest", yt: "yT7Mv7bW9Ww" },
    ],
  },
};

// --- CUSTOM HOOKS ---
const useAudioBeep = () => {
  const ctxRef = useRef<AudioContext | null>(null);

  const initAudio = useCallback(() => {
    if (!ctxRef.current) {
      try {
        ctxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        console.log("AudioContext initialized.");
      } catch (e) {
        console.error("Failed to initialize AudioContext.", e);
      }
    }
    // Critical for mobile safari to resume context on interaction
    if (ctxRef.current?.state === 'suspended') {
      ctxRef.current.resume();
    }
  }, []);

  const beep = useCallback((frequency: number, duration: number, volume: number) => {
    initAudio(); // Ensure context is awake
    if (!ctxRef.current || ctxRef.current.state === 'suspended') return;

    const ctx = ctxRef.current;
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.frequency.setValueAtTime(frequency, ctx.currentTime);
    gainNode.gain.setValueAtTime(volume, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  }, [initAudio]);

  const playBeep = useCallback((type: 'prep' | 'work' | 'rest') => {
    switch (type) {
      case 'prep': beep(1000, 0.2, 0.4); break; // Short medium beep
      case 'work': beep(1800, 0.5, 0.6); break; // High loud beep
      case 'rest': beep(500, 0.3, 0.3); break; // Low beep
    }
  }, [beep]);

  const playCountdown = useCallback((secondsLeft: number, timerType: 'prep' | 'work' | 'rest') => {
    if (secondsLeft === 0) {
      playBeep(timerType);
    } else if (secondsLeft <= 3 && timerType !== 'rest') {
      beep(timerType === 'prep' ? 800 : 1500, 0.1, 0.2); // Low ticks
    }
  }, [playBeep, beep]);

  return { playBeep, playCountdown, initAudio };
};

const useAICoach = () => {
  const synthesis = useRef<SpeechSynthesis | null>(null);
  const voice = useRef<SpeechSynthesisVoice | null>(null);

  useEffect(() => {
    if ('speechSynthesis' in window) {
      synthesis.current = window.speechSynthesis;
      const loadVoices = () => {
        const voices = synthesis.current?.getVoices() || [];
        voice.current = voices.find(v => v.lang === config.aiCoach.voiceLocale) || voices[0] || null;
      };
      loadVoices();
      synthesis.current.onvoiceschanged = loadVoices;
    }
  }, []);

  const speak = useCallback((text: string) => {
    if (!synthesis.current || !voice.current) {
      console.warn("AI Speech is not available or voice not loaded.");
      return;
    }
    synthesis.current.cancel(); // Cancel any current speaking
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = voice.current;
    utterance.lang = config.aiCoach.voiceLocale;
    utterance.rate = 1.0;
    utterance.pitch = 1.1; // Slightly higher
    synthesis.current.speak(utterance);
  }, []);

  const initAICoach = useCallback(() => {
    // Basic speech activation on interaction
    if (synthesis.current && 'SpeechSynthesisUtterance' in window) {
        const u = new SpeechSynthesisUtterance("");
        u.volume = 0;
        synthesis.current.speak(u);
    }
  }, []);

  const askGemini = useCallback(async (prompt: string): Promise<string> => {
    if (!config.aiCoach.apiKey || config.aiCoach.apiKey === "YOUR_GEMINI_API_KEY") {
        return "שיפור טכני ממוקד ריצ'ר יינתן כאן בקרוב. (מפתח API חסר)";
    }

    // Personalized Reacher Coach Prompt
    const promptContext = `
      You are an expert bodybuilding and biomechanics coach for Noam, a VLSI engineer.
      His goal is massive, dense muscular growth like Jack Reacher, focusing on complete muscle recruitment. He prefers precise, biomechanical cues over generic motivation. Provide one specific, concise cue based on this prompt. Keep it professional, scientific, and impactful.
      Prompt: ${prompt}
    `;

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${config.aiCoach.apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: promptContext }] }] }),
      });
      const data = await response.json();
      const cue = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "תתמקד בביצוע מושלם.";
      speak(cue);
      return cue;
    } catch (e) {
      console.error("Gemini API Error", e);
      return "התמקדות בביצוע מלא של טווח התנועה.";
    }
  }, [speak]);

  return { speak, askGemini, initAICoach };
};

// --- COMPONENTS ---
const Header = () => (
  <header className="bg-slate-900 text-white shadow-md p-5 border-b border-slate-700">
    <div className="max-w-7xl mx-auto flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tighter">BITESH BIST TRAINER <span className="text-teal-400">v8</span></h1>
        <p className="text-slate-300 text-sm mt-1">Project Reacher: VLSI Precision Bodybuilding</p>
      </div>
      <div className="text-teal-400 font-mono text-xs border border-teal-400 px-3 py-1 rounded-full">AI Coach Active</div>
    </div>
  </header>
);

const MuscleCueList = ({ cues }: { cues: typeof muscleCues.Chest }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mt-8">
    <h3 className="text-2xl font-bold mb-6 text-slate-900 tracking-tight">ביו-מכניקה מתקדמת (ריצ'ר פוקוס)</h3>
    <div className="space-y-4">
      {cues.map((item, index) => (
        <div key={index} className="flex items-start bg-slate-50 p-4 rounded-xl border border-slate-100">
          <div className="text-teal-600 mr-4 font-extrabold text-xl mt-1">#</div>
          <div>
            <p className="text-slate-900 font-medium">{item.cue}</p>
            <p className="text-teal-700 text-sm font-semibold mt-1">מטרה: {item.target}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const TimerDisplay = ({ label, seconds, type }: { label: string; seconds: number; type: 'prep' | 'work' | 'rest' }) => {
  const colorMap = {
    prep: "text-amber-600 bg-amber-50 border-amber-100",
    work: "text-rose-600 bg-rose-50 border-rose-100",
    rest: "text-teal-600 bg-teal-50 border-teal-100",
  };
  return (
    <div className={`${colorMap[type]} p-6 rounded-2xl border flex items-center justify-between shadow-inner mt-4`}>
      <span className="text-xl font-bold tracking-tight">{label}</span>
      <span className="text-5xl font-extrabold tabular-nums tracking-tighter">{seconds}<span className="text-2xl ml-1">s</span></span>
    </div>
  );
};

// --- MAIN SCREENS ---
const SplashScreen = ({ onEnter }: { onEnter: () => void }) => (
    <div className="h-screen bg-black text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
        {/* Background Image with Overlay for better text readability */}
        <div className="absolute inset-0 z-0 opacity-60">
            <img 
                src={REACHER_IMAGE_URL} 
                alt="Reacher Physique Inspiration" 
                className="w-full h-full object-cover"
                onError={(e) => {
                    e.currentTarget.style.display = 'none'; // Hide if failed
                    console.error("Reacher image failed to load.");
                }}
            />
             <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
        </div>

        <div className="z-10 text-center max-w-xl space-y-6">
            <h1 className="text-6xl font-extrabold tracking-tighter leading-tight bg-gradient-to-r from-teal-400 to-sky-400 bg-clip-text text-transparent">
                BITESH<br/>BIST<br/>TRAINER<br/>
                <span className="text-white text-5xl">PROJECT REACHER</span>
            </h1>
            <p className="text-slate-200 text-lg font-medium leading-relaxed">
                מערכת אימון ביו-מכנית מתקדמת שנבנתה לנעם. פוקוס על תרגילים מורכבים, כיווץ אופטימלי, וגוף חזק, דחוס ועצום כמו של ריצ'ר.
            </p>
            <div className="pt-10">
                <button 
                    onClick={onEnter} 
                    className="bg-teal-500 text-slate-900 font-bold px-12 py-5 rounded-full text-2xl shadow-2xl hover:bg-teal-400 transition-all duration-300 transform hover:scale-105"
                >
                    להתחיל להתאמן
                </button>
            </div>
        </div>
    </div>
);

const HomeView = ({ onSelectWorkout }: { onSelectWorkout: (day: keyof typeof workoutPlan) => void }) => (
    <div className="space-y-10">
        <div className="text-center bg-white p-8 rounded-3xl border border-slate-200 shadow-lg">
            <p className="text-sm text-slate-500 font-medium">בוקר טוב נעם,</p>
            <h2 className="text-5xl font-extrabold tracking-tighter text-slate-950 mt-2">המטרה: גוף ריצ'ר.</h2>
            <p className="text-slate-700 mt-4 leading-relaxed max-w-2xl mx-auto">אימונים מבוססי ביו-מכניקה, התמקדות בתרגילים חופשיים ומורכבים. ה-AI Coach מוכן לתת לך דגשים מדויקים לכל חזרה.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {Object.entries(workoutPlan).map(([dayKey, dayData]) => (
                <div key={dayKey} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-lg space-y-5 transition-all hover:border-teal-300">
                    <div>
                        <span className="text-teal-600 font-semibold">{dayKey === "Day1" ? "יום ראשון/שני" : "יום רביעי/חמישי"}</span>
                        <h3 className="text-3xl font-extrabold tracking-tight text-slate-950 mt-1">{dayData.name}</h3>
                        <p className="text-slate-600 mt-2">{dayData.exercises.length} תרגילים • התמקדות במסה דחוסה</p>
                    </div>
                    <ul className="space-y-3 pt-3 border-t border-slate-100">
                        {dayData.exercises.slice(0, 3).map(e => <li key={e.id} className="text-slate-800 font-medium">{e.name} ({e.sets} סטים)</li>)}
                        {dayData.exercises.length > 3 && <li className="text-slate-500 text-sm">ועוד {dayData.exercises.length - 3} תרגילים...</li>}
                    </ul>
                    <button 
                        onClick={() => onSelectWorkout(dayKey as keyof typeof workoutPlan)}
                        className="bg-slate-900 text-white font-semibold w-full py-4 rounded-xl text-lg hover:bg-slate-800"
                    >
                        התחל אימון {dayData.name}
                    </button>
                </div>
            ))}
        </div>
    </div>
);

const ExerciseSelectorView = ({ workoutKey, onSelectExercise, currentExerciseId, currentSet, onCompleteSet }: { 
    workoutKey: keyof typeof workoutPlan;
    onSelectExercise: (id: number) => void;
    currentExerciseId: number | null;
    currentSet: number;
    onCompleteSet: () => void;
}) => {
  const workout = workoutPlan[workoutKey];
  return (
    <div className="space-y-8">
        <h2 className="text-4xl font-extrabold text-slate-950">{workout.name} - בחירת תרגיל</h2>
        <div className="space-y-6">
            {workout.exercises.map((ex) => {
                const isSelected = ex.id === currentExerciseId;
                const isCurrent = currentExerciseId === null || isSelected;
                return (
                    <div key={ex.id} className={`bg-white p-6 rounded-2xl border ${isSelected ? 'border-teal-400' : 'border-slate-200'} shadow-sm space-y-4`}>
                        <div className="flex items-start justify-between">
                            <div>
                                <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full ${isSelected ? 'bg-teal-100 text-teal-800' : 'bg-slate-100 text-slate-700'}`}>{ex.type}</span>
                                <h3 className="text-2xl font-bold text-slate-950 mt-2">{ex.name}</h3>
                                <p className="text-slate-600">יעד: {ex.sets} סטים</p>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                                <a href={`https://youtu.be/${ex.yt}`} target="_blank" rel="noopener noreferrer" className="text-sky-600 text-sm font-semibold flex items-center">
                                    <span className="mr-1.5">▶</span> צפה בסרטון הדרכה
                                </a>
                                {isSelected && (
                                     <div className="text-slate-900 font-bold bg-slate-100 px-3 py-1 rounded-lg">סט {currentSet + 1} / {ex.sets}</div>
                                )}
                            </div>
                        </div>

                        {isSelected ? (
                             <button onClick={onCompleteSet} className="bg-teal-600 text-white w-full py-4 rounded-xl font-bold text-lg shadow-lg">סימון סט כהושלם (ביפ!)</button>
                        ) : (
                             <button onClick={() => onSelectExercise(ex.id)} className="bg-slate-900 text-white w-full py-4 rounded-xl font-medium text-lg hover:bg-slate-800" disabled={currentExerciseId !== null && !isSelected}>בחר תרגיל להתחלה</button>
                        )}
                    </div>
                );
            })}
        </div>
    </div>
  );
};

const LiveWorkoutView = ({ workoutKey, currentExerciseId, currentSet, onCompleteSet }: { 
    workoutKey: keyof typeof workoutPlan;
    currentExerciseId: number | null;
    currentSet: number;
    onCompleteSet: () => void;
}) => {
    const workout = workoutPlan[workoutKey];
    const exercise = currentExerciseId ? workout.exercises.find(e => e.id === currentExerciseId) : null;
    const { playCountdown } = useAudioBeep();
    const { askGemini } = useAICoach();

    const [timeLeft, setTimeLeft] = useState(config.intervals.rest);
    const [aiCue, setAiCue] = useState<string | null>(null);

    useEffect(() => {
        // AI cue at start of rest
        if (timeLeft === config.intervals.rest) {
            askGemini(`Provide one precise biomechanical cue for Noam doing '${exercise?.name}' to maximize muscle density, Jack Reacher style.`)
                .then(setAiCue);
        }

        const timer = setInterval(() => {
            setTimeLeft(t => {
                if (t <= 1) {
                    clearInterval(timer);
                    playCountdown(0, 'rest');
                    // auto transition/notify here?
                    return 0;
                }
                playCountdown(t - 1, 'rest');
                return t - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, playCountdown, askGemini, exercise?.name]);

    if (!exercise) return null;

    return (
        <div className="space-y-8">
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-lg text-center">
                <span className="text-sm font-semibold text-rose-600 bg-rose-50 px-3 py-1 rounded-full">מנוחה</span>
                <p className="text-slate-600 mt-3">מתכוננים לסט {currentSet + 2} / {exercise.sets}</p>
                <h2 className="text-4xl font-extrabold text-slate-950 mt-1">{exercise.name}</h2>
                <TimerDisplay label="ספירה לאחור לתחילת הסט" seconds={timeLeft} type="rest" />
            </div>

            {aiCue && (
                <div className="bg-teal-950 p-6 rounded-2xl text-teal-100 border border-teal-800 shadow-xl space-y-2">
                    <p className="font-bold text-lg text-teal-300">דגש מה-AI Coach של ריצ'ר:</p>
                    <p className="text-xl font-medium leading-relaxed">"{aiCue}"</p>
                </div>
            )}
             <button onClick={onCompleteSet} className="bg-slate-900 text-white w-full py-4 rounded-xl font-medium text-lg hover:bg-slate-800">התחל סט מוקדם יותר</button>
        </div>
    );
};

// --- NAVIGATION ---
const FooterNav = ({ currentView, currentWorkout, setCurrentView, endWorkout }: {
    currentView: 'home' | 'selector' | 'live';
    currentWorkout: string | null;
    setCurrentView: (view: 'home' | 'selector' | 'live') => void;
    endWorkout: () => void;
}) => {
    const isWorkoutActive = currentView !== 'home';
    return (
        <footer className="bg-slate-900 text-slate-300 p-4 sticky bottom-0 border-t border-slate-700 mt-12 shadow-2xl">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <button 
                    onClick={() => setCurrentView('home')} 
                    className={`font-semibold text-lg px-4 py-2 rounded-lg ${currentView === 'home' ? 'bg-slate-700 text-teal-400' : ''}`}
                >בית</button>
                {isWorkoutActive && (
                    <div className="flex items-center gap-4">
                        <p className="text-teal-400 text-sm font-medium">אימון: {currentWorkout}</p>
                        <button 
                            onClick={endWorkout}
                            className="text-sm text-rose-400 font-semibold border border-rose-600 px-3 py-1 rounded-full hover:bg-rose-950"
                        >סיום אימון</button>
                    </div>
                )}
            </div>
        </footer>
    );
};

// --- APP ---
const App = () => {
    const [view, setView] = useState<'splash' | 'home' | 'selector' | 'live'>('splash');
    const [selectedWorkoutKey, setSelectedWorkoutKey] = useState<keyof typeof workoutPlan | null>(null);
    const [currentExerciseId, setCurrentExerciseId] = useState<number | null>(null);
    const [currentSet, setCurrentSet] = useState(0);

    const { initAudio, playBeep } = useAudioBeep();
    const { initAICoach } = useAICoach();

    const handleEnterApp = useCallback(() => {
        initAudio(); // Activate AudioContext on first touch
        initAICoach(); // Activate Speech
        setView("home");
    }, [initAudio, initAICoach]);

    const handleSelectWorkout = (dayKey: keyof typeof workoutPlan) => {
        setSelectedWorkoutKey(dayKey);
        setCurrentExerciseId(null);
        setCurrentSet(0);
        setView("selector");
    };

    const handleSelectExercise = (exerciseId: number) => {
        setCurrentExerciseId(exerciseId);
        setCurrentSet(0);
        // Still in selector, but highlighted
    };

    const handleCompleteSet = () => {
        if (!selectedWorkoutKey || !currentExerciseId) return;
        
        const exercise = workoutPlan[selectedWorkoutKey].exercises.find(e => e.id === currentExerciseId);
        if (!exercise) return;

        playBeep('work'); // Final work beep

        if (currentSet + 1 >= exercise.sets) {
            // Finished Exercise
            setCurrentExerciseId(null);
            setCurrentSet(0);
            setView("selector");
        } else {
            // Need Rest, Start Rest Timer
            setCurrentSet(s => s + 1);
            setView("live");
        }
    };

    const endWorkout = () => {
        setSelectedWorkoutKey(null);
        setCurrentExerciseId(null);
        setCurrentSet(0);
        setView("home");
    };

    if (view === "splash") return <SplashScreen onEnter={handleEnterApp} />;

    const workoutName = selectedWorkoutKey ? workoutPlan[selectedWorkoutKey].name : null;

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans antialiased" dir="rtl">
            <Header />

            <main className="flex-grow p-6 md:p-10 max-w-7xl mx-auto w-full">
                {view === "home" && <HomeView onSelectWorkout={handleSelectWorkout} />}
                
                {selectedWorkoutKey && view === "selector" && (
                    <ExerciseSelectorView 
                        workoutKey={selectedWorkoutKey}
                        currentExerciseId={currentExerciseId}
                        currentSet={currentSet}
                        onSelectExercise={handleSelectExercise}
                        onCompleteSet={handleCompleteSet}
                    />
                )}

                {selectedWorkoutKey && currentExerciseId && view === "live" && (
                    <LiveWorkoutView 
                        workoutKey={selectedWorkoutKey}
                        currentExerciseId={currentExerciseId}
                        currentSet={currentSet}
                        onCompleteSet={handleCompleteSet}
                    />
                )}

                {/* Always show muscle cues for the selected workout in Selector view */}
                {selectedWorkoutKey && view === "selector" && workoutPlan[selectedWorkoutKey].exercises[0]?.type === "Back" && (
                    <MuscleCueList cues={muscleCues.Back} />
                )}
                 {selectedWorkoutKey && view === "selector" && workoutPlan[selectedWorkoutKey].exercises[0]?.type === "Chest" && (
                    <MuscleCueList cues={muscleCues.Chest} />
                )}
            </main>

            <FooterNav 
                currentView={view as 'home' | 'selector' | 'live'}
                currentWorkout={workoutName}
                setCurrentView={setView}
                endWorkout={endWorkout}
            />
        </div>
    );
};

export default App;
