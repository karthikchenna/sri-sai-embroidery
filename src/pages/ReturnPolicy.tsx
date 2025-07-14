import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const ReturnPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl py-1 font-bold text-center mb-8 bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
          Return Policy
        </h1>
        <div className="max-w-5xl mx-auto text-gray-700 text-lg space-y-4">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <span role="img" aria-label="return">🔁</span> Return & Refund Policy
          </h2>
          <p>Due to the customized nature of our embroidery products, Sri Sai Embroidery does not accept returns, cancellations, or provide refunds.</p>

          <p className="font-semibold">Order Cancellation</p>
          <p>Once an order is placed, it cannot be cancelled under any circumstance as designs are processed specifically for you.</p>

          <p className="font-semibold">No Returns / No Refunds</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>We do not accept returns or exchanges.</li>
            <li>Refunds are not issued under any situation.</li>
          </ul>

          <p>We appreciate your understanding and encourage you to carefully review your design and order details before payment.</p>

          <p>For any support, please reach out to:</p>
          <ul className="list-none pl-0 space-y-1">
            <li>📧 <a href="mailto:contact.srisaiembroidery@gmail.com" className="text-purple-700 underline">contact.srisaiembroidery@gmail.com</a></li>
          </ul>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ReturnPolicy; 