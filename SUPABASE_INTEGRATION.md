# Supabase Integration - File Structure

This document outlines the complete Supabase integration for your Next.js portfolio project.

## 📁 File Structure

```
portpolio/
├── lib/
│   ├── supabaseClient.js      # Reusable Supabase client (client & server)
│   └── auth.js                 # Authentication utilities (getServerUser, requireAuth)
│
├── pages/
│   ├── auth/
│   │   ├── login.js            # Login page with session persistence
│   │   └── signup.js           # Signup page
│   │
│   ├── admin/
│   │   └── messages.js         # Admin page to view all messages (protected)
│   │
│   ├── dashboard.js            # Protected dashboard page
│   │
│   └── api/
│       ├── auth/
│       │   └── logout.js       # Logout API route
│       │
│       └── messages/
│           ├── create.js       # Create message API (public)
│           └── list.js         # List messages API (protected)
│
├── components/
│   └── contactSection.js       # Updated to save to Supabase
│
├── .env.local                  # Environment variables (create this)
└── SUPABASE_SETUP.md           # Setup instructions
```

## 🔑 Key Files Explained

### 1. `lib/supabaseClient.js`
- **Client-side client**: `supabase` - Use in React components
- **Server-side client**: `createServerClient(context)` - Use in `getServerSideProps`
- **API client**: `getServerSupabaseClient(req, res)` - Use in API routes

### 2. `lib/auth.js`
- **`getServerUser(context)`**: Get authenticated user in `getServerSideProps`
- **`requireAuth(context)`**: Protect pages - redirects to login if not authenticated

### 3. Authentication Pages
- **`pages/auth/login.js`**: Login form with email/password
- **`pages/auth/signup.js`**: Signup form with validation

### 4. Protected Pages
- **`pages/dashboard.js`**: Protected dashboard (uses `requireAuth`)
- **`pages/admin/messages.js`**: Admin page to view messages (uses `requireAuth`)

### 5. API Routes
- **`pages/api/messages/create.js`**: Public endpoint to save messages
- **`pages/api/messages/list.js`**: Protected endpoint to fetch messages
- **`pages/api/auth/logout.js`**: Logout endpoint

## 🚀 Usage Examples

### Client-Side (React Components)
```javascript
import { supabase } from '@/lib/supabaseClient';

// Get current user
const { data: { user } } = await supabase.auth.getUser();

// Sign out
await supabase.auth.signOut();
```

### Server-Side (getServerSideProps)
```javascript
import { requireAuth } from '@/lib/auth';

export const getServerSideProps = async (context) => {
  const authResult = await requireAuth(context);
  return authResult; // Returns redirect or { props: { user } }
};
```

### API Routes
```javascript
import { getServerSupabaseClient } from '@/lib/supabaseClient';
import { getServerUser } from '@/lib/auth';

export default async function handler(req, res) {
  // Check auth
  const auth = await getServerUser({ req, res });
  if (!auth) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Use Supabase
  const supabase = getServerSupabaseClient(req, res);
  const { data, error } = await supabase.from('messages').select('*');
  
  return res.json({ data });
}
```

## 🔒 Security Features

1. **Row Level Security (RLS)**: Enabled on messages table
2. **Public Inserts**: Anyone can submit messages via contact form
3. **Authenticated Reads**: Only logged-in users can view messages
4. **Environment Variables**: Sensitive keys stored in `.env.local`
5. **Server-Side Protection**: Routes protected using `getServerSideProps`

## 📊 Database Schema

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

### RLS Policies
- **INSERT**: Public (anyone can insert)
- **SELECT**: Authenticated users only
- **DELETE**: Authenticated users only (optional)

## 🎯 Features Implemented

✅ Authentication (signup, login, logout)  
✅ Session persistence  
✅ Protected dashboard page  
✅ Middleware-like route protection  
✅ Contact form saves to Supabase  
✅ Admin page to view messages  
✅ Error handling throughout  
✅ Modern, clean, production-ready code  
✅ Modular structure  

## 📝 Next Steps

1. **Set up Supabase project** (see `SUPABASE_SETUP.md`)
2. **Create `.env.local`** with your Supabase credentials
3. **Create the messages table** in Supabase
4. **Set up RLS policies** (see `SUPABASE_SETUP.md`)
5. **Test the integration**:
   - Sign up at `/auth/signup`
   - Log in at `/auth/login`
   - Access dashboard at `/dashboard`
   - Submit contact form at `/contact`
   - View messages at `/admin/messages`

## 🔧 Customization

### Add More Tables
1. Create table in Supabase dashboard
2. Add RLS policies
3. Create API routes in `pages/api/`
4. Use in components with `supabase.from('table_name')`

### Add More Protected Routes
```javascript
// In any page
import { requireAuth } from '@/lib/auth';

export const getServerSideProps = async (context) => {
  return await requireAuth(context);
};
```

### Customize Authentication
- Modify `pages/auth/login.js` and `pages/auth/signup.js`
- Add OAuth providers in Supabase dashboard
- Update `lib/auth.js` for custom auth logic

## 🐛 Troubleshooting

See `SUPABASE_SETUP.md` for detailed troubleshooting guide.

## 📚 Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Authentication](https://nextjs.org/docs/authentication)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)

