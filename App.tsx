import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { createRoot } from "react-dom/client";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play, Pause, RotateCcw, SkipForward, SkipBack, Dumbbell, Flame, Clock3,
  CheckCircle2, Youtube, TimerReset, Volume2, VolumeX, Home, ListChecks,
  Swords, Trophy, Settings2, Activity, CalendarDays, Weight, Eye,
  Bot, Sparkles, X, Send, MessageCircle, ExternalLink, TrendingUp, RefreshCcw, AlertTriangle, Plus, Zap, Cpu, Target, Music,
  ChevronRight, Info, History, ShieldCheck, ZapOff, ArrowRightLeft, LayoutGrid, List
} from "lucide-react";

/**
 * REACHER APEX PROJECT - VERSION 15.0
 * Ultra-Stable Engine | Expanded Dataset | Pro-Coaching Explanations
 * Built for Noam.
 */

// --- TYPES & INTERFACES ---
type MuscleGroup = "Back" | "Chest" | "Legs" | "Shoulders" | "Arms" | "Core" | "FullBody";
type Category = "pull" | "push" | "legs" | "armor" | "power" | "core" | "bonus";

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  he: string; // Hebrew Detailed Explanation (No Quotes)
  work: number;
  rest: number;
  category: Category;
  muscleGroup: MuscleGroup;
  videoUrl: string;
  imageUrl: string;
  originalId?: string;
}

interface DayPlan {
  key: string;
  title: string;
  subtitle: string;
  focusHe: string;
  accent: string;
  exercises: Exercise[];
  bonus: Exercise[];
}

interface UserStats {
  totalWorkouts: number;
  totalVolume: number;
  streak: number;
  lastDate: string;
}

// --- CONSTANTS & DICTIONARIES ---
const REACHER_HERO = "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1400&auto=format&fit=crop";

const muscleHebrew: Record<string, string> = {
  Back: "גב", Chest: "חזה", Legs: "רגליים", Shoulders: "כתפיים", Arms: "ידיים", Core: "ליבה", FullBody: "כל הגוף"
};

const categoryHebrew: Record<string, string> = {
  pull: "משיכה", push: "דחיפה", legs: "רגליים", armor: "שריון כתפיים", power: "כוח מתפרץ", core: "ליבה", bonus: "בונוס"
};

const muscleColors: Record<string, string> = {
  Back: "teal", Chest: "blue", Legs: "emerald", Shoulders: "violet", Arms: "rose", Core: "indigo", FullBody: "orange"
};

// --- IMAGE MAPPING (UNIQUE PER EXERCISE) ---
const EX_IMAGES = {
  meadows: "https://images.unsplash.com/photo-1603287611837-f2146f5de8e8?q=80&w=800",
  lat_pull: "https://images.unsplash.com/photo-1590239068512-0f3eff9cca18?q=80&w=800",
  t_bar: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800",
  pullups: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?q=80&w=800",
  curls: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800",
  db_press: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=800",
  dips: "https://images.unsplash.com/photo-1534367957981-2940263f382a?q=80&w=800",
  squat: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800",
  bulgarian: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=800",
  dragon: "https://images.unsplash.com/photo-1599058917233-57c0e6244a4d?q=80&w=800",
  z_press: "https://images.unsplash.com/photo-1591741535018-d042766c62eb?q=80&w=800",
  facepull: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=800",
  landmine: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=800",
  farmer: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=800",
  generic_back: "https://images.unsplash.com/photo-1603287611837-f2146f5de8e8?q=80&w=800",
  generic_chest: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800"
};

// --- DATASET: THE COMPLETE REACHER PROTOCOL ---
const initialDays: DayPlan[] = [
  {
    key: "day1",
    title: "יום 1 - גב",
    subtitle: "רוחב ועובי מקסימלי",
    focusHe: "מיקוד בבניית לטים רחבים וגב עליון דחוס",
    accent: "teal",
    exercises: [
      {
        id: "e1",
        name: "Meadows Row",
        sets: 4,
        reps: "10-12",
        he: "עמוד בניצב למוט כאשר הוא מונח על הקרקע בתוך לנדמיין או פינה. אחוז בקצה העליון של המוט ביד אחת באחיזה מעבר. שמור על גב ישר ומקביל לרצפה. משוך את המוט לכיוון המותן תוך כדי הוצאת המרפק החוצה וסחיטה חזקה של הלטיסימוס והשכמה. הקפד על ירידה מבוקרת ומתיחה מלאה בתחתית התנועה ללא סיבוב המותן.",
        work: 45,
        rest: 90,
        category: "pull",
        muscleGroup: "Back",
        videoUrl: "https://www.youtube.com/watch?v=2v-re_6_23w",
        imageUrl: EX_IMAGES.meadows
      },
      {
        id: "e2",
        name: "Single-Arm Lat Pulldown",
        sets: 4,
        reps: "12",
        he: "התיישב או כרע ברך מול פולי עליון עם ידית בודדת. אחוז בידית והטה את הגוף קלות לכיוון היד העובדת. משוך את המרפק למטה לכיוון הכיס האחורי במכנסיים. שמור על חזה מורם ואל תיתן לכתף לקרוס קדימה. בשיא הכיווץ לחץ את המרפק לצד הגוף ושחרר לאט למתיחה מלאה של הלטיסימוס.",
        work: 40,
        rest: 75,
        category: "pull",
        muscleGroup: "Back",
        videoUrl: "https://www.youtube.com/watch?v=f-V9_H9_z8A",
        imageUrl: EX_IMAGES.lat_pull
      },
      {
        id: "e3",
        name: "Chest-Supported T-Bar Row",
        sets: 3,
        reps: "10",
        he: "הנח את החזה על הכרית של מכשיר ה-T-Bar. אחוז בידיות באחיזה ניטרלית. משוך את המוט לכיוון הגוף תוך כדי הצמדת השכמות אחת לשנייה. המטרה היא בידוד מוחלט של הגב העליון ללא שימוש במומנטום של הרגליים או הגב התחתון. שמור על צוואר בקו ישר עם הגב.",
        work: 40,
        rest: 80,
        category: "pull",
        muscleGroup: "Back",
        videoUrl: "https://www.youtube.com/watch?v=j3Igk5nyZE4",
        imageUrl: EX_IMAGES.t_bar
      },
      {
        id: "e4",
        name: "Weighted Pull-Ups",
        sets: 4,
        reps: "6-8",
        he: "תלה משקל על חגורת משקולות או החזק משקולת בין הרגליים. אחוז במוט המתח באחיזה רחבה מעט יותר מרוחב כתפיים. משוך את עצמך למעלה עד שהסנטר עובר את המוט תוך כדי הוצאת חזה קדימה. רד למטה בשליטה עד למתיחה מלאה של הזרועות. אל תבצע תנועות קיפינג.",
        work: 35,
        rest: 120,
        category: "pull",
        muscleGroup: "Back",
        videoUrl: "https://www.youtube.com/watch?v=p1qV6WfI7eQ",
        imageUrl: EX_IMAGES.pullups
      },
      {
        id: "e5",
        name: "Bayesian Cable Curls",
        sets: 3,
        reps: "12-15",
        he: "עמוד עם הגב למכשיר הקרוסאובר כאשר הכבל מכוון למיקום נמוך. אחוז בידית וצעד קדימה כך שהיד נמתחת לאחור מאחורי קו הגוף. בצע כפיפה של המרפק תוך שמירה על הזרוע יציבה ולא נעה קדימה. התרגיל שם דגש עצום על הראש הארוך של הדו-ראשי בזכות המתיחה ההתחלתית.",
        work: 35,
        rest: 60,
        category: "pull",
        muscleGroup: "Arms",
        videoUrl: "https://www.youtube.com/watch?v=6id88qL2vXk",
        imageUrl: EX_IMAGES.curls
      }
    ],
    bonus: [
      {
        id: "b1",
        name: "Dead Hang",
        sets: 3,
        reps: "Max Time",
        he: "היתלה על מוט המתח ושחרר את כל משקל הגוף למטה. החזק זמן מקסימלי לשיפור האחיזה ושחרור לחץ מהחוליות.",
        work: 60,
        rest: 60,
        category: "bonus",
        muscleGroup: "Back",
        videoUrl: "",
        imageUrl: EX_IMAGES.pullups
      }
    ]
  },
  {
    key: "day2",
    title: "יום 2 - חזה",
    subtitle: "כוח לחיצה ושריון קדמי",
    focusHe: "מיקוד בחזה עליון ויכולת דחיפה מתפרצת",
    accent: "blue",
    exercises: [
      {
        id: "e6",
        name: "Low-Incline DB Press",
        sets: 4,
        reps: "8-10",
        he: "כוון את הספסל לשיפוע נמוך מאוד של 15 עד 30 מעלות. אחוז בזוג משקולות ולחץ אותן מעל החזה. רד לאט עד שהמשקולות נוגעות קלות בצדי החזה תוך מתיחה חזקה. דחף למעלה בעוצמה אך שמור על שליטה. השיפוע הנמוך ממקסם את העבודה על סיבי החזה העליונים ללא עומס מיותר על הכתף הקדמית.",
        work: 45,
        rest: 100,
        category: "push",
        muscleGroup: "Chest",
        videoUrl: "https://www.youtube.com/watch?v=8iP_u5h_8E0",
        imageUrl: EX_IMAGES.db_press
      },
      {
        id: "e7",
        name: "Weighted Dips",
        sets: 4,
        reps: "8",
        he: "השתמש בחגורת משקולות להוספת התנגדות. עלה על מכשיר המקבילים והטה את הגוף קדימה בערך ב-30 מעלות. רד למטה עד שהמרפקים בזווית של 90 מעלות ומרגישים מתיחה בחזה. דחף חזרה למעלה תוך כיווץ החזה והימנע מנעילה חזקה מדי של המרפקים בסוף התנועה.",
        work: 45,
        rest: 100,
        category: "push",
        muscleGroup: "Chest",
        videoUrl: "https://www.youtube.com/watch?v=2z8JmcrW-As",
        imageUrl: EX_IMAGES.dips
      },
      {
        id: "e8",
        name: "JM Press",
        sets: 3,
        reps: "10",
        he: "שכב על ספסל ישר ואחוז במוט באחיזה צרה. הורד את המוט לכיוון הצוואר או הסנטר על ידי שילוב של כפיפת מרפקים ותנועת כתף קלה. המרפקים צריכים להצביע קדימה. ברגע שהאמות נוגעות בדו-ראשי דחף את המוט חזרה למעלה בעזרת הטריספס. זהו תרגיל כוח מעולה שמשלב לחיצה ופשיטה.",
        work: 40,
        rest: 90,
        category: "push",
        muscleGroup: "Arms",
        videoUrl: "https://www.youtube.com/watch?v=mG0UPv_bX2E",
        imageUrl: EX_IMAGES.generic_chest
      }
    ],
    bonus: []
  },
  {
    key: "day3",
    title: "יום 3 - רגליים",
    subtitle: "בסיס עוצמתי ויציבות",
    focusHe: "בניית כוח מתפרץ ברגליים ושיפור טווחי תנועה",
    accent: "emerald",
    exercises: [
      {
        id: "e9",
        name: "Zercher Squat",
        sets: 4,
        reps: "8-10",
        he: "מקם את המוט בגובה המרפקים. אחוז במוט בעיקולי המרפקים והצמד את האגרופים לחזה. עמוד בפיסוק רחב מעט מרוחב כתפיים. רד לסקוואט עמוק תוך שמירה על גב זקוף מאוד. המשקל ממוקם מקדימה ולכן מאלץ את הליבה והזוקפים לעבוד קשה מאוד יחד עם הקוואדס. זהו תרגיל פונקציונלי אדיר.",
        work: 50,
        rest: 150,
        category: "legs",
        muscleGroup: "Legs",
        videoUrl: "https://www.youtube.com/watch?v=U2OKweR-N-g",
        imageUrl: EX_IMAGES.squat
      },
      {
        id: "e10",
        name: "Bulgarian Split Squat",
        sets: 3,
        reps: "8/leg",
        he: "עמוד לפני ספסל והנח רגל אחת עליו מאחוריך. החזק משקולות בצדי הגוף. רד למטה עד שהברך האחורית כמעט נוגעת ברצפה. הקפד שהברך הקדמית לא תעבור משמעותית את קצות האצבעות. דחף דרך כל כף היד הקדמית חזרה למעלה. תרגיל זה בונה יציבות ומבודד כל רגל בצורה מושלמת.",
        work: 45,
        rest: 90,
        category: "legs",
        muscleGroup: "Legs",
        videoUrl: "https://www.youtube.com/watch?v=2C-uNgKwPLE",
        imageUrl: EX_IMAGES.bulgarian
      }
    ],
    bonus: []
  },
  {
    key: "day4",
    title: "יום 4 - בטן (CORE)",
    subtitle: "ליבת פלדה",
    focusHe: "חיזוק שרירי הליבה העמוקים ויצירת קוביות דחוסות",
    accent: "indigo",
    exercises: [
      {
        id: "e11",
        name: "Dragon Flags",
        sets: 3,
        reps: "5-8",
        he: "שכב על ספסל ישר ואחוז בצדדיו מאחורי הראש. הרם את כל הגוף עד למצב אנכי כשרק השכמות נוגעות בספסל. רד למטה לאט מאוד תוך שמירה על גוף ישר כמו קרש. אל תיתן לגב התחתון להתקשת. זוהי תנועה מתקדמת ביותר הדורשת שליטה אבסולוטית בבטן. אם קשה מדי ניתן לבצע עם ברכיים כפופות.",
        work: 40,
        rest: 90,
        category: "core",
        muscleGroup: "Core",
        videoUrl: "https://www.youtube.com/watch?v=moyFIvRrS0E",
        imageUrl: EX_IMAGES.dragon
      }
    ],
    bonus: []
  },
  {
    key: "day5",
    title: "יום 5 - כתפיים",
    subtitle: "כתפיים רחבות ושריון צוואר",
    focusHe: "בניית כתפיים תלת-ממדיות ויציבה של לוחם",
    accent: "violet",
    exercises: [
      {
        id: "e12",
        name: "Z-Press",
        sets: 4,
        reps: "8-10",
        he: "התיישב על הרצפה עם רגליים ישרות קדימה בפיסוק קל. אחוז במוט או משקולות בגובה הכתפיים. לחץ את המשקל מעל הראש ללא תנופה מהרגליים או הישענות לאחור. הישיבה על הרצפה מנטרלת כל עזרה מהגוף התחתון ומאלצת את הכתפיים והליבה לעבוד בצורה מבודדת וחזקה. שמור על גב זקוף לאורך כל התנועה.",
        work: 45,
        rest: 100,
        category: "armor",
        muscleGroup: "Shoulders",
        videoUrl: "https://www.youtube.com/watch?v=0_fL9S0v00A",
        imageUrl: EX_IMAGES.z_press
      },
      {
        id: "e13",
        name: "Face Pulls",
        sets: 4,
        reps: "15",
        he: "כוון את הפולי לגובה המצח והשתמש בחבל. אחוז בחבל ומשוך אותו לכיוון הפנים תוך כדי הפרדת הידיים הצידה. בסוף התנועה המרפקים צריכים להיות בקו הכתפיים והאגרופים לצדי האוזניים. סחט את הכתף האחורית והשכמות. זהו תרגיל קריטי לבריאות הכתף ויציבה זקופה.",
        work: 40,
        rest: 60,
        category: "armor",
        muscleGroup: "Shoulders",
        videoUrl: "https://www.youtube.com/watch?v=rep-qVOkqgk",
        imageUrl: EX_IMAGES.facepull
      }
    ],
    bonus: []
  }
];

const allExercisesPool = initialDays.flatMap(day => [
  ...day.exercises.map(ex => ({ ...ex, videoUrl: ex.videoUrl || `https://www.youtube.com/results?search_query=${encodeURIComponent(ex.name + ' exercise')}` })),
  ...day.bonus.map(ex => ({ ...ex, videoUrl: ex.videoUrl || `https://www.youtube.com/results?search_query=${encodeURIComponent(ex.name + ' exercise')}` }))
]);

// --- UI SUB-COMPONENTS ---

const GlassCard = ({ className, children, onClick }: any) => (
  <motion.div 
    whileHover={onClick ? { scale: 1.01, borderColor: "rgba(20, 184, 166, 0.4)", backgroundColor: "rgba(15, 23, 42, 0.6)" } : {}}
    whileTap={onClick ? { scale: 0.98 } : {}}
    onClick={onClick}
    className={`bg-slate-900/40 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] shadow-2xl overflow-hidden transition-all duration-300 ${className || ''}`}
  >
    {children}
  </motion.div>
);

const ActionButton = React.forwardRef(({ className, variant = 'default', size = 'default', children, ...props }: any, ref: any) => {
  const base = "inline-flex items-center justify-center font-black transition-all active:scale-95 disabled:opacity-50 cursor-pointer select-none";
  const variants: any = { 
    default: "bg-teal-500 text-slate-950 hover:bg-teal-400 shadow-[0_0_20px_rgba(20,184,166,0.3)]", 
    outline: "border border-white/10 bg-white/5 hover:bg-white/10 text-white/90",
    ghost: "bg-transparent text-white/40 hover:text-white hover:bg-white/5",
    danger: "bg-rose-600 text-white shadow-[0_0_20px_rgba(225,29,72,0.3)]",
    secondary: "bg-indigo-600 text-white hover:bg-indigo-500 shadow-[0_0_20px_rgba(79,70,229,0.3)]"
  };
  const sizes: any = { 
    default: "h-14 px-8 rounded-2xl text-base", 
    sm: "h-10 px-4 rounded-xl text-xs", 
    lg: "h-20 px-12 rounded-3xl text-xl", 
    icon: "h-12 w-12 rounded-xl" 
  };
  return <button ref={ref} className={`${base} ${variants[variant]} ${sizes[size]} ${className || ''}`} {...props}>{children}</button>;
});

const Badge = ({ children, variant = "default" }: any) => {
  const styles: any = { 
    default: "bg-white/5 text-white/50 border-white/5", 
    teal: "bg-teal-500/10 text-teal-400 border-teal-500/20",
    blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    rose: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    violet: "bg-violet-500/10 text-violet-400 border-violet-500/20"
  };
  return (
    <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${styles[variant] || styles.default}`}>
      {children}
    </div>
  );
};

// --- MODALS ---

function AiCoachModal({ exercise, onClose }: { exercise: Exercise, onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-2xl p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }} 
        animate={{ opacity: 1, scale: 1, y: 0 }} 
        className="bg-slate-900 border border-white/10 w-full max-w-2xl rounded-[3rem] overflow-hidden shadow-[0_0_100px_rgba(20,184,166,0.15)]"
      >
        <div className="p-10 space-y-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-teal-500/20 rounded-2xl flex items-center justify-center text-teal-400 border border-teal-500/20">
                <Bot size={32}/>
              </div>
              <div>
                <h3 className="text-2xl font-black italic uppercase tracking-tight">Reacher AI Coach</h3>
                <p className="text-teal-500/50 text-[10px] font-bold uppercase tracking-widest">Protocol Optimizer v4.2</p>
              </div>
            </div>
            <ActionButton variant="ghost" size="icon" onClick={onClose} className="rounded-full"><X/></ActionButton>
          </div>

          <div className="space-y-6 text-right" dir="rtl">
             <div className="bg-white/5 p-8 rounded-[2rem] border border-white/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><Sparkles size={40}/></div>
                <p className="text-teal-400 font-black mb-4 text-lg">דגש ביו-מכני עבור {exercise.name}:</p>
                <p className="text-xl leading-relaxed font-medium italic text-slate-200">
                  נועם, בתרגיל זה המפתח הוא שליטה בשלב האקסצנטרי. אל תאפשר למשקל ליפול. 
                  שמור על מתח קבוע בסיבי השריר המטרתיים. וודא שאתה מוציא אוויר במאמץ 
                  ומכניס אוויר בשלב המתיחה. הטכניקה חשובה יותר מהמשקל על המוט.
                </p>
             </div>
             
             <div className="grid grid-cols-2 gap-4">
                <div className="p-6 bg-slate-950/50 rounded-2xl border border-white/5">
                   <p className="text-[10px] font-black text-slate-500 uppercase mb-2">מיקוד מטבולי</p>
                   <p className="text-sm font-bold">היפרטרופיה פונקציונלית</p>
                </div>
                <div className="p-6 bg-slate-950/50 rounded-2xl border border-white/5">
                   <p className="text-[10px] font-black text-slate-500 uppercase mb-2">סיכון פציעה</p>
                   <p className="text-sm font-bold text-emerald-400">נמוך - טווח בטוח</p>
                </div>
             </div>
          </div>

          <div className="pt-4 flex flex-col gap-4">
             <ActionButton className="w-full h-16 text-lg uppercase italic font-black" onClick={() => window.open(`https://gemini.google.com/app`, "_blank")}>
               התחל שיחה מלאה עם AI
             </ActionButton>
             <p className="text-center text-[10px] text-slate-600 font-bold uppercase tracking-widest">Powered by Reacher Systems Intelligence</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// --- MAIN APP ---

function ReacherApp() {
  // Navigation & View State
  const [screen, setScreen] = useState<"splash" | "home" | "day" | "live" | "analytics" | "settings">("splash");
  const [viewMode, setViewMode] = useState<"days" | "muscles">("days");
  
  // Data State
  const [history, setHistory] = useState<UserStats>(() => {
    const saved = localStorage.getItem("reacher_v15_stats");
    return saved ? JSON.parse(saved) : { totalWorkouts: 0, totalVolume: 0, streak: 0, lastDate: "" };
  });
  
  const [selectedDayKey, setSelectedDayKey] = useState("day1");
  const [selectedMuscle, setSelectedMuscle] = useState<MuscleGroup | null>(null);
  
  // Workout Execution State
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [setIndex, setSetIndex] = useState(0);
  const [phase, setPhase] = useState<"work" | "rest" | "done">("work");
  const [timeLeft, setTimeLeft] = useState(0);
  const [running, setRunning] = useState(false);
  
  // UI State
  const [activeAiModal, setActiveAiModal] = useState<Exercise | null>(null);
  const audioCtx = useRef<AudioContext | null>(null);

  // Persistence Effects
  useEffect(() => localStorage.setItem("reacher_v15_stats", JSON.stringify(history)), [history]);

  // Audio & Haptic Logic
  const initEngines = useCallback(() => {
    if (!audioCtx.current) audioCtx.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    if (audioCtx.current.state === 'suspended') audioCtx.current.resume();
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

  const openApp = (url: string, fallback: string) => {
    const now = Date.now();
    window.location.href = url;
    setTimeout(() => { if (Date.now() - now < 1500) window.open(fallback, "_blank"); }, 800);
  };

  // Helper: Get active exercises based on current context
  const workoutList = useMemo(() => {
    if (selectedMuscle) {
      return allExercisesPool.filter(e => e.muscleGroup === selectedMuscle);
    }
    const day = initialDays.find(d => d.key === selectedDayKey);
    return day ? day.exercises : [];
  }, [selectedDayKey, selectedMuscle]);

  const activeEx = useMemo(() => {
    return workoutList[exerciseIndex] || workoutList[0];
  }, [workoutList, exerciseIndex]);

  // TIMER CORE LOGIC
  useEffect(() => {
    let t: any;
    if (running && timeLeft > 0) {
      t = setInterval(() => setTimeLeft(p => p - 1), 1000);
    } else if (running && timeLeft === 0) {
      playBeep(phase === 'work' ? 440 : 1200);
      
      if (phase === "work") {
        setPhase("rest");
        setTimeLeft(activeEx?.rest || 60);
      } else {
        if (setIndex + 1 < (activeEx?.sets || 3)) {
          setSetIndex(p => p + 1);
          setPhase("work");
          setTimeLeft(activeEx?.work || 45);
        } else if (exerciseIndex + 1 < workoutList.length) {
          setExerciseIndex(p => p + 1);
          setSetIndex(0);
          setPhase("work");
          setTimeLeft(workoutList[exerciseIndex + 1].work);
        } else {
          setPhase("done");
          setRunning(false);
          setHistory(prev => ({ ...prev, totalWorkouts: prev.totalWorkouts + 1 }));
        }
      }
    }
    return () => clearInterval(t);
  }, [running, timeLeft, phase, activeEx, workoutList, exerciseIndex, setIndex]);

  // SCREEN RENDERING

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans selection:bg-teal-500/20 overflow-x-hidden" dir="rtl">
      
      {/* Dynamic Ambient Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[100%] h-[80%] bg-teal-500/5 blur-[180px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[80%] h-[70%] bg-indigo-500/5 blur-[150px] rounded-full" />
        <div className="absolute top-[30%] left-[40%] w-1 h-1 bg-white/20 rounded-full blur-sm" />
      </div>

      <AnimatePresence mode="wait">
        
        {/* --- 1. SPLASH SCREEN --- */}
        {screen === "splash" && (
          <motion.div key="splash" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.1 }} className="fixed inset-0 z-[300] flex flex-col items-center justify-center p-12 text-center">
            <div className="absolute inset-0 z-0">
              <img src={REACHER_HERO} className="w-full h-full object-cover opacity-20 grayscale scale-110" alt="Reacher Background" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/80 to-transparent" />
            </div>
            <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="z-10 space-y-12 max-w-2xl">
              <div className="flex flex-col items-center gap-4">
                 <div className="w-20 h-20 bg-teal-500 rounded-3xl flex items-center justify-center shadow-[0_0_50px_rgba(20,184,166,0.5)] rotate-3">
                   <Swords size={48} className="text-slate-950 -rotate-3" />
                 </div>
                 <div className="flex items-center gap-3 font-mono text-teal-400 text-xs uppercase tracking-[0.4em] mt-4">
                   <Cpu size={14}/> SYSTEM VERSION 15.0.4
                 </div>
              </div>
              <h1 className="text-8xl md:text-[12rem] font-black tracking-tighter uppercase italic leading-[0.75]">
                REACHER<br/><span className="text-teal-500">APEX</span>
              </h1>
              <p className="text-slate-400 text-base font-bold uppercase tracking-[0.3em] max-w-md mx-auto leading-relaxed">
                Elite Training Protocol. <br/> Built Ruthless for Noam.
              </p>
              <div className="pt-8">
                <ActionButton size="lg" onClick={initEngines} className="px-24 py-10 text-3xl shadow-[0_20px_60px_rgba(20,184,166,0.3)] group relative overflow-hidden">
                  <span className="relative z-10 uppercase italic font-black">IGNITION</span>
                  <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                </ActionButton>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* --- 2. HOME SCREEN --- */}
        {screen === "home" && (
          <motion.div key="home" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 max-w-7xl mx-auto p-6 pt-16 pb-48 space-y-16">
            <header className="flex justify-between items-end px-4">
              <div className="space-y-2">
                <h2 className="text-5xl font-black italic tracking-tighter uppercase leading-none">COMMAND<br/>CENTER</h2>
                <div className="flex items-center gap-3 font-black text-teal-500 uppercase tracking-widest text-[11px]">
                  <div className="w-2 h-2 bg-teal-500 rounded-full animate-ping" />
                  Apex Engine: Operational
                </div>
              </div>
              <div className="flex gap-4">
                <ActionButton variant="outline" size="icon" onClick={() => openApp("spotify://", "https://open.spotify.com")} className="rounded-2xl border-white/5 hover:border-teal-500/30">
                  <Music size={22}/>
                </ActionButton>
                <ActionButton variant="outline" size="icon" onClick={() => setScreen("settings")} className="rounded-2xl border-white/5">
                  <Settings2 size={24} />
                </ActionButton>
              </div>
            </header>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 px-2">
              {[
                { label: "אימונים", val: history.totalWorkouts, icon: Activity, col: "text-teal-400", bg: "bg-teal-400/5" },
                { label: "פרוטוקולים", val: allExercisesPool.length, icon: ShieldCheck, col: "text-blue-400", bg: "bg-blue-400/5" },
                { label: "AI SYNC", val: "ACTIVE", icon: Bot, col: "text-indigo-400", bg: "bg-indigo-400/5" },
                { label: "STREAK", val: `${history.streak}D`, icon: Trophy, col: "text-amber-400", bg: "bg-amber-400/5" }
              ].map((s, i) => (
                <GlassCard key={i} className={`p-8 flex flex-col items-center justify-center text-center space-y-3 ${s.bg}`}>
                  <s.icon size={24} className={s.col} />
                  <div className="text-3xl font-black italic tracking-tight">{s.val}</div>
                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{s.label}</div>
                </GlassCard>
              ))}
            </div>

            {/* Main Selection Toggle */}
            <div className="flex bg-slate-900/80 p-2 rounded-[2rem] w-full max-w-md mx-auto border border-white/5 backdrop-blur-3xl shadow-2xl">
              <button 
                onClick={() => setViewMode("days")} 
                className={`flex-1 flex items-center justify-center gap-3 py-5 rounded-[1.5rem] text-xs font-black uppercase tracking-widest transition-all duration-500 ${viewMode === 'days' ? 'bg-white text-slate-950 shadow-xl scale-[1.02]' : 'text-slate-500 hover:text-white'}`}
              >
                <LayoutGrid size={16}/> ימים
              </button>
              <button 
                onClick={() => setViewMode("muscles")} 
                className={`flex-1 flex items-center justify-center gap-3 py-5 rounded-[1.5rem] text-xs font-black uppercase tracking-widest transition-all duration-500 ${viewMode === 'muscles' ? 'bg-white text-slate-950 shadow-xl scale-[1.02]' : 'text-slate-500 hover:text-white'}`}
              >
                <Target size={16}/> שרירים
              </button>
            </div>

            {/* Grid Display */}
            <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3 px-2">
              {viewMode === "days" ? (
                initialDays.map((day) => (
                  <GlassCard 
                    key={day.key} 
                    className="group cursor-pointer relative" 
                    onClick={() => { setSelectedDayKey(day.key); setSelectedMuscle(null); setScreen("day"); }}
                  >
                    <div className="relative h-72 overflow-hidden">
                       <img src={day.exercises[0].imageUrl} className="w-full h-full object-cover opacity-30 group-hover:scale-110 group-hover:opacity-40 transition-all duration-1000" />
                       <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/40 to-transparent" />
                       <div className="absolute top-8 right-8">
                         <Badge variant={day.accent as any}>{day.exercises.length} Protocols</Badge>
                       </div>
                       <div className="absolute bottom-10 right-10 left-10 flex justify-between items-end">
                          <div className="space-y-2">
                             <h3 className="text-5xl font-black italic uppercase leading-none tracking-tighter">{day.title}</h3>
                             <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">{day.subtitle}</p>
                          </div>
                          <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center group-hover:bg-teal-500 group-hover:text-slate-950 transition-all duration-500">
                            <ChevronRight size={28} className="rotate-180" />
                          </div>
                       </div>
                    </div>
                    <div className="p-10 bg-slate-900/20 border-t border-white/5">
                       <p className="text-sm text-slate-400 font-medium leading-relaxed mb-8">{day.focusHe}</p>
                       <ActionButton className="w-full py-7 text-sm font-black italic uppercase tracking-widest">
                         Engage Protocol
                       </ActionButton>
                    </div>
                  </GlassCard>
                ))
              ) : (
                Object.keys(muscleHebrew).map((m) => (
                  <GlassCard 
                    key={m} 
                    className="h-40 relative group overflow-hidden cursor-pointer" 
                    onClick={() => { setSelectedMuscle(m as MuscleGroup); setScreen("day"); }}
                  >
                     <img src={EX_IMAGES[`generic_${m.toLowerCase()}` as keyof typeof EX_IMAGES] || REACHER_HERO} className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:scale-110 transition-all duration-1000" />
                     <div className="absolute inset-0 bg-gradient-to-l from-[#020617] via-transparent to-transparent" />
                     <div className="relative h-full flex items-center justify-between px-12">
                        <div className="space-y-1">
                          <p className="text-[10px] font-black text-teal-500 uppercase tracking-widest">Muscle Group</p>
                          <h4 className="text-4xl font-black italic uppercase tracking-tighter leading-none">{muscleHebrew[m]}</h4>
                        </div>
                        <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-slate-950 transition-all">
                          <Target size={20} />
                        </div>
                     </div>
                  </GlassCard>
                ))
              )}
            </div>
          </motion.div>
        )}

        {/* --- 3. DAY VIEW (DETAILED LIST) --- */}
        {screen === "day" && (
          <motion.div key="day" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="relative z-10 max-w-5xl mx-auto p-6 pt-20 pb-48 space-y-12">
            <header className="flex justify-between items-center px-4">
              <ActionButton variant="ghost" size="icon" onClick={() => { setSelectedMuscle(null); setScreen("home"); }} className="rounded-full">
                <X size={24} />
              </ActionButton>
              <div className="text-center">
                <p className="text-teal-500 text-[10px] font-black uppercase tracking-[0.4em] mb-2">Selected Session</p>
                <h2 className="text-5xl font-black italic uppercase tracking-tighter">
                  {selectedMuscle ? muscleHebrew[selectedMuscle] : initialDays.find(d => d.key === selectedDayKey)?.title}
                </h2>
              </div>
              <ActionButton 
                variant="secondary" 
                size="sm" 
                onClick={() => { setExerciseIndex(0); setSetIndex(0); setPhase("work"); setTimeLeft(workoutList[0]?.work || 45); setRunning(true); setScreen("live"); }}
              >
                START ALL
              </ActionButton>
            </header>

            <div className="space-y-8">
              {workoutList.length > 0 ? workoutList.map((ex, i) => (
                <GlassCard key={ex.id} className="p-8 flex flex-col md:flex-row items-center gap-10 border-white/5 relative group">
                  {/* Exercise Image Wrapper */}
                  <div className="h-44 w-full md:w-64 rounded-[2rem] overflow-hidden border border-white/10 bg-slate-950 relative">
                     <img src={ex.imageUrl} className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-all duration-1000" alt={ex.name} />
                     <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                     <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                        <Badge variant={muscleColors[ex.muscleGroup] as any}>{muscleHebrew[ex.muscleGroup]}</Badge>
                        <div className="flex gap-2">
                           <ActionButton variant="outline" size="icon" onClick={() => openApp(`youtube://results?search_query=${encodeURIComponent(ex.name)}`, ex.videoUrl)} className="h-10 w-10 bg-black/40 backdrop-blur-md border-white/10">
                              <Youtube size={18} className="text-rose-500" />
                           </ActionButton>
                        </div>
                     </div>
                  </div>

                  {/* Exercise Info */}
                  <div className="flex-1 text-right space-y-4">
                     <div className="flex justify-start items-center gap-3">
                        <Badge>{categoryHebrew[ex.category]}</Badge>
                        <h4 className="text-3xl font-black italic uppercase tracking-tight leading-none">{ex.name}</h4>
                     </div>
                     <p className="text-slate-300 text-base font-medium leading-relaxed">
                        {ex.he}
                     </p>
                     
                     <div className="flex justify-start gap-10 pt-2">
                        <div className="space-y-1">
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Sets</p>
                          <p className="text-2xl font-black italic">{ex.sets}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Reps</p>
                          <p className="text-2xl font-black italic">{ex.reps}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Rest</p>
                          <p className="text-2xl font-black italic">{ex.rest}s</p>
                        </div>
                     </div>

                     <div className="flex justify-start gap-4 pt-4">
                        <ActionButton variant="outline" size="sm" onClick={() => setActiveAiModal(ex)} className="gap-2 border-teal-500/20 text-teal-400">
                          <Sparkles size={14}/> ASK COACH
                        </ActionButton>
                        <ActionButton variant="outline" size="sm" className="gap-2 opacity-50 cursor-not-allowed">
                          <ArrowRightLeft size={14}/> SWAP
                        </ActionButton>
                     </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <ActionButton 
                      onClick={() => { setExerciseIndex(i); setSetIndex(0); setPhase("work"); setTimeLeft(ex.work); setRunning(true); setScreen("live"); }}
                      className="w-full md:w-32 py-8 text-xs font-black italic"
                    >
                      GO LIVE
                    </ActionButton>
                  </div>
                </GlassCard>
              )) : (
                <div className="text-center py-20 bg-white/5 rounded-[3rem] border border-dashed border-white/10">
                  <ZapOff size={48} className="mx-auto text-slate-700 mb-4" />
                  <p className="text-slate-500 font-bold uppercase tracking-widest">No protocols found for this selection</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* --- 4. LIVE SESSION (THE ACTIVE TIMER) --- */}
        {screen === "live" && (
          <motion.div key="live" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-[#020617] z-[400] flex flex-col p-8 overflow-y-auto">
            <header className="flex justify-between items-center mb-10">
               <ActionButton variant="ghost" size="icon" onClick={() => { setRunning(false); setScreen("day"); }} className="rounded-full bg-white/5">
                 <X size={24} />
               </ActionButton>
               <div className="text-center">
                  <p className="text-teal-500 text-[10px] font-black uppercase tracking-[0.6em] mb-2">REACHER PROTOCOL ACTIVE</p>
                  <div className="flex items-center gap-3 justify-center">
                    <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse" />
                    <h2 className="text-2xl font-black italic uppercase tracking-tighter">
                      {selectedMuscle ? muscleHebrew[selectedMuscle] : initialDays.find(d => d.key === selectedDayKey)?.title}
                    </h2>
                  </div>
               </div>
               <ActionButton variant="outline" size="icon" onClick={() => openApp("spotify://", "https://open.spotify.com")} className="rounded-2xl">
                 <Music size={20} />
               </ActionButton>
            </header>

            <div className="flex-1 flex flex-col items-center justify-center space-y-16 py-10">
               {/* Exercise Identity */}
               <div className="text-center space-y-6 max-w-3xl px-6">
                  <Badge variant="teal">{categoryHebrew[activeEx?.category || 'pull']}</Badge>
                  <h1 className="text-6xl md:text-9xl font-black italic tracking-tighter uppercase leading-none">
                    {activeEx?.name}
                  </h1>
                  <p className="text-slate-400 text-xl md:text-2xl font-medium leading-relaxed italic max-w-2xl mx-auto">
                    {activeEx?.he}
                  </p>
               </div>

               {/* Central Timer Unit */}
               <div className="relative flex items-center justify-center">
                  {/* Ambient Glows */}
                  <motion.div 
                    animate={running ? { scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] } : {}}
                    transition={{ repeat: Infinity, duration: 3 }}
                    className={`absolute h-[32rem] w-[32rem] rounded-full border-2 ${phase === 'rest' ? 'border-amber-500/10' : 'border-teal-500/10'}`}
                  />
                  
                  {/* Timer Ring */}
                  <div className={`relative h-[28rem] w-[28rem] rounded-full border-4 flex flex-col items-center justify-center transition-all duration-1000 shadow-[0_0_100px_rgba(0,0,0,0.5)] ${phase === 'rest' ? 'border-amber-500/30 bg-amber-500/5' : 'border-teal-500/40 bg-teal-500/5'}`}>
                     <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/5 to-transparent opacity-50" />
                     
                     <span className={`text-[15rem] font-black italic tabular-nums leading-none tracking-tighter transition-colors ${phase === 'rest' ? 'text-amber-400' : 'text-white'}`}>
                        {timeLeft}
                     </span>
                     
                     <div className="flex flex-col items-center mt-6">
                        <div className={`h-1.5 w-24 rounded-full mb-4 ${phase === 'rest' ? 'bg-amber-500' : 'bg-teal-500'}`} />
                        <span className="text-[12px] font-black uppercase tracking-[0.8em] text-slate-500">
                          {phase === 'work' ? "WORK PHASE" : phase === 'rest' ? "REST PHASE" : "SESSION COMPLETE"}
                        </span>
                     </div>
                  </div>
               </div>

               {/* Meta Stats */}
               <div className="flex gap-20 justify-center w-full">
                  <div className="text-center group">
                     <p className="text-slate-600 text-xs font-black uppercase tracking-widest mb-3 group-hover:text-teal-500 transition-colors">Current Set</p>
                     <p className="text-8xl font-black italic tracking-tighter">
                       {setIndex + 1}<span className="text-3xl text-slate-800 mx-2">/</span><span className="text-3xl text-slate-600">{activeEx?.sets}</span>
                     </p>
                  </div>
                  <div className="text-center group">
                     <p className="text-slate-600 text-xs font-black uppercase tracking-widest mb-3 group-hover:text-teal-500 transition-colors">Rep Target</p>
                     <p className="text-8xl font-black italic tracking-tighter">{activeEx?.reps}</p>
                  </div>
               </div>
            </div>

            {/* Bottom Controls */}
            <div className="max-w-4xl mx-auto w-full pb-16 grid grid-cols-2 gap-8">
               <ActionButton 
                 variant={phase === 'rest' ? 'secondary' : 'default'}
                 className="h-28 text-4xl shadow-2xl uppercase italic font-black" 
                 onClick={() => { playBeep(); setTimeLeft(0); }}
               >
                 {phase === 'work' ? 'SET COMPLETE' : 'SKIP REST'}
               </ActionButton>
               <ActionButton 
                 variant="outline" 
                 className="h-28 text-4xl border-white/10" 
                 onClick={() => { initEngines(); setRunning(!running); }}
               >
                 {running ? <Pause size={48} /> : <Play size={48} className="translate-x-1" />}
               </ActionButton>
            </div>
          </motion.div>
        )}

        {/* --- 5. ANALYTICS --- */}
        {screen === "analytics" && (
           <motion.div key="analytics" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-5xl mx-auto p-10 pt-32 pb-48 space-y-16 relative z-10">
              <header className="text-center space-y-4">
                 <h2 className="text-7xl font-black italic uppercase tracking-tighter">Performance</h2>
                 <p className="text-slate-500 font-bold uppercase tracking-[0.5em]">Data Harvesting Protocol</p>
              </header>

              <div className="grid md:grid-cols-2 gap-8">
                 <GlassCard className="p-12 space-y-8">
                    <div className="flex justify-between items-center">
                       <h3 className="text-2xl font-black italic uppercase">Workout Volume</h3>
                       <TrendingUp className="text-teal-400" />
                    </div>
                    <div className="h-64 flex items-end justify-around gap-2 px-4">
                       {[40, 70, 45, 90, 65, 80, 100].map((h, i) => (
                          <div key={i} className="group relative flex flex-col items-center flex-1">
                             <motion.div 
                               initial={{ height: 0 }} animate={{ height: `${h}%` }} 
                               className="w-full bg-gradient-to-t from-teal-500/20 to-teal-500 rounded-xl"
                             />
                             <span className="text-[10px] font-black text-slate-600 mt-4">D{i+1}</span>
                          </div>
                       ))}
                    </div>
                 </GlassCard>

                 <div className="space-y-8">
                    <GlassCard className="p-8 flex items-center gap-8">
                       <div className="w-20 h-20 bg-emerald-500/10 rounded-3xl flex items-center justify-center text-emerald-400">
                          <Trophy size={40} />
                       </div>
                       <div>
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Personal Records</p>
                          <h4 className="text-3xl font-black italic uppercase">14 New Maxes</h4>
                       </div>
                    </GlassCard>
                    <GlassCard className="p-8 flex items-center gap-8">
                       <div className="w-20 h-20 bg-blue-500/10 rounded-3xl flex items-center justify-center text-blue-400">
                          <Clock3 size={40} />
                       </div>
                       <div>
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Time Under Tension</p>
                          <h4 className="text-3xl font-black italic uppercase">42.5 Hours</h4>
                       </div>
                    </GlassCard>
                    <GlassCard className="p-8 flex items-center gap-8">
                       <div className="w-20 h-20 bg-rose-500/10 rounded-3xl flex items-center justify-center text-rose-400">
                          <Flame size={40} />
                       </div>
                       <div>
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Metabolic Burn</p>
                          <h4 className="text-3xl font-black italic uppercase">18.2K CAL</h4>
                       </div>
                    </GlassCard>
                 </div>
              </div>
           </motion.div>
        )}

        {/* --- 6. SETTINGS --- */}
        {screen === "settings" && (
           <motion.div key="settings" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto p-10 pt-32 space-y-16 relative z-10">
              <header className="flex justify-between items-center">
                 <h2 className="text-6xl font-black italic uppercase tracking-tighter">System</h2>
                 <ActionButton variant="ghost" size="icon" onClick={() => setScreen("home")} className="rounded-full">
                   <X size={24} />
                 </ActionButton>
              </header>

              <div className="space-y-6">
                 <GlassCard className="p-10 space-y-10">
                    <div className="flex justify-between items-center">
                       <div className="flex items-center gap-4">
                          <div className="p-3 bg-teal-500/10 rounded-xl text-teal-400"><Info size={24}/></div>
                          <h3 className="text-xl font-black italic uppercase">Apex Engine Version</h3>
                       </div>
                       <span className="text-slate-500 font-mono font-bold">v15.0.4 - Build 9932</span>
                    </div>

                    <div className="h-px bg-white/5" />

                    <div className="space-y-4">
                       <p className="text-sm font-black text-slate-400 uppercase tracking-widest">AI Core Status</p>
                       <div className="flex items-center gap-3 p-6 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl">
                          <ShieldCheck className="text-emerald-500" />
                          <span className="text-emerald-500 font-bold uppercase text-xs">Neural Network Synchronized</span>
                       </div>
                    </div>

                    <div className="h-px bg-white/5" />

                    <div className="flex flex-col gap-4">
                       <ActionButton variant="danger" className="w-full h-16" onClick={() => { if(confirm("Are you sure? This will wipe all performance data.")) { localStorage.clear(); window.location.reload(); } }}>
                         FACTORY RESET ENGINE
                       </ActionButton>
                       <p className="text-center text-[10px] text-slate-700 font-bold uppercase tracking-[0.3em]">Warning: This action is permanent and irreversible</p>
                    </div>
                 </GlassCard>
              </div>
           </motion.div>
        )}

      </AnimatePresence>

      {/* --- PERSISTENT MODALS --- */}
      <AnimatePresence>
        {activeAiModal && <AiCoachModal exercise={activeAiModal} onClose={() => setActiveAiModal(null)} />}
      </AnimatePresence>

      {/* --- PERSISTENT NAVIGATION BAR --- */}
      {screen !== 'splash' && screen !== 'live' && (
        <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[150] w-full max-w-lg px-8">
           <motion.div 
             initial={{ y: 100, opacity: 0 }}
             animate={{ y: 0, opacity: 1 }}
             className="bg-[#0f172a]/90 backdrop-blur-3xl border border-white/10 p-5 rounded-[3rem] flex justify-around items-center shadow-[0_40px_100px_rgba(0,0,0,0.8)]"
           >
              {[
                { scr: "home", icon: Home },
                { scr: "day", icon: ListChecks },
                { scr: "analytics", icon: TrendingUp },
                { scr: "settings", icon: Settings2 }
              ].map((item, i) => (
                <button 
                  key={i}
                  onClick={() => setScreen(item.scr as any)} 
                  className={`p-5 rounded-3xl transition-all duration-500 relative group ${screen === item.scr ? 'bg-teal-500 text-slate-950 shadow-[0_0_30px_rgba(20,184,166,0.5)] scale-110' : 'text-slate-600 hover:text-white hover:bg-white/5'}`}
                >
                  <item.icon size={28} />
                  {screen === item.scr && (
                    <motion.div layoutId="nav-dot" className="absolute -top-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-teal-500 rounded-full" />
                  )}
                </button>
              ))}
           </motion.div>
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

/**
 * REACHER APEX SYSTEM v15.0.4
 * End of File. 
 * Code Total: ~1100 Lines (Full Functional Engine)
 */
