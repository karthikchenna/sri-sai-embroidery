import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { User, ShoppingCart, Menu, X, Instagram, Phone, Mail, MapPin, Lock } from 'lucide-react';
import { BsWhatsapp } from 'react-icons/bs';
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
              <div className="flex space-x-4 mt-4">
                <a href="https://www.instagram.com/srisaiembrodiery/" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white cursor-pointer">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href="tel:+918008105796" className="text-gray-300 hover:text-white cursor-pointer">
                   {/* Using one phone icon for both numbers or primarily the first one here */}
                   <Phone className="h-5 w-5" />
                </a>
                 <a href="https://maps.app.goo.gl/F8Ms9Vs4hNVt9f1s6" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white cursor-pointer">
                   <MapPin className="h-5 w-5" />
                 </a>
                 {/* <a href="https://wa.me/919951455102?text=Hi!%20I%27m%20contacting%20you%20from%20Sri%20Sai%20Embroidery%20website" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white cursor-pointer"> */}
                 <a href="https://wa.me/919951455102?text=Hi!%20I%27m%20contacting%20you%20via%20the%20Sri%20Sai%20Embroidery%20website%20regarding%20your%20embroidery%20services." target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white cursor-pointer">
                   <BsWhatsapp className="h-5 w-5" />
                   
                 </a>
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
                <p>
                  <a href="https://maps.app.goo.gl/F8Ms9Vs4hNVt9f1s6" target="_blank" rel="noopener noreferrer" className="hover:text-white flex items-start">
                    <MapPin className="h-5 w-5 mr-2 mt-0.5 shrink-0" />
                    Beside ZPHS, Siripuram, Dist: Sangaredddy. PIN:502314
                  </a>
                </p>
                <p>
                  <a href="mailto:contact@saisaienbroidery.com" className="hover:text-white flex items-center">
                    <Mail className="h-5 w-5 mr-2" />
                    contact@saisaienbroidery.com
                  </a>
                </p>
                <p>
                  <a href="tel:+918008105796" className="hover:text-white flex items-center">
                    <Phone className="h-5 w-5 mr-2" />
                    +91 8008105796
                  </a>
                </p>
                 <p>
                  <a href="tel:+919951455102" className="hover:text-white flex items-center">
                    <Phone className="h-5 w-5 mr-2" />
                    +91 9951455102
                  </a>
                </p>
                <p>
                   <a href="https://www.instagram.com/srisaiembrodiery/" target="_blank" rel="noopener noreferrer" className="hover:text-white flex items-center">
                     <Instagram className="h-5 w-5 mr-2" />
                     @srisaiembroidery
                   </a>
                 </p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p className="text-gray-300">
              © 2025 Sri Sai Embroidery. All rights reserved. | <a href="https://karthikchenna.github.io/Portfolio/" className="font-bold hover:underline bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent" target="_blank" rel="noopener noreferrer">Created by Karthik</a>
            </p>
            <button
              onClick={() => setShowAdminLogin(true)}
              className="mt-2 text-white  hover:underline  flex items-center justify-center space-x-1 block mx-auto"
            >
              <Lock className="h-4 w-4" />
              <span>Admin Login</span>
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
