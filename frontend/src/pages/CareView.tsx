import { Link, useParams } from "react-router-dom";

export default function CareView() {
  const { sessionId } = useParams();

  // Dummy data (replace with API GET /sessions/{id})
  const result = {
    risk_band: sessionId?.includes("s3") ? "high" : sessionId?.includes("s2") ? "medium" : "low",
    overall_score: sessionId?.includes("s3") ? 42 : sessionId?.includes("s2") ? 61 : 82,
    summary: [
      "Ringkasan otomatis dari AI (prototype).",
      "Gunakan tren antar sesi untuk melihat perubahan longitudinal."
    ],
    key_signals: [
      { name: "Pause Ratio", value: 0.12, note: "within range" },
      { name: "Speech Rate", value: 135, note: "stable" }
    ],
    recommendation: [
      "Ulangi sesi 1x dalam 7 hari.",
      "Jika tren menurun konsisten, pertimbangkan konsultasi profesional."
    ],
    disclaimer: "Bukan diagnosis medis. Hanya indikator untuk mendukung pemantauan."
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-4xl px-4 py-10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">CareView</h1>
            <div className="mt-2 text-sm text-slate-600">Session: {sessionId}</div>
          </div>
          <Link to="/dashboard" className="rounded-xl border border-slate-200 bg-white px-4 py-2 hover:bg-slate-50">
            Back to Dashboard
          </Link>
        </div>

        <div className="mt-6 rounded-2xl bg-white border border-slate-200 p-6">
          <div className="flex items-center gap-3">
            <RiskBadge band={result.risk_band as any} />
            <div className="text-2xl font-bold">{result.overall_score}</div>
            <div className="text-slate-600">Overall Score</div>
          </div>

          <div className="mt-5">
            <h2 className="font-semibold">Summary</h2>
            <ul className="mt-2 list-disc pl-5 text-sm text-slate-700 space-y-1">
              {result.summary.map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          </div>

          <div className="mt-5">
            <h2 className="font-semibold">Key Signals</h2>
            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
              {result.key_signals.map((k, i) => (
                <div key={i} className="rounded-xl bg-slate-50 border border-slate-100 p-4">
                  <div className="font-semibold">{k.name}</div>
                  <div className="mt-1 text-sm text-slate-700">{k.value}</div>
                  <div className="mt-1 text-xs text-slate-500">{k.note}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5">
            <h2 className="font-semibold">Recommendation</h2>
            <ul className="mt-2 list-disc pl-5 text-sm text-slate-700 space-y-1">
              {result.recommendation.map((r, i) => <li key={i}>{r}</li>)}
            </ul>
          </div>

          <div className="mt-5 text-xs text-slate-500">
            {result.disclaimer}
          </div>
        </div>
      </div>
    </div>
  );
}

function RiskBadge({ band }: { band: "low" | "medium" | "high" }) {
  const style =
    band === "low"
      ? "bg-emerald-50 border-emerald-200 text-emerald-700"
      : band === "medium"
      ? "bg-amber-50 border-amber-200 text-amber-700"
      : "bg-rose-50 border-rose-200 text-rose-700";

  const label = band === "low" ? "Low Risk" : band === "medium" ? "Medium Risk" : "High Risk";

  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-semibold ${style}`}>
      {label}
    </span>
  );
}
