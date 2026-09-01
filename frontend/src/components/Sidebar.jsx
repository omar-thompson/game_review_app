import { TOP_RATED } from "../data/games";
import { scoreColor } from "../utils/scoreHelpers";

// ─── Sidebar ──────────────────────────────────────────────────────────────────
export default function Sidebar({ onGameClick }) {
  return (
    <aside className="flex flex-col gap-8">
      <div className="rounded-lg border p-5" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
        <h3 className="text-xl font-black uppercase tracking-wide mb-1" style={{ fontFamily: "var(--font-display)" }}>Top Rated</h3>
        <p className="text-xs mb-5" style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-mono)" }}>Best scores · 2026</p>
        {TOP_RATED.map((item, i) => (
          <button key={item.id} onClick={() => onGameClick(item)}
            className="w-full flex items-center gap-4 py-3 border-b last:border-0 text-left hover:opacity-80 transition-opacity"
            style={{ borderColor: "var(--border)" }}>
            <span className="w-6 text-center text-lg font-black shrink-0" style={{ fontFamily: "var(--font-display)", color: "var(--muted-foreground)" }}>{i + 1}</span>
            <div className="flex-1 min-w-0">
              <p className="font-bold uppercase text-base leading-tight truncate" style={{ fontFamily: "var(--font-display)" }}>{item.title}</p>
              <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-mono)" }}>{item.genre} · {item.year}</p>
            </div>
            <div className={`text-base font-semibold ${scoreColor(item.score)}`} style={{ fontFamily: "var(--font-mono)" }}>{item.score}</div>
          </button>
        ))}
      </div>
      <div className="rounded-lg border p-5" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
        <h3 className="text-xl font-black uppercase tracking-wide mb-4" style={{ fontFamily: "var(--font-display)" }}>Score Guide</h3>
        {[
          { range: "90–100", label: "Must Play", color: "text-emerald-400", bg: "bg-emerald-400/10 border-emerald-400/30" },
          { range: "75–89", label: "Recommended", color: "text-yellow-400", bg: "bg-yellow-400/10 border-yellow-400/30" },
          { range: "60–74", label: "Mixed", color: "text-orange-400", bg: "bg-orange-400/10 border-orange-400/30" },
          { range: "0–59", label: "Avoid", color: "text-red-400", bg: "bg-red-400/10 border-red-400/30" },
        ].map((s) => (
          <div key={s.range} className="flex items-center gap-3 mb-3 last:mb-0">
            <div className={`w-12 h-7 rounded border text-xs font-semibold flex items-center justify-center ${s.bg} ${s.color}`} style={{ fontFamily: "var(--font-mono)" }}>{s.range.split("–")[0]}+</div>
            <div><p className="text-sm font-semibold">{s.label}</p><p className="text-xs" style={{ color: "var(--muted-foreground)" }}>{s.range}</p></div>
          </div>
        ))}
      </div>
      <div className="rounded-lg border p-5" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
        <h3 className="text-xl font-black uppercase tracking-wide mb-4" style={{ fontFamily: "var(--font-display)" }}>By Platform</h3>
        {[{ name: "PC", count: 7 }, { name: "PlayStation 5", count: 6 }, { name: "Xbox Series X", count: 3 }, { name: "Nintendo Switch", count: 1 }].map((p) => (
          <div key={p.name} className="flex items-center justify-between py-2 border-b last:border-0" style={{ borderColor: "var(--border)" }}>
            <span className="text-sm font-medium">{p.name}</span>
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "var(--muted)", color: "var(--muted-foreground)", fontFamily: "var(--font-mono)" }}>{p.count}</span>
          </div>
        ))}
      </div>
    </aside>
  );
}
