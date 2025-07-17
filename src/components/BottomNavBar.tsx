import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Grid, ShoppingCart, List, User } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useUser } from '@/hooks/useUser';
import AuthModal from './AuthModal';

const navItems = [
  { label: 'Home', icon: Home, path: '/' },
  { label: 'Designs', icon: Grid, path: '/designs' },
  { label: 'Cart', icon: ShoppingCart, path: '/cart' },
  { label: 'Orders', icon: List, path: '/orders' },
  { label: 'User', icon: User, path: '/profile' },
];

const BottomNavBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItemCount } = useCart();
  const { user } = useUser();
  const [showAuthModal, setShowAuthModal] = React.useState(false);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 flex justify-between items-center px-2 py-1 md:hidden shadow-lg">
      {navItems.map((item, idx) => {
        const Icon = item.icon;
        const isActive = item.path === '/' ? location.pathname === '/' : location.pathname.startsWith(item.path);
        if (item.label === 'User') {
          return (
            <button
              key={item.label}
              onClick={() => {
                if (user) {
                  navigate(item.path);
                } else {
                  setShowAuthModal(true);
                }
              }}
              className={`flex flex-col items-center flex-1 py-1 px-2 focus:outline-none ${isActive ? 'text-purple-600' : 'text-gray-500'}`}
            >
              <span className="relative">
                <Icon className="h-6 w-6 mb-0.5" />
              </span>
              <span className="text-xs font-medium mt-0.5">{item.label}</span>
            </button>
          );
        }
        return (
          <button
            key={item.label}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center flex-1 py-1 px-2 focus:outline-none ${isActive ? 'text-purple-600' : 'text-gray-500'}`}
          >
            <span className="relative">
              <Icon className="h-6 w-6 mb-0.5" />
              {item.label === 'Cart' && cartItemCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-red-600 text-white text-[10px] font-bold rounded-full px-1 py-0.5 min-w-[14px] text-center leading-none">
                  {cartItemCount}
                </span>
              )}
            </span>
            <span className="text-xs font-medium mt-0.5">{item.label}</span>
          </button>
        );
      })}
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </nav>
  );
};

export default BottomNavBar; 