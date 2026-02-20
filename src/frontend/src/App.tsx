import { RouterProvider, createRouter, createRoute, createRootRoute } from '@tanstack/react-router';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import QuestionGallery from './pages/QuestionGallery';
import CreateTest from './pages/CreateTest';
import About from './pages/About';
import Test from './pages/Test';
import Result from './pages/Result';
import ProtectedRoute from './components/ProtectedRoute';

const rootRoute = createRootRoute({
  component: Layout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Home,
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: () => (
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  ),
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: Admin,
});

const questionGalleryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/gallery',
  component: QuestionGallery,
});

const createTestRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/create-test',
  component: CreateTest,
});

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/about',
  component: About,
});

const testRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/test/$id',
  component: Test,
});

const resultRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/result/$id',
  component: Result,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  dashboardRoute,
  adminRoute,
  questionGalleryRoute,
  createTestRoute,
  aboutRoute,
  testRoute,
  resultRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
