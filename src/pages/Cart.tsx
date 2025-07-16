import React from 'react';
import { useCart } from '@/hooks/useCart';
import { useUser } from '@/hooks/useUser';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Loader2, ShoppingBag, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const Cart: React.FC = () => {
  const { cartItems, removeFromCart, clearCart, cartItemCount, updateCartItem, isLoading } = useCart();
  const { user } = useUser();
  const navigate = useNavigate();
  
  const subtotal = cartItems.reduce((sum, item) => sum + (item.design.price || 0) * item.quantity, 0);
  const shipping = 0;
  const total = subtotal + shipping;

  // Total quantity of all designs in cart
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleQuantityChange = async (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    try {
      await updateCartItem(id, newQuantity);
    } catch (error) {
      toast.error('Failed to update quantity. Please try again.');
    }
  };

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your entire cart?')) {
      await clearCart();
    }
  };

  // Redirect to login if not authenticated
  if (!user) {
    return (
      <>
        <Header />
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <ShoppingBag className="h-16 w-16 text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold mb-4">Please Log In</h2>
          <p className="text-gray-600 mb-6">You need to be logged in to view your cart.</p>
          <Button onClick={() => navigate('/')}>Go to Home</Button>
        </div>
      </>
    );
  }

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600 mb-4" />
          <p className="text-gray-600">Loading your cart...</p>
          <p className="text-gray-600 mb-6">Please refresh the page if you don't see recent added items.</p>
        </div>
      </>
    );
  }

  if (cartItems.length === 0) {
    return (
      <>
        <Header />
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <ShoppingBag className="h-16 w-16 text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold mb-4">Your Cart is Empty</h2>
          <p className="text-gray-600 mb-6">Start shopping to add designs to your cart.</p>
          {/* <p className="text-gray-600 mb-6">Please refresh the page if you don't see recent added items.</p> */}
          <Button onClick={() => navigate('/designs')} className="bg-purple-600 hover:bg-purple-700">
            Browse Designs
          </Button>
        </div>
      </>
    );
  }

  // Razorpay demo checkout handler
  const handleCheckout = () => {
    const options = {
      key: "rzp_test_n3YPzOoCrq26tE", // Provided Razorpay Test Key ID
      amount: 50000, // Amount in paise (₹500.00)
      currency: "INR",
      name: "Sri Sai Embroidery",
      description: "Test Transaction",
      image: "/public/Assets/Logo.png", // Optional: your logo
      handler: function (response: any) {
        alert("Payment successful! Payment ID: " + response.razorpay_payment_id);
        // You can also send this response to your backend for verification
      },
      prefill: {
        name: "Test User",
        email: "test@example.com",
        contact: "9999999999"
      },
      theme: {
        color: "#8b5cf6"
      }
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  };

  return (
    <>
      <Header />
      <div className="min-h-[60vh] bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <Card className="w-full max-w-6xl mx-auto p-6 shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-purple-700">Shopping Cart</h2>
              <div className="text-lg font-medium text-gray-700">
                {totalItems} item{totalItems > 1 ? 's' : ''} in your cart
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full border-separate border-spacing-y-2">
                <thead>
                  <tr className="bg-gray-100 text-gray-700">
                    <th className="p-3 text-left font-semibold">Product</th>
                    <th className="p-3 text-left font-semibold">Design</th>
                    <th className="p-3 text-left font-semibold">Price</th>
                    <th className="p-3 text-left font-semibold">Quantity</th>
                    <th className="p-3 text-left font-semibold">Total</th>
                    <th className="p-3 text-left font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map(item => (
                    <tr key={item.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                      <td className="p-3">
                        {item.design.main_image_url && (
                          <img 
                            src={item.design.main_image_url} 
                            alt={item.design.design_no || 'Design'} 
                            className="w-20 h-20 object-cover rounded-lg border"
                          />
                        )}
                      </td>
                      <td className="p-3">
                        <div>
                          <div className="font-semibold text-gray-800">{item.design.design_no}</div>
                          {item.design.category && (
                            <div className="text-sm text-gray-600">{item.design.category}</div>
                          )}
                        </div>
                      </td>
                      <td className="p-3 font-semibold text-gray-800">₹{item.design.price?.toLocaleString()}</td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-8 w-8 p-0" 
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)} 
                            disabled={item.quantity <= 1}
                          >
                            -
                          </Button>
                          <Input
                            type="number"
                            min={1}
                            value={item.quantity}
                            onChange={e => handleQuantityChange(item.id, Number(e.target.value))}
                            className="w-16 text-center no-spinner"
                          />
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-8 w-8 p-0" 
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          >
                            +
                          </Button>
                        </div>
                      </td>
                      <td className="p-3 font-bold text-purple-600">
                        ₹{((item.design.price || 0) * item.quantity).toLocaleString()}
                      </td>
                      <td className="p-3">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => removeFromCart(item.id)} 
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mt-8 gap-6">
              <div className="flex gap-4">
                <Button 
                  variant="outline" 
                  onClick={handleClearCart}
                  className="text-red-600 border-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear Cart
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/designs')}
                  className="border-purple-600 text-purple-600 hover:bg-purple-50"
                >
                  Continue Shopping
                </Button>
              </div>
              
              <div className="w-full lg:w-80 bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4 text-gray-800">Order Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Items ({totalItems})</span>
                    <span className="font-medium">₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="text-green-600 font-medium">Free</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between font-bold text-xl">
                      <span>Total</span>
                      <span className="text-purple-600">₹{total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                <Button 
                  className="w-full mt-6 bg-purple-600 hover:bg-purple-700 text-lg py-3" 
                  onClick={() => navigate('/checkout')}
                >
                  Proceed to Checkout
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Cart; 