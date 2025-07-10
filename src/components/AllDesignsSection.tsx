import React, { useEffect, useState } from 'react';
import DesignCard from './DesignCard';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';

interface Design {
  id: number;
  design_no: string;
  price: number;
  stitches: number;
  category: string;
  main_image_url: string;
}

const AllDesignsSection = () => {
  const [designs, setDesigns] = useState<Design[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllDesigns = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('designs')
        .select('id, design_no, price, stitches, category, main_image_url')
        .order('created_at', { ascending: false })
        .limit(28);
      if (!error && data) {
        setDesigns(data);
      }
      setLoading(false);
    };
    fetchAllDesigns();
  }, []);

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl py-1 font-bold text-center mb-12 bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
          All Designs
        </h2>
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Loading all designs...</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-6">
            {designs.map((design) => (
              <DesignCard key={design.id} design={design} />
            ))}
          </div>
        )}
        <div className="flex justify-center mt-8">
          <a href="/designs">
            <Button className="px-8 py-3 text-base font-semibold">
              View More Designs
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
};

export default AllDesignsSection; 