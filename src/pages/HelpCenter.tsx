import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Filter, MessageCircle, ShoppingCart, ArrowRight, LogIn, Home, CreditCard } from 'lucide-react';

const HelpCenter = () => {
  const helpSections = [
    {
      title: "How to View Designs",
      icon: <Search className="h-6 w-6 text-purple-600" />,
      content: [
        "Visit the 'Designs' page from the main menu",
        "Browse through our collection of embroidery designs",
        "Click on any design to view its details",
        "Use the search bar to find specific designs by number"
      ]
    },
    {
      title: "Using Category Filters",
      icon: <Filter className="h-6 w-6 text-purple-600" />,
      content: [
        "Find category buttons at the top of the Designs page",
        "Click on a category to filter designs",
        "View designs specific to that category",
        "Click 'All' to see all designs again"
      ]
    },
    {
      title: "Sending Messages",
      icon: <MessageCircle className="h-6 w-6 text-purple-600" />,
      content: [
        "Go to the 'Contact' page",
        "Fill in your name, email, and phone number",
        "Write your message in the message box",
        "Click 'Send Message' to submit"
      ]
    },
    {
      title: "How to Order via Whatsapp",
      icon: <ShoppingCart className="h-6 w-6 text-purple-600" />,
      content: [
        "Browse and select your favorite designs",
        "Take a screenshot of the design you want",
        "Send the screenshot to us via WhatsApp",
        "We'll get back to you with pricing and details",
        "Confirm your order and provide delivery details"
      ]
    },
    {
      title: "How to Login",
      icon: <LogIn className="h-6 w-6 text-purple-600" />,
      content: [
        "Click the user icon in the top right of the header.",
        "In the dropdown, click 'Login'.",
        "A login/signup modal will appear.",
        "Enter your email/mobile and password to login, or sign up if you don't have an account.",
        "After login, you can access your profile, cart, and orders."
      ]
    },
    {
      title: "How to Add Address",
      icon: <Home className="h-6 w-6 text-purple-600" />,
      content: [
        "Login to your account.",
        "Click the user icon and select 'Profile'.",
        "In your profile, go to the 'Your Addresses' section.",
        "Click the 'Add Address' button.",
        "Fill in your address details and save. You can also edit or delete addresses from your profile."
      ]
    },
    {
      title: "How to Order through Website",
      icon: <CreditCard className="h-6 w-6 text-purple-600" />,
      content: [
        "Browse designs and click on any design to view details.",
        "Click 'Add to Cart' to add the design to your cart (login required).",
        "Go to your cart to review your selected items.",
        "Proceed to checkout and follow the instructions to place your order.",
        "You can view your orders in the 'My Orders' section after logging in."
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl py-1 font-bold text-center mb-8 bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
          Help Center
        </h1>
        
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {helpSections.map((section, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    {section.icon}
                    <CardTitle className="text-xl">{section.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {section.content.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start">
                        <ArrowRight className="h-5 w-5 text-purple-600 mr-2 mt-0.5" />
                        <span className="text-gray-600">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-4">
              Need more help? Contact us directly through our contact page or WhatsApp.
            </p>
            <a 
              href="https://wa.me/919951455102" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <MessageCircle className="h-5 w-5 mr-2" />
              Contact on WhatsApp
            </a>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default HelpCenter; 