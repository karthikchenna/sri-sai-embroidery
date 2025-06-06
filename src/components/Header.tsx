import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { User, ShoppingCart, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { name: 'Home', path: '/', sectionId: 'home' },
    { name: 'Designs', path: '/designs' },
    { name: 'About Us', path: '/about', sectionId: 'about' },
    { name: 'Contact', path: '/contact', sectionId: 'contact' },
  ];

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, path: string, sectionId?: string) => {
    if (sectionId && location.pathname === path) {
      // Smooth scroll only if on the target page and sectionId exists
      e.preventDefault();
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        // Update the URL hash without triggering a navigation
        if (location.hash !== `#${sectionId}`) {
           history.pushState(null, '', `#${sectionId}`);
        }
      }
    } else if (path !== location.pathname) {
      // Navigate to a different page
      navigate(sectionId ? `${path}#${sectionId}` : path);
    }
    // If sectionId exists and location.pathname === path, the default Link behavior will handle it.
    // If !sectionId and location.pathname === path, it's a link to the current page without a specific section, do nothing (or navigate to top if desired)

    setIsMobileMenuOpen(false);
  };

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold text-purple-800">
              Sri Sai Embroidery
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path} // Keep the original path for navigation
                onClick={(e) => {
                   handleSmoothScroll(e, item.path, item.sectionId);
                }}
                className={`relative text-gray-700 hover:text-purple-600 transition-colors duration-200 font-medium ${
                  location.pathname === item.path || (item.sectionId && location.hash === `#${item.sectionId}` && location.pathname === item.path)
                    ? 'text-purple-600'
                    : ''
                }`}
              >
                {item.name}
                {(location.pathname === item.path || (item.sectionId && location.hash === `#${item.sectionId}` && location.pathname === item.path)) && ( // Highlight if path matches or if on the same page with matching hash
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-purple-600 rounded-full" />
                )}
              </Link>
            ))}
          </nav>

          {/* Right Icons */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="hidden md:flex">
              <User className="h-5 w-5" />
            </Button>
            {/* <Button variant="ghost" size="sm" className="relative">
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                0
              </span>
            </Button> */}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation - This div is hidden/shown based on isMobileMenuOpen */}
        <div
          className={`md:hidden bg-gray-100/95 backdrop-blur-md shadow-lg rounded-b-lg transition-all duration-300 ease-in-out ${
            isMobileMenuOpen
              ? 'max-h-96 opacity-100 mt-4 py-2'
              : 'max-h-0 opacity-0 overflow-hidden'
          }`}
        >
          {/* Mobile Navigation Links - Styled for a modern stacked look */}
          <nav className="flex flex-col items-center space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path} // Keep the original path for navigation
                onClick={(e) => {
                    handleSmoothScroll(e, item.path, item.sectionId);
                }}
                className={`relative text-gray-700 hover:text-purple-600 transition-colors duration-200 font-medium px-4 py-2 rounded-md ${
                  location.pathname === item.path || (item.sectionId && location.hash === `#${item.sectionId}` && location.pathname === item.path)
                    ? 'text-purple-600 bg-purple-100' // Added background for active state
                    : ''
                }`}
              >
                {item.name}
                 {/* Active state indicator kept, though might be less necessary with background */}
                {(location.pathname === item.path || (item.sectionId && location.hash === `#${item.sectionId}` && location.pathname === item.path)) && ( // Highlight if path matches or if on the same page with matching hash
                  <span className="absolute -bottom-0 left-0 w-full h-0.5 bg-purple-600 rounded-full" />
                )}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
