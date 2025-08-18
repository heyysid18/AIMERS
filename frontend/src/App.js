import React, { useEffect, useState } from "react";
import { useLocation, matchPath } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import CoursesPage from "./pages/CoursesPage";
import DPPPage from "./pages/DPPPage";
import PapersPage from "./pages/PapersPage";
import ContactPage from "./pages/ContactPage";
import AboutPage from "./pages/AboutPage";
import AuthPage from "./pages/AuthPage";
import MyAccount from "./pages/MyAccount";
import ExplorePage from "./pages/ExplorePage";
import IframeTest from "./pages/IframeTest";
import PaperViewPage from "./pages/PaperViewPage";
import DPPViewerPage from "./pages/DPPViewerPage";
import PDFUploader from "./components/PDFUploader";
import TestCheckboxes from "./pages/TestCheckboxes";
import ErrorBoundary from "./components/ErrorBoundary";
import { BrowserRouter, Routes, Route} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

function AppLayout() {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, [location.pathname]);

  const hideFooterRoutes = [
    "/dpps/view/:class/:subject/:date",
    "/papers/board/:class/:subject/:year"
  ];

  const hideFooter = hideFooterRoutes.some(pattern =>
    matchPath({ path: pattern, end: false }, location.pathname)
  );

  return (
    <div className={`app-container ${isMobile ? 'mobile' : 'desktop'}`}>
      <Header />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/iframe-test" element={<IframeTest />} />
        <Route path="/upload" element={<PDFUploader />} />
        <Route path="/test-checkboxes" element={<TestCheckboxes />} />

        {/* Protected Routes */}
        <Route path="/courses" element={
          <ProtectedRoute>
            <ErrorBoundary>
              <CoursesPage />
            </ErrorBoundary>
          </ProtectedRoute>
        } />
        <Route path="/dpps" element={
          <ProtectedRoute>
            <ErrorBoundary>
              <DPPPage />
            </ErrorBoundary>
          </ProtectedRoute>
        } />
        <Route path="/dpps/view/:class/:subject/:date" element={<DPPViewerPage />} />
        <Route path="/papers" element={
          <ProtectedRoute>
            <ErrorBoundary>
              <PapersPage />
            </ErrorBoundary>
          </ProtectedRoute>
        } />
        <Route path="/papers/explore" element={
          <ErrorBoundary>
            <ExplorePage />
          </ErrorBoundary>
        } />
        <Route path="/papers/board/:class/:subject/:year" element={
          <ProtectedRoute>
            <ErrorBoundary>
              <PaperViewPage />
            </ErrorBoundary>
          </ProtectedRoute>
        } />
        <Route path="/my-account" element={
          <ProtectedRoute>
            <MyAccount />
          </ProtectedRoute>
        } />

        {/* Optional: Not Found */}
        {/* <Route path="*" element={<NotFoundPage />} /> */}
      </Routes>

      {!hideFooter && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ErrorBoundary>
          <AppLayout />
        </ErrorBoundary>
      </AuthProvider>
    </BrowserRouter>
  );
}
