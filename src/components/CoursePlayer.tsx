import { ArrowLeft, CheckCircle, Clock, ExternalLink, Play, Sparkles } from "lucide-react";
import { useState } from "react";
import { Course, Language, Lesson } from "../types";

interface CoursePlayerProps {
  language: Language;
  course: Course;
  completedLessons: string[];
  onToggleComplete: (lessonId: string) => Promise<void>;
  onBack: () => void;
}

export default function CoursePlayer({
  language,
  course,
  completedLessons,
  onToggleComplete,
  onBack,
}: CoursePlayerProps) {
  const isOromo = language === "om";
  const isBoth = language === "both";

  const t = (om: string, en: string) => {
    if (isBoth) {
      return `${om} / ${en}`;
    }
    return isOromo ? om : en;
  };

  const [activeLesson, setActiveLesson] = useState<Lesson>(course.lessons[0] || null);
  const [updating, setUpdating] = useState<string | null>(null);

  const totalLessons = course.lessons.length;
  const completedCount = completedLessons.length;
  const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
  const isCourseFinished = progressPercent === 100;

  async function handleToggle(lessonId: string) {
    setUpdating(lessonId);
    try {
      await onToggleComplete(lessonId);
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(null);
    }
  }

  return (
    <div className="bg-white rounded-3xl border border-gray-200/80 shadow-2xl overflow-hidden animate-fadeIn max-w-6xl mx-auto my-6">
      {/* Academy Course player Header bar */}
      <div className="bg-slate-900 text-white p-5 sm:px-8 sm:py-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 sm:p-2.5 rounded-xl bg-slate-850 hover:bg-slate-800 text-slate-350 hover:text-white border border-slate-755 transition cursor-pointer flex items-center justify-center"
            title={t("Gara kosiitti deebi'i", "Back to Course Grid")}
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <span className="text-[10px] text-amber-400 font-extrabold uppercase tracking-widest bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20 font-mono">
              {t("Dandeettii Bilaaqame", "Active Classroom Workspace")}
            </span>
            <h3 className="text-lg sm:text-xl font-black tracking-tight mt-1 font-display">
              {isBoth ? `${course.titleOm} | ${course.title}` : isOromo ? course.titleOm : course.title}
            </h3>
          </div>
        </div>

        {/* Dynamic Class Completion Gauge */}
        <div className="flex items-center gap-3 w-full md:w-auto shrink-0 md:pl-5 md:border-l md:border-slate-800">
          <div className="text-right">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">
              {t("Xumura Koorasichaa", "Class Completed Gauge")}
            </p>
            <p className="text-xs sm:text-sm font-black text-emerald-400 font-mono">
              {completedCount} of {totalLessons} {t("Xumuramee", "Done")} ({progressPercent}%)
            </p>
          </div>
          <div className="relative w-10 h-10 flex items-center justify-center shrink-0 select-none">
            {/* Round radial SVG tracker */}
            <svg className="w-10 h-10 transform -rotate-90">
              <circle cx="20" cy="20" r="16" stroke="#1e293b" strokeWidth="3" fill="transparent" />
              <circle
                cx="20"
                cy="20"
                r="16"
                stroke="#10b981"
                strokeWidth="3"
                fill="transparent"
                strokeDasharray={`${2 * Math.PI * 16}`}
                strokeDashoffset={`${2 * Math.PI * 16 * (1 - progressPercent / 100)}`}
                className="transition-all duration-500 ease-out"
              />
            </svg>
            <span className="absolute text-[8px] font-black text-emerald-400 font-mono">{progressPercent}%</span>
          </div>
        </div>
      </div>

      {/* Main Classroom split workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 min-h-[500px]">
        {/* Left Side Active Video Player & Lesson Guide (2 cols) */}
        <div className="lg:col-span-2 p-5 sm:p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-gray-100">
          <div>
            {/* Interactive Embedded Iframe Player */}
            <div className="relative w-full aspect-video rounded-2xl bg-slate-950 overflow-hidden shadow-lg border border-slate-900 group">
              {activeLesson ? (
                <iframe
                  src={activeLesson.videoUrl}
                  title={activeLesson.title}
                  className="absolute inset-0 w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 p-6 text-center select-none">
                  <Play className="w-12 h-12 text-slate-800 animate-pulse mb-3" />
                  <p className="font-semibold text-xs uppercase tracking-wider font-mono">
                    {t("Filadhu barumsa tokko barnoota jalqabuuf", "Select a lecture module from outline")}
                  </p>
                </div>
              )}
            </div>

            {/* Lesson Info description */}
            {activeLesson && (
              <div className="mt-6">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-150 pb-4 mb-4">
                  <div>
                    <h4 className="text-base sm:text-lg font-extrabold text-slate-900 font-display">
                      {isBoth ? `${activeLesson.titleOm} | ${activeLesson.title}` : isOromo ? activeLesson.titleOm : activeLesson.title}
                    </h4>
                    <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1 font-mono">
                      <Clock className="w-3.5 h-3.5 text-blue-500" />
                      <span>{t("Yeroo: ", "Duration: ")} {activeLesson.duration}</span>
                    </p>
                  </div>

                  {/* Complete/Incomplete CTA Checkbox button */}
                  <button
                    onClick={() => handleToggle(activeLesson.id)}
                    disabled={updating !== null}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer border ${
                      completedLessons.includes(activeLesson.id)
                        ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                        : "bg-blue-600 hover:bg-blue-700 text-white border-transparent"
                    }`}
                  >
                    <CheckCircle className={`w-4 h-4 ${completedLessons.includes(activeLesson.id) ? "fill-emerald-200" : ""}`} />
                    <span>
                      {updating === activeLesson.id ? (
                        <span className="w-3.5 h-3.5 rounded-full border-2 border-current border-t-transparent animate-spin inline-block"></span>
                      ) : completedLessons.includes(activeLesson.id) ? (
                        t("Xumurameera! (Completed)", "Completed!")
                      ) : (
                        t("Xumureera / Mark Completed", "Mark as Completed")
                      )}
                    </span>
                  </button>
                </div>

                {/* Sub-descriptions */}
                {isBoth ? (
                  <div className="space-y-3 bg-slate-50/50 p-4 rounded-xl border border-slate-200/60 mb-6 text-xs sm:text-sm">
                    <p className="text-slate-800 leading-relaxed font-medium">
                      <span className="text-[10px] font-black uppercase text-amber-600 block mb-0.5">Afaan Oromoo</span>
                      {activeLesson.descriptionOm}
                    </p>
                    <p className="text-slate-600 leading-relaxed font-light border-t border-slate-150/60 pt-2">
                      <span className="text-[10px] font-black uppercase text-blue-500 block mb-0.5">English</span>
                      {activeLesson.descriptionEn}
                    </p>
                  </div>
                ) : (
                  <p className="text-slate-700 text-xs sm:text-sm leading-relaxed mb-6 font-medium bg-slate-50 p-4 rounded-xl border border-slate-150">
                    {isOromo ? activeLesson.descriptionOm : activeLesson.descriptionEn}
                  </p>
                )}

                {/* Technical notes */}
                <div className="prose prose-sm max-w-none text-slate-600">
                  <h5 className="font-extrabold text-slate-800 text-[11px] sm:text-xs uppercase tracking-wider mb-2 font-mono">
                    {t("Qabiyyee fi Gorsa Addaa", "Technical Lecture Guide Notes")}
                  </h5>
                  <div className="bg-slate-900 text-slate-300 p-4 rounded-xl text-xs font-mono select-all overflow-x-auto border border-slate-950">
                    {isBoth ? (
                      <div className="space-y-3 font-mono">
                        <div>
                          <p className="text-emerald-400 text-[10px] uppercase font-bold">[Oromoo Notes]</p>
                          <p className="mt-1 leading-relaxed">{activeLesson.contentOm}</p>
                        </div>
                        <div className="border-t border-slate-800 pt-2">
                          <p className="text-blue-400 text-[10px] uppercase font-bold">[English Notes]</p>
                          <p className="mt-1 leading-relaxed">{activeLesson.contentEn}</p>
                        </div>
                      </div>
                    ) : isOromo ? (
                      activeLesson.contentOm
                    ) : (
                      activeLesson.contentEn
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Congratulations Card upon finishing all tasks of the class */}
          {isCourseFinished && (
            <div className="mt-8 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-300 p-6 rounded-2xl flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left select-none">
              <div className="w-14 h-14 bg-emerald-500 text-white rounded-2xl flex items-center justify-center text-3xl shrink-0 shadow-lg shadow-emerald-500/10">
                <Sparkles className="w-7 h-7 animate-bounce" />
              </div>
              <div>
                <h5 className="text-base font-black text-emerald-800 flex items-center gap-1.5 justify-center sm:justify-start">
                  <span>{t("Gariidha! Bagas Gammaddan!", "Congratulations on Graduating!")}</span>
                </h5>
                <p className="text-xs text-emerald-700 mt-1 leading-relaxed font-medium">
                  {t(
                    "Koorasii kana kutaalee hunda milkinaan xumurtaniittu! Mirga dandeetti keessanii hojitti hiikaa.",
                    "You have completed all curriculum modules successfully. Go implement your digital workflows to build value!"
                  )}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right Side Class Syllabus Index Menu (1 col) */}
        <div className="bg-slate-50/50 p-5 sm:p-6">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 font-mono">
            {t("Kutaalee Barnootaa", "Class Modules Outline")}
          </p>

          <div className="space-y-3">
            {course.lessons.map((lesson, index) => {
              const isSelected = activeLesson?.id === lesson.id;
              const isCompleted = completedLessons.includes(lesson.id);

              return (
                <div
                  key={lesson.id}
                  onClick={() => setActiveLesson(lesson)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex justify-between items-center ${
                    isSelected
                      ? "bg-white border-blue-400 shadow-md ring-1 ring-blue-100"
                      : "bg-white border-slate-150 hover:border-slate-200 hover:shadow-xs"
                  }`}
                >
                  <div className="flex items-start gap-3 w-[80%]">
                    {/* Index Sphere or Completion Sphere */}
                    <div
                      className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-extrabold shrink-0 mt-0.5 border transition ${
                        isCompleted
                          ? "bg-emerald-50 text-emerald-600 border-emerald-300"
                          : isSelected
                            ? "bg-blue-600 text-white border-transparent"
                            : "bg-gray-50 text-gray-500 border-gray-200"
                      }`}
                    >
                      {isCompleted ? "✓" : index + 1}
                    </div>

                    <div className="overflow-hidden">
                      <p className={`text-xs font-bold truncate ${isSelected ? "text-blue-600" : "text-gray-800"}`}>
                        {t(lesson.titleOm, lesson.title)}
                      </p>
                      <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3" />
                        <span>{lesson.duration}</span>
                      </p>
                    </div>
                  </div>

                  {/* Complete Spark Icon */}
                  {isCompleted && (
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 select-none fill-emerald-100" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Help card */}
          <div className="mt-8 bg-blue-50/40 p-4 rounded-2xl border border-blue-100/60 text-xs">
            <p className="font-bold text-blue-800">{t("Gargaarsa qabduu?", "Need assistance?")}</p>
            <p className="text-slate-600 mt-1 leading-relaxed">
              {t(
                "Barsiisaa koorasichaa dhuunfaan qunnamanii gargaarsa dabalataa gaafachuuf Telegramiin ergaa.",
                "Ask the lecturer specific questions by messaging Amanuel on Telegram directly."
              )}
            </p>
            <a
              href="https://t.me/Amanuel_Harar"
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 text-blue-600 font-bold hover:underline cursor-pointer font-mono"
            >
              <span>Telegram Chat Help</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
