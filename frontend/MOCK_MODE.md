# Mock Data Mode - No Backend Required! 🎉

The frontend is configured to use **mock data by default**. This means you can run and test the entire application without a backend!

## ✅ How It Works

Mock data mode is **ENABLED by default**. The application will:
- Use fake/simulated data for all API calls
- Work completely offline
- Allow you to test all features without a backend

## 🔧 Configuration

### Default Behavior (Mock Mode ON)
If you don't have a `.env.local` file, or if it doesn't set `NEXT_PUBLIC_USE_MOCK_DATA=false`, the app will automatically use mock data.

### To Use Real Backend (Mock Mode OFF)
Only if you have a backend running, create `.env.local`:
```env
NEXT_PUBLIC_USE_MOCK_DATA=false
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api
```

### Current Status
Check your browser console when the app loads - you should see:
```
🔧 Mock Data Mode: ENABLED (no backend required)
```

## 📝 Sign In / Sign Up with Mock Mode

**Any credentials work!** Just meet the format requirements:

### Example Credentials:
```
Email: test@example.com
Password: password123
```

Or:
```
Email: demo@visionlife.app
Password: demo123456
```

**Requirements:**
- Email must be valid format (contains `@` and `.`)
- Password must be at least 8 characters

That's it! No backend validation needed.

## 🎯 What Works in Mock Mode

✅ **Authentication** - Login/Signup (any credentials)  
✅ **Domain Management** - Create, edit, delete domains  
✅ **Image Upload** - Simulated (uses file URLs)  
✅ **Dashboard** - Shows mock vision board  
✅ **Journal Entries** - Submit and see pixel animations  
✅ **Timeline** - View weekly wraps (with mock data)  
✅ **Settings** - Update preferences  

## 🔍 Debugging

If you see a "Network Error" when trying to sign in:

1. **Check console** - You should see "✅ Using mock data for login"
2. **If you see "⚠️ Attempting real API call"** - Mock mode is disabled
3. **Check `.env.local`** - Make sure `NEXT_PUBLIC_USE_MOCK_DATA` is not set to `"false"`

### Quick Fix:
Delete or rename `.env.local` and restart the dev server:
```bash
# Remove .env.local if it exists
rm .env.local

# Restart dev server
npm run dev
```

## 🚀 Ready to Use!

You can now:
1. Start the dev server: `npm run dev`
2. Open http://localhost:3000
3. Sign in with any credentials (see examples above)
4. Start using the app!

**No backend required!** 🎉