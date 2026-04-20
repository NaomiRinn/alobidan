import { useState } from 'react';
import { AuthProvider } from './context/AuthContext.jsx';
import { AppProvider } from './context/AppContext.jsx';
import Navbar from './components/Navbar';
import Notification from './components/Notification';
import Footer from './components/Footer';
import Home from './pages/Home';
import Doctors from './pages/Doctors';
import DoctorDetail from './pages/DoctorDetail';
import SymptomChecker from './pages/SymptomChecker';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Bookings from './pages/Bookings';
import './App.css';

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
        {renderPage()}
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
