import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

type Task = "reading" | "picture";

const samples = [
  { id: "s1", label: "Sample A (Low Risk)" },
  { id: "s2", label: "Sample B (Medium Risk)" },
  { id: "s3", label: "Sample C (High Risk)" },
];

export default function CogniSetup() {
  const [params] = useSearchParams();
  const nav = useNavigate();
  const task = (params.get("task") as Task) || "reading";

  const prompt = useMemo(() => {
    if (task === "reading") {
      return [
        "Hari ini cuaca cerah dan menyenangkan.",
        "Saya akan membaca kalimat ini dengan jelas.",
        "Setelah ini saya akan berhenti merekam."
      ];
    }
    return ["Ceritakan apa yang kamu lihat pada gambar berikut."];
  }, [task]);

  const [sampleId, setSampleId] = useState<string>("");

  const handleAnalyze = async () => {
    // Hackathon placeholder: langsung route ke CareView dummy.
    // Nanti ganti jadi: create session -> use sample -> run -> redirect sessionId real.
    nav(`/careview/sess_demo_${sampleId || "s1"}`);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-4xl px-4 py-10">
        <h1 className="text-2xl font-bold">Session Setup</h1>
        <p className="mt-2 text-slate-600">
          Task: <span className="font-semibold">{task}</span>
        </p>

        <div className="mt-6 rounded-2xl bg-white border border-slate-200 p-6">
          <h2 className="font-semibold">Prompt</h2>
          <div className="mt-3 space-y-2">
            {prompt.map((p, idx) => (
              <div key={idx} className="text-sm text-slate-700">
                {task === "reading" ? `${idx + 1}. ${p}` : p}
              </div>
            ))}
            {task === "picture" && (
              <div className="mt-4 h-40 rounded-xl bg-amber-200 border border-amber-300" />
            )}
          </div>
        </div>

        <div className="mt-6 rounded-2xl bg-white border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Audio Input</h2>
            <span className="text-xs rounded-full bg-blue-50 border border-blue-100 text-blue-700 px-3 py-1">
              Demo Mode (Recommended)
            </span>
          </div>

          <div className="mt-4">
            <label className="text-sm text-slate-600">Use sample audio</label>
            <select
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2"
              value={sampleId}
              onChange={(e) => setSampleId(e.target.value)}
            >
              <option value="">Select sample…</option>
              {samples.map((s) => (
                <option key={s.id} value={s.id}>{s.label}</option>
              ))}
            </select>
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-slate-700 hover:bg-slate-50"
              onClick={() => alert("Prototype Notice: Live recording is limited in this demo. Please use sample audio.")}
            >
              Record (Prototype)
            </button>
            <button
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-slate-700 hover:bg-slate-50"
              onClick={() => alert("Prototype Notice: Upload is limited in this demo. Please use sample audio.")}
            >
              Upload (Prototype)
            </button>

            <button
              className="ml-auto rounded-xl bg-blue-600 px-5 py-2 text-white font-semibold disabled:opacity-50"
              disabled={!sampleId}
              onClick={handleAnalyze}
            >
              Analyze →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
