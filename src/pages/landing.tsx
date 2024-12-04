import { useAuth } from '@/components/auth/auth-provider';
import { Nav } from '@/components/landing/nav';
import { Hero } from '@/components/landing/hero';
import { Features } from '@/components/landing/features';
import { Testimonials } from '@/components/landing/testimonials';
import { CTA } from '@/components/landing/cta';
import { Footer } from '@/components/landing/footer';

export function LandingPage() {
  const { user } = useAuth();
  const isAuthenticated = !!user;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      <Nav isAuthenticated={isAuthenticated} />
      <Hero isAuthenticated={isAuthenticated} />
      <Features />
      <Testimonials />
      <CTA isAuthenticated={isAuthenticated} />
      <Footer />
    </div>
  );
}