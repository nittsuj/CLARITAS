import { GoogleSignInButton } from "../components/GoogleSignInButton";

export default function Landing() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* NAVBAR */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-slate-100">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-md bg-blue-600" />
            <span className="font-semibold">claritas</span>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm text-slate-600">
            <a href="#fitur" className="hover:text-slate-900">Fitur</a>
            <a href="#tentang" className="hover:text-slate-900">Tentang</a>
          </nav>

          <div className="flex items-center gap-2">
            <div className="scale-[0.92] origin-right">
              <GoogleSignInButton />
            </div>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-12 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Left */}
          <div>
            <h1 className="text-3xl md:text-4xl font-bold leading-tight">
              Monitoring Perkembangan Kognitif Pasien Alzheimer
            </h1>
            <p className="mt-4 text-slate-600 max-w-xl">
              Platform digital yang membantu caregiver memantau perkembangan kognitif pasien
              melalui analisis suara. Dapatkan tren longitudinal & ringkasan insight yang mudah dipahami.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              <Chip>Analisis AI</Chip>
              <Chip>Recording Otomatis</Chip>
              <Chip>Dashboard</Chip>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <a
                href="#fitur"
                className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-white font-semibold shadow-sm hover:bg-blue-700"
              >
                Mulai Sekarang →
              </a>
            </div>
          </div>

          {/* Right mock card */}
          <div className="relative">
            <div className="rounded-2xl bg-white shadow-lg border border-slate-100 p-5">
              <div className="flex gap-4">
                <div className="h-24 w-24 rounded-xl bg-amber-200" />
                <div className="flex-1">
                  <div className="h-3 w-40 bg-slate-200 rounded" />
                  <div className="mt-2 h-3 w-56 bg-slate-200 rounded" />
                  <div className="mt-2 h-3 w-44 bg-slate-200 rounded" />
                </div>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-3">
                <StatCard value="85%" label="Akurasi" />
                <StatCard value="+12%" label="Perubahan" />
                <StatCard value="10" label="Sesi/Minggu" />
              </div>
            </div>

            <div className="absolute -z-10 -top-8 -right-8 h-40 w-40 rounded-full bg-blue-100 blur-2xl" />
            <div className="absolute -z-10 -bottom-10 -left-10 h-40 w-40 rounded-full bg-indigo-100 blur-2xl" />
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="fitur" className="py-12">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-center text-xl font-semibold">Fitur Utama Claritas</h2>
          <p className="text-center text-slate-600 mt-2">
            Dirancang khusus untuk memudahkan caregiver dan pasien
          </p>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-5">
            <FeatureCard
              title="Dashboard"
              desc="Ringkasan dan tren perkembangan kognitif pasien dalam satu tampilan."
            />
            <FeatureCard
              title="CogniView"
              desc="Sesi task terstruktur untuk membantu pengambilan sampel suara yang konsisten."
            />
            <FeatureCard
              title="CareView"
              desc="Hasil sesi, ringkasan insight, dan rekomendasi langkah selanjutnya."
            />
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="tentang" className="py-10 bg-white">
        <div className="mx-auto max-w-6xl px-4">
          <h3 className="text-center text-lg font-semibold">Tentang Claritas</h3>
          <p className="mt-3 text-center text-slate-600 max-w-3xl mx-auto">
            Claritas membantu caregiver memantau perubahan secara longitudinal melalui
            sesi suara terstruktur dan interpretasi yang mudah dipahami.
          </p>
        </div>
      </section>

      {/* BIG CTA */}
      <section className="py-12">
        <div className="mx-auto max-w-6xl px-4">
          <div className="rounded-2xl bg-gradient-to-r from-blue-700 to-blue-600 px-6 py-10 text-white text-center">
            <h3 className="text-2xl font-bold">Siap Memulai Monitoring Kognitif?</h3>
            <p className="mt-2 text-white/85">
              Bergabunglah dengan Claritas untuk pemantauan Alzheimer yang lebih terukur.
            </p>
            <div className="mt-6 flex justify-center">
              <a
                href="/dashboard"
                className="rounded-xl bg-white text-blue-700 font-semibold px-6 py-3 shadow hover:bg-slate-50"
              >
                Mulai Sekarang
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-950 text-white/80">
        <div className="mx-auto max-w-6xl px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-md bg-blue-600" />
              <span className="font-semibold text-white">claritas</span>
            </div>
            <p className="mt-3 text-sm">
              Platform monitoring kognitif untuk pasien Alzheimer.
            </p>
          </div>

          <div>
            <p className="font-semibold text-white">Fitur</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>Dashboard</li>
              <li>Sesi Evaluasi</li>
              <li>Rekap Foto</li>
              <li>Review</li>
            </ul>
          </div>

          <div>
            <p className="font-semibold text-white">Informasi</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>Untuk Rumah Sakit</li>
              <li>Untuk Caregiver</li>
              <li>Privasi Data</li>
              <li>Bantuan</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 py-4 text-center text-xs text-white/60">
          © 2026 Claritas. Semua hak dilindungi.
        </div>
      </footer>
    </div>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-white border border-slate-200 px-3 py-1 text-sm text-slate-700">
      {children}
    </span>
  );
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-xl bg-slate-50 border border-slate-100 p-3 text-center">
      <div className="text-lg font-bold text-slate-900">{value}</div>
      <div className="text-xs text-slate-600">{label}</div>
    </div>
  );
}

function FeatureCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="h-10 w-10 rounded-xl bg-blue-50 border border-blue-100" />
      <h4 className="mt-4 font-semibold">{title}</h4>
      <p className="mt-2 text-sm text-slate-600">{desc}</p>
    </div>
  );
}
