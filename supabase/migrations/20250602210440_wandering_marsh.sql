/*
  # Fix Profiles Table Policies

  1. Changes
    - Add proper RLS policies for profiles table
    - Ensure authenticated users can manage their own profiles
  
  2. Security
    - Enable RLS on profiles table
    - Add policies for INSERT, SELECT, and UPDATE operations
    - Restrict users to only manage their own profiles
*/

-- First ensure RLS is enabled
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;

-- Create comprehensive policies
CREATE POLICY "Allow users to insert their own profile"
ON profiles FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = id);

CREATE POLICY "Allow users to view their own profile"
ON profiles FOR SELECT 
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Allow users to update their own profile"
ON profiles FOR UPDATE 
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);