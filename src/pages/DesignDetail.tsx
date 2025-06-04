
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

interface Design {
  id: string;
  design_no: string;
  price: number;
  stitches: number;
  category: string;
  main_image_url: string;
  secondary_image_1_url: string | null;
  secondary_image_2_url: string | null;
  secondary_image_3_url: string | null;
  secondary_image_4_url: string | null;
  secondary_image_5_url: string | null;
}

const DesignDetail = () => {
  const { id } = useParams();
  const [design, setDesign] = useState<Design | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDesign = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('designs')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          console.error('Error fetching design:', error);
          return;
        }

        setDesign(data);
      } catch (error) {
        console.error('Error fetching design:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDesign();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Loading design...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!design) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Design not found.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const secondaryImages = [
    design.secondary_image_1_url,
    design.secondary_image_2_url,
    design.secondary_image_3_url,
    design.secondary_image_4_url,
    design.secondary_image_5_url,
  ].filter(Boolean);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center text-purple-600 mb-8">
          Design {design.design_no}
        </h1>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Main Image */}
            <div className="space-y-4">
              <div className="aspect-square overflow-hidden rounded-lg shadow-lg">
                <img
                  src={design.main_image_url}
                  alt={design.design_no}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Secondary Images Grid */}
              {secondaryImages.length > 0 && (
                <div className="grid grid-cols-2 gap-4">
                  {secondaryImages.slice(0, 4).map((image, index) => (
                    <div key={index} className="aspect-square overflow-hidden rounded-lg shadow-md">
                      <img
                        src={image!}
                        alt={`${design.design_no} view ${index + 2}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Design Details */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Design Details</h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Design Number:</span>
                    <span className="font-semibold">{design.design_no}</span>
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
