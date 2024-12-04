import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Coins, Menu } from 'lucide-react';
import { motion } from 'framer-motion';
import { ThemeToggle } from '@/components/theme/theme-toggle';

interface NavProps {
  isAuthenticated: boolean;
}

export function Nav({ isAuthenticated }: NavProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = isAuthenticated ? (
    <Button asChild>
      <Link to="/budget">Go to Dashboard</Link>
    </Button>
  ) : (
    <>
      <Button variant="ghost" asChild>
        <Link to="/login">Sign In</Link>
      </Button>
      <Button asChild>
        <Link to="/signup">Get Started</Link>
      </Button>
    </>
  );

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-3">
        <motion.div 
          className="flex items-center justify-between"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link to="/" className="flex items-center gap-2">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <Coins className="h-6 w-6 text-primary" />
            </motion.div>
            <span className="text-xl font-bold">Budgefi</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle />
            {navItems}
          </div>

          {/* Mobile Navigation */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[250px] sm:w-[300px]">
                <div className="flex flex-col gap-4 mt-8">
                  {navItems}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </motion.div>
      </div>
    </nav>
  );
}