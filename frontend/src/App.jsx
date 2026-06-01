import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ProtectedRoute, AdminRoute, GuestRoute } from './components/ProtectedRoute';
import AdminLayout from './layouts/AdminLayout';

import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import ResetPasswordOtp from './pages/ResetPasswordOtp';
import VerifyOtp from './pages/VerifyOtp';
import VerifyEmail from './pages/VerifyEmail';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import GoogleAuthSuccess from './pages/GoogleAuthSuccess';
import ProfileSetup from './pages/ProfileSetup';
import Dashboard from './pages/Dashboard';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';

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
    </BrowserRouter>
    </CartProvider>
  </AuthProvider>
);

export default App;
