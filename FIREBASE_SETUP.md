# Firebase Setup Instructions

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name: `risklens` (or your preferred name)
4. Disable Google Analytics (optional)
5. Click "Create project"

## Step 2: Enable Authentication

1. In Firebase Console, go to **Authentication**
2. Click "Get started"
3. Enable **Email/Password** sign-in method
4. Enable **Google** sign-in method
   - Add your support email
   - Save

## Step 3: Create Firestore Database

1. In Firebase Console, go to **Firestore Database**
2. Click "Create database"
3. Select **Start in production mode**
4. Choose a location (closest to your users)
5. Click "Enable"

## Step 4: Set Firestore Security Rules

1. In Firestore Database, go to **Rules** tab
2. Copy the contents from `firestore.rules` file
3. Paste into the rules editor
4. Click "Publish"

## Step 5: Get Firebase Configuration

1. In Firebase Console, go to **Project Settings** (gear icon)
2. Scroll down to "Your apps"
3. Click the **Web** icon (`</>`)
4. Register app with nickname: `risklens-web`
5. Copy the `firebaseConfig` object values

## Step 6: Configure Environment Variables

1. Open `.env` file in project root
2. Replace the placeholder values with your Firebase config:

```env
VITE_FIREBASE_API_KEY=your_actual_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## Step 7: Restart Development Server

```bash
npm run dev
```

## Important Notes

- **Never commit `.env` file** to version control
- `.env.example` is provided as a template
- Each developer needs their own `.env` file
- For production, set environment variables in your hosting platform

## Testing Authentication

1. Go to `/signup` and create a test account
2. Check Firebase Console > Authentication to see the user
3. Go to Firestore Database to see user data
4. Try adding stocks to portfolio
5. Check Firestore > users > {userId} > portfolio collection

## Troubleshooting

### Invalid API Key Error
- Verify `.env` file exists in project root
- Check that all Firebase config values are correct
- Restart dev server after changing `.env`

### Permission Denied in Firestore
- Verify security rules are published
- Check that user is authenticated
- Ensure userId matches in rules

### Google Sign-In Not Working
- Add authorized domains in Firebase Console
- Go to Authentication > Settings > Authorized domains
- Add `localhost` for development
- Add your production domain

## Production Deployment

### Vercel / Netlify
Add environment variables in dashboard:
- Settings > Environment Variables
- Add all `VITE_FIREBASE_*` variables

### Custom Server
Set environment variables in your deployment config or `.env.production` file.
