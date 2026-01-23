# Render Deployment Instructions

## ⚠️ CRITICAL: Render Dashboard Configuration Required

**Your logs show Render is still running `npm run dev` instead of `npm start`.**

You MUST manually update Render dashboard settings:

### Step-by-Step Fix:

1. **Go to Render Dashboard**
   - Visit: https://dashboard.render.com
   - Click on your service: `toys-shop-rhv5`

2. **Navigate to Settings**
   - Click on "Settings" tab in the left sidebar

3. **Update Build & Start Commands** (CRITICAL!)
   
   Scroll down to "Build & Deploy" section:
   
   **Build Command:**
   ```
   npm install && npm run build
   ```
   
   **Start Command:** ⚠️ CHANGE THIS!
   ```
   npm start
   ```
   
   **CURRENT (WRONG):** `npm run dev` ❌
   **SHOULD BE:** `npm start` ✅

4. **Set Environment Variables**
   
   Scroll to "Environment Variables" section:
   
   - **Key:** `NODE_ENV`
   - **Value:** `production`
   
   - **Key:** `PORT`
   - **Value:** (Leave empty - Render auto-assigns)

5. **Save Changes**
   - Click "Save Changes" button at the bottom

6. **Redeploy**
   - Go to "Events" tab
   - Click "Manual Deploy" → "Deploy latest commit"

## Why This Fixes the Issue:

1. ✅ **Production Build**: `npm run build` creates optimized files (this is working!)
2. ❌ **Wrong Start Command**: Currently using `npm run dev` (development mode)
3. ✅ **Correct Start Command**: `npm start` uses `server.js` which:
   - Binds to `0.0.0.0` (required by Render)
   - Uses PORT environment variable
   - Runs production-optimized code

## Files Created:

- ✅ `server.js` - Custom server that binds correctly
- ✅ `render.yaml` - Configuration file (may not be detected)
- ✅ `Procfile` - Alternative configuration method

## After Updating:

Once you update the dashboard settings, Render will:
1. Build the app (already working ✅)
2. Start with `npm start` (will use server.js ✅)
3. Bind to `0.0.0.0` properly ✅
4. Your app will load at https://toys-shop-rhv5.onrender.com ✅

## Still Not Working?

If after updating dashboard settings it still doesn't work:
1. Check Render logs for errors
2. Verify `NODE_ENV=production` is set
3. Ensure PORT is not hardcoded (let Render assign it)

