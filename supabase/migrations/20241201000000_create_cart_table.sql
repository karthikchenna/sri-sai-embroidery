-- Create cart table for user-specific persistent cart system
CREATE TABLE IF NOT EXISTS public.cart (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    design_id INTEGER NOT NULL REFERENCES public.designs(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create unique constraint to prevent duplicate items for the same user and design
CREATE UNIQUE INDEX IF NOT EXISTS cart_user_design_unique ON public.cart(user_id, design_id);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS cart_user_id_idx ON public.cart(user_id);
CREATE INDEX IF NOT EXISTS cart_design_id_idx ON public.cart(design_id);
CREATE INDEX IF NOT EXISTS cart_created_at_idx ON public.cart(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE public.cart ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can only see their own cart items
CREATE POLICY "Users can view their own cart items" ON public.cart
    FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own cart items
CREATE POLICY "Users can insert their own cart items" ON public.cart
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own cart items
CREATE POLICY "Users can update their own cart items" ON public.cart
    FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own cart items
CREATE POLICY "Users can delete their own cart items" ON public.cart
    FOR DELETE USING (auth.uid() = user_id);

-- Create function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at on row updates
CREATE TRIGGER update_cart_updated_at 
    BEFORE UPDATE ON public.cart 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column(); 