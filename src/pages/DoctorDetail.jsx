import { useState } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { useApp } from '../context/AppContext.js';
import MapComponent from '../components/MapComponent';

const timeSlots = ['08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'];

export default function DoctorDetail({ doctor, setCurrentPage }) {
  const { user } = useAuth();
  const { addBooking } = useApp();
  const [activeTab, setActiveTab] = useState('profile');
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [complaint, setComplaint] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // Here, "doctor" actually represents "service" in our new data structure
  const service = doctor;

  if (!service) {
    setCurrentPage('doctors');
    return null;
  }

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!user) {
      setCurrentPage('login');
      return;
    }
    if (!selectedDay || !selectedTime) return;

    setLoading(true);

    await addBooking({
      doctorId: service.id,
      doctorName: service.name,
      doctorSpec: service.specialization,
      hospital: service.hospital,
      day: selectedDay,
      time: selectedTime,
      complaint,
      price: service.price,
    });

    setLoading(false);
    setBookingSuccess(true);
  };

  return (
    <div className="page-wrapper">
      <div className="container doctor-detail-page">
        {/* Back Button */}
        <button className="back-btn" onClick={() => setCurrentPage('doctors')}>
          Kembali ke Pilih Layanan
        </button>

        <div className="detail-layout">
          {/* Left: Service Info */}
          <div className="detail-main">
            {/* Service Header */}
            <div className="doctor-detail-header">
              <div className="doctor-detail-avatar" style={{
                background: `linear-gradient(135deg, ${service.color}33, ${service.color}66)`,
                borderColor: service.color
              }}>
                <span style={{ color: service.color }}>{service.initials}</span>
              </div>
              <div className="doctor-detail-info">
                <h1 className="doctor-detail-name">{service.name}</h1>
                <p className="doctor-detail-spec">{service.specialization}</p>
                <p className="doctor-detail-hospital">{service.hospital}</p>
                <div className="doctor-detail-badges">
                  <span className="badge-verified">Prosedur Sesuai Standar</span>
                  <span className={`badge-avail ${service.available ? 'avail' : 'unavail'}`}>
                    {service.available ? '● Tersedia' : '● Tidak Tersedia'}
                  </span>
                </div>
                <div className="doctor-detail-stats">
                  <div className="ds-stat">
                    <span className="ds-val">{service.rating}</span>
                    <span className="ds-lbl">Rating</span>
                  </div>
                  <div className="ds-stat">
                    <span className="ds-val">{service.reviews}+</span>
                    <span className="ds-lbl">Dipesan</span>
                  </div>
                  <div className="ds-stat">
                    <span className="ds-val">{service.experience}</span>
                    <span className="ds-lbl">Durasi</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="detail-tabs">
              {['profile', 'schedule', 'reviews'].map(tab => (
                <button
                  key={tab}
                  className={`detail-tab ${activeTab === tab ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab)}
                  id={`tab-${tab}`}
                >
                  {tab === 'profile' ? 'Info Layanan' : tab === 'schedule' ? 'Jadwal' : 'Ulasan'}
                </button>
              ))}
            </div>

            <div className="tab-content">
              {activeTab === 'profile' && (
                <div className="tab-profile">
                  <h3>Keterangan Layanan</h3>
                  <p>{service.about}</p>

                  <h3>Cakupan Prosedur</h3>
                  <ul className="education-list">
                    {service.education.map((edu, i) => (
                      <li key={i}>
                        {edu}
                      </li>
                    ))}
                  </ul>

                  <h3>Peserta/Target Klien</h3>
                  <div className="lang-tags">
                    {service.languages.map(l => (
                      <span key={l} className="lang-tag">{l}</span>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'schedule' && (
                <div className="tab-schedule">
                  <h3>Hari Pelayanan Layanan</h3>
                  <div className="schedule-days">
                    {['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'].map(day => (
                      <div
                        key={day}
                        className={`schedule-day ${service.schedule.includes(day) || service.schedule.includes('Setiap Hari') || service.schedule.includes('24 Jam Standby') ? 'available' : 'unavailable'}`}
                      >
                        <span>{day}</span>
                        <span>{service.schedule.includes(day) || service.schedule.includes('Setiap Hari') || service.schedule.includes('24 Jam Standby') ? 'Tersedia' : ''}</span>
                      </div>
                    ))}
                  </div>
                  <p className="schedule-note">Lokasi: Desa Bantarmangu, Kec. Cimanggu, Kab. Cilacap</p>
                  <p className="schedule-note">Jam Pelayanan: 08:00 - 20:00 WIB (Senin - Minggu)</p>
                  
                  <div className="doctor-detail-map">
                    <MapComponent height="250px" />
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="tab-reviews">
                  <div className="reviews-summary">
                    <div className="review-big-rating">{service.rating}</div>
                    <div>
                      <div className="review-stars"></div>
                      <p className="review-count">Berdasarkan {service.reviews} ulasan Bunda</p>
                    </div>
                  </div>
                  {/* Sample Reviews */}
                  {[
                    { name: 'Bunda Rina', text: 'Layanannya sangat memuaskan, bidan telaten memberikan penjelasan detail. Alatnya bersih.', rating: 5 },
                    { name: 'Bunda Siti', text: 'Prosesnya cepat dan tepat waktu sesuai jadwal booking! Terima kasih AloBidan.', rating: 5 },
                    { name: 'Bunda Ayu', text: 'Tempatnya nyaman untuk ibu hamil dan anak-anak. Saya langganan baby spa di sini.', rating: 4 },
                  ].map((r, i) => (
                    <div key={i} className="review-item">
                      <div className="review-header">
                        <div className="review-avatar">{r.name[0]}</div>
                        <div>
                          <strong>{r.name}</strong>
                          <div className="review-stars-sm"></div>
                        </div>
                      </div>
                      <p className="review-text">{r.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: Booking Card */}
          <div className="booking-sidebar">
            {bookingSuccess ? (
              <div className="booking-success">
                <div className="success-icon"></div>
                <h3>Janji Berhasil Dibuat!</h3>
                <p>Layanan <strong>{service.name}</strong> pada <strong>{selectedDay}, {selectedTime} WIB</strong> telah terkonfirmasi.</p>

                <button className="btn-success" onClick={() => setCurrentPage('home')}>
                  Kembali ke Beranda
                </button>
                <button className="btn-success-outline" onClick={() => { setBookingSuccess(false); setSelectedDay(''); setSelectedTime(''); setComplaint(''); }}>
                  Pesan Layanan Lainnya
                </button>
              </div>
            ) : (
              <div className="booking-card">
                <div className="booking-card-header">
                  <h3>Pesan Layanan Ini</h3>

                </div>

                <form className="booking-form" onSubmit={handleBooking} id="booking-form">
                  <div className="form-group">
                    <label className="form-label">Pilih Hari Kunjungan</label>
                    <div className="day-selector">
                      {service.schedule.includes('24 Jam Standby') ? ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'].map(day => (
                        <button key={day} type="button" className={`day-btn ${selectedDay === day ? 'selected' : ''}`} onClick={() => setSelectedDay(day)}>{day}</button>
                      )) : service.schedule.map(day => (
                        <button
                          key={day}
                          type="button"
                          className={`day-btn ${selectedDay === day ? 'selected' : ''}`}
                          onClick={() => setSelectedDay(day)}
                        >
                          {day}
                        </button>
                      ))}
                    </div>
                  </div>

                  {selectedDay && (
                    <div className="form-group">
                      <label className="form-label">Jam Estimasi Datang</label>
                      <div className="time-selector">
                        {timeSlots.map(time => (
                          <button
                            key={time}
                            type="button"
                            className={`time-btn ${selectedTime === time ? 'selected' : ''}`}
                            onClick={() => setSelectedTime(time)}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="form-group">
                    <label className="form-label">Catatan Tambahan (Opsional)</label>
                    <textarea
                      className="form-textarea"
                      placeholder="Contoh: Ini kehamilan anak kedua saya / usia kandungan 20 minggu..."
                      value={complaint}
                      onChange={e => setComplaint(e.target.value)}
                      rows={3}
                      id="complaint-input"
                    />
                  </div>

                  <button
                    type="submit"
                    className={`btn-book-now ${(!service.available || !selectedDay || !selectedTime) ? 'disabled' : ''}`}
                    disabled={!service.available || !selectedDay || !selectedTime || loading}
                    id="book-submit"
                  >
                    {loading ? (
                      <span className="loading-spinner"></span>
                    ) : !user ? (
                      'Masuk untuk Booking'
                    ) : !service.available ? (
                      'Layanan Tutup'
                    ) : (
                      'Booking Jadwal Sekarang'
                    )}
                  </button>

                  {!user && (
                    <p className="booking-login-note">
                      Belum punya akun? <button type="button" className="link-btn" onClick={() => setCurrentPage('register')}>Daftar Bunda</button>
                    </p>
                  )}
                </form>

                <div className="booking-info">
                  <div className="info-item">
                    <span>Dilayani oleh: {service.hospital}</span>
                  </div>
                  <div className="info-item">
                    <span>Pembayaran di klinik tunai/transfer</span>
                  </div>
                  <div className="info-item">
                    <span>Bisa ubah jadwal H-1 kehadiran</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
