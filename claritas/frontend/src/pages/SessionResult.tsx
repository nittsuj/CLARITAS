import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { MdArrowBack, MdExpandMore, MdExpandLess } from 'react-icons/md';
import AuthenticatedNav from '../components/AuthenticatedNav';
import { getSessionById, type SessionResult as SessionData } from '../utils/sessions';

const SessionResult: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { sessionId } = useParams<{ sessionId: string }>();
  const [session, setSession] = useState<SessionData | null>(null);
  const [showDetailTeknis, setShowDetailTeknis] = useState(false);

  useEffect(() => {
    // Try to get session from URL params first
    if (sessionId) {
      const sessionData = getSessionById(sessionId);
      if (sessionData) {
        setSession(sessionData);
        return;
      }
    }

    // Fallback to location state
    const state = location.state as { session?: SessionData } | undefined;
    if (state?.session) {
      setSession(state.session);
    }
  }, [sessionId, location.state]);

  if (!session) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
        <AuthenticatedNav />
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <p style={{ color: '#6b7280' }}>Hasil sesi tidak tersedia.</p>
          <button
            onClick={() => navigate('/careview')}
            style={{
              backgroundColor: '#2563eb',
              color: '#ffffff',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.5rem',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            Kembali ke CareView
          </button>
        </div>
      </div>
    );
  }

  const getRiskColor = (band: string): string => {
    if (band === 'Baik') return '#10b981';
    if (band === 'Sedang') return '#f59e0b';
    return '#ef4444';
  };

  const getScoreColor = (score: number): string => {
    if (score >= 80) return '#3b82f6';
    if (score >= 60) return '#10b981';
    if (score >= 40) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <AuthenticatedNav />

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
        {/* Header */}
        <button
          onClick={() => navigate('/careview')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: 'transparent',
            border: 'none',
            color: '#2563eb',
            fontSize: '1rem',
            fontWeight: 600,
            cursor: 'pointer',
            marginBottom: '1.5rem',
          }}
        >
          <MdArrowBack size={20} />
          Hasil Sesi
        </button>

        {/* Informasi Sesi */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '0.75rem',
            padding: '1.5rem',
            marginBottom: '1.5rem',
            border: '1px solid #e5e7eb',
          }}
        >
          <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', color: '#6b7280', fontWeight: 600 }}>
            Informasi Sesi
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                Tanggal Sesi
              </div>
              <div style={{ fontSize: '0.875rem', color: '#111827', fontWeight: 600 }}>
                {new Date(session.date).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                Jenis Tugas
              </div>
              <div style={{ fontSize: '0.875rem', color: '#111827', fontWeight: 600 }}>
                {session.taskType === 'deskripsi-gambar' ? 'Deskripsi gambar' : 'Baca kalimat'}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                Durasi
              </div>
              <div style={{ fontSize: '0.875rem', color: '#111827', fontWeight: 600 }}>
                2 Lainber
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                Nama Caregiver
              </div>
              <div style={{ fontSize: '0.875rem', color: '#111827', fontWeight: 600 }}>
                {session.caregiver}
              </div>
            </div>
          </div>
        </div>

        {/* Skor Utama */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '0.75rem',
            padding: '1.5rem',
            marginBottom: '1.5rem',
            border: '1px solid #e5e7eb',
          }}
        >
          <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', color: '#6b7280', fontWeight: 600 }}>
            Skor Utama
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
            {/* Speech Fluency */}
            <div
              style={{
                backgroundColor: '#eff6ff',
                borderRadius: '0.5rem',
                padding: '1rem',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                Speech Fluency
              </div>
              <div
                style={{
                  fontSize: '2rem',
                  fontWeight: 700,
                  color: '#3b82f6',
                  marginBottom: '0.5rem',
                }}
              >
                {Math.round(session.scores.speech_fluency)}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>dari 100</div>
            </div>

            {/* Lexical Score */}
            <div
              style={{
                backgroundColor: '#d1fae5',
                borderRadius: '0.5rem',
                padding: '1rem',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                Lexical Score
              </div>
              <div
                style={{
                  fontSize: '2rem',
                  fontWeight: 700,
                  color: '#10b981',
                  marginBottom: '0.5rem',
                }}
              >
                {Math.round(session.scores.lexical_score)}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>dari 100</div>
            </div>

            {/* Coherence Score */}
            <div
              style={{
                backgroundColor: '#dbeafe',
                borderRadius: '0.5rem',
                padding: '1rem',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                Coherence Score
              </div>
              <div
                style={{
                  fontSize: '2rem',
                  fontWeight: 700,
                  color: '#3b82f6',
                  marginBottom: '0.5rem',
                }}
              >
                {Math.round(session.scores.coherence_score)}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>dari 100</div>
            </div>

            {/* Risk Band */}
            <div
              style={{
                backgroundColor: '#fef3c7',
                borderRadius: '0.5rem',
                padding: '1rem',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                Risk Band
              </div>
              <div
                style={{
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  color: getRiskColor(session.risk_band),
                  marginBottom: '0.5rem',
                }}
              >
                {session.risk_band}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Status</div>
            </div>
          </div>
        </div>

        {/* Diagnosis */}
        <div
          style={{
            backgroundColor: '#eff6ff',
            borderRadius: '0.75rem',
            padding: '1.5rem',
            marginBottom: '1.5rem',
            border: '1px solid #bfdbfe',
          }}
        >
          <h3
            style={{
              margin: '0 0 0.75rem 0',
              fontSize: '0.95rem',
              color: '#1e40af',
              fontWeight: 600,
            }}
          >
            📋 Diagnosis
          </h3>
          <p style={{ margin: 0, color: '#1e3a8a', lineHeight: 1.6, fontSize: '0.9rem' }}>
            {session.summary}
          </p>
        </div>

        {/* Detail Teknis */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '0.75rem',
            border: '1px solid #e5e7eb',
            marginBottom: '1.5rem',
          }}
        >
          <button
            onClick={() => setShowDetailTeknis(!showDetailTeknis)}
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '1.25rem 1.5rem',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 600,
              color: '#111827',
            }}
          >
            Detail Teknis
            {showDetailTeknis ? <MdExpandLess size={24} /> : <MdExpandMore size={24} />}
          </button>

          {showDetailTeknis && session.technical && (
            <div style={{ padding: '0 1.5rem 1.5rem 1.5rem' }}>
              {/* Metrik Akustik */}
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ margin: '0 0 1rem 0', fontSize: '0.9rem', color: '#6b7280', fontWeight: 600 }}>
                  Metrik Akustik
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                  {session.technical.fitur_akustik && Object.entries(session.technical.fitur_akustik).map(([key, value]) => (
                    <div key={key} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0' }}>
                      <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                        {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                      <span style={{ fontSize: '0.875rem', color: '#111827', fontWeight: 600 }}>
                        {typeof value === 'number' ? value.toFixed(2) : String(value)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Metrik Leksikal */}
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ margin: '0 0 1rem 0', fontSize: '0.9rem', color: '#6b7280', fontWeight: 600 }}>
                  Metrik Leksikal
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                  {session.technical.fitur_leksikal && Object.entries(session.technical.fitur_leksikal).map(([key, value]) => (
                    <div key={key} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0' }}>
                      <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                        {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                      <span style={{ fontSize: '0.875rem', color: '#111827', fontWeight: 600 }}>
                        {typeof value === 'number' ? value.toFixed(2) : String(value)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Koherensi */}
              {session.technical.coherence_score !== undefined && (
                <div>
                  <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '0.9rem', color: '#6b7280', fontWeight: 600 }}>
                    Koherensi
                  </h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div
                      style={{
                        flex: 1,
                        height: '8px',
                        backgroundColor: '#e5e7eb',
                        borderRadius: '4px',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          width: `${session.technical.coherence_score}%`,
                          height: '100%',
                          backgroundColor: '#10b981',
                          borderRadius: '4px',
                        }}
                      />
                    </div>
                    <span style={{ fontSize: '0.875rem', color: '#111827', fontWeight: 600 }}>
                      {session.technical.coherence_score}/100
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <button
            onClick={() => {
              // TODO: Implement transcript & timeline view
              alert('Fitur Transkrip & Timeline akan segera hadir!');
            }}
            style={{
              backgroundColor: '#6b7280',
              color: '#ffffff',
              padding: '1rem',
              borderRadius: '0.5rem',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.95rem',
              fontWeight: 600,
            }}
          >
            📄 Lihat Transkrip & Timeline
          </button>
          <button
            onClick={() => navigate('/careview')}
            style={{
              backgroundColor: '#2563eb',
              color: '#ffffff',
              padding: '1rem',
              borderRadius: '0.5rem',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.95rem',
              fontWeight: 600,
            }}
          >
            Kembali ke CareView
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionResult;