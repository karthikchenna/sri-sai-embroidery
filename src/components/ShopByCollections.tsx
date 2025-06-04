
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';

const ShopByCollections = () => {
  const navigate = useNavigate();

  const collections = [
    {
      id: 'budget-friendly',
      name: 'Budget Friendly',
      description: 'Affordable designs for every occasion',
      image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 'exclusive',
      name: 'Exclusive',
      description: 'Premium and unique designs',
      image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 'mirror-work',
      name: 'Mirror Work',
      description: 'Stunning mirror embroidery creations',
      image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 'lines-design',
      name: 'Lines Design',
      description: 'Geometric and linear patterns',
      image: 'https://images.unsplash.com/photo-1564342849276-bf9ce4bf5bb8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 'hand-all-over',
      name: 'Hand All Over',
      description: 'Intricate hand embroidery designs',
      image: 'https://images.unsplash.com/photo-1594736797933-d0af501ba2fe?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 'kutch-work',
      name: 'Kutch Work',
      description: 'Traditional Kutch embroidery styles',
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 'bridal',
      name: 'Bridal',
      description: 'Luxurious designs for special occasions',
      image: 'https://images.unsplash.com/photo-1595777216528-85e5e0c4ad9a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 'embroidery-frames',
      name: 'Embroidery Frames',
      description: 'Ready-to-stick embroidery frames',
      image: 'https://images.unsplash.com/photo-1582582621959-48d27397dc69?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    }
  ];

  const handleCollectionClick = (category: string) => {
    navigate(`/designs?category=${category}`);
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-purple-600 mb-12">
          Shop By Collections
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {collections.map((collection) => (
            <Card
              key={collection.id}
              className="group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
              onClick={() => handleCollectionClick(collection.id)}
            >
              <CardContent className="p-0">
                <div className="relative overflow-hidden rounded-t-lg">
                  <img
                    src={collection.image}
                    alt={collection.name}
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 group-hover:text-purple-600 transition-colors duration-200">
                    {collection.name}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {collection.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShopByCollections;
