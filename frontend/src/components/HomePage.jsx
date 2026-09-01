import { useState } from "react";
import { GAMES, GENRES } from "../data/games";
import { ScoreBadge, GenrePill } from "./shared/Badges";
import ReviewCard from "./ReviewCard";
import Sidebar from "./Sidebar";

// ─── Home page ────────────────────────────────────────────────────────────────
export default function HomePage({ authUser, onGameClick, onLoginClick }) {
  const [activeGenre, setActiveGenre] = useState("All");
  const featured = GAMES[0];
  const filtered = activeGenre === "All" ? GAMES : GAMES.filter((g) => g.genre === activeGenre);

  return (
    <main className="max-w-7xl mx-auto px-6 pb-20">
      {/* Featured hero */}
      <section className="mt-10 rounded-xl overflow-hidden relative cursor-pointer" style={{ background: "#000" }} onClick={() => onGameClick(featured)}>
        <img src={featured.image} alt={featured.title} className="w-full object-cover opacity-50" style={{ height: "480px" }} />
        <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12"
          style={{ background: "linear-gradient(120deg, rgba(7,7,15,0.98) 0%, rgba(7,7,15,0.7) 50%, transparent 100%)" }}>
          <div className="max-w-xl">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs font-bold uppercase tracking-widest px-2 py-1 rounded"
                style={{ background: "var(--primary)", color: "white", fontFamily: "var(--font-mono)" }}>Editor's Pick</span>
              <GenrePill label={featured.genre} />
            </div>
            <h1 className="text-6xl md:text-7xl font-black uppercase leading-none tracking-tight mb-3" style={{ fontFamily: "var(--font-display)" }}>{featured.title}</h1>
            <p className="text-xs mb-4 tracking-widest uppercase" style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-mono)" }}>
              {featured.publisher} · {featured.platform} · {featured.year}
            </p>
            <p className="text-base leading-relaxed mb-6 max-w-md" style={{ color: "var(--secondary-foreground)" }}>{featured.excerpt}</p>
            <div className="flex items-center gap-5">
              <ScoreBadge score={featured.score} large />
              <div>
                <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>Reviewed by <span style={{ color: "var(--foreground)" }} className="font-medium">{featured.reviewer}</span></p>
                <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-mono)" }}>{featured.reviewDate}</p>
              </div>
              <button className="ml-4 px-5 py-2.5 rounded text-sm font-semibold transition-all hover:opacity-90 active:scale-95"
                style={{ background: "var(--primary)", color: "white" }} onClick={(e) => { e.stopPropagation(); onGameClick(featured); }}>
                Read Full Review →
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="mt-14 grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-10">
        <div>
          <div className="flex items-center gap-2 mb-8 flex-wrap">
            {GENRES.map((g) => (
              <button key={g} onClick={() => setActiveGenre(g)}
                className="px-4 py-1.5 rounded text-sm font-semibold uppercase tracking-wider transition-all"
                style={{ fontFamily: "var(--font-display)", letterSpacing: "0.08em", background: activeGenre === g ? "var(--primary)" : "var(--secondary)", color: activeGenre === g ? "white" : "var(--secondary-foreground)", border: `1px solid ${activeGenre === g ? "var(--primary)" : "var(--border)"}` }}>
                {g}
              </button>
            ))}
          </div>
          <div className="flex items-baseline justify-between mb-6">
            <h2 className="text-3xl font-black uppercase tracking-wide" style={{ fontFamily: "var(--font-display)" }}>
              {activeGenre === "All" ? "Latest Reviews" : `${activeGenre} Reviews`}
            </h2>
            <span className="text-sm" style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-mono)" }}>{filtered.length} reviews</span>
          </div>
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {filtered.map((g) => <ReviewCard key={g.id} game={g} onClick={() => onGameClick(g)} />)}
            </div>
          ) : (
            <div className="py-20 text-center rounded-lg border" style={{ borderColor: "var(--border)", color: "var(--muted-foreground)" }}>
              <p className="text-4xl font-black uppercase mb-2" style={{ fontFamily: "var(--font-display)" }}>No Reviews Yet</p>
              <p className="text-sm">Check back soon for {activeGenre} reviews.</p>
            </div>
          )}
        </div>
        <Sidebar onGameClick={onGameClick} />
      </div>
    </main>
  );
}
