import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { useApp } from '../context/AppContext.js';

export default function Navbar({ currentPage, setCurrentPage }) {
  const { user, logout } = useAuth();
  const { bookings } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const activeBookings = bookings.filter(b => b.status === 'confirmed').length;

  const navLinks = [
    { id: 'home', label: 'Beranda' },
    { id: 'doctors', label: 'Layanan Kami' },
    { id: 'symptom-checker', label: 'Cek Keluhan' },
  ];

  const navigate = (page) => {
    setCurrentPage(page);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        {/* Logo */}
        <div className="navbar-logo" onClick={() => navigate('home')}>
          <img src="/alobidan.png" alt="AloBidan" className="logo-img" style={{ height: '120px', objectFit: 'contain' }} />
        </div>

        {/* Desktop Nav */}
        <ul className="navbar-links">
          {navLinks.map(link => (
            <li key={link.id}>
              <button
                className={`nav-link ${currentPage === link.id ? 'active' : ''}`}
                onClick={() => navigate(link.id)}
              >
                {link.label}
              </button>
            </li>
          ))}
        </ul>

        {/* Right Side */}
        <div className="navbar-right">
          {user ? (
            <div className="user-menu">
              <button className="notif-btn" onClick={() => navigate('bookings')} title="Jadwal Janji Temu">
                🔔
                {activeBookings > 0 && <span className="notif-badge">{activeBookings}</span>}
              </button>

              <div className="user-dropdown" onClick={() => setDropdownOpen(!dropdownOpen)}>
                <div className="user-avatar">{user.avatar}</div>
                <span className="user-name">{user.name.split(' ')[0]}</span>

                {dropdownOpen && (
                  <div className="dropdown-menu">
                    <button onClick={() => { navigate('profile'); setDropdownOpen(false); }}>
                      Profil Saya
                    </button>
                    <button onClick={() => { navigate('bookings'); setDropdownOpen(false); }}>
                      Janji Saya ({activeBookings})
                    </button>
                    {user.role === 'admin' && (
                      <button onClick={() => { navigate('admin'); setDropdownOpen(false); }} style={{ color: '#f472b6' }}>
                        Dashboard Admin
                      </button>
                    )}
                    <div className="dropdown-divider"></div>
                    <button className="logout-btn" onClick={() => { logout(); setDropdownOpen(false); }}>
                      Keluar
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="auth-buttons">
              <button className="btn-outline-nav" onClick={() => navigate('login')}>Masuk</button>
              <button className="btn-primary-nav" onClick={() => navigate('register')}>Daftar</button>
            </div>
          )}

          {/* Hamburger */}
          <button
            className={`hamburger ${menuOpen ? 'open' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        {navLinks.map(link => (
          <button
            key={link.id}
            className={`mobile-link ${currentPage === link.id ? 'active' : ''}`}
            onClick={() => navigate(link.id)}
          >
            <span>{link.icon}</span>
            {link.label}
          </button>
        ))}
        {!user ? (
          <div className="mobile-auth">
            <button className="btn-outline-nav" onClick={() => navigate('login')}>Masuk</button>
            <button className="btn-primary-nav" onClick={() => navigate('register')}>Daftar</button>
          </div>
        ) : (
          <>
            {user.role === 'admin' && (
              <button className="mobile-link" onClick={() => navigate('admin')} style={{ color: '#f472b6' }}>
                <span></span> Dashboard Admin
              </button>
            )}
            <button className="mobile-link logout-mobile" onClick={logout}>
              <span></span> Keluar
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
