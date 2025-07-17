import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import React, { Suspense, lazy } from "react";
import { UserProvider } from '@/hooks/useUser';
import { CartProvider } from '@/hooks/useCart';
import BottomNavBar from './components/BottomNavBar';

const Index = lazy(() => import("./pages/Index"));
const Designs = lazy(() => import("./pages/Designs"));
const AboutUs = lazy(() => import("./pages/AboutUs"));
const Contact = lazy(() => import("./pages/Contact"));
const DesignDetail = lazy(() => import("./pages/DesignDetail"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const NotFound = lazy(() => import("./pages/NotFound"));
const FloatingWhatsApp = lazy(() => import("./components/FloatingWhatsApp"));
const HelpCenter = lazy(() => import("./pages/HelpCenter"));
const Profile = lazy(() => import("./pages/Profile"));
const UserAddressForm = lazy(() => import("./pages/UserAddressForm"));
const EditUserAddressForm = lazy(() => import("./pages/EditUserAddressForm"));
const Cart = lazy(() => import("./pages/Cart"));
const AdminLoginPage = lazy(() => import("./components/AdminLoginModal"));
const ShippingPolicy = lazy(() => import("./pages/ShippingPolicy"));
const ReturnPolicy = lazy(() => import("./pages/ReturnPolicy"));
const TermsAndConditions = lazy(() => import("./pages/TermsAndConditions"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const Checkout = lazy(() => import("./pages/Checkout"));
const Orders = lazy(() => import("./pages/Orders"));

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <UserProvider>
          <CartProvider>
            <BrowserRouter>
              <AppRoutes />
              <BottomNavBar />
            </BrowserRouter>
          </CartProvider>
        </UserProvider>
        <Analytics />
      </TooltipProvider>
    </QueryClientProvider>
  );
};

const AppRoutes = () => {
  const location = useLocation();
  const isAdminPage = location.pathname === '/admin';

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-lg">Loading...</div>}>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/designs" element={<Designs />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/design/:id" element={<DesignDetail />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/admin-login" element={<AdminLoginPage />} />
        <Route path="/help" element={<HelpCenter />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/user_address_form" element={<UserAddressForm />} />
        <Route path="/edit_address/:id" element={<EditUserAddressForm />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/shipping-policy" element={<ShippingPolicy />} />
        <Route path="/return-policy" element={<ReturnPolicy />} />
        <Route path="/terms&conditions" element={<TermsAndConditions />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {!isAdminPage && <FloatingWhatsApp />}
    </Suspense>
  );
};

export default App;
