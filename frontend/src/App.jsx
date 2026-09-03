import { useEffect, useState } from "react";
import Nav from "./components/Nav";
import HomePage from "./components/HomePage";
import LoginModal from "./components/LoginModal";
import ComingSoon from "./components/ComingSoon";
import AdminUsersPage from "./components/AdminUsersPage";
import GameDetailPage from "./components/GameDetailPage";
import MyReviewsPage from "./components/MyReviewsPage";
import { authApi } from "./utils/api";

// ─── App root ─────────────────────────────────────────────────────────────────
// This is the top-level component. It owns all the "which page/modal is
// currently showing" state and passes data + callback functions down to
// its children. There's no routing library — which "page" shows is just
// decided by plain booleans/values below, checked in the ternary chain
// inside the return statement.
export default function App() {
  const [authUser, setAuthUser] = useState(null);   // null = logged out, otherwise { _id, name, email, role }
  const [showLogin, setShowLogin] = useState(false); // controls the sign-in/sign-up modal overlay
  const [selectedGame, setSelectedGame] = useState(null);   // which game's detail page is open (if any)
  const [showMyReviews, setShowMyReviews] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showManageUsers, setShowManageUsers] = useState(false);

  // Runs once when the app first loads. Asks the backend "is there already
  // a valid login cookie?" so refreshing the page doesn't log you out.
  useEffect(() => {
    authApi.me().then(setAuthUser).catch(() => setAuthUser(null));
  }, []);

  async function handleLogout() {
    try {
      await authApi.logout(); // tells the backend to clear the cookie
    } finally {
      setAuthUser(null);      // clear our local "who's logged in" state either way
      setShowMyReviews(false);
    }
  }

  // Callback handed down to HomePage/GameDetailPage/etc. so a click deep in
  // the component tree can tell App "show this game's page instead."
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
      {/* Nav is shown on every "page" — this is the persistent template part */}
      <Nav
        authUser={authUser}
        onLoginClick={() => setShowLogin(true)}
        onLogout={handleLogout}
        onLogoClick={handleBack}
        onMyReviews={handleMyReviews}
        onAdminPanel={() => setShowAdmin(true)}
        onManageUsers={() => setShowManageUsers(true)}
      />

      {/* Only ONE of these renders at a time — whichever flag is true first
          in this chain wins. This is the "page content" slot. */}
      {showManageUsers ? (
        <AdminUsersPage currentUserId={authUser?._id} onBack={handleBack} />
      ) : showMyReviews ? (
        <MyReviewsPage onBack={handleBack} onGameClick={handleGameClick} />
      ) : selectedGame ? (
        <GameDetailPage game={selectedGame} authUser={authUser} onBack={handleBack} onLoginClick={() => setShowLogin(true)} />
      ) : (
        <HomePage authUser={authUser} onGameClick={handleGameClick} onLoginClick={() => setShowLogin(true)} />
      )}

      {/* Not part of the page-switching above — these render as overlays on
          top of whatever page is showing, independent of the ternary chain */}
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
