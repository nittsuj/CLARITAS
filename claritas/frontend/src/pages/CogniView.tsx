import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdImage, MdTextFields, MdTimer } from 'react-icons/md';
import LoadingCircle from '../components/LoadingCircle';
import AuthenticatedNav from '../components/AuthenticatedNav';
import { API_URL } from '../utils/config';

type Stage = 'intro' | 'setup' | 'add-content' | 'session' | 'loading';

const CogniView: React.FC = () => {
  const navigate = useNavigate();
  const [stage, setStage] = useState<Stage>('intro');
  const [taskType, setTaskType] = useState<'deskripsi' | 'kalimat' | ''>('');
  const [kalimat, setKalimat] = useState<string>('');
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [progress, setProgress] = useState(1);
  const [timer, setTimer] = useState(3);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [recording, setRecording] = useState(false);
  const audioChunks = useRef<Blob[]>([]);
  const [error, setError] = useState<string>('');

  // ✅ ADDED: Upload file state
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const sentences = kalimat ? kalimat.split('\n').filter(s => s.trim()) : ['Hari ini cerah sekali'];

  const startRecording = async () => {
    setError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunks.current = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunks.current.push(e.data);
      };
      mediaRecorder.onstop = async () => {
        const blob = new Blob(audioChunks.current, { type: 'audio/webm' });
        await sendToBackend(blob);
      };
      mediaRecorder.start();
      setRecording(true);

      // Start countdown timer
      setTimer(3);
      const interval = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      console.error(err);
      setError('Tidak dapat mengakses mikrofon. Pastikan izin diberikan.');
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  const handleNext = () => {
    if (currentSentenceIndex < sentences.length - 1) {
      setCurrentSentenceIndex(prev => prev + 1);
      setProgress(prev => prev + 1);
      setRecording(false);
    } else {
      stopRecording();
    }
  };

  const sendToBackend = async (audioBlob: Blob) => {
    setStage('loading');
    const formData = new FormData();
    formData.append('file', audioBlob, 'audio.webm');
    try {
      const response = await fetch(`${API_URL}/analyze-audio`, {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        throw new Error('Gagal menganalisis audio');
      }
      const result = await response.json();
      navigate('/result', { state: { result } });
    } catch (err) {
      console.error(err);
      setError('Terjadi kesalahan saat mengirim audio ke server.');
      setStage('session');
    }
  };

  // ✅ ADDED: Send uploaded file to backend
  const sendFileToBackend = async (file: File) => {
    setStage('loading');
    setError('');

    const formData = new FormData();
    formData.append('file', file, file.name); // must match backend param name "file"

    try {
      const response = await fetch(`${API_URL}/analyze-audio`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        let msg = `Gagal menganalisis audio (${response.status})`;
        try {
          const errJson = await response.json();
          if (errJson?.detail) msg = errJson.detail;
        } catch { }
        throw new Error(msg);
      }

      const result = await response.json();
      navigate('/result', { state: { result } });
    } catch (err: any) {
      console.error(err);
      setError(err?.message ?? 'Terjadi kesalahan saat mengirim audio ke server.');
      setStage('session');
    }
  };


  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <AuthenticatedNav />

      <main style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
        {stage === 'intro' && (
          <div>
            <div
              style={{
                backgroundColor: '#ffffff',
                padding: '2rem',
                borderRadius: '0.75rem',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                marginBottom: '2rem',
                textAlign: 'center',
              }}
            >
              <h2 style={{ margin: 0, fontSize: '1.5rem', color: '#1f2937', fontWeight: 700 }}>
                CogniView
              </h2>
              <p style={{ margin: '0.5rem 0 0 0', color: '#6b7280', fontSize: '0.95rem' }}>
                Pilih jenis tugas dan atur konten dan lakukan sesi asesmen kognitif
              </p>
            </div>

            <div
              style={{
                backgroundColor: '#eff6ff',
                padding: '1.5rem',
                borderRadius: '0.75rem',
                marginBottom: '2rem',
              }}
            >
              <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', color: '#1e40af', fontWeight: 600 }}>
                Instruksi Sesi:
              </h3>
              <ol style={{ margin: 0, paddingLeft: '1.5rem', color: '#475569', lineHeight: 1.8 }}>
                <li>Tekan tombol "Atur Sesi" untuk memilih jenis tugas dan mengatur konten</li>
                <li>Tekan tombol "Mulai Sesi" untuk memulai sesi</li>
                <li>Stimulus akan berjalan (diharapkan bisa menjawab dengan waktu dibawah 30 detik)</li>
                <li>Suara pasien akan otomatis terekam saat sesi berlangsung</li>
                <li>Tekan "Foto Berikutnya" setelah pasien menjawab</li>
              </ol>
            </div>

            <button
              onClick={() => setStage('setup')}
              style={{
                width: '100%',
                backgroundColor: '#2563eb',
                color: '#ffffff',
                padding: '1rem',
                borderRadius: '0.5rem',
                border: 'none',
                fontWeight: 600,
                fontSize: '1rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
              }}
            >
              ▶ Atur Sesi
            </button>
          </div>
        )}

        {stage === 'setup' && (
          <div>
            <div
              style={{
                backgroundColor: '#ffffff',
                padding: '2rem',
                borderRadius: '0.75rem',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                marginBottom: '2rem',
              }}
            >
              <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem', color: '#1f2937', fontWeight: 700 }}>
                CogniView - Atur Sesi
              </h2>
              <p style={{ margin: 0, color: '#6b7280', fontSize: '0.9rem' }}>
                Pilih jenis task dan atur konten untuk sesi asesmen kognitif
              </p>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', color: '#1f2937', fontWeight: 600 }}>
                1. Pilih Jenis Task
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div
                  onClick={() => setTaskType('deskripsi')}
                  style={{
                    backgroundColor: taskType === 'deskripsi' ? '#d1fae5' : '#ffffff',
                    border: taskType === 'deskripsi' ? '3px solid #10b981' : '2px solid #e5e7eb',
                    borderRadius: '0.75rem',
                    padding: '2rem',
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'all 0.2s',
                  }}
                >
                  <MdImage size={48} color={taskType === 'deskripsi' ? '#059669' : '#9ca3af'} />
                  <h4 style={{ margin: '1rem 0 0.5rem 0', color: '#1f2937', fontWeight: 600 }}>
                    Deskripsi Gambar
                  </h4>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#6b7280' }}>
                    Pasien mendeskripsikan gambar yang ditampilkan
                  </p>
                </div>

                <div
                  onClick={() => setTaskType('kalimat')}
                  style={{
                    backgroundColor: taskType === 'kalimat' ? '#d1fae5' : '#ffffff',
                    border: taskType === 'kalimat' ? '3px solid #10b981' : '2px solid #e5e7eb',
                    borderRadius: '0.75rem',
                    padding: '2rem',
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'all 0.2s',
                  }}
                >
                  <MdTextFields size={48} color={taskType === 'kalimat' ? '#059669' : '#9ca3af'} />
                  <h4 style={{ margin: '1rem 0 0.5rem 0', color: '#1f2937', fontWeight: 600 }}>
                    Baca Kalimat
                  </h4>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#6b7280' }}>
                    Pasien membaca dan mengulang kalimat
                  </p>
                </div>
              </div>
            </div>

            {taskType === 'kalimat' && (
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', color: '#1f2937', fontWeight: 600 }}>
                  2. Tambahkan Kalimat
                </h3>
                <textarea
                  value={kalimat}
                  onChange={(e) => setKalimat(e.target.value)}
                  placeholder="Masukkan kalimat untuk dibaca pasien..."
                  style={{
                    width: '100%',
                    minHeight: '120px',
                    padding: '1rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    fontSize: '0.95rem',
                    fontFamily: 'inherit',
                    resize: 'vertical',
                  }}
                />
                <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.85rem', color: '#6b7280' }}>
                  Pisahkan setiap kalimat dengan baris baru (Enter)
                </p>
              </div>
            )}

            <button
              onClick={() => {
                if (taskType === 'kalimat' && kalimat.trim()) {
                  setStage('session');
                } else if (taskType === 'deskripsi') {
                  setStage('session');
                }
              }}
              disabled={!taskType || (taskType === 'kalimat' && !kalimat.trim())}
              style={{
                width: '100%',
                backgroundColor: taskType && (taskType === 'deskripsi' || kalimat.trim()) ? '#10b981' : '#9ca3af',
                color: '#ffffff',
                padding: '1rem',
                borderRadius: '0.5rem',
                border: 'none',
                fontWeight: 600,
                fontSize: '1rem',
                cursor: taskType && (taskType === 'deskripsi' || kalimat.trim()) ? 'pointer' : 'not-allowed',
              }}
            >
              Mulai Sesi →
            </button>
          </div>
        )}

        {stage === 'session' && (
          <div>
            {/* Progress Bar */}
            <div
              style={{
                backgroundColor: '#ffffff',
                padding: '1rem 1.5rem',
                borderRadius: '0.75rem',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                marginBottom: '1.5rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div style={{ flex: 1, marginRight: '1rem' }}>
                <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.85rem', color: '#6b7280' }}>Progress</p>
                <div style={{ backgroundColor: '#e5e7eb', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                  <div
                    style={{
                      backgroundColor: '#2563eb',
                      height: '100%',
                      width: `${(progress / sentences.length) * 100}%`,
                      transition: 'width 0.3s',
                    }}
                  />
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#6b7280' }}>
                  {progress} / {sentences.length}
                </p>
              </div>
              <div
                style={{
                  marginLeft: '1.5rem',
                  backgroundColor: '#eff6ff',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <MdTimer size={24} color="#2563eb" />
                <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#2563eb' }}>{timer}s</span>
              </div>
            </div>

            {/* Sentence Display */}
            <div
              style={{
                backgroundColor: '#ffffff',
                padding: '2rem',
                borderRadius: '0.75rem',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                marginBottom: '1.5rem',
              }}
            >
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                  <MdTextFields size={24} color="#10b981" />
                  <p style={{ margin: 0, fontSize: '0.9rem', color: '#10b981', fontWeight: 600 }}>
                    Baca kalimat ini:
                  </p>
                </div>
                <div
                  style={{
                    backgroundColor: '#d1fae5',
                    border: '2px solid #10b981',
                    borderRadius: '0.75rem',
                    padding: '2rem',
                    minHeight: '100px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <p style={{ margin: 0, fontSize: '1.5rem', color: '#065f46', fontWeight: 500, lineHeight: 1.6 }}>
                    "{sentences[currentSentenceIndex]}"
                  </p>
                </div>
              </div>
            </div>

            {/* Recording Controls */}
            <div
              style={{
                backgroundColor: '#ffffff',
                padding: '1.5rem',
                borderRadius: '0.75rem',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              }}
            >
              {recording && (
                <div
                  style={{
                    backgroundColor: '#fee2e2',
                    padding: '1rem',
                    borderRadius: '0.5rem',
                    marginBottom: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                  }}
                >
                  <div
                    style={{
                      width: '12px',
                      height: '12px',
                      backgroundColor: '#ef4444',
                      borderRadius: '50%',
                      animation: 'pulse 1.5s infinite',
                    }}
                  />
                  <span style={{ color: '#991b1b', fontWeight: 600 }}>Sedang Merekam...</span>
                  <span style={{ marginLeft: 'auto', fontSize: '0.85rem', color: '#6b7280' }}>
                    Audio akan dianalisis dengan AI metrics
                  </span>
                </div>
              )}

              {error && (
                <p style={{ color: '#dc2626', marginBottom: '1rem', fontSize: '0.9rem', textAlign: 'center' }}>
                  {error}
                </p>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <button
                  onClick={recording ? stopRecording : startRecording}
                  style={{
                    backgroundColor: recording ? '#ef4444' : '#2563eb',
                    color: '#ffffff',
                    padding: '1rem',
                    borderRadius: '0.5rem',
                    border: 'none',
                    fontWeight: 600,
                    fontSize: '1rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                  }}
                >
                  {recording ? '⏹ Stop Rekam' : '🎤 Mulai Rekam'}
                </button>

                <button
                  onClick={handleNext}
                  disabled={!recording}
                  style={{
                    backgroundColor: recording ? '#10b981' : '#9ca3af',
                    color: '#ffffff',
                    padding: '1rem',
                    borderRadius: '0.5rem',
                    border: 'none',
                    fontWeight: 600,
                    fontSize: '1rem',
                    cursor: recording ? 'pointer' : 'not-allowed',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                  }}
                >
                  ✓ Selanjutnya
                </button>
              </div>

              {/* ✅ ADDED UPLOAD FEATURE */}
              <div style={{ marginTop: '1.25rem', borderTop: '1px solid #e5e7eb', paddingTop: '1.25rem' }}>
                <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.9rem', color: '#374151', fontWeight: 600 }}>
                  Atau upload file audio:
                </p>

                <input
                  type="file"
                  accept="audio/*"
                  onChange={(e) => setUploadedFile(e.target.files?.[0] ?? null)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px dashed #e5e7eb',
                    borderRadius: '0.75rem',
                    backgroundColor: '#f9fafb',
                    cursor: 'pointer',
                  }}
                />

                {uploadedFile && (
                  <div
                    style={{
                      marginTop: '0.75rem',
                      backgroundColor: '#eff6ff',
                      padding: '0.75rem 1rem',
                      borderRadius: '0.5rem',
                      color: '#1e40af',
                      fontSize: '0.85rem',
                    }}
                  >
                    <div><b>File:</b> {uploadedFile.name}</div>
                    <div><b>Ukuran:</b> {(uploadedFile.size / 1024).toFixed(1)} KB</div>
                    <div><b>Tipe:</b> {uploadedFile.type || '(unknown)'}</div>
                  </div>
                )}

                <button
                  onClick={() => uploadedFile && sendFileToBackend(uploadedFile)}
                  disabled={!uploadedFile || recording} // optional safety: avoid uploading while recording
                  style={{
                    marginTop: '0.9rem',
                    width: '100%',
                    backgroundColor: uploadedFile && !recording ? '#10b981' : '#9ca3af',
                    color: '#ffffff',
                    padding: '0.9rem',
                    borderRadius: '0.5rem',
                    border: 'none',
                    fontWeight: 600,
                    fontSize: '1rem',
                    cursor: uploadedFile && !recording ? 'pointer' : 'not-allowed',
                  }}
                >
                  ⬆ Upload & Analyze
                </button>

                {recording && (
                  <p style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#6b7280' }}>
                    Stop rekam dulu sebelum upload file.
                  </p>
                )}
              </div>

            </div>
          </div>
        )}

        {stage === 'loading' && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '60vh',
            }}
          >
            <LoadingCircle />
            <p style={{ marginTop: '1rem', color: '#4b5563' }}>Sedang menganalisis audio…</p>
          </div>
        )}
      </main>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};

export default CogniView;