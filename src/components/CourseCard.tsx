import React from "react";
import { Cpu, Lock, Palette, Play, Sparkles, Video } from "lucide-react";
import { Course, Enrollment, Language } from "../types";

interface CourseCardProps {
  key?: string | number;
  course: Course;
  language: Language;
  enrollment: Enrollment | null;
  completedCount: number;
  onBuy: (course: Course) => void;
  onStartLearning: (course: Course) => void;
}

export default function CourseCard({
  course,
  language,
  enrollment,
  completedCount,
  onBuy,
  onStartLearning,
}: CourseCardProps) {
  const isOromo = language === "om";
  const isBoth = language === "both";

  const t = (om: string, en: string) => {
    if (isBoth) {
      return `${om} / ${en}`;
    }
    return isOromo ? om : en;
  };

  const { id, title, titleOm, icon, bgClass, borderClass, textClass, descriptionOm, descriptionEn, price, lessons } =
    course;

  // Icon picking mapping
  const IconComponent = icon === "Video" ? Video : icon === "Palette" ? Palette : Cpu;

  // Calculate percentage progress safely
  const totalLessons = lessons.length;
  const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  // Derive course access status based on Firestore enrollment state
  const status = enrollment ? enrollment.status : "unauthorized";

  return (
    <div
      id={`course-card-${id}`}
      className={`rounded-3xl border ${borderClass} overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300 flex flex-col justify-between h-full bg-white`}
    >
      <div className="p-6">
        {/* Header Ribbon */}
        <div className="flex justify-between items-start mb-5">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-bold ${textClass}`}>
            <IconComponent className="w-6 h-6" />
          </div>

          {/* Inline Badges per state */}
          {status === "approved" && (
            <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2.5 py-1 rounded-full border border-emerald-200 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3 animate-pulse" />
              <span>{t("Bilaaqameera", "Unlocked")}</span>
            </span>
          )}

          {status === "pending" && (
            <span className="bg-amber-50 text-amber-700 text-[10px] font-bold px-2.5 py-1 rounded-full border border-amber-200 uppercase tracking-wider flex items-center gap-1 animate-pulse">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
              <span>{t("Mirkaneessa Jira", "Pending Approval")}</span>
            </span>
          )}

          {status === "rejected" && (
            <span className="bg-red-50 text-red-700 text-[10px] font-bold px-2.5 py-1 rounded-full border border-red-200 uppercase tracking-wider flex items-center gap-1">
              <span>{t("Hin Mirkaneeffamne", "Rejected")}</span>
            </span>
          )}

          {status === "unauthorized" && (
            <span className="bg-gray-100 text-gray-500 text-[10px] font-semibold px-2.5 py-1 rounded-full border border-gray-200 uppercase tracking-wider flex items-center gap-1">
              <Lock className="w-2.5 h-2.5" />
              <span>{t("Kaffaltii", "Paid Course")}</span>
            </span>
          )}
        </div>

        {/* Content */}
        <h4 className="text-lg font-extrabold text-slate-900 mb-2 font-display">
          {isBoth ? (
            <span className="flex flex-col gap-0.5 text-left">
              <span className="text-slate-900 text-sm sm:text-base font-black truncate">{titleOm}</span>
              <span className="text-slate-500 text-xs truncate md:text-sm font-medium">{title}</span>
            </span>
          ) : isOromo ? (
            titleOm
          ) : (
            title
          )}
        </h4>

        {isBoth ? (
          <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50/50 p-2.5 rounded-xl border border-slate-100/40 mb-6">
            <p className="line-clamp-2 italic"><span className="text-[10px] font-bold text-amber-600">OM:</span> {descriptionOm}</p>
            <p className="line-clamp-2 italic"><span className="text-[10px] font-bold text-blue-500">EN:</span> {descriptionEn}</p>
          </div>
        ) : (
          <p className="text-slate-600 text-xs sm:text-sm mb-6 leading-relaxed line-clamp-3">
            {isOromo ? descriptionOm : descriptionEn}
          </p>
        )}

        {/* Lessons checklist overview */}
        <div className="space-y-2 mt-4">
          <p className="text-[10px] sm:text-xs font-black text-gray-400 uppercase tracking-wider font-mono">
            {t("Qabiyyee Koorasichaa", "Syllabus Overview")} ({totalLessons} {t("Kutaalee", "Lessons")})
          </p>
          <div className="bg-slate-50/40 p-2.5 rounded-xl border border-slate-150/40 space-y-1.5 text-xs text-gray-500 select-none">
            {lessons.map((lesson, idx) => (
              <div key={lesson.id} className="flex items-center gap-2">
                <span className="text-[9px] bg-white font-extrabold border border-slate-200 w-4.5 h-4.5 rounded-md flex items-center justify-center text-gray-500 shrink-0">
                  {idx + 1}
                </span>
                <span className="truncate font-medium text-[11px] text-slate-700">
                  {t(lesson.titleOm, lesson.title)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer controls */}
      <div className="p-6 bg-slate-50 border-t border-slate-100/80 rounded-b-3xl">
        {status === "approved" ? (
          <div>
            {/* Progress indicators */}
            <div className="mb-4">
              <div className="flex justify-between text-[11px] font-bold text-slate-500 mb-1">
                <span>{t("Guddina Kee", "Your Progress")}</span>
                <span>
                  {completedCount}/{totalLessons} ({progressPercent}%)
                </span>
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
            </div>

            <button
              onClick={() => onStartLearning(course)}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2.5 px-4 rounded-xl transition duration-150 flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-emerald-600/10"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>{t("Barachaa Gali", "Start Learning")}</span>
            </button>
          </div>
        ) : status === "pending" ? (
          <div className="space-y-2">
            <div className="flex justify-between items-center text-[10px] text-amber-600 select-none">
              <span className="font-bold">{t("Maallaqa Ergitanii?", "Transfer Sent?")}</span>
              <span className="font-mono bg-amber-50 px-2 py-0.5 rounded border border-amber-100">
                Ref: {enrollment?.transactionRef}
              </span>
            </div>
            <button
              onClick={() => onBuy(course)}
              className="w-full bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold py-2.5 px-4 rounded-xl transition duration-150 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>{t("Ragaa Ilaali", "View/Edit Receipt")}</span>
            </button>
          </div>
        ) : status === "rejected" ? (
          <div className="space-y-2">
            <p className="text-[10px] text-red-600 text-center font-bold leading-normal mb-1">
              {t(
                "Kaffaltiin keessan hin mirkaneeffamne. Maaloo irra deebi'ii kaffalaa.",
                "Your enrollment ticket was declined. Please verify and resubmit."
              )}
            </p>
            <button
              onClick={() => onBuy(course)}
              className="w-full bg-red-600 hover:bg-red-500 text-white text-xs font-bold py-2.5 px-4 rounded-xl transition cursor-pointer text-center"
            >
              {t("Ragaa Haaraa Ergi", "Resubmit Transfer")}
            </button>
          </div>
        ) : (
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider font-mono">
                {t("Gatiin", "Flat rate")}
              </span>
              <span className="text-xl font-black text-slate-800 font-display">
                {price} <span className="text-xs font-extrabold text-blue-500">Birr</span>
              </span>
            </div>
            <button
              onClick={() => onBuy(course)}
              className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-extrabold py-2.5 px-5 rounded-xl shadow-md transition duration-150 flex items-center gap-1 cursor-pointer uppercase tracking-wider"
            >
              <span>{t("Bitadhu", "Buy Now")}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
