import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdTrendingDown, MdTrendingUp, MdCalendarToday, MdPerson, MdEmojiEvents, MdWarning, MdRemove } from 'react-icons/md';
import AuthenticatedNav from '../components/AuthenticatedNav';
import TrendChart from '../components/TrendChart';
import {
  getSessions,
  calculateOverallScore,
  getLatestScores,
  getTrendData,
  getScoreTrend,
  type SessionResult
} from '../utils/sessions';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState<string>('');
  const [sessions, setSessions] = useState<SessionResult[]>([]);

  useEffect(() => {
    const currentUser = localStorage.getItem('claritas_current_user');
    if (!currentUser) {
      navigate('/');
    } else {
      const parsed = JSON.parse(currentUser);
      setUserName(parsed.name || parsed.email);
    }

    // Load sessions from localStorage
    setSessions(getSessions());
  }, [navigate]);

  // Compute metrics
  const overall = calculateOverallScore(sessions);
  const latestScores = getLatestScores(sessions);
  const trendData = getTrendData(sessions);

  // Calculate trend direction based on overall score of last 2 sessions
  let trend: 'Meningkat' | 'Menurun' | 'Stabil' = 'Stabil';
  if (sessions.length >= 2) {
    const last = sessions[sessions.length - 1];
    const prev = sessions[sessions.length - 2];

    const lastAvg = (last.scores.speech_fluency + last.scores.lexical_score + last.scores.coherence_score) / 3;
    const prevAvg = (prev.scores.speech_fluency + prev.scores.lexical_score + prev.scores.coherence_score) / 3;

    if (lastAvg > prevAvg + 1) trend = 'Meningkat';
    else if (lastAvg < prevAvg - 1) trend = 'Menurun';
  }

  const trendColor = trend === 'Menurun' ? '#ef4444' : (trend === 'Meningkat' ? '#10b981' : '#6b7280');
  const TrendIcon = trend === 'Menurun' ? MdTrendingDown : (trend === 'Meningkat' ? MdTrendingUp : MdRemove);

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Rendah':
      case 'Baik':
        return { bg: '#dcfce7', text: '#166534' };
      case 'Sedang':
        return { bg: '#fed7aa', text: '#9a3412' };
      case 'Tinggi':
      case 'Buruk':
        return { bg: '#fee2e2', text: '#991b1b' };
      default:
        return { bg: '#f3f4f6', text: '#374151' };
    }
  };

  const latestSession = sessions.length > 0 ? sessions[sessions.length - 1] : null;
  const riskColors = latestSession ? getRiskColor(latestSession.risk_band) : { bg: '#f3f4f6', text: '#374151' };

  // Helper for metric trend
  const MetricTrendIcon = ({ metric }: { metric: 'speech_fluency' | 'lexical_score' | 'coherence_score' }) => {
    const t = getScoreTrend(sessions, metric);
    if (t === 'up') return <MdTrendingUp color="#10b981" size={24} />;
    if (t === 'down') return <MdTrendingDown color="#ef4444" size={24} />;
    return <MdRemove color="#6b7280" size={24} />;
  };

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
              Halo, {userName}
            </h2>
            <p style={{ margin: '0.25rem 0 0 0', color: '#6b7280', fontSize: '0.9rem' }}>Pasien: Budi Santoso (68 th)</p>
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
                {latestSession?.risk_band || '-'}
              </p>
            </div>
          </div>

          {/* Trend */}
          <div
            style={{
              backgroundColor: trend === 'Menurun' ? '#fee2e2' : (trend === 'Meningkat' ? '#dcfce7' : '#f3f4f6'),
              borderRadius: '0.75rem',
              padding: '1rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
            }}
          >
            <div style={{ color: trendColor }}>
              <TrendIcon size={32} />
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
            <MdCalendarToday size={28} color="#1e40af" />
            <div>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#6b7280' }}>Sesi Terakhir</p>
              <p style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: '#1e40af' }}>
                {latestSession ? new Date(latestSession.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) : '-'}
              </p>
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
              <p style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: '#92400e' }}>
                {sessions.length}
              </p>
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
              height: '400px',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#1f2937', fontWeight: 600 }}>
                Tren Skor Kognitif (Overall)
              </h3>
              {trend === 'Menurun' && (
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
              )}
            </div>

            {sessions.length > 0 ? (
              <div style={{ flex: 1, position: 'relative' }}>
                <TrendChart
                  dates={trendData.map(d => d.date)}
                  scores={trendData.map(d => d.overall)}
                  label="Overall Score"
                />
              </div>
            ) : (
              <div style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#6b7280',
                backgroundColor: '#f9fafb',
                borderRadius: '0.5rem',
              }}>
                Belum ada data sesi untuk ditampilkan.
              </div>
            )}
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
                    {Math.round(latestScores.speech_fluency)}
                  </p>
                </div>
                <MetricTrendIcon metric="speech_fluency" />
              </div>
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
                    {Math.round(latestScores.lexical_score)}
                  </p>
                </div>
                <MetricTrendIcon metric="lexical_score" />
              </div>
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
                    {Math.round(latestScores.coherence_score)}
                  </p>
                </div>
                <MetricTrendIcon metric="coherence_score" />
              </div>
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