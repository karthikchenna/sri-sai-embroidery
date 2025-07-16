import React, { useEffect, useState, useRef } from 'react';
import { useUser } from '@/hooks/useUser';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { useCart } from '@/hooks/useCart';

interface Address {
  id: string;
  name: string;
  house_no: string;
  landmark: string;
  city: string;
  district: string;
  state: string;
  pincode: string;
  primary_mobile: string;
  secondary_mobile: string | null;
}

const initialForm = {
  name: '',
  house_no: '',
  landmark: '',
  city: '',
  district: '',
  state: '',
  pincode: '',
  primary_mobile: '',
  secondary_mobile: '',
};

const Checkout: React.FC = () => {
  const { user, loading } = useUser();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { cartItems, clearCart } = useCart();
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const razorpayLoaded = useRef(false);

  // Dynamically load Razorpay script if not present
  useEffect(() => {
    if (!razorpayLoaded.current) {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);
      script.onload = () => { razorpayLoaded.current = true; };
      return () => { document.body.removeChild(script); };
    }
  }, []);

  // Razorpay payment handler
  const handlePayment = () => {
    if (!user || !selectedAddressId || cartItems.length === 0) return;
    setOrderError(null);
    setOrderSuccess(false);
    const totalAmount = cartItems.reduce((sum, item) => sum + (item.design.price || 0) * item.quantity, 0);
    const options = {
      key: 'rzp_test_ZrCJYDNBMF4ZtM', // Updated Razorpay test key
      amount: totalAmount * 100, // in paise
      currency: 'INR',
      name: 'Sri Sai Embroidery',
      description: 'Order Payment',
      handler: async function (response: any) {
        setOrderLoading(true);
        setOrderError(null);
        try {
          for (const item of cartItems) {
            // 1. Get date parts
            const now = new Date();
            const year = String(now.getFullYear()).slice(-2);
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');
            // 2. Map category to code
            const categoryMap: Record<string, string> = {
              'budget-friendly': 'BF',
              'exclusive': 'EX',
              'mirror-work': 'MW',
              'lines-design': 'LD',
              'hand-all-over': 'HA',
              'kutch-work': 'KW',
              'bridal': 'BR',
              'embroidery-frames': 'EF',
            };
            const category = item.design.category;
            const categoryCode = categoryMap[category] || 'XX';
            // 3. Query for count of orders for this category (all time)
            const { count } = await supabase
              .from('orders')
              .select('id', { count: 'exact', head: true })
              .eq('category', category);
            const sequence = (count || 0) + 1;
            const sequenceStr = String(sequence).padStart(3, '0');
            // 4. Build custom order id with random suffix for uniqueness
            const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
            const customOrderId = `${year}${month}${day}-${categoryCode}-${sequenceStr}-${randomSuffix}`;
            // Log all values before insert
            const orderPayload = {
              user_id: user.id,
              address_id: selectedAddressId,
              design_no: item.design.design_no,
              quantity: item.quantity,
              price: item.design.price,
              payment_status: 'success',
              custom_order_id: customOrderId,
            };
            console.log('Order insert payload:', orderPayload);
            // Check for missing required fields
            if (!orderPayload.user_id || !orderPayload.address_id || !orderPayload.design_no || !orderPayload.quantity || orderPayload.price == null) {
              setOrderError('Order insert failed: Missing required field.');
              console.error('Order insert failed: Missing required field.', orderPayload);
              throw new Error('Order insert failed: Missing required field.');
            }
            // 5. Insert order with custom_order_id
            const { error } = await supabase.from('orders').insert(orderPayload);
            if (error) {
              console.error('Order insert error:', error, orderPayload);
              setOrderError('Order insert failed: ' + (error.message || 'Unknown error'));
              throw error;
            }
          }
          await clearCart();
          setOrderSuccess(true);
        } catch (err: any) {
          setOrderError('Failed to place order. Please try again. ' + (err?.message || ''));
          console.error('Order placement error:', err);
        } finally {
          setOrderLoading(false);
        }
      },
      prefill: {
        name: user.user_metadata?.name || '',
        email: user.email || '',
        contact: ''
      },
      theme: { color: '#8b5cf6' },
      modal: {
        ondismiss: function () {
          setOrderError('Payment Failed, please try again');
        }
      }
    };
    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  };

  useEffect(() => {
    const fetchAddresses = async () => {
      if (!user) return;
      const { data, error } = await supabase
        .from('user_addresses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (!error && data) {
        setAddresses(data);
        if (data.length > 0) setSelectedAddressId(data[0].id);
      }
    };
    if (user) fetchAddresses();
  }, [user]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!user) {
      setFormError('You must be logged in to add an address.');
      return;
    }
    setFormLoading(true);
    const { error, data } = await supabase
      .from('user_addresses')
      .insert({ user_id: user.id, ...form })
      .select();
    setFormLoading(false);
    if (error) {
      setFormError('Failed to add address. Please try again.');
    } else if (data && data.length > 0) {
      setAddresses([data[0], ...addresses]);
      setSelectedAddressId(data[0].id);
      setShowAddForm(false);
      setForm(initialForm);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-[40vh]">Loading...</div>;
  }

  if (!user) {
    return <div className="flex flex-col items-center min-h-[40vh]">
      <p className="mb-4">You are not logged in.</p>
      <Button onClick={() => navigate('/')}>Go Home</Button>
    </div>;
  }

  return (
    <>
      <Header />
      <div className="flex justify-center items-center min-h-[90vh] bg-gradient-to-br from-purple-100 via-pink-50 to-white py-8 px-2">
        <Card className="w-full max-w-2xl shadow-2xl rounded-2xl border-0 bg-white p-0 overflow-hidden relative">
          <Button
            variant="outline"
            size="sm"
            className="absolute top-4 right-4 z-10"
            onClick={() => navigate(-1)}
          >
            ← Back
          </Button>
          <div className="p-8">
            <h2 className="text-2xl font-bold text-purple-700 mb-2">Checkout</h2>
            <div className="mb-6 text-lg text-gray-700">Hello, <span className="font-semibold">{user.user_metadata?.name || user.email}</span></div>
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">Select Delivery Address</h3>
            {addresses.length === 0 && <div className="text-gray-500 mb-2">No address found. Please add a delivery address.</div>}
            <div className="space-y-4 mb-4">
              {addresses.map(addr => (
                <label key={addr.id} className="flex items-start gap-3 p-4 border rounded-lg cursor-pointer hover:shadow-md transition-shadow">
                  <input
                    type="radio"
                    name="selectedAddress"
                    checked={selectedAddressId === addr.id}
                    onChange={() => setSelectedAddressId(addr.id)}
                    className="mt-1"
                  />
                  <div>
                    <div className="font-semibold text-gray-800">{addr.name}</div>
                    <div className="text-gray-700 text-sm">{addr.house_no}, {addr.landmark}</div>
                    <div className="text-gray-700 text-sm">{addr.city}, {addr.district}, {addr.state} - {addr.pincode}</div>
                    <div className="text-gray-700 text-sm">Mobile: {addr.primary_mobile}{addr.secondary_mobile ? `, ${addr.secondary_mobile}` : ''}</div>
                  </div>
                </label>
              ))}
            </div>
            <Button className="mb-4 bg-purple-600 hover:bg-purple-700 text-white" onClick={() => setShowAddForm(v => !v)}>
              {showAddForm ? 'Cancel' : 'Add Address'}
            </Button>
            {showAddForm && (
              <form onSubmit={handleAddAddress} className="space-y-3 mb-4 bg-purple-50 p-4 rounded-lg">
                <div className="flex gap-2">
                  <input name="name" value={form.name} onChange={handleFormChange} required placeholder="Name" className="input input-bordered w-1/2 rounded px-3 py-2 border border-gray-300 focus:border-purple-500" />
                  <input name="house_no" value={form.house_no} onChange={handleFormChange} required placeholder="House No" className="input input-bordered w-1/2 rounded px-3 py-2 border border-gray-300 focus:border-purple-500" />
                </div>
                <input name="landmark" value={form.landmark} onChange={handleFormChange} placeholder="Landmark" className="input input-bordered w-full rounded px-3 py-2 border border-gray-300 focus:border-purple-500" />
                <div className="flex gap-2">
                  <input name="city" value={form.city} onChange={handleFormChange} required placeholder="City/Town" className="input input-bordered w-1/2 rounded px-3 py-2 border border-gray-300 focus:border-purple-500" />
                  <input name="district" value={form.district} onChange={handleFormChange} required placeholder="District" className="input input-bordered w-1/2 rounded px-3 py-2 border border-gray-300 focus:border-purple-500" />
                </div>
                <div className="flex gap-2">
                  <input name="state" value={form.state} onChange={handleFormChange} required placeholder="State" className="input input-bordered w-1/2 rounded px-3 py-2 border border-gray-300 focus:border-purple-500" />
                  <input name="pincode" value={form.pincode} onChange={handleFormChange} required placeholder="Pincode" className="input input-bordered w-1/2 rounded px-3 py-2 border border-gray-300 focus:border-purple-500" />
                </div>
                <div className="flex gap-2">
                  <input name="primary_mobile" value={form.primary_mobile} onChange={handleFormChange} required placeholder="Primary Mobile" className="input input-bordered w-1/2 rounded px-3 py-2 border border-gray-300 focus:border-purple-500" />
                  <input name="secondary_mobile" value={form.secondary_mobile} onChange={handleFormChange} placeholder="Secondary Mobile" className="input input-bordered w-1/2 rounded px-3 py-2 border border-gray-300 focus:border-purple-500" />
                </div>
                {formError && <div className="text-red-500 text-sm text-center">{formError}</div>}
                <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-lg shadow" disabled={formLoading}>
                  {formLoading ? 'Saving...' : 'Save Address'}
                </Button>
              </form>
            )}
            <Button 
              className="w-full bg-purple-600 hover:bg-purple-700 text-lg py-3 mt-4" 
              disabled={!selectedAddressId || orderLoading || cartItems.length === 0}
              onClick={handlePayment}
            >
              {orderLoading ? 'Processing Payment...' : 'Continue to Payment'}
            </Button>
            {orderError && <div className="text-red-500 text-sm text-center mt-2">{orderError}</div>}
            {orderSuccess && <div className="text-green-600 text-center mt-2 font-semibold">Order placed successfully!</div>}
          </div>
        </Card>
      </div>
    </>
  );
};

export default Checkout; 