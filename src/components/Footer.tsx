
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Phone, Mail, MapPin } from 'lucide-react';
import AdminLoginModal from './AdminLoginModal';

const Footer = () => {
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  return (
    <>
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div>
              <h3 className="text-xl font-bold mb-4">Sri Sai Embroidery</h3>
              <p className="text-gray-300 mb-4">
                Premium embroidery designs celebrating artistry, culture, and individuality.
              </p>
              <div className="flex space-x-4">
                <Instagram className="h-5 w-5 text-gray-300 hover:text-white cursor-pointer" />
                <Phone className="h-5 w-5 text-gray-300 hover:text-white cursor-pointer" />
                <Mail className="h-5 w-5 text-gray-300 hover:text-white cursor-pointer" />
                <MapPin className="h-5 w-5 text-gray-300 hover:text-white cursor-pointer" />
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link to="/" className="text-gray-300 hover:text-white">Home</Link></li>
                <li><Link to="/designs" className="text-gray-300 hover:text-white">Designs</Link></li>
                <li><Link to="/about" className="text-gray-300 hover:text-white">About Us</Link></li>
                <li><Link to="/contact" className="text-gray-300 hover:text-white">Contact</Link></li>
              </ul>
            </div>

            {/* Customer Service */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Customer Service</h4>
              <ul className="space-y-2">
                <li><span className="text-gray-300">Shipping Policy</span></li>
                <li><span className="text-gray-300">Return Policy</span></li>
                <li><span className="text-gray-300">Terms of Service</span></li>
                <li><span className="text-gray-300">Privacy Policy</span></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
              <div className="space-y-2 text-gray-300">
                <p>Beside ZPHS, Siripuram, Sangaredddy Dist. PIN:502314</p>
                <p>contact@saisaienbroidery.com</p>
                <p>+91 8008105796, +91 9951455102</p>
                <p>@saisaienbroidery</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p className="text-gray-300">
              © 2025 Sri Sai Embroidery. All rights reserved. | Created by Karthik
            </p>
            <button
              onClick={() => setShowAdminLogin(true)}
              className="mt-2 text-purple-400 hover:text-purple-300 underline"
            >
              Admin Login
            </button>
          </div>
        </div>
      </footer>

      <AdminLoginModal 
        isOpen={showAdminLogin} 
        onClose={() => setShowAdminLogin(false)} 
      />
    </>
  );
};

export default Footer;
