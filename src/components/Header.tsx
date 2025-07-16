import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { User, ShoppingCart, Menu, X, Search, LogOut, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import WhatsAppBanner from './WhatsAppBanner';
import { supabase } from '@/integrations/supabase/client';
import AuthModal from './AuthModal';
import { useUser } from '@/hooks/useUser';
import { toast } from '@/components/ui/sonner';
import { useCart } from '@/hooks/useCart';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useUser();
  const { cartItemCount } = useCart();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowUserDropdown(false);
      }
    }
    if (showUserDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
    return undefined;
  }, [showUserDropdown]);

  const navItems = [
    { name: 'Home', path: '/', sectionId: 'home' },
    { name: 'Designs', path: '/designs' },
    { name: 'About', path: '/about', sectionId: 'about' },
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Scroll to top before navigation
      window.scrollTo(0, 0);
      navigate(`/designs?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsSearchOpen(false);
    }
  };

  const fetchSuggestions = async (query: string) => {
    if (!query) {
      setSuggestions([]);
      return;
    }
    const { data, error } = await supabase
      .from('designs')
      .select('design_no')
      .ilike('design_no', `%${query}%`)
      .limit(5);
    if (!error && data) {
      setSuggestions(data.map((d: any) => d.design_no).filter(Boolean));
    }
  };

  return (
    <>
      <WhatsAppBanner />
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
              {/* Mobile Search Icon */}
              <div className="md:hidden">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsSearchOpen(true)}
                  className="h-9 w-9 p-0"
                >
                  <Search className="h-5 w-5 text-gray-600" />
                </Button>
              </div>

              {/* Desktop Search */}
              <div className="hidden md:flex items-center">
                <form onSubmit={handleSearch} className="relative group">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-purple-600 transition-colors duration-200" />
                  <Input
                    type="search"
                    placeholder="Search Designs..."
                    className="w-[200px] h-9 pl-9 pr-4 rounded-full border-gray-200 focus:border-purple-600 focus:ring-0 focus:outline-none transition-all duration-200 bg-gray-50/50 hover:bg-gray-50 focus:bg-white"
                    value={searchQuery}
                    onChange={async (e) => {
                      setSearchQuery(e.target.value);
                      setShowSuggestions(true);
                      await fetchSuggestions(e.target.value);
                    }}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
                    onFocus={async () => {
                      if (searchQuery) {
                        setShowSuggestions(true);
                        await fetchSuggestions(searchQuery);
                      }
                    }}
                  />
                  {showSuggestions && suggestions.length > 0 && (
                    <ul className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-56 overflow-y-auto">
                      {suggestions.map((suggestion, idx) => (
                        <li
                          key={idx}
                          className="px-4 py-2 cursor-pointer hover:bg-purple-100 text-gray-800"
                          onMouseDown={() => {
                            setSearchQuery("");
                            setShowSuggestions(false);
                            window.scrollTo(0, 0);
                            navigate(`/designs?search=${encodeURIComponent(suggestion)}`);
                          }}
                        >
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  )}
                </form>
              </div>

              {/* Cart Icon with Badge */}
              <Link to="/cart" className="relative flex items-center">
                <ShoppingCart className="h-5 w-5 text-gray-700 hover:text-purple-700 transition-colors duration-200" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-bold rounded-full px-1 py-0.5 min-w-[14px] text-center leading-none">
                    {cartItemCount}
                  </span>
                )}
              </Link>

              {/* User Login Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 w-9 p-0"
                  onClick={() => setShowUserDropdown((prev) => !prev)}
                  aria-label="User Menu"
                >
                  <User className="h-6 w-6 text-gray-600" />
                </Button>
                {showUserDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    {user ? (
                      <div className="p-4 flex flex-col items-start">
                        <div className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                          <User className="h-4 w-4" />
                          {user.user_metadata?.name || user.email}
                        </div>
                        <Button
                          variant="ghost"
                          className="w-full text-left flex items-center gap-2"
                          onClick={() => {
                            setShowUserDropdown(false);
                            navigate('/profile');
                          }}
                        >
                          <User className="h-4 w-4" /> Profile
                        </Button>
                        <Button
                          variant="ghost"
                          className="w-full text-left flex items-center gap-2"
                          onClick={() => {
                            setShowUserDropdown(false);
                            navigate('/cart');
                          }}
                        >
                          <ShoppingCart className="h-4 w-4" /> Cart
                        </Button>
                        <Button
                          variant="ghost"
                          className="w-full text-left flex items-center gap-2"
                          onClick={() => {
                            setShowUserDropdown(false);
                            navigate('/orders');
                          }}
                        >
                          <List className="h-4 w-4" /> My Orders
                        </Button>
                        <Button
                          variant="ghost"
                          className="w-full text-left flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white"
                          onClick={async () => {
                            await logout();
                            setShowUserDropdown(false);
                            toast.success('Logout successful');
                          }}
                        >
                          <LogOut className="h-4 w-4" /> Logout
                        </Button>
                      </div>
                    ) : (
                      <div className="p-4">
                        <Button
                          variant="default"
                          className="w-full"
                          onClick={() => {
                            setShowUserDropdown(false);
                            setShowAuthModal(true);
                          }}
                        >
                          Login
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="h-15 w-5" /> : <Menu className="h-5 w-5" />}
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

          {/* Search Dialog */}
          <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Search Designs</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSearch} className="relative group mt-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-purple-600 transition-colors duration-200" />
                <Input
                  type="search"
                  placeholder="Search Designs..."
                  className="w-full h-9 pl-9 pr-4 rounded-full border-gray-200 focus:border-purple-600 focus:ring-0 focus:outline-none transition-all duration-200 bg-gray-50/50 hover:bg-gray-50 focus:bg-white"
                  value={searchQuery}
                  onChange={async (e) => {
                    setSearchQuery(e.target.value);
                    setShowSuggestions(true);
                    await fetchSuggestions(e.target.value);
                  }}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
                  onFocus={async () => {
                    if (searchQuery) {
                      setShowSuggestions(true);
                      await fetchSuggestions(searchQuery);
                    }
                  }}
                  autoFocus
                />
                {showSuggestions && suggestions.length > 0 && (
                  <ul className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-56 overflow-y-auto">
                    {suggestions.map((suggestion, idx) => (
                      <li
                        key={idx}
                        className="px-4 py-2 cursor-pointer hover:bg-purple-100 text-gray-800"
                        onMouseDown={() => {
                          setSearchQuery("");
                          setShowSuggestions(false);
                          setIsSearchOpen(false);
                          window.scrollTo(0, 0);
                          navigate(`/designs?search=${encodeURIComponent(suggestion)}`);
                        }}
                      >
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                )}
              </form>
            </DialogContent>
          </Dialog>

          {/* User Login Modal */}
          {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
        </div>
      </header>
    </>
  );
};

export default Header;
