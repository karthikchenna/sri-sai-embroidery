import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { User, ShoppingCart, Menu, X, Instagram, Phone, Mail, MapPin, Lock, Headset } from 'lucide-react';
import { BsWhatsapp } from 'react-icons/bs';

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleQuickLinkClick = (path: string) => {
    if (path === '/' && location.pathname === '/') {
      // If already on home page, smooth scroll to top
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    } else {
      // For other pages, navigate and scroll to top
      window.scrollTo(0, 0);
      navigate(path);
    }
  };

  return (
    <>
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div>
              <div className="flex flex-col items-start mb-1">
                <img 
                  src="/Assets/Logo.png" 
                  alt="Sri Sai Embroidery Logo" 
                  className="h-20 w-20 object-contain mb-2"
                />
                <h3 className="text-xl font-bold">Sri Sai Embroidery</h3>
              </div>
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
                <li>
                  <button 
                    onClick={() => handleQuickLinkClick('/')}
                    className="text-gray-300 hover:text-white"
                  >
                    Home
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => handleQuickLinkClick('/designs')}
                    className="text-gray-300 hover:text-white"
                  >
                    Designs
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => handleQuickLinkClick('/about')}
                    className="text-gray-300 hover:text-white"
                  >
                    About Us
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => handleQuickLinkClick('/contact')}
                    className="text-gray-300 hover:text-white"
                  >
                    Contact
                  </button>
                </li>
              </ul>
            </div>

            {/* Customer Service */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Customer Service</h4>
              <ul className="space-y-2">
                <li>
                  <button 
                    onClick={() => handleQuickLinkClick('/shipping-policy')}
                    className="text-gray-300 hover:text-white"
                  >
                    Shipping Policy
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => handleQuickLinkClick('/return-policy')}
                    className="text-gray-300 hover:text-white"
                  >
                    Return Policy
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => handleQuickLinkClick('/terms&conditions')}
                    className="text-gray-300 hover:text-white"
                  >
                    Terms of Service
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => handleQuickLinkClick('/privacy-policy')}
                    className="text-gray-300 hover:text-white"
                  >
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => handleQuickLinkClick('/help')}
                    className="text-gray-300 hover:text-white flex items-center gap-2"
                  >
                    <Headset className="h-5 w-5" />
                    Help Center
                  </button>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
              <div className="space-y-2 text-gray-300">
                <p>
                  <a href="https://maps.app.goo.gl/F8Ms9Vs4hNVt9f1s6" target="_blank" rel="noopener noreferrer" className="hover:text-white flex items-start">
                    <MapPin className="h-5 w-5 mr-2 mt-0.5 shrink-0" />
                    Beside ZPHS, Siripuram, Dist: Sangareddy. PIN:502314
                  </a>
                </p>
                {/* <p>
                  <a href="mailto:contact.srisaiembroidery@gmail.com" className="hover:text-white flex items-center">
                    <Mail className="h-5 w-5 mr-2" />
                    contact.srisaiembroidery@gmail.com
                  </a>
                </p> */}
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
              © 2025 Sri Sai Embroidery. All rights reserved. | <a href="https://karthikchenna.github.io/Portfolio/" className="font-bold  bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent" target="_blank" rel="noopener noreferrer">Created by Karthik</a>
              {/* {new Date().getFullYear()}  */}
            </p>
            <button
              onClick={() => navigate('/admin-login')}
              className="mt-2 text-sm text-white  hover:underline  flex items-center justify-center space-x-1 block mx-auto"
            >
              <Lock className="h-3 w-3" />
              <span>Admin Login</span>
            </button>
          </div>
        </div>
      </footer>

    </>
  );
};

export default Footer;
