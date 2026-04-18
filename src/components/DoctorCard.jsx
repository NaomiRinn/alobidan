export default function DoctorCard({ doctor, onClick }) {
  return (
    <div className="doctor-card" onClick={() => onClick(doctor)}>
      <div className="doctor-card-header">
        <div className="doctor-avatar" style={{ background: `linear-gradient(135deg, ${doctor.color}33, ${doctor.color}66)`, borderColor: doctor.color }}>
          <span style={{ color: doctor.color }}>{doctor.initials}</span>
        </div>
        <div className="doctor-available-badge">
          <span className={`availability-dot ${doctor.available ? 'available' : 'unavailable'}`}></span>
          {doctor.available ? 'Tersedia' : 'Tidak Tersedia'}
        </div>
      </div>

      <div className="doctor-card-body">
        <h3 className="doctor-name">{doctor.name}</h3>
        <p className="doctor-spec">{doctor.specialization}</p>
        <p className="doctor-hospital">{doctor.hospital}</p>

        <div className="doctor-stats">
          <div className="stat">
            <span className="stat-value">{doctor.rating}</span>
            <span className="stat-label">Rating</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat">
            <span className="stat-value">{doctor.experience}</span>
            <span className="stat-label">Durasi</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat">
            <span className="stat-value">{doctor.reviews}</span>
            <span className="stat-label">Ulasan</span>
          </div>
        </div>

        <div className="doctor-schedule">
          {doctor.schedule.map(day => (
            <span key={day} className="schedule-tag">{day}</span>
          ))}
        </div>
      </div>

      <div className="doctor-card-footer" style={{ justifyContent: 'flex-end' }}>
        <button className="btn-book" disabled={!doctor.available}>
          {doctor.available ? 'Buat Janji' : 'Penuh'}
        </button>
      </div>
    </div>
  );
}
