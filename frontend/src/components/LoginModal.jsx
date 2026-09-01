import { useState } from "react";
import { DEMO_USERS } from "../data/demoUsers";

// ─── Login modal ──────────────────────────────────────────────────────────────
// NOTE: This currently checks credentials against the local DEMO_USERS object.
// In Stage 3, handleSubmit will be replaced with a fetch() call to your
// backend's /api/auth/login endpoint, which checks MongoDB instead.
export default function LoginModal({ onClose, onLogin }) {
  const [role, setRole] = useState("gamer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const DEMO = role === "admin"
    ? { email: "admin@gamerview.gg", password: "admin123" }
    : { email: "gamer@gamerview.gg", password: "gamer123" };

  function handleSubmit(e) {
    e.preventDefault();
    const user = DEMO_USERS[email];
    if (!user || user.password !== password) { setError("Invalid email or password."); return; }
    if (user.role !== role) { setError(`That account is not a ${role}.`); return; }
    onLogin(user);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)" }}>
      <div className="w-full max-w-sm rounded-xl border p-7 relative"
        style={{ background: "var(--card)", borderColor: "var(--border)" }}
        onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center rounded transition-colors hover:bg-white/10"
          style={{ color: "var(--muted-foreground)" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6 6 18M6 6l12 12"/></svg>
        </button>
        <h2 className="text-3xl font-black uppercase tracking-wide mb-1" style={{ fontFamily: "var(--font-display)" }}>Sign In</h2>
        <p className="text-xs mb-6" style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-mono)" }}>Choose your account type</p>
        <div className="grid grid-cols-2 gap-2 mb-6 p-1 rounded-lg" style={{ background: "var(--muted)" }}>
          {["gamer", "admin"].map((r) => (
            <button key={r} onClick={() => { setRole(r); setError(""); }}
              className="py-2 rounded-md text-sm font-bold uppercase tracking-wider transition-all"
              style={{ fontFamily: "var(--font-display)", background: role === r ? "var(--primary)" : "transparent", color: role === r ? "white" : "var(--muted-foreground)" }}>
              {r === "gamer" ? "🎮 Gamer" : "⚙️ Admin"}
            </button>
          ))}
        </div>
        <p className="text-xs mb-5 px-3 py-2 rounded border" style={{ color: "var(--muted-foreground)", borderColor: "var(--border)", background: "var(--muted)" }}>
          {role === "gamer" ? "Gamers can write and submit game reviews, rate titles, and manage their review profile." : "Admins can publish, edit, and remove reviews, manage users, and moderate the platform."}
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest mb-1.5" style={{ fontFamily: "var(--font-mono)", color: "var(--muted-foreground)" }}>Email</label>
            <input type="email" value={email} onChange={(e) => { setEmail(e.target.value); setError(""); }} placeholder={DEMO.email}
              className="w-full px-3 py-2.5 rounded-md border text-sm outline-none transition-colors focus:border-[var(--primary)]"
              style={{ background: "var(--muted)", borderColor: "var(--border)", color: "var(--foreground)" }} />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest mb-1.5" style={{ fontFamily: "var(--font-mono)", color: "var(--muted-foreground)" }}>Password</label>
            <input type="password" value={password} onChange={(e) => { setPassword(e.target.value); setError(""); }} placeholder="••••••••"
              className="w-full px-3 py-2.5 rounded-md border text-sm outline-none transition-colors focus:border-[var(--primary)]"
              style={{ background: "var(--muted)", borderColor: "var(--border)", color: "var(--foreground)" }} />
          </div>
          {error && <p className="text-xs text-red-400" style={{ fontFamily: "var(--font-mono)" }}>{error}</p>}
          <button type="submit" className="w-full py-2.5 rounded-md font-bold uppercase tracking-wider text-sm transition-all hover:opacity-90 active:scale-95 mt-1"
            style={{ fontFamily: "var(--font-display)", background: "var(--primary)", color: "white" }}>Sign In</button>
        </form>
        <button onClick={() => { setEmail(DEMO.email); setPassword(DEMO.password); setError(""); }}
          className="mt-4 w-full text-center text-xs underline transition-colors hover:text-white"
          style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-mono)" }}>
          Fill demo credentials for {role}
        </button>
      </div>
    </div>
  );
}
