import { useState } from "react";
import { authApi } from "../utils/api";

// ─── Auth modal (sign in / sign up) ────────────────────────────────────────────
export default function LoginModal({ onClose, onLogin }) {
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const isLogin = mode === "login";

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const user = isLogin
        ? await authApi.login(email, password)
        : await authApi.register(name, email, password);
      onLogin(user);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
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
        <h2 className="text-3xl font-black uppercase tracking-wide mb-1" style={{ fontFamily: "var(--font-display)" }}>
          {isLogin ? "Sign In" : "Create Account"}
        </h2>
        <p className="text-xs mb-6" style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-mono)" }}>
          {isLogin ? "Welcome back" : "Join as a gamer to write reviews and save games"}
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {!isLogin && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest mb-1.5" style={{ fontFamily: "var(--font-mono)", color: "var(--muted-foreground)" }}>Name</label>
              <input type="text" value={name} onChange={(e) => { setName(e.target.value); setError(""); }} placeholder="Your name"
                className="w-full px-3 py-2.5 rounded-md border text-sm outline-none transition-colors focus:border-[var(--primary)]"
                style={{ background: "var(--muted)", borderColor: "var(--border)", color: "var(--foreground)" }} />
            </div>
          )}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest mb-1.5" style={{ fontFamily: "var(--font-mono)", color: "var(--muted-foreground)" }}>Email</label>
            <input type="email" value={email} onChange={(e) => { setEmail(e.target.value); setError(""); }} placeholder="you@example.com"
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
          <button type="submit" disabled={submitting} className="w-full py-2.5 rounded-md font-bold uppercase tracking-wider text-sm transition-all hover:opacity-90 active:scale-95 mt-1 disabled:opacity-50"
            style={{ fontFamily: "var(--font-display)", background: "var(--primary)", color: "white" }}>
            {submitting ? "Please wait…" : isLogin ? "Sign In" : "Create Account"}
          </button>
        </form>
        <button onClick={() => { setMode(isLogin ? "register" : "login"); setError(""); }}
          className="mt-4 w-full text-center text-xs underline transition-colors hover:text-white"
          style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-mono)" }}>
          {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
        </button>
      </div>
    </div>
  );
}
