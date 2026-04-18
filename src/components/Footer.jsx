export default function Footer({ setCurrentPage }) {
  const navigate = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-brand">
            <div className="footer-logo" onClick={() => navigate('home')}>
              <img src="/alobidan.png" alt="AloBidan" className="logo-img" style={{ height: '100px', objectFit: 'contain' }} />
            </div>
            <p className="footer-desc">
              Platform layanan kebidanan digital terpercaya untuk kesehatan ibu dan anak.
            </p>
          </div>

          {/* Layanan */}
          <div className="footer-section">
            <h4 className="footer-heading">Layanan</h4>
            <ul className="footer-links">
              <li><button onClick={() => navigate('doctors')}>Layanan Kami</button></li>
              <li><button onClick={() => navigate('symptom-checker')}>Cek Keluhan</button></li>
            </ul>
          </div>

          {/* Kontak */}
          <div className="footer-section">
            <h4 className="footer-heading">Kontak Kami</h4>
            <ul className="footer-contact">
              <li>
                <span>Desa Bantarmangu, Kec. Cimanggu, Kab. Cilacap</span>
              </li>
              <li>
                <a href="tel:+6285640814083">085640814083</a>
              </li>
              <li>
                <a href="mailto:elihidayati153@gmail.com">elihidayati153@gmail.com</a>
              </li>
              <li>
                <span>08:00 - 20:00 (Senin - Minggu)</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2026 AloBidan. Seluruh hak dilindungi undang-undang.</p>
          <p className="footer-disclaimer">Konten di dalam AloBidan hanya bersifat informatif dan tidak menggantikan konsultasi medis profesional.</p>
        </div>
      </div>
    </footer>
  );
}
