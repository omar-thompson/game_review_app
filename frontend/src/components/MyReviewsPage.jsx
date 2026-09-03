import { useEffect, useState } from "react";
import { GAMES } from "../data/games";
import { ScoreBadge } from "./shared/Badges";
import { reviewApi } from "../utils/api";

// ─── My reviews ──────────────────────────────────────────────────────────────
// Reviews are stored with just a numeric game id, so to show the game's
// title/image alongside each review we look it up in the static GAMES list.
export default function MyReviewsPage({ onBack, onGameClick }) {
  const [reviews, setReviews] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    reviewApi
      .mine()
      .then(setReviews)
      .catch((err) => setError(err.message));
  }, []);

  return (
    <main className="max-w-3xl mx-auto px-6 pb-20">
      <button onClick={onBack} className="mt-8 mb-6 text-sm font-semibold" style={{ color: "var(--muted-foreground)" }}>
        ← Back
      </button>

      <h1 className="text-3xl font-black uppercase tracking-wide mb-6" style={{ fontFamily: "var(--font-display)" }}>My Reviews</h1>

      {error && <p className="text-xs text-red-400 mb-4" style={{ fontFamily: "var(--font-mono)" }}>{error}</p>}

      {reviews === null ? (
        <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>Loading…</p>
      ) : reviews.length === 0 ? (
        <div className="py-20 text-center rounded-lg border" style={{ borderColor: "var(--border)", color: "var(--muted-foreground)" }}>
          <p className="text-4xl font-black uppercase mb-2" style={{ fontFamily: "var(--font-display)" }}>No Reviews Yet</p>
          <p className="text-sm">Head to a game page and leave your first review.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {reviews.map((r) => {
            const game = GAMES.find((g) => g.id === r.game);
            return (
              <button key={r._id} onClick={() => game && onGameClick(game)}
                className="text-left rounded-lg border p-4 hover:opacity-90 transition-opacity"
                style={{ borderColor: "var(--border)", background: "var(--card)" }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold uppercase" style={{ fontFamily: "var(--font-display)" }}>
                    {game ? game.title : "Unknown game"}
                  </span>
                  <ScoreBadge score={r.score} />
                </div>
                <p className="text-sm" style={{ color: "var(--secondary-foreground)" }}>{r.body}</p>
                <p className="text-xs mt-2" style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-mono)" }}>
                  {new Date(r.createdAt).toLocaleDateString()}
                </p>
              </button>
            );
          })}
        </div>
      )}
    </main>
  );
}
