import { useState, useEffect } from 'react';
import { BrowserRouter, Routes as RouterRoutes, Route, Navigate, useLocation } from 'react-router-dom';
import { Onboarding } from '@/components/onboarding';
import { AuthForm } from '@/components/auth/auth-form';
import { useAuth } from '@/components/auth/auth-provider';
import { AppLayout } from '@/components/layout/app-layout';
import { BudgetPage } from '@/pages/budget';
import { DebtPage } from '@/pages/debt';
import { ReportsPage } from '@/pages/reports';
import { SimulationPage } from '@/pages/simulation';
import { LandingPage } from '@/pages/landing';
import { TimeUpdatesTestPage } from '@/pages/test/time-updates';
import { getOnboardingStatus, syncOnboardingStatus } from '@/lib/supabase/preferences';

function AuthLayout() {
  const { user } = useAuth();
  const [isOnboarded, setIsOnboarded] = useState<boolean | null>(null);
  const location = useLocation();

  useEffect(() => {
    if (user) {
      getOnboardingStatus().then(setIsOnboarded);
    }
  }, [user]);

  // If user is authenticated, redirect to dashboard or onboarding
  if (user) {
    // Preserve the intended destination if it exists
    const from = location.state?.from?.pathname || "/budget";
    return <Navigate to={isOnboarded ? from : "/onboarding"} replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="w-full max-w-md p-4">
        <AuthForm />
      </div>
    </div>
  );
}

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (user) {
      syncOnboardingStatus();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

function RequireOnboarding({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [isOnboarded, setIsOnboarded] = useState<boolean | null>(null);

  useEffect(() => {
    if (user) {
      getOnboardingStatus().then(setIsOnboarded);
    }
  }, [user]);

  if (isOnboarded === null) {
    return null;
  }

  if (user && !isOnboarded) {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const [isOnboarded, setIsOnboarded] = useState<boolean | null>(null);

  useEffect(() => {
    if (user) {
      getOnboardingStatus().then(setIsOnboarded);
    }
  }, [user]);

  // Show loading state while checking auth and onboarding status
  if (loading || (user && isOnboarded === null)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Redirect authenticated users to dashboard if onboarded
  if (user && isOnboarded) {
    return <Navigate to="/budget" replace />;
  }

  return <>{children}</>;
}

export function Routes() {
  const { user, loading } = useAuth();
  const [isOnboarded, setIsOnboarded] = useState<boolean | null>(null);

  useEffect(() => {
    if (user) {
      getOnboardingStatus().then(setIsOnboarded);
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <RouterRoutes>
        {/* Public Routes */}
        <Route path="/" element={
          <PublicRoute>
            <LandingPage />
          </PublicRoute>
        } />
        <Route path="/login" element={<AuthLayout />} />
        <Route path="/signup" element={<AuthLayout />} />

        {/* Protected Routes */}
        <Route path="/onboarding" element={
          <RequireAuth>
            {isOnboarded ? (
              <Navigate to="/budget" replace />
            ) : (
              <Onboarding onComplete={() => setIsOnboarded(true)} />
            )}
          </RequireAuth>
        } />

        <Route element={
          <RequireAuth>
            <RequireOnboarding>
              <AppLayout />
            </RequireOnboarding>
          </RequireAuth>
        }>
          <Route path="/budget" element={<BudgetPage />} />
          <Route path="/debt" element={<DebtPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/simulation" element={<SimulationPage />} />
          {process.env.NODE_ENV === 'development' && (
            <Route path="/test/time-updates" element={<TimeUpdatesTestPage />} />
          )}
        </Route>

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </RouterRoutes>
    </BrowserRouter>
  );
}