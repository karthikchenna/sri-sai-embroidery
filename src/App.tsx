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
import Profile from "./pages/Profile";
import UserAddressForm from "./pages/UserAddressForm";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <UserProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
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
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/help" element={<HelpCenter />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/user_address_form" element={<UserAddressForm />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {!isAdminPage && <FloatingWhatsApp />}
    </>
  );
};

export default App;
