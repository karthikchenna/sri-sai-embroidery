import React, { useEffect, useState } from 'react';
import { useUser } from '@/hooks/useUser';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import AuthModal from '@/components/AuthModal';
import Header from '@/components/Header';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface Order {
  id: string;
  design_no: string;
  quantity: number;
  price: number;
  payment_status: string;
  address_id: string;
  created_at: string;
  custom_order_id?: string; // Added custom_order_id
}

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

const Orders: React.FC = () => {
  const { user, loading } = useUser();
  const [orders, setOrders] = useState<Order[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [fetching, setFetching] = useState(false);
  const navigate = useNavigate();
  const [designImages, setDesignImages] = useState<{ [design_no: string]: string | null }>({});

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      setFetching(true);
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false }); // descending order for recent first
      if (!error && data) setOrders(data);
      setFetching(false);
    };
    if (user) fetchOrders();
  }, [user]);

  useEffect(() => {
    const fetchAddresses = async () => {
      if (!user) return;
      const { data, error } = await supabase
        .from('user_addresses')
        .select('*')
        .eq('user_id', user.id);
      if (!error && data) setAddresses(data);
    };
    if (user) fetchAddresses();
  }, [user]);

  // Fetch design images for all orders
  useEffect(() => {
    const fetchImages = async () => {
      const uniqueDesignNos = Array.from(new Set(orders.map(o => o.design_no)));
      const images: { [design_no: string]: string | null } = {};
      for (const design_no of uniqueDesignNos) {
        const { data, error } = await supabase
          .from('designs')
          .select('main_image_url')
          .eq('design_no', design_no)
          .single();
        images[design_no] = data?.main_image_url || null;
      }
      setDesignImages(images);
    };
    if (orders.length > 0) fetchImages();
  }, [orders]);

  const getAddress = (address_id: string) => {
    const addr = addresses.find(a => a.id === address_id);
    if (!addr) return 'Address not found';
    return `${addr.name}, ${addr.house_no}, ${addr.landmark}, ${addr.city}, ${addr.district}, ${addr.state} - ${addr.pincode}, Mobile: ${addr.primary_mobile}${addr.secondary_mobile ? ', ' + addr.secondary_mobile : ''}`;
  };

  const generateInvoice = async (order: Order, address: Address, designImage: string | null) => {
    const doc = new jsPDF();

    // Logo
    const logoUrl = '/Assets/Logo.png';
    const logoImg = new Image();
    logoImg.src = logoUrl;
    // Wait for logo to load (async)
    await new Promise((resolve) => {
      logoImg.onload = resolve;
      logoImg.onerror = resolve;
    });
    try {
      doc.addImage(logoImg, 'PNG', 10, 10, 30, 30);
    } catch (e) {
      // If logo fails, skip
    }

    // Business Details
    doc.setFontSize(14);
    doc.text('Sri Sai Embroidery', 45, 15);
    doc.setFontSize(10);
    doc.text('Beside ZPHS, Sajjapuram', 45, 21);
    doc.text('Sangareddy, Dist: Telangana, 502148', 45, 26);
    doc.text('Phone: 9951452554', 45, 31);

    // Invoice/Order Details
    doc.setFontSize(12);
    doc.text(`Invoice/Order ID: ${order.custom_order_id || order.id}`, 10, 45);
    doc.text(`Date: ${new Date(order.created_at).toLocaleDateString()}`, 150, 45, { align: 'right' });

    // Bill To
    doc.setFontSize(11);
    doc.text('Bill to:', 10, 55);
    doc.text(`${address.name}`, 25, 55);
    doc.text(`Phone: ${address.primary_mobile}${address.secondary_mobile ? ', ' + address.secondary_mobile : ''}`, 25, 60);

    // Shipping Address
    doc.text('Shipping Address:', 10, 70);
    doc.setFontSize(10);
    doc.text(`${address.house_no}, ${address.landmark}`, 25, 75);
    doc.text(`${address.city}, ${address.district}`, 25, 80);
    doc.text(`${address.state} - ${address.pincode}`, 25, 85);

    // Order Summary Table
    autoTable(doc, {
      startY: 95,
      head: [['S.No', 'Design No', 'Quantity', 'Price', 'Amount']],
      body: [
        [
          '1',
          order.design_no,
          order.quantity,
          `₹${order.price}`,
          `₹${order.price * order.quantity}`
        ]
      ],
      theme: 'grid',
      headStyles: { fillColor: [128, 90, 213] },
      styles: { fontSize: 10 },
      columnStyles: {
        0: { cellWidth: 15 },
        1: { cellWidth: 35 },
        2: { cellWidth: 25 },
        3: { cellWidth: 25 },
        4: { cellWidth: 30 },
      },
      foot: [['', '', '', 'Total', `₹${order.price * order.quantity}`]],
      footStyles: { fillColor: [240, 240, 240], textColor: [0,0,0], fontStyle: 'bold' },
    });

    // Note and Thank you
    let y = (doc as any).autoTable?.previous?.finalY ? (doc as any).autoTable.previous.finalY + 10 : 120;
    doc.setFontSize(9);
    doc.text('Note: No returns, refunds or exchange as per policy. For any order-related queries, contact us via WhatsApp: 9951452554', 10, y, { maxWidth: 190 });
    y += 10;
    doc.setFontSize(11);
    doc.text('Thank you for shopping with Sri Sai Embroidery!', 10, y);
    y += 7;
    doc.setFontSize(9);
    doc.text('Follow us for latest designs and offers.', 10, y);

    // Save PDF
    doc.save(`Invoice_${order.custom_order_id || order.id}.pdf`);
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-[40vh]">Loading...</div>;
  }

  const [showAuthModal, setShowAuthModal] = useState(false);
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <svg width="64" height="64" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="mb-4 text-purple-400"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
        <p className="mb-2 text-lg font-semibold text-gray-700">Sign in to view your orders</p>
        <Button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 mt-2" onClick={() => setShowAuthModal(true)}>Login</Button>
        {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="flex justify-center items-center min-h-[90vh] bg-gradient-to-br from-purple-100 via-pink-50 to-white py-8 px-2">
        <Card className="w-full max-w-3xl shadow-2xl rounded-2xl border-0 bg-white p-0 overflow-hidden">
          <div className="p-8">
            <h2 className="text-2xl font-bold text-purple-700 mb-6">My Orders</h2>
            {fetching ? (
              <div className="text-gray-500">Loading orders...</div>
            ) : orders.length === 0 ? (
              <div className="text-gray-500">No orders found.</div>
            ) : (
              <div className="space-y-6">
                {orders.map(order => (
                  <div key={order.id} className="border rounded-lg p-4 bg-gray-50 shadow-sm flex flex-col md:flex-row gap-4 items-center">
                    {designImages[order.design_no] && (
                      <img src={designImages[order.design_no] as string} alt={order.design_no} className="w-24 h-24 object-cover rounded-lg border" />
                    )}
                    <div className="flex-1 w-full">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
                        <div className="font-semibold text-gray-800">Design No: {order.design_no}</div>
                        <div className="text-sm text-gray-500">Order Date: {new Date(order.created_at).toLocaleString()}</div>
                      </div>
                      <div className="text-xs text-gray-500 mb-2 md:text-right">Order ID: {order.custom_order_id || '-'}</div>
                      <div className="text-gray-700 mb-1">Quantity: {order.quantity}</div>
                      <div className="text-gray-700 mb-1">Price: ₹{order.price}</div>
                      <div className="text-gray-700 mb-1">Payment Status: <span className={order.payment_status === 'success' ? 'text-green-600' : 'text-red-600'}>{order.payment_status}</span></div>
                      <div className="text-gray-700 text-sm mt-2">Delivery Address: {getAddress(order.address_id)}</div>
                      <Button
                        className="mt-2 bg-purple-600 hover:bg-purple-700 text-white text-xs px-3 py-1 rounded"
                        onClick={async () => {
                          const addr = addresses.find(a => a.id === order.address_id);
                          await generateInvoice(order, addr!, designImages[order.design_no] || null);
                        }}
                      >
                        Download Invoice
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <Button onClick={() => navigate(-1)} className="mt-8 w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 rounded-lg shadow">Back</Button>
          </div>
        </Card>
      </div>
    </>
  );
};

export default Orders; 