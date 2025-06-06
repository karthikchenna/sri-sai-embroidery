import React from 'react';
import { BsWhatsapp } from 'react-icons/bs';

const FloatingWhatsApp = () => {
  return (
    <a
      href="https://wa.me/919951455102?text=Hi!%20I%27m%20contacting%20you%20via%20the%20Sri%20Sai%20Embroidery%20website%20regarding%20your%20embroidery%20services."
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-colors duration-300 z-50"
      aria-label="Contact on WhatsApp"
    >
      <BsWhatsapp className="h-6 w-6" />
    </a>
  );
};

export default FloatingWhatsApp; 