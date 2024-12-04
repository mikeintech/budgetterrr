import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

interface HeroProps {
  isAuthenticated: boolean;
}

export function Hero({ isAuthenticated }: HeroProps) {
  return (
    <section className="container mx-auto px-4 py-20 text-center relative">
      <motion.div
        initial="initial"
        animate="animate"
        variants={stagger}
        className="relative z-10"
      >
        <motion.h1 
          className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600"
          variants={fadeIn}
        >
          Smart Financial Planning{' '}
          <span className="block mt-2">Made Simple</span>
        </motion.h1>
        <motion.p 
          className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
          variants={fadeIn}
        >
          Take control of your finances with intelligent budgeting, goal tracking,
          and predictive insights.
        </motion.p>
        <motion.div 
          className="flex justify-center gap-4"
          variants={fadeIn}
        >
          <Button size="lg" asChild className="group">
            <Link to={isAuthenticated ? "/budget" : "/signup"}>
              Get Started
              <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <a href="#features">Learn More</a>
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}