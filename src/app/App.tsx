import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { AppProviders } from './providers';

/**
 * Application Entry Component.
 */
export default function App() {
  return (
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  );
}
