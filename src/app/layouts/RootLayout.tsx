import { Outlet } from 'react-router';
import { AppProvider } from '../providers/AppProvider';

/**
 * Root Layout - Wrapper for all routes
 * This ensures all child routes have access to AppProvider context
 */
export function RootLayout() {
  return (
    <AppProvider>
      <Outlet />
    </AppProvider>
  );
}