# Deploying RiskLens to Vercel

## Build Status
✅ **Production Build Successful** - All TypeScript errors fixed. Ready to deploy!

Build output: 1.27 MB (342 KB gzipped)

## Prerequisites
- GitHub account with the repository
- Vercel account (sign up at https://vercel.com)

## Step-by-Step Deployment

### 1. Install Vercel CLI (Optional)
```bash
npm install -g vercel
```

### 2. Deploy via Vercel Dashboard (Recommended)

#### A. Go to Vercel
1. Visit https://vercel.com
2. Click "Sign Up" or "Login"
3. Choose "Continue with GitHub"

#### B. Import Project
1. Click "Add New..." → "Project"
2. Select "Import Git Repository"
3. Find and select `Cypher-0-shift/Vertex`
4. Click "Import"

#### C. Configure Project
**Framework Preset:** Vite
**Root Directory:** ./
**Build Command:** `npm run build`
**Output Directory:** `dist`

#### D. Add Environment Variables
Click "Environment Variables" and add:

```
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

**Note:** Since we're using mock mode, you can use placeholder values or leave Firebase vars empty.

#### E. Deploy
1. Click "Deploy"
2. Wait 2-3 minutes for build to complete
3. Your app will be live at `https://your-project.vercel.app`

### 3. Deploy via CLI (Alternative)

```bash
# Login to Vercel
vercel login

# Deploy
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? risklens (or your choice)
# - Directory? ./
# - Override settings? No

# Deploy to production
vercel --prod
```

### 4. Configure Custom Domain (Optional)

1. Go to your project in Vercel Dashboard
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Update DNS records as instructed

### 5. Environment Variables Management

To update environment variables:
1. Go to Project Settings → Environment Variables
2. Add/Edit variables
3. Redeploy for changes to take effect

### 6. Automatic Deployments

Vercel automatically deploys:
- **Production:** Every push to `main` branch
- **Preview:** Every pull request

### 7. Firebase Configuration (When Ready)

When you're ready to use real Firebase:
1. Complete Firebase setup (see FIREBASE_SETUP.md)
2. Add real Firebase credentials to Vercel environment variables
3. Update `MOCK_MODE = false` in:
   - `src/services/authService.ts`
   - `src/services/paymentService.ts`
4. Push changes to trigger redeployment

## Troubleshooting

### Build Fails
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify Node version compatibility

### Environment Variables Not Working
- Ensure variables start with `VITE_`
- Redeploy after adding variables
- Check variable names match exactly

### 404 on Routes
- Verify `vercel.json` is in root directory
- Check rewrites configuration

### Firebase Errors
- App works in mock mode by default
- Add real Firebase credentials when ready
- Update MOCK_MODE flags in services

## Post-Deployment Checklist

✅ App loads successfully
✅ Landing page displays correctly
✅ Demo mode works (Try Demo button)
✅ Authentication works (mock mode)
✅ Portfolio features functional
✅ Charts render properly
✅ Responsive on mobile

## Useful Commands

```bash
# View deployment logs
vercel logs

# List deployments
vercel ls

# Remove deployment
vercel rm [deployment-url]

# Open project in browser
vercel open
```

## Production URL

After deployment, your app will be available at:
- **Production:** `https://your-project.vercel.app`
- **Custom Domain:** `https://yourdomain.com` (if configured)

## Support

- Vercel Docs: https://vercel.com/docs
- Vercel Support: https://vercel.com/support
- GitHub Issues: https://github.com/Cypher-0-shift/Vertex/issues
