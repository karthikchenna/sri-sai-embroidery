import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useUser } from '@/hooks/useUser';

interface Design {
  id: number;
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
  description?: string;
}

const DesignDetail = () => {
  const { id } = useParams();
  const [design, setDesign] = useState<Design | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  const [adding, setAdding] = useState(false);

  const handleAddToCart = async () => {
    if (!user) {
      toast.error('Please log in to add to cart.');
      return;
    }
    if (!design) return;
    setAdding(true);
    // Check if already in cart
    const { data: existing, error: fetchError } = await (supabase as any)
      .from('cart')
      .select('*')
      .eq('user_id', user.id)
      .eq('design_id', design.id)
      .single();
    if (!fetchError && existing) {
      // Update quantity if already in cart
      const { error: updateError } = await (supabase as any)
        .from('cart')
        .update({ quantity: existing.quantity + 1 })
        .eq('id', existing.id);
      if (!updateError) {
        toast.success('Design added to cart');
      } else {
        toast.error('Failed to update cart');
      }
    } else {
      // Insert new cart item
      const { error: insertError } = await (supabase as any)
        .from('cart')
        .insert({
          user_id: user.id,
          design_id: design.id,
          quantity: 1,
        });
      if (!insertError) {
        toast.success('Design added to cart');
      } else {
        console.error('Add to cart error:', insertError);
        toast.error(`Failed to add to cart: ${insertError.message || insertError.details || 'Unknown error'}`);
      }
    }
    setAdding(false);
  };

  

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to top on component mount
    const fetchDesign = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('designs')
          .select('id, design_no, price, stitches, category, main_image_url, secondary_image_1_url, secondary_image_2_url, secondary_image_3_url, secondary_image_4_url, secondary_image_5_url, description')
          .eq('id', parseInt(id))
          .single();

        if (error) {
          console.error('Error fetching design:', error);
          setDesign(null);
          return;
        }

        setDesign(data as unknown as Design);
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
        <h1 className="text-4xl font-bold text-center py-1 mb-4 bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
          Design {design.design_no} <br/>          
        </h1>
        {design.description && (
          <p className="text-center text-xl text-gray-700 mb-8">{design.description}</p>
        )}

        <div className="max-w-6xl mx-auto">
          {/* Images Section */}
          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Main Image */}
              <div className="aspect-square overflow-hidden rounded-lg shadow-lg bg-gray-50">
                <img
                  src={design.main_image_url}
                  alt={design.design_no}
                  className="w-full h-full object-contain"
                />
              </div>
              
              {/* Secondary Images */}
              {secondaryImages.map((image, index) => (
                <div key={index} className="aspect-square overflow-hidden rounded-lg shadow-md bg-gray-50">
                  <img
                    src={image!}
                    alt={`${design.design_no} view ${index + 2}`}
                    className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Design Details and Product Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Design Details */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Design Details</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Design Number:</span>
                  <span className="font-semibold">{design.design_no}</span>
                </div>
                {design.description && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Description:</span>
                    <span className="font-semibold text-gray-800">{design.description}</span>
                  </div>
                )}
                
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

              <Button 
                className="w-full mt-6 bg-purple-600 hover:bg-purple-700 text-lg py-3"
                onClick={handleAddToCart}
                disabled={adding}
              >
                {adding ? 'Adding...' : 'Add to Cart'}
              </Button>
            </div>

            {/* Product Information */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-3">Product Information</h3>
              <ul className="text-gray-600 space-y-2">
                <li>• High-quality embroidery design</li>
                <li>• Neat stitching and fine finishing</li>
                <li>• Durable, colorfast threads used</li>
                <li>• Suitable for all fabric types</li>
                <li>• Intricate detailing with precision</li>
              </ul>
              <h3 className="text-xl font-bold text-gray-800 mt-5 mb-3">Want to place an order?</h3>
              <ul className="text-gray-600 space-y-2">
                <li>• Take a screenshot of your favorite design</li>
                <li>• Send it to us on WhatsApp</li>              
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default DesignDetail;
