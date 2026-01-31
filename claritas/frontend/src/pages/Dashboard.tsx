import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { MdTrendingDown, MdTrendingUp, MdCalendarToday, MdPerson, MdEmojiEvents, MdWarning } from 'react-icons/md';
import AuthenticatedNav from '../components/AuthenticatedNav';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface Session {
  date: string;
  type: string;
  speech_fluency: number;
  lexical: number;
  coherence: number;
  risk: string;
  note: string;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState<string>('');

  // Dummy sessions data
  const [sessions] = useState<Session[]>([
    {
      date: '2026-01-08',
      type: 'Deskripsi gambar',
      speech_fluency: 62,
      lexical: 58,
      coherence: 60,
      risk: 'Sedang',
      note: '-',
    },
    {
      date: '2025-12-27',
      type: 'Membaca kalimat',
      speech_fluency: 65,
      lexical: 60,
      coherence: 62,
      risk: 'Sedang',
      note: 'Pasien tampak lebih lelah',
    },
    {
      date: '2025-12-13',
      type: 'Deskripsi gambar',
      speech_fluency: 68,
      lexical: 63,
      coherence: 65,
      risk: 'Rendah',
      note: '-',
    },
    {
      date: '2025-11-29',
      type: 'Membaca kalimat',
      speech_fluency: 70,
      lexical: 65,
      coherence: 68,
      risk: 'Rendah',
      note: 'Sesi berlangsung lancar',
    },
    {
      date: '2025-11-15',
      type: 'Deskripsi gambar',
      speech_fluency: 72,
      lexical: 68,
      coherence: 70,
      risk: 'Rendah',
      note: '-',
    },
  ]);

  useEffect(() => {
    const currentUser = localStorage.getItem('claritas_current_user');
    if (!currentUser) {
      navigate('/');
    } else {
      const parsed = JSON.parse(currentUser);
      setUserName(parsed.name || parsed.email);
    }
  }, [navigate]);

  // Compute metrics
  const latest = sessions[0];
  const overall = Math.round((latest.speech_fluency + latest.lexical + latest.coherence) / 3);
  const trend = sessions[0].speech_fluency < sessions[1].speech_fluency ? 'Menurun' : 'Meningkat';
  const trendColor = trend === 'Menurun' ? '#ef4444' : '#10b981';

  // Chart data
  const dates = sessions.map((s) => s.date);
  const speechData = sessions.map((s) => s.speech_fluency);
  const lexicalData = sessions.map((s) => s.lexical);
  const coherenceData = sessions.map((s) => s.coherence);

  const chartData = {
    labels: dates.reverse(),
    datasets: [
      {
        label: 'Speech Fluency',
        data: [...speechData].reverse(),
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        tension: 0.3,
      },
      {
        label: 'Lexical',
        data: [...lexicalData].reverse(),
        borderColor: '#06b6d4',
        backgroundColor: 'rgba(6, 182, 212, 0.1)',
        tension: 0.3,
      },
      {
        label: 'Coherence',
        data: [...coherenceData].reverse(),
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.3,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          boxWidth: 12,
          padding: 15,
        },
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        min: 40,
        max: 100,
        grid: {
          color: '#f3f4f6',
        },
        ticks: {
          color: '#6b7280',
        },
      },
      x: {
        ticks: {
          color: '#6b7280',
        },
        grid: {
          display: false,
        },
      },
    },
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Rendah':
        return { bg: '#dcfce7', text: '#166534' };
      case 'Sedang':
        return { bg: '#fed7aa', text: '#9a3412' };
      case 'Tinggi':
        return { bg: '#fee2e2', text: '#991b1b' };
      default:
        return { bg: '#f3f4f6', text: '#374151' };
    }
  };

  const riskColors = getRiskColor(latest.risk);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <AuthenticatedNav />

      <div style={{ display: 'flex', gap: '1.5rem', padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
        {/* Sidebar */}
        <aside style={{ width: '320px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Patient Info */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '0.75rem',
              padding: '1.5rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            }}
          >
            <h2 style={{ margin: 0, fontSize: '1.25rem', color: '#1f2937', fontWeight: 700 }}>
              Halo, Budi Santoso
            </h2>
            <p style={{ margin: '0.25rem 0 0 0', color: '#6b7280', fontSize: '0.9rem' }}>Usia: 68 tahun</p>
          </div>

          {/* Score and Risk */}
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div
              style={{
                flex: 1,
                backgroundColor: '#eff6ff',
                borderRadius: '0.75rem',
                padding: '1.25rem',
                textAlign: 'center',
              }}
            >
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                Skor Rata-rata
              </p>
              <p style={{ margin: 0, fontSize: '2rem', fontWeight: 700, color: '#2563eb' }}>{overall}</p>
            </div>
            <div
              style={{
                flex: 1,
                backgroundColor: riskColors.bg,
                borderRadius: '0.75rem',
                padding: '1.25rem',
                textAlign: 'center',
              }}
            >
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                Risk Band
              </p>
              <p style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: riskColors.text }}>
                {latest.risk}
              </p>
            </div>
          </div>

          {/* Trend */}
          <div
            style={{
              backgroundColor: trend === 'Menurun' ? '#fee2e2' : '#dcfce7',
              borderRadius: '0.75rem',
              padding: '1rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
            }}
          >
            <div style={{ color: trendColor }}>
              {trend === 'Menurun' ? <MdTrendingDown size={32} /> : <MdTrendingUp size={32} />}
            </div>
            <div>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#6b7280' }}>Tren</p>
              <p style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: trendColor }}>{trend}</p>
            </div>
          </div>

          {/* Monitoring Period */}
          <div
            style={{
              backgroundColor: '#d1fae5',
              borderRadius: '0.75rem',
              padding: '1rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
            }}
          >
            <MdCalendarToday size={28} color="#065f46" />
            <div>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#6b7280' }}>Periode Pemantauan</p>
              <p style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: '#065f46' }}>12 Minggu</p>
            </div>
          </div>

          {/* Last Session */}
          <div
            style={{
              backgroundColor: '#dbeafe',
              borderRadius: '0.75rem',
              padding: '1rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
            }}
          >
            <MdPerson size={28} color="#1e40af" />
            <div>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#6b7280' }}>Sesi Terakhir</p>
              <p style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: '#1e40af' }}>8 Januari 2025</p>
            </div>
          </div>

          {/* Total Sessions */}
          <div
            style={{
              backgroundColor: '#fef3c7',
              borderRadius: '0.75rem',
              padding: '1rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
            }}
          >
            <MdEmojiEvents size={28} color="#92400e" />
            <div>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#6b7280' }}>Jumlah Sesi</p>
              <p style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: '#92400e' }}>24</p>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Trend Chart */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '0.75rem',
              padding: '1.5rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#1f2937', fontWeight: 600 }}>
                Tren Skor Kognitif
              </h3>
              <button
                style={{
                  backgroundColor: '#fef3c7',
                  color: '#92400e',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.5rem',
                  fontSize: '0.85rem',
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <MdWarning size={18} /> Tren Menurun
              </button>
            </div>
            <p style={{ margin: '0 0 1.5rem 0', fontSize: '0.9rem', color: '#6b7280' }}>
              Perkembangan skor dari 5 sesi terakhir
            </p>
            <div style={{ height: '300px' }}>
              <Line data={chartData} options={chartOptions} />
            </div>
          </div>

          {/* Metrics Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
            <div
              style={{
                backgroundColor: '#eff6ff',
                borderRadius: '0.75rem',
                padding: '1.25rem',
                border: '2px solid #bfdbfe',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#6b7280' }}>Speech Fluency</p>
                  <p style={{ margin: '0.5rem 0 0 0', fontSize: '1.75rem', fontWeight: 700, color: '#2563eb' }}>
                    {latest.speech_fluency}
                  </p>
                </div>
                <MdTrendingDown size={24} color="#ef4444" />
              </div>
              <p style={{ margin: '0.75rem 0 0 0', fontSize: '0.8rem', color: '#ef4444', fontWeight: 500 }}>
                -10 poin (72 → 62)
              </p>
            </div>

            <div
              style={{
                backgroundColor: '#f0fdfa',
                borderRadius: '0.75rem',
                padding: '1.25rem',
                border: '2px solid #99f6e4',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#6b7280' }}>Lexical Score</p>
                  <p style={{ margin: '0.5rem 0 0 0', fontSize: '1.75rem', fontWeight: 700, color: '#06b6d4' }}>
                    {latest.lexical}
                  </p>
                </div>
                <MdTrendingDown size={24} color="#ef4444" />
              </div>
              <p style={{ margin: '0.75rem 0 0 0', fontSize: '0.8rem', color: '#ef4444', fontWeight: 500 }}>
                -10 poin (68 → 58)
              </p>
            </div>

            <div
              style={{
                backgroundColor: '#dcfce7',
                borderRadius: '0.75rem',
                padding: '1.25rem',
                border: '2px solid #86efac',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#6b7280' }}>Coherence</p>
                  <p style={{ margin: '0.5rem 0 0 0', fontSize: '1.75rem', fontWeight: 700, color: '#10b981' }}>
                    {latest.coherence}
                  </p>
                </div>
                <MdTrendingDown size={24} color="#ef4444" />
              </div>
              <p style={{ margin: '0.75rem 0 0 0', fontSize: '0.8rem', color: '#ef4444', fontWeight: 500 }}>
                -10 poin (70 → 60)
              </p>
            </div>
          </div>

          {/* Recommendation */}
          <div
            style={{
              backgroundColor: '#fef3c7',
              borderRadius: '0.75rem',
              padding: '1.25rem',
              border: '2px solid #fde68a',
              display: 'flex',
              gap: '1rem',
              alignItems: 'flex-start',
            }}
          >
            <MdWarning size={28} color="#92400e" />
            <div>
              <h4 style={{ margin: 0, fontSize: '1rem', color: '#92400e', fontWeight: 600 }}>Rekomendasi</h4>
              <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', color: '#78350f', lineHeight: 1.6 }}>
                Pasien menunjukkan penurunan yang signifikan! Lanjutkan sesi latihan 2-3 kali seminggu.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;