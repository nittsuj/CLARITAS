import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';

interface ResultState {
  result: {
    speech_fluency: number;
    lexical_score: number;
    coherence_score: number;
    risk_band?: string;
    summary: string;
    technical?: Record<string, any>;
  };
}

const SessionResult: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as ResultState | undefined;

  if (!state || !state.result) {
    return (
      <div style={{ padding: '2rem' }}>
        <p>Hasil sesi tidak tersedia.</p>
        <button onClick={() => navigate('/dashboard')}>Kembali ke Dashboard</button>
      </div>
    );
  }

  const { speech_fluency, lexical_score, coherence_score, risk_band, summary, technical } = state.result;
  // If risk band not provided, determine based on average
  const average = (speech_fluency + lexical_score + coherence_score) / 3;
  const computedRisk = risk_band
    ? risk_band
    : average >= 70
    ? 'Baik'
    : average >= 50
    ? 'Sedang'
    : 'Buruk';

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <nav
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1rem 2rem',
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e5e7eb',
        }}
      >
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <Link to="/dashboard" style={{ color: '#2563eb', fontWeight: 700 }}>
            Claritas
          </Link>
          <Link to="/dashboard" style={{ color: '#374151', fontWeight: 500 }}>
            Dashboard
          </Link>
          <Link to="/cogniview" style={{ color: '#374151', fontWeight: 500 }}>
            CogniView
          </Link>
          <Link to="/dashboard" style={{ color: '#374151', fontWeight: 500 }}>
            CareView
          </Link>
        </div>
        <div></div>
      </nav>

      <main style={{ padding: '2rem', maxWidth: '700px', margin: '0 auto' }}>
        <div
          style={{
            backgroundColor: '#ffffff',
            padding: '2rem',
            borderRadius: '0.5rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          }}
        >
          <h2 style={{ marginTop: 0, color: '#1f2937' }}>Hasil Sesi</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '1rem' }}>
            <div
              style={{
                flex: '1 1 120px',
                backgroundColor: '#f9fafb',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
                padding: '0.75rem',
              }}
            >
              <p style={{ margin: 0, color: '#6b7280', fontSize: '0.8rem' }}>Speech Fluency</p>
              <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700, color: '#2563eb' }}>{speech_fluency}</p>
            </div>
            <div
              style={{
                flex: '1 1 120px',
                backgroundColor: '#f9fafb',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
                padding: '0.75rem',
              }}
            >
              <p style={{ margin: 0, color: '#6b7280', fontSize: '0.8rem' }}>Lexical Score</p>
              <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700, color: '#059669' }}>{lexical_score}</p>
            </div>
            <div
              style={{
                flex: '1 1 120px',
                backgroundColor: '#f9fafb',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
                padding: '0.75rem',
              }}
            >
              <p style={{ margin: 0, color: '#6b7280', fontSize: '0.8rem' }}>Coherence Score</p>
              <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700, color: '#d97706' }}>{coherence_score}</p>
            </div>
            <div
              style={{
                flex: '1 1 120px',
                backgroundColor: '#f9fafb',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
                padding: '0.75rem',
              }}
            >
              <p style={{ margin: 0, color: '#6b7280', fontSize: '0.8rem' }}>Risk Band</p>
              <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700, color: '#dc2626' }}>{computedRisk}</p>
            </div>
          </div>
          <h3 style={{ marginTop: '1.5rem', marginBottom: '0.5rem', color: '#1f2937' }}>Ringkasan</h3>
          <p style={{ color: '#374151', lineHeight: 1.6 }}>{summary}</p>
          {technical && (
            <details style={{ marginTop: '1rem' }}>
              <summary style={{ cursor: 'pointer', color: '#2563eb' }}>Detail Teknis</summary>
              <pre style={{ backgroundColor: '#f9fafb', padding: '1rem', borderRadius: '0.5rem', overflowX: 'auto' }}>
{JSON.stringify(technical, null, 2)}
              </pre>
            </details>
          )}
          <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
            <button
              onClick={() => navigate('/dashboard')}
              style={{
                backgroundColor: '#2563eb',
                color: '#ffffff',
                padding: '0.6rem 1.2rem',
                borderRadius: '0.375rem',
                border: 'none',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Kembali ke CareView
            </button>
            <button
              onClick={() => navigate('/cogniview')}
              style={{
                backgroundColor: '#059669',
                color: '#ffffff',
                padding: '0.6rem 1.2rem',
                borderRadius: '0.375rem',
                border: 'none',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Mulai Sesi Baru
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SessionResult;