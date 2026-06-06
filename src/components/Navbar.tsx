import { Globe, LogOut, ShieldCheck, User } from "lucide-react";
import { Language, UserProfile } from "../types";

interface NavbarProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  user: UserProfile | null;
  loading: boolean;
  onOpenAuth: () => void;
  onOpenAdmin: () => void;
  onLogout: () => void;
}

export default function Navbar({
  language,
  setLanguage,
  user,
  loading,
  onOpenAuth,
  onOpenAdmin,
  onLogout,
}: NavbarProps) {
  const isOromo = language === "om";
  const isBoth = language === "both";

  const t = (om: string, en: string) => {
    if (isBoth) {
      return `${om} / ${en}`;
    }
    return isOromo ? om : en;
  };

  return (
    <nav className="bg-slate-900/95 sticky top-0 z-[80] backdrop-blur-md border-b border-slate-800 text-white shadow-lg transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-1.5 font-display">
              <span className="text-blue-500">Amoo</span>
              <span className="text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-xl border border-amber-400/20 text-xs sm:text-sm font-extrabold uppercase">
                Academy
              </span>
            </h1>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-6 font-semibold text-xs uppercase tracking-wide">
            <a href="#home" className="text-slate-300 hover:text-blue-400 transition-colors">
              {t("Mana", "Home")}
            </a>
            <a href="#courses" className="text-slate-300 hover:text-blue-400 transition-colors">
              {t("Koorsota", "Courses")}
            </a>
            <a href="#contact" className="text-slate-300 hover:text-blue-400 transition-colors">
              {t("Quunnamtii", "Contact")}
            </a>
          </div>

          {/* Actions Menu */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* 3-way Language Switcher Group */}
            <div className="bg-slate-950 p-0.5 rounded-xl border border-slate-800 flex items-center shadow-inner">
              <button
                onClick={() => setLanguage("om")}
                className={`px-2.5 py-1 text-[10px] font-extrabold rounded-lg transition-all cursor-pointer ${
                  language === "om"
                    ? "bg-blue-600 text-white shadow"
                    : "text-slate-400 hover:text-white"
                }`}
                title="Afaan Oromoo"
              >
                OM
              </button>
              <button
                onClick={() => setLanguage("en")}
                className={`px-2.5 py-1 text-[10px] font-extrabold rounded-lg transition-all cursor-pointer ${
                  language === "en"
                    ? "bg-blue-600 text-white shadow"
                    : "text-slate-400 hover:text-white"
                }`}
                title="English"
              >
                EN
              </button>
              <button
                onClick={() => setLanguage("both")}
                className={`px-2 py-1 text-[10px] font-extrabold rounded-lg transition-all cursor-pointer flex items-center gap-0.5 ${
                  language === "both"
                    ? "bg-amber-500 text-slate-950 shadow"
                    : "text-slate-400 hover:text-white"
                }`}
                title="Bilingual Side-by-Side (Oromoo + English)"
              >
                OM/EN
              </button>
            </div>

            {/* Sandbox Admin quick-badge */}
            {user && (
              <button
                onClick={onOpenAdmin}
                className={`text-[10px] sm:text-xs font-bold py-1.5 px-2.5 rounded-xl border cursor-pointer flex items-center gap-1 transition ${
                  user.role === "admin"
                    ? "bg-amber-400/20 border-amber-400/30 text-amber-300 hover:bg-amber-400/35"
                    : "bg-teal-400/10 border-teal-400/20 text-teal-300 hover:bg-teal-400/15"
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">
                  {user.role === "admin" ? t("Sanduqa Admin", "Admin Panel") : t("Deeskii Sandbox", "Test Sandbox")}
                </span>
                <span className="sm:hidden">{user.role === "admin" ? "Admin" : "Test"}</span>
              </button>
            )}

            {/* Loading or Auth status */}
            {loading ? (
              <div className="w-6 h-6 rounded-full border-2 border-blue-500 border-t-transparent animate-spin"></div>
            ) : user ? (
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex flex-col items-end text-right">
                  <span className="text-xs font-black text-slate-100">
                    {user.displayName || user.email?.split("@")[0]}
                  </span>
                  <span className="text-[9px] text-slate-400 capitalize font-mono">
                    {user.role === "admin" ? t("Admiinii", "Admin") : t("Barataa", "Student")}
                  </span>
                </div>
                <button
                  onClick={onLogout}
                  className="p-1.5 sm:p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-red-400 hover:bg-slate-800/80 border border-slate-700/50 transition flex items-center cursor-pointer"
                  title={t("Ba’i", "Log Out")}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="bg-blue-600 hover:bg-blue-500 text-white text-[11px] sm:text-xs font-bold py-1.5 sm:py-2 px-3 sm:px-4 rounded-xl transition shadow flex items-center gap-1 cursor-pointer"
              >
                <User className="w-3.5 h-3.5" />
                <span>{t("Seeni", "Login")}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
