import React, { useState } from "react";
import { Building, Landmark, Receipt, Send, X } from "lucide-react";
import { Course, Enrollment, Language } from "../types";

interface PaymentModalProps {
  language: Language;
  course: Course;
  enrollment: Enrollment | null;
  onClose: () => void;
  onSubmitReceipt: (method: "CBE" | "Telebirr", ref: string) => Promise<void>;
}

export default function PaymentModal({ language, course, enrollment, onClose, onSubmitReceipt }: PaymentModalProps) {
  const isOromo = language === "om";
  const isBoth = language === "both";

  const t = (om: string, en: string) => {
    if (isBoth) {
      return `${om} / ${en}`;
    }
    return isOromo ? om : en;
  };

  const [paymentMethod, setPaymentMethod] = useState<"CBE" | "Telebirr">("CBE");
  const [txnRef, setTxnRef] = useState(enrollment ? enrollment.transactionRef : "");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Prefill pre-configured Telegram string
  const telegramPrefillText = encodeURIComponent(
    `Hi Amanuel (Amoo Academy), I have transferred 200 Birr for the "${course.title}" course via ${paymentMethod}.\nMy Transaction Reference is: ${txnRef || "PENDING"}.\nPlease activate my course!`
  );
  const telegramUrl = `https://t.me/Amanuel_Harar?text=${telegramPrefillText}`;

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!txnRef.trim()) return;
    setSubmitting(true);
    try {
      await onSubmitReceipt(paymentMethod, txnRef.trim());
      setSuccess(true);
    } catch (err) {
      console.error(err);
      alert(t("Dhiifama, ragaa kaffaltii erguun hin danda'amne.", "Error submitting transaction receipt. Please try again."));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4 transition-all duration-300 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 relative shadow-2xl border border-slate-200 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 bg-slate-50 hover:bg-slate-100 rounded-full transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Icon and Header */}
        <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center text-xl mx-auto mb-4 border border-amber-200">
          <Receipt className="w-5 h-5 animate-bounce" />
        </div>

        <h4 className="text-lg sm:text-xl font-black text-slate-950 text-center tracking-tight font-display">
          {t("Kaffaltii Mirkaneessuu", "Confirm Course Purchase")}
        </h4>

        <div className="text-center mt-2.5">
          {isBoth ? (
            <div className="space-y-1.5 text-xs text-slate-500 leading-relaxed max-h-24 overflow-y-auto bg-slate-50/50 p-2.5 rounded-xl border border-slate-100">
              <p>
                <span className="font-bold text-amber-600 font-mono">OM:</span> Koorasii <span className="font-black text-slate-800">{course.titleOm}</span> bituuf kaffaltii <span className="font-extrabold text-blue-600">200 Birr</span> herrega gadii irratti daddabarsitanii ragaa (Transaction ID) as nuuf ergaa.
              </p>
              <p className="border-t border-slate-200/60 pt-1.5">
                <span className="font-bold text-blue-500 font-mono">EN:</span> To unlock full premium access to <span className="font-black text-slate-800">{course.title}</span>, transfer <span className="font-extrabold text-blue-600">200 Birr</span> to one of the accounts below and submit the verification reference ID.
              </p>
            </div>
          ) : (
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              {isOromo ? (
                <>
                  Koorasii <span className="font-extrabold text-slate-950">{course.titleOm}</span> bituuf kaffaltii
                  <span className="font-extrabold text-blue-600"> 200 Birr </span>
                  herrega gadii irratti daddabarsitanii ragaa (Transaction ID) as nuuf ergaa.
                </>
              ) : (
                <>
                  To unlock full premium access to the <span className="font-extrabold text-slate-950">{course.title}</span>{" "}
                  course, transfer <span className="font-extrabold text-blue-600">200 Birr</span> to one of the accounts below
                  and submit the verification reference ID.
                </>
              )}
            </p>
          )}
        </div>

        {/* CBE / Telebirr selection chips */}
        <div className="grid grid-cols-2 gap-3 my-5">
          <button
            type="button"
            onClick={() => setPaymentMethod("CBE")}
            className={`p-3 rounded-2xl border transition-all flex flex-col items-center gap-1 cursor-pointer ${
              paymentMethod === "CBE"
                ? "bg-blue-50 text-blue-800 border-blue-300 shadow-sm font-bold"
                : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
            }`}
          >
            <Building className="w-4 h-4" />
            <span className="text-[10px] sm:text-xs font-black uppercase font-mono">CBE Transfer</span>
          </button>

          <button
            type="button"
            onClick={() => setPaymentMethod("Telebirr")}
            className={`p-3 rounded-2xl border transition-all flex flex-col items-center gap-1 cursor-pointer ${
              paymentMethod === "Telebirr"
                ? "bg-amber-50 text-amber-850 border-amber-350 shadow-sm font-bold"
                : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
            }`}
          >
            <Landmark className="w-4 h-4" />
            <span className="text-[10px] sm:text-xs font-black uppercase font-mono">Telebirr Wallet</span>
          </button>
        </div>

        {/* Displaying selected gateway account specifics */}
        <div className="bg-slate-900 border border-slate-950 p-4 rounded-xl text-center mb-6 font-mono relative text-white">
          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mb-1.5 font-mono">
            {t("Lakk. herreega kaffaltii", "Recipient Account Details")}
          </p>
          {paymentMethod === "CBE" ? (
            <div>
              <p className="text-[10px] text-blue-400 font-extrabold mb-0.5 uppercase tracking-wide">CBE - Commercial Bank of Ethiopia</p>
              <p className="text-xl font-black tracking-wider select-all text-amber-400">1000755134701</p>
            </div>
          ) : (
            <div>
              <p className="text-[10px] text-amber-400 font-extrabold mb-0.5 uppercase tracking-wide">Telebirr Wallet (Amanuel)</p>
              <p className="text-xl font-black tracking-wider select-all text-blue-400">0967145146</p>
            </div>
          )}
          <span className="block mt-1.5 text-[8px] text-slate-400 font-light italic">
            {t("Lakk. herreega cuqaasuun garagufadhu", "Tip: Drag or click to copy account number")}
          </span>
        </div>

        {/* Input box */}
        {!success ? (
          <form onSubmit={handleSend} className="space-y-4">
            <div>
              <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1.5 font-mono">
                {t("Lakk. Mirkaneessaa (Transaction Ref / ID)", "Transaction Reference ID *")}
              </label>
              <input
                type="text"
                required
                value={txnRef}
                onChange={(e) => setTxnRef(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition text-xs sm:text-sm font-mono text-slate-800 placeholder-slate-400 uppercase font-bold"
                placeholder={t("Fkn: FT26066H9410", "e.g. FT26066H9410")}
              />
            </div>

            <button
              type="submit"
              disabled={submitting || !txnRef.trim()}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-extrabold py-3 rounded-xl shadow-lg transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 text-xs sm:text-sm uppercase tracking-wider"
            >
              {submitting ? (
                <span className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>{t("Daddabarsi Mirkaneessi", "Submit Payment Ticket")}</span>
                </>
              )}
            </button>
          </form>
        ) : (
          <div className="space-y-4 text-center">
            <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 p-4 rounded-xl text-xs sm:text-sm font-bold leading-relaxed">
              🎉{" "}
              {t(
                "Gariidha! Tiketiin kaffaltii keessanii ergameera. Admiiniin sa'aatii muraasa keessatti qoratee kosi keessan ni banaan!",
                "Great! Your payment verification ticket was successfully logged. Admin will check details and open lessons within hours!"
              )}
            </div>

            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              {t(
                "Saffisaan akka sii banamuuf ammoo ragaa kaffaltii (receipt picture) Telegram kanaan ergaa:",
                "To accelerate your approval, please instantly message the transfer proof directly to Amanuel on Telegram:"
              )}
            </p>

            <a
              href={telegramUrl}
              target="_blank"
              rel="noreferrer"
              className="block w-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold py-3 rounded-xl transition text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md uppercase tracking-wider"
            >
              <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.02-1.96 1.24-5.54 3.66-.52.36-1 .53-1.42.52-.47-.01-1.37-.27-2.03-.49-.82-.27-1.47-.41-1.42-.87.03-.24.36-.49 1-.74 3.91-1.7 6.52-2.82 7.84-3.36 3.73-1.54 4.51-1.81 5.01-1.82.11 0 .36.03.52.16.14.11.18.26.2.37.02.1.02.26.01.37z" />
              </svg>
              <span>{t("Telegram-iin Ergi", "Send via Telegram @Amanuel")}</span>
            </a>

            <button
              onClick={onClose}
              className="text-xs font-bold text-slate-400 hover:text-slate-600 underline block mx-auto cursor-pointer"
            >
              {t("Gara Kositti Deebi'i", "Back to Course Catalog")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
