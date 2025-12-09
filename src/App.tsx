import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { AlertHistory } from './pages/AlertHistory';
import { Analytics } from './pages/Analytics';
import { NotificationManagement } from './pages/NotificationManagement';
import { ContactManagement } from './pages/ContactManagement';
function App() {
  return <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>} />
          <Route path="/history" element={<ProtectedRoute>
                <AlertHistory />
              </ProtectedRoute>} />
          <Route path="/analytics" element={<ProtectedRoute>
                <Analytics />
              </ProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute allowedRoles={['ADMIN', 'RANGER']}>
                <NotificationManagement />
              </ProtectedRoute>} />
          <Route path="/contacts" element={<ProtectedRoute allowedRoles={['ADMIN', 'RANGER']}>
                <ContactManagement />
              </ProtectedRoute>} />
        </Routes>
      </Router>
    </AuthProvider>;
}
export { App };