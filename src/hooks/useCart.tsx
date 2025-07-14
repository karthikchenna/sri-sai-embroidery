import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '../integrations/supabase/client';
import { CartService, CartItemWithDesign } from '../integrations/supabase/cartService';

interface CartContextType {
  cartItems: CartItemWithDesign[];
  cartItemCount: number;
  cartTotalQuantity: number;
  isLoading: boolean;
  error: string | null;
  addToCart: (designId: number, quantity?: number) => Promise<void>;
  updateCartItem: (cartItemId: string, quantity: number) => Promise<void>;
  removeFromCart: (cartItemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItemWithDesign[]>([]);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [cartTotalQuantity, setCartTotalQuantity] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch cart items from Supabase
  const fetchCartItems = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const items = await CartService.getCartItems();
      setCartItems(items);
      setCartItemCount(items.length);
      setCartTotalQuantity(items.reduce((total, item) => total + item.quantity, 0));
    } catch (err) {
      console.error('Error fetching cart items:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch cart items');
    } finally {
      setIsLoading(false);
    }
  };

  // Add item to cart
  const addToCart = async (designId: number, quantity: number = 1) => {
    try {
      setError(null);
      const newItem = await CartService.addToCart(designId, quantity);
      
      if (newItem) {
        // Update cart items by replacing the item if it exists, or adding it
        setCartItems(prevItems => {
          const existingIndex = prevItems.findIndex(item => item.design_id === designId);
          const wasNewItem = existingIndex === -1;
          
          if (existingIndex >= 0) {
            const updated = [...prevItems];
            updated[existingIndex] = newItem;
            return updated;
          } else {
            return [newItem, ...prevItems];
          }
        });
        
        // Update counts - check if item was new or existing
        setCartItems(prevItems => {
          const existingIndex = prevItems.findIndex(item => item.design_id === designId);
          const wasNewItem = existingIndex === -1;
          
          if (wasNewItem) {
            setCartItemCount(prev => prev + 1);
          }
          setCartTotalQuantity(prev => prev + quantity);
          return prevItems;
        });
      }
    } catch (err) {
      console.error('Error adding to cart:', err);
      setError(err instanceof Error ? err.message : 'Failed to add item to cart');
    }
  };

  // Update cart item quantity
  const updateCartItem = async (cartItemId: string, quantity: number) => {
    try {
      setError(null);
      const updatedItem = await CartService.updateCartItem(cartItemId, quantity);
      
      if (updatedItem) {
        // Update cart items
        setCartItems(prevItems => 
          prevItems.map(item => 
            item.id === cartItemId ? updatedItem : item
          )
        );
        
        // Update total quantity
        setCartTotalQuantity(prev => {
          const oldItem = cartItems.find(item => item.id === cartItemId);
          const oldQuantity = oldItem?.quantity || 0;
          return prev - oldQuantity + quantity;
        });
      } else {
        // Item was removed (quantity <= 0)
        setCartItems(prevItems => prevItems.filter(item => item.id !== cartItemId));
        setCartItemCount(prev => prev - 1);
        setCartTotalQuantity(prev => {
          const oldItem = cartItems.find(item => item.id === cartItemId);
          return prev - (oldItem?.quantity || 0);
        });
      }
    } catch (err) {
      console.error('Error updating cart item:', err);
      setError(err instanceof Error ? err.message : 'Failed to update cart item');
    }
  };

  // Remove item from cart
  const removeFromCart = async (cartItemId: string) => {
    try {
      setError(null);
      await CartService.removeFromCart(cartItemId);
      
      // Update cart items
      const removedItem = cartItems.find(item => item.id === cartItemId);
      setCartItems(prevItems => prevItems.filter(item => item.id !== cartItemId));
      setCartItemCount(prev => prev - 1);
      setCartTotalQuantity(prev => prev - (removedItem?.quantity || 0));
    } catch (err) {
      console.error('Error removing from cart:', err);
      setError(err instanceof Error ? err.message : 'Failed to remove item from cart');
    }
  };

  // Clear all items from cart
  const clearCart = async () => {
    try {
      setError(null);
      await CartService.clearCart();
      
      setCartItems([]);
      setCartItemCount(0);
      setCartTotalQuantity(0);
    } catch (err) {
      console.error('Error clearing cart:', err);
      setError(err instanceof Error ? err.message : 'Failed to clear cart');
    }
  };

  // Refresh cart (re-fetch from database)
  const refreshCart = async () => {
    await fetchCartItems();
  };

  // Listen for auth state changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          // User signed in - fetch their cart
          await fetchCartItems();
        } else if (event === 'SIGNED_OUT') {
          // User signed out - clear cart state
          setCartItems([]);
          setCartItemCount(0);
          setCartTotalQuantity(0);
          setError(null);
        }
      }
    );

    // Initial fetch if user is already signed in
    const checkInitialAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await fetchCartItems();
      }
    };
    
    checkInitialAuth();

    return () => subscription.unsubscribe();
  }, []);

  const value: CartContextType = {
    cartItems,
    cartItemCount,
    cartTotalQuantity,
    isLoading,
    error,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    refreshCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
} 