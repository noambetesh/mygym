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
 * REACHER APEX PLATINUM v20.0 - THE FINAL ARCHITECTURE
 * ENGINEERED FOR NOAM.
 * 80+ EXERCISES // TECHNICAL HEBREW // ZERO QUOTES // FULL LOGGING
 */

// --- GLOBAL TYPES ---
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
    danger: "bg-rose-600 text-white",
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

// --- MODAL: SWAP EXERCISE ---
function SwapModal({ currentEx, onSwap, onClose }: { currentEx: Exercise, onSwap: (e: Exercise) => void, onClose: () => void }) {
  const alts = useMemo(() => MASTER_VAULT.filter(e => e.muscleGroup === currentEx.muscleGroup && e.id !== currentEx.id), [currentEx]);
  return (
    <div className="fixed inset-0 z-[600] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-6" dir="rtl">
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-slate-900 border border-white/10 w-full max-w-4xl rounded-[3rem] overflow-hidden">
        <div className="p-8 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-3xl font-black italic uppercase tracking-tighter">החלפת פרוטוקול</h3>
            <ApexButton variant="ghost" size="icon" onClick={onClose}><X/></ApexButton>
          </div>
          <div className="grid md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto pr-2 scrollbar-hide">
            {alts.map(ex => (
              <ApexCard key={ex.id} className="p-4 flex items-center gap-4 cursor-pointer hover:bg-white/5" onClick={() => { onSwap(ex); onClose(); }}>
                <img src={ex.imageUrl} className="w-20 h-20 rounded-2xl object-cover opacity-50" />
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
  // Navigation & UI State
  const [screen, setScreen] = useState<"splash" | "main">("splash");
  const [tab, setTab] = useState<"dashboard" | "vault" | "stats" | "settings">("dashboard");
  const [vaultFilter, setVaultFilter] = useState<MuscleGroup | "All">("All");
  
  // Session / Execution State
  const [sessionList, setSessionList] = useState<Exercise[]>([]);
  const [inSession, setInSession] = useState(false);
  const [curIdx, setCurIdx] = useState(0);
  const [curSet, setCurSet] = useState(1);
  const [phase, setPhase] = useState<"work" | "rest">("work");
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [showSwap, setShowSwap] = useState(false);
  const [tip, setTip] = useState(AI_TIPS[0]);
  
  // Data Logging
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");
  const [logs, setLogs] = useState<SetRecord[]>(() => JSON.parse(localStorage.getItem("reacher_logs_v20") || "[]"));
  const [history, setHistory] = useState<SessionData[]>(() => JSON.parse(localStorage.getItem("reacher_hist_v20") || "[]"));

  const audioCtx = useRef<AudioContext | null>(null);

  // Persistence
  useEffect(() => localStorage.setItem("reacher_logs_v20", JSON.stringify(logs)), [logs]);
  useEffect(() => localStorage.setItem("reacher_hist_v20", JSON.stringify(history)), [history]);

  // Alert System
  const playAlert = (f: number) => {
    if (!audioCtx.current) audioCtx.current = new AudioContext();
    if (audioCtx.current.state === 'suspended') audioCtx.current.resume();
    const o = audioCtx.current.createOscillator();
    const g = audioCtx.current.createGain();
    o.connect(g); g.connect(audioCtx.current.destination);
    o.frequency.value = f;
    g.gain.setValueAtTime(0.1, audioCtx.current.currentTime);
    g.gain.exponentialRampToValueAtTime(0.01, audioCtx.current.currentTime + 0.4);
    o.start(); o.stop(audioCtx.current.currentTime + 0.4);
  };

  // Timer Lifecycle
  useEffect(() => {
    let t: any;
    if (isRunning && timer > 0) {
      t = setInterval(() => setTimer(v => v - 1), 1000);
    } else if (isRunning && timer === 0) {
      handlePhaseTransition();
    }
    return () => clearInterval(t);
  }, [isRunning, timer, phase]);

  const handlePhaseTransition = () => {
    const ex = sessionList[curIdx];
    if (!ex) return;

    if (phase === "work") {
      playAlert(600);
      setPhase("rest");
      setTimer(ex.rest);
      setTip(AI_TIPS[Math.floor(Math.random() * AI_TIPS.length)]);
    } else {
      playAlert(1000);
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
    const totalWeight = logs.slice(-10).reduce((acc, curr) => acc + (curr.weight * curr.reps), 0);
    const newHist: SessionData = {
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toLocaleDateString('he-IL'),
      volume: totalWeight || 0,
      exercises: sessionList.length
    };
    setHistory(p => [newHist, ...p]);
    setInSession(false);
    setIsRunning(false);
    setSessionList([]);
    alert("אימון הושלם בהצלחה, נועם! הנתונים נשמרו.");
  };

  const logCurrentSet = () => {
    if (!weight || !reps) return;
    const record: SetRecord = {
      weight: parseInt(weight),
      reps: parseInt(reps),
      exerciseId: sessionList[curIdx].id,
      timestamp: Date.now()
    };
    setLogs(p => [...p, record]);
    setWeight("");
    setReps("");
    playAlert(800);
  };

  // --- RENDER SCREENS ---

  if (screen === "splash") {
    return (
      <div className="fixed inset-0 bg-slate-950 flex flex-col items-center justify-center p-12 overflow-hidden text-center">
        <div className="absolute inset-0 opacity-10 blur-sm scale-110">
          <img src={REACHER_HERO} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
        </div>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 space-y-12">
           <div className="flex flex-col items-center gap-4">
              <div className="w-24 h-24 bg-teal-500 rounded-[2.5rem] flex items-center justify-center shadow-[0_0_50px_rgba(20,184,166,0.5)]">
                <Swords size={48} className="text-slate-950" />
              </div>
              <p className="text-teal-400 font-mono text-[10px] uppercase tracking-[0.6em] mt-4"><Cpu size={14} className="inline mr-2"/>PLATINUM ENGINE v20.0</p>
           </div>
           <h1 className="text-8xl md:text-[11rem] font-black italic uppercase text-white tracking-tighter leading-[0.8]">REACHER<br/><span className="text-teal-500">APEX</span></h1>
           <p className="text-slate-500 font-bold uppercase tracking-[0.4em] text-sm">Train Ruthless. Build Armor.</p>
           <ApexButton size="lg" className="px-24 py-10 text-2xl shadow-2xl group relative overflow-hidden" onClick={() => setScreen("main")}>
              <span className="relative z-10">INITIALIZE</span>
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
           </ApexButton>
        </motion.div>
      </div>
    );
  }

  if (inSession) {
    const ex = sessionList[curIdx];
    return (
      <div className="fixed inset-0 bg-[#020617] z-[500] flex flex-col p-6 overflow-y-auto" dir="rtl">
         {/* Live Header */}
         <header className="flex justify-between items-center mb-8 px-2">
            <ApexButton variant="ghost" size="icon" onClick={() => setInSession(false)} className="rounded-full bg-white/5"><X/></ApexButton>
            <div className="text-center">
               <div className="flex items-center gap-2 justify-center mb-1">
                  <div className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-ping" />
                  <span className="text-[10px] font-black text-teal-500 uppercase tracking-widest">Active Protocol</span>
               </div>
               <h2 className="text-2xl font-black italic uppercase tracking-tighter">{ex?.name}</h2>
            </div>
            <ApexButton variant="outline" size="icon" onClick={() => setShowSwap(true)} className="rounded-2xl"><RefreshCcw size={20}/></ApexButton>
         </header>

         <div className="flex-1 flex flex-col items-center justify-center space-y-12">
            {/* Identity Card */}
            <div className="text-center space-y-4">
              <ApexBadge variant="elite">סט {curSet} מתוך {ex?.sets}</ApexBadge>
              <h1 className="text-7xl md:text-9xl font-black italic uppercase leading-none tracking-tighter">{ex?.name}</h1>
              <p className="text-slate-400 text-xl font-medium italic max-w-xl px-4 leading-relaxed">{ex?.he}</p>
            </div>

            {/* Main Visualizer */}
            <div className="flex flex-col md:flex-row items-center gap-16">
              <div className="relative">
                 <motion.div animate={isRunning ? { scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] } : {}} transition={{ repeat: Infinity, duration: 3 }} className={`absolute -inset-10 rounded-full border-2 ${phase === 'rest' ? 'border-amber-500/20' : 'border-teal-500/20'}`} />
                 <div className={`h-[22rem] w-[22rem] rounded-full border-4 flex flex-col items-center justify-center transition-all duration-1000 shadow-[0_0_100px_rgba(0,0,0,0.5)] ${phase === 'rest' ? 'border-amber-500 bg-amber-500/5' : 'border-teal-500 bg-teal-500/5'}`}>
                    <span className={`text-[12rem] font-black tabular-nums leading-none tracking-tighter ${phase === 'rest' ? 'text-amber-400' : 'text-white'}`}>{timer}</span>
                    <span className="text-[10px] font-black uppercase tracking-[0.8em] text-slate-500 mt-4">{phase === 'work' ? 'EXECUTION' : 'RECOVERY'}</span>
                 </div>
              </div>

              {/* Data Panel */}
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
                    <ApexButton variant="premium" className="w-full h-16 text-sm italic" onClick={logCurrentSet}>תיעוד סט נוכחי</ApexButton>
                 </div>
              </ApexCard>
            </div>

            {/* AI Coaching Bubble */}
            <AnimatePresence mode="wait">
              {phase === 'rest' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-teal-500/5 border border-teal-500/20 p-8 rounded-[3rem] max-w-2xl text-center relative overflow-hidden group">
                   <div className="absolute top-0 right-0 p-4 opacity-5"><Sparkles size={40}/></div>
                   <p className="text-teal-400 font-bold italic text-2xl leading-relaxed">"{tip}"</p>
                </motion.div>
              )}
            </AnimatePresence>
         </div>

         {/* Bottom Control Deck */}
         <div className="py-12 grid grid-cols-2 gap-8 max-w-4xl mx-auto w-full">
            <ApexButton className="h-24 text-3xl italic font-black uppercase shadow-2xl" onClick={() => setTimer(0)}>{phase === 'work' ? 'סט הושלם' : 'דלג מנוחה'}</ApexButton>
            <ApexButton variant="outline" className="h-24 border-white/10" onClick={() => setIsRunning(!isRunning)}>{isRunning ? <Pause size={48}/> : <Play size={48} className="translate-x-1"/>}</ApexButton>
         </div>

         {showSwap && <SwapModal currentEx={ex} onSwap={newE => { const s = [...sessionList]; s[curIdx] = newE; setSessionList(s); }} onClose={() => setShowSwap(false)} />}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 p-6 pt-12 pb-44" dir="rtl">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-full h-full bg-teal-500/5 blur-[120px] rounded-full" />
      </div>

      {/* Main Header */}
      <header className="flex justify-between items-end mb-16 px-4">
         <div className="space-y-1">
            <h2 className="text-5xl font-black italic uppercase leading-none tracking-tighter text-white">COMMAND<br/>CENTER</h2>
            <div className="flex items-center gap-2 text-teal-500 font-black text-[10px] tracking-widest mt-3 uppercase">
              <div className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-ping" /> System Online: Noam APEX
            </div>
         </div>
         <div className="flex gap-4">
            <ApexButton variant="outline" size="icon" className="rounded-2xl border-white/5" onClick={() => window.open('spotify://', '_blank')}><Music size={22}/></ApexButton>
            <ApexButton variant="outline" size="icon" className="rounded-2xl border-white/5" onClick={() => setTab("settings")}><Settings2 size={24}/></ApexButton>
         </div>
      </header>

      {/* Top Tabs */}
      <div className="flex bg-slate-900/80 p-2 rounded-[2.5rem] w-full max-w-xl mx-auto mb-16 border border-white/10 backdrop-blur-3xl shadow-2xl">
         {[
           { id: "dashboard", label: "דאשבורד", icon: Home },
           { id: "vault", label: "המאגר", icon: LayoutGrid },
           { id: "stats", label: "ביצועים", icon: BarChart3 }
         ].map(t => (
           <button 
             key={t.id} onClick={() => setTab(t.id as any)}
             className={`flex-1 flex items-center justify-center gap-3 py-5 rounded-[2rem] font-black text-[11px] uppercase tracking-widest transition-all duration-500 ${tab === t.id ? 'bg-white text-slate-950 shadow-2xl scale-[1.02]' : 'text-slate-500 hover:text-white'}`}
           >
             <t.icon size={16}/> {t.label}
           </button>
         ))}
      </div>

      {/* DASHBOARD VIEW */}
      {tab === "dashboard" && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-16">
           {/* Muscle Selector Heatmap */}
           <div className="space-y-8">
              <h4 className="text-xl font-black italic uppercase tracking-[0.4em] px-4 text-slate-500">מיקוד שרירי</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 px-2">
                 {Object.keys(muscleGroupImages).map((m: any) => (
                   <motion.div 
                     key={m} whileHover={{ scale: 1.03 }}
                     onClick={() => { setVaultFilter(m); setTab("vault"); }}
                     className="relative h-48 rounded-[3rem] overflow-hidden border border-white/5 group cursor-pointer"
                   >
                      <img src={muscleGroupImages[m as MuscleGroup]} className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-50 transition-all duration-700" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                      <div className="absolute bottom-6 right-8 left-8">
                         <p className="text-[9px] font-black text-teal-500 uppercase tracking-widest mb-1">Focus</p>
                         <span className="text-3xl font-black italic uppercase tracking-tighter">{muscleHebrew[m]}</span>
                      </div>
                   </motion.div>
                 ))}
              </div>
           </div>

           {/* Session Queue Card */}
           <AnimatePresence>
             {sessionList.length > 0 && (
               <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
                 <ApexCard className="p-12 border-teal-500/30 bg-teal-500/5">
                    <div className="flex justify-between items-center mb-10">
                       <h3 className="text-4xl font-black italic uppercase tracking-tighter">פרוטוקול טעון</h3>
                       <ApexBadge variant="teal">{sessionList.length} תרגילים בסשן</ApexBadge>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4 mb-12">
                       {sessionList.map((ex, i) => (
                         <div key={i} className="bg-black/40 p-5 rounded-3xl flex justify-between items-center border border-white/5 group hover:border-teal-500/20 transition-all">
                            <div className="flex items-center gap-4">
                               <span className="text-slate-700 font-mono text-xs">0{i+1}</span>
                               <span className="font-black italic uppercase text-lg">{ex.name}</span>
                            </div>
                            <button onClick={() => setSessionList(p => p.filter((_, idx) => idx !== i))} className="p-2 hover:bg-rose-500/10 rounded-xl transition-colors"><Trash2 size={18} className="text-rose-500"/></button>
                         </div>
                       ))}
                    </div>
                    <ApexButton variant="premium" className="w-full h-24 text-2xl italic uppercase font-black tracking-widest shadow-[0_20px_50px_rgba(20,184,166,0.3)]" onClick={() => { setInSession(true); setCurIdx(0); setTimer(sessionList[0].work); setIsRunning(true); }}>
                       ENGAGE APEX PROTOCOL
                    </ApexButton>
                 </ApexCard>
               </motion.div>
             )}
           </AnimatePresence>
        </motion.div>
      )}

      {/* VAULT VIEW */}
      {tab === "vault" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
           {/* Filters */}
           <div className="flex flex-col md:flex-row gap-6">
              <div className="flex overflow-x-auto gap-3 pb-4 scrollbar-hide px-2">
                 {["All", ...Object.keys(muscleHebrew)].map((m: any) => (
                   <button 
                     key={m} onClick={() => setVaultFilter(m)} 
                     className={`px-10 py-5 rounded-[1.5rem] whitespace-nowrap font-black text-[10px] uppercase tracking-widest transition-all duration-500 ${vaultFilter === m ? 'bg-teal-500 text-slate-950 shadow-2xl scale-105' : 'bg-slate-900 text-slate-500 border border-white/5'}`}
                   >
                     {muscleHebrew[m] || m}
                   </button>
                 ))}
              </div>
           </div>

           {/* Grid */}
           <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3 px-2">
              {MASTER_VAULT.filter(ex => vaultFilter === "All" || ex.muscleGroup === vaultFilter).map(ex => (
                <ApexCard key={ex.id} className="group flex flex-col h-full hover:border-teal-500/30">
                   <div className="h-64 relative overflow-hidden bg-black/40">
                      <img src={ex.imageUrl} className="w-full h-full object-cover opacity-50 group-hover:scale-110 transition-all duration-1000" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                      <div className="absolute bottom-6 right-6 flex gap-4">
                         <ApexButton variant="outline" size="icon" className="h-14 w-14 bg-black/50 backdrop-blur-xl border-white/10" onClick={() => window.open(ex.videoUrl)}><Youtube className="text-rose-500" size={24}/></ApexButton>
                         <ApexButton variant="premium" size="icon" className="h-14 w-14 shadow-2xl" onClick={() => { setSessionList(p => [...p, ex]); playAlert(1200); }}><Plus size={24}/></ApexButton>
                      </div>
                      <div className="absolute top-6 right-6"><ApexBadge variant={ex.difficulty === 'Elite' ? 'elite' : 'teal'}>{ex.difficulty}</ApexBadge></div>
                   </div>
                   <div className="p-8 flex-1 flex flex-col space-y-4">
                      <h4 className="text-4xl font-black italic uppercase tracking-tighter leading-none text-white">{ex.name}</h4>
                      <p className="text-slate-400 text-sm font-medium leading-relaxed italic flex-1">{ex.he}</p>
                      <div className="flex justify-between items-center pt-8 border-t border-white/5">
                         <div className="flex gap-8">
                            <div className="text-center"><p className="text-[8px] uppercase font-black text-slate-600 mb-2">SETS</p><p className="text-2xl font-black italic">{ex.sets}</p></div>
                            <div className="text-center"><p className="text-[8px] uppercase font-black text-slate-600 mb-2">REPS</p><p className="text-2xl font-black italic">{ex.reps}</p></div>
                         </div>
                         <ApexBadge variant="default">{categoryHebrew[ex.category]}</ApexBadge>
                      </div>
                   </div>
                </ApexCard>
              ))}
           </div>
        </motion.div>
      )}

      {/* STATS VIEW */}
      {tab === "stats" && (
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-12">
           <header className="text-center space-y-4">
              <h2 className="text-7xl font-black italic uppercase tracking-tighter">PERFORMANCE</h2>
              <p className="text-slate-600 font-bold uppercase tracking-[0.6em] text-xs">Data Harvesting Engine Operational</p>
           </header>

           <div className="grid md:grid-cols-2 gap-8 px-2">
              <ApexCard className="p-12 space-y-10">
                 <div className="flex justify-between items-center">
                    <h3 className="text-2xl font-black italic uppercase">Volume Harvest</h3>
                    <TrendingUp className="text-teal-400" />
                 </div>
                 <div className="h-64 flex items-end justify-between gap-3 px-4">
                    {[40, 85, 55, 100, 70, 90, 80].map((h, i) => (
                       <div key={i} className="flex-1 bg-teal-500/10 rounded-t-2xl relative group cursor-pointer overflow-hidden">
                          <motion.div initial={{ height: 0 }} animate={{ height: `${h}%` }} transition={{ delay: i * 0.1 }} className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-teal-600 to-teal-400 opacity-60 group-hover:opacity-100 transition-all duration-500" />
                       </div>
                    ))}
                 </div>
                 <div className="flex justify-around text-[10px] font-black text-slate-700 uppercase tracking-widest">
                    <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
                 </div>
              </ApexCard>

              <div className="space-y-6">
                 <h3 className="text-2xl font-black italic uppercase px-4">היסטוריית סשנים</h3>
                 <div className="space-y-4">
                    {history.length > 0 ? history.map((h, i) => (
                       <ApexCard key={h.id} className="p-8 flex justify-between items-center bg-slate-900/20 border-white/5 hover:border-teal-500/20 transition-all">
                          <div className="space-y-1">
                             <h5 className="font-black italic uppercase text-xl text-white">Apex Custom Session</h5>
                             <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{h.date} | {h.exercises} תרגילים</p>
                          </div>
                          <div className="text-center">
                             <p className="text-[9px] font-black text-slate-600 uppercase mb-1">Vol (Est)</p>
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
           </div>
        </motion.div>
      )}

      {/* NAVIGATION */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[200] w-full max-w-lg px-8">
         <motion.div 
           initial={{ y: 100 }} animate={{ y: 0 }}
           className="bg-[#0f172a]/90 backdrop-blur-3xl border border-white/10 p-5 rounded-[3rem] flex justify-around items-center shadow-[0_40px_100px_rgba(0,0,0,0.9)]"
         >
            {[
              { id: "dashboard", icon: Home },
              { id: "vault", icon: LayoutGrid },
              { id: "stats", icon: BarChart3 },
              { id: "settings", icon: Settings2 }
            ].map(item => (
              <button 
                key={item.id} onClick={() => setTab(item.id as any)}
                className={`p-5 rounded-[1.5rem] transition-all duration-500 relative group ${tab === item.id ? 'bg-teal-500 text-slate-950 shadow-[0_0_30px_rgba(20,184,166,0.5)] scale-110' : 'text-slate-600 hover:text-white'}`}
              >
                 <item.icon size={28} />
                 {tab === item.id && (
                   <motion.div layoutId="nav-glow" className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-teal-400 rounded-full" />
                 )}
              </button>
            ))}
         </motion.div>
      </div>
    </div>
  );
}

// --- INITIALIZATION ---
const rootElement = document.getElementById("root");
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(<ReacherApp />);
}
