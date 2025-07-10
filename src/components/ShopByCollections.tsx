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
      image: 'Assets/Budget Friendlyy.png'      
    },
    {
      id: 'exclusive',
      name: 'Exclusive',
      description: 'Premium and unique designs',
      image: 'Assets/Exclusive.jpg'
    },
    {
      id: 'mirror-work',
      name: 'Mirror Work',
      description: 'Stunning mirror embroidery creations',
      image: 'Assets/Mirror Work.jpg'
    },
    {
      id: 'lines-design',
      name: 'Lines Design',
      description: 'Geometric and linear patterns',
      image: 'Assets/Lines Design.jpg'
    },
    {
      id: 'hand-all-over',
      name: 'Hand All Over',
      description: 'Intricate hand embroidery designs',
      image: 'Assets/Hand All Over.jpeg'
    },
    {
      id: 'kutch-work',
      name: 'Kutch Work',
      description: 'Traditional Kutch embroidery styles',
      image: 'Assets/Kutch Work.jpg'
    },
    {
      id: 'bridal',
      name: 'Bridal',
      description: 'Luxurious designs for special occasions',
      image: 'Assets/Bridal.jpg'
    },
    {
      id: 'embroidery-frames',
      name: 'Embroidery Frames',
      description: 'Ready-to-stick embroidery frames',
      image: 'Assets/Photo Embrodiery.jpg'
    }
  ];

  const handleCollectionClick = (category: string) => {
    window.scrollTo(0, 0);
    navigate(`/designs?category=${category}`);
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl py-1 font-bold text-center mb-12 bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
          Shop By Category
        </h2>
        
        <div className="grid grid-cols-2  lg:grid-cols-4 gap-6 lg:px-20">
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
                <div className="p-2">
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
