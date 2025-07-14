# 🛒 User-Specific Persistent Cart System

This document describes the implementation of a user-specific persistent cart system for the Sai Embroidery website, similar to Amazon, Flipkart, or Shopify.

## 🎯 Features

- **User-specific carts**: Each logged-in user has their own isolated cart
- **Persistent storage**: Cart items are stored in Supabase and persist across sessions
- **Real-time sync**: Cart state automatically syncs with the database
- **Auth integration**: Cart automatically loads on login and clears on logout
- **Quantity management**: Add, update, and remove items with quantity controls
- **Error handling**: Comprehensive error handling with user feedback

## 🗄️ Database Schema

### Cart Table Structure

```sql
CREATE TABLE public.cart (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    design_id INTEGER NOT NULL REFERENCES public.designs(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
```

### Key Features:
- **Unique constraint**: Prevents duplicate items for the same user and design
- **Foreign keys**: Links to users and designs tables with cascade delete
- **Row Level Security (RLS)**: Users can only access their own cart items
- **Automatic timestamps**: Created and updated timestamps are managed automatically

## 🚀 Setup Instructions

### 1. Database Migration

Run the SQL migration to create the cart table:

```bash
# Apply the migration to your Supabase project
supabase db push
```

Or manually execute the SQL in `supabase/migrations/20241201000000_create_cart_table.sql`

### 2. Update Supabase Types

The TypeScript types are already updated in `src/integrations/supabase/types.ts` to include the cart table schema.

### 3. Install Dependencies

Make sure you have the required dependencies:

```bash
npm install @supabase/supabase-js sonner
```

## 📁 File Structure

```
src/
├── integrations/supabase/
│   ├── client.ts              # Supabase client configuration
│   ├── types.ts               # TypeScript types for database
│   └── cartService.ts         # Cart service with all database operations
├── hooks/
│   └── useCart.tsx            # React hook for cart state management
├── components/
│   ├── DesignCard.tsx         # Updated with "Add to Cart" button
│   └── Header.tsx             # Updated with cart count badge
├── pages/
│   └── Cart.tsx               # Complete cart page with full functionality
└── App.tsx                    # Updated with CartProvider
```

## 🔧 Usage Examples

### Basic Cart Operations

```tsx
import { useCart } from '@/hooks/useCart';

function MyComponent() {
  const { 
    cartItems, 
    cartItemCount, 
    cartTotalQuantity,
    addToCart, 
    updateCartItem, 
    removeFromCart, 
    clearCart,
    isLoading,
    error 
  } = useCart();

  // Add a design to cart
  const handleAddToCart = async (designId: number) => {
    try {
      await addToCart(designId, 1);
      toast.success('Added to cart!');
    } catch (error) {
      toast.error('Failed to add to cart');
    }
  };

  // Update quantity
  const handleUpdateQuantity = async (cartItemId: string, quantity: number) => {
    await updateCartItem(cartItemId, quantity);
  };

  // Remove item
  const handleRemoveItem = async (cartItemId: string) => {
    await removeFromCart(cartItemId);
  };

  return (
    <div>
      <p>Cart Items: {cartItemCount}</p>
      <p>Total Quantity: {cartTotalQuantity}</p>
      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
    </div>
  );
}
```

### Add to Cart Button

```tsx
import { useCart } from '@/hooks/useCart';
import { toast } from 'sonner';

function AddToCartButton({ designId, designNo }) {
  const { addToCart, isLoading } = useCart();

  const handleAddToCart = async (e) => {
    e.stopPropagation(); // Prevent navigation if button is in a card
    
    try {
      await addToCart(designId, 1);
      toast.success(`Added ${designNo} to cart!`);
    } catch (error) {
      toast.error('Failed to add to cart. Please try again.');
    }
  };

  return (
    <Button 
      onClick={handleAddToCart}
      disabled={isLoading}
    >
      {isLoading ? 'Adding...' : 'Add to Cart'}
    </Button>
  );
}
```

### Cart Badge in Header

```tsx
import { useCart } from '@/hooks/useCart';

function CartBadge() {
  const { cartTotalQuantity } = useCart();

  return (
    <div className="relative">
      <ShoppingCart className="h-6 w-6" />
      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[20px] text-center">
        {cartTotalQuantity}
      </span>
    </div>
  );
}
```

## 🔄 Cart Service API

The `CartService` class provides all database operations:

### Methods

- `getCartItems()`: Fetch all cart items for current user with design details
- `addToCart(designId, quantity)`: Add design to cart or update quantity if exists
- `updateCartItem(cartItemId, quantity)`: Update quantity of a cart item
- `removeFromCart(cartItemId)`: Remove an item from cart
- `clearCart()`: Clear all items from user's cart
- `getCartItemCount()`: Get number of unique items in cart
- `getCartTotalQuantity()`: Get total quantity of all items

### Error Handling

All methods include comprehensive error handling and will throw errors that can be caught and handled by the UI layer.

## 🔐 Security Features

### Row Level Security (RLS)

The cart table has RLS enabled with policies that ensure:

- Users can only view their own cart items
- Users can only insert cart items for themselves
- Users can only update their own cart items
- Users can only delete their own cart items

### Authentication Integration

- Cart automatically loads when user logs in
- Cart automatically clears when user logs out
- All operations require authentication
- Graceful handling of unauthenticated users

## 🎨 UI Components

### DesignCard Component
- Updated with "Add to Cart" button
- Prevents navigation when clicking the button
- Shows loading state during cart operations
- Displays success/error toasts

### Header Component
- Shows cart count badge
- Links to cart page
- Updates in real-time as cart changes

### Cart Page
- Complete cart management interface
- Quantity controls with +/- buttons
- Remove individual items
- Clear entire cart
- Order summary with totals
- Responsive design for mobile and desktop

## 🚨 Error Handling

The system includes comprehensive error handling:

1. **Network errors**: Graceful fallbacks and retry mechanisms
2. **Authentication errors**: Redirect to login when needed
3. **Database errors**: User-friendly error messages
4. **Validation errors**: Input validation and constraints
5. **UI feedback**: Toast notifications for all operations

## 🔧 Configuration

### Environment Variables

Make sure your Supabase configuration is set up in `src/integrations/supabase/client.ts`:

```typescript
const SUPABASE_URL = "your-supabase-url";
const SUPABASE_PUBLISHABLE_KEY = "your-supabase-anon-key";
```

### Toast Notifications

The system uses the `sonner` library for toast notifications. Make sure it's configured in your app:

```tsx
import { Toaster } from 'sonner';

function App() {
  return (
    <>
      {/* Your app content */}
      <Toaster />
    </>
  );
}
```

## 🧪 Testing

To test the cart system:

1. **Login/Logout**: Verify cart loads on login and clears on logout
2. **Add items**: Add designs to cart and verify they persist
3. **Update quantities**: Change quantities and verify updates
4. **Remove items**: Remove items and verify they're deleted
5. **Clear cart**: Clear entire cart and verify all items are removed
6. **Multiple users**: Test with different users to verify isolation

## 🚀 Deployment

1. Apply the database migration to your production Supabase project
2. Deploy the updated code
3. Test all cart functionality in production
4. Monitor for any errors or issues

## 📝 Notes

- The cart system is designed to be scalable and maintainable
- All database operations are optimized with proper indexing
- The UI provides immediate feedback for all user actions
- The system gracefully handles edge cases and errors
- Cart state is automatically synchronized across browser tabs/windows

## 🤝 Contributing

When making changes to the cart system:

1. Update the database schema if needed
2. Update TypeScript types
3. Update the cart service
4. Update the React hook
5. Update UI components
6. Test thoroughly
7. Update this documentation 