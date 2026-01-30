import { Link } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const sampleTrend = [
  { date: "10:00", score: 82 },
  { date: "10:05", score: 61 },
  { date: "10:10", score: 45 },
];

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <Link to="/cogniview" className="rounded-xl bg-blue-600 px-4 py-2 text-white font-semibold hover:bg-blue-700">
            New Session
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card title="Latest Risk Band" value="Medium" />
          <Card title="Latest Score" value="61" />
          <Card title="Sessions this week" value="3" />
        </div>

        <div className="mt-6 rounded-2xl bg-white border border-slate-200 p-5">
          <h2 className="font-semibold">Trend</h2>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sampleTrend}>
                <XAxis dataKey="date" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Line type="monotone" dataKey="score" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="mt-6 rounded-2xl bg-white border border-slate-200 p-5">
          <h2 className="font-semibold">Session History</h2>
          <div className="mt-3 text-sm text-slate-600">
            (Placeholder) Nanti ini diisi dari API `/sessions`.
          </div>
        </div>
      </div>
    </div>
  );
}

function Card({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white border border-slate-200 p-5">
      <div className="text-sm text-slate-600">{title}</div>
      <div className="mt-2 text-2xl font-bold">{value}</div>
    </div>
  );
}
