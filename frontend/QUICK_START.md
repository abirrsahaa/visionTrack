# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Open Browser
Navigate to [http://localhost:3000](http://localhost:3000)

### 4. Sign In / Sign Up

#### Option A: Create New Account
1. Click **"Get Started"** on the landing page
2. Fill in the form:
   - **Name:** Your name (e.g., "John Doe")
   - **Email:** Any valid email (e.g., `demo@example.com`)
   - **Password:** At least 8 characters (e.g., `password123`)
   - **Timezone:** Select your timezone
3. Click **"Create account"**

#### Option B: Sign In
1. Navigate to `/login` or click **"Sign In"** on the landing page
2. Enter any credentials:
   - **Email:** Any valid email format (e.g., `test@example.com`)
   - **Password:** At least 8 characters (e.g., `password123`)
3. Click **"Sign in"**

### 5. Explore the App

Once signed in, you'll have access to:

- **Dashboard** (`/dashboard`) - View your vision board and progress
- **Domains** (`/domains`) - Create and manage life domains (Career, Health, Learning, etc.)
- **Journal** (`/journal`) - Write daily journal entries and earn pixels
- **Timeline** (`/timeline`) - View your weekly wraps and journey
- **Settings** (`/settings`) - Manage account preferences

## 📝 Mock Data Mode

The app is currently running in **mock data mode**, which means:

✅ **No backend required** - Everything works locally  
✅ **Any credentials accepted** - Email/password just needs valid format  
✅ **Sample data included** - Pre-populated domains, boards, etc.  
✅ **Full functionality** - All features work as if connected to a real backend  

### Example Credentials for Testing

```
Email: test@example.com
Password: password123
```

```
Email: demo@visionlife.app
Password: demo123456
```

```
Email: alice@example.com
Password: securepass123
```

**All of the above will work!** The only requirements are:
- Email must be a valid email format
- Password must be at least 8 characters

## 🎯 Next Steps

1. **Create Domains** - Add your life areas (Career, Health, Finance, etc.)
2. **Upload Images** - Add inspirational images for each domain
3. **Write Journal** - Start your daily journal entries
4. **View Progress** - See your vision board colorize over time

## 🔧 Troubleshooting

**Can't sign in?**
- Make sure email is a valid format (contains `@` and `.`)
- Password must be at least 8 characters
- Check browser console for any errors

**Mock data not working?**
- Ensure `NEXT_PUBLIC_ENV=development` in `.env.local`
- Make sure `NEXT_PUBLIC_API_BASE_URL` doesn't point to a real backend

**Need help?**
- Check the full README.md for detailed documentation
- Review `frotend.md` for API contracts and component specs