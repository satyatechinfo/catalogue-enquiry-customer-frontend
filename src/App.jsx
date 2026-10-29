import { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import MainLayout from './layouts/MainLayout.jsx';
import { PageLoader } from './components/StateViews.jsx';
import HomePage from './pages/HomePage.jsx';

// Secondary pages are loaded on demand to keep the first load small.
const CataloguePage = lazy(() => import('./pages/CataloguePage.jsx'));
const ProductDetailsPage = lazy(() => import('./pages/ProductDetailsPage.jsx'));
const EnquiryPage = lazy(() => import('./pages/EnquiryPage.jsx'));
const ThankYouPage = lazy(() => import('./pages/ThankYouPage.jsx'));
const OccasionsPage = lazy(() => import('./pages/OccasionsPage.jsx'));
const AboutPage = lazy(() => import('./pages/AboutPage.jsx'));
const ContactPage = lazy(() => import('./pages/ContactPage.jsx'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage.jsx'));

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="catalogue" element={<CataloguePage />} />
          <Route path="product/:id/:slug?" element={<ProductDetailsPage />} />
          <Route path="occasions" element={<OccasionsPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="enquiry" element={<EnquiryPage />} />
          <Route path="thank-you" element={<ThankYouPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
