-- Crawlify Authentication System Database Schema
-- Run this SQL in your Supabase SQL Editor to set up the required tables

-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO '1jDzG0iN2WmegKnkYdFZSsUcCNnGDDZ6QlCKHW41C1ZRKd0Zs7l2zIWCd5tAZToYVqYzWJT2Fv05DbplsoUmjQ==';

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    age INTEGER CHECK (age >= 13 AND age <= 120),
    country TEXT NOT NULL,
    business TEXT,
    role TEXT,
    credits INTEGER NOT NULL DEFAULT 100,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create credits_transactions table for tracking credit usage
CREATE TABLE IF NOT EXISTS public.credits_transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
    amount INTEGER NOT NULL, -- Positive for credits added, negative for credits used
    description TEXT NOT NULL,
    transaction_type TEXT NOT NULL CHECK (transaction_type IN ('purchase', 'usage', 'bonus', 'refund')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credits_transactions ENABLE ROW LEVEL SECURITY;

-- Create policies for user_profiles
CREATE POLICY "Users can view own profile" ON public.user_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.user_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.user_profiles
    FOR UPDATE USING (auth.uid() = id);

-- Create policies for credits_transactions
CREATE POLICY "Users can view own transactions" ON public.credits_transactions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transactions" ON public.credits_transactions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER handle_user_profiles_updated_at
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Note: The profile will be created by the application after signup
    -- This trigger is here for future use if needed
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup (optional)
-- CREATE TRIGGER on_auth_user_created
--     AFTER INSERT ON auth.users
--     FOR EACH ROW
--     EXECUTE FUNCTION public.handle_new_user();

-- Create function to add credits transaction
CREATE OR REPLACE FUNCTION public.add_credits_transaction(
    p_user_id UUID,
    p_amount INTEGER,
    p_description TEXT,
    p_transaction_type TEXT
)
RETURNS VOID AS $$
BEGIN
    -- Insert transaction record
    INSERT INTO public.credits_transactions (user_id, amount, description, transaction_type)
    VALUES (p_user_id, p_amount, p_description, p_transaction_type);
    
    -- Update user credits
    UPDATE public.user_profiles
    SET credits = credits + p_amount
    WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_credits_transactions_user_id ON public.credits_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_credits_transactions_created_at ON public.credits_transactions(created_at);

-- Insert some sample data (optional - remove in production)
-- INSERT INTO public.user_profiles (id, email, first_name, last_name, phone_number, country, credits)
-- VALUES (
--     '00000000-0000-0000-0000-000000000000',
--     'demo@example.com',
--     'Demo',
--     'User',
--     '+1234567890',
--     'United States',
--     100
-- );

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.user_profiles TO authenticated;
GRANT ALL ON public.credits_transactions TO authenticated;
GRANT EXECUTE ON FUNCTION public.add_credits_transaction TO authenticated;

-- Comments for documentation
COMMENT ON TABLE public.user_profiles IS 'User profile information with credits system';
COMMENT ON TABLE public.credits_transactions IS 'Transaction history for user credits';
COMMENT ON COLUMN public.user_profiles.credits IS 'Current credit balance for the user';
COMMENT ON FUNCTION public.add_credits_transaction IS 'Function to safely add/subtract credits and log transaction';