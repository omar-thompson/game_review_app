import { scoreColor, scoreBg } from "../../utils/scoreHelpers";

// ─── Shared UI ────────────────────────────────────────────────────────────────
export function ScoreBadge({ score, large = false }) {
  return (
    <div className={`border font-semibold flex items-center justify-center ${scoreBg(score)} ${scoreColor(score)} ${large ? "w-16 h-16 text-2xl rounded-md" : "w-11 h-11 text-base rounded"}`}
      style={{ fontFamily: "var(--font-mono)" }}>
      {score}
    </div>
  );
}

export function GenrePill({ label }) {
  return (
    <span className="px-2 py-0.5 text-[10px] tracking-widest uppercase font-semibold rounded border"
      style={{ fontFamily: "var(--font-mono)", color: "var(--accent)", borderColor: "var(--accent)", background: "color-mix(in srgb, var(--accent) 8%, transparent)" }}>
      {label}
    </span>
  );
}

export function StarRow({ score }) {
  const stars = Math.round(score / 20);
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill={i < stars ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2"
          className={i < stars ? "text-yellow-400" : "text-gray-600"}>
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}
