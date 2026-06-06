import { Check, Landmark, ShieldAlert, Sparkles, Trash2, X } from "lucide-react";
import { Enrollment, Language } from "../types";

interface AdminDashboardProps {
  language: Language;
  enrollments: Enrollment[];
  onApprove: (enrollmentId: string) => Promise<void>;
  onReject: (enrollmentId: string) => Promise<void>;
  onDelete: (enrollmentId: string) => Promise<void>;
  onClose: () => void;
}

export default function AdminDashboard({
  language,
  enrollments,
  onApprove,
  onReject,
  onDelete,
  onClose,
}: AdminDashboardProps) {
  const isOromo = language === "om";
  const isBoth = language === "both";

  const t = (om: string, en: string) => {
    if (isBoth) {
      return `${om} / ${en}`;
    }
    return isOromo ? om : en;
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[100] flex justify-end transition-all animate-slideIn">
      <div className="bg-white w-full max-w-2xl h-full shadow-2xl flex flex-col justify-between overflow-hidden border-l border-slate-200">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 sm:p-6 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-base sm:text-lg font-black tracking-tight font-display">
                {t("Deeskii Admin - To'annoo Kafiltootaa", "Sandbox Admin Dashboard")}
              </h4>
              <p className="text-xs text-slate-400 font-medium font-mono uppercase tracking-wider">
                {t("Ragaalee kaffaltii barattootaa asitti mirkaneessaa", "Approve student payment tickets in real-time")}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-850 text-slate-300 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Info Box */}
        <div className="bg-amber-50 text-amber-800 p-4 border-b border-amber-200 text-xs flex items-start gap-2.5 shrink-0 leading-relaxed font-semibold">
          <ShieldAlert className="w-4.5 h-4.5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-extrabold uppercase font-mono tracking-wider">
              {t("Hubadhu bro:", "Sandbox Database Notice:")}
            </p>
            <p className="mt-1 font-medium text-amber-700">
              {t(
                "Armaan gaditti ragaa kaffaltii barattoota ni argattu. 'Mirkaneessi' (Approve) ykn 'Irra deebi'ii' (Reject) cuqaasuun koorsota barattootaas mirkaneessaa.",
                "This panel is linked to our central Firestore. Approving an enrollment instantly releases premium classroom access for that member's email."
              )}
            </p>
          </div>
        </div>

        {/* List of current registrations */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
          <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 font-mono">
            {t("Maqaa Kaffaltii Tiketoota", "Active Student Tickets")} ({enrollments.length})
          </h5>

          {enrollments.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50 p-6 select-none">
              <Sparkles className="w-8 h-8 text-slate-350 mx-auto mb-2.5 animate-pulse" />
              <p className="text-xs font-black text-slate-500 uppercase tracking-wider">
                {t("Tiketiin kaffaltii tokkollee hin jiru", "No payment request tickets found")}
              </p>
              <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                {t(
                  "Saphlaatti koorasii tokko irratti 'Bitadhu' cuqaasaa kalliitti kaffaltii uumaa.",
                  "Click 'Buy Now' on any course card to create simulated student payment transactions."
                )}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {enrollments.map((ticket) => (
                <div
                  key={ticket.enrollmentId}
                  className="bg-white border border-slate-150 rounded-2xl p-4 shadow-xs hover:shadow-md transition space-y-3.5"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <p className="text-xs font-black text-slate-900 font-mono">
                        {ticket.userEmail}
                      </p>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        Course: <span className="font-extrabold text-blue-600">{ticket.courseName}</span>
                      </p>
                      <p className="text-[9px] text-slate-400 mt-0.5 font-mono">
                        Ticket Ref ID: <span className="bg-slate-100 px-1 py-0.5 rounded font-bold uppercase">{ticket.enrollmentId.substring(0, 10)}</span>
                      </p>
                    </div>

                    {/* Status Pill Badge */}
                    <span
                      className={`text-[9px] font-black px-2.5 py-1 rounded-full border uppercase tracking-wider ${
                        ticket.status === "approved"
                          ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                          : ticket.status === "pending"
                            ? "bg-amber-50 text-amber-800 border-amber-200 animate-pulse font-extrabold"
                            : "bg-red-50 text-red-800 border-red-200"
                      }`}
                    >
                      {ticket.status}
                    </span>
                  </div>

                  {/* Payment specs */}
                  <div className="grid grid-cols-2 gap-2 bg-slate-900 p-3 rounded-xl border border-slate-950 font-mono text-xs text-white">
                    <div>
                      <span className="text-[8px] text-slate-400 block font-sans uppercase font-bold tracking-wider">Gateway Channel</span>
                      <span className="font-bold text-amber-400">{ticket.paymentMethod}</span>
                    </div>
                    <div>
                      <span className="text-[8px] text-slate-400 block font-sans uppercase font-bold tracking-wider">Trx Reference Code</span>
                      <span className="font-bold uppercase tracking-wider text-blue-300 select-all">
                        {ticket.transactionRef}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-between items-center gap-2 pt-2 border-t border-slate-100">
                    <div className="flex gap-2">
                      {ticket.status !== "approved" && (
                        <button
                          onClick={() => onApprove(ticket.enrollmentId)}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-lg transition flex items-center gap-1 cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>{t("Mirkaneessi", "Approve")}</span>
                        </button>
                      )}

                      {ticket.status !== "rejected" && (
                        <button
                          onClick={() => onReject(ticket.enrollmentId)}
                          className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-[10px] font-bold uppercase tracking-wider rounded-lg transition flex items-center gap-1 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>{t("Kufasi", "Decline")}</span>
                        </button>
                      )}
                    </div>

                    <button
                      onClick={() => onDelete(ticket.enrollmentId)}
                      className="p-1.5 text-slate-400 hover:text-red-650 hover:bg-red-50 rounded-lg transition cursor-pointer border border-transparent hover:border-red-200"
                      title="Delete ticket completely"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 p-5 border-t border-slate-200 text-center shrink-0">
          <button
            onClick={onClose}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold uppercase py-3 rounded-xl transition text-xs sm:text-sm tracking-widest cursor-pointer"
          >
            {t("Duubatti Deebi'i", "Return to Classroom")}
          </button>
        </div>
      </div>
    </div>
  );
}
