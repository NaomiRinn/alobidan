import { useAuth } from '../context/AuthContext.js';
import { useApp } from '../context/AppContext.js';

export default function Bookings({ setCurrentPage }) {
  const { user } = useAuth();
  const { bookings, cancelBooking } = useApp();

  if (!user) {
    return (
      <div className="page-wrapper">
        <div className="container auth-required">
          <div className="auth-required-icon"></div>
          <h2>Masuk Terlebih Dahulu</h2>
          <p>Bunda perlu masuk untuk mengelola janji temu</p>
          <button className="btn-login-required" onClick={() => setCurrentPage('login')}>
            Masuk Sekarang
          </button>
        </div>
      </div>
    );
  }

  const statusConfig = {
    confirmed: { label: 'Terkonfirmasi', color: '#10b981', bg: '#ecfdf5' },
    cancelled: { label: 'Dibatalkan', color: '#ef4444', bg: '#fef2f2' },
    completed: { label: 'Selesai', color: '#6366f1', bg: '#eef2ff' },
  };

  return (
    <div className="page-wrapper">
      <div className="page-hero-mini">
        <div className="container">
          <h1 className="page-title">Jadwal Kunjungan</h1>
          <p className="page-subtitle">Kelola jadwal janji layanan Bunda dengan PMB</p>
        </div>
      </div>

      <div className="container bookings-page">
        {bookings.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📅</div>
            <h3>Belum ada jadwal kunjungan</h3>
            <p>Bunda belum memiliki jadwal janji layanan. Pilih layanan dan buat janji kunjungan sekarang!</p>
            <button className="btn-reset" onClick={() => setCurrentPage('doctors')}>
              Pilih Layanan
            </button>
          </div>
        ) : (
          <div className="bookings-list">
            {bookings.map(booking => {
              const status = statusConfig[booking.status] || statusConfig.confirmed;
              return (
                <div key={booking.id} className="booking-item">
                  <div className="booking-item-header">
                    <div className="booking-doc-info">
                    <div className="booking-doc-icon">🩺</div>
                      <div>
                        <h3>{booking.serviceName || booking.doctorName}</h3>
                        <p>{booking.serviceSpec || booking.doctorSpec}</p>
                        <p className="booking-hospital">{booking.midwifeName || booking.hospital}</p>
                      </div>
                    </div>
                    <div
                      className="booking-status-badge"
                      style={{ background: status.bg, color: status.color }}
                    >
                      {status.label}
                    </div>
                  </div>

                  <div className="booking-item-details">
                    <div className="booking-detail">
                      <span className="booking-detail-icon">📅</span>
                      <span>{booking.day}, {booking.time} WIB</span>
                    </div>

                    {booking.complaint && (
                      <div className="booking-detail">
                        <span className="booking-detail-icon">📝</span>
                        <span>"{booking.complaint}"</span>
                      </div>
                    )}
                    <div className="booking-detail">
                      <span className="booking-detail-icon">🕒</span>
                      <span>Dibuat: {new Date(booking.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    </div>
                  </div>

                  {booking.status === 'confirmed' && (
                    <div className="booking-item-actions">
                      <button className="btn-reschedule">Reschedule</button>
                      <button
                        className="btn-cancel-booking"
                        onClick={() => cancelBooking(booking.id)}
                      >
                        Batalkan
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <div className="bookings-footer-cta">
          <button className="btn-new-booking" onClick={() => setCurrentPage('doctors')}>
            <strong>Pesan Layanan Baru</strong> 
          </button>
        </div>
      </div>
    </div>
  );
}
