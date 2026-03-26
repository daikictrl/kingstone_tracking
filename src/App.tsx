/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import TrackShipment from './pages/TrackShipment';
import Contact from './pages/Contact';

// Admin
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './components/admin/Toast';
import ProtectedRoute from './components/admin/ProtectedRoute';
import AdminLogin from './pages/admin/AdminLogin';
import Dashboard from './pages/admin/Dashboard';
import Shipments from './pages/admin/Shipments';
import Settings from './pages/admin/Settings';
import AdminShell from './components/admin/AdminShell';

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <ScrollToTop />
          <Routes>
            {/* Public routes */}
            <Route
              path="/"
              element={
                <div className="flex flex-col min-h-screen font-sans bg-brand-light">
                  <Navbar />
                  <main className="grow"><Home /></main>
                  <Footer />
                </div>
              }
            />
            <Route
              path="/about"
              element={
                <div className="flex flex-col min-h-screen font-sans bg-brand-light">
                  <Navbar />
                  <main className="grow"><About /></main>
                  <Footer />
                </div>
              }
            />
            <Route
              path="/services"
              element={
                <div className="flex flex-col min-h-screen font-sans bg-brand-light">
                  <Navbar />
                  <main className="grow"><Services /></main>
                  <Footer />
                </div>
              }
            />
            <Route
              path="/track"
              element={
                <div className="flex flex-col min-h-screen font-sans bg-brand-light">
                  <Navbar />
                  <main className="grow"><TrackShipment /></main>
                  <Footer />
                </div>
              }
            />
            <Route
              path="/contact"
              element={
                <div className="flex flex-col min-h-screen font-sans bg-brand-light">
                  <Navbar />
                  <main className="grow"><Contact /></main>
                  <Footer />
                </div>
              }
            />

            {/* Admin routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminShell />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="shipments" element={<Shipments />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Routes>
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}
