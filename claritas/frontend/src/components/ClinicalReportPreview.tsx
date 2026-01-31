import React from 'react';
import { MdPrint, MdDownload } from 'react-icons/md';

const ClinicalReportPreview: React.FC = () => {
    const handlePrint = () => {
        window.print();
    };

    const handleDownload = () => {
        // TODO: Implement PDF generation
        alert('Fitur Download PDF akan segera hadir!');
    };

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
                            Tanggal Laporan: <span style={{ fontWeight: 400 }}>8 Januari 2026</span>
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
                        <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>Periode Asesmen</div>
                        <div style={{ fontSize: '0.95rem', color: '#111827', fontWeight: 600 }}>7 Bulan Terakhir</div>
                    </div>
                    <div>
                        <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>Total Sesi</div>
                        <div style={{ fontSize: '0.95rem', color: '#111827', fontWeight: 600 }}>24 Sesi</div>
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
                    73<span style={{ fontSize: '2rem', color: '#6b7280' }}>/100</span>
                </div>
                <div style={{ fontSize: '0.95rem', color: '#1e3a8a', fontWeight: 600, marginTop: '0.5rem' }}>
                    Good Progress - Above Average
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
                            <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>+8%</div>
                        </div>
                        <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#111827', marginBottom: '0.5rem' }}>64</div>
                        <div
                            style={{
                                width: '100%',
                                height: '6px',
                                backgroundColor: '#e5e7eb',
                                borderRadius: '3px',
                                overflow: 'hidden',
                                marginBottom: '0.75rem',
                            }}
                        >
                            <div style={{ width: '64%', height: '100%', backgroundColor: '#f59e0b', borderRadius: '3px' }} />
                        </div>
                        <div
                            style={{
                                fontSize: '0.75rem',
                                color: '#ffffff',
                                backgroundColor: '#f59e0b',
                                padding: '0.25rem 0.5rem',
                                borderRadius: '0.25rem',
                                display: 'inline-block',
                                marginBottom: '0.5rem',
                            }}
                        >
                            Medium Risk
                        </div>
                        <p style={{ margin: 0, fontSize: '0.75rem', color: '#6b7280', lineHeight: 1.5 }}>
                            Pasien menunjukkan tempo bicara yang cukup baik dengan beberapa jeda pendek yang menandakan proses berpikir.
                        </p>
                    </div>

                    {/* Lexical */}
                    <div style={{ border: '1px solid #e5e7eb', borderRadius: '0.5rem', padding: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                            <div style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: 600 }}>Lexical</div>
                            <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>+9%</div>
                        </div>
                        <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#111827', marginBottom: '0.5rem' }}>91</div>
                        <div
                            style={{
                                width: '100%',
                                height: '6px',
                                backgroundColor: '#e5e7eb',
                                borderRadius: '3px',
                                overflow: 'hidden',
                                marginBottom: '0.75rem',
                            }}
                        >
                            <div style={{ width: '91%', height: '100%', backgroundColor: '#10b981', borderRadius: '3px' }} />
                        </div>
                        <div
                            style={{
                                fontSize: '0.75rem',
                                color: '#ffffff',
                                backgroundColor: '#10b981',
                                padding: '0.25rem 0.5rem',
                                borderRadius: '0.25rem',
                                display: 'inline-block',
                                marginBottom: '0.5rem',
                            }}
                        >
                            Low Risk
                        </div>
                        <p style={{ margin: 0, fontSize: '0.75rem', color: '#6b7280', lineHeight: 1.5 }}>
                            Kosakata yang digunakan sangat baik dan bervariasi, menunjukkan kemampuan verbal yang kuat.
                        </p>
                    </div>

                    {/* Coherence */}
                    <div style={{ border: '1px solid #e5e7eb', borderRadius: '0.5rem', padding: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                            <div style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: 600 }}>Coherence</div>
                            <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>+6%</div>
                        </div>
                        <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#111827', marginBottom: '0.5rem' }}>60</div>
                        <div
                            style={{
                                width: '100%',
                                height: '6px',
                                backgroundColor: '#e5e7eb',
                                borderRadius: '3px',
                                overflow: 'hidden',
                                marginBottom: '0.75rem',
                            }}
                        >
                            <div style={{ width: '60%', height: '100%', backgroundColor: '#ef4444', borderRadius: '3px' }} />
                        </div>
                        <div
                            style={{
                                fontSize: '0.75rem',
                                color: '#ffffff',
                                backgroundColor: '#ef4444',
                                padding: '0.25rem 0.5rem',
                                borderRadius: '0.25rem',
                                display: 'inline-block',
                                marginBottom: '0.5rem',
                            }}
                        >
                            High Risk
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
                    }}
                >
                    <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                        [Chart placeholder - Trend line showing monthly progress]
                    </div>
                    <div style={{ marginTop: '1rem', fontSize: '0.75rem', color: '#6b7280' }}>
                        Progress menunjukkan peningkatan bertahap dalam 3 bulan terakhir
                    </div>
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
                            <th style={{ padding: '0.75rem', textAlign: 'center', fontWeight: 600, color: '#6b7280' }}>Skor</th>
                            <th style={{ padding: '0.75rem', textAlign: 'center', fontWeight: 600, color: '#6b7280' }}>Akurasi</th>
                            <th style={{ padding: '0.75rem', textAlign: 'center', fontWeight: 600, color: '#6b7280' }}>Durasi</th>
                            <th style={{ padding: '0.75rem', textAlign: 'center', fontWeight: 600, color: '#6b7280' }}>Status rata-rata respons</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                            <td style={{ padding: '0.75rem' }}>2025-01-28</td>
                            <td style={{ padding: '0.75rem', textAlign: 'center', color: '#2563eb', fontWeight: 600 }}>75</td>
                            <td style={{ padding: '0.75rem', textAlign: 'center' }}>85%</td>
                            <td style={{ padding: '0.75rem', textAlign: 'center' }}>9:32</td>
                            <td style={{ padding: '0.75rem', textAlign: 'center' }}>3.2s</td>
                        </tr>
                        <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                            <td style={{ padding: '0.75rem' }}>2025-01-21</td>
                            <td style={{ padding: '0.75rem', textAlign: 'center', color: '#2563eb', fontWeight: 600 }}>72</td>
                            <td style={{ padding: '0.75rem', textAlign: 'center' }}>78%</td>
                            <td style={{ padding: '0.75rem', textAlign: 'center' }}>9:15</td>
                            <td style={{ padding: '0.75rem', textAlign: 'center' }}>3.1s</td>
                        </tr>
                        <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                            <td style={{ padding: '0.75rem' }}>2025-12-15</td>
                            <td style={{ padding: '0.75rem', textAlign: 'center', color: '#2563eb', fontWeight: 600 }}>78</td>
                            <td style={{ padding: '0.75rem', textAlign: 'center' }}>78%</td>
                            <td style={{ padding: '0.75rem', textAlign: 'center' }}>8:45</td>
                            <td style={{ padding: '0.75rem', textAlign: 'center' }}>3.1s</td>
                        </tr>
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
                        Nilai kognitif 73/100 menunjukkan risiko sedang. Jadwalkan konsultasi neurologis dalam 3 bulan untuk
                        evaluasi mendalam.
                    </li>
                    <li>
                        Caregiver disarankan untuk mencatat perubahan perilaku harian dan melaporkan ke klinisi pada kunjungan
                        berikutnya.
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
