import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { Toaster } from './components/ui/toaster';
import DashboardPage from './pages/dashboard';
import EventsPage from './pages/events';
import WaveformsPage from './pages/waveforms';
import LoginPage from './pages/login';
import SubstationsPage from './pages/substations';
import FeedersPage from './pages/feeders';
import NotFoundPage from './pages/not-found';
import AppSidebar from './components/app-sidebar';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
          </div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen bg-gray-50">
      <AppSidebar />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <DashboardPage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/events"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <EventsPage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/waveforms"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <WaveformsPage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/substations"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <SubstationsPage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/feeders"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <FeedersPage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          <Toaster />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;