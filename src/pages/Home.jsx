import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext.js';
import DoctorCard from '../components/DoctorCard';
import MapComponent from '../components/MapComponent';

const stats = [
  { value: '15+', label: 'Tahun Pengalaman', icon: '' },
  { value: '10K+', label: 'Bunda Terbantu', icon: '' },
  { value: '4.9', label: 'Rating Kepuasan', icon: '' },
  { value: '24/7', label: 'Konsultasi', icon: '' },
];

const services = [
  {
    icon: '🏥',
    title: 'Pilih Layanan',
    desc: 'Pesan layanan bidan profesional sesuai kebutuhan Bunda, mulai dari ANC hingga Imunisasi.',
    color: '#f472b6',
    page: 'doctors',
  },
  {
    icon: '📋',
    title: 'Cek Keluhan',
    desc: 'Analisa keluhan kehamilan Bunda untuk mengetahui apakah perlu segera periksa ke bidan.',
    color: '#fb923c',
    page: 'symptom-checker',
  },
  {
    icon: ' 🔖',
    title: 'Buat Janji',
    desc: 'Booking jadwal kunjungan ke PMB dengan sangat mudah tanpa harus antre berlama-lama.',
    color: '#f59e0b',
    page: 'doctors',
  },
  {
    icon: ' 📝',
    title: 'Buku KIA Digital',
    desc: 'Simpan rekam medis kehamilan dan tumbuh kembang anak Bunda dengan aman dan praktis.',
    color: '#ec4899',
    page: 'profile',
  },
];

const testimonials = [
  {
    name: 'Bunda Rizky',
    role: 'Ibu Hamil (Trimester 3)',
    text: 'Sangat terbantu dengan layanan AloBidan. Cek kehamilan terasa nyaman dan bidannya sangat ramah menjelaskan kondisi janin!',
    rating: 5,
    avatar: 'BR',
    color: '#f472b6',
  },
  {
    name: 'Bunda Siska',
    role: 'Ibu Muda',
    text: 'Fitur cek keluhan sangat membantu ketika saya mual hebat. Booking layanan lewat AloBidan sangat praktis dan cepat!',
    rating: 5,
    avatar: 'BS',
    color: '#2dd4bf',
  },
  {
    name: 'Bapak Hermawan',
    role: 'Ayah Siaga',
    text: 'Booking baby spa untuk istri dan anak jadi super gampang. Nggak usah nunggu lama di lokasi karena sudah booking via web ini.',
    rating: 5,
    avatar: 'BH',
    color: '#fb923c',
  },
];

export default function Home({ setCurrentPage, setSelectedDoctor }) {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [animatedStats, setAnimatedStats] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setAnimatedStats(true); },
      { threshold: 0.3 }
    );
    const el = document.getElementById('stats-section');
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial(prev => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const navigate = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleServiceClick = (service) => {
    setSelectedDoctor(service);
    navigate('doctor-detail');
  };

  const { services: servicesList } = useApp();
  const featuredServices = servicesList.filter(s => s.available).slice(0, 4);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-bg-orbs">
          <div className="orb orb-1"></div>
          <div className="orb orb-2"></div>
          <div className="orb orb-3"></div>
        </div>
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-dot"></span>
            Layanan Praktek Mandiri Bidan Terpercaya
          </div>
          <h1 className="hero-title">
            Sahabat Terbaik<br />
            <span className="hero-gradient-text">Perjalanan Kehamilan Anda</span>
          </h1>
          <p className="hero-subtitle">
            Layanan pemeriksaan kehamilan yang ramah, nyaman, dan profesional untuk memastikan 
            kesehatan optimal bagi Bunda dan Buah Hati tercinta.
          </p>
          <div className="hero-cta">
            <button className="btn-hero-primary" onClick={() => navigate('doctors')}>
              <span>Lihat Layanan Kami</span>
            </button>
            <button className="btn-hero-secondary" onClick={() => navigate('symptom-checker')}>
              Cek Keluhan Bunda
            </button>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-card-container">
            <div className="floating-card card-1">
              <img src="/eli.png" alt="Bidan Eli" className="floating-photo" style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: '4px solid white', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
              <div style={{ flex: 1 }}>
                <strong style={{ fontSize: '16px' }}>Eli Hidayati S.Keb</strong>
                <p style={{ margin: 0 }}>Praktek Mandiri Bidan</p>
              </div>
              <span className="available-tag">Online</span>
            </div>
            <div className="hero-main-card">
              <div className="hmc-header">
                <div className="pulse-circle">
                  <div className="pulse-ring"></div>
                  <span className="pulse-icon">🏥</span>
                </div>
                
                <div>
                  <strong>AloBidan</strong>
                  <p>Klinik Kebidanan Digital</p>
                </div>
              </div>
              <div className="hmc-stats">
                <div className="hmc-stat">
                  <span className="hmc-num">15+</span>
                  <span>Tahun</span>
                </div>
                <div className="hmc-stat">
                  <span className="hmc-num">10K+</span>
                  <span>Bunda</span>
                </div>
                <div className="hmc-stat">
                  <span className="hmc-num">4.9</span>
                  <span>Rating</span>
                </div>
              </div>
            </div>
            <div className="floating-card card-2">
              <div>
                <strong>Layanan Kami Yang terbaik</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section" id="stats-section">
        <div className="container">
          <div className="stats-grid">
            {stats.map((stat, i) => (
              <div key={i} className={`stat-card ${animatedStats ? 'animated' : ''}`} style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="stat-icon">{stat.icon}</div>
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="services-section">
        <div className="container">
          <div className="section-header">
            <div className="section-tag">Fitur Aplikasi</div>
            <h2 className="section-title">Semua Kebutuhan Bunda</h2>
            <p className="section-subtitle">Nikmati kemudahan mengakses layanan kebidanan langsung dari gawai Anda.</p>
          </div>
          <div className="services-grid">
            {services.map((svc, i) => (
              <div
                key={i}
                className="service-card"
                onClick={() => navigate(svc.page)}
                style={{ '--svc-color': svc.color }}
              >
                <div className="svc-icon-wrap" style={{ background: `${svc.color}15`, border: `1px solid ${svc.color}30` }}>
                  <span className="svc-icon">{svc.icon}</span>
                </div>
                <h3 className="svc-title">{svc.title}</h3>
                <p className="svc-desc">{svc.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="featured-doctors-section">
        <div className="container">
          <div className="section-header">
            <div className="section-tag">Layanan Utama</div>
            <h2 className="section-title">Layanan Unggulan Kami</h2>
            <p className="section-subtitle">Berbagai layanan komprehensif mulai dari pemerikaan hamil hingga tumbuh kembang bayi.</p>
          </div>
          <div className="doctors-grid">
            {featuredServices.map(service => (
              <DoctorCard key={service.id} doctor={service} onClick={handleServiceClick} />
            ))}
          </div>
          <div className="section-cta">
            <button className="btn-see-all" onClick={() => navigate('doctors')}>
              Mulai Buat Janji
            </button>
          </div>
        </div>
      </section>


      {/* Testimonials */}
      <section className="testimonials-section">
        <div className="container">
          <div className="section-header">
            <div className="section-tag">Testimoni</div>
            <h2 className="section-title">Cerita Para Bunda</h2>
          </div>
          <div className="testimonials-wrapper">
            <div className="testimonial-card active">
              <div className="testimonial-stars">
              </div>
              <p className="testimonial-text">"{testimonials[activeTestimonial].text}"</p>
              <div className="testimonial-author">
                <div className="test-avatar" style={{ background: `linear-gradient(135deg, ${testimonials[activeTestimonial].color}, ${testimonials[activeTestimonial].color}aa)` }}>
                  {testimonials[activeTestimonial].avatar}
                </div>
                <div>
                  <strong>{testimonials[activeTestimonial].name}</strong>
                  <p>{testimonials[activeTestimonial].role}</p>
                </div>
              </div>
            </div>
            <div className="testimonial-dots">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  className={`dot ${i === activeTestimonial ? 'active' : ''}`}
                  onClick={() => setActiveTestimonial(i)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* Map Section */}
      <section className="map-section">
        <div className="container">
          <div className="section-header">
            <div className="section-tag">Kontak & Lokasi</div>
            <h2 className="section-title">Kunjungi Klinik Kami</h2>
            <p className="section-subtitle">Praktek Mandiri Bidan (PMB) Eli Hidayati siap melayani Bunda di lokasi yang nyaman dan strategis.</p>
          </div>

          <div className="map-container-wrapper">
            <div className="map-info">
              <div className="map-info-title">Informasi Kontak</div>
              
              <div className="map-info-item">
                <div className="map-info-icon">📍</div>
                <div className="map-info-text">
                  <strong>Lokasi Klinik</strong>
                  <p>Desa Bantarmangu, Kec. Cimanggu, Kab. Cilacap, Jawa Tengah</p>
                </div>
              </div>

              <div className="map-info-item">
                <div className="map-info-icon">📞</div>
                <div className="map-info-text">
                  <strong>WhatsApp/Telepon</strong>
                  <p>+62 812-3456-7890 (Bidan Eli)</p>
                </div>
              </div>

              <div className="map-info-item">
                <div className="map-info-icon">⏰</div>
                <div className="map-info-text">
                  <strong>Jam Operasional</strong>
                  <p>Senin - Minggu: 08:00 - 20:00 WIB<br />Persalinan: 24 Jam Standby</p>
                </div>
              </div>
            </div>
            
            <div className="leaflet-container">
              <MapComponent height="100%" />
            </div>
          </div>
        </div>
      </section>


      {/* CTA Banner */}
      <section className="cta-banner">
        <div className="container">
          <div className="cta-content">
            <h2>Ingin Konsultasi Kehamilan Bunda Sekarang?</h2>
            <p>Daftar gratis di aplikasi AloBidan dan jadwalkan kunjungan Bunda dengan praktis.</p>
            <div className="cta-buttons">
              <button className="btn-cta-primary" onClick={() => navigate('register')}>
                Daftar & Buat Janji
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
