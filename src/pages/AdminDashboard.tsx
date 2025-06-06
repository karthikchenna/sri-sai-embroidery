import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LogOut, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-purple-600">Admin Dashboard</h1>
          <Button 
            variant="outline" 
            onClick={handleLogout}
            className="flex items-center space-x-2"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-800">Upload New Design</CardTitle>
            <p className="text-gray-600">Add a new embroidery design to your catalog</p>
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
      </div>
    </div>
  );
};

export default AdminDashboard;
