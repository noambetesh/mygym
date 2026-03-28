import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { createRoot } from "react-dom/client";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play, Pause, RotateCcw, SkipForward, SkipBack, Dumbbell, Flame, Clock3,
  CheckCircle2, Youtube, TimerReset, Volume2, VolumeX, Home, ListChecks,
  Swords, Trophy, Settings2, Activity, CalendarDays, Weight, Eye,
  Bot, Sparkles, X, Send, MessageCircle, ExternalLink, TrendingUp, RefreshCcw, AlertTriangle, Plus, Zap, Cpu, Target, Music,
  ChevronRight, Info, History, ShieldCheck, ZapOff, ArrowRightLeft, LayoutGrid, List, Search, Save, Trash2, Edit3, User, BarChart3, HeartPulse
} from "lucide-react";

/**
 * REACHER APEX PLATINUM - THE ULTIMATE TRAINING ENGINE
 * Version: 18.0.5 // Final Release for Noam
 * Stability: Redundant // Features: All-In
 */

// --- TYPES & INTERFACES ---
type MuscleGroup = "Back" | "Chest" | "Legs" | "Shoulders" | "Arms" | "Core" | "FullBody";
type Category = "pull" | "push" | "legs" | "armor" | "power" | "core" | "isolation";

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  he: string; 
  work: number;
  rest: number;
  category: Category;
  muscleGroup: MuscleGroup;
  videoUrl: string;
  imageUrl: string;
  difficulty: "Elite" | "Advanced" | "Standard";
}

interface SetRecord {
  weight: number;
  reps: number;
  timestamp: number;
  exerciseId: string;
}

interface WorkoutHistory {
  id: string;
  date: string;
  workoutTitle: string;
  totalVolume: number;
  exercisesCompleted: number;
  duration: number;
}

// --- DATASET: THE COMPLETE REACHER VAULT (80+ EXERCISES) ---

const MASTER_VAULT: Exercise[] = [
  // BACK (15)
  { id: "b1", name: "Meadows Row", sets: 4, reps: "10-12", he: "עמוד בניצב למוט חופשי. אחוז בקצה המוט ביד אחת. שמור על גב מקביל לרצפה ומשוך את המוט לכיוון המותן תוך הוצאת מרפק החוצה. התרגיל בונה עובי משמעותי בגב העליון והלטים.", work: 45, rest: 90, category: "pull", muscleGroup: "Back", videoUrl: "https://www.youtube.com/results?search_query=meadows+row", imageUrl: "https://images.unsplash.com/photo-1603287611837-f2146f5de8e8?q=80&w=800", difficulty: "Advanced" },
  { id: "b2", name: "Weighted Pull-Ups", sets: 4, reps: "6-8", he: "השתמש בחגורת משקולות. אחוז במוט ברוחב כתפיים. משוך את עצמך עד שהסנטר עובר את המוט. התנועה בונה את רוחב הגב ומחזקת את כוח המשיכה הבסיסי.", work: 40, rest: 120, category: "pull", muscleGroup: "Back", videoUrl: "https://www.youtube.com/results?search_query=weighted+pullups", imageUrl: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?q=80&w=800", difficulty: "Elite" },
  { id: "b3", name: "Iliac Lat Pulldown", sets: 3, reps: "12-15", he: "משיכה מצד אחד תוך הטיית הגוף. המטרה היא להביא את המרפק עמוק לכיוון האגן כדי לבודד את סיבי הלטיסימוס התחתונים.", work: 35, rest: 75, category: "pull", muscleGroup: "Back", videoUrl: "https://www.youtube.com/results?search_query=iliac+lat+pulldown", imageUrl: "https://images.unsplash.com/photo-1590239068512-0f3eff9cca18?q=80&w=800", difficulty: "Advanced" },
  { id: "b4", name: "T-Bar Row (Supported)", sets: 3, reps: "10", he: "הצמד את החזה לכרית. אחוז בידיות ומשוך לכיוון השכמות. תרגיל זה מנטרל את הגב התחתון ומאפשר בידוד מוחלט של הגב העליון.", work: 40, rest: 90, category: "pull", muscleGroup: "Back", videoUrl: "https://www.youtube.com/results?search_query=t+bar+row", imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800", difficulty: "Standard" },
  { id: "b5", name: "Rack Pulls", sets: 4, reps: "5-8", he: "משיכת מוט מהכלוב החל מגובה הברך. בונה גב תחתון וזוקפים חזקים כמו בטון. תרגיל ליבה לבניית כוח אבסולוטי.", work: 30, rest: 150, category: "pull", muscleGroup: "Back", videoUrl: "https://www.youtube.com/results?search_query=rack+pulls", imageUrl: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=800", difficulty: "Elite" },
  { id: "b6", name: "Seal Row", sets: 3, reps: "10-12", he: "שכיבה על ספסל מוגבה ומשיכת מוט מלמטה. מנטרל לחלוטין את הרגליים והמומנטום. הדרך הטובה ביותר לבודד את הגב ללא לחץ על עמוד השדרה.", work: 40, rest: 90, category: "pull", muscleGroup: "Back", videoUrl: "https://www.youtube.com/results?search_query=seal+row", imageUrl: "https://images.unsplash.com/photo-1603287611837-f2146f5de8e8?q=80&w=800", difficulty: "Advanced" },
  { id: "b7", name: "Lat Prayer", sets: 3, reps: "15", he: "משיכה עם ידיים ישרות בפולי עליון. תרגיל בידוד מושלם ללטים שמלמד איך להשתמש בגב ללא מעורבות של הבייספס.", work: 35, rest: 60, category: "isolation", muscleGroup: "Back", videoUrl: "https://www.youtube.com/results?search_query=lat+prayer", imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800", difficulty: "Standard" },
  { id: "b8", name: "Pendlay Row", sets: 4, reps: "8", he: "חתירה מתפרצת מהרצפה כאשר הגב מקביל לחלוטין לקרקע. המוט חוזר לרצפה בכל חזרה. בונה כוח מתפרץ ושליטה בשכמות.", work: 45, rest: 120, category: "pull", muscleGroup: "Back", videoUrl: "https://www.youtube.com/results?search_query=pendlay+row", imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800", difficulty: "Elite" },
  { id: "b9", name: "Kroc Rows", sets: 3, reps: "20+", he: "חתירה עם משקולת כבדה מאוד בסטים של חזרות גבוהות. שימוש במומנטום מבוקר. התרגיל בונה אחיזה חזקה וגב עליון רחב.", work: 60, rest: 120, category: "pull", muscleGroup: "Back", videoUrl: "https://www.youtube.com/results?search_query=kroc+row", imageUrl: "https://images.unsplash.com/photo-1603287611837-f2146f5de8e8?q=80&w=800", difficulty: "Elite" },
  { id: "b10", name: "Snatch Grip High Pull", sets: 4, reps: "6", he: "משיכה מהירה של המוט עד גובה החזה באחיזה רחבה מאוד. תרגיל כוח מתפרץ שעובד על הטרפזים והכתפיים האחוריות.", work: 30, rest: 150, category: "power", muscleGroup: "Back", videoUrl: "https://www.youtube.com/results?search_query=high+pull", imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800", difficulty: "Elite" },
  { id: "b11", name: "Incline DB Row", sets: 3, reps: "12", he: "שכיבה על ספסל בשיפוע עם הפנים למטה. משיכת משקולות תוך כדי הצמדת השכמות. מבודד את הגב העליון.", work: 40, rest: 90, category: "pull", muscleGroup: "Back", videoUrl: "https://www.youtube.com/results?search_query=incline+dumbbell+row", imageUrl: "https://images.unsplash.com/photo-1603287611837-f2146f5de8e8?q=80&w=800", difficulty: "Advanced" },
  { id: "b12", name: "Chin-Ups", sets: 3, reps: "10", he: "עליות מתח באחיזה הפוכה וצרה. דגש חזק על הבייספס והלטים התחתונים.", work: 40, rest: 90, category: "pull", muscleGroup: "Back", videoUrl: "https://www.youtube.com/results?search_query=chin+ups", imageUrl: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?q=80&w=800", difficulty: "Standard" },
  { id: "b13", name: "Face Pulls (Back Focus)", sets: 4, reps: "20", he: "משיכה לכיוון המצח עם דגש על פתיחת ידיים רחבה לחיזוק הטרפזים והכתף האחורית.", work: 40, rest: 60, category: "isolation", muscleGroup: "Back", videoUrl: "https://www.youtube.com/results?search_query=face+pulls", imageUrl: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=800", difficulty: "Standard" },
  { id: "b14", name: "Barbell Shrugs", sets: 4, reps: "12-15", he: "הרמת כתפיים כלפי מעלה עם מוט כבד. בונה את עובי הטרפז העליון והצוואר.", work: 35, rest: 90, category: "isolation", muscleGroup: "Back", videoUrl: "https://www.youtube.com/results?search_query=barbell+shrugs", imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800", difficulty: "Advanced" },
  { id: "b15", name: "Superman Holds", sets: 3, reps: "45s", he: "שכיבה על הבטן והרמת ידיים ורגליים באוויר. חיזוק שרירי הזוקפים והגב התחתון בצורה בטוחה.", work: 45, rest: 60, category: "core", muscleGroup: "Back", videoUrl: "https://www.youtube.com/results?search_query=superman+exercise", imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=800", difficulty: "Standard" },

  // CHEST (15)
  { id: "c1", name: "Low-Incline DB Press", sets: 4, reps: "8-10", he: "לחיצת משקולות בשיפוע קל של 15-30 מעלות. השיפוע הנמוך מאפשר גיוס מקסימלי של החזה העליון תוך שמירה על בריאות הכתף.", work: 45, rest: 100, category: "push", muscleGroup: "Chest", videoUrl: "https://www.youtube.com/results?search_query=incline+dumbbell+press", imageUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=800", difficulty: "Advanced" },
  { id: "c2", name: "Weighted Dips", sets: 4, reps: "8-12", he: "מקבילים עם תוספת משקל. הטה את הגוף קדימה כדי להעביר את העומס מהטריספס לחזה התחתון והאמצעי.", work: 40, rest: 100, category: "push", muscleGroup: "Chest", videoUrl: "https://www.youtube.com/results?search_query=weighted+dips", imageUrl: "https://images.unsplash.com/photo-1534367957981-2940263f382a?q=80&w=800", difficulty: "Elite" },
  { id: "c3", name: "Converging Press", sets: 3, reps: "10-12", he: "לחיצה במכונה שבה הידיות מתקרבות אחת לשנייה בשיא התנועה. מאפשר סחיטה מקסימלית של סיבי החזה הפנימיים.", work: 40, rest: 90, category: "push", muscleGroup: "Chest", videoUrl: "https://www.youtube.com/results?search_query=machine+chest+press", imageUrl: "https://images.unsplash.com/photo-1591741535018-d042766c62eb?q=80&w=800", difficulty: "Standard" },
  { id: "c4", name: "Floor Press", sets: 3, reps: "8", he: "לחיצה בשכיבה על הרצפה. עוצר את התנועה ב-90 מעלות במרפקים. מצוין לשיפור כוח הנעילה ומניעת פציעות כתף.", work: 40, rest: 90, category: "push", muscleGroup: "Chest", videoUrl: "https://www.youtube.com/results?search_query=floor+press", imageUrl: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=800", difficulty: "Advanced" },
  { id: "c5", name: "Cable Flyes", sets: 3, reps: "15", he: "משיכת כבלים מלמעלה למטה. מתמקד בחלק התחתון והחיצוני של החזה. שמור על חזה נפוח וכתפיים משוכות לאחור.", work: 35, rest: 60, category: "isolation", muscleGroup: "Chest", videoUrl: "https://www.youtube.com/results?search_query=cable+flyes", imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800", difficulty: "Standard" },
  { id: "c6", name: "Hex Press", sets: 3, reps: "12", he: "הצמד את המשקולות אחת לשנייה לאורך כל הלחיצה. יוצר מתח תמידי בחלק המרכזי של החזה.", work: 35, rest: 75, category: "isolation", muscleGroup: "Chest", videoUrl: "https://www.youtube.com/results?search_query=hex+press", imageUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=800", difficulty: "Standard" },
  { id: "c7", name: "Landmine Press", sets: 3, reps: "10-12", he: "דחיפת המוט קדימה ומעלה בלנדמיין. תנועה אלכסונית שבונה עוצמה בחזה העליון ומורידה עומס מהכתפיים.", work: 40, rest: 90, category: "push", muscleGroup: "Chest", videoUrl: "https://www.youtube.com/results?search_query=landmine+press", imageUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=800", difficulty: "Advanced" },
  { id: "c8", name: "Low-To-High Flyes", sets: 3, reps: "15", he: "משיכת כבלים מלמטה למעלה לכיוון מרכז הפנים. מתמקד בסיבים העליונים והפנימיים של החזה.", work: 35, rest: 60, category: "isolation", muscleGroup: "Chest", videoUrl: "https://www.youtube.com/results?search_query=low+to+high+flyes", imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800", difficulty: "Standard" },
  { id: "c9", name: "Guillotine Press", sets: 3, reps: "8-10", he: "לחיצת חזה כאשר המוט יורד לכיוון הצוואר. תרגיל מתקדם ביותר לבידוד מלא של סיבי החזה העליונים.", work: 45, rest: 100, category: "push", muscleGroup: "Chest", videoUrl: "https://www.youtube.com/results?search_query=guillotine+press", imageUrl: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=800", difficulty: "Elite" },
  { id: "c10", name: "Deficit Push-Ups", sets: 3, reps: "12-15", he: "שכיבות סמיכה עם ידיים על הגבהות. מאפשר טווח תנועה עמוק יותר ומתיחה מקסימלית בתחתית.", work: 45, rest: 75, category: "push", muscleGroup: "Chest", videoUrl: "https://www.youtube.com/results?search_query=deficit+pushups", imageUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=800", difficulty: "Advanced" },
  { id: "c11", name: "Pec Deck Fly", sets: 3, reps: "15", he: "בידוד מושלם של החזה במכונה. התמקד בסחיטה של הידיות אחת לשנייה בשיא התנועה.", work: 35, rest: 60, category: "isolation", muscleGroup: "Chest", videoUrl: "https://www.youtube.com/results?search_query=pec+deck", imageUrl: "https://images.unsplash.com/photo-1591741535018-d042766c62eb?q=80&w=800", difficulty: "Standard" },
  { id: "c12", name: "Dumbbell Pullover", sets: 3, reps: "12", he: "מתיחת משקולת מעבר לראש בשכיבה על ספסל. עובד על החזה והלטים ומרחיב את כלוב הצלעות.", work: 40, rest: 80, category: "isolation", muscleGroup: "Chest", videoUrl: "https://www.youtube.com/results?search_query=dumbbell+pullover", imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800", difficulty: "Standard" },
  { id: "c13", name: "Incline Barbell Press", sets: 4, reps: "6-8", he: "לחיצת מוט בשיפוע חיובי של 30-45 מעלות. בונה את מסת החזה העליון בצורה הבסיסית ביותר.", work: 45, rest: 120, category: "push", muscleGroup: "Chest", videoUrl: "https://www.youtube.com/results?search_query=incline+barbell+press", imageUrl: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=800", difficulty: "Advanced" },
  { id: "c14", name: "Svend Press", sets: 3, reps: "20", he: "הצמדת שתי פלטות משקולת בין הידיים ודחיפה קדימה תוך כיווץ חזק. תרגיל סיום מעולה להזרמת דם.", work: 30, rest: 45, category: "isolation", muscleGroup: "Chest", videoUrl: "https://www.youtube.com/results?search_query=svend+press", imageUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=800", difficulty: "Standard" },
  { id: "c15", name: "Decline Bench Press", sets: 3, reps: "10", he: "לחיצת מוט בשיפוע שלילי. מתמקד בחלק התחתון של החזה ומאפשר הרמת משקלים גבוהים יותר.", work: 45, rest: 90, category: "push", muscleGroup: "Chest", videoUrl: "https://www.youtube.com/results?search_query=decline+bench+press", imageUrl: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=800", difficulty: "Advanced" },

  // LEGS (15)
  { id: "l1", name: "Zercher Squat", sets: 4, reps: "8-10", he: "החזק את המוט בעיקולי המרפקים מול החזה. רד עמוק. התרגיל דורש יציבות ליבה מטורפת ובונה רגליים של לוחם.", work: 50, rest: 150, category: "legs", muscleGroup: "Legs", videoUrl: "https://www.youtube.com/results?search_query=zercher+squat", imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800", difficulty: "Elite" },
  { id: "l2", name: "Bulgarian Split Squat", sets: 3, reps: "10/leg", he: "רגל אחת על ספסל. רד עד שהברך האחורית נוגעת ברצפה. התרגיל הכי אפקטיבי לבניית קוואדס ויציבות.", work: 45, rest: 90, category: "legs", muscleGroup: "Legs", videoUrl: "https://www.youtube.com/results?search_query=bulgarian+split+squat", imageUrl: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=800", difficulty: "Advanced" },
  { id: "l3", name: "Romanian Deadlift", sets: 4, reps: "10-12", he: "מוט צמוד לרגליים, גב ישר, מתיחה מקסימלית של ההמסטרינג. בונה את כל השרשרת האחורית.", work: 45, rest: 100, category: "legs", muscleGroup: "Legs", videoUrl: "https://www.youtube.com/results?search_query=romanian+deadlift", imageUrl: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=800", difficulty: "Advanced" },
  { id: "l4", name: "Nordic Hamstring Curl", sets: 3, reps: "5-8", he: "בלום את עצמך בירידה איטית לכיוון הרצפה רק בעזרת הרגליים. המלך של תרגילי ההמסטרינג למניעת פציעות.", work: 30, rest: 120, category: "legs", muscleGroup: "Legs", videoUrl: "https://www.youtube.com/results?search_query=nordic+curl", imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800", difficulty: "Elite" },
  { id: "l5", name: "Kas Glute Bridge", sets: 3, reps: "12-15", he: "טווח תנועה קטן וממוקד לישבן על ספסל. סחיטה חזקה בשיא התנועה.", work: 40, rest: 90, category: "legs", muscleGroup: "Legs", videoUrl: "https://www.youtube.com/results?search_query=kas+glute+bridge", imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=800", difficulty: "Standard" },
  { id: "l6", name: "Leg Press (High Foot)", sets: 4, reps: "12-15", he: "הנח את הרגליים בחלק העליון של הפלטה. דחיפה מהעקבים. מעביר את הדגש מהקוואדס לישבן ולהמסטרינג.", work: 45, rest: 90, category: "legs", muscleGroup: "Legs", videoUrl: "https://www.youtube.com/results?search_query=high+foot+leg+press", imageUrl: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=800", difficulty: "Standard" },
  { id: "l7", name: "Seated Leg Curls", sets: 3, reps: "15", he: "שב עם גב צמוד למשענת. כווץ את ההמסטרינג עד הסוף ושחרר לאט. בידוד מושלם לירך האחורי.", work: 35, rest: 60, category: "isolation", muscleGroup: "Legs", videoUrl: "https://www.youtube.com/results?search_query=seated+leg+curl", imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800", difficulty: "Standard" },
  { id: "l8", name: "Walking Lunges", sets: 3, reps: "20 Steps", he: "צעדים גדולים קדימה עם משקולות. בונה כוח דינמי וסיבולת שריר גבוהה ברגליים.", work: 60, rest: 90, category: "legs", muscleGroup: "Legs", videoUrl: "https://www.youtube.com/results?search_query=walking+lunges", imageUrl: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=800", difficulty: "Advanced" },
  { id: "l9", name: "Cyclist Squat", sets: 3, reps: "15", he: "עמוד עם עקבים מוגבהים. ירידה עמוקה מאוד. מיקוד אגרסיבי בקוואדס (VMO).", work: 40, rest: 75, category: "legs", muscleGroup: "Legs", videoUrl: "https://www.youtube.com/results?search_query=cyclist+squat", imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800", difficulty: "Advanced" },
  { id: "l10", name: "Stiff-Legged Deadlift", sets: 4, reps: "8-10", he: "מוט יורד לאט קרוב לרגליים עם ברכיים ישרות. דגש על מתיחה מקסימלית של ההמסטרינג והזוקפים.", work: 45, rest: 120, category: "pull", muscleGroup: "Legs", videoUrl: "https://www.youtube.com/results?search_query=stiff+legged+deadlift", imageUrl: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=800", difficulty: "Elite" },
  { id: "l11", name: "Standing Calf Raises", sets: 4, reps: "15-20", he: "עלייה על קצות האצבעות עם משקל כבד. סחיטה בשיא הכיווץ ומתיחה מלאה בתחתית.", work: 30, rest: 60, category: "isolation", muscleGroup: "Legs", videoUrl: "https://www.youtube.com/results?search_query=calf+raises", imageUrl: "https://images.unsplash.com/photo-1434682881908-b43d0467b798?q=80&w=800", difficulty: "Standard" },
  { id: "l12", name: "Heavy Sled Push", sets: 4, reps: "20m", he: "דחיפת מזחלת כבדה בצעדים קטנים וחזקים. תרגיל כוח מתפרץ וסיבולת לב-ריאה מהקשים ביותר.", work: 60, rest: 120, category: "power", muscleGroup: "Legs", videoUrl: "https://www.youtube.com/results?search_query=sled+push", imageUrl: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=800", difficulty: "Elite" },
  { id: "l13", name: "Box Squat", sets: 4, reps: "6-8", he: "סקוואט עד לישיבה מלאה על קופסה ועצירה. מבטל את ה-Stretch Reflex ומאלץ את הגוף לייצר כוח נקי.", work: 45, rest: 150, category: "legs", muscleGroup: "Legs", videoUrl: "https://www.youtube.com/results?search_query=box+squat", imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800", difficulty: "Advanced" },
  { id: "l14", name: "High Box Step-Ups", sets: 3, reps: "10/leg", he: "עלייה על קופסה גבוהה מאוד עם רגל אחת. דגש על דחיפה דרך העקב. כוח חד-צדדי.", work: 45, rest: 90, category: "legs", muscleGroup: "Legs", videoUrl: "https://www.youtube.com/results?search_query=step+ups", imageUrl: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=800", difficulty: "Standard" },
  { id: "l15", name: "Leg Extensions", sets: 3, reps: "15-20", he: "בידוד מושלם לקוואדס במכונה. התמקד בנעילה מלאה של הברכיים ושליטה בירידה.", work: 30, rest: 60, category: "isolation", muscleGroup: "Legs", videoUrl: "https://www.youtube.com/results?search_query=leg+extensions", imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800", difficulty: "Standard" },

  // ARMS (15)
  { id: "a1", name: "Bayesian Cable Curls", sets: 3, reps: "12-15", he: "כפיפת מרפקים כשהגב לכבל. מתיחה עצומה של הראש הארוך של הבייספס.", work: 35, rest: 60, category: "isolation", muscleGroup: "Arms", videoUrl: "https://www.youtube.com/results?search_query=bayesian+curls", imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800", difficulty: "Advanced" },
  { id: "a2", name: "Katana Extension", sets: 3, reps: "12-15", he: "פשיטת מרפקים מעבר לראש עם כבל. המתיחה האידיאלית לראש הארוך של הטריספס.", work: 35, rest: 60, category: "isolation", muscleGroup: "Arms", videoUrl: "https://www.youtube.com/results?search_query=katana+extension", imageUrl: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=800", difficulty: "Advanced" },
  { id: "a3", name: "Hammer Curls", sets: 3, reps: "12", he: "כפיפה עם אחיזה ניטרלית. בונה את שריר הברכיאליס ואת האמות. נותן מראה עבה לזרוע.", work: 35, rest: 75, category: "isolation", muscleGroup: "Arms", videoUrl: "https://www.youtube.com/results?search_query=hammer+curls", imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800", difficulty: "Standard" },
  { id: "a4", name: "Close-Grip Bench", sets: 4, reps: "8", he: "לחיצת חזה באחיזה צרה. מעביר את רוב העומס לטריספס. בונה כוח בסיסי עצום בזרועות.", work: 45, rest: 100, category: "push", muscleGroup: "Arms", videoUrl: "https://www.youtube.com/results?search_query=close+grip+bench", imageUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=800", difficulty: "Advanced" },
  { id: "a5", name: "Preacher Curls", sets: 3, reps: "12", he: "כפיפה על ספסל פריצ'ר. מונע שימוש במומנטום ומבודד את הבייספס בצורה הכי נקייה.", work: 35, rest: 75, category: "isolation", muscleGroup: "Arms", videoUrl: "https://www.youtube.com/results?search_query=preacher+curls", imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800", difficulty: "Standard" },
  { id: "a6", name: "Skull Crushers", sets: 3, reps: "10-12", he: "שכיבה על ספסל, הורדת המוט למצח ופשיטה למעלה. מלך התרגילים לטריספס.", work: 40, rest: 90, category: "isolation", muscleGroup: "Arms", videoUrl: "https://www.youtube.com/results?search_query=skull+crushers", imageUrl: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=800", difficulty: "Advanced" },
  { id: "a7", name: "Spider Curls", sets: 3, reps: "12", he: "שכיבה עם החזה על ספסל בשיפוע, ידיים תלויות למטה. בידוד מושלם ללא תנופה.", work: 35, rest: 75, category: "isolation", muscleGroup: "Arms", videoUrl: "https://www.youtube.com/results?search_query=spider+curls", imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800", difficulty: "Advanced" },
  { id: "a8", name: "Rope Pushdowns", sets: 4, reps: "15", he: "לחיצת חבל למטה. פתח את החבל בסוף התנועה לסחיטה מקסימלית.", work: 30, rest: 60, category: "isolation", muscleGroup: "Arms", videoUrl: "https://www.youtube.com/results?search_query=rope+pushdown", imageUrl: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=800", difficulty: "Standard" },
  { id: "a9", name: "Concentration Curls", sets: 3, reps: "12-15", he: "ביצוע כפיפה בישיבה כאשר המרפק נתמך בירך. בונה את שיא השריר (The Peak).", work: 30, rest: 60, category: "isolation", muscleGroup: "Arms", videoUrl: "https://www.youtube.com/results?search_query=concentration+curls", imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800", difficulty: "Standard" },
  { id: "a10", name: "Reverse Barbell Curl", sets: 3, reps: "12", he: "כפיפה באחיזה הפוכה. עובד חזק על הברכיאליס ועל האמות. חיוני למראה זרוע עבה.", work: 35, rest: 75, category: "isolation", muscleGroup: "Arms", videoUrl: "https://www.youtube.com/results?search_query=reverse+curls", imageUrl: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=800", difficulty: "Standard" },
  { id: "a11", name: "French Press", sets: 3, reps: "10-12", he: "פשיטת מרפקים מעבר לראש עם משקולת בודדת. בונה את הראש הארוך של הטריספס.", work: 40, rest: 90, category: "isolation", muscleGroup: "Arms", videoUrl: "https://www.youtube.com/results?search_query=french+press", imageUrl: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=800", difficulty: "Advanced" },
  { id: "a12", name: "Diamond Push-Ups", sets: 3, reps: "Max", he: "שכיבות סמיכה כאשר הידיים צמודות בצורת יהלום. תרגיל משקל גוף מעולה לסיום.", work: 40, rest: 60, category: "push", muscleGroup: "Arms", videoUrl: "https://www.youtube.com/results?search_query=diamond+push+ups", imageUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=800", difficulty: "Advanced" },
  { id: "a13", name: "Zottman Curls", sets: 3, reps: "12", he: "עלייה כבייספס רגיל, ירידה עם ידיים הפוכות. בונה כוח אחיזה וזרועות עוצמתיות.", work: 35, rest: 75, category: "isolation", muscleGroup: "Arms", videoUrl: "https://www.youtube.com/results?search_query=zottman+curls", imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800", difficulty: "Advanced" },
  { id: "a14", name: "Cross-Body Hammer Curl", sets: 3, reps: "12/side", he: "כפיפת משקולת לרוחב הגוף לכיוון הכתף הנגדית. מדגיש את הראש הצידי של הבייספס.", work: 35, rest: 60, category: "isolation", muscleGroup: "Arms", videoUrl: "https://www.youtube.com/results?search_query=cross+body+hammer+curl", imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800", difficulty: "Standard" },
  { id: "a15", name: "Dips (Tricep Focus)", sets: 3, reps: "Max", he: "מקבילים עם גוף זקוף ומרפקים צמודים. מעביר את כל העומס לטריספס.", work: 40, rest: 90, category: "push", muscleGroup: "Arms", videoUrl: "https://www.youtube.com/results?search_query=tricep+dips", imageUrl: "https://images.unsplash.com/photo-1534367957981-2940263f382a?q=80&w=800", difficulty: "Advanced" },

  // SHOULDERS (15)
  { id: "s1", name: "Z-Press", sets: 4, reps: "8-10", he: "לחיצת כתפיים בישיבה על הרצפה עם רגליים ישרות. מנטרל את הרגליים ומאלץ את הכתפיים והבטן לעבוד ב-100%.", work: 45, rest: 120, category: "armor", muscleGroup: "Shoulders", videoUrl: "https://www.youtube.com/results?search_query=z+press", imageUrl: "https://images.unsplash.com/photo-1591741535018-d042766c62eb?q=80&w=800", difficulty: "Elite" },
  { id: "s2", name: "Lu Raises", sets: 3, reps: "15", he: "הרמה צידית מלאה עד שהידיים נפגשות מעל הראש. בונה ניידות בכתפיים ומכסה את כל טווח התנועה של הדלתואיד.", work: 35, rest: 75, category: "armor", muscleGroup: "Shoulders", videoUrl: "https://www.youtube.com/results?search_query=lu+raises", imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800", difficulty: "Advanced" },
  { id: "s3", name: "Face Pulls", sets: 4, reps: "20", he: "משיכת חבל לכיוון המצח עם סיבוב חיצוני של הכתף. התרגיל הכי חשוב ליציבה ובריאות הכתף האחורית.", work: 40, rest: 60, category: "armor", muscleGroup: "Shoulders", videoUrl: "https://www.youtube.com/results?search_query=face+pulls", imageUrl: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=800", difficulty: "Standard" },
  { id: "s4", name: "Arnold Press", sets: 3, reps: "10", he: "לחיצה עם סיבוב של הידיים מחזית הגוף כלפי חוץ ומעלה. עובד על כל שלושת ראשי הכתף.", work: 45, rest: 90, category: "armor", muscleGroup: "Shoulders", videoUrl: "https://www.youtube.com/results?search_query=arnold+press", imageUrl: "https://images.unsplash.com/photo-1591741535018-d042766c62eb?q=80&w=800", difficulty: "Advanced" },
  { id: "s5", name: "Cable Lateral Raises", sets: 4, reps: "15", he: "הרמה צידית עם כבל מאחורי הגוף. שומר על מתח תמידי לאורך כל טווח התנועה. בונה רוחב.", work: 35, rest: 60, category: "isolation", muscleGroup: "Shoulders", videoUrl: "https://www.youtube.com/results?search_query=cable+lateral+raises", imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800", difficulty: "Standard" },
  { id: "s6", name: "Rear Delt Row", sets: 3, reps: "12-15", he: "חתירה כאשר המרפקים מצביעים החוצה. מיקוד בכתף האחורית ובשרירי השכמות העליונים.", work: 40, rest: 75, category: "armor", muscleGroup: "Shoulders", videoUrl: "https://www.youtube.com/results?search_query=rear+delt+row", imageUrl: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=800", difficulty: "Standard" },
  { id: "s7", name: "Push Press", sets: 4, reps: "6", he: "לחיצת כתפיים עם עזרה קלה מהרגליים. דגש על כוח מתפרץ בעלייה ושליטה בירידה.", work: 40, rest: 150, category: "power", muscleGroup: "Shoulders", videoUrl: "https://www.youtube.com/results?search_query=push+press", imageUrl: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=800", difficulty: "Elite" },
  { id: "s8", name: "Dumbbell Shrugs", sets: 4, reps: "12", he: "הרמת כתפיים כלפי מעלה עם משקולות כבדות. החזקה בשיא הכיווץ. בונה טרפזים עוצמתיים.", work: 35, rest: 90, category: "armor", muscleGroup: "Shoulders", videoUrl: "https://www.youtube.com/results?search_query=dumbbell+shrugs", imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800", difficulty: "Advanced" },
  { id: "s9", name: "Front Plate Raises", sets: 3, reps: "15", he: "הרמת פלטה מלפנים עד גובה העיניים. עבודה ממוקדת על הכתף הקדמית.", work: 35, rest: 60, category: "isolation", muscleGroup: "Shoulders", videoUrl: "https://www.youtube.com/results?search_query=plate+front+raises", imageUrl: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=800", difficulty: "Standard" },
  { id: "s10", name: "Y-Raises", sets: 3, reps: "15", he: "הרמת ידיים לצורת Y בשיפוע. מחזק את הטרפזים התחתונים ואת הכתף האחורית.", work: 35, rest: 60, category: "isolation", muscleGroup: "Shoulders", videoUrl: "https://www.youtube.com/results?search_query=y+raises", imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800", difficulty: "Standard" },
  { id: "s11", name: "Bus Drivers", sets: 3, reps: "45s", he: "החזקת פלטה מול החזה וסיבוב ימינה ושמאלה. בונה סיבולת בכתף הקדמית.", work: 45, rest: 60, category: "isolation", muscleGroup: "Shoulders", videoUrl: "https://www.youtube.com/results?search_query=bus+drivers", imageUrl: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=800", difficulty: "Standard" },
  { id: "s12", name: "W-Raises", sets: 3, reps: "15", he: "הרמת משקולות תוך סיבוב חיצוני לצורת W. מחזק את מסובבי הכתף (Rotator Cuff).", work: 35, rest: 60, category: "isolation", muscleGroup: "Shoulders", videoUrl: "https://www.youtube.com/results?search_query=w+raises", imageUrl: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=800", difficulty: "Standard" },
  { id: "s13", name: "Single-Arm Cable Lateral", sets: 3, reps: "15", he: "הרמה צידית עם כבל יד אחת בכל פעם. מאפשר בידוד עמוק ומתח קבוע.", work: 35, rest: 60, category: "isolation", muscleGroup: "Shoulders", videoUrl: "https://www.youtube.com/results?search_query=one+arm+cable+lateral+raise", imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800", difficulty: "Standard" },
  { id: "s14", name: "Bradford Press", sets: 3, reps: "12", he: "לחיצת מוט מלפנים ומאחורי הראש לסירוגין ללא נעילה. יוצר מתח תמידי בכתפיים.", work: 45, rest: 90, category: "armor", muscleGroup: "Shoulders", videoUrl: "https://www.youtube.com/results?search_query=bradford+press", imageUrl: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=800", difficulty: "Advanced" },
  { id: "s15", name: "Barbell Upright Row", sets: 3, reps: "12", he: "משיכת מוט קרוב לגוף עד גובה החזה. בונה את הראש הצידי של הכתף והטרפזים.", work: 40, rest: 90, category: "armor", muscleGroup: "Shoulders", videoUrl: "https://www.youtube.com/results?search_query=upright+row", imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800", difficulty: "Advanced" },

  // CORE & FULL BODY (10)
  { id: "cr1", name: "Dragon Flags", sets: 3, reps: "5-8", he: "הרמת כל הגוף כיחידה אחת בשכיבה על ספסל והורדה איטית. תנועה מתקדמת ביותר לשליטה בבטן.", work: 40, rest: 90, category: "core", muscleGroup: "Core", videoUrl: "https://www.youtube.com/results?search_query=dragon+flags", imageUrl: "https://images.unsplash.com/photo-1599058917233-57c0e6244a4d?q=80&w=800", difficulty: "Elite" },
  { id: "cr2", name: "Hanging Leg Raises", sets: 4, reps: "15", he: "תלייה על מוט והרמת רגליים ישרות. עובד חזק על הבטן התחתונה ועל שרירי הליבה העמוקים.", work: 40, rest: 60, category: "core", muscleGroup: "Core", videoUrl: "https://www.youtube.com/results?search_query=hanging+leg+raises", imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=800", difficulty: "Advanced" },
  { id: "cr3", name: "Ab Wheel Rollouts", sets: 3, reps: "12", he: "גלישה קדימה עם גלגל בטן. התרגיל הכי קשוח לבניית קיר בטן חזק ויציב.", work: 40, rest: 90, category: "core", muscleGroup: "Core", videoUrl: "https://www.youtube.com/results?search_query=ab+wheel", imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=800", difficulty: "Elite" },
  { id: "f1", name: "Landmine Thrusters", sets: 4, reps: "10", he: "סקוואט ודחיפה של המוט מעל הראש בתנועה אחת. בונה כוח מתפרץ בכל הגוף.", work: 60, rest: 120, category: "power", muscleGroup: "FullBody", videoUrl: "https://www.youtube.com/results?search_query=landmine+thrusters", imageUrl: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=800", difficulty: "Advanced" },
  { id: "f2", name: "Farmer's Walk", sets: 3, reps: "40m", he: "הליכה עם משקולות כבדות מאוד. בונה אחיזה, גב עליון ויציבות ליבה אדירה.", work: 45, rest: 120, category: "power", muscleGroup: "FullBody", videoUrl: "https://www.youtube.com/results?search_query=farmers+walk", imageUrl: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=800", difficulty: "Elite" },
  { id: "f3", name: "Medicine Ball Slams", sets: 3, reps: "15", he: "הטחת כדור כוח ברצפה בכל הכוח. תרגיל מעולה לשריפת קלוריות וכוח מתפרץ.", work: 30, rest: 60, category: "power", muscleGroup: "FullBody", videoUrl: "https://www.youtube.com/results?search_query=ball+slams", imageUrl: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=800", difficulty: "Standard" },
  { id: "f4", name: "Turkish Get-Up", sets: 3, reps: "5/side", he: "מעבר משכיבה לעמידה מלאה עם משקולת מעל הראש. שיא היציבות והקואורדינציה.", work: 90, rest: 90, category: "power", muscleGroup: "FullBody", videoUrl: "https://www.youtube.com/results?search_query=turkish+get+up", imageUrl: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=800", difficulty: "Elite" },
  { id: "f5", name: "Kettlebell Swings", sets: 4, reps: "20", he: "הנפת קטלבל בעזרת כוח הירכיים. בונה כוח בשרשרת האחורית וסיבולת גבוהה.", work: 45, rest: 60, category: "power", muscleGroup: "FullBody", videoUrl: "https://www.youtube.com/results?search_query=kettlebell+swings", imageUrl: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=800", difficulty: "Standard" },
  { id: "f6", name: "Wall Balls", sets: 3, reps: "20", he: "סקוואט וזריקת כדור כוח גבוה על הקיר. תרגיל קרוספיט קלאסי לסיבולת וכוח.", work: 45, rest: 75, category: "power", muscleGroup: "FullBody", videoUrl: "https://www.youtube.com/results?search_query=wall+balls", imageUrl: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=800", difficulty: "Standard" },
  { id: "f7", name: "Renegade Rows", sets: 3, reps: "10/side", he: "חתירה במצב פלאנק. דורש יציבות ליבה מטורפת יחד עם כוח משיכה.", work: 50, rest: 90, category: "power", muscleGroup: "FullBody", videoUrl: "https://www.youtube.com/results?search_query=renegade+row", imageUrl: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=800", difficulty: "Advanced" }
];

// --- APP DATA & CONSTANTS ---

const muscleHebrew: Record<string, string> = {
  Back: "גב", Chest: "חזה", Legs: "רגליים", Shoulders: "כתפיים", Arms: "ידיים", Core: "ליבה", FullBody: "כל הגוף"
};

const categoryHebrew: Record<string, string> = {
  pull: "משיכה", push: "דחיפה", legs: "רגליים", armor: "שריון", power: "כוח", core: "ליבה", isolation: "בידוד"
};

const muscleGroupImages: Record<MuscleGroup, string> = {
  Back: "https://images.unsplash.com/photo-1603287611837-f2146f5de8e8?q=80&w=800",
  Chest: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=800",
  Legs: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800",
  Shoulders: "https://images.unsplash.com/photo-1591741535018-d042766c62eb?q=80&w=800",
  Arms: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=800",
  Core: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=800",
  FullBody: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=800"
};

const AI_TIPS = [
  "נועם, שמור על גב ישר. הליבה היא הבסיס לכל תנועה כבדה.",
  "אל תשכח לנשום. הוצא אוויר במאמץ והכנס אוויר במתיחה.",
  "זמן המנוחה הוא קדוש. תן לשריר להתאושש כדי להפציץ בסט הבא.",
  "הטכניקה חשובה מהמשקל. שליטה אבסולוטית בונה שריר איכותי.",
  "תרגיש את השריר עובד. חיבור מוח-שריר הוא המפתח לשינוי.",
  "אם זה היה קל, זה לא היה משנה אותך. תן הכל!",
  "הירידה צריכה להיות איטית ובשליטה. שם קורית רוב הבנייה.",
  "נועם, אתה בונה פה שריון. כל חזרה מקרבת אותך ליעד."
];

// --- UI COMPONENTS ---

const ApexCard = ({ children, className, onClick }: any) => (
  <motion.div 
    whileHover={onClick ? { scale: 1.01, borderColor: "rgba(20, 184, 166, 0.4)" } : {}}
    onClick={onClick}
    className={`bg-slate-900/60 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] overflow-hidden transition-all duration-300 ${className || ''}`}
  >
    {children}
  </motion.div>
);

const ApexButton = React.forwardRef(({ className, variant = 'default', size = 'default', children, ...props }: any, ref: any) => {
  const base = "inline-flex items-center justify-center font-black transition-all active:scale-95 disabled:opacity-50 cursor-pointer select-none";
  const variants: any = { 
    default: "bg-teal-500 text-slate-950 hover:bg-teal-400 shadow-[0_0_20px_rgba(20,184,166,0.3)]", 
    outline: "border border-white/10 bg-white/5 hover:bg-white/10 text-white/90",
    ghost: "bg-transparent text-white/40 hover:text-white hover:bg-white/5",
    danger: "bg-rose-600 text-white shadow-[0_0_20px_rgba(225,29,72,0.3)]",
    premium: "bg-gradient-to-r from-teal-500 to-indigo-600 text-white shadow-xl"
  };
  const sizes: any = { 
    default: "h-14 px-8 rounded-2xl text-sm", 
    sm: "h-10 px-4 rounded-xl text-[10px]", 
    lg: "h-20 px-12 rounded-3xl text-xl", 
    icon: "h-12 w-12 rounded-xl" 
  };
  return <button ref={ref} className={`${base} ${variants[variant]} ${sizes[size]} ${className || ''}`} {...props}>{children}</button>;
});

const ApexBadge = ({ children, variant = "default" }: any) => {
  const styles: any = { 
    default: "bg-white/5 text-white/50 border-white/5", 
    teal: "bg-teal-500/10 text-teal-400 border-teal-500/20",
    elite: "bg-rose-500/10 text-rose-400 border-rose-500/20 animate-pulse"
  };
  return <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${styles[variant]}`}>{children}</div>;
};

// --- HELPER COMPONENTS ---

function SwapModal({ currentEx, onSwap, onClose }: { currentEx: Exercise, onSwap: (e: Exercise) => void, onClose: () => void }) {
  const alts = useMemo(() => MASTER_VAULT.filter(e => e.muscleGroup === currentEx.muscleGroup && e.id !== currentEx.id), [currentEx]);
  return (
    <div className="fixed inset-0 z-[500] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-6">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-slate-900 border border-white/10 w-full max-w-4xl rounded-[3rem] overflow-hidden">
        <div className="p-8 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-3xl font-black italic uppercase">SWAP PROTOCOL</h3>
            <ApexButton variant="ghost" size="icon" onClick={onClose}><X/></ApexButton>
          </div>
          <div className="grid md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto pr-2">
            {alts.map(ex => (
              <ApexCard key={ex.id} className="p-4 flex items-center gap-4 cursor-pointer hover:bg-white/5" onClick={() => { onSwap(ex); onClose(); }}>
                <img src={ex.imageUrl} className="w-16 h-16 rounded-xl object-cover" />
                <div className="text-right">
                  <h4 className="font-black italic text-lg">{ex.name}</h4>
                  <p className="text-[10px] text-slate-500 font-bold uppercase">{ex.difficulty}</p>
                </div>
              </ApexCard>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// --- MAIN APPLICATION CORE ---

function ReacherApp() {
  // Navigation
  const [screen, setScreen] = useState<"splash" | "main">("splash");
  const [tab, setTab] = useState<"dashboard" | "vault" | "analytics" | "settings">("dashboard");
  const [catalogFilter, setCatalogFilter] = useState<MuscleGroup | "All">("All");

  // Workout Session
  const [sessionList, setSessionList] = useState<Exercise[]>([]);
  const [inSession, setInSession] = useState(false);
  const [curExIdx, setCurExIdx] = useState(0);
  const [curSet, setCurSet] = useState(1);
  const [phase, setPhase] = useState<"work" | "rest">("work");
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [tip, setTip] = useState(AI_TIPS[0]);
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");
  const [showSwap, setShowSwap] = useState(false);

  // Stats & History
  const [logs, setLogs] = useState<SetRecord[]>(() => JSON.parse(localStorage.getItem("reacher_logs_v18") || "[]"));
  const [history, setHistory] = useState<WorkoutHistory[]>(() => JSON.parse(localStorage.getItem("reacher_hist_v18") || "[]"));

  const audioCtx = useRef<AudioContext | null>(null);

  // Persistence
  useEffect(() => localStorage.setItem("reacher_logs_v18", JSON.stringify(logs)), [logs]);
  useEffect(() => localStorage.setItem("reacher_hist_v18", JSON.stringify(history)), [history]);

  // Audio Engine
  const playSound = (freq: number) => {
    if (!audioCtx.current) audioCtx.current = new AudioContext();
    const osc = audioCtx.current.createOscillator();
    const g = audioCtx.current.createGain();
    osc.connect(g); g.connect(audioCtx.current.destination);
    osc.frequency.value = freq;
    g.gain.setValueAtTime(0.1, audioCtx.current.currentTime);
    g.gain.exponentialRampToValueAtTime(0.01, audioCtx.current.currentTime + 0.4);
    osc.start(); osc.stop(audioCtx.current.currentTime + 0.4);
  };

  // Timer Logic
  useEffect(() => {
    let t: any;
    if (isRunning && timer > 0) {
      t = setInterval(() => setTimer(v => v - 1), 1000);
    } else if (isRunning && timer === 0) {
      handleStep();
    }
    return () => clearInterval(t);
  }, [isRunning, timer]);

  const handleStep = () => {
    const ex = sessionList[curExIdx];
    playSound(phase === "work" ? 500 : 1000);
    if (phase === "work") {
      setPhase("rest"); setTimer(ex.rest);
      setTip(AI_TIPS[Math.floor(Math.random() * AI_TIPS.length)]);
    } else {
      if (curSet < ex.sets) {
        setCurSet(s => s + 1); setPhase("work"); setTimer(ex.work);
      } else if (curExIdx + 1 < sessionList.length) {
        setCurExIdx(i => i + 1); setCurSet(1); setPhase("work"); setTimer(sessionList[curExIdx+1].work);
      } else {
        finishWorkout();
      }
    }
  };

  const finishWorkout = () => {
    const newHist: WorkoutHistory = {
      id: Math.random().toString(36),
      date: new Date().toLocaleDateString('he-IL'),
      workoutTitle: "Custom Apex Protocol",
      totalVolume: logs.slice(-10).reduce((a, b) => a + (b.weight * b.reps), 0),
      exercisesCompleted: sessionList.length,
      duration: 0
    };
    setHistory(p => [newHist, ...p]);
    setInSession(false); setSessionList([]); setIsRunning(false);
    alert("אימון הושלם! כל הכבוד נועם.");
  };

  const logSet = () => {
    const rec: SetRecord = { 
      weight: parseInt(weight) || 0, 
      reps: parseInt(reps) || 0, 
      timestamp: Date.now(), 
      exerciseId: sessionList[curExIdx].id 
    };
    setLogs(p => [...p, rec]); setWeight(""); setReps("");
    playSound(800);
  };

  // UI RENDERERS

  if (screen === "splash") {
    return (
      <div className="fixed inset-0 bg-slate-950 flex flex-col items-center justify-center p-10 text-center overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img src={REACHER_HERO} className="w-full h-full object-cover grayscale blur-sm" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
        </div>
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="relative z-10 space-y-12">
           <div className="flex flex-col items-center gap-4">
              <div className="w-24 h-24 bg-teal-500 rounded-[2rem] flex items-center justify-center shadow-2xl">
                <Swords size={48} className="text-slate-950" />
              </div>
              <p className="text-teal-400 font-mono text-[10px] uppercase tracking-[0.5em]"><Cpu size={14} className="inline mr-2"/>PLATINUM ENGINE v18.0</p>
           </div>
           <h1 className="text-8xl md:text-[11rem] font-black italic tracking-tighter uppercase leading-[0.75] text-white">REACHER<br/><span className="text-teal-500">APEX</span></h1>
           <ApexButton size="lg" className="px-24" onClick={() => setScreen("main")}>INITIALIZE</ApexButton>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans selection:bg-teal-500/30 overflow-x-hidden" dir="rtl">
      
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-full h-full bg-teal-500/5 blur-[120px] rounded-full" />
      </div>

      <AnimatePresence>
        {!inSession ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative z-10 max-w-7xl mx-auto p-6 pt-12 pb-48 space-y-16">
            
            {/* Header */}
            <header className="flex justify-between items-end px-4">
               <div className="space-y-1">
                  <h2 className="text-5xl font-black italic uppercase tracking-tighter leading-none">COMMAND<br/>CENTER</h2>
                  <div className="flex items-center gap-2 text-teal-500 font-black uppercase text-[10px] tracking-widest">
                     <div className="w-2 h-2 bg-teal-500 rounded-full animate-ping" /> OPERATIONAL
                  </div>
               </div>
               <div className="flex gap-3">
                  <ApexButton variant="outline" size="icon" onClick={() => window.open('spotify://', '_blank')}><Music size={22}/></ApexButton>
                  <ApexButton variant="outline" size="icon" onClick={() => setTab("settings")}><Settings2 size={24}/></ApexButton>
               </div>
            </header>

            {/* Dashboard Navigation Tabs */}
            <div className="flex bg-slate-900/80 p-2 rounded-[2rem] w-full max-w-lg mx-auto border border-white/5 backdrop-blur-3xl shadow-2xl">
               {[
                 { id: "dashboard", label: "לוח בקרה", icon: Home },
                 { id: "vault", label: "מאגר", icon: LayoutGrid },
                 { id: "analytics", label: "מדדים", icon: BarChart3 }
               ].map(t => (
                 <button 
                  key={t.id} onClick={() => setTab(t.id as any)}
                  className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest transition-all ${tab === t.id ? 'bg-white text-slate-950 shadow-xl' : 'text-slate-500 hover:text-white'}`}
                 >
                   <t.icon size={16}/> {t.label}
                 </button>
               ))}
            </div>

            {/* --- DASHBOARD VIEW --- */}
            {tab === "dashboard" && (
              <div className="space-y-12">
                 {/* Stats */}
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {[
                      { label: "אימונים", val: history.length, icon: Activity, col: "text-teal-400" },
                      { label: "שיאי כוח", val: "14", icon: Trophy, col: "text-amber-400" },
                      { label: "נפח שבועי", val: "18K", icon: Weight, col: "text-blue-400" },
                      { label: "דופק מטרה", val: "165", icon: HeartPulse, col: "text-rose-400" }
                    ].map((s, i) => (
                      <ApexCard key={i} className="p-8 text-center space-y-3">
                         <s.icon size={24} className={`mx-auto ${s.col}`} />
                         <div className="text-3xl font-black italic">{s.val}</div>
                         <div className="text-[10px] font-black text-slate-500 uppercase">{s.label}</div>
                      </ApexCard>
                    ))}
                 </div>

                 {/* Focus Groups */}
                 <div className="space-y-6">
                    <h4 className="text-xl font-black italic uppercase tracking-[0.3em] px-4 text-slate-500">Muscle Focus</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                       {Object.keys(muscleGroupImages).map((m: any) => (
                         <div key={m} onClick={() => { setCatalogFilter(m); setTab("vault"); }} className="relative h-40 rounded-[2rem] overflow-hidden border border-white/5 group cursor-pointer">
                            <img src={muscleGroupImages[m as MuscleGroup]} className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-60 transition-all duration-700" />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent" />
                            <div className="absolute bottom-4 right-4 left-4 text-center">
                               <span className="text-sm font-black italic uppercase tracking-tighter">{muscleHebrew[m] || m}</span>
                            </div>
                         </div>
                       ))}
                    </div>
                 </div>

                 {/* Session Queue */}
                 {sessionList.length > 0 && (
                   <ApexCard className="p-10 border-teal-500/30 bg-teal-500/5">
                      <div className="flex justify-between items-center mb-8">
                         <h3 className="text-3xl font-black italic uppercase">Session Queue</h3>
                         <ApexBadge variant="teal">{sessionList.length} Protocols Loaded</ApexBadge>
                      </div>
                      <div className="space-y-4">
                         {sessionList.map((ex, i) => (
                           <div key={i} className="flex justify-between items-center bg-black/40 p-4 rounded-2xl">
                              <span className="font-black italic uppercase">{ex.name}</span>
                              <button onClick={() => setSessionList(p => p.filter((_, idx) => idx !== i))}><Trash2 size={16} className="text-rose-500"/></button>
                           </div>
                         ))}
                      </div>
                      <ApexButton variant="premium" className="w-full h-20 mt-8 text-xl italic" onClick={() => { setInSession(true); setTimer(sessionList[0].work); setIsRunning(true); }}>
                        ENGAGE PROTOCOL
                      </ApexButton>
                   </ApexCard>
                 )}
              </div>
            )}

            {/* --- VAULT VIEW --- */}
            {tab === "vault" && (
              <div className="space-y-12">
                 <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1 relative">
                       <Search className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-500" />
                       <input type="text" placeholder="SEARCH VAULT..." className="w-full h-16 bg-slate-900/50 border border-white/5 rounded-2xl pr-16 text-white font-bold outline-none focus:border-teal-500" />
                    </div>
                    <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-hide">
                       {["All", ...Object.keys(muscleHebrew)].map((m: any) => (
                         <button key={m} onClick={() => setCatalogFilter(m)} className={`px-8 h-16 rounded-2xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${catalogFilter === m ? 'bg-teal-500 text-slate-950 shadow-lg' : 'bg-slate-900 text-slate-500 border border-white/5'}`}>{muscleHebrew[m] || m}</button>
                       ))}
                    </div>
                 </div>
                 <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {MASTER_VAULT.filter(ex => catalogFilter === "All" || ex.muscleGroup === catalogFilter).map(ex => (
                      <ApexCard key={ex.id} className="group flex flex-col h-full">
                         <div className="h-56 relative overflow-hidden">
                            <img src={ex.imageUrl} className="w-full h-full object-cover opacity-50 group-hover:scale-110 transition-all duration-1000" />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent" />
                            <div className="absolute bottom-4 right-4 flex gap-2">
                               <ApexButton variant="outline" size="icon" className="h-10 w-10 bg-black/40" onClick={() => window.open(ex.videoUrl, '_blank')}><Youtube size={18} className="text-rose-500"/></ApexButton>
                               <ApexButton variant="premium" size="icon" className="h-10 w-10" onClick={() => setSessionList(p => [...p, ex])}><Plus size={18}/></ApexButton>
                            </div>
                            <div className="absolute top-4 right-4"><ApexBadge variant={ex.difficulty === 'Elite' ? 'elite' : 'teal'}>{ex.difficulty}</ApexBadge></div>
                         </div>
                         <div className="p-6 flex-1 flex flex-col">
                            <h4 className="text-2xl font-black italic uppercase mb-2">{ex.name}</h4>
                            <p className="text-slate-400 text-xs font-medium leading-relaxed mb-6 flex-1">{ex.he}</p>
                            <div className="flex justify-between items-center pt-4 border-t border-white/5">
                               <div className="flex gap-4 text-center">
                                  <div><p className="text-[8px] font-black text-slate-600 uppercase">Sets</p><p className="font-black italic">{ex.sets}</p></div>
                                  <div><p className="text-[8px] font-black text-slate-600 uppercase">Reps</p><p className="font-black italic">{ex.reps}</p></div>
                               </div>
                               <ApexBadge>{categoryHebrew[ex.category]}</ApexBadge>
                            </div>
                         </div>
                      </ApexCard>
                    ))}
                 </div>
              </div>
            )}

            {/* --- ANALYTICS VIEW --- */}
            {tab === "analytics" && (
              <div className="space-y-12">
                 <div className="grid md:grid-cols-2 gap-8">
                    <ApexCard className="p-10 space-y-8">
                       <h3 className="text-xl font-black italic uppercase">Workload Distribution</h3>
                       <div className="h-64 flex items-end justify-between gap-2 px-4">
                          {[40, 70, 45, 90, 65, 80, 100].map((h, i) => (
                             <div key={i} className="flex-1 bg-teal-500/20 rounded-t-lg relative group">
                                <motion.div initial={{ height: 0 }} animate={{ height: `${h}%` }} className="absolute bottom-0 inset-x-0 bg-teal-500 rounded-t-lg opacity-60 group-hover:opacity-100 transition-opacity" />
                             </div>
                          ))}
                       </div>
                    </ApexCard>
                    <div className="space-y-6">
                       <h3 className="text-xl font-black italic uppercase px-4">Recent Sessions</h3>
                       {history.map(h => (
                         <ApexCard key={h.id} className="p-6 flex justify-between items-center bg-slate-900/20 border-white/5">
                            <div className="text-right">
                               <h5 className="font-black italic uppercase">{h.workoutTitle}</h5>
                               <p className="text-[9px] text-slate-500 font-bold uppercase">{h.date}</p>
                            </div>
                            <div className="text-center"><p className="text-[9px] font-black text-slate-600 uppercase mb-1">Volume</p><p className="text-2xl font-black italic text-teal-400">{h.totalVolume}kg</p></div>
                         </ApexCard>
                       ))}
                    </div>
                 </div>
              </div>
            )}

          </motion.div>
        ) : (
          /* --- LIVE SESSION VIEW --- */
          <motion.div key="session" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[400] bg-[#020617] flex flex-col p-6 overflow-y-auto">
             <header className="flex justify-between items-center mb-10">
                <ApexButton variant="ghost" size="icon" onClick={() => setInSession(false)}><X size={24}/></ApexButton>
                <div className="text-center">
                   <p className="text-teal-500 font-black text-[9px] tracking-[0.5em] uppercase mb-1">Apex Session Active</p>
                   <h2 className="text-2xl font-black italic uppercase">{sessionList[curExIdx]?.name}</h2>
                </div>
                <ApexButton variant="outline" size="icon" onClick={() => setShowSwap(true)}><RefreshCcw size={18}/></ApexButton>
             </header>

             <div className="flex-1 flex flex-col items-center justify-center space-y-12">
                <div className="text-center space-y-4 max-w-2xl">
                   <ApexBadge variant="elite">{sessionList[curExIdx]?.muscleGroup}</ApexBadge>
                   <h1 className="text-7xl md:text-9xl font-black italic uppercase tracking-tighter leading-none">{sessionList[curExIdx]?.name}</h1>
                   <p className="text-slate-400 text-lg md:text-xl font-medium italic">{sessionList[curExIdx]?.he}</p>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-16">
                   {/* Timer Ring */}
                   <div className="relative">
                      <motion.div animate={isRunning ? { scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] } : {}} transition={{ repeat: Infinity, duration: 3 }} className={`absolute -inset-12 rounded-full border-2 ${phase === 'rest' ? 'border-amber-500/20' : 'border-teal-500/20'}`} />
                      <div className={`h-[24rem] w-[24rem] rounded-full border-4 flex flex-col items-center justify-center shadow-2xl transition-all duration-1000 ${phase === 'rest' ? 'border-amber-500/40 bg-amber-500/5' : 'border-teal-500/40 bg-teal-500/5'}`}>
                         <span className={`text-[11rem] font-black italic tracking-tighter tabular-nums ${phase === 'rest' ? 'text-amber-400' : 'text-white'}`}>{timer}</span>
                         <span className="text-[10px] font-black uppercase tracking-[0.8em] text-slate-600">{phase === 'work' ? 'EXECUTION' : 'RECOVERY'}</span>
                      </div>
                   </div>

                   {/* Data Entry */}
                   <ApexCard className="p-8 w-full max-w-xs space-y-6">
                      <div className="flex justify-between items-center"><h4 className="font-black italic uppercase">Log Set</h4><ApexBadge variant="teal">{curSet} / {sessionList[curExIdx]?.sets}</ApexBadge></div>
                      <div className="space-y-4">
                         <input type="number" value={weight} onChange={e => setWeight(e.target.value)} placeholder="WEIGHT (KG)" className="w-full h-14 bg-black/40 border border-white/10 rounded-xl text-2xl font-black italic text-center outline-none focus:border-teal-500" />
                         <input type="number" value={reps} onChange={e => setReps(e.target.value)} placeholder="REPS" className="w-full h-14 bg-black/40 border border-white/10 rounded-xl text-2xl font-black italic text-center outline-none focus:border-teal-500" />
                         <ApexButton variant="premium" className="w-full" onClick={logSet}>LOG RECENT SET</ApexButton>
                      </div>
                   </ApexCard>
                </div>

                {/* AI Spotter Bubble */}
                {phase === 'rest' && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-teal-500/5 border border-teal-500/20 p-6 rounded-[2rem] max-w-xl text-center">
                    <p className="text-teal-400 font-bold italic text-lg leading-relaxed">"{tip}"</p>
                  </motion.div>
                )}
             </div>

             <div className="max-w-4xl mx-auto w-full pb-12 grid grid-cols-2 gap-8">
                <ApexButton className="h-24 text-3xl italic font-black" onClick={() => setTimer(0)}>{phase === 'work' ? 'SET COMPLETE' : 'SKIP REST'}</ApexButton>
                <ApexButton variant="outline" className="h-24" onClick={() => setIsRunning(!isRunning)}>{isRunning ? <Pause size={40}/> : <Play size={40} className="translate-x-1"/>}</ApexButton>
             </div>

             {showSwap && <SwapModal currentEx={sessionList[curExIdx]} onSwap={e => { const s = [...sessionList]; s[curExIdx] = e; setSessionList(s); }} onClose={() => setShowSwap(false)} />}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Persistent Nav */}
      {!inSession && screen !== 'splash' && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[200] w-full max-w-lg px-8">
           <div className="bg-slate-900/90 backdrop-blur-3xl border border-white/10 p-5 rounded-[3rem] flex justify-around items-center shadow-2xl">
              {[
                { id: "dashboard", icon: Home },
                { id: "vault", icon: LayoutGrid },
                { id: "analytics", icon: barChart3 },
                { id: "settings", icon: Settings2 }
              ].map(t => (
                <button key={t.id} onClick={() => setTab(t.id as any)} className={`p-5 rounded-3xl transition-all ${tab === t.id ? 'bg-teal-500 text-slate-950 shadow-lg scale-110' : 'text-slate-600 hover:text-white'}`}><t.icon size={28} /></button>
              ))}
           </div>
        </div>
      )}
    </div>
  );
}

// --- INITIALIZATION ---
const rootEl = document.getElementById("root");
if (rootEl) {
  const root = createRoot(rootEl);
  root.render(<ReacherApp />);
}
