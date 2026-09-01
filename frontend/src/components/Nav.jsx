import { UserMenu } from "./UserMenu";

// ─── Nav ──────────────────────────────────────────────────────────────────────
export default function Nav({ authUser, onLoginClick, onLogout, onLogoClick, onMyReviews, onAdminPanel }) {
  return (
    <header className="sticky top-0 z-50 border-b"
      style={{ background: "color-mix(in srgb, var(--background) 85%, transparent)", backdropFilter: "blur(16px)", borderColor: "var(--border)" }}>
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between gap-6">
        <button onClick={onLogoClick} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="w-7 h-7 rounded flex items-center justify-center text-xs font-black"
            style={{ background: "var(--primary)", fontFamily: "var(--font-display)", color: "white", letterSpacing: "0.05em" }}>GV</div>
          <span className="text-lg font-black uppercase tracking-widest" style={{ fontFamily: "var(--font-display)" }}>GAMERVIEW</span>
        </button>
        <nav className="hidden md:flex items-center gap-8">
          {["Reviews", "Top Rated", "Upcoming", "Guides"].map((item) => (
            <a key={item} href="#" className="text-sm font-medium transition-colors hover:text-white"
              style={{ color: "var(--muted-foreground)" }} onClick={(e) => e.preventDefault()}>{item}</a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded border text-sm"
            style={{ background: "var(--muted)", borderColor: "var(--border)", color: "var(--muted-foreground)" }}>
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <span>Search games…</span>
          </div>
          {authUser ? (
            <UserMenu user={authUser} onLogout={onLogout} onMyReviews={onMyReviews} onAdminPanel={onAdminPanel} />
          ) : (
            <button onClick={onLoginClick} className="px-4 py-1.5 rounded text-sm font-bold uppercase tracking-wider transition-all hover:opacity-90 active:scale-95"
              style={{ fontFamily: "var(--font-display)", background: "var(--primary)", color: "white" }}>Sign In</button>
          )}
        </div>
      </div>
    </header>
  );
}
