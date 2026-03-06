# Supabase Setup Guide

This guide will help you set up Supabase for your Next.js portfolio project.

## 1. Create a Supabase Project

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in your project details:
   - Name: Your project name
   - Database Password: Choose a strong password (save it!)
   - Region: Choose the closest region
5. Click "Create new project"

## 2. Get Your API Keys

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (this is your `NEXT_PUBLIC_SUPABASE_URL`)
   - **anon/public key** (this is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`)

## 3. Configure Environment Variables

1. Create a `.env.local` file in the root of your project (if it doesn't exist)
2. Add the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

**Important:** Never commit `.env.local` to version control. It should already be in `.gitignore`.

## 4. Create the Messages Table

1. In your Supabase dashboard, go to **Table Editor**
2. Click **"New Table"**
3. Name it: `messages`
4. Add the following columns:

| Column Name | Type | Default Value | Nullable | Primary Key |
|------------|------|---------------|----------|-------------|
| id | uuid | `gen_random_uuid()` | No | Yes |
| name | text | - | No | No |
| email | text | - | No | No |
| message | text | - | No | No |
| created_at | timestamp | `now()` | No | No |

5. Click **"Save"**

## 5. Set Up Row Level Security (RLS)

### For Messages Table (Public Insert, Authenticated Read)

1. Go to **Authentication** → **Policies** in your Supabase dashboard
2. Select the `messages` table
3. Click **"New Policy"**

#### Policy 1: Allow Public Inserts
- Policy Name: `Allow public inserts`
- Allowed Operation: `INSERT`
- Policy Definition:
```sql
true
```

#### Policy 2: Allow Authenticated Reads
- Policy Name: `Allow authenticated reads`
- Allowed Operation: `SELECT`
- Policy Definition:
```sql
auth.role() = 'authenticated'
```

#### Policy 3: Allow Authenticated Deletes (Optional)
- Policy Name: `Allow authenticated deletes`
- Allowed Operation: `DELETE`
- Policy Definition:
```sql
auth.role() = 'authenticated'
```

**Alternative: Using SQL Editor**

You can also run this SQL in the **SQL Editor**:

```sql
-- Enable RLS
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Allow public inserts (for contact form)
CREATE POLICY "Allow public inserts" ON messages
  FOR INSERT
  WITH CHECK (true);

-- Allow authenticated users to read all messages
CREATE POLICY "Allow authenticated reads" ON messages
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Allow authenticated users to delete messages (optional)
CREATE POLICY "Allow authenticated deletes" ON messages
  FOR DELETE
  USING (auth.role() = 'authenticated');
```

## 6. Enable Email Authentication

1. Go to **Authentication** → **Providers** in your Supabase dashboard
2. Make sure **Email** is enabled
3. Configure email templates if needed (optional)

## 7. Test Your Setup

1. Start your Next.js development server:
   ```bash
   npm run dev
   ```

2. Test the following:
   - Visit `/auth/signup` and create an account
   - Visit `/auth/login` and log in
   - Visit `/dashboard` (should be protected)
   - Visit `/contact` and submit a message
   - Visit `/admin/messages` to view messages (requires authentication)

## 8. Troubleshooting

### "Missing Supabase environment variables" error
- Make sure `.env.local` exists in the project root
- Verify the variable names are exactly: `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Restart your development server after adding environment variables

### "Failed to save message" error
- Check that the `messages` table exists
- Verify RLS policies are set up correctly
- Check the Supabase dashboard logs for errors

### Authentication not working
- Verify email authentication is enabled in Supabase
- Check that you've verified your email (if email confirmation is required)
- Check browser console for errors

## 9. Security Best Practices

✅ **DO:**
- Use environment variables for all sensitive data
- Enable RLS on all tables
- Use the `anon` key (not the `service_role` key) in client-side code
- Regularly rotate your API keys

❌ **DON'T:**
- Commit `.env.local` to version control
- Expose the `service_role` key in client-side code
- Disable RLS without a good reason
- Share your API keys publicly

## 10. Database Schema Reference

### Messages Table
```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Next Steps

- Customize the authentication flow
- Add more tables as needed
- Set up email notifications
- Configure custom domains
- Set up database backups

For more information, visit the [Supabase Documentation](https://supabase.com/docs).

