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
 * REACHER APEX PLATINUM v19.0 - ULTIMATE EDITION
 * BUILT FOR NOAM // NO QUOTES IN EXPLANATIONS // 80+ EXERCISES
 * STABLE ENGINE // NO WHITE SCREEN
 */

// --- TYPES ---
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

interface SetLog {
  weight: number;
  reps: number;
  exerciseId: string;
  timestamp: number;
}

// --- DATABASE (80 EXERCISES) ---
const REACHER_HERO = "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1400";

const MASTER_VAULT: Exercise[] = [
  // --- גב (15 תרגילים) ---
  { id: "b1", name: "Meadows Row", sets: 4, reps: "10-12", he: "עמוד בניצב למוט חופשי. אחוז בקצה המוט ביד אחת. שמור על גב מקביל לרצפה ומשוך את המוט לכיוון המותן תוך הוצאת מרפק החוצה. התרגיל בונה עובי משמעותי בגב העליון והלטים.", work: 45, rest: 90, category: "pull", muscleGroup: "Back", videoUrl: "https://www.youtube.com/results?search_query=meadows+row", imageUrl: "https://images.unsplash.com/photo-1603287611837-f2146f5de8e8?q=80&w=800", difficulty: "Advanced" },
  { id: "b2", name: "Weighted Pull-Ups", sets: 4, reps: "6-8", he: "השתמש בחגורת משקולות. אחוז במוט ברוחב כתפיים. משוך את עצמך עד שהסנטר עובר את המוט. התנועה בונה את רוחב הגב ומחזקת את כוח המשיכה הבסיסי.", work: 40, rest: 120, category: "pull", muscleGroup: "Back", videoUrl: "https://www.youtube.com/results?search_query=weighted+pullups", imageUrl: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?q=80&w=800", difficulty: "Elite" },
  { id: "b3", name: "Iliac Lat Pulldown", sets: 3, reps: "12-15", he: "משיכה מצד אחד תוך הטיית הגוף. המטרה היא להביא את המרפק עמוק לכיוון האגן כדי לבודד את סיבי הלטיסימוס התחתונים.", work: 35, rest: 75, category: "pull", muscleGroup: "Back", videoUrl: "https://www.youtube.com/results?search_query=iliac+lat+pulldown", imageUrl: "https://images.unsplash.com/photo-1590239068512-0f3eff9cca18?q=80&w=800", difficulty: "Advanced" },
  { id: "b4", name: "T-Bar Row", sets: 3, reps: "10", he: "הצמד את החזה לכרית. אחוז בידיות ומשוך לכיוון השכמות. תרגיל זה מנטרל את הגב התחתון ומאפשר בידוד מוחלט של הגב העליון.", work: 40, rest: 90, category: "pull", muscleGroup: "Back", videoUrl: "https://www.youtube.com/results?search_query=t+bar+row", imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800", difficulty: "Standard" },
  { id: "b5", name: "Rack Pulls", sets: 4, reps: "5-8", he: "משיכת מוט מהכלוב החל מגובה הברך. בונה גב תחתון וזוקפים חזקים כמו בטון. תרגיל ליבה לבניית כוח אבסולוטי.", work: 30, rest: 150, category: "pull", muscleGroup: "Back", videoUrl: "https://www.youtube.com/results?search_query=rack+pulls", imageUrl: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=800", difficulty: "Elite" },
  { id: "b6", name: "Seal Row", sets: 3, reps: "10-12", he: "שכיבה על ספסל מוגבה ומשיכת מוט מלמטה. מנטרל לחלוטין את הרגליים והמומנטום. הדרך הטובה ביותר לבודד את הגב.", work: 40, rest: 90, category: "pull", muscleGroup: "Back", videoUrl: "https://www.youtube.com/results?search_query=seal+row", imageUrl: "https://images.unsplash.com/photo-1603287611837-f2146f5de8e8?q=80&w=800", difficulty: "Advanced" },
  { id: "b7", name: "Lat Prayer", sets: 3, reps: "15", he: "משיכה עם ידיים ישרות בפולי עליון. תרגיל בידוד מושלם ללטים שמלמד איך להשתמש בגב ללא מעורבות של הבייספס.", work: 35, rest: 60, category: "isolation", muscleGroup: "Back", videoUrl: "https://www.youtube.com/results?search_query=lat+prayer", imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800", difficulty: "Standard" },
  { id: "b8", name: "Pendlay Row", sets: 4, reps: "8", he: "חתירה מתפרצת מהרצפה כאשר הגב מקביל לחלוטין לקרקע. המוט חוזר לרצפה בכל חזרה. בונה כוח מתפרץ ושליטה בשכמות.", work: 45, rest: 120, category: "pull", muscleGroup: "Back", videoUrl: "https://www.youtube.com/results?search_query=pendlay+row", imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800", difficulty: "Elite" },
  { id: "b9", name: "Kroc Rows", sets: 3, reps: "20+", he: "חתירה עם משקולת כבדה מאוד בסטים של חזרות גבוהות. שימוש במומנטום מבוקר. התרגיל בונה אחיזה חזקה וגב עליון רחב.", work: 60, rest: 120, category: "pull", muscleGroup: "Back", videoUrl: "https://www.youtube.com/results?search_query=kroc+row", imageUrl: "https://images.unsplash.com/photo-1603287611837-f2146f5de8e8?q=80&w=800", difficulty: "Elite" },
  { id: "b10", name: "Snatch Grip High Pull", sets: 4, reps: "6", he: "משיכה מהירה של המוט עד גובה החזה באחיזה רחבה מאוד. תרגיל כוח מתפרץ שעובד על הטרפזים והכתפיים האחוריות.", work: 30, rest: 150, category: "power", muscleGroup: "Back", videoUrl: "https://www.youtube.com/results?search_query=high+pull", imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800", difficulty: "Elite" },
  { id: "b11", name: "Incline DB Row", sets: 3, reps: "12", he: "שכיבה על ספסל בשיפוע עם הפנים למטה. משיכת משקולות תוך כדי הצמדת השכמות. מבודד את הגב העליון.", work: 40, rest: 90, category: "pull", muscleGroup: "Back", videoUrl: "https://www.youtube.com/results?search_query=incline+dumbbell+row", imageUrl: "https://images.unsplash.com/photo-1603287611837-f2146f5de8e8?q=80&w=800", difficulty: "Advanced" },
  { id: "b12", name: "Chin-Ups", sets: 3, reps: "10", he: "עליות מתח באחיזה הפוכה וצרה. דגש חזק על הבייספס והלטים התחתונים.", work: 40, rest: 90, category: "pull", muscleGroup: "Back", videoUrl: "https://www.youtube.com/results?search_query=chin+ups", imageUrl: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?q=80&w=800", difficulty: "Standard" },
  { id: "b13", name: "Barbell Rows", sets: 4, reps: "8-10", he: "חתירה קלאסית עם מוט. שמור על גב ישר והבא את המוט לכיוון הטבור תוך סחיטת השכמות.", work: 45, rest: 90, category: "pull", muscleGroup: "Back", videoUrl: "https://www.youtube.com/results?search_query=barbell+row+form", imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800", difficulty: "Advanced" },
  { id: "b14", name: "Single Arm DB Row", sets: 3, reps: "12", he: "חתירה עם משקולת יד אחת. מאפשר טווח תנועה גדול יותר ובידוד של כל צד בגב בנפרד.", work: 40, rest: 75, category: "pull", muscleGroup: "Back", videoUrl: "https://www.youtube.com/results?search_query=one+arm+db+row", imageUrl: "https://images.unsplash.com/photo-1603287611837-f2146f5de8e8?q=80&w=800", difficulty: "Standard" },
  { id: "b15", name: "Deadlift (Conventional)", sets: 3, reps: "5", he: "מלך התרגילים. הרמת מוט מהרצפה תוך שימוש בכל הגוף. בונה כוח בסיסי, זוקפי גב ורגליים עוצמתיות.", work: 45, rest: 180, category: "pull", muscleGroup: "Back", videoUrl: "https://www.youtube.com/results?search_query=deadlift+form", imageUrl: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=800", difficulty: "Elite" },

  // --- חזה (15 תרגילים) ---
  { id: "c1", name: "Low-Incline DB Press", sets: 4, reps: "8-10", he: "לחיצת משקולות בשיפוע קל. השיפוע הנמוך מאפשר גיוס מקסימלי של החזה העליון תוך שמירה על בריאות הכתף.", work: 45, rest: 100, category: "push", muscleGroup: "Chest", videoUrl: "https://www.youtube.com/results?search_query=incline+dumbbell+press", imageUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=800", difficulty: "Advanced" },
  { id: "c2", name: "Weighted Dips", sets: 4, reps: "8-12", he: "מקבילים עם תוספת משקל. הטה את הגוף קדימה כדי להעביר את העומס מהטריספס לחזה התחתון והאמצעי.", work: 40, rest: 100, category: "push", muscleGroup: "Chest", videoUrl: "https://www.youtube.com/results?search_query=weighted+dips", imageUrl: "https://images.unsplash.com/photo-1534367957981-2940263f382a?q=80&w=800", difficulty: "Elite" },
  { id: "c3", name: "Converging Press", sets: 3, reps: "10-12", he: "לחיצה במכונה שבה הידיות מתקרבות אחת לשנייה בשיא התנועה. מאפשר סחיטה מקסימלית של סיבי החזה.", work: 40, rest: 90, category: "push", muscleGroup: "Chest", videoUrl: "https://www.youtube.com/results?search_query=machine+chest+press", imageUrl: "https://images.unsplash.com/photo-1591741535018-d042766c62eb?q=80&w=800", difficulty: "Standard" },
  { id: "c4", name: "Floor Press", sets: 3, reps: "8", he: "לחיצה בשכיבה על הרצפה. עוצר את התנועה ב-90 מעלות במרפקים. מצוין לשיפור כוח הנעילה ומניעת פציעות כתף.", work: 40, rest: 90, category: "push", muscleGroup: "Chest", videoUrl: "https://www.youtube.com/results?search_query=floor+press", imageUrl: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=800", difficulty: "Advanced" },
  { id: "c5", name: "Cable Flyes", sets: 3, reps: "15", he: "משיכת כבלים מלמעלה למטה. מתמקד בחלק התחתון והחיצוני של החזה. שמור על חזה נפוח וכתפיים לאחור.", work: 35, rest: 60, category: "isolation", muscleGroup: "Chest", videoUrl: "https://www.youtube.com/results?search_query=cable+flyes", imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800", difficulty: "Standard" },
  { id: "c6", name: "Hex Press", sets: 3, reps: "12", he: "הצמד את המשקולות אחת לשנייה לאורך כל הלחיצה. יוצר מתח תמידי בחלק המרכזי של החזה.", work: 35, rest: 75, category: "isolation", muscleGroup: "Chest", videoUrl: "https://www.youtube.com/results?search_query=hex+press", imageUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=800", difficulty: "Standard" },
  { id: "c7", name: "Flat Bench Press", sets: 4, reps: "6-8", he: "לחיצת חזה קלאסית עם מוט. התרגיל הבסיסי ביותר לבניית מסה וכוח בחזה האמצעי.", work: 45, rest: 120, category: "push", muscleGroup: "Chest", videoUrl: "https://www.youtube.com/results?search_query=bench+press+form", imageUrl: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=800", difficulty: "Advanced" },
  { id: "c8", name: "Guillotine Press", sets: 3, reps: "10", he: "לחיצת חזה שבה המוט יורד לכיוון הצוואר. תרגיל מתקדם שמבודד את סיבי החזה העליונים בצורה קיצונית.", work: 45, rest: 100, category: "push", muscleGroup: "Chest", videoUrl: "https://www.youtube.com/results?search_query=guillotine+press", imageUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=800", difficulty: "Elite" },
  { id: "c9", name: "Low-To-High Cable Fly", sets: 3, reps: "15", he: "משיכת כבלים מלמטה למעלה לכיוון הפנים. התרגיל הטוב ביותר לעיצוב ובידוד החזה העליון.", work: 35, rest: 60, category: "isolation", muscleGroup: "Chest", videoUrl: "https://www.youtube.com/results?search_query=low+to+high+cable+fly", imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800", difficulty: "Standard" },
  { id: "c10", name: "Dumbbell Pullover", sets: 3, reps: "12", he: "מתיחת משקולת מעבר לראש בשכיבה. עובד על החזה, הלטים ומרחיב את כלוב הצלעות.", work: 40, rest: 80, category: "isolation", muscleGroup: "Chest", videoUrl: "https://www.youtube.com/results?search_query=dumbbell+pullover", imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800", difficulty: "Standard" },
  { id: "c11", name: "Pec Deck Fly", sets: 3, reps: "15", he: "בידוד חזה במכונה. הקפד על סחיטה מקסימלית של הידיות במרכז ושחרור איטי למתיחה עמוקה.", work: 30, rest: 60, category: "isolation", muscleGroup: "Chest", videoUrl: "https://www.youtube.com/results?search_query=pec+deck", imageUrl: "https://images.unsplash.com/photo-1591741535018-d042766c62eb?q=80&w=800", difficulty: "Standard" },
  { id: "c12", name: "Landmine Press", sets: 3, reps: "10-12", he: "דחיפת המוט באלכסון מלמטה למעלה. בונה כוח מתפרץ בחזה העליון ומגן על מפרק הכתף.", work: 40, rest: 90, category: "push", muscleGroup: "Chest", videoUrl: "https://www.youtube.com/results?search_query=landmine+chest+press", imageUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=800", difficulty: "Advanced" },
  { id: "c13", name: "Decline DB Press", sets: 3, reps: "10", he: "לחיצת משקולות בשיפוע שלילי. מתמקד בחזה התחתון ומאפשר הרמת משקלים גבוהים יחסית.", work: 45, rest: 90, category: "push", muscleGroup: "Chest", videoUrl: "https://www.youtube.com/results?search_query=decline+db+press", imageUrl: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=800", difficulty: "Advanced" },
  { id: "c14", name: "Push-Ups (Weighted)", sets: 3, reps: "Max", he: "שכיבות סמיכה קלאסיות עם פלטה על הגב. בונה סיבולת וכוח בסיסי בחזה ובליבה.", work: 45, rest: 75, category: "push", muscleGroup: "Chest", videoUrl: "https://www.youtube.com/results?search_query=weighted+push+ups", imageUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=800", difficulty: "Standard" },
  { id: "c15", name: "Spoto Press", sets: 4, reps: "5", he: "לחיצת חזה עם עצירה של שנייה סנטימטר מעל החזה. בונה כוח מתפרץ ויציבות אדירה בלחיצה.", work: 40, rest: 150, category: "push", muscleGroup: "Chest", videoUrl: "https://www.youtube.com/results?search_query=spoto+press", imageUrl: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=800", difficulty: "Elite" },

  // --- רגליים (15 תרגילים) ---
  { id: "l1", name: "Zercher Squat", sets: 4, reps: "8-10", he: "החזק את המוט בעיקולי המרפקים מול החזה. רד עמוק. בונה רגליים וליבה של לוחם.", work: 50, rest: 150, category: "legs", muscleGroup: "Legs", videoUrl: "https://www.youtube.com/results?search_query=zercher+squat", imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800", difficulty: "Elite" },
  { id: "l2", name: "Bulgarian Split Squat", sets: 3, reps: "10/leg", he: "רגל אחת על ספסל. רד עד שהברך האחורית נוגעת ברצפה. התרגיל הכי אפקטיבי לקוואדס.", work: 45, rest: 90, category: "legs", muscleGroup: "Legs", videoUrl: "https://www.youtube.com/results?search_query=bulgarian+split+squat", imageUrl: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=800", difficulty: "Advanced" },
  { id: "l3", name: "Romanian Deadlift", sets: 4, reps: "10-12", he: "מוט צמוד לרגליים, גב ישר, מתיחה מקסימלית של ההמסטרינג. בונה את כל השרשרת האחורית.", work: 45, rest: 100, category: "legs", muscleGroup: "Legs", videoUrl: "https://www.youtube.com/results?search_query=romanian+deadlift", imageUrl: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=800", difficulty: "Advanced" },
  { id: "l4", name: "Nordic Curl", sets: 3, reps: "5-8", he: "בלום את עצמך בירידה איטית לכיוון הרצפה רק בעזרת הרגליים. המלך של תרגילי ההמסטרינג.", work: 30, rest: 120, category: "legs", muscleGroup: "Legs", videoUrl: "https://www.youtube.com/results?search_query=nordic+curl", imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800", difficulty: "Elite" },
  { id: "l5", name: "Kas Glute Bridge", sets: 3, reps: "12-15", he: "טווח תנועה קטן וממוקד לישבן על ספסל. סחיטה חזקה בשיא התנועה.", work: 40, rest: 90, category: "legs", muscleGroup: "Legs", videoUrl: "https://www.youtube.com/results?search_query=kas+glute+bridge", imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=800", difficulty: "Standard" },
  { id: "l6", name: "Leg Press", sets: 4, reps: "12-15", he: "לחיצת רגליים במכונה. שמור על גב צמוד למשענת ואל תנעל ברכיים בסוף התנועה.", work: 45, rest: 90, category: "legs", muscleGroup: "Legs", videoUrl: "https://www.youtube.com/results?search_query=leg+press+form", imageUrl: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=800", difficulty: "Standard" },
  { id: "l7", name: "Seated Leg Curl", sets: 3, reps: "15", he: "בידוד המסטרינג בישיבה. כווץ חזק למטה ושחרר לאט למעלה.", work: 35, rest: 60, category: "isolation", muscleGroup: "Legs", videoUrl: "https://www.youtube.com/results?search_query=seated+leg+curl", imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800", difficulty: "Standard" },
  { id: "l8", name: "Hack Squat", sets: 4, reps: "8-10", he: "סקוואט במכונה ייעודית המאפשרת ירידה עמוקה מאוד עם תמיכה מלאה לגב.", work: 45, rest: 120, category: "legs", muscleGroup: "Legs", videoUrl: "https://www.youtube.com/results?search_query=hack+squat", imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800", difficulty: "Advanced" },
  { id: "l9", name: "Walking Lunges", sets: 3, reps: "20 Steps", he: "צעדי מכרע קדימה עם משקולות. בונה כוח דינמי וסיבולת שריר בירכיים ובישבן.", work: 60, rest: 90, category: "legs", muscleGroup: "Legs", videoUrl: "https://www.youtube.com/results?search_query=walking+lunges", imageUrl: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=800", difficulty: "Standard" },
  { id: "l10", name: "Adductor Machine", sets: 3, reps: "15", he: "קירוב ירכיים במכונה. מחזק את השרירים המקרבים בירך הפנימית ומונע פציעות.", work: 30, rest: 60, category: "isolation", muscleGroup: "Legs", videoUrl: "https://www.youtube.com/results?search_query=adductor+machine", imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800", difficulty: "Standard" },
  { id: "l11", name: "Calf Raises (Standing)", sets: 4, reps: "20", he: "הרמת עקבים בעמידה. התרגיל הבסיסי והטוב ביותר לבניית שרירי השוקיים.", work: 30, rest: 60, category: "isolation", muscleGroup: "Legs", videoUrl: "https://www.youtube.com/results?search_query=calf+raises", imageUrl: "https://images.unsplash.com/photo-1434682881908-b43d0467b798?q=80&w=800", difficulty: "Standard" },
  { id: "l12", name: "Goblet Squat", sets: 3, reps: "15", he: "סקוואט עם משקולת אחת מול החזה. מעולה ללימוד טכניקה נכונה וירידה עמוקה.", work: 40, rest: 75, category: "legs", muscleGroup: "Legs", videoUrl: "https://www.youtube.com/results?search_query=goblet+squat", imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800", difficulty: "Standard" },
  { id: "l13", name: "Box Squat", sets: 4, reps: "6", he: "סקוואט עד לישיבה על קופסה ועצירה. בונה כוח מתפרץ אדיר מהמקום הנמוך ביותר.", work: 45, rest: 150, category: "legs", muscleGroup: "Legs", videoUrl: "https://www.youtube.com/results?search_query=box+squat", imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800", difficulty: "Advanced" },
  { id: "l14", name: "Leg Extension", sets: 3, reps: "20", he: "פשיטת רגליים במכונה. בידוד מושלם לקוואדס. סחוט את השריר בשיא התנועה.", work: 30, rest: 60, category: "isolation", muscleGroup: "Legs", videoUrl: "https://www.youtube.com/results?search_query=leg+extension", imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800", difficulty: "Standard" },
  { id: "l15", name: "Step-Ups", sets: 3, reps: "12/leg", he: "עלייה על קופסה גבוהה עם משקולות. בונה כוח חד צדדי ויציבות ליבה.", work: 45, rest: 75, category: "legs", muscleGroup: "Legs", videoUrl: "https://www.youtube.com/results?search_query=step+ups", imageUrl: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=800", difficulty: "Standard" },

  // --- כתפיים (15 תרגילים) ---
  { id: "s1", name: "Z-Press", sets: 4, reps: "8-10", he: "לחיצת כתפיים בישיבה על הרצפה. מנטרל את הרגליים ומאלץ את הכתפיים והבטן לעבוד ב-100%.", work: 45, rest: 120, category: "armor", muscleGroup: "Shoulders", videoUrl: "https://www.youtube.com/results?search_query=z+press", imageUrl: "https://images.unsplash.com/photo-1591741535018-d042766c62eb?q=80&w=800", difficulty: "Elite" },
  { id: "s2", name: "Lu Raises", sets: 3, reps: "15", he: "הרמה צידית מלאה עד מעל הראש. בונה ניידות וכתפיים רחבות בצורה יוצאת דופן.", work: 35, rest: 75, category: "armor", muscleGroup: "Shoulders", videoUrl: "https://www.youtube.com/results?search_query=lu+raises", imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800", difficulty: "Advanced" },
  { id: "s3", name: "Face Pulls", sets: 4, reps: "20", he: "משיכת חבל למצח עם סיבוב חיצוני. הכרחי ליציבה ובריאות הכתף האחורית.", work: 40, rest: 60, category: "armor", muscleGroup: "Shoulders", videoUrl: "https://www.youtube.com/results?search_query=face+pulls", imageUrl: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=800", difficulty: "Standard" },
  { id: "s4", name: "Arnold Press", sets: 3, reps: "10", he: "לחיצה עם סיבוב ידיים. עובד על כל ראשי הכתף בתנועה אחת חלקה.", work: 45, rest: 90, category: "armor", muscleGroup: "Shoulders", videoUrl: "https://www.youtube.com/results?search_query=arnold+press", imageUrl: "https://images.unsplash.com/photo-1591741535018-d042766c62eb?q=80&w=800", difficulty: "Advanced" },
  { id: "s5", name: "Lateral Raise (Cable)", sets: 4, reps: "15", he: "הרמה צידית בכבל. שומר על מתח תמידי לאורך כל התנועה. בונה רוחב כתפיים.", work: 35, rest: 60, category: "isolation", muscleGroup: "Shoulders", videoUrl: "https://www.youtube.com/results?search_query=cable+lateral+raise", imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800", difficulty: "Standard" },
  { id: "s6", name: "Military Press", sets: 4, reps: "6", he: "לחיצת מוט בעמידה. התרגיל הבסיסי והחזק ביותר לבניית מסה בכתפיים.", work: 45, rest: 150, category: "armor", muscleGroup: "Shoulders", videoUrl: "https://www.youtube.com/results?search_query=military+press+form", imageUrl: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=800", difficulty: "Advanced" },
  { id: "s7", name: "Rear Delt Fly (DB)", sets: 3, reps: "15", he: "הרחקת משקולות לצדדים בהטיה קדימה. מבודד את הכתף האחורית.", work: 35, rest: 60, category: "isolation", muscleGroup: "Shoulders", videoUrl: "https://www.youtube.com/results?search_query=rear+delt+fly", imageUrl: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=800", difficulty: "Standard" },
  { id: "s8", name: "Upright Row", sets: 3, reps: "12", he: "משיכת מוט צמוד לגוף עד גובה החזה. בונה טרפזים וכתף צידית.", work: 40, rest: 90, category: "armor", muscleGroup: "Shoulders", videoUrl: "https://www.youtube.com/results?search_query=upright+row", imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800", difficulty: "Standard" },
  { id: "s9", name: "Front Raise (Plate)", sets: 3, reps: "15", he: "הרמת פלטה מלפנים עד גובה העיניים. מבודד את הכתף הקדמית.", work: 30, rest: 60, category: "isolation", muscleGroup: "Shoulders", videoUrl: "https://www.youtube.com/results?search_query=plate+front+raise", imageUrl: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=800", difficulty: "Standard" },
  { id: "s10", name: "Push Press", sets: 4, reps: "5", he: "לחיצת כתפיים מתפרצת עם עזרה קלה מהרגליים. בונה כוח אבסולוטי.", work: 40, rest: 180, category: "power", muscleGroup: "Shoulders", videoUrl: "https://www.youtube.com/results?search_query=push+press", imageUrl: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=800", difficulty: "Elite" },
  { id: "s11", name: "Y-Raise", sets: 3, reps: "15", he: "הרמת ידיים לצורת Y בשכיבה על ספסל בשיפוע. מצוין לטרפז התחתון.", work: 35, rest: 60, category: "isolation", muscleGroup: "Shoulders", videoUrl: "https://www.youtube.com/results?search_query=y+raise", imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800", difficulty: "Standard" },
  { id: "s12", name: "Bradford Press", sets: 3, reps: "12", he: "לחיצת מוט מלפנים ומאחורי הראש לסירוגין. יוצר מתח תמידי בכתף.", work: 45, rest: 90, category: "armor", muscleGroup: "Shoulders", videoUrl: "https://www.youtube.com/results?search_query=bradford+press", imageUrl: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=800", difficulty: "Advanced" },
  { id: "s13", name: "Bus Driver", sets: 3, reps: "45s", he: "החזקת פלטה מלפנים וסיבוב ימינה ושמאלה. בונה סיבולת בכתף הקדמית.", work: 45, rest: 60, category: "isolation", muscleGroup: "Shoulders", videoUrl: "https://www.youtube.com/results?search_query=bus+driver+exercise", imageUrl: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=800", difficulty: "Standard" },
  { id: "s14", name: "Handstand Push-Ups", sets: 3, reps: "Max", he: "שכיבות סמיכה בעמידת ידיים מול קיר. תרגיל משקל הגוף הקשה ביותר לכתפיים.", work: 45, rest: 120, category: "armor", muscleGroup: "Shoulders", videoUrl: "https://www.youtube.com/results?search_query=hspu+form", imageUrl: "https://images.unsplash.com/photo-1599058917233-57c0e6244a4d?q=80&w=800", difficulty: "Elite" },
  { id: "s15", name: "Cable Rear Delt Row", sets: 3, reps: "15", he: "חתירה בכבלים עם מרפקים גבוהים. מיקוד בכתף האחורית והטרפז האמצעי.", work: 40, rest: 60, category: "isolation", muscleGroup: "Shoulders", videoUrl: "https://www.youtube.com/results?search_query=cable+rear+delt+row", imageUrl: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=800", difficulty: "Standard" },

  // --- ידיים (15 תרגילים) ---
  { id: "a1", name: "Bayesian Cable Curl", sets: 3, reps: "12-15", he: "כפיפת בייספס כשהגב לכבל. מתיחה עצומה בראש הארוך של השריר.", work: 35, rest: 60, category: "isolation", muscleGroup: "Arms", videoUrl: "https://www.youtube.com/results?search_query=bayesian+curl", imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800", difficulty: "Advanced" },
  { id: "a2", name: "Katana Extension", sets: 3, reps: "12-15", he: "פשיטת טריספס מעבר לראש בכבלים. מתיחה אידיאלית לזרוע האחורית.", work: 35, rest: 60, category: "isolation", muscleGroup: "Arms", videoUrl: "https://www.youtube.com/results?search_query=katana+extension", imageUrl: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=800", difficulty: "Advanced" },
  { id: "a3", name: "Hammer Curl", sets: 3, reps: "12", he: "כפיפה באחיזה ניטרלית. בונה את שריר הברכיאליס והאמות למראה עבה.", work: 35, rest: 75, category: "isolation", muscleGroup: "Arms", videoUrl: "https://www.youtube.com/results?search_query=hammer+curl", imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800", difficulty: "Standard" },
  { id: "a4", name: "Close-Grip Bench", sets: 4, reps: "8", he: "לחיצת חזה באחיזה צרה. התרגיל הבסיסי הטוב ביותר לכוח בטריספס.", work: 45, rest: 100, category: "push", muscleGroup: "Arms", videoUrl: "https://www.youtube.com/results?search_query=close+grip+bench", imageUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=800", difficulty: "Advanced" },
  { id: "a5", name: "Preacher Curl", sets: 3, reps: "12", he: "כפיפה על ספסל ייעודי המונע תנופה ומבודד את הבייספס לחלוטין.", work: 35, rest: 75, category: "isolation", muscleGroup: "Arms", videoUrl: "https://www.youtube.com/results?search_query=preacher+curl", imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800", difficulty: "Standard" },
  { id: "a6", name: "Skull Crusher", sets: 3, reps: "10-12", he: "פשיטת מרפקים בשכיבה לכיוון המצח. בונה מסה אדירה בטריספס.", work: 40, rest: 90, category: "isolation", muscleGroup: "Arms", videoUrl: "https://www.youtube.com/results?search_query=skull+crusher", imageUrl: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=800", difficulty: "Advanced" },
  { id: "a7", name: "Concentration Curl", sets: 3, reps: "15", he: "כפיפה בישיבה כשהמרפק נתמך בירך. יוצר את שיא הגובה בבייספס.", work: 30, rest: 60, category: "isolation", muscleGroup: "Arms", videoUrl: "https://www.youtube.com/results?search_query=concentration+curl", imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800", difficulty: "Standard" },
  { id: "a8", name: "Tricep Pushdown (Rope)", sets: 4, reps: "15", he: "לחיצת חבל למטה. סחוט את הטריספס בשיא התנועה ופתח את החבל.", work: 30, rest: 60, category: "isolation", muscleGroup: "Arms", videoUrl: "https://www.youtube.com/results?search_query=rope+pushdown", imageUrl: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=800", difficulty: "Standard" },
  { id: "a9", name: "Spider Curl", sets: 3, reps: "12", he: "כפיפה בשכיבה על ספסל בשיפוע עם הפנים למטה. מבודד בייספס בצורה נקייה.", work: 35, rest: 75, category: "isolation", muscleGroup: "Arms", videoUrl: "https://www.youtube.com/results?search_query=spider+curl", imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800", difficulty: "Advanced" },
  { id: "a10", name: "French Press", sets: 3, reps: "12", he: "פשיטת מרפקים מעבר לראש בישיבה עם משקולת בודדת. בונה את הראש הארוך.", work: 40, rest: 90, category: "isolation", muscleGroup: "Arms", videoUrl: "https://www.youtube.com/results?search_query=french+press", imageUrl: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=800", difficulty: "Advanced" },
  { id: "a11", name: "Zottman Curl", sets: 3, reps: "12", he: "עלייה כבייספס רגיל, סיבוב אמות וירידה איטית באחיזה הפוכה. בונה זרועות.", work: 40, rest: 75, category: "isolation", muscleGroup: "Arms", videoUrl: "https://www.youtube.com/results?search_query=zottman+curl", imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800", difficulty: "Advanced" },
  { id: "a12", name: "Diamond Push-Up", sets: 3, reps: "Max", he: "שכיבות סמיכה ביהלום. תרגיל משקל גוף מעולה לטריספס בסוף אימון.", work: 35, rest: 60, category: "push", muscleGroup: "Arms", videoUrl: "https://www.youtube.com/results?search_query=diamond+push+up", imageUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=800", difficulty: "Standard" },
  { id: "a13", name: "Reverse Barbell Curl", sets: 3, reps: "15", he: "כפיפה במוט באחיזה הפוכה. בונה את האמות ואת שריר הזרוע הקדמי.", work: 30, rest: 60, category: "isolation", muscleGroup: "Arms", videoUrl: "https://www.youtube.com/results?search_query=reverse+curl", imageUrl: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=800", difficulty: "Standard" },
  { id: "a14", name: "Cross Body Hammer", sets: 3, reps: "12/side", he: "כפיפת פטישים לכיוון הכתף הנגדית. בונה את הראש הצידי של הבייספס.", work: 35, rest: 60, category: "isolation", muscleGroup: "Arms", videoUrl: "https://www.youtube.com/results?search_query=cross+body+hammer+curl", imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800", difficulty: "Standard" },
  { id: "a15", name: "Bench Dips", sets: 3, reps: "Max", he: "פשיטת מרפקים כשהידיים על ספסל מאחורי הגוף. תרגיל בסיס מעולה לזרוע האחורית.", work: 40, rest: 60, category: "push", muscleGroup: "Arms", videoUrl: "https://www.youtube.com/results?search_query=bench+dips", imageUrl: "https://images.unsplash.com/photo-1534367957981-2940263f382a?q=80&w=800", difficulty: "Standard" },

  // --- בטן וכוח (5 תרגילים) ---
  { id: "cr1", name: "Dragon Flag", sets: 3, reps: "5-8", he: "הרמת כל הגוף כיחידה אחת בשכיבה והורדה איטית. שיא השליטה בבטן.", work: 40, rest: 90, category: "core", muscleGroup: "Core", videoUrl: "https://www.youtube.com/results?search_query=dragon+flag", imageUrl: "https://images.unsplash.com/photo-1599058917233-57c0e6244a4d?q=80&w=800", difficulty: "Elite" },
  { id: "cr2", name: "Hanging Leg Raise", sets: 4, reps: "15", he: "תלייה על מוט והרמת רגליים ישרות. עובד חזק על הבטן התחתונה.", work: 40, rest: 60, category: "core", muscleGroup: "Core", videoUrl: "https://www.youtube.com/results?search_query=hanging+leg+raise", imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=800", difficulty: "Advanced" },
  { id: "f1", name: "Landmine Thruster", sets: 4, reps: "10", he: "סקוואט ודחיפה של המוט מעל הראש בתנועה אחת. כוח מתפרץ בכל הגוף.", work: 60, rest: 120, category: "power", muscleGroup: "FullBody", videoUrl: "https://www.youtube.com/results?search_query=landmine+thruster", imageUrl: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=800", difficulty: "Advanced" },
  { id: "f2", name: "Farmer's Walk", sets: 3, reps: "40m", he: "הליכה עם משקולות כבדות. בונה אחיזה, גב עליון ויציבות ליבה אדירה.", work: 45, rest: 120, category: "power", muscleGroup: "FullBody", videoUrl: "https://www.youtube.com/results?search_query=farmers+walk", imageUrl: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=800", difficulty: "Elite" },
  { id: "f3", name: "Medicine Ball Slam", sets: 3, reps: "15", he: "הטחת כדור כוח ברצפה בכל הכוח. שריפת קלוריות וכוח מתפרץ.", work: 30, rest: 60, category: "power", muscleGroup: "FullBody", videoUrl: "https://www.youtube.com/results?search_query=med+ball+slam", imageUrl: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=800", difficulty: "Standard" }
];

// --- APP COMPONENT ---
function ReacherApp() {
  const [screen, setScreen] = useState<"splash" | "main">("splash");
  const [tab, setTab] = useState<"dashboard" | "vault" | "analytics">("dashboard");
  const [filter, setFilter] = useState<MuscleGroup | "All">("All");

  const [sessionList, setSessionList] = useState<Exercise[]>([]);
  const [inSession, setInSession] = useState(false);
  const [curExIdx, setCurExIdx] = useState(0);
  const [curSet, setCurSet] = useState(1);
  const [phase, setPhase] = useState<"work" | "rest">("work");
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");

  const audioCtx = useRef<AudioContext | null>(null);

  const playSound = (f: number) => {
    if (!audioCtx.current) audioCtx.current = new AudioContext();
    const o = audioCtx.current.createOscillator();
    const g = audioCtx.current.createGain();
    o.connect(g); g.connect(audioCtx.current.destination);
    o.frequency.value = f;
    g.gain.setValueAtTime(0.1, audioCtx.current.currentTime);
    g.gain.exponentialRampToValueAtTime(0.01, audioCtx.current.currentTime + 0.3);
    o.start(); o.stop(audioCtx.current.currentTime + 0.3);
  };

  useEffect(() => {
    let t: any;
    if (isRunning && timer > 0) {
      t = setInterval(() => setTimer(v => v - 1), 1000);
    } else if (isRunning && timer === 0) {
      const ex = sessionList[curExIdx];
      playSound(phase === "work" ? 400 : 900);
      if (phase === "work") {
        setPhase("rest"); setTimer(ex.rest);
      } else {
        if (curSet < ex.sets) {
          setCurSet(s => s + 1); setPhase("work"); setTimer(ex.work);
        } else if (curExIdx + 1 < sessionList.length) {
          setCurExIdx(i => i + 1); setCurSet(1); setPhase("work"); setTimer(sessionList[curExIdx+1].work);
        } else {
          setInSession(false); setIsRunning(false); alert("אימון הושלם נועם!");
        }
      }
    }
    return () => clearInterval(t);
  }, [isRunning, timer, phase]);

  // --- SCREENS ---

  if (screen === "splash") {
    return (
      <div className="fixed inset-0 bg-slate-950 flex flex-col items-center justify-center p-10 text-center">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="space-y-12">
           <h1 className="text-8xl font-black italic uppercase text-white tracking-tighter">REACHER<br/><span className="text-teal-500">APEX</span></h1>
           <ApexButton size="lg" onClick={() => setScreen("main")}>INITIALIZE</ApexButton>
        </motion.div>
      </div>
    );
  }

  if (inSession) {
    const ex = sessionList[curExIdx];
    return (
      <div className="fixed inset-0 bg-[#020617] z-[500] flex flex-col p-6 overflow-y-auto" dir="rtl">
         <header className="flex justify-between items-center mb-8">
            <ApexButton variant="ghost" size="icon" onClick={() => setInSession(false)}><X/></ApexButton>
            <h2 className="text-xl font-black italic uppercase text-teal-500">{ex?.name}</h2>
            <div className="w-12"/>
         </header>
         <div className="flex-1 flex flex-col items-center justify-center space-y-10">
            <div className="text-center space-y-4">
              <ApexBadge variant="elite">{curSet} / {ex?.sets} סטים</ApexBadge>
              <h1 className="text-6xl font-black italic uppercase leading-none">{ex?.name}</h1>
              <p className="text-slate-400 text-lg italic max-w-xl px-4">{ex?.he}</p>
            </div>
            <div className="relative flex items-center justify-center">
              <div className={`h-80 w-80 rounded-full border-4 flex flex-col items-center justify-center transition-all duration-700 ${phase === 'rest' ? 'border-amber-500 bg-amber-500/5 shadow-[0_0_50px_rgba(245,158,11,0.1)]' : 'border-teal-500 bg-teal-500/5 shadow-[0_0_50px_rgba(20,184,166,0.1)]'}`}>
                 <span className="text-[11rem] font-black tabular-nums leading-none">{timer}</span>
                 <span className="text-xs font-black uppercase tracking-[0.5em] text-slate-500">{phase === 'work' ? 'WORK' : 'REST'}</span>
              </div>
            </div>
            <div className="flex gap-4 w-full max-w-sm">
               <input type="number" value={weight} onChange={e => setWeight(e.target.value)} placeholder="משקל" className="flex-1 bg-white/5 p-5 rounded-2xl text-center font-black text-2xl outline-none border border-white/10 focus:border-teal-500" />
               <input type="number" value={reps} onChange={e => setReps(e.target.value)} placeholder="חזרות" className="flex-1 bg-white/5 p-5 rounded-2xl text-center font-black text-2xl outline-none border border-white/10 focus:border-teal-500" />
            </div>
         </div>
         <div className="py-10 grid grid-cols-2 gap-6 max-w-xl mx-auto w-full">
            <ApexButton className="h-20 text-2xl italic uppercase" onClick={() => setTimer(0)}>{phase === 'work' ? 'FINISH' : 'SKIP'}</ApexButton>
            <ApexButton variant="outline" className="h-20" onClick={() => setIsRunning(!isRunning)}>{isRunning ? <Pause size={32}/> : <Play size={32} className="translate-x-1"/>}</ApexButton>
         </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 p-6 pt-12 pb-40" dir="rtl">
      <header className="flex justify-between items-end mb-12 px-4">
         <div>
            <h2 className="text-5xl font-black italic uppercase leading-none tracking-tighter">REACHER<br/>APEX</h2>
            <div className="flex items-center gap-2 text-teal-500 font-black text-[10px] tracking-widest mt-2 uppercase">
              <div className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-ping" />
              Operational
            </div>
         </div>
         <ApexButton variant="outline" size="icon" onClick={() => window.open('spotify://', '_blank')}><Music/></ApexButton>
      </header>

      <div className="flex bg-slate-900/80 p-2 rounded-[2rem] w-full max-w-md mx-auto mb-12 border border-white/5">
         <button onClick={() => setTab("dashboard")} className={`flex-1 py-4 rounded-[1.5rem] font-black text-[11px] uppercase transition ${tab === 'dashboard' ? 'bg-white text-slate-950' : 'text-slate-500'}`}>Dashboard</button>
         <button onClick={() => setTab("vault")} className={`flex-1 py-4 rounded-[1.5rem] font-black text-[11px] uppercase transition ${tab === 'vault' ? 'bg-white text-slate-950' : 'text-slate-500'}`}>Vault</button>
         <button onClick={() => setTab("analytics")} className={`flex-1 py-4 rounded-[1.5rem] font-black text-[11px] uppercase transition ${tab === 'analytics' ? 'bg-white text-slate-950' : 'text-slate-500'}`}>Stats</button>
      </div>

      {tab === "dashboard" && (
        <div className="space-y-12">
           <div className="grid grid-cols-2 gap-4">
              {Object.keys(muscleGroupImages).map((m: any) => (
                <div key={m} onClick={() => { setFilter(m); setTab("vault"); }} className="relative h-44 rounded-[2.5rem] overflow-hidden border border-white/5 group cursor-pointer">
                   <img src={muscleGroupImages[m as MuscleGroup]} className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-50 transition-all duration-700" />
                   <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent" />
                   <div className="absolute bottom-6 right-6 text-right">
                      <p className="text-[10px] font-black text-teal-500 uppercase tracking-widest mb-1">Muscle Group</p>
                      <span className="text-2xl font-black italic uppercase tracking-tighter">{muscleHebrew[m]}</span>
                   </div>
                </div>
              ))}
           </div>
           {sessionList.length > 0 && (
             <ApexCard className="p-8 border-teal-500/30 bg-teal-500/5">
                <div className="flex justify-between items-center mb-6">
                   <h3 className="text-2xl font-black italic uppercase">Current Session</h3>
                   <ApexBadge variant="teal">{sessionList.length} תרגילים</ApexBadge>
                </div>
                <div className="space-y-2 mb-8">
                   {sessionList.map((ex, i) => (
                     <div key={i} className="bg-black/40 p-4 rounded-2xl flex justify-between items-center border border-white/5">
                        <span className="font-bold italic uppercase">{ex.name}</span>
                        <button onClick={() => setSessionList(p => p.filter((_, idx) => idx !== i))}><Trash2 size={16} className="text-rose-500"/></button>
                     </div>
                   ))}
                </div>
                <ApexButton variant="premium" className="w-full h-18 text-xl italic uppercase" onClick={() => { setInSession(true); setTimer(sessionList[0].work); setIsRunning(true); }}>START PROTOCOL</ApexButton>
             </ApexCard>
           )}
        </div>
      )}

      {tab === "vault" && (
        <div className="space-y-8">
           <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
              {["All", ...Object.keys(muscleHebrew)].map((m: any) => (
                <button key={m} onClick={() => setFilter(m)} className={`px-8 py-5 rounded-2xl whitespace-nowrap font-black text-[10px] uppercase transition-all ${filter === m ? 'bg-teal-500 text-slate-950' : 'bg-slate-900 text-slate-500'}`}>{muscleHebrew[m] || m}</button>
              ))}
           </div>
           <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {MASTER_VAULT.filter(ex => filter === "All" || ex.muscleGroup === filter).map(ex => (
                <ApexCard key={ex.id} className="p-6 space-y-6">
                   <div className="h-56 relative rounded-[2rem] overflow-hidden bg-black/40">
                      <img src={ex.imageUrl} className="w-full h-full object-cover opacity-40 group-hover:scale-110 transition-all duration-1000" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent" />
                      <div className="absolute bottom-4 right-4 flex gap-3">
                         <ApexButton variant="outline" size="icon" className="h-12 w-12 bg-black/40" onClick={() => window.open(ex.videoUrl)}><Youtube className="text-rose-500"/></ApexButton>
                         <ApexButton variant="premium" size="icon" className="h-12 w-12" onClick={() => setSessionList(p => [...p, ex])}><Plus/></ApexButton>
                      </div>
                      <div className="absolute top-4 right-4"><ApexBadge variant={ex.difficulty === 'Elite' ? 'elite' : 'teal'}>{ex.difficulty}</ApexBadge></div>
                   </div>
                   <div className="space-y-2">
                      <h4 className="text-3xl font-black italic uppercase tracking-tighter leading-none">{ex.name}</h4>
                      <p className="text-slate-400 text-sm font-medium leading-relaxed italic">{ex.he}</p>
                   </div>
                   <div className="flex justify-between border-t border-white/5 pt-6">
                      <div className="flex gap-6">
                         <div className="text-center"><p className="text-[9px] uppercase font-black text-slate-600 mb-1">Sets</p><p className="text-xl font-black italic">{ex.sets}</p></div>
                         <div className="text-center"><p className="text-[9px] uppercase font-black text-slate-600 mb-1">Reps</p><p className="text-xl font-black italic">{ex.reps}</p></div>
                      </div>
                      <ApexBadge>{categoryHebrew[ex.category]}</ApexBadge>
                   </div>
                </ApexCard>
              ))}
           </div>
        </div>
      )}

      {tab === "analytics" && (
        <div className="text-center py-20 space-y-6">
           <div className="w-24 h-24 bg-teal-500/10 rounded-full flex items-center justify-center mx-auto text-teal-500"><BarChart3 size={48} /></div>
           <div className="space-y-2">
              <h3 className="text-3xl font-black italic uppercase">Data Harvesting</h3>
              <p className="text-slate-500 font-bold uppercase tracking-[0.4em] text-xs">Collecting performance metrics...</p>
           </div>
        </div>
      )}

      {/* Nav */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[200] w-full max-w-lg px-8">
         <div className="bg-slate-900/90 backdrop-blur-3xl border border-white/10 p-5 rounded-[3rem] flex justify-around items-center shadow-[0_30px_60px_rgba(0,0,0,0.8)]">
            <button onClick={() => setTab("dashboard")} className={`p-5 rounded-3xl transition-all ${tab === 'dashboard' ? 'bg-teal-500 text-slate-950 shadow-lg' : 'text-slate-600'}`}><Home size={28}/></button>
            <button onClick={() => setTab("vault")} className={`p-5 rounded-3xl transition-all ${tab === 'vault' ? 'bg-teal-500 text-slate-950 shadow-lg' : 'text-slate-600'}`}><LayoutGrid size={28}/></button>
            <button onClick={() => setTab("analytics")} className={`p-5 rounded-3xl transition-all ${tab === 'analytics' ? 'bg-teal-500 text-slate-950 shadow-lg' : 'text-slate-600'}`}><BarChart3 size={28}/></button>
         </div>
      </div>
    </div>
  );
}

// --- INIT ---
const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(<ReacherApp />);
}

// --- APP DATA ---
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
  "הטכניקה חשובה מהמשקל. שליטה אבסולוטית בונה שריר איכותי."
];

// --- UI COMPONENTS ---
const ApexCard = ({ children, className, onClick }: any) => (
  <motion.div 
    whileHover={onClick ? { scale: 1.01 } : {}}
    onClick={onClick}
    className={`bg-slate-900/60 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] overflow-hidden transition-all ${className || ''}`}
  >
    {children}
  </motion.div>
);

const ApexButton = React.forwardRef(({ className, variant = 'default', size = 'default', children, ...props }: any, ref: any) => {
  const base = "inline-flex items-center justify-center font-black transition-all active:scale-95 disabled:opacity-50 cursor-pointer select-none";
  const variants: any = { 
    default: "bg-teal-500 text-slate-950 hover:bg-teal-400", 
    outline: "border border-white/10 bg-white/5 hover:bg-white/10 text-white/90",
    ghost: "bg-transparent text-white/40 hover:text-white",
    danger: "bg-rose-600 text-white",
    premium: "bg-gradient-to-r from-teal-500 to-indigo-600 text-white"
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

// --- MAIN APP ---
function ReacherApp() {
  const [screen, setScreen] = useState<"splash" | "main">("splash");
  const [tab, setTab] = useState<"dashboard" | "vault" | "analytics">("dashboard");
  const [vaultFilter, setVaultFilter] = useState<MuscleGroup | "All">("All");

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
  const [logs, setLogs] = useState<SetLog[]>([]);

  const audioCtx = useRef<AudioContext | null>(null);

  const playSound = (f: number) => {
    if (!audioCtx.current) audioCtx.current = new AudioContext();
    const o = audioCtx.current.createOscillator();
    const g = audioCtx.current.createGain();
    o.connect(g); g.connect(audioCtx.current.destination);
    o.frequency.value = f;
    g.gain.setValueAtTime(0.1, audioCtx.current.currentTime);
    g.gain.exponentialRampToValueAtTime(0.01, audioCtx.current.currentTime + 0.3);
    o.start(); o.stop(audioCtx.current.currentTime + 0.3);
  };

  useEffect(() => {
    let t: any;
    if (isRunning && timer > 0) {
      t = setInterval(() => setTimer(v => v - 1), 1000);
    } else if (isRunning && timer === 0) {
      const ex = sessionList[curExIdx];
      playSound(phase === "work" ? 400 : 900);
      if (phase === "work") {
        setPhase("rest"); setTimer(ex.rest);
        setTip(AI_TIPS[Math.floor(Math.random() * AI_TIPS.length)]);
      } else {
        if (curSet < ex.sets) {
          setCurSet(s => s + 1); setPhase("work"); setTimer(ex.work);
        } else if (curExIdx + 1 < sessionList.length) {
          setCurExIdx(i => i + 1); setCurSet(1); setPhase("work"); setTimer(sessionList[curExIdx+1].work);
        } else {
          setInSession(false); setIsRunning(false); alert("אימון הושלם נועם!");
        }
      }
    }
    return () => clearInterval(t);
  }, [isRunning, timer, phase]);

  const addToSession = (ex: Exercise) => setSessionList(p => [...p, ex]);

  // --- RENDERING ---

  if (screen === "splash") {
    return (
      <div className="fixed inset-0 bg-slate-950 flex flex-col items-center justify-center p-10 text-center">
        <div className="absolute inset-0 opacity-20">
          <img src={REACHER_HERO} className="w-full h-full object-cover blur-sm" />
        </div>
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="relative z-10 space-y-12">
           <h1 className="text-8xl font-black italic uppercase text-white">REACHER<br/><span className="text-teal-500">APEX</span></h1>
           <ApexButton size="lg" onClick={() => setScreen("main")}>INITIALIZE</ApexButton>
        </motion.div>
      </div>
    );
  }

  if (inSession) {
    const ex = sessionList[curExIdx];
    return (
      <div className="fixed inset-0 bg-[#020617] z-[500] flex flex-col p-6 overflow-y-auto">
         <header className="flex justify-between items-center mb-10">
            <ApexButton variant="ghost" size="icon" onClick={() => setInSession(false)}><X/></ApexButton>
            <h2 className="text-2xl font-black italic uppercase">{ex?.name}</h2>
            <div className="w-12"/>
         </header>
         <div className="flex-1 flex flex-col items-center justify-center space-y-12">
            <div className="text-center space-y-4">
              <ApexBadge variant="elite">{ex?.muscleGroup}</ApexBadge>
              <h1 className="text-7xl font-black italic uppercase">{ex?.name}</h1>
              <p className="text-slate-400 text-lg italic max-w-xl">{ex?.he}</p>
            </div>
            <div className="flex items-center gap-10">
              <div className={`h-80 w-80 rounded-full border-4 flex flex-col items-center justify-center ${phase === 'rest' ? 'border-amber-500 bg-amber-500/5' : 'border-teal-500 bg-teal-500/5'}`}>
                 <span className="text-[10rem] font-black tabular-nums">{timer}</span>
                 <span className="text-xs font-black uppercase tracking-widest">{phase === 'work' ? 'WORK' : 'REST'}</span>
              </div>
              <ApexCard className="p-8 space-y-4 w-64">
                 <input type="number" value={weight} onChange={e => setWeight(e.target.value)} placeholder="WEIGHT" className="w-full bg-black/40 p-4 rounded-xl text-center font-black outline-none border border-white/10" />
                 <input type="number" value={reps} onChange={e => setReps(e.target.value)} placeholder="REPS" className="w-full bg-black/40 p-4 rounded-xl text-center font-black outline-none border border-white/10" />
                 <ApexButton className="w-full" onClick={() => { setWeight(""); setReps(""); playSound(800); }}>LOG SET</ApexButton>
              </ApexCard>
            </div>
            {phase === 'rest' && <p className="text-teal-400 font-bold text-xl italic text-center max-w-lg">"{tip}"</p>}
         </div>
         <div className="pb-10 grid grid-cols-2 gap-6 max-w-xl mx-auto w-full">
            <ApexButton className="h-20 text-2xl italic" onClick={() => setTimer(0)}>{phase === 'work' ? 'FINISH SET' : 'SKIP REST'}</ApexButton>
            <ApexButton variant="outline" className="h-20" onClick={() => setIsRunning(!isRunning)}>{isRunning ? <Pause size={32}/> : <Play size={32}/>}</ApexButton>
         </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 p-6 pt-12 pb-40" dir="rtl">
      <header className="flex justify-between items-end mb-12 px-4">
         <div>
            <h2 className="text-5xl font-black italic uppercase leading-none">REACHER<br/>APEX</h2>
            <div className="text-teal-500 font-black text-[10px] tracking-widest mt-2 uppercase">System Status: Online</div>
         </div>
         <ApexButton variant="outline" size="icon" onClick={() => window.open('spotify://', '_blank')}><Music/></ApexButton>
      </header>

      <div className="flex bg-slate-900/80 p-2 rounded-[2rem] w-full max-w-md mx-auto mb-12 border border-white/5">
         <button onClick={() => setTab("dashboard")} className={`flex-1 py-4 rounded-[1.5rem] font-black text-[11px] uppercase ${tab === 'dashboard' ? 'bg-white text-slate-950' : 'text-slate-500'}`}>Dashboard</button>
         <button onClick={() => setTab("vault")} className={`flex-1 py-4 rounded-[1.5rem] font-black text-[11px] uppercase ${tab === 'vault' ? 'bg-white text-slate-950' : 'text-slate-500'}`}>Vault</button>
         <button onClick={() => setTab("analytics")} className={`flex-1 py-4 rounded-[1.5rem] font-black text-[11px] uppercase ${tab === 'analytics' ? 'bg-white text-slate-950' : 'text-slate-500'}`}>Stats</button>
      </div>

      {tab === "dashboard" && (
        <div className="space-y-12">
           <div className="grid grid-cols-2 gap-4">
              {Object.keys(muscleGroupImages).map((m: any) => (
                <div key={m} onClick={() => { setVaultFilter(m); setTab("vault"); }} className="relative h-40 rounded-[2rem] overflow-hidden border border-white/5 group cursor-pointer">
                   <img src={muscleGroupImages[m as MuscleGroup]} className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-60 transition-all" />
                   <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent" />
                   <div className="absolute bottom-4 right-4"><span className="text-lg font-black italic uppercase">{muscleHebrew[m]}</span></div>
                </div>
              ))}
           </div>
           {sessionList.length > 0 && (
             <ApexCard className="p-8 border-teal-500/30 bg-teal-500/5">
                <div className="flex justify-between items-center mb-6">
                   <h3 className="text-2xl font-black italic uppercase">Current Session</h3>
                   <ApexBadge variant="teal">{sessionList.length} Exercises</ApexBadge>
                </div>
                <div className="space-y-2 mb-8">
                   {sessionList.map((ex, i) => <div key={i} className="bg-black/40 p-3 rounded-xl flex justify-between"><span>{ex.name}</span><button onClick={() => setSessionList(p => p.filter((_, idx) => idx !== i))}><Trash2 size={14} className="text-rose-500"/></button></div>)}
                </div>
                <ApexButton variant="premium" className="w-full h-16 text-xl italic" onClick={() => { setInSession(true); setTimer(sessionList[0].work); setIsRunning(true); }}>START PROTOCOL</ApexButton>
             </ApexCard>
           )}
        </div>
      )}

      {tab === "vault" && (
        <div className="space-y-8">
           <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
              {["All", ...Object.keys(muscleHebrew)].map((m: any) => (
                <button key={m} onClick={() => setVaultFilter(m)} className={`px-6 py-4 rounded-2xl whitespace-nowrap font-black text-[10px] uppercase transition-all ${vaultFilter === m ? 'bg-teal-500 text-slate-950' : 'bg-slate-900 text-slate-500'}`}>{muscleHebrew[m] || m}</button>
              ))}
           </div>
           <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {MASTER_VAULT.filter(ex => vaultFilter === "All" || ex.muscleGroup === vaultFilter).map(ex => (
                <ApexCard key={ex.id} className="p-6 space-y-4">
                   <div className="h-48 relative rounded-2xl overflow-hidden">
                      <img src={ex.imageUrl} className="w-full h-full object-cover opacity-50" />
                      <div className="absolute bottom-2 right-2 flex gap-2">
                         <ApexButton variant="outline" size="icon" className="h-10 w-10 bg-black/40" onClick={() => window.open(ex.videoUrl)}><Youtube className="text-rose-500"/></ApexButton>
                         <ApexButton variant="premium" size="icon" className="h-10 w-10" onClick={() => addToSession(ex)}><Plus/></ApexButton>
                      </div>
                   </div>
                   <h4 className="text-2xl font-black italic uppercase">{ex.name}</h4>
                   <p className="text-slate-400 text-xs italic leading-relaxed">{ex.he}</p>
                   <div className="flex justify-between border-t border-white/5 pt-4">
                      <div className="flex gap-4">
                         <div className="text-center"><p className="text-[8px] uppercase text-slate-500">Sets</p><p className="font-black italic">{ex.sets}</p></div>
                         <div className="text-center"><p className="text-[8px] uppercase text-slate-500">Reps</p><p className="font-black italic">{ex.reps}</p></div>
                      </div>
                      <ApexBadge>{categoryHebrew[ex.category]}</ApexBadge>
                   </div>
                </ApexCard>
              ))}
           </div>
        </div>
      )}

      {tab === "analytics" && (
        <div className="text-center py-20">
           <BarChart3 size={64} className="mx-auto text-slate-800 mb-6" />
           <h3 className="text-2xl font-black italic uppercase">Analytics Operational</h3>
           <p className="text-slate-500 font-bold uppercase mt-2">Collecting performance data...</p>
        </div>
      )}

      {/* Nav */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[200] w-full max-w-lg px-8">
         <div className="bg-slate-900/90 backdrop-blur-3xl border border-white/10 p-5 rounded-[3rem] flex justify-around items-center shadow-2xl">
            <button onClick={() => setTab("dashboard")} className={`p-5 rounded-3xl transition-all ${tab === 'dashboard' ? 'bg-teal-500 text-slate-950' : 'text-slate-600'}`}><Home size={28}/></button>
            <button onClick={() => setTab("vault")} className={`p-5 rounded-3xl transition-all ${tab === 'vault' ? 'bg-teal-500 text-slate-950' : 'text-slate-600'}`}><LayoutGrid size={28}/></button>
            <button onClick={() => setTab("analytics")} className={`p-5 rounded-3xl transition-all ${tab === 'analytics' ? 'bg-teal-500 text-slate-950' : 'text-slate-600'}`}><BarChart3 size={28}/></button>
         </div>
      </div>
    </div>
  );
}

// --- INIT ---
const root = document.getElementById("root");
if (root) createRoot(root).render(<ReacherApp />);
