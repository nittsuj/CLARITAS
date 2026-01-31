import React, { useEffect, useState } from 'react';
import { MdPrint, MdDownload } from 'react-icons/md';
import { getSessions, calculateOverallScore, getLatestScores, type SessionResult } from '../utils/sessions';
import TrendChart from './TrendChart';

const ClinicalReportPreview: React.FC = () => {
    const [sessions, setSessions] = useState<SessionResult[]>([]);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        setSessions(getSessions());
        const storedUser = localStorage.getItem('claritas_current_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const handlePrint = () => {
        window.print();
    };

    const handleDownload = () => {
        alert('Fitur Download PDF akan segera hadir!');
    };

    // Calculate metrics
    const overallScore = calculateOverallScore(sessions);
    const latestScores = getLatestScores(sessions);

    // Calculate trends (vs previous session)
    const getPercentageChange = (metric: 'speech_fluency' | 'lexical_score' | 'coherence_score') => {
        if (sessions.length < 2) return 0;
        const current = sessions[sessions.length - 1].scores[metric];
        const previous = sessions[sessions.length - 2].scores[metric];
        return Math.round(((current - previous) / previous) * 100);
    };

    const fluencyChange = getPercentageChange('speech_fluency');
    const lexicalChange = getPercentageChange('lexical_score');
    const coherenceChange = getPercentageChange('coherence_score');

    const getRiskLabel = (score: number) => {
        if (score >= 80) return { label: 'Low Risk', color: '#10b981' }; // Green
        if (score >= 60) return { label: 'Medium Risk', color: '#f59e0b' }; // Orange
        return { label: 'High Risk', color: '#ef4444' }; // Red
    };

    // Format Date
    const today = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

    // Trend Data for Chart
    const trendData = sessions.map(s => ({
        date: new Date(s.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
        score: Math.round((s.scores.speech_fluency + s.scores.lexical_score + s.scores.coherence_score) / 3)
    }));

    // Empty state if no sessions
    if (sessions.length === 0) {
        return (
            <div style={{ maxWidth: '900px', margin: '0 auto', padding: '4rem 2rem', textAlign: 'center' }}>
                <h2 style={{ color: '#6b7280' }}>Belum ada data laporan tersedia.</h2>
                <p>Silakan lakukan asesmen di CogniView untuk menghasilkan laporan klinis.</p>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem', backgroundColor: '#ffffff' }}>
            {/* Header */}
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '2rem',
                    paddingBottom: '1rem',
                    borderBottom: '2px solid #e5e7eb',
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div
                        style={{
                            width: '40px',
                            height: '40px',
                            backgroundColor: '#2563eb',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#ffffff',
                            fontWeight: 700,
                            fontSize: '1.2rem',
                        }}
                    >
                        C
                    </div>
                    <div>
                        <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                            Cognitive Insight Audio Recognition and Identification Technology for Alzheimer Support
                        </div>
                        <div style={{ fontSize: '0.875rem', color: '#111827', fontWeight: 600, marginTop: '0.25rem' }}>
                            Tanggal Laporan: <span style={{ fontWeight: 400 }}>{today}</span>
                        </div>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button
                        onClick={handlePrint}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            backgroundColor: '#6b7280',
                            color: '#ffffff',
                            padding: '0.5rem 1rem',
                            borderRadius: '0.375rem',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '0.875rem',
                            fontWeight: 600,
                        }}
                    >
                        <MdPrint size={18} />
                        Print
                    </button>
                    <button
                        onClick={handleDownload}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            backgroundColor: '#2563eb',
                            color: '#ffffff',
                            padding: '0.5rem 1rem',
                            borderRadius: '0.375rem',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '0.875rem',
                            fontWeight: 600,
                        }}
                    >
                        <MdDownload size={18} />
                        Download PDF
                    </button>
                </div>
            </div>

            {/* Title */}
            <h1
                style={{
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    color: '#2563eb',
                    textAlign: 'center',
                    marginBottom: '2rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                }}
            >
                LAPORAN ASESMEN KOGNITIF PASIEN
            </h1>

            {/* Informasi Pasien */}
            <div
                style={{
                    backgroundColor: '#f9fafb',
                    padding: '1.5rem',
                    borderRadius: '0.5rem',
                    marginBottom: '2rem',
                    border: '1px solid #e5e7eb',
                }}
            >
                <h2 style={{ margin: '0 0 1rem 0', fontSize: '1rem', fontWeight: 700, color: '#111827' }}>
                    INFORMASI PASIEN
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                        <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>Nama Pasien</div>
                        <div style={{ fontSize: '0.95rem', color: '#111827', fontWeight: 600 }}>Budi Santoso</div>
                    </div>
                    <div>
                        <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>Umur</div>
                        <div style={{ fontSize: '0.95rem', color: '#111827', fontWeight: 600 }}>68 years</div>
                    </div>
                    <div>
                        <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>Caregiver</div>
                        <div style={{ fontSize: '0.95rem', color: '#111827', fontWeight: 600 }}>{user?.name || '-'}</div>
                    </div>
                    <div>
                        <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>Total Sesi</div>
                        <div style={{ fontSize: '0.95rem', color: '#111827', fontWeight: 600 }}>{sessions.length} Sesi</div>
                    </div>
                </div>
            </div>

            {/* Nilai Kognitif Keseluruhan */}
            <div
                style={{
                    backgroundColor: '#dbeafe',
                    padding: '2rem',
                    borderRadius: '0.5rem',
                    marginBottom: '2rem',
                    textAlign: 'center',
                }}
            >
                <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem', fontWeight: 700, color: '#1e40af' }}>
                    NILAI KOGNITIF KESELURUHAN
                </h2>
                <div style={{ fontSize: '4rem', fontWeight: 700, color: '#2563eb', lineHeight: 1 }}>
                    {overallScore}<span style={{ fontSize: '2rem', color: '#6b7280' }}>/100</span>
                </div>
                <div style={{ fontSize: '0.95rem', color: '#1e3a8a', fontWeight: 600, marginTop: '0.5rem' }}>
                    {overallScore >= 80 ? 'Good Progress - Stable Condition' : (overallScore >= 60 ? 'Moderate Condition - Needs Attention' : 'Critical Condition - Requires Medical Consultation')}
                </div>
            </div>

            {/* Matriks Utama Kognitif */}
            <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ margin: '0 0 1rem 0', fontSize: '1rem', fontWeight: 700, color: '#111827' }}>
                    MATRIKS UTAMA KOGNITIF
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                    {/* Speech Fluency */}
                    <div style={{ border: '1px solid #e5e7eb', borderRadius: '0.5rem', padding: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                            <div style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: 600 }}>Speech Fluency</div>
                            <div style={{ fontSize: '0.75rem', color: fluencyChange >= 0 ? '#10b981' : '#ef4444', fontWeight: 600 }}>
                                {fluencyChange > 0 ? '+' : ''}{fluencyChange}%
                            </div>
                        </div>
                        <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#111827', marginBottom: '0.5rem' }}>
                            {Math.round(latestScores.speech_fluency)}
                        </div>
                        <div style={{ width: '100%', height: '6px', backgroundColor: '#e5e7eb', borderRadius: '3px', overflow: 'hidden', marginBottom: '0.75rem' }}>
                            <div style={{ width: `${latestScores.speech_fluency}%`, height: '100%', backgroundColor: getRiskLabel(latestScores.speech_fluency).color, borderRadius: '3px' }} />
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#ffffff', backgroundColor: getRiskLabel(latestScores.speech_fluency).color, padding: '0.25rem 0.5rem', borderRadius: '0.25rem', display: 'inline-block', marginBottom: '0.5rem' }}>
                            {getRiskLabel(latestScores.speech_fluency).label}
                        </div>
                        <p style={{ margin: 0, fontSize: '0.75rem', color: '#6b7280', lineHeight: 1.5 }}>
                            Pasien menunjukkan tempo bicara yang cukup baik dengan beberapa jeda pendek yang menandakan proses berpikir.
                        </p>
                    </div>

                    {/* Lexical */}
                    <div style={{ border: '1px solid #e5e7eb', borderRadius: '0.5rem', padding: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                            <div style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: 600 }}>Lexical</div>
                            <div style={{ fontSize: '0.75rem', color: lexicalChange >= 0 ? '#10b981' : '#ef4444', fontWeight: 600 }}>
                                {lexicalChange > 0 ? '+' : ''}{lexicalChange}%
                            </div>
                        </div>
                        <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#111827', marginBottom: '0.5rem' }}>
                            {Math.round(latestScores.lexical_score)}
                        </div>
                        <div style={{ width: '100%', height: '6px', backgroundColor: '#e5e7eb', borderRadius: '3px', overflow: 'hidden', marginBottom: '0.75rem' }}>
                            <div style={{ width: `${latestScores.lexical_score}%`, height: '100%', backgroundColor: getRiskLabel(latestScores.lexical_score).color, borderRadius: '3px' }} />
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#ffffff', backgroundColor: getRiskLabel(latestScores.lexical_score).color, padding: '0.25rem 0.5rem', borderRadius: '0.25rem', display: 'inline-block', marginBottom: '0.5rem' }}>
                            {getRiskLabel(latestScores.lexical_score).label}
                        </div>
                        <p style={{ margin: 0, fontSize: '0.75rem', color: '#6b7280', lineHeight: 1.5 }}>
                            Kosakata yang digunakan sangat baik dan bervariasi, menunjukkan kemampuan verbal yang kuat.
                        </p>
                    </div>

                    {/* Coherence */}
                    <div style={{ border: '1px solid #e5e7eb', borderRadius: '0.5rem', padding: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                            <div style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: 600 }}>Coherence</div>
                            <div style={{ fontSize: '0.75rem', color: coherenceChange >= 0 ? '#10b981' : '#ef4444', fontWeight: 600 }}>
                                {coherenceChange > 0 ? '+' : ''}{coherenceChange}%
                            </div>
                        </div>
                        <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#111827', marginBottom: '0.5rem' }}>
                            {Math.round(latestScores.coherence_score)}
                        </div>
                        <div style={{ width: '100%', height: '6px', backgroundColor: '#e5e7eb', borderRadius: '3px', overflow: 'hidden', marginBottom: '0.75rem' }}>
                            <div style={{ width: `${latestScores.coherence_score}%`, height: '100%', backgroundColor: getRiskLabel(latestScores.coherence_score).color, borderRadius: '3px' }} />
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#ffffff', backgroundColor: getRiskLabel(latestScores.coherence_score).color, padding: '0.25rem 0.5rem', borderRadius: '0.25rem', display: 'inline-block', marginBottom: '0.5rem' }}>
                            {getRiskLabel(latestScores.coherence_score).label}
                        </div>
                        <p style={{ margin: 0, fontSize: '0.75rem', color: '#6b7280', lineHeight: 1.5 }}>
                            Ada beberapa kesulitan dalam menjaga koherensi cerita, namun masih dapat dipahami secara keseluruhan.
                        </p>
                    </div>
                </div>
            </div>

            {/* Ringkasan Progress Bulanan */}
            <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ margin: '0 0 1rem 0', fontSize: '1rem', fontWeight: 700, color: '#111827' }}>
                    RINGKASAN PROGRESS BULANAN
                </h2>
                <div
                    style={{
                        border: '1px solid #e5e7eb',
                        borderRadius: '0.5rem',
                        padding: '1.5rem',
                        backgroundColor: '#f9fafb',
                        textAlign: 'center',
                        height: '300px'
                    }}
                >
                    <TrendChart dates={trendData.map(t => t.date)} scores={trendData.map(t => t.score)} label="Monthly Cognitive Score" />
                </div>
            </div>

            {/* Recent Session History */}
            <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ margin: '0 0 1rem 0', fontSize: '1rem', fontWeight: 700, color: '#111827' }}>
                    RECENT SESSION HISTORY
                </h2>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
                            <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 600, color: '#6b7280' }}>Tanggal</th>
                            <th style={{ padding: '0.75rem', textAlign: 'center', fontWeight: 600, color: '#6b7280' }}>Avg Score</th>
                            <th style={{ padding: '0.75rem', textAlign: 'center', fontWeight: 600, color: '#6b7280' }}>Fluency</th>
                            <th style={{ padding: '0.75rem', textAlign: 'center', fontWeight: 600, color: '#6b7280' }}>Lexical</th>
                            <th style={{ padding: '0.75rem', textAlign: 'center', fontWeight: 600, color: '#6b7280' }}>Coherence</th>
                            <th style={{ padding: '0.75rem', textAlign: 'center', fontWeight: 600, color: '#6b7280' }}>Risk Band</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sessions.slice().reverse().slice(0, 5).map((session, index) => {
                            const avg = Math.round((session.scores.speech_fluency + session.scores.lexical_score + session.scores.coherence_score) / 3);
                            return (
                                <tr key={session.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                    <td style={{ padding: '0.75rem' }}>{new Date(session.date).toLocaleDateString('id-ID')}</td>
                                    <td style={{ padding: '0.75rem', textAlign: 'center', color: '#2563eb', fontWeight: 600 }}>{avg}</td>
                                    <td style={{ padding: '0.75rem', textAlign: 'center' }}>{Math.round(session.scores.speech_fluency)}</td>
                                    <td style={{ padding: '0.75rem', textAlign: 'center' }}>{Math.round(session.scores.lexical_score)}</td>
                                    <td style={{ padding: '0.75rem', textAlign: 'center' }}>{Math.round(session.scores.coherence_score)}</td>
                                    <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                                        <span style={{
                                            padding: '0.25rem 0.5rem',
                                            borderRadius: '9999px',
                                            fontSize: '0.75rem',
                                            backgroundColor: getRiskLabel(avg).color + '20',
                                            color: getRiskLabel(avg).color
                                        }}>
                                            {session.risk_band}
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Rekomendasi Klinik */}
            <div
                style={{
                    backgroundColor: '#fef3c7',
                    padding: '1.5rem',
                    borderRadius: '0.5rem',
                    border: '1px solid #fbbf24',
                }}
            >
                <h2 style={{ margin: '0 0 1rem 0', fontSize: '1rem', fontWeight: 700, color: '#92400e' }}>
                    REKOMENDASI KLINIK
                </h2>
                <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#78350f', lineHeight: 1.8 }}>
                    <li>
                        Sedikit penurunan kemampuan mengingat (↓3 poin). Pertimbangkan untuk meningkatkan aktivitas stimulasi
                        kognitif harian seperti teka-teki dan permainan memori.
                    </li>
                    <li>
                        Koherensi tetap stabil dengan peningkatan ringan. Lanjutkan latihan bercerita dan diskusi terstruktur
                        untuk menjaga kemampuan ini.
                    </li>
                    <li>
                        Skor leksikal menunjukkan tren positif (+4 poin). Teruskan aktivitas membaca dan menulis untuk
                        mempertahankan kekayaan kosakata.
                    </li>
                    <li>
                        Nilai kognitif {overallScore}/100 menunjukkan {overallScore >= 80 ? 'kondisi baik' : 'risiko sedang'}. Jadwalkan konsultasi neurologis dalam 3 bulan untuk
                        evaluasi mendalam.
                    </li>
                </ul>
            </div>

            {/* Footer */}
            <div
                style={{
                    marginTop: '3rem',
                    paddingTop: '1.5rem',
                    borderTop: '2px solid #e5e7eb',
                    fontSize: '0.75rem',
                    color: '#6b7280',
                    textAlign: 'center',
                }}
            >
                <p style={{ margin: 0 }}>
                    Laporan ini dibuat secara otomatis oleh sistem Claritas dengan dukungan teknologi AI untuk identifikasi
                    Alzheimer.
                </p>
                <p style={{ margin: '0.5rem 0 0 0' }}>
                    Untuk informasi lebih lanjut, hubungi tim medis atau kunjungi{' '}
                    <a href="https://claritas.id" style={{ color: '#2563eb' }}>
                        claritas.id
                    </a>
                </p>
            </div>
        </div>
    );
};

export default ClinicalReportPreview;
