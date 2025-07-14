import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import Index from "./pages/Index";
import Designs from "./pages/Designs";
import AboutUs from "./pages/AboutUs";
import Contact from "./pages/Contact";
import DesignDetail from "./pages/DesignDetail";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import FloatingWhatsApp from "./components/FloatingWhatsApp";
import HelpCenter from "./pages/HelpCenter";
import { UserProvider } from '@/hooks/useUser';
import { CartProvider } from '@/hooks/useCart';
import Profile from "./pages/Profile";
import UserAddressForm from "./pages/UserAddressForm";
import EditUserAddressForm from "./pages/EditUserAddressForm";
import Cart from "./pages/Cart";
import AdminLoginPage from "./components/AdminLoginModal";
import ShippingPolicy from "./pages/ShippingPolicy";
import ReturnPolicy from "./pages/ReturnPolicy";
import TermsAndConditions from "./pages/TermsAndConditions";
import PrivacyPolicy from "./pages/PrivacyPolicy";

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
    <>
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
        <Route path="/shipping-policy" element={<ShippingPolicy />} />
        <Route path="/return-policy" element={<ReturnPolicy />} />
        <Route path="/terms&conditions" element={<TermsAndConditions />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {!isAdminPage && <FloatingWhatsApp />}
    </>
  );
};

export default App;
