import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { HomePage } from './pages/Home.page';

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <HomePage />,
    },
  ],
  {
    basename: '/chainsaw_org',
  }
);

export function Router() {
  return <RouterProvider router={router} />;
}
