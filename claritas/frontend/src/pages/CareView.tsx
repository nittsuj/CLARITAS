import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdTrendingUp, MdTrendingDown, MdRemove, MdDownload } from 'react-icons/md';
import AuthenticatedNav from '../components/AuthenticatedNav';
import {
    getSessions,
    calculateOverallScore,
    getLatestScores,
    getTrendData,
    getScoreTrend,
    type SessionResult,
} from '../utils/sessions';

const CareView: React.FC = () => {
    const navigate = useNavigate();
    const [sessions, setSessions] = useState<SessionResult[]>([]);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        // Check authentication
        const storedUser = localStorage.getItem('claritas_current_user');
        if (!storedUser) {
            navigate('/');
            return;
        }
        setUser(JSON.parse(storedUser));

        // Load sessions
        const loadedSessions = getSessions();
        setSessions(loadedSessions);
    }, [navigate]);

    const overallScore = calculateOverallScore(sessions);
    const latestScores = getLatestScores(sessions);
    const trendData = getTrendData(sessions);

    const getScoreColor = (score: number): string => {
        if (score >= 80) return '#10b981'; // Green
        if (score >= 60) return '#f59e0b'; // Yellow
        return '#ef4444'; // Red
    };

    const getRiskBandColor = (band: string): string => {
        if (band === 'Baik') return '#10b981';
        if (band === 'Sedang') return '#f59e0b';
        return '#ef4444';
    };

    const TrendIcon = ({ metric }: { metric: 'speech_fluency' | 'lexical_score' | 'coherence_score' }) => {
        const trend = getScoreTrend(sessions, metric);
        if (trend === 'up') return <MdTrendingUp style={{ color: '#10b981', fontSize: '1.2rem' }} />;
        if (trend === 'down') return <MdTrendingDown style={{ color: '#ef4444', fontSize: '1.2rem' }} />;
        return <MdRemove style={{ color: '#6b7280', fontSize: '1.2rem' }} />;
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
            <AuthenticatedNav />

            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
                {/* Header */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '2rem'
                }}>
                    <div>
                        <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                            Caregiver: {user?.name || 'Pasien'}
                        </div>
                        <h1 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#111827', margin: 0 }}>
                            Budi Santoso
                        </h1>
                        <div style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>
                            ID Pasien: <span style={{ fontWeight: 500, color: '#374151' }}>P-2025-1285</span>
                        </div>
                    </div>

                    <button
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            backgroundColor: '#2563eb',
                            color: '#ffffff',
                            padding: '0.75rem 1.5rem',
                            borderRadius: '0.5rem',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '0.95rem',
                            fontWeight: 600,
                        }}
                    >
                        <MdDownload style={{ fontSize: '1.2rem' }} />
                        Download Laporan Klinik
                    </button>
                </div>

                {/* Overall Score Card */}
                <div style={{
                    backgroundColor: '#2563eb',
                    borderRadius: '1rem',
                    padding: '2rem',
                    marginBottom: '2rem',
                    color: '#ffffff',
                }}>
                    <div style={{ fontSize: '0.95rem', marginBottom: '0.5rem', opacity: 0.9 }}>
                        Overall Cognitive Health Score
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '1rem' }}>
                        <span style={{ fontSize: '3rem', fontWeight: 700 }}>{overallScore}</span>
                        <span style={{ fontSize: '1.5rem', opacity: 0.8 }}>/100</span>
                    </div>
                    <div style={{
                        width: '100%',
                        height: '12px',
                        backgroundColor: 'rgba(255, 255, 255, 0.3)',
                        borderRadius: '6px',
                        overflow: 'hidden',
                    }}>
                        <div style={{
                            width: `${overallScore}%`,
                            height: '100%',
                            backgroundColor: '#ffffff',
                            borderRadius: '6px',
                            transition: 'width 0.3s ease',
                        }} />
                    </div>
                </div>

                {/* Metric Cards */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '1.5rem',
                    marginBottom: '2rem'
                }}>
                    {/* Speech Fluency */}
                    <div style={{
                        backgroundColor: '#ffffff',
                        borderRadius: '0.75rem',
                        padding: '1.5rem',
                        border: '1px solid #e5e7eb',
                    }}>
                        <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                            Speech Fluency
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                            <span style={{ fontSize: '2rem', fontWeight: 700, color: '#111827' }}>
                                {Math.round(latestScores.speech_fluency)}
                            </span>
                            <TrendIcon metric="speech_fluency" />
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                            +5 vs yesterday
                        </div>
                        <div style={{
                            width: '100%',
                            height: '6px',
                            backgroundColor: '#f3f4f6',
                            borderRadius: '3px',
                            overflow: 'hidden',
                        }}>
                            <div style={{
                                width: `${latestScores.speech_fluency}%`,
                                height: '100%',
                                backgroundColor: getScoreColor(latestScores.speech_fluency),
                                borderRadius: '3px',
                            }} />
                        </div>
                        <div style={{
                            fontSize: '0.75rem',
                            color: '#6b7280',
                            marginTop: '0.5rem',
                            textAlign: 'right'
                        }}>
                            {Math.round(latestScores.speech_fluency)}
                        </div>
                    </div>

                    {/* Lexical Score */}
                    <div style={{
                        backgroundColor: '#ffffff',
                        borderRadius: '0.75rem',
                        padding: '1.5rem',
                        border: '1px solid #e5e7eb',
                    }}>
                        <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                            Lexical Score
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                            <span style={{ fontSize: '2rem', fontWeight: 700, color: '#111827' }}>
                                {Math.round(latestScores.lexical_score)}
                            </span>
                            <TrendIcon metric="lexical_score" />
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                            +3 vs yesterday
                        </div>
                        <div style={{
                            width: '100%',
                            height: '6px',
                            backgroundColor: '#f3f4f6',
                            borderRadius: '3px',
                            overflow: 'hidden',
                        }}>
                            <div style={{
                                width: `${latestScores.lexical_score}%`,
                                height: '100%',
                                backgroundColor: getScoreColor(latestScores.lexical_score),
                                borderRadius: '3px',
                            }} />
                        </div>
                        <div style={{
                            fontSize: '0.75rem',
                            color: '#6b7280',
                            marginTop: '0.5rem',
                            textAlign: 'right'
                        }}>
                            {Math.round(latestScores.lexical_score)}
                        </div>
                    </div>

                    {/* Coherence Score */}
                    <div style={{
                        backgroundColor: '#ffffff',
                        borderRadius: '0.75rem',
                        padding: '1.5rem',
                        border: '1px solid #e5e7eb',
                    }}>
                        <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                            Coherence Score
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                            <span style={{ fontSize: '2rem', fontWeight: 700, color: '#111827' }}>
                                {Math.round(latestScores.coherence_score)}
                            </span>
                            <TrendIcon metric="coherence_score" />
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                            -3 vs yesterday
                        </div>
                        <div style={{
                            width: '100%',
                            height: '6px',
                            backgroundColor: '#f3f4f6',
                            borderRadius: '3px',
                            overflow: 'hidden',
                        }}>
                            <div style={{
                                width: `${latestScores.coherence_score}%`,
                                height: '100%',
                                backgroundColor: getScoreColor(latestScores.coherence_score),
                                borderRadius: '3px',
                            }} />
                        </div>
                        <div style={{
                            fontSize: '0.75rem',
                            color: '#6b7280',
                            marginTop: '0.5rem',
                            textAlign: 'right'
                        }}>
                            {Math.round(latestScores.coherence_score)}
                        </div>
                    </div>
                </div>

                {/* Trend Chart Placeholder */}
                <div style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '0.75rem',
                    padding: '1.5rem',
                    border: '1px solid #e5e7eb',
                    marginBottom: '2rem',
                }}>
                    <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#111827', marginBottom: '1rem' }}>
                        Trend
                    </h2>
                    <div style={{
                        height: '300px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#6b7280',
                        backgroundColor: '#f9fafb',
                        borderRadius: '0.5rem',
                    }}>
                        Chart will be rendered here (using Chart.js)
                    </div>
                </div>

                {/* Session History Table */}
                <div style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '0.75rem',
                    border: '1px solid #e5e7eb',
                    overflow: 'hidden',
                }}>
                    <div style={{ padding: '1.5rem', borderBottom: '1px solid #e5e7eb' }}>
                        <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#111827', margin: 0 }}>
                            Session History
                        </h2>
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ backgroundColor: '#f9fafb' }}>
                                    <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>Tanggal</th>
                                    <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>Jenis Tugas</th>
                                    <th style={{ padding: '0.75rem 1rem', textAlign: 'center', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>Fluency</th>
                                    <th style={{ padding: '0.75rem 1rem', textAlign: 'center', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>Lexical</th>
                                    <th style={{ padding: '0.75rem 1rem', textAlign: 'center', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>Coherence</th>
                                    <th style={{ padding: '0.75rem 1rem', textAlign: 'center', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>Risk Band</th>
                                    <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>Catatan</th>
                                    <th style={{ padding: '0.75rem 1rem', textAlign: 'center', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sessions.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} style={{ padding: '3rem', textAlign: 'center', color: '#6b7280' }}>
                                            Belum ada sesi rekaman. Mulai sesi pertama di CogniView!
                                        </td>
                                    </tr>
                                ) : (
                                    sessions.slice().reverse().map((session) => (
                                        <tr key={session.id} style={{ borderTop: '1px solid #e5e7eb' }}>
                                            <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#374151' }}>
                                                {new Date(session.date).toLocaleDateString('id-ID', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric',
                                                })}
                                            </td>
                                            <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#374151' }}>
                                                {session.taskType === 'deskripsi-gambar' ? 'Deskripsi gambar' : 'Membaca kalimat'}
                                            </td>
                                            <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#374151', textAlign: 'center', fontWeight: 600 }}>
                                                {Math.round(session.scores.speech_fluency)}
                                            </td>
                                            <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#374151', textAlign: 'center', fontWeight: 600 }}>
                                                {Math.round(session.scores.lexical_score)}
                                            </td>
                                            <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#374151', textAlign: 'center', fontWeight: 600 }}>
                                                {Math.round(session.scores.coherence_score)}
                                            </td>
                                            <td style={{ padding: '1rem', textAlign: 'center' }}>
                                                <span style={{
                                                    display: 'inline-block',
                                                    padding: '0.25rem 0.75rem',
                                                    borderRadius: '9999px',
                                                    fontSize: '0.75rem',
                                                    fontWeight: 600,
                                                    backgroundColor: `${getRiskBandColor(session.risk_band)}20`,
                                                    color: getRiskBandColor(session.risk_band),
                                                }}>
                                                    {session.risk_band}
                                                </span>
                                            </td>
                                            <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#6b7280', maxWidth: '200px' }}>
                                                {session.summary.substring(0, 50)}...
                                            </td>
                                            <td style={{ padding: '1rem', textAlign: 'center' }}>
                                                <button
                                                    style={{
                                                        backgroundColor: '#2563eb',
                                                        color: '#ffffff',
                                                        padding: '0.5rem 1rem',
                                                        borderRadius: '0.375rem',
                                                        border: 'none',
                                                        cursor: 'pointer',
                                                        fontSize: '0.875rem',
                                                        fontWeight: 600,
                                                    }}
                                                    onClick={() => {
                                                        // TODO: Navigate to detail page
                                                        alert(`Detail untuk session ${session.id}`);
                                                    }}
                                                >
                                                    Lihat Detail
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CareView;
