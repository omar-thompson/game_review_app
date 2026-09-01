import { useState } from "react";

function getInitials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

// ─── User menu ────────────────────────────────────────────────────────────────
export function UserMenu({ user, onLogout, onMyReviews, onAdminPanel, onManageUsers }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-full border transition-colors hover:bg-white/5"
        style={{ borderColor: "var(--border)" }}>
        <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black"
          style={{ background: "var(--primary)", color: "white", fontFamily: "var(--font-display)" }}>
          {getInitials(user.name)}
        </div>
        <span className="text-sm font-medium hidden sm:inline">{user.name.split(" ")[0]}</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={`transition-transform ${open ? "rotate-180" : ""}`} style={{ color: "var(--muted-foreground)" }}><path d="m6 9 6 6 6-6"/></svg>
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 w-52 rounded-lg border py-1 z-50"
          style={{ background: "var(--card)", borderColor: "var(--border)", boxShadow: "0 20px 60px rgba(0,0,0,0.6)" }}>
          <div className="px-4 py-2.5 border-b" style={{ borderColor: "var(--border)" }}>
            <p className="text-sm font-semibold truncate">{user.name}</p>
            <p className="text-xs mt-0.5 truncate" style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-mono)" }}>{user.email}</p>
          </div>
          {user.role === "gamer" ? (
            <>
              <MenuLink icon="✍️" label="Write a Review" />
              <MenuLink icon="📋" label="My Reviews" onClick={() => { onMyReviews(); setOpen(false); }} />
              <MenuLink icon="👤" label="Profile" />
            </>
          ) : (
            <>
              <MenuLink icon="📊" label="Admin Panel" onClick={() => { onAdminPanel(); setOpen(false); }} />
              <MenuLink icon="✅" label="Manage Reviews" onClick={() => { onAdminPanel(); setOpen(false); }} />
              <MenuLink icon="👥" label="Users" onClick={() => { onManageUsers(); setOpen(false); }} />
              <MenuLink icon="⚙️" label="Settings" />
            </>
          )}
          <div className="border-t mt-1 pt-1" style={{ borderColor: "var(--border)" }}>
            <button onClick={() => { onLogout(); setOpen(false); }}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors hover:bg-red-500/10 text-red-400">
              <span>🚪</span> Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function MenuLink({ icon, label, onClick }) {
  return (
    <button onClick={onClick} className="w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors hover:bg-white/5" style={{ color: "var(--foreground)" }}>
      <span>{icon}</span> {label}
    </button>
  );
}
