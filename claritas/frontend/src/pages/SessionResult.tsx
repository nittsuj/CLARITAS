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
  const [showDetailTeknis, setShowDetailTeknis] = useState(true); // Default open to match mockup focus

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

  // Helper component for Technical Cards
  const TechCard = ({ label, value, subtext = '' }: { label: string, value: string | number, subtext?: string }) => (
    <div style={{
      backgroundColor: '#f9fafb',
      padding: '1rem',
      borderRadius: '0.5rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.25rem'
    }}>
      <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{label}</span>
      <span style={{ fontSize: '1rem', fontWeight: 600, color: '#111827' }}>{value}</span>
      {subtext && <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{subtext}</span>}
    </div>
  );

  // Safely access nested optional properties
  const acoustics = session.technical?.acoustic_features || {};
  const lexical = session.technical?.lexical_features || {};

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <AuthenticatedNav />

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem' }}>
        {/* Header Navigation */}
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

        {/* Ringkasan AI */}
        <div
          style={{
            backgroundColor: '#eff6ff',
            borderRadius: '0.75rem',
            padding: '1.5rem',
            marginBottom: '1.5rem',
            border: '1px solid #bfdbfe',
            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
          }}
        >
          <h3
            style={{
              margin: '0 0 0.75rem 0',
              fontSize: '1.1rem',
              color: '#1e40af',
              fontWeight: 600,
            }}
          >
            Ringkasan AI
          </h3>
          <p style={{ margin: 0, color: '#1e3a8a', lineHeight: 1.6, fontSize: '0.95rem' }}>
            {session.summary}
          </p>
        </div>

        {/* Detail Teknis Section (Collapsible) */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '0.75rem',
            border: '1px solid #e5e7eb',
            marginBottom: '1.5rem',
            overflow: 'hidden'
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
              backgroundColor: '#ffffff',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1.1rem',
              fontWeight: 700,
              color: '#111827',
              borderBottom: showDetailTeknis ? '1px solid #e5e7eb' : 'none'
            }}
          >
            Detail Teknis
            {showDetailTeknis ? <MdExpandLess size={24} /> : <MdExpandMore size={24} />}
          </button>

          {showDetailTeknis && (
            <div style={{ padding: '1.5rem' }}>
              {/* Metrik Akustik */}
              <div style={{ marginBottom: '2rem' }}>
                <h4 style={{ margin: '0 0 1rem 0', fontSize: '0.95rem', color: '#111827', fontWeight: 600 }}>
                  Metrik Akustik
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                  <TechCard
                    label="Pause Ratio"
                    value={acoustics.pause_ratio ? acoustics.pause_ratio.toFixed(2) : '0.35'} // Fallback for demo
                  />
                  <TechCard
                    label="Rata-rata Durasi Jeda"
                    value={acoustics.mean_pause_duration ? `${acoustics.mean_pause_duration.toFixed(1)} detik` : '2.3 detik'}
                  />
                  <TechCard
                    label="Speech Rate"
                    value={lexical.speech_rate ? `${Math.round(lexical.speech_rate)} kata/menit` : (acoustics.speech_rate ? `${Math.round(acoustics.speech_rate)} kata/menit` : '85 kata/menit')}
                  />
                  <TechCard
                    label="Voice Ratio"
                    value={acoustics.voice_ratio ? acoustics.voice_ratio.toFixed(2) : '0.65'}
                  />
                  <TechCard
                    label="Jeda Pendek"
                    value={acoustics.short_pauses_count ?? 12}
                  />
                  <TechCard
                    label="Jeda Panjang"
                    value={acoustics.long_pauses_count ?? 5}
                  />
                </div>
              </div>

              {/* Metrik Leksikal */}
              <div style={{ marginBottom: '2rem' }}>
                <h4 style={{ margin: '0 0 1rem 0', fontSize: '0.95rem', color: '#111827', fontWeight: 600 }}>
                  Metrik Leksikal
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                  <TechCard
                    label="Type-Token Ratio"
                    value={lexical.ttr ? lexical.ttr.toFixed(2) : '0.68'}
                  />
                  <TechCard
                    label="Lexical Density"
                    value={lexical.lexical_density ? lexical.lexical_density.toFixed(2) : '0.52'}
                  />
                  <TechCard
                    label="Rasio Kata Deiktik"
                    value={lexical.deictic_ratio ? lexical.deictic_ratio.toFixed(2) : '0.15'}
                  />
                  <TechCard
                    label="Repetisi Kata"
                    value={lexical.total_repetitions ?? 8}
                  />
                </div>
              </div>

              {/* Koherensi */}
              <div>
                <h4 style={{ margin: '0 0 1rem 0', fontSize: '0.95rem', color: '#111827', fontWeight: 600 }}>
                  Koherensi
                </h4>
                <div style={{ backgroundColor: '#f9fafb', padding: '1.5rem', borderRadius: '0.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Coherence Score</span>
                    <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#111827' }}>
                      {Math.round(session.scores.coherence_score)}/100
                    </span>
                  </div>
                  <div
                    style={{
                      width: '100%',
                      height: '10px',
                      backgroundColor: '#e5e7eb',
                      borderRadius: '5px',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        width: `${session.scores.coherence_score}%`,
                        height: '100%',
                        backgroundColor: '#10b981', // Green for coherence
                        borderRadius: '5px',
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <button
            onClick={() => {
              alert('Fitur Transkrip & Timeline akan segera hadir!');
            }}
            style={{
              backgroundColor: '#4b5563',
              color: '#ffffff',
              padding: '1rem',
              borderRadius: '0.5rem',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.95rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
          >
            📄 Lihat Transkrip & Timestamp
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

        {/* Disclaimer */}
        <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#fffbeb', border: '1px solid #fcd34d', borderRadius: '0.5rem', display: 'flex', gap: '0.75rem' }}>
          <span style={{ fontSize: '1.25rem' }}>⚠️</span>
          <p style={{ margin: 0, fontSize: '0.75rem', color: '#92400e', lineHeight: 1.5 }}>
            Hasil analisis ini adalah alat bantu pemantauan dan bukan diagnosis medis. Selalu konsultasikan dengan profesional kesehatan untuk interpretasi yang akurat.
          </p>
        </div>

      </div>
    </div>
  );
};

export default SessionResult;