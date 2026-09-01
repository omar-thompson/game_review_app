import { useEffect, useState } from "react";
import Nav from "./components/Nav";
import HomePage from "./components/HomePage";
import LoginModal from "./components/LoginModal";
import ComingSoon from "./components/ComingSoon";
import AdminUsersPage from "./components/AdminUsersPage";
import { authApi } from "./utils/api";

// ─── App root ─────────────────────────────────────────────────────────────────
// GameDetailPage and MyReviewsPage are stubbed with ComingSoon for now
// and will be built out in later stages.
export default function App() {
  const [authUser, setAuthUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);
  const [showMyReviews, setShowMyReviews] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showManageUsers, setShowManageUsers] = useState(false);

  useEffect(() => {
    authApi.me().then(setAuthUser).catch(() => setAuthUser(null));
  }, []);

  async function handleLogout() {
    try {
      await authApi.logout();
    } finally {
      setAuthUser(null);
      setShowMyReviews(false);
    }
  }

  function handleGameClick(g) {
    setSelectedGame(g);
    setShowMyReviews(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function handleBack() {
    setSelectedGame(null);
    setShowMyReviews(false);
    setShowManageUsers(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function handleMyReviews() {
    setShowMyReviews(true);
    setSelectedGame(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="min-h-full" style={{ background: "var(--background)" }}>
      <Nav
        authUser={authUser}
        onLoginClick={() => setShowLogin(true)}
        onLogout={handleLogout}
        onLogoClick={handleBack}
        onMyReviews={handleMyReviews}
        onAdminPanel={() => setShowAdmin(true)}
        onManageUsers={() => setShowManageUsers(true)}
      />

      {showManageUsers ? (
        <AdminUsersPage currentUserId={authUser?._id} onBack={handleBack} />
      ) : showMyReviews ? (
        <ComingSoon title="My Reviews" onBack={handleBack} />
      ) : selectedGame ? (
        <ComingSoon title={selectedGame.title} onBack={handleBack} />
      ) : (
        <HomePage authUser={authUser} onGameClick={handleGameClick} onLoginClick={() => setShowLogin(true)} />
      )}

      {showAdmin && <ComingSoon title="Admin Panel" onBack={() => setShowAdmin(false)} />}
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} onLogin={setAuthUser} />}

      <footer className="border-t" style={{ borderColor: "var(--border)" }}>
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-lg font-black uppercase tracking-widest" style={{ fontFamily: "var(--font-display)", color: "var(--muted-foreground)" }}>GAMERVIEW</span>
          <p className="text-xs" style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-mono)" }}>© 2026 GAMERVIEW · Independent game criticism</p>
        </div>
      </footer>
    </div>
  );
}
