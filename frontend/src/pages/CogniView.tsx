import { useState } from "react";
import { useNavigate } from "react-router-dom";

type Task = "reading" | "picture";

export default function CogniView() {
  const [task, setTask] = useState<Task | null>(null);
  const nav = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-4xl px-4 py-10">
        <h1 className="text-2xl font-bold">CogniView</h1>
        <p className="mt-2 text-slate-600">Pilih task sesi evaluasi.</p>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <TaskCard
            selected={task === "reading"}
            title="Reading Sentences"
            desc="Membaca kalimat pendek untuk sampel suara terstruktur."
            onClick={() => setTask("reading")}
          />
          <TaskCard
            selected={task === "picture"}
            title="Picture Description"
            desc="Mendeskripsikan gambar untuk memancing narasi natural."
            onClick={() => setTask("picture")}
          />
        </div>

        <div className="mt-6 flex items-center justify-between">
          <button
            className="rounded-xl bg-blue-600 px-5 py-3 text-white font-semibold disabled:opacity-50"
            disabled={!task}
            onClick={() => nav(`/cogniview/setup?task=${task}`)}
          >
            Continue →
          </button>
          <div className="text-sm text-slate-500">
            Demo Mode tersedia untuk hasil stabil.
          </div>
        </div>
      </div>
    </div>
  );
}

function TaskCard({
  selected,
  title,
  desc,
  onClick,
}: {
  selected: boolean;
  title: string;
  desc: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        "text-left rounded-2xl border p-6 bg-white shadow-sm",
        selected ? "border-blue-600 ring-2 ring-blue-100" : "border-slate-200 hover:border-slate-300",
      ].join(" ")}
    >
      <div className="h-10 w-10 rounded-xl bg-blue-50 border border-blue-100" />
      <h3 className="mt-4 font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-slate-600">{desc}</p>
    </button>
  );
}
