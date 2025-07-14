import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl py-1 font-bold text-center mb-8 bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
          Privacy Policy
        </h1>
        <div className="max-w-5xl mx-auto text-gray-700 text-lg space-y-4">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <span role="img" aria-label="lock">🔒</span> Privacy Policy
          </h2>
          <p>At Sri Sai Embroidery, your privacy is important to us. This policy outlines how we collect and use your data.</p>

          <ol className="list-decimal pl-6 space-y-2">
            <li>
              <span className="font-semibold">Data We Collect</span><br />
              When you place an order or register on our website, we collect:
              <ul className="list-disc pl-6">
                <li>Full name</li>
                <li>Phone number</li>
                <li>Shipping address</li>
                <li>Email address</li>
              </ul>
              This data is used solely for order fulfillment and customer support.
            </li>
            <li>
              <span className="font-semibold">Third-Party Services</span><br />
              We work with the following third-party providers:
              <ul className="list-disc pl-6">
                <li>Razorpay – for secure payment processing.</li>
                <li>Supabase – for backend and storage services (e.g., uploaded designs, login data).</li>
                <li>Vercel Analytics – to track anonymous user traffic and performance (no personal data collected).</li>
              </ul>
              These services access only the necessary data to perform their functions and are obligated not to misuse it.
            </li>
            <li>
              <span className="font-semibold">Marketing</span><br />
              We do not use your data for marketing purposes or share your details with any advertisers.
            </li>
            <li>
              <span className="font-semibold">User Accounts</span><br />
              Customers can register and log in to manage their orders and addresses. You are responsible for maintaining the confidentiality of your login credentials.
            </li>
            <li>
              <span className="font-semibold">Children’s Privacy</span><br />
              Our services are not intended for children under 18. We do not knowingly collect personal data from minors.<br />
              If you believe a minor has shared personal information with us, please email <a href="mailto:contact.srisaiembroidery@gmail.com" className="text-purple-700 underline">contact.srisaiembroidery@gmail.com</a>, and we will delete the information.
            </li>
          </ol>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy; 