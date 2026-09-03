import { ScoreBadge, GenrePill } from "./shared/Badges";

// ─── Review card ──────────────────────────────────────────────────────────────
// A single game "card" shown in the grid on the home page.
// Presentational only — no state, no backend calls. It just receives a
// game object as a prop and renders it; clicking anywhere on the card
// calls the onClick prop it was given (passed down from HomePage, which
// got it from App.jsx — see the click-through-the-tree explanation for
// how this eventually opens GameDetailPage).
export default function ReviewCard({ game, onClick }) {
  return (
    // Clicking anywhere on this whole card fires onClick
    <article onClick={onClick} className="group flex flex-col rounded-lg overflow-hidden border transition-all duration-300 hover:-translate-y-1 cursor-pointer"
      style={{ background: "var(--card)", borderColor: "var(--border)" }}>

      {/* Cover image + genre/score badges overlaid on top of it */}
      <div className="relative overflow-hidden" style={{ background: "#111" }}>
        <img src={game.image} alt={game.title}
          className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105 opacity-90" />
        <div className="absolute top-3 left-3"><GenrePill label={game.genre} /></div>
        <div className="absolute top-3 right-3"><ScoreBadge score={game.score} /></div>
        <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(to top, var(--card) 0%, transparent 50%)" }} />
      </div>

      {/* Text content: title, meta info, excerpt, reviewer byline */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        <div>
          <h3 className="text-2xl font-bold uppercase leading-tight tracking-wide" style={{ fontFamily: "var(--font-display)" }}>{game.title}</h3>
          <p className="text-xs mt-1" style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-mono)" }}>{game.publisher} · {game.platform} · {game.year}</p>
        </div>
        <p className="text-sm leading-relaxed flex-1" style={{ color: "var(--secondary-foreground)" }}>{game.excerpt}</p>
        <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: "var(--border)" }}>
          <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>
            By <span className="font-medium" style={{ color: "var(--foreground)" }}>{game.reviewer}</span>
          </span>
          <span className="text-xs" style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-mono)" }}>{game.reviewDate}</span>
        </div>
      </div>
    </article>
  );
}
