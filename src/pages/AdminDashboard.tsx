import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LogOut, Upload, BarChart2, ArrowLeft, X, MessageSquare, Edit, Clock, CheckCircle2, Home as HomeIcon, Menu, ShoppingCart, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableFooter } from '@/components/ui/table';

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
  const [activeAction, setActiveAction] = useState<'home' | 'upload' | 'messages' | 'stats' | 'edit' | 'pending' | 'successful' | 'new'>('home');
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
  const [showEditDesign, setShowEditDesign] = useState(false);
  const [editSearch, setEditSearch] = useState('');
  const [editSuggestions, setEditSuggestions] = useState<string[]>([]);
  const [editDesign, setEditDesign] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showPendingOrders, setShowPendingOrders] = useState(false);
  const [showSuccessfulOrders, setShowSuccessfulOrders] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Add state for recent orders
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [userCount, setUserCount] = useState<number | null>(null);
  const [totalOrdersCount, setTotalOrdersCount] = useState<number | null>(null);
  const [todayOrders, setTodayOrders] = useState<any[]>([]);
  const [loadingTodayOrders, setLoadingTodayOrders] = useState(false);
  const [todayOrderImages, setTodayOrderImages] = useState<{ [orderId: string]: string | null }>({});
  const [todayOrdersCount, setTodayOrdersCount] = useState<number | null>(null);
  const [recentOrderImages, setRecentOrderImages] = useState<{ [orderId: string]: string | null }>({});
  const [totalEarnings, setTotalEarnings] = useState<number | null>(null);

  // Add state for pending orders
  const [pendingOrders, setPendingOrders] = useState<any[]>([]);
  const [loadingPendingOrders, setLoadingPendingOrders] = useState(false);
  const [pendingOrderImages, setPendingOrderImages] = useState<{ [orderId: string]: string | null }>({});
  const [confirmDialog, setConfirmDialog] = useState<{ open: boolean; orderId: string | null }>({ open: false, orderId: null });

  // Add state for successful orders
  const [successfulOrders, setSuccessfulOrders] = useState<any[]>([]);
  const [loadingSuccessfulOrders, setLoadingSuccessfulOrders] = useState(false);
  const [successfulOrderImages, setSuccessfulOrderImages] = useState<{ [orderId: string]: string | null }>({});

  // Add state for pending orders count
  const [pendingOrdersCount, setPendingOrdersCount] = useState<number | null>(null);
  // Add state for successful orders count
  const [successfulOrdersCount, setSuccessfulOrdersCount] = useState<number | null>(null);

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
    setActiveAction('upload');
  };

  const handleShowMessages = async () => {
    setActiveAction('messages');
    await fetchMessages();
  };

  const handleShowStats = () => {
    setActiveAction('stats');
  };

  const handleShowEditDesign = () => {
    setActiveAction('edit');
    setEditDesign(null);
    setEditSearch('');
    setEditSuggestions([]);
  };

  const handleShowPendingOrders = () => {
    setActiveAction('pending');
  };

  const handleShowSuccessfulOrders = () => {
    setActiveAction('successful');
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
      setContactMessages((data || []).map((msg) => ({
        id: msg.id,
        name: msg.name || 'No Name',
        email: msg.email || 'No Email',
        phone: msg.phone || '',
        message: msg.message || '',
        created_at: msg.created_at
      })));
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

  const fetchEditSuggestions = async (query: string) => {
    if (!query) {
      setEditSuggestions([]);
      return;
    }
    const { data, error } = await supabase
      .from('designs')
      .select('design_no')
      .ilike('design_no', `%${query}%`)
      .limit(5);
    if (!error && data) {
      setEditSuggestions(data.map((d: any) => d.design_no).filter(Boolean));
    }
  };

  const handleEditSearch = async () => {
    if (!editSearch) return;
    setIsEditing(true);
    const { data, error } = await supabase
      .from('designs')
      .select('*')
      .eq('design_no', editSearch)
      .single();
    setIsEditing(false);
    if (!error && data) {
      setEditDesign(data);
    } else {
      toast({ title: 'Not found', description: 'No design found with that number', variant: 'destructive' });
      setEditDesign(null);
    }
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setEditDesign({ ...editDesign, [e.target.name]: e.target.value });
  };

  const handleEditFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    const file = e.target.files?.[0] || null;
    setEditDesign((prev: any) => ({ ...prev, [type]: file }));
  };

  const handleUpdateDesign = async () => {
    if (!editDesign) return;
    setIsEditing(true);
    const updateObj: any = { ...editDesign };
    const { id, ...updateData } = updateObj;
    if (!id || isNaN(Number(id))) {
      toast({ title: 'Update failed', description: 'Invalid design ID', variant: 'destructive' });
      setIsEditing(false);
      return;
    }

    // Upload main image if a new file is selected
    if (updateObj.mainImage instanceof File) {
      const file = updateObj.mainImage;
      const fileName = `${updateObj.design_no}-main-${Date.now()}.${file.name.split('.').pop()}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('design-images')
        .upload(fileName, file, { upsert: true });
      if (uploadError) {
        setIsEditing(false);
        toast({ title: 'Image upload failed', description: uploadError.message, variant: 'destructive' });
        return;
      }
      const { data: { publicUrl } } = supabase.storage.from('design-images').getPublicUrl(fileName);
      updateData.main_image_url = publicUrl;
    }

    // Upload secondary images if new files are selected
    for (let i = 1; i <= 5; i++) {
      const fileKey = `secondaryImage${i}`;
      const urlKey = `secondary_image_${i}_url`;
      if (updateObj[fileKey] instanceof File) {
        const file = updateObj[fileKey];
        const fileName = `${updateObj.design_no}-secondary${i}-${Date.now()}.${file.name.split('.').pop()}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('design-images')
          .upload(fileName, file, { upsert: true });
        if (uploadError) {
          setIsEditing(false);
          toast({ title: 'Image upload failed', description: uploadError.message, variant: 'destructive' });
          return;
        }
        const { data: { publicUrl } } = supabase.storage.from('design-images').getPublicUrl(fileName);
        updateData[urlKey] = publicUrl;
      }
      // Remove the file object from updateData
      delete updateData[fileKey];
    }

    // Remove non-editable fields
    delete updateData.created_at;
    delete updateData.id;
    delete updateData.mainImage;

    // Update the design in Supabase
    const { error } = await supabase
      .from('designs')
      .update(updateData)
      .eq('id', Number(id));
    setIsEditing(false);

    if (!error) {
      toast({ title: 'Design updated', description: 'Design updated successfully', className: 'bg-green-50 border-green-200' });
      // Fetch the updated design and update local state/UI
      const { data: updated } = await supabase.from('designs').select('*').eq('id', Number(id)).single();
      setEditDesign(updated);
      setShowEditDesign(false);
    } else {
      toast({ title: 'Update failed', description: 'Could not update design', variant: 'destructive' });
    }
  };

  useEffect(() => {
    if (activeAction === 'stats') {
      fetchCategoryStats();
    }
  }, [activeAction]);

  useEffect(() => {
    if (activeAction === 'messages') {
      fetchMessages();
    }
  }, [activeAction]);

  // Fetch recent orders on home load
  useEffect(() => {
    if (activeAction === 'home') {
      setLoadingOrders(true);
      supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5)
        .then(async ({ data, error }) => {
          if (!error && data) {
            setRecentOrders(data);
            // Fetch images for all unique design_nos
            const images: { [orderId: string]: string | null } = {};
            for (const order of data) {
              if (order.design_no) {
                const { data: designData } = await supabase
                  .from('designs')
                  .select('main_image_url')
                  .eq('design_no', order.design_no)
                  .single();
                images[order.id] = designData?.main_image_url || null;
              } else {
                images[order.id] = null;
              }
            }
            setRecentOrderImages(images);
          }
          setLoadingOrders(false);
        });

      // Fetch total orders count
      supabase
        .from('orders')
        .select('id', { count: 'exact', head: true })
        .then(({ count, error }) => {
          if (!error && typeof count === 'number') {
            setTotalOrdersCount(count);
          }
        });

      // Fetch today's orders count
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const dd = String(today.getDate()).padStart(2, '0');
      const todayStr = `${yyyy}-${mm}-${dd}`;
      supabase
        .from('orders')
        .select('id', { count: 'exact', head: true })
        .gte('created_at', `${todayStr}T00:00:00`)
        .then(({ count, error }) => {
          if (!error && typeof count === 'number') {
            setTodayOrdersCount(count);
          }
        });

      // Fetch pending orders count
      supabase
        .from('orders')
        .select('id', { count: 'exact', head: true })
        .eq('work_status', 'pending')
        .then(({ count, error }) => {
          if (!error && typeof count === 'number') {
            setPendingOrdersCount(count);
          }
        });

      // Fetch successful orders count
      supabase
        .from('orders')
        .select('id', { count: 'exact', head: true })
        .eq('work_status', 'successful')
        .then(({ count, error }) => {
          if (!error && typeof count === 'number') {
            setSuccessfulOrdersCount(count);
          }
        });

      // Fetch total earnings (sum of price)
      supabase
        .from('orders')
        .select('price')
        .then(({ data, error }) => {
          if (!error && data) {
            const sum = data.reduce((acc: number, order: any) => acc + (order.price || 0), 0);
            setTotalEarnings(sum);
          }
        });
    }
  }, [activeAction]);

  useEffect(() => {
    if (activeAction === 'home') {
      // Fetch user count from user_logins table (count distinct id)
      supabase
        .from('user_logins')
        .select('id', { count: 'exact', head: true })
        .then(({ count, error }) => {
          if (!error && typeof count === 'number') {
            setUserCount(count);
          }
        });
    }
  }, [activeAction]);

  useEffect(() => {
    if (activeAction === 'new') {
      const fetchTodayOrders = async () => {
        setLoadingTodayOrders(true);
        // Get today's date in YYYY-MM-DD format
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        const todayStr = `${yyyy}-${mm}-${dd}`;
        // Fetch orders where created_at >= today 00:00:00
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .gte('created_at', `${todayStr}T00:00:00`)
          .order('created_at', { ascending: false });
        if (!error && data) {
          setTodayOrders(data);
          // Fetch images for all unique design_nos
          const uniqueDesignNos = Array.from(new Set(data.map((o: any) => o.design_no)));
          const images: { [orderId: string]: string | null } = {};
          for (const order of data) {
            if (order.design_no) {
              const { data: designData } = await supabase
                .from('designs')
                .select('main_image_url')
                .eq('design_no', order.design_no)
                .single();
              images[order.id] = designData?.main_image_url || null;
            } else {
              images[order.id] = null;
            }
          }
          setTodayOrderImages(images);
        }
        setLoadingTodayOrders(false);
      };
      fetchTodayOrders();
    }
  }, [activeAction]);

  useEffect(() => {
    if (activeAction === 'pending') {
      const fetchPendingOrders = async () => {
        setLoadingPendingOrders(true);
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('work_status', 'pending')
          .order('created_at', { ascending: false });
        if (!error && data) {
          setPendingOrders(data);
          // Fetch images for all unique design_nos
          const images: { [orderId: string]: string | null } = {};
          for (const order of data) {
            if (order.design_no) {
              const { data: designData } = await supabase
                .from('designs')
                .select('main_image_url')
                .eq('design_no', order.design_no)
                .single();
              images[order.id] = designData?.main_image_url || null;
            } else {
              images[order.id] = null;
            }
          }
          setPendingOrderImages(images);
        }
        setLoadingPendingOrders(false);
      };
      fetchPendingOrders();
    }
  }, [activeAction]);

  useEffect(() => {
    if (activeAction === 'successful') {
      const fetchSuccessfulOrders = async () => {
        setLoadingSuccessfulOrders(true);
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('work_status', 'successful')
          .order('created_at', { ascending: false });
        if (!error && data) {
          setSuccessfulOrders(data);
          // Fetch images for all unique design_nos
          const images: { [orderId: string]: string | null } = {};
          for (const order of data) {
            if (order.design_no) {
              const { data: designData } = await supabase
                .from('designs')
                .select('main_image_url')
                .eq('design_no', order.design_no)
                .single();
              images[order.id] = designData?.main_image_url || null;
            } else {
              images[order.id] = null;
            }
          }
          setSuccessfulOrderImages(images);
        }
        setLoadingSuccessfulOrders(false);
      };
      fetchSuccessfulOrders();
    }
  }, [activeAction]);

  const handleMarkAsSuccessful = async (orderId: string) => {
    // Update work_status to 'successful'
    const { error } = await supabase
      .from('orders')
      .update({ work_status: 'successful' })
      .eq('id', orderId);
    if (!error) {
      setPendingOrders(prev => prev.filter(order => order.id !== orderId));
      setConfirmDialog({ open: false, orderId: null });
      toast({ title: 'Order marked as successful', className: 'bg-green-50 border-green-200' });
    } else {
      toast({ title: 'Error', description: 'Failed to update order status', variant: 'destructive' });
    }
  };

  const markSuccessBtnClass = "bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded shadow transition-colors duration-150";

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between bg-white shadow px-4 py-3 sticky top-0 z-30">
        <button onClick={() => setSidebarOpen(true)} className="text-purple-700 focus:outline-none">
          <Menu className="h-7 w-7" />
        </button>
        <span className="text-xl font-bold text-gray-800">Admin Dashboard</span>
      </div>
      {/* Sidebar */}
      <aside className={`fixed inset-0 z-40 bg-black/40 transition-opacity md:static md:bg-transparent md:w-72 md:shadow-lg md:flex md:flex-col md:items-center md:py-8 md:px-4 md:border-r ${sidebarOpen ? 'block' : 'hidden'} md:block`} onClick={() => setSidebarOpen(false)}>
        <div className="bg-white w-72 h-full flex flex-col items-center py-8 px-4 md:static md:shadow-none md:h-auto" onClick={e => e.stopPropagation()}>
          <div className="flex flex-col items-center mb-8">
            <div className="bg-gray-200 rounded-full w-20 h-20 flex items-center justify-center mb-2">
              <svg className="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            </div>
            <div className="text-lg font-semibold">Welcome!</div>
            <div className="text-purple-700 font-bold text-xl">Admin</div>
          </div>
          <div className="w-full">
            <div className="text-gray-500 font-semibold mb-2 pl-2">Quick Action</div>
            <nav className="flex flex-col gap-2">
              <Button onClick={() => { setActiveAction('home'); setSidebarOpen(false); }} className={`justify-start gap-2 w-full ${activeAction === 'home' ? 'bg-purple-100 text-purple-700' : 'bg-white text-gray-700 hover:bg-purple-50'}`} variant="ghost"><HomeIcon className="h-5 w-5" /> Home</Button>
              <Button onClick={() => { setActiveAction('upload'); setSidebarOpen(false); }} className={`justify-start gap-2 w-full ${activeAction === 'upload' ? 'bg-purple-100 text-purple-700' : 'bg-white text-gray-700 hover:bg-purple-50'}`} variant="ghost"><Upload className="h-5 w-5" /> Upload Design</Button>
              <Button onClick={() => { setActiveAction('messages'); setSidebarOpen(false); }} className={`justify-start gap-2 w-full ${activeAction === 'messages' ? 'bg-purple-100 text-purple-700' : 'bg-white text-gray-700 hover:bg-purple-50'}`} variant="ghost"><MessageSquare className="h-5 w-5" /> Messages</Button>
              <Button onClick={() => { setActiveAction('stats'); setSidebarOpen(false); }} className={`justify-start gap-2 w-full ${activeAction === 'stats' ? 'bg-purple-100 text-purple-700' : 'bg-white text-gray-700 hover:bg-purple-50'}`} variant="ghost"><BarChart2 className="h-5 w-5" /> Analytics</Button>
              <Button onClick={() => { setActiveAction('edit'); setSidebarOpen(false); }} className={`justify-start gap-2 w-full ${activeAction === 'edit' ? 'bg-purple-100 text-purple-700' : 'bg-white text-gray-700 hover:bg-purple-50'}`} variant="ghost"><Edit className="h-5 w-5" /> Edit Designs</Button>
              <Button onClick={() => { setActiveAction('new'); setSidebarOpen(false); }} className={`justify-start gap-2 w-full ${activeAction === 'new' ? 'bg-purple-100 text-purple-700' : 'bg-white text-gray-700 hover:bg-purple-50'}`} variant="ghost"><ShoppingCart className="h-5 w-5" /> New Orders</Button>
              <Button onClick={() => { setActiveAction('pending'); setSidebarOpen(false); }} className={`justify-start gap-2 w-full ${activeAction === 'pending' ? 'bg-purple-100 text-purple-700' : 'bg-white text-gray-700 hover:bg-purple-50'}`} variant="ghost"><Clock className="h-5 w-5" /> Pending Orders</Button>
              <Button onClick={() => { setActiveAction('successful'); setSidebarOpen(false); }} className={`justify-start gap-2 w-full ${activeAction === 'successful' ? 'bg-purple-100 text-purple-700' : 'bg-white text-gray-700 hover:bg-purple-50'}`} variant="ghost"><CheckCircle2 className="h-5 w-5" /> Successful Orders</Button>
            </nav>
            <Button onClick={handleLogout} className="w-full bg-red-500 hover:bg-red-600 flex items-center gap-2 mt-6"><LogOut className="h-5 w-5" /> Log Out</Button>
          </div>
        </div>
      </aside>
      {/* Overlay for mobile sidebar */}
      {sidebarOpen && <div className="fixed inset-0 z-30 bg-black/40 md:hidden" onClick={() => setSidebarOpen(false)}></div>}
      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <h1 className="hidden md:block text-3xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>
        {/* Dashboard Summary Cards and Home Content */}
        {activeAction === 'home' && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center cursor-pointer transition-transform duration-200 hover:shadow-lg hover:scale-105" onClick={() => setActiveAction('new')}>
                <div className="text-4xl font-bold text-purple-700">{todayOrdersCount !== null ? todayOrdersCount : <span className='text-gray-400'>...</span>}</div>
                <div className="text-gray-600 mt-2 font-medium">New Orders</div>
              </div>
              <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center cursor-pointer transition-transform duration-200 hover:shadow-lg hover:scale-105" onClick={handleShowPendingOrders}>
                <div className="text-4xl font-bold text-orange-500">{pendingOrdersCount !== null ? pendingOrdersCount : <span className='text-gray-400'>...</span>}</div>
                <div className="text-gray-600 mt-2 font-medium">Pending Orders</div>
              </div>
              <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center cursor-pointer transition-transform duration-200 hover:shadow-lg hover:scale-105" onClick={handleShowSuccessfulOrders}>
                <div className="text-4xl font-bold text-green-600">{successfulOrdersCount !== null ? successfulOrdersCount : <span className='text-gray-400'>...</span>}</div>
                <div className="text-gray-600 mt-2 font-medium">Successful Orders</div>
              </div>
              <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center transition-transform duration-200 hover:shadow-lg hover:scale-105">
                <div className="text-2xl font-bold text-gray-800">₹ {totalEarnings !== null ? totalEarnings.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : <span className='text-gray-400'>...</span>}</div>
                <div className="text-gray-600 mt-2 font-medium">Total Earnings</div>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 mb-8 lg:grid-cols-2">
              <div className="bg-white rounded-lg shadow p-6 flex items-center justify-between">
                <div className="flex items-center gap-2 text-lg font-medium text-gray-700">
                  <ShoppingCart className="w-6 h-6 text-purple-700" />
                  Total Orders:
                </div>
                <div className="text-2xl font-bold text-purple-700">
                  {totalOrdersCount !== null ? totalOrdersCount : <span className='text-gray-400'>...</span>}
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6 flex items-center justify-between">
                <div className="flex items-center gap-2 text-lg font-medium text-gray-700">
                  <User className="w-6 h-6 text-purple-700" />
                  Users:
                </div>
                <div className="text-2xl font-bold text-purple-700">{userCount !== null ? userCount : <span className='text-gray-400'>...</span>}</div>
              </div>
            </div>
            {/* Move Recent Orders table to the end of Home section */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Recent Orders</h3>
              {loadingOrders ? (
                <div className="text-center text-gray-500 py-4">Loading recent orders...</div>
              ) : recentOrders.length === 0 ? (
                <div className="text-center text-gray-500 py-4">No recent orders found.</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order No</TableHead>
                      <TableHead>Image</TableHead>
                      <TableHead>User ID</TableHead>
                      <TableHead>Design No</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentOrders.map(order => (
                      <TableRow key={order.id}>
                        <td className="px-4 py-2 font-mono font-bold text-purple-700">{order.custom_order_id || '-'}</td>
                        <td className="px-4 py-2">
                          {recentOrderImages[order.id] ? (
                            <img src={recentOrderImages[order.id]} alt={order.design_no} className="w-12 h-12 object-cover rounded border" />
                          ) : (
                            <span className="text-gray-400">No Image</span>
                          )}
                        </td>
                        <td className="px-4 py-2">{order.user_id}</td>
                        <td className="px-4 py-2">{order.design_no}</td>
                        <td className="px-4 py-2">{order.quantity}</td>
                        <td className="px-4 py-2">₹ {order.price}</td>
                        <td className="px-4 py-2">{order.payment_status || order.work_status}</td>
                        <td className="px-4 py-2">{new Date(order.created_at).toLocaleString()}</td>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </>
        )}
        {/* Back Button for all sections except home */}
        {activeAction !== 'home' && (
          <Button
            variant="outline"
            className="mb-4 flex items-center gap-2"
            onClick={() => setActiveAction('home')}
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        )}
        {/* Main Content Area (forms, tables, etc.) */}
        <div>
          {activeAction === 'new' && (
            <Card className="mb-8 p-6 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-gray-800">New Orders (Today)</CardTitle>
              </CardHeader>
              <CardContent>
                {loadingTodayOrders ? (
                  <div className="text-center text-gray-500 py-4">Loading today's orders...</div>
                ) : todayOrders.length === 0 ? (
                  <div className="text-center text-gray-500 py-4">No orders received today.</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order No</TableHead>
                        <TableHead>Image</TableHead>
                        <TableHead>User ID</TableHead>
                        <TableHead>Design No</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {todayOrders.map(order => (
                        <TableRow key={order.id}>
                          <td className="px-4 py-2 font-mono font-bold text-purple-700">{order.custom_order_id || '-'}</td>
                          <td className="px-4 py-2">
                            {todayOrderImages[order.id] ? (
                              <img src={todayOrderImages[order.id]} alt={order.design_no} className="w-16 h-16 object-cover rounded border" />
                            ) : (
                              <span className="text-gray-400">No Image</span>
                            )}
                          </td>
                          <td className="px-4 py-2">{order.user_id}</td>
                          <td className="px-4 py-2">{order.design_no}</td>
                          <td className="px-4 py-2">{order.quantity}</td>
                          <td className="px-4 py-2">₹ {order.price}</td>
                          <td className="px-4 py-2">{order.payment_status}</td>
                          <td className="px-4 py-2">{new Date(order.created_at).toLocaleString()}</td>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          )}
          {activeAction === 'upload' && (
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

          {activeAction === 'messages' && (
            <div className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-gray-800">Contact Messages</CardTitle>
                  <p className="text-gray-600">Messages received from contact form</p>
                </CardHeader>
                <CardContent>
                  {contactMessages.length === 0 && (
                    <p className="text-gray-500 text-center">No messages received yet.</p>
                  )}
                  {contactMessages.map((message) => (
                    <div key={message.id} className="bg-white p-4 rounded-lg border shadow-sm mb-4">
                      <h4 className="text-lg font-semibold text-gray-800">{message.name}</h4>
                      <p className="text-gray-600">Email: {message.email}</p>
                      {message.phone && <p className="text-gray-600">Phone: {message.phone}</p>}
                      <p className="text-gray-600">Message: {message.message || 'No message provided.'}</p>
                      <p className="text-sm text-gray-500">Received: {new Date(message.created_at).toLocaleString()}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          )}

          {activeAction === 'stats' && (
            <Card className="max-w-4xl mx-auto">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl font-bold text-gray-800">Design Statistics</CardTitle>
                    <p className="text-gray-600">Overview of designs by category</p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setActiveAction('home')}
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

          {activeAction === 'edit' && (
            <div className="flex flex-col items-center justify-center mt-8">
              <Card className="w-full max-w-xl p-8">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-gray-800">Edit a Design</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <input
                      type="text"
                      className="w-full border rounded px-3 py-2"
                      placeholder="Enter design number"
                      value={editSearch}
                      onChange={async (e) => {
                        setEditSearch(e.target.value);
                        await fetchEditSuggestions(e.target.value);
                      }}
                      onBlur={() => setTimeout(() => setEditSuggestions([]), 100)}
                    />
                    {editSuggestions.length > 0 && (
                      <ul className="absolute bg-white border border-gray-200 rounded-lg shadow-lg z-50 w-full max-w-xl">
                        {editSuggestions.map((suggestion, idx) => (
                          <li
                            key={idx}
                            className="px-4 py-2 cursor-pointer hover:bg-purple-100 text-gray-800"
                            onMouseDown={() => {
                              setEditSearch(suggestion);
                              setEditSuggestions([]);
                            }}
                          >
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <Button onClick={handleEditSearch} className="bg-gray-900 hover:bg-gray-800 text-white w-full mb-4">Search</Button>
                  {isEditing && (
                    <div className="flex justify-center items-center my-4">
                      <svg className="animate-spin h-6 w-6 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                      </svg>
                      <span className="ml-2 text-gray-600">Updating...</span>
                    </div>
                  )}
                  {editDesign && (
                    <form className="space-y-4">
                      <div>
                        <Label>Design Number</Label>
                        <Input name="design_no" value={editDesign.design_no || ''} onChange={handleEditChange} required />
                      </div>
                      <div>
                        <Label>Description</Label>
                        <Input name="description" value={editDesign.description || ''} onChange={handleEditChange} />
                      </div>
                      <div>
                        <Label>Price</Label>
                        <Input name="price" value={editDesign.price || ''} onChange={handleEditChange} />
                      </div>
                      <div>
                        <Label>Stitches</Label>
                        <Input name="stitches" value={editDesign.stitches || ''} onChange={handleEditChange} />
                      </div>
                      <div>
                        <Label>Category</Label>
                        <Input name="category" value={editDesign.category || ''} onChange={handleEditChange} />
                      </div>
                      <div>
                        <Label>Main Image</Label>
                        {/* Preview new main image if selected, else show current */}
                        {editDesign.mainImage instanceof File ? (
                          <img src={URL.createObjectURL(editDesign.mainImage)} alt="Main Preview" className="w-32 h-32 object-contain mb-2 border" />
                        ) : editDesign.main_image_url && (
                          <img src={editDesign.main_image_url} alt="Main" className="w-32 h-32 object-contain mb-2 border" />
                        )}
                        <Input type="file" name="mainImage" onChange={(e) => handleEditFileChange(e, 'mainImage')} />
                      </div>
                      <div>
                        <Label>Secondary Images</Label>
                        {[1,2,3,4,5].map(i => (
                          <div key={i} className="mb-2">
                            {/* Preview new secondary image if selected, else show current */}
                            {editDesign[`secondaryImage${i}`] instanceof File ? (
                              <img src={URL.createObjectURL(editDesign[`secondaryImage${i}`])} alt={`Secondary ${i} Preview`} className="w-32 h-32 object-contain mb-2 border" />
                            ) : editDesign[`secondary_image_${i}_url`] && (
                              <img src={editDesign[`secondary_image_${i}_url`]} alt={`Secondary ${i}`} className="w-32 h-32 object-contain mb-2 border" />
                            )}
                            <Input type="file" name={`secondaryImage${i}`} onChange={(e) => handleEditFileChange(e, `secondaryImage${i}`)} />
                          </div>
                        ))}
                      </div>
                      <Button type="button" onClick={handleUpdateDesign} className="bg-green-600 hover:bg-green-700 w-full">Update Design</Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
          {activeAction === 'pending' && (
            <Card className="mb-8 p-6 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-gray-800">Pending Orders</CardTitle>
              </CardHeader>
              <CardContent>
                {loadingPendingOrders ? (
                  <div className="text-center text-gray-500 py-4">Loading pending orders...</div>
                ) : pendingOrders.length === 0 ? (
                  <div className="text-center text-gray-500 py-4">No pending orders found.</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order No</TableHead>
                        <TableHead>Image</TableHead>
                        <TableHead>User ID</TableHead>
                        <TableHead>Design No</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pendingOrders.map(order => (
                        <TableRow key={order.id}>
                          <td className="px-4 py-2 font-mono font-bold text-purple-700">{order.custom_order_id || '-'}</td>
                          <td className="px-4 py-2">
                            {pendingOrderImages[order.id] ? (
                              <img src={pendingOrderImages[order.id]} alt={order.design_no} className="w-12 h-12 object-cover rounded border" />
                            ) : (
                              <span className="text-gray-400">No Image</span>
                            )}
                          </td>
                          <td className="px-4 py-2">{order.user_id}</td>
                          <td className="px-4 py-2">{order.design_no}</td>
                          <td className="px-4 py-2">{order.quantity}</td>
                          <td className="px-4 py-2">₹ {order.price}</td>
                          <td className="px-4 py-2">{order.work_status}</td>
                          <td className="px-4 py-2">{new Date(order.created_at).toLocaleString()}</td>
                          <td className="px-4 py-2">
                            <button className={markSuccessBtnClass} onClick={() => setConfirmDialog({ open: true, orderId: order.id })}>
                              Mark as Successful
                            </button>
                          </td>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
                {/* Confirmation Dialog */}
                {confirmDialog.open && (
                  <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
                    <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full">
                      <h2 className="text-lg font-semibold mb-4">Confirm Action</h2>
                      <p className="mb-6">Are you sure you want to mark this order as successful?</p>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setConfirmDialog({ open: false, orderId: null })}>Cancel</Button>
                        <button className={markSuccessBtnClass} onClick={() => confirmDialog.orderId && handleMarkAsSuccessful(confirmDialog.orderId)}>Yes, Mark as Successful</button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
          {activeAction === 'successful' && (
            <Card className="mb-8 p-6 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-gray-800">Successful Orders</CardTitle>
              </CardHeader>
              <CardContent>
                {loadingSuccessfulOrders ? (
                  <div className="text-center text-gray-500 py-4">Loading successful orders...</div>
                ) : successfulOrders.length === 0 ? (
                  <div className="text-center text-gray-500 py-4">No successful orders found.</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order No</TableHead>
                        <TableHead>Image</TableHead>
                        <TableHead>User ID</TableHead>
                        <TableHead>Design No</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {successfulOrders.map(order => (
                        <TableRow key={order.id}>
                          <td className="px-4 py-2 font-mono font-bold text-purple-700">{order.custom_order_id || '-'}</td>
                          <td className="px-4 py-2">
                            {successfulOrderImages[order.id] ? (
                              <img src={successfulOrderImages[order.id]} alt={order.design_no} className="w-12 h-12 object-cover rounded border" />
                            ) : (
                              <span className="text-gray-400">No Image</span>
                            )}
                          </td>
                          <td className="px-4 py-2">{order.user_id}</td>
                          <td className="px-4 py-2">{order.design_no}</td>
                          <td className="px-4 py-2">{order.quantity}</td>
                          <td className="px-4 py-2">₹ {order.price}</td>
                          <td className="px-4 py-2">{order.work_status}</td>
                          <td className="px-4 py-2">{new Date(order.created_at).toLocaleString()}</td>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
