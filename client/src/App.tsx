import React from 'react';
import { Router, Route, useLocation, Redirect } from 'wouter';
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

  return isAuthenticated ? <>{children}</> : <Redirect to="/login" />;
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
          <Route path="/login" component={LoginPage} />
          <Route path="/">
            <ProtectedRoute>
              <AppLayout>
                <DashboardPage />
              </AppLayout>
            </ProtectedRoute>
          </Route>
          <Route path="/events">
            <ProtectedRoute>
              <AppLayout>
                <EventsPage />
              </AppLayout>
            </ProtectedRoute>
          </Route>
          <Route path="/waveforms">
            <ProtectedRoute>
              <AppLayout>
                <WaveformsPage />
              </AppLayout>
            </ProtectedRoute>
          </Route>
          <Route path="/substations">
            <ProtectedRoute>
              <AppLayout>
                <SubstationsPage />
              </AppLayout>
            </ProtectedRoute>
          </Route>
          <Route path="/feeders">
            <ProtectedRoute>
              <AppLayout>
                <FeedersPage />
              </AppLayout>
            </ProtectedRoute>
          </Route>
          <Route path="/:rest*" component={NotFoundPage} />
          <Toaster />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;