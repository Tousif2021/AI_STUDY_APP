/*
  # Fix Authentication Policies

  1. Changes
    - Drop and recreate all profile policies
    - Add proper RLS for profile creation and updates
    - Fix policy conflicts
    
  2. Security
    - Enable RLS
    - Add comprehensive policies for authenticated users
*/

-- First ensure RLS is enabled
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Allow users to insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Allow users to view their own profile" ON profiles;
DROP POLICY IF EXISTS "Allow users to update their own profile" ON profiles;

-- Create comprehensive policies
CREATE POLICY "Allow users to insert their own profile"
ON profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

CREATE POLICY "Allow users to view their own profile"
ON profiles FOR SELECT 
USING (auth.uid() = id OR auth.role() = 'service_role');

CREATE POLICY "Allow users to update their own profile"
ON profiles FOR UPDATE 
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Add trigger for automatic profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    'user'
  );
  RETURN NEW;
END;
$$;