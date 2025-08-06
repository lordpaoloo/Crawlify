# Crawlify Authentication System Setup

This guide will help you set up the authentication system with Supabase for your Crawlify application.

## Prerequisites

1. A Supabase account (sign up at [supabase.com](https://supabase.com))
2. Node.js and npm installed
3. The Crawlify project cloned and dependencies installed

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Choose your organization
4. Enter a project name (e.g., "crawlify-auth")
5. Enter a database password (save this securely)
6. Select a region close to your users
7. Click "Create new project"

## Step 2: Set Up the Database Schema

1. In your Supabase dashboard, go to the "SQL Editor"
2. Copy the contents of `supabase-schema.sql` from your project root
3. Paste it into the SQL Editor
4. Click "Run" to execute the schema

This will create:
- `user_profiles` table for storing user information
- `credits_transactions` table for tracking credit usage
- Row Level Security (RLS) policies
- Necessary functions and triggers

## Step 3: Configure Your Application

1. In your Supabase dashboard, go to "Settings" > "API"
2. Copy your "Project URL" and "anon public" key
3. Open `src/lib/supabase.ts` in your project
4. Replace the placeholder values:

```typescript
const supabaseUrl = 'YOUR_SUPABASE_URL' // Replace with your Project URL
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY' // Replace with your anon public key
```

## Step 4: Configure Authentication Settings (Optional)

1. In Supabase dashboard, go to "Authentication" > "Settings"
2. Configure your site URL (e.g., `http://localhost:5173` for development)
3. Set up email templates if desired
4. Configure any additional auth providers (Google, GitHub, etc.)

## Step 5: Test the Authentication System

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Open your browser and navigate to your app
3. You should see the authentication forms
4. Try creating a new account:
   - Fill in the basic information (Step 1)
   - Complete the additional information (Step 2)
   - You should be redirected to the main app with a user profile

## Features Included

### Multi-Step Registration
- **Step 1**: Basic info (name, email, phone, country, password)
- **Step 2**: Additional info (age, company, role)

### User Profile Management
- View and edit profile information
- Credits system with balance display
- Secure authentication with Supabase

### Credits System
- Each user starts with 100 credits
- Credits are displayed in the user interface
- Transaction history tracking
- Functions for adding/subtracting credits

### Security Features
- Row Level Security (RLS) enabled
- Users can only access their own data
- Secure password handling
- JWT-based authentication

## Database Schema Overview

### user_profiles table
- `id` (UUID, primary key, references auth.users)
- `email` (TEXT, unique)
- `first_name` (TEXT)
- `last_name` (TEXT)
- `phone_number` (TEXT)
- `age` (INTEGER, optional)
- `country` (TEXT)
- `business` (TEXT, optional)
- `role` (TEXT, optional)
- `credits` (INTEGER, default 100)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### credits_transactions table
- `id` (UUID, primary key)
- `user_id` (UUID, foreign key)
- `amount` (INTEGER, positive/negative)
- `description` (TEXT)
- `transaction_type` (TEXT: purchase, usage, bonus, refund)
- `created_at` (TIMESTAMP)

## Usage in Your Application

### Using the Auth Store

```typescript
import { useAuthStore } from './store/auth-store'

function MyComponent() {
  const { user, profile, signOut, updateCredits } = useAuthStore()
  
  // Check if user is authenticated
  if (!user) {
    return <div>Please sign in</div>
  }
  
  // Use credits
  const handleUseCredits = async () => {
    const result = await updateCredits(-10) // Subtract 10 credits
    if (result.success) {
      console.log('Credits updated successfully')
    }
  }
  
  return (
    <div>
      <h1>Welcome, {profile?.first_name}!</h1>
      <p>Credits: {profile?.credits}</p>
      <button onClick={handleUseCredits}>Use 10 Credits</button>
      <button onClick={signOut}>Sign Out</button>
    </div>
  )
}
```

### Adding Credits Transactions

You can use the `add_credits_transaction` function in your Supabase database:

```sql
SELECT add_credits_transaction(
  'user-uuid-here',
  50, -- amount (positive to add, negative to subtract)
  'Purchased credits package',
  'purchase'
);
```

## Troubleshooting

### Common Issues

1. **"Invalid API key" error**
   - Make sure you've updated the Supabase URL and anon key in `src/lib/supabase.ts`

2. **"Row Level Security" errors**
   - Ensure the RLS policies were created correctly by running the schema SQL

3. **Profile not loading**
   - Check that the user completed both steps of registration
   - Verify the `user_profiles` table has the user's data

4. **Credits not updating**
   - Use the `add_credits_transaction` function instead of directly updating credits
   - Check the `credits_transactions` table for transaction history

### Development Tips

1. Use Supabase's built-in auth UI for testing
2. Check the Supabase logs for detailed error messages
3. Use the Supabase table editor to view and modify data during development
4. Enable email confirmations in production

## Security Considerations

1. **Never expose your service role key** - only use the anon public key in your frontend
2. **Always use RLS policies** - they're already set up in the schema
3. **Validate user input** - the forms include basic validation, but add server-side validation as needed
4. **Use HTTPS in production** - configure your site URL accordingly in Supabase

## Next Steps

1. Customize the authentication forms to match your brand
2. Add email verification for new accounts
3. Implement password reset functionality
4. Add social authentication providers
5. Set up credit purchase functionality
6. Add admin panel for user management

For more information, refer to the [Supabase documentation](https://supabase.com/docs) and the [Supabase Auth documentation](https://supabase.com/docs/guides/auth).