
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AboutUsSection from '@/components/AboutUsSection';

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <AboutUsSection />
      <Footer />
    </div>
  );
};

export default AboutUs;
