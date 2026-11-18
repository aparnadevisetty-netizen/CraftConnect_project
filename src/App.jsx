import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Home from './pages/Home.jsx';
import { Loader2 } from 'lucide-react';

// Route-level code splitting keeps the first load small on slow connections.
const Explore = lazy(() => import('./pages/Explore.jsx'));
const ProductDetails = lazy(() => import('./pages/ProductDetails.jsx'));
const ArtisanDirectory = lazy(() => import('./pages/ArtisanDirectory.jsx'));
const ArtisanProfile = lazy(() => import('./pages/ArtisanProfile.jsx'));
const CustomOrder = lazy(() => import('./pages/CustomOrder.jsx'));
const LearningHub = lazy(() => import('./pages/LearningHub.jsx'));
const Community = lazy(() => import('./pages/Community.jsx'));
const Login = lazy(() => import('./pages/Login.jsx'));
const Register = lazy(() => import('./pages/Register.jsx'));
const ArtisanDashboard = lazy(() => import('./pages/dashboards/ArtisanDashboard.jsx'));
const BuyerDashboard = lazy(() => import('./pages/dashboards/BuyerDashboard.jsx'));
const AdminDashboard = lazy(() => import('./pages/dashboards/AdminDashboard.jsx'));
const NotFound = lazy(() => import('./pages/NotFound.jsx'));

const Loading = () => (
  <div className="grid min-h-[50vh] place-items-center" role="status" aria-label="Loading">
    <Loader2 className="h-10 w-10 animate-spin text-terracotta-600" />
  </div>
);

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-charcoal-900 focus:px-5 focus:py-3 focus:text-ivory">Skip to content</a>
      <ScrollToTop />
      <Navbar />
      <main id="main" className="flex-1 pb-20 lg:pb-0">
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/crafts/:id" element={<ProductDetails />} />
            <Route path="/artisans" element={<ArtisanDirectory />} />
            <Route path="/artisans/:id" element={<ArtisanProfile />} />
            <Route path="/custom-order" element={<CustomOrder />} />
            <Route path="/learn" element={<LearningHub />} />
            <Route path="/community" element={<Community />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/artisan" element={<ProtectedRoute roles={['artisan']}><ArtisanDashboard /></ProtectedRoute>} />
            <Route path="/buyer" element={<ProtectedRoute roles={['buyer']}><BuyerDashboard /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
