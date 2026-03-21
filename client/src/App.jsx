import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import MovieListingPage from './pages/MovieListingPage';
import MovieDetailPage from './pages/MovieDetailPage';
import SeatSelectionPage from './pages/SeatSelectionPage';
import BookingConfirmationPage from './pages/BookingConfirmationPage';
import BookingHistoryPage from './pages/BookingHistoryPage';
import AdminPanel from './pages/AdminPanel';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          {/* Landing page - public, default for unauthenticated */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/welcome" element={<LandingPage />} />

          {/* Auth routes - public */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected — any logged-in user */}
          <Route path="/movies" element={
            <ProtectedRoute><MovieListingPage /></ProtectedRoute>
          } />
          <Route path="/movies/:id" element={
            <ProtectedRoute><MovieDetailPage /></ProtectedRoute>
          } />
          <Route path="/shows/:showId/seats" element={
            <ProtectedRoute><SeatSelectionPage /></ProtectedRoute>
          } />
          <Route path="/booking/confirmation" element={
            <ProtectedRoute><BookingConfirmationPage /></ProtectedRoute>
          } />
          <Route path="/bookings" element={
            <ProtectedRoute><BookingHistoryPage /></ProtectedRoute>
          } />

          {/* Protected — admin only */}
          <Route path="/admin" element={
            <ProtectedRoute adminOnly><AdminPanel /></ProtectedRoute>
          } />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/welcome" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

