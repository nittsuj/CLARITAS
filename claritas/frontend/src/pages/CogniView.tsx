import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdImage, MdTextFields, MdMic, MdStop, MdCheckCircle, MdCancel } from 'react-icons/md';
import AuthenticatedNav from '../components/AuthenticatedNav';
import { analyzeAudio, type AnalysisResult } from '../utils/api';

type Step = 'intro' | 'task-selection' | 'image-gallery' | 'sentence-input' | 'recording' | 'analyzing';
type TaskType = 'deskripsi-gambar' | 'baca-kalimat' | null;

const CogniView: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('intro');
  const [taskType, setTaskType] = useState<TaskType>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [sentences, setSentences] = useState<string>('');
  const [sentenceList, setSentenceList] = useState<string[]>([]);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);


  // Sample images
  const images = [
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
    'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=400',
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400',
    'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=400',
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400',
    'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400',
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400',
    'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=400',
    'https://images.unsplash.com/photo-1542401886-65d6c61db217?w=400',
    'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=400',
    'https://images.unsplash.com/photo-1511593358241-7eea1f3c84e5?w=400',
    'https://images.unsplash.com/photo-1542435503-956c469947f6?w=400',
  ];

  // Timer effect
  useEffect(() => {
    if (isRecording) {
      timerIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    }
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [isRecording]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleTaskSelection = (type: 'deskripsi-gambar' | 'baca-kalimat') => {
    setTaskType(type);
    if (type === 'deskripsi-gambar') {
      setStep('image-gallery');
    } else {
      setStep('sentence-input');
    }
  };

  const handleImageSelect = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const handleSentenceChange = (value: string) => {
    setSentences(value);
    const lines = value.split('\n').filter(s => s.trim());
    setSentenceList(lines);
  };

  const isSentenceValid = () => {
    const lines = sentences.split('\n').filter(s => s.trim());
    return lines.length >= 3;
  };

  const handleStartSession = () => {
    if (taskType === 'deskripsi-gambar' && selectedImage) {
      setStep('recording');
    } else if (taskType === 'baca-kalimat' && isSentenceValid()) {
      setCurrentSentenceIndex(0);
      setStep('recording');
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const preferredMimeTypes = [
        'audio/webm;codecs=opus',
        'audio/webm',
        'audio/mp4',
      ];
      const mimeType =
        preferredMimeTypes.find((t) => MediaRecorder.isTypeSupported(t)) || '';

      const mediaRecorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Tidak dapat mengakses mikrofon. Pastikan izin diberikan.');
    }
  };


  const stopRecording = () => {
    if (!mediaRecorderRef.current || !isRecording) return;

    const mr = mediaRecorderRef.current;

    // Move UI to analyzing immediately
    setIsRecording(false);
    setStep('analyzing');
    setAnalysisError(null);

    // IMPORTANT: set onstop BEFORE calling stop()
    mr.onstop = async () => {
      try {
        // stop mic tracks so mic turns off
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((t) => t.stop());
          streamRef.current = null;
        }

        const mime = mr.mimeType || 'audio/webm';
        const audioBlob = new Blob(audioChunksRef.current, { type: mime });

        console.log('Recording stopped, audio blob created:', audioBlob);

        if (audioBlob.size < 1000) {
          throw new Error('Audio terlalu kecil. Coba rekam lebih lama.');
        }

        const result = await analyzeAudio(audioBlob);
        console.log('Analysis result:', result);

        setAnalysisResult(result);

        setTimeout(() => {
          navigate('/result', { state: { result } })
        }, 300);
      } catch (error) {
        console.error('Analysis failed:', error);
        setAnalysisError(error instanceof Error ? error.message : 'Unknown error occurred');

        setTimeout(() => {
          setStep('recording');
          setAnalysisError(null);
        }, 3000);
      }
    };

    mr.stop();
  };


  const handleSelesaikan = () => {
    if (isRecording) {
      stopRecording();
    }
  };

  const handleStopRekam = () => {
    if (isRecording && mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);

    // stop mic tracks
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }

    // Reset to intro
    setStep('intro');
    setTaskType(null);
    setSelectedImage(null);
    setSentences('');
    setSentenceList([]);
    setCurrentSentenceIndex(0);
    setRecordingTime(0);
  };


  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <AuthenticatedNav />

      <main style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto', paddingTop: '5rem' }}>
        {/* Intro Screen */}
        {step === 'intro' && (
          <div>
            <div style={{
              backgroundColor: '#ffffff',
              padding: '2rem',
              borderRadius: '0.75rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              marginBottom: '2rem',
              textAlign: 'center',
            }}>
              <h2 style={{ margin: 0, fontSize: '1.5rem', color: '#1f2937', fontWeight: 700 }}>
                CogniView
              </h2>
              <p style={{ margin: '0.5rem 0 0 0', color: '#6b7280', fontSize: '0.95rem' }}>
                Atur jenis task dan atur konten untuk sesi asesmen kognitif
              </p>
            </div>

            <div style={{
              backgroundColor: '#eff6ff',
              padding: '1.5rem',
              borderRadius: '0.75rem',
              marginBottom: '2rem',
            }}>
              <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', color: '#1e40af', fontWeight: 600 }}>
                Instruksi Sesi:
              </h3>
              <ol style={{ margin: 0, paddingLeft: '1.5rem', color: '#475569', lineHeight: 1.8 }}>
                <li>Tekan tombol "Atur Sesi" untuk memilih jenis tugas dan mengatur konten</li>
                <li>Untuk Deskripsi Gambar: pilih gambar dari galeri yang disediakan</li>
                <li>Untuk Baca Kalimat: masukkan minimal 3 kalimat yang akan dibaca</li>
                <li>Tekan tombol "Mulai Sesi" untuk memulai sesi asesmen kognitif</li>
              </ol>
            </div>

            <button
              onClick={() => setStep('task-selection')}
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
              }}
            >
              ▶ Atur Sesi
            </button>
          </div>
        )}

        {/* Task Selection Screen */}
        {step === 'task-selection' && (
          <div>
            <div style={{
              backgroundColor: '#ffffff',
              padding: '2rem',
              borderRadius: '0.75rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              marginBottom: '2rem',
            }}>
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
                  onClick={() => handleTaskSelection('deskripsi-gambar')}
                  style={{
                    backgroundColor: '#ffffff',
                    border: '2px solid #e5e7eb',
                    borderRadius: '0.75rem',
                    padding: '2rem',
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#2563eb';
                    e.currentTarget.style.backgroundColor = '#eff6ff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#e5e7eb';
                    e.currentTarget.style.backgroundColor = '#ffffff';
                  }}
                >
                  <MdImage size={48} color="#2563eb" />
                  <h4 style={{ margin: '1rem 0 0.5rem 0', color: '#1f2937', fontWeight: 600 }}>
                    Deskripsi Gambar
                  </h4>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#6b7280' }}>
                    Pasien mendeskripsikan gambar yang ditampilkan
                  </p>
                </div>

                <div
                  onClick={() => handleTaskSelection('baca-kalimat')}
                  style={{
                    backgroundColor: '#ffffff',
                    border: '2px solid #e5e7eb',
                    borderRadius: '0.75rem',
                    padding: '2rem',
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#10b981';
                    e.currentTarget.style.backgroundColor = '#d1fae5';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#e5e7eb';
                    e.currentTarget.style.backgroundColor = '#ffffff';
                  }}
                >
                  <MdTextFields size={48} color="#10b981" />
                  <h4 style={{ margin: '1rem 0 0.5rem 0', color: '#1f2937', fontWeight: 600 }}>
                    Baca Kalimat
                  </h4>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#6b7280' }}>
                    Pasien membaca dan mengulang kalimat
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Image Gallery */}
        {step === 'image-gallery' && (
          <div>
            <div style={{
              backgroundColor: '#ffffff',
              padding: '2rem',
              borderRadius: '0.75rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              marginBottom: '2rem',
            }}>
              <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem', color: '#1f2937', fontWeight: 700 }}>
                CogniView - Atur Sesi
              </h2>
              <p style={{ margin: 0, color: '#6b7280', fontSize: '0.9rem' }}>
                Pilih gambar untuk sesi asesmen kognitif
              </p>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', color: '#1f2937', fontWeight: 600 }}>
                2. Pilih Gambar
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
                {images.map((img, index) => (
                  <div
                    key={index}
                    onClick={() => handleImageSelect(img)}
                    style={{
                      position: 'relative',
                      aspectRatio: '1',
                      borderRadius: '0.5rem',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      border: selectedImage === img ? '4px solid #10b981' : '2px solid #e5e7eb',
                      transition: 'all 0.2s',
                    }}
                  >
                    <img
                      src={img}
                      alt={`Gambar ${index + 1}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                    {selectedImage === img && (
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(16, 185, 129, 0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <div style={{
                          backgroundColor: '#10b981',
                          color: '#ffffff',
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1.5rem',
                          fontWeight: 'bold',
                        }}>
                          ✓
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleStartSession}
              disabled={!selectedImage}
              style={{
                width: '100%',
                backgroundColor: selectedImage ? '#2563eb' : '#9ca3af',
                color: '#ffffff',
                padding: '1rem',
                borderRadius: '0.5rem',
                border: 'none',
                fontWeight: 600,
                fontSize: '1rem',
                cursor: selectedImage ? 'pointer' : 'not-allowed',
              }}
            >
              Mulai Sesi →
            </button>
          </div>
        )}

        {/* Sentence Input */}
        {step === 'sentence-input' && (
          <div>
            <div style={{
              backgroundColor: '#ffffff',
              padding: '2rem',
              borderRadius: '0.75rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              marginBottom: '2rem',
            }}>
              <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem', color: '#1f2937', fontWeight: 700 }}>
                CogniView - Atur Sesi
              </h2>
              <p style={{ margin: 0, color: '#6b7280', fontSize: '0.9rem' }}>
                Pilih jenis task dan atur konten untuk sesi asesmen kognitif
              </p>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', color: '#1f2937', fontWeight: 600 }}>
                2. Tambahkan Konten
              </h3>

              <textarea
                value={sentences}
                onChange={(e) => handleSentenceChange(e.target.value)}
                placeholder="Masukkan kalimat untuk dibaca pasien (minimal 3 kalimat, pisahkan dengan Enter)"
                style={{
                  width: '100%',
                  minHeight: '150px',
                  padding: '1rem',
                  border: '2px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  fontSize: '0.95rem',
                  fontFamily: 'inherit',
                  resize: 'vertical',
                  marginBottom: '1rem',
                }}
              />

              <div style={{
                backgroundColor: isSentenceValid() ? '#d1fae5' : '#fee2e2',
                padding: '1rem',
                borderRadius: '0.5rem',
                marginBottom: '1rem',
              }}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: '#1f2937', fontWeight: 600 }}>
                  Validasi Konten:
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {sentenceList.length >= 3 ? (
                      <MdCheckCircle size={20} color="#10b981" />
                    ) : (
                      <MdCancel size={20} color="#ef4444" />
                    )}
                    <span style={{ fontSize: '0.85rem', color: '#374151' }}>
                      Min. 3 kalimat (saat ini: {sentenceList.length})
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {sentenceList.every(s => s.length > 0) && sentenceList.length > 0 ? (
                      <MdCheckCircle size={20} color="#10b981" />
                    ) : (
                      <MdCancel size={20} color="#ef4444" />
                    )}
                    <span style={{ fontSize: '0.85rem', color: '#374151' }}>
                      Semua kalimat tidak boleh kosong
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {isSentenceValid() ? (
                      <MdCheckCircle size={20} color="#10b981" />
                    ) : (
                      <MdCancel size={20} color="#ef4444" />
                    )}
                    <span style={{ fontSize: '0.85rem', color: '#374151' }}>
                      Siap untuk sesi
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={handleStartSession}
              disabled={!isSentenceValid()}
              style={{
                width: '100%',
                backgroundColor: isSentenceValid() ? '#2563eb' : '#9ca3af',
                color: '#ffffff',
                padding: '1rem',
                borderRadius: '0.5rem',
                border: 'none',
                fontWeight: 600,
                fontSize: '1rem',
                cursor: isSentenceValid() ? 'pointer' : 'not-allowed',
              }}
            >
              Mulai Sesi →
            </button>
          </div>
        )}

        {/* Recording Session */}
        {step === 'recording' && (
          <div>
            {/* Header with progress */}
            <div style={{
              backgroundColor: '#ffffff',
              padding: '1.5rem 2rem',
              borderRadius: '0.75rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              marginBottom: '2rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.25rem', color: '#1f2937', fontWeight: 600 }}>
                  {taskType === 'baca-kalimat'
                    ? `Baca kalimat_${currentSentenceIndex + 1}`
                    : 'Sesi_1'}
                </h2>
                {taskType === 'baca-kalimat' && (
                  <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: '#6b7280' }}>
                    {currentSentenceIndex + 1} / {sentenceList.length}
                  </p>
                )}
              </div>
              <div style={{
                backgroundColor: '#eff6ff',
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
              }}>
                <span style={{ fontSize: '1.1rem', fontWeight: 600, color: '#2563eb' }}>
                  {formatTime(recordingTime)}
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div style={{
              backgroundColor: '#ffffff',
              padding: '1rem',
              borderRadius: '0.75rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              marginBottom: '2rem',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.85rem', color: '#6b7280' }}>Progress Sesi</span>
                <span style={{ fontSize: '0.85rem', color: '#6b7280', fontWeight: 600 }}>
                  {taskType === 'baca-kalimat'
                    ? `${currentSentenceIndex + 1} / ${sentenceList.length}`
                    : '1 / 1'}
                </span>
              </div>
              <div style={{ backgroundColor: '#e5e7eb', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                <div
                  style={{
                    backgroundColor: '#2563eb',
                    height: '100%',
                    width: taskType === 'baca-kalimat'
                      ? `${((currentSentenceIndex + 1) / sentenceList.length) * 100}%`
                      : '100%',
                    transition: 'width 0.3s',
                  }}
                />
              </div>
            </div>

            {/* Content Display */}
            <div style={{
              backgroundColor: '#ffffff',
              padding: '2rem',
              borderRadius: '0.75rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              marginBottom: '2rem',
              textAlign: 'center',
            }}>
              {taskType === 'deskripsi-gambar' && selectedImage && (
                <div>
                  <p style={{ fontSize: '0.9rem', color: '#2563eb', fontWeight: 600, marginBottom: '1rem' }}>
                    🖼️ Deskripsikan gambar ini
                  </p>
                  <img
                    src={selectedImage}
                    alt="Selected"
                    style={{
                      maxWidth: '100%',
                      maxHeight: '400px',
                      borderRadius: '0.75rem',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                    }}
                  />
                </div>
              )}
              {taskType === 'baca-kalimat' && (
                <div>
                  <p style={{ fontSize: '0.9rem', color: '#10b981', fontWeight: 600, marginBottom: '1rem' }}>
                    📖 Baca kalimat ini
                  </p>
                  <div style={{
                    backgroundColor: '#d1fae5',
                    border: '2px solid #10b981',
                    borderRadius: '0.75rem',
                    padding: '2rem',
                  }}>
                    <p style={{ margin: 0, fontSize: '1.5rem', color: '#065f46', fontWeight: 500, lineHeight: 1.6 }}>
                      "{sentenceList[currentSentenceIndex]}"
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Recording Status */}
            {isRecording && (
              <div style={{
                backgroundColor: '#fee2e2',
                padding: '1rem',
                borderRadius: '0.5rem',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
              }}>
                <div style={{
                  width: '12px',
                  height: '12px',
                  backgroundColor: '#ef4444',
                  borderRadius: '50%',
                  animation: 'pulse 1.5s infinite',
                }} />
                <span style={{ color: '#991b1b', fontWeight: 600 }}>🎤 Sedang Merekam...</span>
                <span style={{ marginLeft: 'auto', fontSize: '0.85rem', color: '#6b7280' }}>
                  Tekan "Selesaikan" untuk menyelesaikan
                </span>
              </div>
            )}

            {/* Controls */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <button
                onClick={handleStopRekam}
                style={{
                  backgroundColor: '#ef4444',
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
                <MdStop size={20} /> Stop Rekam
              </button>

              <button
                onClick={isRecording ? handleSelesaikan : startRecording}
                style={{
                  backgroundColor: '#10b981',
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
                {isRecording ? (
                  <>
                    <MdCheckCircle size={20} /> Selesaikan
                  </>
                ) : (
                  <>
                    <MdMic size={20} /> Mulai Rekam
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Analyzing Screen */}
        {step === 'analyzing' && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60vh',
          }}>
            {analysisError ? (
              <>
                <div style={{
                  width: '80px',
                  height: '80px',
                  backgroundColor: '#fee2e2',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '2rem',
                }}>
                  <MdCancel size={48} color="#ef4444" />
                </div>
                <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem', color: '#dc2626', fontWeight: 700 }}>
                  Analisis Gagal
                </h2>
                <p style={{ margin: 0, color: '#6b7280', fontSize: '0.95rem', textAlign: 'center', maxWidth: '500px' }}>
                  {analysisError}
                </p>
                <p style={{ margin: '1rem 0 0 0', color: '#9ca3af', fontSize: '0.85rem' }}>
                  Kembali ke sesi rekaman dalam beberapa detik...
                </p>
              </>
            ) : (
              <>
                <div style={{
                  width: '80px',
                  height: '80px',
                  border: '6px solid #e5e7eb',
                  borderTop: '6px solid #2563eb',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  marginBottom: '2rem',
                }} />
                <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem', color: '#1f2937', fontWeight: 700 }}>
                  Menganalisis Audio
                </h2>
                <p style={{ margin: 0, color: '#6b7280', fontSize: '0.95rem' }}>
                  Mohon tunggu, sedang memproses rekaman audio Anda...
                </p>
              </>
            )}
          </div>
        )}
      </main>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default CogniView;