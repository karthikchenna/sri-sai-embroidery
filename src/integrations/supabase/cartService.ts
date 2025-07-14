import { supabase } from './client';
import type { Database } from './types';

type CartItem = Database['public']['Tables']['cart']['Row'];
type CartItemInsert = Database['public']['Tables']['cart']['Insert'];
type CartItemUpdate = Database['public']['Tables']['cart']['Update'];

export interface CartItemWithDesign extends CartItem {
  design: {
    id: number;
    design_no: string | null;
    main_image_url: string | null;
    price: number | null;
    category: string | null;
  };
}

export class CartService {
  /**
   * Fetch all cart items for the current user with design details
   */
  static async getCartItems(): Promise<CartItemWithDesign[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('cart')
        .select(`
          *,
          design:designs(
            id,
            design_no,
            main_image_url,
            price,
            category
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching cart items:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getCartItems:', error);
      throw error;
    }
  }

  /**
   * Add a design to cart or update quantity if already exists
   */
  static async addToCart(designId: number, quantity: number = 1): Promise<CartItemWithDesign | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Check if item already exists in cart
      const { data: existingItem } = await supabase
        .from('cart')
        .select('*')
        .eq('user_id', user.id)
        .eq('design_id', designId)
        .single();

      if (existingItem) {
        // Update quantity if item exists
        const newQuantity = existingItem.quantity + quantity;
        const result = await this.updateCartItem(existingItem.id, newQuantity);
        return result || null;
      } else {
        // Insert new item
        const { data, error } = await supabase
          .from('cart')
          .insert({
            user_id: user.id,
            design_id: designId,
            quantity
          })
          .select(`
            *,
            design:designs(
              id,
              design_no,
              main_image_url,
              price,
              category
            )
          `)
          .single();

        if (error) {
          console.error('Error adding to cart:', error);
          throw error;
        }

        return data;
      }
    } catch (error) {
      console.error('Error in addToCart:', error);
      throw error;
    }
  }

  /**
   * Update quantity of a cart item
   */
  static async updateCartItem(cartItemId: string, quantity: number): Promise<CartItemWithDesign | null> {
    try {
      if (quantity <= 0) {
        await this.removeFromCart(cartItemId);
        return null;
      }

      const { data, error } = await supabase
        .from('cart')
        .update({ quantity })
        .eq('id', cartItemId)
        .select(`
          *,
          design:designs(
            id,
            design_no,
            main_image_url,
            price,
            category
          )
        `)
        .single();

      if (error) {
        console.error('Error updating cart item:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in updateCartItem:', error);
      throw error;
    }
  }

  /**
   * Remove an item from cart
   */
  static async removeFromCart(cartItemId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('cart')
        .delete()
        .eq('id', cartItemId);

      if (error) {
        console.error('Error removing from cart:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error in removeFromCart:', error);
      throw error;
    }
  }

  /**
   * Clear all items from user's cart
   */
  static async clearCart(): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { error } = await supabase
        .from('cart')
        .delete()
        .eq('user_id', user.id);

      if (error) {
        console.error('Error clearing cart:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error in clearCart:', error);
      throw error;
    }
  }

  /**
   * Get cart item count for the current user
   */
  static async getCartItemCount(): Promise<number> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return 0;
      }

      const { count, error } = await supabase
        .from('cart')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      if (error) {
        console.error('Error getting cart count:', error);
        throw error;
      }

      return count || 0;
    } catch (error) {
      console.error('Error in getCartItemCount:', error);
      return 0;
    }
  }

  /**
   * Get total quantity of items in cart
   */
  static async getCartTotalQuantity(): Promise<number> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return 0;
      }

      const { data, error } = await supabase
        .from('cart')
        .select('quantity')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error getting cart total quantity:', error);
        throw error;
      }

      return data?.reduce((total, item) => total + item.quantity, 0) || 0;
    } catch (error) {
      console.error('Error in getCartTotalQuantity:', error);
      return 0;
    }
  }
} 