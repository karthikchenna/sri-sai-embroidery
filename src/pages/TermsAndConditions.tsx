import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl py-1 font-bold text-center mb-8 bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
          Terms & Conditions
        </h1>
        <div className="max-w-5xl mx-auto text-gray-700 text-lg space-y-4">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <span role="img" aria-label="scroll">📜</span> Terms of Service
          </h2>
          <p>Welcome to Sri Sai Embroidery (<a href="https://srisaiembroidery.vercel.app" className="text-purple-700 underline" target="_blank" rel="noopener noreferrer">https://srisaiembroidery.vercel.app</a>). By accessing or using this website, you agree to the following terms:</p>

          <ol className="list-decimal pl-6 space-y-2">
            <li>
              <span className="font-semibold">Products & Customization</span><br />
              We offer a combination of custom-made and ready-to-ship embroidery designs. Please ensure all details are correct before placing your order.
            </li>
            <li>
              <span className="font-semibold">Payments</span><br />
              All orders must be prepaid via:
              <ul className="list-disc pl-6">
                <li>UPI</li>
                <li>Credit/Debit Cards</li>
                <li>Net Banking</li>
              </ul>
              Payments are securely processed via Razorpay.
            </li>
            <li>
              <span className="font-semibold">Pricing & Invoices</span><br />
              All product prices listed include applicable taxes.<br />
              A digital receipt will be provided upon successful payment.
            </li>
            <li>
              <span className="font-semibold">Intellectual Property</span><br />
              All designs, images, text, and layouts on this website are the intellectual property of Sri Sai Embroidery.<br />
              Any copying, reproduction, or unauthorized use of our content is strictly prohibited and may lead to legal action.
            </li>
            <li>
              <span className="font-semibold">Liability</span><br />
              We are not liable for delays, losses, or damages caused by third-party shipping partners or incorrect delivery details entered by users.
            </li>
            <li>
              <span className="font-semibold">Modifications</span><br />
              We reserve the right to modify these Terms at any time without notice. Continued use of our website implies acceptance of the updated terms.
            </li>
          </ol>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TermsAndConditions; 