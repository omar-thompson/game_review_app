// Temporary placeholder used for pages we haven't converted yet
// (GameDetailPage, MyReviewsPage, AdminPanel). Swap these in once
// we build them out in a later stage.
export default function ComingSoon({ title, onBack }) {
  return (
    <div className="max-w-3xl mx-auto px-6 py-24 text-center">
      <p className="text-4xl font-black uppercase mb-3" style={{ fontFamily: "var(--font-display)" }}>{title}</p>
      <p className="text-sm mb-8" style={{ color: "var(--muted-foreground)" }}>
        This page hasn't been converted yet — it's coming in a later stage.
      </p>
      {onBack && (
        <button onClick={onBack} className="px-5 py-2.5 rounded text-sm font-semibold"
          style={{ background: "var(--primary)", color: "white" }}>
          ← Back to Home
        </button>
      )}
    </div>
  );
}
