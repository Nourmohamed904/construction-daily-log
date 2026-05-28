import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ReportForm from './pages/ReportForm';
import ReportDetail from './pages/ReportDetail';

const ProtectedRoute = ({ children }) => {
  const { token, loading } = useAuth();
  if (loading) return <p style={{ textAlign: 'center', marginTop: '3rem' }}>Loading...</p>;
  return token ? children : <Navigate to="/" />;
};

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/report/new" element={<ProtectedRoute><ReportForm /></ProtectedRoute>} />
          <Route path="/report/:id" element={<ProtectedRoute><ReportDetail /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;