import React, { useState, useEffect } from "react";
import { auth, db } from "./firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
} from "firebase/auth";
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import {
  ACADEMY_COURSES,
  Course,
  Enrollment,
  Language,
  UserProfile,
} from "./types";

// Import custom sub-components
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import CourseCard from "./components/CourseCard";
import AuthModal from "./components/AuthModal";
import PaymentModal from "./components/PaymentModal";
import CoursePlayer from "./components/CoursePlayer";
import AdminDashboard from "./components/AdminDashboard";

// Lucide icons for Contact section and other visual highlights
import {
  Building,
  CheckCircle,
  Clock,
  Landmark,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

// --- FIRESTORE ERROR HANDLING BLUEPRINT PATTERN ---
enum OperationType {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
  LIST = "list",
  GET = "get",
  WRITE = "write",
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  };
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path,
  };
  console.error("Firestore Exception Catch-All:", JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export default function App() {
  // Global States
  const [language, setLanguage] = useState<Language>("om"); // Oromoo is default
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Lists and collections states
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [allEnrollmentsAdmin, setAllEnrollmentsAdmin] = useState<Enrollment[]>([]);
  const [lessonProgress, setLessonProgress] = useState<string[]>([]); // Array of finished lessonIds

  // Views / Modals triggers
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);
  const [selectedCourseToBuy, setSelectedCourseToBuy] = useState<Course | null>(null);
  const [activeLearningCourse, setActiveLearningCourse] = useState<Course | null>(null);

  // Feedback form states
  const [supportName, setSupportName] = useState("");
  const [supportEmail, setSupportEmail] = useState("");
  const [supportMessage, setSupportMessage] = useState("");
  const [supportSubmitSuccess, setSupportSubmitSuccess] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  // General labels toggle helper
  const isOromo = language === "om";
  const isBoth = language === "both";

  const t = (om: string, en: string) => {
    if (isBoth) {
      return `${om} / ${en}`;
    }
    return isOromo ? om : en;
  };

  // 1. Observe Authentication changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      if (firebaseUser) {
        const userDocRef = doc(db, "users", firebaseUser.uid);
        try {
          const userDoc = await getDoc(userDocRef);
          let profile: UserProfile;

          if (userDoc.exists()) {
            profile = userDoc.data() as UserProfile;
          } else {
            // Automatically registers/inserts profile to Firestore users collection
            const isOwner = firebaseUser.email === "dhiirakoo@gmail.com";
            profile = {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "Student",
              role: isOwner ? "admin" : "student",
              createdAt: new Date().toISOString(),
            };
            await setDoc(userDocRef, profile);
          }
          setUser(profile);
        } catch (err) {
          console.error("Error fetching/registering profile:", err);
          // Graceful fallback for Auth State
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "Student",
            role: firebaseUser.email === "dhiirakoo@gmail.com" ? "admin" : "student",
            createdAt: new Date().toISOString(),
          });
        }
      } else {
        setUser(null);
        setEnrollments([]);
        setLessonProgress([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 2. Stream user enrollments onSnapshot (Realtime sync)
  useEffect(() => {
    if (!user) return;

    const path = "enrollments";
    const q = query(collection(db, path), where("userId", "==", user.uid));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const studentEnrollments: Enrollment[] = [];
        snapshot.forEach((doc) => {
          studentEnrollments.push(doc.data() as Enrollment);
        });
        setEnrollments(studentEnrollments);
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, path);
      }
    );

    return () => unsubscribe();
  }, [user]);

  // 3. Stream user completed lessons progress onSnapshot
  useEffect(() => {
    if (!user) return;

    const path = "progress";
    const q = query(collection(db, path), where("userId", "==", user.uid));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const completedIds: string[] = [];
        snapshot.forEach((doc) => {
          const progressData = doc.data();
          if (progressData.lessonId) {
            completedIds.push(progressData.lessonId);
          }
        });
        setLessonProgress(completedIds);
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, path);
      }
    );

    return () => unsubscribe();
  }, [user]);

  // 4. Stream *ALL* enrollments for Admin view if Admin user logged in
  useEffect(() => {
    if (!user || user.role !== "admin") return;

    const path = "enrollments";
    const unsubscribe = onSnapshot(
      collection(db, path),
      (snapshot) => {
        const adminTickets: Enrollment[] = [];
        snapshot.forEach((doc) => {
          adminTickets.push(doc.data() as Enrollment);
        });
        // Sort newest first
        adminTickets.sort((a, b) => {
          const aTime = a.submittedAt?.seconds || new Date(a.submittedAt).getTime() || 0;
          const bTime = b.submittedAt?.seconds || new Date(b.submittedAt).getTime() || 0;
          return bTime - aTime;
        });
        setAllEnrollmentsAdmin(adminTickets);
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, path);
      }
    );

    return () => unsubscribe();
  }, [user]);

  // --- ACTIONS ---

  // Auth Operations
  async function handleLogin(emailStr: string, passStr: string) {
    await signInWithEmailAndPassword(auth, emailStr, passStr);
  }

  async function handleRegister(emailStr: string, passStr: string, nameStr: string) {
    const cred = await createUserWithEmailAndPassword(auth, emailStr, passStr);
    const userDocRef = doc(db, "users", cred.user.uid);
    const isOwner = emailStr === "dhiirakoo@gmail.com";

    const profile: UserProfile = {
      uid: cred.user.uid,
      email: emailStr,
      displayName: nameStr,
      role: isOwner ? "admin" : "student",
      createdAt: new Date().toISOString(),
    };
    await setDoc(userDocRef, profile);
    setUser(profile);
  }

  async function handleGoogleLogin() {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  }

  async function handleLogout() {
    await signOut(auth);
    setUser(null);
    setActiveLearningCourse(null);
  }

  // Submit course purchase receipt
  async function handleSubmitReceipt(method: "CBE" | "Telebirr", ref: string) {
    if (!user || !selectedCourseToBuy) return;

    const path = "enrollments";
    const enrollmentId = `${user.uid}_${selectedCourseToBuy.id}`;

    const newTicket: Enrollment = {
      enrollmentId,
      userId: user.uid,
      userEmail: user.email || "student@amooacademy.com",
      courseId: selectedCourseToBuy.id,
      courseName: selectedCourseToBuy.title,
      price: selectedCourseToBuy.price,
      paymentMethod: method,
      transactionRef: ref,
      status: "pending",
      submittedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      await setDoc(doc(db, path, enrollmentId), newTicket);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  }

  // Toggle completed lesson state
  async function handleToggleComplete(lessonId: string) {
    if (!user || !activeLearningCourse) return;

    const path = "progress";
    const progressId = `${user.uid}_${lessonId}`;

    if (lessonProgress.includes(lessonId)) {
      // Remove progress Completion
      try {
        await deleteDoc(doc(db, path, progressId));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, path);
      }
    } else {
      // Add progress Completion
      const progressRecord = {
        progressId,
        userId: user.uid,
        courseId: activeLearningCourse.id,
        lessonId,
        completedAt: new Date().toISOString(),
      };
      try {
        await setDoc(doc(db, path, progressId), progressRecord);
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, path);
      }
    }
  }

  // Submit Feedback msg
  async function handleSupportSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!supportName || !supportEmail || !supportMessage) return;

    setSubmitLoading(true);
    const path = "messages";
    const messageId = `msg_${Date.now()}`;

    const logMessage = {
      name: supportName,
      email: supportEmail,
      message: supportMessage,
      submittedAt: new Date().toISOString(),
    };

    try {
      await setDoc(doc(db, path, messageId), logMessage);
      setSupportName("");
      setSupportEmail("");
      setSupportMessage("");
      setSupportSubmitSuccess(true);
      setTimeout(() => setSupportSubmitSuccess(false), 5 * 1000);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    } finally {
      setSubmitLoading(false);
    }
  }

  // --- ADMIN HANDLERS (SANDBOX TICKET MANIPULATIONS) ---
  async function handleAdminApprove(enrollmentId: string) {
    const path = "enrollments";
    try {
      await updateDoc(doc(db, path, enrollmentId), {
        status: "approved",
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  }

  async function handleAdminReject(enrollmentId: string) {
    const path = "enrollments";
    try {
      await updateDoc(doc(db, path, enrollmentId), {
        status: "rejected",
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  }

  async function handleAdminDelete(enrollmentId: string) {
    const path = "enrollments";
    try {
      await deleteDoc(doc(db, path, enrollmentId));
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50 text-slate-800 font-sans selection:bg-blue-500 selection:text-white">
      {/* 1. Header Navigation */}
      <Navbar
        language={language}
        setLanguage={setLanguage}
        user={user}
        loading={loading}
        onOpenAuth={() => setShowAuthModal(true)}
        onOpenAdmin={() => {
          if (!user) {
            setShowAuthModal(true);
          } else {
            setShowAdminDashboard(true);
          }
        }}
        onLogout={handleLogout}
      />

      <main className="flex-grow">
        {/* Active Class View Override */}
        {activeLearningCourse ? (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <CoursePlayer
              language={language}
              course={activeLearningCourse}
              completedLessons={lessonProgress.filter((id) =>
                activeLearningCourse.lessons.some((l) => l.id === id)
              )}
              onToggleComplete={handleToggleComplete}
              onBack={() => setActiveLearningCourse(null)}
            />
          </div>
        ) : (
          <>
            {/* 2. Hero Presentation */}
            <HeroSection language={language} />

            {/* 3. Class Offerings Grid */}
            <section id="courses" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
              <div className="text-center mb-16">
                <span className="text-xs font-extrabold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1.5 rounded-full border border-blue-200 font-mono">
                  {t("Mandeettii Barnootaa", "Premium Curriculum")}
                </span>
                <h3 className="text-3xl md:text-4xl font-black text-slate-950 mt-4 tracking-tight font-display">
                  {t("Koorsota Keenya Sararaa", "Our Specialized Digital Academies")}
                </h3>
                <div className="h-1.5 w-16 bg-amber-500 mx-auto mt-4 rounded-full"></div>
                <p className="text-sm text-slate-500 mt-3.5 max-w-lg mx-auto leading-relaxed">
                  {t(
                    "Kaffaltii salphaa herrega CBE fi Telebirr tokkoof kaffaltii 200 Birr qofa kaffaluun barnoota ununfataa guutuu argadhaa.",
                    "Obtain complete locked materials and lessons for a nominal fee of 200 Birr per masterclass program."
                  )}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {ACADEMY_COURSES.map((course) => {
                  const enroll = enrollments.find((e) => e.courseId === course.id) || null;
                  const lessonsCount = course.lessons.length;
                  const compCount = lessonProgress.filter((lid) =>
                    course.lessons.some((cl) => cl.id === lid)
                  ).length;

                  return (
                    <CourseCard
                      key={course.id}
                      course={course}
                      language={language}
                      enrollment={enroll}
                      completedCount={compCount}
                      onBuy={(item) => {
                        if (!user) {
                          setShowAuthModal(true);
                        } else {
                          setSelectedCourseToBuy(item);
                        }
                      }}
                      onStartLearning={(item) => {
                        setActiveLearningCourse(item);
                      }}
                    />
                  );
                })}
              </div>
            </section>

            {/* 4. Support Desk and Domestic Banking Details */}
            <section id="contact" className="bg-white border-y border-gray-200/50 py-20 px-4">
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                  <span className="text-xs font-extrabold text-purple-600 uppercase tracking-widest bg-purple-50 px-3 py-1.5 rounded-full border border-purple-200 font-mono">
                    {t("Giddugala Galmee", "Financial Support Desk")}
                  </span>
                  <h3 className="text-3xl font-black text-slate-950 mt-4 tracking-tight font-display">
                    {t("Quunnamtii & Kaffaltii", "Transfer Logistics & Support")}
                  </h3>
                  <p className="text-sm text-slate-500 mt-3 max-w-md mx-auto leading-relaxed">
                    {t(
                      "Herrega armaan gadiitti maallaqa ergitanii, Lakk. kaffaltii erguun kosi keessan salphaatti jalqabaa.",
                      "Transfer the enrollment investment to one of the authorized addresses below, log ticket, and enter."
                    )}
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  {/* Domestic Bank Account Addresses */}
                  <div className="space-y-6">
                    <h4 className="text-lg font-black text-slate-950 border-b border-slate-100 pb-3 font-display">
                      {t("Herrega Kaffaltii Keenya", "Authorized Banking Details")}
                    </h4>

                    {/* CBE Card */}
                    <div className="flex gap-4 bg-purple-50/40 p-5 rounded-2xl border border-purple-150/40 hover:shadow-sm transition">
                      <div className="w-11 h-11 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center text-lg shrink-0">
                        <Building className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] text-purple-600 font-bold uppercase tracking-wider">
                          Commercial Bank of Ethiopia (CBE)
                        </p>
                        <p className="text-lg font-black text-slate-800 mt-1 select-all tracking-wider">
                          1000755134701
                        </p>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          Account holder: <span className="font-semibold">Amanuel</span>
                        </p>
                      </div>
                    </div>

                    {/* Telebirr Card */}
                    <div className="flex gap-4 bg-amber-50/40 p-5 rounded-2xl border border-amber-150/40 hover:shadow-sm transition">
                      <div className="w-11 h-11 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center text-lg shrink-0">
                        <Landmark className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] text-amber-700 font-bold uppercase tracking-wider">
                          Telebirr Account
                        </p>
                        <p className="text-lg font-black text-slate-800 mt-1 select-all tracking-wider">
                          0967145146
                        </p>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          Account name: <span className="font-semibold">Amanuel Harar</span>
                        </p>
                      </div>
                    </div>

                    {/* Direct Contact Metrics */}
                    <div className="bg-slate-50/80 border border-slate-200/60 p-5 rounded-2xl text-xs space-y-3 font-semibold text-slate-700">
                      <div className="flex items-center gap-2.5">
                        <Phone className="w-4 h-4 text-emerald-600" />
                        <span>{t("Lakk. Bilbilaa: ", "Hotline Call: ")} 0967145146</span>
                      </div>
                      <div className="flex items-center gap-2.5 font-mono text-[11px]">
                        <Mail className="w-4 h-4 text-blue-600 font-sans" />
                        <span className="select-all">Email support: dhiirakoo@gmail.com</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <MapPin className="w-4 h-4 text-amber-600" />
                        <span>Harar &amp; Addis Ababa, Ethiopia</span>
                      </div>
                    </div>
                  </div>

                  {/* Contact/Feedback Interactive Form */}
                  <div className="bg-slate-50/50 p-6 sm:p-8 rounded-3xl border border-slate-200">
                    <h4 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-3 mb-6 flex items-center gap-2 font-display">
                      <MessageSquare className="w-5 h-5 text-blue-600" />
                      <span>{t("Ergaa Nuuf Ergaa", "Direct Advisory Message")}</span>
                    </h4>

                    {supportSubmitSuccess && (
                      <div className="p-4 bg-emerald-50 border border-emerald-150 text-emerald-800 text-xs font-bold rounded-2xl mb-5 text-center">
                        ✓ {t("Galatoomaa! Ergaan keessan sirriitti daddabarameera.", "Thank you! Your advisory question has been logged successfully.")}
                      </div>
                    )}

                    <form onSubmit={handleSupportSubmit} className="space-y-4">
                      <div>
                        <label className="block text-[10px] font-black uppercase text-slate-400 mb-1.5 font-mono">
                          {t("Maqaa Keessan", "Full Name")}
                        </label>
                        <input
                          type="text"
                          required
                          value={supportName}
                          onChange={(e) => setSupportName(e.target.value)}
                          className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition text-sm text-slate-800 font-medium"
                          placeholder={t("Fakkeenya: Amanuel", "e.g. Amanuel")}
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-black uppercase text-slate-400 mb-1.5 font-mono">Email Address</label>
                        <input
                          type="email"
                          required
                          value={supportEmail}
                          onChange={(e) => setSupportEmail(e.target.value)}
                          className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition text-sm text-slate-800 font-medium"
                          placeholder="example@gmail.com"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-black uppercase text-slate-400 mb-1.5 font-mono">
                          {t("Ergaa Kee", "Message Contents")}
                        </label>
                        <textarea
                          rows={4}
                          required
                          value={supportMessage}
                          onChange={(e) => setSupportMessage(e.target.value)}
                          className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition text-sm text-slate-800 font-medium"
                          placeholder={t("Gaaffii ykn yaada qabdan asitti barreessa...", "Write your questions or notes...")}
                        ></textarea>
                      </div>

                      <button
                        type="submit"
                        disabled={submitLoading}
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold uppercase py-3 rounded-xl shadow-md transition duration-150 text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 font-mono tracking-widest"
                      >
                        {submitLoading ? (
                          <span className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                        ) : (
                          <>
                            <span>{t("Ergaa Ergi", "Send Advisory Ticket")}</span>
                          </>
                        )}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}
      </main>

      {/* 5. Footer */}
      <footer className="bg-slate-900 text-slate-400 text-center py-8 px-4 border-t border-slate-950 shrink-0 select-none text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="font-semibold text-slate-300">
            &copy; 2026 Amoo Academy. <span className="text-amber-500">Oromoo-English Classroom.</span>
          </p>
          <p className="text-slate-500">
            {isOromo
              ? "Hundi Isaa Seeraan Kan Eegame Dha. Dizaayinii fi persistence addaa."
              : "All Rights Reserved. Engineered with secure Firestore & Auth rules."}
          </p>
        </div>
      </footer>

      {/* --- MODALS & DRAWERS --- */}

      {/* Auth Account Trigger */}
      {showAuthModal && (
        <AuthModal
          language={language}
          onClose={() => setShowAuthModal(false)}
          onLogin={handleLogin}
          onRegister={handleRegister}
          onGoogleLogin={handleGoogleLogin}
        />
      )}

      {/* Payment Ticket Details Receipt submission */}
      {selectedCourseToBuy && (
        <PaymentModal
          language={language}
          course={selectedCourseToBuy}
          enrollment={enrollments.find((e) => e.courseId === selectedCourseToBuy.id) || null}
          onClose={() => setSelectedCourseToBuy(null)}
          onSubmitReceipt={handleSubmitReceipt}
        />
      )}

      {/* Admin Panel sidebar slide */}
      {showAdminDashboard && (
        <AdminDashboard
          language={language}
          enrollments={allEnrollmentsAdmin}
          onApprove={handleAdminApprove}
          onReject={handleAdminReject}
          onDelete={handleAdminDelete}
          onClose={() => setShowAdminDashboard(false)}
        />
      )}
    </div>
  );
}
