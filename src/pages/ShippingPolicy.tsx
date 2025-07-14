import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const ShippingPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl py-1 font-bold text-center mb-8 bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
          Shipping Policy
        </h1>
        <div className="max-w-5xl mx-auto text-gray-700 text-lg space-y-4">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <span role="img" aria-label="package">📦</span> Shipping Policy
          </h2>
          <p className="font-semibold">Shipping within India Only</p>
          <p>Sri Sai Embroidery currently ships orders only within India.</p>

          <p className="font-semibold">Order Processing Time</p>
          <p>Orders are processed within 2–3 business days after payment confirmation.</p>

          <p className="font-semibold">Estimated Delivery Time</p>
          <p>Delivery typically takes up to 7 business days, depending on your location and local postal services.</p>

          <p className="font-semibold">Shipping Charges</p>
          <p>We offer free shipping on all orders.</p>

          <p className="font-semibold">Shipping Partners</p>
          <p>Currently, we use India Post to fulfill all orders. In the future, based on volume and serviceability, we may also utilize services like Delhivery or DTDC.</p>

          <p className="font-semibold">Important Notes</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>We do not support Cash on Delivery (COD). All orders must be prepaid.</li>
            <li>Please ensure your shipping address and contact information are accurate at checkout to avoid delivery delays.</li>
          </ul>

          <p>If you have any questions regarding shipping, contact us at:</p>
          <ul className="list-none pl-0 space-y-1">
            <li>📧 <a href="mailto:contact.srisaiembroidery@gmail.com" className="text-purple-700 underline">contact.srisaiembroidery@gmail.com</a></li>
            <li>📞 <a href="tel:8008105796" className="text-purple-700 underline">8008105796</a></li>
          </ul>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ShippingPolicy; 