import React, { useEffect, useState } from 'react';
import { useUser } from '@/hooks/useUser';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { User as UserIcon, Mail, Phone, BadgeInfo, Home, MapPin, Landmark, Smartphone, Plus, Pencil, Trash2, LogOut } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

interface Address {
  id: string;
  name: string;
  house_no: string;
  landmark: string;
  city: string;
  district: string;
  state: string;
  pincode: string;
  primary_mobile: string;
  secondary_mobile: string | null;
}

const Profile: React.FC = () => {
  const { user, loading, logout } = useUser();
  const [profile, setProfile] = useState<{ name: string | null; email: string | null; phone: string | null } | null>(null);
  const [fetching, setFetching] = useState(false);
  const [addresses, setAddresses] = useState<Address[] | null>(null);
  const [fetchingAddresses, setFetchingAddresses] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      setFetching(true);
      const { data, error } = await (supabase as any)
        .from('user_logins')
        .select('name, email, phone')
        .eq('id', user.id)
        .single();
      if (!error && data) {
        setProfile(data);
      } else {
        setProfile(null);
      }
      setFetching(false);
    };
    if (user) fetchProfile();
  }, [user]);

  useEffect(() => {
    const fetchAddresses = async () => {
      if (!user) return;
      setFetchingAddresses(true);
      const { data, error } = await (supabase as any)
        .from('user_addresses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (!error && data) {
        setAddresses(data);
      } else {
        setAddresses(null);
      }
      setFetchingAddresses(false);
    };
    if (user) fetchAddresses();
  }, [user]);

  if (loading || fetching) {
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
      <div className="flex justify-center items-center min-h-[90vh] bg-gradient-to-br from-purple-100 via-pink-50 to-white py-8 px-2">
        <Card className="w-full max-w-5xl shadow-2xl rounded-2xl border-0 bg-white p-0 overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* User Info Section */}
            <div className="md:w-1/3 w-full bg-gradient-to-b from-purple-50 to-white p-8 flex flex-col items-center border-b md:border-b-0 md:border-r border-gray-100">
              <div className="bg-purple-100 rounded-full p-4 mb-2">
                <UserIcon className="h-16 w-16 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-1 text-center">{profile?.name || 'Your Name'}</h2>
              <span className="text-gray-500 text-sm mb-6 text-center">Welcome to your profile</span>
              <div className="space-y-3 w-full">
                <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-4 py-3">
                  <Mail className="h-5 w-5 text-purple-500" />
                  <span className="text-gray-800">{profile?.email || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-4 py-3">
                  <Phone className="h-5 w-5 text-purple-500" />
                  <span className="text-gray-800">{profile?.phone || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-4 py-3">
                  <BadgeInfo className="h-5 w-5 text-purple-500" />
                  <span className="text-gray-800 break-all">{user.id}</span>
                </div>
              </div>
              <Button
                className="mt-6 w-full flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-lg shadow"
                onClick={async () => {
                  await logout();
                  toast.success('Logout successful');
                  navigate('/');
                }}
              >
                <LogOut className="h-5 w-5" /> Logout
              </Button>
            </div>
            {/* Address Section */}
            <div className="md:w-2/3 w-full p-8 relative">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <Home className="h-5 w-5 text-purple-500" /> Your Addresses
                </h3>
                <Button
                  className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg shadow"
                  onClick={() => navigate('/user_address_form')}
                >
                  <Plus className="h-4 w-4" /> Add Address
                </Button>
              </div>
              {fetchingAddresses ? (
                <div className="text-gray-500">Loading addresses...</div>
              ) : addresses && addresses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {addresses.map(addr => (
                    <div key={addr.id} className="bg-gray-50 rounded-xl p-5 border border-gray-200 shadow hover:shadow-lg transition-shadow relative">
                      <button
                        className="absolute top-3 right-3 p-1 rounded hover:bg-purple-100"
                        title="Edit Address"
                        onClick={() => navigate(`/edit_address/${addr.id}`)}
                      >
                        <Pencil className="h-4 w-4 text-purple-500" />
                      </button>
                      <button
                        className="absolute top-3 right-10 p-1 rounded hover:bg-red-100"
                        title="Delete Address"
                        onClick={async () => {
                          if (window.confirm('Are you sure you want to delete this address?')) {
                            const { error } = await (supabase as any)
                              .from('user_addresses')
                              .delete()
                              .eq('id', addr.id)
                              .eq('user_id', user.id);
                            if (!error) {
                              toast.success('Address deleted');
                              // Refresh addresses
                              setAddresses(addresses.filter(a => a.id !== addr.id));
                            } else {
                              toast.error('Failed to delete address');
                            }
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </button>
                      <div className="flex items-center gap-2 mb-1">
                        <UserIcon className="h-4 w-4 text-purple-400" />
                        <span className="font-semibold text-gray-700">{addr.name}</span>
                      </div>
                      <div className="flex items-center gap-2 mb-1">
                        <Landmark className="h-4 w-4 text-purple-400" />
                        <span className="text-gray-700">{addr.house_no}, {addr.landmark}</span>
                      </div>
                      <div className="flex items-center gap-2 mb-1">
                        <MapPin className="h-4 w-4 text-purple-400" />
                        <span className="text-gray-700">{addr.city}, {addr.district}, {addr.state} - {addr.pincode}</span>
                      </div>
                      <div className="flex items-center gap-2 mb-1">
                        <Smartphone className="h-4 w-4 text-purple-400" />
                        <span className="text-gray-700">{addr.primary_mobile}{addr.secondary_mobile ? `, ${addr.secondary_mobile}` : ''}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-500 mb-2">No address added. Please add your address.</div>
              )}
              <Button onClick={() => navigate(-1)} className="mt-8 w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 rounded-lg shadow">Back</Button>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
};

export default Profile; 