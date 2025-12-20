-- Create admin users table for admin authentication
CREATE TABLE public.admin_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Create policies for admin access
CREATE POLICY "Admins can view admin users" 
ON public.admin_users 
FOR SELECT 
USING (auth.uid() IN (SELECT auth.uid() FROM public.admin_users WHERE email = auth.email()));

CREATE POLICY "Admins can update admin users" 
ON public.admin_users 
FOR UPDATE 
USING (auth.uid() IN (SELECT auth.uid() FROM public.admin_users WHERE email = auth.email()));

-- Create partnerships table for storing partnership applications
CREATE TABLE public.partnerships (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  level TEXT NOT NULL,
  amount DECIMAL(10,2),
  payment_method TEXT NOT NULL,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.partnerships ENABLE ROW LEVEL SECURITY;

-- Create policies for partnerships
CREATE POLICY "Anyone can create partnerships" 
ON public.partnerships 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admins can view all partnerships" 
ON public.partnerships 
FOR SELECT 
USING (auth.uid() IN (SELECT auth.uid() FROM public.admin_users WHERE email = auth.email()));

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_admin_users_updated_at
  BEFORE UPDATE ON public.admin_users
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_partnerships_updated_at
  BEFORE UPDATE ON public.partnerships
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();