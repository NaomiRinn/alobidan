import { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext.js';
import DoctorCard from '../components/DoctorCard';

export default function Doctors({ setCurrentPage, setSelectedDoctor }) {
  const { services: servicesList } = useApp();

  // Derive categories dynamically from services data
  const categories = useMemo(() => {
    const specs = [...new Set(servicesList.map(s => s.specialization))];
    return ['Semua Layanan', ...specs];
  }, [servicesList]);

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua Layanan');
  const [sortBy, setSortBy] = useState('rating');
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const filtered = useMemo(() => {
    let result = [...servicesList];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(d =>
        d.name.toLowerCase().includes(q) ||
        d.specialization.toLowerCase().includes(q)
      );
    }

    if (selectedCategory !== 'Semua Layanan') {
      result = result.filter(d => d.specialization === selectedCategory);
    }

    if (showAvailableOnly) {
      result = result.filter(d => d.available);
    }

    result.sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;

      if (sortBy === 'experience') return b.reviews - a.reviews; // Adjusting sort by experience logic
      if (sortBy === 'reviews') return b.reviews - a.reviews;
      return 0;
    });

    return result;
  }, [servicesList, search, selectedCategory, sortBy, showAvailableOnly]);

  const handleServiceClick = (service) => {
    setSelectedDoctor(service);
    setCurrentPage('doctor-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="page-wrapper">
      <div className="page-hero-mini">
        <div className="container">
          <h1 className="page-title">Pilih Layanan</h1>
          <p className="page-subtitle">Temukan pilihan layanan perawatan dan konsultasi yang sesuai dengan kebutuhan Bunda</p>
        </div>
      </div>

      <div className="container doctors-page">
        {/* Search & Filter */}
        <div className="search-filter-section">
          <div className="search-box-container">
            <span className="search-icon-input">🔍</span>
            <input
              type="text"
              className="search-box"
              placeholder="Cari nama layanan atau kategori..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              id="doctor-search"
            />
            {search && (
              <button className="search-clear" onClick={() => setSearch('')}>✕</button>
            )}
          </div>

          <button 
            className="mobile-filter-toggle" 
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            id="mobile-filter-btn"
          >
            <span className="toggle-icon">{showMobileFilters ? '✕' : '⚙️'}</span>
            {showMobileFilters ? 'Sembunyikan Filter' : 'Filter & Urutkan'}
          </button>

          <div className={`filter-row ${showMobileFilters ? 'show' : ''}`}>
            <div className="filter-group">
              <label className="filter-label">Kategori</label>
              <select
                className="filter-select"
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                id="spec-filter"
              >
                {categories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">Urutkan</label>
              <select
                className="filter-select"
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                id="sort-filter"
              >
                <option value="rating">Rating Tertinggi</option>

                <option value="reviews">Paling Banyak Dipesan</option>
              </select>
            </div>

            <div className="filter-group filter-toggle">
              <label className="toggle-label">
                <input
                  type="checkbox"
                  checked={showAvailableOnly}
                  onChange={e => setShowAvailableOnly(e.target.checked)}
                  id="available-toggle"
                />
                <span className="toggle-track">
                  <span className="toggle-thumb"></span>
                </span>
                Tersedia Saja
              </label>
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="spec-pills">
          {categories.slice(0, 8).map(c => (
            <button
              key={c}
              className={`spec-pill ${selectedCategory === c ? 'active' : ''}`}
              onClick={() => setSelectedCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Results Header */}
        <div className="results-header">
          <p className="results-count">
            Menampilkan <strong>{filtered.length}</strong> layanan
            {selectedCategory !== 'Semua Layanan' && ` untuk "${selectedCategory}"`}
          </p>
        </div>

        {/* Services Grid */}
        {filtered.length > 0 ? (
          <div className="doctors-grid">
            {filtered.map(service => (
              <DoctorCard key={service.id} doctor={service} onClick={handleServiceClick} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <h3>Layanan tidak ditemukan</h3>
            <p>Coba dengan kata kunci atau filter yang berbeda</p>
            <button className="btn-reset" onClick={() => { setSearch(''); setSelectedCategory('Semua Layanan'); setShowAvailableOnly(false); }}>
              Reset Filter
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
