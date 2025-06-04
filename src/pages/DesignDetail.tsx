
import React from 'react';
import { useParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';

const DesignDetail = () => {
  const { id } = useParams();

  // Mock data - replace with Supabase data once connected
  const design = {
    id: id,
    designNo: 'DES001',
    price: 299,
    stitches: 5000,
    category: 'budget-friendly',
    mainImage: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    secondaryImages: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1564342849276-bf9ce4bf5bb8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1594736797933-d0af501ba2fe?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    ]
  };

  const allImages = [design.mainImage, ...design.secondaryImages];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center text-purple-600 mb-8">
          Design {design.designNo}
        </h1>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Main Image */}
            <div className="space-y-4">
              <div className="aspect-square overflow-hidden rounded-lg shadow-lg">
                <img
                  src={design.mainImage}
                  alt={design.designNo}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Secondary Images Grid */}
              <div className="grid grid-cols-2 gap-4">
                {design.secondaryImages.slice(0, 4).map((image, index) => (
                  <div key={index} className="aspect-square overflow-hidden rounded-lg shadow-md">
                    <img
                      src={image}
                      alt={`${design.designNo} view ${index + 2}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Design Details */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Design Details</h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Design Number:</span>
                    <span className="font-semibold">{design.designNo}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Number of Stitches:</span>
                    <span className="font-semibold">{design.stitches.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Category:</span>
                    <span className="font-semibold capitalize">{design.category.replace('-', ' ')}</span>
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-gray-800">Price:</span>
                      <span className="text-2xl font-bold text-purple-600">₹{design.price}</span>
                    </div>
                  </div>
                </div>

                <Button className="w-full mt-6 bg-purple-600 hover:bg-purple-700 text-lg py-3">
                  Add to Cart
                </Button>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-3">Product Information</h3>
                <ul className="text-gray-600 space-y-2">
                  <li>• High-quality embroidery design</li>
                  <li>• Digital format compatible with most machines</li>
                  <li>• Instant download after purchase</li>
                  <li>• Detailed stitch information included</li>
                  <li>• Customer support available</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default DesignDetail;
