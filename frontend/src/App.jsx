import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ProtectedRoute, AdminRoute, GuestRoute } from './components/ProtectedRoute';
import LoadingSpinner from './components/LoadingSpinner';
import AdminLayout from './layouts/AdminLayout';

const Home = lazy(() => import('./pages/Home'));
const Register = lazy(() => import('./pages/Register'));
const Login = lazy(() => import('./pages/Login'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const ResetPasswordOtp = lazy(() => import('./pages/ResetPasswordOtp'));
const VerifyOtp = lazy(() => import('./pages/VerifyOtp'));
const VerifyEmail = lazy(() => import('./pages/VerifyEmail'));
const Products = lazy(() => import('./pages/Products'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Cart = lazy(() => import('./pages/Cart'));
const Orders = lazy(() => import('./pages/Orders'));
const GoogleAuthSuccess = lazy(() => import('./pages/GoogleAuthSuccess'));
const ProfileSetup = lazy(() => import('./pages/ProfileSetup'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers'));

const PageLoader = () => (
  <div className="flex min-h-[50vh] items-center justify-center">
    <LoadingSpinner />
  </div>
);

const App = () => (
  <AuthProvider>
    <CartProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1e3a5f',
              color: '#f8f6f3',
            },
          }}
        />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />

            <Route
              path="/register"
              element={
                <GuestRoute>
                  <Register />
                </GuestRoute>
              }
            />
            <Route
              path="/login"
              element={
                <GuestRoute>
                  <Login />
                </GuestRoute>
              }
            />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:slug" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password-otp" element={<ResetPasswordOtp />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/verify-otp" element={<VerifyOtp />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/auth/google/success" element={<GoogleAuthSuccess />} />

            <Route
              path="/profile/setup"
              element={
                <ProtectedRoute skipProfileCheck>
                  <ProfileSetup />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminLayout />
                </AdminRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<AdminUsers />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </CartProvider>
  </AuthProvider>
);

export default App;
