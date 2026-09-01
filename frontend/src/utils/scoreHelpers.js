// ─── Helpers ──────────────────────────────────────────────────────────────────
export function scoreColor(score) {
  if (score >= 90) return "text-emerald-400";
  if (score >= 75) return "text-yellow-400";
  return "text-orange-400";
}

export function scoreBg(score) {
  if (score >= 90) return "bg-emerald-400/10 border-emerald-400/30";
  if (score >= 75) return "bg-yellow-400/10 border-yellow-400/30";
  return "bg-orange-400/10 border-orange-400/30";
}

export function scoreLabel(score) {
  if (score >= 90) return "Must Play";
  if (score >= 75) return "Recommended";
  if (score >= 60) return "Mixed";
  return "Avoid";
}
