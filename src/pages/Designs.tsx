import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DesignCard from '@/components/DesignCard';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

interface Design {
  id: number;
  design_no: string;
  price: number;
  stitches: number;
  category: string;
  main_image_url: string;
  description?: string;
}

const Designs = () => {
  const [searchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || 'all');
  const [designs, setDesigns] = useState<Design[]>([]);
  const [loading, setLoading] = useState(true);
  const searchQuery = searchParams.get('search');

  const categories = [
    { id: 'all', name: 'All' },
    { id: 'budget-friendly', name: 'Budget Friendly' },
    { id: 'exclusive', name: 'Exclusive' },
    { id: 'mirror-work', name: 'Mirror Work' },
    { id: 'lines-design', name: 'Lines Design' },
    { id: 'hand-all-over', name: 'Hand All Over' },
    { id: 'kutch-work', name: 'Kutch Work' },
    { id: 'bridal', name: 'Bridal' },
    { id: 'embroidery-frames', name: 'Embroidery Frames' }
  ];

  const fetchDesigns = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('designs')
        .select('id, design_no, price, stitches, category, main_image_url');

      if (searchQuery) {
        query = query.ilike('design_no', `%${searchQuery}%`);
      } else if (activeCategory !== 'all') {
        query = query.eq('category', activeCategory);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching designs:', error);
        return;
      }

      setDesigns(data || []);
      // Scroll to top after designs are loaded
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    } catch (error) {
      console.error('Error fetching designs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    const category = searchParams.get('category');
    if (category) {
      setActiveCategory(category);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchDesigns();
  }, [activeCategory, searchQuery]);

  // Enable browser's scroll restoration
  useEffect(() => {
    // Save the current scroll restoration behavior
    const originalScrollRestoration = window.history.scrollRestoration;
    
    // Enable automatic scroll restoration
    window.history.scrollRestoration = 'auto';
    
    // Cleanup: restore original behavior when component unmounts
    return () => {
      window.history.scrollRestoration = originalScrollRestoration;
    };
  }, []);

  // Restore scroll position when designs are loaded
  useEffect(() => {
    if (!loading) {
      const savedPosition = sessionStorage.getItem('designsScrollPosition');
      if (savedPosition) {
        // Use a small delay to ensure the page has rendered
        setTimeout(() => {
          window.scrollTo(0, parseInt(savedPosition));
          sessionStorage.removeItem('designsScrollPosition');
        }, 100);
      }
    }
  }, [loading]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Loading designs...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl py-1 font-bold text-center mb-8 bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
          {searchQuery ? `Search Results for "${searchQuery}"` : 'Our Embroidery Designs'}
        </h1>

        {/* Category Filter - Only show when not searching */}
        {!searchQuery && (
          <div className="flex flex-nowrap overflow-x-auto gap-2 mb-8 pb-2 -mx-4 px-4 lg:mx-0 lg:px-0 lg:justify-center sticky top-[68px] z-30 bg-gray-50">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={activeCategory === category.id ? "default" : "outline"}
                onClick={() => setActiveCategory(category.id)}
                className={activeCategory === category.id 
                  ? "bg-purple-600 hover:bg-purple-700" 
                  : "border-purple-600 text-purple-600 hover:bg-purple-50"
                }
              >
                {category.name}
              </Button>
            ))}
          </div>
        )}

        {/* Designs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-6">
          {designs.map((design) => (
            <DesignCard key={design.id} design={design} />
          ))}
        </div>

        {designs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {searchQuery 
                ? `No designs found matching "${searchQuery}"`
                : 'No designs found in this category.'}
            </p>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default Designs;
