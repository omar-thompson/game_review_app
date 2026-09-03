import { useEffect, useState } from "react";
import { ScoreBadge, GenrePill } from "./shared/Badges";
import { reviewApi } from "../utils/api";

// ─── Game details + reviews ─────────────────────────────────────────────────────
// `game` is the static game object (title, description, image, etc. — see
// data/games.js). Reviews themselves are real, fetched from the backend by
// the game's numeric `id`, since there's no Game collection in MongoDB —
// only the reviews are actually persisted.
export default function GameDetailPage({ game, authUser, onBack, onLoginClick }) {
  const [reviews, setReviews] = useState(null);
  const [error, setError] = useState("");
  const [score, setScore] = useState(80);
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function loadReviews() {
    reviewApi
      .forGame(game.id)
      .then(setReviews)
      .catch((err) => setError(err.message));
  }

  useEffect(() => {
    loadReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game.id]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!body.trim()) return;
    setSubmitting(true);
    setError("");
    try {
      await reviewApi.create(game.id, Number(score), body.trim());
      setBody("");
      setScore(80);
      loadReviews();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="max-w-4xl mx-auto px-6 pb-20">
      <button onClick={onBack} className="mt-8 mb-6 text-sm font-semibold" style={{ color: "var(--muted-foreground)" }}>
        ← Back
      </button>

      {/* Game info */}
      <div className="rounded-xl overflow-hidden relative mb-10" style={{ background: "#000" }}>
        <img src={game.image} alt={game.title} className="w-full object-cover opacity-50" style={{ height: "320px" }} />
        <div className="absolute inset-0 flex flex-col justify-end p-8"
          style={{ background: "linear-gradient(120deg, rgba(7,7,15,0.98) 0%, rgba(7,7,15,0.7) 50%, transparent 100%)" }}>
          <div className="flex items-center gap-3 mb-3">
            <GenrePill label={game.genre} />
          </div>
          <h1 className="text-5xl font-black uppercase leading-none tracking-tight mb-3" style={{ fontFamily: "var(--font-display)" }}>{game.title}</h1>
          <p className="text-xs mb-4 tracking-widest uppercase" style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-mono)" }}>
            {game.publisher} · {game.platform} · {game.year}
          </p>
          <div className="flex items-center gap-4">
            <ScoreBadge score={game.score} large />
            <p className="text-sm" style={{ color: "var(--secondary-foreground)" }}>{game.excerpt}</p>
          </div>
        </div>
      </div>

      <p className="text-sm leading-relaxed whitespace-pre-line mb-10" style={{ color: "var(--secondary-foreground)" }}>
        {game.description}
      </p>

      {/* Leave a review */}
      <div className="rounded-xl border p-6 mb-10" style={{ borderColor: "var(--border)", background: "var(--card)" }}>
        <h2 className="text-xl font-black uppercase tracking-wide mb-4" style={{ fontFamily: "var(--font-display)" }}>Leave a Review</h2>
        {authUser ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <label className="text-xs font-semibold uppercase tracking-widest" style={{ fontFamily: "var(--font-mono)", color: "var(--muted-foreground)" }}>Score</label>
              <input type="number" min="0" max="100" value={score} onChange={(e) => setScore(e.target.value)}
                className="w-20 px-2 py-1.5 rounded border text-sm outline-none"
                style={{ background: "var(--muted)", borderColor: "var(--border)", color: "var(--foreground)" }} />
            </div>
            <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={3} placeholder="What did you think of this game?"
              className="w-full px-3 py-2.5 rounded-md border text-sm outline-none resize-none"
              style={{ background: "var(--muted)", borderColor: "var(--border)", color: "var(--foreground)" }} />
            {error && <p className="text-xs text-red-400" style={{ fontFamily: "var(--font-mono)" }}>{error}</p>}
            <button type="submit" disabled={submitting} className="self-start px-5 py-2.5 rounded text-sm font-semibold disabled:opacity-50"
              style={{ background: "var(--primary)", color: "white" }}>
              {submitting ? "Submitting…" : "Submit Review"}
            </button>
          </form>
        ) : (
          <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
            <button onClick={onLoginClick} className="underline">Sign in</button> to leave a review.
          </p>
        )}
      </div>

      {/* Reviews list */}
      <div>
        <h2 className="text-xl font-black uppercase tracking-wide mb-4" style={{ fontFamily: "var(--font-display)" }}>Community Reviews</h2>
        {reviews === null ? (
          <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>Loading…</p>
        ) : reviews.length === 0 ? (
          <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>No reviews yet — be the first.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {reviews.map((r) => (
              <div key={r._id} className="rounded-lg border p-4" style={{ borderColor: "var(--border)", background: "var(--card)" }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold">{r.user?.name || "Unknown"}</span>
                  <ScoreBadge score={r.score} />
                </div>
                <p className="text-sm" style={{ color: "var(--secondary-foreground)" }}>{r.body}</p>
                <p className="text-xs mt-2" style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-mono)" }}>
                  {new Date(r.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
