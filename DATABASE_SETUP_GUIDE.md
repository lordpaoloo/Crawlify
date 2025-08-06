# Database Setup Guide for Crawlify Authentication System

## Prerequisites

✅ **Already Completed:**
- Supabase project created
- Environment variables configured in `.env`
- Authentication system code implemented

## Step 1: Apply Database Schema

### Option A: Using Supabase Dashboard (Recommended)

1. **Open Supabase Dashboard:**
   - Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
   - Sign in to your account
   - Select your project: `mhyctpwneumaxxpzzaty`

2. **Navigate to SQL Editor:**
   - Click on "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Execute the Schema:**
   - Copy the entire content from `supabase-schema.sql`
   - Paste it into the SQL editor
   - Click "Run" to execute the schema

4. **Verify Tables Created:**
   - Go to "Table Editor" in the left sidebar
   - You should see two new tables:
     - `user_profiles`
     - `credits_transactions`

### Option B: Using Supabase CLI (Alternative)

```bash
# Install Supabase CLI if not already installed
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref mhyctpwneumaxxpzzaty

# Apply the schema
supabase db push
```

## Step 2: Verify Database Setup

### Check Tables and Policies

1. **In Supabase Dashboard > Table Editor:**
   - Verify `user_profiles` table exists with columns:
     - `id` (UUID, Primary Key)
     - `email` (Text, Unique)
     - `first_name`, `last_name` (Text)
     - `phone_number`, `country` (Text)
     - `age` (Integer, Optional)
     - `business`, `role` (Text, Optional)
     - `credits` (Integer, Default: 100)
     - `created_at`, `updated_at` (Timestamp)

   - Verify `credits_transactions` table exists with columns:
     - `id` (UUID, Primary Key)
     - `user_id` (UUID, Foreign Key)
     - `amount` (Integer)
     - `description` (Text)
     - `transaction_type` (Text)
     - `created_at` (Timestamp)

2. **Check Row Level Security (RLS):**
   - Go to "Authentication" > "Policies"
   - Verify policies exist for both tables
   - Policies should allow users to access only their own data

3. **Test Functions:**
   - In SQL Editor, run:
   ```sql
   SELECT routine_name 
   FROM information_schema.routines 
   WHERE routine_schema = 'public' 
   AND routine_name IN ('handle_updated_at', 'handle_new_user', 'add_credits_transaction');
   ```
   - Should return all three functions

## Step 3: Test the Authentication System

### Start the Development Server

```bash
npm run dev
```

### Test User Registration

1. **Open the application** at `http://localhost:5173`
2. **Click "Sign Up"** to test registration
3. **Fill in the form:**
   - Step 1: Basic information (required)
   - Step 2: Additional information (optional)
4. **Check email** for verification link (if email confirmation is enabled)
5. **Verify in Supabase:**
   - Go to "Authentication" > "Users" to see the new user
   - Go to "Table Editor" > "user_profiles" to see the profile data

### Test User Sign In

1. **Use the credentials** from registration
2. **Verify successful login** and profile loading
3. **Test profile editing** functionality
4. **Test credits management** (add/use credits)

### Test Credits System

1. **In the user profile**, click "Manage" next to Credits
2. **Add credits** using the form
3. **Use credits** to test deduction
4. **Check transaction history**
5. **Verify in database:**
   - Check `credits_transactions` table for transaction records
   - Verify `user_profiles.credits` field updates correctly

## Step 4: Production Considerations

### Security Checklist

- ✅ Row Level Security (RLS) enabled
- ✅ Policies restrict access to user's own data
- ✅ Environment variables used for credentials
- ✅ No service role keys in frontend code

### Optional Configurations

1. **Email Confirmation:**
   - Go to "Authentication" > "Settings"
   - Enable "Confirm email" if desired

2. **Password Requirements:**
   - Set minimum password length
   - Configure password complexity rules

3. **Rate Limiting:**
   - Configure rate limits for auth endpoints

## Troubleshooting

### Common Issues

1. **"relation does not exist" error:**
   - Ensure schema was applied correctly
   - Check table names match exactly

2. **RLS policy errors:**
   - Verify user is authenticated
   - Check policy conditions

3. **Environment variable issues:**
   - Restart development server after changing `.env`
   - Verify variable names start with `VITE_`

4. **Credits not updating:**
   - Check `add_credits_transaction` function exists
   - Verify transaction type is valid

### Debug Commands

```sql
-- Check if tables exist
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';

-- Check RLS status
SELECT schemaname, tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';

-- View policies
SELECT * FROM pg_policies WHERE schemaname = 'public';

-- Check user profiles
SELECT * FROM user_profiles;

-- Check credit transactions
SELECT * FROM credits_transactions ORDER BY created_at DESC;
```

## Next Steps

1. **Apply the database schema** using the instructions above
2. **Test the complete authentication flow**
3. **Customize the UI** as needed
4. **Add additional features** like password reset, email verification
5. **Deploy to production** when ready

---

**Note:** The system is fully functional once the database schema is applied. All authentication components, stores, and UI elements are already implemented and ready to use.