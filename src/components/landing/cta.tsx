import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface CTAProps {
  isAuthenticated: boolean;
}

export function CTA({ isAuthenticated }: CTAProps) {
  return (
    <section className="container mx-auto px-4 py-20">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="bg-gradient-to-r from-primary to-blue-600 text-primary-foreground rounded-lg p-12 text-center relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-4">
            Ready to take control of your finances?
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Join thousands of users who are already achieving their financial goals.
          </p>
          <Button
            size="lg"
            variant="secondary"
            asChild
            className="group"
          >
            <Link to={isAuthenticated ? "/budget" : "/signup"}>
              Start Your Journey
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </motion.div>
    </section>
  );
}