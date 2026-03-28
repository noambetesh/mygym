import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { createRoot } from "react-dom/client";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play, Pause, RotateCcw, SkipForward, SkipBack, Dumbbell, Flame, Clock3,
  CheckCircle2, Youtube, TimerReset, Volume2, VolumeX, Home, ListChecks,
  Swords, Trophy, Activity, CalendarDays, Weight, Eye,
  Sparkles, X, Send, MessageCircle, ExternalLink, TrendingUp, RefreshCcw, AlertTriangle, Plus, Zap, Cpu, Target, Music,
  ChevronRight, Info, History, ShieldCheck, ZapOff, ArrowRightLeft, LayoutGrid, List, Search, Save, Trash2, Edit3, User, BarChart3, HeartPulse
} from "lucide-react";

/**
 * REACHER APEX PLATINUM v20.0 - THE FINAL ARCHITECTURE
 * ENGINEERED FOR NOAM.
 * 80+ EXERCISES // TECHNICAL HEBREW // ZERO QUOTES // FULL LOGGING
 */

const REACHER_HERO = "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1600";

// --- GLOBAL TYPES ---
type MuscleGroup = "Back" | "Chest" | "Legs" | "Glutes"  "Shoulders" | "Arms" | "Core" | "FullBody";
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

interface SessionData {
  id: string;
  date: string;
  volume: number;
  exercises: number;
}

// --- MASSIVE DATASET: THE APEX VAULT (80 EXERCISES) ---

const MASTER_VAULT: Exercise[] = [
  // --- BACK (15) ---
  { id: "b1", name: "Meadows Row", sets: 4, reps: "10-12", he: "עמוד בניצב למוט חופשי. אחוז בקצה המוט ביד אחת. שמור על גב מקביל לרצפה ומשוך את המוט לכיוון המותן תוך הוצאת מרפק החוצה. התרגיל בונה עובי משמעותי בגב העליון והלטים.", work: 45, rest: 90, category: "pull", muscleGroup: "Back", videoUrl: "https://www.youtube.com/watch?v=2v-re_6_23w", imageUrl: "https://images.unsplash.com/photo-1603287611837-f2146f5de8e8?q=80&w=800", difficulty: "Advanced" },
  { id: "b2", name: "Weighted Pull-Ups", sets: 4, reps: "6-8", he: "השתמש בחגורת משקולות. אחוז במוט ברוחב כתפיים. משוך את עצמך עד שהסנטר עובר את המוט. התנועה בונה את רוחב הגב ומחזקת את כוח המשיכה הבסיסי.", work: 40, rest: 120, category: "pull", muscleGroup: "Back", videoUrl: "https://www.youtube.com/watch?v=p1qV6WfI7eQ", imageUrl: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?q=80&w=800", difficulty: "Elite" },
  { id: "b3", name: "Iliac Lat Pulldown", sets: 3, reps: "12-15", he: "משיכה מצד אחד תוך הטיית הגוף. המטרה היא להביא את המרפק עמוק לכיוון האגן כדי לבודד את סיבי הלטיסימוס התחתונים.", work: 35, rest: 75, category: "pull", muscleGroup: "Back", videoUrl: "https://www.youtube.com/watch?v=f-V9_H9_z8A", imageUrl: "https://images.unsplash.com/photo-1590239068512-0f3eff9cca18?q=80&w=800", difficulty: "Advanced" },
  { id: "b4", name: "T-Bar Row", sets: 3, reps: "10", he: "הצמד את החזה לכרית. אחוז בידיות ומשוך לכיוון השכמות. תרגיל זה מנטרל את הגב התחתון ומאפשר בידוד מוחלט של הגב העליון.", work: 40, rest: 90, category: "pull", muscleGroup: "Back", videoUrl: "https://www.youtube.com/watch?v=j3Igk5nyZE4", imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800", difficulty: "Standard" },
  { id: "b5", name: "Rack Pulls", sets: 4, reps: "5-8", he: "משיכת מוט מהכלוב החל מגובה הברך. בונה גב תחתון וזוקפים חזקים כמו בטון. תרגיל ליבה לבניית כוח אבסולוטי.", work: 30, rest: 150, category: "pull", muscleGroup: "Back", videoUrl: "https://www.youtube.com/watch?v=rackpulls", imageUrl: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=800", difficulty: "Elite" },
  { id: "b6", name: "Seal Row", sets: 3, reps: "10-12", he: "שכיבה על ספסל מוגבה ומשיכת מוט מלמטה. מנטרל לחלוטין את הרגליים והמומנטום. הדרך הטובה ביותר לבודד את הגב ללא לחץ על עמוד השדרה.", work: 40, rest: 90, category: "pull", muscleGroup: "Back", videoUrl: "https://www.youtube.com/watch?v=sealrow", imageUrl: "https://images.unsplash.com/photo-1603287611837-f2146f5de8e8?q=80&w=800", difficulty: "Advanced" },
  { id: "b7", name: "Lat Prayer", sets: 3, reps: "15", he: "משיכה עם ידיים ישרות בפולי עליון. תרגיל בידוד מושלם ללטים שמלמד איך להשתמש בגב ללא מעורבות של הבייספס.", work: 35, rest: 60, category: "isolation", muscleGroup: "Back", videoUrl: "https://www.youtube.com/watch?v=latprayer", imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800", difficulty: "Standard" },
  { id: "b8", name: "Pendlay Row", sets: 4, reps: "8", he: "חתירה מתפרצת מהרצפה כאשר הגב מקביל לחלוטין לקרקע. המוט חוזר לרצפה בכל חזרה. בונה כוח מתפרץ ושליטה בשכמות.", work: 45, rest: 120, category: "pull", muscleGroup: "Back", videoUrl: "https://www.youtube.com/watch?v=pendlayrow", imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800", difficulty: "Elite" },
  { id: "b9", name: "Kroc Rows", sets: 3, reps: "20+", he: "חתירה עם משקולת כבדה מאוד בסטים של חזרות גבוהות. שימוש במומנטום מבוקר. התרגיל בונה אחיזה חזקה וגב עליון רחב ועוצמתי.", work: 60, rest: 120, category: "pull", muscleGroup: "Back", videoUrl: "https://www.youtube.com/watch?v=krocrow", imageUrl: "https://images.unsplash.com/photo-1603287611837-f2146f5de8e8?q=80&w=800", difficulty: "Elite" },
  { id: "b10", name: "Snatch Grip High Pull", sets: 4, reps: "6", he: "משיכה מהירה של המוט עד גובה החזה באחיזה רחבה מאוד. תרגיל כוח מתפרץ שעובד על הטרפזים והכתפיים האחוריות בעוצמה גבוהה.", work: 30, rest: 150, category: "power", muscleGroup: "Back", videoUrl: "https://www.youtube.com/watch?v=snatchpull", imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800", difficulty: "Elite" },
  { id: "b11", name: "Incline DB Row", sets: 3, reps: "12", he: "שכיבה על ספסל בשיפוע עם הפנים למטה. משיכת משקולות תוך כדי הצמדת השכמות. מבודד את הגב העליון ומנטרל לחלוטין את הגב התחתון.", work: 40, rest: 90, category: "pull", muscleGroup: "Back", videoUrl: "https://www.youtube.com/watch?v=inclinerow", imageUrl: "https://images.unsplash.com/photo-1603287611837-f2146f5de8e8?q=80&w=800", difficulty: "Advanced" },
  { id: "b12", name: "Barbell Pullover", sets: 3, reps: "12", he: "מתיחת המוט מעבר לראש בשכיבה על ספסל. עובד על הלטים ומרחיב את כלוב הצלעות. דגש על נשימה עמוקה בשלב המתיחה.", work: 40, rest: 75, category: "pull", muscleGroup: "Back", videoUrl: "https://www.youtube.com/watch?v=pullover", imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800", difficulty: "Standard" },
  { id: "b13", name: "Chin-Ups", sets: 3, reps: "10", he: "עליות מתח באחיזה הפוכה וצרה. מדגיש את הבייספס ואת הלטים התחתונים. הקפד על טווח תנועה מלא ומתיחה בתחתית.", work: 40, rest: 90, category: "pull", muscleGroup: "Back", videoUrl: "https://www.youtube.com/watch?v=chinups", imageUrl: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?q=80&w=800", difficulty: "Standard" },
  { id: "b14", name: "Renegade Row", sets: 3, reps: "10/side", he: "מצב פלאנק על משקולות וחתירה לסירוגין. תרגיל מטורף לליבה ולגב. שמור על אגן יציב ללא סיבוב הגוף.", work: 50, rest: 90, category: "power", muscleGroup: "Back", videoUrl: "https://www.youtube.com/watch?v=renegaderow", imageUrl: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=800", difficulty: "Advanced" },
  { id: "b15", name: "Deadlift (Conventional)", sets: 3, reps: "5", he: "הרמת המוט מהרצפה תוך שימוש בכל הגוף. בונה כוח בסיסי, זוקפי גב ורגליים עוצמתיות. התרגיל הכי חשוב לבניית כוח אבסולוטי.", work: 45, rest: 180, category: "power", muscleGroup: "Back", videoUrl: "https://www.youtube.com/watch?v=deadlift", imageUrl: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=800", difficulty: "Elite" },

  // --- CHEST (15) ---
  { id: "c1", name: "Low-Incline DB Press", sets: 4, reps: "8-10", he: "לחיצת משקולות בשיפוע קל של 15-30 מעלות. השיפוע הנמוך מאפשר גיוס מקסימלי של החזה העליון תוך שמירה על בריאות הכתף.", work: 45, rest: 100, category: "push", muscleGroup: "Chest", videoUrl: "https://www.youtube.com/watch?v=8iP_u5h_8E0", imageUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=800", difficulty: "Advanced" },
  { id: "c2", name: "Weighted Dips", sets: 4, reps: "8-12", he: "מקבילים עם תוספת משקל. הטה את הגוף קדימה כדי להעביר את העומס מהטריספס לחזה התחתון והאמצעי.", work: 40, rest: 100, category: "push", muscleGroup: "Chest", videoUrl: "https://www.youtube.com/watch?v=2z8JmcrW-As", imageUrl: "https://images.unsplash.com/photo-1534367957981-2940263f382a?q=80&w=800", difficulty: "Elite" },
  { id: "c3", name: "Converging Press", sets: 3, reps: "10-12", he: "לחיצה במכונה שבה הידיות מתקרבות אחת לשנייה בשיא התנועה. מאפשר סחיטה מקסימלית של סיבי החזה הפנימיים.", work: 40, rest: 90, category: "push", muscleGroup: "Chest", videoUrl: "https://www.youtube.com/watch?v=convergingpress", imageUrl: "https://images.unsplash.com/photo-1591741535018-d042766c62eb?q=80&w=800", difficulty: "Standard" },
  { id: "c4", name: "Floor Press", sets: 3, reps: "8", he: "לחיצה בשכיבה על הרצפה. עוצר את התנועה ב-90 מעלות במרפקים. מצוין לשיפור כוח הנעילה ומניעת פציעות כתף.", work: 40, rest: 90, category: "push", muscleGroup: "Chest", videoUrl: "https://www.youtube.com/watch?v=floorpress", imageUrl: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=800", difficulty: "Advanced" },
  { id: "c5", name: "Cable Flyes", sets: 3, reps: "15", he: "משיכת כבלים מלמעלה למטה. מתמקד בחלק התחתון והחיצוני של החזה. שמור על חזה נפוח וכתפיים משוכות לאחור.", work: 35, rest: 60, category: "isolation", muscleGroup: "Chest", videoUrl: "https://www.youtube.com/watch?v=cableflyes", imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800", difficulty: "Standard" },
  { id: "c6", name: "Hex Press", sets: 3, reps: "12", he: "הצמד את המשקולות אחת לשנייה לאורך כל הלחיצה. יוצר מתח תמידי בחלק המרכזי של החזה.", work: 35, rest: 75, category: "isolation", muscleGroup: "Chest", videoUrl: "https://www.youtube.com/watch?v=hexpress", imageUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=800", difficulty: "Standard" },
  { id: "c7", name: "Flat Bench Press", sets: 4, reps: "6-8", he: "לחיצת חזה קלאסית עם מוט. התרגיל הבסיסי ביותר לבניית מסה וכוח בחזה האמצעי והכללי.", work: 45, rest: 120, category: "push", muscleGroup: "Chest", videoUrl: "https://www.youtube.com/watch?v=benchpress", imageUrl: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=800", difficulty: "Advanced" },
  { id: "c8", name: "Guillotine Press", sets: 3, reps: "10", he: "לחיצת חזה שבה המוט יורד לכיוון הצוואר. תרגיל מתקדם שמבודד את סיבי החזה העליונים בצורה קיצונית. דורש שליטה.", work: 45, rest: 100, category: "push", muscleGroup: "Chest", videoUrl: "https://www.youtube.com/watch?v=guillotine", imageUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=800", difficulty: "Elite" },
  { id: "c9", name: "Low-To-High Cable Fly", sets: 3, reps: "15", he: "משיכת כבלים מלמטה למעלה לכיוון הפנים. התרגיל הטוב ביותר לעיצוב ובידוד החזה העליון.", work: 35, rest: 60, category: "isolation", muscleGroup: "Chest", videoUrl: "https://www.youtube.com/watch?v=lowtohigh", imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800", difficulty: "Standard" },
  { id: "c10", name: "Landmine Chest Press", sets: 3, reps: "10-12", he: "דחיפת המוט באלכסון מלמטה למעלה. בונה כוח מתפרץ בחזה העליון ומגן על מפרק הכתף. מעולה לסיום אימון.", work: 40, rest: 90, category: "push", muscleGroup: "Chest", videoUrl: "https://www.youtube.com/watch?v=landminepress", imageUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=800", difficulty: "Advanced" },
  { id: "c11", name: "Pec Deck Fly", sets: 3, reps: "15", he: "בידוד חזה במכונה. הקפד על סחיטה מקסימלית של הידיות במרכז ושחרור איטי למתיחה עמוקה של הסיבים.", work: 30, rest: 60, category: "isolation", muscleGroup: "Chest", videoUrl: "https://www.youtube.com/watch?v=pecdeck", imageUrl: "https://images.unsplash.com/photo-1591741535018-d042766c62eb?q=80&w=800", difficulty: "Standard" },
  { id: "c12", name: "Push-Ups (Weighted)", sets: 3, reps: "Max", he: "שכיבות סמיכה קלאסיות עם פלטה על הגב. בונה סיבולת שריר וכוח בסיסי בחזה ובליבה בצורה פונקציונלית.", work: 45, rest: 75, category: "push", muscleGroup: "Chest", videoUrl: "https://www.youtube.com/watch?v=weightedpushups", imageUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=800", difficulty: "Standard" },
  { id: "c13", name: "Incline Barbell Press", sets: 4, reps: "6-8", he: "לחיצת מוט בשיפוע חיובי. בונה את מסת החזה העליון בצורה הבסיסית והאפקטיבית ביותר.", work: 45, rest: 120, category: "push", muscleGroup: "Chest", videoUrl: "https://www.youtube.com/watch?v=inclinebarbell", imageUrl: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=800", difficulty: "Advanced" },
  { id: "c14", name: "Svend Press", sets: 3, reps: "20", he: "הצמדת שתי פלטות משקולת בין הידיים ודחיפה קדימה תוך כיווץ חזק. תרגיל סיום מעולה להזרמת דם ופאמפ.", work: 30, rest: 45, category: "isolation", muscleGroup: "Chest", videoUrl: "https://www.youtube.com/watch?v=svendpress", imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800", difficulty: "Standard" },
  { id: "c15", name: "Spoto Press", sets: 4, reps: "5", he: "לחיצת חזה עם עצירה של שנייה סנטימטר מעל החזה. בונה כוח מתפרץ ויציבות אדירה בלחיצה תחת עומס.", work: 40, rest: 150, category: "push", muscleGroup: "Chest", videoUrl: "https://www.youtube.com/watch?v=spotopress", imageUrl: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=800", difficulty: "Elite" },

  // --- LEGS (15) ---
  { id: "l1", name: "Zercher Squat", sets: 4, reps: "8-10", he: "החזק את המוט בעיקולי המרפקים מול החזה. רד עמוק. בונה רגליים וליבה של לוחם. דורש יציבות מטורפת.", work: 50, rest: 150, category: "legs", muscleGroup: "Legs", videoUrl: "https://www.youtube.com/watch?v=U2OKweR-N-g", imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800", difficulty: "Elite" },
  { id: "l2", name: "Bulgarian Split Squat", sets: 3, reps: "10/leg", he: "רגל אחת על ספסל מאחור. רד עד שהברך האחורית נוגעת ברצפה. התרגיל הכי אפקטיבי לבידוד קוואדס ויציבות.", work: 45, rest: 90, category: "legs", muscleGroup: "Legs", videoUrl: "https://www.youtube.com/watch?v=2C-uNgKwPLE", imageUrl: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=800", difficulty: "Advanced" },
  { id: "l3", name: "Romanian Deadlift", sets: 4, reps: "10-12", he: "מוט צמוד לרגליים, גב ישר, מתיחה מקסימלית של ההמסטרינג בירידה. בונה את כל השרשרת האחורית.", work: 45, rest: 100, category: "legs", muscleGroup: "Legs", videoUrl: "https://www.youtube.com/watch?v=jEy_czb3qwA", imageUrl: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=800", difficulty: "Advanced" },
  { id: "l4", name: "Nordic Curl", sets: 3, reps: "5-8", he: "בלום את עצמך בירידה איטית לכיוון הרצפה רק בעזרת הרגליים. המלך של תרגילי ההמסטרינג למניעת פציעות.", work: 30, rest: 120, category: "legs", muscleGroup: "Legs", videoUrl: "https://www.youtube.com/watch?v=nordiccurl", imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800", difficulty: "Elite" },
  { id: "l5", name: "Kas Glute Bridge", sets: 3, reps: "12-15", he: "טווח תנועה קטן וממוקד לישבן על ספסל. סחיטה חזקה בשיא התנועה. בונה ישבן חזק ומעוצב.", work: 40, rest: 90, category: "legs", muscleGroup: "Legs", videoUrl: "https://www.youtube.com/watch?v=kasbridge", imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=800", difficulty: "Standard" },
  { id: "l6", name: "Hack Squat", sets: 4, reps: "8-10", he: "סקוואט במכונה ייעודית המאפשרת ירידה עמוקה מאוד עם תמיכה מלאה לגב. מיקוד מוחלט בקוואדס.", work: 45, rest: 120, category: "legs", muscleGroup: "Legs", videoUrl: "https://www.youtube.com/watch?v=hacksquat", imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800", difficulty: "Advanced" },
  { id: "l7", name: "Leg Press (High Foot)", sets: 4, reps: "12-15", he: "הנח את הרגליים בחלק העליון של הפלטה. דחיפה מהעקבים. מעביר את הדגש מהקוואדס לישבן ולהמסטרינג.", work: 45, rest: 90, category: "legs", muscleGroup: "Legs", videoUrl: "https://www.youtube.com/watch?v=legpress", imageUrl: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=800", difficulty: "Standard" },
  { id: "l8", name: "Walking Lunges", sets: 3, reps: "20 Steps", he: "צעדי מכרע קדימה עם משקולות. בונה כוח דינמי וסיבולת שריר בירכיים ובישבן. שמור על גב זקוף.", work: 60, rest: 90, category: "legs", muscleGroup: "Legs", videoUrl: "https://www.youtube.com/watch?v=walkinglunges", imageUrl: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=800", difficulty: "Standard" },
  { id: "l9", name: "Goblet Squat (Cyclist)", sets: 3, reps: "15", he: "סקוואט עם עקבים מוגבהים ומשקולת מול החזה. ירידה עמוקה מאוד למיקוד אגרסיבי בשריר הקוואדס.", work: 40, rest: 75, category: "legs", muscleGroup: "Legs", videoUrl: "https://www.youtube.com/watch?v=cyclistsquat", imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800", difficulty: "Advanced" },
  { id: "l10", name: "Stiff-Legged Deadlift", sets: 4, reps: "8-10", he: "מוט יורד לאט קרוב לרגליים עם ברכיים כמעט ישרות. דגש על מתיחה מקסימלית של ההמסטרינג והזוקפים.", work: 45, rest: 120, category: "pull", muscleGroup: "Legs", videoUrl: "https://www.youtube.com/watch?v=stiffdeadlift", imageUrl: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=800", difficulty: "Elite" },
  { id: "l11", name: "Standing Calf Raises", sets: 4, reps: "20", he: "הרמת עקבים בעמידה עם משקל כבד. סחיטה בשיא הכיווץ ומתיחה מלאה בתחתית. בונה שוקיים חזקים.", work: 30, rest: 60, category: "isolation", muscleGroup: "Legs", videoUrl: "https://www.youtube.com/watch?v=standingcalf", imageUrl: "https://images.unsplash.com/photo-1434682881908-b43d0467b798?q=80&w=800", difficulty: "Standard" },
  { id: "l12", name: "Seated Leg Extension", sets: 3, reps: "20", he: "פשיטת רגליים במכונה. בידוד מושלם לקוואדס. סחוט את השריר בשיא התנועה ורד לאט ובשליטה.", work: 30, rest: 60, category: "isolation", muscleGroup: "Legs", videoUrl: "https://www.youtube.com/watch?v=legext", imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800", difficulty: "Standard" },
  { id: "l13", name: "Box Squat", sets: 4, reps: "6", he: "סקוואט עד לישיבה על קופסה ועצירה. בונה כוח מתפרץ אדיר מהמקום הנמוך ביותר ללא מומנטום.", work: 45, rest: 150, category: "legs", muscleGroup: "Legs", videoUrl: "https://www.youtube.com/watch?v=boxsquat", imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800", difficulty: "Advanced" },
  { id: "l14", name: "Adductor Machine", sets: 3, reps: "15", he: "קירוב ירכיים במכונה. מחזק את השרירים המקרבים בירך הפנימית ומונע פציעות במפרק הירך.", work: 30, rest: 60, category: "isolation", muscleGroup: "Legs", videoUrl: "https://www.youtube.com/watch?v=adductor", imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800", difficulty: "Standard" },
  { id: "l15", name: "Step-Ups (High Box)", sets: 3, reps: "12/leg", he: "עלייה על קופסה גבוהה עם משקולות. בונה כוח חד צדדי ויציבות ליבה מטורפת. דגש על דחיפת העקב.", work: 45, rest: 75, category: "legs", muscleGroup: "Legs", videoUrl: "https://www.youtube.com/watch?v=highstepups", imageUrl: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=800", difficulty: "Standard" },

{ id: "g1", name: "Barbell Hip Thrust", sets: 4, reps: "8-12", he: "השען על ספסל, הנח מוט על האגן ודחוף את האגן למעלה עד כיווץ מלא. תרגיל בסיס חזק מאוד לישבן.", work: 45, rest: 90, category: "legs", muscleGroup: "Glutes", videoUrl: "https://www.youtube.com/results?search_query=Barbell+Hip+Thrust", imageUrl: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=800", difficulty: "Advanced" },

{ id: "g2", name: "Cable Glute Kickback", sets: 3, reps: "15/leg", he: "פשיטת ירך לאחור בכבל עם שליטה מלאה וסחיטה בשיא. בידוד מצוין לישבן.", work: 35, rest: 60, category: "isolation", muscleGroup: "Glutes", videoUrl: "https://www.youtube.com/results?search_query=Cable+Glute+Kickback", imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=800", difficulty: "Standard" },

{ id: "g3", name: "Frog Pumps", sets: 3, reps: "20-25", he: "שכיבה על הגב, כפות רגליים צמודות וברכיים פתוחות, דחיפת אגן מהירה למעלה. פאמפ חזק לישבן.", work: 30, rest: 45, category: "isolation", muscleGroup: "Glutes", videoUrl: "https://www.youtube.com/results?search_query=Frog+Pumps", imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=800", difficulty: "Standard" },

{ id: "g4", name: "Romanian Deadlift (Glute Bias)", sets: 4, reps: "10", he: "RDL עם דגש חזק על דחיפת האגן לאחור ועבודה דרך הישבן. שמור על גב יציב.", work: 45, rest: 100, category: "legs", muscleGroup: "Glutes", videoUrl: "https://www.youtube.com/results?search_query=Romanian+Deadlift+Glute+Bias", imageUrl: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=800", difficulty: "Advanced" },
  
  // --- SHOULDERS (15) ---
  { id: "s1", name: "Z-Press", sets: 4, reps: "8-10", he: "לחיצת כתפיים בישיבה על הרצפה. מנטרל את הרגליים ומאלץ את הכתפיים והבטן לעבוד ב-100% מהזמן.", work: 45, rest: 120, category: "armor", muscleGroup: "Shoulders", videoUrl: "https://www.youtube.com/watch?v=0_fL9S0v00A", imageUrl: "https://images.unsplash.com/photo-1591741535018-d042766c62eb?q=80&w=800", difficulty: "Elite" },
  { id: "s2", name: "Lu Raises", sets: 3, reps: "15", he: "הרמה צידית מלאה עד מעל הראש. בונה ניידות וכתפיים רחבות בצורה יוצאת דופן ומכסה את כל טווח התנועה.", work: 35, rest: 75, category: "armor", muscleGroup: "Shoulders", videoUrl: "https://www.youtube.com/watch?v=luraises", imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800", difficulty: "Advanced" },
  { id: "s3", name: "Face Pulls", sets: 4, reps: "20", he: "משיכת חבל למצח עם סיבוב חיצוני. הכרחי ליציבה ובריאות הכתף האחורית. סחט את השכמות בסוף התנועה.", work: 40, rest: 60, category: "armor", muscleGroup: "Shoulders", videoUrl: "https://www.youtube.com/watch?v=rep-qVOkqgk", imageUrl: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=800", difficulty: "Standard" },
  { id: "s4", name: "Arnold Press", sets: 3, reps: "10", he: "לחיצה עם סיבוב ידיים מחזית הגוף כלפי חוץ. עובד על כל ראשי הכתף בתנועה אחת חלקה ומבוקרת.", work: 45, rest: 90, category: "armor", muscleGroup: "Shoulders", videoUrl: "https://www.youtube.com/watch?v=arnoldpress", imageUrl: "https://images.unsplash.com/photo-1591741535018-d042766c62eb?q=80&w=800", difficulty: "Advanced" },
  { id: "s5", name: "Cable Lateral Raise", sets: 4, reps: "15", he: "הרמה צידית בכבל מאחורי הגוף. שומר על מתח תמידי לאורך כל התנועה. בונה את רוחב הכתף הצידית.", work: 35, rest: 60, category: "isolation", muscleGroup: "Shoulders", videoUrl: "https://www.youtube.com/watch?v=cablelateral", imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800", difficulty: "Standard" },
  { id: "s6", name: "Military Press", sets: 4, reps: "6", he: "לחיצת מוט בעמידה. התרגיל הבסיסי והחזק ביותר לבניית מסה וכוח בכתפיים ובליבה. שמור על גוף יציב.", work: 45, rest: 150, category: "armor", muscleGroup: "Shoulders", videoUrl: "https://www.youtube.com/watch?v=militarypress", imageUrl: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=800", difficulty: "Advanced" },
  { id: "s7", name: "Rear Delt Row", sets: 3, reps: "15", he: "חתירה בכבלים או משקולות עם מרפקים גבוהים והחוצה. מיקוד בכתף האחורית ובטרפז האמצעי.", work: 40, rest: 60, category: "isolation", muscleGroup: "Shoulders", videoUrl: "https://www.youtube.com/watch?v=reardeltrow", imageUrl: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=800", difficulty: "Standard" },
  { id: "s8", name: "Upright Row (Barbell)", sets: 3, reps: "12", he: "משיכת מוט צמוד לגוף עד גובה החזה. בונה את הראש הצידי של הכתף ואת הטרפזים העליונים.", work: 40, rest: 90, category: "armor", muscleGroup: "Shoulders", videoUrl: "https://www.youtube.com/watch?v=uprightrow", imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800", difficulty: "Standard" },
  { id: "s9", name: "Front Raise (Plate)", sets: 3, reps: "15", he: "הרמת פלטה מלפנים עד גובה העיניים. מבודד את הכתף הקדמית. שמור על גב יציב ללא תנופה מהגוף.", work: 30, rest: 60, category: "isolation", muscleGroup: "Shoulders", videoUrl: "https://www.youtube.com/watch?v=platefront", imageUrl: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=800", difficulty: "Standard" },
  { id: "s10", name: "Push Press", sets: 4, reps: "5", he: "לחיצת כתפיים מתפרצת עם עזרה קלה מהרגליים. בונה כוח אבסולוטי ויכולת ייצור כוח מתפרץ מהיר.", work: 40, rest: 180, category: "power", muscleGroup: "Shoulders", videoUrl: "https://www.youtube.com/watch?v=pushpress", imageUrl: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=800", difficulty: "Elite" },
  { id: "s11", name: "Y-Raise (Incline)", sets: 3, reps: "15", he: "הרמת ידיים לצורת Y בשכיבה על ספסל בשיפוע. מצוין לחיזוק הטרפז התחתון והכתף האחורית.", work: 35, rest: 60, category: "isolation", muscleGroup: "Shoulders", videoUrl: "https://www.youtube.com/watch?v=yraise", imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800", difficulty: "Standard" },
  { id: "s12", name: "Bradford Press", sets: 3, reps: "12", he: "לחיצת מוט מלפנים ומאחורי הראש לסירוגין ללא נעילה של המרפקים. יוצר מתח תמידי ועצום בכתף.", work: 45, rest: 90, category: "armor", muscleGroup: "Shoulders", videoUrl: "https://www.youtube.com/watch?v=bradford", imageUrl: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=800", difficulty: "Advanced" },
  { id: "s13", name: "Bus Driver", sets: 3, reps: "45s", he: "החזקת פלטה מלפנים וסיבוב ימינה ושמאלה כמו הגה. בונה סיבולת שריר גבוהה בכתף הקדמית.", work: 45, rest: 60, category: "isolation", muscleGroup: "Shoulders", videoUrl: "https://www.youtube.com/watch?v=busdriver", imageUrl: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=800", difficulty: "Standard" },
  { id: "s14", name: "HSPU (Handstand Push-Ups)", sets: 3, reps: "Max", he: "שכיבות סמיכה בעמידת ידיים מול קיר. תרגיל משקל הגוף הקשה ביותר לכתפיים ולכוח הדחיפה.", work: 45, rest: 120, category: "armor", muscleGroup: "Shoulders", videoUrl: "https://www.youtube.com/watch?v=hspu", imageUrl: "https://images.unsplash.com/photo-1599058917233-57c0e6244a4d?q=80&w=800", difficulty: "Elite" },
  { id: "s15", name: "Dumbbell Lateral Raise", sets: 4, reps: "15", he: "הרמת משקולות לצדדים. התרגיל הקלאסי והטוב ביותר לבניית 'כתפיים תלת מימדיות' ורוחב מרשים.", work: 30, rest: 60, category: "isolation", muscleGroup: "Shoulders", videoUrl: "https://www.youtube.com/watch?v=lateralraise", imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800", difficulty: "Standard" },

  // --- ARMS (15) ---
  { id: "a1", name: "Bayesian Cable Curl", sets: 3, reps: "12-15", he: "כפיפת בייספס כשהגב לכבל. מתיחה עצומה בראש הארוך של השריר בגלל מיקום המרפק מאחורי הגוף.", work: 35, rest: 60, category: "isolation", muscleGroup: "Arms", videoUrl: "https://www.youtube.com/watch?v=6id88qL2vXk", imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800", difficulty: "Advanced" },
  { id: "a2", name: "Katana Extension", sets: 3, reps: "12-15", he: "פשיטת טריספס מעבר לראש בכבלים. מתיחה אידיאלית לראש הארוך של הזרוע האחורית. פתח את הידיים בסוף.", work: 35, rest: 60, category: "isolation", muscleGroup: "Arms", videoUrl: "https://www.youtube.com/watch?v=katanaext", imageUrl: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=800", difficulty: "Advanced" },
  { id: "a3", name: "Hammer Curl (DB)", sets: 3, reps: "12", he: "כפיפה באחיזה ניטרלית. בונה את שריר הברכיאליס ואת האמות למראה זרוע עבה ועוצמתית יותר.", work: 35, rest: 75, category: "isolation", muscleGroup: "Arms", videoUrl: "https://www.youtube.com/watch?v=hammercurl", imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800", difficulty: "Standard" },
  { id: "a4", name: "Close-Grip Bench", sets: 4, reps: "8", he: "לחיצת חזה באחיזה צרה ברוחב כתפיים. התרגיל הבסיסי הטוב ביותר לכוח בטריספס ובחזה הפנימי.", work: 45, rest: 100, category: "push", muscleGroup: "Arms", videoUrl: "https://www.youtube.com/watch?v=closegrip", imageUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=800", difficulty: "Advanced" },
  { id: "a5", name: "Preacher Curl", sets: 3, reps: "12", he: "כפיפה על ספסל ייעודי המונע תנופה ומבודד את הבייספס לחלוטין. סחוט את השריר בשיא התנועה.", work: 35, rest: 75, category: "isolation", muscleGroup: "Arms", videoUrl: "https://www.youtube.com/watch?v=preachercurl", imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800", difficulty: "Standard" },
  { id: "a6", name: "Skull Crusher (EZ Bar)", sets: 3, reps: "10-12", he: "פשיטת מרפקים בשכיבה לכיוון המצח. בונה מסה אדירה בטריספס. הקפד על מרפקים יציבים ולא נעים.", work: 40, rest: 90, category: "isolation", muscleGroup: "Arms", videoUrl: "https://www.youtube.com/watch?v=skullcrusher", imageUrl: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=800", difficulty: "Advanced" },
  { id: "a7", name: "Concentration Curl", sets: 3, reps: "15", he: "כפיפה בישיבה כשהמרפק נתמך בחלק הפנימי של הירך. יוצר את שיא הגובה בבייספס ובידוד מושלם.", work: 30, rest: 60, category: "isolation", muscleGroup: "Arms", videoUrl: "https://www.youtube.com/watch?v=concentration", imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800", difficulty: "Standard" },
  { id: "a8", name: "Tricep Pushdown (Rope)", sets: 4, reps: "15", he: "לחיצת חבל למטה בפולי עליון. סחוט את הטריספס בשיא התנועה ופתח את החבל לצדדים בסיום.", work: 30, rest: 60, category: "isolation", muscleGroup: "Arms", videoUrl: "https://www.youtube.com/watch?v=tricepdown", imageUrl: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=800", difficulty: "Standard" },
  { id: "a9", name: "Spider Curl", sets: 3, reps: "12", he: "כפיפה בשכיבה עם החזה על ספסל בשיפוע, ידיים תלויות למטה. מבודד את הבייספס בצורה נקייה ללא גב.", work: 35, rest: 75, category: "isolation", muscleGroup: "Arms", videoUrl: "https://www.youtube.com/watch?v=spidercurl", imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800", difficulty: "Advanced" },
  { id: "a10", name: "French Press (DB)", sets: 3, reps: "12", he: "פשיטת מרפקים מעבר לראש בישיבה עם משקולת בודדת בשתי ידיים. בונה את הראש הארוך של הטריספס.", work: 40, rest: 90, category: "isolation", muscleGroup: "Arms", videoUrl: "https://www.youtube.com/watch?v=frenchpress", imageUrl: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=800", difficulty: "Advanced" },
  { id: "a11", name: "Zottman Curl", sets: 3, reps: "12", he: "עלייה כבייספס רגיל, סיבוב אמות וירידה איטית באחיזה הפוכה. בונה זרועות עוצמתיות וכוח אחיזה מטורף.", work: 40, rest: 75, category: "isolation", muscleGroup: "Arms", videoUrl: "https://www.youtube.com/watch?v=zottmancurl", imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800", difficulty: "Advanced" },
  { id: "a12", name: "Diamond Push-Up", sets: 3, reps: "Max", he: "שכיבות סמיכה כאשר הידיים צמודות בצורת יהלום מתחת לחזה. תרגיל משקל גוף מעולה לטריספס ולסיום.", work: 35, rest: 60, category: "push", muscleGroup: "Arms", videoUrl: "https://www.youtube.com/watch?v=diamondpushup", imageUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=800", difficulty: "Standard" },
  { id: "a13", name: "Reverse Barbell Curl", sets: 3, reps: "15", he: "כפיפה במוט באחיזה הפוכה (פרונציה). בונה את האמות ואת שריר הברכיאליס של הזרוע הקדמית.", work: 30, rest: 60, category: "isolation", muscleGroup: "Arms", videoUrl: "https://www.youtube.com/watch?v=reversecurl", imageUrl: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=800", difficulty: "Standard" },
  { id: "a14", name: "Cross Body Hammer", sets: 3, reps: "12/side", he: "כפיפת פטישים לרוחב הגוף לכיוון הכתף הנגדית. בונה את הראש הצידי של הבייספס ואת האמה.", work: 35, rest: 60, category: "isolation", muscleGroup: "Arms", videoUrl: "https://www.youtube.com/watch?v=crosshammer", imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800", difficulty: "Standard" },
  { id: "a15", name: "JM Press", sets: 3, reps: "10", he: "שילוב בין לחיצת חזה צמודה לפשיטת מרפקים. המוט יורד לצוואר. תרגיל בסיס לבניית כוח אדיר בטריספס.", work: 45, rest: 90, category: "push", muscleGroup: "Arms", videoUrl: "https://www.youtube.com/watch?v=mG0UPv_bX2E", imageUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=800", difficulty: "Advanced" },

  // --- CORE & FULL BODY (10) ---
  { id: "cr1", name: "Dragon Flag", sets: 3, reps: "5-8", he: "הרמת כל הגוף כיחידה אחת בשכיבה על ספסל והורדה איטית מאוד בשליטה. שיא השליטה בשרירי הבטן.", work: 40, rest: 90, category: "core", muscleGroup: "Core", videoUrl: "https://www.youtube.com/watch?v=moyFIvRrS0E", imageUrl: "https://images.unsplash.com/photo-1599058917233-57c0e6244a4d?q=80&w=800", difficulty: "Elite" },
  { id: "cr2", name: "Hanging Leg Raise", sets: 4, reps: "15", he: "תלייה על מוט והרמת רגליים ישרות עד גובה המותן ומעלה. עובד חזק על הבטן התחתונה והליבה העמוקה.", work: 40, rest: 60, category: "core", muscleGroup: "Core", videoUrl: "https://www.youtube.com/watch?v=hangingleg", imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=800", difficulty: "Advanced" },
  { id: "cr3", name: "Ab Wheel Rollout", sets: 3, reps: "12", he: "גלישה קדימה עם גלגל בטן. שמור על גב יציב ואל תיתן לאגן לקרוס. התרגיל הכי קשוח לקיר בטן חזק.", work: 40, rest: 90, category: "core", muscleGroup: "Core", videoUrl: "https://www.youtube.com/watch?v=abwheel", imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=800", difficulty: "Elite" },
  { id: "cr4", name: "Cable Crunches", sets: 4, reps: "20", he: "כפיפות בטן בכריעה מול פולי עם חבל מאחורי הראש. מאפשר העמסה כבדה לבניית 'קוביות' עבות ובולטות.", work: 35, rest: 60, category: "core", muscleGroup: "Core", videoUrl: "https://www.youtube.com/watch?v=cablecrunch", imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=800", difficulty: "Standard" },
  { id: "cr5", name: "Plank with Reach", sets: 3, reps: "12/side", he: "מצב פלאנק ושליחת יד אחת קדימה לסירוגין ללא תזוזה של האגן. בונה יציבות ליבה נגד כוחות סיבוב.", work: 45, rest: 45, category: "core", muscleGroup: "Core", videoUrl: "https://www.youtube.com/watch?v=plankreach", imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=800", difficulty: "Standard" },
  { id: "f1", name: "Landmine Thruster", sets: 4, reps: "10", he: "סקוואט ודחיפה של המוט מעל הראש בתנועה אחת רציפה ומתפרצת. בונה כוח בכל הגוף ותיאום מוטורי.", work: 60, rest: 120, category: "power", muscleGroup: "FullBody", videoUrl: "https://www.youtube.com/watch?v=landminethruster", imageUrl: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=800", difficulty: "Advanced" },
  { id: "f2", name: "Farmer's Walk", sets: 3, reps: "40m", he: "הליכה עם משקולות כבדות מאוד בצידי הגוף. בונה אחיזה, גב עליון ויציבות ליבה אדירה של לוחם.", work: 45, rest: 120, category: "power", muscleGroup: "FullBody", videoUrl: "https://www.youtube.com/watch?v=farmerswalk", imageUrl: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=800", difficulty: "Elite" },
  { id: "f3", name: "Medicine Ball Slam", sets: 3, reps: "15", he: "הטחת כדור כוח ברצפה בכל הכוח תוך שימוש בבטן ובכתפיים. תרגיל מעולה לשריפת קלוריות וכוח מתפרץ.", work: 30, rest: 60, category: "power", muscleGroup: "FullBody", videoUrl: "https://www.youtube.com/watch?v=ballslam", imageUrl: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=800", difficulty: "Standard" },
  { id: "f4", name: "Turkish Get-Up", sets: 3, reps: "5/side", he: "מעבר משכיבה על הגב לעמידה מלאה כשיד אחת מחזיקה משקולת מעל הראש. שיא היציבות והקואורדינציה.", work: 90, rest: 90, category: "power", muscleGroup: "FullBody", videoUrl: "https://www.youtube.com/watch?v=getup", imageUrl: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=800", difficulty: "Elite" },
  { id: "f5", name: "Kettlebell Swing", sets: 4, reps: "20", he: "הנפת קטלבל בעזרת כוח מתפרץ מהיר של הירכיים והישבן. בונה כוח בשרשרת האחורית וסיבולת לב-ריאה.", work: 45, rest: 60, category: "power", muscleGroup: "FullBody", videoUrl: "https://www.youtube.com/watch?v=kbswing", imageUrl: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=800", difficulty: "Standard" }

];

// --- APP HELPERS ---
const muscleHebrew: Record<string, string> = {
  Back: "גב",
  Chest: "חזה",
  Legs: "רגליים",
  Glutes: "ישבן",
  Shoulders: "כתפיים",
  Arms: "ידיים",
  Core: "ליבה",
  FullBody: "כל הגוף"
};
const categoryHebrew: Record<string, string> = {
  pull: "משיכה", push: "דחיפה", legs: "רגליים", armor: "שריון", power: "כוח", core: "ליבה", isolation: "בידוד"
};

const muscleGroupImages: Record<MuscleGroup, string> = {
  Back: "https://images.unsplash.com/photo-1603287611837-f2146f5de8e8?q=80&w=800",
  Chest: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=800",
  Legs: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800",
  Glutes: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=800",
  Shoulders: "https://images.unsplash.com/photo-1591741535018-d042766c62eb?q=80&w=800",
  Arms: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=800",
  Core: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=800",
  FullBody: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=800"
};

function getDayImage(day: { muscles: MuscleGroup[] }) {
  return muscleGroupImages[day.muscles[0]] || DEFAULT_EXERCISE_IMAGE;
}

const AI_TIPS = [
  "נועם, שמור על גב ישר. הליבה היא הבסיס לכל תנועה כבדה.",
  "אל תשכח לנשום. הוצא אוויר במאמץ והכנס אוויר במתיחה.",
  "זמן המנוחה הוא קדוש. תן לשריר להתאושש כדי להפציץ בסט הבא.",
  "הטכניקה חשובה מהמשקל. שליטה אבסולוטית בונה שריר איכותי.",
  "תרגיש את השריר עובד. חיבור מוח-שריר הוא המפתח לתוצאות.",
  "נועם, הקפד על ירידה איטית. שם מתבצעת רוב בניית השריר.",
  "אל תנעל מרפקים או ברכיים בשיא. שמור על המתח בשריר.",
  "אם זה קל, תעלה משקל בסט הבא. התקדמות היא המפתח פה."
];


// --- CORE UI COMPONENTS ---

const ApexCard = ({ children, className, onClick }: any) => (
  <motion.div
    whileHover={onClick ? { scale: 1.01, borderColor: "rgba(20, 184, 166, 0.4)" } : {}}
    onClick={onClick}
    className={`bg-slate-900/60 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] overflow-hidden transition-all duration-300 ${className || ""}`}
  >
    {children}
  </motion.div>
);

const ApexButton = React.forwardRef(({ className, variant = "default", size = "default", children, ...props }: any, ref: any) => {
  const base = "inline-flex items-center justify-center font-black transition-all active:scale-95 disabled:opacity-50 cursor-pointer select-none";
  const variants: any = {
    default: "bg-teal-500 text-slate-950 hover:bg-teal-400 shadow-[0_0_20px_rgba(20,184,166,0.3)]",
    outline: "border border-white/10 bg-white/5 hover:bg-white/10 text-white/90",
    ghost: "bg-transparent text-white/50 hover:text-white hover:bg-white/5",
    danger: "bg-rose-600 text-white",
    premium: "bg-gradient-to-r from-teal-500 to-indigo-600 text-white shadow-xl"
  };
  const sizes: any = {
    default: "h-14 px-8 rounded-2xl text-sm",
    sm: "h-10 px-4 rounded-xl text-[10px]",
    lg: "h-20 px-12 rounded-3xl text-xl",
    icon: "h-12 w-12 rounded-xl"
  };
  return <button ref={ref} className={`${base} ${variants[variant]} ${sizes[size]} ${className || ""}`} {...props}>{children}</button>;
});

const ApexBadge = ({ children, variant = "default" }: any) => {
  const styles: any = {
    default: "bg-white/5 text-white/50 border-white/5",
    teal: "bg-teal-500/10 text-teal-400 border-teal-500/20",
    elite: "bg-rose-500/10 text-rose-400 border-rose-500/20 animate-pulse"
  };
  return <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${styles[variant]}`}>{children}</div>;
};

type DayKey = "sun" | "mon" | "tue" | "wed" | "thu" | "fri";
type MainTab = "dashboard" | "vault" | "stats";

const DAY_SPLITS: { id: DayKey; label: string; title: string; subtitle: string; muscles: MuscleGroup[]; nutrition: string; }[] = [
  { id: "sun", label: "יום א", title: "Pull Power", subtitle: "גב + יד קדמית + ליבה", muscles: ["Back", "Arms", "Core"], nutrition: "יותר פחמימה לפני אימון, חלבון מלא אחרי האימון." },
  { id: "mon", label: "יום ב", title: "Push Builder", subtitle: "חזה + כתפיים + טרייספס", muscles: ["Chest", "Shoulders", "Arms"], nutrition: "דגש על חלבון, נוזלים וארוחה מסודרת 60-90 דקות לפני." },
  { id: "tue", label: "יום ג", title: "Legs Heavy", subtitle: "רגליים + ליבה", muscles: ["Legs", "Core"], nutrition: "פחמימות מורכבות, מלח ונוזלים כדי לשמור ביצועים." },
  { id: "wed", label: "יום ד", title: "Recovery Pump", subtitle: "עומס נמוך, נפח נשלט", muscles: ["Shoulders", "Arms", "Core"], nutrition: "יותר ירקות, חלבון קבוע ושינה טובה." },
  { id: "thu", label: "יום ה", title: "Upper Mix", subtitle: "פלג גוף עליון משולב", muscles: ["Back", "Chest", "Shoulders"], nutrition: "שמור על חלבון גבוה וחטיף קל לפני הסשן." },
  { id: "fri", label: "יום ו", title: "Full Body", subtitle: "כוח, קצב, מטבוליזם", muscles: ["FullBody", "Legs", "Core"], nutrition: "שילוב פחמימה מהירה אחרי אימון וחלבון מלא." }
];

const NUTRITION_TRACKS = [
  {
    title: "Lean Build",
    calories: "2700-3000",
    protein: "160-190g",
    carbs: "300-360g",
    fats: "65-80g",
    focus: "מסה נקייה עם שליטה בשומן"
  },
  {
    title: "Performance",
    calories: "2500-2800",
    protein: "150-180g",
    carbs: "260-330g",
    fats: "60-75g",
    focus: "ביצועים, התאוששות ואנרגיה לאימונים"
  },
  {
    title: "Cut Smart",
    calories: "2100-2400",
    protein: "170-200g",
    carbs: "170-230g",
    fats: "55-70g",
    focus: "שמירה על שריר תוך ירידה מבוקרת"
  }
];

const APP_IDEAS = [
  "Tracker להצעת משקל לסט הבא",
  "שורת התאוששות עם שינה, מים ומצב אנרגיה",
  "מועדפים אישיים לתרגילים שחוזרים הרבה",
  "מסך תזונה עם מקרו וארוחות סביב אימון",
  "פיצול לפי ימים עם המלצות אוטומטיות",
  "askAI Notes לכל תרגיל בנפרד",
  "Fallback אוטומטי לתמונה אם מקור התמונה נופל",
  "קישור אוטומטי לחיפוש YouTube אם סרטון ספציפי לא זמין",
  "צלילי כניסה, מנוחה, סיום סט ומעבר שלב",
  "מעבר מהיר בין אימון לתזונה מהמסך הראשי"
];

const DEFAULT_EXERCISE_IMAGE = "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1200";

const NUTRITION_MEAL_FLOW = [
  { title: "לפני אימון", items: ["בננה + יוגורט", "טוסט + גבינה", "אורז קטן + חזה עוף"] },
  { title: "אחרי אימון", items: ["שייק חלבון + פרי", "אורז + עוף", "יוגורט + גרנולה + דבש"] },
  { title: "ארוחת ערב", items: ["סלמון + תפוח אדמה", "חביתה + לחם + סלט", "בשר רזה + אורז + ירקות"] }
];

const NUTRITION_BOOSTERS = [
  "סימון מים יומי עם יעד פשוט",
  "בחירת מסלול תזונה לפי מטרה",
  "דוגמאות לארוחות מהירות סביב אימון",
  "רשימת קניות בסיסית לשבוע",
  "בדיקת התאוששות עם שינה, מים ואנרגיה",
  "קישור ישיר מהמסך הראשי לתזונה"
];

const SHOPPING_LIST = ["יוגורט", "ביצים", "עוף", "אורז", "שיבולת שועל", "בננות", "ירקות", "אגוזים", "טונה", "לחם טוב"];

const NUTRITION_WINDOWS = [
  { title: "Macro Window", value: "Protein first", detail: "בכל ארוחה תתחיל ממקור חלבון ברור ואז תשלים פחמימה ושומן." },
  { title: "Pre Workout Window", value: "60-90 min", detail: "עדיף ארוחה קלה שלא מכבידה, עם פחמימה נגישה וחלבון." },
  { title: "Recovery Window", value: "0-2 hours", detail: "אחרי אימון תן לגוף חלבון, נוזלים וקצת פחמימה כדי לסגור התאוששות." },
  { title: "Hydration Window", value: "All day", detail: "אל תחכה לצמא. מים לאורך היום ישפרו גם אימון וגם ריכוז." }
];

const NUTRITION_AI_SIGNALS = [
  "אם האימון הקרוב כבד ברגליים, תעלה פחמימה בארוחה שלפני.",
  "אם יש עייפות גבוהה, עדיף ארוחה פשוטה וקלה לעיכול ולא עומס גדול.",
  "ביום התאוששות תשמור חלבון גבוה, גם אם אתה מוריד קצת פחמימות.",
  "אם פספסת ארוחה, שייק חלבון ופרי עדיפים על כלום."
];


function getExerciseImage(exercise: Exercise) {
  return exercise.imageUrl || muscleGroupImages[exercise.muscleGroup] || DEFAULT_EXERCISE_IMAGE;
}

function getYoutubeSearchUrl(exerciseName: string) {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(exerciseName + " exercise tutorial")}`;
}
function getExerciseVideoTarget(exercise: Exercise) {
  const directUrl = exercise.videoUrl || "";
  const looksValid = /youtube\.com\/watch\?v=[\w-]{6,}|youtu\.be\/[\w-]{6,}/i.test(directUrl);
  return looksValid ? directUrl : getYoutubeSearchUrl(exercise.name);
}


function parseRepTarget(repText: string): number {
  const match = repText.match(/\d+/);
  return match ? parseInt(match[0], 10) : 8;
}

function getExerciseLogs(exerciseId: string, logs: SetRecord[]) {
  return logs.filter(log => log.exerciseId === exerciseId).sort((a, b) => b.timestamp - a.timestamp);
}

function getOverloadSuggestion(exercise: Exercise, logs: SetRecord[]) {
  const exLogs = getExerciseLogs(exercise.id, logs);
  const last = exLogs[0];
  if (!last) {
    return "אין תיעוד קודם. התחל במשקל שאתה שולט בו לגמרי ושמור 1-2 חזרות ברזרבה.";
  }
  const target = parseRepTarget(exercise.reps);
  const hitTarget = last.reps >= target;
  const increment = exercise.category === "isolation" || exercise.muscleGroup === "Arms" ? 1.25 : 2.5;
  if (hitTarget) {
    return `בפעם הקודמת תיעדת ${last.weight} ק"ג ל-${last.reps} חזרות. כדאי לנסות ${Number(last.weight + increment).toFixed(2).replace(".00", "")} ק"ג.`;
  }
  return `בפעם הקודמת תיעדת ${last.weight} ק"ג ל-${last.reps} חזרות. שמור אותו משקל ותנסה להוסיף עוד 1-2 חזרות לפני העלאה.`;
}

function getExerciseAiNotes(exercise: Exercise, logs: SetRecord[]) {
  const notes = [
    exercise.muscleGroup === "Back" ? "דגש על משיכת מרפק ולא רק יד. תחשוב על סגירת שכמות." : null,
    exercise.muscleGroup === "Chest" ? "שמור על חזה פתוח ושכמות יציבות כדי לא להעמיס על הכתף." : null,
    exercise.muscleGroup === "Legs" ? "שמור על יציבות אגן וברך. הקצב בירידה חשוב יותר מהאגו." : null,
    exercise.muscleGroup === "Shoulders" ? "אל תעלה כתפיים לאוזניים. שמור על צוואר רגוע וטווח נשלט." : null,
    exercise.muscleGroup === "Arms" ? "אל תנצל תנופה. סט נקי בידיים נותן יותר עבודה מהתנדנדות." : null,
    exercise.muscleGroup === "Core" ? "חשוב על קיר בטן קשיח ונשימה מבוקרת לאורך כל הסט." : null,
    exercise.muscleGroup === "FullBody" ? "תרגיל כזה דורש קצב, נשימה ושליטה. אל תיתן לטכניקה לברוח." : null,
    exercise.difficulty === "Elite" ? "זה תרגיל מתקדם. עדיף להתחיל קצת קל יותר ולבנות שליטה לפני עומס." : null,
    getOverloadSuggestion(exercise, logs)
  ].filter(Boolean) as string[];

  return notes.slice(0, 4);
}

function getDayRecommendations(day: DayKey, exercises: Exercise[]) {
  const config = DAY_SPLITS.find(d => d.id === day) || DAY_SPLITS[0];
  return exercises.filter(ex => config.muscles.includes(ex.muscleGroup)).slice(0, 8);
}

function estimateCalories(volume: number) {
  if (volume <= 0) return 0;
  return Math.round(Math.min(900, Math.max(160, volume / 18)));
}

function getRecoveryScore(history: SessionData[]) {
  const recent = history.slice(0, 4);
  if (recent.length === 0) return 78;
  const avgVolume = recent.reduce((acc, item) => acc + item.volume, 0) / recent.length;
  if (avgVolume > 3000) return 71;
  if (avgVolume > 1800) return 79;
  return 87;
}

function SafeImage({ src, alt, className, fallbackSrc = DEFAULT_EXERCISE_IMAGE }: { src: string; alt: string; className?: string; fallbackSrc?: string; }) {
  const [imgSrc, setImgSrc] = useState(src || fallbackSrc);

  useEffect(() => {
    setImgSrc(src || fallbackSrc);
  }, [src, fallbackSrc]);

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={(e) => {
        const nextSrc = fallbackSrc || DEFAULT_EXERCISE_IMAGE;
        if (imgSrc !== nextSrc) {
          setImgSrc(nextSrc);
          return;
        }
        const target = e.currentTarget;
        target.onerror = null;
        target.src = DEFAULT_EXERCISE_IMAGE;
      }}
    />
  );
}

function Toast({ message }: { message: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 25, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.96 }}
      className="fixed top-8 left-1/2 -translate-x-1/2 z-[900] bg-slate-900/95 border border-teal-500/30 rounded-[1.8rem] px-6 py-4 text-white shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-2xl"
      dir="rtl"
    >
      <div className="flex items-center gap-3">
        <CheckCircle2 size={18} className="text-teal-400" />
        <span className="font-bold">{message}</span>
      </div>
    </motion.div>
  );
}

function TransitionFlash({ tone = "teal" }: { tone?: "teal" | "indigo" }) {
  const glow = tone === "indigo" ? "from-indigo-400/55 via-cyan-300/30 to-transparent" : "from-teal-300/60 via-cyan-200/30 to-transparent";
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1.08 }}
      exit={{ opacity: 0, scale: 1.18 }}
      transition={{ duration: 0.34, ease: "easeOut" }}
      className="fixed inset-0 z-[1000] pointer-events-none overflow-hidden"
    >
      <div className={`absolute inset-0 bg-gradient-to-b ${glow}`} />
      <motion.div
        initial={{ opacity: 0.2, scale: 0.8 }}
        animate={{ opacity: 0.95, scale: 1.45 }}
        exit={{ opacity: 0, scale: 1.8 }}
        transition={{ duration: 0.34, ease: "easeOut" }}
        className="absolute inset-0 m-auto h-[22rem] w-[22rem] rounded-full border border-white/40 bg-white/10 blur-2xl"
      />
      <div className="absolute inset-0 bg-white/5" />
    </motion.div>
  );
}

function AskAIModal({ exercise, logs, onClose, onAdd }: { exercise: Exercise; logs: SetRecord[]; onClose: () => void; onAdd: () => void; }) {
  const notes = useMemo(() => getExerciseAiNotes(exercise, logs), [exercise, logs]);
  const lastLog = getExerciseLogs(exercise.id, logs)[0];

  return (
    <div className="fixed inset-0 z-[700] bg-black/90 backdrop-blur-2xl flex items-center justify-center p-6" dir="rtl">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-3xl bg-slate-900 border border-white/10 rounded-[3rem] overflow-hidden">
        <div className="relative h-56">
          <SafeImage src={getExerciseImage(exercise)} alt={exercise.name} className="w-full h-full object-cover opacity-30" fallbackSrc={muscleGroupImages[exercise.muscleGroup]} />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
          <div className="absolute inset-0 p-8 flex items-end justify-between">
            <div className="space-y-2">
              <ApexBadge variant={exercise.difficulty === "Elite" ? "elite" : "teal"}>{exercise.difficulty}</ApexBadge>
              <h3 className="text-4xl font-black italic uppercase tracking-tighter">{exercise.name}</h3>
            </div>
            <ApexButton variant="ghost" size="icon" onClick={onClose}><X /></ApexButton>
          </div>
        </div>

        <div className="p-8 space-y-8">
          <ApexCard className="p-6 bg-teal-500/5 border-teal-500/20">
            <div className="flex items-center gap-3 mb-3">
              <span className="font-black uppercase tracking-widest text-[10px] text-teal-400">askAI notes</span>
            </div>
            <div className="space-y-3">
              {notes.map((note, idx) => (
                <div key={idx} className="text-slate-200 leading-relaxed font-medium">- {note}</div>
              ))}
            </div>
          </ApexCard>

          <div className="grid md:grid-cols-2 gap-6">
            <ApexCard className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Weight size={18} className="text-indigo-400" />
                <h4 className="font-black text-lg italic">הצעת עומס</h4>
              </div>
              <p className="text-slate-300 leading-relaxed">{getOverloadSuggestion(exercise, logs)}</p>
            </ApexCard>

            <ApexCard className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <History size={18} className="text-amber-400" />
                <h4 className="font-black text-lg italic">סט אחרון</h4>
              </div>
              <p className="text-slate-300 leading-relaxed">
                {lastLog ? `תיעוד אחרון: ${lastLog.weight} ק"ג, ${lastLog.reps} חזרות.` : "אין עדיין תיעוד לתרגיל הזה."}
              </p>
            </ApexCard>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <ApexButton variant="premium" className="flex-1 gap-2" onClick={onAdd}><Plus size={18} /> הוסף לסשן</ApexButton>
            <ApexButton variant="outline" className="flex-1 gap-2" onClick={() => window.open(getExerciseVideoTarget(exercise), "_blank", "noopener,noreferrer")}><Youtube size={18} /> פתח וידאו</ApexButton>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function SwapModal({ currentEx, onSwap, onClose }: { currentEx: Exercise; onSwap: (e: Exercise) => void; onClose: () => void; }) {
  const alts = useMemo(() => MASTER_VAULT.filter(e => e.muscleGroup === currentEx.muscleGroup && e.id !== currentEx.id), [currentEx]);
  return (
    <div className="fixed inset-0 z-[600] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-6" dir="rtl">
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-slate-900 border border-white/10 w-full max-w-4xl rounded-[3rem] overflow-hidden">
        <div className="p-8 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-3xl font-black italic uppercase tracking-tighter">החלפת פרוטוקול</h3>
            <ApexButton variant="ghost" size="icon" onClick={onClose}><X /></ApexButton>
          </div>
          <div className="grid md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto pr-2 scrollbar-hide">
            {alts.map(ex => (
              <ApexCard key={ex.id} className="p-4 flex items-center gap-4 cursor-pointer hover:bg-white/5" onClick={() => { onSwap(ex); onClose(); }}>
                <SafeImage src={getExerciseImage(ex)} alt={ex.name} className="w-20 h-20 rounded-2xl object-cover opacity-50" fallbackSrc={muscleGroupImages[ex.muscleGroup]} />
                <div className="text-right flex-1">
                  <h4 className="font-black italic text-lg">{ex.name}</h4>
                  <p className="text-[10px] text-slate-500 font-bold uppercase">{ex.difficulty} | {categoryHebrew[ex.category]}</p>
                </div>
                <ArrowRightLeft className="text-teal-500" size={20} />
              </ApexCard>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// --- MAIN APPLICATION COMPONENT ---

function ReacherApp() {
  const [screen, setScreen] = useState<"splash" | "nutrition" | "main">("splash");
  const [tab, setTab] = useState<MainTab>("dashboard");
  const [vaultFilter, setVaultFilter] = useState<MuscleGroup | "All">("All");
  const [selectedDay, setSelectedDay] = useState<DayKey>("sun");
  const [searchText, setSearchText] = useState("");
  const [showSwap, setShowSwap] = useState(false);
  const [askAIExercise, setAskAIExercise] = useState<Exercise | null>(null);
  const [toast, setToast] = useState("");
  const [favorites, setFavorites] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      return JSON.parse(window.localStorage.getItem("reacher_favorites_v21") || "[]");
    } catch {
      return [];
    }
  });

  const [sessionList, setSessionList] = useState<Exercise[]>([]);
  const [inSession, setInSession] = useState(false);
  const [curIdx, setCurIdx] = useState(0);
  const [curSet, setCurSet] = useState(1);
  const [phase, setPhase] = useState<"work" | "rest">("work");
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [tip, setTip] = useState(AI_TIPS[0]);

  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");
  const [logs, setLogs] = useState<SetRecord[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      return JSON.parse(window.localStorage.getItem("reacher_logs_v21") || "[]");
    } catch {
      return [];
    }
  });
  const [history, setHistory] = useState<SessionData[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      return JSON.parse(window.localStorage.getItem("reacher_hist_v21") || "[]");
    } catch {
      return [];
    }
  });

  const audioCtx = useRef<AudioContext | null>(null);
  const [flashTone, setFlashTone] = useState<null | "teal" | "indigo">(null);

  const playToneBurst = useCallback((freqs: number[], duration = 0.16) => {
    if (typeof window === "undefined") return;
    if (!audioCtx.current) audioCtx.current = new AudioContext();
    if (audioCtx.current.state === "suspended") audioCtx.current.resume();

    freqs.slice(0, 4).forEach((freq, index) => {
      const osc = audioCtx.current!.createOscillator();
      const gain = audioCtx.current!.createGain();
      const filter = audioCtx.current!.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 1450;
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.current!.destination);
      osc.type = "sine";
      const start = audioCtx.current!.currentTime + index * 0.045;
      osc.frequency.setValueAtTime(freq, start);
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.linearRampToValueAtTime(0.012, start + 0.018);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
      osc.start(start);
      osc.stop(start + duration + 0.03);
    });
  }, []);

  const playSoftClick = useCallback((freq = 520) => {
    playToneBurst([freq, freq * 1.16, freq * 1.33], 0.1);
  }, [playToneBurst]);

  const currentDayConfig = useMemo(() => DAY_SPLITS.find(d => d.id === selectedDay) || DAY_SPLITS[0], [selectedDay]);
  const dayRecommendations = useMemo(() => getDayRecommendations(selectedDay, MASTER_VAULT), [selectedDay]);
  const filteredVault = useMemo(() => {
    return MASTER_VAULT.filter(ex => {
      const filterOk = vaultFilter === "All" || ex.muscleGroup === vaultFilter;
      const text = `${ex.name} ${ex.he} ${muscleHebrew[ex.muscleGroup]} ${categoryHebrew[ex.category]}`.toLowerCase();
      const searchOk = searchText.trim() === "" || text.includes(searchText.toLowerCase());
      return filterOk && searchOk;
    });
  }, [vaultFilter, searchText]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("reacher_logs_v21", JSON.stringify(logs));
    }
  }, [logs]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("reacher_hist_v21", JSON.stringify(history));
    }
  }, [history]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("reacher_favorites_v21", JSON.stringify(favorites));
    }
  }, [favorites]);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(""), 2300);
    return () => window.clearTimeout(t);
  }, [toast]);

  const playAlert = (f: number) => {
    playToneBurst([f, f * 1.18], 0.14);
  };

  const openYoutubeHub = useCallback(() => {
    if (typeof window === "undefined") return;
    window.open("https://www.youtube.com/", "_blank", "noopener,noreferrer");
    playToneBurst([540, 680, 820], 0.12);
  }, [playToneBurst]);

  const openMusicHub = useCallback(() => {
    if (typeof window === "undefined") return;
    const appWindow = window.open("spotify://", "_blank");
    window.setTimeout(() => {
      if (!appWindow || appWindow.closed) {
        window.open("https://open.spotify.com/", "_blank", "noopener,noreferrer");
      }
    }, 300);
    playToneBurst([480, 600, 720], 0.12);
  }, [playToneBurst]);

  const navigateWithFlash = useCallback((nextScreen: "splash" | "nutrition" | "main", tone: "teal" | "indigo" = "teal") => {
    setFlashTone(tone);
    playToneBurst(tone === "indigo" ? [480, 610, 760] : [520, 660, 820], 0.12);
    window.setTimeout(() => setScreen(nextScreen), 140);
    window.setTimeout(() => setFlashTone(null), 380);
  }, [playToneBurst]);

  const openExerciseVideo = useCallback((exercise: Exercise) => {
    if (typeof window === "undefined") return;
    const directUrl = exercise.videoUrl || "";
    const looksValid = /youtube\.com\/watch\?v=[\w-]{6,}|youtu\.be\/[\w-]{6,}/i.test(directUrl);
    const target = getExerciseVideoTarget(exercise);
    window.open(target, "_blank", "noopener,noreferrer");
    playToneBurst([660, 880], 0.12);
  }, [playToneBurst]);

  useEffect(() => {
    let t: any;
    if (isRunning && timer > 0) {
      t = setInterval(() => setTimer(v => v - 1), 1000);
    } else if (isRunning && timer === 0 && inSession) {
      handlePhaseTransition();
    }
    return () => clearInterval(t);
  }, [isRunning, timer, phase, inSession]);

  const addExerciseToSession = (exercise: Exercise) => {
    setSessionList(prev => [...prev, exercise]);
    setToast(`${exercise.name} נוסף לסשן`);
    playAlert(1200);
  };

  const toggleFavorite = (exerciseId: string) => {
    setFavorites(prev => prev.includes(exerciseId) ? prev.filter(id => id !== exerciseId) : [...prev, exerciseId]);
  };

  const startProtocol = () => {
    if (sessionList.length === 0) {
      setToast("קודם תוסיף לפחות תרגיל אחד לסשן");
      return;
    }
    playToneBurst([500, 620, 740], 0.14);
    setInSession(true);
    setCurIdx(0);
    setCurSet(1);
    setPhase("work");
    setTimer(sessionList[0].work);
    setIsRunning(true);
    setToast("הסשן התחיל");
  };

  const handlePhaseTransition = () => {
    const ex = sessionList[curIdx];
    if (!ex) return;
    if (phase === "work") {
      playAlert(620);
      setPhase("rest");
      setTimer(ex.rest);
      setTip(getExerciseAiNotes(ex, logs)[Math.floor(Math.random() * Math.max(1, getExerciseAiNotes(ex, logs).length))] || AI_TIPS[0]);
    } else {
      playAlert(980);
      if (curSet < ex.sets) {
        setCurSet(s => s + 1);
        setPhase("work");
        setTimer(ex.work);
      } else if (curIdx + 1 < sessionList.length) {
        setCurIdx(i => i + 1);
        setCurSet(1);
        setPhase("work");
        setTimer(sessionList[curIdx + 1].work);
      } else {
        completeWorkout();
      }
    }
  };

  const completeWorkout = () => {
    const sessionIds = new Set(sessionList.map(item => item.id));
    const sessionLogs = logs.filter(log => sessionIds.has(log.exerciseId));
    const totalVolume = sessionLogs.reduce((acc, curr) => acc + curr.weight * curr.reps, 0);
    const newHist: SessionData = {
      id: Math.random().toString(36).slice(2, 10),
      date: new Date().toLocaleDateString("he-IL"),
      volume: totalVolume,
      exercises: sessionList.length
    };
    setHistory(prev => [newHist, ...prev]);
    setInSession(false);
    setIsRunning(false);
    setSessionList([]);
    setCurIdx(0);
    setCurSet(1);
    setToast("אימון הושלם והיסטוריה נשמרה");
  };

  const logCurrentSet = () => {
    const ex = sessionList[curIdx];
    if (!ex || !weight || !reps) {
      setToast("צריך למלא משקל וחזרות");
      return;
    }
    const record: SetRecord = {
      weight: parseInt(weight, 10),
      reps: parseInt(reps, 10),
      exerciseId: ex.id,
      timestamp: Date.now()
    };
    setLogs(prev => [...prev, record]);
    setWeight("");
    setReps("");
    playToneBurst([820, 980], 0.1);
    setToast("הסט נשמר");
  };

  const sessionVolume = useMemo(() => {
    const sessionIds = new Set(sessionList.map(item => item.id));
    return logs.filter(log => sessionIds.has(log.exerciseId)).reduce((acc, curr) => acc + curr.weight * curr.reps, 0);
  }, [logs, sessionList]);


  useEffect(() => {
    if (screen === "splash") return;
    playToneBurst(screen === "nutrition" ? [520, 650, 780] : [470, 620, 760], 0.1);
  }, [screen, playToneBurst]);

  if (screen === "splash") {
    return (
      <>
        <AnimatePresence>{flashTone && <TransitionFlash tone={flashTone} />}</AnimatePresence>
        <div className="fixed inset-0 bg-slate-950 flex flex-col items-center justify-center p-12 overflow-hidden text-center">
        <div className="absolute inset-0 opacity-10 blur-sm scale-110">
          <SafeImage src={REACHER_HERO} alt="hero" className="w-full h-full object-cover" fallbackSrc={DEFAULT_EXERCISE_IMAGE} />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
        </div>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 space-y-12">
          <div className="flex flex-col items-center gap-4">
            <div className="px-7 py-6 bg-teal-500 rounded-[2.5rem] flex items-center justify-center shadow-[0_0_50px_rgba(20,184,166,0.5)]">
              <span className="text-slate-950 text-3xl font-black italic tracking-tight">askAI</span>
            </div>
            <p className="text-teal-400 font-mono text-[10px] uppercase tracking-[0.6em] mt-4"><Cpu size={14} className="inline mr-2" /> PLATINUM ENGINE v21.0</p>
          </div>
          <h1 className="text-7xl md:text-[9rem] font-black italic uppercase text-white tracking-tighter leading-[0.85]">Betesh<br /><span className="text-teal-500">training</span></h1>
          <p className="text-slate-500 font-bold uppercase tracking-[0.28em] text-sm">Training, nutrition, recovery, progression.</p>
          <p className="text-slate-300 text-sm font-semibold">Created by Noam Betesh</p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <ApexButton size="lg" className="px-14 py-10 text-2xl gap-3" onClick={() => navigateWithFlash("main", "teal")}><Dumbbell size={24} /> Workout Board</ApexButton>
            <ApexButton variant="outline" size="lg" className="px-14 py-10 text-2xl gap-3 border-teal-500/30 text-white" onClick={() => navigateWithFlash("nutrition", "indigo")}><Flame size={24} /> Nutrition</ApexButton>
          </div>
        </motion.div>
      </div>
      </>
    );
  }

  const recoveryScore = getRecoveryScore(history);

  if (screen === "nutrition") {
    return (
      <>
        <AnimatePresence>{flashTone && <TransitionFlash tone={flashTone} />}</AnimatePresence>
        <div className="min-h-screen bg-[#020617] text-white p-6 md:p-12" dir="rtl">
        <div className="max-w-7xl mx-auto space-y-10">
          <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div>
              <p className="text-teal-500 font-black text-[10px] uppercase tracking-[0.5em] mb-2">Fuel system</p>
              <h2 className="text-6xl font-black italic uppercase tracking-tighter">Betesh<br />Nutrition</h2>
              <p className="text-slate-400 mt-3 max-w-2xl">מסך תזונה מלא עם חלונות מידע, המלצות חכמות, מקרו, התאוששות וגישה מהירה ל-askAI.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <ApexButton variant="outline" className="gap-2" onClick={() => navigateWithFlash("splash", "teal")}><Home size={18} /> מסך פתיחה</ApexButton>
              <ApexButton variant="outline" className="gap-2" onClick={openYoutubeHub}><Youtube size={18} /> YouTube</ApexButton>
              <ApexButton variant="outline" className="gap-2" onClick={openMusicHub}><Music size={18} /> Music / Spotify</ApexButton>
              <ApexButton variant="premium" className="gap-2" onClick={() => setAskAIExercise(dayRecommendations[0] || MASTER_VAULT[0])}><span className="font-black tracking-wide">askAI</span></ApexButton>
              <ApexButton variant="premium" className="gap-2" onClick={() => navigateWithFlash("main", "indigo")}><ArrowRightLeft size={18} /> לעבור לאימונים</ApexButton>
            </div>
          </header>

          <div className="grid xl:grid-cols-[1.25fr_0.9fr] gap-8">
            <ApexCard className="p-8 space-y-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-[10px] uppercase tracking-widest font-black text-teal-400 mb-2">Nutrition AI panel</div>
                  <h3 className="text-3xl font-black italic">חלון בקרה חכם</h3>
                </div>
                <ApexButton variant="outline" className="gap-2" onClick={() => setAskAIExercise(dayRecommendations[0] || MASTER_VAULT[0])}><span className="font-black tracking-wide">askAI</span></ApexButton>
              </div>
              <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
                {NUTRITION_WINDOWS.map(win => (
                  <div key={win.title} className="bg-black/30 border border-white/5 rounded-[1.8rem] p-5 space-y-3">
                    <div className="text-[10px] uppercase tracking-widest font-black text-slate-500">{win.title}</div>
                    <div className="text-2xl font-black italic text-white">{win.value}</div>
                    <div className="text-sm text-slate-300 leading-relaxed">{win.detail}</div>
                  </div>
                ))}
              </div>
            </ApexCard>

            <ApexCard className="p-8 space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black italic">AI signals</h3>
                <Cpu className="text-teal-400" />
              </div>
              <div className="space-y-3">
                {NUTRITION_AI_SIGNALS.map(signal => (
                  <div key={signal} className="bg-black/30 border border-white/5 rounded-2xl px-4 py-3 text-slate-200 leading-relaxed">{signal}</div>
                ))}
              </div>
            </ApexCard>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {NUTRITION_TRACKS.map(track => (
              <ApexCard key={track.title} className="p-8 space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-3xl font-black italic uppercase">{track.title}</h3>
                    <p className="text-slate-400 mt-2">{track.focus}</p>
                  </div>
                  <HeartPulse className="text-teal-400" />
                </div>
                <div className="space-y-3 text-slate-200 font-medium">
                  <div>קלוריות: {track.calories}</div>
                  <div>חלבון: {track.protein}</div>
                  <div>פחמימות: {track.carbs}</div>
                  <div>שומנים: {track.fats}</div>
                </div>
              </ApexCard>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <ApexCard className="p-8 space-y-6">
              <div className="flex items-center gap-3">
                <CalendarDays className="text-indigo-400" />
                <h3 className="text-2xl font-black italic">ארוחות סביב אימון</h3>
              </div>
              <div className="space-y-4 text-slate-300 leading-relaxed">
                <p>- 60-90 דקות לפני אימון: פחמימה קלה לעיכול + חלבון.</p>
                <p>- אחרי אימון: 25-40 גרם חלבון, קצת פחמימה ונוזלים.</p>
                <p>- באימוני רגליים כבדים: אל תיכנס מיובש. מלח ומים משנים ביצועים.</p>
                <p>- ביום התאוששות: לא חייבים להוריד חלבון, כן אפשר להוריד מעט פחמימה.</p>
              </div>
            </ApexCard>

            <ApexCard className="p-8 space-y-6">
              <div className="flex items-center gap-3">
                <Sparkles className="text-amber-400" />
                <h3 className="text-2xl font-black italic">פיצ'רים אסטרה</h3>
              </div>
              <div className="grid gap-3">
                {APP_IDEAS.map(item => (
                  <div key={item} className="bg-black/30 border border-white/5 rounded-2xl px-4 py-3 text-slate-200">{item}</div>
                ))}
              </div>
            </ApexCard>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <ApexCard className="p-8 space-y-5">
              <div className="flex items-center gap-3">
                <BarChart3 className="text-teal-400" />
                <h3 className="text-2xl font-black italic">Nutrition dashboard</h3>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[{label:"Protein",value:"High"},{label:"Energy",value:"Stable"},{label:"Recovery",value: recoveryScore >= 80 ? "Good" : "Careful"}].map(item => (
                  <div key={item.label} className="bg-black/30 border border-white/5 rounded-2xl p-4 text-center">
                    <div className="text-[10px] uppercase tracking-widest font-black text-slate-500 mb-2">{item.label}</div>
                    <div className="font-black italic text-lg text-white">{item.value}</div>
                  </div>
                ))}
              </div>
              <div className="text-slate-300 leading-relaxed">הממשק הזה מחבר בין אימון, התאוששות, שתייה וארוחות, כדי שלא יהיה לך רק טקסט אלא מסך מידע אמיתי.</div>
            </ApexCard>

            <ApexCard className="p-8 space-y-5">
              <div className="flex items-center gap-3">
                <Flame className="text-rose-400" />
                <h3 className="text-2xl font-black italic">תדלוק לפי סוג יום</h3>
              </div>
              <div className="space-y-3 text-slate-300 leading-relaxed">
                <p>- Pull ו-Upper: ארוחה בינונית, בלי להכביד.</p>
                <p>- Legs Heavy: יותר פחמימה ומלחים לפני הסשן.</p>
                <p>- Recovery: חלבון קבוע, ירקות, ופחות נשנושים מיותרים.</p>
              </div>
            </ApexCard>

            <ApexCard className="p-8 space-y-5">
              <div className="flex items-center gap-3">
                <Activity className="text-cyan-400" />
                <h3 className="text-2xl font-black italic">Hydration Check</h3>
              </div>
              <div className="space-y-3 text-slate-300 leading-relaxed">
                <p>- כוס מים מיד בקימה.</p>
                <p>- 500-700 מ"ל בשעה שלפני אימון.</p>
                <p>- באימון ארוך, להוסיף עוד מים ומעט מלחים.</p>
              </div>
            </ApexCard>

            <ApexCard className="p-8 space-y-5">
              <div className="flex items-center gap-3">
                <Target className="text-teal-400" />
                <h3 className="text-2xl font-black italic">Quick Meals</h3>
              </div>
              <div className="space-y-3 text-slate-300 leading-relaxed">
                <p>- לפני אימון: יוגורט + בננה, או טוסט + גבינה.</p>
                <p>- אחרי אימון: אורז + עוף, או שייק + פרי.</p>
                <p>- בערב: חלבון מלא + פחמימה רגועה + ירקות.</p>
              </div>
            </ApexCard>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {NUTRITION_MEAL_FLOW.map(section => (
              <ApexCard key={section.title} className="p-8 space-y-5">
                <h3 className="text-2xl font-black italic">{section.title}</h3>
                <div className="space-y-3 text-slate-300">
                  {section.items.map(item => <div key={item} className="bg-black/30 border border-white/5 rounded-2xl px-4 py-3">{item}</div>)}
                </div>
              </ApexCard>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <ApexCard className="p-8 space-y-5">
              <div className="flex items-center gap-3">
                <ListChecks className="text-teal-400" />
                <h3 className="text-2xl font-black italic">רשימת קניות בסיסית</h3>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {SHOPPING_LIST.map(item => <div key={item} className="bg-black/30 border border-white/5 rounded-2xl px-4 py-3 text-slate-200">{item}</div>)}
              </div>
            </ApexCard>

            <ApexCard className="p-8 space-y-5">
              <div className="flex items-center gap-3">
                <Sparkles className="text-amber-400" />
                <h3 className="text-2xl font-black italic">עוד פיצ'רים לתזונה</h3>
              </div>
              <div className="grid gap-3">
                {NUTRITION_BOOSTERS.map(item => (
                  <div key={item} className="bg-black/30 border border-white/5 rounded-2xl px-4 py-3 text-slate-200">{item}</div>
                ))}
              </div>
            </ApexCard>
          </div>

          <ApexCard className="p-8 bg-teal-500/5 border-teal-500/20">
            <div className="flex flex-col md:flex-row justify-between gap-6 items-center">
              <div>
                <p className="text-teal-400 font-black text-[10px] uppercase tracking-widest mb-2">Bridge mode</p>
                <h3 className="text-3xl font-black italic">אפליקציית תזונה + אימון באותו מקום</h3>
                <p className="text-slate-300 mt-2">מהמסך הזה אתה מקבל עוד שכבה, לא במקום האימון, אלא לפניו. זה ההאב שלך.</p>
              </div>
              <ApexButton variant="premium" size="lg" onClick={() => { playToneBurst([700, 880], 0.14); setScreen("main"); }}>לעבור ללוח האימונים</ApexButton>
            </div>
          </ApexCard>
        </div>
      </div>
      </>
    );
  }

  if (inSession) {
    const ex = sessionList[curIdx];
    return (
      <div className="fixed inset-0 bg-[#020617] z-[500] flex flex-col p-6 overflow-y-auto" dir="rtl">
        <header className="flex justify-between items-center mb-8 px-2">
          <ApexButton variant="ghost" size="icon" onClick={() => setInSession(false)} className="rounded-full bg-white/5"><X /></ApexButton>
          <div className="text-center">
            <div className="flex items-center gap-2 justify-center mb-1">
              <div className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-ping" />
              <span className="text-[10px] font-black text-teal-500 uppercase tracking-widest">Active Protocol</span>
            </div>
            <h2 className="text-2xl font-black italic uppercase tracking-tighter">{ex?.name}</h2>
          </div>
          <ApexButton variant="outline" size="icon" onClick={() => setShowSwap(true)} className="rounded-2xl"><RefreshCcw size={20} /></ApexButton>
        </header>

        <div className="flex-1 flex flex-col items-center justify-center space-y-12">
          <div className="text-center space-y-4">
            <ApexBadge variant="elite">סט {curSet} מתוך {ex?.sets}</ApexBadge>
            <h1 className="text-7xl md:text-9xl font-black italic uppercase leading-none tracking-tighter">{ex?.name}</h1>
            <p className="text-slate-400 text-xl font-medium italic max-w-xl px-4 leading-relaxed">{ex?.he}</p>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="relative">
              <motion.div animate={isRunning ? { scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] } : {}} transition={{ repeat: Infinity, duration: 3 }} className={`absolute -inset-10 rounded-full border-2 ${phase === "rest" ? "border-amber-500/20" : "border-teal-500/20"}`} />
              <div className={`h-[22rem] w-[22rem] rounded-full border-4 flex flex-col items-center justify-center transition-all duration-1000 shadow-[0_0_100px_rgba(0,0,0,0.5)] ${phase === "rest" ? "border-amber-500 bg-amber-500/5" : "border-teal-500 bg-teal-500/5"}`}>
                <span className={`text-[12rem] font-black tabular-nums leading-none tracking-tighter ${phase === "rest" ? "text-amber-400" : "text-white"}`}>{timer}</span>
                <span className="text-[10px] font-black uppercase tracking-[0.8em] text-slate-500 mt-4">{phase === "work" ? "EXECUTION" : "RECOVERY"}</span>
              </div>
            </div>

            <ApexCard className="p-10 w-full max-w-sm space-y-8 bg-slate-900/40 border-white/5">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mr-2">משקל (ק"ג)</label>
                  <input type="number" value={weight} onChange={e => setWeight(e.target.value)} placeholder="0" className="w-full bg-black/50 border border-white/10 rounded-2xl p-6 text-3xl font-black italic text-center text-teal-400 outline-none focus:border-teal-500" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mr-2">חזרות שבוצעו</label>
                  <input type="number" value={reps} onChange={e => setReps(e.target.value)} placeholder={ex?.reps} className="w-full bg-black/50 border border-white/10 rounded-2xl p-6 text-3xl font-black italic text-center text-white outline-none focus:border-teal-500" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <ApexButton variant="premium" className="w-full h-16 text-sm italic" onClick={logCurrentSet}>תיעוד סט</ApexButton>
                  <ApexButton variant="outline" className="w-full h-16 text-sm italic" onClick={() => setAskAIExercise(ex)}><span className="font-black tracking-wide">askAI</span></ApexButton>
                </div>
              </div>
            </ApexCard>
          </div>

          <AnimatePresence mode="wait">
            {phase === "rest" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-teal-500/5 border border-teal-500/20 p-8 rounded-[3rem] max-w-2xl text-center relative overflow-hidden">
                <p className="text-teal-400 font-bold text-2xl leading-relaxed">{tip}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="py-8 grid grid-cols-2 gap-4">
          <ApexButton className="h-20 text-xl" onClick={() => setTimer(0)}>{phase === "work" ? "סיימתי סט" : "דלג מנוחה"}</ApexButton>
          <ApexButton variant="outline" className="h-20 text-xl" onClick={() => setIsRunning(v => !v)}>{isRunning ? <Pause size={34} /> : <Play size={34} className="translate-x-1" />}</ApexButton>
        </div>

        {showSwap && ex && <SwapModal currentEx={ex} onSwap={(newEx) => setSessionList(prev => prev.map((item, idx) => idx === curIdx ? newEx : item))} onClose={() => setShowSwap(false)} />}
      </div>
    );
  }

  return (
    <>
      <AnimatePresence>{flashTone && <TransitionFlash tone={flashTone} />}</AnimatePresence>
      <div className="min-h-screen bg-[#020617] text-slate-100 font-sans selection:bg-teal-500/30 overflow-x-hidden" dir="rtl">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-full h-full bg-teal-500/5 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-full h-full bg-indigo-500/5 blur-[150px] rounded-full" />
      </div>

      <AnimatePresence>{toast && <Toast message={toast} />}</AnimatePresence>
      {askAIExercise && <AskAIModal exercise={askAIExercise} logs={logs} onClose={() => setAskAIExercise(null)} onAdd={() => { addExerciseToSession(askAIExercise); setAskAIExercise(null); }} />}

      <header className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 pt-8 md:pt-12 pb-6 md:pb-8 flex flex-col lg:flex-row justify-between items-start gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-4">
            <h1 className="text-[2.2rem] sm:text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-none break-words">Betesh<span className="text-teal-500">Training</span></h1>
            <ApexButton variant="premium" className="gap-2 rounded-[1.4rem]" onClick={() => setAskAIExercise(dayRecommendations[0] || MASTER_VAULT[0])}><span className="font-black tracking-wide">askAI</span></ApexButton>
          </div>
          <div className="text-slate-400 font-bold text-xs sm:text-sm max-w-full">Training, nutrition, recovery, progression.</div>
        </div>
        <div className="flex flex-wrap gap-4">
          <ApexButton variant="outline" className="gap-2 rounded-2xl border-white/5 px-5" onClick={() => navigateWithFlash("splash", "teal")}><Home size={20} /> פתיחה</ApexButton>
          <ApexButton variant="outline" className="gap-2 rounded-2xl border-white/5 px-5" onClick={() => navigateWithFlash("nutrition", "indigo")}><HeartPulse size={20} /> תזונה</ApexButton>
          <ApexButton variant="outline" className="gap-2 rounded-2xl border-white/5 px-5" onClick={openYoutubeHub}><Youtube size={20} /> YouTube</ApexButton>
          <ApexButton variant="outline" className="gap-2 rounded-2xl border-white/5 px-5" onClick={openMusicHub}><Music size={20} /> Music</ApexButton>
        </div>
      </header>

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 pb-56 md:pb-40">
        <div className="hidden md:flex bg-slate-900/80 p-2 rounded-[2.5rem] w-full max-w-2xl mx-auto mb-16 border border-white/10 backdrop-blur-3xl shadow-2xl">
          {[
            { id: "dashboard", label: "בית", icon: Home },
            { id: "vault", label: "מאגר תרגילים", icon: LayoutGrid },
            { id: "stats", label: "הביצועים שלי", icon: BarChart3 }
      
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id as MainTab)}
              className={`flex-1 flex items-center justify-center gap-3 py-5 rounded-[2rem] transition-all duration-500 ${tab === t.id ? "bg-white text-slate-950 shadow-2xl scale-[1.02]" : "text-slate-400 hover:text-white"} font-black text-sm md:text-base tracking-wide`}
              style={{ fontFamily: "ui-rounded, system-ui, sans-serif" }}
            >
              <t.icon size={18} /> {t.label}
            </button>
          ))}
        </div>

        {tab === "dashboard" && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              <ApexCard className="p-5 md:p-8 min-h-[140px] md:min-h-0">
                <div className="text-[9px] md:text-[10px] uppercase tracking-[0.18em] md:tracking-widest text-slate-500 mb-2 md:mb-3">Exercises loaded</div>
                <div className="text-3xl md:text-4xl font-black italic">{sessionList.length}</div>
              </ApexCard>
              <ApexCard className="p-5 md:p-8 min-h-[140px] md:min-h-0">
                <div className="text-[9px] md:text-[10px] uppercase tracking-[0.18em] md:tracking-widest text-slate-500 mb-2 md:mb-3">Session volume</div>
                <div className="text-4xl font-black italic text-teal-400">{sessionVolume}</div>
              </ApexCard>
              <ApexCard className="p-5 md:p-8 min-h-[140px] md:min-h-0">
                <div className="text-[9px] md:text-[10px] uppercase tracking-[0.18em] md:tracking-widest text-slate-500 mb-2 md:mb-3">Estimated kcal</div>
                <div className="text-4xl font-black italic text-amber-400">{estimateCalories(sessionVolume)}</div>
              </ApexCard>
              <ApexCard className="p-5 md:p-8 min-h-[140px] md:min-h-0">
                <div className="text-[9px] md:text-[10px] uppercase tracking-[0.18em] md:tracking-widest text-slate-500 mb-2 md:mb-3">Recovery score</div>
                <div className="text-4xl font-black italic text-indigo-400">{recoveryScore}</div>
              </ApexCard>
            </div>

            <div className="space-y-6">
              <div className="flex items-end justify-between flex-wrap gap-4">
                <div>
                  <p className="text-teal-500 font-black text-[10px] uppercase tracking-[0.5em] mb-2">Day split</p>
                  <h3 className="text-4xl font-black italic uppercase tracking-tighter">{currentDayConfig.title}</h3>
                  <p className="text-slate-400 mt-2">{currentDayConfig.subtitle}</p>
                </div>
                <ApexCard className="px-5 py-4 bg-white/5 border-white/10">
                  <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Fuel tip</div>
                  <div className="text-slate-200 max-w-md">{currentDayConfig.nutrition}</div>
                </ApexCard>
              </div>

              <div className="flex overflow-x-auto gap-4 pb-3">
                {DAY_SPLITS.map(day => (
                  <button
                    key={day.id}
                    onClick={() => { setSelectedDay(day.id); playSoftClick(520); }}
                    className={`relative min-w-[220px] h-32 rounded-[1.8rem] overflow-hidden border transition-all text-right ${selectedDay === day.id ? "border-teal-400 shadow-[0_0_30px_rgba(20,184,166,0.25)] scale-[1.02]" : "border-white/5"}`}
                  >
                    <SafeImage src={getDayImage(day)} alt={day.title} className="absolute inset-0 w-full h-full object-cover opacity-50" fallbackSrc={DEFAULT_EXERCISE_IMAGE} />
                    <div className={`absolute inset-0 ${selectedDay === day.id ? "bg-gradient-to-t from-slate-950 via-slate-950/40 to-teal-500/10" : "bg-gradient-to-t from-slate-950 via-slate-950/55 to-black/10"}`} />
                    <div className="relative z-10 h-full p-5 flex flex-col justify-end">
                      <div className="text-[11px] font-black tracking-[0.25em] text-teal-300 mb-1">{day.label}</div>
                      <div className="text-lg font-black italic uppercase text-white leading-tight">{day.title}</div>
                      <div className="text-xs text-slate-300 mt-1">{day.subtitle}</div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
                {dayRecommendations.map((ex, idx) => (
                  <ApexCard key={ex.id} className="p-6 space-y-4">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <div className="text-[10px] font-black tracking-[0.25em] text-teal-400 mb-2">#{idx + 1} EXERCISE</div>
                        <h4 className="text-2xl font-black italic uppercase tracking-tighter">{ex.name}</h4>
                        <p className="text-slate-400 mt-2 text-sm">{muscleHebrew[ex.muscleGroup]} - {categoryHebrew[ex.category]}</p>
                      </div>
                      <ApexButton variant="outline" className="px-4" onClick={() => setAskAIExercise(ex)}><span className="font-black tracking-wide">askAI</span></ApexButton>
                    </div>
                    <p className="text-slate-300 text-sm leading-relaxed">{getExerciseAiNotes(ex, logs)[0]}</p>
                    <div className="grid grid-cols-2 gap-3">
                      <ApexButton variant="premium" className="gap-2" onClick={() => addExerciseToSession(ex)}><Plus size={16} /> הוסף</ApexButton>
                      <ApexButton variant="outline" className="gap-2" onClick={() => { setVaultFilter(ex.muscleGroup); setTab("vault"); }}><Search size={16} /> פתח במאגר</ApexButton>
                    </div>
                  </ApexCard>
                ))}
              </div>
            </div>

            <AnimatePresence>
              {sessionList.length > 0 && (
                <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }}>
                  <ApexCard className="p-10 border-teal-500/30 bg-teal-500/5">
                    <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
                      <div>
                        <h3 className="text-4xl font-black italic uppercase tracking-tighter">פרוטוקול טעון</h3>
                        <p className="text-slate-400 mt-2">{sessionList.length} תרגילים מחכים להתחלה</p>
                      </div>
                      <ApexBadge variant="teal">{sessionVolume} Volume tracked</ApexBadge>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4 mb-10">
                      {sessionList.map((ex, i) => (
                        <div key={`${ex.id}-${i}`} className="bg-black/40 p-5 rounded-3xl flex justify-between items-center border border-white/5">
                          <div className="flex items-center gap-4">
                            <span className="text-slate-700 font-mono text-xs">0{i + 1}</span>
                            <div>
                              <span className="font-black italic uppercase text-lg block">{ex.name}</span>
                              <span className="text-slate-500 text-xs">{getOverloadSuggestion(ex, logs)}</span>
                            </div>
                          </div>
                          <button onClick={() => setSessionList(prev => prev.filter((_, idx) => idx !== i))} className="p-2 hover:bg-rose-500/10 rounded-xl transition-colors"><Trash2 size={18} className="text-rose-500" /></button>
                        </div>
                      ))}
                    </div>
                    <ApexButton variant="premium" className="w-full h-24 text-2xl italic uppercase font-black tracking-widest" onClick={startProtocol}>
                      Engage Apex Protocol
                    </ApexButton>
                  </ApexCard>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {tab === "vault" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
            <div className="grid md:grid-cols-[1fr_auto] gap-4">
              <div className="relative">
                <Search className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input
                  value={searchText}
                  onChange={e => setSearchText(e.target.value)}
                  placeholder="חפש תרגיל, שריר, תיאור..."
                  className="w-full h-16 bg-slate-900/60 border border-white/5 rounded-[1.6rem] pr-14 pl-5 outline-none focus:border-teal-500"
                />
              </div>
              <ApexButton variant="outline" className="gap-2" onClick={() => { setVaultFilter("All"); setSearchText(""); }}>
                <RefreshCcw size={16} /> איפוס חיפוש
              </ApexButton>
            </div>

            <div className="flex overflow-x-auto gap-3 pb-4">
              {["All", ...Object.keys(muscleHebrew)].map((m: any) => (
                <button
                  key={m}
                  onClick={() => setVaultFilter(m)}
                  className={`px-10 py-5 rounded-[1.5rem] whitespace-nowrap font-black text-[10px] uppercase tracking-widest transition-all duration-500 ${vaultFilter === m ? "bg-teal-500 text-slate-950 shadow-2xl scale-105" : "bg-slate-900 text-slate-500 border border-white/5"}`}
                >
                  {muscleHebrew[m] || m}
                </button>
              ))}
            </div>

            <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
              {filteredVault.map((ex, idx) => {
                const favorite = favorites.includes(ex.id);
                const notes = getExerciseAiNotes(ex, logs);
                return (
                  <ApexCard key={ex.id} className="group flex flex-col h-full hover:border-teal-500/30">
                    <div className="h-64 relative overflow-hidden bg-black/40">
                      <SafeImage src={getExerciseImage(ex)} alt={ex.name} className="w-full h-full object-cover opacity-50 group-hover:scale-110 transition-all duration-1000" fallbackSrc={muscleGroupImages[ex.muscleGroup]} />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                      <div className="absolute top-6 right-6 flex gap-3 items-center">
                        <ApexBadge variant="default">#{idx + 1}</ApexBadge>
                        <ApexBadge variant={ex.difficulty === "Elite" ? "elite" : "teal"}>{ex.difficulty}</ApexBadge>
                        <button onClick={() => toggleFavorite(ex.id)} className={`w-11 h-11 rounded-2xl border flex items-center justify-center ${favorite ? "bg-rose-500/15 border-rose-500/30 text-rose-400" : "bg-black/40 border-white/10 text-white/60"}`}>
                          <HeartPulse size={18} />
                        </button>
                      </div>
                      <div className="absolute bottom-6 right-6 left-6 flex justify-between gap-3">
                        <ApexButton variant="outline" size="icon" className="h-14 w-14 bg-black/50 backdrop-blur-xl border-white/10" onClick={() => openExerciseVideo(ex)}><Youtube className="text-rose-500" size={24} /></ApexButton>
                        <div className="flex gap-3">
                          <ApexButton variant="outline" className="h-14 px-5 bg-black/50 backdrop-blur-xl border-white/10" onClick={() => setAskAIExercise(ex)}><span className="font-black tracking-wide">askAI</span></ApexButton>
                          <ApexButton variant="premium" size="icon" className="h-14 w-14 shadow-2xl" onClick={() => addExerciseToSession(ex)}><Plus size={24} /></ApexButton>
                        </div>
                      </div>
                    </div>
                    <div className="p-8 flex-1 flex flex-col space-y-5">
                      <div className="flex justify-between items-start gap-4">
                        <h4 className="text-4xl font-black italic uppercase tracking-tighter leading-none text-white">{ex.name}</h4>
                        <ApexBadge variant="default">{categoryHebrew[ex.category]}</ApexBadge>
                      </div>
                      <p className="text-slate-400 text-sm font-medium leading-relaxed">{ex.he}</p>

                      <ApexCard className="p-4 bg-white/5 border-white/5">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-[10px] uppercase tracking-widest font-black text-teal-400">askAI לתרגיל</span>
                        </div>
                        <div className="space-y-2 text-sm text-slate-200">
                          {notes.slice(0, 2).map((note, idx) => <div key={idx}>- {note}</div>)}
                        </div>
                      </ApexCard>

                      <div className="flex justify-between items-center pt-4 border-t border-white/5">
                        <div className="flex gap-8">
                          <div className="text-center"><p className="text-[8px] uppercase font-black text-slate-600 mb-2">SETS</p><p className="text-2xl font-black italic">{ex.sets}</p></div>
                          <div className="text-center"><p className="text-[8px] uppercase font-black text-slate-600 mb-2">REPS</p><p className="text-2xl font-black italic">{ex.reps}</p></div>
                        </div>
                        <div className="text-left">
                          <div className="text-[8px] uppercase font-black text-slate-600 mb-2">Load tip</div>
                          <div className="text-sm text-teal-300 max-w-[180px] leading-relaxed">{getOverloadSuggestion(ex, logs)}</div>
                        </div>
                      </div>
                    </div>
                  </ApexCard>
                );
              })}
            </div>
          </motion.div>
        )}

        {tab === "stats" && (
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-12">
            <header className="text-center space-y-4">
              <h2 className="text-7xl font-black italic uppercase tracking-tighter">PERFORMANCE AI</h2>
              <p className="text-slate-600 font-bold uppercase tracking-[0.6em] text-xs">Adaptive coaching and progression signals</p>
            </header>

            <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
              <ApexCard className="p-5 md:p-8 min-h-[140px] md:min-h-0">
                <div className="text-[9px] md:text-[10px] uppercase tracking-[0.18em] md:tracking-widest text-slate-500 mb-2 md:mb-3">AI readiness</div>
                <div className="text-4xl font-black italic text-teal-400">{Math.max(72, Math.min(97, recoveryScore + (sessionList.length ? 3 : 0)))}</div>
                <div className="text-sm text-slate-400 mt-3">מבוסס על התאוששות, פעילות אחרונה ונפח.</div>
              </ApexCard>
              <ApexCard className="p-5 md:p-8 min-h-[140px] md:min-h-0">
                <div className="text-[9px] md:text-[10px] uppercase tracking-[0.18em] md:tracking-widest text-slate-500 mb-2 md:mb-3">Momentum</div>
                <div className="text-4xl font-black italic text-amber-400">{history.length >= 3 ? "Rising" : "Building"}</div>
                <div className="text-sm text-slate-400 mt-3">האפליקציה מעריכה אם אתה במגמת עלייה או עדיין בונה בסיס.</div>
              </ApexCard>
              <ApexCard className="p-5 md:p-8 min-h-[140px] md:min-h-0">
                <div className="text-[9px] md:text-[10px] uppercase tracking-[0.18em] md:tracking-widest text-slate-500 mb-2 md:mb-3">Recovery mode</div>
                <div className="text-4xl font-black italic text-indigo-400">{recoveryScore >= 85 ? "Push" : recoveryScore >= 76 ? "Normal" : "Deload"}</div>
                <div className="text-sm text-slate-400 mt-3">המלצה לעומס היומי לפי היסטוריית עבודה.</div>
              </ApexCard>
              <ApexCard className="p-5 md:p-8 min-h-[140px] md:min-h-0">
                <div className="text-[9px] md:text-[10px] uppercase tracking-[0.18em] md:tracking-widest text-slate-500 mb-2 md:mb-3">Top focus</div>
                <div className="text-4xl font-black italic text-rose-400">{currentDayConfig.title}</div>
                <div className="text-sm text-slate-400 mt-3">המערכת מושכת המלצות סביב פיצול היום הנבחר.</div>
              </ApexCard>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <ApexCard className="p-12 space-y-10">
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-black italic uppercase">Volume Harvest</h3>
                  <TrendingUp className="text-teal-400" />
                </div>
                <div className="h-64 flex items-end justify-between gap-3 px-4">
                  {[40, 85, 55, 100, 70, 90, 80].map((h, i) => (
                    <div key={i} className="flex-1 bg-teal-500/10 rounded-t-2xl relative group overflow-hidden">
                      <motion.div initial={{ height: 0 }} animate={{ height: `${h}%` }} transition={{ delay: i * 0.08 }} className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-teal-600 to-teal-400 opacity-60 group-hover:opacity-100 transition-all duration-500" />
                    </div>
                  ))}
                </div>
                <div className="flex justify-around text-[10px] font-black text-slate-700 uppercase tracking-widest">
                  <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
                </div>
              </ApexCard>

              <ApexCard className="p-10 space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-black italic">AI coach feed</h3>
                  <Cpu className="text-amber-400" />
                </div>
                <div className="space-y-4">
                  {[
                    `עומס נוכחי מוערך: ${sessionVolume} ק"ג, שריפה משוערת ${estimateCalories(sessionVolume)} קלוריות.`,
                    recoveryScore >= 85 ? "היום אפשר לדחוף חזק יותר, הגוף נראה מוכן." : "היום עדיף קצב חכם, לא חייבים לשבור שיא.",
                    `לפי היום שנבחר, המיקוד הבא שלך הוא ${currentDayConfig.title}.`,
                    dayRecommendations[0] ? getOverloadSuggestion(dayRecommendations[0], logs) : "תתחיל לבנות היסטוריית סטים כדי לקבל הצעות חכמות יותר."
                  ].map((tipText, idx) => (
                    <div key={idx} className="bg-black/30 rounded-2xl p-4 border border-white/5 text-slate-200 leading-relaxed">{tipText}</div>
                  ))}
                </div>
                <ApexButton variant="outline" className="w-full gap-2" onClick={() => setAskAIExercise(dayRecommendations[0] || MASTER_VAULT[0])}><Sparkles size={18} /> פתח askAI חכם</ApexButton>
              </ApexCard>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <ApexCard className="p-10 space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-black italic">Smart progression</h3>
                  <Target className="text-teal-400" />
                </div>
                <div className="space-y-4">
                  {dayRecommendations.slice(0, 4).map(ex => (
                    <div key={ex.id} className="bg-black/30 rounded-2xl p-4 border border-white/5">
                      <div className="font-black italic text-lg mb-2">{ex.name}</div>
                      <div className="text-slate-300 text-sm leading-relaxed">{getOverloadSuggestion(ex, logs)}</div>
                    </div>
                  ))}
                </div>
              </ApexCard>

              <ApexCard className="p-10 space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-black italic">Weak point scanner</h3>
                  <Eye className="text-rose-400" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Object.entries(muscleHebrew).slice(0, 6).map(([key, label], idx) => {
                    const score = 68 + ((idx * 7 + history.length * 3 + sessionList.length * 4) % 25);
                    return (
                      <div key={key} className="bg-black/30 rounded-2xl p-4 border border-white/5">
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-bold text-white">{label}</span>
                          <span className="text-sm font-black text-teal-300">{score}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                          <div className="h-full rounded-full bg-gradient-to-r from-teal-500 to-indigo-500" style={{ width: `${score}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ApexCard>
            </div>

            <div className="space-y-6">
              <h3 className="text-2xl font-black italic uppercase px-2">היסטוריית סשנים</h3>
              <div className="space-y-4">
                {history.length > 0 ? history.map(h => (
                  <ApexCard key={h.id} className="p-8 flex justify-between items-center bg-slate-900/20 border-white/5 hover:border-teal-500/20 transition-all">
                    <div className="space-y-1">
                      <h5 className="font-black italic uppercase text-xl text-white">Apex Custom Session</h5>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{h.date} | {h.exercises} תרגילים</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[9px] font-black text-slate-600 uppercase mb-1">Vol</p>
                      <p className="text-3xl font-black italic text-teal-400">{h.volume}kg</p>
                    </div>
                    <ChevronRight size={24} className="text-slate-800" />
                  </ApexCard>
                )) : (
                  <div className="text-center py-24 bg-white/5 rounded-[3rem] border border-dashed border-white/10 space-y-4">
                    <History size={48} className="mx-auto text-slate-800" />
                    <p className="text-slate-600 font-bold uppercase tracking-widest">No session logs found yet.</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[200] w-full max-w-lg px-8">
        <motion.div initial={{ y: 100 }} animate={{ y: 0 }} className="bg-[#0f172a]/90 backdrop-blur-3xl border border-white/10 p-5 rounded-[3rem] flex justify-around items-center shadow-[0_40px_100px_rgba(0,0,0,0.9)]">
          {[
            { id: "dashboard", icon: Home },
            { id: "vault", icon: LayoutGrid },
            { id: "stats", icon: BarChart3 }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setTab(item.id as MainTab)}
              className={`p-5 rounded-[1.5rem] transition-all duration-500 relative group ${tab === item.id ? "bg-teal-500 text-slate-950 shadow-[0_0_30px_rgba(20,184,166,0.5)] scale-110" : "text-slate-600 hover:text-white"}`}
            >
              <item.icon size={28} />
              {tab === item.id && <motion.div layoutId="nav-glow" className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-teal-400 rounded-full" />}
            </button>
          ))}
        </motion.div>
      </div>
    </div>
    </>
  );
}

// --- INITIALIZATION ---
const rootElement = document.getElementById("root");
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(<ReacherApp />);
}
