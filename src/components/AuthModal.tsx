import React, { useState } from "react";
import { Eye, EyeOff, ShieldCheck, X } from "lucide-react";
import { Language } from "../types";

interface AuthModalProps {
  language: Language;
  onClose: () => void;
  onLogin: (email: string, pass: string) => Promise<void>;
  onRegister: (email: string, pass: string, name: string) => Promise<void>;
  onGoogleLogin: () => Promise<void>;
}

export default function AuthModal({ language, onClose, onLogin, onRegister, onGoogleLogin }: AuthModalProps) {
  const isOromo = language === "om";
  const isBoth = language === "both";

  const t = (om: string, en: string) => {
    if (isBoth) {
      return `${om} / ${en}`;
    }
    return isOromo ? om : en;
  };

  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorText("");
    setLoading(true);

    try {
      if (isSignUp) {
        if (password.length < 6) {
          throw new Error(t("Jechi icciitii yoo xiqqaate qubeewwan 6 ta'uu qaba!", "Password must be at least 6 characters."));
        }
        await onRegister(email, password, name || email.split("@")[0]);
      } else {
        await onLogin(email, password);
      }
      onClose();
    } catch (err: any) {
      console.error(err);
      let msg = err.message;
      if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
        msg = t(
          "Imeeliin ykn jechi icciitii sirrii miti. Maaloo irra deebi'ii yaali.",
          "Invalid email or password credentials. Please try again."
        );
      } else if (err.code === "auth/email-already-in-use") {
        msg = t(
          "Imeeliin kun kanaan dura hojiirra ooleera.",
          "This email is already registered inside of our system."
        );
      }
      setErrorText(msg);
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleClick() {
    setErrorText("");
    setLoading(true);
    try {
      await onGoogleLogin();
      onClose();
    } catch (err: any) {
      console.error(err);
      setErrorText(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4 transition-all duration-300 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 relative shadow-2xl border border-slate-200 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 bg-slate-50 hover:bg-slate-100 rounded-full transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="text-center mb-6">
          <h4 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight font-display">
            {isSignUp ? t("Akkaawuntii Uumi", "Create Account") : t("Seeni", "Sign In")}
          </h4>
          <p className="text-xs sm:text-sm text-slate-500 mt-1.5 leading-relaxed">
            {isSignUp
              ? t(
                  "Dandeettii keessan sadarkaa itti aanutti ceesisuuf uumaa.",
                  "Create an account to track your study progress."
                )
              : t(
                  "Daangaa malee barachuu jalqabuuf akkaawuntii keessaaniin seenaa.",
                  "Log in to view lessons and complete payment tickets."
                )}
          </p>
        </div>

        {/* Informative Guidance Banner for Admins/Testers */}
        <div className="mb-5 p-3.5 bg-blue-50/70 border border-blue-100 rounded-xl text-xs text-blue-700 flex items-start gap-2">
          <ShieldCheck className="w-4.5 h-4.5 text-blue-500 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <p className="font-bold">
              {t("Gorsa Mirkaneessaa (Sandbox Tip):", "Sandbox Testing Guide:")}
            </p>
            <p className="mt-0.5 text-blue-600/90 font-medium">
              {t(
                "Admiiniin kosi mirkaneessu 'dhiirakoo@gmail.com' dha. Imeelii kanaan yoo seentan dashboardii admin argattu. Jechi icciitii kamiyyuu ta'u danda'a.",
                "Signing in with the owner email (dhiirakoo@gmail.com) unlocks full admin oversight to approve pupil tickets. Use any password (6+ chars)."
              )}
            </p>
          </div>
        </div>

        {/* Form and Social */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorText && (
            <div className="p-3 bg-red-50 border border-red-100 text-xs text-red-600 font-bold rounded-xl text-center">
              {errorText}
            </div>
          )}

          {isSignUp && (
            <div>
              <label className="block text-[10px] font-black uppercase text-slate-400 mb-1.5 font-mono tracking-wider">
                {t("Maqaa Guutuu", "Full Name")}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition text-xs sm:text-sm text-slate-800 placeholder-slate-400 font-medium"
                placeholder={t("Fakkeenya: Amanuel Harar", "e.g. John Doe")}
              />
            </div>
          )}

          <div>
            <label className="block text-[10px] font-black uppercase text-slate-400 mb-1.5 font-mono tracking-wider">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition text-xs sm:text-sm text-slate-800 placeholder-slate-400 font-medium"
              placeholder="example@gmail.com"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase text-slate-400 mb-1.5 font-mono tracking-wider">
              {t("Jecha Icciitii", "Password")}
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition text-xs sm:text-sm text-slate-800 placeholder-slate-400 pr-10 font-bold"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-extrabold py-3 rounded-xl shadow-lg transition mt-6 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 text-xs sm:text-sm uppercase tracking-wider"
          >
            {loading ? (
              <span className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
            ) : isSignUp ? (
              t("Akkaawuntii Uumi", "Sign Up")
            ) : (
              t("Gara Akkaawuntiitti Seeni", "Sign In")
            )}
          </button>
        </form>

        {/* SSO separator */}
        <div className="relative my-6 text-center select-none">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <span className="relative bg-white px-3 text-[10px] text-slate-400 uppercase tracking-widest font-black font-mono">
            {t("Yoo Kanaan Alaa", "Or alternative login")}
          </span>
        </div>

        {/* Google SSO Login */}
        <button
          onClick={handleGoogleClick}
          disabled={loading}
          className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 font-extrabold py-3 border border-slate-200 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-50 text-xs uppercase tracking-wider"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.3 1 3.4 3.7 1.6 7.7l3.7 2.9C6.2 7.3 8.9 5 12 5z"
            />
            <path
              fill="#4285F4"
              d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.4h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.7z"
            />
            <path
              fill="#FBBC05"
              d="M5.3 14.8c-.2-.7-.3-1.5-.3-2.3s.1-1.6.3-2.3L1.6 7.3C.6 9.2 0 11.4 0 13.8s.6 4.6 1.6 6.5l3.7-2.9-1.3-1.3z"
            />
            <path
              fill="#34A853"
              d="M12 23c3.2 0 6-1.1 8-2.9l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.3-6.7-5.3l-3.7 2.9C3.4 20.3 7.3 23 12 23z"
            />
          </svg>
          <span>{t("Google'n Seeni", "Google Account")}</span>
        </button>

        {/* Change Mode Toggle */}
        <div className="text-center mt-6">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-xs sm:text-sm font-extrabold text-blue-600 hover:text-blue-700 cursor-pointer focus:outline-none"
          >
            {isSignUp
              ? t("Akkaawuntii qabduu? Seenaa", "Already have an account? Sign In")
              : t("Akkaawuntii hin qabduu? Uumaa", "Don't have an account? Create one")}
          </button>
        </div>
      </div>
    </div>
  );
}
