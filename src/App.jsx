import { useState, lazy, Suspense } from 'react';
import { AuthProvider } from './context/AuthContext.jsx';
import { AppProvider } from './context/AppContext.jsx';
import Navbar from './components/Navbar';
import Notification from './components/Notification';
import Footer from './components/Footer';
import './App.css';

const Home = lazy(() => import('./pages/Home'));
const Doctors = lazy(() => import('./pages/Doctors'));
const DoctorDetail = lazy(() => import('./pages/DoctorDetail'));
const SymptomChecker = lazy(() => import('./pages/SymptomChecker'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Bookings = lazy(() => import('./pages/Bookings'));

function AppContent() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const noFooterPages = ['login', 'register', 'admin'];
  const noNavPages = ['login', 'register'];

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home setCurrentPage={setCurrentPage} setSelectedDoctor={setSelectedDoctor} />;
      case 'doctors':
        return <Doctors setCurrentPage={setCurrentPage} setSelectedDoctor={setSelectedDoctor} />;
      case 'doctor-detail':
        return <DoctorDetail doctor={selectedDoctor} setCurrentPage={setCurrentPage} />;
      case 'symptom-checker':
        return <SymptomChecker setCurrentPage={setCurrentPage} />;
      case 'login':
        return <Login setCurrentPage={setCurrentPage} />;
      case 'register':
        return <Register setCurrentPage={setCurrentPage} />;
      case 'bookings':
        return <Bookings setCurrentPage={setCurrentPage} />;
      case 'admin':
        return <AdminDashboard setCurrentPage={setCurrentPage} />;
      default:
        return <Home setCurrentPage={setCurrentPage} setSelectedDoctor={setSelectedDoctor} />;
    }
  };

  return (
    <div className="app">
      {!noNavPages.includes(currentPage) && (
        <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      )}
      <Notification />
      <main className={`main-content ${noNavPages.includes(currentPage) ? 'no-nav' : ''}`}>
        <Suspense fallback={<div style={{ textAlign: 'center', padding: '50px', color: '#6366f1' }}>Memuat halaman...</div>}>
          {renderPage()}
        </Suspense>
      </main>
      {!noFooterPages.includes(currentPage) && (
        <Footer setCurrentPage={setCurrentPage} />
      )}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </AuthProvider>
  );
}

export default App;
