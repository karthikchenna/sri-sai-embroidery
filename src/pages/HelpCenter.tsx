import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Filter, MessageCircle, ShoppingCart, ArrowRight } from 'lucide-react';

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
      title: "How to Order",
      icon: <ShoppingCart className="h-6 w-6 text-purple-600" />,
      content: [
        "Browse and select your favorite designs",
        "Take a screenshot of the design you want",
        "Send the screenshot to us via WhatsApp",
        "We'll get back to you with pricing and details",
        "Confirm your order and provide delivery details"
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