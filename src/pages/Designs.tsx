
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DesignCard from '@/components/DesignCard';
import { Button } from '@/components/ui/button';

const Designs = () => {
  const [searchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || 'all');

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

  // Mock data - replace with Supabase data once connected
  const mockDesigns = [
    {
      id: '1',
      designNo: 'DES001',
      price: 299,
      stitches: 5000,
      category: 'budget-friendly',
      mainImage: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    },
    {
      id: '2',
      designNo: 'DES002',
      price: 599,
      stitches: 8000,
      category: 'exclusive',
      mainImage: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    },
    {
      id: '3',
      designNo: 'DES003',
      price: 799,
      stitches: 12000,
      category: 'mirror-work',
      mainImage: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    },
    {
      id: '4',
      designNo: 'DES004',
      price: 450,
      stitches: 6500,
      category: 'lines-design',
      mainImage: 'https://images.unsplash.com/photo-1564342849276-bf9ce4bf5bb8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    },
    {
      id: '5',
      designNo: 'DES005',
      price: 999,
      stitches: 15000,
      category: 'bridal',
      mainImage: 'https://images.unsplash.com/photo-1595777216528-85e5e0c4ad9a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    }
  ];

  useEffect(() => {
    const category = searchParams.get('category');
    if (category) {
      setActiveCategory(category);
    }
  }, [searchParams]);

  const filteredDesigns = activeCategory === 'all' 
    ? mockDesigns 
    : mockDesigns.filter(design => design.category === activeCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center text-purple-600 mb-8">
          Our Embroidery Designs
        </h1>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
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

        {/* Designs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredDesigns.map((design) => (
            <DesignCard key={design.id} design={design} />
          ))}
        </div>

        {filteredDesigns.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No designs found in this category.</p>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default Designs;
