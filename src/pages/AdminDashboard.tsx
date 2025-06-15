import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LogOut, Upload, BarChart2, ArrowLeft, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface CategoryStats {
  category: string;
  count: number;
}

interface Design {
  design_no: string;
}

interface ContactMessage {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  created_at: string;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showStats, setShowStats] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [showUploadDesign, setShowUploadDesign] = useState(true);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [categoryStats, setCategoryStats] = useState<CategoryStats[]>([]);
  const [totalDesigns, setTotalDesigns] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categoryDesigns, setCategoryDesigns] = useState<Design[]>([]);
  const [isLoadingDesigns, setIsLoadingDesigns] = useState(false);
  
  const [designData, setDesignData] = useState({
    designNo: '',
    description: '',
    price: '',
    stitches: '',
    category: '',
    mainImage: null as File | null,
    secondaryImages: {
      image1: null as File | null,
      image2: null as File | null,
      image3: null as File | null,
      image4: null as File | null,
      image5: null as File | null,
    }
  });

  const [isUploading, setIsUploading] = useState(false);

  const categories = [
    'budget-friendly',
    'exclusive',
    'mirror-work',
    'lines-design',
    'hand-all-over',
    'kutch-work',
    'bridal',
    'embroidery-frames'
  ];

  const handleLogout = () => {
    navigate('/');
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of the admin panel.",
    });
  };

  const handleShowUploadDesign = () => {
    setShowUploadDesign(true);
    setShowMessages(false);
    setShowStats(false);
  };

  const handleShowMessages = async () => {
    setShowMessages(true);
    setShowStats(false);
    setShowUploadDesign(false);
    await fetchMessages();
  };

  const handleShowStats = () => {
    setShowStats(true);
    setShowMessages(false);
    setShowUploadDesign(false);
  };

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .select('id, name, email, phone, message, created_at')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }
      setContactMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: "Error",
        description: "Failed to fetch messages",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDesignData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    const file = e.target.files?.[0] || null;
    
    if (type === 'mainImage') {
      setDesignData(prev => ({
        ...prev,
        mainImage: file
      }));
    } else {
      setDesignData(prev => ({
        ...prev,
        secondaryImages: {
          ...prev.secondaryImages,
          [type]: file
        }
      }));
    }
  };

  const uploadImage = async (file: File, fileName: string): Promise<string | null> => {
    try {
      const { data, error } = await supabase.storage
        .from('design-images')
        .upload(fileName, file);

      if (error) {
        console.error('Upload error:', error);
        return null;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('design-images')
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error) {
      console.error('Upload error:', error);
      return null;
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!designData.designNo || !designData.price || !designData.stitches || !designData.category || !designData.mainImage) {
      toast({
        title: "Missing Required Fields",
        description: "Please fill in all required fields and upload a main image.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      // Upload main image
      const timestamp = Date.now();
      const mainImageFileName = `${designData.designNo}-main-${timestamp}.${designData.mainImage.name.split('.').pop()}`;
      const mainImageUrl = await uploadImage(designData.mainImage, mainImageFileName);

      if (!mainImageUrl) {
        throw new Error('Failed to upload main image');
      }

      // Upload secondary images
      const secondaryImageUrls: { [key: string]: string | null } = {};
      const secondaryImages = Object.entries(designData.secondaryImages);
      
      for (const [key, file] of secondaryImages) {
        if (file) {
          const fileName = `${designData.designNo}-${key}-${timestamp}.${file.name.split('.').pop()}`;
          const url = await uploadImage(file, fileName);
          secondaryImageUrls[key] = url;
        }
      }

      // Save design data to database
      const { data, error } = await supabase
        .from('designs')
        .insert({
          design_no: designData.designNo,
          description: designData.description,
          price: parseFloat(designData.price),
          stitches: parseInt(designData.stitches),
          category: designData.category,
          main_image_url: mainImageUrl,
          secondary_image_1_url: secondaryImageUrls.image1,
          secondary_image_2_url: secondaryImageUrls.image2,
          secondary_image_3_url: secondaryImageUrls.image3,
          secondary_image_4_url: secondaryImageUrls.image4,
          secondary_image_5_url: secondaryImageUrls.image5,
        });

      if (error) {
        throw error;
      }

      toast({
        title: "Design Uploaded Successfully! 🎉",
        description: `Design ${designData.designNo} has been added to the catalog.`,
        className: "bg-green-50 border-green-200",
      });

      // Reset form
      setDesignData({
        designNo: '',
        description: '',
        price: '',
        stitches: '',
        category: '',
        mainImage: null,
        secondaryImages: {
          image1: null,
          image2: null,
          image3: null,
          image4: null,
          image5: null,
        }
      });

      // Reset file inputs
      const fileInputs = document.querySelectorAll('input[type="file"]') as NodeListOf<HTMLInputElement>;
      fileInputs.forEach(input => {
        input.value = '';
      });

    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: "There was an error uploading the design. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const fetchCategoryStats = async () => {
    try {
      const { data, error } = await supabase
        .from('designs')
        .select('category');

      if (error) throw error;

      // Count designs by category
      const stats = categories.map(category => ({
        category,
        count: data.filter(design => design.category === category).length
      }));

      setCategoryStats(stats);
      setTotalDesigns(data.length);
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast({
        title: "Error",
        description: "Failed to fetch statistics",
        variant: "destructive",
      });
    }
  };

  const fetchCategoryDesigns = async (category: string) => {
    try {
      setIsLoadingDesigns(true);
      const { data, error } = await supabase
        .from('designs')
        .select('design_no')
        .eq('category', category)
        .order('design_no');

      if (error) throw error;
      setCategoryDesigns(data || []);
      setSelectedCategory(category);
    } catch (error) {
      console.error('Error fetching category designs:', error);
      toast({
        title: "Error",
        description: "Failed to fetch designs for this category",
        variant: "destructive",
      });
    } finally {
      setIsLoadingDesigns(false);
    }
  };

  const handleDesignClick = (designNo: string) => {
    // Scroll to top before navigation
    window.scrollTo(0, 0);
    navigate(`/designs?search=${encodeURIComponent(designNo)}`);
  };

  useEffect(() => {
    if (showStats) {
      fetchCategoryStats();
    }
  }, [showStats]);

  useEffect(() => {
    if (showMessages) {
      fetchMessages();
    }
  }, [showMessages]);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <Button onClick={handleLogout} className="bg-red-500 hover:bg-red-600">
          <LogOut className="mr-2 h-4 w-4" /> Log Out
        </Button>
      </div>

      <div className="mb-8 flex space-x-4">
        <Button onClick={handleShowUploadDesign} className="bg-green-600 hover:bg-green-700">
          <Upload className="mr-2 h-4 w-4" /> Upload Design
        </Button>
        <Button onClick={handleShowMessages} className="bg-purple-600 hover:bg-purple-700">
          Messages
        </Button>
        <Button onClick={handleShowStats} className="bg-blue-600 hover:bg-blue-700">
          <BarChart2 className="mr-2 h-4 w-4" /> Statistics
        </Button>
      </div>

      {/* Design Upload Section */}
      {showUploadDesign && (
        <Card className="mb-8 p-6 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-gray-800">Upload New Design</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpload} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="designNo">Design Number *</Label>
                  <Input
                    id="designNo"
                    name="designNo"
                    placeholder="E.g., DES001"
                    value={designData.designNo}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Input
                    id="description"
                    name="description"
                    placeholder="Brief description of the design"
                    value={designData.description}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div>
                  <Label htmlFor="price">Price (₹) *</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    placeholder="E.g., 499.99"
                    value={designData.price}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="stitches">Number of Stitches *</Label>
                  <Input
                    id="stitches"
                    name="stitches"
                    type="number"
                    placeholder="E.g., 5000"
                    value={designData.stitches}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <Label htmlFor="category">Category *</Label>
                <Select value={designData.category} onValueChange={(value) => setDesignData(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Main Image */}
              <div>
                <Label htmlFor="mainImage">Main Image *</Label>
                <Input
                  id="mainImage"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'mainImage')}
                  required
                />
              </div>

              {/* Secondary Images */}
              <div>
                <Label>Secondary Images</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <div key={num}>
                      <Label htmlFor={`image${num}`} className="text-sm">Secondary Image {num}</Label>
                      <Input
                        id={`image${num}`}
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, `image${num}`)}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Upload Button */}
              <Button 
                type="submit" 
                disabled={isUploading}
                className="w-full bg-purple-600 hover:bg-purple-700 text-lg py-3"
              >
                <Upload className="h-5 w-5 mr-2" />
                {isUploading ? 'Uploading...' : 'Upload Design'}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {showStats && (
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold text-gray-800">Design Statistics</CardTitle>
                <p className="text-gray-600">Overview of designs by category</p>
              </div>
              <Button
                variant="outline"
                onClick={() => setShowStats(false)}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Upload</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="text-xl font-semibold text-purple-800">Total Designs: {totalDesigns}</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categoryStats.map((stat) => (
                  <div 
                    key={stat.category} 
                    className="bg-white p-4 rounded-lg border shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => fetchCategoryDesigns(stat.category)}
                  >
                    <h4 className="text-lg font-semibold text-gray-800 capitalize">
                      {stat.category.replace('-', ' ')}
                    </h4>
                    <p className="text-2xl font-bold text-purple-600 mt-2">{stat.count}</p>
                  </div>
                ))}
              </div>

              {/* Category Designs Modal */}
              {selectedCategory && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                  <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden">
                    <div className="p-4 border-b flex justify-between items-center">
                      <h3 className="text-xl font-semibold capitalize">
                        {selectedCategory.replace('-', ' ')} Designs
                      </h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedCategory(null)}
                        className="h-8 w-8 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="p-4 overflow-y-auto max-h-[calc(80vh-8rem)]">
                      {isLoadingDesigns ? (
                        <div className="text-center py-4">
                          <p className="text-gray-500">Loading designs...</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                          {categoryDesigns.map((design) => (
                            <div
                              key={design.design_no}
                              className="bg-gray-50 p-3 rounded-lg text-center font-medium cursor-pointer hover:bg-purple-50 hover:text-purple-600 transition-colors"
                              onClick={() => handleDesignClick(design.design_no)}
                            >
                              {design.design_no}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {showMessages && (
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-800">Contact Messages</CardTitle>
            <p className="text-gray-600">Messages received from contact form</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {contactMessages.map((message) => (
                <div key={message.id} className="bg-white p-4 rounded-lg border shadow-sm">
                  <h4 className="text-lg font-semibold text-gray-800">{message.name}</h4>
                  <p className="text-gray-600">Email: {message.email}</p>
                  {message.phone && <p className="text-gray-600">Phone: {message.phone}</p>}
                  <p className="text-gray-600">Message: {message.message}</p>
                  <p className="text-sm text-gray-500">Received: {new Date(message.created_at).toLocaleString()}</p>
                </div>
              ))}
              {contactMessages.length === 0 && (
                <p className="text-gray-500 text-center">No messages received yet.</p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminDashboard;
