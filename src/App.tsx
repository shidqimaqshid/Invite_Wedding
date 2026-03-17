import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { WeddingProvider } from './context/WeddingContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Builder from './pages/Builder';
import Invitation from './pages/Invitation';
import Login from './pages/Login';
import Register from './pages/Register';
import ErrorBoundary from './components/ErrorBoundary';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <WeddingProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Navigate to="/builder" replace />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route 
                path="/builder" 
                element={
                  <ProtectedRoute>
                    <Builder />
                  </ProtectedRoute>
                } 
              />
              <Route path="/preview" element={<Invitation />} />
              <Route path="/:slug" element={<Invitation />} />
            </Routes>
          </BrowserRouter>
        </WeddingProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
