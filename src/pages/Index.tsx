
import React from 'react';
import Header from '@/components/Header';
import HeroCarousel from '@/components/HeroCarousel';
import ShopByCollections from '@/components/ShopByCollections';
import AboutUsSection from '@/components/AboutUsSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <HeroCarousel />
      <ShopByCollections />
      <AboutUsSection />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;
