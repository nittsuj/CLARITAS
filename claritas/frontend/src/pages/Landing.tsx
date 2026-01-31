import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import FeatureCard from '../components/FeatureCard';
import { MdDashboardCustomize, MdSmartDisplay, MdInsights, MdBarChart, MdGpsFixed, MdTimer, MdLocalHospital, MdPerson, MdPsychology } from 'react-icons/md';
import heroImage from '../assets/images/hero-image.png';

const Landing: React.FC = () => {
  const navigate = useNavigate();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#ffffff', paddingTop: '72px' }}>
      <Navbar />

      {/* Hero section */}
      <section
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '4rem 3rem',
          background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 50%, #BFDBFE 100%)',
          minHeight: '500px',
          gap: '3rem',
        }}
      >
        <div style={{ flex: 1, maxWidth: '600px' }}>
          <h1
            style={{
              fontSize: '2.5rem',
              lineHeight: 1.2,
              marginBottom: '1.5rem',
              color: '#1e293b',
              fontWeight: 700,
            }}
          >
            Monitoring Perkembangan Kognitif Pasien Alzheimer
          </h1>
          <p style={{ color: '#475569', marginBottom: '2rem', fontSize: '1.1rem', lineHeight: 1.6 }}>
            Platform digital yang membantu caregiver memantau dan meningkatkan kemampuan kognitif pasien
            Alzheimer melalui evaluasi interaktif berbasis AI. Dengan pendekatan inovatif, Claritas
            memberikan insight akurat untuk perawatan yang lebih baik.
          </p>

          {/* Metrics badges */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              padding: '0.75rem 1.25rem',
              borderRadius: '2rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            }}>
              <MdBarChart size={24} color="#2563eb" />
              <span style={{ color: '#2563eb', fontWeight: 700, fontSize: '1.1rem' }}>Analisis AI</span>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              padding: '0.75rem 1.25rem',
              borderRadius: '2rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            }}>
              <MdGpsFixed size={24} color="#2563eb" />
              <span style={{ color: '#2563eb', fontWeight: 700, fontSize: '1.1rem' }}>Monitoring Otomatis</span>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              padding: '0.75rem 1.25rem',
              borderRadius: '2rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            }}>
              <MdTimer size={24} color="#2563eb" />
              <span style={{ color: '#2563eb', fontWeight: 700, fontSize: '1.1rem' }}>Evaluasi Interaktif</span>
            </div>
          </div>

          <button
            onClick={scrollToTop}
            style={{
              backgroundColor: '#2563eb',
              color: '#ffffff',
              padding: '1rem 2.5rem',
              borderRadius: '0.5rem',
              fontWeight: 600,
              fontSize: '1.1rem',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#1d4ed8';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(37, 99, 235, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#2563eb';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.3)';
            }}
          >
            Mulai Sekarang →
          </button>
        </div>

        {/* Hero Image with Stats Card */}
        <div style={{ flex: 1, position: 'relative', maxWidth: '500px' }}>
          <div style={{
            borderRadius: '1rem',
            overflow: 'hidden',
            boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
          }}>
            <img
              src={heroImage}
              alt="Caregiver with Alzheimer patient"
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
              }}
            />
          </div>

          {/* Stats overlay card */}
          <div
            style={{
              position: 'absolute',
              bottom: '-20px',
              right: '-20px',
              backgroundColor: '#ffffff',
              borderRadius: '1rem',
              padding: '1.5rem',
              boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
              minWidth: '280px',
            }}
          >
            <h3 style={{ marginTop: 0, marginBottom: '1rem', color: '#1e293b', fontSize: '1rem' }}>
              Hasil Analisis AI
            </h3>
            <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '0.75rem' }}>
              <div style={{ flex: 1, textAlign: 'center' }}>
                <p style={{ margin: 0, fontSize: '1.75rem', fontWeight: 700, color: '#2563eb' }}>85%</p>
                <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b' }}>Akurasi</p>
              </div>
              <div style={{ flex: 1, textAlign: 'center' }}>
                <p style={{ margin: 0, fontSize: '1.75rem', fontWeight: 700, color: '#10b981' }}>+12%</p>
                <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b' }}>Peningkatan</p>
              </div>
              <div style={{ flex: 1, textAlign: 'center' }}>
                <p style={{ margin: 0, fontSize: '1.75rem', fontWeight: 700, color: '#f59e0b' }}>10</p>
                <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b' }}>Menit/Sesi</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section id="fitur" style={{ padding: '5rem 3rem', backgroundColor: '#f8fafc' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#1e293b', fontWeight: 700 }}>
            Fitur Utama Claritas
          </h2>
          <p style={{ color: '#64748b', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
            Dapatkan fitur-fitur terbaik untuk memantau dan meningkatkan kesehatan kognitif pasien
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem',
            maxWidth: '1200px',
            margin: '0 auto',
          }}
        >
          <FeatureCard
            icon={MdDashboardCustomize}
            title="Dashboard"
            description="Ringkasan lengkap perkembangan kognitif pasien dengan visualisasi yang mudah dipahami dan insight mendalam."
          />
          <FeatureCard
            icon={MdSmartDisplay}
            title="CogniView"
            description="Atur dan jalankan sesi evaluasi kognitif dengan dua jenis task: deskripsi gambar atau baca kalimat."
          />
          <FeatureCard
            icon={MdInsights}
            title="CareView"
            description="Analisis mendalam dengan tren longitudinal, sistem peringatan dini dan riwayat sesi lengkap."
          />
        </div>
      </section>

      {/* About section */}
      <section id="tentang" style={{ padding: '5rem 3rem', backgroundColor: '#ffffff' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: '#1e293b', fontWeight: 700 }}>
            Tentang Claritas
          </h2>
          <p style={{ lineHeight: 1.8, color: '#475569', fontSize: '1.1rem', marginBottom: '2rem' }}>
            Claritas adalah platform digital yang dikembangkan khusus untuk membantu rumah sakit dan
            caregiver dalam memantau perkembangan kognitif pasien Alzheimer. Dengan pendekatan
            evaluasi berbasis gambar dan rekaman suara, Claritas memberikan data akurat untuk
            mendukung perawatan yang lebih baik.
          </p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '2rem',
            marginTop: '3rem',
          }}>
            <div>
              <div style={{ marginBottom: '0.5rem' }}>
                <MdLocalHospital size={48} color="#2563eb" />
              </div>
              <h3 style={{ color: '#1e293b', fontSize: '1.1rem', marginBottom: '0.5rem' }}>Untuk Rumah Sakit</h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Monitoring pasien yang terstruktur</p>
            </div>
            <div>
              <div style={{ marginBottom: '0.5rem' }}>
                <MdPerson size={48} color="#2563eb" />
              </div>
              <h3 style={{ color: '#1e293b', fontSize: '1.1rem', marginBottom: '0.5rem' }}>Untuk Caregiver</h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Tools yang mudah digunakan</p>
            </div>
            <div>
              <div style={{ marginBottom: '0.5rem' }}>
                <MdPsychology size={48} color="#2563eb" />
              </div>
              <h3 style={{ color: '#1e293b', fontSize: '1.1rem', marginBottom: '0.5rem' }}>Berbasis AI</h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Analisis otomatis dan akurat</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to action section */}
      <section
        style={{
          background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
          color: '#ffffff',
          padding: '4rem 3rem',
          textAlign: 'center'
        }}
      >
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem', fontWeight: 700 }}>
          Siap Memulai Monitoring Kognitif?
        </h2>
        <p style={{ marginBottom: '2rem', fontSize: '1.1rem', opacity: 0.9 }}>
          Bergabunglah dengan Claritas untuk perawatan Alzheimer yang lebih terukur dan efektif.
        </p>
        <button
          onClick={scrollToTop}
          style={{
            backgroundColor: '#ffffff',
            color: '#2563eb',
            padding: '1rem 2.5rem',
            borderRadius: '0.5rem',
            fontWeight: 600,
            fontSize: '1.1rem',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
          }}
        >
          Mulai Sekarang
        </button>
      </section>

      {/* Footer */}
      <footer
        style={{
          backgroundColor: '#0f172a',
          color: '#cbd5e1',
          padding: '3rem 3rem 2rem',
        }}
      >
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '2rem',
          maxWidth: '1200px',
          margin: '0 auto 2rem',
        }}>
          <div>
            <h3 style={{ color: '#ffffff', marginBottom: '1rem', fontSize: '1.2rem' }}>Claritas</h3>
            <p style={{ fontSize: '0.9rem', lineHeight: 1.6 }}>
              Platform monitoring kognitif untuk pasien Alzheimer
            </p>
          </div>
          <div>
            <h4 style={{ color: '#ffffff', marginBottom: '1rem', fontSize: '1rem' }}>Fitur</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '0.5rem' }}><a href="#fitur" style={{ color: '#cbd5e1', textDecoration: 'none' }}>Dashboard</a></li>
              <li style={{ marginBottom: '0.5rem' }}><a href="#fitur" style={{ color: '#cbd5e1', textDecoration: 'none' }}>CogniView</a></li>
              <li style={{ marginBottom: '0.5rem' }}><a href="#fitur" style={{ color: '#cbd5e1', textDecoration: 'none' }}>CareView</a></li>
            </ul>
          </div>
          <div>
            <h4 style={{ color: '#ffffff', marginBottom: '1rem', fontSize: '1rem' }}>Informasi</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '0.5rem' }}><a href="#tentang" style={{ color: '#cbd5e1', textDecoration: 'none' }}>Tentang Claritas</a></li>
              <li style={{ marginBottom: '0.5rem' }}><a href="#fitur" style={{ color: '#cbd5e1', textDecoration: 'none' }}>Cara Kerja</a></li>
              <li style={{ marginBottom: '0.5rem' }}><a href="#" style={{ color: '#cbd5e1', textDecoration: 'none' }}>Privasi Data</a></li>
            </ul>
          </div>
        </div>
        <div style={{
          textAlign: 'center',
          paddingTop: '2rem',
          borderTop: '1px solid #334155',
          fontSize: '0.9rem',
        }}>
          © {new Date().getFullYear()} Claritas. Semua hak dilindungi.
        </div>
      </footer>
    </div>
  );
};

export default Landing;