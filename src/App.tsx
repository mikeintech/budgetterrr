import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { DataProvider } from '@/lib/data-context';
import { AuthProvider } from '@/components/auth/auth-provider';
import { Routes } from '@/routes';

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="savings-theme">
      <AuthProvider>
        <DataProvider>
          <Routes />
          <Toaster />
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;