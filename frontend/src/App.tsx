import { TooltipProvider } from '@/components/ui/tooltip';
import { useTheme } from '@/hooks/useTheme';
import { router } from '@/routes';
import { RouterProvider } from 'react-router/dom';

function AppContent() {
  useTheme();
  return (
    <TooltipProvider>
      <RouterProvider router={router} />
    </TooltipProvider>
  );
}

function App() {
  return <AppContent />;
}

export default App;
