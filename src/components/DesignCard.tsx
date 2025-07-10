import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Design {
  id: number;
  design_no: string;
  price: number;
  stitches: number;
  category: string;
  main_image_url: string;
  description?: string;
}

interface DesignCardProps {
  design: Design;
}

const DesignCard = ({ design }: DesignCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    // Store the current scroll position using sessionStorage
    sessionStorage.setItem('designsScrollPosition', window.pageYOffset.toString());
    navigate(`/design/${design.id}`);
  };

  // Function to format category name
  const formatCategory = (category: string) => {
    return category
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <Card 
      onClick={handleClick}
      className="group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
    >
      <CardContent className="p-0">
        <div className="relative overflow-hidden bg-gray-50">
          <img
            src={design.main_image_url || 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'}
            alt={design.design_no}
            className="w-full h-64 object-contain transition-transform duration-300 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />
        </div>
        
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-0">Design No: {design.design_no}</h3>
          {design.description && <p className="text-md text-gray-600 mb-0">{design.description}</p>}
          <p className="text-md text-gray-600 mb-0 hidden">Stitches: {design.stitches.toLocaleString()}</p>
          <div className="flex justify-between items-center mb-0">
            <p className="text-md text-gray-600">Category: {design.category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</p>
            <Button 
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 pointer-events-none hidden"
            >
              ₹ {design.price}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DesignCard;
