import React from 'react';
import { useUser } from '@/hooks/useUser';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';

const MyOrders: React.FC = () => {
  const { user, loading } = useUser();
  const navigate = useNavigate();

  if (loading) {
    return <div className="flex justify-center items-center min-h-[40vh]">Loading...</div>;
  }

  if (!user) {
    return <div className="flex flex-col items-center min-h-[40vh]">
      <p className="mb-4">You are not logged in.</p>
      <Button onClick={() => navigate('/')}>Go Home</Button>
    </div>;
  }

  return (
    <>
      <Header />
      <div className="flex justify-center items-center min-h-[60vh] bg-gray-50">
        <Card className="p-8 w-full max-w-md shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-purple-700">My Orders</h2>
          <div className="mb-4 text-gray-600">You have no orders yet.</div>
          <Button onClick={() => navigate(-1)} className="mt-4">Back</Button>
        </Card>
      </div>
    </>
  );
};

export default MyOrders; 