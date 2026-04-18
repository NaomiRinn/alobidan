import { useState, useCallback, useEffect } from 'react';
import { useAuth } from './AuthContext.js';
import { doctors as fallbackServices } from '../data/doctors';
import { AppContext } from './AppContext.js';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export function AppProvider({ children }) {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [services, setServices] = useState(() => {
    const saved = localStorage.getItem('hidokter_services');
    return saved ? JSON.parse(saved) : fallbackServices;
  });
  const [servicesLoading, setServicesLoading] = useState(true);
  const [isClinicOpen, setIsClinicOpen] = useState(() => {
    const saved = localStorage.getItem('hidokter_is_clinic_open');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [symptoms, setSymptoms] = useState([]);
  const [diseases, setDiseases] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);

  // Fetch master data from backend on mount
  useEffect(() => {
    const fetchData = async () => {
      setDataLoading(true);
      try {
        const [servicesRes, symptomsRes, diseasesRes] = await Promise.all([
          fetch(`${API_BASE}/services`),
          fetch(`${API_BASE}/symptoms`),
          fetch(`${API_BASE}/diseases`)
        ]);

        const servicesData = await servicesRes.json();
        const symptomsData = await symptomsRes.json();
        const diseasesData = await diseasesRes.json();

        if (Array.isArray(servicesData) && servicesData.length > 0) {
          setServices(servicesData);
          localStorage.setItem('hidokter_services', JSON.stringify(servicesData));
        }
        if (Array.isArray(symptomsData)) setSymptoms(symptomsData);
        if (Array.isArray(diseasesData)) setDiseases(diseasesData);

      } catch (err) {
        console.warn('Failed to fetch data from API:', err);
      } finally {
        setServicesLoading(false);
        setDataLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fetch bookings from backend whenever user changes
  useEffect(() => {
    if (!user) {
      setBookings([]);
      setBookingsLoading(false);
      return;
    }

    setBookingsLoading(true);
    fetch(`${API_BASE}/bookings?userId=${user.id}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setBookings(data);
        }
      })
      .catch(err => console.warn('Failed to fetch bookings from API:', err))
      .finally(() => setBookingsLoading(false));
  }, [user]);

  // Persist clinic status
  useEffect(() => {
    localStorage.setItem('hidokter_is_clinic_open', JSON.stringify(isClinicOpen));
  }, [isClinicOpen]);

  const addBooking = useCallback(async (booking) => {
    if (!user) return null;

    try {
      const res = await fetch(`${API_BASE}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          serviceId: booking.doctorId,
          serviceName: booking.doctorName,
          serviceSpec: booking.doctorSpec,
          midwifeName: booking.hospital,
          day: booking.day,
          time: booking.time,
          complaint: booking.complaint,
          price: booking.price,
          patientName: user.name,
          patientPhone: user.phone || null,
        }),
      });
      const newBooking = await res.json();
      setBookings(prev => [newBooking, ...prev]);
      return newBooking;
    } catch (err) {
      console.error('Failed to create booking via API:', err);
      return null;
    }
  }, [user]);

  const cancelBooking = useCallback(async (bookingId) => {
    try {
      await fetch(`${API_BASE}/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'cancelled' }),
      });
    } catch (err) {
      console.warn('Failed to cancel via API:', err);
    }
    setBookings(prev => prev.map(b =>
      b.id === bookingId ? { ...b, status: 'cancelled' } : b
    ));
  }, []);

  const updateBookingStatus = useCallback(async (bookingId, newStatus) => {
    try {
      await fetch(`${API_BASE}/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (err) {
      console.warn('Failed to update status via API:', err);
    }
    setBookings(prev => prev.map(b =>
      b.id === bookingId ? { ...b, status: newStatus } : b
    ));
  }, []);

  const toggleServiceStatus = useCallback((serviceId) => {
    setServices(prev => prev.map(s => s.id === serviceId ? { ...s, available: !s.available } : s));
  }, []);

  const updateServiceDetails = useCallback((serviceId, updatedData) => {
    setServices(prev => prev.map(s => s.id === serviceId ? { ...s, ...updatedData } : s));
  }, []);

  return (
    <AppContext.Provider value={{
      bookings,
      bookingsLoading,
      addBooking,
      cancelBooking,
      updateBookingStatus,
      services,
      servicesLoading,
      toggleServiceStatus,
      updateServiceDetails,
      isClinicOpen,
      setIsClinicOpen,
      searchQuery,
      setSearchQuery,
      symptoms,
      diseases,
      dataLoading,
    }}>
      {children}
    </AppContext.Provider>
  );
}
