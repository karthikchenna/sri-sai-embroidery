import React, { useState } from 'react';
import { useUser } from '@/hooks/useUser';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const initialForm = {
  name: '',
  house_no: '',
  landmark: '',
  city: '',
  district: '',
  state: '',
  pincode: '',
  primary_mobile: '',
  secondary_mobile: '',
};

const UserAddressForm: React.FC = () => {
  const { user } = useUser();
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!user) {
      setError('You must be logged in to add an address.');
      return;
    }
    setLoading(true);
    const { error } = await (supabase as any)
      .from('user_addresses')
      .insert({
        user_id: user.id,
        ...form,
      });
    setLoading(false);
    if (error) {
      setError('Failed to add address. Please try again.');
    } else {
      navigate('/profile');
    }
  };

  return (
    <>
      <Header />
      <div className="flex justify-center items-center min-h-[80vh] bg-gradient-to-br from-purple-100 via-pink-50 to-white py-8">
        <Card className="p-8 w-full max-w-lg shadow-2xl rounded-2xl border-0 bg-white">
          <h2 className="text-2xl font-bold text-purple-700 mb-6 text-center">Add Address</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-4">
              <div className="w-1/2">
                <label className="block text-sm font-semibold mb-1">Name</label>
                <input name="name" value={form.name} onChange={handleChange} required className="input input-bordered w-full rounded px-3 py-2 border border-gray-300 focus:border-purple-500" />
              </div>
              <div className="w-1/2">
                <label className="block text-sm font-semibold mb-1">House No</label>
                <input name="house_no" value={form.house_no} onChange={handleChange} required className="input input-bordered w-full rounded px-3 py-2 border border-gray-300 focus:border-purple-500" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Landmark</label>
              <input name="landmark" value={form.landmark} onChange={handleChange} className="input input-bordered w-full rounded px-3 py-2 border border-gray-300 focus:border-purple-500" />
            </div>
            <div className="flex gap-4">
              <div className="w-1/2">
                <label className="block text-sm font-semibold mb-1">City/Town</label>
                <input name="city" value={form.city} onChange={handleChange} required className="input input-bordered w-full rounded px-3 py-2 border border-gray-300 focus:border-purple-500" />
              </div>
              <div className="w-1/2">
                <label className="block text-sm font-semibold mb-1">District</label>
                <input name="district" value={form.district} onChange={handleChange} required className="input input-bordered w-full rounded px-3 py-2 border border-gray-300 focus:border-purple-500" />
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-1/2">
                <label className="block text-sm font-semibold mb-1">State</label>
                <input name="state" value={form.state} onChange={handleChange} required className="input input-bordered w-full rounded px-3 py-2 border border-gray-300 focus:border-purple-500" />
              </div>
              <div className="w-1/2">
                <label className="block text-sm font-semibold mb-1">Pincode</label>
                <input name="pincode" value={form.pincode} onChange={handleChange} required className="input input-bordered w-full rounded px-3 py-2 border border-gray-300 focus:border-purple-500" />
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-1/2">
                <label className="block text-sm font-semibold mb-1">Primary Mobile</label>
                <input name="primary_mobile" value={form.primary_mobile} onChange={handleChange} required className="input input-bordered w-full rounded px-3 py-2 border border-gray-300 focus:border-purple-500" />
              </div>
              <div className="w-1/2">
                <label className="block text-sm font-semibold mb-1">Secondary Mobile</label>
                <input name="secondary_mobile" value={form.secondary_mobile} onChange={handleChange} className="input input-bordered w-full rounded px-3 py-2 border border-gray-300 focus:border-purple-500" />
              </div>
            </div>
            {error && <div className="text-red-500 text-sm text-center">{error}</div>}
            <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-lg shadow" disabled={loading}>
              {loading ? 'Saving...' : 'Save Address'}
            </Button>
            <Button type="button" className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 rounded-lg shadow" onClick={() => navigate(-1)}>
              Cancel
            </Button>
          </form>
        </Card>
      </div>
    </>
  );
};

export default UserAddressForm; 