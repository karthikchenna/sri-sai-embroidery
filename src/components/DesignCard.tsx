
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Design {
  id: string;
  designNo: string;
  price: number;
  stitches: number;
  category: string;
  mainImage: string;
}

interface DesignCardProps {
  design: Design;
}

const DesignCard = ({ design }: DesignCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/design/${design.id}`);
  };

  return (
    <Card className="group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
      <CardContent className="p-0">
        <div className="relative overflow-hidden">
          <img
            src={design.mainImage}
            alt={design.designNo}
            className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />
        </div>
        
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">{design.designNo}</h3>
          <p className="text-sm text-gray-600 mb-3">Stitches: {design.stitches.toLocaleString()}</p>
          
          <div className="flex items-center justify-between">
            <Button 
              onClick={handleClick}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6"
            >
              ₹{design.price}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DesignCard;
