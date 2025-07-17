import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart';
import { useUser } from '@/hooks/useUser';
import { toast } from '@/components/ui/use-toast';

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
  const { addToCart, isLoading } = useCart();
  const { user } = useUser();
  const [adding, setAdding] = React.useState(false);

  const handleClick = () => {
    // Store the current scroll position using sessionStorage
    sessionStorage.setItem('designsScrollPosition', window.pageYOffset.toString());
    navigate(`/design/${design.id}`);
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      toast({ title: 'Please log in to add to cart', description: 'You must be logged in to add items to your cart.', variant: 'destructive' });
      return;
    }
    setAdding(true);
    try {
      await addToCart(design.id, 1);
      toast({ title: 'Added to cart', description: `Design ${design.design_no} added to your cart.` });
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to add to cart', variant: 'destructive' });
    } finally {
      setAdding(false);
    }
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
            className="w-full h-42 lg:h-64 object-contain transition-transform duration-300 group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />
        </div>
        
        <div className="p-4">
          <h3 className="text-md lg:text-lg font-semibold text-gray-800 mb-0">Design #{design.design_no}</h3>
          <div className="flex flex-col items-start gap-2 md:flex-row md:items-end md:justify-between">
            <p className="text-lg font-bold text-purple-700">₹{design.price.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
            <Button 
              className="w-full md:w-auto bg-black hover:bg-gray-900 text-white font-semibold px-6 py-2 rounded mt-1 md:mt-0"
              onClick={handleAddToCart}
              disabled={adding || isLoading}
            >
              {adding ? 'Adding...' : 'Add to Cart'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DesignCard;
