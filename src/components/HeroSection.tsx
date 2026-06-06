import { BookOpen, HelpCircle, Landmark } from "lucide-react";
import { Language } from "../types";

interface HeroSectionProps {
  language: Language;
}

export default function HeroSection({ language }: HeroSectionProps) {
  const isOromo = language === "om";
  const isBoth = language === "both";

  const t = (om: string, en: string) => {
    if (isBoth) {
      return `${om} / ${en}`;
    }
    return isOromo ? om : en;
  };

  return (
    <section
      id="home"
      className="relative bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white overflow-hidden py-20 sm:py-24 px-4 border-b border-slate-850"
    >
      {/* Background radial effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto text-center relative z-10">
        <span className="inline-flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-extrabold px-3.5 py-1.5 rounded-full mb-6 font-mono uppercase tracking-wider">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          {t("Baga nagaan dhuftan! (Amoo Academy)", "Welcome to Amoo Academy Portal!")}
        </span>

        {/* Responsive Dual-Language Header Layout */}
        {isBoth ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left mb-8 max-w-4xl mx-auto items-center border-y border-white/5 py-4">
            <div className="border-r border-white/5 pr-4">
              <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block mb-1">Afaan Oromoo</span>
              <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight font-display">
                Ogummaa Keessan <span className="text-amber-400">Sadarkaa Itti Aanutti</span> Ceesisaa!
              </h2>
              <p className="text-xs text-slate-350 mt-2 leading-relaxed font-light">
                Koorsota tekinoolojii fi daldalaa gadi fageenyaan qophaa'an afaan keessaniin baradhaa. Gulaala viidiyoo, dizaayinii fi AI dandeettii daldalaaf!
              </p>
            </div>
            <div className="pl-2">
              <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider block mb-1">English Language</span>
              <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight font-display">
                Elevate Your <span className="text-blue-400">Digital Skills</span> to the Next Level!
              </h2>
              <p className="text-xs text-slate-350 mt-2 leading-relaxed font-light">
                Learn premium technology and business courses structured fully in your language. Master cinematic editing, graphic layout systems, and prompt scripting.
              </p>
            </div>
          </div>
        ) : (
          <div className="mb-6">
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-black mb-6 leading-tight tracking-tight font-display">
              {isOromo ? (
                <>
                  Ogummaa Keessan <br />
                  <span className="text-amber-400">Sadarkaa Itti Aanutti</span> Ceesisaa!
                </>
              ) : (
                <>
                  Elevate Your <span className="text-blue-400">Digital Skills</span> <br /> to the Next Level!
                </>
              )}
            </h2>
            <p className="text-base sm:text-lg max-w-2xl mx-auto text-slate-300 font-normal leading-relaxed mb-8">
              {isOromo
                ? "Koorsota tekinoolojii fi daldalaa gadi fageenyaan qophaa'an afaan keessaniin baradhaa. Gulaala viidiyoo, dizaayinii fi AI dandeettii daldalaaf!"
                : "Learn premium technology and business courses structured fully in your language. Master cinematic editing, graphic layout systems, and prompt scripting."}
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a
            href="#courses"
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white font-extrabold py-3.5 px-8 rounded-xl text-xs sm:text-sm uppercase tracking-wider transition-all transform hover:-translate-y-0.5 shadow-lg shadow-blue-600/10 cursor-pointer"
          >
            {t("Barumsa Filadhu", "Explore Courses")}
          </a>
          <a
            href="#contact"
            className="w-full sm:w-auto bg-slate-800 hover:bg-slate-750 text-slate-200 font-extrabold py-3.5 px-8 rounded-xl border border-slate-700 text-xs sm:text-sm uppercase tracking-wider transition-all cursor-pointer"
          >
            {t("Kaffaltii fi Gargaarsa", "Payment & Desk Support")}
          </a>
        </div>

        {/* Feature Highlights section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto mt-16 text-left">
          {/* Box 1 */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-start gap-4">
            <div className="p-2.5 bg-amber-400/10 text-amber-400 rounded-xl border border-amber-400/10">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-white text-xs uppercase tracking-wider">
                {t("Bankii CBE fi Telebirr", "Ethiopian Accounts")}
              </h4>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed font-light">
                {isBoth
                  ? "Kaffaltii 200 Birr CBE (1000755134701) ykn Telebirr (0967145146) kaffaluun daqiiqaa keessatti carraa argadhaa."
                  : isOromo
                    ? "CBE (1000755134701) ykn Telebirr (0967145146) irratti kaffaltii Birr 200 raawwadhaa."
                    : "Complete flat 200 Birr course tokens on CBE (1000755134701) or Telebirr (0967145146)."}
              </p>
            </div>
          </div>

          {/* Box 2 */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-start gap-4">
            <div className="p-2.5 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/10">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-white text-xs uppercase tracking-wider">
                {t("Bilingual Oromo/EN", "Split Adaptive Syllabus")}
              </h4>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed font-light">
                {isBoth
                  ? "Ilaalcha dual-language qubataan barsiifamu. Afaan lamaaniinu barumsawwan dural-murteessaan jira."
                  : isOromo
                    ? "Barnoota guutuun Afaan Oromootti hiikkamee qophaayeera."
                    : "Fully bilingual interactive layout tailored perfectly for fast educational grasp."}
              </p>
            </div>
          </div>

          {/* Box 3 */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-start gap-4">
            <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/10">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-white text-xs uppercase tracking-wider">
                {t("Mirkanneessaa Telegram", "Fast Telegram Validation")}
              </h4>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed font-light">
                {isBoth
                  ? "Ragaa kaffaltii keessan gama Telegram @Amanuel_Harar irratti erguun daqiiqaa tokkoo gaddiitti banaa."
                  : isOromo
                    ? "Daftee kosi keessan banuuf ragaa kaffaltii gama Telegram @Amanuel_Harar nuuf ergaa."
                    : "Send screenshot directly to Amanuel (@Amanuel_Harar) on Telegram for near-instant approval."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
