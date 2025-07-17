import React from 'react';
import { BsWhatsapp } from 'react-icons/bs';

const FloatingWhatsApp = () => {
  return (
    <a
      href="https://wa.me/919951455102?text=Hi!%20I%27m%20contacting%20you%20via%20the%20Sri%20Sai%20Embroidery%20website%20regarding%20your%20embroidery%20services."
      target="_blank"
      rel="noopener noreferrer"
      className="fixed right-6 z-50 bg-green-500 rounded-full shadow-lg p-3 hover:bg-green-600 transition-colors duration-200 md:bottom-6 mb-20 md:mb-0"
      style={{ bottom: '1rem' }}
      aria-label="Chat on WhatsApp"
    >
      <BsWhatsapp className="h-7 w-7 text-white" />
    </a>
  );
};

export default FloatingWhatsApp; 