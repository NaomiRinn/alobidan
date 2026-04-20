import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { useApp } from '../context/AppContext.js';

export default function AdminDashboard({ setCurrentPage }) {
  const { user } = useAuth();
  const { bookings, updateBookingStatus, isClinicOpen, setIsClinicOpen, services, toggleServiceStatus, updateServiceDetails, users, usersLoading } = useApp();
  const [activeTab, setActiveTab] = useState('bookings'); // bookings, services, users
  const [editingServiceId, setEditingServiceId] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  const handleEditClick = (service) => {
    setEditingServiceId(service.id);
    setEditFormData({ ...service });
  };

  const handleSaveEdit = () => {
    updateServiceDetails(editingServiceId, editFormData);
    setEditingServiceId(null);
  };

  const handleCancelEdit = () => {
    setEditingServiceId(null);
    setEditFormData({});
  };

  useEffect(() => {
    // If user is not admin, push them back to home
    if (!user || user.role !== 'admin') {
      setCurrentPage('home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [user, setCurrentPage]);

  if (!user || user.role !== 'admin') return null;

  const totalBookings = bookings.length;
  const pendingBookings = bookings.filter(b => b.status === 'pending').length;
  const activeServices = services.filter(s => s.available).length;

  return (
    <div className="page-wrapper" style={{ backgroundColor: '#f8fafc', minHeight: '100vh', paddingBottom: '3rem' }}>
      <div className="page-hero-mini">
        <div className="container">
          <h1 className="page-title">Dashboard Bidan</h1>
          <p className="page-subtitle">Selamat datang kembali, {user.name}. Kelola antrean dan layanan klinik Anda di sini.</p>
        </div>
      </div>

      <div className="container" style={{ marginTop: '2rem' }}>
        {/* Quick Stats & Clinic Control */}
        <div className="admin-dashboard-stats">
          
          <div className="stat-card" style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
            <h3 style={{ fontSize: '0.875rem', color: '#64748b' }}>Pengaturan Klinik</h3>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1rem' }}>
              <span style={{ fontWeight: '600', color: isClinicOpen ? '#10b981' : '#ef4444' }}>
                {isClinicOpen ? 'Buka (Menerima Janji)' : 'Tutup Sementara'}
              </span>
              <label className="toggle-label" style={{ cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={isClinicOpen}
                  onChange={(e) => setIsClinicOpen(e.target.checked)}
                  style={{ display: 'none' }}
                />
                <span className="toggle-track" style={{ display: 'inline-block', width: '40px', height: '20px', background: isClinicOpen ? '#10b981' : '#cbd5e1', borderRadius: '20px', position: 'relative', transition: '0.3s' }}>
                  <span className="toggle-thumb" style={{ display: 'block', width: '16px', height: '16px', background: '#fff', borderRadius: '50%', position: 'absolute', top: '2px', left: isClinicOpen ? '22px' : '2px', transition: '0.3s' }}></span>
                </span>
              </label>
            </div>
          </div>

          <div className="stat-card" style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
            <h3 style={{ fontSize: '0.875rem', color: '#64748b' }}>Total Janji Temu</h3>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#0f172a', marginTop: '0.5rem' }}>{totalBookings}</div>
            <p style={{ fontSize: '0.75rem', color: '#f59e0b' }}>{pendingBookings} Menunggu Konfirmasi</p>
          </div>

          <div className="stat-card" style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
            <h3 style={{ fontSize: '0.875rem', color: '#64748b' }}>Layanan Aktif</h3>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#0f172a', marginTop: '0.5rem' }}>{activeServices} <span style={{fontSize: '1rem', color: '#64748b', fontWeight: 'normal'}}>/ {services.length}</span></div>
          </div>

        </div>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid #e2e8f0', marginBottom: '2rem' }}>
          <button 
            onClick={() => setActiveTab('bookings')}
            style={{ padding: '0.75rem 1.5rem', background: 'none', border: 'none', borderBottom: activeTab === 'bookings' ? '2px solid #f472b6' : '2px solid transparent', color: activeTab === 'bookings' ? '#f472b6' : '#64748b', fontWeight: activeTab === 'bookings' ? '600' : '400', cursor: 'pointer' }}>
            kelola Janji Temu
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            style={{ padding: '0.75rem 1.5rem', background: 'none', border: 'none', borderBottom: activeTab === 'users' ? '2px solid #f472b6' : '2px solid transparent', color: activeTab === 'users' ? '#f472b6' : '#64748b', fontWeight: activeTab === 'users' ? '600' : '400', cursor: 'pointer' }}>
            Manajemen Pasien
          </button>
          <button 
            onClick={() => setActiveTab('services')}
            style={{ padding: '0.75rem 1.5rem', background: 'none', border: 'none', borderBottom: activeTab === 'services' ? '2px solid #f472b6' : '2px solid transparent', color: activeTab === 'services' ? '#f472b6' : '#64748b', fontWeight: activeTab === 'services' ? '600' : '400', cursor: 'pointer' }}>
            Manajemen Layanan
          </button>
        </div>

        {/* Tab Content: Bookings */}
        {activeTab === 'bookings' && (
          <div className="admin-panel" style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: '#0f172a' }}>Janji Temu Pasien</h2>
            
            {bookings.length === 0 ? (
              <p style={{ color: '#64748b', textAlign: 'center', padding: '2rem' }}>Belum ada janji temu yang masuk.</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', color: '#475569', fontSize: '0.875rem' }}>
                      <th style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0' }}>ID / Waktu</th>
                      <th style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0' }}>Pasien / Kontak</th>
                      <th style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0' }}>Layanan</th>
                      <th style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0' }}>Status</th>
                      <th style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0' }}>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...bookings].reverse().map(b => (
                      <tr key={b.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '1rem' }} data-label="Waktu">
                          <div style={{ fontWeight: '600', color: '#0f172a' }}>{new Date(b.date).toLocaleDateString('id-ID')}</div>
                          <div style={{ fontSize: '0.875rem', color: '#64748b' }}>{b.time}</div>
                        </td>
                        <td style={{ padding: '1rem' }} data-label="Pasien">
                          <div style={{ fontWeight: '500', color: '#0f172a' }}>{b.patientName || b.patientPhone}</div>
                          {b.patientPhone && <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{b.patientPhone}</div>}
                        </td>
                        <td style={{ padding: '1rem' }} data-label="Layanan">
                          <span style={{ fontSize: '0.875rem', color: '#0f172a' }}>{b.doctorName}</span>
                        </td>
                        <td style={{ padding: '1rem' }} data-label="Status">
                          <span style={{ 
                            padding: '0.25rem 0.75rem', 
                            borderRadius: '1rem', 
                            fontSize: '0.75rem', 
                            fontWeight: '600',
                            backgroundColor: b.status === 'confirmed' ? '#dcfce7' : b.status === 'pending' ? '#fef3c7' : b.status === 'completed' ? '#dbeafe' : '#f1f5f9',
                            color: b.status === 'confirmed' ? '#166534' : b.status === 'pending' ? '#92400e' : b.status === 'completed' ? '#1e40af' : '#475569',
                          }}>
                            {b.status.toUpperCase()}
                          </span>
                        </td>
                        <td style={{ padding: '1rem' }} data-label="Aksi">
                          <select 
                            value={b.status}
                            onChange={(e) => updateBookingStatus(b.id, e.target.value)}
                            style={{ 
                              padding: '0.5rem', 
                              borderRadius: '6px', 
                              border: '1px solid #cbd5e1', 
                              background: '#fff',
                              fontSize: '0.875rem'
                            }}
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Konfirmasi</option>
                            <option value="completed">Selesai</option>
                            <option value="cancelled">Batal</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab Content: Users */}
        {activeTab === 'users' && (
          <div className="admin-panel" style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: '#0f172a' }}>Daftar Pasien Terdaftar</h2>
            
            {usersLoading ? (
              <p style={{ textAlign: 'center', padding: '2rem' }}>Memuat data pasien...</p>
            ) : users.length === 0 ? (
              <p style={{ color: '#64748b', textAlign: 'center', padding: '2rem' }}>Belum ada pasien yang terdaftar.</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', color: '#475569', fontSize: '0.875rem' }}>
                      <th style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0' }}>Nama / Email</th>
                      <th style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0' }}>Telepon</th>
                      <th style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0' }}>Role</th>
                      <th style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0' }}>Bergabung</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '1rem' }} data-label="Nama/Email">
                          <div style={{ fontWeight: '600', color: '#0f172a' }}>{u.name}</div>
                          <div style={{ fontSize: '0.875rem', color: '#64748b' }}>{u.email}</div>
                        </td>
                        <td style={{ padding: '1rem' }} data-label="Telepon">
                          {u.phone || '-'}
                        </td>
                        <td style={{ padding: '1rem' }} data-label="Role">
                          <span style={{ 
                            padding: '0.25rem 0.75rem', 
                            borderRadius: '1rem', 
                            fontSize: '0.75rem', 
                            fontWeight: '600',
                            backgroundColor: u.role === 'admin' ? '#fce7f3' : '#f1f5f9',
                            color: u.role === 'admin' ? '#9d174d' : '#475569',
                          }}>
                            {u.role.toUpperCase()}
                          </span>
                        </td>
                        <td style={{ padding: '1rem' }} data-label="Bergabung">
                          {u.createdAt ? new Date(u.createdAt).toLocaleDateString('id-ID') : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab Content: Services */}
        {activeTab === 'services' && (
          <div className="admin-panel" style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: '#0f172a' }}>Daftar Layanan Klinik</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
              {services.map(s => (
                <div key={s.id} style={{ border: `1px solid ${s.available ? '#e2e8f0' : '#f87171'}`, borderRadius: '8px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', background: s.available ? '#fff' : '#fef2f2' }}>
                  {editingServiceId === s.id ? (
                    <>
                      <input 
                        value={editFormData.name} 
                        onChange={e => setEditFormData({...editFormData, name: e.target.value})} 
                        style={{ padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '1rem', width: '100%' }}
                        placeholder="Nama Layanan"
                      />
                      <input 
                        value={editFormData.specialization} 
                        onChange={e => setEditFormData({...editFormData, specialization: e.target.value})} 
                        style={{ padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '0.875rem', width: '100%' }}
                        placeholder="Kategori"
                      />
                      <input 
                        type="number"
                        value={editFormData.price} 
                        onChange={e => setEditFormData({...editFormData, price: Number(e.target.value)})} 
                        style={{ padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '0.875rem', width: '100%' }}
                        placeholder="Harga"
                      />
                      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                        <button onClick={handleSaveEdit} style={{ flex: 1, padding: '0.5rem', background: '#10b981', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '600' }}>Simpan</button>
                        <button onClick={handleCancelEdit} style={{ flex: 1, padding: '0.5rem', background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '600' }}>Batal</button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <h4 style={{ margin: 0, color: '#0f172a', fontSize: '1rem' }}>{s.name}</h4>
                        <span style={{ fontSize: '1.25rem' }}>{s.initials}</span>
                      </div>
                      <p style={{ margin: 0, fontSize: '0.875rem', color: '#64748b' }}>Kategori: {s.specialization}</p>
                      
                      <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <button onClick={() => handleEditClick(s)} style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem', background: '#e0e7ff', color: '#4338ca', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '600' }}>
                          Edit
                        </button>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem', color: s.available ? '#10b981' : '#ef4444', fontWeight: '500' }}>
                          {s.available ? 'Layanan Tersedia' : 'Non-aktif'}
                          <input 
                            type="checkbox" 
                            checked={s.available} 
                            onChange={() => toggleServiceStatus(s.id)} 
                            style={{ display: 'none' }}
                          />
                           <span className="toggle-track" style={{ display: 'inline-block', width: '32px', height: '16px', background: s.available ? '#10b981' : '#cbd5e1', borderRadius: '16px', position: 'relative', transition: '0.3s' }}>
                            <span className="toggle-thumb" style={{ display: 'block', width: '12px', height: '12px', background: '#fff', borderRadius: '50%', position: 'absolute', top: '2px', left: s.available ? '18px' : '2px', transition: '0.3s' }}></span>
                          </span>
                        </label>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
